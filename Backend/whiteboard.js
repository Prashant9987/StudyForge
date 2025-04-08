document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("whiteboard");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    // Tool settings
    let drawing = false;
    let currentTool = "pen";
    let strokeColor = "#000000";
    let strokeWidth = 2;

    // Tool buttons
    const toolButtons = document.querySelectorAll(".tool-btn");
    const colorPicker = document.getElementById("colorPicker");
    const strokeWidthInput = document.getElementById("strokeWidth");

    // Event listeners for tools
    toolButtons.forEach(button => {
        button.addEventListener("click", () => {
            toolButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentTool = button.dataset.tool || button.dataset.action;
        });
    });

    // Update color and stroke width
    colorPicker.addEventListener("input", (e) => {
        strokeColor = e.target.value;
    });

    strokeWidthInput.addEventListener("input", (e) => {
        strokeWidth = e.target.value;
    });

    // Tool-specific logic
    // Drawing logic
    canvas.addEventListener("mousedown", (e) => {
        if (currentTool === "pen" || currentTool === "highlighter") {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        } else if (currentTool === "eraser") {
            drawing = true;
            ctx.clearRect(e.offsetX, e.offsetY, strokeWidth, strokeWidth);
        } else if (currentTool === "text") {
            const text = prompt("Enter text:");
            if (text) {
                ctx.font = `${strokeWidth * 5}px Poppins`;
                ctx.fillStyle = strokeColor;
                ctx.fillText(text, e.offsetX, e.offsetY);
            }
        } else if (currentTool === "shapes") {
            const shape = prompt("Enter shape (rectangle/circle):");
            if (shape === "rectangle") {
                const width = parseInt(prompt("Enter width:"), 10);
                const height = parseInt(prompt("Enter height:"), 10);
                ctx.fillStyle = strokeColor;
                ctx.fillRect(e.offsetX, e.offsetY, width, height);
            } else if (shape === "circle") {
                const radius = parseInt(prompt("Enter radius:"), 10);
                ctx.beginPath();
                ctx.arc(e.offsetX, e.offsetY, radius, 0, Math.PI * 2);
                ctx.fillStyle = strokeColor;
                ctx.fill();
            }
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        if (drawing && currentTool === "eraser") {
            ctx.clearRect(e.offsetX, e.offsetY, strokeWidth, strokeWidth);
        } else if (drawing && (currentTool === "pen" || currentTool === "highlighter")) {
        if (drawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = currentTool === "highlighter" ? `${strokeColor}80` : strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.lineCap = "round";
            ctx.stroke();
        }
    });

    canvas.addEventListener("mouseup", () => {
        drawing = false;
        ctx.closePath();
    });

    // Clear canvas
    document.querySelector("[data-action='clear']").addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Undo/Redo functionality (basic implementation)
    const undoStack = [];
    const redoStack = [];

    canvas.addEventListener("mouseup", () => {
        if (currentTool === "pen" || currentTool === "highlighter") {
            undoStack.push(canvas.toDataURL());
            redoStack.length = 0; // Clear redo stack
        }
    });

    document.querySelector("[data-action='undo']").addEventListener("click", () => {
        if (undoStack.length > 0) {
            redoStack.push(canvas.toDataURL());
            const img = new Image();
            img.src = undoStack.pop();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    });

    document.querySelector("[data-action='redo']").addEventListener("click", () => {
        if (redoStack.length > 0) {
            undoStack.push(canvas.toDataURL());
            const img = new Image();
            img.src = redoStack.pop();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    });

    // Resize canvas on window resize
    window.addEventListener("resize", () => {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        ctx.putImageData(imgData, 0, 0);
    });
});
