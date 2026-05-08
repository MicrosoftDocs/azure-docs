---
#customer intent: As a developer, I want to configure durable storage for Functions host keys on Azure Container Apps so my HTTP-triggered functions stay secured across restarts.
title: Configure Functions host key storage on Azure Container Apps
description: Choose and configure a storage backend for Functions host keys - Container Apps secret store, Key Vault, or Blob Storage - for Azure Functions on Azure Container Apps.
author: deepganguly
ms.author: deepganguly
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 04/28/2026
---

# Configure Functions host key storage on Azure Container Apps

Functions [access keys](/azure/azure-functions/function-keys-how-to#understand-keys) are authentication tokens that the Functions runtime uses to secure HTTP-triggered endpoints. When a caller invokes an HTTP function, it includes a key as a `?code=` query parameter or an `x-functions-key` header. The runtime validates the key and authorizes or rejects the request.

Access keys aren't the same as [app-level secrets](functions-secrets-app-level.md). Access keys protect **who can call your functions**, while app-level secrets protect **what your functions connect to**.

## When to use access keys

| Scenario | Why access keys fit |
|----------|------------------|
| **Third-party webhooks** | Providers like GitHub, Stripe, or Twilio call your function via a URL and secret. Access keys slot directly into the `?code=` pattern they expect. |
| **Service-to-service calls** | Backend service A calls Function B over HTTP. A shared key is simpler than setting up Microsoft Entra app registrations for internal-only calls. |
| **Event Grid subscriptions** | Event Grid validates and calls your function endpoint using a **system key** that the platform manages automatically. |
| **Dev/test authentication** | During development you need basic authentication without configuring full OAuth/OIDC. Access keys provide a low-friction auth gate with no identity config. |
| **Migration compatibility** | Existing Azure Functions apps already use access keys. When migrating to Container Apps, you need the same key-based auth to avoid breaking callers. |

> [!NOTE]
> For user-facing APIs, zero-trust workloads, or per-user authorization scenarios, use Microsoft Entra ID / OAuth 2.0 instead of access keys. Access keys are shared secrets with no identity-level audit trail.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.40.0 or higher.
- An existing [Azure Functions app in Container Apps](functions-usage.md) or permissions to create one.

## Access key types

The Functions runtime manages four types of keys:

| Key type | Scope | Purpose |
|----------|-------|---------|
| **Master key** (`_master`) | Entire function app | Admin-level access to all functions and `/admin/*` management endpoints. Can't be revoked, only rotated. |
| **Host keys** (`default` + custom) | Entire function app | Authorize calls to any HTTP-triggered function in the app. |
| **Function keys** (`default` + custom) | Single function | Authorize calls to one specific function. Provides more granular control than host keys. |
| **System keys** | Extension endpoints | Used by platform extensions such as Event Grid webhook subscriptions and Durable Functions. Managed automatically. |

## Secret name patterns

The naming convention for stored keys depends on the storage backend.

### Key Vault

The Key Vault backend stores each key as an individual Key Vault secret using a double-dash (`--`) convention:

| Key type | Secret name pattern | Example |
|--|--|--|--|
| Master key | `host--masterKey--master` |`host--masterKey--master` |
| Function key (default) |`host--functionKey--default` |`host--functionKey--default` |
| Function key (custom) |`host--functionKey--<name>` | `host--functionKey--MyApiClient` |
| System key | `host--systemKey--<extension>` | `host--systemKey--eventgrid_extension` |
| Per-function key | `function--<functionName>--<keyName>` | `function--myhttpfunc--default` |

### Blob Storage

The Blob Storage backend stores keys as JSON files in the `azure-webjobs-secrets` blob container. All host-level keys (master, function keys, and system keys) are stored together in a single `host.json` blob. Per-function keys are stored in separate blobs named after each function.

| Blob path | Contents |
|-----------|----------|
| `<siteSlotName>/host.json` | JSON file containing `masterKey`, `functionKeys`, and `systemKeys` |
| `<siteSlotName>/<functionName>.json` | JSON file containing keys for a specific function |

### Container Apps secret store

The Container Apps secret store uses a different convention. The Functions host reads keys from volume-mounted files at `/run/secrets/functions-keys/`. Each file uses a **dotted** name (for example, `host.master`), but Container Apps secret names only allow **lowercase alphanumeric characters and dashes**. When you mount a secret volume, you must explicitly set the `path` field to the dotted file name the Functions host expects (for example, `secretRef: host-master` → `path: host.master`). The platform doesn't perform any automatic name translation.

| Key type | Container Apps secret name (dashes) | Volume mount `path` (dots) |
|----------|--------------------------|--------------------------|
| Master key | `host-master` | `host.master` |
| Default host key | `host-function-default` | `host.function.default` |
| Custom host key | `host-function-<name>` | `host.function.<name>` |
| Default function key for a specific function | `functions-<functionname>-default` | `functions.<functionName>.default` |
| Custom function key for a specific function | `functions-<functionname>-<keyname>` | `functions.<functionName>.<keyName>` |
| System key | `host-systemkey-<extension>` | `host.systemKey.<extension>` |

> [!TIP]
> When troubleshooting, search for these patterns in your backend store to verify that keys are configured correctly.

## Choose a storage backend

Set the `AzureWebJobsSecretStorageType` environment variable to control where the runtime persists access keys. Azure Container Apps supports three production-grade backends.

> [!IMPORTANT]
> For production workloads, prefer backends in this order: Container Apps secret store (`containerapp`) > Azure Key Vault (`keyvault`) > Azure Blob Storage (`blob`). The Container Apps secret store has no external dependencies and is the simplest to operate.

| Backend | Setting value | Auto-generates keys | External dependency | Best for |
|---------|--------------|--------------------|--------------------|----------|
| **Container Apps secret store** | `containerapp` | No - you provision keys as Container Apps secrets | None | Most workloads (**Recommended**) |
| **Azure Key Vault** | `keyvault` | No - trigger creation manually | Key Vault instance | Centralized governance, compliance auditing |
| **Azure Blob Storage** | `blob` | Yes | Storage account | Legacy apps or existing `AzureWebJobsStorage` account |

> [!WARNING]
> Don't set `AzureWebJobsSecretStorageType` to `files`. On Azure Container Apps, the file system is **ephemeral**, so host keys stored with the `files` backend are lost every time the app scales to zero, restarts, or deploys a new revision. Always use one of the three production backends listed above.

## Configure the Container Apps secret store

The Container Apps secret store is the recommended backend. Keys stay within the Container Apps platform and require no external storage or Key Vault. Azure Resource Manager activity logs track changes to secrets and environment variables.

With this backend, the Functions host reads keys from files volume-mounted at `/run/secrets/functions-keys/`. The host **doesn't auto-generate keys**. You must create each key as a Container Apps secret, and the platform mounts them as files for the host to read.

> [!IMPORTANT]
> The Container Apps secret store is **read-only from the host's perspective**. The host reads the mounted key files but never writes to them. If a required key is missing, the host doesn't generate it automatically.

### Step 1: Set the storage type

#### [Portal](#tab/portal)

1. Go to your Functions container app in the [Azure portal](https://portal.azure.com).

1. Under *Settings*, select **Environment variables**.

1. Select **Add**, and enter the following values:

    | Property | Value |
    |---|---|
    | **Name** | `AzureWebJobsSecretStorageType` |
    | **Value** | `containerapp` |

1. Select **Save**, and then select **Apply** to confirm the changes.

#### [Azure CLI](#tab/cli)

```azurecli
az containerapp update \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --set-env-vars "AzureWebJobsSecretStorageType=containerapp"
```

---

### Step 2: Generate and store access key secrets

Generate key values and store them as Container Apps secrets. At minimum, you need the **master key** and a **default host key**.

#### [Portal](#tab/portal)

1. In your Functions container app, under *Settings*, select **Secrets**.

1. Select **Add** and enter the following values:

    | Property | Value |
    |---|---|
    | **Name** | `host-master` |
    | **Type** | **Container Apps Secret** |
    | **Value** | A randomly generated key value. |

1. Select **Add**.

1. Repeat for `host-function-default` with another randomly generated value.

1. To add a per-function key, add a secret named `functions-<functionname>-default` (all lowercase).

#### [Azure CLI](#tab/cli)

```azurecli
# Generate random key values
MASTER_KEY=$(openssl rand -hex 32)
HOST_DEFAULT_KEY=$(openssl rand -hex 32)

# Store as Container Apps secrets
az containerapp secret set \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --secrets "host-master=$MASTER_KEY" "host-function-default=$HOST_DEFAULT_KEY"
```

To add a per-function key (for example, for a function named `MyHttpFunc`):

```azurecli
FUNC_KEY=$(openssl rand -hex 32)

az containerapp secret set \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --secrets "functions-myhttpfunc-default=$FUNC_KEY"
```

---

> [!NOTE]
> Container Apps secret names only allow lowercase alphanumeric characters and dashes. You must explicitly set the `path` field in the volume configuration to the dotted file name the Functions host expects (for example, `secretRef: host-master` → `path: host.master`). Without an explicit `path`, the file on disk retains the dashed name and the Functions host won't find the key.

### Step 3: Configure the volume mount

Mount the secrets as files at `/run/secrets/functions-keys/`.

#### [Portal](#tab/portal)

1. In your Functions container app, under *Application*, select **Revisions and replicas**.

1. Select **Create new revision**.

1. In the *Scale and volumes* tab, under *Volumes*, select **Add**.

1. Enter the following values:

    | Property | Value |
    |---|---|
    | **Volume type** | **Secret** |
    | **Name** | `functions-keys` |

1. For each secret, set the **Path** field to the dotted file name the Functions host expects (for example, set `host-master` to path `host.master`, and `host-function-default` to path `host.function.default`).

1. Select **Add**.

1. In the *Container* tab, select your container and then select **Edit**.

1. Select the **Volume mounts** tab and select **Add**.

1. Enter the following values:

    | Property | Value |
    |---|---|
    | **Volume name** | `functions-keys` |
    | **Mount path** | `/run/secrets/functions-keys` |

1. Select **Save**, and then select **Create** to deploy the new revision.

#### [Azure CLI](#tab/cli)

Export your app's YAML, add the volume and volume mount, then apply:

```azurecli
# Export current config
az containerapp show \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --output yaml > app.yaml
```

Edit `app.yaml` to add the volume and volume mount under the appropriate sections:

```yaml
properties:
  template:
    volumes:
      - name: functions-keys
        storageType: Secret
        secrets:
          - secretRef: host-master
            path: host.master
          - secretRef: host-function-default
            path: host.function.default
    containers:
      - name: <CONTAINER_NAME>
        volumeMounts:
          - volumeName: functions-keys
            mountPath: /run/secrets/functions-keys
```

Apply the updated config:

```azurecli
az containerapp update \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --yaml app.yaml
```

---

### Step 4: Verify

After the app restarts, confirm the keys are working:

```azurecli
az containerapp function keys list \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --key-type hostKey
```

You can also check the app logs for the message `Resolved secret storage provider ContainerAppsSecretsRepository`, which confirms the host is using the Container Apps secret store.

### Rotate keys

To rotate a key, update the Container Apps secret and restart the app:

```azurecli
NEW_KEY=$(openssl rand -hex 32)

az containerapp secret set \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --secrets "host-function-default=$NEW_KEY"

az containerapp revision restart \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --revision "<REVISION_NAME>"
```

> [!NOTE]
> All replicas share the same mounted secrets. After a restart, every replica picks up the updated key values.

## Configure Blob Storage

The Blob Storage backend enables the runtime to auto-generate and manage access keys. Use this option when you already have a storage account for `AzureWebJobsStorage` and don't need centralized governance.

1. Enable managed identity on your container app (if not already enabled):

    ```azurecli
    az containerapp identity assign \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --system-assigned
    ```

1. Grant the **Storage Blob Data Contributor** role on the storage account to the managed identity:

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

1. Set the storage type:

    ```azurecli
    az containerapp update \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --set-env-vars "AzureWebJobsSecretStorageType=blob"
    ```

1. The runtime auto-generates keys on the next cold start. Verify:

    ```azurecli
    az containerapp function keys list \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --key-type hostKey
    ```

## Configure Key Vault

The Key Vault backend stores access keys as Key Vault secrets, providing enterprise-grade auditing and access control.

1. Create a Key Vault (if you don't have one):

    ```azurecli
    az keyvault create \
      --name "<KEYVAULT_NAME>" \
      --resource-group "<RESOURCE_GROUP>" \
      --location "<LOCATION>"
    ```

1. Enable managed identity on your container app (if not already enabled):

    ```azurecli
    az containerapp identity assign \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --system-assigned
    ```

1. Grant the **Key Vault Secrets Officer** role to the managed identity. The runtime needs read and write access to create and manage keys:

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

1. Set the storage type and Key Vault URI:

    For system-assigned identity:

    ```azurecli
    az containerapp update \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --set-env-vars \
        "AzureWebJobsSecretStorageType=keyvault" \
        "AzureWebJobsSecretStorageKeyVaultUri=https://<KEYVAULT_NAME>.vault.azure.net"
    ```

    For user-assigned identity, also set the client ID:

    ```azurecli
    az containerapp update \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --set-env-vars \
        "AzureWebJobsSecretStorageType=keyvault" \
        "AzureWebJobsSecretStorageKeyVaultUri=https://<KEYVAULT_NAME>.vault.azure.net" \
        "AzureWebJobsSecretStorageKeyVaultClientId=<USER_ASSIGNED_IDENTITY_CLIENT_ID>"
    ```

1. Trigger key creation by listing keys:

    ```azurecli
    az containerapp function keys list \
      --resource-group "<RESOURCE_GROUP>" \
      --name "<FUNCTIONS_APP_NAME>" \
      --key-type hostKey
    ```

## Manage access keys

Regardless of backend, use the following commands to list, create, and delete access keys:

```azurecli
# List all host keys
az containerapp function keys list \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --key-type hostKey

# List the master key
az containerapp function keys list \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --key-type masterKey

# Create or overwrite a custom host key
az containerapp function keys set \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --key-name "MyCustomKey" \
  --key-value "<YOUR_KEY_VALUE>" \
  --key-type hostKey

# Show a specific key
az containerapp function keys show \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --key-name "<KEY_NAME>" \
  --key-type hostKey

# Delete a host key
az containerapp function keys delete \
  --resource-group "<RESOURCE_GROUP>" \
  --name "<FUNCTIONS_APP_NAME>" \
  --key-name "MyCustomKey" \
  --key-type hostKey
```

## Call a function with an access key

Pass the key as a query parameter or request header.

```bash
# Query parameter
curl "https://<FUNCTIONS_APP_URL>/api/<FUNCTION_NAME>?code=<HOST_KEY>"

# Header
curl "https://<FUNCTIONS_APP_URL>/api/<FUNCTION_NAME>" \
  -H "x-functions-key: <HOST_KEY>"
```

## Related content

- [Functions secrets overview](functions-secrets-tutorial.md)
- [Store app-level secrets](functions-secrets-app-level.md)
- [Manage secrets in Azure Container Apps](manage-secrets.md)
- [Manage Functions keys](functions-manage.md)
- [Managed identities in Container Apps](managed-identity.md)
- [Azure Functions on Azure Container Apps overview](functions-overview.md)
