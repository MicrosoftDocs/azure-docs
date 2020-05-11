---
title: Common Azure CLI commands 
description: Learn some of the common Azure CLI commands to get you started managing your VMs in Azure Resource Manager mode
author: RicksterCDN
ms.service: virtual-machines-linux
ms.topic: article
ms.date: 05/12/2017
ms.author: rclaus

---
# Common Azure CLI commands for managing Azure resources

The Azure CLI allows you to create and manage your Azure resources on macOS, Linux, and Windows. This article details some of the most common commands to create and manage virtual machines (VMs).

This article requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). You can also use [Cloud Shell](/azure/cloud-shell/quickstart) from your browser.

## Basic Azure Resource Manager commands in Azure CLI
For more detailed help with specific command line switches and options, you can use the online command help and options by typing `az <command> <subcommand> --help`.

### Create VMs
| Task | Azure CLI commands |
| --- | --- |
| Create a resource group | `az group create --name myResourceGroup --location eastus` |
| Create a Linux VM | `az vm create --resource-group myResourceGroup --name myVM --image ubuntults` |
| Create a Windows VM | `az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter` |

### Manage VM state
| Task | Azure CLI commands |
| --- | --- |
| Start a VM | `az vm start --resource-group myResourceGroup --name myVM` |
| Stop a VM | `az vm stop --resource-group myResourceGroup --name myVM` |
| Deallocate a VM | `az vm deallocate --resource-group myResourceGroup --name myVM` |
| Restart a VM | `az vm restart --resource-group myResourceGroup --name myVM` |
| Redeploy a VM | `az vm redeploy --resource-group myResourceGroup --name myVM` |
| Delete a VM | `az vm delete --resource-group myResourceGroup --name myVM` |

### Get VM info
| Task | Azure CLI commands |
| --- | --- |
| List VMs | `az vm list` |
| Get information about a VM | `az vm show --resource-group myResourceGroup --name myVM` |
| Get usage of VM resources | `az vm list-usage --location eastus` |
| Get all available VM sizes | `az vm list-sizes --location eastus` |

## Disks and images
| Task | Azure CLI commands |
| --- | --- |
| Add a data disk to a VM | `az vm disk attach --resource-group myResourceGroup --vm-name myVM --disk myDataDisk --size-gb 128 --new` |
| Remove a data disk from a VM | `az vm disk detach --resource-group myResourceGroup --vm-name myVM --disk myDataDisk` |
| Resize a disk | `az disk update --resource-group myResourceGroup --name myDataDisk --size-gb 256` |
| Snapshot a disk | `az snapshot create --resource-group myResourceGroup --name mySnapshot --source myDataDisk` |
| Create image of a VM | `az image create --resource-group myResourceGroup --source myVM --name myImage` |
| Create VM from image | `az vm create --resource-group myResourceGroup --name myNewVM --image myImage` |


## Next steps
For additional examples of the CLI commands, see the [Create and Manage Linux VMs with the Azure CLI](tutorial-manage-vm.md) tutorial.



