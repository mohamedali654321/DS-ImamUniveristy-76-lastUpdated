import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'ds-kware-document-viewer',
  templateUrl: './kware-document-viewer.component.html',
  styleUrls: ['./kware-document-viewer.component.scss']
})
export class KwareDocumentViewerComponent implements OnInit, OnChanges {
  @Input() docURL = '';
  @Input() locale = 'en';
  @Input() closeViewer: () => void;
  @Input() isMobile: boolean;

  @ViewChild('documentViewer') documentViewer: any;

  iframeURL?: SafeResourceUrl = undefined;

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (this.docURL) {
      this.iframeURL =
        this.domSanitizer.bypassSecurityTrustResourceUrl('//docs.google.com/gview?url=' + this.docURL + '&embedded=true');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.docURL.isFirstChange()) {
      this.iframeURL =
        this.domSanitizer
          .bypassSecurityTrustResourceUrl(`https://view.officeapps.live.com/op/embed.aspx?src=${changes.docURL.currentValue}&StartOn=1&Print=0&EmbedCode=0&ui=${this.locale}`);

      if (this.documentViewer) {
        this.documentViewer.src =
          this.domSanitizer.
            bypassSecurityTrustResourceUrl(`https://view.officeapps.live.com/op/embed.aspx?src=${changes.docURL.currentValue}&StartOn=1&Print=0&EmbedCode=0&ui=${this.locale}`);
      }
    }
  }
}
