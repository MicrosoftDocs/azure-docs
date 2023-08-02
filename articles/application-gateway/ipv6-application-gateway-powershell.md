---
title: Configure Application Gateway with a frontend public IPv6 address using Azure PowerShell (Public Preview)
description: Learn how to configure Application Gateway with a frontend public IPv6 address using Azure PowerShell.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 07/26/2023
ms.author: greglin
ms.custom: mvc, devx-track-azurepowershell
---
# Configure Application Gateway with a frontend public IPv6 address using Azure PowerShell

Azure Application gateway now supports dual stack frontend connections. Application Gateway can now handle client traffic from both IPv4 and IPv6 addresses, providing greater flexibility and connectivity for our users. Azure VNETs already provides dual-stack capability. To learn more about Azure VNETs dual-stack capability check [IPv6 for Azure Virtual Network](https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/ipv6-overview).

If you are currently using Application Gateway with IPv4 addresses, you can continue to do so without any changes. However, if you want to take advantage of the benefits of IPv6 addressing, you can now do so by configuring your gateway to use IPv6 addresses. Currently we do not support connectivity to IPv6 backends. To support IPv6 connectivity, you must create a dual-stack VNET. This dual-stack VNET will have subnets for both IPv4 and IPv6.

Limitations
* Supported for Application Gateway Standard V2 only.
* No support  for upgrading the existing gateways to Ipv6.
* No support  for IPv6 private address.
* No support for IPv6 backend.
* No IPv6 Private Link Support

In this article, you use the powershell to create an IPv6 [Azure Application Gateway](overview.md) and test it to ensure it works correctly. Application gateway is used to manage and secure web traffic to servers that you maintain. We will use a [virtual machine scale set](../virtual-machine-scale-sets/overview.md) for backend servers to manage web traffic. In this example, the scale set contains two virtual machine instances that are added to the default backend pool of the application gateway.

In this article, you learn how to:

* Set up the dual-stack network
* Create an application gateway with IPv6 frontend
* Create a virtual machine scale set with the default backend pool



If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.



If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. To find the version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Login-AzAccount` to create a connection with Azure.

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create an Azure resource group using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).  

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroupAG -Location eastus
```

## Create a dual-stack subnet

Configure the subnets named *myBackendSubnet* and *myAGSubnet*  using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig).


```azurepowershell-interactive

$AppGwSubnetPrefix = @("10.0.0.0/24", "ace:cab:deca::/64")

$appgwSubnet = New-AzVirtualNetworkSubnetConfig `
-Name myAGSubnet ` 
-AddressPrefix $AppGwSubnetPrefix

$backendSubnet = New-AzVirtualNetworkSubnetConfig `
-Name myBackendSubnet `
-AddressPrefix  10.0.1.0/24
```


## Create a dual stack virtual network

```azurepowershell-interactive

$VnetPrefix = @("10.0.0.0/16", "ace:cab:deca::/48")

$vnet = New-AzVirtualNetwork `
-Name myVNet `
-ResourceGroupName myResourceGroupAG `
-Location eastus `   
-AddressPrefix $VnetPrefix `    
-Subnet @($appgwSubnet, $backendSubnet)
```

## Create Application Gateway Frontend public IP addresses

```azurepowershell-interactive

$pipv4 = New-AzPublicIpAddress `   
-Name myAGPublicIPAddress4 `  
-ResourceGroupName myResourceGroupAG `   
-Location eastus `   
-Sku 'Standard' `  
-AllocationMethod 'Static' `    
-IpAddressVersion 'IPv4'  
-Force

$pipv6 = New-AzPublicIpAddress `    
-Name myAGPublicIPAddress6 `   
-ResourceGroupName myResourceGroupAG `
-Location eastus `
-Sku 'Standard' `   
-AllocationMethod 'Static' `   
-IpAddressVersion 'IPv6' `    
-Force
```

### Create the IP configurations, ports and listeners

Associate *myAGSubnet* that you previously created to the application gateway using [New-AzApplicationGatewayIPConfiguration](/powershell/module/az.network/new-azapplicationgatewayipconfiguration). Assign *myAGPublicIPAddress* to the application gateway using [New-AzApplicationGatewayFrontendIPConfig](/powershell/module/az.network/new-azapplicationgatewayfrontendipconfig).

```azurepowershell-interactive
$vnet   = Get-AzVirtualNetwork ` 
-ResourceGroupName myResourceGroupAG `  
-Name myVNet

$subnet = Get-AzVirtualNetworkSubnetConfig `
-VirtualNetwork $vnet `
-Name myAGSubnet

$gipconfig = New-AzApplicationGatewayIPConfiguration `  
-Name myAGIPConfig `  
-Subnet $subnet

$fipconfigv4 = New-AzApplicationGatewayFrontendIPConfig `   
-Name myAGFrontendIPv4Config `  
-PublicIPAddress $pipv4

$fipconfigv6 = New-AzApplicationGatewayFrontendIPConfig `  
-Name myAGFrontendIPv6Config `  
-PublicIPAddress $pipv6

$frontendport = New-AzApplicationGatewayFrontendPort `
-Name myAGFrontendIPv6Config `
-Port 80

```

