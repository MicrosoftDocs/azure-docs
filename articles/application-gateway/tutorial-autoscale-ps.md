---
title: 'Tutorial: Improve web application access - Azure Application Gateway'
description: In this tutorial, learn how to create an autoscaling, zone-redundant application gateway with a reserved IP address using Azure PowerShell.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: tutorial
ms.date: 03/08/2021
ms.author: greglin
ms.custom: mvc, devx-track-azurepowershell
#Customer intent: As an IT administrator new to Application Gateway, I want to configure the service in a way that automatically scales based on customer demand and is highly available across availability zones to ensure my customers can access their web applications when they need them.
---
# Tutorial: Create an application gateway that improves web application access

If you're an IT admin concerned with improving web application access, you can optimize your application gateway to scale based on customer demand and span multiple availability zones. This tutorial helps you configure Azure Application Gateway features that do that: autoscaling, zone redundancy, and reserved VIPs (static IP). You'll use Azure PowerShell cmdlets and the Azure Resource Manager deployment model to solve the problem.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a self-signed certificate
> * Create an autoscale virtual network
> * Create a reserved public IP
> * Set up your application gateway infrastructure
> * Specify autoscale
> * Create the application gateway
> * Test the application gateway

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

This tutorial requires that you run an administrative Azure PowerShell session locally. You must have Azure PowerShell module version 1.0.0 or later installed. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). After you verify the PowerShell version, run `Connect-AzAccount` to create a connection with Azure.

## Sign in to Azure

```azurepowershell
Connect-AzAccount
Select-AzSubscription -Subscription "<sub name>"
```

## Create a resource group
Create a resource group in one of the available locations.

```azurepowershell
$location = "East US 2"
$rg = "AppGW-rg"

#Create a new Resource Group
New-AzResourceGroup -Name $rg -Location $location
```

## Create a self-signed certificate

For production use, you should import a valid certificate signed by trusted provider. For this tutorial, you create a self-signed certificate using [New-SelfSignedCertificate](/powershell/module/pki/new-selfsignedcertificate). You can use [Export-PfxCertificate](/powershell/module/pki/export-pfxcertificate) with the Thumbprint that was returned to export a pfx file from the certificate.

```powershell
New-SelfSignedCertificate `
  -certstorelocation cert:\localmachine\my `
  -dnsname www.contoso.com
```

You should see something like this result:

```
PSParentPath: Microsoft.PowerShell.Security\Certificate::LocalMachine\my

Thumbprint                                Subject
----------                                -------
E1E81C23B3AD33F9B4D1717B20AB65DBB91AC630  CN=www.contoso.com
```

Use the thumbprint to create the pfx file. Replace *\<password>* with a password of your choice:

```powershell
$pwd = ConvertTo-SecureString -String "<password>" -Force -AsPlainText

Export-PfxCertificate `
  -cert cert:\localMachine\my\E1E81C23B3AD33F9B4D1717B20AB65DBB91AC630 `
  -FilePath c:\appgwcert.pfx `
  -Password $pwd
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
       -location $location -AllocationMethod Static -Sku Standard -Zone 1,2,3
```

## Retrieve details

Retrieve details of the resource group, subnet, and IP in a local object to create the IP configuration details for the application gateway.

```azurepowershell
$publicip = Get-AzPublicIpAddress -ResourceGroupName $rg -name "AppGwVIP"
$vnet = Get-AzvirtualNetwork -Name "AutoscaleVNet" -ResourceGroupName $rg
$gwSubnet = Get-AzVirtualNetworkSubnetConfig -Name "AppGwSubnet" -VirtualNetwork $vnet
```

## Create web apps

Configure two web apps for the backend pool. Replace *\<site1-name>* and *\<site-2-name>* with unique names in the `azurewebsites.net` domain.

```azurepowershell
New-AzAppServicePlan -ResourceGroupName $rg -Name "ASP-01"  -Location $location -Tier Basic `
   -NumberofWorkers 2 -WorkerSize Small
New-AzWebApp -ResourceGroupName $rg -Name <site1-name> -Location $location -AppServicePlan ASP-01
New-AzWebApp -ResourceGroupName $rg -Name <site2-name> -Location $location -AppServicePlan ASP-01
```

