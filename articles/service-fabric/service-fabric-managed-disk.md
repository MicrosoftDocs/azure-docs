---
title: Deploy Service Fabric node types with managed data disks
description: Learn how to create and deploy Service Fabric node types with attached managed data disks.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Deploy an Azure Service Fabric cluster node type with managed data disks

Azure Service Fabric node types, by default, use the temporary disk on each virtual machine (VM) in the underlying virtual machine scale set for data storage. However, because the temporary disk is not persistent, and the size of the temporary disk is bound to a given VM SKU, this can be too restrictive for some scenarios. 

This article provides the steps for how to use native support from Service Fabric to configure and use managed data disks as the default data path. Service Fabric will automatically configure managed data disks at node type creation and handle situations where VMs or the virtual machine scale set is reimaged.

## Prerequisites

* The required minimum disk size for the managed data disk is 50 GB.
* Data disk drive letter should be set to character lexicographically greater than all drives present in the virtual machine scale set SKU. 
* Only one managed data disk per VM is supported. For scenarios involving more than 1 data disks, user needs to manage the data disks on their own.

## Configure the virtual machine scale set to use managed data disks in Service Fabric
To use managed data disks on a node type, configure the underlying virtual machine scale set resource with the following:

* Add a managed disk in data disks section of the template for the virtual machine scale set. 
* Update the Service Fabric extension for the virtual machine scale set with following settings: 
    * For Windows: **useManagedDataDisk: true** and **dataPath: 'K:\\\\SvcFab'**. Note that drive K is just a representation. You can use any drive letter lexicographically greater than all the drive letters present in the virtual machine scale set SKU.
    * For Linux: **useManagedDataDisk:true** and **dataPath: '/mnt/sfroot'**.

Here's an Azure Resource Manager template for a Service Fabric extension:

```json
{
    "virtualMachineProfile": {
        "extensionProfile": {
            "extensions": [
                {
                    "name": "[concat(parameters('vmNodeType1Name'),'_ServiceFabricNode')]",
                    "properties": {
                        "type": "ServiceFabricNode",
                        "autoUpgradeMinorVersion": false,
                        "publisher": "Microsoft.Azure.ServiceFabric",
                        "settings": {
                            "clusterEndpoint": "[reference(parameters('clusterName')).clusterEndpoint]",
                            "nodeTypeRef": "[parameters('vmNodeType1Name')]",
                            "dataPath": "K:\\\\SvcFab",
                            "useManagedDataDisk": true,
                            "durabilityLevel": "Bronze",
                            "certificate": {
                                "thumbprint": "[parameters('certificateThumbprint')]",
                                "x509StoreName": "[parameters('certificateStoreValue')]"
                            },
                            "systemLogUploadSettings": {
                                "Enabled": true
                            },
                        },
                        "typeHandlerVersion": "1.1"
                    }
                },
            ]
        },
        "storageProfile": 
        {
            "datadisks": [
                {
                    "lun": "1",
                    "createOption": "empty",
                    "diskSizeGB": "100",
                    "managedDisk": { "storageAccountType": "Standard_LRS" }
                }
            ]
        }
    }
}
```

## Migrate to using managed data disks for Service Fabric node types
For all migration scenarios, new node types with managed data disks need to be added. Existing node types cannot be converted to use managed data disks.

1. Add a new node type that's configured to use managed data disks as specified earlier.
2. Migrate any required workloads to the new node type.
3. Disable and remove the old node type from the cluster.


## Next steps 
* [Service Fabric overview](service-fabric-reliable-services-introduction.md)
* [Node types and virtual machine scale sets](service-fabric-cluster-nodetypes.md)
* [Service Fabric capacity planning](service-fabric-best-practices-capacity-scaling.md)
