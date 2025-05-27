import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatService, Message } from '../../services/chat.service';
import { send } from 'ionicons/icons';

import { addIcons } from 'ionicons';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  messages: Message[] = [];
  newMessage: string = '';
  currentUserEmail: string = '';

  constructor(private chatService: ChatService) {
    addIcons({ send });
  }

  ngOnInit() {
    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
    });

    // Get current user email
    this.chatService.messages$.subscribe(messages => {
      if (messages.length > 0) {
        const currentUser = messages.find(m => m.user_id === messages[0].user_id);
        if (currentUser) {
          this.currentUserEmail = currentUser.user_email;
        }
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  async sendMessage() {
    if (this.newMessage.trim()) {
      try {
        await this.chatService.sendMessage(this.newMessage);
        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  isCurrentUser(message: Message): boolean {
    return message.user_email === this.currentUserEmail;
  }
} 