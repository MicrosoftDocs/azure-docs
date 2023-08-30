---
author: msangapu-msft
ms.service: app-service
ms.topic: include
ms.date: 08/04/2023
ms.author: msangapu
---

This guide shows how to mount Azure Storage as a network share in a built-in Linux container or a custom Linux container in App Service. See the video [how to mount Azure Storage as a local share](https://www.youtube.com/watch?v=OJkvpWYr57Y). For using Azure Storage in an ARM template, see [Bring your own storage](https://github.com/Azure/app-service-linux-docs/blob/master/BringYourOwnStorage/BYOS_azureFiles.json). Azure Storage is non-default storage for App Service and billed separately.

The benefits of custom-mounted storage include:
- Configure persistent storage for your App Service app and manage the storage separately.
- Make static content like video and images readily available for your App Service app. 
- Write application log files or archive older application log to Azure File shares.  
- Share content across multiple apps or with other Azure services.

The following features are supported for Linux containers:
- Azure Files (read/write).
- Azure Blobs (read-only).
- Up to five mount points per app.

## Prerequisites

- An existing [App Service on Linux app](../../index.yml).
- An [Azure Storage Account](../../../storage/common/storage-account-create.md?tabs=azure-cli).
- An [Azure file share and directory](../../../storage/files/storage-how-to-use-files-portal.md).

## Limitations

- [Storage firewall](../../../storage/common/storage-network-security.md) is supported only through [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) and [private endpoints](../../../storage/common/storage-private-endpoints.md) (when [VNET integration](../../overview-vnet-integration.md) is used).
- FTP/FTPS access to custom-mounted storage isn't supported (use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)).
- Azure CLI, Azure PowerShell, and Azure SDK support is in preview.
- Mapping `/` or `/home` to custom-mounted storage isn't supported.
- Don't map the storage mount to `/tmp` or its subdirectories as this action may cause a timeout during app startup.
- Azure Storage isn't supported with [Docker Compose](../../configure-custom-container.md?pivots=container-linux#docker-compose-options) scenarios.
- Storage mounts aren't included in [backups](../../manage-backup.md). Be sure to follow best practices to backup the Azure Storage accounts.
- Azure Files [NFS](../../../storage/files/files-nfs-protocol.md) is currently unsupported for App Service on Linux. Only Azure Files [SMB](../../../storage/files/files-smb-protocol.md) are supported.
- With VNET integration on your app, the mounted drive will use an RC1918 IP address and not an IP address from your VNET.

## Mount storage to Linux container

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to the app.
1. From the left navigation, click **Configuration** > **Path Mappings** > **New Azure Storage Mount**. 
1. Configure the storage mount according to the following table. When finished, click **OK**.

    | Setting | Description |
    |-|-|
    | **Name** | Name of the mount configuration. Spaces aren't allowed. |
    | **Configuration options** | Select **Basic** if the storage account isn't using [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) or [private endpoints](../../../storage/common/storage-private-endpoints.md). Otherwise, select **Advanced**. |
    | **Storage accounts** | Azure Storage account. |
    | **Storage type** | Select the type based on the storage you want to mount. Azure Blobs only supports read-only access. |
    | **Storage container** or **Share name** | Files share or Blobs container to mount. |
    | **Access key** (Advanced only) | [Access key](../../../storage/common/storage-account-keys-manage.md) for your storage account. |
    | **Mount path** | Directory inside the Linux container to mount to Azure Storage. Don't use `/` or `/home`.|
    | **Deployment slot setting** | When checked, the storage mount settings also apply to deployment slots.|

# [Azure CLI](#tab/cli)

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

---

> [!NOTE]
> Adding, editing, or deleting a storage mount causes the app to be restarted.

## Test the mounted storage

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

- To avoid latency issues, place the app and the Azure Storage account in the same region. Note that if you grant access from App Service IP addresses in the [Azure Storage firewall configuration](../../../storage/common/storage-network-security.md) when the app and Azure Storage account are in the same region, then these IP restrictions aren't honored.

- The mount directory in the custom container should be empty. Any content stored at this path is deleted when the Azure Storage is mounted (if you specify a directory under `/home`, for example). If you are migrating files for an existing app, make a backup of the app and its content before you begin.

- Mounting the storage to `/home` isn't recommended because it may result in performance bottlenecks for the app.

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
