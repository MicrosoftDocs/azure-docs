---
title: Changing the redundancy configuration for a storage account 
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 01/09/2019
ms.author: tamram
ms.reviewer: artek
ms.subservice: common
---

# Changing the redundancy configuration for a storage account

You can change your storage account's redundancy configuration by using the [Azure portal](https://portal.azure.com/), [Azure Powershell](storage-powershell-guide-full.md), [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest), or one of the [Azure Storage client libraries](https://docs.microsoft.com/azure/index#pivot=sdkstools). Changing the replication type of your storage account does not result in down time.

> [!NOTE]
> Currently, you cannot use the Azure portal or the Azure Storage client libraries to convert your account to ZRS, GZRS, or RA-GZRS. To migrate your account to ZRS, see [Zone-redundant storage (ZRS) for building highly available Azure Storage applications](storage-redundancy-zrs.md) for details. To migrate GZRS or RA-GZRS, see [Geo-zone-redundant storage for highly availability and maximum durability (preview)](storage-redundancy-zrs.md) for details.

Costs associated with changing your storage account's redundancy configuration depend on your conversion path. Ordering from least to the most expensive, Azure Storage redundancy offerings include LRS, ZRS, GRS, RA-GRS, GZRS, and RA-GZRS. For example, going *from* LRS to any other type of replication will incur additional charges because you are moving to a more sophisticated redundancy level. Migrating *to* GRS or RA-GRS will incur an egress bandwidth charge because your data (in your primary region) is being replicated to your remote secondary region. This charge is a one-time cost at initial setup. After the data is copied, there are no further migration charges. You are only charged for replicating any new or updates to existing data. For details on bandwidth charges, see [Azure Storage Pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/).

If you migrate your storage account from GRS to LRS, there is no additional cost, but your replicated data is deleted from the secondary location.

If you migrate your storage account from RA-GRS to GRS or LRS, that account is billed as RA-GRS for an additional 30 days beyond the date that it was converted.

