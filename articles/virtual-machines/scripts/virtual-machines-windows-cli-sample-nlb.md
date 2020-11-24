---
title: Azure CLI Script Sample - Create a Windows Server 2016 VM with NLB 
description: Azure CLI Script Sample - Create a Windows Server 2016 VM with NLB 
services: virtual-machines-windows
documentationcenter: virtual-machines
author: rickstercdn
manager: gwallace

tags: 

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 02/23/2017
ms.author: rclaus 
ms.custom: devx-track-azurecli
---

# Use an Azure CLI sample script to load balance traffic between highly available virtual machines

This script sample creates everything needed to run several Ubuntu virtual machines configured in a highly available and load balanced configuration. After running the script, you will have three virtual machines, joined to an Azure Availability Set, and accessible through an Azure Load Balancer.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/create-vm-nlb/create-windows-vm-nlb.sh "Quick Create VM")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive 
az group delete --name myResourceGroup --yes
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, availability set, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az network vnet create](/cli/azure/network/vnet) | Creates an Azure virtual network and subnet. |
| [az network public-ip create](/cli/azure/network/public-ip) | Creates a public IP address with a static IP address and an associated DNS name. |
| [az network lb create](/cli/azure/network/lb) | Creates an Azure Network Load Balancer (NLB). |
| [az network lb probe create](/cli/azure/network/lb/probe) | Creates an NLB probe. An NLB probe is used to monitor each VM in the NLB set. If any VM becomes inaccessible, traffic is not routed to the VM. |
| [az network lb rule create](/cli/azure/network/lb/rule) | Creates an NLB rule. In this sample, a rule is created for port 80. As HTTP traffic arrives at the NLB, it is routed to port 80 one of the VMs in the NLB set. |
| [az network lb inbound-nat-rule create](/cli/azure/network/lb/inbound-nat-rule) | Creates an NLB Network Address Translation (NAT) rule.  NAT rules map a port of the NLB to a port on a VM. In this sample, a NAT rule is created for SSH traffic to each VM in the NLB set.  |
| [az network nsg create](/cli/azure/network/nsg) | Creates a network security group (NSG), which is a security boundary between the internet and the virtual machine. |
| [az network nsg rule create](/cli/azure/network/nsg/rule) | Creates an NSG rule to allow inbound traffic. In this sample, port 22 is opened for SSH traffic. |
| [az network nic create](/cli/azure/network/nic) | Creates a virtual network card and attaches it to the virtual network, subnet, and NSG. |
| [az vm availability-set create](/cli/azure/network/lb/rule) | Creates an availability set. Availability sets ensure application uptime by spreading the virtual machines across physical resources such that if failure occurs, the entire set is not effected. |
| [az vm create](/cli/azure/vm/availability-set) | Creates the virtual machine and connects it to the network card, virtual network, subnet, and NSG. This command also specifies the virtual machine image to be used and administrative credentials.  |
| [az group delete](/cli/azure/vm/extension) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional virtual machine CLI script samples can be found in the [Azure Windows VM documentation](../windows/cli-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
