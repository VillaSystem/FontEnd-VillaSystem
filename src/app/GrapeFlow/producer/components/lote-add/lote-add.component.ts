import {Component, Inject} from '@angular/core';
import {Client} from "../../model/client.entity";
import {Router} from "@angular/router";
import {LoteService} from "../../services/lote.service";
import {Lote} from "../../model/lote.entity";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButton} from "@angular/material/button";
@Component({
  selector: 'app-lote-add',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelect,
    MatOption,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './lote-add.component.html',
  styleUrl: './lote-add.component.css'
})
export class LoteAddComponent {
  lote: Lote = new Lote(); // Inicializar un nuevo lote

  constructor(
    public dialogRef: MatDialogRef<LoteAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loteService: LoteService // Inyectamos el servicio LoteService
  ) {}
  private nextId = 10;
  onSave(): void {


      this.lote.id = this.nextId.toString();
      this.nextId++;

    this.loteService.create(this.lote).subscribe(newLote => {
      this.dialogRef.close(newLote); // Devuelve el nuevo lote al cerrar el diálogo
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
