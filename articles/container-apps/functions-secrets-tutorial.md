---
#customer intent: As a developer, I want to securely store and access secrets in my Azure Functions app on Azure Container Apps so that my application credentials are protected and my host keys are properly managed.
title: Use secrets with Azure Functions in Azure Container Apps
description: Learn how to store app-level secrets and manage Functions host keys for Azure Functions apps running in Azure Container Apps.
author: deepganguly
ms.author: deepganguly
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 04/15/2026
---

# Use secrets with Azure Functions in Azure Container Apps

Azure Functions running in Azure Container Apps involves two distinct secrets scenarios that you configure differently:

- **App-level secrets** are values your function code consumes at runtime, such as database connection strings or API keys. Store these secrets as Container Apps secrets, either directly or through Azure Key Vault references.

- **Functions host keys** are authentication keys (master, host, and function keys) that the Functions runtime uses to secure HTTP-triggered endpoints. Configure a storage backend where the runtime stores and retrieves these keys.

This article covers both scenarios.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.40.0 or higher.
- An existing [Azure Functions app in Container Apps](functions-usage.md) or permissions to create one.

## Store app-level secrets

Azure Container Apps provides two ways to store secrets that your function code consumes:

| Approach | Best for | Centralized management | Automatic rotation | Audit logging |
|--|--|--|--|--|
| **Container Apps secrets** | Simple, single-app scenarios | No — scoped to one app | No | Activity logs only |
| **Key Vault references** | Production workloads | Yes — across all apps | Yes | Comprehensive |

> [!TIP]
> Use Container Apps secrets for development and simple workloads. Use Key Vault references for production workloads that need centralized management, automatic rotation, or compliance-grade auditing.

## Use Container Apps secrets

### Store a secret in Container Apps

Container Apps stores secrets in the app's `configuration.secrets` array. The platform encrypts values at rest. You can reference secrets defined here in environment variables, scale rules, volume mounts, and Dapr components.

#### [Portal](#tab/portal)

