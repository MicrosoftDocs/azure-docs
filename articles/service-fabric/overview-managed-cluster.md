---
title: Service Fabric Managed clusters (preview)
description: Service Fabric Managed clusters are an evolution of the Azure Service Fabric cluster resource model that streamlines deployment and cluster management.
ms.topic: overview
ms.date: 9/1/2020
---

# Service Fabric Managed clusters (preview)

Service Fabric Managed clusters are an evolution of the Azure Service Fabric cluster resource model that streamlines your deployment and cluster management experience.

The Azure Resource Model (ARM) template for traditional Service Fabric clusters requires you to define a cluster resource alongside a number of supporting resources, all of which must be "wired up"  correctly (upon deployment and throughout the lifecycle of the cluster) in order for the cluster and your services to function properly. In contrast, the encapsulation model for Service Fabric Managed clusters consists of a single, *Service Fabric Managed cluster* resource. All of the underlying resources for the cluster are abstracted away and managed by Azure on your behalf.

In terms of size and complexity, the ARM template for a Service Fabric Managed cluster is about 100 lines of JSON, versus some 1000 lines required to define a typical Service Fabric cluster:

| Service Fabric resources | Service Fabric Managed cluster resources |
|----------|-----------|
| Service Fabric cluster | Service Fabric Managed cluster |
| Virtual machine scale set(s) | |
| Load balancer | |
| Public IP address | |
| Storage account(s) | |
| Virtual network | |

Service Fabric Managed clusters provide a number of advantages over traditional clusters:

**Simplified cluster deployment and management**
- Deploy and manage a single Azure resource
- Certificate management and autorotation
- Simplified scaling operations

**Prevent operational errors errors**
- Prevent configuration mismatches with underlying resources
- Block unsafe operations (such as deleting a seed node)

**Best practices by default**
- Simplified reliability and durability settings

There is no additional cost for Service Fabric Managed clusters beyond the cost of underlying resources required for the cluster.

## Next steps

To get started with Service Fabric managed clusters, try out the quickstart:

> [!div class="nextstepaction"]
> [Create a Managed Service Fabric cluster (preview)](quickstart-managed-cluster.md)
