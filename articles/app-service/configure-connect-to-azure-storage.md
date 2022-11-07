---
title: Mount Azure Storage as a local share
description: Learn how to attach custom network share  in Azure App Service. Share files between apps, manage static content remotely and access locally, etc.
author: msangapu-msft

ms.topic: article
ms.date: 4/12/2022
ms.author: msangapu
zone_pivot_groups: app-service-containers-code
---
# Mount Azure Storage as a local share in App Service

::: zone pivot="code-windows"
> [!NOTE]
> Mounting Azure Storage as a local share for App Service on Windows code (non-container) is currently in preview.
>
This guide shows how to mount Azure Storage Files as a network share in Windows code (non-container) in App Service. Only [Azure Files Shares](../storage/files/storage-how-to-use-files-portal.md) and [Premium Files Shares](../storage/files/storage-how-to-create-file-share.md) are supported. The benefits of custom-mounted storage include:

- Configure persistent storage for your App Service app and manage the storage separately.
- Make static content like video and images readily available for your App Service app. 
- Write application log files or archive older application log to Azure File shares.  
- Share content across multiple apps or with other Azure services.

The following features are supported for Windows code:

- Secured access to storage accounts with [private endpoints](../storage/common/storage-private-endpoints.md) and [service endpoints](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) (when [VNET integration](./overview-vnet-integration.md) is used).
- Azure Files (read/write).
- Up to five mount points per app.
- Mount Azure Storage file shares using "/mounts/`<path-name>`".

::: zone-end
::: zone pivot="container-windows"

This guide shows how to mount Azure Storage Files as a network share in a Windows container in App Service. Only [Azure Files Shares](../storage/files/storage-how-to-use-files-portal.md) and [Premium Files Shares](../storage/files/storage-how-to-create-file-share.md) are supported. The benefits of custom-mounted storage include:

- Configure persistent storage for your App Service app and manage the storage separately.
- Make static content like video and images readily available for your App Service app. 
- Write application log files or archive older application log to Azure File shares.  
- Share content across multiple apps or with other Azure services.
- Mount Azure Storage in a Windows container, including Isolated ([App Service environment v3](environment/overview.md)).

The following features are supported for Windows containers:

- Secured access to storage accounts with [private endpoints](../storage/common/storage-private-endpoints.md) and [service endpoints](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) (when [VNET integration](./overview-vnet-integration.md) is used).
- Azure Files (read/write).
- Up to five mount points per app.
- Drive letter assignments (`C:` to `Z:`).

::: zone-end

::: zone pivot="container-linux"

