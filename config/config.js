const env = import.meta.env;

function str(key) {
  const v = env[key];
  if (v == null || String(v).trim() === "") return null;
  return String(v).trim();
}

const projectId = str("VITE_APPWRITE_PROJECT_ID");
const databaseId = str("VITE_APPWRITE_DATABASE_ID");

if (projectId && databaseId && projectId === databaseId) {
  console.warn(
    "[config] VITE_APPWRITE_PROJECT_ID and VITE_APPWRITE_DATABASE_ID are identical. They must be different: Project ID is under Project Settings; Database ID is under Databases.",
  );
}

const config = {
  appWriteUrl: str("VITE_APPWRITE_URL") ?? "",
  appWriteProjectId: projectId ?? "",
  appWriteDatabaseId: databaseId ?? "",
  appWriteCollectionId: str("VITE_APPWRITE_COLLECTION_ID") ?? "",
  appWriteBucketId: str("VITE_APPWRITE_BUCKET_ID") ?? "",
};

if (!config.appWriteUrl.startsWith("http")) {
  throw new Error("Set VITE_APPWRITE_URL in .env (e.g. https://fra.cloud.appwrite.io/v1)");
}
if (!config.appWriteProjectId) {
  throw new Error(
    "Set VITE_APPWRITE_PROJECT_ID in .env. Appwrite Console → open your project → Settings → copy Project ID (404 project_not_found means this value is wrong).",
  );
}

export default config;
