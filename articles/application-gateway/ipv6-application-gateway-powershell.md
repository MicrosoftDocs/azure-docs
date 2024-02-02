---
title: Configure Application Gateway with a frontend public IPv6 address using Azure PowerShell (Preview)
description: Learn how to configure Application Gateway with a frontend public IPv6 address using Azure PowerShell.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 08/17/2023
ms.author: greglin
ms.custom: mvc, devx-track-azurepowershell
---

# Configure Application Gateway with a frontend public IPv6 address using Azure PowerShell (Preview)

[Azure Application Gateway](overview.md) supports dual stack (IPv4 and IPv6) frontend connections from clients. To use IPv6 frontend connectivity, you need to create a new Application Gateway. Currently you can’t upgrade existing IPv4 only Application Gateways to dual stack (IPv4 and IPv6) Application Gateways. Also, currently backend IPv6 addresses aren't supported.

To support IPv6 frontend support, you must create a dual stack VNet. This dual stack VNet will have subnets for both IPv4 and IPv6. Azure VNets already [provide dual-stack capability](../virtual-network/ip-services/ipv6-overview.md). 

> [!IMPORTANT]
> Application Gateway IPv6 frontend is currently in PREVIEW.<br>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Overview

Azure PowerShell is used to create an IPv6 Azure Application Gateway. Testing is performed to verify it works correctly.

