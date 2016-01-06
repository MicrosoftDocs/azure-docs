<properties 
   pageTitle="Create and Configure an Application Gateway with Internal Load Balancer (ILB) using Azure Resource Manager | Microsoft Azure"
   description="This page provides instructions to create, configure, start, and delete an Azure Application Gateway with Internal Load balancer (ILB) for Azure resource manager"
   documentationCenter="na"
   services="application-gateway"
   authors="joaoma"
   manager="jdial"
   editor="tysonn"/>
<tags 
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="hero-article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="11/24/2015"
   ms.author="joaoma"/>


# Create an Application Gateway with an Internal Load Balancer (ILB) using Azure Resource Manager

> [AZURE.SELECTOR]
- [Azure classic steps](application-gateway-ilb.md)
- [Resource Manager Powershell steps](application-gateway-ilb-arm.md)

Application Gateway can be configured with an internet facing VIP or with an internal end-point not exposed to the internet, also known as Internal Load Balancer (ILB) endpoint. Configuring the gateway with an ILB is useful for internal line of business applications not exposed to internet. It's also useful for services/tiers within a multi-tier application which sit in a security boundary not exposed to internet, but still require round robin load distribution, session stickiness, or SSL termination. This article will walk you through the steps to configure an application gateway with an ILB.

## Before you begin

