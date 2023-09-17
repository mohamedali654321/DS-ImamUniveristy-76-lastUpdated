/* eslint-disable unused-imports/no-unused-imports */
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MediaViewerService } from '../../services/media-viewer.service';
import { LocaleService } from 'src/app/core/locale/locale.service';
import { PDFDocument } from 'pdf-lib';


@Component({
  selector: 'ds-kware-pdf-viewer',
  templateUrl: './kware-pdf-viewer.component.html',
  styleUrls: ['./kware-pdf-viewer.component.scss'],
  // encapsulation: ViewEncapsulation.Emulated,
})
export class KwarePdfViewerComponent implements OnInit, OnChanges {
  @ViewChild('parentContainer') parentContainer: ElementRef;
  @ViewChild('viewerContainer') viewerContainer: ElementRef;
  @ViewChild('pdfJsViewer') pdfJsViewer: any;

  @Input() fileMeta;
  @Input() isMobile: boolean;
  @Input() closeViewer: () => void;
  @Input() viewerPanelsStatus: any;

  @Input() fileUrl: any;
  @Input() bitstreamPath: any;
  localeCode = '';

  constructor(private viewerService: MediaViewerService, private localeService: LocaleService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.fileUrl.firstChange) {
      if (this.pdfJsViewer) {
        this.pdfJsViewer.pdfSrc = encodeURIComponent(changes.fileUrl.currentValue);
        this.pdfJsViewer.refresh();
      }
    }
  }

  ngOnInit() {
    this.localeCode = this.localeService.getCurrentLanguageCode();
  }

  async watermarkPdfFile(actionType: string) {
    const waterMarkImage = '../../../assets/images/watermark_image.png';
    const imageBuffer = await fetch(waterMarkImage).then(res => res.arrayBuffer());

    const existingPdfBytes = await
      fetch(decodeURIComponent(this.fileUrl)).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const image = await pdfDoc.embedPng(imageBuffer);

    const pages = pdfDoc.getPages();
    pages.map(page => {
      const { width, height } = image.scale(0.2);
      page.drawImage(image, {
        x: page.getWidth() / 2 - width / 2,
        y: page.getHeight() / 2 - height / 2,
        width: width,
        height: height,
        // width: 300,
        // height: 428,
        opacity: 0.1,
      });
    });
    const pdfBytes = await pdfDoc.save();

    if (actionType === 'download') {
      this.downloadPdf(this.fileMeta.name, pdfBytes);
    } else {
      this.printPdf(pdfBytes);
    }
  }

  downloadPdf(filename: string, byte: any) {
    let blob = new Blob([byte], { type: this.fileMeta?.format });
    let link = document.createElement('a');
    const Url = URL.createObjectURL(blob);
    link.href = Url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(Url);
  }

  printPdf(byte: any) {
    let blob = new Blob([byte], { type: this.fileMeta?.format });
    const blobUrl = window.URL.createObjectURL(blob);
    const iframe: any = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      setTimeout(() => {
        iframe.focus();
        iframe.contentWindow.print();
      });
    };
  }
}
