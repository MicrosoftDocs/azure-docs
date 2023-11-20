---
author: msangapu-msft
ms.service: app-service
ms.topic: include
ms.date: 08/24/2023
ms.author: msangapu
---

> [!NOTE]
> You can also [configure Azure Storage in an ARM template](https://github.com/Azure/app-service-linux-docs/blob/master/BringYourOwnStorage/BYOS_azureFiles.json).
>

This guide shows how to mount Azure Storage as a network share in a built-in Linux container or a custom Linux container in App Service. Azure Storage is Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers highly available, massively scalable, durable, and secure storage for a variety of data objects in the cloud. Azure Storage is non-default storage for App Service and billed separately.

The benefits of custom-mounted storage include:
- Configure persistent storage for your App Service app and manage the storage separately.
- Make static content like video and images readily available for your App Service app. 
- Write application log files or archive older application log to Azure File shares.  
- Share content across multiple apps or with other Azure services.

The following features are supported for Linux containers:
- Azure Files (read/write).
- Azure Blobs (read-only).
- Up to five mount points per app.

Here are the three options to mount Azure storage to your app:

| Mounting option | Usage |
|--------------------------|-------------|
|Basic|Choose this option when mounting storage using the Azure portal. You can use the basic option as long as the storage account isn't using [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network), [private endpoints](../../../storage/common/storage-private-endpoints.md), or [Azure Key Vault](../../../key-vault/general/overview.md). In this case, the portal gets and stores the access key for you.|
|Access Key|If you plan to mount storage using the Azure CLI, you need to obtain an access key. Choose this option storage account isn't using [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network), [private endpoints](../../../storage/common/storage-private-endpoints.md), or [Azure Key Vault](../../../key-vault/general/overview.md).|
|Key Vault|Also use this option when you plan to mount storage using the Azure CLI, which requires the access key. Choose this option when using Azure Key Vault to securely store and retrieve access keys. [Azure Key Vault](../../../key-vault/general/overview.md) has the benefits of storing application secrets centrally and securely with the ability to monitor, administer, and integrate with other Azure services like Azure App Service.|

## Prerequisites

### [Basic](#tab/basic)

- An existing [App Service on Linux app](../../index.yml).
- An [Azure Storage account](../../../storage/common/storage-account-create.md?tabs=azure-cli).
- An [Azure file share and directory](../../../storage/files/storage-how-to-use-files-portal.md). 

### [Access Key](#tab/access-key)

- An existing [App Service on Linux app](../../index.yml).
- An [Azure Storage account](../../../storage/common/storage-account-create.md?tabs=azure-cli).
- An [Azure file share and directory](../../../storage/files/storage-how-to-use-files-portal.md). 

### [Key Vault](#tab/key-vault)

- An existing [App Service on Linux app](../../index.yml).
- An [Azure Storage account](../../../storage/common/storage-account-create.md?tabs=azure-cli).
- An [Azure file share and directory](../../../storage/files/storage-how-to-use-files-portal.md). 
- An [Azure Key Vault](../../../key-vault/general/overview.md) instance using the [vault access policy](../../../key-vault/general/assign-access-policy.md?WT.mc_id=Portal-Microsoft_Azure_KeyVault&tabs=azure-portal) and a [secret](../../../key-vault/secrets/quick-create-portal.md), which is required to configure the Key Vault with Azure Storage.

---

## Limitations

- [Storage firewall](../../../storage/common/storage-network-security.md) is supported only through [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) and [private endpoints](../../../storage/common/storage-private-endpoints.md) (when [VNET integration](../../overview-vnet-integration.md) is used).
- FTP/FTPS access to custom-mounted storage isn't supported (use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)).
- Azure CLI, Azure PowerShell, and Azure SDK support is in preview.
- Mapping `/` or `/home` to custom-mounted storage isn't supported.
- Don't map the storage mount to `/tmp` or its subdirectories as this action may cause a timeout during app startup.
- Azure Storage isn't supported with [Docker Compose](../../configure-custom-container.md?pivots=container-linux#docker-compose-options) scenarios.
- Storage mounts aren't included in [backups](../../manage-backup.md). Be sure to follow best practices to back up the Azure Storage accounts.
- Azure Files [NFS](../../../storage/files/files-nfs-protocol.md) is currently unsupported for App Service on Linux. Only Azure Files [SMB](../../../storage/files/files-smb-protocol.md) are supported.
- With VNET integration on your app, the mounted drive uses an RFC1918 IP address and not an IP address from your VNET.

## Prepare for mounting


### [Basic](#tab/basic)

No extra steps are required because the portal gets and stores the access key for you. 

### [Access Key](#tab/access-key)

You need to obtain the access key from your storage account.

### [Key Vault](#tab/key-vault)

Before you can mount storage using Key Vault access, you need to get the Key Vault secret and add it as an application setting in your app.  

1. In the portal, browse to your Key Vault secret and copy the **Secret Identifier** into your clipboard.
:::image type="content" source="../../media/configure-azure-storage/key-vault-secret-identifier.png" alt-text="Screenshot of Key Vault secret identifier.":::

1. Back in your app, follow the [key vault reference](../../app-service-key-vault-references.md#source-app-settings-from-key-vault) to create an [**application setting**](../../configure-common.md#configure-app-settings) using the **Secret Identifier**.

    Example app setting value: `@Microsoft.KeyVault(SecretUri=https://mykeyvault.vault.azure.net/secrets/mykeyvaultsecret/1192426x947d4e37843e14rf3937dcc3)`

Now you're ready to use Key Vault to access your storage account.

---


## Mount storage to Linux container

The way that you mount storage depends on your storage access option and whether you are using the portal or the Azure CLI.

# [Azure portal](#tab/portal/basic)

1. In the [Azure portal](https://portal.azure.com), navigate to the app.
1. From the left navigation, click **Configuration** > **Path Mappings** > **New Azure Storage Mount**. 
1. Configure the storage mount according to the following table. When finished, click **OK**.

    | Setting | Description |
    |-|-|
    | **Name** | Name of the mount configuration. Spaces aren't allowed. |
    | **Configuration options** | Select **Basic**. if the storage account isn't using [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network), [private endpoints](../../../storage/common/storage-private-endpoints.md), or [Azure Key Vault](../../../key-vault/general/overview.md). Otherwise, select **Advanced**. |
    | **Storage accounts** | Azure Storage account. |
    | **Storage type** | Select the type based on the storage you want to mount. Azure Blobs only supports read-only access. |
    | **Storage container** or **Share name** | Files share or Blobs container to mount. |
    | **Mount path** | Directory inside the Linux container to mount to Azure Storage. Don't use `/` or `/home`.|
    | **Deployment slot setting** | When checked, the storage mount settings also apply to deployment slots.|

# [Azure portal](#tab/portal/access-key)

1. In the [Azure portal](https://portal.azure.com), navigate to the app.
1. From the left navigation, click **Configuration** > **Path Mappings** > **New Azure Storage Mount**. 
1. Configure the storage mount according to the following table. When finished, click **OK**.

    | Setting | Description |
    |-|-|
    | **Name** | Name of the mount configuration. Spaces aren't allowed. |
    | **Configuration options** | Select  **Advanced**. |
    | **Storage accounts** | Azure Storage account. |
    | **Storage type** | Select the type based on the storage you want to mount. Azure Blobs only supports read-only access. |
    | **Storage container** or **Share name** | Files share or Blobs container to mount. |
    | **Storage access** | Select **Manual input**. |
    | **Access key** | Enter the [access key](../../../storage/common/storage-account-keys-manage.md) for your storage account. |
    | **Mount path** | Directory inside the Linux container to mount to Azure Storage. Don't use `/` or `/home`.|
    | **Deployment slot setting** | When checked, the storage mount settings also apply to deployment slots.|

# [Azure portal](#tab/portal/key-vault)

1. In the [Azure portal](https://portal.azure.com), navigate to the app.
1. From the left navigation, click **Configuration** > **Path Mappings** > **New Azure Storage Mount**. 
1. Configure the storage mount according to the following table. When finished, click **OK**.

    | Setting | Description |
    |-|-|
    | **Name** | Name of the mount configuration. Spaces aren't allowed. |
    | **Configuration options** | Select **Advanced**. |
    | **Storage accounts** | Azure Storage account. |
    | **Storage type** | Select the type based on the storage you want to mount. Azure Blobs only supports read-only access. |
    | **Storage container** or **Share name** | Files share or Blobs container to mount. |
    | **Storage access** | Select **Key vault reference**. |
    | **Application settings**| Select the existing app setting that's configured with the Azure Key Vault secret.|
    | **Mount path** | Directory inside the Linux container to mount to Azure Storage. Don't use `/` or `/home`.|
    | **Deployment slot setting** | When checked, the storage mount settings also apply to deployment slots.|

1. [Grant your app access to the Key Vault](../../app-service-key-vault-references.md?#grant-your-app-access-to-a-key-vault) to access the storage mount.

# [Azure CLI](#tab/cli/basic)

Using Azure CLI to mount storage requires you to provide the storage access key.

# [Azure CLI](#tab/cli/access-key)

Use the [`az webapp config storage-account add`](/cli/azure/webapp/config/storage-account#az-webapp-config-storage-account-add) command. For example:

```azurecli-interactive
az webapp config storage-account add --resource-group <group-name> --name <app-name> --custom-id <custom-id> --storage-type AzureFiles --share-name <share-name> --account-name <storage-account-name> --access-key "<access-key>" --mount-path <mount-path-directory>
```

- `--storage-type` can be `AzureBlob` or `AzureFiles`. `AzureBlob` is read-only.
- `--mount-path` is the directory inside the Linux container to mount to Azure Storage. Don't use `/` (the root directory).

Verify your storage is mounted by running the following command:

```azurecli-interactive
az webapp config storage-account list --resource-group <resource-group> --name <app-name>
```

# [Azure CLI](#tab/cli/key-vault)

Mounting storage with Key Vault access isn't currently supported by the Azure CLI. Use the portal instead.

---

> [!NOTE]
> Adding, editing, or deleting a storage mount causes the app to be restarted.

## Validate the mounted storage

To validate that the Azure Storage is mounted successfully for the app:

1. [Open an SSH session](../../configure-linux-open-ssh-session.md) into the container.
1. In the SSH terminal, execute the following command:

    ```bash
    df –h 
    ```

1. Check if the storage share is mounted. If it's not present, there's an issue with mounting the storage share.
1. Check latency or general reachability of the storage mount with the following command:

    ```bash
    tcpping Storageaccount.file.core.windows.net 
    ```

## Best practices

- To avoid latency issues, place the app and the Azure Storage account in the same region. If you grant access from App Service IP addresses in the [Azure Storage firewall configuration](../../../storage/common/storage-network-security.md) when the app and Azure Storage account are in the same region, then these IP restrictions aren't honored.

- The mount directory in the custom container should be empty. Any content stored at this path is deleted when the Azure Storage is mounted (if you specify a directory under `/home`, for example). If you are migrating files for an existing app, make a backup of the app and its content before you begin.

- In the Azure Storage account, avoid [regenerating the access key](../../../storage/common/storage-account-keys-manage.md) that's used to mount the storage in the app. The storage account contains two different keys. Azure App Services stores Azure storage account key. Use a stepwise approach to ensure that the storage mount remains available to the app during key regeneration. For example, assuming that you used **key1** to configure storage mount in your app:

    1. Regenerate **key2**. 
    1. In the storage mount configuration, update the access the key to use the regenerated **key2**.
    1. Regenerate **key1**.

- If you delete an Azure Storage account, container, or share, remove the corresponding storage mount configuration in the app to avoid possible error scenarios. 

- The mounted Azure Storage account can be either Standard or Premium performance tier. Based on the app capacity and throughput requirements, choose the appropriate performance tier for the storage account. See the scalability and performance targets that correspond to the storage type:

    - [For Files](../../../storage/files/storage-files-scale-targets.md)
    - [For Blobs](../../../storage/blobs/scalability-targets.md)

- If your app [scales to multiple instances](../../../azure-monitor/autoscale/autoscale-get-started.md), all the instances connect to the same mounted Azure Storage account. To avoid performance bottlenecks and throughput issues, choose the appropriate performance tier for the storage account.  

- It isn't recommended to use storage mounts for local databases (such as SQLite) or for any other applications and components that rely on file handles and locks. 

- Ensure the following ports are open when using VNET integration:
    - Azure Files: 80 and 445.
    - Azure Blobs: 80 and 443.

- If you [initiate a storage failover](../../../storage/common/storage-initiate-account-failover.md) when the storage account is mounted to the app, the mount won't connect until the app is restarted or the storage mount is removed and readded.
## Next steps

- [Configure a custom container](../../configure-custom-container.md?pivots=platform-linux).
- [Video: How to mount Azure Storage as a local share](https://www.youtube.com/watch?v=OJkvpWYr57Y).
