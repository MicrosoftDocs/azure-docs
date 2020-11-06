---
title: Azure boot diagnostics
description: Overview of Azure boot diagnostics and managed boot diagnostics
services: virtual-machines
ms.service: virtual-machines
author: mimckitt
ms.author: mimckitt
ms.topic: conceptual
ms.date: 08/04/2020
---

# Azure boot diagnostics

Boot diagnostics is a debugging feature for Azure virtual machines (VM) that allows diagnosis of VM boot failures. Boot diagnostics enables a user to observe the state of their VM as it is booting up by collecting serial log information and screenshots.

## Boot Diagnostics Storage Account
When creating a VM in Azure portal, Boot Diagnostics is enabled by default. The recommended Boot Diagnostics experience is to use a managed storage account, as it yields significant performance improvements in the time to create an Azure VM. This is because an Azure managed storage account will be used, removing the time it takes to create a new user storage account to store the boot diagnostics data.

An alternative Boot Diagnostics experience is to use a user managed storage account. A user can either create a new storage account or use an existing one. 

> [!IMPORTANT]
> Azure customers will not be charged for the storage costs associated with boot diagnostics using a managed storage account through October 2020.
>
> The boot diagnostics data blobs (which comprise of logs and snapshot images) are stored in a managed storage account. Customers will be charged only on used GiBs by the blobs, not on the disk's provisioned size. The snapshot meters will be used for billing of the managed storage account. Because the managed accounts are created on either Standard LRS or Standard ZRS, customers will be charged at $0.05/GB per month for the size of their diagnostic data blobs only. For more information on this pricing, see [Managed disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/). Customers will see this charge tied to their VM resource URI. 

## Boot diagnostics view
Located in the virtual machine blade, the boot diagnostics option is under the *Support and Troubleshooting* section in the Azure portal. Selecting boot diagnostics will display a screenshot and serial log information. The serial log contains kernel messaging and the screenshot is a snapshot of your VMs current state. Based on if the VM is running Windows or Linux determines what the expected screenshot would look like. For Windows, users will see a desktop background and for Linux, users will see a login prompt.

:::image type="content" source="./media/boot-diagnostics/boot-diagnostics-linux.png" alt-text="Screenshot of Linux boot diagnostics":::
:::image type="content" source="./media/boot-diagnostics/boot-diagnostics-windows.png" alt-text="Screenshot of Windows boot diagnostics":::

## Enable Managed Boot Diagnostics 
Boot Diagnostics can be enabled through the Azure portal, CLI and ARM Templates.

### Enable Managed Boot Diagnostics using the Azure Portal
When creating a VM in the Azure portal, the default setting is to have Boot Diagnostics enabled using a managed storage account. To view this, navigate to the Management tab during the VM creation. 

:::image type="content" source="./media/boot-diagnostics/managed-boot-diagnostics1.png" alt-text="Screenshot enabling managed boot diagnostics during VM creation.":::

### Enable Managed Boot Diagnostics using CLI
Boot Diagnostics with a managed storage account is supported in Azure CLI 2.12.0 and later. If you do not input a name or URI for a storage account, a managed account will be used. For more information and code samples see [CLI documentation for Boot Diagnostics](https://docs.microsoft.com/cli/azure/vm/boot-diagnostics?view=azure-cli-latest).

### Enable Managed Boot Diagnostics using ARM Template
Everythign after API version 2020-06-01 supports Managed Boot Diagnostics. For more information see [Boot Diagnostics Instance View](https://docs.microsoft.com/rest/api/compute/virtualmachines/createorupdate#bootdiagnostics).

```ARM Template
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
- Boot diagnostics does not support premium storage accounts, if a premium storage account is used for boot diagnostics users will receive an `StorageAccountTypeNotSupported` error when starting the VM. 
- Managed storage accounts are supported in Resource Manager API version "2020-06-01" and later.
- Azure Serial Console is currently incompatible with a managed storage account for Boot Diagnostics. Learn more about [Azure Serial Console](./troubleshooting/serial-console-overview.md).
- Boot diagnostics using a manage storage account can currently only be applied through the Azure portal. 

## Next steps

Learn more about the [Azure Serial Console](./troubleshooting/serial-console-overview.md) and how to use boot diagnostics to [troubleshoot virtual machines in Azure](./troubleshooting/boot-diagnostics.md).
