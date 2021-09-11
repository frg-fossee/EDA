import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaveProjectDialogComponent } from './save-project-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SaveProjectDialogComponent', () => {
  let component: SaveProjectDialogComponent;
  let fixture: ComponentFixture<SaveProjectDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
          RouterTestingModule,
          MatFormFieldModule,
          MatTooltipModule,
          MatInputModule,
          FormsModule,
          MatDialogModule,
          HttpClientModule,
          BrowserAnimationsModule
      ],
      declarations: [ SaveProjectDialogComponent ],
      providers: [
        // workaround: why I can't inject MatDialogRef in the unit test?
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => { }
          }
        },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
