"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
require("pdfjs-dist/build/pdf.combined");
require("pdfjs-dist/web/pdf_viewer");
var PdfViewerComponent = PdfViewerComponent_1 = (function () {
    function PdfViewerComponent(element) {
        this.element = element;
        this._renderText = true;
        this._stickToPage = false;
        this._originalSize = true;
        this._page = 1;
        this._zoom = 1;
        this._rotation = 0;
        this._externalLinkTarget = 'blank';
        this.afterLoadComplete = new core_1.EventEmitter();
        this.pageChange = new core_1.EventEmitter(true);
        PDFJS.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
    }
    PdfViewerComponent.prototype.ngOnInit = function () {
        this.setupViewer();
    };
    PdfViewerComponent.prototype.onPageResize = function () {
        var _this = this;
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(function () {
            _this.updateSize();
        }, 100);
    };
    PdfViewerComponent.prototype.ngOnChanges = function (changes) {
        if ('src' in changes) {
            this.loadPDF();
        }
        else if (this._pdf) {
            if ('renderText' in changes) {
                this.setupViewer();
            }
            this.update();
        }
    };
    Object.defineProperty(PdfViewerComponent.prototype, "page", {
        set: function (_page) {
            _page = parseInt(_page, 10);
            if (this._pdf && !this.isValidPageNumber(_page)) {
                _page = 1;
            }
            this._page = _page;
            this.pageChange.emit(_page);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "renderText", {
        set: function (renderText) {
            this._renderText = renderText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "originalSize", {
        set: function (originalSize) {
            this._originalSize = originalSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "stickToPage", {
        set: function (value) {
            this._stickToPage = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "zoom", {
        set: function (value) {
            if (value <= 0) {
                return;
            }
            this._zoom = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "rotation", {
        set: function (value) {
            if (!(typeof value === 'number' && value % 90 === 0)) {
                console.warn('Invalid pages rotation angle.');
                return;
            }
            this._rotation = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "externalLinkTarget", {
        set: function (value) {
            this._externalLinkTarget = value;
        },
        enumerable: true,
        configurable: true
    });
    PdfViewerComponent.prototype.setupViewer = function () {
        PDFJS.disableTextLayer = !this._renderText;
        this.setExternalLinkTarget(this._externalLinkTarget);
        this._pdfLinkService = new PDFJS.PDFLinkService();
        var pdfOptions = {
            container: this.element.nativeElement.querySelector('div'),
            removePageBorders: true,
            linkService: this._pdfLinkService
        };
        this._pdfViewer = new PDFJS.PDFViewer(pdfOptions);
        this._pdfLinkService.setViewer(this._pdfViewer);
    };
    PdfViewerComponent.prototype.render = function () {
        var _this = this;
        if (!this.isValidPageNumber(this._page)) {
            this._page = 1;
        }
        if (this._rotation !== 0 || this._pdfViewer.pagesRotation !== this._rotation) {
            setTimeout(function () {
                _this._pdfViewer.pagesRotation = _this._rotation;
            });
        }
        if (this._stickToPage) {
            setTimeout(function () {
                _this._pdfViewer.currentPageNumber = _this._page;
            });
        }
        this.updateSize();
    };
    PdfViewerComponent.prototype.updateSize = function () {
        var _this = this;
        this._pdf.getPage(this._pdfViewer._currentPageNumber).then(function (page) {
            var scale = _this._zoom * (_this.element.nativeElement.offsetWidth / page.getViewport(1).width) / PdfViewerComponent_1.CSS_UNITS;
            _this._pdfViewer._setScale(scale, !_this._stickToPage);
        });
    };
    PdfViewerComponent.prototype.isValidPageNumber = function (page) {
        return this._pdf.numPages >= page && page >= 1;
    };
    PdfViewerComponent.prototype.setExternalLinkTarget = function (type) {
        console.log(type);
        switch (type) {
            case 'blank':
                PDFJS.externalLinkTarget = PDFJS.LinkTarget.BLANK;
                break;
            case 'none':
                PDFJS.externalLinkTarget = PDFJS.LinkTarget.NONE;
                break;
            case 'self':
                PDFJS.externalLinkTarget = PDFJS.LinkTarget.SELF;
                break;
            case 'parent':
                PDFJS.externalLinkTarget = PDFJS.LinkTarget.PARENT;
                break;
            case 'top':
                PDFJS.externalLinkTarget = PDFJS.LinkTarget.TOP;
                break;
        }
        console.log(PDFJS.externalLinkTarget);
    };
    PdfViewerComponent.prototype.loadPDF = function () {
        var _this = this;
        if (!this.src) {
            return;
        }
        if (this.lastLoaded === this.src) {
            this.update();
            return;
        }
        var src = this.src;
        PDFJS.getDocument(src).then(function (pdf) {
            _this._pdf = pdf;
            _this.lastLoaded = src;
            _this.afterLoadComplete.emit(pdf);
            _this.update();
        });
    };
    PdfViewerComponent.prototype.update = function () {
        if (this._pdfViewer) {
            this._pdfViewer.setDocument(this._pdf);
        }
        if (this._pdfLinkService) {
            this._pdfLinkService.setDocument(this._pdf, null);
        }
        this.page = this._page;
        this.render();
    };
    return PdfViewerComponent;
}());
PdfViewerComponent.CSS_UNITS = 96.0 / 72.0;
__decorate([
    core_1.Output('after-load-complete'),
    __metadata("design:type", Object)
], PdfViewerComponent.prototype, "afterLoadComplete", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], PdfViewerComponent.prototype, "src", void 0);
__decorate([
    core_1.Input('page'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PdfViewerComponent.prototype, "page", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], PdfViewerComponent.prototype, "pageChange", void 0);
__decorate([
    core_1.Input('render-text'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PdfViewerComponent.prototype, "renderText", null);
__decorate([
    core_1.Input('original-size'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PdfViewerComponent.prototype, "originalSize", null);
__decorate([
    core_1.Input('stick-to-page'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PdfViewerComponent.prototype, "stickToPage", null);
__decorate([
    core_1.Input('zoom'),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], PdfViewerComponent.prototype, "zoom", null);
__decorate([
    core_1.Input('rotation'),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], PdfViewerComponent.prototype, "rotation", null);
__decorate([
    core_1.Input('external-link-target'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], PdfViewerComponent.prototype, "externalLinkTarget", null);
PdfViewerComponent = PdfViewerComponent_1 = __decorate([
    core_1.Component({
        selector: 'pdf-viewer',
        template: "<div class=\"ng2-pdf-viewer-container\" (window:resize)=\"onPageResize($event)\"><div id=\"viewer\" class=\"pdfViewer\"></div></div>"
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], PdfViewerComponent);
exports.PdfViewerComponent = PdfViewerComponent;
var PdfViewerComponent_1;
//# sourceMappingURL=pdf-viewer.component.js.map