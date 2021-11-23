---
title: Configure or modify a Service Fabric managed cluster node type
description: This article walks through how to modify a managed cluster node type
ms.topic: how-to
ms.date: 10/25/2021 
---

# Service Fabric managed cluster node types

Each node type in a Service Fabric managed cluster is backed by a virtual machine scale set. With managed clusters, you make any required changes through the Service Fabric managed cluster resource provider. All of the underlying resources for the cluster are created and abstracted by the managed cluster provider on your behalf. Having the resource provider manage the resources helps to simplify cluster node type deployment and management, prevent operation errors such as deleting a seed node, and application of best practices such as validating a VM SKU is safe to use.

The rest of this document will cover how to adjust various settings from creating a node type, adjusting node type instance count, enable automatic OS image upgrades, change the OS Image, and configuring placement properties. This document will also focus on using Azure portal or Azure Resource Manager Templates to make changes.

> [!NOTE]
> You will not be able to modify the node type while a change is in progress. It is recommended to let any requested change complete before doing another.


## Add or remove a node type with portal

In this walkthrough, you will learn how to add or remove a node type using portal.

**To add a node type:**
1) Log in to [Azure portal](https://portal.azure.com/)

2) Navigate to your cluster resource Overview page. 
![Sample Overview page][overview]

3) Select `Node types` under the `Settings` section 
![Node Types view][addremove]

4) Click `Add` at the top, fill in the required information, then click Add at the bottom, that's it!


**To remove a node type:**
1) Log in to [Azure portal](https://portal.azure.com/)

2) Navigate to your cluster resource Overview page. 
![Sample Overview page][overview]

3) Select `Node types` under the `Settings` section 
![Node Types view][addremove]

4) Select the `Node Type` you want to remove and click `Delete` at the top.

> [!NOTE]
> It is not possible to remove a primary node type if it is the only primary node type in the cluster.


## Add a node type with a template

**To add a node type using an ARM Template**

Add another resource type `Microsoft.ServiceFabric/managedclusters/nodetypes` with the required values and do a cluster deployment for the setting to take effect.

* The Service Fabric managed cluster resource apiVersion should be **2021-05-01** or later.

```json
          {
            "apiVersion": "[variables('sfApiVersion')]",
            "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
            "name": "[concat(parameters('clusterName'), '/', parameters('nodeType2Name'))]",
            "location": "[resourcegroup().location]",
            "dependsOn": [
              "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterName'))]"
            ],
            "properties": {
                "isPrimary": false,
                "vmImagePublisher": "[parameters('vmImagePublisher')]",
                "vmImageOffer": "[parameters('vmImageOffer')]",
                "vmImageSku": "[parameters('vmImageSku')]",
                "vmImageVersion": "[parameters('vmImageVersion')]",
                "vmSize": "[parameters('nodeType2VmSize')]",
                "vmInstanceCount": "[parameters('nodeType2VmInstanceCount')]",
                "dataDiskSizeGB": "[parameters('nodeType2DataDiskSizeGB')]",
                "dataDiskType": "[parameters('nodeType2managedDataDiskType')]"
           }
```
For an example two node type configuration, see our [sample two node type ARM Template](https://github.com/Azure-Samples/service-fabric-cluster-templates/blob/master/SF-Managed-Standard-SKU-2-NT)


## Scale a node type manually with portal

In this walkthrough, you will learn how to modify the node count for a node type using portal.

1) Log in to [Azure portal](https://portal.azure.com/)

2) Navigate to your cluster resource Overview page. 
![Sample Overview page][overview]

3) Select `Node Types` under the `Settings` section 

4) Select the `Node type name` you want to modify

5) Adjust the `Node count` to the new value you want and select `Apply` at the bottom. In this screenshot, the value was `3` and adjusted to `5`.
![Sample showing a node count increase][adjust-node-count]

6) The `Provisioning state` will now show a status of `Updating` until complete. When complete, it will show `Succeeded` again.
![Sample showing a node type updating][node-type-updating]


## Scale a node type manually with a template

To adjust the node count for a node type using an ARM Template, adjust the `vmInstanceCount` property with the new value and do a cluster deployment for the setting to take effect.

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

## Enable automatic OS image upgrades

You can choose to enable automatic OS image upgrades to the virtual machines running your managed cluster nodes. Although the virtual machine scale set resources are managed on your behalf with Service Fabric managed clusters, it's your choice to enable automatic OS image upgrades for your cluster nodes. As with [classic Service Fabric](service-fabric-best-practices-infrastructure-as-code.md#virtual-machine-os-automatic-upgrade-configuration) clusters, managed cluster nodes are not upgraded by default, in order to prevent unintended disruptions to your cluster.

To enable automatic OS upgrades:

* Use the `2021-05-01` (or later) version of *Microsoft.ServiceFabric/managedclusters* and *Microsoft.ServiceFabric/managedclusters/nodetypes* resources
* Set the cluster's property `enableAutoOSUpgrade` to *true*
* Set the cluster nodeTypes' resource property `vmImageVersion` to *latest*

For example:

```json
    {
      "apiVersion": "2021-05-01",
      "type": "Microsoft.ServiceFabric/managedclusters",
      ...
      "properties": {
        ...
        "enableAutoOSUpgrade": true
      },
    },
    {
      "apiVersion": "2021-05-01",
      "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
       ...
      "properties": {
        ...
        "vmImageVersion": "latest",
        ...
      }
    }
}

```

