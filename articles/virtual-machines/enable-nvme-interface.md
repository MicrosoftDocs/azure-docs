---
title: Enable NVMe Interface.
description: #Required; article description that is displayed in search results. 
author: #Required; your GitHub user alias, with correct capitalization.
ms.author: #Required; microsoft alias of author; optional team alias.
ms.service: #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: #Required; mm/dd/yyyy format.
ms.custom: template-how-to-pattern #Required; leave this attribute/value as-is.


---

# Enabling NVMe Interface

## About NVMe and SCSI Interface

NVMe stands for non-volatile memory express, which is a communication protocol that facilitates faster and more efficient data transfer between servers and storage systems. With NVMe, data can be transferred at the highest throughput and with the fastest response time. Azure now supports the NVMe interface on the Ebsv5 and EBDsv5 family, offering the highest IOPS and throughput performance for remote disk storage among all the GP v5 VM series.

SCSI (Small Computer System Interface) is a legacy standard for physically connecting and transferring data between computers and peripheral devices. ALthough Ebsv5 VM sizes still support SCSI, we recommend switching to NVMe for better performance benefits.

## Enable the NVMe interface on a VM
A new feature has been added to the VM configuration, called DiskControllerType, which allows customers to select their preferred controller type as NVMe or SCSI. If the customer doesn't specify a DiskControllerType value then the platform will automatically choose the default controller based on the VM size configuration. If the VM size is configured for SCSI as the default and supports NVMe, SCSI will be used unless updated to the NVMe DiskControllerType. 

To enable the NVMe interface, the following prerequisites must be met:

- Choose a VM family that supports NVMe. It is important to note that only Ebsv5 and Ebdsv5 VM sizes are equipped with NVMe in the Intel v5 generation VMs. Make sure to select either one of the series, Ebsv5 or Ebdsv5 VM.
- Select the operating system image that is tagged with NVMe support
- Opt-in to NVMe by selecting NVMe disk controller type in Azure Portal or ARM/CLI/Power Shell template. For step-by-step instructions, refer here
- Only Gen2 images are supported
- Choose one of the Azure regions where NVMe is enabled

By meeting the above five conditions, you'll be able to enable NVMe on the supported VM family in no time. Please follow the above conditions to successfully create or resize a VM with NVMe without any complications. Refer to the FAQ to learn about NVMe enablement.

## Steps to launch a VM with NVMe interface:
- NVMe can be enabled during VM creation using various methods such as: Azure Portal, CLI, PowerShell, and ARM templates.
- To create an NVMe VM, you must first enable the NVMe option on a VM and select the NVMe controller disk type for the VM. Note that the NVMe diskcontrollertype can be enabled during creation or updated to NVMe when the VM is stopped and deallocated, provided that the VM size supports NVMe. 


## Azure Portal View:
To find the NVMe eligible sizes, click on "See All Sizes", add the Disk Controller filter, and then select NVMe:

:::image type="content" source="./media/enable-nvme/azureportal1.png" alt-text="test":::

Then visit the Advanced tab to officially enable NVMe:

:::image type="content" source="./media/enable-nvme/azureportal2.png" alt-text="test":::


Then in Review and Create, verify that this feature is enabled. 

:::image type="content" source="./media/enable-nvme/azureportal3.png" alt-text="test":::

## Sample ARM template

```json


{ 
    "apiVersion": "2022-08-01", 
    "type": "Microsoft.Compute/virtualMachines", 
    "name": "[variables('vmName')]", 
    "location": "[parameters('location')]", 
    "identity": { 
        "type": "userAssigned", 
        "userAssignedIdentities": { 
            "/subscriptions/ <EnterSubscriptionIdHere> /resourcegroups/ManagedIdentities/providers/Microsoft.ManagedIdentity/userAssignedIdentities/KeyVaultReader": {} 
        } 
    }, 
    "dependsOn": [ 
        "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]" 
    ], 
    "properties": { 
        "hardwareProfile": { 
            "vmSize": "[parameters('vmSize')]" 
        }, 
        "osProfile": "[variables('vOsProfile')]", 
        "storageProfile": { 
            "imageReference": "[parameters('osDiskImageReference')]", 
            "osDisk": { 
                "name": "[variables('diskName')]", 
                "caching": "ReadWrite", 
                "createOption": "FromImage" 
            }, 
            "copy": [ 
                { 
                    "name": "dataDisks", 
                    "count": "[parameters('numDataDisks')]", 
                    "input": { 
                        "caching": "[parameters('dataDiskCachePolicy')]", 
                        "writeAcceleratorEnabled": "[parameters('writeAcceleratorEnabled')]", 
                        "diskSizeGB": "[parameters('dataDiskSize')]", 
                        "lun": "[add(copyIndex('dataDisks'), parameters('lunStartsAt'))]", 
                        "name": "[concat(variables('vmName'), '-datadisk-', copyIndex('dataDisks'))]", 
                        "createOption": "Attach", 
                        "managedDisk": { 
                            "storageAccountType": "[parameters('storageType')]", 
                            "id": "[resourceId('Microsoft.Compute/disks/', concat(variables('vmName'), '-datadisk-', copyIndex('dataDisks')))]" 
                        } 
                    } 
                } 
            ], 
            "diskControllerType": "NVME" 
        }, 
        "securityProfile": { 
            "encryptionAtHost": "[parameters('encryptionAtHost')]" 
        }, 
                           
        "networkProfile": { 
            "networkInterfaces": [ 
                { 
                    "id": "[resourceId('Microsoft.Network/networkInterfaces', variables('nicName'))]" 
                } 
            ] 
        }, 
        "availabilitySet": { 
            "id": "[resourceId('Microsoft.Compute/availabilitySets', parameters('availabilitySetName'))]" 
        } 
    }, 
    "tags": { 
        "vmName": "[variables('vmName')]", 

      "location": "[parameters('location')]", 

                "dataDiskSize": "[parameters('dataDiskSize')]", 

                "numDataDisks": "[parameters('numDataDisks')]", 

                "dataDiskCachePolicy": "[parameters('dataDiskCachePolicy')]", 

                "availabilitySetName": "[parameters('availabilitySetName')]", 

                "customScriptURL": "[parameters('customScriptURL')]", 

                "SkipLinuxAzSecPack": "True", 

                "SkipASMAzSecPack": "True", 

                "EnableCrashConsistentRestorePoint": "[parameters('enableCrashConsistentRestorePoint')]" 

            } 

        }, 
```
 

