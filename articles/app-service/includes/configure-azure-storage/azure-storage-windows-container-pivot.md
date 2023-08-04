---
author: msangapu-msft
ms.service: app-service
ms.topic: include
ms.date: 08/04/2023
ms.author: msangapu
---

This guide shows how to mount Azure Storage Files as a network share in a Windows container in App Service. Only [Azure Files Shares](../../../storage/files/storage-how-to-use-files-portal.md) and [Premium Files Shares](../../../storage/files/storage-how-to-create-file-share.md) are supported. Azure Storage is non-default storage for App Service and billed separately.

The benefits of custom-mounted storage include:
- Configure persistent storage for your App Service app and manage the storage separately.
- Make static content like video and images readily available for your App Service app. 
- Write application log files or archive older application log to Azure File shares.  
- Share content across multiple apps or with other Azure services.
- Mount Azure Storage in a Windows container, including Isolated ([App Service environment v3](../../environment/overview.md)).

The following features are supported for Windows containers:

- Secured access to storage accounts with key vault, [private endpoints](../../../storage/common/storage-private-endpoints.md) and [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) (when [VNET integration](../../overview-vnet-integration.md) is used).
- Azure Files (read/write).
- Up to five mount points per app.
- Drive letter assignments (`C:` to `Z:`).

## Prerequisites

- [An existing Windows container app in App Service](../../quickstart-custom-container.md).
- [Create Azure file share](../../../storage/files/storage-how-to-use-files-portal.md).
- [Upload files to Azure File share](../../../storage/files/storage-how-to-create-file-share.md).

## Limitations

- Azure blobs aren't supported.
- [Storage firewall](../../../storage/common/storage-network-security.md) is supported only through [private endpoints](../../../storage/common/storage-private-endpoints.md) and [service endpoints](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) (when [VNET integration](../../overview-vnet-integration.md) is used).
- FTP/FTPS access to mounted storage not supported (use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)).
- Mapping `[C-Z]:\`, `[C-Z]:\home`, `/`, and `/home` to custom-mounted storage isn't supported.
- Storage mounts aren't backed up when you [back up your app](../../manage-backup.md). Be sure to follow best practices to back up the Azure Storage accounts.
- With VNET integration on your app, the mounted drive uses an RC1918 IP address and not an IP address from your VNET.

## Mount storage to Windows container

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to the app.
1. From the left navigation, click **Configuration** > **Path Mappings** > **New Azure Storage Mount**. 
1. Configure the storage mount according to the following table. When finished, click **OK**.

    | Setting | Description |
    |-|-|
    | **Name** | Name of the mount configuration. Spaces aren't allowed. |
    | **Configuration options** | Select **Basic** if the storage account isn't using [private endpoints](../../../storage/common/storage-private-endpoints.md). Otherwise, select **Advanced**. |
    | **Storage accounts** | Azure Storage account. It must contain an Azure Files share. |
    | **Share name** | Files share to mount. |
    | **Access key** (Advanced only) | [Access key](../../../storage/common/storage-account-keys-manage.md) for your storage account. |
    | **Mount path** | Directory inside your Windows container that you want to mount. Don't use a root directory (`[C-Z]:\` or `/`) or the `home` directory (`[C-Z]:\home`, or `/home`) as it isn't supported.|
    | **Deployment slot setting** | When checked, the storage mount settings also apply to deployment slots.|

# [Azure CLI](#tab/cli)

Use the [`az webapp config storage-account add`](/cli/azure/webapp/config/storage-account#az-webapp-config-storage-account-add) command. For example:

```azurecli-interactive
az webapp config storage-account add --resource-group <group-name> --name <app-name> --custom-id <custom-id> --storage-type AzureFiles --share-name <share-name> --account-name <storage-account-name> --access-key "<access-key>" --mount-path <mount-path-directory>
```

- `--storage-type` must be `AzureFiles` for Windows containers. 
- `mount-path-directory` must be in the form `/path/to/dir` or `[C-Z]:\path\to\dir`.

Verify your storage is mounted by running the following command:

```azurecli-interactive
az webapp config storage-account list --resource-group <resource-group> --name <app-name>
```

---

> [!NOTE]
> Adding, editing, or deleting a storage mount causes the app to be restarted. 

## Best practices

- To avoid latency issues, place the app and the Azure Storage account in the same region. If you grant access from App Service IP addresses in the [Azure Storage firewall configuration](../../../storage/common/storage-network-security.md) when the app and Azure Storage account are in the same region, then these IP restrictions aren't honored.

- In the Azure Storage account, avoid [regenerating the access key](../../../storage/common/storage-account-keys-manage.md) that's used to mount the storage in the app. The storage account contains two different keys. Azure App Services stores Azure storage account key. Use a stepwise approach to ensure that the storage mount remains available to the app during key regeneration. For example, assuming that you used **key1** to configure storage mount in your app:

    1. Regenerate **key2**. 
    1. In the storage mount configuration, update the access the key to use the regenerated **key2**.
    1. Regenerate **key1**.

- If you delete an Azure Storage account, container, or share, remove the corresponding storage mount configuration in the app to avoid possible error scenarios. 

- The mounted Azure Storage account can be either Standard or Premium performance tier. Based on the app capacity and throughput requirements, choose the appropriate performance tier for the storage account. See the [scalability and performance targets for Files](../../../storage/files/storage-files-scale-targets.md).

- If your app [scales to multiple instances](../../../azure-monitor/autoscale/autoscale-get-started.md), all the instances connect to the same mounted Azure Storage account. To avoid performance bottlenecks and throughput issues, choose the appropriate performance tier for the storage account.  

- It isn't recommended to use storage mounts for local databases (such as SQLite) or for any other applications and components that rely on file handles and locks. 

- Ensure ports 80 and 445 are open when using Azure Files with VNET integration.

- If you [initiate a storage failover](../../../storage/common/storage-initiate-account-failover.md) when the storage account is mounted to the app, the mount won't connect until the app is restarted or the storage mount is removed and readded.

## Next steps

- [Migrate custom software to Azure App Service using a custom container](../../tutorial-custom-container.md?pivots=container-windows).