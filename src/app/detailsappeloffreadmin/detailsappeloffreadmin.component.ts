import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppelOffre } from '../model/appeloffre.model';
import { Entreprise } from '../model/entreprise.model';
import { Offre } from '../model/offre.model';
import { AppeloffreService } from '../services/appeloffre.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-detailsappeloffreadmin',
  templateUrl: './detailsappeloffreadmin.component.html',
  styleUrls: ['./detailsappeloffreadmin.component.css']
})
export class DetailsappeloffreadminComponent implements OnInit {
  currentAppelOffre: AppelOffre = new AppelOffre();
  currentEntreprise: Entreprise = new Entreprise();
  offres: Offre[] = [];

  constructor(private activatedRoute: ActivatedRoute, 
              private appelOffreService: AppeloffreService,
              private userService: UserService) {}

  ngOnInit(): void {
    const appelOffreId = this.activatedRoute.snapshot.params['id'];
    this.loadCurrentAppelOffre(appelOffreId);
    this.loadOffres(appelOffreId);
  }

  loadCurrentAppelOffre(appelOffreId: string): void {
    this.appelOffreService.getAppelOffreByIdUser(appelOffreId).subscribe(
      appeloffre => {
        this.currentAppelOffre = appeloffre;
        this.loadCurrentEntreprise(appeloffre.entrepriseId);
        console.log('Appel Offre data:', appeloffre);
      },
      error => console.error('Error loading appel offre data:', error)
    );
  }
loadCurrentEntreprise(entrepriseId: string): void {
    this.userService.getEntrepriseById(entrepriseId).subscribe(
      entreprise => this.currentEntreprise = entreprise,
      error => console.error('Error loading entreprise data:', error)
    );
  }
  loadOffres(appelOffreId: string): void {
    this.appelOffreService.getOffresByappeloffresidadmin(appelOffreId).subscribe(
      offres => this.offres = offres,
      error => console.error('Error loading offers:', error)
    );
  }

  downloadDocument(offreId: string): void {
    this.appelOffreService.downloadDocument(offreId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'OffreTelechargé.pdf';  
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    }, error => {
      console.error('Download failed:', error);
    });
  }
}
