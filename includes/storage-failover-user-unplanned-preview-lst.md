---
title: "include file"
description: "include file"
services: storage
author: stevenmatthew
ms.service: azure-storage
ms.subservice: common-concepts
ms.topic: "include"
ms.date: 05/02/2024
ms.author: shaas
ms.custom: "include file", references_regions
---

> [!IMPORTANT]
> In some cases, a storage account's Last Sync Time (LST) value may be reported as NULL. 

System snapshots are periodically created in a storage account's secondary region to maintain consistent recovery points used during failover and failback. Initiating customer-managed failover causes the original primary region becomes the new secondary. In some cases there are no system snapshots available on new secondary after the failover completes, causing the account's overall LST value to be displayed as `Null`.

Because user activities such as creating, modifying, or deleting objects can trigger snapshot creation, any account on which these activities occur after failover will not require addtional attention. However, accounts having no snapshots or user activity may continue to display a `Null` LST value until system snapshot creation is triggered.

If necessary, perform one of the following activities to trigger snapshot creation. Upon completion, your account should display a valid LST value within 30 minutes' time.

- Mount the share, then open any file for reading.
- Upload a test or sample file to the share.
- Create a share snapshot for the share from the Azure portal.
