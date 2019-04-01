---
title: Azure CLI Script Sample - Load balance traffic to VMs for high availability | Microsoft Docs
description: Azure CLI Script Sample - Load balance traffic to VMs for high availability
services: load-balancer
documentationcenter: load-balancer
author: KumudD
manager: timlt
editor: tysonn
tags: 

ms.assetid:
ms.service: load-balancer
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 07/07/2017
ms.author: kumud
---

# Load balance traffic to VMs for high availability

This script sample creates everything needed to run several Ubuntu virtual machines configured in a highly available and load balanced configuration. After running the script, you will have three virtual machines, joined to an Azure Availability Set, and accessible through an Azure Load Balancer. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/create-vm-nlb/create-vm-nlb.sh "Quick Create VM")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, availability set, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet) | Creates an Azure virtual network and subnet. |
| [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip) | Creates a public IP address with a static IP address and an associated DNS name. |
| [az network lb create](https://docs.microsoft.com/cli/azure/network/lb) | Creates an Azure load balancer. |
| [az network lb probe create](https://docs.microsoft.com/cli/azure/network/lb/probe) | Creates a load balancer probe. A load balancer probe is used to monitor each VM in the load balancer set. If any VM becomes inaccessible, traffic is not routed to the VM. |
| [az network lb rule create](https://docs.microsoft.com/cli/azure/network/lb/rule) | Creates a load balancer rule. In this sample, a rule is created for port 80. As HTTP traffic arrives at the load balancer, it is routed to port 80 one of the VMs in the LB set. |
| [az network lb inbound-nat-rule create](https://docs.microsoft.com/cli/azure/network/lb/inbound-nat-rule) | Creates load balancer Network Address Translation (NAT) rule.  NAT rules map a port of the load balancer to a port on a VM. In this sample, a NAT rule is created for SSH traffic to each VM in the load balancer set.  |
| [az network nsg create](https://docs.microsoft.com/cli/azure/network/nsg) | Creates a network security group (NSG), which is a security boundary between the internet and the virtual machine. |
| [az network nsg rule create](https://docs.microsoft.com/cli/azure/network/nsg/rule) | Creates an NSG rule to allow inbound traffic. In this sample, port 22 is opened for SSH traffic. |
| [az network nic create](https://docs.microsoft.com/cli/azure/network/nic) | Creates a virtual network card and attaches it to the virtual network, subnet, and NSG. |
| [az vm availability-set create](https://docs.microsoft.com/cli/azure/network/lb/rule) | Creates an availability set. Availability sets ensure application uptime by spreading the virtual machines across physical resources such that if failure occurs, the entire set is not effected. |
| [az vm create](/cli/azure/vm) | Creates the virtual machine and connects it to the network card, virtual network, subnet, and NSG. This command also specifies the virtual machine image to be used and administrative credentials.  |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Azure Networking CLI script samples can be found in the [Azure Networking documentation](../cli-samples.md).
