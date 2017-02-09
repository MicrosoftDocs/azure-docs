---
title: Azure CLI Script Sample - Create a Linux VM with OMS monitoring | Microsoft Docs
description: Azure CLI Script Sample - Create a Linux VM with OMS monitoring
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 02/09/2017
ms.author: nepeters
---

# Monitor a VM with Operations Management Suite

Microsoft Operations Management Suite (OMS) is Microsoft's cloud-based IT management solution that helps you manage and protect your on-premises and cloud infrastructure. For more information about OMS, see [What is OMS](./azure/operations-management-suite/operations-management-suite-overview.md). This script creates and Azure Virtual Machine in the West Europe Azure region, installs the Operations Management Suite agent onto the virtual machine, and enrolls the system with an OMS workspace. Once the script has run, the virtual machine will be visible in the OMS console.

Before running this script, ensure that a connection with Azure has been created using the `az login` command. Also, an SSH public key with the name `id_rsa.pub` must be stored in the ~/.ssh directory. Finally, the OMS workspace ID and workspace key need to be updated in the script.

## Create VM sample with OMS

[!code-azurecli[main](../../cli_scripts/virtual-machine/create-vm-monitor-oms/create-vm-monitor-oms.sh?highlight=4-5 "Quick Create VM")]

## Clean up deployment 

After the script sample has been run, the follow command can be used to remove the Resource Group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az storage account create](https://docs.microsoft.com/en-us/cli/azure/storage/account#create) | Creates a storage account. This is where the VM disk is stored. |
| [az network vnet create](https://docs.microsoft.com/en-us/cli/azure/network/vnet#create) | Creates an Azure virtual network and subnet. |
| [az network public-ip create](https://docs.microsoft.com/en-us/cli/azure/network/public-ip#create) | Creates a public IP address with a static IP address and an associated DNS name. |
| [az network nsg create](https://docs.microsoft.com/en-us/cli/azure/network/nsg#create) | Creates a network security group, which is a security boundary between the internet and the virtual machine. |
| [az network nsg rule create](https://docs.microsoft.com/en-us/cli/azure/network/nsg/rule#create) | Creates an NSG rule to allow inbound traffic. In this sample, port 22 is opened for SSH traffic. |
| [az network nic create](https://docs.microsoft.com/en-us/cli/azure/network/nic#create) | Creates a virtual network card and attaches it to the virtual network, subnet, and NSG. |
| [az vm create](https://docs.microsoft.com/en-us/cli/azure/vm#create) | Creates the virtual machine and connects it to the network card, virtual network, subnet, NSG. This command also specifies the virtual machine image to be used, and administrative credentials.  |
| [azure vm extension set](https://docs.microsoft.com/en-us/cli/azure/vm/extension#set) | Runs a VM extension against a virtual machine. In this case, the Operations Management Suite agent extension is used to install the OMS agent and enroll the VM in an OMS workspace. |
| [az group delete](https://docs.microsoft.com/en-us/cli/azure/vm/extension#set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentaiton](https://docs.microsoft.com/en-us/cli/azure/overview).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../virtual-machines-linux-cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).