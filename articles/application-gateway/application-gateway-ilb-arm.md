---
title: Using Azure Application Gateway with Internal Load Balancer - PowerShell | Microsoft Docs
description: This page provides instructions to create, configure, start, and delete an Azure application gateway with internal load balancer (ILB) for Azure Resource Manager
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.assetid: 75cfd5a2-e378-4365-99ee-a2b2abda2e0d
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/23/2017
ms.author: gwallace

---
# Create an application gateway with an internal load balancer (ILB) by using Azure Resource Manager

> [!div class="op_single_selector"]
> * [Azure Classic PowerShell](application-gateway-ilb.md)
> * [Azure Resource Manager PowerShell](application-gateway-ilb-arm.md)

Azure Application Gateway can be configured with an Internet-facing VIP or with an internal endpoint that is not exposed to the Internet, also known as an internal load balancer (ILB) endpoint. Configuring the gateway with an ILB is useful for internal line-of-business applications that are not exposed to the Internet. It's also useful for services and tiers within a multi-tier application that sit in a security boundary that is not exposed to the Internet but still require round-robin load distribution, session stickiness, or Secure Sockets Layer (SSL) termination.

This article walks you through the steps to configure an application gateway with an ILB.

## Before you begin

1. Install the latest version of the Azure PowerShell cmdlets by using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Downloads page](https://azure.microsoft.com/downloads/).
2. You create a virtual network and a subnet for Application Gateway. Make sure that no virtual machines or cloud deployments are using the subnet. Application Gateway must be by itself in a virtual network subnet.
3. The servers that you configure to use the application gateway must exist or have their endpoints created either in the virtual network or with a public IP/VIP assigned.

## What is required to create an application gateway?

* **Back-end server pool:** The list of IP addresses of the back-end servers. The IP addresses listed should either belong to the virtual network but in a different subnet for the application gateway or should be a public IP/VIP.
* **Back-end server pool settings:** Every pool has settings like port, protocol, and cookie-based affinity. These settings are tied to a pool and are applied to all servers within the pool.
* **Front-end port:** This port is the public port that is opened on the application gateway. Traffic hits this port, and then gets redirected to one of the back-end servers.
* **Listener:** The listener has a front-end port, a protocol (Http or Https, these are case-sensitive), and the SSL certificate name (if configuring SSL offload).
* **Rule:** The rule binds the listener and the back-end server pool and defines which back-end server pool the traffic should be directed to when it hits a particular listener. Currently, only the *basic* rule is supported. The *basic* rule is round-robin load distribution.

## Create an application gateway

The difference between using Azure Classic and Azure Resource Manager is the order in which you create the application gateway and the items that need to be configured.
With Resource Manager, all items that make an application gateway is configured individually and then put together to create the application gateway resource.

Here are the steps that are needed to create an application gateway:

1. Create a resource group for Resource Manager
2. Create a virtual network and a subnet for the application gateway
3. Create an application gateway configuration object
4. Create an application gateway resource

## Create a resource group for Resource Manager

Make sure that you switch PowerShell mode to use the Azure Resource Manager cmdlets. More info is available at [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

### Step 1

```powershell
Login-AzureRmAccount
```

### Step 2

Check the subscriptions for the account.

```powershell
Get-AzureRmSubscription
```

You are prompted to authenticate with your credentials.

### Step 3

Choose which of your Azure subscriptions to use.

```powershell
Select-AzureRmSubscription -Subscriptionid "GUID of subscription"
```

### Step 4

Create a new resource group (skip this step if you're using an existing resource group).

```powershell
New-AzureRmResourceGroup -Name appgw-rg -location "West US"
```

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. Make sure that all commands to create an application gateway uses the same resource group.

In the preceding example, we created a resource group called "appgw-rg" and location "West US".

## Create a virtual network and a subnet for the application gateway

The following example shows how to create a virtual network by using Resource Manager:

### Step 1

```powershell
$subnetconfig = New-AzureRmVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24
```

This step assigns the address range 10.0.0.0/24 to a subnet variable to be used to create a virtual network.

### Step 2

```powershell
$vnet = New-AzureRmVirtualNetwork -Name appgwvnet -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $subnetconfig
```

This step creates a virtual network named "appgwvnet" in resource group "appgw-rg" for the West US region using the prefix 10.0.0.0/16 with subnet 10.0.0.0/24.

### Step 3

```powershell
$subnet = $vnet.subnets[0]
```

This step assigns the subnet object to variable $subnet for the next steps.

## Create an application gateway configuration object

### Step 1

```powershell
$gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet
```

This step creates an application gateway IP configuration named "gatewayIP01". When Application Gateway starts, it picks up an IP address from the subnet configured and route network traffic to the IP addresses in the back-end IP pool. Keep in mind that each instance takes one IP address.

### Step 2

```powershell
$pool = New-AzureRmApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 134.170.185.46, 134.170.188.221,134.170.185.50
```

This step configures the back-end IP address pool named "pool01" with IP addresses "134.170.185.46, 134.170.188.221,134.170.185.50". Those are the IP addresses that receive the network traffic that comes from the front-end IP endpoint. You replace the preceding IP addresses to add your own application IP address endpoints.

### Step 3

```powershell
$poolSetting = New-AzureRmApplicationGatewayBackendHttpSettings -Name poolsetting01 -Port 80 -Protocol Http -CookieBasedAffinity Disabled
```

This step configures application gateway setting "poolsetting01" for the load balanced network traffic in the back-end pool.

### Step 4

```powershell
$fp = New-AzureRmApplicationGatewayFrontendPort -Name frontendport01  -Port 80
```

This step configures the front-end IP port named "frontendport01" for the ILB.

### Step 5

```powershell
$fipconfig = New-AzureRmApplicationGatewayFrontendIPConfig -Name fipconfig01 -Subnet $subnet
```

This step creates the front-end IP configuration called "fipconfig01" and associates it with a private IP from the current virtual network subnet.

### Step 6

```powershell
$listener = New-AzureRmApplicationGatewayHttpListener -Name listener01  -Protocol Http -FrontendIPConfiguration $fipconfig -FrontendPort $fp
```

This step creates the listener called "listener01" and associates the front-end port to the front-end IP configuration.

### Step 7

```powershell
$rule = New-AzureRmApplicationGatewayRequestRoutingRule -Name rule01 -RuleType Basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool
```

This step creates the load balancer routing rule called "rule01" that configures the load balancer behavior.

### Step 8

```powershell
$sku = New-AzureRmApplicationGatewaySku -Name Standard_Small -Tier Standard -Capacity 2
```

This step configures the instance size of the application gateway.

> [!NOTE]
> The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. You can choose between Standard_Small, Standard_Medium, and Standard_Large.

## Create an application gateway by using New-AzureApplicationGateway

Creates an application gateway with all configuration items from the preceding steps. In this example, the application gateway is called "appgwtest".

```powershell
$appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Location "West US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku
```

This step creates an application gateway with all configuration items from the preceding steps. In the example, the application gateway is called "appgwtest".

## Delete an application gateway

To delete an application gateway, you need to do the following steps in order:

1. Use the `Stop-AzureRmApplicationGateway` cmdlet to stop the gateway.
2. Use the `Remove-AzureRmApplicationGateway` cmdlet to remove the gateway.
3. Verify that the gateway has been removed by using the `Get-AzureApplicationGateway` cmdlet.

### Step 1

Get the application gateway object and associate it to a variable "$getgw".

```powershell
$getgw =  Get-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg
```

### Step 2

Use `Stop-AzureRmApplicationGateway` to stop the application gateway. This sample shows the `Stop-AzureRmApplicationGateway` cmdlet on the first line, followed by the output.

```powershell
Stop-AzureRmApplicationGateway -ApplicationGateway $getgw  
```

```
VERBOSE: 9:49:34 PM - Begin Operation: Stop-AzureApplicationGateway
VERBOSE: 10:10:06 PM - Completed Operation: Stop-AzureApplicationGateway
Name       HTTP Status Code     Operation ID                             Error
----       ----------------     ------------                             ----
Successful OK                   ce6c6c95-77b4-2118-9d65-e29defadffb8
```

Once the application gateway is in a stopped state, use the `Remove-AzureRmApplicationGateway` cmdlet to remove the service.

```powershell
Remove-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Force
```

```
VERBOSE: 10:49:34 PM - Begin Operation: Remove-AzureApplicationGateway
VERBOSE: 10:50:36 PM - Completed Operation: Remove-AzureApplicationGateway
Name       HTTP Status Code     Operation ID                             Error
----       ----------------     ------------                             ----
Successful OK                   055f3a96-8681-2094-a304-8d9a11ad8301
```

> [!NOTE]
> The **-force** switch can be used to suppress the remove confirmation message.

To verify that the service has been removed, you can use the `Get-AzureRmApplicationGateway` cmdlet. This step is not required.

```powershell
Get-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg
```

```
VERBOSE: 10:52:46 PM - Begin Operation: Get-AzureApplicationGateway

Get-AzureApplicationGateway : ResourceNotFound: The gateway does not exist.
```

## Next steps

If you want to configure SSL offload, see [Configure an application gateway for SSL offload](application-gateway-ssl.md).

If you want to configure an application gateway to use with an ILB, see [Create an application gateway with an internal load balancer (ILB)](application-gateway-ilb.md).

If you want more information about load balancing options in general, see:

* [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
* [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)

