---
title: Operation restrictions in managed and classic clusters
description: Learn about how operations are restricted in managed clusters and classic clusters.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/15/2024
---

# Operation restrictions in managed and classic clusters

Azure Service Fabric offers two types of clusters: the **classic cluster, also known as Service Fabric Resource Provider (SFRP)**, and the **managed cluster, also referred to as Service Fabric Managed Clusters (SFMC)**.

Classic clusters don't manage the underlying resource providers, like network resource provider and storage resource provider. The user administrator of the classic cluster controls these resources in a more hands-on experience. Also, SFRP doesn't manage the underlying virtual machine scale set from which the cluster is composed. Again, the user administrator of the classic cluster must directly control the scale set in the SFRP scenario.

Managed clusters manage the underlying resource providers. In this way, SFMC clusters act as coordinator services, abstracting direct management of the underlying resources away from the user administrator for a more streamlined experience. The managed cluster also handles communication with the cluster's underlying virtual machine scale set, removing the user administrator's need to communicate with the scale set as a distinct resource.

Due to its function as a coordinator service, SFMC puts limitations on user administrator interface with the underlying resources of an SFMC. This article explores those limitations as compared to an SFRP scenario for context.

## Manage resources

Both classic clusters and managed clusters are composed of underlying resources. When you create these resources through Azure Resource Manager (ARM) or ARM-backed utilities, you should manage them with ARM and ARM-backed utilities for their entire lifetime. Continually using an ARM-based workflow in this way reduces the risk of desynchronization of cluster state during operations like updating and deleting resources.

While direct resource creation is abstracted from the user administrator for SFMC, it's important to know that ARM is used for cluster operations. *For SFMC, you shouldn't use utilities that aren't ARM or ARM-backed to interface with your cluster*.

The classic cluster scenario is more nuanced. If the utilities you used to create your resources in the first place weren't ARM or ARM-backed, you can continue to use those utilities. However, classic cluster resources that were created using ARM should continue to use ARM, just like in the SFMC scenario.

For more information on what utilities are ARM-backed, see the following table.

| Utility | ARM or ARM-backed |
| - | - |
| [ARM and ARM templates](/templates/microsoft.servicefabric/clusters?pivots=deployment-language-arm-template) | Yes |
| [Bicep](/templates/microsoft.servicefabric/clusters?pivots=deployment-language-bicep) | Yes |
| [Azure portal](https://portal.azure.com) | Yes |
| [Azure CLI](/cli/azure/sf?view=azure-cli-latest) | Yes |
| [Azure PowerShell](/powershell/module/az.servicefabric/?view=azps-12.1.0) | Yes |
| [Service Fabric PowerShell](/powershell/module/servicefabric/?view=azureservicefabricps) | **No** |
| [sfctl](service-fabric-sfctl.md) | **No** |

### Manage the underlying virtual machine scale set

In managed clusters, SFMC manages the underlying virtual machine scale set. *User administrators of managed clusters shouldn't directly interface with their cluster's scale set*. User administrators should make calls to the cluster with ARM or ARM-backed utilities, and the cluster interfaces with the underlying scale set.

In classic clusters, the underlying virtual machine scale set is independent of SFRP. User administrators who want to, for example, add a node type to their cluster, should go through their scale set to do so. User administrators should use the appropriate utilities when making calls, as discussed in the [Manage resources section](#manage-resources).

## Next steps

* Learn about [granting permission to access resources on managed clusters](how-to-managed-cluster-grant-access-other-resources.md)
* See how [deny assignments can be used to restrict access to resources on managed clusters](managed-cluster-deny-assignment.md)