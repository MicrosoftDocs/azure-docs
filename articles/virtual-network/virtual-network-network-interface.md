---
title: Azure network interfaces and IP addresses | Microsoft Docs
description: Learn how to create, modify, and delete network interfaces and IP address configurations.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/23/2017
ms.author: jdial

---

# Network interfaces and IP addresses

Learn about network interfaces (NIC) and how to create, change, and delete them. A NIC is the interconnection between an Azure Virtual Machine (VM) and the underlying software network. The following picture illustrates the capability that a NIC provides:

![Network interface](./media/virtual-network-network-interface/nic.png)

This article explains how to work with the resources shown in the picture. Click any of the following resources to go directly to that section of the article.

- [NICs](#nics): A NIC is connected to one subnet within an Azure Virtual Network (VNet). In the picture, **VM1** has has two NICs attached to it and **VM1** has one NIC attached to it. Each NIC is connected to the same VNet, but to different subnets. This section provides steps to list existing NICs, and create, change, and delete NICs. 
- [IP configurations](#ip-configs): One or more IP configurations are associated to each NIC. Each IP configuration has a private IP address assigned to it and may have a public IP address resource associated to it. In the picture, **NIC1** and **NIC3** each have one IP configuration associated to them, while **NIC2** has two IP configurations associated to it. This section provides steps to create, change, and delete IP configurations with private IP addresses assigned using the static and dynamic assignment methods. This section also provides steps to assign public IP address resources to an IP configuration. 
- [Network security groups](#nsgs): Network security groups contain one or more inbound or outbound security rules to control the type of network traffic that can flow into and out of a network interface, a subnet, or both. In the picture, **NIC1** and **NIC3** have an NSG associated to them, whereas **NIC2** does not. This section provides steps to view the network security groups applied to a NIC, add an NSG to a NIC, and remove an NSG from a NIC.
- [Public IP address resources](#public-ips): Public IP address resources have multiple settings, one of which is a public IP address. In the picture, **icponfig1** for **NIC1** and **ipconfig1** for **NIC3** have public IP addresses assigned to them, but a public IP address resource is not associated to either of the IP configurations for **NIC2**. This section provides steps to create, change, and delete public IP address resources, including assigning public IP addresses with the static and dynamic assignment methods. 
- [VMs](#vms): A VM has at least one NIC attached to it, but can have several NICs attached to it, depending on the VM size. This section provides steps to create single and multi-NIC VMs, as well as attach and detach NICs to and from existing VMs.

If you're new to network interfaces and VMs in Azure, we recommend you complete the exercise in the [Create your first Azure Virtual Network](virtual-network-getting-started-vnets-windows.md), to familiarize yourself with VNets and VMs before reading this article. This article applies to VMs and NICs created through the Azure Resource Manager deployment model. Microsoft recommends creating resources through the Resource Manager deployment model, rather than the classic deployment model. Read the [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article if you're not familiar with the differences between the two models.

The remaining sections of this article list steps to complete all NIC-related tasks. Each section lists:
- Steps to complete the task within the Azure portal. To complete the steps you must be logged in to the [Azure portal](http://portal.azure.com). If you're using an individual account, you'll be able to complete any of the following tasks. If your account is part of an organization, ensure that your account permissions and Azure policies enable you to complete the tasks. Sign-up for a [free trial account](https://azure.microsoft.com/free) if you don't already have one.
- Commands to complete the task using Azure PowerShell with links to the command reference for the command. Install and configure PowerShell by completing the steps in the [How to Install and Configure Azure PowerShell](/powershell/azureps-cmdlets-docs?toc=%2fazure%2fvirtual-network%2ftoc.json) article. To get help for PowerShell commands, with examples, type `get-help <command> -full`.
- Commands to complete the task using the Azure Command-line interface (CLI) with links to the command reference for the command. Install the Azure CLI by completing the steps in the [How to Install and Configure the Azure CLI 2.0](/cli/azure/install-az-cli?toc=%2fazure%2fvirtual-network%2ftoc.json) article. To get help for CLI commands, type `az <command> -h`.

## <a name="work-with-nics"></a>Network interfaces
Complete the steps in the following sections to create, view, change, and delete network interfaces and settings:

### <a name="create-nic"></a>Create a network interface

To use a NIC, it must be attached to a VM, but it can exist without being attached to a VM. Read the [Attach and detach NICs to or from a virtual machine](#vms) section of this article to learn how to attach a NIC to a VM.

To create a NIC, complete the following steps:

1. Log into the [Azure portal](https://portal.azure.com) with an account that is assigned the Owner, Contributor, or Network Contributor role for your subscription. @@@ Confirm these are the correct roles @@@ Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *network interfaces*. When **network interfaces** appears in the search results, click it.
3. In the **Network interfaces** blade that appears, click **+ Add**.
4. In the **Create network interface** blade that appears, enter or select values for the following settings then click **Create**:
	
	|**Setting**|**Required?**|**Details**|
	|---|---|---|
	|**Name**|Yes|The name cannot be changed after the NIC is created. The name must be unique within the resource group you select. Read the [Naming conventions](architecture/best-practices/naming-conventions) article for naming suggestions.|
	|**Virtual network**|Yes|You can only connect a NIC to a VNet that exists in the same subscription and location as the NIC. The VM the NIC is attached to must also exist in the same location and subscription. If no VNets are listed, you need to create one. To create a VNet, complete the steps in the [Virtual network](virtual-networks-create-vnet-arm-pportal.md) article. Once a NIC is created, you cannot change the VNet it is connected to.|
	|**Subnet**|Yes|You can change the subnet the NIC is connected to after it's created.|
	|**Private IP address assignment**|Yes| A private IP address is assigned by the Azure DHCP server to the NIC when it's created. The DHCP server assigns an available address from the subnet address range defined for the subnet you connect the NIC to. **Dynamic:** Dynamic addresses can change if the VM the NIC is attached to is put into the stopped (deallocated) state. The address remains the same if the VM is rebooted or stopped (but not deallocated). **Static:** Static addresses do not change until the VM the NIC is attached to is deleted, the NIC is deleted, or the NIC is detached from a VM and assigned to a different VM. You can change the assignment method after the NIC is created.|
	|**Network security group**|No|Network security groups enable you to control the flow of network traffic in and out of a NIC. To learn more about NSGs, read the [Network security groups](virtual-networks-nsg.md) article. You can apply zero or one network security group (NSG) to a NIC. Zero or one NSG can also be applied to the subnet the NIC is connected to. When an NSG is applied to a NIC and the subnet it's connected to, sometimes unexpected results occur. To troubleshoot NSGs applied to NICs, read the [Troubleshoot NSGs](virtual-network-nsg-troubleshoot-portal.md#view-effective-security-rules-for-a-network-interface) article.|
	|**Subscription**|Yes| You can move the NIC to another subscription after you create it.|
	|**Resource group**|Yes|You can move the NIC to a different resource group after the NIC is created.|
	|**Location**|Yes|You cannot move the NIC to a different location after the NIC is created.|

The Azure portal creates a primary IP configuration named **ipconfig1** with a dynamic private IP address, and associates it to the NIC you create. To learn more about IP configurations, read the [IP configurations](#ip-configs) section of this article. You cannot specify the name of the IP configuration the portal creates, nor can you specify that a static private IP address be assigned to the IP configuration. You can specify the name of the IP configuration and the assignment method for the private IP address if you create the NIC using PowerShell or the CLI. You can also change the private IP address assignment method by completing the steps in the [Change an IP configuration](#change-ipconfig) section of this article. 

>[!Note]
> Azure assigns a MAC address to the NIC only after the NIC is attached to a VM and the VM is started the first time. You cannot specify the MAC address that Azure assigns to the NIC. The MAC address remains assigned to the NIC until the VM the NIC is attached to is deleted or the NIC is detached from the VM.

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network nic create](/cli/azure/network/nic#create)|
|**PowerShell**|[New-AzureRmNetworkInterface](/powershell/resourcemanager/azurerm.network/v3.4.0/new-azurermnetworkinterface)|

### <a name="view-nics"></a>View and change network interfaces and settings

To view and change network interfaces and settings, complete the following steps:

1. Log into the [Azure portal](https://portal.azure.com) with an account that is assigned the Owner, Contributor, or Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *network interfaces*. When **network interfaces** appears in the search results, click it.
3. In the **Network interfaces** blade that appears, click the NIC you want to view or change settings for.
4. In the blade that appears for the NIC you selected, you see the following:
	- **Overview:** Provides information about the NIC, such as the IP addresses assigned to it, the VNet/subnet the NIC is connected to, and the VM the NIC is attached to (if it's attached to one).The following picture shows the overview settings for a NIC named **mywebserver256**:
		![Network interface overview](./media/virtual-network-network-interface/nic-overview.png)
	- **IP configurations:** A NIC has at least one IP configuration assigned to it, but can have several IP configurations assigned to it. Read the Azure limits article for specific limits. Each IP configuration has one assigned private IP address, and may have one public IP address resource assigned to it. To learn about the maximum number of IP configurations supported for a NIC, read the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article. To modify what's displayed, complete the steps in the [Add a secondary IP configuration to a NIC](#create-ip-config), [Change an IP configuration](#change-ip-config), or [Delete an IP configuration](#delete-ip-config) sections of this article.
	- **DNS servers:** You can specify which DNS server a NIC is assigned by the Azure DHCP servers. Choose between the Azure internal DNS server or a custom DNS server. To modify what's displayed, complete the steps in the [Change DNS settings for a NIC](#change-dns)section of this article.
	- **Network security group (NSG):** Displays whether or not an NSG is associated to the NIC. If an NSG is associated to the NIC, the name of the associated NSG is displayed. To modify what's displayed, complete the steps in the [Associate an NSG to or disassociate an NSG from a network interface](#associate-nsg) section of this article.
	- **Properties:** Displays key settings about the NIC, to include its MAC address and the subscription it exists in. You can move a NIC to a different resource group or subscription. To move a NIC, read the [Move resource to a new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md?toc=%2fazure%2fvirtual-network%2ftoc.json#use-portal) article to learn about prerequisites, as well as how to move resources using the Azure portal, PowerShell, and the Azure CLI. @@@ Need to add requisites like the VM and VNet it's attached/connected to must also be moved at the same time @@@
	- **Effective security rules:**  If the NIC is attached to a VM, the VM is running, and an NSG is associated to the NIC, the subnet it's connected to, or both, the list displays the rules applied through the NSGs. Read the [Troubleshoot network security groups](virtual-network-nsg-troubleshoot-portal.md#view-effective-security-rules-for-a-network-interface) article to learn more about what's displayed.
	- **Effective routes:** If the NIC is attached to a VM and the VM is running, the list displays rules applied through any route tables associated to the subnet the NIC is connected to. You'll always see at least the default Azure routes listed. If user-defined routes are applied to the subnet, they're listed too. Read the [Troubleshoot routes](virtual-network-routes-troubleshoot-portal.md#view-effective-routes-for-a-network-interface) article to learn more about what's displayed. Read the [User-defined routes](virtual-networks-udr-overview.md) article to learn more about user-defined routes.
	- **Azure platform capabilities:** Read the [Activity log](../azure-resource-manager/resource-group-overview.md#activity-logs), [Access control (IAM)](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#access-control), [Tags](azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#tags), [Locks](../azure-resource-manager/resource-group-lock-resources.md?toc=%2fazure%2fvirtual-network%2ftoc.json), and [Automation script](../azure-resource-manager/resource-manager-export-template.md?toc=%2fazure%2fvirtual-network%2ftoc.json#export-the-template-from-resource-group) articles to learn more about these settings that apply to all resources deployed through the Azure Resource Manager deployment model.

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network nic list](/cli/azure/network/nic#list) to view NICs in the subscription. [az network nic show](/cli/azure/network/nic#show) to show settings for a NIC.|
|**PowerShell**|[Get-AzureRmNetworkInterface](powershell/resourcemanager/azurerm.network/v3.4.0/get-azurermnetworkinterface) to view NICs in the subscription or show settings for a NIC.|

### <a name="dns"></a>Change DNS settings for a NIC

To change the DNS settings for a NIC, complete the following steps. The DNS server is assigned to the VM by the Azure DHCP server. To learn more about name resolution settings for a NIC, read the [Name resolution for VMs](virtual-networks-name-resolution-for-vms-and-role-instances.md) article.

1. Complete steps 1-3 in the [View and change network interfaces and settings](#view-nics) section of this article for the NIC you want to change settings for.
2. In the blade for the NIC you selected, click **DNS servers**.
3. Click either:
	- **Inherit from virtual network (default)**: Choose this option to inherit the DNS server setting defined for the virtual network the NIC is connected to. At the VNet level, either a custom DNS server or the Azure-provided DNS server is defined. The Azure-provided DNS server can resolve names for resources connected to the same VNet, but not in other VNets.
	- **Custom**: Enter the IP address of the server you want to use as a DNS server. The DNS server address you specify is assigned only to this NIC and overrides any DNS setting for the VNet the NIC is connected to.
4. Click **Save**. Azure will restart the VM, and any other VMs in the same availability set, if the VM is a member of an availability set. @@@ This was not my experience. I changed the DNS from inherit to a specific IP address and the VM did not reboot. I restarted it and the VM did receive the DNS server I specified from DHCP though. @@@

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network nic update](/cli/azure/network/nic#update) with the `--set dnsSettings.dnsServers <ip-address>` argument @@@ Is this correct? I tried using a couple of IP addresses and was returned an error saying it wasn't a valid IP address (but it was valid). @@@|
|**PowerShell**|[Set-AzureRmNetworkInterface](/powershell/resourcemanager/azurerm.network/v3.4.0/set-azurermnetworkinterface) @@@ Is this correct? @@@|

### <a name="ip-forwarding"></a>Change IP forwarding for a NIC

If you have a VM with multiple NICs that you want to forward network traffic between, you must enable IP forwarding for each NIC. This is a common requirement for VMs deployed as network virtual appliances such as firewalls. The IP forwarding setting simply enables a VM to forward network traffic not destined for the NIC it's sent to. Even with IP forwarding enabled, the software running in the NVA must be able to forward packets between interfaces. You can view a list of ready to deploy NVAs in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?page=1&subcategories=appliances).

IP forwarding is typically used with user-defined routes. To learn more about user-defined routes, read the [User-defined routes](virtual-networks-udr-overview.md) article. To change IP forwarding settings for a NIC, complete the following steps :

1. Complete steps 1-3 in the [View and change network interfaces and settings](#view-nics) section of this article for the NIC you want to modify.
2. In the blade for the NIC you selected, click IP configurations
3. Click **Enabled** or **Disabled** (default setting) to change the setting.
4. Click **Save**.

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network nic update](cli/azure/network/nic#update)|
|**PowerShell**|[Set-AzureRmNetworkInterface](/powershell/resourcemanager/azurerm.network/v3.4.0/set-azurermnetworkinterface) @@@ Is this correct? @@@ |

### <a name="subnet"></a>Change the subnet a NIC is connected to

You can change the subnet, but not the VNet, that a NIC is connected to, as long as all IP configurations associated to the NIC are assigned dynamic private IP addresses. To change the subnet a NIC is connected to, complete the following steps:

1. Complete steps 1-3 in the [View and change network interfaces and settings](#view-nics) section of this article for the NIC you want to connect to a different subnet.
2. In the blade for the NIC you selected, click **IP configurations**. If any private IP addresses for any IP configurations listed have a private IP address assigned with the static method, you must first change the method to dynamic by completing the following steps. If the addresses are assigned with the dynamic method, you can skip these steps:
	- Click the static IP address for the IP configuration you want to change from the list of IP configurations.
	- In the blade that appears for the IP configuration, click **Dynamic** for the **Assignment** method.
	- Click **Save**.
3. Select the subnet you want to connect the NIC to from the **Subnet** drop-down list.
4. Click **Save**.

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network nic ip-config update](/cli/azure/network/nic/ip-config#update)|
|**PowerShell**|[Set-AzureRmNetworkInterfaceIpConfig](/powershell/resourcemanager/azurerm.network/v3.4.0/set-azurermnetworkinterfaceipconfig)|


### <a name="delete-nic"></a>Delete a network interface

You can delete a NIC as long as it's not attached to a VM. If it is attached to a VM, you must first detach it from the VM before you can delete it. To detach a NIC from a VM, complete the steps in the [Detach a NIC from a virtual machine](#vm-detach-nic) section of this article.

1. Complete steps 1-2 in the [View and change network interfaces and settings](#view-nics)section of this article for the NIC you want to delete.
2. Right-click the NIC you want to delete and click **Delete**.
3. Click **Yes** to confirm deletion of the NIC.

When you delete a NIC, any MAC or IP addresses assigned to it are released.

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network nic list](/cli/azure/network/nic#list) to view a list of NICs, [az network nic delete](cli/azure/network/nic#delete) to delete a NIC.|
|**PowerShell**|[Get-AzureRmNetworkInterface](powershell/resourcemanager/azurerm.network/v3.1.0/get-azurermnetworkinterface) to view a list of NICs and [Remove-AzureRmNetworkInterface](/powershell/resourcemanager/azurerm.network/v3.1.0/remove-azurermnetworkinterface) to delete a NIC.|

## <a name="ip-configurations"></a>IP configurations
Each NIC has at least one IP configuration, referred to as the **Primary** configuration. A NIC may also have one or more *secondary* IP configurations associated to it. Each IP configuration:
- Has one private IP address assigned to it using the static or dynamic assignment method. Dynamic IP addresses may change if a VM is started after being in the stopped (deallocated) state. Static IP addresses are only released from a NIC if the VM the NIC is attached to is deleted, the NIC is detached from a VM, or the NIC is deleted.  @@@ confirm @@@
- May have one public IP address resource associated to it.

The Azure DHCP servers assign the private IP address from the primary configuration of the NIC to the NIC within the VM operating system. 

Assigning multiple IP addresses to a NIC is helpful in scenarios such as:
- Hosting multiple websites or services with different IP addresses and SSL certificates on a single server.
- Serve as a network virtual appliance, such as a firewall or load balancer.
- The ability to add any of the private IP addresses for any of the NICs to an Azure Load Balancer back-end pool. In the past, only the primary IP address for the primary NIC could be added to a back-end pool. To learn more about how to load balance multiple IP configurations, read the [Load balancing multiple IP configurations](../load-balancer/load-balancer-multiple-ip.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article.

There is a limited amount of public IP addresses that can be used within a subscription and a limited number of private IP addresses that can be assigned to a NIC. To learn more about these limits, read the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article.

### <a name="create-ipconfig"></a>Add a secondary IP configuration to a NIC

You can add as many IP configurations as necessary to a NIC, within the limits listed in the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article. To add an IP configuration to a NIC, complete the following steps:
 
1. Complete steps 1-3 in the [View network interface settings](#view) section of this article for the NIC you want to add an IP configuration to.
2. Click **IP configurations** in the blade for the NIC you selected.
3. Click **+ Add** in the blade that opens for IP configurations.
4. Specify the following, then click **OK** to close the **Add IP configuration** blade:

	|**Setting**|**Required?**|**Details**|
	|---|---|---|
	|**Name**|Yes|Must be unique for the NIC|
	|**Type**|Yes|Since you're adding an IP configuration to an existing NIC, and each NIC must have a primary IP configuration, your only option is **Secondary**.|
	|**Private IP address assignment method**|Yes|**Dynamic** addresses are released if the VM is put into the stopped (deallocated) state, the VM is deleted, the NIC is detached from the VM, or the NIC is deleted. **Static** addresses aren't released until the VM is deleted, the NIC is detached from the VM, or the NIC is deleted. @@@ CONFIRM @@@ If you click **Static**, you must also specify an IP address from the subnet address space range that is not currently in use by another IP configuration.|
	|Public IP address|No|**Disabled:** No public IP address resource is currently associated to the IP configuration. **Enabled:** Select an existing Public IP address resource, or create a new one.|
5. You must manually add secondary IP addresses to the VM operating system by completing the instructions in the [Assign multiple IP addresses to virtual machines](virtual-network-multiple-ip-addresses-portal.md#os-config) article.

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network nic list](/cli/azure/network/nic#list) to list NICs in the subscription and [az network nic ip-config create](cli/azure/network/nic/ip-config#create) to create the IP configuration and add it to a NIC.|
|**PowerShell**|[Get-AzureRMNetworkInterface](/powershell/resourcemanager/azurerm.network/v3.4.0/get-azurermnetworkinterface) to get the NIC, [New-AzureRmNetworkInterfaceIpConfig](powershell/resourcemanager/azurerm.network/v3.4.0/new-azurermnetworkinterfaceipconfig) to create the IP configuration, [Add-AzureRmNetworkInterfaceIpConfig](/powershell/resourcemanager/azurerm.network/v3.4.0/add-azurermnetworkinterfaceipconfig) to associate the IP configuration to the NIC.|

### <a name="change-ipconfig"></a>Change an IP configuration

To change the private and public IP address settings for any primary or secondary IP configuration, complete the following steps:

1. Complete steps 1-3 in the [View network interface settings](#view) section of this article for the NIC you want to modify.
2. Click **IP configurations** in the blade for the NIC you selected.
3. Click the IP configuration you want to modify from the list in the blade that opens for IP configurations.
4. Change the settings, as desired, using the information about the settings in the [Add an IP configuration](#create-ipconfig) section of this article, then click **Save** to close the blade for the IP config you selected.
@@@
The portal tells you that making a change will restart the VM, but the VM doesn't restart. This is true whether changing the primary or a secondary configuration.
@@@


|**Tool**|**Command**|
|---|---|
|**CLI**|[az network nic list](/cli/azure/network/nic#list) to list NICs in the subscription, [az network nic ip-config list](cli/azure/network/nic/ip-config#list) to view IP configs for a NIC, and [az network nic ip-config update](cli/azure/network/nic/ip-config#update) to change an IP config.|
|**PowerShell**|[Set-AzureRMNetworkInterfaceIpConfig](/powershell/resourcemanager/azurerm.network/v3.4.0/set-azurermnetworkinterfaceipconfig)|

### <a name="delete-ipconfig"></a>Delete a secondary IP configuration from a NIC

Complete the following steps to delete a secondary IP configuration from a NIC:

1. Complete steps 1-3 in the [View network interface settings](#view) section of this article for the NIC you want to modify.
2. Click **IP configurations** in the blade for the NIC you selected.
3. Right-click the secondary IP configuration you want to delete and click **Delete**. If the configuration had a public IP address resource associated to it, the public IP address resource is not deleted, it's simply disassociated from the IP configuration.
4. Close the **IP configurations** blade.

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network nic list](/cli/azure/network/nic#list) to list NICs in a subscription, [az network nic ip-config list](cli/azure/network/nic/ip-config#list) to view IP configs for a NIC, and [az network nic ip-config delete](cli/azure/network/nic/ip-config#delete) to delete an IP configuration.|
|**PowerShell**|[Remove-AzureRmNetworkInterfaceIpConfig](/powershell/resourcemanager/azurerm.network/v3.4.0/remove-azurermnetworkinterfaceipconfig)|


## <a name="nic-nsg"></a>Network security groups
A network security group (NSG) contains a list of inbound and outbound rules that allow or deny network traffic to a NIC. An NSG can be associated to a NIC, the subnet the NIC is connected to, or both. An NSG doesn't have to be assigned to a NIC or the subnet the NIC is connected to however. To learn more about network security groups, read the [Network security groups](virtual-networks-nsg.md) article.

### <a name="associate-nsg"></a>Associate an NSG to or disassociate an NSG from a network interface

To associate an NSG to a NIC or disassociate an NSG from a NIC, complete the following steps:

1. Complete steps 1-3 in the [View and change network interfaces and settings](#view-nics) section of this article for the NIC you want to associate or disassociate an NSG to or from.
2. In the blade for the NIC you selected, click **Network security group**. A blade appears with **Edit** at the top of it. If no NSG is currently associated to the NIC, **Network security group** *None* is displayed. If an NSG is currently associated to a NIC, **Network security group** *NSG-Name* (where NSG-Name is the name of the NSG currently associated to the NIC) is displayed.
3. Click **Edit**.
4. Click **Network security group**. If no network security groups are listed, it's because none exist in your subscription. To create an NSG, complete the steps in the [Network security groups](virtual-networks-create-nsg-arm-pportal.md) article. 
5. In the **Choose network security group** blade that appears, click an existing NSG from the list to associate that NSG to the NIC, or click **None**, to disassociate an NSG currently associated to a NIC.
6. Click **Save**.

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network nic update](/cli/azure/network/nic#update)|
|**PowerShell**|[Set-AzureRmNetworkInterface](/powershell/resourcemanager/azurerm.network/v3.4.0/set-azurermnetworkinterface)] @@@ Is this correct? @@@ |


## <a name="public-ip-address-resource"></a>Public IP address resource

@@@
May break out public IP address resource tasks into a separate article, since they're used by resources other than a NIC too. Thoughts?
@@@

To communicate from the Internet to a VM, or to the Internet from a VM without network address translation (NAT), the VM must have an attached NIC that has a public IP address resource associated to one of its IP configurations. To understand how NAT works in Azure, read the [Understanding outbound connections in Azure](../load-balancer/load-balancer-outbound-connections.md) article. The resource can exist without being assigned to a NIC, but must be assigned to a NIC to be used. Azure assigns public IP addresses from unique ranges for each Azure location. To view a list of ranges for each location, download the [Microsoft Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653) document. 

Public IP addresses have a nominal charge. To view the pricing, read the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page. There are limits to the number of public IP addresses you can use within a subscription. To view the limits, read the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article. Complete the steps in the following sections to create, change, or delete public IP address resources.

### <a name="public-ip-address-resource-create"></a>Create a public IP address resource

To create a public IP address resource, complete the following steps:
1. Log into the [Azure portal](https://portal.azure.com) with an account that is assigned the Owner, Contributor, or Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *public ip address*. When **Public IP addresses** appears in the search results, click it.
3. Click **+ Add** in the **Public IP address** blade that appears.
4. Enter or select values for the following settings in the **Create public IP address** blade that appears, then click **Create**:

	|**Setting**|Required?|**Details**|
	|---|---|---|
	|**Name**|Yes|The name must be unique within the resource group you select.|
	|**IP address assignment**|Yes|**Dynamic:** Dynamic addresses are assigned only after the public IP address resource is associated to a NIC attached to a VM and the VM is started for the first time. Dynamic addresses can change if the VM the NIC is attached to is stopped (deallocated). It will remain the same if the VM is rebooted or stopped (but not deallocated). **Static:** Static addresses are assigned when the public IP address resource is created. Static addresses do not change even if the VM is put in the stopped (deallocated) state. The address is only released if the VM the NIC is attached to is deleted, the NIC is deleted, or the NIC is detached from a VM and assigned to a different VM. You can change the assignment method after the NIC is created.||
	|**Idle timeout (minutes)**|No|How many minutes to keep a TCP or HTTP connection open without relying on clients to send keep-alive messages.|
	|**DNS name label**|No|Must be unique within the Azure location you create the resource in (across all subscriptions and all customers). The Azure public DNS service automatically registers the name and IP address so you can connect to the resource with the name. Azure appends *location.cloudapp.azure.com* (where location is the location you select) to the name you provide to create the fully-qualifed DNS name. |
	|**Subscription**|Yes|Must exist in the same subscription as the resource you want to associate the public IP address to.|
	|**Resource group**|Yes|Can exist in the same, or different, resource group as the resource you want to associate the public IP address to.|
	|**Location**|Yes|Must exist in the same location as the resource you want to associate the public IP address to.|

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network public-ip-create](cli/azure/network/public-ip#create)|
|**PowerShell**|[New-AzureRmPublicIpAddress](/powershell/resourcemanager/azurerm.network/v3.4.0/new-azurermpublicipaddress)|

### <a name="public-ip-address-resource-change"></a>Change settings or delete a public IP address resource

To change or delete a public IP address resource, complete the following steps:

1. Log into the [Azure portal](https://portal.azure.com) with an account that is assigned the Owner, Contributor, or Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *public ip address*. When **Public IP addresses** appears in the search results, click it.
3. In the **Public IP addresses** blade that appears, click the name of the public IP address resource you want to change settings for or delete.
4. In the blade that appears for the public IP address resource, complete one of the following options depending on whether you want to delete or change the public IP address resource
	- **Delete:** To delete the public IP address resource, click **Delete** in the **Overview** section of the blade. The resource cannot be deleted if it's currently associated to an IP configuration. Click **Dissociate** to dissociate the resource from an IP configuration, if it's currently associated with one.
	- **Change:** Click **Configuration**. Change settings using the information in step 4 of the [Create a public IP address resource](#public-ip-address-resource-create) section of this article. To change the assignment from static to dynamic, you must first dissociate the public IP address resource from the IP configuration it's associated to. You can then change the assignment method to dynamic and click **Associate** to associate the resource to the same IP configuration, a different configuration, or you can leave it dissociated. To dissociate a public IP address resource, in the **Overview** section, click **Dissociate**.

>[!WARNING]
>When you change the assignment method from static to dynamic, you lose the IP address that was assigned to the resource. While the Azure public DNS servers maintain a mapping between static or dynamic addresses and any DNS name label (if you defined one), a dynamic IP address can change when the VM is started after being in the stopped (deallocated) state. To prevent this from happening, use a static IP address.

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network public-ip list](/cli/azure/network/public-ip#list) to list the public IP address resources in the subscription, [az network public-ip update](/cli/azure/network/public-ip#update) to change the resource, or [az network public-ip delete](/cli/azure/network/public-ip#delete) to delete a public IP address resource.|
|**PowerShell**|[Get-AzureRmPublicIpAddress](/powershell/resourcemanager/azurerm.network/v3.4.0/get-azurermpublicipaddress) to list the public IP addresses in the subscription or change one and [Remove-AzureRmPublicIpAddress](/powershell/resourcemanager/azurerm.network/v3.4.0/remove-azurermpublicipaddress) to delete a public IP address resource.|

## <a name="vms"></a>Attach and detach NICs to or from a virtual machine

You can attach an existing NIC to a VM when you create it or you can attach an existing NIC to an existing VM. You can also detach a NIC from an existing VM. Though the portal creates a NIC when you create a VM, it does not allow you to:

- Specify an existing NIC to attach when creating the VM
- Specify a name for the NIC (the portal creates the NIC with a default name)
- Specify that the private IP address assigned to the NIC be static (the portal automatically assigns a dynamic private IP address, though you can change the assignment method after the portal creates the NIC).

You can however, specify any of the previous settings, attach an existing NIC when creating a VM, or to a new VM, and detach NICs from VMs using the Azure CLI or PowerShell. Before completing the tasks in the following sections, be aware of the following constraints and behaviors:

- The VM size must support multiple NICs. To learn how many NICs each VM size supports, read the [Windows](../virtual-machines/virtual-machines-windows-sizes.md) or [Linux](../virtual-machines/virtual-machines-linux-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes articles.
- By default, the first NIC attached to a VM is defined as the *primary* NIC. You can never detach the primary NIC. All other NICs attached to the VM are secondary NICs.
- By default, all outbound traffic from the VM is sent out the primary NIC. You can of course, control which NIC is used for outbound traffic within the VM's operating system.
- In the past, VMs within the same availability set were required to all have a single, or multiple, NICs. This is no longer a requirement. VMs with any number of NICs can exist in the same availability set. A VM can only be added to an availability set when it's created though. To learn more about availability sets, read the [Manage the availability of Windows virtual machines in Azure](../virtual-machines/virtual-machines-windows-manage-availability#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article.
- While NICs can be connected to different subnets within a VNet, all NICs attached to a VM must be connected to the same VNet.

### <vm-create-windows></a>Attach a NIC when creating a Windows virtual machine

To attach an existing NIC when creating a Windows VM using PowerShell, complete the steps in the [Create a Windows VM using PowerShell](../virtual-machines/virtual-machines-windows-ps-create.md) article. To create a NIC with custom settings, skip the steps to create a NIC in the article and instead, complete the steps in the [Create a network interface](#create-nic) section of this article.

To attach multiple NICs to the VM configuration when following the steps in the article, run the `Add-AzureRmVMNetworkInterface` command once for each NIC you want to add to the VM. Add `-Primary` to the command for the NIC you want to designate as the primary NIC.

### <vm-create-linux></a>Attach a NIC when creating a Linux virtual machine

To attach an existing NIC when creating a Linux VM using the CLI, complete the steps in the [Create a Linux VM using the Azure CLI 2.0](../virtual-machines/virtual-machines-linux-quick-create-cli.md) article. To create a NIC with custom settings, skip the steps to create a NIC in the article and instead, complete the steps in the [Create a network interface](#create-nic) section of this article.

- To attach a single NIC to the VM, add the `--nics <nic-name>` parameter to the `az vm create` command in the article.
- To attach multiple NICs when creating a VM, add the `--nics <nic-name1> <nic-name2>` parameters to the `az vm create` command. The first NIC you add is automatically designated as the primary NIC.

### <vm-view-nic></a> View NICs attached to a virtual machine

1.Log into the [Azure portal](https://portal.azure.com) with an account that is assigned the Owner, Contributor, or Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual machines*. When **virtual machines** appears in the search results, click it.
3. In the **Virtual machines** blade that appears, click the name of the VM you want to view attached network interfaces for.
4. In the **Virtual machine** blade that appears for the VM you selected, click **Network interfaces**.

|**Tool**|**Command**|
|---|---|
|**CLI**|[az vm show](/cli/azure/vm#show)|
|**PowerShell**|[Get-AzureRmVM](/powershell/resourcemanager/azurerm.compute/v1.3.4/get-azurermvm)|

 
### <vm-attach-nic></a>Attach a NIC to an existing virtual machine

The VM you want to attach a NIC to must support multiple NICs and be in the stopped (deallocated) state. @@@ I tried to add a NIC to a VM that supports multiple NICs but was created with one. It fails with a message that "a vm having a single network interface cannot be updated to have multiple NICs), as expected for past behavior, but this will work soon, correct? @@@


|**Tool**|**Command**|
|---|---|
|**CLI**|[az vm show](/cli/azure/vm#show) to view NICs attached to a VM and [az vm nic add](/cli/azure/vm/nic#add) to add a NIC to a VM.|
|**PowerShell**|[Add-AzureRmVMNetworkInterface](/powershell/resourcemanager/azurerm.compute/v2.5.0/add-azurermvmnetworkinterface)|

### <vm-detach-nic></a>Detach a NIC from an existing virtual machine

The VM you want to detach a NIC from must be in the stopped (deallocated) state. You can detach any NIC, even the primary NIC, but another NIC will automatically be assigned as Primary. @@@ How is Azure deciding which one of the remaining NICs to designate as Primary? This operation succeeds currently, even when removing a NIC from a VM that only has two. This is expected future behavior, even though it's currently working for me, correct? @@@
 

|**Tool**|**Command**|
|---|---|
|**CLI**|[as vm show](/cli/azure/vm#show) to view NICs attached to a VM and [az vm nic remove](/cli/azure/vm/nic#remove) to detach a NIC from a VM.|
|**PowerShell**|[Remove-AzureRMVMNetworkInterface](powershell/resourcemanager/azurerm.compute/v2.5.0/remove-azurermvmnetworkinterface)|

## <a name="next-steps"></a>Next Steps
To create a VM with multiple NICs or IP configurations using scripts, read the following articles:

|**Task**|**Tool**|
|---|---|
|**Create a VM with multiple NICs**|[CLI](virtual-network-deploy-multinic-arm-cli) and [PowerShell](virtual-network-deploy-multinic-arm-ps.md)|
|**Create a single NIC VM with multiple IP addresses assigned to it**|[CLI](virtual-network-multiple-ip-addresses-cli.md) and [PowerShell](virtual-network-multiple-ip-addresses-powershell.md)|