This guide shows how to mount Azure Storage as a network share in a built-in Linux container or a custom Linux container in App Service. See the video [how to mount Azure Storage as a local share](https://www.youtube.com/watch?v=OJkvpWYr57Y). For using Azure Storage in an ARM template, see [Bring your own storage](https://github.com/Azure/app-service-linux-docs/blob/master/BringYourOwnStorage/BYOS_azureFiles.json). The benefits of custom-mounted storage include:

- Configure persistent storage for your App Service app and manage the storage separately.
- Make static content like video and images readily available for your App Service app. 
- Write application log files or archive older application log to Azure File shares.  
- Share content across multiple apps or with other Azure services.

The following features are supported for Linux containers:

- Secured access to storage accounts with [service endpoints](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) and [private links](../storage/common/storage-private-endpoints.md) (when [VNET integration](./overview-vnet-integration.md) is used).
- Azure Files (read/write).
- Azure Blobs (read-only).
- Up to five mount points per app.

::: zone-end

## Prerequisites

::: zone pivot="code-windows"

- [An existing Windows code app in App Service](quickstart-dotnetcore.md)
- [Create Azure file share](../storage/files/storage-how-to-use-files-portal.md)
- [Upload files to Azure File share](../storage/files/storage-how-to-create-file-share.md)

::: zone-end

::: zone pivot="container-windows"

- [An existing Windows container app in App Service](quickstart-custom-container.md)
- [Create Azure file share](../storage/files/storage-how-to-use-files-portal.md)
- [Upload files to Azure File share](../storage/files/storage-how-to-create-file-share.md)

::: zone-end

::: zone pivot="container-linux"

- An existing [App Service on Linux app](index.yml).
- An [Azure Storage Account](../storage/common/storage-account-create.md?tabs=azure-cli)
- An [Azure file share and directory](../storage/files/storage-how-to-use-files-portal.md).

::: zone-end

> [!NOTE]
> Azure Storage is non-default storage for App Service and billed separately, not included with App Service.
>

## Limitations

::: zone pivot="code-windows"

- [Storage firewall](../storage/common/storage-network-security.md) is supported only through [private endpoints](../storage/common/storage-private-endpoints.md) and [service endpoints](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) (when [VNET integration](./overview-vnet-integration.md) is used).
- Azure blobs are not supported when configuring Azure storage mounts for Windows code apps deployed to App Service.
- FTP/FTPS access to mounted storage not supported (use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)).
- Mapping `/mounts`, `mounts/foo/bar`, `/`, and `/mounts/foo.bar/` to custom-mounted storage is not supported (you can only use /mounts/pathname for mounting custom storage to your web app.)
- Storage mounts cannot be used together with clone settings option during [deployment slot](deploy-staging-slots.md) creation.
- Storage mounts are not backed up when you [back up your app](manage-backup.md). Be sure to follow best practices to back up the Azure Storage accounts. 

::: zone-end

::: zone pivot="container-windows"

