---
title: Use with Internal Load Balancer - Azure Application Gateway
description: This article provides instructions to create, configure, start, and delete an Azure application gateway with internal load balancer (ILB)
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 09/13/2022
ms.author: greglin 
ms.custom: devx-track-azurepowershell
---

# Create an application gateway with an internal load balancer (ILB)

Azure Application Gateway Standard v1 can be configured with an Internet-facing VIP or with an internal endpoint that is not exposed to the Internet, also known as an internal load balancer (ILB) endpoint. Configuring the gateway with an ILB is useful for internal line-of-business applications that are not exposed to the Internet. It's also useful for services and tiers within a multi-tier application that sit in a security boundary that is not exposed to the Internet but still require round-robin load distribution, session stickiness, or Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), termination.

This article walks you through the steps to configure a Standard v1 Application Gateway with an ILB.

## Before you begin

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

1. Install the latest version of the Azure PowerShell module by following the [install instructions](/powershell/azure/install-azure-powershell).
2. You create a virtual network and a subnet for Application Gateway. Make sure that no virtual machines or cloud deployments are using the subnet. Application Gateway must be by itself in a virtual network subnet.
3. The servers that you configure to use the application gateway must exist or have their endpoints created either in the virtual network or with a public IP/VIP assigned.

## What is required to create an application gateway?

* **Backend server pool:** The list of IP addresses of the backend servers. The IP addresses listed should either belong to the virtual network but in a different subnet for the application gateway or should be a public IP/VIP.
* **Backend server pool settings:** Every pool has settings like port, protocol, and cookie-based affinity. These settings are tied to a pool and are applied to all servers within the pool.
* **Frontend port:** This port is the public port that is opened on the application gateway. Traffic hits this port, and then gets redirected to one of the backend servers.
* **Listener:** The listener has a frontend port, a protocol (Http or Https, these are case-sensitive), and the SSL certificate name (if configuring SSL offload).
* **Rule:** The rule binds the listener and the backend server pool and defines which backend server pool the traffic should be directed to when it hits a particular listener. Currently, only the *basic* rule is supported. The *basic* rule is round-robin load distribution.

## Create an application gateway

The difference between using Azure Classic and Azure Resource Manager is the order in which you create the application gateway and the items that need to be configured.
With Resource Manager, all items that make an application gateway are configured individually and then put together to create the application gateway resource.

Here are the steps that are needed to create an application gateway:

1. Create a resource group for Resource Manager
2. Create a virtual network and a subnet for the application gateway
3. Create an application gateway configuration object
4. Create an application gateway resource

## Create a resource group for Resource Manager

Make sure that you switch PowerShell mode to use the Azure Resource Manager cmdlets. More info is available at [Using Windows PowerShell with Resource Manager](../azure-resource-manager/management/manage-resources-powershell.md).

### Step 1

```powershell
Connect-AzAccount
```

### Step 2

Check the subscriptions for the account.

```powershell
Get-AzSubscription
```

You are prompted to authenticate with your credentials.

### Step 3

Choose which of your Azure subscriptions to use.

```powershell
Select-AzSubscription -Subscriptionid "GUID of subscription"
```

### Step 4