Once enabled, Service Fabric will begin querying and tracking OS image versions in the managed cluster. If a new OS version is available, the cluster node types (virtual machine scale sets) will be upgraded, one at a time. Service Fabric runtime upgrades are performed only after confirming no cluster node OS image upgrades are in progress.

If an upgrade fails, Service Fabric will retry after 24 hours, for a maximum of three retries. Similar to classic (unmanaged) Service Fabric upgrades, unhealthy apps or nodes may block the OS image upgrade.

For more on image upgrades, see [Automatic OS image upgrades with Azure virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md).

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

To modify the OS image used for a node type using an ARM Template, adjust the `vmImageSku` property with the new value and do a cluster deployment for the setting to take effect. The managed cluster provider will reimage each instance by upgrade domain.

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

To adjust the placement properties for a node type using an ARM Template, adjust the `placementProperties` property with the new value(s) and do a cluster deployment for the setting to take effect. The below sample shows three values being set for a node type.

* The Service Fabric managed cluster resource apiVersion should be **2021-05-01** or later.

```json
     {
            "apiVersion": "[variables('sfApiVersion')]",
            "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
            "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
            "location": "[resourcegroup().location]",
            "properties": {
                "placementProperties": {
                    "PremiumSSD": "true",
                    "NodeColor": "green",
                    "SomeProperty": "5"
            }
        }
}
```
You can now use that [placement property to ensure that certain workloads run only on certain types of nodes in the cluster](./service-fabric-cluster-resource-manager-cluster-description.md#node-properties-and-placement-constraints). 

## Modify the VM SKU for a node type

Service Fabric managed cluster does not support in-place modification of the VM SKU, but is simpler then classic. In order to accomplish this you'll need to do the following:
* [Create a new node type](how-to-managed-cluster-modify-node-type.md#add-or-remove-a-node-type-with-portal) with the required VM SKU.
* Migrate your workload over. One way is to use a [placement property to ensure that certain workloads run only on certain types of nodes in the cluster](./service-fabric-cluster-resource-manager-cluster-description.md#node-properties-and-placement-constraints). 
* [Delete old node type](how-to-managed-cluster-modify-node-type.md#add-or-remove-a-node-type-with-portal)



## Configure multiple managed disks (preview)
Service Fabric managed clusters by default configure one managed disk. By configuring the following optional property and values, you can add more managed disks to node types within a cluster. You are able to specify the drive letter, disk type, and size per disk.

Configure more managed disks by declaring `additionalDataDisks` property and required parameters in your Resource Manager template as follows:

**Feature Requirements**
* Lun must be unique per disk and can not use reserved lun 0
* Disk letter cannot use reserved letters C or D and cannot be modified once created. S will be used as default if not specified.
* Must specify a [supported disk type](how-to-managed-cluster-managed-disk.md)
* The Service Fabric managed cluster resource apiVersion must be **2021-11-01-preview** or later.

```json
     {
            "apiVersion": "[variables('sfApiVersion')]",
            "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
            "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
            "location": "[resourcegroup().location]",
            "properties": {
                "additionalDataDisks": {
                    "lun": "1",
                    "diskSizeGB": "50",
                    "diskType": "Standard_LRS",
                    "diskLetter": "S" 
            }
        }
     }
```

See [full list of parameters available](/azure/templates/microsoft.servicefabric/managedclusters)

## Configure the Service Fabric data disk drive letter (preview)
Service Fabric managed clusters by default configure a Service Fabric data disk and automatically configure the drive letter on all nodes of a node type. By configuring this optional property and value, you can specify and retrieve the Service Fabric data disk letter if you have specific requirements for drive letter mapping.

**Feature Requirements**
* Disk letter cannot use reserved letters C or D and cannot be modified once created. S will be used as default if not specified.
* The Service Fabric managed cluster resource apiVersion must be **2021-11-01-preview** or later.

```json
     {
            "apiVersion": "[variables('sfApiVersion')]",
            "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
            "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
            "location": "[resourcegroup().location]",
            "properties": {
                "dataDiskLetter": "S"      
            }
        }
     }
```

## Next steps

> [!div class="nextstepaction"]
> [Auto scale a Service Fabric managed cluster node type](how-to-managed-cluster-autoscale.md)
> [!div class="nextstepaction"]
> [Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)
> [!div class="nextstepaction"]
> [Deploy an app to a Service Fabric managed cluster](./tutorial-managed-cluster-deploy-app.md)


[overview]: ./media/how-to-managed-cluster-modify-node-type/sfmc-overview.png
[node-type-updating]: ./media/how-to-managed-cluster-modify-node-type/sfmc-adjust-node-type-updating.png
[adjust-node-count]: ./media/how-to-managed-cluster-modify-node-type/sfmc-adjust-node-counts.png
[change-nodetype-os-image]: ./media/how-to-managed-cluster-modify-node-type/sfmc-change-os-image.png
[nodetype-placement-property]: ./media/how-to-managed-cluster-modify-node-type/sfmc-nodetype-placement-property.png
[addremove]: ./media/how-to-managed-cluster-modify-node-type/sfmc-addremove-node-type.png