## Configure the infrastructure

Configure the IP config, frontend IP config, backend pool, HTTP settings, certificate, port, listener, and rule in an identical format to the existing Standard application gateway. The new SKU follows the same object model as the Standard SKU.

Replace your two web app FQDNs (for example: `mywebapp.azurewebsites.net`) in the $pool variable definition.

```azurepowershell
$ipconfig = New-AzApplicationGatewayIPConfiguration -Name "IPConfig" -Subnet $gwSubnet
$fip = New-AzApplicationGatewayFrontendIPConfig -Name "FrontendIPCOnfig" -PublicIPAddress $publicip
$pool = New-AzApplicationGatewayBackendAddressPool -Name "Pool1" `
       -BackendIPAddresses <your first web app FQDN>, <your second web app FQDN>
$fp01 = New-AzApplicationGatewayFrontendPort -Name "SSLPort" -Port 443
$fp02 = New-AzApplicationGatewayFrontendPort -Name "HTTPPort" -Port 80

$securepfxpwd = ConvertTo-SecureString -String "Azure123456!" -AsPlainText -Force
$sslCert01 = New-AzApplicationGatewaySslCertificate -Name "SSLCert" -Password $securepfxpwd `
            -CertificateFile "c:\appgwcert.pfx"
$listener01 = New-AzApplicationGatewayHttpListener -Name "SSLListener" `
             -Protocol Https -FrontendIPConfiguration $fip -FrontendPort $fp01 -SslCertificate $sslCert01
$listener02 = New-AzApplicationGatewayHttpListener -Name "HTTPListener" `
             -Protocol Http -FrontendIPConfiguration $fip -FrontendPort $fp02

$setting = New-AzApplicationGatewayBackendHttpSettings -Name "BackendHttpSetting1" `
          -Port 80 -Protocol Http -CookieBasedAffinity Disabled -PickHostNameFromBackendAddress
$rule01 = New-AzApplicationGatewayRequestRoutingRule -Name "Rule1" -RuleType basic `
         -BackendHttpSettings $setting -HttpListener $listener01 -BackendAddressPool $pool
$rule02 = New-AzApplicationGatewayRequestRoutingRule -Name "Rule2" -RuleType basic `
         -BackendHttpSettings $setting -HttpListener $listener02 -BackendAddressPool $pool
```

## Specify autoscale

Now you can specify the autoscale configuration for the application gateway. 

   ```azurepowershell
   $autoscaleConfig = New-AzApplicationGatewayAutoscaleConfiguration -MinCapacity 2
   $sku = New-AzApplicationGatewaySku -Name Standard_v2 -Tier Standard_v2
   ```
In this mode, the application gateway autoscales based on the application traffic pattern.

## Create the application gateway

Create the application gateway and include redundancy zones and the autoscale configuration.

```azurepowershell
$appgw = New-AzApplicationGateway -Name "AutoscalingAppGw" -Zone 1,2,3 `
  -ResourceGroupName $rg -Location $location -BackendAddressPools $pool `
  -BackendHttpSettingsCollection $setting -GatewayIpConfigurations $ipconfig `
  -FrontendIpConfigurations $fip -FrontendPorts $fp01, $fp02 `
  -HttpListeners $listener01, $listener02 -RequestRoutingRules $rule01, $rule02 `
  -Sku $sku -sslCertificates $sslCert01 -AutoscaleConfiguration $autoscaleConfig
```

## Test the application gateway

Use Get-AzPublicIPAddress to get the public IP address of the application gateway. Copy the public IP address or DNS name, and then paste it into the address bar of your browser.

```azurepowershell
$pip = Get-AzPublicIPAddress -ResourceGroupName $rg -Name AppGwVIP
$pip.IpAddress
```


## Clean up resources

First explore the resources that were created with the application gateway. Then, when they're no longer needed, you can use the `Remove-AzResourceGroup` command to remove the resource group, application gateway, and all related resources.

`Remove-AzResourceGroup -Name $rg`

## Next steps

> [!div class="nextstepaction"]
> [Create an application gateway with URL path-based routing rules](./tutorial-url-route-powershell.md)
