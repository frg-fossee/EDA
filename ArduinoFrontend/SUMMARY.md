##TASK3.30 font size dropdown list
Change two files: code-editor.components.html and code-editor.components.ts

For html file, I found some code parts that can be reuse so I use them and modified them 
- Added [(ngModel)] to the <select> element for two-way binding. This allowed the selected font size to automatically update the variable editorFontSize.
- Changed the options in the dropdown to display font sizes (fontSizes array).
- Replaced the old #chooseArduinoController reference with [(ngModel)] for better integration with Angular.
      <div class="form-group mt-2" matTooltip="Choose font size" style="max-height: 30px; box-shadow: whitesmoke;">
        <select id="fontSizeSelector" class="form-control form-control-sm" [(ngModel)]="editorFontSize" (change)="updateFontSize()" >
          <option *ngFor="let size of fontSizes" [value]="size">{{ size }} px</option>
        </select>
      </div>

For ts file,
- Created a fontSizes array to store predefined font size values.
- Added a default value (editorFontSize = 16) to ensure consistent initial behavior.
- Implemented the updateFontSize() method to update the editor options whenever the dropdown value changes.
   /**
 * add a dropdown list for choosing font size
 */
  fontSizes = [10, 12, 14, 16, 18, 20, 24, 26, 28]; // Font size options for the dropdown
  editorFontSize = 16; // Default font size

  // Update font size in editor options
  updateFontSize(): void {
    this.editorOptions = { ...this.editorOptions, fontSize: this.editorFontSize };
  }
