import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { NFSeResponse } from '../models/nfse.model';

interface UploadOptions {
  aiExtraction: boolean;
  aiParse: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Uploads a file with optional AI processing options
   * @param file The file to upload
   * @param options Options for AI processing
   * @returns Observable of the upload progress and response
   */
  /**
   * Uploads a file with optional AI processing options
   * @param file The file to upload
   * @param options Options for AI processing
   * @returns Observable of the upload progress and response
   */
  uploadFile(file: File, options: UploadOptions): Observable<any> {
    const formData = new FormData();
    formData.append('document', file); // Use 'document' field name as per the example

    // Build the endpoint URL and query parameters
    let endpoint = '/documents/process_nfse';
    const params = new URLSearchParams();
    if (options.aiExtraction) params.append('ai_extraction', 'true');
    if (options.aiParse) params.append('ai_parse', 'true');

    // Add query parameters if any
    const queryString = params.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }

    return this.http.post(endpoint, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  /**
   * Gets the NFSe response data from the HTTP response
   * @param observable The HTTP response observable
   * @returns Observable of the NFSeResponse
   */
  getNFSeData(observable: Observable<any>): Observable<NFSeResponse> {
    return observable.pipe(
      filter((event) => event.type === HttpEventType.Response),
      map((event: HttpResponse<any>) => event.body as NFSeResponse)
    );
  }
}
