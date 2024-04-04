---
title: Create an Azure Application Gateway & rewrite HTTP headers
description: This article provides information on how to create an Azure Application Gateway and rewrite HTTP headers using Azure PowerShell
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 11/19/2019
ms.author: greglin 
ms.custom: devx-track-azurepowershell
---

# Create an application gateway and rewrite HTTP headers

You can use Azure PowerShell to
configure [rules to rewrite HTTP request and response headers](./rewrite-http-headers-url.md) when you create the new [autoscaling and zone-redundant application gateway SKU](./application-gateway-autoscaling-zone-redundant.md)

In this article, you learn how to:

* Create an autoscale virtual network
* Create a reserved public IP
* Set up your application gateway infrastructure
* Specify your http header rewrite rule configuration
* Specify autoscale
* Create the application gateway
* Test the application gateway

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

This article requires that you run Azure PowerShell locally. You must have Az module version 1.0.0 or later installed. Run `Import-Module Az` and then`Get-Module Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). After you verify the PowerShell version, run `Login-AzAccount` to create a connection with Azure.

## Sign in to Azure

```azurepowershell
Connect-AzAccount
Select-AzSubscription -Subscription "<sub name>"
```

## Create a resource group
Create a resource group in one of the available locations.

```azurepowershell
$location = "East US 2"
$rg = "<rg name>"

#Create a new Resource Group
New-AzResourceGroup -Name $rg -Location $location
```

## Create a virtual network

Create a virtual network with one dedicated subnet for an autoscaling application gateway. Currently only one autoscaling application gateway can be deployed in each dedicated subnet.

```azurepowershell
#Create VNet with two subnets
$sub1 = New-AzVirtualNetworkSubnetConfig -Name "AppGwSubnet" -AddressPrefix "10.0.0.0/24"
$sub2 = New-AzVirtualNetworkSubnetConfig -Name "BackendSubnet" -AddressPrefix "10.0.1.0/24"
$vnet = New-AzvirtualNetwork -Name "AutoscaleVNet" -ResourceGroupName $rg `
       -Location $location -AddressPrefix "10.0.0.0/16" -Subnet $sub1, $sub2
```

## Create a reserved public IP

Specify the allocation method of PublicIPAddress as **Static**. An autoscaling application gateway VIP can only be static. Dynamic IPs are not supported. Only the standard PublicIpAddress SKU is supported.

```azurepowershell
#Create static public IP
$pip = New-AzPublicIpAddress -ResourceGroupName $rg -name "AppGwVIP" `
       -location $location -AllocationMethod Static -Sku Standard
```

## Retrieve details

Retrieve details of the resource group, subnet, and IP in a local object to create the IP configuration details for the application gateway.

```azurepowershell
$resourceGroup = Get-AzResourceGroup -Name $rg
$publicip = Get-AzPublicIpAddress -ResourceGroupName $rg -name "AppGwVIP"
$vnet = Get-AzvirtualNetwork -Name "AutoscaleVNet" -ResourceGroupName $rg
$gwSubnet = Get-AzVirtualNetworkSubnetConfig -Name "AppGwSubnet" -VirtualNetwork $vnet
```

## Configure the infrastructure

Configure the IP config, frontend IP config, backend pool, HTTP settings, certificate, port, and listener in an identical format to the existing Standard application gateway. The new SKU follows the same object model as the Standard SKU.

```azurepowershell
$ipconfig = New-AzApplicationGatewayIPConfiguration -Name "IPConfig" -Subnet $gwSubnet
$fip = New-AzApplicationGatewayFrontendIPConfig -Name "FrontendIPCOnfig" -PublicIPAddress $publicip
$pool = New-AzApplicationGatewayBackendAddressPool -Name "Pool1" `
       -BackendIPAddresses testbackend1.westus.cloudapp.azure.com, testbackend2.westus.cloudapp.azure.com
$fp01 = New-AzApplicationGatewayFrontendPort -Name "HTTPPort" -Port 80

$listener01 = New-AzApplicationGatewayHttpListener -Name "HTTPListener" `
             -Protocol Http -FrontendIPConfiguration $fip -FrontendPort $fp01

