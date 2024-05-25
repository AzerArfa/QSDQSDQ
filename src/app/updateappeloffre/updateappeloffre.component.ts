import { Component, OnInit } from '@angular/core';
import { AppeloffreService } from '../services/appeloffre.service';
import { AppelOffre } from '../model/appeloffre.model';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-updateappeloffre',
  templateUrl: './updateappeloffre.component.html',
  styleUrls: ['./updateappeloffre.component.css']
})
export class UpdateappeloffreComponent implements OnInit {
  currentAppelOffre: AppelOffre = new AppelOffre();
  selectedFile: File | null = null;
  selectedDocument: File | null = null;  // Handle the document upload
  datelimitesoumissionFormatted!: string;

  constructor(
    private appeloffreService: AppeloffreService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private location: Location,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      this.appeloffreService.getAppelOffreById(id).subscribe(
        currentAppelOffre => {
          this.currentAppelOffre = currentAppelOffre;
          if (currentAppelOffre.datelimitesoumission) {
            this.datelimitesoumissionFormatted = formatDate(currentAppelOffre.datelimitesoumission, 'yyyy-MM-dd', 'en-US');
          }
        
        },
        error => {
          this.toastr.error('Modification echoué', "Appel d'offre", {
            timeOut: 5000,
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
          console.error('Error loading currentAppelOffre:', error);

        }
      );
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
    }
  }

  onDocumentSelected(event: any): void {
    if (event.target.files && event.target.files[0] && event.target.files[0].type === 'application/pdf') {
      this.selectedDocument = event.target.files[0];
    }
  }

  updateAppelOffre(): void {
    const formData = new FormData();
    formData.append('titre', this.currentAppelOffre.titre);
    formData.append('description', this.currentAppelOffre.description);
    formData.append('localisation', this.currentAppelOffre.localisation);
    formData.append('datelimitesoumission', this.datelimitesoumissionFormatted);

    if (this.selectedFile) {
      formData.append('img', this.selectedFile, this.selectedFile.name);
    }

    if (this.selectedDocument) {
      formData.append('document', this.selectedDocument, this.selectedDocument.name);
    }

    this.appeloffreService.updateAppelOffreFormData(this.currentAppelOffre.id, formData).subscribe(
      () => {
        
        console.log('currentAppelOffre updated successfully');
        this.location.back();
        this.toastr.success('Modification terminé avec succées', "Appel d'offre", {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
      },
      error => {
        this.toastr.error('Modification echoué', "Appel d'offre", {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        console.error('Error updating currentAppelOffre:', error);
      }
    );
  }
}

