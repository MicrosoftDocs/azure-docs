---
title: 'Troubleshoot Azure Microsoft.Network failed Provisioning State'
description: Learn about the meaning of various provisioning states and how to troubleshoot Azure Microsoft.Network failed Provisioning State.
services: networking
author: stegag
ms.service: virtual-network
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 03/21/2023
ms.author: stegag
---

# Troubleshoot Azure Microsoft.Network failed provisioning state

This article helps you understand the meaning of various provisioning states for Microsoft.Network resources. You can effectively troubleshoot situations when the state is **Failed**.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Provisioning states

The provisioning state is the status of a user-initiated, control-plane operation on an Azure Resource Manager resource.

| Provisioning state | Description |
|---|---|
| Updating | Resource is being created or updated. |
| Failed | Last operation on the resource wasn't successful. |
| Succeeded | Last operation on the resource was successful. |
| Deleting | Resource is being deleted. |
| Migrating | Seen when migrating from Azure Service Manager to Azure Resource Manager. |

These states are metadata properties of the resource. They're independent from the functionality of the resource itself. Being in the failed state doesn't necessarily mean that the resource isn't functional. In most cases, it can continue operating and serving traffic without issues.

In several scenarios, if the resource is in the failed state, further operations on the resource or on other resources that depend on it might fail. You need to revert the state back to succeeded before running other operations.

For example, you can't run an operation on a `VirtualNetworkGateway` if it has a dependent `VirtualNetworkGatewayConnection` object in failed state.

## Restoring succeeded state through a PUT operation

To restore succeeded state, run another write (`PUT`) operation on the resource.

The issue that caused the previous operation might no longer be current. The newer write operation should be successful and restore the provisioning state.

The easiest way to achieve this task is to use Azure PowerShell. Issue a resource-specific *Get* command that fetches all the current configuration for the resource. Next, run a *Set* command, or equivalent, to commit to Azure a write operation that contains all the resource properties as currently configured.

> [!IMPORTANT]
>
> - Running a `Set` command on the resource without first running a `Get` results in overwriting the resource with default settings. Those settings might be different from the ones you currently have configured. Don't just run a `Set` command unless you intend to reset to default.
> - Running a `Get` and `Set` operation using third party software or any tool using older API version might also result in loss of some settings. Those settings might not be present in the API version with which you run the command.
>
## Azure PowerShell cmdlets to restore succeeded provisioning state

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

### Preliminary operations

1. Install the latest version of the Azure Resource Manager PowerShell cmdlets. For more information, see [Install the Azure Az PowerShell module](/powershell/azure/install-azure-powershell).

2. Open your PowerShell console with elevated privileges, and connect to your account. Use the following example to help you connect:

   ```azurepowershell-interactive
   Connect-AzAccount
   ```

3. If you have multiple Azure subscriptions, check the subscriptions for the account.

   ```azurepowershell-interactive
   Get-AzSubscription
   ```

4. Specify the subscription that you want to use.

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionName "Replace_with_your_subscription_name"
   ```

5. Run the resource-specific commands in the following sections to reset the provisioning state.

> [!NOTE]
> Every sample command in this article uses `your_resource_name` for the name of the resource and `your_resource_group_name` for the name of the resource group. Make sure to replace these strings with the appropriate resource and resource group names for your deployment.

### Microsoft.Network/applicationGateways

```azurepowershell-interactive
Get-AzApplicationGateway -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzApplicationGateway
```

### Microsoft.Network/applicationGatewayWebApplicationFirewallPolicies

```azurepowershell-interactive
Get-AzApplicationGatewayFirewallPolicy -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzApplicationGatewayFirewallPolicy
```

### Microsoft.Network/azureFirewalls

```azurepowershell-interactive
Get-AzFirewall -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzFirewall
```

### Microsoft.Network/bastionHosts

```azurepowershell-interactive
$bastion = Get-AzBastion -Name "your_resource_name" -ResourceGroupName "your_resource_group_name"
Set-AzBastion -InputObject $bastion
```

### Microsoft.Network/connections

```azurepowershell-interactive
Get-AzVirtualNetworkGatewayConnection -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzVirtualNetworkGatewayConnection

