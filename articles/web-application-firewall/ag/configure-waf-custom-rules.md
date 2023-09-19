---
title: Configure v2 custom rules using PowerShell
titleSuffix: Azure Web Application Firewall
description: Learn how to configure Web Application Firewall (WAF) v2 custom rules using Azure PowerShell. You can create your own rules evaluated for each request that passes through the firewall.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.topic: article
ms.date: 05/21/2020
ms.author: victorh 
ms.custom: devx-track-azurepowershell
---

# Configure Web Application Firewall v2 on Application Gateway with a custom rule using Azure PowerShell

<!--- If you make any changes to the PowerShell in this article, also make the change in the corresponding Sample file: azure-docs-powershell-samples/application-gateway/waf-rules/waf-custom-rules.ps1 --->

Custom rules allow you to create your own rules evaluated for each request that passes through the Web Application Firewall (WAF) v2. These rules hold a higher priority than the rest of the rules in the managed rule sets. The custom rules have an action (to allow or block), a match condition, and an operator to allow full customization.

This article creates an Application Gateway WAF v2 that uses a custom rule. The custom rule blocks traffic if the request header contains User-Agent *evilbot*.

To see more custom rule examples, see [Create and use custom web application firewall rules](create-custom-waf-rules.md)

If you want run the Azure PowerShell in this article in one continuous script that you can copy, paste, and run, see [Azure Application Gateway PowerShell samples](powershell-samples.md).

## Prerequisites

### Azure PowerShell module

If you choose to install and use Azure PowerShell locally, this script requires the Azure PowerShell module version 2.1.0 or later.

1. To find the version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).
2. To create a connection with Azure, run `Connect-AzAccount`.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Example script

### Set up variables

```azurepowershell
$rgname = "CustomRulesTest"

$location = "East US"

$appgwName = "WAFCustomRules"
```

### Create a resource group

```azurepowershell
$resourceGroup = New-AzResourceGroup -Name $rgname -Location $location
```

### Create a VNet

```azurepowershell
$sub1 = New-AzVirtualNetworkSubnetConfig -Name "appgwSubnet" -AddressPrefix "10.0.0.0/24"

$sub2 = New-AzVirtualNetworkSubnetConfig -Name "backendSubnet" -AddressPrefix "10.0.1.0/24"

$vnet = New-AzvirtualNetwork -Name "Vnet1" -ResourceGroupName $rgname -Location $location `
  -AddressPrefix "10.0.0.0/16" -Subnet @($sub1, $sub2)
```

### Create a Static Public VIP

```azurepowershell
$publicip = New-AzPublicIpAddress -ResourceGroupName $rgname -name "AppGwIP" `
  -location $location -AllocationMethod Static -Sku Standard
```

### Create pool and frontend port

```azurepowershell
$gwSubnet = Get-AzVirtualNetworkSubnetConfig -Name "appgwSubnet" -VirtualNetwork $vnet

$gipconfig = New-AzApplicationGatewayIPConfiguration -Name "AppGwIpConfig" -Subnet $gwSubnet

$fipconfig01 = New-AzApplicationGatewayFrontendIPConfig -Name "fipconfig" -PublicIPAddress $publicip

$pool = New-AzApplicationGatewayBackendAddressPool -Name "pool1" `
  -BackendIPAddresses testbackend1.westus.cloudapp.azure.com, testbackend2.westus.cloudapp.azure.com

$fp01 = New-AzApplicationGatewayFrontendPort -Name "port1" -Port 80
```

### Create a listener, http setting, rule, and autoscale

```azurepowershell
$listener01 = New-AzApplicationGatewayHttpListener -Name "listener1" -Protocol Http `
  -FrontendIPConfiguration $fipconfig01 -FrontendPort $fp01

$poolSetting01 = New-AzApplicationGatewayBackendHttpSettings -Name "setting1" -Port 80 `
  -Protocol Http -CookieBasedAffinity Disabled

$rule01 = New-AzApplicationGatewayRequestRoutingRule -Name "rule1" -RuleType basic `
  -BackendHttpSettings $poolSetting01 -HttpListener $listener01 -BackendAddressPool $pool -Priority 1000

$autoscaleConfig = New-AzApplicationGatewayAutoscaleConfiguration -MinCapacity 3

$sku = New-AzApplicationGatewaySku -Name WAF_v2 -Tier WAF_v2
```

### Create two custom rules and apply it to WAF policy

```azurepowershell
# Create a User-Agent header custom rule 
$variable = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestHeaders -Selector User-Agent
$condition = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable -Operator Contains -MatchValue "evilbot" -Transform Lowercase -NegationCondition $False  
$rule = New-AzApplicationGatewayFirewallCustomRule -Name blockEvilBot -Priority 2 -RuleType MatchRule -MatchCondition $condition -Action Block -State Enabled
 
# Create a geo-match custom rule
$var2 = New-AzApplicationGatewayFirewallMatchVariable -VariableName RemoteAddr
$condition2 = New-AzApplicationGatewayFirewallCondition -MatchVariable $var2 -Operator GeoMatch -MatchValue "US"  -NegationCondition $False
$rule2 = New-AzApplicationGatewayFirewallCustomRule -Name allowUS -Priority 14 -RuleType MatchRule -MatchCondition $condition2 -Action Allow -State Enabled

# Create a firewall policy
$policySetting = New-AzApplicationGatewayFirewallPolicySetting -Mode Prevention -State Enabled
$wafPolicy = New-AzApplicationGatewayFirewallPolicy -Name wafpolicyNew -ResourceGroup $rgname -Location $location -PolicySetting $PolicySetting -CustomRule $rule,$rule2
```

### Create the Application Gateway

```azurepowershell
$appgw = New-AzApplicationGateway -Name $appgwName -ResourceGroupName $rgname `
  -Location $location -BackendAddressPools $pool `
  -BackendHttpSettingsCollection  $poolSetting01 `
  -GatewayIpConfigurations $gipconfig -FrontendIpConfigurations $fipconfig01 `
  -FrontendPorts $fp01 -HttpListeners $listener01 `
  -RequestRoutingRules $rule01 -Sku $sku -AutoscaleConfiguration $autoscaleConfig `
  -FirewallPolicy $wafPolicy
```

## Update your WAF

After you create your WAF, you can update it using a procedure similar to the following code:

```azurepowershell
# Get the existing policy
$policy = Get-AzApplicationGatewayFirewallPolicy -Name $policyName -ResourceGroupName $RGname
# Add an existing rule named $rule
$policy.CustomRules.Add($rule)
# Update the policy
Set-AzApplicationGatewayFirewallPolicy -InputObject $policy
```

## Next steps

[Learn more about Web Application Firewall on Application Gateway](ag-overview.md)
