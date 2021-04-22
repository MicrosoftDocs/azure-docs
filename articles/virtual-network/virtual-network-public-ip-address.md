---
title: Manage public IP addresses | Microsoft Docs
titleSuffix: Azure Virtual Network
description:  Manage public IP addresses.  Also learn how a public IP address is a resource with its own configurable settings.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
editor: ''
tags: azure-resource-manager

ms.assetid: bb71abaf-b2d9-4147-b607-38067a10caf6 
ms.service: virtual-network
ms.subservice: ip-services
ms.devlang: NA
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/06/2019
ms.author: kumud
---

# Manage public IP addresses

Learn about a public IP address and how to create, change, and delete one. A public IP address is a resource with its own configurable settings. Assigning a public IP address to an Azure resource that supports public IP addresses enables:
- Inbound communication from the Internet to the resource, such as Azure Virtual Machines (VM), Azure Application Gateways, Azure Load Balancers, Azure VPN Gateways, and others. You can still communicate with some resources, such as VMs, from the Internet, if a VM doesn't have a public IP address assigned to it, as long as the VM is part of a load balancer back-end pool, and the load balancer is assigned a public IP address. To determine whether a resource for a specific Azure service can be assigned a public IP address, or whether it can be communicated with through the public IP address of a different Azure resource, see the documentation for the service.
- Outbound connectivity to the Internet using a predictable IP address. For example, a virtual machine can communicate outbound to the Internet without a public IP address assigned to it, but its address is network address translated by Azure to an unpredictable public address, by default. Assigning a public IP address to a resource enables you to know which IP address is used for the outbound connection. Though predictable, the address can change, depending on the assignment method chosen. For more information, see [Create a public IP address](#create-a-public-ip-address). To learn more about outbound connections from Azure resources, see [Understand outbound connections](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Before you begin

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Complete the following tasks before completing steps in any section of this article:

- If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using the portal, open https://portal.azure.com, and log in with your Azure account.
- If using PowerShell commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or by running PowerShell from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. This tutorial requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.
- If using Azure Command-line interface (CLI) commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash), or by running the CLI from your computer. This tutorial requires the Azure CLI version 2.0.31 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If you are running the Azure CLI locally, you also need to run `az login` to create a connection with Azure.

