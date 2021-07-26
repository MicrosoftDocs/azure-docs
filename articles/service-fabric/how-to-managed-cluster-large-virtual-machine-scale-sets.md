---
title: Configure a secondary node type for large scale sets on a Service Fabric managed cluster
description: This article shows how to configure a secondary node type to enable large scale sets
ms.topic: how-to
ms.date: 7/26/2021 
---

# Service Fabric managed cluster node type scaling

Each node type in a Service Fabric managed cluster is backed by a virtual machine scale set. To allow managed cluster node types to create [large virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-placement-groups.md) a property `multiplePlacementGroups` has been added to node type definition. By Default, managed cluster node types set this property to false to keep fault and upgrade domains consistent within a placement group, but this limits a node type from scaling beyond 100 VMs. To help decide whether your application can make effective use of large scale sets please see [this list of requirements](../virtual-machine-scale-sets/virtual-machine-scale-sets-placement-groups.md#checklist-for-using-large-scale-sets).

Short list of pros/cons? Talk about what scenarios this is good for that aren't specifically stateless?

> [!NOTE]
> This property can not be modified after a node type is deployed.

## Enable large node types in a Service Fabric managed cluster
To set one or more secondary node types as large in a node type resource, set the **multiplePlacementGroups** property to **true**. 
> [!NOTE]
> When deploying a Service Fabric cluster with large node types, it is required to have at least one primary node type which is not large in the cluster.

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
}
```

For a sample Service Fabric managed cluster deployment that makes use of this property on a secondary node type, see [this template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-Large). (need to make)

## Next Steps

> [!div class="nextstepaction"]
> [Deploy an app to a Service Fabric managed cluster](./tutorial-managed-cluster-deploy-app.md)
