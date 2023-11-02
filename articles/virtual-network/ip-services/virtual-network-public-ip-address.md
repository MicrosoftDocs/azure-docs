---
title: Create, change, or delete an Azure public IP address
titleSuffix: Azure Virtual Network
description:  Manage public IP addresses. Learn how a public IP address is a resource with configurable settings.
services: virtual-network
ms.date: 08/24/2023
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
ms.custom: FY23 content-maintenance
---

# Create, change, or delete an Azure public IP address

>[!Important]
>On September 30, 2025, Basic SKU public IPs will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired/). If you are currently using Basic SKU public IPs, make sure to upgrade to Standard SKU public IPs prior to the retirement date. For guidance on upgrading, visit [Upgrading a basic public IP address to Standard SKU - Guidance](public-ip-basic-upgrade-guidance.md).

Learn about a public IP address and how to create, change, and delete one. A public IP address is a resource with configurable settings. 

When you assign a public IP address to an Azure resource, you enable the following operations:

- Inbound communication from the Internet to the resource, such as Azure Virtual Machines (VM), Azure Application Gateways, Azure Load Balancers, Azure VPN Gateways, and others.

- Outbound connectivity to the Internet using a predictable IP address.

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Create a public IP address

For instructions on how to create public IP addresses using the Azure portal, PowerShell, CLI, or Resource Manager templates, refer to the following pages:

* [Create a public IP address - Azure portal](./create-public-ip-portal.md?tabs=option-create-public-ip-standard-zones)
 
* [Create a public IP address - PowerShell](./create-public-ip-powershell.md?tabs=option-create-public-ip-standard-zones)
 
* [Create a public IP address - Azure CLI](./create-public-ip-cli.md?tabs=option-create-public-ip-standard-zones)
 
* [Create a public IP address - Template](./create-public-ip-template.md)

>[!NOTE]
>The portal provides the option to create an IPv4 and IPv6 address concurrently during resource deployment. The PowerShell and Azure CLI commands create one resource, either IPv4 or IPv6. If you want an IPv4 and a IPv6 address, execute the PowerShell or CLI command twice. Specify different names and IP versions for the public IP address resources.

