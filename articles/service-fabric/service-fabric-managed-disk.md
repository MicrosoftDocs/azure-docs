---
title: Deploy Service fabric node-types Managed Data disks
description: Learn how to create and deploy Service fabric node-types with attached Managed data disks
author: craftyhouse

ms.topic: conceptual
ms.date: 10/19/2021
ms.author: micraft

---

# Deploy an Azure Service Fabric cluster node-type with Managed data disks(Preview)

Service Fabric node types generally use the temporary disk attached with the underlying virtual machine scale set for its purposes. However, for higher resiliency and data storage requirements customers might want to use Managed data disks as the dataPath for the node-type. This also helps when the temporary disk size of the VM Sku is insufficient for Service Fabric. The following document provides steps to leverage native support from Service fabric to use and configure Managed data disks as default data Path. Using this, Service Fabric will automatically formats the raw disk drive for the first time, mounts it to correct location, and use it as SF dataPath. It also takes care of situations where VM's or the virutal machine scale set is reimaged.

* Minimum size requirements for the managed data disk still remains to be atleast 50GB.
* In scenarios where more than 1 managed data disk is attached, customer needs to manage the data disks on their own.

## Configuring virtual machine scale set to use managed data disks in Service fabric
To enable using managed data disks in node types, you should configure the underlying virtual machine scale set resource in the following way:

* Add a managed disk in the data disks section of the ARM template for the virtual machine scale set. 
* Update the Service fabric extension with following settings: 
    * For Windows - **useManagedDataDisk: true** and **dataPath: 'K:\\\\SvcFab'** .  Note, the drive letter "K" is just a representation, it can be any drive Letter lexicographically greater than all the drive Letter present in the virtual machine scale set SKU.
    * For Linux - **useManagedDataDisk:true** and **dataPath: '\mnt\sfdataroot'** .

>[!NOTE]
> Support for Managed Data disks for Linux Service Fabric clusters is currently not available for Production, but customers can try it out by using Test Service Fabric extension for Linux.

Service Fabric Extension ARM template
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
                    "managedDisk": { "storageAccountType": "[parameters('storageAccountType')]" }
                }
            ]
        }
    }
}
```

## Migrate to using Managed data disks for Service fabric node types
For all migration scenarios, a new node type needs to be added which uses managed data disks as specified above. Workloads needs to be migrated to these new node types.

Once the resources have finished deploying, you can begin to disable the nodes in the node type that you want to remove from the original cluster.

## Next steps 
* [Service Fabric Overview](service-fabric-reliable-services-introduction.md)
* [Node types and virtual machine scale sets](service-fabric-cluster-nodetypes.md)
* [Service Fabric capacity planning](service-fabric-best-practices-capacity-scaling.md)