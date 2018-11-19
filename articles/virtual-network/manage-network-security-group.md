---
title: Create, change, or delete an Azure network security group | Microsoft Docs
description: Learn how to create, change, or delete a network security group.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/05/2018
ms.author: jdial
---

# Create, change, or delete a network security group

Security rules in network security groups enable you to filter the type of network traffic that can flow in and out of virtual network subnets and network interfaces. If you're not familiar with network security groups, see [Network security group overview](security-overview.md) to learn more about them and complete the [Filter network traffic](tutorial-filter-network-traffic.md) tutorial to gain some experience with network security groups.

## Before you begin

Complete the following tasks before completing steps in any section of this article:

- If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using the portal, open https://portal.azure.com, and log in with your Azure account.
- If using PowerShell commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or by running PowerShell from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. This tutorial requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable AzureRM` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.
- If using Azure Command-line interface (CLI) commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash), or by running the CLI from your computer. This tutorial requires the Azure CLI version 2.0.28 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If you are running the Azure CLI locally, you also need to run `az login` to create a connection with Azure.

The account you log into, or connect to Azure with must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the appropriate actions listed in [Permissions](#permissions).

## Work with network security groups

You can create, [view all](#view-all-network-security-groups), [view details of](#view-details-of-a-network-security-group), [change](#change-a-network-security-group), and [delete](#delete-a-network-security-group) a network security group. You can also [associate or dissociate](#associate-or-dissociate-a-network-security-group-to-or-from-a-subnet-or-network-interface) a network security group from a network interface or subnet.

### Create a network security group

There is a limit to how many network security groups you can create per Azure location and subscription. For details, see [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

1. In the top-left corner of the portal, select **+ Create a resource**.
2. Select **Networking**, then select **network security group**.
3. Enter a **Name** for the network security group, select your **Subscription**, create a new **Resource group**, or select an existing resource group, select a **Location**, and then select **Create**.

**Commands**

- Azure CLI: [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create)
- PowerShell: [New-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/new-azurermnetworksecuritygroup)

### View all network security groups

In the search box at the top of the portal, enter *network security groups*. When **network security groups** appear in the search results, select it. The network security groups that exist in your subscription are listed.

**Commands**

- Azure CLI: [az network nsg list](/cli/azure/network/nsg#az-network-nsg-list)
- PowerShell: [Get-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/get-azurermnetworksecuritygroup)

### View details of a network security group

1. In the search box at the top of the portal, enter *network security groups*. When **network security groups** appear in the search results, select it.
2. Select the network security group in the list that you want to view details for. Under **SETTINGS** you can view the **Inbound security rules** and **Outbound security rules**, the **Network interfaces** and **Subnets** the network security group is associated to. You can also enable or disable **Diagnostic logs** and view **Effective security rules**. To learn more, see [Diagnostic logs](virtual-network-nsg-manage-log.md) and [View effective security rules](diagnose-network-traffic-filter-problem.md).
3. To learn more about the common Azure settings listed, see the following articles:
	*	[Activity log](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md)
	*	[Access control (IAM)](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#access-control)
	*	[Tags](../azure-resource-manager/resource-group-using-tags.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
	*	[Locks](../azure-resource-manager/resource-group-lock-resources.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
	*	[Automation script](../azure-resource-manager/resource-manager-export-template.md?toc=%2fazure%2fvirtual-network%2ftoc.json#export-the-template-from-resource-group)

**Commands**

- Azure CLI: [az network nsg show](/cli/azure/network/nsg#az-network-nsg-show)
- PowerShell: [Get-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/get-azurermnetworksecuritygroup)

### Change a network security group

1. In the search box at the top of the portal, enter *network security groups* in the search box. When **network security groups** appear in the search results, select it.
2. Select the network security group you want to change. The most common changes are [adding](#create-a-security-rule) or [removing](#delete-a-security-rule) security rules and [Associating or dissociating a network security group to or from a subnet or network interface](#associate-or-dissociate-a-network-security-group-to-or-from-a-subnet-or-network-interface).

**Commands**

- Azure CLI: [az network nsg update](/cli/azure/network/nsg#az-network-nsg-update)
- PowerShell: [Set-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/set-azurermnetworksecuritygroup)

### Associate or dissociate a network security group to or from a subnet or network interface

To associate a network security group to, or dissociate a network security group from a network interface, see [Associate a network security group to, or dissociate a network security group from a network interface](virtual-network-network-interface.md#associate-or-dissociate-a-network-security-group). To associate a network security group to, or dissociate a network security group from a subnet, see [Change subnet settings](virtual-network-manage-subnet.md#change-subnet-settings).

### Delete a network security group

If a network security group is associated to any subnets or network interfaces, it cannot be deleted. [Dissociate](#associate-or-dissociate-a-network-security-group-to-or-from-a-resource) a network security group from all subnets and network interfaces before attempting to delete it.

1. In the search box at the top of the portal, enter *network security groups* in the search box. When **network security groups** appear in the search results, select it.
2. Select the network security group you want to delete from the list.
3. Select **Delete**, and then select **Yes**.

**Commands**

- Azure CLI: [az network nsg delete](/cli/azure/network/nsg#az-network-nsg-delete)
- PowerShell: [Remove-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/remove-azurermnetworksecuritygroup) 

## Work with security rules

A network security group contains zero or more security rules. You can create, [view all](#view-all-security-rules), [view details of](#view-details-of-a-security-rule), [change](#change-a-security-rule), and [delete](#delete-a-security-rule) a security rule.

### Create a security rule

There is a limit to how many rules per network security group can create per Azure location and subscription. For details, see [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

1. In the search box at the top of the portal, enter *network security groups* in the search box. When **network security groups** appear in the search results, select it.
2. Select the network security group from the list that you want to add a security rule to.
3. Select **Inbound security rules** under **SETTINGS**. Several existing rules are listed. Some of the rules you may not have added. When a network security group is created, several default security rules are created in it. To learn more, see [default security rules](security-overview.md#default-security-rules).  You can't delete default security rules, but you can override them with rules that have a higher priority.
4. <a name = "security-rule-settings"></a>Select **+ Add**.  Select or add values for the following settings and then select **OK**:
    
    |Setting  |Value  |Details  |
    |---------|---------|---------|
    |Source     | Select **Any**, **Application security group**, **IP Addresses**, or **Service Tag** for inbound security rules. If you're creating an outbound security rule, the options are the same as options listed for **Destination**.       | If you select **Application security group**, then select one or more existing application security groups that exist in the same region as the network interface. Learn how to [create an application security group](#create-an-application-security-group). If you select **Application security group** for both the **Source** and **Destination**, the network interfaces within both application security groups must be in the same virtual network. If you select **IP Addresses**, then specify **Source IP addresses/CIDR ranges**. You can specify a single value or comma-separated list of multiple values. An example of multiple values is 10.0.0.0/16, 192.188.1.1. There are limits to the number of values you can specify. See [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) for details. If you select **Service Tag**, then select one service tag. A service tag is a predefined identifier for a category of IP addresses. To learn more about available service tags, and what each tag represents, see [Service tags](security-overview.md#service-tags). If the IP address you specify is assigned to an Azure virtual machine, ensure that you specify the private IP, not the public IP address assigned to the virtual machine. Security rules are processed after Azure translates the public IP address to a private IP address for inbound security rules, and before Azure translates a private IP address to a public IP address for outbound rules. To learn more about public and private IP addresses in Azure, see [IP address types](virtual-network-ip-addresses-overview-arm.md).        |
    |Source port ranges     | Specify a single port, such as 80, a range of ports, such as 1024-65535, or a comma-separated list of single ports and/or port ranges, such as 80, 1024-65535. Enter an asterisk to allow traffic on any port. | The ports and ranges specify which ports traffic is allowed or denied by the rule. There are limits to the number of ports you can specify. See [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) for details.  |
    |Destination     | Select **Any**, **Application security group**, **IP addresses**, or **Virtual Network** for inbound security rules. If you're creating an outbound security rule, the options are the same as options listed for **Source**.        | If you select **Application security group** you must then select one or more existing application security groups that exist in the same region as the network interface. Learn how to [create an application security group](#create-an-application-security-group). If you select **Application security group**, then select one existing application security group that exists in the same region as the network interface. If you select **IP addresses**, then specify **Destination IP addresses/CIDR ranges**. Similar to **Source** and **Source IP addresses/CIDR ranges**, you can specify a single, or multiple addresses or ranges, and there are limits to the number you can specify. Selecting **Virtual network**, which is a service tag, means that traffic is allowed to all IP addresses within the address space of the virtual network. If the IP address you specify is assigned to an Azure virtual machine, ensure that you specify the private IP, not the public IP address assigned to the virtual machine. Security rules are processed after Azure translates the public IP address to a private IP address for inbound security rules, and before Azure translates a private IP address to a public IP address for outbound rules. To learn more about public and private IP addresses in Azure, see [IP address types](virtual-network-ip-addresses-overview-arm.md).        |
    |Destination port ranges     | Specify a single value, or comma-separated list of values. | Similar to **Source port ranges**, you can specify a single, or multiple ports and ranges, and there are limits to the number you can specify. |
    |Protocol     | Select **Any**, **TCP**, or **UDP**.        |         |
    |Action     | Select **Allow** or **Deny**.        |         |
    |Priority     | Enter a value between 100-4096 that is unique for all security rules within the network security group. |Rules are processed in priority order. The lower the number, the higher the priority. It's recommended that you leave a gap between priority numbers when creating rules, such as 100, 200, 300. Leaving gaps makes it easier to add rules in the future that you may need to make higher or lower than existing rules.         |
    |Name     | A unique name for the rule within the network security group.        |  The name can be up to 80 characters. It must begin with a letter or number, end with a letter, number, or underscore, and may contain only letters, numbers, underscores, periods, or hyphens.       |
    |Description     | An optional description.        |         |

**Commands**

- Azure CLI: [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create)
- PowerShell: [New-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/new-azurermnetworksecurityruleconfig)

### View all security rules

A network security group contains zero or multiple rules. To learn more about the information listed when viewing rules, see [Network security group overview](security-overview.md).

1. In the search box at the top of the portal, enter *network security groups*. When **network security groups** appear in the search results, select it.
2. Select the network security group from the list that you want to view rules for.
3. Select **Inbound security rules** or **Outbound security rules** under **SETTINGS**.

The list contains any rules you have created and the network security group [default security rules](security-overview.md#default-security-rules).

**Commands**

- Azure CLI: [az network nsg rule list](/cli/azure/network/nsg/rule#az-network-nsg-rule-list)
- PowerShell: [Get-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/get-azurermnetworksecurityruleconfig)

### View details of a security rule

1. In the search box at the top of the portal, enter *network security groups*. When **network security groups** appear in the search results, select it.
2. Select the network security group you want to view details of a security rule for.
3. Select **Inbound security rules** or **Outbound security rules** under **SETTINGS**.
4. Select the rule you want to view details for. For a detailed explanation of all settings, see [security rule settings](#security-rule-settings).

**Commands**

- Azure CLI: [az network nsg rule show](/cli/azure/network/nsg/rule#az-network-nsg-rule-show)
- PowerShell: [Get-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/get-azurermnetworksecurityruleconfig)

### Change a security rule

1. Complete the steps in [View details of a security rule](#view-details-of-a-security-rule).
2. Change the settings as desired, and then select **Save**. For a detailed explanation of all settings, see [security rule settings](#security-rule-settings).

**Commands**

- Azure CLI: [az network nsg rule update](/cli/azure/network/nsg/rule#az-network-nsg-rule-update)
- PowerShell: [Set-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/set-azurermnetworksecurityruleconfig)

### Delete a security rule

1. Complete the steps in [View details of a security rule](#view-details-of-a-security-rule).
2. Select **Delete**, and then select **Yes**.

**Commands**

- Azure CLI: [az network nsg rule delete](/cli/azure/network/nsg/rule#az-network-nsg-rule-delete)
- PowerShell: [Remove-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/remove-azurermnetworksecurityruleconfig)

## Work with application security groups

An application security group contains zero or more network interfaces. To learn more, see [application security groups](security-overview.md#application-security-groups). All network interfaces in an application security group must exist in the same virtual network. To learn how to add a network interface to an application security group, see [Add a network interface to an application security group](virtual-network-network-interface.md#add-to-or-remove-from-application-security-groups).

### Create an application security group

1. Select **+ Create a resource** on the upper, left corner of the Azure portal.
2. In the **Search the Marketplace** box, enter *Application security group*. When **Application security group** appears in the search results, select it, select **Application security group** again under **Everything**, and then select **Create**.
3. Enter, or select, the following information, and then select **Create**:

    | Setting        | Value                                                   |
    | ---            | ---                                                     |
    | Name           | The name must be unique within a resource group.        |
    | Subscription   | Select your subscription.                               |
    | Resource group | Select an existing resource group, or create a new one. |
    | Location       | Select a location                                       |

**Commands**

- Azure CLI: [az network asg create](/cli/azure/network/asg#az-network-asg-create)
- PowerShell: [New-AzureRmApplicationSecurityGroup](/powershell/module/azurerm.network/new-azurermapplicationsecuritygroup)

### View all application security groups

1. Select **All services** on the upper, left corner of the Azure portal.
2. Enter *application security groups* in the **All services Filter** box, and then select **Application security groups** when it appears in the search results.

**Commands**

- Azure CLI: [az network asg list](/cli/azure/network/asg#az-network-asg-list)
- PowerShell: [Get-AzureRmApplicationSecurityGroup](/powershell/module/azurerm.network/get-azurermapplicationsecuritygroup)

### View details of a specific application security group

1. Select **All services** on the upper, left corner of the Azure portal.
2. Enter *application security groups* in the **All services Filter** box, and then select **Application security groups** when it appears in the search results.
3. Select the application security group that you want to view the details of.

**Commands**

- Azure CLI: [az network asg show](/cli/azure/network/asg#az-network-asg-show)
- PowerShell: [Get-AzureRmApplicationSecurityGroup](/powershell/module/azurerm.network/get-azurermapplicationsecuritygroup)

### Change an application security group

1. Select **All services** on the upper, left corner of the Azure portal.
2. Enter *application security groups* in the **All services Filter** box, and then select **Application security groups** when it appears in the search results.
3. Select the application security group that you want to change settings for. You can add or remove tags, or assign or remove permissions to the application security group.

- Azure CLI: [az network asg update](/cli/azure/network/asg#az-network-asg-update)
- PowerShell: No PowerShell cmdlet.

### Delete an application security group

You cannot delete an application security group if it has any network interfaces in it. Remove all network interfaces from the application security group by either changing network interface settings, or deleting the network interfaces. For details, see [Add to or remove a network interface from application security groups](virtual-network-network-interface.md#add-to-or-remove-from-application-security-groups) or [delete a network interface](virtual-network-network-interface.md#delete-a-network-interface).

1. Select **All services** on the upper, left corner of the Azure portal.
2. Enter *application security groups* in the **All services Filter** box, and then select **Application security groups** when it appears in the search results.
3. Select the application security group that you want to delete.
4. Select **Delete**, and then select **Yes** to delete the application security group.

**Commands**

- Azure CLI: [az network asg delete](/cli/azure/network/asg#az-network-asg-delete)
- PowerShell: [Remove-AzureRmApplicationSecurityGroup](/powershell/module/azurerm.network/remove-azurermapplicationsecuritygroup)

## Permissions

To perform tasks on network security groups, security rules, and application security groups, your account must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the appropriate permissions listed in the following tables:

### Network security group

| Action                                                        |   Name                                                                |
|-------------------------------------------------------------- |   -------------------------------------------                         |
| Microsoft.Network/networkSecurityGroups/read                  |   Get network security group                                          |
| Microsoft.Network/networkSecurityGroups/write                 |   Create or update network security group                             |
| Microsoft.Network/networkSecurityGroups/delete                |   Delete network security group                                       |
| Microsoft.Network/networkSecurityGroups/join/action           |   Associate a network security group to a subnet or network interface 


### Network security group rule

| Action                                                        |   Name                                                                |
|-------------------------------------------------------------- |   -------------------------------------------                         |
| Microsoft.Network/networkSecurityGroups/rules/read            |   Get rule                                                            |
| Microsoft.Network/networkSecurityGroups/rules/write           |   Create or update rule                                               |
| Microsoft.Network/networkSecurityGroups/rules/delete          |   Delete rule                                                         |

### Application security group

| Action                                                                     | Name                                                     |
| --------------------------------------------------------------             | -------------------------------------------              |
| Microsoft.Network/applicationSecurityGroups/joinIpConfiguration/action     | Join an IP configuration to an application security group|
| Microsoft.Network/applicationSecurityGroups/joinNetworkSecurityRule/action | Join a security rule to an application security group    |
| Microsoft.Network/applicationSecurityGroups/read                           | Get an application security group                        |
| Microsoft.Network/applicationSecurityGroups/write                          | Create or update an application security group           |
| Microsoft.Network/applicationSecurityGroups/delete                         | Delete an application security group                     |

## Next steps

- Create a network or application security group using [PowerShell](powershell-samples.md) or [Azure CLI](cli-samples.md) sample scripts, or using Azure [Resource Manager templates](template-samples.md)
- Create and apply [Azure policy](policy-samples.md) for virtual networks
