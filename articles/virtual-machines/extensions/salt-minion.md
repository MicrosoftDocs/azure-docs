---
title: Salt Minion for Linux or Windows Azure VMs  
description: Install Salt Minion on Linux or Windows VMs using the VM Extension.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.custom: devx-track-arm-template, devx-track-azurecli, devx-track-terraform, linux-related-content
ms.author: gabsta
author: GabstaMSFT
ms.date: 01/24/2024
---
# Install Salt Minion on Linux or Windows VMs using the VM Extension

## Prerequisites

* A Microsoft Azure account with one (or more) Windows or Linux VMs
* A Salt Master (either on-premises or in a cloud) that can accept connections from Salt minions hosted on Azure
* The Salt Minion VM Extension requires that the target VM is connected to the internet in order to fetch Salt packages

## Supported platforms

Azure VM running any of the following supported OS:

* Ubuntu 20.04, 22.04 (x86_64)
* Debian 10, 11 (x86_64)
* Oracle Linux 7, 8, 9 (x86_64)
* RHEL 7, 8, 9 (x86_64)
* Microsoft Windows 10, 11 Pro (x86_64)
* Microsoft Windows Server 2012 R2, 2016, 2019, 2022 Datacenter (x86_64)

If you want another distro to be supported (assuming Salt [supports](https://docs.saltproject.io/salt/install-guide/en/latest/topics/salt-supported-operating-systems.html) it), an issue can be filed on [GitLab](https://gitlab.com/turtletraction-oss/azure-salt-vm-extensions/-/issues).

## Supported Salt Minion versions

* 3006 and up (onedir)

## Extension details

* Publisher name: `turtletraction.oss`
* Linux extension name: `salt-minion.linux`
* Windows extension name: `salt-minion.windows`

## Salt Minion settings

* `master_address` - Salt Master address to connect to (`localhost` by default)
* `minion_id` - Minion ID (hostname by default)
* `salt_version` - Salt Minion version to install, for example `3006.1` (`latest` by default)

## Install Salt Minion using the Azure portal

1. Select one of your VMs.
2. In the left menu click **Extensions + applications**.
3. Click **+ Add**.
4. In the gallery, type **Salt Minion** in the search bar.
5. Select the **Salt Minion** tile and click **Next**.
6. Enter configuration parameters in the provided form (see [Salt Minion settings](#salt-minion-settings)).
7. Click **Review + create**.

## Install Salt Minion using the Azure CLI

```shell
az vm extension set --resource-group my-group --vm-name vm-ubuntu22 --name salt-minion.linux --publisher turtletraction.oss --settings '{"master_address": "10.x.x.x"}'
az vm extension set --resource-group my-group --vm-name vm-windows11 --name salt-minion.windows --publisher turtletraction.oss --settings '{"master_address": "10.x.x.x"}'
```

To uninstall it:

```shell
az vm extension delete --resource-group my-group --vm-name vm-ubuntu22 --name salt-minion.linux
az vm extension delete --resource-group my-group --vm-name vm-windows11 --name salt-minion.windows
```

## Install Salt Minion using the Azure ARM template

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "string"
        },
        "master_address": {
            "type": "string"
        },
        "salt_version": {
            "type": "string"
        },
        "minion_id": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'),'/salt-minion.linux')]",
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "location": "[resourceGroup().location]",
            "apiVersion": "2015-06-15",
            "properties": {
                "publisher": "turtletraction.oss",
                "type": "salt-minion.linux",
                "typeHandlerVersion": "1.0",
                "autoUpgradeMinorVersion": true,
                "settings": {
                    "master_address": "[parameters('master_address')]",
                    "salt_version": "[parameters('salt_version')]",
                    "minion_id": "[parameters('minion_id')]"
                }
            }
        }
    ]
}
```

## Install Salt Minion using Terraform

Assuming that you have defined a VM resource in TerraForm named `vm_ubuntu`, then use something like this to install the extension on it:

```hcl
resource "azurerm_virtual_machine_extension" "vmext_ubuntu" {
  name                 = "vmext_ubuntu"
  virtual_machine_id   = azurerm_linux_virtual_machine.vm_ubuntu.id
  publisher            = "turtletraction.oss"
  type                 = "salt-minion.linux"
  type_handler_version = "1.0"

  settings = <<SETTINGS
{
  "salt_version": "3006.1",
  "master_address": "x.x.x.x",
  "minion_id": "ubuntu22"
}
SETTINGS
}
```

## Support

* For commercial support or assistance with Salt, you can visit the extension creator, [TurtleTraction](https://turtletraction.com/salt-open-support)
* The source code of this extension is available on [GitLab](https://gitlab.com/turtletraction-oss/azure-salt-vm-extensions/)
* For Azure related issues, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support
