---
title: 'Troubleshoot Microsoft.Network Failed Provisioning State'
description: Learn how to troubleshoot Microsoft.Network Failed Provisioning State.
services: networking
author: stegag

ms.service: virtual-network
ms.topic: how-to
ms.date: 04/15/2022
ms.author: stegag

---

# Troubleshoot Microsoft.Network Failed provisioning state

This article helps understand the meaning of provisioning states for Microsoft.Network resources and how to effectively troubleshoot them when the state is **Failed**.

[!INCLUDE [support-disclaimer](../includes/support-disclaimer.md)]

## Provisioning states

The provisioning state is the status of a user-initiated, control-plane operation on an Azure Resource Manager resource. 

| Provisioning state | Description |
|---|---|
| Creating | Resource is being created. |
| Updating | Resource is updating to the latest model. |
| Failed | Last operation on the resource was not successful. | 
| Succeeded | Last operation on the resource was successful. | 
| Deleting | Resource is being deleted. | 
| Migrating | Seen when migrating from Azure Service Manager to Azure Resource Manager. | 

These states are independent from the functionality of the resource itself.
Being in a failed state does not necessarily mean that the resource is not functional, in fact in most cases it can continue operating and servicing traffic without issues.

However in several scenarios further operations on the resource or on other resources that depend on it will fail if the resource is in failed state, so it needs to be reverted back to succeeded state before executing other operations.

For example, you cannot execute an operation on a VirtualNetworkGateway if it has a dependent VirtualNetworkGatewayConnection object in failed state and viceversa.

## Restoring succeeded state through a PUT operation

The correct way to restore succeeded state is to execute another write operation on the resource.

Most times, the issue that caused the previous operation might no longer be current, hence the newer write should be successful and fix the provisioning state.

Th

### microsoft.network/applicationGateways

```azurepowershell-interactive
Get-AzApplicationGateway -Name <resourcename> -ResourceGroupName <resourcegroup> | Set-AzApplicationGateway
```

### microsoft.network/applicationGatewayWebApplicationFirewallPolicies

```azurepowershell-interactive
Get-AzApplicationGatewayFirewallPolicy -Name <resourcename> -ResourceGroupName <resourcegroup> | Set-AzApplicationGatewayFirewallPolicy
```
:)