$setting = New-AzApplicationGatewayBackendHttpSettings -Name "BackendHttpSetting1" `
          -Port 80 -Protocol Http -CookieBasedAffinity Disabled
```

## Specify your HTTP header rewrite rule configuration

Configure the new objects required to rewrite the http headers:

- **RequestHeaderConfiguration**: this object is used to specify the request header fields that you intend to rewrite and the new value that the original headers need to be rewritten to.
- **ResponseHeaderConfiguration**: this object is used to specify the response header fields that you intend to rewrite and the new value that the original headers need to be rewritten to.
- **ActionSet**: this object contains the configurations of the request and response headers specified above. 
- **RewriteRule**: this object contains all the *actionSets* specified above. 
- **RewriteRuleSet**- this object contains all the *rewriteRules* and will need to be attached to a request routing rule - basic or path-based.

   ```azurepowershell
   $requestHeaderConfiguration = New-AzApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "X-isThroughProxy" -HeaderValue "True"
   $responseHeaderConfiguration = New-AzApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "Strict-Transport-Security" -HeaderValue "max-age=31536000"
   $actionSet = New-AzApplicationGatewayRewriteRuleActionSet -RequestHeaderConfiguration $requestHeaderConfiguration -ResponseHeaderConfiguration $responseHeaderConfiguration    
   $rewriteRule = New-AzApplicationGatewayRewriteRule -Name rewriteRule1 -ActionSet $actionSet    
   $rewriteRuleSet = New-AzApplicationGatewayRewriteRuleSet -Name rewriteRuleSet1 -RewriteRule $rewriteRule
   ```

## Specify the routing rule

Create a request routing rule. Once created, this rewrite configuration is attached to the source listener via the routing rule. When using a basic routing rule, the header rewrite configuration is associated with a source listener and is a global header rewrite. When a path-based routing rule is used, the header rewrite configuration is defined on the URL path map. So, it only applies to the specific path area of a site. Below, a basic routing rule is created and the rewrite rule set is attached.

```azurepowershell
$rule01 = New-AzApplicationGatewayRequestRoutingRule -Name "Rule1" -RuleType basic `
         -BackendHttpSettings $setting -HttpListener $listener01 -BackendAddressPool $pool -RewriteRuleSet $rewriteRuleSet
```

## Specify autoscale

Now you can specify the autoscale configuration for the application gateway. Two autoscaling configuration types are supported:

* **Fixed capacity mode**. In this mode, the application gateway doesn't autoscale and operates at a fixed Scale Unit capacity.

   ```azurepowershell
   $sku = New-AzApplicationGatewaySku -Name Standard_v2 -Tier Standard_v2 -Capacity 2
   ```

* **Autoscaling mode**. In this mode, the application gateway autoscales based on the application traffic pattern.

   ```azurepowershell
   $autoscaleConfig = New-AzApplicationGatewayAutoscaleConfiguration -MinCapacity 2
   $sku = New-AzApplicationGatewaySku -Name Standard_v2 -Tier Standard_v2
   ```

## Create the application gateway

Create the application gateway and include redundancy zones and the autoscale configuration.

```azurepowershell
$appgw = New-AzApplicationGateway -Name "AutoscalingAppGw" -Zone 1,2,3 -ResourceGroupName $rg -Location $location -BackendAddressPools $pool -BackendHttpSettingsCollection $setting -GatewayIpConfigurations $ipconfig -FrontendIpConfigurations $fip -FrontendPorts $fp01 -HttpListeners $listener01 -RequestRoutingRules $rule01 -Sku $sku -AutoscaleConfiguration $autoscaleConfig -RewriteRuleSet $rewriteRuleSet
```

## Test the application gateway

Use Get-AzPublicIPAddress to get the public IP address of the application gateway. Copy the public IP address or DNS name, and then paste it into the address bar of your browser.

```azurepowershell
Get-AzPublicIPAddress -ResourceGroupName $rg -Name AppGwVIP
```



## Clean up resources

First explore the resources that were created with the application gateway. Then, when they're no longer needed, you can use the `Remove-AzResourceGroup` command to remove the resource group, application gateway, and all related resources.

`Remove-AzResourceGroup -Name $rg`

## Next steps

- [Create an application gateway with URL path-based routing rules](./tutorial-url-route-powershell.md)
