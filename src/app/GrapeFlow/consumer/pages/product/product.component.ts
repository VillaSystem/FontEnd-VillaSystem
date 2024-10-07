import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Product } from '../../model/product.entity';
import { ProductService } from '../../services/product.service';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { ProductDetailsComponent } from "../../components/product-details/product-details.component";
import { LoteService} from "../../../producer/services/lote.service";
import { LoteDetailsComponent} from "../../../producer/components/lote-details/lote-details.component";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatPaginatorModule,
    FormsModule,
    MatSortModule,
    MatDialogModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit {
  protected columnsToDisplay: string[] = ['nombre', 'tipo', 'descripcion', 'uvas', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  protected dataSource: MatTableDataSource<Product>;

  constructor(
    private productService: ProductService,
    private loteService: LoteService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Product>();
  }

  ngOnInit(): void {
    this.getAllProduct();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private getAllProduct(): void {
    console.log('Fetching products...');
    this.productService.getAll().subscribe(
      (products: Product[]) => {
        console.log('Products received:', products);
        this.dataSource.data = products;
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onViewDetails(product: Product): void {
    this.dialog.open(ProductDetailsComponent, {
      width: '600px',
      data: product
    });
  }

  onViewLot(product: Product): void {
    if (product.lote_id) {
      this.loteService.getById(product.lote_id).subscribe({
        next: (lote) => {
          this.dialog.open(LoteDetailsComponent, {
            width: '600px',
            data: lote
          });
        },
        error: (error) => {
          console.error('Error fetching lot details:', error);
          // Optionally, show an error message to the user
        }
      });
    } else {
      console.error('No lot associated with this product');
      // Optionally, show a message to the user that there's no lot associated with this product
    }
  }
}
