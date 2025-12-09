import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';


interface User {
  id: number;
  name: string;
  age: number;
  city: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FilterSortPaginate';

  users: User[] = [
    { id: 1, name: 'John', age: 25, city: 'Delhi' },
    { id: 2, name: 'Aman', age: 30, city: 'Mumbai' },
    { id: 3, name: 'Riya', age: 22, city: 'Noida' },
    { id: 4, name: 'Sara', age: 28, city: 'Pune' },
    { id: 5, name: 'Dev', age: 35, city: 'Chennai' },
    { id: 6, name: 'Neha', age: 27, city: 'Kolkata' },
    { id: 7, name: 'Jay', age: 24, city: 'Jaipur' },
    { id: 8, name: 'Rohan', age: 29, city: 'Hyderabad' },
    { id: 9, name: 'Meera', age: 26, city: 'Bangalore' },
    { id: 10, name: 'Sam', age: 31, city: 'Ahmedabad' },
    { id: 11, name: 'Pooja', age: 23, city: 'Lucknow' },
    { id: 12, name: 'Ravi', age: 32, city: 'Indore' }
  ];

  // -------- FILTER STATE --------
  enableNameFilter = false;
  enableAgeFilter = false;
  enableCityFilter = false;

  nameFilter: string = '';
  minAgeFilter: number | null = null;
  maxAgeFilter: number | null = null;
  cityFilter: string = '';

  // -------- SORT STATE --------
  sortColumn: keyof User | '' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  // -------- PAGINATION STATE --------
  pageSize = 5;
  currentPage = 1;

  pages: number[] = [];
  constructor() {
    // Create an array with the correct length, filled with page numbers
    this.pages = Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  ngOnInit(){
    // this.sortedUsers;
    // this.pagedUsers;
  }

  get filteredUsers(): User[] {
    let data = [...this.users];
    // Name filter
    if (this.enableNameFilter && this.nameFilter.trim()) {
      const term = this.nameFilter.trim().toLowerCase();
      data = data.filter(user =>
        user.name.toLowerCase().includes(term)
      );
    }
    // Age filter
    if (this.enableAgeFilter) {
      if (this.minAgeFilter != null) {
        data = data.filter(user => user.age >= this.minAgeFilter!);
      }
      if (this.maxAgeFilter != null) {
        data = data.filter(user => user.age <= this.maxAgeFilter!);
      }
    }
    // City filter
    if (this.enableCityFilter && this.cityFilter.trim()) {
      const term = this.cityFilter.trim().toLowerCase();
      data = data.filter(user =>
        user.city.toLowerCase().includes(term)
      );
    }
    return data;
  }

  // 2) SORTED DATA
  get sortedUsers(): User[] {
    const data = [...this.filteredUsers];

    if (!this.sortColumn) return data;

    return data.sort((a, b) => {
      const col = this.sortColumn as keyof User;
      let valueA = a[col];
      let valueB = b[col];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // 3) PAGINATED DATA
  get pagedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.sortedUsers.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize) || 1;
  }

  // Sort handler
  sort(column: keyof User) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
  }

  // Pagination handler
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }
  // Any filter change → go back to page 1
  onFilterChange() {
    this.currentPage = 1;
  }
  // Clear all filters at once
  clearFilters() {
    this.enableNameFilter = false;
    this.enableAgeFilter = false;
    this.enableCityFilter = false;

    this.nameFilter = '';
    this.minAgeFilter = null;
    this.maxAgeFilter = null;
    this.cityFilter = '';

    this.onFilterChange();
  }

}