You learn how to:
* [Register](#register-to-the-preview) and [unregister](#unregister-from-the-preview) from the preview
* Set up the [dual-stack network](#configure-a-dual-stack-subnet-and-backend-subnet)
* Create an application gateway with [IPv6 frontend](#create-application-gateway-frontend-public-ip-addresses)
* Create a virtual machine scale set with the default [backend pool](#create-the-backend-pool-and-settings)

Azure PowerShell is used to create an IPv6 Azure Application Gateway and perform testing to ensure it works correctly. Application gateway can manage and secure web traffic to servers that you maintain. A [virtual machine scale set](../virtual-machine-scale-sets/overview.md) is for backend servers to manage web traffic. The scale set contains two virtual machine instances that are added to the default backend pool of the application gateway. For more information about the components of an application gateway, see [Application gateway components](application-gateway-components.md). 

You can also complete this quickstart using the [Azure portal](ipv6-application-gateway-portal.md)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. To find the version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Login-AzAccount` to create a connection with Azure.

## Regions and availability

The IPv6 Application Gateway preview is available to all public cloud regions where Application Gateway v2 SKU is supported. It's also available in [Microsoft Azure operated by 21Vianet](https://www.azure.cn/) and [Azure Government](https://azure.microsoft.com/overview/clouds/government/)

## Limitations

* Only v2 SKU supports a frontend with both IPv4 and IPv6 addresses
* IPv6 backends are currently not supported
* IPv6 private Link is currently not supported
* IPv6-only Application Gateway is currently not supported. Application Gateway must be dual stack (IPv6 and IPv4)
* Deletion of frontend IP addresses aren't supported
* Existing IPv4 Application Gateways cannot be upgraded to dual stack Application Gateways

> [!NOTE]
> If you use WAF v2 SKU for a frontend with both IPv4 and IPv6 addresses, WAF rules only apply to IPv4 traffic. IPv6 traffic bypasses WAF and may get blocked by some custom rule.


## Register to the preview

> [!NOTE]
> When you join the preview, all new Application Gateways provision with the ability to define a dual stack frontend connection.  If you wish to opt out from the new functionality and return to the current generally available functionality of Application Gateway, you can [unregister from the preview](#unregister-from-the-preview).

For more information about preview features, see [Set up preview features in Azure subscription](../azure-resource-manager/management/preview-features.md)

Use the following commands to enroll into the public preview for IPv6 Application Gateway:

```azurepowershell
Register-AzProviderFeature -FeatureName "AllowApplicationGatewayIPv6" -ProviderNamespace "Microsoft.Network"
```

To view registration status of the feature, use the Get-AzProviderFeature cmdlet.
```Output
FeatureName                                ProviderName        RegistrationState
-----------                                ------------        -----------------
AllowApplicationGatewayIPv6   Microsoft.Network   Registered
```

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create an Azure resource group using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).  

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroupAG -Location eastus
```

## Configure a dual-stack subnet and backend subnet

Configure the subnets named *myBackendSubnet* and *myAGSubnet*  using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig).


```azurepowershell-interactive
$AppGwSubnetPrefix = @("10.0.0.0/24", "ace:cab:deca::/64")
$appgwSubnet = New-AzVirtualNetworkSubnetConfig `
-Name myAGSubnet -AddressPrefix $AppGwSubnetPrefix
$backendSubnet = New-AzVirtualNetworkSubnetConfig `
-Name myBackendSubnet -AddressPrefix  10.0.1.0/24
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
-IpAddressVersion 'IPv4' `
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

### Create the IP configurations and ports

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

Now that you have created the necessary supporting resources, you can specify parameters for the application gateway using [New-AzApplicationGatewaySku](/powershell/module/az.network/new-azapplicationgatewaysku). The new application gateway is created using [New-AzApplicationGateway](/powershell/module/az.network/new-azapplicationgateway).  Creating the application gateway takes a few minutes.

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

## Backend servers

Now that you have created the application gateway, you can create the backend virtual machines to host websites. A backend can be composed of NICs, virtual machine scale sets, public IP addresses, internal IP addresses, fully qualified domain names (FQDN), and multi-tenant backends like Azure App Service.



## Create two virtual machines

In this example, you create two virtual machines to use as backend servers for the application gateway. IIS is installed on the virtual machines to verify that Azure successfully created the application gateway. The scale set is assigned to the backend pool when you configure the IP address settings.

To create the virtual machines, we get the recently created Application Gateway backend pool configuration with *Get-AzApplicationGatewayBackendAddressPool*. This information is used to:
* Create a network interface with *New-AzNetworkInterface*.
* Create a virtual machine configuration with *New-AzVMConfig*.
* Create the virtual machines with *New-AzVM*.

> [!NOTE]
> When you run the following code sample to create virtual machines, Azure prompts you for credentials. Enter your username and password.​ Creation of the VMs takes a few minutes.

```azurepowershell-interactive
$appgw = Get-AzApplicationGateway -ResourceGroupName myResourceGroupAG -Name myipv6AppGW
$backendPool = Get-AzApplicationGatewayBackendAddressPool -Name myAGBackendPool -ApplicationGateway $appgw
$vnet   = Get-AzVirtualNetwork -ResourceGroupName myResourceGroupAG -Name myVNet
$subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name myBackendSubnet
$cred = Get-Credential
for ($i=1; $i -le 2; $i++)
{
  $nic = New-AzNetworkInterface `
    -Name myNic$i `
    -ResourceGroupName myResourceGroupAG `
    -Location EastUS `
    -Subnet $subnet `
    -ApplicationGatewayBackendAddressPool $backendpool
  $vm = New-AzVMConfig `
    -VMName myVM$i `
    -VMSize Standard_DS2_v2
  Set-AzVMOperatingSystem `
    -VM $vm `
    -Windows `
    -ComputerName myVM$i `
    -Credential $cred
  Set-AzVMSourceImage `
    -VM $vm `
    -PublisherName MicrosoftWindowsServer `
    -Offer WindowsServer `
    -Skus 2016-Datacenter `
    -Version latest
  Add-AzVMNetworkInterface `
    -VM $vm `
    -Id $nic.Id
  Set-AzVMBootDiagnostic `
    -VM $vm `
    -Disable
  New-AzVM -ResourceGroupName myResourceGroupAG -Location EastUS -VM $vm
  Set-AzVMExtension `
    -ResourceGroupName myResourceGroupAG `
    -ExtensionName IIS `
    -VMName myVM$i `
    -Publisher Microsoft.Compute `
    -ExtensionType CustomScriptExtension `
    -TypeHandlerVersion 1.4 `
    -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}' `
    -Location EastUS
}
```
## Find the public IP address of Application Gateway

```azurepowershell-interactive
Get-AzPublicIPAddress -ResourceGroupName myResourceGroupAG -Name myAGPublicIPAddress6
```

## Assign a DNS name to the frontend IPv6 address

A DNS name makes testing easier for the IPv6 application gateway. You can assign a public DNS name using your own domain and registrar or you can create a name in azure.com. 

Use the following commands to assign a name in azure.com. The name is set to the label you specify + the region + cloudapp.azure.com. In this example, the AAAA record **myipv6appgw** is created in the namespace **eastus.cloudapp.azure.com**:

```azurepowershell-interactive
$publicIp = Get-AzPublicIpAddress -Name myAGPublicIPAddress6 -ResourceGroupName myResourceGroupAG
$publicIp.DnsSettings = @{"DomainNameLabel" = "myipv6appgw"}
Set-AzPublicIpAddress -PublicIpAddress $publicIp
```

## Test the application gateway

Previously, we assigned the DNS name **myipv6appgw.eastus.cloudapp.azure.com** to the public IPv6 address of the application gateway. To test this connection:

1. Using the Invoke-WebRequest cmdlet, issue a request to the IPv6 frontend.
2. Check the response. A valid response of **myVM1** or **myVM2** verifies that the application gateway was successfully created and can successfully connect with the backend.  If you issue the command several times, the gateway load balances and responds to subsequent requests from a different backend server.

```PowerShell
PS C:\> (Invoke-WebRequest -Uri myipv6appgw.eastus.cloudapp.azure.com).Content
myVM2
```
> [!IMPORTANT]
> If the connection to the DNS name or IPv6 address fails, it might be because you can't browse IPv6 addresses from your device. To check if this is your problem, also test the IPv4 address of the application gateway. If the IPv4 address connects successfully, then it's likely you don't have a public IPv6 address assigned to your device. If this is the case, you can try testing the connection with a [dual-stack VM](../virtual-network/ip-services/create-vm-dual-stack-ipv6-portal.md).

## Clean up resources

When no longer needed, remove the resource group, application gateway, and all related resources using [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup).

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroupAG
```

## Unregister from the preview

Use the following commands to opt out of the public preview for IPv6 Application Gateway:

```azurepowershell
Unregister-AzProviderFeature -FeatureName "AllowApplicationGatewayIPv6" -ProviderNamespace "Microsoft.Network"
```

To view registration status of the feature, use the Get-AzProviderFeature cmdlet.
```Output
FeatureName                   ProviderName        RegistrationState
-----------                   ------------        -----------------
AllowApplicationGatewayIPv6   Microsoft.Network   Unregistered
```

## Next steps

- [What is Azure Application Gateway v2?](overview-v2.md)
- [Troubleshoot Bad Gateway](application-gateway-troubleshooting-502.md)
