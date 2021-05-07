---
title: Load balance multiple websites - Azure CLI - Azure Load Balancer
description: This Azure CLI script example shows how to load balance multiple websites to the same virtual machine
documentationcenter: load-balancer
author: asudbring
ms.service: load-balancer
ms.devlang: azurecli
ms.topic: sample
ms.workload: infrastructure
ms.date: 04/20/2018
ms.author: allensu 
ms.custom: devx-track-azurecli
---

# Azure CLI script example: Load balance multiple websites

This Azure CLI script sample creates a virtual network with two virtual machines (VM) that are members of an availability set. A load balancer directs traffic for two separate IP addresses to the two VMs. After running the script, you could deploy web server software to the VMs and host multiple web sites, each with its own IP address.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script


[!code-azurecli-interactive[main](../../../cli_scripts/load-balancer/load-balance-multiple-web-sites-vm/load-balance-multiple-web-sites-vm.sh  "Load balance multiple web sites")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup --yes
```

## Script explanation

This script uses the following commands to create a resource group, virtual network, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) | Creates an Azure virtual network and subnet. |
| [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) | Creates a public IP address with a static IP address and an associated DNS name. |
| [az network lb create](/cli/azure/network/lb#az_network_lb_create) | Creates an Azure Load Balancer. |
| [az network lb probe create](/cli/azure/network/lb/probe#az_network_lb_probe_create) | Creates a load balancer probe. A load balancer probe is used to monitor each VM in the load balancer set. If any VM becomes inaccessible, traffic is not routed to the VM. |
| [az network lb rule create](/cli/azure/network/lb/rule#az_network_lb_rule_create) | Creates a load balancer rule. In this sample, a rule is created for port 80. As HTTP traffic arrives at the load balancer, it is routed to port 80 one of the VMs in the load balancer set. |
| [az network lb frontend-ip create](/cli/azure/network/lb/frontend-ip#az_network_lb_frontend_ip_create) | Create a frontend IP address for the Load Balancer. |
| [az network lb address-pool create](/cli/azure/network/lb/address-pool#az_network_lb_address_pool_create) | Creates a backend address pool. |
| [az network nic create](/cli/azure/network/nic#az_network_nic_create) | Creates a virtual network card and attaches it to the virtual network, and subnet. |
| [az vm availability-set create](/cli/azure/network/lb/rule#az_network_lb_rule_create) | Creates an availability set. Availability sets ensure application uptime by spreading the virtual machines across physical resources such that if failure occurs, the entire set is not effected. |
| [az network nic ip-config create](/cli/azure/network/nic/ip-config#az_network_nic_ip_config_create) | Creates an IP configuration. You must have the Microsoft.Network/AllowMultipleIpConfigurationsPerNic feature enabled for your subscription. Only one configuration may be designated as the primary IP configuration per NIC, using the --make-primary flag. |
| [az vm create](/cli/azure/vm/availability-set#az_vm_availability_set_create) | Creates the virtual machine and connects it to the network card, virtual network, subnet, and NSG. This command also specifies the virtual machine image to be used and administrative credentials.  |
| [az group delete](/cli/azure/vm/extension#az_vm_extension_set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional networking CLI script samples can be found in the [Azure Networking Overview documentation](../cli-samples.md?toc=%2fazure%2fnetworking%2ftoc.json).