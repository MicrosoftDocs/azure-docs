---
title: Azure boot diagnostics
description: Overview of Azure boot diagnostics and managed boot diagnostics
services: virtual-machines
ms.service: virtual-machines
author: mimckitt
ms.author: mimckitt
ms.topic: conceptual
ms.date: 11/06/2020
---

# Azure boot diagnostics

Boot diagnostics is a debugging feature for Azure virtual machines (VM) that allows diagnosis of VM boot failures. Boot diagnostics enables a user to observe the state of their VM as it is booting up by collecting serial log information and screenshots.

## Boot diagnostics storage account
When creating a VM in Azure portal, boot diagnostics is enabled by default. The recommended boot diagnostics experience is to use a managed storage account, as it yields significant performance improvements in the time to create an Azure VM. This is because an Azure managed storage account will be used, removing the time it takes to create a new user storage account to store the boot diagnostics data.

An alternative boot diagnostics experience is to use a user managed storage account. A user can either create a new storage account or use an existing one. 

> [!IMPORTANT]
> The boot diagnostics data blobs (which comprise of logs and snapshot images) are stored in a managed storage account. Customers will be charged only on used GiBs by the blobs, not on the disk's provisioned size. The snapshot meters will be used for billing of the managed storage account. Because the managed accounts are created on either Standard LRS or Standard ZRS, customers will be charged at $0.05/GB per month for the size of their diagnostic data blobs only. For more information on this pricing, see [Managed disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/). Customers will see this charge tied to their VM resource URI. 

## Boot diagnostics view
Located in the virtual machine blade, the boot diagnostics option is under the *Support and Troubleshooting* section in the Azure portal. Selecting boot diagnostics will display a screenshot and serial log information. The serial log contains kernel messaging and the screenshot is a snapshot of your VMs current state. Based on if the VM is running Windows or Linux determines what the expected screenshot would look like. For Windows, users will see a desktop background and for Linux, users will see a login prompt.

:::image type="content" source="./media/boot-diagnostics/boot-diagnostics-linux.png" alt-text="Screenshot of Linux boot diagnostics":::
:::image type="content" source="./media/boot-diagnostics/boot-diagnostics-windows.png" alt-text="Screenshot of Windows boot diagnostics":::

## Enable managed boot diagnostics 
Managed boot diagnostics can be enabled through the Azure portal, CLI and ARM Templates. Enabling through PowerShell is not yet supported. 

### Enable managed boot diagnostics using the Azure portal
When creating a VM in the Azure portal, the default setting is to have boot diagnostics enabled using a managed storage account. To view this, navigate to the *Management* tab during the VM creation. 

:::image type="content" source="./media/boot-diagnostics/managed-boot-diagnostics1.png" alt-text="Screenshot enabling managed boot diagnostics during VM creation.":::

### Enable managed boot diagnostics using CLI
Boot diagnostics with a managed storage account is supported in Azure CLI 2.12.0 and later. If you do not input a name or URI for a storage account, a managed account will be used. For more information and code samples see the [CLI documentation for boot diagnostics](https://docs.microsoft.com/cli/azure/vm/boot-diagnostics?view=azure-cli-latest&preserve-view=true).

### Enable managed boot diagnostics using Azure Resource Manager (ARM) templates
Everything after API version 2020-06-01 supports managed boot diagnostics. For more information, see [boot diagnostics instance view](https://docs.microsoft.com/rest/api/compute/virtualmachines/createorupdate#bootdiagnostics).

```ARM Template
            "name": "[parameters('virtualMachineName')]",
            "type": "Microsoft.Compute/virtualMachines",
            "apiVersion": "2020-06-01",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[concat('Microsoft.Network/networkInterfaces/', parameters('networkInterfaceName'))]"
            ],
            "properties": {
                "hardwareProfile": {
                    "vmSize": "[parameters('virtualMachineSize')]"
                },
                "storageProfile": {
                    "osDisk": {
                        "createOption": "fromImage",
                        "managedDisk": {
                            "storageAccountType": "[parameters('osDiskType')]"
                        }
                    },
                    "imageReference": {
                        "publisher": "Canonical",
                        "offer": "UbuntuServer",
                        "sku": "18.04-LTS",
                        "version": "latest"
                    }
                },
                "networkProfile": {
                    "networkInterfaces": [
                        {
                            "id": "[resourceId('Microsoft.Network/networkInterfaces', parameters('networkInterfaceName'))]"
                        }
                    ]
                },
                "osProfile": {
                    "computerName": "[parameters('virtualMachineComputerName')]",
                    "adminUsername": "[parameters('adminUsername')]",
                    "linuxConfiguration": {
                        "disablePasswordAuthentication": true
                    }
                },
                "diagnosticsProfile": {
                    "bootDiagnostics": {
                        "enabled": true
                    }
                }
            }
        }
    ],

```

## Limitations
- Boot diagnostics is only available for Azure Resource Manager VMs.
- Managed boot diagnostics does not support VMs using unmanaged OS disks.
- Boot diagnostics does not support premium storage accounts, if a premium storage account is used for boot diagnostics users will receive an `StorageAccountTypeNotSupported` error when starting the VM. 
- Managed storage accounts are supported in Resource Manager API version "2020-06-01" and later.
- Azure Serial Console is currently incompatible with a managed storage account for boot diagnostics. Learn more about [Azure Serial Console](./troubleshooting/serial-console-overview.md).
- Portal only supports the use of boot diagnostics with a managed storage account for single instance VMs.

## Next steps

Learn more about the [Azure Serial Console](./troubleshooting/serial-console-overview.md) and how to use boot diagnostics to [troubleshoot virtual machines in Azure](./troubleshooting/boot-diagnostics.md).