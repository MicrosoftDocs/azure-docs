---
title: Publisher artifact store resiliency with Azure Operator Service Manager
description: Learn how to improve resiliency of the Azure Operator Service Manager publisher artifact store resource.
author: msftadam
ms.author: adamdor
ms.date: 09/26/2025
ms.topic: concept-article
ms.service: azure-operator-service-manager
ms.custom: references_regions
---

# Publisher artifact store resiliency 
This article describes how to enable geo-replication in Azure Operator Service Manager artifact store resource when backed by an Azure Container Registry (ACR). A geo-replicated registry offers these advantages:
* Enhances performance and reliability for regional deployments by providing registry access closer to the network.
* Allows centralized management of a registry across various regions.
* Ensures registry availability if a regional outage happens.

## Overview of publisher artifact store
The Azure Operator Service Manager artifact store is an Azure Resource Manager (ARM) resource responsible for housing all the network function (NF) artifacts needed to create a Network Service (NS). The artifact store acts as a centralized repository for various publisher artifacts, including:
* Helm charts.
* Docker images for Containerized Network Functions (CNF).
* Virtual Machine (VM) images for Virtualized Network Functions (VNF).
* Other assets like ARM templates required throughout the Network Function creation process.

An Azure Container Registry (ACR) resource backs each Azure Operator Service Manager artifact store resource. This ACR resource is created and managed-by the artifact store resource and kept in a managed resource group (MRG). Publisher artifacts can be pushed, pulled, or imported into this public cloud registry and made available to designer and operator Azure Operator Service Manager operations. When optionally configured, publisher artifacts are pulled into Azure Operator Service Manager's cluster registry service, where they're served to pods locally.

> [!NOTE]
> The ACR MRG has different default permissions, versus the artifact store resource group (RG), which often restricts direct user access.

## Strategy for publisher artifact store resiliency
The Azure Operator Service Manager artifact store supports two resiliency strategies. One strategy is configured at the artifact store time of creation.
* `SingleReplication`: The artifact store is deployed in a single Azure region providing local redundancy within that region only. This strategy is the default option.
* `GeoReplication`: The artifact store is replicated across multiple Azure regions. This enables geo-redundancy and high availability, ensuring data and service continuity even if one region becomes unavailable.

### ACR single replication strategy

Where `SingleReplication` strategy is configured, the Azure Operator Service Manager artifact store uses zone redundancy to achieve intra-region resiliency.
* Zone redundancy is enabled for both the primary and replica resources in regions that support availability zones.
* Resources are distributed across physically separate datacenters (zones) within a region, protecting against datacenter-level failures and increasing local (intra-regional) availability

### ACR geo-replication strategy
Where `GeoReplication` replication strategy is configured, the Azure Operator Service Manager artifact store uses both zone redundancy and inter-regional geo-replication to achieve carrier-grade resiliency. 
* By combining geo-replication across region pairs and zone redundancy, the solution is highly available and resilient to both regional and zonal outages, fully aligning with Azure Container Registry reliability guidance.
* Geo-replication enables resiliency to regional outages. If your registry is geo-replicated and a regional outage occurs, the registry data continues to be available from the other regions that you selected.
* In the unlikely event of a geography-wide outage, the recovery of one region is prioritized out of every region pair.

### ACR geo-replication regional pairings
Azure Operator Service manager only supports geo-replication between regions identified via Azure's official regional pairing paradigm. 
* For every primary region, a replica is always created in its official Azure paired region, as defined in Azure region pairs documentation.
* This pairing ensures prioritized disaster recovery and compliance with Microsoft’s recommended model.

Given the primary regions supported by Azure Operator Service Manager and the Azure recommended paired regions from the official list, the following regional pairs support geo-replication configuration.
* East US → Paired with West US
* West US 3 → Paired with East US
* South Central US → Paired with North Central US

## Enable geo-replication for artifact store resources
ACR geo-replication can either be configured during the creation of a new artifact store, or retrofit onto an artifact store previously deployed. In addition to the artifact store configuration itself, use of private endpoints and private links must also be considered.

### Configuring new artifact stores
To enable geo-replication, for a new artifact store, set the replication strategy to `GeoReplication` while creating the artifact store resource. 

```powershell
// An example PUT Body on ArtifactStore resource with GeoReplication strategy
{
  "id": "/subscriptions/SubId/resourceGroups/<rg>/providers/Microsoft.HybridNetwork/publishers/<publisher>/ArtifactStores/ArtifactStore",
  "name": "ArtifactStore",
  "type": "Microsoft.HybridNetwork/publishers/ArtifactStores",
  "location": "<region>",
  "properties": {
    "storetype": "AzureContainerRegistry",
    "replicationStrategy": "GeoReplication"
    }
}
```

If private link is in-use, the private endpoints are created after the artifact store is configured for `GeoReplication` following standard process. No extra steps are required.

### Configuring existing artifact stores with private link
If an existing artifact store isn't using private link, configuring the `GeoReplication` strategy is the only step required. If an existing artifact store is using private link or private endpoint, then the following second step is required. 
* First, update the replication strategy to `GeoReplication`, as previously described.
* Second, perform an update (re-POST) operation on the private endpoint resource, after geo-replication is enabled.
This second step is necessary because domain name records (DNS) for the private endpoint aren't automatically created in the new replica regions. Updating the private endpoint forces the DNS records to update and adds private DNS zones for all ACR service regions.

```powershell
https://management.azure.com/subscriptions/<subscription>/resourceGroups/<rg>/providers/Microsoft.HybridNetwork/publishers/<publisher>/artifactStores/<artifactStore>/AddNetworkFabricControllerEndPoints?api-version=2024-04-15

{
  "networkFabricControllerIds": [
    {
      "id": "/subscriptions/<subscription>/resourceGroups/<rg>/providers/microsoft.managednetworkfabric/networkFabriccontrollers/<controllerName>"
    }
  ]
}
```

> [!NOTE]
> Currently, only uni-directional replication from a single region to geo-replication is supported. The primary ACR must be in a successful state before geo-replication can be enabled.

## Frequently Asked Questions

How can we check the status of a geo-replicated ACR pair?
- You can check on the ACR status for primary and secondary region is primary by running:

```powershell
az acr replication list --registry <acr-name>
```

Which ACR do I use to upload artifacts?
- The primary region ACR is the only ACR that accepts image pushes.

What happens if I try to upload to a nonprimary region?
- If you try to push to a replica (not primary), you get the error:

```
DENIED: The operation isn't allowed on a read-only replica.
```

What happens if the primary region only partially fails? 
- If the primary is partially down and can't accept pushes, the image push operation fails. You must wait for the primary to recover or perform a failover.
