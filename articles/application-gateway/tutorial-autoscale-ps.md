---
title: Create an autoscaling, zone redundant application gateway with a reserved IP address - Azure PowerShell
description: Learn how to create an autoscaling, zone redundant application gateway with a reserved IP address using Azure Powershell.
services: application-gateway
author: amitsriva
ms.service: application-gateway
ms.topic: tutorial
ms.date: 9/26/2018
ms.author: victorh
ms.custom: mvc
#Customer intent: As an IT administrator, I want to use Azure PowerShell to configure an autoscaling, zone redundant application gateway with a reserved IP address so I can ensure my customers can access the web information they need.
---
# Tutorial: Create an autoscaling, zone redundant application gateway with a reserved virtual IP address using Azure PowerShell

This tutorial describes how to create an Azure Application Gateway using Azure PowerShell cmdlets and the Azure Resource Manager deployment model. This tutorial focuses on differences in the new Autoscaling SKU compared to the existing Standard SKU. Specifically, the features to support autoscaling, zone redundancy, and reserved VIPs (static IP).

For more information about application gateway autoscaling and zone redundancy, see [Autoscaling and Zone-redundant Application Gateway (Public Preview)](application-gateway-autoscaling-zone-redundant.md).

> [!IMPORTANT]
> The autoscaling and zone-redundant application gateway SKU is currently in public preview. This preview is provided without a service level agreement and is not recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up the auto scale configuration parameter
> * Use the zone parameter
> * Use a static VIP
> * Create the application gateway


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This tutorial requires that you run Azure PowerShell locally. You must have Azure PowerShell module version 6.9.0 or later installed. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-azurerm-ps). After you verify the PowerShell version, run `Login-AzureRmAccount` to create a connection with Azure.

## Sign in to your Azure account

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

## Create a VNet
Create a VNet with one dedicated subnet for an autoscaling application gateway. Currently only one autoscaling application gateway can be deployed in each dedicated subnet.

```azurepowershell
#Create VNet with two subnets
$sub1 = New-AzureRmVirtualNetworkSubnetConfig -Name "AppGwSubnet" -AddressPrefix "10.0.0.0/24"
$sub2 = New-AzureRmVirtualNetworkSubnetConfig -Name "BackendSubnet" -AddressPrefix "10.0.1.0/24"
$vnet = New-AzureRmvirtualNetwork -Name "AutoscaleVNet" -ResourceGroupName $rg `
       -Location $location -AddressPrefix "10.0.0.0/16" -Subnet $sub1, $sub2
```

## Create a reserved public IP

Specifying the allocation method of PublicIPAddress as **Static**. An autoscaling application gateway VIP can only be static. Dynamic IPs are not supported. Only the standard PublicIpAddress SKU is supported.

```azurepowershell
#Create static public IP
$pip = New-AzureRmPublicIpAddress -ResourceGroupName $rg -name "AppGwVIP" `
       -location $location -AllocationMethod Static -Sku Standard
```

## Retrieve details

Retrieve details of the resource group, subnet, and IP in a local object to create the application gateway IP configuration details.

```azurepowershell
$resourceGroup = Get-AzureRmResourceGroup -Name $rg
$publicip = Get-AzureRmPublicIpAddress -ResourceGroupName $rg -name "AppGwVIP"
$vnet = Get-AzureRmvirtualNetwork -Name "AutoscaleVNet" -ResourceGroupName $rg
$gwSubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name "AppGwSubnet" -VirtualNetwork $vnet
```
## Configure application gateway infrastructure
Configure the IP config, frontend IP config, backend pool, http settings, certificate, port, listener, and rule in identical format to existing Standard Application Gateway. The new SKU follows the same object model as the Standard SKU.

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

Now you can specify autoscale configuration for the application gateway. Two autoscaling configuration types are supported:

- **Fixed capacity mode**. In this mode, the application gateway does not autoscale and operates at a fixed Scale Unit capacity.

   ```azurepowershell
   $sku = New-AzureRmApplicationGatewaySku -Name Standard_v2 -Tier Standard_v2 -Capacity 2
   ```
- **Autoscaling mode**. In this mode, the application gateway autoscales based on the application traffic pattern.

   ```azurepowershell
   $autoscaleConfig = New-AzureRmApplicationGatewayAutoscaleConfiguration -MinCapacity 2
   $sku = New-AzureRmApplicationGatewaySku -Name Standard_v2 -Tier Standard_v2
   ```

## Create the application gateway

Create Application Gateway and include redundancy zones. 

The zone configuration is supported only in regions where Azure Zones is available. In regions where Azure Zones is not available, the zone parameter should not be used. An application gateway can also be deployed in a single zone, two zone, or all three zones. The PublicIPAddress for a single zone application gateway must be bound to the same zone. For two or three zone redundant application gateway, the PublicIPAddress must be zone redundant as well, so no zone specified.

```azurepowershell
$appgw = New-AzureRmApplicationGateway -Name "AutoscalingAppGw" -Zone 1,2,3 `
  -ResourceGroupName $rg -Location $location -BackendAddressPools $pool `
  -BackendHttpSettingsCollection $setting -GatewayIpConfigurations $ipconfig `
  -FrontendIpConfigurations $fip -FrontendPorts $fp01, $fp02 `
  -HttpListeners $listener01, $listener02 -RequestRoutingRules $rule01, $rule02 `
  -Sku $sku -sslCertificates $sslCert01 -AutoscaleConfiguration $autoscaleConfig
```

## Test the application gateway

Use [Get-AzureRmPublicIPAddress](https://docs.microsoft.com/powershell/module/azurerm.network/get-azurermpublicipaddress) to get the public IP address of the application gateway. Copy the public IP address or DNS name, and then paste it into the address bar of your browser.

`Get-AzureRmPublicIPAddress -ResourceGroupName $rg -Name AppGwVIP`

## Clean up resources
First explore the resources that were created with the application gateway, and then when no longer needed, you can use the `Remove-AzureRmResourceGroup` command to remove the resource group, application gateway, and all related resources.

`Remove-AzureRmResourceGroup -Name $rg`

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Use a static VIP
> * Set up the auto scale configuration parameter
> * Use the zone parameter
> * Create the application gateway

> [!div class="nextstepaction"]
> [Create an application gateway with URL path-based routing rules](./tutorial-url-route-powershell.md)