Create a new resource group (skip this step if you're using an existing resource group).

```powershell
New-AzResourceGroup -Name appgw-rg -location "West US"
```

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. Make sure that all commands to create an application gateway uses the same resource group.

In the preceding example, we created a resource group called "appgw-rg" and location "West US".

## Create a virtual network and a subnet for the application gateway

The following example shows how to create a virtual network by using Resource Manager:

### Step 1

```powershell
$subnetconfig = New-AzVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24
```

This step assigns the address range 10.0.0.0/24 to a subnet variable to be used to create a virtual network.

### Step 2

```powershell
$vnet = New-AzVirtualNetwork -Name appgwvnet -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $subnetconfig
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
$gipconfig = New-AzApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet
```

This step creates an application gateway IP configuration named "gatewayIP01". When Application Gateway starts, it picks up an IP address from the subnet configured and route network traffic to the IP addresses in the backend IP pool. Keep in mind that each instance takes one IP address.

### Step 2

```powershell
$pool = New-AzApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 10.1.1.8,10.1.1.9,10.1.1.10
```

This step configures the backend IP address pool named "pool01" with IP addresses "10.1.1.8, 10.1.1.9, 10.1.1.10". Those are the IP addresses that receive the network traffic that comes from the frontend IP endpoint. You replace the preceding IP addresses to add your own application IP address endpoints.

### Step 3

```powershell
$poolSetting = New-AzApplicationGatewayBackendHttpSettings -Name poolsetting01 -Port 80 -Protocol Http -CookieBasedAffinity Disabled
```

This step configures application gateway setting "poolsetting01" for the load balanced network traffic in the backend pool.

### Step 4

```powershell
$fp = New-AzApplicationGatewayFrontendPort -Name frontendport01  -Port 80
```

This step configures the frontend IP port named "frontendport01" for the ILB.

### Step 5

```powershell
$fipconfig = New-AzApplicationGatewayFrontendIPConfig -Name fipconfig01 -Subnet $subnet
```

This step creates the frontend IP configuration called "fipconfig01" and associates it with a private IP from the current virtual network subnet.

### Step 6

```powershell
$listener = New-AzApplicationGatewayHttpListener -Name listener01  -Protocol Http -FrontendIPConfiguration $fipconfig -FrontendPort $fp
```

This step creates the listener called "listener01" and associates the frontend port to the frontend IP configuration.

### Step 7

```powershell
$rule = New-AzApplicationGatewayRequestRoutingRule -Name rule01 -RuleType Basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool
```

This step creates the load balancer routing rule called "rule01" that configures the load balancer behavior.

### Step 8

```powershell
$sku = New-AzApplicationGatewaySku -Name Standard_Small -Tier Standard -Capacity 2
```

This step configures the instance size of the application gateway.

> [!NOTE]
> The default value for Capacity is 2. For Sku Name, you can choose between Standard_Small, Standard_Medium, and Standard_Large.

## Create an application gateway by using New-AzureApplicationGateway

Creates an application gateway with all configuration items from the preceding steps. In this example, the application gateway is called "appgwtest".

```powershell
$appgw = New-AzApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Location "West US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku
```

This step creates an application gateway with all configuration items from the preceding steps. In the example, the application gateway is called "appgwtest".

## Delete an application gateway

To delete an application gateway, you need to do the following steps in order:

1. Use the `Stop-AzApplicationGateway` cmdlet to stop the gateway.
2. Use the `Remove-AzApplicationGateway` cmdlet to remove the gateway.
3. Verify that the gateway has been removed by using the `Get-AzureApplicationGateway` cmdlet.

### Step 1

Get the application gateway object and associate it to a variable "$getgw".

```powershell
$getgw =  Get-AzApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg
```

### Step 2

Use `Stop-AzApplicationGateway` to stop the application gateway. This sample shows the `Stop-AzApplicationGateway` cmdlet on the first line, followed by the output.

```powershell
Stop-AzApplicationGateway -ApplicationGateway $getgw  
```

```
VERBOSE: 9:49:34 PM - Begin Operation: Stop-AzureApplicationGateway
VERBOSE: 10:10:06 PM - Completed Operation: Stop-AzureApplicationGateway
Name       HTTP Status Code     Operation ID                             Error
----       ----------------     ------------                             ----
Successful OK                   ce6c6c95-77b4-2118-9d65-e29defadffb8
```

Once the application gateway is in a stopped state, use the `Remove-AzApplicationGateway` cmdlet to remove the service.

```powershell
Remove-AzApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Force
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

To verify that the service has been removed, you can use the `Get-AzApplicationGateway` cmdlet. This step is not required.

```powershell
Get-AzApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg
```

```
VERBOSE: 10:52:46 PM - Begin Operation: Get-AzureApplicationGateway

Get-AzureApplicationGateway : ResourceNotFound: The gateway doesn't exist.
```

## Next steps

If you want to configure SSL offload, see [Configure an application gateway for SSL offload](./tutorial-ssl-powershell.md).

If you want more information about load balancing options in general, see:

* [Azure Load Balancer](../load-balancer/index.yml)
* [Azure Traffic Manager](../traffic-manager/index.yml)