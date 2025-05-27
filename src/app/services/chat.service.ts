import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Message {
  id: number;
  created_at: string;
  user_id: string;
  content: string;
  user_email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.subscribeToMessages();
  }

  private async subscribeToMessages() {
    const { data: initialMessages, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    this.messagesSubject.next(initialMessages || []);

    // Subscribe to real-time changes
    supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          const currentMessages = this.messagesSubject.value;
          this.messagesSubject.next([...currentMessages, newMessage]);
        }
      )
      .subscribe();
  }

  async sendMessage(content: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          content,
          user_id: user.id,
          user_email: user.email
        }
      ]);

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
