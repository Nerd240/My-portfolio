import { ContactMessageModel } from '../models/ContactMessage.js';
import { isDbConnected, getLocalStore, saveLocalStore } from '../db.js';
import { ContactMessageInput } from '../../src/lib/validation.js';

export class ContactService {
  static async create(data: ContactMessageInput, ip?: string) {
    if (isDbConnected()) {
      const created = await ContactMessageModel.create({
        ...data,
        ip: ip || '',
        status: 'unread',
      });
      return created.toObject();
    }

    const store = getLocalStore();
    const newId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newMsg = {
      _id: newId,
      name: data.name,
      email: data.email,
      message: data.message,
      ip: ip || '',
      status: 'unread',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.messages = store.messages || [];
    store.messages.unshift(newMsg);
    saveLocalStore(store);
    return newMsg;
  }

  static async getAll(status?: string) {
    if (isDbConnected()) {
      const query: any = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      const list = await ContactMessageModel.find(query).sort({ createdAt: -1 });
      return list.map((doc) => doc.toObject());
    }

    const store = getLocalStore();
    let list = [...(store.messages || [])];
    if (status && status !== 'all') {
      list = list.filter((m) => m.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async updateStatus(id: string, status: 'unread' | 'read' | 'replied') {
    if (isDbConnected()) {
      const doc = await ContactMessageModel.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      );
      return doc ? doc.toObject() : null;
    }

    const store = getLocalStore();
    const msg = store.messages?.find((m) => m._id === id);
    if (!msg) return null;
    msg.status = status;
    msg.updatedAt = new Date().toISOString();
    saveLocalStore(store);
    return msg;
  }

  static async delete(id: string): Promise<boolean> {
    if (isDbConnected()) {
      const res = await ContactMessageModel.findByIdAndDelete(id);
      return Boolean(res);
    }

    const store = getLocalStore();
    const initialLen = store.messages?.length || 0;
    store.messages = (store.messages || []).filter((m) => m._id !== id);
    if (store.messages.length !== initialLen) {
      saveLocalStore(store);
      return true;
    }
    return false;
  }
}
