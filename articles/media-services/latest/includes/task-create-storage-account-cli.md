---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI
---

<!-- ### Create a storage account -->

When creating a Media Services account, you need to supply the name of an Azure Storage account resource. The specified storage account is attached to your Media Services account. For more information about how storage accounts are used in Media Services, see [Storage accounts](../storage-account-concept.md).

You must have one **Primary** storage account and you can have  any number of **Secondary** storage accounts associated with your Media Services account. Media Services supports **General-purpose v2** (GPv2) or **General-purpose v1** (GPv1) accounts. Blob only accounts are not allowed as **Primary**. If you want to learn more about storage accounts, see [Azure Storage account options](../../../storage/common/storage-account-overview.md). 

In this example, we create a General Purpose v2, Standard LRS account. If you want to experiment with storage accounts, use `--sku Standard_LRS`. However, when picking a SKU for production you should consider, `--sku Standard_RAGRS`, which provides geographic replication for business continuity. For more information, see [storage accounts](/cli/azure/storage/account).

The following command creates a Storage account that is going to be associated with the Media Services account. In the script below, you can substitute `storageaccountforams` with your value. `amsResourceGroup` must match the value you gave for the resource group in the previous step. The storage account name must have length less than 24.

```azurecli
az storage account create --name storageaccountforams --kind StorageV2 --sku Standard_LRS -l westus2 -g amsResourceGroup
```
