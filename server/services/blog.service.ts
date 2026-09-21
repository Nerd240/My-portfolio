import { BlogPostModel } from '../models/BlogPost.js';
import { isDbConnected, getLocalStore, saveLocalStore } from '../db.js';
import { BlogPostInput } from '../../src/lib/validation.js';

export class BlogService {
  static async getAll(onlyPublished = true) {
    if (isDbConnected()) {
      const query: Record<string, any> = onlyPublished ? { status: 'published' } : {};
      const list = await BlogPostModel.find(query).sort({ createdAt: -1 });
      return list.map((doc) => doc.toObject());
    }

    const store = getLocalStore();
    let list = [...(store.posts || [])];
    if (onlyPublished) {
      list = list.filter((p) => p.status === 'published');
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async getBySlug(slug: string, onlyPublished = true) {
    const normalized = slug.toLowerCase().trim();
    if (isDbConnected()) {
      const query: any = { slug: normalized };
      if (onlyPublished) query.status = 'published';
      const doc = await BlogPostModel.findOne(query);
      return doc ? doc.toObject() : null;
    }

    const store = getLocalStore();
    const item = store.posts?.find(
      (p) => p.slug.toLowerCase() === normalized && (!onlyPublished || p.status === 'published')
    );
    return item || null;
  }

  static async create(data: BlogPostInput) {
    if (isDbConnected()) {
      const created = await BlogPostModel.create(data);
      return created.toObject();
    }

    const store = getLocalStore();
    const newId = 'post_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newPost = {
      ...data,
      _id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.posts = store.posts || [];
    store.posts.push(newPost);
    saveLocalStore(store);
    return newPost;
  }

  static async update(id: string, data: Partial<BlogPostInput>) {
    if (isDbConnected()) {
      const updated = await BlogPostModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );
      return updated ? updated.toObject() : null;
    }

    const store = getLocalStore();
    const index = store.posts?.findIndex((p) => p._id === id);
    if (index === -1 || index === undefined) return null;
    const existing = store.posts[index];
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    store.posts[index] = updated;
    saveLocalStore(store);
    return updated;
  }

  static async delete(id: string): Promise<boolean> {
    if (isDbConnected()) {
      const res = await BlogPostModel.findByIdAndDelete(id);
      return Boolean(res);
    }

    const store = getLocalStore();
    const initialLen = store.posts?.length || 0;
    store.posts = (store.posts || []).filter((p) => p._id !== id);
    if (store.posts.length !== initialLen) {
      saveLocalStore(store);
      return true;
    }
    return false;
  }
}
