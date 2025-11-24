import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { NFSeResponse } from '../models/nfse.model';
import { UploadService } from '../services/upload';

interface UploadOptions {
  aiExtraction: boolean;
  aiParse: boolean;
}

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, DatePipe],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  uploadProgress = signal(0);
  nfseResponse = signal<NFSeResponse | null>(null);
  processingComplete = signal(false);

  // Converte strings para números para uso no html
  protected Number = Number;

  uploadForm = new FormGroup({
    aiExtraction: new FormControl(false),
    aiParse: new FormControl(false),
  });

  fileInputLabel = computed(() =>
    this.selectedFile() ? this.selectedFile()!.name : 'Select a file'
  );

  isPdfFile = computed(() => {
    const file = this.selectedFile();
    if (!file) return false;

    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  });

  constructor(private http: HttpClient, private uploadService: UploadService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.selectedFile.set(file);

      // Se for um arquivo PDF, reseta e desabilita o Parse com IA
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        this.uploadForm.get('aiParse')?.setValue(false);
      }
    }
  }

  uploadFile(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);

    // Obtém os campos do formulário
    const options: UploadOptions = {
      aiExtraction: this.uploadForm.value.aiExtraction || false,
      aiParse: this.uploadForm.value.aiParse || false,
    };

    this.uploadService.uploadFile(file, options).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress.set(Math.round((100 * event.loaded) / event.total));
        } else if (event.type === HttpEventType.Response) {
          this.isUploading.set(false);
          this.uploadProgress.set(0);

          // Converte a resposta para NFSeResponse
          const nfseData = event.body as NFSeResponse;
          this.nfseResponse.set(nfseData);
          this.processingComplete.set(true);
        }
      },
      error: (err) => {
        console.error('Erro ao enviar arquivo:', err);
        this.isUploading.set(false);
      },
    });
  }
}
