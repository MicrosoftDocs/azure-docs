---
title: Scale a node type on a Service Fabric managed cluster
description: This article walks through how to scale a node type on a managed cluster
ms.topic: how-to
ms.date: 9/16/2021 
---

# Service Fabric managed cluster node type scaling

Each node type in a Service Fabric managed cluster is backed by a virtual machine scale set. With managed clusters you make any required changes through the Service Fabric provider vs VMSS directly. This encapsulation model helps ...


> [!NOTE]
> This property can not be modified after a node type is deployed.

## Scale a Service Fabric managed cluster node type with portal

In this walkthrough you will adjust the instance count for a node type using portal. 

1)

2) 

3)



## Scale a Service Fabric managed cluster node type with a template

You can follow this guidance to adjust instance count for a given node type using an ARM Template:

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
}
```

## Next steps

> [!div class="nextstepaction"]
> [Deploy an app to a Service Fabric managed cluster](./tutorial-managed-cluster-deploy-app.md)
