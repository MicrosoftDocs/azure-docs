---
title: Modify a Service Fabric managed cluster node type
description: This article walks through how to modify a managed cluster node type
ms.topic: how-to
ms.date: 10/04/2021 
---

# Service Fabric managed cluster node types

Each node type in a Service Fabric managed cluster is backed by a virtual machine scale set. With managed clusters you make any required changes through the Service Fabric managed cluster resource provider instead of against the resource directly. This encapsulation model helps... 

The rest of this document will cover how to adjust various settings from node type instance count, OS Image, and configuring placement properties.


## Scale a Service Fabric managed cluster node type with portal

In this walkthrough you will learn how to modify the node count for a node type using portal.

1) Login to [Azure Portal](https://portal.azure.com/)

2) Navigate to your cluster resource Overview page. 
![Sample Overview page][overview]

3) Select `Node Types` under the `Settings` section 

4) Select the `Node type name` you want to modify

5) Adjust the `Node count` to the new value you want and select `Apply` at the bottom. In this screenshot the value was `3` and adjusted to `5`.
![Sample showing a node count increase][adjust-node-count]

6) The `Provisioning state` will now show a status of `Updating` until complete. When complete, it will show `Succeeded` again.
![Sample showing a node count updating][node-count-updating]


## Scale a Service Fabric managed cluster node type with a template

To adjust the node count for a node type using an ARM Template, adjust the `vmInstanceCount` property with the new value and do a cluster deployment for the setting to take affect.

> [!NOTE]
> The managed cluster provider will block instance count adjustments that go below the required minimums for a given deployment type.

* The Service Fabric managed cluster resource apiVersion should be **2021-05-01** or later.

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

In this walkthrough you will learn how to modify the node count for a node type using portal.

1) Login to [Azure Portal](https://portal.azure.com/)

2) Navigate to your cluster resource Overview page. 
![Sample Overview page][overview]

3) Select `Node Types` under the `Settings` section 

4) Select the `Node type name` you want to modify

5) Adjust the `Node count` to the new value you want and select `Apply` at the bottom. In this screenshot the value was `3` and adjusted to `5`.
![Sample showing a node count increase][adjust-node-count]

6) The `Provisioning state` will now show a status of `Updating` until complete. When complete, it will show `Succeeded` again.
![Sample showing a node count updating][node-count-updating]


## Modify the OS image for a node type with a template

To modify the OS image used for a node type using an ARM Template, adjust the `vmImageSku` property with the new value and do a cluster deployment for the setting to take affect.

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

In this walkthrough you will learn how to modify the node count for a node type using portal.

1) Login to [Azure Portal](https://portal.azure.com/)

2) Navigate to your cluster resource Overview page. 
![Sample Overview page][overview]

3) Select `Node Types` under the `Settings` section 

4) Select the `Node type name` you want to modify

5) Adjust the `Node count` to the new value you want and select `Apply` at the bottom. In this screenshot the value was `3` and adjusted to `5`.
![Sample showing a node count increase][adjust-node-count]

6) The `Provisioning state` will now show a status of `Updating` until complete. When complete, it will show `Succeeded` again.
![Sample showing a node count updating][node-count-updating]


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


## Next steps

> [!div class="nextstepaction"]
> [Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)
> [Deploy an app to a Service Fabric managed cluster](./tutorial-managed-cluster-deploy-app.md)


[overview]: ./media/how-to-managed-cluster-modify-node-type/sfmc-overview.png
[node-count-updating]: ./media/how-to-managed-cluster-modify-node-type/sfmc-adjust-node-count-updating.png
[adjust-node-count]: ./media/how-to-managed-cluster-modify-node-type/sfmc-adjust-node-counts.png
[??]: ./media/how-to-managed-cluster-modify-node-type/