import config from "../../../config/config";
import {
  Client,
  ID,
  Databases,
  Storage,
  Query,
  Permission,
  Role,
} from "appwrite";

/** Required when collection/bucket has document or file security enabled. */
function filePermissions(userId) {
  return [
    Permission.read(Role.any()),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ];
}

function documentPermissions(userId) {
  return [
    Permission.read(Role.any()),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ];
}

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
      // Use a unique document $id — using the URL slug as $id makes every duplicate slug overwrite the same document.
      return await this.databases.createDocument({
        databaseId: config.appWriteDatabaseId,
        collectionId: config.appWriteCollectionId,
        documentId: ID.unique(),
        data: {
          title,
          content,
          featuredimage: featuredImage,
          status,
          userid: userId,
        },
        permissions: documentPermissions(userId),
      });
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
          featuredimage: featuredImage,
          userid: userId,
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
        [
          Query.equal("status", "active"),
          Query.orderDesc("$createdAt"),
          Query.limit(250),
        ],
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

  async uploadFile(file, userId) {
    if (!file || !(file instanceof File)) {
      throw new Error("No image file selected.");
    }
    if (!userId) {
      throw new Error("Missing user id for upload.");
    }
    const bucketId = config.appWriteBucketId;
    if (!bucketId || bucketId === "undefined") {
      throw new Error(
        "Set VITE_APPWRITE_BUCKET_ID in your .env file to your Storage bucket ID (Appwrite → Storage), then restart the dev server.",
      );
    }
    try {
      return await this.bucket.createFile({
        bucketId,
        fileId: ID.unique(),
        file,
        permissions: filePermissions(userId),
      });
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

  /** Sync URL builder — must not be async or `<img src={...}>` receives a Promise. */
  getFilePreview(fileId) {
    if (fileId == null || fileId === "") {
      return "";
    }
    try {
      return this.bucket.getFilePreview(config.appWriteBucketId, fileId);
    } catch (error) {
      console.log("error while getting file preview", error);
      return "";
    }
  }
}

const dataservice = new DataService();
export default dataservice;
