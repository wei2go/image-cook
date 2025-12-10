import { getFirestore } from "firebase-admin/firestore";
import { EntityTrackingDoc } from "@image-cook/shared";

export class FirestoreService {
  private get db() {
    return getFirestore();
  }

  private get collection() {
    return this.db.collection("entities");
  }

  async createEntity(
    docId: string,
    data: EntityTrackingDoc,
  ): Promise<EntityTrackingDoc> {
    await this.collection.doc(docId).set(data);
    return data;
  }

  async getEntity(docId: string): Promise<EntityTrackingDoc | null> {
    const doc = await this.collection.doc(docId).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as EntityTrackingDoc;
  }

  async getAllEntities(category?: string): Promise<EntityTrackingDoc[]> {
    let query: any = this.collection;

    if (category) {
      query = query.where("category", "==", category);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: any) => doc.data() as EntityTrackingDoc);
  }

  async updateEntity(
    docId: string,
    data: Partial<EntityTrackingDoc>,
  ): Promise<void> {
    await this.collection.doc(docId).update(data);
  }

  async deleteEntity(docId: string): Promise<void> {
    await this.collection.doc(docId).delete();
  }
}

export const firestoreService = new FirestoreService();
