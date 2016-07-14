/**
 * Created by vadimdez on 21/06/16.
 */
import { Component, Input, ElementRef } from '@angular/core';
import PDFJS from 'pdfjs-dist';

@Component({
  selector: 'pdf-viewer',
  template: '<canvas></canvas>'
})

export class PdfViewerComponent {

  @Input('original-size') originalSize: boolean = false;
  private _src: string;
  private _pdf: any;
  private _page: number = 1;

  constructor(private element: ElementRef) {}

  @Input()
  set src(_src) {
    this._src = _src;

    this.fn();
  }

  @Input()
  set page(_page) {
    _page = parseInt(_page, 10);

    if (this._pdf && this.isValidPageNumber(_page)) {
      this._page = _page;
      this.renderPage(_page);
    }
  }

  private fn() {
    PDFJS.getDocument(this._src).then((pdf: any) => {
      this._pdf = pdf;

      if (!this.isValidPageNumber(this._page)) {
        this._page = 1;
      }

      this.renderPage(this._page);
    });
  }

  private isValidPageNumber(page: number) {
    return this._pdf.numPages >= page && page >= 1;
  }

  private renderPage(initialPage: number) {
    this._pdf.getPage(initialPage).then((page: any) => {
      var viewport = page.getViewport(1);
      var canvas = this.element.nativeElement.querySelector('canvas');
      var context = canvas.getContext('2d');

      if (!this.originalSize) {
        viewport = page.getViewport(this.element.nativeElement.offsetWidth / viewport.width);
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({
        canvasContext: context,
        viewport: viewport
      });
    });
  }
}