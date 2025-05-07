---
author: msangapu-msft
ms.service: azure-app-service
ms.custom: linux-related-content
ms.topic: include
ms.date: 03/04/2025
ms.author: msangapu
---

> [!NOTE]
> [NFS](../../../storage/files/files-nfs-protocol.md) support is now available for App Service on Linux.
>

This guide shows how to mount Azure Storage as a network share in a built-in Linux container or a custom Linux container in App Service. Azure Storage is Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers highly available, massively scalable, durable, and secure storage for data objects in the cloud. Azure Storage isn't the default storage for App Service. It's billed separately. You can also [configure Azure Storage in an ARM template](https://github.com/Azure/app-service-linux-docs/blob/master/BringYourOwnStorage/BYOS_azureFiles.json).

The benefits of custom-mounted storage include:

- Configure persistent storage for your App Service app and manage the storage separately.
- Make static content like video and images readily available for your App Service app.
- Write application log files or archive older application log to Azure File shares.  
- Share content across multiple apps or with other Azure services.
- Supports Azure Files [NFS](../../../storage/files/files-nfs-protocol.md) and Azure Files [SMB](../../../storage/files/files-smb-protocol.md).
- Supports Azure Blobs (read-only).
- Supports up to five mount points per app.

The limitations of custom-mounted storage include:

- [Storage firewall](../../../storage/common/storage-network-security.md) is supported only through [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) and [private endpoints](../../../storage/common/storage-private-endpoints.md) when you use [virtual network integration](../../overview-vnet-integration.md).
- FTP/FTPS access to custom-mounted storage isn't supported. Use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).
- Storage account shared access keys are the only means of authentication that are supported. [Entra ID and RBAC Roles](../../../storage/common/authorize-data-access.md) aren't supported.
- Azure CLI, Azure PowerShell, and Azure SDK support is in preview.
- Mapping */* or */home* to custom-mounted storage isn't supported.
- Don't map the storage mount to */tmp* or its subdirectories. This action can cause a time-out during app startup.
- Azure Storage isn't supported with [Docker Compose](../../configure-custom-container.md?pivots=container-linux#docker-compose-options) scenarios.
- Storage mounts aren't included in [backups](../../manage-backup.md). Be sure to follow best practices to back up the Azure Storage accounts.
- NFS support is only available for App Service on Linux. NFS isn't supported for Windows code and Windows containers. The web app and storage account need to be configured on the same virtual network for NFS. The storage account used for file share should have *Premium* performance tier and *File storage* as the Account Kind. Azure Key Vault isn't applicable when using the NFS protocol.
- With virtual network integration on your app, the mounted drive uses an RFC1918 IP address and not an IP address from your virtual network.

### Mounting options

You need to mount the storage to the app. Here are three mounting options for Azure storage:

| Mounting option | Usage |
|:----------------|:------|
| Basic | Choose this option to mount storage using the Azure portal. You can use the basic option as long as the storage account doesn't use [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network), [private endpoints](../../../storage/common/storage-private-endpoints.md), or [Azure Key Vault](/azure/key-vault/general/overview). In this case, the portal gets and stores the access key for you. |
| Access Key | If you plan to mount storage using the Azure CLI, you need to obtain an access key. Choose this option if storage account doesn't use [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network), [private endpoints](../../../storage/common/storage-private-endpoints.md), or [Azure Key Vault](/azure/key-vault/general/overview). |
| Key Vault | Also use this option when you plan to mount storage using the Azure CLI, which requires the access key. Choose this option when you use Azure Key Vault to securely store and retrieve access keys. [Azure Key Vault](/azure/key-vault/general/overview) has the benefits of storing application secrets centrally and securely with the ability to monitor, administer, and integrate with other Azure services like Azure App Service. |

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
- An [Azure Key Vault](/azure/key-vault/general/overview) instance that uses [vault access policy](/azure/key-vault/general/assign-access-policy?WT.mc_id=Portal-Microsoft_Azure_KeyVault&tabs=azure-portal) and a [secret](/azure/key-vault/secrets/quick-create-portal), which is required to configure the Key Vault with Azure Storage.

---

## Prepare for mounting

### [Basic](#tab/basic)

No extra steps are required because the portal gets and stores the access key for you.

### [Access Key](#tab/access-key)

You need to obtain the access key from your storage account.

### [Key Vault](#tab/key-vault)

Before you can mount storage using Key Vault access, you need to get the Key Vault secret and add it as an application setting in your app.  

1. In the Azure portal, browse to your Key Vault. Select **Objects** > **Secrets**. Copy the **Secret Identifier** to your clipboard.

   :::image type="content" source="../../media/configure-azure-storage/key-vault-secret-identifier.png" alt-text="Screenshot of Key Vault secret identifier.":::

1. Back in your app, follow the [key vault reference](../../app-service-key-vault-references.md#source-app-settings-from-key-vault) to create an [**application setting**](../../configure-common.md#configure-app-settings) using the **Secret Identifier**.

   Example app setting value: `@Microsoft.KeyVault(SecretUri=https://mykeyvault.vault.azure.net/secrets/mykeyvaultsecret/aaaaaaaa0b0b1c1c2d2d333333333333)`

Now you're ready to use Key Vault to access your storage account.

---

## Mount storage to Linux container

The way that you mount storage depends on your storage access option and whether you use the portal or the Azure CLI.

# [Azure portal](#tab/portal/basic)

1. In the [Azure portal](https://portal.azure.com), navigate to the app.
1. From the left navigation, select **Settings** > **Configuration**. Select **Path mappings**, then **New Azure Storage Mount**.
1. Configure the storage mount according to the following table. When finished, select **OK**.

   | Setting | Description |
   |:--------|:------------|
   | **Name** | Name of the mount configuration. Spaces aren't allowed. |
   | **Configuration options** | Select **Basic** if the storage account doesn't use [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network), [private endpoints](../../../storage/common/storage-private-endpoints.md), or [Azure Key Vault](/azure/key-vault/general/overview). Otherwise, select **Advanced**. |
   | **Storage accounts** | Azure Storage account. |
   | **Storage type** | Select the type based on the storage you want to mount. Azure Blobs only supports read-only access. |
   | **Storage container** or **Share name** | Files share or Blobs container to mount. |
   | **Mount path** | Directory inside the Linux container to mount to Azure Storage. Don't use */* or */home*. |
   | **Deployment slot setting** | When checked, the storage mount settings also apply to deployment slots. |

# [Azure portal](#tab/portal/access-key)

1. In the [Azure portal](https://portal.azure.com), navigate to the app.
1. From the left navigation, select **Settings** > **Configuration**. Select **Path mappings**, then **New Azure Storage Mount**.
1. Configure the storage mount according to the following table. When finished, select **OK**.

   | Setting | Description |
   |:--------|:------------|
   | **Name** | Name of the mount configuration. Spaces aren't allowed. |
   | **Configuration options** | Select  **Advanced**. |
   | **Storage accounts** | Azure Storage account. |
   | **Storage type** | Select the type based on the storage you want to mount. Azure Blobs only supports read-only access. |
   | **Storage container** or **Share name** | Files share or Blobs container to mount. |
   | **Storage access** | Select **Manual input**. |
   | **Access key** | Enter the [access key](../../../storage/common/storage-account-keys-manage.md) for your storage account. |
   | **Mount path** | Directory inside the Linux container to mount to Azure Storage. Don't use */* or */home*. |
   | **Deployment slot setting** | When selected, the storage mount settings also apply to deployment slots. |

# [Azure portal](#tab/portal/key-vault)

1. In the [Azure portal](https://portal.azure.com), navigate to the app.
1. From the left navigation, select **Settings** > **Configuration**. Select **Path mappings**, then **New Azure Storage Mount**.
1. Configure the storage mount according to the following table. When finished, select **OK**.

   | Setting | Description |
   |:--------|:------------|
   | **Name** | Name of the mount configuration. Spaces aren't allowed. |
   | **Configuration options** | Select **Advanced**. |
   | **Storage accounts** | Azure Storage account. |
   | **Storage type** | Select the type based on the storage you want to mount. Azure Blobs only supports read-only access. |
   | **Storage container** or **Share name** | Files share or Blobs container to mount. |
   | **Storage access** | Select **Key vault reference**. |
   | **Application settings**| Select the existing app setting that's configured with the Azure Key Vault secret. |
   | **Mount path** | Directory inside the Linux container to mount to Azure Storage. Don't use */* or */home*. |
   | **Deployment slot setting** | When selected, the storage mount settings also apply to deployment slots. |

1. To access the storage mount, [grant your app access to the Key Vault](../../app-service-key-vault-references.md?#grant-your-app-access-to-a-key-vault).

# [Azure CLI](#tab/cli/basic)

Using Azure CLI to mount storage requires you to provide the storage access key.

# [Azure CLI](#tab/cli/access-key)

Use the [az webapp config storage-account add](/cli/azure/webapp/config/storage-account#az-webapp-config-storage-account-add) command. For example:

```azurecli-interactive
az webapp config storage-account add --resource-group <group-name> --name <app-name> --custom-id <custom-id> --storage-type AzureFiles --share-name <share-name> --account-name <storage-account-name> --access-key "<access-key>" --mount-path <mount-path-directory>
```

- `--storage-type` can be `AzureBlob` or `AzureFiles`. `AzureBlob` is read-only.
- `--mount-path` is the directory inside the Linux container to mount to Azure Storage. Don't use */*, the root directory.

Verify your storage is mounted by running the following command:

```azurecli-interactive
az webapp config storage-account list --resource-group <resource-group> --name <app-name>
```

# [Azure CLI](#tab/cli/key-vault)

The Azure CLI doesn't currently support mounting storage with Key Vault access. Use the portal instead.

---

> [!NOTE]
> Adding, editing, or deleting a storage mount causes the app to restart.

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

### Performance

- To avoid latency issues, place the app and the Azure Storage account in the same region. If you grant access from App Service IP addresses in the [Azure Storage firewall configuration](../../../storage/common/storage-network-security.md) when the app and Azure Storage account are in the same region, then these IP restrictions aren't honored.
- The mounted Azure Storage account can be either Standard or Premium performance tier. Based on the app capacity and throughput requirements, choose the appropriate performance tier for the storage account. See the scalability and performance targets that correspond to the storage type: [Files](../../../storage/files/storage-files-scale-targets.md) and [Blobs](../../../storage/blobs/scalability-targets.md).

- If your app [scales to multiple instances](/azure/azure-monitor/autoscale/autoscale-get-started), all the instances connect to the same mounted Azure Storage account. To avoid performance bottlenecks and throughput issues, choose the appropriate performance tier for the storage account.

### Security

- In the Azure Storage account, avoid [regenerating the access key](../../../storage/common/storage-account-keys-manage.md) that you use to mount the storage in the app. The storage account contains two keys. Azure App Services stores an Azure storage account key. Use a stepwise approach to ensure that the storage mount remains available to the app during key regeneration. For example, assuming that you used **key1** to configure storage mount in your app:

   1. Regenerate **key2**.
   1. In the storage mount configuration, update the access the key to use the regenerated **key2**.
   1. Regenerate **key1**.

### Configuration

- If you need to use a real time file system, where you expect changes to alter, add, or remove files quickly, use Azure Files as the storage type when you mount storage. When files are static and you don't expect them to change, use Azure Blob.

### Troubleshooting

- The mount directory in the custom container should be empty. Any content stored at this path is deleted when the Azure Storage is mounted, if you specify a directory under */home*, for example. If you migrate files for an existing app, make a backup of the app and its content before you begin.
- If you delete an Azure Storage account, container, or share, remove the corresponding storage mount configuration in the app to avoid possible error scenarios.
- We don't recommend that you use storage mounts for local databases, such as SQLite, or for any other applications and components that rely on file handles and locks.
- Ensure the following ports are open when using virtual network integration: Azure Files: 80 and 445. Azure Blobs: 80 and 443.
- If you [initiate a storage failover](../../../storage/common/storage-initiate-account-failover.md) when the storage account is mounted to the app, the mount doesn't connect until the app is restarted or the storage mount is removed and added again.

## Next step

- [Configure a custom container](../../configure-custom-container.md?pivots=platform-linux).
- [Video: How to mount Azure Storage as a local share](https://www.youtube.com/watch?v=OJkvpWYr57Y).