1. Go to your Functions container app in the [Azure portal](https://portal.azure.com).

1. Under *Settings*, select **Secrets**.

1. Select **Add**.

1. In *Add secret*, enter the following values:

    | Property | Value |
    |---|---|
    | **Name** | A secret name, such as `database-password`. Use lowercase letters, numbers, and hyphens only. |
    | **Type** | **Container Apps Secret** |
    | **Value** | Your secret value. |

1. Select **Add**.

#### [Azure CLI](#tab/cli)

Add a secret when you create your Functions container app:

```azurecli
az containerapp create \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --environment "<ENVIRONMENT_NAME>" \
  --image "<CONTAINER_IMAGE>" \
  --kind functionapp \
  --secrets "database-password=<YOUR_SECRET_VALUE>"
```

Or add a secret to an existing app:

```azurecli
az containerapp secret set \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --secrets "database-password=<YOUR_SECRET_VALUE>"
```

---

### Reference the secret in an environment variable

After you store a secret, reference it in an environment variable so your function code can read it.

#### [Portal](#tab/portal)

1. In your Functions container app, under *Application*, select **Revisions and replicas**.

1. Select **Create new revision**.

1. In the *Container* tab, select your container, and then select **Edit**.

1. Select the **Environment variables** tab, and then select **Add**.

1. Enter the following values:

    | Property | Value |
    |---|---|
    | **Name** | `DATABASE_PASSWORD` |
    | **Source** | **Reference a secret** |
    | **Value** | `database-password` |

1. Select **Save**, and then select **Create** to deploy the new revision.

#### [Azure CLI](#tab/cli)

```azurecli
az containerapp update \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --set-env-vars "DATABASE_PASSWORD=secretref:database-password"
```

---

### Verify the Container Apps secret

Confirm your function can read the secret value by invoking the function and checking that it runs without errors related to missing configuration.

```bash
curl "https://<FUNCTIONS_APP_URL>/api/<FUNCTION_NAME>"
```

> [!IMPORTANT]
> Container Apps injects the secret value into the environment variable at runtime. Your code reads the environment variable and doesn't access the secret store directly.

### Limitations of Container Apps secrets

- **No centralization**: Each container app stores its own secrets separately.
- **No automatic rotation**: You must update secret values manually.
- **No expiration**: Secrets don't expire automatically.
- **Limited audit**: Basic activity logs only; no detailed secret access auditing.
- **No versioning**: No built-in secret version history.
- **Update behavior**: Changing a secret doesn't create a new revision. You must create a new revision or restart existing revisions to pick up changes.

## Use Key Vault references

### Set up managed identity

Your container app needs a managed identity to authenticate to Key Vault without credentials.

#### [Portal](#tab/portal)

1. Go to your Functions container app in the [Azure portal](https://portal.azure.com).

1. Under *Settings*, select **Identity**.

1. In the *System assigned* tab, set *Status* to **On**.

1. Select **Save**, and then select **Yes** to confirm.

#### [Azure CLI](#tab/cli)

```azurecli
az containerapp identity assign \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --system-assigned
```

---

### Grant Key Vault access

Assign the **Key Vault Secrets User** role to the managed identity so it can read secrets.

#### [Portal](#tab/portal)

1. Go to your Key Vault in the [Azure portal](https://portal.azure.com).

1. Under *Settings*, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

1. On the *Role* tab, select **Key Vault Secrets User**.

1. Select **Next**.

1. On the *Members* tab, select **Managed identity**, and then select **Select members**.

1. In the *Select managed identities* pane, select your subscription, choose **Container App** for the managed identity type, select your Functions container app, and then select **Select**.

1. Select **Review + assign**.

#### [Azure CLI](#tab/cli)

```azurecli
PRINCIPAL_ID=$(az containerapp show \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --query identity.principalId \
  --output tsv)

KEYVAULT_ID=$(az keyvault show \
  --name "<KEYVAULT_NAME>" \
  --query id \
  --output tsv)

az role assignment create \
  --role "Key Vault Secrets User" \
  --assignee "$PRINCIPAL_ID" \
  --scope "$KEYVAULT_ID"
```

---

### Store a secret in Key Vault

#### [Portal](#tab/portal)

1. In your Key Vault, under *Objects*, select **Secrets**.

1. Select **Generate/Import**.

1. Enter the following values:

    | Property | Value |
    |---|---|
    | **Upload options** | **Manual** |
    | **Name** | A secret name, for example `DatabasePassword`. |
    | **Value** | Your secret value. |

1. Select **Create**.

1. Select your newly created secret, then select the current version.

1. Copy the **Secret Identifier** URI. Use the versionless URI (without the trailing version segment) to enable automatic rotation.

#### [Azure CLI](#tab/cli)

```azurecli
az keyvault secret set \
  --vault-name "<KEYVAULT_NAME>" \
  --name "DatabasePassword" \
  --value "<YOUR_SECRET_VALUE>"

SECRET_URI=$(az keyvault secret show \
  --vault-name "<KEYVAULT_NAME>" \
  --name "DatabasePassword" \
  --query id \
  --output tsv)

echo $SECRET_URI
```

---

### Reference the Key Vault secret in Container Apps

Create a Container Apps secret that references the Key Vault secret, then bind it to an environment variable.

#### [Portal](#tab/portal)

1. Go to your Functions container app. Under *Settings*, select **Secrets**.

1. Select **Add**.

1. In *Add secret*, enter the following values:

    | Property | Value |
    |---|---|
    | **Name** | `database-password` |
    | **Type** | **Key Vault reference** |
    | **Key Vault secret URL** | The Secret Identifier URI you copied. |
    | **Identity** | **System assigned** (or your user-assigned identity). |

1. Select **Add**.

1. Under *Application*, select **Revisions and replicas**. Create a new revision with the environment variable `DATABASE_PASSWORD` referencing the `database-password` secret.

#### [Azure CLI](#tab/cli)

For system-assigned identity:

```azurecli
az containerapp secret set \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --secrets "database-password=keyvaultref:<SECRET_URI>,identityref:system"
```

For user-assigned identity:

```azurecli
az containerapp secret set \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --secrets "database-password=keyvaultref:<SECRET_URI>,identityref:<IDENTITY_RESOURCE_ID>"
```

Then reference the secret in an environment variable:

```azurecli
az containerapp update \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --set-env-vars "DATABASE_PASSWORD=secretref:database-password"
```

---

### Verify the Key Vault secret

Invoke your function and confirm it runs without errors related to missing configuration:

```bash
curl "https://<FUNCTIONS_APP_URL>/api/<FUNCTION_NAME>"
```

### Automatic secret rotation

When you reference a Key Vault secret with a versionless URI, Container Apps automatically retrieves the latest version:

- **Versionless URI**: `https://myvault.vault.azure.net/secrets/mysecret` — always uses the latest version
- **Versioned URI**: `https://myvault.vault.azure.net/secrets/mysecret/ec96f020...` — pinned to a specific version

With versionless URIs, Container Apps checks for new versions within 30 minutes and automatically restarts active revisions to pick up the new value.

---

## Store and manage Functions host keys

Functions host keys provide authentication for HTTP-triggered endpoints. The Functions runtime manages three types of keys:

- **Master key**: Administrative key with full access to all functions and management endpoints.
- **Host keys**: Shared across all functions in the app.
- **Function keys**: Scoped to individual functions.

You configure a storage backend to determine where the runtime stores these keys. Azure Container Apps supports two backend options:

| Backend | Auto-generates keys | Centralized management | Configuration |
|---------|--------------------|-----------------------|---------------|
| **Azure Blob Storage** | Yes | Shared across instances | `AzureWebJobsSecretStorageType=blob` |
| **Azure Key Vault** | No - you trigger creation manually | Yes - enterprise-grade | `AzureWebJobsSecretStorageType=keyvault` |

### Configure Blob Storage for host keys

The Blob Storage backend lets the Functions runtime auto-generate and manage host keys. This option is simplest when you already have a storage account for `AzureWebJobsStorage`.

1. Enable managed identity on your container app (see [Set up managed identity](#set-up-managed-identity) earlier in this article).

1. Grant the **Storage Blob Data Contributor** role on the storage account to the managed identity.

    ```azurecli
    PRINCIPAL_ID=$(az containerapp show \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --query identity.principalId \
      --output tsv)

    STORAGE_ID=$(az storage account show \
      --name "<STORAGE_ACCOUNT_NAME>" \
      --resource-group "<RESOURCE_GROUP>" \
      --query id \
      --output tsv)

    az role assignment create \
      --role "Storage Blob Data Contributor" \
      --assignee "$PRINCIPAL_ID" \
      --scope "$STORAGE_ID"
    ```

1. Configure the secret storage type:

    ```azurecli
    az containerapp update \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --set-env-vars \
        "AzureWebJobsSecretStorageType=blob"
    ```

1. The Functions runtime auto-generates keys on the next cold start. List them to verify:

    ```azurecli
    az containerapp function keys list \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --key-type hostKey
    ```

### Configure Key Vault for host keys

The Key Vault backend stores host keys as Key Vault secrets, providing enterprise-grade auditing and access control.

1. Create a Key Vault (if you don't have one):

    ```azurecli
    az keyvault create \
      --name "<KEYVAULT_NAME>" \
      --resource-group "<RESOURCE_GROUP>" \
      --location "<LOCATION>"
    ```

1. Enable managed identity on your container app (see [Set up managed identity](#set-up-managed-identity) earlier in this article).

1. Grant the **Key Vault Secrets Officer** role to the managed identity. The runtime needs read and write access to create and manage keys.

    ```azurecli
    PRINCIPAL_ID=$(az containerapp show \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --query identity.principalId \
      --output tsv)

    KEYVAULT_ID=$(az keyvault show \
      --name "<KEYVAULT_NAME>" \
      --query id \
      --output tsv)

    az role assignment create \
      --role "Key Vault Secrets Officer" \
      --assignee "$PRINCIPAL_ID" \
      --scope "$KEYVAULT_ID"
    ```

1. Configure the Functions app to use Key Vault for key storage:

    ```azurecli
    az containerapp update \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --set-env-vars \
        "AzureWebJobsSecretStorageType=keyvault" \
        "AzureWebJobsSecretStorageKeyVaultUri=https://<KEYVAULT_NAME>.vault.azure.net"
    ```

1. Trigger key creation by listing keys:

    ```azurecli
    az containerapp function keys list \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --key-type hostKey
    ```

### Manage host keys

Regardless of backend, use the following commands to list, create, and delete host keys:

```azurecli
# List all host keys
az containerapp function keys list \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --key-type hostKey

# Create a custom host key
az containerapp function keys set \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --key-name "MyCustomKey" \
  --key-value "<YOUR_KEY_VALUE>" \
  --key-type hostKey

# Delete a host key
az containerapp function keys delete \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --key-name "MyCustomKey" \
  --key-type hostKey
```

### Call a function with a host key

Pass the key as a query parameter or header:

```bash
# Query parameter
curl "https://<FUNCTIONS_APP_URL>/api/<FUNCTION_NAME>?code=<HOST_KEY>"

# Header
curl "https://<FUNCTIONS_APP_URL>/api/<FUNCTION_NAME>" \
  -H "x-functions-key: <HOST_KEY>"
```

## Clean up resources

If you created resources specifically for this walkthrough and you no longer need them, delete the resource group:

```azurecli
az group delete \
  --name "<RESOURCE_GROUP>" \
  --yes --no-wait
```

## Related content

- [Manage secrets in Azure Container Apps](manage-secrets.md)
- [Azure Functions on Azure Container Apps overview](functions-overview.md)
- [Use Azure Functions in Azure Container Apps](functions-usage.md)
- [Manage Functions keys](functions-manage.md)
- [Managed identities in Container Apps](managed-identity.md)
- [Azure Key Vault developer guide](/azure/key-vault/general/developers-guide)
- [Use managed identity for passwordless connections](/azure/app-service/overview-managed-identity)
