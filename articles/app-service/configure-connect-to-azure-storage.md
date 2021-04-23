---
title: Add Azure Storage (container)
description: Learn how to attach custom network share in a containerized app in Azure App Service. Share files between apps, manage static content remotely and access locally, etc.
author: msangapu-msft

ms.topic: article
ms.date: 7/01/2019
ms.author: msangapu
zone_pivot_groups: app-service-containers-windows-linux
---
# Access Azure Storage (preview) as a network share from a container in App Service

::: zone pivot="container-windows"

This guide shows how to attach Azure Storage Files as a network share to a windows container in App Service. Only [Azure Files Shares](../storage/files/storage-how-to-use-files-cli.md) and [Premium Files Shares](../storage/files/storage-how-to-create-file-share.md) are supported. Benefits include secured content, content portability, access to multiple apps, and multiple transferring methods.

> [!NOTE]
>Azure Storage in App Service is **in preview** and **not supported** for **production scenarios**.

::: zone-end

::: zone pivot="container-linux"

This guide shows how to attach Azure Storage to a Linux container App Service. Benefits include secured content, content portability, persistent storage, access to multiple apps, and multiple transferring methods.

> [!NOTE]
>Azure Storage in App Service is **in preview** for App Service on Linux and Web App for Containers. It's **not supported** for **production scenarios**.

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

## Limitations

::: zone pivot="container-windows"

- Azure Storage in App Service is currently **not supported** for bring your own code scenarios (non-containerized Windows apps).
- Azure Storage in App Service **doesn't support** using the **Storage Firewall** configuration because of infrastructure limitations.
- Azure Storage with App Service lets you specify **up to five** mount points per app.
- Azure Storage mounted to an app is not accessible through App Service FTP/FTPs endpoints. Use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

::: zone-end

::: zone pivot="container-linux"

- Azure Storage in App Service supports mounting **Azure Files containers** (Read / Write) and **Azure Blob containers** (Read Only)
- Azure Storage in App Service lets you specify **up to five** mount points per app.
- Azure Storage mounted to an app is not accessible through App Service FTP/FTPs endpoints. Use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

::: zone-end

## Link storage to your app

::: zone pivot="container-windows"

Once you've created your [Azure Storage account, file share and directory](#prerequisites), you can now configure your app with Azure Storage.

To mount an Azure Files Share to a directory in your App Service app, you use the [`az webapp config storage-account add`](/cli/azure/webapp/config/storage-account#az_webapp_config_storage_account_add) command. Storage Type must be AzureFiles.

```azurecli
az webapp config storage-account add --resource-group <group-name> --name <app-name> --custom-id <custom-id> --storage-type AzureFiles --share-name <share-name> --account-name <storage-account-name> --access-key "<access-key>" --mount-path <mount-path-directory of form c:<directory name> >
```

You should do this for any other directories you want to be linked to an Azure Files share.

::: zone-end

::: zone pivot="container-linux"

Once you've created your [Azure Storage account, file share and directory](#prerequisites), you can now configure your app with Azure Storage.

To mount a storage account to a directory in your App Service app, you use the [`az webapp config storage-account add`](/cli/azure/webapp/config/storage-account#az_webapp_config_storage_account_add) command. Storage Type can be AzureBlob or AzureFiles. AzureFiles is used in this example. The mount path setting corresponds to the folder inside the container that you want to mount to Azure Storage. Setting it to '/' mounts the entire container to Azure Storage.


> [!CAUTION]
> The directory specified as the mount path in your web app should be empty. Any content stored in this directory will be deleted when an external mount is added. If you are migrating files for an existing app, make a backup of your app and its content before you begin.
>

```azurecli
az webapp config storage-account add --resource-group <group-name> --name <app-name> --custom-id <custom-id> --storage-type AzureFiles --share-name <share-name> --account-name <storage-account-name> --access-key "<access-key>" --mount-path <mount-path-directory>
```

You should do this for any other directories you want to be linked to a storage account.

::: zone-end

## Verify linked storage

Once the share is linked to the app, you can verify this by running the following command:

```azurecli
az webapp config storage-account list --resource-group <resource-group> --name <app-name>
```

## Next steps

::: zone pivot="container-windows"

- [Migrate custom software to Azure App Service using a custom container](tutorial-custom-container.md?pivots=container-windows).

::: zone-end

::: zone pivot="container-linux"

- [Configure a custom container](configure-custom-container.md?pivots=platform-linux).

::: zone-end