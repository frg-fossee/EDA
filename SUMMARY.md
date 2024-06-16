SUMMARY.md

# Task 3

#Ability to resize individual components with respect to breadboard

## Steps to Implement Component Resizing

### 1. HTML Structure

Define the layout of the breadboard and components in the HTML file.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resizable Components</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="breadboard">
        <div class="component" id="component1">Component 1</div>
        <div class="component" id="component2">Component 2</div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### 2. CSS for Resizable Components

Use CSS to style the breadboard and components, making them resizable.

```css
/* styles.css */

#breadboard {
    position: relative;
    width: 600px;
    height: 400px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
}

.component {
    position: absolute;
    padding: 20px;
    border: 1px solid #000;
    background-color: #fff;
    resize: both; /* Allows resizing both horizontally and vertically */
    overflow: auto; /* Needed for the resize handle to be visible */
    box-sizing: border-box;
    border-radius: 4px;
    padding: 10px;
}

.component:after {
    content: " ";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    background: url('resize-handle.png') no-repeat;
    cursor: se-resize;
}
```

### 3. JavaScript for Handling Resizing

Use JavaScript to manage the resizing events and update the size of the components.

```javascript
// script.js

document.addEventListener('DOMContentLoaded', (event) => {
    const components = document.querySelectorAll('.component');

    components.forEach(component => {
        component.addEventListener('mousedown', initResize);
    });

    function initResize(e) {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    }

    function resize(e) {
        const component = e.target;

        // Calculate the new width and height
        let newWidth = e.clientX - component.offsetLeft;
        let newHeight = e.clientY - component.offsetTop;

        // Ensure the component does not exceed the breadboard boundaries
        const breadboard = document.getElementById('breadboard');
        const maxWidth = breadboard.clientWidth - component.offsetLeft;
        const maxHeight = breadboard.clientHeight - component.offsetTop;

        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, maxHeight);

        component.style.width = newWidth + 'px';
        component.style.height = newHeight + 'px';
    }

    function stopResize() {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResize);
    }
});
```

### Additional Considerations

#### Save and Load Component States

To persist the resized state of the components, save their dimensions when saving the circuit and reload these dimensions when loading the circuit.

```javascript
// Save the current state of components
function saveCircuit() {
    const components = document.querySelectorAll('.component');
    const componentStates = [];

    components.forEach(component => {
        componentStates.push({
            id: component.id,
            width: component.style.width,
            height: component.style.height,
            left: component.style.left,
            top: component.style.top
        });
    });

    // Save the component states (this example uses local storage)
    localStorage.setItem('componentStates', JSON.stringify(componentStates));

    isCircuitSaved = true;
}

// Load the saved state of components
function loadCircuit() {
    const componentStates = JSON.parse(localStorage.getItem('componentStates'));

    if (componentStates) {
        componentStates.forEach(state => {
            const component = document.getElementById(state.id);
            component.style.width = state.width;
            component.style.height = state.height;
            component.style.left = state.left;
            component.style.top = state.top;
        });
    }
}
```

#### Cross-browser Compatibility

Ensure the implementation works across different browsers by testing thoroughly. Some browsers might handle CSS properties and JavaScript events slightly differently.

#### Enhancing User Experience

Add visual cues, such as resize handles, to indicate that the components are resizable.

```css
/* styles.css */

.component:after {
    content: " ";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    background: url('resize-handle.png') no-repeat;
    cursor: se-resize;
}
```

---

