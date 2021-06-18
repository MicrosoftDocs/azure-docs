---
title: Create, change, or delete an Azure network security group
titlesuffix: Azure Virtual Network
description: Learn where to find information about security rules and how to create, change, or delete a network security group.
services: virtual-network
documentationcenter: na
author: KumudD
ms.service: virtual-network

ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/13/2020
ms.author: kumud
---

# Create, change, or delete a network security group

Security rules in network security groups enable you to filter the type of network traffic that can flow in and out of virtual network subnets and network interfaces. To learn more about network security groups, see [Network security group overview](./network-security-groups-overview.md). Next, complete the [Filter network traffic](tutorial-filter-network-traffic.md) tutorial to gain some experience with network security groups.

## Before you begin

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

If you don't have one, set up an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). Complete one of these tasks before starting the remainder of this article:

- **Portal users**: Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

- **PowerShell users**: Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or run PowerShell from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. In the Azure Cloud Shell browser tab, find the **Select environment** dropdown list, then pick **PowerShell** if it isn't already selected.

    If you're running PowerShell locally, use Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az.Network` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). Run `Connect-AzAccount` to create a connection with Azure.

- **Azure Command-line interface (CLI) users**: Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash), or run the CLI from your computer. Use Azure CLI version 2.0.28 or later if you're running the Azure CLI locally. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). Run `az login` to create a connection with Azure.

