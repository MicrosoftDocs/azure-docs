---
title: Configure a node type for large virtual machine scale set support
description: This article shows how to add support for multiple placement groups to enable scaling beyond 100 VMs
ms.topic: how-to
ms.date: 7/21/2021 
---

# Service Fabric managed cluster node type large virtual machine scale sets

Each node type in a Service Fabric managed cluster is backed by a virtual machine scale set. To allow managed cluster node type's to create [large virtual machine scale sets](https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-placement-groups) a property `multiplePlacementGroups` has been added to node type definitions. By Default, managed cluster node types set this property to false which limits a node type scaling to 100 VMs. 

>is this supported? Dont think so due to safety< This functionality mirrors what you can enable for classic clusters by modifying the VMSS property called `singlePlacementGroup`

For an example of a Service Fabric managed cluster deployment that makes use of managed identity on a node type, see [these templates](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-Large). (need to make)


> [!NOTE]
> This property can not be modified after a node type is deployed.

## Prerequisites

Before you begin:

* If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
* If you plan to use PowerShell, [install](/cli/azure/install-azure-cli) the Azure CLI to run CLI reference commands.

## Enable large node types in a Service Fabric managed cluster
To set one or more secondary node types as large in a node type resource, set the **multiplePlacementGroups** property to **true**. When deploying a Service Fabric cluster with large node types, it is required to have at least one primary node type, which is not large in the cluster.

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


## Next Steps

> [!div class="nextstepaction"]
> [Deploy an app to a Service Fabric managed cluster](./tutorial-managed-cluster-deploy-app.md)
