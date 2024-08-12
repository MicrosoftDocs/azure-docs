---
title: Reliability in Azure Storage Actions
description: Find out about reliability in Azure Storage Actions
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-storage-actions
ms.date: 06/10/2024
---

# Reliability in Azure Storage Actions

This article describes reliability support in [Azure Storage Actions](../storage-actions/overview.md), and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Azure Storage Actions is a serverless framework that you can use to perform common data operations on millions of objects across multiple storage accounts. The service itself is regional, and it doesn’t have SKUs or support for availability zones. However, the control plane of the service automatically supports zone-redundancy. The data plane also may support redundancy depending on whether or not the storage account is running on a zone-redundant configuration.



## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

While the Azure Storage Actions service is regional and doesn’t offer SKUs or availability zones, zone redundancy is available from the control plane and conditionally from the data plane:

- **Control plane of the service is zone-redundant.** When a zone is down in one region, the control plane continues to be available. During a zone-down scenario,  you can continue to manage task definition and assignment. 

- **Data plane (task assignment execution) inherits the zonal properties from the parent storage account.** If the storage account is deployed to a failed zone, then the account becomes unavailable and from customer’s perspective, the data plan isn't available. If the storage account is zone redundant, then the account continues to be available, and the service continue to perform operation on the account. 



### Zone down experience

In a zone-done scenario, the Storage Action service continues to be available. The progress of tasks depends on the availability zone support of storage accounts against which they are running. If the account is not affected by the downed zone, the tasks continue to make progress. Otherwise, the tasks fail. 

### Zone outage preparation and recovery

The Storage Action service isn't zonal, but the storage account is. If the storage account is affected by a zone outage, storage tasks that are assigned to the account fail. After the zone and storage account become available, scheduled tasks continue to run according to schedule. If the task is configured to run once, you may need to schedule the task to run again. 


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Storage Action is a regional service, and it runs against accounts in the same region. When a region is down, both the storage account and service are also down.  The service doesn't support disaster recovery across regions. If you trigger a failover of the storage account to a different region, then storage tasks can’t run against the storage account until it fails back to the original region.  So, although you may be able to recover the storage account, the storage task won't be able to run against it. 

>[!IMPORTANT]
>If you migrate your storage account from a GRS or GZRS primary region to a secondary region or vice versa, then any storage tasks that target the storage account won't be triggered and any existing task executions might fail.

### Outage detection, notification, and management

Storage tasks don’t send any notifications when there is an outage in the service itself. It is important that you check the status of the storage task and retry tasks after the service/region recovers. 




## Next steps
- [Tutorial: Create a highly available multi-region app in Azure App Service](/azure/app-service/tutorial-multi-region-app)
- [Reliability in Azure](/azure/availability-zones/overview)




