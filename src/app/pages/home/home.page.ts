import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from 'src/app/supabase.client';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChatComponent } from '../../components/chat/chat.component';
import { logOutOutline } from 'ionicons/icons';

import { addIcons } from 'ionicons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ChatComponent]
})
export class HomePage implements OnInit {
  email: string = '';

  constructor(private router: Router) { 
    addIcons({ logOutOutline });
  }

  async ngOnInit() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      this.router.navigate(['/auth'])
    } else {
      this.email = data.user.email || ''
    }
  }

  async logout() {
    await supabase.auth.signOut();
    this.router.navigate(['/auth']);
  }
}