- Storage mounts are not supported for native Windows (non-containerized) apps.
- Azure blobs are not supported.
- [Storage firewall](../storage/common/storage-network-security.md) is supported only through [private endpoints](../storage/common/storage-private-endpoints.md) and [service endpoints](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) (when [VNET integration](./overview-vnet-integration.md) is used).
- FTP/FTPS access to mounted storage not supported (use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)).
- Mapping `[C-Z]:\`, `[C-Z]:\home`, `/`, and `/home` to custom-mounted storage is not supported.
- Storage mounts cannot be used together with clone settings option during [deployment slot](deploy-staging-slots.md) creation.
- Storage mounts are not backed up when you [back up your app](manage-backup.md). Be sure to follow best practices to back up the Azure Storage accounts.

> [!NOTE]
> Ensure ports 80 and 445 are open when using Azure Files with VNET integration.
> 
::: zone-end

::: zone pivot="container-linux"

- [Storage firewall](../storage/common/storage-network-security.md) is supported only through [service endpoints](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) and [private endpoints](../storage/common/storage-private-endpoints.md) (when [VNET integration](./overview-vnet-integration.md) is used). Custom DNS support is currently unavailable when the mounted Azure Storage account uses a private endpoint.
- FTP/FTPS access to custom-mounted storage is not supported (use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)).
- Azure CLI, Azure PowerShell, and Azure SDK support is in preview.
- Mapping `/` or `/home` to custom-mounted storage is not supported.
- Don't map the custom storage mount to `/tmp` or its subdirectories as this may cause timeout during app startup.
- Azure Storage is not supported with [Docker Compose Scenarios](configure-custom-container?pivots=container-linux#docker-compose-options)
- Storage mounts cannot be used together with clone settings option during [deployment slot](deploy-staging-slots.md) creation.
- Storage mounts are not backed up when you [back up your app](manage-backup.md). Be sure to follow best practices to back up the Azure Storage accounts. 
- Only Azure Files [SMB](../storage/files/files-smb-protocol.md) are supported.  Azure Files [NFS](../storage/files/files-nfs-protocol.md) is not currently supported for Linux App Services.

> [!NOTE]
> When VNET integration is used, ensure the following ports are open:
> * Azure Files: 80 and 445.
> * Azure Blobs: 80 and 443.
> 
::: zone-end

::: zone pivot="code-windows"
## Mount storage to Windows code
::: zone-end
::: zone pivot="container-windows"
## Mount storage to Windows container
::: zone-end
::: zone pivot="container-linux"
## Mount storage to Linux container
::: zone-end

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to the app.
1. From the left navigation, click **Configuration** > **Path Mappings** > **New Azure Storage Mount**. 
1. Configure the storage mount according to the following table. When finished, click **OK**.

    ::: zone pivot="code-windows"
    | Setting | Description |
    |-|-|
    | **Name** | Name of the mount configuration. Spaces are not allowed. |
    | **Configuration options** | Select **Basic** if the storage account is not using [private endpoints](../storage/common/storage-private-endpoints.md). Otherwise, select **Advanced**. |
    | **Storage accounts** | Azure Storage account. It must contain an Azure Files share. |
    | **Share name** | Files share to mount. |
    | **Access key** (Advanced only) | [Access key](../storage/common/storage-account-keys-manage.md) for your storage account. |
    | **Mount path** | Directory inside your app service that you want to mount. Only `/mounts/pathname` is supported.|
    ::: zone-end
    ::: zone pivot="container-windows"
    | Setting | Description |
    |-|-|
    | **Name** | Name of the mount configuration. Spaces are not allowed. |
    | **Configuration options** | Select **Basic** if the storage account is not using [private endpoints](../storage/common/storage-private-endpoints.md). Otherwise, select **Advanced**. |
    | **Storage accounts** | Azure Storage account. It must contain an Azure Files share. |
    | **Share name** | Files share to mount. |
    | **Access key** (Advanced only) | [Access key](../storage/common/storage-account-keys-manage.md) for your storage account. |
    | **Mount path** | Directory inside your Windows container that you want to mount. Do not use a root directory (`[C-Z]:\` or `/`) or the `home` directory (`[C-Z]:\home`, or `/home`) as it's not supported.|
    ::: zone-end
    ::: zone pivot="container-linux"
    | Setting | Description |
    |-|-|
    | **Name** | Name of the mount configuration. Spaces are not allowed. |
    | **Configuration options** | Select **Basic** if the storage account is not using [service endpoints](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) or [private endpoints](../storage/common/storage-private-endpoints.md). Otherwise, select **Advanced**. |
    | **Storage accounts** | Azure Storage account. |
    | **Storage type** | Select the type based on the storage you want to mount. Azure Blobs only supports read-only access. |
    | **Storage container** or **Share name** | Files share or Blobs container to mount. |
    | **Access key** (Advanced only) | [Access key](../storage/common/storage-account-keys-manage.md) for your storage account. |
    | **Mount path** | Directory inside the Linux container to mount to Azure Storage. Do not use `/` or `/home`.|
    ::: zone-end

# [Azure CLI](#tab/cli)

Use the [`az webapp config storage-account add`](/cli/azure/webapp/config/storage-account#az-webapp-config-storage-account-add) command. For example:

```azurecli-interactive
az webapp config storage-account add --resource-group <group-name> --name <app-name> --custom-id <custom-id> --storage-type AzureFiles --share-name <share-name> --account-name <storage-account-name> --access-key "<access-key>" --mount-path <mount-path-directory>
```

::: zone pivot="container-windows"
- `--storage-type` must be `AzureFiles` for Windows containers. 
- `mount-path-directory` must be in the form `/path/to/dir` or `[C-Z]:\path\to\dir`.
::: zone-end
::: zone pivot="container-linux"
- `--storage-type` can be `AzureBlob` or `AzureFiles`. `AzureBlob` is read-only.
- `--mount-path` is the directory inside the Linux container to mount to Azure Storage. Do not use `/` (the root directory).
::: zone-end

Verify your storage is mounted by running the following command:

```azurecli-interactive
az webapp config storage-account list --resource-group <resource-group> --name <app-name>
```

---

> [!NOTE]
> Adding, editing, or deleting a storage mount causes the app to be restarted. 

::: zone pivot="container-linux"

## Test the mounted storage

To validate that the Azure Storage is mounted successfully for the app:

1. [Open an SSH session](configure-linux-open-ssh-session.md) into the container.
1. In the SSH terminal, execute the following command:

    ```bash
    df –h 
    ```
1. Check if the storage share is mounted. If it's not present, there's an issue with mounting the storage share.
1. Check latency or general reachability of the storage mount with the following command:

    ```bash
    tcpping Storageaccount.file.core.windows.net 
    ```

::: zone-end

## Best practices

::: zone pivot="code-windows"
- To avoid potential issues related to latency, place the app and the Azure Storage account in the same Azure region. Note, however, if the app and Azure Storage account are in same Azure region, and if you grant access from App Service IP addresses in the [Azure Storage firewall configuration](../storage/common/storage-network-security.md), then these IP restrictions are not honored.

- In the Azure Storage account, avoid [regenerating the access key](../storage/common/storage-account-keys-manage.md) that's used to mount the storage in the app. The storage account contains two different keys. Use a stepwise approach to ensure that the storage mount remains available to the app during key regeneration. For example, assuming that you used **key1** to configure storage mount in your app:

    1. Regenerate **key2**. 
    1. In the storage mount configuration, update the access the key to use the regenerated **key2**.
    1. Regenerate **key1**.

- If you delete an Azure Storage account, container, or share, remove the corresponding storage mount configuration in the app to avoid possible error scenarios. 

- The mounted Azure Storage account can be either Standard or Premium performance tier. Based on the app capacity and throughput requirements, choose the appropriate performance tier for the storage account. See the [scalability and performance targets for Files](../storage/files/storage-files-scale-targets.md).

- If your app [scales to multiple instances](../azure-monitor/autoscale/autoscale-get-started.md), all the instances connect to the same mounted Azure Storage account. To avoid performance bottlenecks and throughput issues, choose the appropriate performance tier for the storage account.  

- It's not recommended to use storage mounts for local databases (such as SQLite) or for any other applications and components that rely on file handles and locks. 

- If you [initiate a storage failover](../storage/common/storage-initiate-account-failover.md) and the storage account is mounted to the app, the mount will fail to connect until you either restart the app or remove and add the Azure Storage mount. 
 
- When using Azure Storage [private endpoints](../storage/common/storage-private-endpoints.md) with the app, you need to [enable the **Route All** setting](configure-vnet-integration-routing.md).

- When VNET integration is used, ensure app setting, `WEBSITE_CONTENTOVERVNET` is set to `1` and the following ports are open:
    - Azure Files: 80 and 445

- The mounted Azure Storage account can be either Standard or Premium performance tier. Based on the app capacity and throughput requirements, choose the appropriate performance tier for the storage account. See [the scalability and performance targets for Files](../storage/files/storage-files-scale-targets.md)
::: zone-end
::: zone pivot="container-windows"

- To avoid potential issues related to latency, place the app and the Azure Storage account in the same Azure region. Note, however, if the app and Azure Storage account are in same Azure region, and if you grant access from App Service IP addresses in the [Azure Storage firewall configuration](../storage/common/storage-network-security.md), then these IP restrictions are not honored.

- In the Azure Storage account, avoid [regenerating the access key](../storage/common/storage-account-keys-manage.md) that's used to mount the storage in the app. The storage account contains two different keys. Use a stepwise approach to ensure that the storage mount remains available to the app during key regeneration. For example, assuming that you used **key1** to configure storage mount in your app:

    1. Regenerate **key2**. 
    1. In the storage mount configuration, update the access the key to use the regenerated **key2**.
    1. Regenerate **key1**.

- If you delete an Azure Storage account, container, or share, remove the corresponding storage mount configuration in the app to avoid possible error scenarios. 

- The mounted Azure Storage account can be either Standard or Premium performance tier. Based on the app capacity and throughput requirements, choose the appropriate performance tier for the storage account. See the [scalability and performance targets for Files](../storage/files/storage-files-scale-targets.md).

- If your app [scales to multiple instances](../azure-monitor/autoscale/autoscale-get-started.md), all the instances connect to the same mounted Azure Storage account. To avoid performance bottlenecks and throughput issues, choose the appropriate performance tier for the storage account.  

- It's not recommended to use storage mounts for local databases (such as SQLite) or for any other applications and components that rely on file handles and locks. 

- If you [initiate a storage failover](../storage/common/storage-initiate-account-failover.md) and the storage account is mounted to the app, the mount will fail to connect until you either restart the app or remove and add the Azure Storage mount. 
 
- When using Azure Storage [private endpoints](../storage/common/storage-private-endpoints.md) with the app, you need to [enable the **Route All** setting](configure-vnet-integration-routing.md).

    > [!NOTE]
    > In App Service environment V3, the **Route All** setting is disabled by default and must be explicitly enabled.
::: zone-end

::: zone pivot="container-linux"
- To avoid potential issues related to latency, place the app and the Azure Storage account in the same Azure region. Note, however, if the app and Azure Storage account are in same Azure region, and if you grant access from App Service IP addresses in the [Azure Storage firewall configuration](../storage/common/storage-network-security.md), then these IP restrictions are not honored.

- The mount directory in the custom container should be empty. Any content stored at this path is deleted when the Azure Storage is mounted (if you specify a directory under `/home`, for example). If you are migrating files for an existing app, make a backup of the app and its content before you begin.

- Mounting the storage to `/home` is not recommended because it may result in performance bottlenecks for the app. 
 
- In the Azure Storage account, avoid [regenerating the access key](../storage/common/storage-account-keys-manage.md) that's used to mount the storage in the app. The storage account contains two different keys. Use a stepwise approach to ensure that the storage mount remains available to the app during key regeneration. For example, assuming that you used **key1** to configure storage mount in your app:

    1. Regenerate **key2**. 
    1. In the storage mount configuration, update the access the key to use the regenerated **key2**.
    1. Regenerate **key1**.

- If you delete an Azure Storage account, container, or share, remove the corresponding storage mount configuration in the app to avoid possible error scenarios. 

- The mounted Azure Storage account can be either Standard or Premium performance tier. Based on the app capacity and throughput requirements, choose the appropriate performance tier for the storage account. See the scalability and performance targets that correspond to the storage type:

    - [For Files](../storage/files/storage-files-scale-targets.md)
    - [For Blobs](../storage/blobs/scalability-targets.md)

- If your app [scales to multiple instances](../azure-monitor/autoscale/autoscale-get-started.md), all the instances connect to the same mounted Azure Storage account. To avoid performance bottlenecks and throughput issues, choose the appropriate performance tier for the storage account.  

- It's not recommended to use storage mounts for local databases (such as SQLite) or for any other applications and components that rely on file handles and locks. 

- When using Azure Storage [private endpoints](../storage/common/storage-private-endpoints.md) with the app, you need to [enable the **Route All** setting](configure-vnet-integration-routing.md).

- If you [initiate a storage failover](../storage/common/storage-initiate-account-failover.md) and the storage account is mounted to the app, the mount will fail to connect until you either restart the app or remove and add the Azure Storage mount. 

::: zone-end


## Next steps

::: zone pivot="code-windows"

- [Migrate .NET apps to Azure App Service](app-service-asp-net-migration.md).

::: zone-end

::: zone pivot="container-windows"

- [Migrate custom software to Azure App Service using a custom container](tutorial-custom-container.md?pivots=container-windows).

::: zone-end

::: zone pivot="container-linux"

- [Configure a custom container](configure-custom-container.md?pivots=platform-linux).
- [Video: How to mount Azure Storage as a local share](https://www.youtube.com/watch?v=OJkvpWYr57Y).

::: zone-end
