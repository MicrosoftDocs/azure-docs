---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 03/03/2022
ms.author: inhenkel
---

<!-- ### Create a storage account -->

## Create an Azure Storage account

Use the following commands to create an Azure Storage account.

To create a storage account, you must first create a resource group within a location.

<!-- List locations -->

To list available locations, use the following command:

[!INCLUDE [task-list-locations-cli](task-list-locations-cli.md)]

<!-- Create a resource group -->

[!INCLUDE [task-create-resource-group-cli](task-create-resource-group-cli.md)]

## Choose a SKU

You also need to choose a SKU for your storage account. You can list storage accounts.

[!INCLUDE [sku-list](sku-list.md)]

- Change `myStorageAccount` to a unique name with a length of fewer than 24 characters.
- Change `chooseLocation` to the region you want to work within. 
- Change `chooseSKU` to your preferred SKU.

:::code language="azurecli" source="~/media-services-v3-python/cli/code-snippets.sh" id="CreateStorage" interactive="azurecli-interactive":::