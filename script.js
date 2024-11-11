document.getElementById("automataForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Clear previous error messages
    document.getElementById("errorMessage").innerText = "";

    // Get input values
    const states = document.getElementById("states").value.split(",").map(s => s.trim());
    const alphabet = document.getElementById("alphabet").value.split(",").map(a => a.trim());
    const automataType = document.getElementById("automataType").value;

    // Validate input
    if (states.length === 0 || alphabet.length === 0 || states.some(s => s === "") || alphabet.some(a => a === "")) {
        document.getElementById("errorMessage").innerText = "Please enter valid states and alphabet.";
        return;
    }

    // Generate transition table based on automata type
    if (automataType === "dfa") {
        generateTransitionTable(states, alphabet);
    } else {
        generateNfaTransitionTable(states, alphabet);
    }
});

// Reset button functionality
document.getElementById("resetButton").addEventListener("click", function () {
    document.getElementById("automataForm").reset();
    document.getElementById("transitionTable").innerHTML = ""; // Clear the table
    const canvas = document.getElementById("transitionDiagram");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    document.getElementById("errorMessage").innerText = ""; // Clear error message
});

// Generate diagram button functionality
document.getElementById("generateDiagramButton").addEventListener("click", function () {
    const table = document.querySelector("table");
    
    // Check if the table exists (in case it's not generated yet)
    if (!table) {
        document.getElementById("errorMessage").innerText = "Please generate the transition table first.";
        return;
    }

    // Check if all cells in the transition table are filled
    let isComplete = true;
    for (let i = 1; i < table.rows.length; i++) { // Skip the header row
        const rowCells = table.rows[i].cells;
        
        for (let j = 1; j < rowCells.length - 1; j++) { // Skip the state and action cells
            const input = rowCells[j].querySelector("input");
            if (input && input.value.trim() === "") {
                isComplete = false;
                break;
            }
        }
        
        if (!isComplete) break;
    }

    // Show error if the table has empty fields, otherwise generate the diagram
    if (!isComplete) {
        document.getElementById("errorMessage").innerText = "Please fill all fields in the transition table before generating the diagram.";
        return;
    } else {
        document.getElementById("errorMessage").innerText = ""; // Clear error message
        const states = [];
        const alphabet = [];

        // Get states from the table
        for (let i = 1; i < table.rows.length; i++) { // Skip header row
            states.push(table.rows[i].cells[0].innerText); // Get current state
        }

        // Get alphabet from the form input
        const alphabetInput = document.getElementById("alphabet").value.split(",").map(a => a.trim());
        alphabet.push(...alphabetInput);

        // Draw the transition diagram
        drawTransitionDiagram(states, alphabet);
    }
});


function generateTransitionTable(states, alphabet) {
    const tableSection = document.getElementById("transitionTable");
    tableSection.innerHTML = ""; // Clear existing table

    const table = document.createElement("table");

    // Create table headers
    const headerRow = document.createElement("tr");
    const stateHeader = document.createElement("th");
    stateHeader.innerText = "State";
    headerRow.appendChild(stateHeader);

    alphabet.forEach(symbol => {
        const th = document.createElement("th");
        th.innerText = symbol;
        headerRow.appendChild(th);
    });

    // Add a header for removing states
    const removeHeader = document.createElement("th");
    removeHeader.innerText = "Action";
    headerRow.appendChild(removeHeader);

    table.appendChild(headerRow);

    // Create table rows for states
    states.forEach((state, index) => {
        const row = document.createElement("tr");
        const stateCell = document.createElement("td");

        if (index !== 0) { // Only add checkbox for non-initial states
            const acceptingCheckbox = document.createElement("input");
            acceptingCheckbox.type = "checkbox";
            acceptingCheckbox.id = `accepting-${state}`;
            acceptingCheckbox.className = "accepting-state";

            const stateLabel = document.createElement("label");
            stateLabel.htmlFor = `accepting-${state}`;
            stateLabel.innerText = state;

            stateCell.appendChild(acceptingCheckbox);
            stateCell.appendChild(stateLabel);
        } else {
            stateCell.innerText = state; // Display initial state without checkbox
        }

        row.appendChild(stateCell);

        alphabet.forEach(() => {
            const inputCell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Next state";
            inputCell.appendChild(input);
            row.appendChild(inputCell);
        });

        // Add a blank cell for initial state and a remove button for other states
        const actionCell = document.createElement("td");
        if (index !== 0) {
            const removeButton = document.createElement("button");
            removeButton.innerText = "Remove";
            removeButton.addEventListener("click", function () {
                row.remove();
            });
            actionCell.appendChild(removeButton);
        }
        row.appendChild(actionCell);

        table.appendChild(row);
    });

    tableSection.appendChild(table);

    // Show the final states checkbox after the table is generated
    document.getElementById("finalStatesCheckboxLabel").style.display = "block";
}

