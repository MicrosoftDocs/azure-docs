---
title: Service Fabric managed clusters (preview)
description: Service Fabric managed clusters are an evolution of the Azure Service Fabric cluster resource model that streamlines deployment and cluster management.
ms.topic: overview
ms.date: 09/28/2020
---

# Service Fabric managed clusters (preview)

Service Fabric managed clusters are an evolution of the Azure Service Fabric cluster resource model that streamlines your deployment and cluster management experience.

The Azure Resource Model (ARM) template for traditional Service Fabric clusters requires you to define a cluster resource alongside a number of supporting resources, all of which must be "wired up"  correctly (upon deployment and throughout the lifecycle of the cluster) in order for the cluster and your services to function properly. In contrast, the encapsulation model for Service Fabric managed clusters consists of a single, *Service Fabric managed cluster* resource. All of the underlying resources for the cluster are abstracted away and managed by Azure on your behalf.

In terms of size and complexity, the ARM template for a Service Fabric managed cluster is about 100 lines of JSON, versus some 1000 lines required to define a typical Service Fabric cluster:

| Service Fabric resources | Service Fabric managed cluster resources |
|----------|-----------|
| Service Fabric cluster | Service Fabric managed cluster |
| Virtual machine scale set(s) | |
| Load balancer | |
| Public IP address | |
| Storage account(s) | |
| Virtual network | |

Service Fabric managed clusters provide a number of advantages over traditional clusters:

**Simplified cluster deployment and management**
- Deploy and manage a single Azure resource
- Certificate management and autorotation
- Simplified scaling operations

**Prevent operational errors errors**
- Prevent configuration mismatches with underlying resources
- Block unsafe operations (such as deleting a seed node)

**Best practices by default**
- Simplified reliability and durability settings

There is no additional cost for Service Fabric managed clusters beyond the cost of underlying resources required for the cluster.

## Service Fabric managed cluster SKUs

Service Fabric managed clusters are available in both Basic and Standard SKUs.

| Feature | Basic | Standard |
| ------- | ----- | -------- |
| Network resource (SKU for [Load Balancer](../load-balancer/skus.md), [Public IP](../virtual-network/public-ip-addresses.md)) | Basic | Standard |
| Min node (VM instance) count | 3 | 5 |
| Max node count per node type | 100 | 100 |
| Max node type count | 1 | 20 |
| Add/remove node types | No | Yes |
| Zone redundancy | No | Yes |

## Next steps

To get started with Service Fabric managed clusters, try out the quickstart:

> [!div class="nextstepaction"]
> [Create a Service Fabric managed cluster (preview)](quickstart-managed-cluster.md)
