---
#customer intent: As a developer, I want to securely store and access app-level secrets in my Azure Functions app on Azure Container Apps.
title: Store app-level secrets for Azure Functions on Azure Container Apps
description: Learn how to store and reference app-level secrets using Container Apps secrets or Azure Key Vault references for Azure Functions on Azure Container Apps.
author: deepganguly
ms.author: deepganguly
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 04/28/2026
---

# Store app-level secrets for Azure Functions on Azure Container Apps

App-level secrets are configuration values that your function code and bindings consume at runtime. Unlike [Functions access keys](functions-secrets-host-keys.md), which secure HTTP endpoints, app-level secrets are the credentials your application needs to connect to other services.

Common examples include:

- **Infrastructure connections** - `AzureWebJobsStorage` connection strings, trigger and binding connections for Event Hubs, Service Bus, Cosmos DB, and SQL.
- **Business credentials** - third-party API keys, database passwords, SaaS platform tokens.
- **Custom configuration** - any sensitive value your code reads from environment variables.

## Choose a storage option

Azure Container Apps gives you two ways to store app-level secrets:

| Option | Best for | Centralized management | Automatic rotation | Audit logging |
|--------|---------|----------------------|-------------------|---------------|
| **Container Apps secrets** | Dev/test, simple single-app workloads | No - scoped to one app | No | Activity logs only |
| **Key Vault references** | Production, multi-app, compliance | Yes - across all apps | Yes (versionless URI) | Full Key Vault diagnostics |

> [!TIP]
> Start with Container Apps secrets for simplicity. Move to Key Vault references when you need centralized management, automatic rotation, or compliance-grade auditing.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.40.0 or higher.
- An existing [Azure Functions app in Container Apps](functions-usage.md) or permissions to create one.

## Use Container Apps secrets

Container Apps stores secrets in the app's `configuration.secrets` array and encrypts values at rest. You can reference secrets in environment variables, scale rules, volume mounts, and Dapr components.

### Store a secret

#### [Portal](#tab/portal)

1. Go to your Functions container app in the [Azure portal](https://portal.azure.com).

1. Under *Settings*, select **Secrets**.

1. Select **Add** and enter the following values:

    | Property | Value |
    |---|---|
    | **Name** | A secret name such as `database-password`. Use lowercase letters, numbers, and hyphens only. |
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

### Verify the secret

Confirm your function can read the secret value by invoking the function and checking that it runs without errors related to missing configuration.

```bash
curl "https://<FUNCTIONS_APP_URL>/api/<FUNCTION_NAME>"
```

> [!IMPORTANT]
> Container Apps injects the secret value into the environment variable at runtime. Your code reads the environment variable and doesn't access the secret store directly.

### Limitations

Container Apps secrets have the following limitations:

- **No centralization** - each container app stores its own secrets separately.
- **No automatic rotation** - you must update secret values manually.
- **No expiration** - secrets don't expire automatically.
- **Limited audit** - basic activity logs only; no detailed secret access auditing.
- **No versioning** - no built-in secret version history.
- **Update behavior** - changing a secret doesn't trigger a new revision. You must create a new revision or restart existing revisions to pick up changes.

## Use Key Vault references

Key Vault references let your container app pull secrets directly from Azure Key Vault using a managed identity. This approach gives you centralized management, automatic rotation, and compliance-grade auditing.

### Step 1: Set up managed identity

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

### Step 2: Grant Key Vault access

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

### Step 3: Store a secret in Key Vault

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

### Step 4: Reference the Key Vault secret in Container Apps

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

### Step 5: Verify the Key Vault reference

Invoke your function and confirm it runs without errors related to missing configuration.

```bash
curl "https://<FUNCTIONS_APP_URL>/api/<FUNCTION_NAME>"
```

### Automatic secret rotation

When you reference a Key Vault secret with a versionless URI, Container Apps automatically retrieves the latest version:

- **Versionless URI**: `https://myvault.vault.azure.net/secrets/mysecret` - always uses the latest version.
- **Versioned URI**: `https://myvault.vault.azure.net/secrets/mysecret/ec96f020...` - pinned to a specific version.

With versionless URIs, Container Apps checks for new versions within 30 minutes and automatically restarts active revisions to pick up the new value.

## Related content

- [Functions secrets overview](functions-secrets-tutorial.md)
- [Configure Functions host key storage](functions-secrets-host-keys.md)
- [Manage secrets in Azure Container Apps](manage-secrets.md)
- [Managed identities in Container Apps](managed-identity.md)
- [Azure Key Vault developer guide](/azure/key-vault/general/developers-guide)
