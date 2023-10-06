---
title: Reliability in Azure Batch
description: Learn about reliability in Azure Batch
author: anaharris-ms
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.service: batch
ms.date: 03/09/2023
---

<!--#Customer intent:  I want to understand reliability support in Azure Batch so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->


# Reliability in Azure Batch

This article describes reliability support in Azure Batch and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and links to information on [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). 


## Availability zone support


[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Batch maintains parity with Azure on supporting availability zones.

### Prerequisites

- For [user subscription mode Batch accounts](../batch/accounts.md#batch-accounts), make sure that the subscription in which you're creating your pool doesn't have a zone offer restriction on the requested VM SKU. To see if your subscription doesn't have any restrictions, call the [Resource Skus List API](/rest/api/compute/resource-skus/list?tabs=HTTP) and check the `ResourceSkuRestrictions`. If a zone restriction exists, you can submit a support ticket to remove the zone restriction.

- Because InfiniBand doesn't support inter-zone communication, you can't create a pool with a zonal policy if it has inter-node communication enabled and uses a [VM SKU that supports InfiniBand](../virtual-machines/workloads/hpc/enable-infiniband.md).

- Batch maintains parity with Azure on supporting availability zones. To use the zonal option, your pool must be created in an [Azure region with availability zone support](availability-zones-service-support.md#azure-regions-with-availability-zone-support).

- To allocate your Batch pool across availability zones, the Azure region in which the pool was created must support the requested VM SKU in more than one zone. To validate that the region supports the requested VM SKU in more than one zone, call the [Resource Skus List API](/rest/api/compute/resource-skus/list?tabs=HTTP) and check the `locationInfo` field of `resourceSku`. Ensure that more than one zone is supported for the requested VM SKU. You can also use the [Azure CLI](/rest/api/compute/resource-skus/list?tabs=CLI) to list all available Resource SKUs with the following command:

    ```azurecli
    
        az vm list-skus
    
    ```


### Create an Azure Batch pool across availability zones

For examples on how to create a Batch pool across availability zones, see [Create an Azure Batch pool across availability zones](/azure/batch/create-pool-availability-zones).

Learn more about creating Batch accounts with the [Azure portal](../batch/batch-account-create-portal.md), the [Azure CLI](../batch/scripts/batch-cli-sample-create-account.md), [PowerShell](../batch/batch-powershell-cmdlets-get-started.md), or the [Batch management API](../batch/batch-management-dotnet.md).

### Zone down experience

During a zone down outage, the nodes within that zone become unavailable. Any nodes within that same node pool from other zone(s) aren't impacted and continue to be available. 

Azure Batch account doesn't reallocate or create new nodes to compensate for nodes that have gone down due to the outage. Users are required to add more nodes to the node pool, which are then allocated from other healthy zone(s). 

### Fault tolerance

To prepare for a possible availability zone failure, you should over-provision capacity of service to ensure that the solution can tolerate 1/3 loss of capacity and continue to function without degraded performance during zone-wide outages. Since the platform spreads VMs across three zones and you need to account for at least the failure of one zone, multiply peak workload instance count by a factor of zones/(zones-1), or 3/2. For example, if your typical peak workload requires four instances, you should provision six instances: (2/3 * 6 instances) = 4 instances.


### Availability zone redeployment and migration

You can't migrate an existing Batch pool to availability zone support. If you wish to recreate your Batch pool across availability zones, see [Create an Azure Batch pool across availability zones](/azure/batch/create-pool-availability-zones).

## Cross-region disaster recovery and business continuity

Azure Batch is available in all Azure regions. However, when a Batch account is created, it must be associated with one specific region. All subsequent operations for that Batch account only apply to that region. For example, pools and associated virtual machines (VMs) are created in the same region as the Batch account.

When designing an application that uses Batch, you must consider the possibility that Batch may not be available in a region. It's possible to encounter a rare situation where there's a problem with the region as a whole, the entire Batch service in the region, or your specific Batch account.

If the application or solution using Batch must always be available, then it should be designed to either failover to another region or always have the workload split between two or more regions. Both approaches require at least two Batch accounts, with each account located in a different region.

You're responsible for setting up cross-region disaster recovery with Azure Batch. If you run multiple Batch accounts across specific regions and take advantage of availability zones, your application can meet your disaster recovery objectives when one of your Batch accounts becomes unavailable. 

When providing the ability to failover to an alternate region, all components in a solution must be considered; it's not sufficient to simply have a second Batch account. For example, in most Batch applications, an Azure storage account is required. The storage account and Batch account must be in the same region for acceptable performance.

Consider the following points when designing a solution that can failover:

- Precreate all required services in each region, such as the Batch account and the storage account. There's often no charge for having accounts created, and charges accrue only when the account is used or when data is stored.

- Make sure ahead of time that the [appropriate quotas](/azure/batch/batch-quota-limit) are set for all **user subscription** Batch accounts, to allocate the required number of cores using the Batch account.

- Use templates and/or scripts to automate the deployment of the application in a region.

- Keep application binaries and reference data up to date in all regions. Staying up to date will ensure that the region can be brought online quickly without having to wait for the upload and deployment of files. For example, consider the case where a custom application to install on pool nodes is stored and referenced using Batch application packages. When an update of the application is released, it should be uploaded to each Batch account and referenced by the pool configuration (or make the latest version the default version).

- In the application calling Batch, storage, and any other services, make it easy to switch over clients or the load to different regions.

- Consider frequently switching over to an alternate region as part of normal operation. For example, with two deployments in separate regions, switch over to the alternate region every month.

The duration of time to recover from a disaster depends on the setup you choose. Batch itself is agnostic regarding whether you're using multiple accounts or a single account. In active-active configurations, where two Batch instances are receiving traffic simultaneously, disaster recovery is faster than for an active-passive configuration. Which configuration you choose should be based on business needs (different regions, latency requirements) and technical considerations. 


### Single-region disaster recovery
How you implement disaster recovery in Batch is the same, whether you're working in a single-region or multi-region geography. The only differences are which SKU you use for storage, and whether you intend to use the same or different storage account across all regions.

### Disaster recovery testing 

You should perform your own disaster recovery testing of your Batch enabled solution. It's considered a best practice to enable easy switching between client and service load across different regions. 

Testing your disaster recovery plan for Batch can be as simple as alternating Batch accounts. For example, you could rely on a single Batch account in a specific region for one operational day. Then, on the next day, you could switch to a second Batch account in a different region. Disaster recovery is primarily managed on the client side. This multiple-account approach to disaster recovery takes care of RTO and RPO expectations in either single-region or multiple-region geographies. 

### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the Shared Responsibility model. Microsoft is responsible for platform and infrastructural resiliency. You are responsible for addressing disaster recovery for any specific service you deploy and control. To ensure that recovery is proactive:

- You should always predeploy secondaries. The predeployment of secondaries is necessary because there's no guarantee of capacity at time of impact for those who haven't preallocated such resources.

- Precreate all required services in each region, such as your Batch accounts and associated storage accounts. There's no charge for creating new accounts; charges accrue only when the account is used or when data is stored.

- Make sure [appropriate quotas](../batch/batch-quota-limit.md) are set on all subscriptions ahead of time, so you can allocate the required number of cores using the Batch account. As with other Azure services, there are limits on certain resources associated with the Batch service. Many of these limits are default quotas applied by Azure at the subscription or account level. Keep these quotas in mind as you design and scale up your Batch workloads. 


>[!NOTE]
>If you plan to run production workloads in Batch, you may need to increase one or more of the quotas above the default. To raise a quota, you can request a quota increase at no charge. For more information, see [Request a quota increase](../batch/batch-quota-limit.md#increase-a-quota). 

#### Storage

You must configure Batch storage to ensure data is backed up cross-region; customer responsibility is the default. Most Batch solutions use Azure Storage for storing [resource files](../batch/resource-files.md) and output files. For example, your Batch tasks (including standard tasks, start tasks, job preparation tasks, and job release tasks) typically specify resource files that reside in a storage account. Storage accounts also store data that is processed and any output data that is generated. Understanding possible data loss across the regions of your service operations is an important consideration. You must also confirm whether data is rewritable or read-only. 

Batch supports the following types of Azure Storage accounts:
- General-purpose v2 (GPv2) accounts
- General-purpose v1 (GPv1) accounts
- Blob storage accounts (currently supported for pools in the Virtual Machine configuration)

For more information about storage accounts, see [Azure storage account overview](../storage/common/storage-account-overview.md).

You can associate a storage account with your Batch account when you create the account or do this step later.

If you're setting up a separate storage account for each region your service is available in, you must use zone-redundant storage (ZRS) accounts. Use geo-zone-redundant storage (GZRS) accounts if you're using the same storage account across multiple paired regions. For geographies that contain a single region, you must create a zone-redundant storage (ZRS) account because GZRS isn't available.

Capacity planning is another important consideration with storage and should be addressed proactively. Consider your cost and performance requirements when choosing a storage account. For example, the GPv2 and blob storage account options support greater [capacity and scalability limits](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/) compared with GPv1. (Contact Azure Support to request an increase in a storage limit.) These account options can improve the performance of Batch solutions that contain a large number of parallel tasks that read from or write to the storage account.

When a storage account is linked to a Batch account, think of it as the autostorage account. An autostorage account is required if you plan to use the [application packages](../batch/batch-application-packages.md) capability, as it's used to store the application package .zip files. An autostorage account can also be used for [task resource files](../batch/resource-files.md#storage-container-name-autostorage); since the autostorage account is already linked to the Batch account, this avoids the need for shared access signature (SAS) URLs to access the resource files.

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview)
