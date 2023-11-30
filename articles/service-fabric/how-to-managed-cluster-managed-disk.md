---
title: Select managed disk types for Service Fabric managed cluster nodes
description: Learn how to select managed disk types for Service Fabric managed cluster nodes and configure in an ARM template.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-arm-template
services: service-fabric
ms.date: 07/11/2022
---

# Select managed disk types for Service Fabric managed cluster nodes

Azure Service Fabric managed clusters use managed disks for all storage needs, including application data, for scenarios such as reliable collections and actors. Azure managed disks are block-level storage volumes that are managed by Azure and used with Azure Virtual Machines. Managed disks are like a physical disk in an on-premises server but, virtualized. With managed disks, all you have to do is specify the disk size, the disk type, and provision the disk. Once you provision the disk, Azure handles the rest. For more information about managed disks, see [Introduction to Azure managed disks
](../virtual-machines/managed-disks-overview.md).

>[!NOTE] 
> After node type deployment you cannot modify the managed disk type or size in place. Instead, you can easily deploy a new node type with the required configuration in your cluster and migrate your workloads. 

## Managed disk types

Azure Service Fabric manged clusters support the following managed disk types:
* Standard HDD
    * Standard HDD locally redundant storage. Best for backup, non-critical, and infrequent access. 
* Standard SSD *Default*
    * Standard SSD locally redundant storage. Best for web servers, lightly used enterprise applications, and dev/test.
* Premium SSD *Compatible with specific VM sizes* for more information, see [Premium SSD](../virtual-machines/disks-types.md#premium-ssds)
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

Sample templates are available that include this specification: [Service Fabric managed cluster templates](https://github.com/Azure-Samples/service-fabric-cluster-templates)
