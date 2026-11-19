---
title: Create an Azure DDoS Protection custom policy using Azure PowerShell
description: Learn how to create an Azure DDoS Protection custom policy and associate it with supported public IP configurations by using Azure PowerShell.
services: ddos-protection
author: duongau
ms.service: azure-ddos-protection
ms.topic: how-to
ms.custom: devx-track-azurepowershell
ms.author: duau
ms.date: 10/13/2026
# Customer intent: As a network administrator, I want to manage a DDoS Protection custom policy with Azure PowerShell, so that I can automate protocol-specific thresholds and resource associations.
---

# Create an Azure DDoS Protection custom policy by using Azure PowerShell

This article describes how to use Azure PowerShell to create an Azure DDoS Protection custom policy and associate it with supported public IP configurations. A custom policy defines protocol-specific detection thresholds that override adaptive auto-tuning. For more information, see [What is Azure DDoS Protection custom policy?](ddos-custom-policy-overview.md)

Azure PowerShell and Azure CLI provide different management paths to the same custom-policy capability. For a Standard Load Balancer, this Azure PowerShell example configures the policy on the frontend IP configuration. The [Azure CLI example](manage-ddos-custom-policy-cli.md) uses the load balancer's associated public IP address. Both tools can associate a policy directly with an instance-level public IP address.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Use [Azure Cloud Shell](/azure/cloud-shell/overview), or [install Azure PowerShell](/powershell/azure/install-azure-powershell) locally and sign in with [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).
- To complete the association examples, use either a Standard Load Balancer with a Standard public IP address or an instance-level Standard public IP address associated with a network interface.

## Create a resource group

Use [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) to create a resource group for the custom policy and example resources.

```azurepowershell-interactive
New-AzResourceGroup `
    -Name "MyResourceGroup" `
    -Location "eastus"
```

## Create a custom policy

Use [New-AzDdosCustomPolicyDetectionRule](/powershell/module/az.network/new-azddoscustompolicydetectionrule) to define a detection rule, and then use [New-AzDdosCustomPolicy](/powershell/module/az.network/new-azddoscustompolicy) to create the policy. The following example creates one inbound TCP rule set to 1,000,000 packets per second.

The `-PacketsPerSecond` value must match the range for the selected `-TrafficType`:

| Traffic type | Minimum threshold (packets per second) | Maximum threshold (packets per second) |
| --- | --- | --- |
| `Tcp` | 50,000 | 2,000,000 |
| `Udp` | 20,000 | 200,000 |
| `TcpSyn` | 1,000 | 100,000 |

```azurepowershell-interactive
$detectionRule = New-AzDdosCustomPolicyDetectionRule `
    -Name "tcp-threshold" `
    -TrafficType Tcp `
    -PacketsPerSecond 1000000

$policy = New-AzDdosCustomPolicy `
    -ResourceGroupName "MyResourceGroup" `
    -Name "MyCustomPolicy" `
    -Location "eastus" `
    -DetectionRule @($detectionRule)
```

## View the custom policy

Use [Get-AzDdosCustomPolicy](/powershell/module/az.network/get-azddoscustompolicy) to view the policy and its detection rules.

```azurepowershell-interactive
$policy = Get-AzDdosCustomPolicy `
    -ResourceGroupName "MyResourceGroup" `
    -Name "MyCustomPolicy"

$policy.DetectionRules |
    Format-Table TrafficType, PacketsPerSecond
```

## Associate the policy with a Load Balancer frontend

For a Standard Load Balancer, use [Set-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/set-azloadbalancerfrontendipconfig) to associate the custom policy with the frontend IP configuration.

```azurepowershell-interactive
$loadBalancer = Get-AzLoadBalancer `
    -ResourceGroupName "MyResourceGroup" `
    -Name "MyLoadBalancer"

$publicIp = Get-AzPublicIpAddress `
    -ResourceGroupName "MyResourceGroup" `
    -Name "MyPublicIP"

Set-AzLoadBalancerFrontendIpConfig `
    -LoadBalancer $loadBalancer `
    -Name "MyFrontendIP" `
    -PublicIpAddress $publicIp `
    -DdosCustomPolicyId $policy.Id

Set-AzLoadBalancer -LoadBalancer $loadBalancer
```

Use [Get-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/get-azloadbalancerfrontendipconfig) to verify the association.

```azurepowershell-interactive
$loadBalancer = Get-AzLoadBalancer `
    -ResourceGroupName "MyResourceGroup" `
    -Name "MyLoadBalancer"

$frontend = Get-AzLoadBalancerFrontendIpConfig `
    -LoadBalancer $loadBalancer `
    -Name "MyFrontendIP"

$frontend.DdosSettings.DdosCustomPolicy.Id
```

## Associate the policy with an instance-level public IP

For a Standard public IP address that's attached to a network interface, use [Set-AzPublicIpAddress](/powershell/module/az.network/set-azpublicipaddress) to associate the custom policy directly with the public IP address.

```azurepowershell-interactive
$publicIp = Get-AzPublicIpAddress `
    -ResourceGroupName "MyResourceGroup" `
    -Name "MyInstancePublicIP"

Set-AzPublicIpAddress `
    -PublicIpAddress $publicIp `
    -DdosCustomPolicyId $policy.Id
```

Verify the association and the network interface attachment.

```azurepowershell-interactive
$publicIp = Get-AzPublicIpAddress `
    -ResourceGroupName "MyResourceGroup" `
    -Name "MyInstancePublicIP"

[PSCustomObject]@{
    PublicIp          = $publicIp.Name
    IpAddress         = $publicIp.IpAddress
    NetworkInterface  = $publicIp.IpConfiguration.Id
    DdosCustomPolicy  = $publicIp.DdosSettings.DdosCustomPolicy.Id
} | Format-List
```

## Remove the associations

To return the protected resources to adaptive auto-tuning, remove the custom policy associations.

```azurepowershell-interactive
$loadBalancer = Get-AzLoadBalancer `
    -ResourceGroupName "MyResourceGroup" `
    -Name "MyLoadBalancer"

$publicIp = Get-AzPublicIpAddress `
    -ResourceGroupName "MyResourceGroup" `
    -Name "MyPublicIP"

Set-AzLoadBalancerFrontendIpConfig `
    -LoadBalancer $loadBalancer `
    -Name "MyFrontendIP" `
    -PublicIpAddress $publicIp `
    -RemoveDdosCustomPolicy

Set-AzLoadBalancer -LoadBalancer $loadBalancer

$instancePublicIp = Get-AzPublicIpAddress `
    -ResourceGroupName "MyResourceGroup" `
    -Name "MyInstancePublicIP"

Set-AzPublicIpAddress `
    -PublicIpAddress $instancePublicIp `
    -RemoveDdosCustomPolicy
```

## Clean up resources

First, remove the policy associations, including any associations with resources outside the example resource group. When you no longer need the example resources, delete their resource group.

```azurepowershell-interactive
Remove-AzResourceGroup `
    -Name "MyResourceGroup" `
    -Force
```

## Next steps

> [!div class="nextstepaction"]
> [Monitor Azure DDoS Protection](monitor-ddos-protection.md)
