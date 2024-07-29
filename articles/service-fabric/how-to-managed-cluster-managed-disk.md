---
title: Select managed disk types for Service Fabric managed cluster nodes
description: Learn how to select managed disk types for Service Fabric managed cluster nodes and configure in an ARM template.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-arm-template
services: service-fabric
ms.date: 05/21/2024
---

# Select managed disk types for Service Fabric managed cluster nodes

Azure Service Fabric managed clusters use managed disks for all storage needs, including application data, for scenarios such as reliable collections and actors. Azure managed disks are block-level storage volumes managed by Azure and used with Azure Virtual Machines. Managed disks are like a physical disk in an on-premises server but, virtualized. With managed disks, all you have to do is specify the disk size, the disk type, and provision the disk. Once you provision the disk, Azure handles the rest. For more information about managed disks, see [Introduction to Azure managed disks
](../virtual-machines/managed-disks-overview.md).

**Disk size update:** Customers have the capability to update the disk size on current node type; however, it's important to note that only new nodes on the existing node type receive the new disk size. To implement this change, users can follow two approaches:
* Scale the node type by adding new nodes with the desired disk size, and then remove the old nodes with smaller disk sizes.
* Alternatively, create a new node type with the desired disk size and migrate their workload to the new node type using placement constraints.
 
**Disk type update:** Updating disk types in place for node types isn't supported. Therefore, the only viable option is to create a new node type with the desired disk type and migrate the workload accordingly. This process ensures a seamless transition to the updated disk type without disrupting the cluster's operation.

## Managed disk types

Azure Service Fabric manged clusters support the following managed disk types:
* Standard hard disk drive (HDD)
    * Standard HDD locally redundant storage. Best for backup, noncritical, and infrequent access. 
* Standard solid-state drive (SSD) *Default*
    * Standard SSD locally redundant storage. Best for web servers, lightly used enterprise applications, and dev/test.
* Premium SSD *compatible with specific virtual machines (VM) sizes*. For more information, see [Premium SSD](../virtual-machines/disks-types.md#premium-ssds).
    * Premium SSD locally redundant storage. Best for production and performance sensitive workloads.

>[!NOTE]
> Any temp disk associated with VM Size will *not* be used for storing any Service Fabric or application related data by default. [Stateless node types](how-to-managed-cluster-stateless-node-type.md) do support temp disks if required.

## Specifying a Service Fabric managed cluster disk type

To specify a Service Fabric managed cluster disk type, you must include the following value in the managed cluster resource definition.  

* The value **dataDiskType** property, which specifies what managed disk type to use for your nodes.

Possible values are:
* "Standard_LRS"
* "StandardSSD_LRS"
* "Premium_LRS"

>[!NOTE]
> Not all managed disk types are available for all vm sizes, for more info see [What disk types are available in Azure?](../virtual-machines/disks-types.md)

```json
{
  "apiVersion": "2021-05-01",
  "type": "Microsoft.ServiceFabric/managedclusters",
  "dataDiskType": "StandardSSD_LRS"
}
```

Sample templates are available that include this specification: [Service Fabric managed cluster templates](https://github.com/Azure-Samples/service-fabric-cluster-templates).