### Create the backend pool and settings

Create the backend pool named *appGatewayBackendPool* for the application gateway using [New-AzApplicationGatewayBackendAddressPool](/powershell/module/az.network/new-azapplicationgatewaybackendaddresspool). Configure the settings for the backend address pools using [New-AzApplicationGatewayBackendHttpSettings](/powershell/module/az.network/new-azapplicationgatewaybackendhttpsetting).

```azurepowershell-interactive
$backendPool = New-AzApplicationGatewayBackendAddressPool `   
-Name myAGBackendPool
$poolSettings = New-AzApplicationGatewayBackendHttpSetting `   
-Name myPoolSettings `   
-Port 80 `
-Protocol Http `   
-CookieBasedAffinity Enabled `  
-RequestTimeout 30

```

### Create the default listener and rule

A listener is required to enable the application gateway to route traffic appropriately to the backend pool. In this example, you create a basic listener that listens for traffic at the root URL. 

Create a listener named *mydefaultListener* using [New-AzApplicationGatewayHttpListener](/powershell/module/az.network/new-azapplicationgatewayhttplistener) with the frontend configuration and frontend port that you previously created. A rule is required for the listener to know which backend pool to use for incoming traffic. Create a basic rule named *rule1* using [New-AzApplicationGatewayRequestRoutingRule](/powershell/module/az.network/new-azapplicationgatewayrequestroutingrule).

```azurepowershell-interactive
$listenerv4 = New-AzApplicationGatewayHttpListener `    
-Name myAGListnerv4 ` 
-Protocol Http `  
-FrontendIPConfiguration $fipconfigv4 `  
-FrontendPort $frontendport

$listenerv6 = New-AzApplicationGatewayHttpListener `
-Name myAGListnerv6 `    
-Protocol Http `    
-FrontendIPConfiguration $fipconfigv6 `
-FrontendPort $frontendport

$frontendRulev4 = New-AzApplicationGatewayRequestRoutingRule `   
-Name ruleIPv4 ` 
-RuleType Basic `   
-Priority 10 `  
-HttpListener $listenerv4 `
-BackendAddressPool $backendPool `   
-BackendHttpSettings $poolSettings 
 
 
$frontendRulev6 = New-AzApplicationGatewayRequestRoutingRule `  
-Name ruleIPv6 ` 
-RuleType Basic `
-Priority 1 `  
-HttpListener $listenerv6 `  
-BackendAddressPool $backendPool `   
-BackendHttpSettings $poolsettings

```

### Create the application gateway

Now that you created the necessary supporting resources, specify parameters for the application gateway using [New-AzApplicationGatewaySku](/powershell/module/az.network/new-azapplicationgatewaysku), and then create it using [New-AzApplicationGateway](/powershell/module/az.network/new-azapplicationgateway).

```azurepowershell-interactive
$sku = New-AzApplicationGatewaySku `
  -Name Standard_v2 `
  -Tier Standard_v2 `
  -Capacity 2



New-AzApplicationGateway `   
-Name myipv6AppGW `  
-ResourceGroupName myResourceGroupAG `  
-Location eastus `  
-BackendAddressPools $backendPool `  
-BackendHttpSettingsCollection $poolsettings `  
-FrontendIpConfigurations @($fipconfigv4, $fipconfigv6) `  
-GatewayIpConfigurations $gipconfig `  
-FrontendPorts $frontendport `  
-HttpListeners @($listenerv4, $listenerv6) `   
-RequestRoutingRules @($frontendRulev4, $frontendRulev6) `
-Sku $sku `   
-Force
```

## Create a virtual machine scale set

In this example, you create a virtual machine scale set to provide servers for the backend pool in the application gateway. You assign the scale set to the backend pool when you configure the IP settings.

```azurepowershell-interactive
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
  -SubnetId $vnet.Subnets[0].Id `
  -ApplicationGatewayBackendAddressPoolsId $backendPool.Id

$vmssConfig = New-AzVmssConfig `
  -Location eastus `
  -SkuCapacity 2 `
  -SkuName Standard_DS2_v2 `
  -UpgradePolicyMode Automatic

Set-AzVmssStorageProfile $vmssConfig `
  -ImageReferencePublisher MicrosoftWindowsServer `
  -ImageReferenceOffer WindowsServer `
  -ImageReferenceSku 2016-Datacenter `
  -ImageReferenceVersion latest `
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

```azurepowershell-interactive
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

Use [Get-AzPublicIPAddress](/powershell/module/az.network/get-azpublicipaddress) to get the public IP address of the application gateway. Update the DNS with  public IP4 and IPv6 address, and then use the browser to test the Application Gateway

```azurepowershell-interactive
Get-AzPublicIPAddress -ResourceGroupName myResourceGroupAG -Name myAGPublicIPAddress
```

![Test base URL in application gateway](./media/tutorial-manage-web-traffic-powershell/tutorial-iistest.png)

## Clean up resources

When no longer needed, remove the resource group, application gateway, and all related resources using [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup).

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroupAG
```

## Next steps

[Restrict web traffic with a web application firewall](../web-application-firewall/ag/tutorial-restrict-web-traffic-powershell.md)
