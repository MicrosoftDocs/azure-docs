---
title: Configure Storage using Azure Files
description: How to configure and connect to Azure Files in Windows Container on App Service.
author: msangapu-msft
manager: gwallace

ms.service: app-service
ms.workload: web
ms.topic: article
ms.date: 7/01/2019
ms.author: msangapu-msft
---
# Configure Azure Files in a Windows Container on App Service

> [!NOTE]
> This article applies to custom Windows containers. To deploy to App Service on _Linux_, see [Serve Content from Azure Storage](./containers/how-to-serve-content-from-azure-storage.md).
>

This guide shows how to access Azure Storage in Windows Containers. Only [Azure Files Shares](https://docs.microsoft.com/azure/storage/files/storage-how-to-use-files-cli) and [Premium Files Shares](https://docs.microsoft.com/azure/storage/files/storage-how-to-create-premium-fileshare) are supported. You use Azure Files Shares in this how-to. Benefits include secured content, content portability, access to multiple apps, and multiple transferring methods.

## Prerequisites

- [Azure CLI](/cli/azure/install-azure-cli) (2.0.46 or later).
- [An existing Windows Container app in Azure App Service](https://docs.microsoft.com/azure/app-service/app-service-web-get-started-windows-container)
- [Create Azure file share](https://docs.microsoft.com/azure/storage/files/storage-how-to-use-files-cli)
- [Upload files to Azure File share](https://docs.microsoft.com/azure/storage/files/storage-files-deployment-guide)

> [!NOTE]
> Azure Files is non-default storage and billed separately, not included with the web app. It doesn't support using Firewall configuration due to infrastructure limitations.
>

## Link storage to your web app (preview)

 To mount an Azure Files Share to a directory in your App Service app, you use the [`az webapp config storage-account add`](https://docs.microsoft.com/cli/azure/webapp/config/storage-account?view=azure-cli-latest#az-webapp-config-storage-account-add) command. Storage Type must be AzureFiles.

```azurecli
az webapp config storage-account add --resource-group <group_name> --name <app_name> --custom-id <custom_id> --storage-type AzureFiles --share-name <share_name> --account-name <storage_account_name> --access-key "<access_key>" --mount-path <mount_path_directory of form c:<directory name> >
```

You should do this for any other directories you want to be linked to an Azure Files share.

## Verify

Once an Azure Files share is linked to a web app, you can verify this by running the following command:

```azurecli
az webapp config storage-account list --resource-group <resource_group> --name <app_name>
```


## Next steps

- [Migrate an ASP.NET app to Azure App Service using a Windows container (Preview)](app-service-web-tutorial-windows-containers-custom-fonts.md).