The account you log into, or connect to Azure with must be assigned to the [Network contributor role](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) or to a [Custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that's assigned the appropriate actions listed in [Permissions](#permissions).

## Work with network security groups

You can create, [view all](#view-all-network-security-groups), [view details of](#view-details-of-a-network-security-group), [change](#change-a-network-security-group), and [delete](#delete-a-network-security-group) a network security group. You can also [associate or dissociate](#associate-or-dissociate-a-network-security-group-to-or-from-a-subnet-or-network-interface) a network security group from a network interface or subnet.

### Create a network security group

There's a limit to how many network security groups you can create for each Azure location and subscription. To learn more, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

1. On the [Azure portal](https://portal.azure.com) menu or from the **Home** page, select **Create a resource**.

2. Select **Networking**, then select **Network security group**.

3. In the **Create network security group** page, under the **Basics** tab, set values for the following settings:

    | Setting | Action |
    | --- | --- |
    | **Subscription** | Choose your subscription. |
    | **Resource group** | Choose an existing resource group, or select **Create new** to create a new resource group. |
    | **Name** | Enter a unique text string within a resource group. |
    | **Region** | Choose the location you want. |

4. Select **Review + create**.

5. After you see the **Validation passed** message, select **Create**.

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network nsg create](/cli/azure/network/nsg#az_network_nsg_create) |
| PowerShell | [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) |

### View all network security groups

Go to the [Azure portal](https://portal.azure.com) to view your network security groups. Search for and select **Network security groups**. The list of network security groups appears for your subscription.

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network nsg list](/cli/azure/network/nsg#az_network_nsg_list) |
| PowerShell | [Get-AzNetworkSecurityGroup](/powershell/module/az.network/get-aznetworksecuritygroup) |

### View details of a network security group

1. Go to the [Azure portal](https://portal.azure.com) to view your network security groups. Search for and select **Network security groups**.

2. Select the name of your network security group.

In the menu bar of the network security group, under **Settings**, you can view the **Inbound security rules**, **Outbound security rules**, **Network interfaces**, and **Subnets** that the network security group is associated to.

Under **Monitoring**, you can enable or disable **Diagnostic settings**. Under **Support + troubleshooting**, you can view **Effective security rules**. To learn more, see [Diagnostic logging for a network security group](virtual-network-nsg-manage-log.md) and [Diagnose a VM network traffic filter problem](diagnose-network-traffic-filter-problem.md).

To learn more about the common Azure settings listed, see the following articles:

- [Activity log](../azure-monitor/essentials/platform-logs-overview.md)
- [Access control (IAM)](../role-based-access-control/overview.md)
- [Tags](../azure-resource-manager/management/tag-resources.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Locks](../azure-resource-manager/management/lock-resources.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Automation script](../azure-resource-manager/templates/export-template-portal.md)

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network nsg show](/cli/azure/network/nsg#az_network_nsg_show) |
| PowerShell | [Get-AzNetworkSecurityGroup](/powershell/module/az.network/get-aznetworksecuritygroup) |

### Change a network security group

1. Go to the [Azure portal](https://portal.azure.com) to view your network security groups. Search for and select **Network security groups**.

2. Select the name of the network security group you want to change.

The most common changes are to [add a security rule](#create-a-security-rule), [remove a rule](#delete-a-security-rule), and [associate or dissociate a network security group to or from a subnet or network interface](#associate-or-dissociate-a-network-security-group-to-or-from-a-subnet-or-network-interface).

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network nsg update](/cli/azure/network/nsg#az_network_nsg_update) |
| PowerShell | [Set-AzNetworkSecurityGroup](/powershell/module/az.network/set-aznetworksecuritygroup) |

### Associate or dissociate a network security group to or from a subnet or network interface

To associate a network security group to, or dissociate a network security group from a network interface, see [Associate a network security group to, or dissociate a network security group from a network interface](virtual-network-network-interface.md#associate-or-dissociate-a-network-security-group). To associate a network security group to, or dissociate a network security group from a subnet, see [Change subnet settings](virtual-network-manage-subnet.md#change-subnet-settings).

### Delete a network security group

If a network security group is associated to any subnets or network interfaces, it can't be deleted. Dissociate a network security group from all subnets and network interfaces before attempting to delete it.

1. Go to the [Azure portal](https://portal.azure.com) to view your network security groups. Search for and select **Network security groups**.

2. Select the name of the network security group you want to delete.

3. In the network security group's toolbar, select **Delete**. Then select **Yes** in the confirmation dialog box.

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network nsg delete](/cli/azure/network/nsg#az_network_nsg_delete) |
| PowerShell | [Remove-AzNetworkSecurityGroup](/powershell/module/az.network/remove-aznetworksecuritygroup) |

## Work with security rules

A network security group contains zero or more security rules. You can create, [view all](#view-all-security-rules), [view details of](#view-details-of-a-security-rule), [change](#change-a-security-rule), and [delete](#delete-a-security-rule) a security rule.

### Create a security rule

There's a limit to how many rules per network security group you can create for each Azure location and subscription. To learn more, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

1. Go to the [Azure portal](https://portal.azure.com) to view your network security groups. Search for and select **Network security groups**.

2. Select the name of the network security group you want to add a security rule to.

3. In the network security group's menu bar, choose **Inbound security rules** or **Outbound security rules**.

    Several existing rules are listed, including some you may not have added. When you create a network security group, several default security rules are created in it. To learn more, see [default security rules](./network-security-groups-overview.md#default-security-rules).  You can't delete default security rules, but you can override them with rules that have a higher priority.

4. <a name="security-rule-settings"></a>Select **Add**. Select or add values for the following settings, and then select **OK**:

    | Setting | Value | Details |
    | ------- | ----- | ------- |
    | **Source** | One of:<ul><li>**Any**</li><li>**IP Addresses**</li><li>**Service Tag** (inbound security rule) or **VirtualNetwork** (outbound security rule)</li><li>**Application&nbsp;security&nbsp;group**</li></ul> | <p>If you choose **IP Addresses**, you must also specify **Source IP addresses/CIDR ranges**.</p><p>If you choose **Service Tag**, you may also pick a **Source service tag**.</p><p>If you choose **Application security group**, you must also pick an existing application security group. If you choose **Application security group** for both **Source** and **Destination**, the network interfaces within both application security groups must be in the same virtual network.</p> |
    | **Source IP addresses/CIDR ranges** | A comma-delimited list of IP addresses and Classless Interdomain Routing (CIDR) ranges | <p>This setting appears if you change **Source** to **IP Addresses**. You must specify a single value or comma-separated list of multiple values. An example of multiple values is `10.0.0.0/16, 192.188.1.1`. There are limits to the number of values you can specify. For more details, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).</p><p>If the IP address you specify is assigned to an Azure VM, specify its private IP address, not its public IP address. Azure processes security rules after it translates the public IP address to a private IP address for inbound security rules, but before it translates a private IP address to a public IP address for outbound rules. To learn more about public and private IP addresses in Azure, see [IP address types](./public-ip-addresses.md).</p> |
    | **Source service tag** | A service tag from the dropdown list | This optional setting appears if you set **Source** to **Service Tag** for an inbound security rule. A service tag is a predefined identifier for a category of IP addresses. To learn more about available service tags, and what each tag represents, see [Service tags](./network-security-groups-overview.md#service-tags). |
    | **Source application security group** | An existing application security group | This setting appears if you set **Source** to **Application security group**. Select an application security group that exists in the same region as the network interface. Learn how to [create an application security group](#create-an-application-security-group). |
    | **Source port ranges** | One of:<ul><li>A single port, such as `80`</li><li>A range of ports, such as `1024-65535`</li><li>A comma-separated list of single ports and/or port ranges, such as `80, 1024-65535`</li><li>An asterisk (`*`) to allow traffic on any port</li></ul> | This setting specifies the ports on which the rule allows or denies traffic. There are limits to the number of ports you can specify. For more details, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). |
    | **Destination** | One of:<ul><li>**Any**</li><li>**IP Addresses**</li><li>**Service Tag** (outbound security rule) or **VirtualNetwork** (inbound security rule)</li><li>**Application&nbsp;security&nbsp;group**</li></ul> | <p>If you choose **IP addresses**, then also specify **Destination IP addresses/CIDR ranges**.</p><p>If you choose **VirtualNetwork**, traffic is allowed to all IP addresses within the virtual network's address space. **VirtualNetwork** is a service tag.</p><p>If you select **Application security group**, you must then select an existing application security group. Learn how to [create an application security group](#create-an-application-security-group).</p> |
    | **Destination IP addresses/CIDR ranges** | A comma-delimited list of IP addresses and CIDR ranges | <p>This setting appears if you change **Destination** to **IP Addresses**. Similar to **Source** and **Source IP addresses/CIDR ranges**, you can specify single or multiple addresses or ranges. There are limits to the number you can specify. For more details, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).</p><p>If the IP address you specify is assigned to an Azure VM, ensure that you specify its private IP, not its public IP address. Azure processes security rules after it translates the public IP address to a private IP address for inbound security rules, but before Azure translates a private IP address to a public IP address for outbound rules. To learn more about public and private IP addresses in Azure, see [IP address types](./public-ip-addresses.md).</p> |
    | **Destination service tag** | A service tag from the dropdown list | This optional setting appears if you change **Destination** to **Service Tag** for an outbound security rule. A service tag is a predefined identifier for a category of IP addresses. To learn more about available service tags, and what each tag represents, see [Service tags](./network-security-groups-overview.md#service-tags). |
    | **Destination application security group** | An existing application security group | This setting appears if you set **Destination** to **Application security group**. Select an application security group that exists in the same region as the network interface. Learn how to [create an application security group](#create-an-application-security-group). |
    | **Destination port ranges** | One of:<ul><li>A single port, such as `80`</li><li>A range of ports, such as `1024-65535`</li><li>A comma-separated list of single ports and/or port ranges, such as `80, 1024-65535`</li><li>An asterisk (`*`) to allow traffic on any port</li></ul> | As with **Source port ranges**, you can specify single or multiple ports and ranges. There are limits to the number you can specify. For more details, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). |
    | **Protocol** | **Any**, **TCP**, **UDP**, or **ICMP** | You may restrict the rule to the Transmission Control Protocol (TCP), User Datagram Protocol (UDP), or Internet Control Message Protocol (ICMP). The default is for the rule to apply to all protocols. |
    | **Action** | **Allow** or **Deny** | This setting specifies whether this rule allows or denies access for the supplied source and destination configuration. |
    | **Priority** | A value between 100 and 4096 that's unique for all security rules within the network security group | Azure processes security rules in priority order. The lower the number, the higher the priority. We recommend that you leave a gap between priority numbers when you create rules, such as 100, 200, and 300. Leaving gaps makes it easier to add rules in the future, so that you can give them higher or lower priority than existing rules. |
    | **Name** | A unique name for the rule within the network security group | The name can be up to 80 characters. It must begin with a letter or number, and it must end with a letter, number, or underscore. The name may contain only letters, numbers, underscores, periods, or hyphens. |
    | **Description** | A text description | You may optionally specify a text description for the security rule. The description cannot be longer than 140 characters. |

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network nsg rule create](/cli/azure/network/nsg/rule#az_network_nsg_rule_create) |
| PowerShell | [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) |

### View all security rules

A network security group contains zero or more rules. To learn more about the information listed when viewing rules, see [Network security group overview](./network-security-groups-overview.md).

1. Go to the [Azure portal](https://portal.azure.com) to view the rules of a network security group. Search for and select **Network security groups**.

2. Select the name of the network security group that you want to view the rules for.

3. In the network security group's menu bar, choose **Inbound security rules** or **Outbound security rules**.

The list contains any rules you've created and the network security group's [default security rules](./network-security-groups-overview.md#default-security-rules).

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network nsg rule list](/cli/azure/network/nsg/rule#az_network_nsg_rule_list) |
| PowerShell | [Get-AzNetworkSecurityRuleConfig](/powershell/module/az.network/get-aznetworksecurityruleconfig) |

### View details of a security rule

1. Go to the [Azure portal](https://portal.azure.com) to view the rules of a network security group. Search for and select **Network security groups**.

2. Select the name of the network security group that you want to view the details of a rule for.

3. In the network security group's menu bar, choose **Inbound security rules** or **Outbound security rules**.

4. Select the rule you want to view details for. For an explanation of all settings, see [Security rule settings](#security-rule-settings).

    > [!NOTE]
    > This procedure only applies to a custom security rule. It doesn't work if you choose a default security rule.

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network nsg rule show](/cli/azure/network/nsg/rule#az_network_nsg_rule_show) |
| PowerShell | [Get-AzNetworkSecurityRuleConfig](/powershell/module/az.network/get-aznetworksecurityruleconfig) |

### Change a security rule

1. Complete the steps in [View details of a security rule](#view-details-of-a-security-rule).

2. Change the settings as needed, and then select **Save**. For an explanation of all settings, see [Security rule settings](#security-rule-settings).

    > [!NOTE]
    > This procedure only applies to a custom security rule. You aren't allowed to change a default security rule.

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network nsg rule update](/cli/azure/network/nsg/rule#az_network_nsg_rule_update) |
| PowerShell | [Set-AzNetworkSecurityRuleConfig](/powershell/module/az.network/set-aznetworksecurityruleconfig) |

### Delete a security rule

1. Complete the steps in [View details of a security rule](#view-details-of-a-security-rule).

2. Select **Delete**, and then select **Yes**.

    > [!NOTE]
    > This procedure only applies to a custom security rule. You aren't allowed to delete a default security rule.

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network nsg rule delete](/cli/azure/network/nsg/rule#az_network_nsg_rule_delete) |
| PowerShell | [Remove-AzNetworkSecurityRuleConfig](/powershell/module/az.network/remove-aznetworksecurityruleconfig) |

## Work with application security groups

An application security group contains zero or more network interfaces. To learn more, see [application security groups](./network-security-groups-overview.md#application-security-groups). All network interfaces in an application security group must exist in the same virtual network. To learn how to add a network interface to an application security group, see [Add a network interface to an application security group](virtual-network-network-interface.md#add-to-or-remove-from-application-security-groups).

### Create an application security group

1. On the [Azure portal](https://portal.azure.com) menu or from the **Home** page, select **Create a resource**.

2. In the search box, enter *Application security group*.

3. In the **Application security group** page, select **Create**.

4. In the **Create an application security group** page, under the **Basics** tab, set values for the following settings:

    | Setting | Action |
    | --- | --- |
    | **Subscription** | Choose your subscription. |
    | **Resource group** | Choose an existing resource group, or select **Create new** to create a new resource group. |
    | **Name** | Enter a unique text string within a resource group. |
    | **Region** | Choose the location you want. |

5. Select **Review + create**.

6. Under the **Review + create** tab, after you see the **Validation passed** message, select **Create**.

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network asg create](/cli/azure/network/asg#az_network_asg_create) |
| PowerShell | [New-AzApplicationSecurityGroup](/powershell/module/az.network/new-azapplicationsecuritygroup) |

### View all application security groups

Go to the [Azure portal](https://portal.azure.com) to view your application security groups. Search for and select **Application security groups**. The Azure portal displays a list of your application security groups.

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network asg list](/cli/azure/network/asg#az_network_asg_list) |
| PowerShell | [Get-AzApplicationSecurityGroup](/powershell/module/az.network/get-azapplicationsecuritygroup) |

### View details of a specific application security group

1. Go to the [Azure portal](https://portal.azure.com) to view an application security group. Search for and select **Application security groups**.

2. Select the name of the application security group that you want to view the details of.

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network asg show](/cli/azure/network/asg#az_network_asg_show) |
| PowerShell | [Get-AzApplicationSecurityGroup](/powershell/module/az.network/get-azapplicationsecuritygroup) |

### Change an application security group

1. Go to the [Azure portal](https://portal.azure.com) to view an application security group. Search for and select **Application security groups**.

2. Select the name of the application security group that you want to change.

3. Select **change** next to the setting that you want to modify. For example, you can add or remove **Tags**, or you can change the **Resource group** or **Subscription**.

    > [!NOTE]
    > You can't change the location.

    In the menu bar, you can also select **Access control (IAM)**. In the **Access control (IAM)** page, you can assign or remove permissions to the application security group.

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network asg update](/cli/azure/network/asg#az_network_asg_update) |
| PowerShell | No PowerShell cmdlet |

### Delete an application security group

You can't delete an application security group if it contains any network interfaces. To remove all network interfaces from the application security group, either change the network interface settings or delete the network interfaces. To learn more, see [Add to or remove from application security groups](virtual-network-network-interface.md#add-to-or-remove-from-application-security-groups) or [Delete a network interface](virtual-network-network-interface.md#delete-a-network-interface).

1. Go to the [Azure portal](https://portal.azure.com) to manage your application security groups. Search for and select **Application security groups**.

2. Select the name of the application security group that you want to delete.

3. Select **Delete**, and then select **Yes** to delete the application security group.

#### Commands

| Tool | Command |
| ---- | ------- |
| Azure CLI | [az network asg delete](/cli/azure/network/asg#az_network_asg_delete) |
| PowerShell | [Remove-AzApplicationSecurityGroup](/powershell/module/az.network/remove-azapplicationsecuritygroup) |

## Permissions

To do tasks on network security groups, security rules, and application security groups, your account must be assigned to the [Network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [Custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that's assigned the appropriate permissions as listed in the following tables:

### Network security group

| Action                                                        |   Name                                                                |
|-------------------------------------------------------------- |   -------------------------------------------                         |
| Microsoft.Network/networkSecurityGroups/read                  |   Get network security group                                          |
| Microsoft.Network/networkSecurityGroups/write                 |   Create or update network security group                             |
| Microsoft.Network/networkSecurityGroups/delete                |   Delete network security group                                       |
| Microsoft.Network/networkSecurityGroups/join/action           |   Associate a network security group to a subnet or network interface 


>[!NOTE]
> To perform `write` operations on a network security group, the subscription account must have at least `read` permissions for resource group along with `Microsoft.Network/networkSecurityGroups/write` permission.


### Network security group rule

| Action                                                        |   Name                                                                |
|-------------------------------------------------------------- |   -------------------------------------------                         |
| Microsoft.Network/networkSecurityGroups/securityRules/read            |   Get rule                                                            |
| Microsoft.Network/networkSecurityGroups/securityRules/write           |   Create or update rule                                               |
| Microsoft.Network/networkSecurityGroups/securityRules/delete          |   Delete rule                                                         |

### Application security group

| Action                                                                     | Name                                                     |
| --------------------------------------------------------------             | -------------------------------------------              |
| Microsoft.Network/applicationSecurityGroups/joinIpConfiguration/action     | Join an IP configuration to an application security group|
| Microsoft.Network/applicationSecurityGroups/joinNetworkSecurityRule/action | Join a security rule to an application security group    |
| Microsoft.Network/applicationSecurityGroups/read                           | Get an application security group                        |
| Microsoft.Network/applicationSecurityGroups/write                          | Create or update an application security group           |
| Microsoft.Network/applicationSecurityGroups/delete                         | Delete an application security group                     |

## Next steps

- Create a network or application security group using [PowerShell](powershell-samples.md) or [Azure CLI](cli-samples.md) sample scripts, or Azure [Resource Manager templates](template-samples.md)
- Create and assign [Azure Policy definitions](./policy-reference.md) for virtual networks
