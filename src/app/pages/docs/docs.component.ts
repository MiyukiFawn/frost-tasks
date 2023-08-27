import {
  ElementRef,
  Component,
  ViewChild,
  AfterContentInit,
} from '@angular/core';
import { environment } from 'src/app/environments/environment';

import SwaggerUI from 'swagger-ui';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})
export class DocsComponent implements AfterContentInit {
  @ViewChild('apidocs', { static: true }) ApiDocsElement:
    | ElementRef
    | undefined;
  ngAfterContentInit(): void {
    const ui = SwaggerUI({
      url: environment.apiUrl + '/docs-data',
      domNode: this.ApiDocsElement?.nativeElement,
    });
  }
}
