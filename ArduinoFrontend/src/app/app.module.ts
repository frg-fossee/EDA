import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SimulatorComponent } from './simulator/simulator.component';
// import { ClipboardModule } from '@angular/cdk/clipboard';

import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ViewComponentInfoComponent } from './view-component-info/view-component-info.component';
import { HttpClientModule } from '@angular/common/http';
import { ExportfileComponent } from './exportfile/exportfile.component';
import { ComponentlistComponent } from './componentlist/componentlist.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HeaderComponent } from './header/header.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { AlertModalComponent } from './alert/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './alert/confirm-modal/confirm-modal.component';
import { ExportJSONDialogComponent } from './export-jsondialog/export-jsondialog.component';
import { ExitConfirmDialogComponent } from './exit-confirm-dialog/exit-confirm-dialog.component';
import { SaveProjectDialogComponent } from './simulator/save-project-dialog/save-project-dialog.component';
import { OptionModalComponent } from './alert/option-modal/option-modal.component';
import { VersioningPanelComponent } from './versioning-panel/versioning-panel.component';
import { CreateVariationDialogComponent } from './versioning-panel/create-variation-dialog/create-variation-dialog.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { MaterialModule } from './common/material.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './common/SharedModule.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LTIFormComponent } from './lti-form/lti-form.component';
import { SubmissionlistComponent } from './submissionlist/submissionlist.component';
import { ViewCodeComponent } from './lti-form/view-code/view-code.component';
import { GraphComponent } from './graph/graph.component';
import { GraphDataService } from './graph-data.service';
import { GraphlistComponent } from './graphlist/graphlist.component';
import { PopupComponent } from './popup/popup.component';

/**
 * Monaco OnLoad Function
 */
export function onMonacoLoad() { }

/**
 * Monaco editor config for loading js files
 */
const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: './assets',
  defaultOptions: { scrollBeyondLastLine: false },
  onMonacoLoad
};



@NgModule({
  declarations: [
    AppComponent,
    SimulatorComponent,
    CodeEditorComponent,
    ViewComponentInfoComponent,
    ExportfileComponent,
    ComponentlistComponent,
    FrontPageComponent,
    // GalleryComponent,
    ViewProjectComponent,
    // HeaderComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    OptionModalComponent,
    ExportJSONDialogComponent,
    ExitConfirmDialogComponent,
    SaveProjectDialogComponent,
    VersioningPanelComponent,
    CreateVariationDialogComponent,
    LTIFormComponent,
    SubmissionlistComponent,
    ViewCodeComponent,
    GraphComponent,
    GraphlistComponent,
    PopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule.forRoot(monacoConfig),
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    SharedModule,   // shared module for Header component
    DragDropModule,
    ScrollingModule,
  ],
  // providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, GraphDataService],
  bootstrap: [AppComponent],
  entryComponents: [
    ViewComponentInfoComponent,
    ExportfileComponent,
    ComponentlistComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    OptionModalComponent,
    ExportJSONDialogComponent,
    ExitConfirmDialogComponent,
    SaveProjectDialogComponent,
    CreateVariationDialogComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [AppComponent,
    PopupComponent
  ]
})
export class AppModule { }