```

### Microsoft.Network/expressRouteCircuits

```azurepowershell-interactive
Get-AzExpressRouteCircuit -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzExpressRouteCircuit
```

### Microsoft.Network/expressRouteGateways

```azurepowershell-interactive
Get-AzExpressRouteGateway -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzExpressRouteGateway
```

> [!NOTE]
> `Microsoft.Network/expressRouteGateways` are deployed within a Virtual WAN. If you have a standalone ExpressRoute gateway in your virtual network, run the commands related to [Microsoft.Network/virtualNetworkGateways](#microsoftnetworkvirtualnetworkgateways).

### Microsoft.Network/expressRoutePorts

```azurepowershell-interactive
Get-AzExpressRoutePort -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzExpressRoutePort
```

### Microsoft.Network/firewallPolicies

```azurepowershell-interactive
Get-AzFirewallPolicy -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzFirewallPolicy
```

### Microsoft.Network/loadBalancers

```azurepowershell-interactive
Get-AzLoadBalancer -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzLoadBalancer
```

### Microsoft.Network/localNetworkGateways

```azurepowershell-interactive
Get-AzLocalNetworkGateway -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzLocalNetworkGateway
```

### Microsoft.Network/natGateways

```azurepowershell-interactive
Get-AzNatGateway -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzNatGateway
```

### Microsoft.Network/networkInterfaces

```azurepowershell-interactive
Get-AzNetworkInterface -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzNetworkInterface
```

### Microsoft.Network/networkSecurityGroups

```azurepowershell-interactive
Get-AzNetworkSecurityGroup -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzNetworkSecurityGroup
```

### Microsoft.Network/networkVirtualAppliances

```azurepowershell-interactive
Get-AzNetworkVirtualAppliance -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Update-AzNetworkVirtualAppliance
```

> [!NOTE]
> Most Virtual WAN related resources, such as networkVirtualAppliances, use the `Update` cmdlet, not the `Set`, for write operations.

### Microsoft.Network/privateDnsZones

```azurepowershell-interactive
Get-AzPrivateDnsZone -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzPrivateDnsZone
```

### Microsoft.Network/privateEndpoints

```azurepowershell-interactive
Get-AzPrivateEndpoint -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzPrivateEndpoint
```

### Microsoft.Network/privateLinkServices

```azurepowershell-interactive
Get-AzPrivateLinkService -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzPrivateLinkService
```

### Microsoft.Network/publicIpAddresses

```azurepowershell-interactive
Get-AzPublicIpAddress -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzPublicIpAddress
```

### Microsoft.Network/routeFilters

```azurepowershell-interactive
Get-AzRouteFilter -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzRouteFilter
```

### Microsoft.Network/routeTables

```azurepowershell-interactive
Get-AzRouteTable -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzRouteTable
```

### Microsoft.Network/virtualHubs

```azurepowershell-interactive
Get-AzVirtualHub -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Update-AzVirtualHub
```

> [!NOTE]
> Most Virtual WAN related resources, such as virtualHubs, use the `Update` cmdlet, not the `Set`, for write operations.

### Microsoft.Network/virtualNetworkGateways

```azurepowershell-interactive
Get-AzVirtualNetworkGateway -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzVirtualNetworkGateway
```

### Microsoft.Network/virtualNetworks

```azurepowershell-interactive
Get-AzVirtualNetwork -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Set-AzVirtualNetwork
```

### Microsoft.Network/virtualWans

```azurepowershell-interactive
Get-AzVirtualWan -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Update-AzVirtualWan
```

> [!NOTE]
> Most Virtual WAN related resources, such as virtualWans, use the `Update` cmdlet, not the `Set`, for write operations.

### Microsoft.Network/vpnGateways

```azurepowershell-interactive
Get-AzVpnGateway -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Update-AzVpnGateway
```

> [!NOTE]
>
> - `Microsoft.Network/vpnGateways` are deployed within a Virtual WAN. If you have a standalone VPN gateway in your virtual network, run the commands related to [Microsoft.Network/virtualNetworkGateways](#microsoftnetworkvirtualnetworkgateways).
> - Most Virtual WAN related resources, such as vpnGateways, use the `Update` cmdlet, not the `Set` for write operations.

### Microsoft.Network/vpnSites

```azurepowershell-interactive
Get-AzVpnSite -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Update-AzVpnSite
```

> [!NOTE]
> Most Virtual WAN related resources, such as vpnSites, use the `Update` cmdlet, not the `Set`, for write operations.

## Next steps

If the command that you ran didn't resolve the failed state, it should return an error code.
Most error codes contain a detailed description of what the problem might be and offer hints to solve it.

If you're still experiencing issues, open a support ticket with [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). Specify to the support agent both the error code that you received in the latest operation and the timestamp when you ran the operation.