function generateNfaTransitionTable(states, alphabet) {
    const tableSection = document.getElementById("transitionTable");
    tableSection.innerHTML = ""; // Clear existing table

    const table = document.createElement("table");

    // Create table headers
    const headerRow = document.createElement("tr");
    const stateHeader = document.createElement("th");
    stateHeader.innerText = "State";
    headerRow.appendChild(stateHeader);

    alphabet.forEach(symbol => {
        const th = document.createElement("th");
        th.innerText = symbol;
        headerRow.appendChild(th);
    });

    const removeHeader = document.createElement("th");
    removeHeader.innerText = "Action";
    headerRow.appendChild(removeHeader);

    table.appendChild(headerRow);

    // Create table rows for states
    states.forEach((state, index) => {
        const row = document.createElement("tr");
        const stateCell = document.createElement("td");

        if (index !== 0) { // Only add checkbox for non-initial states
            const acceptingCheckbox = document.createElement("input");
            acceptingCheckbox.type = "checkbox";
            acceptingCheckbox.id = `accepting-${state}`;
            acceptingCheckbox.className = "accepting-state";

            const stateLabel = document.createElement("label");
            stateLabel.htmlFor = `accepting-${state}`;
            stateLabel.innerText = state;

            stateCell.appendChild(acceptingCheckbox);
            stateCell.appendChild(stateLabel);
        } else {
            stateCell.innerText = state; // Display initial state without checkbox
        }

        row.appendChild(stateCell);

        alphabet.forEach(() => {
            const inputCell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Next state(s) (comma separated)";
            inputCell.appendChild(input);
            row.appendChild(inputCell);
        });

        // Add a blank cell for initial state and a remove button for other states
        const actionCell = document.createElement("td");
        if (index !== 0) {
            const removeButton = document.createElement("button");
            removeButton.innerText = "Remove";
            removeButton.addEventListener("click", function () {
                row.remove();
            });
            actionCell.appendChild(removeButton);
        }
        row.appendChild(actionCell);

        table.appendChild(row);
    });

    tableSection.appendChild(table);

    // Show the final states checkbox after the table is generated
    document.getElementById("finalStatesCheckboxLabel").style.display = "block";
}


function drawTransitionDiagram(states, alphabet) {
    const canvas = document.getElementById("transitionDiagram");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 800;
    canvas.height = 600;

    const radius = 30;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const angleStep = (2 * Math.PI) / states.length;
    const circleDistance = 200;
    const statePositions = {};

    states.forEach((state, index) => {
        const angle = index * angleStep;
        const x = centerX + circleDistance * Math.cos(angle);
        const y = centerY + circleDistance * Math.sin(angle);
        statePositions[state] = { x, y };

        const acceptingCheckbox = document.getElementById(`accepting-${state}`);
        const isAccepting = acceptingCheckbox ? acceptingCheckbox.checked : false;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);

        // Set colors based on state type
        if (index === 0) {
            ctx.fillStyle = "yellow"; // Initial state
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.fillStyle = isAccepting ? "lightgreen" : "lightblue";
            ctx.fill();
            ctx.stroke();

            if (isAccepting) {
                ctx.beginPath();
                ctx.arc(x, y, radius + 5, 0, 2 * Math.PI); // Outer circle for final state
                ctx.strokeStyle = "green";
                ctx.stroke();
            }
        }

        ctx.fillStyle = "black";
        ctx.fillText(state, x - radius / 2, y + 5);
    });

    // (Keep the rest of the transition drawing logic the same)

    // Draw transitions based on the input from the table
    const table = document.querySelector("table");
    // Inside the function where transitions are drawn
    for (let i = 1; i < table.rows.length; i++) { // Skip header row
    const state = table.rows[i].cells[0].innerText; // Current state
    const rowCells = table.rows[i].cells;

    for (let j = 1; j < rowCells.length; j++) { // Skip state cell
        const input = rowCells[j].querySelector("input");
        const label = alphabet[j - 1]; // Use the alphabet symbol as the label

        if (input && input.value) {
            const nextStates = input.value.split(",").map(s => s.trim());
            const fromPos = statePositions[state];

            nextStates.forEach(nextState => {
                const toPos = statePositions[nextState];

                // Draw arrow from current state to next state with the alphabet label
                if (toPos) {
                    drawArrow(ctx, fromPos.x, fromPos.y, toPos.x, toPos.y, label);
                    }
                });
            }
        }
    }

}


// Function to draw arrows between states with labels
function drawArrow(ctx, fromX, fromY, toX, toY, label) {
    const headLength = 10; // Length of the arrowhead

    if (fromX === toX && fromY === toY) {
        // Self-loop case
        const loopRadius = 27; // Radius for the self-loop arc
        const arcX = fromX + loopRadius; // Adjust arc center for self-loop
        const arcY = fromY - loopRadius;

        // Draw the arc for the self-loop
        ctx.beginPath();
        ctx.arc(arcX, arcY, loopRadius, 1.1 * Math.PI, 2.4 * Math.PI); // Adjust angle for arc start and end
        ctx.stroke();

        // Calculate the arrowhead position at the end of the arc
        const arrowAngle = 1.1 * Math.PI; // Angle at end of arc
        const arrowX = arcX + loopRadius * Math.cos(arrowAngle);
        const arrowY = arcY + loopRadius * Math.sin(arrowAngle);

        // Draw arrowhead at the end of the loop arc
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
            arrowX - headLength * Math.cos(arrowAngle - Math.PI / 6),
            arrowY - headLength * Math.sin(arrowAngle - Math.PI / 6)
        );
        ctx.lineTo(
            arrowX - headLength * Math.cos(arrowAngle + Math.PI / 6),
            arrowY - headLength * Math.sin(arrowAngle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

        // Label the self-loop
        ctx.fillText(label, arcX + loopRadius, arcY - loopRadius / 2);
    } else {
        // Draw arrow for regular transitions
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        // Arrowhead at end of the line
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

        // Label for regular transitions
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        ctx.fillText(label, midX, midY);
    }
}



// Export diagram button functionality
document.getElementById("exportDiagramButton").addEventListener("click", function () {
    const canvas = document.getElementById("transitionDiagram");
    const dataURL = canvas.toDataURL("image/png");

    // Create a temporary anchor element for downloading
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "transition_diagram.png"; // Name of the downloaded file
    link.click();
});


