---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 03/03/2022
ms.author: inhenkel
ms.custom: CLI, devx-track-azurecli
---

<!-- ### Create a storage account -->

The following command creates a Storage account. 

This command assumes that you have already created a resource group within a location.

To list available regions, use the followng command:
:::code language="azurecli" source="./includes/cli-code-snippets.sh" id="ListLocations" interactive="azurecli-interactive":::

To create a resource group, use the following command:
:::code language="azurecli" source="./includes/cli-code-snippets.sh" id="CreateRG" interactive="azurecli-interactive":::

Change `mystorageaccount` to a unique name with a length of less than 24 characters. The command assumes that you have already created a resource group.  Use that resource group name for `myRG`.

Change `chooseRegion` to the region you want to work within. Change `chooseSKU` to your preferred SKU.

[!INCLUDE [sku-list](sku-list.md)]

:::code language="azurecli" source="./includes/cli-code-snippets.sh" id="CreateStorage" interactive="azurecli-interactive":::