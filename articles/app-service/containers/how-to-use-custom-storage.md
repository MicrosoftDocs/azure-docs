---
title: How to: use custom storage for App Service Linux
description: Learn how to configure your own storage in Azure App Service Linux with WordPress.
services: app-service
documentationcenter: app-service
author: msangapu
manager: jeconnoc

ms.assetid: 95c4072b-8570-496b-9c48-ee21a223fb60
ms.service: app-service
ms.workload: web
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 10/8/2018
ms.author: msangapu

---
# Bring your own storage in App Service Linux

## Introduction

App Service now supports "Bring your own storage" (preview) for App Service Linux and Web App for Containers. This article uses Azure Storage to link to a WordPress app. You can read more about "Bring your own storage".

Bring your own storage is in preview and currently limited to the AZ CLI client. You can use API and Storage Explorer to transfer files. You can configure up to five Azure storage accounts for a given App Service. 

> [!CAUTION]
> This is currently in preview. If your WordPress app contains images in the uploads folder, you should make full backup of the app before continuing.
> Linking a storage account to the uploads directory of an existing WordPress app will delete the contents.
>

## Pre-requisites:

1. [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) (2.0.46 or later)
1. WordPress on Web App for Containers


## Set the Azure subscription

To use the Azure Command-Line Interface, you must [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) on your computer.

1. Open Terminal, and login to your account.

```azure-cli
az login
```

1. Check to see the list of accounts:

```azure-cli
az account list
```

1. Set the subscription to use. Replace <id> with your subscription id.

```azure-cli
az account set --subscription <your_subscription_id>  
```

1. The subscription is now set. You can confirm these settings:

```azure-cli
az account show
```

## Add storage to the WordPress app

1. Create storage account:

        az storage account create --name wp-uploads-account --resource-group myResourceGroup

1. Create the storage blob

        az storage container create --name wp-uploads --account-name wp-uploads-account

1. Get access key

        az storage account keys list -g myResourceGroup -n mybyos

1. Link storage to your app

        az webapp config storage-account add --resource-group myResourceGroup --name <web_app_name> --custom-id wp-uploads --storage-type AzureBlob --share-name wp-uploads --account-name wp-uploads-account --access-key "<access_key>" --mount-path /home/site/wwwroot/uploads


## Next steps

For more information, see the []().