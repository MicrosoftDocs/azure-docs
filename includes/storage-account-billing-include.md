---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 10/19/2018
ms.author: tamram
ms.custom: "include file"
---

You're billed for Azure Storage based on your storage account usage. All objects in a storage account are billed together as a group. 

Storage costs are calculated according to the following factors: 

* **Region** refers to the geographical region in which your account is based.
* **Account type** refers to the type of storage account you're using. 
* **Access tier** refers to the data usage pattern you've specified for your general-purpose v2 or Blob storage account.
* Storage **Capacity** refers to how much of your storage account allotment you're using to store data.
* **Replication** determines how many copies of your data are maintained at one time, and in what locations.
* **Transactions** refer to all read and write operations to Azure Storage.
* **Data egress** refers to any data transferred out of an Azure region. When the data in your storage account is accessed by an application that isn't running in the same region, you're charged for data egress. For information about using resource groups to group your data and services in the same region to limit egress charges, see [What is an Azure resource group?](https://docs.microsoft.com/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management#what-is-an-azure-resource-group). 

The [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) page provides detailed pricing information based on account type, storage capacity, replication, and transactions. The [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/) provides detailed pricing information for data egress. You can use the [Azure Storage Pricing Calculator](https://azure.microsoft.com/pricing/calculator/?scenario=data-management) to help estimate your costs.

