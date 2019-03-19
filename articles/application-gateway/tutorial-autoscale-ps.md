---
title: 'Tutorial: Create an autoscaling, zone redundant application gateway with a reserved IP address - Azure PowerShell'
description: In this tutorial, learn how to create an autoscaling, zone-redundant application gateway with a reserved IP address using Azure PowerShell.
services: application-gateway
author: amitsriva
ms.service: application-gateway
ms.topic: tutorial
ms.date: 11/26/2018
ms.author: victorh
ms.custom: mvc
#Customer intent: As an IT administrator new to Application Gateway, I want to configure the service in a way that automatically scales based on customer demand and is highly available across availability zones to ensure my customers can access their web applications when they need them.
---
# Tutorial: Create an application gateway that improves web application access

If you're an IT admin concerned with improving web application access, you can optimize your application gateway to scale based on customer demand and span multiple availability zones. This tutorial helps you configure Azure Application Gateway features that do that: autoscaling, zone redundancy, and reserved VIPs (static IP). You'll use Azure PowerShell cmdlets and the Azure Resource Manager deployment model to solve the problem.

> [!IMPORTANT] 
> The autoscaling and zone-redundant application gateway SKU is currently in public preview. This preview is provided without a service level agreement and is not recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an autoscale virtual network
> * Create a reserved public IP
> * Set up your application gateway infrastructure
> * Specify autoscale
> * Create the application gateway
> * Test the application gateway

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

