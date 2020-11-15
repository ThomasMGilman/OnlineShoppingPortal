import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductCreateComponent } from './components/product/product-create/product-create.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductManagerComponent } from './components/product/product-manager/product-manager.component';
import { UserListComponent } from './components/user/user-list/user-list.component';

import { UserLoginComponent } from './components/user/user-login/user-login.component';
import { UserLogoutComponent } from './components/user/user-logout/user-logout.component';
import { AuthGuard } from './_helpers/auth.guard';



const routes: Routes = [
  {path: 'login', component: UserLoginComponent},
  {path: 'logout', component: UserLogoutComponent},
  {path: 'register', component: UserLoginComponent},
  {path: 'listProducts', component: ProductListComponent},
  {path: 'createProducts', component: ProductCreateComponent, canActivate: [AuthGuard]},
  {path: 'manageProducts', component: ProductManagerComponent, canActivate: [AuthGuard]},
  {path: 'manageUsers', component: UserListComponent, canActivate: [AuthGuard]},
  {path: '*', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
