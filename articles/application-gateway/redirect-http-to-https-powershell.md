---
title: Create an application gateway with HTTP to HTTPS redirection - Azure PowerShell | Microsoft Docs
description: Learn how to create an application gateway with redirected traffic from HTTP to HTTPS using Azure PowerShell.
services: application-gateway
author: vhorne
manager: jpconnock
editor: tysonn
tags: azure-resource-manager

ms.service: application-gateway
ms.topic: article
ms.workload: infrastructure-services
ms.date: 7/13/2018
ms.author: victorh

---
# Create an application gateway with HTTP to HTTPS redirection using Azure PowerShell

You can use the Azure PowerShell to create an [application gateway](overview.md) with a certificate for SSL termination. A routing rule is used to redirect HTTP traffic to the HTTPS port in your application gateway. In this example, you also create a [virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) for the backend pool of the application gateway that contains two virtual machine instances. 

In this article, you learn how to:

> [!div class="checklist"]
> * Create a self-signed certificate
> * Set up a network
> * Create an application gateway with the certificate
> * Add a listener and redirection rule
> * Create a virtual machine scale set with the default backend pool

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

This tutorial requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). To run the commands in this tutorial, you also need to run `Login-AzAccount` to create a connection with Azure.

## Create a self-signed certificate

