---
title: Enable NVMe Interface.
description: Enable NVMe interface on virtual machine
author: iamwilliew
ms.author: wwilliams
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 10/30/2023
ms.custom: template-how-to-pattern
---

# Enabling NVMe and SCSI Interface on Virtual Machine

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

NVMe stands for nonvolatile memory express, which is a communication protocol that facilitates faster and more efficient data transfer between servers and storage systems. With NVMe, data can be transferred at the highest throughput and with the fastest response time. Azure now supports the NVMe interface on the Ebsv5 and Ebdsv5 family, offering the highest IOPS and throughput performance for remote disk storage among all the GP v5 VM series.

SCSI (Small Computer System Interface) is a legacy standard for physically connecting and transferring data between computers and peripheral devices. Although Ebsv5 VM sizes still support SCSI, we recommend switching to NVMe for better performance benefits.

## Prerequisites

A new feature has been added to the VM configuration, called DiskControllerType, which allows customers to select their preferred controller type as NVMe or SCSI. If the customer doesn't specify a DiskControllerType value then the platform will automatically choose the default controller based on the VM size configuration. If the VM size is configured for SCSI as the default and supports NVMe, SCSI will be used unless updated to the NVMe DiskControllerType.

To enable the NVMe interface, the following prerequisites must be met:

- Choose a VM family that supports NVMe. It's important to note that only Ebsv5 and Ebdsv5 VM sizes are equipped with NVMe in the Intel v5 generation VMs. Make sure to select either one of the series, Ebsv5 or Ebdsv5 VM.
- Select the operating system image that is tagged with NVMe support
- Opt-in to NVMe by selecting NVMe disk controller type in Azure portal or ARM/CLI/Power Shell template. For step-by-step instructions, refer here
- Only Gen2 images are supported
- Choose one of the Azure regions where NVMe is enabled

By meeting the above five conditions, you'll be able to enable NVMe on the supported VM family in no time. Please follow the above conditions to successfully create or resize a VM with NVMe without any complications. Refer to the [FAQ](enable-nvme-faqs.yml) to learn about NVMe enablement.

## OS Images supported

### Linux

| Distribution                         | Image                                                            |
|--------------------------------------|------------------------------------------------------------------|
|     Almalinux 8.x (currently 8.7)    |   almalinux: almalinux:8-gen2: latest                            |
|     Almalinux 9.x (currently 9.1)    |   almalinux: almalinux:9-gen2: latest                            |
|     Debian 11                        |   Debian: debian-11:11-gen2: latest                              |
|     CentOS 7.9                       |   openlogic: centos:7_9-gen2: latest                             |
|     RHEL 7.9                         |   RedHat: RHEL:79-gen2: latest                                   |
|     RHEL 8.6                         |   RedHat: RHEL:86-gen2: latest                                   |
|     RHEL 8.7                         |   RedHat: RHEL:87-gen2: latest                                   |
|     RHEL 9.0                         |   RedHat: RHEL:90-gen2: latest                                   |
|     RHEL 9.1                         |   RedHat: RHEL:91-gen2: latest                                   |
|     Ubuntu 18.04                     |   Canonical:UbuntuServer:18_04-lts-gen2:latest                   |
|     Ubuntu 20.04                     |   Canonical:0001-com-ubuntu-server-focal:20_04-lts-gen2:latest   |
|     Ubuntu 22.04                     |   Canonical:0001-com-ubuntu-server-jammy:22_04-lts-gen2:latest   |
|     Oracle 7.9                       |   Oracle: Oracle-Linux:79-gen2:latest                       |
|     Oracle 8.5                       |   Oracle: Oracle-Linuz:ol85-lvm-gen2:latest                      |
|     Oracle 8.6                       |   Oracle: Oracle-Linux:ol86-lvm-gen2:latest                      |
|     Oracle 8.7                       |   Oracle: Oracle-Linux:ol87-lvm-gen2:latest                      |
|     Oracle 9.0                       |   Oracle: Oracle-Linux:ol9-lvm-gen2:latest                       |
|     Oracle 9.1                       |   Oracle: Oracle-Linux:ol91-lvm-gen2:latest                      |
|     SLES-for-SAP 15.3                |   SUSE:sles-sap-15-sp3:gen2:latest                               |
|     SLES-for-SAP 15.4                |   SUSE:sles-sap-15-sp4:gen2:latest                               |
|     SLES 15.4                        |   SUSE:sles-15-sp4:gen2:latest                                   |
|     SLES 15.5                        |   SUSE:sles-15-sp5:gen2:latest                                   |


### Windows

