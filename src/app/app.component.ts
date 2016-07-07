/**
 * Created by vadimdez on 21/06/16.
 */
import { Component } from '@angular/core';
import { PdfViewerComponent } from './../pdf-viewer/pdf-viewer.component';
// import { PdfViewerComponent } from 'pdf-viewer';

@Component({
  selector: 'pdf-viewer-app',
  templateUrl: '/app/app.component.html',
  directives: [PdfViewerComponent]
})

export class AppComponent {
  pdfSrc: string = '/pdf-test.pdf';
  page: number = 1;
}