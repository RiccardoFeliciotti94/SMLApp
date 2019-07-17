import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'bid-room', loadChildren: './bid-room/bid-room.module#BidRoomPageModule' },
  { path: 'team-details', loadChildren: './team-details/team-details.module#TeamDetailsPageModule' },
  { path: 'match-details', loadChildren: './match-details/match-details.module#MatchDetailsPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
