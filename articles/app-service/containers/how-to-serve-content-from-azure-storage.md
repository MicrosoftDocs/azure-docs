---
title: Serve content from Azure Storage in App Service on Linux
description: How to configure and serve content from Azure Storage in Azure App Service on Linux.
author: msangapu
manager: jeconnoc

ms.service: app-service
ms.workload: web
ms.topic: article
ms.date: 10/16/2018
ms.author: msangapu

---
# Serve content from Azure Storage in App Service on Linux

This guide shows how to create and configure Azure Storage with a web app in Web App for Containers. This technique helps your web app offload content and serve only application logic, leaving the content to storage. You can easily [have all your content hosted in a custom storage account](https://blogs.msdn.microsoft.com/appserviceteam/2018/09/24/announcing-bring-your-own-storage-to-app-service/). 

The benefits of moving content to Azure Storage include: more bandwidth to the web app, content portability, and multiple methods of transferring content. You'll complete this how-to locally with the [Azure CLI](/cli/azure/install-azure-cli) command-line tool (2.0.46 or later).

## Prerequisites

To complete this how-to, you will need an [Azure storage account](https://docs.microsoft.com/en-us/azure/storage/common/storage-quickstart-create-account?tabs=azure-cli).

## Upload files

To upload a local directory to the storage account, you use the [`az storage blob upload-batch`](https://docs.microsoft.com/en-us/cli/azure/storage/blob?view=azure-cli-latest#az-storage-blob-upload-batch) command like below:

```azurecli
az storage blob upload-batch -d <local_directory_name> --account-name <account_name> --account-key "<access_key>" -s <source_location_name>
```

## Link storage

> [!CAUTION]
> Linking an existing directory in a web app to a storage account will delete the directory contents. Before you begin, make a backup of your app and its content.
>

To link a storage account to a directory within your web app, you use the [`az webapp config storage-account add`](https://docs.microsoft.com/en-us/cli/azure/webapp/config/storage-account?view=azure-cli-latest#az-webapp-config-storage-account-add) command.

1. Link storage to your app

```azurecli
az webapp config storage-account add --resource-group <resource_group> --name <web_app_name> --custom-id <custom_id> --storage-type AzureBlob --share-name <share_name> --account-name <storage_account_name> --access-key "<access_key>" --mount-path <mount_path_directory>
```

You should do this for any other directories you want to be linked to a storage account.

## Verify

Once a storage container is linked to a web app, you can verify this by running the following:

```azurecli
    az webapp conf storage-account list --resource-group <resource_group> --name <web_app_name>
```

## Next steps

- [Configure web apps in Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/web-sites-configure).