>[!TIP]
Use the same parameter "DiskControllerType" if you are using the PowerShell or CLI tools to launch the NVMe supported VM.


## OS Images supported:

### Linux
:::image type="content" source="./media/enable-nvme/linuxosimage1.png" alt-text="test":::




> [ !NOTE] 
> Coming Soon:
:::image type="content" source="./media/enable-nvme/linuxosimage3.png" alt-text="test":::


### Windows

- [Azure portal - Plan Id: 2019-datacenter-core-smalldisk](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterServerCore)
- [Azure portal - Plan Id: 2019-datacenter-core-smalldisk-g2](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterServerCore2019-datacenter-core-smalldisk-g2) 
- [Azure portal - Plan Id: 2019 datacenter-core](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterServerCore)
- [Azure portal - Plan Id: 2019-datacenter-core-g2](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterServerCore2019-datacenter-core-g2)
- [Azure portal - Plan Id: 2019-datacenter-core-with-containers-smalldisk](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterServerCorewithContainers)
- [Azure portal - Plan Id: 2019-datacenter-core-with-containers-smalldisk-g2](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterServerCorewithContainers2019-datacenter-core-with-containers-smalldisk-g2)
- [Azure portal - Plan Id: 2019-datacenter-with-containers-smalldisk](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterwithContainers2019-datacenter-with-containers-smalldisk-g2)
- [Azure portal - Plan Id: 2019-datacenter-smalldisk](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019Datacenter)
- [Azure portal - Plan Id: 2019-datacenter-smalldisk-g2](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019Datacenter2019-datacenter-smalldisk-g2)
- [Azure portal - Plan Id: 2019-datacenter-zhcn](https://portal.azure.com/#create/Microsoft.WindowsServer2019Datacenterzhcn)
- [Azure portal - Plan Id: 2019-datacenter-zhcn-g2](https://portal.azure.com/#create/Microsoft.WindowsServer2019Datacenterzhcn2019-datacenter-zhcn-g2)
- [Azure portal - Plan Id: 2019-datacenter-core-with-containers](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterServerCorewithContainers)
- [Azure portal - Plan Id: 2019-datacenter-core-with-containers-g2](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterServerCorewithContainers2019-datacenter-core-with-containers-g2)
- [Azure portal - Plan Id: 2019-datacenter-with-containers](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterwithContainers)
- [Azure portal - Plan Id: 2019-datacenter-with-containers-g2](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterwithContainers2019-datacenter-with-containers-g2)
- [Azure portal - Plan Id: 2019-datacenter](https://portal.azure.com/#create/Microsoft.WindowsServer2019Datacenter)
- [Azure portal - Plan Id: 2019-datacenter-gensecond](https://portal.azure.com/#create/Microsoft.WindowsServer2019Datacenter2019-datacenter-gensecond)
- [Azure portal - Plan Id: 2022-datacenter-core](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-core)
- [Azure portal - Plan Id: 2022-datacenter-core-g2](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-core-g2)
- [Azure portal - Plan Id: 2022-datacenter-smalldisk](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-smalldisk)
- [Azure portal - Plan Id: 2022-datacenter-smalldisk-g2](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-smalldisk-g2)
- [Azure portal - Plan Id: 2022-datacenter](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter)
- [Azure portal - Plan Id: 2022-datacenter-g2](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-g2)
- [Azure portal - Plan Id: 2022-datacenter-core-smalldisk](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-core-smalldisk)
- [Azure portal - Plan Id: 2022-datacenter-core-smalldisk-g2](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-core-smalldisk-g2)
- [Azure portal - Plan Id: 2022-datacenter-azure-edition-smalldisk](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-azure-edition-smalldisk)
- [Azure portal - Plan Id: 2022-datacenter-azure-edition](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-azure-edition)
- [Azure portal - Plan Id: 2022-datacenter-azure-edition-core](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-azure-edition-core)
- [Azure portal - Plan 2022-datacenter-azure-edition-core-smalldisk](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-azure-edition-core-smalldisk)