The account you log into, or connect to Azure with, must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the appropriate actions listed in [Permissions](#permissions).

Public IP addresses have a nominal charge. To view the pricing, read the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page.

## Create a public IP address

For instructions on how to Create Public IP addresses using the Portal, PowerShell, or CLI -- please refer to the following pages:

 * [Create public IP addresses - portal](./create-public-ip-portal.md?tabs=option-create-public-ip-standard-zones)
 * [Create public IP addresses - PowerShell](./create-public-ip-powershell.md?tabs=option-create-public-ip-standard-zones)
 * [Create public IP addresses - Azure CLI](./create-public-ip-cli.md?tabs=option-create-public-ip-standard-zones)

>[!NOTE]
>Though the portal provides the option to create two public IP address resources (one IPv4 and one IPv6), the PowerShell and CLI commands create one resource with an address for one IP version or the other. If you want two public IP address resources, one for each IP version, you must run the command twice, specifying different names and IP versions for the public IP address resources.

For additional detail on the specific attributes of a Public IP address during creation, see the table below.

   |Setting|Required?|Details|
   |---|---|---|
   |IP Version|Yes| Select IPv4 or IPv6 or Both. Selecting Both will result in 2 Public IP addresses being create- 1 IPv4 address and 1 IPv6 address. Learn more about [IPv6 in Azure VNETs](../virtual-network/ipv6-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).|
   |SKU|Yes|All public IP addresses created before the introduction of SKUs are **Basic** SKU public IP addresses. You cannot change the SKU after the public IP address is created. A standalone virtual machine, virtual machines within an availability set, or virtual machine scale sets can use Basic or Standard SKUs. Mixing SKUs between virtual machines within availability sets or scale sets or standalone VMs is not allowed. **Basic** SKU: If you are creating a public IP address in a region that supports availability zones, the **Availability zone** setting is set to *None* by default. Basic Public IPs do not support Availability zones. **Standard** SKU: A Standard SKU public IP can be associated to a virtual machine or a load balancer front end. If you're creating a public IP address in a region that supports availability zones, the **Availability zone** setting is set to *Zone-redundant* by default. For more information about availability zones, see the **Availability zone** setting. The standard SKU is required if you associate the address to a Standard load balancer. To learn more about standard load balancers, see [Azure load balancer standard SKU](../load-balancer/load-balancer-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json). When you assign a standard SKU public IP address to a virtual machine’s network interface, you must explicitly allow the intended traffic with a [network security group](./network-security-groups-overview.md#network-security-groups). Communication with the resource fails until you create and associate a network security group and explicitly allow the desired traffic.|
   |Tier|Yes|Indicates if the IP address is associated with a region (**Regional**) or is "anycast" from multiple regions (**Global**). *Note that a "Global Tier" IP is preview functionality for Standard IPs, and currently only utilized for the Cross-Region Load Balancer*.|
   |Name|Yes|The name must be unique within the resource group you select.|
   |IP address assignment|Yes|**Dynamic:** Dynamic addresses are assigned only after a public IP address is associated to an Azure resource, and the resource is started for the first time. Dynamic addresses can change if they're assigned to a resource, such as a virtual machine, and the virtual machine is stopped (deallocated), and then restarted. The address remains the same if a virtual machine is rebooted or stopped (but not deallocated). Dynamic addresses are released when a public IP address resource is dissociated from a resource it is associated to. **Static:** Static addresses are assigned when a public IP address is created. Static addresses are not released until a public IP address resource is deleted. If the address is not associated to a resource, you can change the assignment method after the address is created. If the address is associated to a resource, you may not be able to change the assignment method. If you select *IPv6* for the **IP version**, the assignment method must be *Dynamic* for Basic SKU.  Standard SKU addresses are *Static* for both IPv4 and IPv6. |
   |Idle timeout (minutes)|No|How many minutes to keep a TCP or HTTP connection open without relying on clients to send keep-alive messages. If you select IPv6 for **IP Version**, this value can't be changed. |
   |DNS name label|No|Must be unique within the Azure location you create the name in (across all subscriptions and all customers). Azure automatically registers the name and IP address in its DNS so you can connect to a resource with the name. Azure appends a default subnet such as *location.cloudapp.azure.com* (where location is the location you select) to the name you provide, to create the fully qualified DNS name. If you choose to create both address versions, the same DNS name is assigned to both the IPv4 and IPv6 addresses. Azure's default DNS contains both IPv4 A and IPv6 AAAA name records and responds with both records when the DNS name is looked up. The client chooses which address (IPv4 or IPv6) to communicate with. Instead of, or in addition to, using the DNS name label with the default suffix, you can use the Azure DNS service to configure a DNS name with a custom suffix that resolves to the public IP address. For more information, see [Use Azure DNS with an Azure public IP address](../dns/dns-custom-domain.md?toc=%2fazure%2fvirtual-network%2ftoc.json#public-ip-address).|
   |Name (Only visible if you select IP Version of **Both**)|Yes, if you select IP Version of **Both**|The name must be different than the name you enter for the first **Name** in this list. If you choose to create both an IPv4 and an IPv6 address, the portal creates two separate public IP address resources, one with each IP address version assigned to it.|
   |IP address assignment (Only visible if you select IP Version of **Both**)|Yes, if you select IP Version of **Both**|Same restrictions as IP Address Assignment above|
   |Subscription|Yes|Must exist in the same [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) as the resource to which you'll associate the Public IP's.|
   |Resource group|Yes|Can exist in the same, or different, [resource group](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group) as the resource to which you'll associate the Public IP's.|
   |Location|Yes|Must exist in the same [location](https://azure.microsoft.com/regions), also referred to as region, as the resource to which you'll associate the Public IP's.|
   |Availability zone| No | This setting only appears if you select a supported location. For a list of supported locations, see [Availability zones overview](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json). If you selected the **Basic** SKU, *None* is automatically selected for you. If you prefer to guarantee a specific zone, you may select a specific zone. Either choice is not zone-redundant. If you selected the **Standard** SKU: Zone-redundant is automatically selected for you and makes your data path resilient to zone failure. If you prefer to guarantee a specific zone, which is not resilient to zone failure, you may select a specific zone.

## View, modify settings for, or delete a public IP address

   - **View/List**: To review settings for a Public IP, including the SKU, address, any applicable association (e.g. Virtual Machine NIC, Load Balancer Frontend).
   - **Modify**: To modify settings using the information in step 4 of [create a public IP address](#create-a-public-ip-address), such as the idle timeout, DNS name label, or assignment method.  (For the full process of upgrading a Public IP SKU from Basic to Standard, see [Upgrade Azure public IP addresses](./virtual-network-public-ip-address-upgrade.md).)
   >[!WARNING]
   >To change the assignment for a Public IP address from static to dynamic, you must first dissociate the address from any applicable IP configurations (see **Delete** section).  Also note, when you change the assignment method from static to dynamic, you lose the IP address that was assigned to the public IP address. While the Azure public DNS servers maintain a mapping between static or dynamic addresses and any DNS name label (if you defined one), a dynamic IP address can change when the virtual machine is started after being in the stopped (deallocated) state. To prevent the address from changing, assign a static IP address.
   
|Operation|Azure portal|Azure PowerShell|Azure CLI|
|---|---|---|---|
|View | In the **Overview** section of a Public IP |[Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to retrieve a public IP address object and view its settings| [az network public-ip show](/cli/azure/network/public-ip#az_network_public_ip_show) to show settings|
|List | Under the **Public IP addresses** category |[Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to retrieve one or more public IP address objects and view its settings|[az network public-ip list](/cli/azure/network/public-ip#az_network_public_ip_list) to list public IP addresses|
|Modify | For an IP that is dissociated, select **Configuration** to modify idle timeout, DNS name label, or change assignment of Basic IP from Static to Dynamic  |[Set-AzPublicIpAddress](/powershell/module/az.network/set-azpublicipaddress) to update settings |[az network public-ip update](/cli/azure/network/public-ip#az_network_public_ip_update) to update |

   - **Delete**: Deletion of Public IPs requires that the Public IP object not be associated to any IP configuration or Virtual Machine NIC. See the table below for more details.

|Resource|Azure portal|Azure PowerShell|Azure CLI|
|---|---|---|---|
|[Virtual Machine](./remove-public-ip-address-vm.md)|Select **Dissociate** to dissociate the IP address from the NIC configuration, then select **Delete**.|[Set-AzPublicIpAddress](/powershell/module/az.network/set-azpublicipaddress) to dissociate the IP address from the NIC configuration; [Remove-AzPublicIpAddress](/powershell/module/az.network/remove-azpublicipaddress) to delete|[az network public-ip update --remove](/cli/azure/network/public-ip#az_network_public_ip_update) to dissociate the IP address from the NIC configuration; [az network public-ip delete](/cli/azure/network/public-ip#az_network_public_ip_delete) to delete |
|Load Balancer Frontend | Navigate to an unused Public IP address and select **Associate** and pick the Load Balancer with the relevant Front End IP Configuration to replace it (then the old IP can be deleted using same method as for VM)  | [Set-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/set-azloadbalancerfrontendipconfig) to associate new Frontend IP config with Public Load Balancer; [Remove-AzPublicIpAddress](/powershell/module/az.network/remove-azpublicipaddress) to delete; can also use [Remove-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/remove-azloadbalancerfrontendipconfig) to remove Frontend IP Config if there are more than one |[az network lb frontend-ip update](/cli/azure/network/lb/frontend-ip#az_network_lb_frontend_ip_update) to associate new Frontend IP config with Public Load Balancer; [Remove-AzPublicIpAddress](/powershell/module/az.network/remove-azpublicipaddress) to delete; can also use [az network lb frontend-ip delete](/cli/azure/network/lb/frontend-ip#az_network_lb_frontend_ip_delete) to remove Frontend IP Config if there are more than one|
|Firewall|N/A| [Deallocate()](../firewall/firewall-faq.yml#how-can-i-stop-and-start-azure-firewall) to deallocate firewall and remove all IP configurations | [az network firewall ip-config delete](/cli/azure/network/firewall/ip-config#az_network_firewall_ip_config_delete) to remove IP (but must use PowerShell to deallocate first)|

## Virtual Machine Scale Sets

When using a virtual machine scale set with Public IPs, there are not separate Public IP objects associated with the individual virtual machine instances. However, a Public IP Prefix object [can be used to generate the instance IPs](https://azure.microsoft.com/resources/templates/101-vmms-with-public-ip-prefix/).

To list the Public IPs on a virtual machine scale set, you can use PowerShell ([Get-AzPublicIpAddress -VirtualMachineScaleSetName](/powershell/module/az.network/get-azpublicipaddress)) or CLI ([az vmss list-instance-public-ips](/cli/azure/vmss#az_vmss_list_instance_public_ips)).

For more information, see [Networking for Azure virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md#public-ipv4-per-virtual-machine).

## Assign a public IP address

Learn how to assign a public IP address to the following resources:

- A [Windows](../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) Virtual Machine (when creating), or to an [existing Virtual Machine](virtual-network-network-interface-addresses.md#add-ip-addresses)
- [Public Load Balancer](../load-balancer/quickstart-load-balancer-standard-public-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Application Gateway](../application-gateway/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Site-to-site connection using a VPN Gateway](../vpn-gateway/tutorial-site-to-site-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Virtual Machine Scale Set](../virtual-machine-scale-sets/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json)

## Permissions

To perform tasks on public IP addresses, your account must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) role that is assigned the appropriate actions listed in the following table:

| Action                                                             | Name                                                           |
| ---------                                                          | -------------                                                  |
| Microsoft.Network/publicIPAddresses/read                           | Read a public IP address                                          |
| Microsoft.Network/publicIPAddresses/write                          | Create or update a public IP address                           |
| Microsoft.Network/publicIPAddresses/delete                         | Delete a public IP address                                     |
| Microsoft.Network/publicIPAddresses/join/action                    | Associate a public IP address to a resource                    |

## Next steps

- Create a public IP address using [PowerShell](powershell-samples.md) or [Azure CLI](cli-samples.md) sample scripts, or using Azure [Resource Manager templates](template-samples.md)
- Create and assign [Azure Policy definitions](./policy-reference.md) for public IP addresses
