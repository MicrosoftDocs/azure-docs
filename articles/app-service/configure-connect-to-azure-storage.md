---
title: Add Azure Storage (container)
description: Learn how to attach custom network share in a containerized app in Azure App Service. Share files between apps, manage static content remotely and access locally, etc.
author: msangapu-msft

ms.topic: article
ms.date: 6/21/2021
ms.author: msangapu
zone_pivot_groups: app-service-containers-windows-linux
---
# Access Azure Storage as a network share from a container in App Service

::: zone pivot="container-windows"

This guide shows how to attach Azure Storage Files as a network share to a windows container in App Service. Only [Azure Files Shares](../storage/files/storage-how-to-use-files-cli.md) and [Premium Files Shares](../storage/files/storage-how-to-create-file-share.md) are supported. Benefits include secured content, content portability, access to multiple apps, and multiple transferring methods.

> [!NOTE]
>Azure Storage in App Service Windows container is **in preview** and **not supported** for **production scenarios**.

::: zone-end

::: zone pivot="container-linux"

This guide shows how to attach Azure Storage to a Linux container App Service. Benefits include secured content, content portability, persistent storage, access to multiple apps, and multiple transferring methods.

::: zone-end

## Prerequisites

::: zone pivot="container-windows"

- [An existing Windows Container app in Azure App Service](quickstart-custom-container.md)
- [Create Azure file share](../storage/files/storage-how-to-use-files-cli.md)
- [Upload files to Azure File share](../storage/files/storage-how-to-create-file-share.md)

::: zone-end

::: zone pivot="container-linux"

- An existing [App Service on Linux app](index.yml).
- An [Azure Storage Account](../storage/common/storage-account-create.md?tabs=azure-cli)
- An [Azure file share and directory](../storage/files/storage-how-to-use-files-cli.md).

::: zone-end

> [!NOTE]
> Azure Files is non-default storage and billed separately, not included with the web app. It doesn't support using Firewall configuration due to infrastructure limitations.
>

## Supported features

The following table shows supported features:

| Feature | Linux | Linux Containers | Windows Container
|-|-|-|-|-|-|
| Service Endpoint (Vnet integration) | Yes | Yes | No |
| Private Link (Vnet Integration)  | Yes | Yes | No |
| Azure Files (Read Write)  | Yes | Yes | Preview |
| Azure Blob (Read Only)  | Yes | Yes | No |
| Azure CLI Support  | Preview | Preview | Preview |
| Azure PowerShell Support  | Preview | Preview | Preview |
| Azure SDK Support   | Preview | Preview | Preview |
| Mapping of / (root) or /Home directory to Azure Storage Mount   | No | No | No |
| Drive Letter Support for Azure Storage Mount (C: to Z:)  | No | No | No |

## Azure Storage benefits

::: zone pivot="container-windows"
::: zone-end
::: zone pivot="container-linux"

- Configure persistent storage for web apps which can be managed independent of your web app. 
- Make static content like A\V files, Images etc. readily available for your web application hosted on App Service 
- Write application log files or archive older application log to Azure File shares  
- Same content is reusable across multiple App Services web apps instead of deploying the same content to each App Service web app individually 
- App Service web apps can write content to Azure File shares which can be used by other Azure services having access to same Azure File shares 
::: zone-end

## Limitations

::: zone pivot="container-windows"

- Azure Storage in App Service is currently **not supported** for bring your own code scenarios (non-containerized Windows apps).
- Azure Storage in App Service **doesn't support** using the **Storage Firewall** configuration because of infrastructure limitations.
- Azure Storage with App Service lets you specify **up to five** mount points per app.
- Azure Storage mounted to an app is not accessible through App Service FTP/FTPs endpoints. Use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

::: zone-end

::: zone pivot="container-linux"

- Azure Storage in App Service lets you specify **up to five** mount points per app.
- Azure Storage mounted to an app is not accessible through App Service FTP/FTPs endpoints. Use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

