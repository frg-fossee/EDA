# Task 3.30: Font Size Dropdown List

## Problem Approach
The goal was to implement a font size dropdown in the code editor for dynamic font size adjustments, ensuring a seamless user experience.

## Steps Taken
1. Identified reusable components in `code-editor.components.html` for integration of the dropdown.
2. Modified the HTML to add a dropdown menu using Angular's two-way binding with the `[(ngModel)]` directive.
3. Defined a `fontSizes` array in `code-editor.components.ts` to populate the dropdown dynamically.
4. Implemented a default value (`editorFontSize = 16`) to maintain consistent initial behavior.
5. Created the `updateFontSize()` method to update the editor's font size in real-time when the dropdown value changes.

## New Tools/Technologies Used
- Angular two-way binding (`[(ngModel)]`).

## Major File Changes
1. **`code-editor.components.html`:**
   - Added a dropdown menu for font size selection.
   - Enabled two-way binding with `[(ngModel)]` for the `editorFontSize` variable.
   - Improved tooltip integration with `matTooltip`.
2. **`code-editor.components.ts`:**
   - Introduced a `fontSizes` array to store font size options.
   - Initialized a default font size (`editorFontSize = 16`).
   - Defined the `updateFontSize()` method to reflect font size changes dynamically in the editor options.


# Task 3.27: No Code Written Popup

## Overview
This task involves implementing a feature that checks if any `.ino` code is written before starting the simulation. If no code is present, a popup message is displayed, and no backend calls are made.

## Steps taken
1. **Code Check in Simulator**:
   - Adapted the logic previously used in the workspace.ts file to validate code presence.
   - Added this logic in the `simulator.component.ts` file to check if any `.ino` code exists in the editor.
2. **Popup Message**:
   - Created a new popup component to alert the user: *"No code is written. Please write code before simulating."*
   - This new popup component was designed with reusability in mind, allowing it to be used in other scenarios across the application.

## Major File Changes

#### `simulator.component.ts`
1. **Popup Integration**:
   - Added `@ViewChild('popup') popup!: PopupComponent;` to reference the popup component.
   - Implemented the `popupMessage()` function to display the popup with a custom message.

2. **Code Check Logic**:
   - Created the `checkCodeWritten()` function to iterate through all Arduino devices and check if `.ino` code exists. If any device lacks code, it returns `false`.

3. **Start Simulation Process**:
   - Updated the `StartSimulation()` method:
     - Called `checkCodeWritten()` to validate code presence.
     - If no code is written, displayed a popup message via `popupMessage()` and re-enabled the "Start Simulation" button.


