---
title: Reliability in Azure Batch
description: Find out about reliability in Azure Batch
author: anaharris-ms
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.prod: non-product-specific
ms.date: 02/27/2022
---

<!--#Customer intent:  I want to understand reliability support in Azure Batch so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->


# Reliability in Azure Batch

This article describes reliability support in Azure Batch and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and links to information on [cross-region resiliency with disaster recovery](#disaster-recovery-cross-region-failover). 


## Availability zone support

Azure regions which support availability zones have a minimum of three separate zones, each with their own independent power source, network, and cooling system. When you create an Azure Batch pool using Virtual Machine Configuration, you can choose to provision your Batch pool across availability zones. Creating your pool with this zonal policy helps protect your Batch compute nodes from Azure datacenter-level failures.

For example, you could create your pool with zonal policy in an Azure region that supports three availability zones. If an Azure datacenter in one availability zone has an infrastructure failure, your Batch pool will still have healthy nodes in the other two availability zones. For that reason, the pool remains available for task scheduling.


### Prerequisites

- For [user subscription mode Batch accounts](../batch/accounts.md#batch-accounts), make sure that the subscription in which you're creating your pool doesn't have a zone offer restriction on the requested VM SKU. To confirm this, call the [Resource Skus List API](/rest/api/compute/resource-skus/list?tabs=HTTP) and check the `ResourceSkuRestrictions`. If a zone restriction exists, you can submit a support ticket to remove the zone restriction.

- Because InfiniBand doesn't support inter-zone communication, you can't create a pool with a zonal policy if it has inter-node communication enabled and uses a [VM SKU that supports InfiniBand](../virtual-machines/workloads/hpc/enable-infiniband.md).

- Batch maintains parity with Azure on supporting availability zones. To use the zonal option, your pool must be created in a supported Azure region. To use the zonal option, your pool must be created in an [Azure region with availability zone support](az-service-support.md#azure-regions-with-availability-zone-support).

- To allocate your Batch pool across availability zones, the Azure region in which the pool was created must support the requested VM SKU in more than one zone. You can validate this by calling the [Resource Skus List API](/rest/api/compute/resource-skus/list?tabs=HTTP) and check the `locationInfo` field of `resourceSku`. Be sure that more than one zone is supported for the requested VM SKU.


### Create an Azure Batch pool across availability zones

The following examples show how to create a Batch pool across availability zones.

> [!NOTE]
> When creating your pool with a zonal policy, the Batch service will try to allocate your pool across all availability zones in the selected region; you can't specify a particular allocation across the zones.

#### Batch Management Client .NET SDK

```csharp
pool.DeploymentConfiguration.VirtualMachineConfiguration.NodePlacementConfiguration = new NodePlacementConfiguration()
    {
        Policy = NodePlacementPolicyType.Zonal
    };

```

#### Batch REST API

REST API URL

```
POST {batchURL}/pools?api-version=2021-01-01.13.0
client-request-id: 00000000-0000-0000-0000-000000000000
```

Request body

```
"pool": {
    "id": "pool2",
    "vmSize": "standard_a1",
    "virtualMachineConfiguration": {
        "imageReference": {
            "publisher": "Canonical",
            "offer": "UbuntuServer",
            "sku": "18.04-lts"
        },
        "nodePlacementConfiguration": {
            "policy": "Zonal"
        }
        "nodeAgentSKUId": "batch.node.ubuntu 18.04"
    },
    "resizeTimeout": "PT15M",
    "targetDedicatedNodes": 5,
    "targetLowPriorityNodes": 0,
    "maxTasksPerNode": 3,
    "enableAutoScale": false,
    "enableInterNodeCommunication": false
}
```

 Learn more about creating Batch accounts with the [Azure portal](batch-account-create-portal.md), the [Azure CLI](./scripts/batch-cli-sample-create-account.md), [PowerShell](batch-powershell-cmdlets-get-started.md), or the [Batch management API](batch-management-dotnet.md).

### Zone down experience

When a zone is done, the nodes within that zone will become unavailable.

### Availability zone redeployment and migration

<!-- Placeholder for more information -->


## Disaster recovery: cross region failover

Azure Batch is available in all Azure regions. However, when a Batch account is created, it must be associated with one specific region. All subsequent operations for that Batch account only apply to that region. For example, pools and associated virtual machines (VMs) are created in the same region as the Batch account.

When designing an application that uses Batch, you must consider the possibility that Batch may not be available in a region. It's possible to encounter a rare situation where there is a problem with the region as a whole, the entire Batch service in the region, or your specific Batch account.

If the application or solution using Batch must always be available, then it should be designed to either failover to another region or always have the workload split between two or more regions. Both approaches require at least two Batch accounts, with each account located in a different region.

You are responsible for setting up cross-region disaster recovery with Azure Batch. By running multiple Batch accounts across specific regions and taking advantage of availability zones, your application can meet your disaster recovery objectives in the event one of your Batch accounts becomes unavailable. 

When providing the ability to failover to an alternate region, all components in a solution must be considered; it's not sufficient to simply have a second Batch account. For example, in most Batch applications, an Azure storage account is required. The storage account and Batch account must be in the same region for acceptable performance.

Consider the following points when designing a solution that can failover:

- Pre-create all required services in each region, such as the Batch account and the storage account. There's often no charge for having accounts created, and charges accrue only when the account is used or when data is stored.

- Make sure ahead of time that the [appropriate quotas](/azure/batch/batch-quota-limit) are set for all **user subscription** Batch accounts, to allocate the required number of cores using the Batch account.

- Use templates and/or scripts to automate the deployment of the application in a region.

- Keep application binaries and reference data up to date in all regions. Staying up to date will ensure that the region can be brought online quickly without having to wait for the upload and deployment of files. For example, if a custom application to install on pool nodes is stored and referenced using Batch application packages, when an update of the application is released, it should be uploaded to each Batch account and referenced by the pool configuration (or make the latest version the default version).

- In the application calling Batch, storage, and any other services, make it easy to switch over clients or the load to different regions.

- Consider frequently switching over to an alternate region as part of normal operation. For example, with two deployments in separate regions, switch over to the alternate region every month.

The duration of time to recover from a disaster depends on the setup you choose. Batch itself is agnostic regarding whether you are using multiple accounts or a single account. In active-active configurations, where two Batch instances are receiving traffic simultaneously, disaster recovery is faster than for an active-passive configurations. Which configuration you choose should be based on business needs (different regions, latency requirements) and technical considerations. 


### Single-region geography disaster recovery
How you implement disaster recovery in Batch is the same whether you are working in a single-region or multi-region geography. The only differences are which SKU you'll use for storage, and whether you intend to use the same or different storage account across all regions.

### Disaster recovery testing 

You should perform your own disaster recovery testing of your Batch enabled solution. It's considered a best practice to enable easy switching between client and service load across different regions. 

Testing your disaster recovery plan for Batch can be as simple as alternating Batch accounts. For example, you could rely on a single Batch account in a specific region for one operational day and then switch to a second Batch account in a different region on the next day. Disaster recovery is primarily managed on the client side. This multiple-account approach to disaster recovery takes care of RTO and RPO expectations in either single-region or multiple-region geographies. 

### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the Shared Responsibility model. This means that while Microsoft is responsible for platform and infrastructural resiliency, you must address disaster recovery for any specific service you deploy and control. To ensure that recovery is proactive, you should always pre-deploy secondaries because there is no guarantee of capacity at time of impact for those who have not pre-allocated such resources.

Pre-create all required services in each region, such as your Batch accounts and associated storage accounts. There is little disincentive for doing this because often there is no charge for creating new accounts; charges accrue only when the account is used or when data is stored.

Make sure [appropriate quotas](../batch/batch-quota-limit.md) are set on all subscriptions ahead of time, so you can allocate the required number of cores using the Batch account. As with other Azure services, there are limits on certain resources associated with the Batch service. Many of these limits are default quotas applied by Azure at the subscription or account level. Keep these quotas in mind as you design and scale up your Batch workloads. 

If you plan to run production workloads in Batch, you may need to increase one or more of the quotas above the default. To raise a quota, you can request a quota increase at no charge. For more information, see [Request a quota increase](../batch/batch-quota-limit.md#increase-a-quota). 

#### Storage

You must configure Batch storage to ensure data is backed up cross-region; customer responsibility is the default. Most Batch solutions use Azure Storage for storing [resource files](../batch/resource-files.md) and output files. For example, your Batch tasks (including standard tasks, start tasks, job preparation tasks, and job release tasks) typically specify resource files that reside in a storage account. Storage accounts also store data that is processed and any output data that is generated. Understanding possible data loss across the regions of your service operations is an important consideration. You must also confirm whether data is re-writable or read-only. 

Batch supports the following types of Azure Storage accounts:
- General-purpose v2 (GPv2) accounts
- General-purpose v1 (GPv1) accounts
- Blob storage accounts (currently supported for pools in the Virtual Machine configuration)

For more information about storage accounts, see [Azure storage account overview](../storage/common/storage-account-overview.md).

You can associate a storage account with your Batch account when you create the account or do this step later.

If you're setting up a separate storage account for each region your service is available in, you must use zone-redundant storage (ZRS) accounts. Use geo-zone-redundant storage (GZRS) accounts if you're using the same storage account across multiple paired regions. For geographies that contain a single region, you must create a zone-redundant storage (ZRS) account because GZRS isn't available.

Capacity planning is another important consideration with storage and should be addressed proactively. Consider your cost and performance requirements when choosing a storage account. For example, the GPv2 and blob storage account options support greater [capacity and scalability limits](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/) compared with GPv1. (Contact Azure Support to request an increase in a storage limit.) These account options can improve the performance of Batch solutions that contain a large number of parallel tasks that read from or write to the storage account.

When a storage account is linked to a Batch account, think of it as the autostorage account. An autostorage account is required if you plan to use the [application packages](../batch/batch-application-packages.md) capability, as it is used to store the application package .zip files. It can also be used for [task resource files](../batch/resource-files.md#storage-container-name-autostorage); since the autostorage account is already linked to the Batch account, this avoids the need for shared access signature (SAS) URLs to access the resource files.

## Next steps


> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview)
