import { ProjectModel, IProjectDoc } from '../models/Project.js';
import { isDbConnected, getLocalStore, saveLocalStore } from '../db.js';
import { ProjectInput } from '../../src/lib/validation.js';

export class ProjectService {
  static async getAll(filter?: { category?: string; featured?: boolean; status?: string }) {
    if (isDbConnected()) {
      const query: any = {};
      if (filter?.category && filter.category !== 'All') {
        query.category = filter.category;
      }
      if (typeof filter?.featured === 'boolean') {
        query.featured = filter.featured;
      }
      if (filter?.status) {
        query.status = filter.status;
      }
      const list = await ProjectModel.find(query).sort({ featured: -1, createdAt: -1 });
      return list.map((doc) => doc.toObject());
    }

    const store = getLocalStore();
    let list = [...(store.projects || [])];
    if (filter?.category && filter.category !== 'All') {
      list = list.filter((p) => p.category === filter.category);
    }
    if (typeof filter?.featured === 'boolean') {
      list = list.filter((p) => Boolean(p.featured) === filter.featured);
    }
    if (filter?.status) {
      list = list.filter((p) => p.status === filter.status);
    }
    return list.sort((a, b) => {
      if (b.featured !== a.featured) return b.featured ? 1 : -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  static async getBySlug(slug: string) {
    const normalizedSlug = slug.toLowerCase().trim();
    if (isDbConnected()) {
      const doc = await ProjectModel.findOne({ slug: normalizedSlug });
      return doc ? doc.toObject() : null;
    }

    const store = getLocalStore();
    const item = store.projects?.find((p) => p.slug.toLowerCase() === normalizedSlug);
    return item || null;
  }

  static async getById(id: string) {
    if (isDbConnected()) {
      const doc = await ProjectModel.findById(id);
      return doc ? doc.toObject() : null;
    }

    const store = getLocalStore();
    const item = store.projects?.find((p) => p._id === id);
    return item || null;
  }

  static async create(data: ProjectInput) {
    if (isDbConnected()) {
      const created = await ProjectModel.create(data);
      return created.toObject();
    }

    const store = getLocalStore();
    const newId = 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newProject = {
      ...data,
      _id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.projects = store.projects || [];
    store.projects.push(newProject);
    saveLocalStore(store);
    return newProject;
  }

  static async update(id: string, data: Partial<ProjectInput>) {
    if (isDbConnected()) {
      const updated = await ProjectModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );
      return updated ? updated.toObject() : null;
    }

    const store = getLocalStore();
    const index = store.projects?.findIndex((p) => p._id === id);
    if (index === -1 || index === undefined) {
      return null;
    }
    const existing = store.projects[index];
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    store.projects[index] = updated;
    saveLocalStore(store);
    return updated;
  }

  static async delete(id: string): Promise<boolean> {
    if (isDbConnected()) {
      const res = await ProjectModel.findByIdAndDelete(id);
      return Boolean(res);
    }

    const store = getLocalStore();
    const initialLen = store.projects?.length || 0;
    store.projects = (store.projects || []).filter((p) => p._id !== id);
    if (store.projects.length !== initialLen) {
      saveLocalStore(store);
      return true;
    }
    return false;
  }
}