For more detail on the specific attributes of a public IP address during creation, see the following table:

   |Setting|Required?|Details|
   |---|---|---|
   |IP Version|Yes| Select **IPv4** or **IPv6** or **Both**. Selection of **Both** results in two public IP addresses created, one IPv4 and one IPv6. For more information, [Overview of IPv6 for Azure Virtual Network](ipv6-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).|
   |SKU|Yes|All public IP addresses created before the introduction of SKUs are **Basic** SKU public IP addresses. You can't change the SKU after the public IP address is created. </br></br>A standalone virtual machine, virtual machines within an availability set, or Virtual Machine Scale Sets can use Basic or Standard SKUs. Mixing SKUs between virtual machines within availability sets or scale sets or standalone VMs isn't allowed.</br></br> **Basic**: Basic public IP addresses don't support Availability zones. The **Availability zone** setting is set to **None** by default if the public IP address is created in a region that supports availability zones. </br></br> **Standard**: Standard public IP addresses can be associated to Azure resources that support public IPs, such as virtual machines, load balancers, and Azure Firewall. The **Availability zone** setting is set to **Zone-redundant** by default if the IP address is created in a region that supports availability zones. For more information about availability zones, see the **Availability zone** setting. </br></br>The standard SKU is required if you associate the address to a standard load balancer. For more information about standard load balancers, see [Azure load balancer standard SKU](../../load-balancer/load-balancer-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json). </br></br> When you assign a standard SKU public IP address to a virtual machine's network interface, you must explicitly allow the intended traffic with a [network security group](../../virtual-network/network-security-groups-overview.md#network-security-groups). Communication with the resource fails until you create and associate a network security group and explicitly allow the desired traffic.|
   |Tier|Yes|Indicates if the IP address is associated with a region **(Regional)** or is *"anycast"* from multiple regions **(Global)**. </br></br> *A **Global tier** IP is preview functionality for Standard SKU IP addresses, and currently only utilized for the Cross-region Azure Load Balancer*.|
   |Name|Yes|The name must be unique within the resource group you select.|
   |IP address assignment|Yes|**Dynamic:** Dynamic addresses are assigned after a public IP address is associated to an Azure resource and is started for the first time. Dynamic addresses can change if a resource such as a virtual machine is stopped (deallocated) and then restarted through Azure. The address remains the same if a virtual machine is rebooted or stopped from within the guest OS. When a public IP address resource is removed from a resource, the dynamic address is released.<br></br> **Static:** Static addresses are assigned when a public IP address is created. Static addresses aren't released until a public IP address resource is deleted. <br></br> *If you select **IPv6** for the **IP version**, the assignment method must be *Dynamic* for Basic SKU.  Standard SKU addresses are *Static* for both IPv4 and IPv6.* |
  |Routing preference |Yes| By default, the routing preference for public IP addresses is set to **Microsoft network**. The **Microsoft network** setting delivers traffic over Microsoft's global wide area network to the user. </br></br> The selection of **Internet** minimizes travel on Microsoft's network. The **Internet** setting uses the transit ISP network to deliver traffic at a cost-optimized rate. A public IP addresses routing preference can’t be changed once created. For more information on routing preference, see [What is routing preference (preview)?](routing-preference-overview.md).   |
   |Idle timeout (minutes)|No| The number of minutes to keep a TCP or HTTP connection open without relying on clients to send keep-alive messages. If you select IPv6 for **IP Version**, this value is set to 4 minutes, and can't be changed. |
   |DNS name label|No|Must be unique within the Azure location you create the name in across all subscriptions and all customers. Azure automatically registers the name and IP address in its DNS so you can connect to a resource with the name. </br></br> Azure appends a default subnet such as **location.cloudapp.azure.com** to the name you provide to create the fully qualified DNS name. If you choose to create both address versions, the same DNS name is assigned to both the IPv4 and IPv6 addresses. Azure's default DNS contains both IPv4 A and IPv6 AAAA name records. </br></br> The default DNS responds with both records during DNS lookup. The client chooses which address (IPv4 or IPv6) to communicate with. You can use the Azure DNS service to configure a DNS name with a custom suffix that resolves to the public IP address. </br></br>For more information, see [Use Azure DNS with an Azure public IP address](../../dns/dns-custom-domain.md?toc=%2fazure%2fvirtual-network%2ftoc.json#public-ip-address).|
   |Name (Only visible if you select IP Version of **Both**)|Yes, if you select IP Version of **Both**|The name must be different than the name you entered previously for **Name** in this list. If you create both an IPv4 and an IPv6 address, the portal creates two separate public IP address resources. The deployment creates one IPv4 address and one IPv6 address.|
   |IP address assignment (Only visible if you select IP Version of **Both**)|Yes, if you select IP Version of **Both**| Same restrictions as IP address assignment previous. |
   |Subscription|Yes|Must exist in the same [subscription](../../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) as the resource to which you associate the public IPs.|
   |Resource group|Yes|Can exist in the same, or different, [resource group](../../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group) as the resource to which you associate the public IPs.|
   |Location|Yes|Must exist in the same [location](https://azure.microsoft.com/regions), also referred to as region, as the resource to which you associate the public IPs.|
   |Availability zone| No | This setting only appears if you select a supported location and IP address type. **Basic** SKU public IPs and **Global** Tier public IPs don't support Availability Zones. You can select no-zone (default option), a specific zone, or zone-redundant. The choice depends on your specific domain failure requirements.</br></br>For a list of supported locations and more information about Availability Zones, see [Availability zones overview](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).  

## View, modify settings for, or delete a public IP address

   - **View/List**: Review settings for a public IP, including the SKU, address, and any association. Associations can be load balancer front-ends, virtual machines, and other Azure resources.

   - **Modify**: Modify settings using the information in [create a public IP address](#create-a-public-ip-address). Settings such as the idle timeout, DNS name label, or assignment method. For the full process of upgrading a public IP SKU from basic to standard, see [Upgrade Azure public IP addresses](./public-ip-upgrade-portal.md).
   
   >[!WARNING]
   >Remove the address from any applicable IP configurations (see **Delete** section) to change assignment for a public IP from static to dynamic. When you change the assignment method from static to dynamic, you lose the IP address that was assigned to the public IP resource. While the Azure public DNS servers maintain a mapping between static or dynamic addresses and any DNS name label (if you defined one), a dynamic IP address can change when the virtual machine is started after being in the stopped (deallocated) state. To prevent the address from changing, assign a static IP address.
   
|Operation|Azure portal|Azure PowerShell|Azure CLI|
|---|---|---|---|
|View | In the **Overview** section of a Public IP |[Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to retrieve a public IP address object and view its settings| [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show) to show settings|
|List | Under the **Public IP addresses** category |[Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to retrieve one or more public IP address objects and view its settings|[az network public-ip list](/cli/azure/network/public-ip#az-network-public-ip-list) to list public IP addresses|
|Modify | For a disassociated IP, select **Configuration** to: </br> Modify idle timeout. </br> DNS name label. </br> Change assignment of an IP from static to dynamic. </br> Upgrade a basic IP to standard. |[Set-AzPublicIpAddress](/powershell/module/az.network/set-azpublicipaddress) to update settings |[az network public-ip update](/cli/azure/network/public-ip#az-network-public-ip-update) to update |

   - **Delete**: Deletion of public IPs requires that the public IP object isn't associated to any IP configuration or virtual machine network interface. For more information, see the following table.

|Resource|Azure portal|Azure PowerShell|Azure CLI|
|---|---|---|---|
|[Virtual machine](./remove-public-ip-address-vm.md)|Select **Dissociate** to dissociate the IP address from the NIC configuration, then select **Delete**.|[Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface) to dissociate the IP address from the NIC configuration; [Remove-AzPublicIpAddress](/powershell/module/az.network/remove-azpublicipaddress) to delete|[az network nic ip-config update](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-update) and with the parameter `--public-ip-address` to remove the IP address from the NIC configuration. Use [az network public-ip delete](/cli/azure/network/public-ip#az-network-public-ip-delete) to delete the public IP. |
|Load balancer frontend | Browse to an unused public IP address and select **Associate**. Pick the load balancer with the relevant front-end IP configuration to replace the IP. The old IP can be deleted using the same method as a virtual machine.  | Use [Set-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/set-azloadbalancerfrontendipconfig) to associate a new front-end IP config with a public load balancer. Use[Remove-AzPublicIpAddress](/powershell/module/az.network/remove-azpublicipaddress) to delete a public IP. You can also use [Remove-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/remove-azloadbalancerfrontendipconfig) to remove a frontend IP config if there are more than one. | Use [az network lb frontend-ip update](/cli/azure/network/lb/frontend-ip#az-network-lb-frontend-ip-update) to associate a new frontend IP config with a public load balancer. Use [Remove-AzPublicIpAddress](/powershell/module/az.network/remove-azpublicipaddress) to delete a public IP. You can also use [az network lb frontend-ip delete](/cli/azure/network/lb/frontend-ip#az-network-lb-frontend-ip-delete) to remove a frontend IP config if there are more than one. |
|Firewall|N/A| [Deallocate](../../firewall/firewall-faq.yml#how-can-i-stop-and-start-azure-firewall) to deallocate firewall and remove all IP configurations | Use [az network firewall ip-config delete](/cli/azure/network/firewall/ip-config#az-network-firewall-ip-config-delete) to remove IP. Use PowerShell to deallocate first. |

## Virtual Machine Scale Sets

There aren't separate public IP objects associated with the individual virtual machine instances for a Virtual Machine Scale Set with public IPs. A public IP prefix object [can be used to generate the instance IPs](https://azure.microsoft.com/resources/templates/vmss-with-public-ip-prefix/).

To list the Public IPs on a Virtual Machine Scale Set, you can use PowerShell ([Get-AzPublicIpAddress -VirtualMachineScaleSetName](/powershell/module/az.network/get-azpublicipaddress)) or CLI ([az Virtual Machine Scale Set list-instance-public-ips](/cli/azure/vmss#az-vmss-list-instance-public-ips)).

For more information, see [Networking for Azure Virtual Machine Scale Sets](../../virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md#public-ipv4-per-virtual-machine).

## Assign a public IP address

Learn how to assign a public IP address to the following resources:

- A [Windows](../../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) Virtual Machine on creation. Add IP to an [existing virtual machine](./virtual-network-network-interface-addresses.md#add-ip-addresses).

- [Virtual Machine Scale Set](../../virtual-machine-scale-sets/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json)

- [Public load balancer](./configure-public-ip-load-balancer.md)

- [Cross-region load balancer](../../load-balancer/tutorial-cross-region-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Application Gateway](./configure-public-ip-application-gateway.md)

- [Site-to-site connection using a VPN gateway](configure-public-ip-vpn-gateway.md)

- [NAT gateway](./configure-public-ip-nat-gateway.md)

- [Azure Bastion](./configure-public-ip-bastion.md)

- [Azure Firewall](./configure-public-ip-firewall.md)

## Region availability

Azure Public IP is available in all regions for both Public and US Gov clouds.  Azure Public IP doesn't move or store customer data out of the region it's deployed in.

## Permissions

To manage public IP addresses, your account must be assigned to the [network contributor](../../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role. A [custom](../../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) role is also supported. The custom role must be assigned the appropriate actions listed in the following table:

| Action                                                             | Name                                                           |
| ---------                                                          | -------------                                                  |
| Microsoft.Network/publicIPAddresses/read                           | Read a public IP address                                          |
| Microsoft.Network/publicIPAddresses/write                          | Create or update a public IP address                           |
| Microsoft.Network/publicIPAddresses/delete                         | Delete a public IP address                                     |
| Microsoft.Network/publicIPAddresses/join/action                    | Associate a public IP address to a resource                    |

## Next steps

Public IP addresses have a nominal charge. To view the pricing, read the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page.

- Create a public IP address using [PowerShell](../../virtual-network/powershell-samples.md) or [Azure CLI](../../virtual-network/cli-samples.md) sample scripts, or using Azure [Resource Manager templates](../../virtual-network/template-samples.md)
- Create and assign [Azure Policy definitions](../../virtual-network/policy-reference.md) for public IP addresses
