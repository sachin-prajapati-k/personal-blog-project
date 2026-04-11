import config from "../../../config/config.js";
import { Client, Account, ID } from "appwrite";

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
      const userAccount = await this.account.create({
        ID,
        email,
        password,
        name,
      });
      if (userAccount) {
        return userAccount;
      } else {
        return userAccount;
      }
    } catch (e) {
      throw new Error("error while creating new user", e);
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
      throw new error("error while login");
    }
  }
  async getCurrentUser() {
    try {
      // Logic: Attempt to fetch the session
      return await this.account.get();
    } catch (error) {
      // Logic: If it's a 401, it just means no one is logged in.
      // We don't necessarily need to treat this as a "scary" error.
      if (error.code === 401) {
        return null; // Return null so your UI knows: "User is a Guest"
      }
      console.log("Actual Appwrite error:", error);
      return null;
    }
  }
  async userLogout() {
    try {
      const userLogout = await this.account.deleteSessions();
      return userLogout;
    } catch (error) {
      throw new error("error while logout");
    }
  }
}

const authService = new AuthService();
export default authService;
