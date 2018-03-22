---
title: ZRS Classic is a legacy option for replicating block blobs in Azure Storage | Microsoft Docs
description: ZRS Classic By default, new storage accounts use locally redundant storage (LRS) for replication. LRS is the least expensive option for replication. It protects against hardware failures in the datacenter, but not against datacenter-level disasters.
services: storage
author: tolandmike
manager: jeconnoc

ms.service: storage
ms.topic: article
ms.date: 03/20/2018
ms.author: jeking
---

# ZRS Classic: A legacy option for redundancy of block blobs

ZRS Classic accounts are available only for block blobs in general-purpose V1 storage accounts. ZRS Classic replicates data asynchronously across datacenters within one to two regions. A replica may not be available unless Microsoft initiates failover to the secondary. A ZRS Classic account cannot be converted to or from LRS or GRS, and does not have metrics or logging capability.

ZRS Classic accounts cannot be converted to or from LRS, GRS, or RA-GRS. ZRS Classic accounts also do not support metrics or logging.   

Once ZRS is generally available in a region, you will no longer be able to create a ZRS Classic account from the portal in that region, but you can create one through other means.  

An automated migration process from ZRS Classic to ZRS will be provided in the future.

You can manually migrate ZRS account data to or from an LRS, ZRS Classic, GRS, or RAGRS account. You can perform this manual migration using AzCopy, Azure Storage Explorer, Azure PowerShell, Azure CLI, or one of the Azure Storage client libraries.

> [!NOTE]
> ZRS Classic accounts are planned for deprecation and required migration on March 31, 2021. Microsoft will send more details to ZRS Classic customers prior to deprecation.

## See also

