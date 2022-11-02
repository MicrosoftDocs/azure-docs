---
title: 'Troubleshoot Azure Microsoft.Network failed Provisioning State'
description: Learn how to troubleshoot Azure Microsoft.Network failed Provisioning State.
services: networking
author: stegag

ms.service: virtual-network
ms.topic: how-to
ms.date: 04/08/2022
ms.author: stegag

---

# Troubleshoot Azure Microsoft.Network failed provisioning state

This article helps understand the meaning of various provisioning states for Microsoft.Network resources and how to effectively troubleshoot situations when the state is **Failed**.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Provisioning states

The provisioning state is the status of a user-initiated, control-plane operation on an Azure Resource Manager resource. 

| Provisioning state | Description |
|---|---|
| Updating | Resource is being created or updated. |
| Failed | Last operation on the resource was not successful. | 
| Succeeded | Last operation on the resource was successful. | 
| Deleting | Resource is being deleted. | 
| Migrating | Seen when migrating from Azure Service Manager to Azure Resource Manager. | 

These states are just metadata properties of the resource and are independent from the functionality of the resource itself.
Being in a failed state does not necessarily mean that the resource is not functional, in fact in most cases it can continue operating and servicing traffic without issues.

However in several scenarios further operations on the resource or on other resources that depend on it may fail if the resource is in failed state, so the state needs to be reverted back to succeeded before executing other operations.

For example, you cannot execute an operation on a VirtualNetworkGateway if it has a dependent VirtualNetworkGatewayConnection object in failed state and viceversa.

## Restoring succeeded state through a PUT operation

The correct way to restore succeeded state is to execute another write (PUT) operation on the resource.

Most times, the issue that caused the previous operation might no longer be current, hence the newer write operation should be successful and restore the provisioning state.

The easiest way to achieve this task is to use Azure PowerShell. You will need to issue a resource-specific "Get" command that fetches all the current configuration for the impacted resource as it is deployed. Next, you can execute a "Set" command (or equivalent) to commit to Azure a write operation containing all the resource properties as they are currently configured.

> [!IMPORTANT]
> 1. Executing a "Set" command on the resource without running a "Get" first will result in overwriting the resource with default settings which might be different from those you currently have configured. Do not just run a "Set" command unless resetting settings is intentional.
> 2. Executing a "Get" and "Set" operation using third party software or otherwise any tool using older API version may also result in loss of some settings, as those may not be present in the API version with which you have executed the command.
>
## Azure PowerShell cmdlets to restore succeeded provisioning state

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

### Preliminary operations

1. Install the latest version of the Azure Resource Manager PowerShell cmdlets. For more information, see [Install and configure Azure PowerShell](/powershell/azure/install-az-ps).

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
5. Run the resource-specific commands listed below to reset the provisioning state to succeeded. 
 
> [!NOTE]
>Every sample command in this article uses "your_resource_name" for the name of the Resource and "your_resource_group_name" for the name of the Resource Group. Make sure to replace these strings with the appropriate Resource and Resource Group names according to your deployment.

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
> **Microsoft.Network/expressRouteGateways** are those gateways deployed within a Virtual WAN. If you have a standalone gateway of ExpressRoute type in your Virtual Network you need to execute the commands related to [Microsoft.Network/virtualNetworkGateways](#microsoftnetworkvirtualnetworkgateways).

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
> Most Virtual WAN related resources such as networkVirtualAppliances leverage the "Update" cmdlet and not the "Set" for write operations.
> 
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
> Most Virtual WAN related resources such as virtualHubs leverage the "Update" cmdlet and not the "Set" for write operations.
> 
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
> Most Virtual WAN related resources such as virtualWans leverage the "Update" cmdlet and not the "Set" for write operations.

### Microsoft.Network/vpnGateways

```azurepowershell-interactive
Get-AzVpnGateway -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Update-AzVpnGateway
```
> [!NOTE]
> 1. **Microsoft.Network/vpnGateways** are those gateways deployed within a Virtual WAN. If you have a standalone gateway of VPN type in your Virtual Network you need to execute the commands related to [Microsoft.Network/virtualNetworkGateways](#microsoftnetworkvirtualnetworkgateways).
> 2. Most Virtual WAN related resources such as vpnGateways leverage the "Update" cmdlet and not the "Set" for write operations.

### Microsoft.Network/vpnSites

```azurepowershell-interactive
Get-AzVpnSite -Name "your_resource_name" -ResourceGroupName "your_resource_group_name" | Update-AzVpnSite
```
> [!NOTE]
> Most Virtual WAN related resources such as vpnSites leverage the "Update" cmdlet and not the "Set" for write operations.



## Next steps

If the command executed didn't fix the failed state, it should return an error code for you.
Most error codes contain a detailed description of what the problem might be and offer hints to solve it.

Open a support ticket with [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) if you're still experiencing issues.
Make sure you specify to the Support Agent both the error code you received in the latest operation, as well as the timestamp of when the operation was executed.
