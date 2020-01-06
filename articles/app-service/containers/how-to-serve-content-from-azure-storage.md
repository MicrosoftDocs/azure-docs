---
title: Attach custom Storage container on Linux
description: Learn how to attach custom network share to your Linux container in Azure App Service. Share files between apps, manage static content remotely and access locally, etc.
author: msangapu-msft

ms.topic: article
ms.date: 01/02/2020
ms.author: msangapu
---

# Attach Azure Storage containers to Linux containers

This guide shows how to attach network shares to App Service on Linux from using [Azure Storage](/azure/storage/common/storage-introduction). Benefits include secured content, content portability, persistent storage, access to multiple apps, and multiple transferring methods.


> [!IMPORTANT]
> Bring your own storage (BYOS) functionality is a **preview** feature. This feature is **not supported for production scenarios**.
>

## Prerequisites

To use the *Bring your own storage (BYOS)* feature, you'll need an existing web app and an Azure Storage account. 

- [App Service Quickstart](https://docs.microsoft.com/azure/app-service/).
- [Storage Quickstart](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?tabs=azure-cli)
- [Azure CLI](/cli/azure/install-azure-cli) (2.0.46 or later).

## Known issues and limitations

- BYOS is **in preview** and **not supported** for **production scenarios**.
- BYOS is **in preview** for bring your own code, and bring your own container scenarios on Linux App Service plans.
   - BYOS on Linux App Service plans supports mounting **Azure Files containers** (Read / Write) and **Azure Blob containers** (Read Only)
- BYOS **doesn't support** using the **Storage Firewall** configuration because of infrastructure limitations.
- BYOS lets you specify **up to five** mount points per app.
- Azure Storage is billed independently and **not included** with your web app. Learn more about [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage).

## Configure your app to use BYOS with Azure CLI

> [!CAUTION]
> The directory specified as the mount path in your web app should be empty. Any content stored in this directory will be deleted when an external mount is added. If you are migrating files for an existing app, make a backup of your app and its content before you begin.
>

To mount a storage account to a directory in your App Service app, you use the [`az webapp config storage-account add`](https://docs.microsoft.com/cli/azure/webapp/config/storage-account?view=azure-cli-latest#az-webapp-config-storage-account-add) command. Storage Type can be AzureBlob or AzureFiles. You use AzureBlob for this container.

```azurecli
az webapp config storage-account add --resource-group <group_name> --name <app_name> --custom-id <custom_id> --storage-type AzureFiles --share-name <share_name> --account-name <storage_account_name> --access-key "<access_key>" --mount-path <mount_path_directory>
```

You should do this for any other directories you want to be linked to a storage account.

Learn more about [`az webapp config storage-account`](https://docs.microsoft.com/cli/azure/webapp/config/storage-account?view=azure-cli-latest)


### Verify BYOS link

Once a storage container is linked to a web app, you can verify this by running the following command:

```azurecli
az webapp config storage-account list --resource-group <resource_group> --name <app_name>
```

## Use BYOS in Docker Compose

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