This tutorial requires that you run Azure PowerShell locally. You must have Azure PowerShell module version 6.9.0 or later installed. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](https://docs.microsoft.com/powershell/azure/azurerm/install-azurerm-ps). After you verify the PowerShell version, run `Login-AzureRmAccount` to create a connection with Azure.

## Sign in to Azure

```azurepowershell
Connect-AzureRmAccount
Select-AzureRmSubscription -Subscription "<sub name>"
```

## Create a resource group
Create a resource group in one of the available locations.

```azurepowershell
$location = "East US 2"
$rg = "<rg name>"

#Create a new Resource Group
New-AzureRmResourceGroup -Name $rg -Location $location
```

## Create a virtual network

Create a virtual network with one dedicated subnet for an autoscaling application gateway. Currently only one autoscaling application gateway can be deployed in each dedicated subnet.

```azurepowershell
#Create VNet with two subnets
$sub1 = New-AzureRmVirtualNetworkSubnetConfig -Name "AppGwSubnet" -AddressPrefix "10.0.0.0/24"
$sub2 = New-AzureRmVirtualNetworkSubnetConfig -Name "BackendSubnet" -AddressPrefix "10.0.1.0/24"
$vnet = New-AzureRmvirtualNetwork -Name "AutoscaleVNet" -ResourceGroupName $rg `
       -Location $location -AddressPrefix "10.0.0.0/16" -Subnet $sub1, $sub2
```

## Create a reserved public IP

Specify the allocation method of PublicIPAddress as **Static**. An autoscaling application gateway VIP can only be static. Dynamic IPs are not supported. Only the standard PublicIpAddress SKU is supported.

```azurepowershell
#Create static public IP
$pip = New-AzureRmPublicIpAddress -ResourceGroupName $rg -name "AppGwVIP" `
       -location $location -AllocationMethod Static -Sku Standard
```

## Retrieve details

Retrieve details of the resource group, subnet, and IP in a local object to create the IP configuration details for the application gateway.

```azurepowershell
$resourceGroup = Get-AzureRmResourceGroup -Name $rg
$publicip = Get-AzureRmPublicIpAddress -ResourceGroupName $rg -name "AppGwVIP"
$vnet = Get-AzureRmvirtualNetwork -Name "AutoscaleVNet" -ResourceGroupName $rg
$gwSubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name "AppGwSubnet" -VirtualNetwork $vnet
```

## Configure the infrastructure

Configure the IP config, front-end IP config, back-end pool, HTTP settings, certificate, port, listener, and rule in an identical format to the existing Standard application gateway. The new SKU follows the same object model as the Standard SKU.

```azurepowershell
$ipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name "IPConfig" -Subnet $gwSubnet
$fip = New-AzureRmApplicationGatewayFrontendIPConfig -Name "FrontendIPCOnfig" -PublicIPAddress $publicip
$pool = New-AzureRmApplicationGatewayBackendAddressPool -Name "Pool1" `
       -BackendIPAddresses testbackend1.westus.cloudapp.azure.com, testbackend2.westus.cloudapp.azure.com
$fp01 = New-AzureRmApplicationGatewayFrontendPort -Name "SSLPort" -Port 443
$fp02 = New-AzureRmApplicationGatewayFrontendPort -Name "HTTPPort" -Port 80

$securepfxpwd = ConvertTo-SecureString -String "scrap" -AsPlainText -Force
$sslCert01 = New-AzureRmApplicationGatewaySslCertificate -Name "SSLCert" -Password $securepfxpwd `
            -CertificateFile "D:\Networking\ApplicationGateway\scrap.pfx"
$listener01 = New-AzureRmApplicationGatewayHttpListener -Name "SSLListener" `
             -Protocol Https -FrontendIPConfiguration $fip -FrontendPort $fp01 -SslCertificate $sslCert01
$listener02 = New-AzureRmApplicationGatewayHttpListener -Name "HTTPListener" `
             -Protocol Http -FrontendIPConfiguration $fip -FrontendPort $fp02

$setting = New-AzureRmApplicationGatewayBackendHttpSettings -Name "BackendHttpSetting1" `
          -Port 80 -Protocol Http -CookieBasedAffinity Disabled
$rule01 = New-AzureRmApplicationGatewayRequestRoutingRule -Name "Rule1" -RuleType basic `
         -BackendHttpSettings $setting -HttpListener $listener01 -BackendAddressPool $pool
$rule02 = New-AzureRmApplicationGatewayRequestRoutingRule -Name "Rule2" -RuleType basic `
         -BackendHttpSettings $setting -HttpListener $listener02 -BackendAddressPool $pool
```

## Specify autoscale

Now you can specify the autoscale configuration for the application gateway. Two autoscaling configuration types are supported:

* **Fixed capacity mode**. In this mode, the application gateway does not autoscale and operates at a fixed Scale Unit capacity.

   ```azurepowershell
   $sku = New-AzureRmApplicationGatewaySku -Name Standard_v2 -Tier Standard_v2 -Capacity 2
   ```

* **Autoscaling mode**. In this mode, the application gateway autoscales based on the application traffic pattern.

   ```azurepowershell
   $autoscaleConfig = New-AzureRmApplicationGatewayAutoscaleConfiguration -MinCapacity 2
   $sku = New-AzureRmApplicationGatewaySku -Name Standard_v2 -Tier Standard_v2
   ```

## Create the application gateway

Create the application gateway and include redundancy zones and the autoscale configuration.

```azurepowershell
$appgw = New-AzureRmApplicationGateway -Name "AutoscalingAppGw" -Zone 1,2,3 `
  -ResourceGroupName $rg -Location $location -BackendAddressPools $pool `
  -BackendHttpSettingsCollection $setting -GatewayIpConfigurations $ipconfig `
  -FrontendIpConfigurations $fip -FrontendPorts $fp01, $fp02 `
  -HttpListeners $listener01, $listener02 -RequestRoutingRules $rule01, $rule02 `
  -Sku $sku -sslCertificates $sslCert01 -AutoscaleConfiguration $autoscaleConfig
```

## Test the application gateway

Use Get-AzureRmPublicIPAddress to get the public IP address of the application gateway. Copy the public IP address or DNS name, and then paste it into the address bar of your browser.

`Get-AzureRmPublicIPAddress -ResourceGroupName $rg -Name AppGwVIP`

## Clean up resources

First explore the resources that were created with the application gateway. Then, when they're no longer needed, you can use the `Remove-AzureRmResourceGroup` command to remove the resource group, application gateway, and all related resources.

`Remove-AzureRmResourceGroup -Name $rg`

## Next steps

> [!div class="nextstepaction"]
> [Create an application gateway with URL path-based routing rules](./tutorial-url-route-powershell.md)