::: zone-end

## Link storage to your app

::: zone pivot="container-windows"

Once you've created your [Azure Storage account, file share and directory](#prerequisites), you can now configure your app with Azure Storage.

To mount an Azure Files Share to a directory in your App Service app, you use the [`az webapp config storage-account add`](/cli/azure/webapp/config/storage-account#az_webapp_config_storage_account_add) command. Storage Type must be AzureFiles.

```azurecli
az webapp config storage-account add --resource-group <group-name> --name <app-name> --custom-id <custom-id> --storage-type AzureFiles --share-name <share-name> --account-name <storage-account-name> --access-key "<access-key>" --mount-path <mount-path-directory>
```

Note that the `mount-path-directory` should be in the form `/path/to/dir` or `\path\to\dir` with no drive letter, as it will always be mounted on the `C:\` drive.

You should do this for any other directories you want to be linked to an Azure Files share.

::: zone-end

::: zone pivot="container-linux"
### [Portal](#tab/portal)
Once you've created your App Service on Linux web app, Azure Storage Account, Azure Blob or File Share Container and Directory, you can now configure your app with Azure Storage.

To configure mount for your web app you should navigate to Configuration>Path Mappings> New Azure Storage Mount 

1

You need to select Storage type (Azure Blob or Azure Files) and provide Name, Mount Path, and select Storage Account & Storage Container from the dropdown list. If the storage account is NOT using Service Endpoint or Private Endpoint, then Basic Configuration option should be used. 

Please note that Azure Blob mount are read only whereas Azure Files mounts are read\write. 

2

3

If the Azure Storage Account is Using Service Endpoint or Private Endpoint, then Advanced Configuration option should be used. 

Please note that Azure Blob mount are read only whereas Azure files mounts are read\write. 

4

5

To complete Azure Storage Mount configuration, you need to Save changes.  

Please note that add\edit\delete of an Azure Storage Mount will cause your web app to be recycled. 

6

### [CLI](#tab/cli)
Once you've created your [Azure Storage account, file share and directory](#prerequisites), you can now configure your app with Azure Storage.

To mount a storage account to a directory in your App Service app, you use the [`az webapp config storage-account add`](/cli/azure/webapp/config/storage-account#az_webapp_config_storage_account_add) command. Storage Type can be AzureBlob or AzureFiles. AzureFiles is used in this example. The mount path setting corresponds to the folder inside the container that you want to mount to Azure Storage. Setting it to '/' mounts the entire container to Azure Storage.


> [!CAUTION]
> The directory specified as the mount path in your web app should be empty. Any content stored in this directory will be deleted when an external mount is added. If you are migrating files for an existing app, make a backup of your app and its content before you begin.
>

```azurecli
az webapp config storage-account add --resource-group <group-name> --name <app-name> --custom-id <custom-id> --storage-type AzureFiles --share-name <share-name> --account-name <storage-account-name> --access-key "<access-key>" --mount-path <mount-path-directory>
```

You should do this for any other directories you want to be linked to a storage account.

---

::: zone-end

## Verify linked storage

Once the share is linked to the app, you can verify this by running the following command:

```azurecli
az webapp config storage-account list --resource-group <resource-group> --name <app-name>
```

## Frequently asked questions (FAQ)

::: zone pivot="container-windows"
::: zone-end
::: zone pivot="container-linux"
Azure App service Linux supports mounting Azure File shares (Read / Write) and Azure Blob (Read Only) 

You can connect up to five Azure storage mounts per Azure App Service web app. 

Azure Storage mounted to an app is not accessible through Azure App Service FTP/FTPs endpoints. Use Azure Storage Explorer. 

It is recommended to have Azure Storage account and your web app in the same Azure region to avoid potential issues related to latency. 

If you try to map Azure storage mount path to the / (root) directory, then you will receive an error. This path mapping is invalid and restricted. 

It is not recommended to map home or root directory of your web app to an Azure storage mount as this may result in performance bottlenecks for your web app. 

If you add, edit, or delete storage mount configuration you should save these changes. Please note that on saving these changes your web app will be recycled.  

When you create a storage account two access keys are generated. You should avoid regenerating both the access keys together. You should regenerate a single account access key at a time ex: primary key and before you regenerate the account access key you should update the other existing account access key ex: secondary in your web app storage mount configuration. Once the account access key is regenerated you may update the new account access key in web app storage mount configuration and then repeat the regeneration process for other account access key. This stepwise approach will allow Azure storage mount availability for your web app during account access key regeneration process. Please remember that any changes to storage mount configuration will cause your web app to be recycled 

If you delete a connected Azure Storage account or container, then you should remove the same from your web app configuration to avoid possible error scenarios. 

Azure App Service supports scale out for your web app. Please remember that if your web app scales to multiple instances then all these will connect to the same Azure storage mount which may lead to performance bottlenecks and throughput issues. You should choose appropriate performance tier for connected Azure storage mount to avoid such issues  

Scalability and performance of Azure Blob storage mounts are dependent on Azure Blob storage scalability and performance targets as explained here. Your web app can access mounts with either standard or premium performance tier. Based on your web app capacity and throughput requirements you should choose appropriate Azure storage performance tier 

Scalability and performance of Azure Files storage mounts are dependent on Azure Files storage scalability and performance targets as explained here. Your web app can access mounts with either standard or premium performance tier. Based on your web app capacity and throughput requirements you should choose appropriate Azure storage performance tier 

If the Azure storage mount path exists on the App Service web app, it will be overwritten by the storage mount. For example, if you deployed a folder named “public” under wwwroot, the content you deployed under “public” folder previously will not be available to your web app if you mount Azure storage with a path of /home/site/wwwroot/public. 

It is not recommended to use mounts for local databases (e.g., SQLite) or for any other applications & components that rely on file handles/locks. 

Azure Storage billing is separate, and it is not included along with the web app billing 

Azure App services allows backup of your web app as explained here. Please note that these backup methods will not backup Azure storage mounts connected to your web app. It is recommended to use backup strategies & tools applicable for Azure Storage accounts 

Your web app can access Azure storage accounts having private endpoints and service endpoints. Please note that custom DNS support is currently unavailable when accessing Azure Storage accounts having private endpoint 

To configure service endpoints for Azure storage please refer to Configure Azure Storage firewalls and virtual networks and for private endpoints please refer to Use private endpoints - Azure Storage.  When using Azure storage private endpoints with your web app you need to define two App Settings WEBSITE_DNS_SERVER = 168.63.129.16 and WEBSITE_VNET_ROUTE_ALL = 1  

Azure storage mounts using Firewall configuration will be accessible to your web app when using Service endpoints and Private endpoints. In other scenarios your web app cannot access mounts from Azure Storage accounts using Firewall configuration due to infrastructure limitations.   

If your web app is connected to a mount and you try to create a deployment slot with clone setting option, then you will receive an error. This is currently a known limitation. To work around, create a slot without cloning settings and manually add storage mount and other settings to the new slot later. 

if you use Storage Failover as explained here  to failover an existing mounted Azure Storage endpoint (ex: a Azure Files endpoint), the mount will fail to connect until you either restart the Web App or remove/re-add the Azure Storage mount 

If your web app and Azure storage account are in same Azure region and if you whitelist App service IP's in your Azure storage firewall configuration then these IP restrictions will not be honored. Please note that as explained above it is not recommended to have your web app and Azure storage account in different Azure region 

::: zone-end

## Next steps

::: zone pivot="container-windows"

- [Migrate custom software to Azure App Service using a custom container](tutorial-custom-container.md?pivots=container-windows).

::: zone-end

::: zone pivot="container-linux"

- [Configure a custom container](configure-custom-container.md?pivots=platform-linux).

::: zone-end