---
title: Serve content from Azure Storage to Linux containers
description: Learn how to attach custom network share to your Linux container in Azure App Service. Share files between apps, manage static content remotely and access locally, etc.
author: msangapu-msft

ms.topic: article
ms.date: 01/02/2020
ms.author: msangapu
---

# Serve content from Azure Storage in App Service on Linux

> [!NOTE]
> This article applies to Linux containers. To deploy to custom Windows containers, see [Configure Azure Files in a Windows Container on App Service](../configure-connect-to-azure-storage.md). Azure Storage in App Service on Linux is a **preview** feature. This feature is **not supported for production scenarios**.
>

This guide shows how to attach Azure Storage to App Service on Linux. Benefits include secured content, content portability, persistent storage, access to multiple apps, and multiple transferring methods.

## Prerequisites

- [Azure CLI](/cli/azure/install-azure-cli) (2.0.46 or later).
- An existing [App Service on Linux app](https://docs.microsoft.com/azure/app-service/containers/).
- An [Azure Storage Account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?tabs=azure-cli)
- An [Azure file share and directory](https://docs.microsoft.com/azure/storage/common/storage-azure-cli#create-and-manage-file-shares).


## Limitations of Azure Storage with App Service

- Azure Storage with App Service is **in preview** for App Service on Linux and Web App for Containers. It's **not supported** for **production scenarios**.
- Azure Storage with App Service supports mounting **Azure Files containers** (Read / Write) and **Azure Blob containers** (Read Only)
- Azure Storage with App Service **doesn't support** using the **Storage Firewall** configuration because of infrastructure limitations.
- Azure Storage with App Service lets you specify **up to five** mount points per app.
- Azure Storage is **not included** with your web app and billed separately. Learn more about [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage).

> [!WARNING]
> App Service configurations using Azure Blob Storage will become Read only in Feb 2020. [Learn more](https://github.com/Azure/app-service-linux-docs/blob/master/BringYourOwnStorage/mounting_azure_blob.md)
>

## Configure your app with Azure Storage

Once you've created your [Azure Storage account, file share and directory](#prerequisites), you can now configure your app with Azure Storage.

To mount a storage account to a directory in your App Service app, you use the [`az webapp config storage-account add`](https://docs.microsoft.com/cli/azure/webapp/config/storage-account?view=azure-cli-latest#az-webapp-config-storage-account-add) command. Storage Type can be AzureBlob or AzureFiles. AzureFiles is used in this example.


> [!CAUTION]
> The directory specified as the mount path in your web app should be empty. Any content stored in this directory will be deleted when an external mount is added. If you are migrating files for an existing app, make a backup of your app and its content before you begin.
>

```azurecli
az webapp config storage-account add --resource-group <group_name> --name <app_name> --custom-id <custom_id> --storage-type AzureFiles --share-name <share_name> --account-name <storage_account_name> --access-key "<access_key>" --mount-path <mount_path_directory>
```

You should do this for any other directories you want to be linked to a storage account.

## Verify Azure Storage link to the web app

Once a storage container is linked to a web app, you can verify this by running the following command:

```azurecli
az webapp config storage-account list --resource-group <resource_group> --name <app_name>
```

## Use Azure Storage in Docker Compose

Azure Storage can be mounted with multi-container apps using the custom-id. To view the custom-id name, run [`az webapp config storage-account list --name <app_name> --resource-group <resource_group>`](/cli/azure/webapp/config/storage-account?view=azure-cli-latest#az-webapp-config-storage-account-list).

In your *docker-compose.yml* file, map the `volumes` option to `custom-id`. For example:

```yaml
wordpress:
  image: wordpress:latest
  volumes:
  - <custom-id>:<path_in_container>
```

## Next steps

- [Configure web apps in Azure App Service](../configure-common.md).

