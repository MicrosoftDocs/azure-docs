<properties 
   pageTitle="Configure an application gateway for SSL offload using Azure Resource Manager | Microsoft Azure"
   description="This page provides instructions to create an application gateway with SSL offload using Azure Resource Manager "
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

# Configure an application gateway for SSL offload using Azure Resource Manager

> [AZURE.SELECTOR]
-[Azure Classic Powershell](application-gateway-ssl.md)
-[Azure Resource Manager Powershell](application-gateway-ssl-arm.md)

 Application Gateway can be configured to terminate the SSL session at the gateway to avoid costly SSL decryption task to happen at the web farm. SSL offload also simplifies the front end server setup and management of the web application.


## Before you begin

1. Install latest version of the Azure PowerShell cmdlets using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Download page](http://azure.microsoft.com/downloads/).
2. You will create a virtual network and subnet for application gateway. Make sure no Virtual machines or cloud deployments are using the subnet. application gateway must be by itself in a virtual network subnet.
3. The servers which you will configure to use the application gateway must exist or have their endpoints created either in the virtual network, or with a public IP/VIP assigned.

## What is required to create an application gateway?
 

- **Back end server pool:** The list of IP addresses of the back end servers. The IP addresses listed should either belong to the virtual network subnet, or should be a public IP/VIP. 
- **Back end server pool settings:** Every pool has settings like port, protocol, and cookie based affinity. These settings are tied to a pool and are applied to all servers within the pool.
- **Front end Port:** This port is the public port opened on the application gateway. Traffic hits this port, and then gets redirected to one of the back end servers.
- **Listener:** The listener has a front end port, a protocol (Http or Https, these are case-sensitive), and the SSL certificate name (if configuring SSL offload). 
- **Rule:** The rule binds the listener and the back end server pool and defines which back end server pool the traffic should be directed to when it hits a particular listener. Currently, only the *basic* rule is supported. The *basic* rule is round-robin load distribution.

**Additional configuration notes:**

For SSL certificates configuration, the protocol in **HttpListener** should change to *Https* (case sensitive). The **SslCertificate** element needs to be added to **HttpListener** with the variable value configured for the SSL certificate. The front end port should be updated to 443.

**To enable cookie based affinity**: An application gateway can be configured to ensure that request from a client session is always directed to the same VM in the web farm. This is done by injection of a session cookie which allows the gateway to direct traffic appropriately. To enable cookie based affinity, set **CookieBasedAffinity** to *Enabled* in the **BackendHttpSettings** element. 

 
## Create a new application gateway

The difference between using Azure Classic deployment model and Azure Resource Manager will be the order you will create an application gateway and items needed to be configured.

With Resource manager, all items which will make an application gateway will be configured individually and then put together to create an application gateway resource.


Here follows the steps needed to create an application gateway:

1. Create a resource group for Resource Manager
2. Create virtual network, subnet and public IP for application gateway
3. Create an application gateway configuration object
4. Create application gateway resource


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

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. Make sure all commands to create an application gateway will use the same resource group.

In the example above we created a resource group called "appgw-RG" and location "West US". 

## Create virtual network and subnet for application gateway

The following example shows how to create a virtual network using Resource manager: 

### Step 1	
	
	$subnet = New-AzureRmVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24

It assigns the Address range 10.0.0.0/24 to a subnet variable to be used to create a virtual network.

### Step 2	
	$vnet = New-AzureRmVirtualNetwork -Name appgwvnet -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $subnet

It creates a virtual network named "appgwvnet" in resource group "appgw-rg" for the West US region using the prefix 10.0.0.0/16 with subnet 10.0.0.0/24	

### Step 3

	$subnet=$vnet.Subnets[0]

Assigns the subnet object to variable $subnet for the next steps.
	
## Create public IP address for front end configuration

	$publicip = New-AzureRmPublicIpAddress -ResourceGroupName appgw-rg -name publicIP01 -location "West US" -AllocationMethod Dynamic

It creates a public IP resource "publicIP01" in resource group "appgw-rg" for the West US region. 


## Create an application gateway configuration object

### Step 1

	$gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet

It creates an application gateway IP configuration named "gatewayIP01". When application gateway starts, it will pick up an IP address from the subnet configured and route network traffic to the IP addresses in the back end IP pool. Keep in mind each instance will take one IP address.
 
### Step 2

	$pool = New-AzureRmApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 134.170.185.46, 134.170.188.221,134.170.185.50

This step will configure the back end IP address pool named "pool01" with IP addresses "134.170.185.46, 134.170.188.221,134.170.185.50." Those will be the IP addresses receiving the network traffic coming from the front end IP endpoint. Replace the IP addresses from the example above with the IP addresses of your web application endpoints.

### Step 3

	$poolSetting = New-AzureRmApplicationGatewayBackendHttpSettings -Name poolsetting01 -Port 80 -Protocol Http -CookieBasedAffinity Enabled

It configures application gateway settings "poolsetting01" to load balanced network traffic in the back end pool.

### Step 4

	$fp = New-AzureRmApplicationGatewayFrontendPort -Name frontendport01  -Port 443

It configures the front end IP port named "frontendport01" in this case for the public IP endpoint.

### Step 5 

	$cert = New-AzureRmApplicationGatewaySslCertificate -Name cert01 -CertificateFile <full path for certificate file> -Password ‘<password>’

It configures the certificate used for SSL connection. The certificate needs to be in .pfx format and password between 4 to 12 characters.

### Step 6

	$fipconfig = New-AzureRmApplicationGatewayFrontendIPConfig -Name fipconfig01 -PublicIPAddress $publicip

It creates the front end IP configuration named "fipconfig01" and associates the public IP address with the front end IP configuration.

### Step 7

	$listener = New-AzureRmApplicationGatewayHttpListener -Name listener01  -Protocol Https -FrontendIPConfiguration $fipconfig -FrontendPort $fp -SslCertificate $cert


It creates the listener name "listener01"; associates the front end port to the front end IP configuration and certificate.

### Step 8 

	$rule = New-AzureRmApplicationGatewayRequestRoutingRule -Name rule01 -RuleType Basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool

It creates the load balancer routing rule named "rule01" configuring the load balancer behavior.

### Step 9

	$sku = New-AzureRmApplicationGatewaySku -Name Standard_Small -Tier Standard -Capacity 2

It configures the instance size of the application gateway.

>[AZURE.NOTE]  The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. You can choose between Standard_Small, Standard_Medium and Standard_Large.

## Create application gateway using New-AzureApplicationGateway

	$appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Location "West US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku -SslCertificates $cert

It creates an application gateway with all configuration items from the steps above. In the example, the application gateway is called "appgwtest". 

## Next Steps

If you want to configure an application gateway to use with ILB, see [Create an application gateway with an Internal Load Balancer (ILB)](application-gateway-ilb.md).

If you want more information about load balancing options in general, see:

- [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
- [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)


