---
title: Configure a secondary node type for large virtual machine scale sets on a Service Fabric managed cluster
description: This article walks through how to configure a secondary node type as a large virtual machine scale set
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Service Fabric managed cluster node type scaling

Each node type in a Service Fabric managed cluster is backed by a virtual machine scale set. To allow managed cluster node types to create [large virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-placement-groups.md) a property `multiplePlacementGroups` has been added to node type definition. By default, managed cluster node types set this property to false to keep fault and upgrade domains consistent within a placement group, but this setting limits a node type from scaling beyond 100 VMs. To help decide whether your application can make effective use of large scale sets, see [this list of requirements](../virtual-machine-scale-sets/virtual-machine-scale-sets-placement-groups.md#checklist-for-using-large-scale-sets).

Since the Azure Service Fabric managed cluster resource provider orchestrates scaling and uses managed disks for data, we are able to support large scale sets for both stateful and stateless secondary node types.

> [!NOTE]
> This property can not be modified after a node type is deployed.

## Enable large virtual machine scale sets in a Service Fabric managed cluster
To configure a secondary node type as a large scale set, set the **multiplePlacementGroups** property to **true**.
> [!NOTE]
> This property can’t be set on the primary node type.

* The Service Fabric managed cluster resource apiVersion should be **2021-05-01** or later.

```json
{
  "apiVersion": "[variables('sfApiVersion')]",
  "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
  "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
  "location": "[resourcegroup().location]",
  "dependsOn": [
    "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterName'))]"
  ],
  "properties": {
    "multiplePlacementGroups": true,
    "isPrimary": false,
    "vmImagePublisher": "[parameters('vmImagePublisher')]",
    "vmImageOffer": "[parameters('vmImageOffer')]",
    "vmImageSku": "[parameters('vmImageSku')]",
    "vmImageVersion": "[parameters('vmImageVersion')]",
    "vmSize": "[parameters('nodeTypeSize')]",
    "vmInstanceCount": "[parameters('nodeTypeVmInstanceCount')]",
    "dataDiskSizeGB": "[parameters('nodeTypeDataDiskSizeGB')]"
  }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Deploy an app to a Service Fabric managed cluster](./tutorial-managed-cluster-deploy-app.md)
