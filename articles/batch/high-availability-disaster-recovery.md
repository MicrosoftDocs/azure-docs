---
title: High availability and disaster recovery - Azure Batch | Microsoft Docs
description: Learn how to design your Batch application for a regional outage
services: batch
documentationcenter: ''
author: laurenhughes
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: batch
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/29/2019
ms.author: lahugh
---

# Design your application to cater for a regional outage

Azure Batch is a regional service. Batch is available in all Azure regions, but when a Batch account is created it must be associated with a region, all operations for that account then apply to that region. For example, pools and associated virtual machines (VMs) are allocated in the Batch account region.

When designing an application that uses Batch, you must consider the possibility of Batch not being available in a region. It's possible to encounter a rare occasion where there is a problem with the region as a whole, the whole Batch service in the region, or with your specific Batch account.

If the application or solution using Batch always needs to be available, then it should be designed to either be able to failover to another region or always have the workload split between two or more regions. Both approaches require at least two Batch accounts, with each account located in a different region.

## Multiple Batch accounts in multiple regions

Using multiple Batch accounts in various regions provides the ability for your application to continue running if a Batch account in another region becomes unavailable. This is especially important if your application needs to be highly available.

In some cases, an application may be designed to always use two or more regions. When a huge amount of capacity is required, for example, then utilizing multiple regions may be needed to be sure of allocating the required amount of capacity and cater for future growth.

## Design considerations for providing failover

A key point to consider when providing the ability to failover to an alternate region is that all components in a solution need to be considered; it is not sufficient to simply have a second Batch account. For example, in a most Batch applications, an Azure storage account is required, with the storage account and Batch account needing to be in the same region for acceptable performance.

Consider the following points when designing a solution that can failover:

- Pre-create all required accounts in each region, such as the Batch account and storage account. There often is not any charge for having accounts created, only when there is data stored or the account is used.
- Ensure that quotas are set on the accounts ahead of time, so you can allocate the required amount of cores using the Batch account.
- Use templates and/or scripts to automate the deployment of the application in a region.
- Keep application binaries and reference data up-to-date in all regions. This will ensure the region can be brought online quickly without having to wait for the upload and deployment of files. For example, if a custom application to install on pool nodes is stored and referenced using Batch application packages, then when a new version of the application is produced, it should be uploaded to each Batch account and referenced by the pool configuration (or make the new version the default version).
- In the application calling Batch, storage, and any other services, be able to easily switchover clients or the load to the different region.
- A best practice to ensure a failover will be successful is to frequently switchover to an alternate region as part of normal operation. For example, with two deployments in separate regions, switchover to the alternate region every month.

## Next steps

- Learn more about creating Batch accounts with the [Azure portal](batch-account-create-portal.md), the [Azure CLI](cli-samples.md), [Powershell](batch-powershell-cmdlets-get-started.md), or the [Batch management API](batch-management-dotnet.md).
- Default quotas are associated with a Batch account; [this article](batch-quota-limit.md) details the default quota values and describes how the quotas can be increased.
