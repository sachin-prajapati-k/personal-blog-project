import config from "../../../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class DataService {
  client = new Client();
  databases;
  bucket;
  constructor() {
    this.client
      .setEndpoint(config.appWriteUrl)
      .setProject(config.appWriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, featuredImage, content, status, userId }) {
    try {
      return await this.databases.createDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        },
      );
    } catch (error) {
      throw new Error(error?.message || "error while creating post");
    }
  }

  async updatePost(slug, { title, featuredImage, content, status, userId }) {
    try {
      return this.databases.updateDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          userId,
          status,
        },
      );
    } catch (error) {
      throw new Error(error?.message || "error while updating post");
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        slug,
      );
      return true;
    } catch (error) {
      console.log("error while deleting post", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        slug,
      );
    } catch (error) {
      console.log("error while getting post", error);
      return false;
    }
  }

  async getPosts() {
    if (this._getPostsInflight) {
      return this._getPostsInflight;
    }
    this._getPostsInflight = this.databases
      .listDocuments(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        [Query.equal("status", "active")],
      )
      .catch((error) => {
        if (error.code !== 401) {
          console.log("error while getting posts", error);
        }
        return false;
      })
      .finally(() => {
        this._getPostsInflight = null;
      });
    return this._getPostsInflight;
  }

  async uploadFile(file) {
    if (!file || !(file instanceof File)) {
      throw new Error("No image file selected.");
    }
    const bucketId = config.appWriteBucketId;
    if (!bucketId || bucketId === "undefined") {
      throw new Error(
        "Set VITE_APPWRITE_BUCKET_ID in your .env file to your Storage bucket ID (Appwrite → Storage), then restart the dev server.",
      );
    }
    try {
      return await this.bucket.createFile(bucketId, ID.unique(), file);
    } catch (error) {
      console.error("uploadFile:", error);
      const msg =
        error?.message ||
        (error?.code != null ? `Appwrite ${error.code}` : "Upload failed");
      throw new Error(msg);
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.bucket.deleteFile(config.appWriteBucketId, fileId);
    } catch (error) {
      console.log("error whiel deleting file", error);
      return false;
    }
  }

  async getFilePreview(fileId) {
    try {
      return await this.bucket.getFilePreview(config.appWriteBucketId, fileId);
    } catch (error) {
      console.log("error while getting file preview", error);
      return false;
    }
  }
}

const dataservice = new DataService();
export default dataservice;