For production use, you should import a valid certificate signed by a trusted provider. For this tutorial, you create a self-signed certificate using [New-SelfSignedCertificate](https://docs.microsoft.com/powershell/module/pkiclient/new-selfsignedcertificate). You can use [Export-PfxCertificate](https://docs.microsoft.com/powershell/module/pkiclient/export-pfxcertificate) with the Thumbprint that was returned to export a pfx file from the certificate.

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

Use the thumbprint to create the pfx file:

```powershell
$pwd = ConvertTo-SecureString -String "Azure123456!" -Force -AsPlainText
Export-PfxCertificate `
  -cert cert:\localMachine\my\E1E81C23B3AD33F9B4D1717B20AB65DBB91AC630 `
  -FilePath c:\appgwcert.pfx `
  -Password $pwd
```

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create an Azure resource group named *myResourceGroupAG* using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). 

```powershell
New-AzResourceGroup -Name myResourceGroupAG -Location eastus
```

## Create network resources

Create the subnet configurations for *myBackendSubnet* and *myAGSubnet* using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig). Create the virtual network named *myVNet* using [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) with the subnet configurations. And finally, create the public IP address named *myAGPublicIPAddress* using [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress). These resources are used to provide network connectivity to the application gateway and its associated resources.

```powershell
$backendSubnetConfig = New-AzVirtualNetworkSubnetConfig `
  -Name myBackendSubnet `
  -AddressPrefix 10.0.1.0/24
$agSubnetConfig = New-AzVirtualNetworkSubnetConfig `
  -Name myAGSubnet `
  -AddressPrefix 10.0.2.0/24
$vnet = New-AzVirtualNetwork `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -Name myVNet `
  -AddressPrefix 10.0.0.0/16 `
  -Subnet $backendSubnetConfig, $agSubnetConfig
$pip = New-AzPublicIpAddress `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -Name myAGPublicIPAddress `
  -AllocationMethod Dynamic
```

## Create an application gateway

### Create the IP configurations and frontend port

Associate *myAGSubnet* that you previously created to the application gateway using [New-AzApplicationGatewayIPConfiguration](/powershell/module/az.network/new-azapplicationgatewayipconfiguration). Assign *myAGPublicIPAddress* to the application gateway using [New-AzApplicationGatewayFrontendIPConfig](/powershell/module/az.network/new-azapplicationgatewayfrontendipconfig). And then you can create the HTTPS port using [New-AzApplicationGatewayFrontendPort](/powershell/module/az.network/new-azapplicationgatewayfrontendport).

```powershell
$vnet = Get-AzVirtualNetwork `
  -ResourceGroupName myResourceGroupAG `
  -Name myVNet
$subnet=$vnet.Subnets[0]
$gipconfig = New-AzApplicationGatewayIPConfiguration `
  -Name myAGIPConfig `
  -Subnet $subnet
$fipconfig = New-AzApplicationGatewayFrontendIPConfig `
  -Name myAGFrontendIPConfig `
  -PublicIPAddress $pip
$frontendPort = New-AzApplicationGatewayFrontendPort `
  -Name myFrontendPort `
  -Port 443
```

### Create the backend pool and settings

Create the backend pool named *appGatewayBackendPool* for the application gateway using [New-AzApplicationGatewayBackendAddressPool](/powershell/module/az.network/new-azapplicationgatewaybackendaddresspool). Configure the settings for the backend pool using [New-AzApplicationGatewayBackendHttpSettings](/powershell/module/az.network/new-azapplicationgatewaybackendhttpsetting).

```powershell
$defaultPool = New-AzApplicationGatewayBackendAddressPool `
  -Name appGatewayBackendPool 
$poolSettings = New-AzApplicationGatewayBackendHttpSettings `
  -Name myPoolSettings `
  -Port 80 `
  -Protocol Http `
  -CookieBasedAffinity Enabled `
  -RequestTimeout 120
```

### Create the default listener and rule

A listener is required to enable the application gateway to route traffic appropriately to the backend pool. In this example, you create a basic listener that listens for HTTPS traffic at the root URL. 

Create a certificate object using [New-AzApplicationGatewaySslCertificate](/powershell/module/az.network/new-azapplicationgatewaysslcertificate) and then create a listener named *appGatewayHttpListener* using [New-AzApplicationGatewayHttpListener](/powershell/module/az.network/new-azapplicationgatewayhttplistener) with the frontend configuration, frontend port, and certificate that you previously created. A rule is required for the listener to know which backend pool to use for incoming traffic. Create a basic rule named *rule1* using [New-AzApplicationGatewayRequestRoutingRule](/powershell/module/az.network/new-azapplicationgatewayrequestroutingrule).

```powershell
$pwd = ConvertTo-SecureString `
  -String "Azure123456!" `
  -Force `
  -AsPlainText
$cert = New-AzApplicationGatewaySslCertificate `
  -Name "appgwcert" `
  -CertificateFile "c:\appgwcert.pfx" `
  -Password $pwd
$defaultListener = New-AzApplicationGatewayHttpListener `
  -Name appGatewayHttpListener `
  -Protocol Https `
  -FrontendIPConfiguration $fipconfig `
  -FrontendPort $frontendPort `
  -SslCertificate $cert
$frontendRule = New-AzApplicationGatewayRequestRoutingRule `
  -Name rule1 `
  -RuleType Basic `
  -HttpListener $defaultListener `
  -BackendAddressPool $defaultPool `
  -BackendHttpSettings $poolSettings
```

### Create the application gateway

Now that you created the necessary supporting resources, specify parameters for the application gateway named *myAppGateway* using [New-AzApplicationGatewaySku](/powershell/module/az.network/new-azapplicationgatewaysku), and then create it using [New-AzApplicationGateway](/powershell/module/az.network/new-azapplicationgateway) with the certificate.

```powershell
$sku = New-AzApplicationGatewaySku `
  -Name Standard_Medium `
  -Tier Standard `
  -Capacity 2
$appgw = New-AzApplicationGateway `
  -Name myAppGateway `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -BackendAddressPools $defaultPool `
  -BackendHttpSettingsCollection $poolSettings `
  -FrontendIpConfigurations $fipconfig `
  -GatewayIpConfigurations $gipconfig `
  -FrontendPorts $frontendPort `
  -HttpListeners $defaultListener `
  -RequestRoutingRules $frontendRule `
  -Sku $sku `
  -SslCertificates $cert
```

## Add a listener and redirection rule

### Add the HTTP port

Add the HTTP port to the application gateway using [Add-AzApplicationGatewayFrontendPort](/powershell/module/az.network/add-azapplicationgatewayfrontendport).

```powershell
$appgw = Get-AzApplicationGateway `
  -Name myAppGateway `
  -ResourceGroupName myResourceGroupAG
Add-AzApplicationGatewayFrontendPort `
  -Name httpPort  `
  -Port 80 `
  -ApplicationGateway $appgw
```

### Add the HTTP listener

Add the HTTP listener named *myListener* to the application gateway using [Add-AzApplicationGatewayHttpListener](/powershell/module/az.network/add-azapplicationgatewayhttplistener).

```powershell
$fipconfig = Get-AzApplicationGatewayFrontendIPConfig `
  -Name myAGFrontendIPConfig `
  -ApplicationGateway $appgw
$fp = Get-AzApplicationGatewayFrontendPort `
  -Name httpPort `
  -ApplicationGateway $appgw
Add-AzApplicationGatewayHttpListener `
  -Name myListener `
  -Protocol Http `
  -FrontendPort $fp `
  -FrontendIPConfiguration $fipconfig `
  -ApplicationGateway $appgw
```

### Add the redirection configuration

Add the HTTP to HTTPS redirection configuration to the application gateway using [Add-AzApplicationGatewayRedirectConfiguration](/powershell/module/az.network/add-azapplicationgatewayredirectconfiguration).

```powershell
$defaultListener = Get-AzApplicationGatewayHttpListener `
  -Name appGatewayHttpListener `
  -ApplicationGateway $appgw
Add-AzApplicationGatewayRedirectConfiguration -Name httpToHttps `
  -RedirectType Permanent `
  -TargetListener $defaultListener `
  -IncludePath $true `
  -IncludeQueryString $true `
  -ApplicationGateway $appgw
```

### Add the routing rule

Add the routing rule with the redirection configuration to the application gateway using [Add-AzApplicationGatewayRequestRoutingRule](/powershell/module/az.network/add-azapplicationgatewayrequestroutingrule).

```powershell
$myListener = Get-AzApplicationGatewayHttpListener `
  -Name myListener `
  -ApplicationGateway $appgw
$redirectConfig = Get-AzApplicationGatewayRedirectConfiguration `
  -Name httpToHttps `
  -ApplicationGateway $appgw
Add-AzApplicationGatewayRequestRoutingRule `
  -Name rule2 `
  -RuleType Basic `
  -HttpListener $myListener `
  -RedirectConfiguration $redirectConfig `
  -ApplicationGateway $appgw
Set-AzApplicationGateway -ApplicationGateway $appgw
```

## Create a virtual machine scale set

In this example, you create a virtual machine scale set to provide servers for the backend pool in the application gateway. You assign the scale set to the backend pool when you configure the IP settings.

```powershell
$vnet = Get-AzVirtualNetwork `
  -ResourceGroupName myResourceGroupAG `
  -Name myVNet
$appgw = Get-AzApplicationGateway `
  -ResourceGroupName myResourceGroupAG `
  -Name myAppGateway
$backendPool = Get-AzApplicationGatewayBackendAddressPool `
  -Name appGatewayBackendPool `
  -ApplicationGateway $appgw
$ipConfig = New-AzVmssIpConfig `
  -Name myVmssIPConfig `
  -SubnetId $vnet.Subnets[1].Id `
  -ApplicationGatewayBackendAddressPoolsId $backendPool.Id
$vmssConfig = New-AzVmssConfig `
  -Location eastus `
  -SkuCapacity 2 `
  -SkuName Standard_DS2 `
  -UpgradePolicyMode Automatic
Set-AzVmssStorageProfile $vmssConfig `
  -ImageReferencePublisher MicrosoftWindowsServer `
  -ImageReferenceOffer WindowsServer `
  -ImageReferenceSku 2016-Datacenter `
  -ImageReferenceVersion latest
  -OsDiskCreateOption FromImage
Set-AzVmssOsProfile $vmssConfig `
  -AdminUsername azureuser `
  -AdminPassword "Azure123456!" `
  -ComputerNamePrefix myvmss
Add-AzVmssNetworkInterfaceConfiguration `
  -VirtualMachineScaleSet $vmssConfig `
  -Name myVmssNetConfig `
  -Primary $true `
  -IPConfiguration $ipConfig
New-AzVmss `
  -ResourceGroupName myResourceGroupAG `
  -Name myvmss `
  -VirtualMachineScaleSet $vmssConfig
```

### Install IIS

```powershell
$publicSettings = @{ "fileUris" = (,"https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/application-gateway/iis/appgatewayurl.ps1"); 
  "commandToExecute" = "powershell -ExecutionPolicy Unrestricted -File appgatewayurl.ps1" }
$vmss = Get-AzVmss -ResourceGroupName myResourceGroupAG -VMScaleSetName myvmss
Add-AzVmssExtension -VirtualMachineScaleSet $vmss `
  -Name "customScript" `
  -Publisher "Microsoft.Compute" `
  -Type "CustomScriptExtension" `
  -TypeHandlerVersion 1.8 `
  -Setting $publicSettings
Update-AzVmss `
  -ResourceGroupName myResourceGroupAG `
  -Name myvmss `
  -VirtualMachineScaleSet $vmss
```

## Test the application gateway

You can use [Get-AzPublicIPAddress](/powershell/module/az.network/get-azpublicipaddress) to get the public IP address of the application gateway. Copy the public IP address, and then paste it into the address bar of your browser. For example, http://52.170.203.149

```powershell
Get-AzPublicIPAddress -ResourceGroupName myResourceGroupAG -Name myAGPublicIPAddress
```

![Secure warning](./media/redirect-http-to-https-powershell/application-gateway-secure.png)

To accept the security warning if you used a self-signed certificate, select **Details** and then **Go on to the webpage**. Your secured IIS website is then displayed as in the following example:

![Test base URL in application gateway](./media/redirect-http-to-https-powershell/application-gateway-iistest.png)

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a self-signed certificate
> * Set up a network
> * Create an application gateway with the certificate
> * Add a listener and redirection rule
> * Create a virtual machine scale set with the default backend pool
