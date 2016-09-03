# Angular2 PDF Viewer [![npm version](https://badge.fury.io/js/ng2-pdf-viewer.svg)](https://badge.fury.io/js/ng2-pdf-viewer) ![](https://david-dm.org/vadimdez/ng2-pdf-viewer.svg)

> PDF Viewer Component for Angular 2

[Demo page](https://vadimdez.github.io/ng2-pdf-viewer/)

### Install

```
npm install ng2-pdf-viewer --save
```

### Usage

In case you're using ```systemjs``` see configuration [here](https://github.com/VadimDez/ng2-pdf-viewer/blob/master/SYSTEMJS.md).

Add ```PdfViewerComponent``` to your module's ```declarations```

```js
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { PdfViewerComponent } from 'ng2-pdf-viewer';

@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent, PdfViewerComponent],
  bootstrap: [AppComponent]
})

class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
```

And then use it in your component

```js
import { Component } from '@angular/core';

@Component({
  selector: 'example-app',
  template: `
  <div>
      <label>PDF src</label>
      <input type="text" placeholder="PDF src" [(ngModel)]="pdfSrc">
  </div>
  <div>
      <label>Page:</label>
      <input type="number" placeholder="Page" [(ngModel)]="page">
  </div>
  <pdf-viewer [src]="pdfSrc" 
              [initialPage]="page" 
              [original-size]="true" 
              style="display: block;"
  ></pdf-viewer>
  `
})
export class AppComponent {
  pdfSrc: string = '/pdf-test.pdf';
  page: number = 1;
}
```

### Options

#### [src]

Pass pdf location
 
```
[src]="'https://vadimdez.github.io/ng2-pdf-viewer/pdf-test.pdf'"
```

#### [page]
Page number

```
[page]="1"
```

#### [original-size]

if set to *true* - size will be as same as original document

if set to *false* - size will be as same as container block

```
[original-size]="true"
```

#### [show-all]

Show single or all pages altogether

```
[show-all]="true"
```

### License

[MIT](https://tldrlegal.com/license/mit-license) © [Vadym Yatsyuk](https://github.com/vadimdez)
