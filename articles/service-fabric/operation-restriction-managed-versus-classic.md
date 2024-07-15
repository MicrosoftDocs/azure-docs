---
title: Operation restrictions in managed and classic clusters
description: Learn about the differences in how operations are restricted between managed clusters and classic clusters.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/15/2024
---

# Operation restrictions in managed and classic clusters

Azure Service Fabric offers two types of clusters: the **classic cluster, also known as Service Fabric Resource Provider (SFRP)**, and the **managed cluster, also referred to as Service Fabric Managed Clusters (SFMC)**.

Classic clusters don't manage the underlying resource providers, like network resource provider and storage resource provider. The user administrator of the classic cluster controls these resources in a more hands-on experience. Also, the underlying virtual machine scale set (VMSS) from which the cluster is composed isn't managed by the SFRP. Again, the user administrator of the classic cluster must directly control the VMSS in the SFRP scenario.

Managed clusters manage the underlying resource providers. In this way, SFMC clusters act as coordinator services, abstracting direct management of the underlying resources away from the user administrator for a more streamlined experience. The managed cluster also handles communication with the cluster's underlying VMSS, removing the user administrator's need to communicate with the VMSS as a distinct resource.

Due to its function as a coordinator service, SFMC puts limitations on user administrator interface with the underlying resources of an SFMC. This article explores those limitations as compared to an SFRP scenario for context.

## Differences in using SFMC and SFRP

### Only use ARM and ARM-backed processes for SFMC

The most important difference between SFMC and SFRP is that *calls to managed clusters should be made through Azure Resource Manager (ARM) or ARM-backed processes*. Calls to classic clusters may be made through whatever utility you prefer. See the following table for more details.

| Utility | Use for SFMC? | Use for SFRP? |
| - | - | - |
| ARM and ARM templates | Yes | Yes |
| Azure Portal | Yes | Yes |
| Azure CLI | Yes | Yes |
| AzSF PowerShell | **No** | Yes |
| Bicep | Yes | Yes |
| sfctl | **No** | Yes |

### Managing the underlying VMSS

In managed clusters, the underlying VMSS is managed by SFMC. *User administrators of managed clusters shouldn't directly interface with their cluster's VMSS*.

In classic clusters, the underlying VMSS is independent of SFRP. User administrators who want to, for example, add a node type to their cluster, should go through their VMSS to do so.

## User access policies

## Next steps

* Learn about [granting permission to access resources on managed clusters](how-to-managed-cluster-grant-access-other-resources.md)
* See how [deny assignments can be used to restrict access to resources on managed clusters](managed-cluster-deny-assignment.md)