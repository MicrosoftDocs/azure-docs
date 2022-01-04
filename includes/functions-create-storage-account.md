---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/04/2018
ms.author: glenga
---
## Create an Azure Storage account

Functions uses a general-purpose account in Azure Storage to maintain state and other information about your functions. Create a general-purpose storage account in the resource group you created by using the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command.

In the following command, substitute a globally unique storage account name where you see the `<storage_name>` placeholder. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.

```azurecli-interactive
az storage account create --name <storage_name> --location westeurope --resource-group myResourceGroup --sku Standard_LRS
```
