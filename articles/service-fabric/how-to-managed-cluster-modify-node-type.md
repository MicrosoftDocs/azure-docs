---
title: Modify a Service Fabric managed cluster node type
description: This article walks through how to modify a managed cluster node type
ms.topic: how-to
ms.date: 10/04/2021 
---

# Service Fabric managed cluster node types

Each node type in a Service Fabric managed cluster is backed by a virtual machine scale set. With managed clusters, you make any required changes through a single Service Fabric managed cluster resource provider. All of the underlying resources for the cluster are abstracted away and managed by Azure on your behalf. This helps to simplify cluster node type deployment and management, prevent operation errors such as deleting a seed node, and application of best practices such as validating a VM SKU is safe to use.

The rest of this document will cover how to adjust various settings from node type instance count, OS Image, and configuring placement properties.

> [!NOTE]
> You will not be able to modify the node type while a change is in progress. It is recommended to let any requested change complete before doing another.

## Scale a Service Fabric managed cluster node type manually with portal

In this walkthrough, you will learn how to modify the node count for a node type using portal.

1) Log in to [Azure portal](https://portal.azure.com/)

2) Navigate to your cluster resource Overview page. 
![Sample Overview page][overview]

3) Select `Node Types` under the `Settings` section 

4) Select the `Node type name` you want to modify

5) Adjust the `Node count` to the new value you want and select `Apply` at the bottom. In this screenshot, the value was `3` and adjusted to `5`.
![Sample showing a node count increase][adjust-node-count]

6) The `Provisioning state` will now show a status of `Updating` until complete. When complete, it will show `Succeeded` again.
![Sample showing a node count updating][node-count-updating]


## Scale a Service Fabric managed cluster node type manually with a template

To adjust the node count for a node type using an ARM Template, adjust the `vmInstanceCount` property with the new value and do a cluster deployment for the setting to take affect.

* The Service Fabric managed cluster resource apiVersion should be **2021-05-01** or later.

> [!NOTE]
> The managed cluster provider will block scale adjustments and return an error if the scaling request violates required minimums.

```json
     {
            "apiVersion": "[variables('sfApiVersion')]",
            "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
            "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
            "location": "[resourcegroup().location]",
            "properties": {
                ...
                "vmInstanceCount": "[parameters('nodeTypeVmInstanceCount')]",
                ...
            }
        }
}
```


## Modify the OS image for a node type with portal

In this walkthrough, you will learn how to modify the OS image for a node type using portal.

1) Log in to [Azure portal](https://portal.azure.com/)

2) Navigate to your cluster resource Overview page. 
![Sample Overview page][overview]

3) Select `Node Types` under the `Settings` section 

4) Select the `Node type name` you want to modify

5) Adjust the `OS Image` to the new value you want and select `Apply` at the bottom. 
![Sample showing changing the OS image][change-os-image]

6) The `Provisioning state` will now show a status of `Updating` and will proceed one upgrade domain at a time. When complete, it will show `Succeeded` again.
![Sample showing a node type updating][node-type-updating]


## Modify the OS image for a node type with a template

To modify the OS image used for a node type using an ARM Template, adjust the `vmImageSku` property with the new value and do a cluster deployment for the setting to take affect. The managed cluster provider will re-image each instance by upgrade domain.

* The Service Fabric managed cluster resource apiVersion should be **2021-05-01** or later.

```json
     {
            "apiVersion": "[variables('sfApiVersion')]",
            "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
            "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
            "location": "[resourcegroup().location]",
            "properties": {
                ...
                "vmImagePublisher": "[parameters('vmImagePublisher')]",
                "vmImageOffer": "[parameters('vmImageOffer')]",
                "vmImageSku": "[parameters('vmImageSku')]",
                "vmImageVersion": "[parameters('vmImageVersion')]",
                ...
            }
        }
}
```

## Configure placement properties for a node type with portal

In this walkthrough, you will learn how to modify a placement property for a node type using portal.

1) Log in to [Azure portal](https://portal.azure.com/)

2) Navigate to your cluster resource Overview page. 
![Sample Overview page][overview]

3) Select `Node Types` under the `Settings` section 

4) Select the `Node type name` you want to modify

5) In the `Placement properties` section add the name and value you want and select `Apply` at the bottom. In this screenshot, the `Name` `SSD_Premium` was used with `Value` of `true`.
![Sample showing adding a placement property][nodetype-placement-property]

6) The `Provisioning state` will now show a status of `Updating` until complete. When complete, it will show `Succeeded` again.
![Sample showing a node type updating][node-type-updating]

You can now use that [placement property to ensure that certain workloads run only on certain types of nodes in the cluster](./service-fabric-cluster-resource-manager-cluster-description.md#node-properties-and-placement-constraints). 

## Configure placement properties for a node type with a template

To adjust the placement properties for a node type using an ARM Template, adjust the `vmInstanceCount` property with the new value and do a cluster deployment for the setting to take affect.  

> [!NOTE]
> The managed cluster provider will re-image each instance by upgrade domain.

* The Service Fabric managed cluster resource apiVersion should be **2021-05-01** or later.

```json
     {
            "apiVersion": "[variables('sfApiVersion')]",
            "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
            "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
            "location": "[resourcegroup().location]",
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


## Modify the VM SKU for a node type

Service Fabric managed cluster does not support in-place modification of the VM SKU. In order to accomplish this you'll need to do the following:
* provision a new node type
* migrate workload over
* delete old node type


## Next steps

> [!div class="nextstepaction"]
> [Auto scale a Service Fabric managed cluster node type](how-to-managed-cluster-autoscale.md)
> [Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)
> [Deploy an app to a Service Fabric managed cluster](./tutorial-managed-cluster-deploy-app.md)


[overview]: ./media/how-to-managed-cluster-modify-node-type/sfmc-overview.png
[node-type-updating]: ./media/how-to-managed-cluster-modify-node-type/sfmc-adjust-node-type-updating.png
[adjust-node-count]: ./media/how-to-managed-cluster-modify-node-type/sfmc-adjust-node-counts.png
[change-nodetype-os-image]: ./media/how-to-managed-cluster-modify-node-type/sfmc-change-os-image.png
[nodetype-placement-property]: ./media/how-to-managed-cluster-modify-node-type/sfmc-nodetype-placement-property.png