1. Install latest version of the Azure PowerShell cmdlets using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Download page](http://azure.microsoft.com/downloads/).
2. You will create a virtual network and subnet for Application Gateway. Make sure no Virtual machines or cloud deployments are using the subnet. Application gateway must be by itself in a virtual network subnet.
3. The servers which you will configure to use the Application gateway must exist or have their endpoints created either in the virtual network, or with a public IP/VIP assigned.

## What is required to create an Application Gateway?
 

- **Back end server pool:** The list of IP addresses of the back end servers. The IP addresses listed should either belong to the virtual network subnet, or should be a public IP/VIP. 
- **Back end server pool settings:** Every pool has settings like port, protocol, and cookie based affinity. These settings are tied to a pool and are applied to all servers within the pool.
- **Front end Port:** This port is the public port opened on the application gateway. Traffic hits this port, and then gets redirected to one of the back end servers.
- **Listener:** The listener has a frontend port, a protocol (Http or Https, these are case-sensitive), and the SSL certificate name (if configuring SSL offload). 
- **Rule:** The rule binds the listener and the back end server pool and defines which back end server pool the traffic should be directed to when it hits a particular listener. Currently, only the *basic* rule is supported. The *basic* rule is round-robin load distribution.


 
## Create a new Application Gateway

The difference between using Azure Classic and Azure Resource Manager will be the order you will create the application gateway and items needed to be configured.
With Resource manager, all items which will make an Application Gateway will be configured individually and then put together to create the Application Gateway resource.


Here follows the steps needed to create an Application Gateway:

1. Create a resource group for Resource Manager
2. Create virtual network, subnet for Application Gateway
3. Create an Application Gateway configuration object
4. Create Application Gateway resource


## Create a resource group for Resource Manager

Make sure you switch PowerShell mode to use the ARM cmdlets. More info is available at Using [Windows Powershell with Resource Manager](powershell-azure-resource-manager.md).

### Step 1

		PS C:\> Login-AzureRmAccount

### Step 2

Check the subscriptions for the account 

		PS C:\> get-AzureRmSubscription 

You will be prompted to Authenticate with your credentials.<BR>

### Step 3 

Choose which of your Azure subscriptions to use. <BR>


		PS C:\> Select-AzureRmSubscription -Subscriptionid "GUID of subscription"


### Step 4

Create a new resource group (skip this step if using an existing resource group)

    New-AzureRmResourceGroup -Name appgw-rg -location "West US"

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. Make sure all commands to create an Application Gateway will use the same resource group.

In the example above we created a resource group called "appgw-rg" and location "West US". 

## Create virtual network, subnet for Application Gateway

The following example shows how to create a virtual network using Resource manager: 

### Step 1	
	
	$subnetconfig = New-AzureRmVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24

Assigns the Address range 10.0.0.0/24 to subnet variable to be used to create a virtual network

### Step 2
	
	$vnet = New-AzureRmVirtualNetwork -Name appgwvnet -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $subnetconfig

Creates a virtual network named "appgwvnet" in resource group "appgw-rg" for the West US region using the prefix 10.0.0.0/16 with subnet 10.0.0.0/24	
	
### Step 3

	$subnet=$vnet.subnets[0]

Assigns the subnet object to variable $subnet for the next steps.
 

## Create an Application Gateway configuration object

### Step 1

	$gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet

Creates a Application Gateway IP configuration named "gatewayIP01". When Application Gateway starts, it will pick up an IP address from the subnet configured and route network traffic to the IP addresses in the backend IP pool. Keep in mind each instance will take one IP address.
 
### Step 2

	$pool = New-AzureRmApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 10.0.0.10,10.0.0.11,10.0.0.12

This step will configure the back end IP address pool named "pool01" with IP addresses "10.0.0.10,10.0.0.11, 10.0.0.12". Those will be the IP addresses receiving the network traffic coming from the front end IP endpoint.You will replace the IP addresses above to add your own application IP address endpoints.

### Step 3

	$poolSetting = New-AzureRmApplicationGatewayBackendHttpSettings -Name poolsetting01 -Port 80 -Protocol Http -CookieBasedAffinity Disabled

Configures Application Gateway settings "poolsetting01" for the load balanced network traffic in the backend pool.

### Step 4

	$fp = New-AzureRmApplicationGatewayFrontendPort -Name frontendport01  -Port 80

Configures the front end IP port named "frontendport01" for the ILB.

### Step 5

	$fipconfig = New-AzureRmApplicationGatewayFrontendIPConfig -Name fipconfig01 -Subnet $subnet

Creates the front end IP configuration called "fipconfig01" and associates with a private IP from the current virtual network subnet.

### Step 6

	$listener = New-AzureRmApplicationGatewayHttpListener -Name listener01  -Protocol Http -FrontendIPConfiguration $fipconfig -FrontendPort $fp

Creates the listener called "listener01" and associates the front end port to the frontend IP configuration.

### Step 7 

	$rule = New-AzureRmApplicationGatewayRequestRoutingRule -Name rule01 -RuleType Basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool

Creates the load balancer routing rule called "rule01", configuring the load balancer behavior.

### Step 8

	$sku = New-AzureRmApplicationGatewaySku -Name Standard_Small -Tier Standard -Capacity 2

Configures the instance size of the Application Gateway

>[AZURE.NOTE]  The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. You can choose between Standard_Small, Standard_Medium and Standard_Large.

## Create Application Gateway using New-AzureApplicationGateway

	$appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Location "West US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku

Creates an Application Gateway will all configuration items from the steps above. In the example the Application Gateway is called "appgwtest". 


## Delete an Application Gateway

To delete an application gateway, you'll need to do the following in order:

1. Use the `Stop-AzureRmApplicationGateway` cmdlet to stop the gateway. 
2. Use the `Remove-AzureRmApplicationGateway` cmdlet to remove the gateway.
3. Verify the gateway has been removed by using the `Get-AzureApplicationGateway` cmdlet.

This sample shows the `Stop-AzureRmApplicationGateway` cmdlet on the first line, followed by the output. 

### Step 1

Get the Application Gateway object and associate to a variable "$getgw":
 
	$getgw =  Get-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg

### Step 2
	 
Use `Stop-AzureRmApplicationGateway` to stop the Application Gateway:

	PS C:\> Stop-AzureRmApplicationGateway -ApplicationGateway $getgw  

	VERBOSE: 9:49:34 PM - Begin Operation: Stop-AzureApplicationGateway 
	VERBOSE: 10:10:06 PM - Completed Operation: Stop-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   ce6c6c95-77b4-2118-9d65-e29defadffb8

Once the application gateway is in a Stopped state, use the `Remove-AzureRmApplicationGateway` cmdlet to remove the service.


	PS C:\> Remove-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Force

	VERBOSE: 10:49:34 PM - Begin Operation: Remove-AzureApplicationGateway 
	VERBOSE: 10:50:36 PM - Completed Operation: Remove-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   055f3a96-8681-2094-a304-8d9a11ad8301

>[AZURE.NOTE] The "-force" switch can be used to suppress the remove confirmation message


To verify that the service has been removed, you can use the `Get-AzureRmApplicationGateway` cmdlet. This step is not required.


	PS C:\>Get-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg

	VERBOSE: 10:52:46 PM - Begin Operation: Get-AzureApplicationGateway 

	Get-AzureApplicationGateway : ResourceNotFound: The gateway does not exist. 
	.....

## Next Steps

If you want to configure SSL offload, see [Configure Application Gateway for SSL offload](application-gateway-ssl.md).

If you want to configure an application gateway to use with ILB, see [Create an Application Gateway with an Internal Load Balancer (ILB)](application-gateway-ilb.md).

If you want more information about load balancing options in general, see:

- [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
- [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)