- [Azure portal - Plan ID: 2019-datacenter-core-smalldisk](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterServerCore)
- [Azure portal - Plan ID: 2019-datacenter-core-smalldisk-g2](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterServerCore2019-datacenter-core-smalldisk-g2)
- [Azure portal - Plan ID: 2019 datacenter-core](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterServerCore)
- [Azure portal - Plan ID: 2019-datacenter-core-g2](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterServerCore2019-datacenter-core-g2)
- [Azure portal - Plan ID: 2019-datacenter-core-with-containers-smalldisk](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterServerCorewithContainers)
- [Azure portal - Plan ID: 2019-datacenter-core-with-containers-smalldisk-g2](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterServerCorewithContainers2019-datacenter-core-with-containers-smalldisk-g2)
- [Azure portal - Plan ID: 2019-datacenter-with-containers-smalldisk](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterwithContainers2019-datacenter-with-containers-smalldisk-g2)
- [Azure portal - Plan ID: 2019-datacenter-smalldisk](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019Datacenter)
- [Azure portal - Plan ID: 2019-datacenter-smalldisk-g2](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019Datacenter2019-datacenter-smalldisk-g2)
- [Azure portal - Plan ID: 2019-datacenter-zhcn](https://portal.azure.com/#create/Microsoft.WindowsServer2019Datacenterzhcn)
- [Azure portal - Plan ID: 2019-datacenter-zhcn-g2](https://portal.azure.com/#create/Microsoft.WindowsServer2019Datacenterzhcn2019-datacenter-zhcn-g2)
- [Azure portal - Plan ID: 2019-datacenter-core-with-containers](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterServerCorewithContainers)
- [Azure portal - Plan ID: 2019-datacenter-core-with-containers-g2](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterServerCorewithContainers2019-datacenter-core-with-containers-g2)
- [Azure portal - Plan ID: 2019-datacenter-with-containers](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterwithContainers)
- [Azure portal - Plan ID: 2019-datacenter-with-containers-g2](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterwithContainers2019-datacenter-with-containers-g2)
- [Azure portal - Plan ID: 2019-datacenter](https://portal.azure.com/#create/Microsoft.WindowsServer2019Datacenter)
- [Azure portal - Plan ID: 2019-datacenter-gensecond](https://portal.azure.com/#create/Microsoft.WindowsServer2019Datacenter2019-datacenter-gensecond)
- [Azure portal - Plan ID: 2022-datacenter-core](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-core)
- [Azure portal - Plan ID: 2022-datacenter-core-g2](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-core-g2)
- [Azure portal - Plan ID: 2022-datacenter-smalldisk](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-smalldisk)
- [Azure portal - Plan ID: 2022-datacenter-smalldisk-g2](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-smalldisk-g2)
- [Azure portal - Plan ID: 2022-datacenter](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter)
- [Azure portal - Plan ID: 2022-datacenter-g2](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-g2)
- [Azure portal - Plan ID: 2022-datacenter-core-smalldisk](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-core-smalldisk)
- [Azure portal - Plan ID: 2022-datacenter-core-smalldisk-g2](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-core-smalldisk-g2)
- [Azure portal - Plan ID: 2022-datacenter-azure-edition-smalldisk](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-azure-edition-smalldisk)
- [Azure portal - Plan ID: 2022-datacenter-azure-edition](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-azure-edition)
- [Azure portal - Plan ID: 2022-datacenter-azure-edition-core](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-azure-edition-core)
- [Azure portal - Plan 2022-datacenter-azure-edition-core-smalldisk](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-azure-edition-core-smalldisk)


## Launching a VM with NVMe interface
NVMe can be enabled during VM creation using various methods such as: Azure portal, CLI, PowerShell, and ARM templates. To create an NVMe VM, you must first enable the NVMe option on a VM and select the NVMe controller disk type for the VM. Note that the NVMe diskcontrollertype can be enabled during creation or updated to NVMe when the VM is stopped and deallocated, provided that the VM size supports NVMe.

### Azure portal View

1. Add Disk Controller Filter. To find the NVMe eligible sizes, select **See All Sizes**, select the **Disk Controller** filter, and then select **NVMe**:

   :::image type="content" source="./media/enable-nvme/azure-portal-1.png" alt-text="Screenshot of instructions to add disk controller filter for NVMe interface.":::

1. Enable NVMe feature by visiting the **Advanced** tab.

   :::image type="content" source="./media/enable-nvme/azure-portal-2.png" alt-text="Screenshot of instructions to enable NVMe interface feature.":::

1.  Verify Feature is enabled by going to **Review and Create**.

    :::image type="content" source="./media/enable-nvme/azure-portal-3.png" alt-text="Screenshot of instructions to review and verify features enablement.":::

### Sample ARM template

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
            "diskControllerTypes": "NVME"
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

        }
```


>[!TIP]
> Use the same parameter **DiskControllerType** if you are using the PowerShell or CLI tools to launch the NVMe supported VM.

## Next steps

- [Ebsv5 and Ebdsv5](ebdsv5-ebsv5-series.md)
