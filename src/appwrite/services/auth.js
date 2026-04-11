import config from "../../../config/config.js";
import { Client, Account, ID } from "appwrite";

function formatAppwriteError(error, fallback) {
  if (error?.code === 404 && error?.type === "project_not_found") {
    return "Wrong Appwrite project ID. In .env set VITE_APPWRITE_PROJECT_ID to the ID from Appwrite Console → your project → Settings (Overview). It is not the same as Database ID. Save, then restart the dev server (npm run dev).";
  }
  return error?.message || fallback;
}

export class AuthService {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(config.appWriteUrl)
      .setProject(config.appWriteProjectId);
    this.account = new Account(this.client);
  }
  async createAccount({ email, password, name }) {
    try {
      return await this.account.create({
        userId: ID.unique(),
        email,
        password,
        name,
      });
    } catch (e) {
      throw new Error(e.message || "error while creating new user");
    }
  }
  async loginAccount({ email, password }) {
    try {
      const userLogin = await this.account.createEmailPasswordSession({
        email,
        password,
      });
      if (userLogin) {
        return userLogin;
      } else {
        return userLogin;
      }
    } catch (error) {
      throw new Error(formatAppwriteError(error, "error while login"));
    }
  }
  async getCurrentUser() {
    if (this._getUserInflight) {
      return this._getUserInflight;
    }
    this._getUserInflight = this.account
      .get()
      .catch((error) => {
        if (error.code === 401) {
          return null;
        }
        console.log("Actual Appwrite error:", error);
        return null;
      })
      .finally(() => {
        this._getUserInflight = null;
      });
    return this._getUserInflight;
  }
  async userLogout() {
    try {
      const userLogout = await this.account.deleteSessions();
      return userLogout;
    } catch (error) {
      throw new Error(formatAppwriteError(error, "error while logout"));
    }
  }
}

const authService = new AuthService();
export default authService;
