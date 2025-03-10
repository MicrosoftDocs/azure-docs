---
title: Create, change, or delete an Azure network security group
titlesuffix: Azure Virtual Network
description: Learn how to create, change, or delete an Azure network security group (NSG).
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 04/24/2023
ms.author: allensu
ms.custom: template-how-to, engagement-fy23, devx-track-azurepowershell, devx-track-azurecli
---

# Create, change, or delete a network security group

When you use security rules in network security groups (NSGs), you can filter the type of network traffic that flows in and out of virtual network subnets and network interfaces. To learn more about NSGs, see [Network security group overview](./network-security-groups-overview.md). Next, complete the [Filter network traffic](tutorial-filter-network-traffic.md) tutorial to gain some experience with NSGs.

## Prerequisites

If you don't have an Azure account with an active subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Complete one of these tasks before you start the remainder of this article:

- **Portal users**: Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.
- **PowerShell users**: Either run the commands in [Azure Cloud Shell](https://shell.azure.com/powershell) or run PowerShell locally from your computer. Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools that are preinstalled and configured to use with your account. On the Cloud Shell browser tab, find the **Select environment** dropdown list. Then select **PowerShell** if it isn't already selected.

    If you're running PowerShell locally, use Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az.Network` to find the installed version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). Run `Connect-AzAccount` to sign in to Azure.

- **Azure CLI users**: Either run the commands in [Cloud Shell](https://shell.azure.com/bash) or run the Azure CLI locally from your computer. Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools that are preinstalled and configured to use with your account. On the Cloud Shell browser tab, find the **Select environment** dropdown list. Then select **Bash** if it isn't already selected.

    If you're running the Azure CLI locally, use Azure CLI version 2.0.28 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). Run `az login` to sign in to Azure.

Assign the [Network Contributor role](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) or a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) with the appropriate [permissions](#permissions).

## Work with network security groups

You can create, [view all](#view-all-network-security-groups), [view details of](#view-details-of-a-network-security-group), [change](#change-a-network-security-group), and [delete](#delete-a-network-security-group) an NSG. You can also associate or dissociate an NSG from a [network interface](#associate-or-dissociate-a-network-security-group-to-or-from-a-network-interface) or a [subnet](#associate-or-dissociate-a-network-security-group-to-or-from-a-subnet).

### Create a network security group

The number of NSGs that you can create for each Azure region and subscription is limited. To learn more, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits).

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Network security group**. Select **Network security groups** in the search results.

1. Select **+ Create**.

1. On the **Create network security group** page, under the **Basics** tab, enter or select the following values:

    | Setting | Action |
    | --- | --- |
    | **Project details** | |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select an existing resource group, or create a new one by selecting **Create new**. This example uses the `myResourceGroup` resource group. |
    | **Instance details** | |
    | Network security group name | Enter a name for the NSG that you're creating. |
    | Region | Select the region that you want. |

1. Select **Review + create**.

1. After you see the **Validation passed** message, select **Create**.

# [**PowerShell**](#tab/network-security-group-powershell)

Use [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) to create an NSG named `myNSG` in the **East US** region. The NSG named `myNSG` is created in the existing `myResourceGroup` resource group.

```azurepowershell-interactive
New-AzNetworkSecurityGroup -Name myNSG -ResourceGroupName myResourceGroup  -Location  eastus
```

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create) to create an NSG named `myNSG` in the existing `myResourceGroup` resource group.

```azurecli-interactive
az network nsg create --resource-group MyResourceGroup --name myNSG
```

---
### View all network security groups

# [**Portal**](#tab/network-security-group-portal)

In the search box at the top of the portal, enter **Network security group**. Select **Network security groups** in the search results to see the list of NSGs in your subscription.

:::image type="content" source="./media/manage-network-security-group/view-network-security-groups.png" alt-text="Screenshot that shows the Network security groups list in the Azure portal.":::

# [**PowerShell**](#tab/network-security-group-powershell)

Use [Get-AzNetworkSecurityGroup](/powershell/module/az.network/get-aznetworksecuritygroup) to list all the NSGs in your subscription.

```azurepowershell-interactive
Get-AzNetworkSecurityGroup | format-table Name, Location, ResourceGroupName, ProvisioningState, ResourceGuid
```

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network nsg list](/cli/azure/network/nsg#az-network-nsg-list) to list all the NSGs in your subscription.

```azurecli-interactive
az network nsg list --out table
```

---
### View details of a network security group

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Network security group** and select **Network security groups** in the search results.

1. Select the name of your NSG.

   - Under **Settings**, view the **Inbound security rules**, **Outbound security rules**, **Network interfaces**, and **Subnets** to which the NSG is associated.
   - Under **Monitoring**, enable or disable **Diagnostic settings**. For more information, see [Resource logging for a network security group](virtual-network-nsg-manage-log.md).
   - Under **Help**, view **Effective security rules**. For more information, see [Diagnose a virtual machine (VM) network traffic filter problem](diagnose-network-traffic-filter-problem.md).

   :::image type="content" source="./media/manage-network-security-group/network-security-group-details-inline.png" alt-text="Screenshot that shows the Network security group page in the Azure portal." lightbox="./media/manage-network-security-group/network-security-group-details-expanded.png":::

To learn more about the common Azure settings that are listed, see the following articles:

- [Activity log](/azure/azure-monitor/essentials/platform-logs-overview)
- [Access control identity and access management (IAM)](../role-based-access-control/overview.md)
- [Tags](../azure-resource-manager/management/tag-resources.md)
- [Locks](../azure-resource-manager/management/lock-resources.md)
- [Automation script](../azure-resource-manager/templates/export-template-portal.md)

# [**PowerShell**](#tab/network-security-group-powershell)

Use [Get-AzNetworkSecurityGroup](/powershell/module/az.network/get-aznetworksecuritygroup) to view the details of an NSG.

```azurepowershell-interactive
Get-AzNetworkSecurityGroup -Name myNSG -ResourceGroupName myResourceGroup
```

To learn more about the common Azure settings that are listed, see the following articles:

- [Activity log](/azure/azure-monitor/essentials/platform-logs-overview)
- [Access control (IAM)](../role-based-access-control/overview.md)
- [Tags](../azure-resource-manager/management/tag-resources.md)
- [Locks](../azure-resource-manager/management/lock-resources.md)

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network nsg show](/cli/azure/network/nsg#az-network-nsg-show) to view the details of an NSG.

```azurecli-interactive
az network nsg show --resource-group myResourceGroup --name myNSG
```

To learn more about the common Azure settings that are listed, see the following articles:

- [Activity log](/azure/azure-monitor/essentials/platform-logs-overview)
- [Access control (IAM)](../role-based-access-control/overview.md)
- [Tags](../azure-resource-manager/management/tag-resources.md)
- [Locks](../azure-resource-manager/management/lock-resources.md)

---
### Change a network security group

The most common changes to an NSG are:

- [Associate or dissociate a network security group to or from a network interface](#associate-or-dissociate-a-network-security-group-to-or-from-a-network-interface)
- [Associate or dissociate a network security group to or from a subnet](#associate-or-dissociate-a-network-security-group-to-or-from-a-subnet)
- [Create a security rule](#create-a-security-rule)
- [Delete a security rule](#delete-a-security-rule)

### Associate or dissociate a network security group to or from a network interface

For more information about the association and dissociation of an NSG, see [Associate or dissociate a network security group](virtual-network-network-interface.md#associate-or-dissociate-a-network-security-group).

### Associate or dissociate a network security group to or from a subnet

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Network security group**. Then select **Network security groups** in the search results.

1. Select the name of your NSG, and then select **Subnets**.

   - To associate an NSG to the subnet, select **+ Associate**. Then select your virtual network and the subnet to which you want to associate the NSG. Select **OK**.

     :::image type="content" source="./media/manage-network-security-group/associate-subnet-network-security-group.png" alt-text="Screenshot that shows associating a network security group to a subnet in the Azure portal.":::

   - To dissociate an NSG from the subnet, select the three dots next to the subnet from which you want to dissociate the NSG, and then select **Dissociate**. Select **Yes**.

     :::image type="content" source="./media/manage-network-security-group/dissociate-subnet-network-security-group.png" alt-text="Screenshot that shows dissociating an NSG from a subnet in the Azure portal.":::

# [**PowerShell**](#tab/network-security-group-powershell)

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to associate or dissociate an NSG to or from a subnet.

```azurepowershell-interactive
## Place the virtual network configuration into a variable. ##
$virtualNetwork = Get-AzVirtualNetwork -Name myVNet -ResourceGroupName myResourceGroup
## Place the network security group configuration into a variable. ##
$networkSecurityGroup = Get-AzNetworkSecurityGroup -Name myNSG -ResourceGroupName myResourceGroup
## Update the subnet configuration. ##
Set-AzVirtualNetworkSubnetConfig -Name mySubnet -VirtualNetwork $virtualNetwork -AddressPrefix 10.0.0.0/24 -NetworkSecurityGroup $networkSecurityGroup
## Update the virtual network. ##
Set-AzVirtualNetwork -VirtualNetwork $virtualNetwork
```

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to associate or dissociate an NSG to or from a subnet.

```azurecli-interactive
az network vnet subnet update --resource-group myResourceGroup --vnet-name myVNet --name mySubnet --network-security-group myNSG
```

---
### Delete a network security group

If an NSG is associated to any subnets or network interfaces, it can't be deleted. Dissociate an NSG from all subnets and network interfaces before you attempt to delete it.

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Network security group**. Then select **Network security groups** in the search results.

1. Select the NSG that you want to delete.

1. Select **Delete**, and then select **Yes** in the confirmation dialog box.

    :::image type="content" source="./media/manage-network-security-group/delete-network-security-group.png" alt-text="Screenshot that shows deleting a network security group in the Azure portal.":::

# [**PowerShell**](#tab/network-security-group-powershell)

Use [Remove-AzNetworkSecurityGroup](/powershell/module/az.network/remove-aznetworksecuritygroup) to delete an NSG.

```azurepowershell-interactive
Remove-AzNetworkSecurityGroup -Name myNSG -ResourceGroupName myResourceGroup
```

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network nsg delete](/cli/azure/network/nsg#az-network-nsg-delete) to delete an NSG.

```azurecli-interactive
az network nsg delete --resource-group myResourceGroup --name myNSG
```

---
## Work with security rules

An NSG contains zero or more security rules. You can [create](#create-a-security-rule), [view all](#view-all-security-rules), [view details of](#view-the-details-of-a-security-rule), [change](#change-a-security-rule), and [delete](#delete-a-security-rule) a security rule.

### Create a security rule

The number of rules per NSG that you can create for each Azure location and subscription is limited. To learn more, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Network security group**. Then select **Network security groups** in the search results.

1. Select the name of the NSG to which you want to add a security rule.

1. Select **Inbound security rules** or **Outbound security rules**.

    Several existing rules are listed, including some that you might not have added. When you create an NSG, several default security rules are created in it. To learn more, see [Default security rules](./network-security-groups-overview.md#default-security-rules). You can't delete default security rules, but you can override them with rules that have a higher priority.

1. <a name="security-rule-settings"></a>Select **+ Add**. Select or add values for the following settings, and then select **Add**.

    | Setting | Value | Details |
    | ------- | ----- | ------- |
    | **Source** | One of:<ul><li>**Any**</li><li>**IP Addresses**</li><li>**My IP address**</li><li>**Service Tag**</li><li>**Application security group**</li></ul> | <p>If you select **IP Addresses**, you must also specify **Source IP addresses/CIDR ranges**.</p><p>If you select **Service Tag**, you must also select a **Source service tag**.</p><p>If you select **Application security group**, you must also select an existing application security group. If you select **Application security group** for both **Source** and **Destination**, the network interfaces within both application security groups must be in the same virtual network. Learn how to [create an application security group](#create-an-application-security-group).</p> |
    | **Source IP addresses/CIDR ranges** | A comma-delimited list of IP addresses and Classless Interdomain Routing (CIDR) ranges | <p>This setting appears if you set **Source** to **IP Addresses**. You must specify a single value or comma-separated list of multiple values. An example of multiple values is `10.0.0.0/16, 192.188.1.1`. The number of values that you can specify is limited. For more information, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits).</p><p>If the IP address that you specify is assigned to an Azure VM, specify its private IP address, not its public IP address. Azure processes security rules after it translates the public IP address to a private IP address for inbound security rules, but before it translates a private IP address to a public IP address for outbound rules. To learn more about IP addresses in Azure, see [Public IP addresses](./ip-services/public-ip-addresses.md) and [Private IP addresses](./ip-services/private-ip-addresses.md).</p> |
    | **Source service tag** | A service tag from the dropdown list | This setting appears if you set **Source** to **Service Tag** for a security rule. A service tag is a predefined identifier for a category of IP addresses. To learn more about available service tags, and what each tag represents, see [Service tags](../virtual-network/service-tags-overview.md). |
    | **Source application security group** | An existing application security group | This setting appears if you set **Source** to **Application security group**. Select an application security group that exists in the same region as the network interface. Learn how to [create an application security group](#create-an-application-security-group). |
    | **Source port ranges** | One of:<ul><li>A single port, such as `80`</li><li>A range of ports, such as `1024-65535`</li><li>A comma-separated list of single ports and/or port ranges, such as `80, 1024-65535`</li><li>An asterisk (`*`) to allow traffic on any port</li></ul> | This setting specifies the ports on which the rule allows or denies traffic. The number of ports that you can specify is limited. For more information, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits). |
    | **Destination** | One of:<ul><li>**Any**</li><li>**IP Addresses**</li><li>**Service Tag**</li><li>**Application security group**</li></ul> | <p>If you select **IP Addresses**, you must also specify **Destination IP addresses/CIDR ranges**.</p><p>If you select **Service Tag**, you must also select a **Destination service tag**.</p><p>If you select **Application security group**, you must also select an existing application security group. If you select **Application security group** for both **Source** and **Destination**, the network interfaces within both application security groups must be in the same virtual network. Learn how to [create an application security group](#create-an-application-security-group).</p> |
    | **Destination IP addresses/CIDR ranges** | A comma-delimited list of IP addresses and CIDR ranges | <p>This setting appears if you change **Destination** to **IP Addresses**. You can specify single or multiple addresses or ranges like you can do with **Source** and **Source IP addresses/CIDR ranges**. The number that you can specify is limited. For more information, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits).</p><p>If the IP address that you specify is assigned to an Azure VM, ensure that you specify its private IP, not its public IP address. Azure processes security rules after it translates the public IP address to a private IP address for inbound security rules, but before Azure translates a private IP address to a public IP address for outbound rules. To learn more about IP addresses in Azure, see [Public IP addresses](./ip-services/public-ip-addresses.md) and [Private IP addresses](./ip-services/private-ip-addresses.md).</p> |
    | **Destination service tag** | A service tag from the dropdown list | This setting appears if you set **Destination** to **Service Tag** for a security rule. A service tag is a predefined identifier for a category of IP addresses. To learn more about available service tags, and what each tag represents, see [Service tags](../virtual-network/service-tags-overview.md). |
    | **Destination application security group** | An existing application security group | This setting appears if you set **Destination** to **Application security group**. Select an application security group that exists in the same region as the network interface. Learn how to [create an application security group](#create-an-application-security-group). |
    | **Service** | A destination protocol from the dropdown list | This setting specifies the destination protocol and port range for the security rule. You can select a predefined service, like **RDP**, or select **Custom** and provide the port range in **Destination port ranges**. |
    | **Destination port ranges** | One of:<ul><li>A single port, such as `80`</li><li>A range of ports, such as `1024-65535`</li><li>A comma-separated list of single ports and/or port ranges, such as `80, 1024-65535`</li><li>An asterisk (`*`) to allow traffic on any port</li></ul> | As with **Source port ranges**, you can specify single or multiple ports and ranges. The number that you can specify is limited. For more information, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits). |
    | **Protocol** | **Any**, **TCP**, **UDP**, or **ICMP** | You can restrict the rule to the Transmission Control Protocol (TCP), User Datagram Protocol (UDP), or Internet Control Message Protocol (ICMP). The default is for the rule to apply to all protocols (**Any**). |
    | **Action** | **Allow** or **Deny** | This setting specifies whether this rule allows or denies access for the supplied source and destination configuration. |
    | **Priority** | A value between 100 and 4,096 that's unique for all security rules within the NSG | Azure processes security rules in priority order. The lower the number, the higher the priority. We recommend that you leave a gap between priority numbers when you create rules, such as 100, 200, and 300. Leaving gaps makes it easier to add rules in the future so that you can give them higher or lower priority than existing rules. |
    | **Name** | A unique name for the rule within the NSG | The name can be up to 80 characters. It must begin with a letter or number, and it must end with a letter, number, or underscore. The name can contain only letters, numbers, underscores, periods, or hyphens. |
    | **Description** | A text description | You can optionally specify a text description for the security rule. The description can't be longer than 140 characters. |

    :::image type="content" source="./media/manage-network-security-group/add-security-rule.png" alt-text="Screenshot that shows adding a security rule to a network security group in the Azure portal.":::

# [**PowerShell**](#tab/network-security-group-powershell)

Use [Add-AzNetworkSecurityRuleConfig](/powershell/module/az.network/add-aznetworksecurityruleconfig) to create an NSG rule.

```azurepowershell-interactive
## Place the network security group configuration into a variable. ##
$networkSecurityGroup = Get-AzNetworkSecurityGroup -Name myNSG -ResourceGroupName myResourceGroup
## Create the security rule. ##
Add-AzNetworkSecurityRuleConfig -Name RDP-rule -NetworkSecurityGroup $networkSecurityGroup `
-Description "Allow RDP" -Access Allow -Protocol Tcp -Direction Inbound -Priority 300 `
-SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 3389
## Updates the network security group. ##
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $networkSecurityGroup
```

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create) to create an NSG rule.

```azurecli-interactive
az network nsg rule create --resource-group myResourceGroup --nsg-name myNSG --name RDP-rule --priority 300 \
    --destination-address-prefixes '*' --destination-port-ranges 3389 --protocol Tcp --description "Allow RDP"
```

---
### View all security rules

An NSG contains zero or more rules. To learn more about the list of information when you view the rules, see [Security rules](./network-security-groups-overview.md#security-rules).

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Network security group**. Then select **Network security groups** in the search results.

1. Select the name of the NSG for which you want to view the rules.

1. Select **Inbound security rules** or **Outbound security rules**.

    The list contains any rules that you created and the [default security rules](./network-security-groups-overview.md#default-security-rules) of your NSG.

    :::image type="content" source="./media/manage-network-security-group/view-security-rules.png" alt-text="Screenshot that shows inbound security rules of a network security group in the Azure portal.":::

# [**PowerShell**](#tab/network-security-group-powershell)

Use [Get-AzNetworkSecurityRuleConfig](/powershell/module/az.network/get-aznetworksecurityruleconfig) to view the security rules of an NSG.

```azurepowershell-interactive
## Place the network security group configuration into a variable. ##
$networkSecurityGroup = Get-AzNetworkSecurityGroup -Name myNSG -ResourceGroupName myResourceGroup
## List security rules of the network security group in a table. ##
Get-AzNetworkSecurityRuleConfig -NetworkSecurityGroup $networkSecurityGroup | format-table Name, Protocol, Access, Priority, Direction, SourcePortRange, DestinationPortRange, SourceAddressPrefix, DestinationAddressPrefix
```

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network nsg rule list](/cli/azure/network/nsg/rule#az-network-nsg-rule-list) to view the security rules of an NSG.

```azurecli-interactive
az network nsg rule list --resource-group myResourceGroup --nsg-name myNSG
```

---
### View the details of a security rule

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Network security group**. Then select **Network security groups** in the search results.

1. Select the name of the NSG for which you want to view the rules.

1. Select **Inbound security rules** or **Outbound security rules**.

1. Select the rule for which you want to view details. For an explanation of all settings, see [Security rule settings](#security-rule-settings).

   > [!NOTE]
   > This procedure applies only to a custom security rule. It doesn't work if you choose a default security rule.

    :::image type="content" source="./media/manage-network-security-group/view-security-rule-details.png" alt-text="Screenshot that shows the details of an inbound security rule of a network security group in the Azure portal.":::

# [**PowerShell**](#tab/network-security-group-powershell)

Use [Get-AzNetworkSecurityRuleConfig](/powershell/module/az.network/get-aznetworksecurityruleconfig) to view the details of a security rule.

```azurepowershell-interactive
## Place the network security group configuration into a variable. ##
$networkSecurityGroup = Get-AzNetworkSecurityGroup -Name myNSG -ResourceGroupName myResourceGroup
## View details of the security rule. ##
Get-AzNetworkSecurityRuleConfig -Name RDP-rule -NetworkSecurityGroup $networkSecurityGroup
```

> [!NOTE]
> This procedure applies only to a custom security rule. It doesn't work if you choose a default security rule.

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network nsg rule show](/cli/azure/network/nsg/rule#az-network-nsg-rule-show) to view the details of a security rule.

```azurecli-interactive
az network nsg rule show --resource-group myResourceGroup --nsg-name myNSG --name RDP-rule
```

> [!NOTE]
> This procedure applies only to a custom security rule. It doesn't work if you choose a default security rule.

---
### Change a security rule

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Network security group**. Then select **Network security groups** in the search results.

1. Select the name of the NSG for which you want to view the rules.

1. Select **Inbound security rules** or **Outbound security rules**.

1. Select the rule that you want to change.

1. Change the settings as needed, and then select **Save**. For an explanation of all settings, see [Security rule settings](#security-rule-settings).

    :::image type="content" source="./media/manage-network-security-group/change-security-rule.png" alt-text="Screenshot that shows changing the inbound security rule details of a network security group in the Azure portal.":::

    > [!NOTE]
    > This procedure applies only to a custom security rule. You aren't allowed to change a default security rule.

# [**PowerShell**](#tab/network-security-group-powershell)

Use [Set-AzNetworkSecurityRuleConfig](/powershell/module/az.network/set-aznetworksecurityruleconfig) to update an NSG rule.

```azurepowershell-interactive
## Place the network security group configuration into a variable. ##
$networkSecurityGroup = Get-AzNetworkSecurityGroup -Name myNSG -ResourceGroupName myResourceGroup
## Make changes to the security rule. ##
Set-AzNetworkSecurityRuleConfig -Name RDP-rule -NetworkSecurityGroup $networkSecurityGroup `
-Description "Allow RDP" -Access Allow -Protocol Tcp -Direction Inbound -Priority 200 `
-SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 3389
## Updates the network security group. ##
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $networkSecurityGroup
```

> [!NOTE]
> This procedure applies only to a custom security rule. You aren't allowed to change a default security rule.

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network nsg rule update](/cli/azure/network/nsg/rule#az-network-nsg-rule-update) to update an NSG rule.

```azurecli-interactive
az network nsg rule update --resource-group myResourceGroup --nsg-name myNSG --name RDP-rule --priority 200
```

> [!NOTE]
> This procedure applies only to a custom security rule. You aren't allowed to change a default security rule.

---
### Delete a security rule

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Network security group**. Then select **Network security groups** in the search results.

1. Select the name of the NSG for which you want to view the rules.

1. Select **Inbound security rules** or **Outbound security rules**.

1. Select the rules that you want to delete.

1. Select **Delete**, and then select **Yes**.

    :::image type="content" source="./media/manage-network-security-group/delete-security-rule.png" alt-text="Screenshot that shows deleting an inbound security rule of a network security group in the Azure portal.":::

    > [!NOTE]
    > This procedure applies only to a custom security rule. You aren't allowed to delete a default security rule.

# [**PowerShell**](#tab/network-security-group-powershell)

Use [Remove-AzNetworkSecurityRuleConfig](/powershell/module/az.network/remove-aznetworksecurityruleconfig) to delete a security rule from an NSG.

```azurepowershell-interactive
## Place the network security group configuration into a variable. ##
$networkSecurityGroup = Get-AzNetworkSecurityGroup -Name myNSG -ResourceGroupName myResourceGroup
## Remove the security rule. ##
Remove-AzNetworkSecurityRuleConfig -Name RDP-rule -NetworkSecurityGroup $networkSecurityGroup
## Updates the network security group. ##
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $networkSecurityGroup
```

> [!NOTE]
> This procedure applies only to a custom security rule. You aren't allowed to change a default security rule.

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network nsg rule delete](/cli/azure/network/nsg/rule#az-network-nsg-rule-delete) to delete a security rule from an NSG.

```azurecli-interactive
az network nsg rule delete --resource-group myResourceGroup --nsg-name myNSG --name RDP-rule
```

> [!NOTE]
> This procedure applies only to a custom security rule. You aren't allowed to change a default security rule.

---
## Work with application security groups

An application security group contains zero or more network interfaces. To learn more, see [Application security groups](./network-security-groups-overview.md#application-security-groups). All network interfaces in an application security group must exist in the same virtual network. To learn how to add a network interface to an application security group, see [Add a network interface to an application security group](virtual-network-network-interface.md#add-or-remove-from-application-security-groups).

### Create an application security group

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Application security group**. Then select **Application security groups** in the search results.

1. Select **+ Create**.

1. On the **Create an application security group** page, under the **Basics** tab, enter or select the following values:

    | Setting | Action |
    | --- | --- |
    | **Project details** | |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select an existing resource group, or create a new one by selecting **Create new**. This example uses the `myResourceGroup` resource group. |
    | **Instance details** | |
    | Name | Enter a name for the application security group that you're creating. |
    | Region | Select the region in which you want to create the application security group. |


1. Select **Review + create**.

1. After you see the **Validation passed** message, select **Create**.

# [**PowerShell**](#tab/network-security-group-powershell)

Use [New-AzApplicationSecurityGroup](/powershell/module/az.network/new-azapplicationsecuritygroup) to create an application security group.

```azurepowershell-interactive
New-AzApplicationSecurityGroup -ResourceGroupName myResourceGroup -Name myASG -Location eastus
```

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network asg create](/cli/azure/network/asg#az-network-asg-create) to create an application security group.

```azurecli-interactive
az network asg create --resource-group myResourceGroup --name myASG --location eastus
```

---
### View all application security groups

# [**Portal**](#tab/network-security-group-portal)

In the search box at the top of the portal, enter **Application security group**. Then select **Application security groups** in the search results. A list of your application security groups appears in the Azure portal.

:::image type="content" source="./media/manage-network-security-group/view-application-security-groups.png" alt-text="Screenshot that shows existing application security groups in the Azure portal.":::

# [**PowerShell**](#tab/network-security-group-powershell)

Use [Get-AzApplicationSecurityGroup](/powershell/module/az.network/get-azapplicationsecuritygroup) to list all the application security groups in your Azure subscription.

```azurepowershell-interactive
Get-AzApplicationSecurityGroup | format-table Name, ResourceGroupName, Location
```

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network asg list](/cli/azure/network/asg#az-network-asg-list) to list all the application security groups in a resource group.

```azurecli-interactive
az network asg list --resource-group myResourceGroup --out table
```

---
### View the details of a specific application security group

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Application security group**. Then select **Application security groups** in the search results.

1. Select the application security group for which you want to view the details.

# [**PowerShell**](#tab/network-security-group-powershell)

Use [Get-AzApplicationSecurityGroup](/powershell/module/az.network/get-azapplicationsecuritygroup) to view the details of an application security group.

```azurepowershell-interactive
Get-AzApplicationSecurityGroup -Name myASG
```

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network asg show](/cli/azure/network/asg#az-network-asg-show) to view the details of an application security group.

```azurecli-interactive
az network asg show --resource-group myResourceGroup --name myASG
```

---
### Change an application security group

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Application security group**. Then select **Application security groups** in the search results.

1. Select the application security group that you want to change:

   - Select **move** next to **Resource group** or **Subscription** to change the resource group or subscription, respectively.

   - Select **edit** next to **Tags** to add or remove tags. To learn more, see [Use tags to organize your Azure resources and management hierarchy](../azure-resource-manager/management/tag-resources.md).

     :::image type="content" source="./media/manage-network-security-group/change-application-security-group.png" alt-text="Screenshot that shows changing an application security group in the Azure portal.":::

     > [!NOTE]
     > You can't change the location of an application security group.

   - Select **Access control (IAM)** to assign or remove permissions to the application security group.

# [**PowerShell**](#tab/network-security-group-powershell)

You can't change an application security group by using PowerShell.

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network asg update](/cli/azure/network/asg#az-network-asg-update) to update the tags for an application security group.

```azurecli-interactive
az network asg update --resource-group myResourceGroup --name myASG --tags Dept=Finance
```

> [!NOTE]
> You can't change the resource group, subscription, or location of an application security group by using the Azure CLI.

---
### Delete an application security group

You can't delete an application security group if it contains any network interfaces. To remove all network interfaces from the application security group, either change the network interface settings or delete the network interfaces. To learn more, see [Add or remove from application security groups](virtual-network-network-interface.md#add-or-remove-from-application-security-groups) or [Delete a network interface](virtual-network-network-interface.md#delete-a-network-interface).

# [**Portal**](#tab/network-security-group-portal)

1. In the search box at the top of the portal, enter **Application security group**. Then select **Application security groups** in the search results.

1. Select the application security group that you want to delete.

1. Select **Delete**, and then select **Yes** to delete the application security group.

    :::image type="content" source="./media/manage-network-security-group/delete-application-security-group.png" alt-text="Screenshot that shows deleting an application security group in the Azure portal.":::


# [**PowerShell**](#tab/network-security-group-powershell)

Use [Remove-AzApplicationSecurityGroup](/powershell/module/az.network/remove-azapplicationsecuritygroup) to delete an application security group.

```azurepowershell-interactive
Remove-AzApplicationSecurityGroup -ResourceGroupName myResourceGroup -Name myASG
```

# [**Azure CLI**](#tab/network-security-group-cli)

Use [az network asg delete](/cli/azure/network/asg#az-network-asg-delete) to delete an application security group.

```azurecli-interactive
az network asg delete --resource-group myResourceGroup --name myASG
```

---
## Permissions

To manage NSGs, security rules, and application security groups, your account must be assigned to the [Network Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role. You can also use a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) with the appropriate permissions assigned, as listed in the following tables.

> [!NOTE]
> You might *not* see the full list of service tags if the Network Contributor role was assigned at a resource group level. To view the full list, you can assign this role at a subscription scope instead. If you can only allow the Network Contributor role for the resource group, you can then also create a custom role for the permissions `Microsoft.Network/locations/serviceTags/read` and `Microsoft.Network/locations/serviceTagDetails/read`. Assign them at a subscription scope along with the Network Contributor role at the resource group scope.

### Network security group

| Action                                                        |   Name                                                                |
|-------------------------------------------------------------- |   -------------------------------------------                         |
| `Microsoft.Network/networkSecurityGroups/read`                  |   Get an NSG.                                          |
| `Microsoft.Network/networkSecurityGroups/write`                 |   Create or update an NSG.                             |
| `Microsoft.Network/networkSecurityGroups/delete`                |   Delete an NSG.                                       |
| `Microsoft.Network/networkSecurityGroups/join/action`           |   Associate an NSG to a subnet or network interface.

> [!NOTE]
> To perform `write` operations on an NSG, the subscription account must have at least `read` permissions for the resource group along with `Microsoft.Network/networkSecurityGroups/write` permission.

### Network security group rule

| Action                                                        |   Name                                                                |
|-------------------------------------------------------------- |   -------------------------------------------                         |
| `Microsoft.Network/networkSecurityGroups/securityRules/read`            |   Get a rule.                                                            |
| `Microsoft.Network/networkSecurityGroups/securityRules/write`           |   Create or update a rule.                                               |
| `Microsoft.Network/networkSecurityGroups/securityRules/delete`          |   Delete a rule.                                                         |

### Application security group

| Action                                                                     | Name                                                     |
| --------------------------------------------------------------             | -------------------------------------------              |
| `Microsoft.Network/applicationSecurityGroups/joinIpConfiguration/action`     | Join an IP configuration to an application security group.|
| `Microsoft.Network/applicationSecurityGroups/joinNetworkSecurityRule/action` | Join a security rule to an application security group.    |
| `Microsoft.Network/applicationSecurityGroups/read`                           | Get an application security group.                        |
| `Microsoft.Network/applicationSecurityGroups/write`                          | Create or update an application security group.           |
| `Microsoft.Network/applicationSecurityGroups/delete`                         | Delete an application security group.                     |

## Related content

- Add or remove [a network interface to or from an application security group](./virtual-network-network-interface.md?tabs=network-interface-portal#add-or-remove-from-application-security-groups).
- Create and assign [Azure Policy definitions](./policy-reference.md) for virtual networks.
