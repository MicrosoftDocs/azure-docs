---
title: Publisher artifact store resiliency with Azure Operator Service Manager
description: Learn how to improve resiliency of the Azure Operator Service Manager publisher artifact store resource.
author: msftadam
ms.author: adamdor
ms.date: 09/26/2025
ms.topic: concept-article
ms.service: azure-operator-service-manager
---

# Publisher artifact store resiliency overview

This article describes how to enable geo-replication in Azure Operator Service Manager artifact store resource when backed by a Azure Container Registry (ACR). A geo-replicated registry offers these advantages:
* Enhances performance and reliability for regional deployments by providing registry access closer to the network.
* Allows centralized management of a registry across various regions.
* Ensures registry availability if a regional outage happens.

# About the publisher artifact store

The Azure Operator Service Manager artifact store is an Azure Resource Manager (ARM) resource responsible for housing all the network function (NF) artifacts needed to create a Network Service (NS). The artifact store acts as a centralized repository for various publisher artifacts, including:
* Helm charts.
* Docker images for Containerized Network Functions (CNF).
* Virtual Machine (VM) images for Virtualized Network Functions (VNF).
* Other assets like ARM templates required throughout the Network Function creation process.

The Azure Operator Service Manager artifact store resource is backed by an Azure Container Registry (ACR) resource via a managed-by relationship. This ACR resource is created and managed-by the artifact store resource and kept in a managed resource group (MRG). Publisher artifacts can be pushed, pulled or imported into this public cloud registry and made available to designer and operator Azure Operator Service Manager operations. If optionally configured, these publisher artifacts are also accessed by Azure Operator Service Manager cluster registry service, where they are pulled down into a NAKS cluster and served to pods locally.

> [!NOTE]
> The ACR MRG has different default permissions, versus the artifact store RG, which often restricts direct user access.

# Publisher artifact store resiliency strategy

The Azure Operator Service Manager artifact store supports two resiliency strategies. One strategy is configured at the artifact store time of creation.
* `SingleReplication`: The artifact store is deployed in a single Azure region. This is the default strategy, providing local redundancy within that region only.
* `GeoReplication`: The artifact store is replicated across multiple Azure regions. This enables geo-redundancy and high availability, ensuring data and service continuity even if one region becomes unavailable.

## ACR single replication strategy

Where `SingleReplication` stragety is configured, the Azure Operator Service Manager artifact store will use zone redundancy to achieve intra-region resiliency.
* Zone redundancy is enabled for both the primary and replica resources in regions that support availability zones (this is present in all AT&T regions).
* his distributes resources across physically separate datacenters (zones) within a region, protecting against datacenter-level failures and increasing local (intra-regional) availability

## ACR geo-replication strategy

Where `GeoReplication` replication stragety is configured, the Azure Operator Service Manager artifact store will use both zone redundancy and inter-regional geo-replication to achieve carrier-grade resiliency. 
* By combining geo-replication across region pairs and zone redundancy, the solution is highly available and resilient to both regional and zonal outages, fully aligning with Azure Container Registry reliability guidance.
* Geo-replication enables resiliency to regional outages. If your registry is geo-replicated and a regional outage occurs, the registry data continues to be available from the other regions that you selected.
* In the unlikely event of a geography-wide outage, the recovery of one region is prioritized out of every region pair.

## ACR geo-replication regional pairings

Azure Operator Service manager only supports geo-replication between regions identifed via Azure's official regional pairing paradigm. 
* For every primary region, a replica is always created in its official Azure paired region, as defined in Azure region pairs documentation.
* This ensures prioritized disaster recovery and compliance with Microsoft’s recommended model.

Given the primary regions supported by Azure Operator Service Manager and the Azure recommended paired regions from the official list, the following regional pairs support geo-replication configuration.
* East US → Paired with West US
* West US 3 → Paired with East US
* South Central US → Paired with North Central US

## Enabling geo-replication for artifact store resources

ACR geo-replication can either be configured during the creation of a new artifact store, or retrofit onto an artifact store previously deployed. In addition to the artifact store configuration itself, use of private endpoints and private links must also be considered.

### For new artifact stores

To enable geo-replication for new ACRs (with or without private endpoints) or for existing ACRs without a private endpoint, the publisher can simply update the replication strategy to `GeoReplication` while creating artifact store resource. 

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
In this case, the private endpoint and private links will get created, following standard practices, after the artifact store has already been configured for `GeoReplication` - No additional steps are required in this scenario.

### For existing artifact stores with private endpoints
To enable geo-replication for existing ACRs with a private endpoint, the publisher must follow two steps. First, update the replication strategy to “GeoReplication” as described above. Second, perform an update (re-POST) operation on the Private Endpoint resource after geo-replication is enabled. This is necessary because DNS records for the Private Endpoint are not automatically created in the new replica regions. By updating the Private Endpoint, Azure reconfigures the DNS records, ensuring that private DNS zones are correctly set up in all regions where the ACR is now available.

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

1. How can we check the status of an geo-replicated ACR pair?
* You can check on the ACR status for primary and secondary region is primary by running:

```powershell
az acr replication list --registry <acr-name>
```

2. Which ACR do I use to upload artifacts?
* The primary region ACR is the only ACR that accepts image pushes.

3. What happens if I try to upload to a non-primary region?
* If you try to push to a replica (not primary), you will get an error such as:

```
DENIED: The operation is not allowed on a read-only replica.
```

4. What happens if the primary region only partially fails? 
•	If the primary is partially down and cannot accept pushes, image push operations will fail. You must wait for the primary to recover or perform a failover.
