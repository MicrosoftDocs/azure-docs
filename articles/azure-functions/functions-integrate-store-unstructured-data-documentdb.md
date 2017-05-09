---
title: Store unstructured data using Azure Functions and DocumentDB | Microsoft Docs
description: Store unstructured data using Azure Functions and DocumentDB
services: functions
documentationcenter: functions
author: rachelappel
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, documentdb, dynamic compute, serverless architecture

ms.assetid: 
ms.service: functions
ms.devlang: multiple
ms.topic: ms-hero
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/25/2017
ms.author: rachelap

---
#  Store blobs using Azure Functions

This quickstart walks through how to use DocumentDB to store unstructured data in an Azure Function. 

## Before you begin

Before running this sample, install the following prerequisites locally:

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Download the sample

Clone the sample app repository to your local machine.

```bash
git clone https://github.com/Azure/azure-docs-cli-python-samples 
```
> [!TIP]
> Alternatively, you can [download the sample](https://github.com/Azure/azure-docs-cli-python-samples) as a zip file and extract it.

## Log In

Open a command window and log into your Azure subscription with the `az login` command and follow the on-screen directions.

```azurecli
az login
```

## Create a resource group

A resource group is a way to manage sets or groups of resources in Azure, such as app services, function apps, and databases. To create a resource group, use [az group create](/cli/azure/group#create).

```azurecli
az group create --name myResourceGroup --location westeurope
```
  
## Create a storage account 

Azure uses storage accounts as a way to group together storage objects with the same billing needs. These objects can be blobs, queues, tables, files, or other resources. You must associate your function with a storage account, and can do so using  the `az storage account create` command.

```azurecli
az storage account create --name myfunctionappstorage --location westeurope --resource-group myResourceGroup --sku Standard_LRS
```
  
## Create the Azure Function App

Use the `az functionapp create` command to create your Function App. The `name`, `resource-group`, `storage-account`, and `consumption-plan-location` arguments are all required. 

```azurecli
az functionapp create --name myFunction --resource-group myResourceGroup --storage-account myfunctionappstorage --consumption-plan-location westeurope
```

## Update function app's settings

Once you have created the function app, you must update its configuration to reflect the use of the DocumentDB document using the `az functionapp config appsettings update` command.

```
az functionapp config appsettings update --name MyFunction --resource-group MyGroup --setting mydocumentdb="AccountEndpoint=https://mydocumentdb.documents.azure.com:443/;AccountKey=MyKey;"
```

## Clean up resources

[!INCLUDE [functions-quickstart-cleanup](../../includes/functions-quickstart-cleanup.md)]	 

## Next steps

For more information about Azure Functions, see the following topics:

[!INCLUDE [functions-quickstart-next-steps](../../includes/functions-quickstart-next-steps.md)]

[!INCLUDE [Getting help note](../../includes/functions-get-help.md)]