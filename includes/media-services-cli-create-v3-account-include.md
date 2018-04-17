---
title: include file
description: include file
services: media-services
author: Juliako
ms.service: media-services
ms.topic: include
ms.date: 04/13/2018
ms.author: juliako
ms.custom: include file
---

## Create a Media Services account

You first need to create a Media Services account. This section shows what you need for the acount creation using CLI 2.0.

### Create a resource group

Create a resource group using the following command. An Azure resource group is a logical container into which resources like Azure Media Services accounts and the associated Storage accounts are deployed and managed.

```azurecli-interactive
az group create --name amsResourcegroup --location westus2
```

### Create a storage account

When creating a Media Services account, you need to supply the name of an Azure Storage account resource. The specified storage account is attached to your Media Services account. 

The following command creates a Storage account that is going to be associated with the Media Services account. In the script below, you can substitute `storageaccountforams` with your value. The account name must have length less than 24.

```azurecli-interactive
az storage account create --name storageaccountforams --resource-group amsResourcegroup
```

### Create a Media Services account

The following Azure CLI command creates a new Media Services account. You can replace the following values: `amsaccountname`  `storageaccountforams` (must match the value you gave for your storage account), and `amsResourcegroup` (must match the value you gave for the resource group).

```azurecli-interactive
az ams account create --name amsaccountname --resource-group amsResourcegroup --storage-account storageaccountforams
```
