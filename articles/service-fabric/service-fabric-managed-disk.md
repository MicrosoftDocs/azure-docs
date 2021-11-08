---
title: Deploy Service Fabric node-types Managed Data disks
description: Learn how to create and deploy Service fabric node-types with attached Managed data disks
author: craftyhouse

ms.topic: conceptual
ms.date: 10/19/2021
ms.author: micraft

---

# Deploy an Azure Service Fabric cluster node-type with Managed data disks(Preview)

>[!NOTE]
> Support for Managed Data disks is only in Preview right now, and should not be used with Production workloads.


Service Fabric node types by default use the temporary disk on each VM in the underlying virtual machine scale set for data storage. However, since the temporary disk is not persistent, and the size of the temporary disk is bound to a given VM SKU, that can be too restrictive for some scenarios. With Azure Managed Disks customers have a persistent data disk they can specify the size and performance on that will be used for a node-type, separately from a VM SKU. The following document provides steps to use native support from Service fabric to configure and use Azure Managed Disks as the default data path. Service Fabric will automatically configure Azure Managed Disks on node type creation and handle situations where VMs or the virtual machine scale set is reimaged.

* Required minimum disk size for the managed data disk is 50 GB.
* In scenarios where more than one managed data disk is attached, customer needs to manage the data disks on their own.

## Configuring virtual machine scale set to use managed data disks in Service fabric
To use Azure Managed Disks on a node type, configure the underlying virtual machine scale set resource with the following:

* Add a managed disk in data disks section of the template for the virtual machine scale set. 
* Update the Service fabric extension with following settings: 
    * For Windows - **useManagedDataDisk: true** and **dataPath: 'K:\\\\SvcFab'** .  Note, the drive letter "K" is just a representation, it can be any drive Letter lexicographically greater than all the drive letter present in the virtual machine scale set SKU.
    * For Linux - **useManagedDataDisk:true** and **dataPath: '\mnt\sfdataroot'** .

>[!NOTE]
> Support for Managed Data disks for Linux Service Fabric clusters is currently not available.

Service Fabric Extension Azure Resource Manager template
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

## Migrate to using Managed data disks for Service fabric node types
* For all migration scenarios, a new node type needs to be added which uses managed data disks as specified above.
* Once new node types are added, migrate the workloads to the new node types.
* Once the resources have finished deploying, you can begin to disable the nodes in the node type that you want to remove from the original cluster.

## Next steps 
* [Service Fabric Overview](service-fabric-reliable-services-introduction.md)
* [Node types and virtual machine scale sets](service-fabric-cluster-nodetypes.md)
* [Service Fabric capacity planning](service-fabric-best-practices-capacity-scaling.md)
