import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator } from "@angular/material/paginator";
import { Order } from "../../model/order.entity";
import { MatSort } from "@angular/material/sort";
import { OrderService } from "../../services/order.service";
import { MatSortModule } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { OrdersDetailsComponent } from "../../components/orders-details/orders-details.component";
import { MatIcon } from "@angular/material/icon";
import { DatePipe } from "@angular/common";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatPaginator,
    MatSortModule,
    MatIcon,
    DatePipe,
    MatOption,
    MatSelect,
    TranslateModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  providers: [DatePipe]
})
export class OrdersComponent implements OnInit, AfterViewInit {
  datasource: MatTableDataSource<Order> = new MatTableDataSource<Order>();
  columnsToDisplay: string[] = ['numeroPedido', 'fecha', 'tipo', 'estado', 'actions'];
  filteredValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private dialog: MatDialog = inject(MatDialog);
  private datePipe: DatePipe = inject(DatePipe);

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  ngAfterViewInit(): void {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  private getAllOrders(): void {
    this.orderService.getAll().subscribe((orders: Order[]) => {
      // Formatear la fecha correctamente para cada orden
      orders.forEach(order => {
        order.fecha = this.datePipe.transform(order.fecha, 'dd/MM/yyyy') || order.fecha;
      });
      this.datasource.data = orders;
    }, (error) => {
      console.error('Error al obtener pedidos:', error);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  onViewDetails(order: Order): void {
    this.dialog.open(OrdersDetailsComponent, {
      width: '600px',
      data: order
    });
  }

  onChangeStatus(order: Order): void {
    const newStatus = order.estado === 'En Proceso' ? 'Terminado' : 'En Proceso';

    this.orderService.updateOrder(order.id, { ...order, estado: newStatus }).subscribe(
      (updatedOrder) => {
        const index = this.datasource.data.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          this.datasource.data[index] = updatedOrder;
          this.datasource._updateChangeSubscription();
        }
      },
      (error) => console.error('Error al actualizar el estado del pedido:', error)
    );
  }

  onDelete(order: Order) {
    if (confirm(`¿Estás seguro de que quieres eliminar el pedido ${order.numeroPedido}?`)) {
      this.orderService.deleteOrder(order.id).subscribe(
        () => {
          this.datasource.data = this.datasource.data.filter(o => o.id !== order.id);
        },
        (error) => {
          console.error('Error al eliminar el pedido:', error);
        }
      );
    }
  }

  onAddOrder() {
    this.orderService.getAll().subscribe(orders => {
      const lastOrder = orders[orders.length - 1];
      const lastOrderNumber = lastOrder ? parseInt(lastOrder.numeroPedido.replace('P', ''), 10) : 0;
      const newOrderNumber = `P${lastOrderNumber + 1}`;

      const newOrder = new Order({
        numeroPedido: newOrderNumber,
        fecha: this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '',
        tipo: 'Nuevo tipo',
        estado: 'En Proceso'
      });

      this.orderService.addOrder(newOrder).subscribe(() => {
        this.getAllOrders();
      });
    });
  }
}