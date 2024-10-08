import {Component, OnInit} from '@angular/core';
import {Client} from "../../model/client.entity";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ClientService} from "../../services/client.service";
import {MatButton} from "@angular/material/button";
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-details-clients',
  standalone: true,
  imports: [
    MatButton,
    NgIf,
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './details-clients.component.html',
  styleUrl: './details-clients.component.css'
})
export class DetailsClientsComponent implements OnInit {
  client: Client | undefined;

  constructor(private clientService: ClientService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.clientService.getById(clientId).subscribe( client => {
        this.client = client;
        console.log(this.client);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }
}
