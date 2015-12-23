<properties 
   pageTitle="Create custom probe for Application Gateway using PowerShell in Resource Manager | Microsoft Azure"
   description="Learn how to create custom probe for Application Gateway using PowerShell in Resource Manager"
   services="application-gateway"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="12/17/2015"
   ms.author="joaoma" />

# Create custom probe for Application Gateway using PowerShell

[AZURE.INCLUDE [azure-probe-intro-include](../../includes/application-gateway-create-probe-intro-include.md)]


[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](application-gateway-create-probe-classic-ps.md).


[AZURE.INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]


### Step 1 

Use Login-AzureRmAccount to authenticate 

	Login-AzureRmAccount

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

In the example above we created a resource group called "appgw-RG" and location "West US". 

## Create virtual network and subnet for application gateway

The following example shows how to create a virtual network using Resource manager: 

### Step 1	
	
	$subnet = New-AzureRmVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24

Assigns the Address range 10.0.0.0/24 to subnet variable to be used to create a virtual network

### Step 2	
	$vnet = New-AzureRmVirtualNetwork -Name appgwvnet -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $subnet

Creates a virtual network named "appgwvnet" in resource group "appw-rg" for the West US region using the prefix 10.0.0.0/16 with subnet 10.0.0.0/24	

### Step 3
	
	$subnet=$vnet.Subnets[0]

## Create public IP address for front end configuration

	$publicip = New-AzureRmPublicIpAddress -ResourceGroupName appgw-rg -name publicIP01 -location "West US" -AllocationMethod Dynamic

Creates a public IP resource "publicIP01" in resource group "appw-rg" for the West US region. 


## Create an application gateway configuration object with custom probe 

### Step 1

	$gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet

Creates an Application Gateway IP configuration named "gatewayIP01". When Application Gateway starts, it will pick up an IP address from the subnet configured and route network traffic to the IP addresses in the backend IP pool. Keep in mind each instance will take one IP address.
 
### Step 2

	$pool = New-AzureRmApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 134.170.185.46, 134.170.188.221,134.170.185.50

This step will configure the back end IP address pool named "pool01" with IP addresses "134.170.185.46, 134.170.188.221,134.170.185.50". Those will be the IP addresses receiving the network traffic coming from the front end IP endpoint. You will replace the IP addresses above to add your own application IP address endpoints.

### Step 3

	$probe = New-AzureRmApplicationGatewayProbeConfig -Name probe01 -Protocol Http -HostName "contoso.com" -Path "/path/path.htm" -Interval 30 -Timeout 120 -UnhealthyThreshold 8

The custom probe is configured in this step. 

the parameters used are: 

- **-Interval** - configures the probe interval checks in seconds 
- **-Timeout** - defines the probe timeout for an HTTP response check
- **-Hostname and -path** - Complete URL path which is invoked by Application Gateway to determine health of the instance. For example: you have a web site http://contoso.com/ then the custom probe can be configured for "http://contoso.com/path/custompath.htm" for probe checks to have successful HTTP response. 
- **-UnhealthyThreshold** - the number of failed HTTP responses it's needed to flag the back end instance as *unhealthy*

### Step 4

	$poolSetting = New-AzureRmApplicationGatewayBackendHttpSettings -Name poolsetting01 -Port 80 -Protocol Http -CookieBasedAffinity Disabled -Probe $probe -RequestTimeout 80

Configures application gateway settings "poolsetting01" for the traffic in the back end pool. This step also has a timeout configuration which is for the back end pool response to an application gateway request. When a back end response hits a timeout limit, application gateway will cancel the request. This is different from probe timeout which is only for the back end response to probe checks.

### Step 5

	$fp = New-AzureRmApplicationGatewayFrontendPort -Name frontendport01  -Port 80

Configures the front end IP port named "frontendport01" in this case for the public IP endpoint.

### Step 6

	$fipconfig = New-AzureRmApplicationGatewayFrontendIPConfig -Name fipconfig01 -PublicIPAddress $publicip

Creates the front end IP configuration named "fipconfig01" and associates the public IP address with the front end IP configuration.

### Step 7

	$listener = New-AzureRmApplicationGatewayHttpListener -Name listener01  -Protocol Http -FrontendIPConfiguration $fipconfig -FrontendPort $fp

Creates the listener name "listener01" and associates the front end port to the frontend IP configuration.

### Step 8 

	$rule = New-AzureRmApplicationGatewayRequestRoutingRule -Name rule01 -RuleType Basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool

Creates the load balancer routing rule named "rule01" configuring the load balancer behavior.

### Step 9

	$sku = New-AzureRmApplicationGatewaySku -Name Standard_Small -Tier Standard -Capacity 2

Configures the instance size of the Application Gateway

>[AZURE.NOTE]  The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. You can choose between Standard_Small, Standard_Medium and Standard_Large.

## Create an application gateway using New-AzureRmApplicationGateway

	$appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Location "West US" -BackendAddressPools $pool -Probes $probe -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku

Creates an Application Gateway will all configuration items from the steps above. In the example the Application Gateway is called "appgwtest". 


## Add a probe to an existing application gateway


You have four steps to add a custom probe to an existing application gateway.

### Step 1 

Load the application gateway resource into a PowerShell variable using `Get-AzureRmApplicationGateway`

	$getgw =  Get-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg


### Step 2

Add a probe to the existing gateway configuration. 

	$probe = Add-AzureRmApplicationGatewayProbeConfig -ApplicationGateway $getgw -Name probe01 -Protocol Http -HostName "contoso.com" -Path "/path/custompath.htm" -Interval 30 -Timeout 120 -UnhealthyThreshold 8

   
In the example, the custom probe is configured to check for URL path contoso.com/path/custompath.htm every 30 seconds. A timeout threshold of 120 seconds is configured and 8 as the maximum number of failed probe requests.

### Step 3

Add the probe to the back end pool setting configuration and timeout using `-Set-AzureRmApplicationGatewayBackendHttpSettings`


	 $getgw = Set-AzureRmApplicationGatewayBackendHttpSettings -ApplicationGateway $getgw -Name $getgw.BackendHttpSettingsCollection.name -Port 80 -Protocol Http -CookieBasedAffinity Disabled -Probe $probe -RequestTimeout 120

### Step 4

Save the configuration to the application gateway using `Set-AzureRmApplicationGateway`

	Set-AzureRmApplicationGateway -ApplicationGateway $getgw -verbose

## Remove a probe from an existing application gateway

Here are the steps to remove a custom probe from an existing application gateway.

### Step 1 

Load the application gateway resource into a PowerShell variable using `Get-AzureRmApplicationGateway`

	$getgw =  Get-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg


### Step 2 

Remove the probe configuration from application gateway using `Remove-AzureRmApplicationGatewayProbeConfig`

	$getgw = Remove-AzureRmApplicationGatewayProbeConfig -ApplicationGateway $getgw -Name $getgw.Probes.name

### Step 3 

Update the back end pool setting to remove the probe and timeout setting using `-Set-AzureRmApplicationGatewayBackendHttpSettings`


	 $getgw=Set-AzureRmApplicationGatewayBackendHttpSettings -ApplicationGateway $getgw -Name $getgw.BackendHttpSettingsCollection.name -Port 80 -Protocol http -CookieBasedAffinity Disabled

### Step 4
	
Save the configuration to the application gateway using `Set-AzureRmApplicationGateway`

	Set-AzureRmApplicationGateway -ApplicationGateway $getgw -verbose