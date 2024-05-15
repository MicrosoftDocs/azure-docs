---
title: Service Fabric managed clusters
description: Service Fabric managed clusters are an evolution of the Azure Service Fabric cluster resource model that streamlines deployment and cluster management.
ms.topic: overview
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 03/12/2024
---

# Service Fabric managed clusters

Service Fabric managed clusters are an evolution of the Azure Service Fabric cluster resource model that streamlines your deployment and cluster management experience.

The Azure Resource Model (ARM) template for traditional Service Fabric clusters requires you to define a cluster resource alongside a number of supporting resources. These resources must be configured correctly for the cluster and your services to function properly. In contrast, the encapsulation model for Service Fabric managed clusters consists of a single, *Service Fabric managed cluster* resource. All of the underlying resources for the cluster are abstracted away and managed by Azure on your behalf.

**Service Fabric traditional cluster model**
![Service Fabric traditional cluster model][sf-composition]

**Service Fabric managed cluster model**
![Service Fabric encapsulated cluster model][sf-encapsulation]

In terms of size and complexity, the ARM template for a Service Fabric managed cluster is about 100 lines of JSON, versus some 1,000 lines required to define a typical Service Fabric cluster:

| Service Fabric resources | Service Fabric managed cluster resources |
|----------|-----------|
| Service Fabric cluster | Service Fabric managed cluster |
| Virtual machine scale set(s) | |
| Load balancer | |
| Public IP address | |
| Storage account(s) | |
| Virtual network | |

## Service Fabric managed cluster advantages
Service Fabric managed clusters provide a number of advantages over traditional clusters including:

**Simplified cluster deployment and management**
- Deploy and manage a single Azure resource
- Cluster certificate management and 90 day autorotation
- Simplified scaling operations
- Automatic OS Image upgrade support
- In-Place OS SKU change support

**Prevent operational errors**
- Prevent configuration mismatches with underlying resources
- Block unsafe operations (such as deleting a seed node)

**Best practices by default**
- Simplified reliability and durability settings

There's no extra cost for Service Fabric managed clusters beyond the cost of underlying resources required for the cluster, and the same Service Fabric Service Level Agreement (SLA) applies for managed clusters.

> [!NOTE]
> There is no migration path from existing Service Fabric clusters to managed clusters. You will need to create a new Service Fabric managed cluster to use this new resource type.

> [!IMPORTANT]
> Manually making changes to the resources in a managed cluster isn't supported.

## Service Fabric managed cluster SKUs

Service Fabric managed clusters are available in both Basic and Standard SKUs.

| Feature | Basic | Standard |
| ------- | ----- | -------- |
| Network resource (SKU for [Load Balancer](../load-balancer/skus.md), [Public IP](../virtual-network/ip-services/public-ip-addresses.md)) | Basic | Standard |
| Min node (virtual machine instance) count | 3 | 5 |
| Max node count per node type | 100 | 1000 |
| Max node type count | 1 | 50 |
| Add/remove node types | No | Yes |
| Zone redundancy | No | Yes |

## Feature support

See [managed cluster configuration options documentation](how-to-managed-cluster-configuration.md) or managedClusters [Bicep & ARM templates](/azure/templates/microsoft.servicefabric/allversions) for more information.


## Next steps

To get started with Service Fabric managed clusters, try the quickstart:

> [!div class="nextstepaction"]
> [Create a Service Fabric managed cluster](quickstart-managed-cluster-template.md)

And reference [how to configure your managed cluster](how-to-managed-cluster-configuration.md)

[sf-composition]: ./media/overview-managed-cluster/sfrp-composition-resource.png
[sf-encapsulation]: ./media/overview-managed-cluster/sfrp-encapsulated-resource.png
