---
title: High availability and disaster recovery
description: Learn how to design your Batch application for a regional outage.
ms.topic: how-to
ms.date: 01/29/2019
---

# Design your application for high availability

Azure Batch is a regional service. Batch is available in all Azure regions, but when a Batch account is created it must be associated with a region. All operations for the Batch account then apply to that region. For example, pools and associated virtual machines (VMs) are created in the same region as the Batch account.

When designing an application that uses Batch, you must consider the possibility of Batch not being available in a region. It's possible to encounter a rare situation where there is a problem with the region as a whole, the entire Batch service in the region, or a problem with your specific Batch account.

If the application or solution using Batch always needs to be available, then it should be designed to either failover to another region or always have the workload split between two or more regions. Both approaches require at least two Batch accounts, with each account located in a different region.

## Multiple Batch accounts in multiple regions

Using multiple Batch accounts in various regions provides the ability for your application to continue running if a Batch account in another region becomes unavailable. Using multiple accounts is especially important if your application needs to be highly available.

In some cases, an application may be designed to always use two or more regions. For example, when you need a considerable amount of capacity, using multiple regions may be needed to handle either a large-scale application or cater for future growth.

## Design considerations for providing failover

A key point to consider when providing the ability to failover to an alternate region is that all components in a solution need to be considered; it is not sufficient to simply have a second Batch account. For example, in most Batch applications, an Azure storage account is required, with the storage account and Batch account needing to be in the same region for acceptable performance.

Consider the following points when designing a solution that can failover:

- Pre-create all required accounts in each region, such as the Batch account and storage account. There often is not any charge for having accounts created, only when there is data stored or the account is used.
- Make sure quotas are set on the accounts ahead of time, so you can allocate the required number of cores using the Batch account.
- Use templates and/or scripts to automate the deployment of the application in a region.
- Keep application binaries and reference data up-to-date in all regions. Staying up-to-date will ensure the region can be brought online quickly without having to wait for the upload and deployment of files. For example, if a custom application to install on pool nodes is stored and referenced using Batch application packages, then when a new version of the application is produced, it should be uploaded to each Batch account and referenced by the pool configuration (or make the new version the default version).
- In the application calling Batch, storage, and any other services, easily switchover clients or the load to the different region.
- A best practice to ensure a failover will be successful is to frequently switchover to an alternate region as part of normal operation. For example, with two deployments in separate regions, switchover to the alternate region every month.

## Next steps

- Learn more about creating Batch accounts with the [Azure portal](batch-account-create-portal.md), the [Azure CLI](cli-samples.md), [PowerShell](batch-powershell-cmdlets-get-started.md), or the [Batch management API](batch-management-dotnet.md).
- Default quotas are associated with a Batch account; [this article](batch-quota-limit.md) details the default quota values and describes how the quotas can be increased.
