import config from "../../../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class dataService {
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
      throw new error("error while createing post");
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
      throw new error("error while updating post");
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
    try {
      return await this.databases.listDocuments(
        config.appWriteDatabaseId,
        config.appWriteCollectionId,
        [Query.equal("status", "active")],
      );
    } catch (error) {
      console.log("error while getting posts", error);
      return false;
    }
  }

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        config.appWriteBucketId,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.log("getting error while uploading file", error);
      return false;
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

const dataservice = new dataService();
export default dataservice;
