<properties 
   pageTitle="Create, start, or delete an Application Gateway using Azure Resource Manager | Microsoft Azure"
   description="This page provides instructions to create, configure, start, and delete an Azure Application Gateway using Azure Resource Manager"
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
   ms.date="09/21/2015"
   ms.author="joaoma"/>


# Create, start, or delete an Application Gateway using Azure Resource Manager

Application Gateway is load balancer layer 7. It provides failover, performance routing HTTP requests between different servers, whether they are on the cloud or on premise. Application gateway has the following application delivery features: HTTP load balancing, Cookie based session affinity, SSL offload. 


> [AZURE.SELECTOR]
- [Azure Classic Powershell steps](application-gateway-create-gateway.md)
- [Azure Resource Manager Powershell steps](application-gateway-create-gateway-arm.md)
- [Azure Resource Manager template steps](application-gateway-create-gateway-arm-template.md)


<BR>


This article walks you through the steps to create and configure, start, and delete an application gateway.


>[AZURE.IMPORTANT] Before you work with Azure resources, it's important to understand that Azure currently has two deployment models: Resource Manager, and classic. Make sure you understand [deployment models and tools](azure-classic-rm.md) before working with any Azure resource. You can view the documentation for different tools by clicking the tabs at the top of this article.This document will cover creating an Application Gateway using Azure Resource Manager. To use the classic version, go to [create an Application Gateway classic deployment using PowerShell](application-gateway-create-gateway.md).



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
2. Create virtual network, subnet and public IP for Application Gateway
3. Create an Application Gateway configuration object
4. Create Application Gateway resource


## Create a resource group for Resource Manager

Make sure you switch PowerShell mode to use the ARM cmdlets. More info is available at Using [Windows Powershell with Resource Manager](powershell-azure-resource-manager.md).

### Step 1

    Switch-AzureMode -Name AzureResourceManager

### Step 2

Log in to your Azure account.


    Add-AzureAccount

You will be prompted to Authenticate with your credentials.


### Step 3

Choose which of your Azure subscriptions to use. 

    Select-AzureSubscription -SubscriptionName "MySubscription"

To see a list of available subscriptions, use the ‘Get-AzureSubscription’ cmdlet.


### Step 4

Create a new resource group (skip this step if using an existing resource group)

    New-AzureResourceGroup -Name appgw-rg -location "West US"

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. Make sure all commands to create an Application Gateway will use the same resource group.

In the example above we created a resource group called "appgw-RG" and location "West US". 

## Create virtual network and subnet for Application Gateway

The following example shows how to create a virtual network using Resource manager: 

### Step 1	
	
	$subnet = New-AzureVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24

Assigns the Address range 10.0.0.0/24 to subnet variable to be used to create a virtual network

### Step 2	
	$vnet = New-AzurevirtualNetwork -Name appgwvnet -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $subnet

Creates a virtual network named "appgwvnet" in resource group "appw-rg" for the West US region using the prefix 10.0.0.0/16 with subnet 10.0.0.0/24	

### Step 3
	
	$subnet=$vnet.Subnets[0]

## Create public IP address for front end configuration

	$publicip = New-AzurePublicIpAddress -ResourceGroupName appgw-rg -name publicIP01 -location "West US" -AllocationMethod Dynamic

Creates a public IP resource "publicIP01" in resource group "appw-rg" for the West US region. 


## Create an Application Gateway configuration object

### Step 1

	$gipconfig = New-AzureApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet

Creates an Application Gateway IP configuration named "gatewayIP01". When Application Gateway starts, it will pick up an IP address from the subnet configured and route network traffic to the IP addresses in the backend IP pool. Keep in mind each instance will take one IP address.
 
### Step 2

	$pool = New-AzureApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 134.170.185.46, 134.170.188.221,134.170.185.50

This step will configure the back end IP address pool named "pool01" with IP addresses "134.170.185.46, 134.170.188.221,134.170.185.50". Those will be the IP addresses receiving the network traffic coming from the front end IP endpoint. You will replace the IP addresses above to add your own application IP address endpoints.

### Step 3

	$poolSetting = New-AzureApplicationGatewayBackendHttpSettings -Name poolsetting01 -Port 80 -Protocol Http -CookieBasedAffinity Disabled

Configures Application gateway settings "poolsetting01" for the load balanced network traffic in the backend pool.

### Step 4

	$fp = New-AzureApplicationGatewayFrontendPort -Name frontendport01  -Port 80

Configures the front end IP port named "frontendport01" in this case for the public IP endpoint.

### Step 5

	$fipconfig = New-AzureApplicationGatewayFrontendIPConfig -Name fipconfig01 -PublicIPAddress $publicip

Creates the front end IP configuration named "fipconfig01" and associates the public IP address with the front end IP configuration.

### Step 6

	$listener = New-AzureApplicationGatewayHttpListener -Name listener01  -Protocol Http -FrontendIPConfiguration $fipconfig -FrontendPort $fp

Creates the listener name "listener01" and associates the front end port to the frontend IP configuration.

### Step 7 

	$rule = New-AzureApplicationGatewayRequestRoutingRule -Name rule01 -RuleType Basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool

Creates the load balancer routing rule named "rule01" configuring the load balancer behavior.

### Step 8

	$sku = New-AzureApplicationGatewaySku -Name Standard_Small -Tier Standard -Capacity 2

Configures the instance size of the Application Gateway

>[AZURE.NOTE]  The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. You can choose between Standard_Small, Standard_Medium and Standard_Large.

## Create Application Gateway using New-AzureApplicationGateway

	$appgw = New-AzureApplicationGateway -Name appgwtest -ResourceGroupName appw-rg -Location "West US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku

Creates an Application Gateway will all configuration items from the steps above. In the example the Application Gateway is called "appgwtest". 


## Start Application Gateway

Once the gateway has been configured, use the `Start-AzureApplicationGateway` cmdlet to start the gateway. Billing for an application gateway begins after the gateway has been successfully started. 


**Note:** The `Start-AzureApplicationGateway` cmdlet might take up to 15-20 minutes to complete. 

For the example below, the Application Gateway is called "appgwtest" and the resource group is "app-rg":


### Step 1

Get the Application Gateway object and associate to a variable "$getgw":
 
	$getgw =  Get-AzureApplicationGateway -Name appgwtest -ResourceGroupName app-rg

### Step 2
	 
Use `Start-AzureApplicationGateway` to start the Application Gateway:

	 Start-AzureApplicationGateway -ApplicationGateway $getgw  

	

## Verify the Application Gateway status

Use the `Get-AzureApplicationGateway` cmdlet to check the status of gateway. If *Start-AzureApplicationGateway* succeeded in the previous step, the State should be *Running*, and the Vip and DnsName should have valid entries. 

This sample shows an application gateway that is up, running, and is ready to take traffic destined to `http://<generated-dns-name>.cloudapp.net`. 

	Get-AzureApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg

	Sku                               : Microsoft.Azure.Commands.Network.Models.PSApplicationGatewaySku
	GatewayIPConfigurations           : {gatewayip01}
	SslCertificates                   : {}
	FrontendIPConfigurations          : {frontendip01}
	FrontendPorts                     : {frontendport01}
	BackendAddressPools               : {pool01}
	BackendHttpSettingsCollection     : {setting01}
	HttpListeners                     : {listener01}
	RequestRoutingRules               : {rule01}
	OperationalState                  : 
	ProvisioningState                 : Succeeded
	GatewayIpConfigurationsText       : [
                                      {
                                        "Subnet": {
                                          "Id": "/subscriptions/###############################/resourceGroups/appgw-rg
                                    /providers/Microsoft.Network/virtualNetworks/vnet01/subnets/subnet01"
                                        },
                                        "ProvisioningState": "Succeeded",
                                        "Name": "gatewayip01",
                                        "Etag": "W/\"ddb0408e-a54c-4501-a7f8-8487c3530bd7\"",
                                        "Id": "/subscriptions/###############################/resourceGroups/appgw-rg/p
                                    roviders/Microsoft.Network/applicationGateways/appgwtest/gatewayIPConfigurations/gatewayip
                                    01"
                                      }
                                    ]
	SslCertificatesText               : []
	FrontendIpConfigurationsText      : [
                                      {
                                        "PrivateIPAddress": null,
                                        "PrivateIPAllocationMethod": "Dynamic",
                                        "Subnet": null,
                                        "PublicIPAddress": {
                                          "Id": "/subscriptions/###############################/resourceGroups/appgw-rg
                                    /providers/Microsoft.Network/publicIPAddresses/publicip01"
                                        },
                                        "ProvisioningState": "Succeeded",
                                        "Name": "frontendip01",
                                        "Etag": "W/\"ddb0408e-a54c-4501-a7f8-8487c3530bd7\"",
                                        "Id": "/subscriptions/###############################/resourceGroups/appgw-rg/p
                                    roviders/Microsoft.Network/applicationGateways/appgwtest/frontendIPConfigurations/frontend
                                    ip01"
                                      }
                                    ]
	FrontendPortsText                 : [
                                      {
                                        "Port": 80,
                                        "ProvisioningState": "Succeeded",
                                        "Name": "frontendport01",
                                        "Etag": "W/\"ddb0408e-a54c-4501-a7f8-8487c3530bd7\"",
                                        "Id": "/subscriptions/###############################/resourceGroups/appgw-rg/p
                                    roviders/Microsoft.Network/applicationGateways/appgwtest/frontendPorts/frontendport01"
                                      }
                                    ]
	BackendAddressPoolsText           : [
                                      {
                                        "BackendAddresses": [
                                          {
                                            "Fqdn": null,
                                            "IpAddress": "134.170.185.46"
                                          },
                                          {
                                            "Fqdn": null,
                                            "IpAddress": "134.170.188.221"
                                          },
                                          {
                                            "Fqdn": null,
                                            "IpAddress": "134.170.185.50"
                                          }
                                        ],
                                        "BackendIpConfigurations": [],
                                        "ProvisioningState": "Succeeded",
                                        "Name": "pool01",
                                        "Etag": "W/\"ddb0408e-a54c-4501-a7f8-8487c3530bd7\"",
                                        "Id": "/subscriptions/###############################/resourceGroups/appgw-rg/p
                                    roviders/Microsoft.Network/applicationGateways/appgwtest/backendAddressPools/pool01"
                                      }
                                    ]
	BackendHttpSettingsCollectionText : [
                                      {
                                        "Port": 80,
                                        "Protocol": "Http",
                                        "CookieBasedAffinity": "Disabled",
                                        "ProvisioningState": "Succeeded",
                                        "Name": "setting01",
                                        "Etag": "W/\"ddb0408e-a54c-4501-a7f8-8487c3530bd7\"",
                                        "Id": "/subscriptions/###############################/resourceGroups/appgw-rg/p
                                    roviders/Microsoft.Network/applicationGateways/appgwtest/backendHttpSettingsCollection/set
                                    ting01"
                                      }
                                    ]
	HttpListenersText                 : [
                                      {
                                        "FrontendIpConfiguration": {
                                          "Id": "/subscriptions/###############################/resourceGroups/appgw-rg
                                    /providers/Microsoft.Network/applicationGateways/appgwtest/frontendIPConfigurations/fronte
                                    ndip01"
                                        },
                                        "FrontendPort": {
                                          "Id": "/subscriptions/###############################/resourceGroups/appgw-rg
                                    /providers/Microsoft.Network/applicationGateways/appgwtest/frontendPorts/frontendport01"
                                        },
                                        "Protocol": "Http",
                                        "SslCertificate": null,
                                        "ProvisioningState": "Succeeded",
                                        "Name": "listener01",
                                        "Etag": "W/\"ddb0408e-a54c-4501-a7f8-8487c3530bd7\"",
                                        "Id": "/subscriptions/###############################/resourceGroups/appgw-rg/p
                                    roviders/Microsoft.Network/applicationGateways/appgwtest/httpListeners/listener01"
                                      }
                                    ]
	RequestRoutingRulesText           : [
                                      {
                                        "RuleType": "Basic",
                                        "BackendAddressPool": {
                                          "Id": "/subscriptions/###############################/resourceGroups/appgw-rg
                                    /providers/Microsoft.Network/applicationGateways/appgwtest/backendAddressPools/pool01"
                                        },
                                        "BackendHttpSettings": {
                                          "Id": "/subscriptions/###############################/resourceGroups/appgw-rg
                                    /providers/Microsoft.Network/applicationGateways/appgwtest/backendHttpSettingsCollection/s
                                    etting01"
                                        },
                                        "HttpListener": {
                                          "Id": "/subscriptions/###############################/resourceGroups/appgw-rg
                                    /providers/Microsoft.Network/applicationGateways/appgwtest/httpListeners/listener01"
                                        },
                                        "ProvisioningState": "Succeeded",
                                        "Name": "rule01",
                                        "Etag": "W/\"ddb0408e-a54c-4501-a7f8-8487c3530bd7\"",
                                        "Id": "/subscriptions/###############################/resourceGroups/appgw-rg/p
                                    roviders/Microsoft.Network/applicationGateways/appgwtest/requestRoutingRules/rule01"
                                      }
                                    ]
	ResourceGroupName                 : appgw-rg
	Location                          : westus
		Tag                               : {}
	TagsTable                         : 
	Name                              : appgwtest
	Etag                              : W/"ddb0408e-a54c-4501-a7f8-8487c3530bd7"
	Id                                : /subscriptions/###############################/resourceGroups/appgw-rg/providers/Microsoft.Network/applicationGateways/appgwtest




## Delete an Application Gateway

To delete an application gateway, you'll need to do the following in order:

1. Use the `Stop-AzureApplicationGateway` cmdlet to stop the gateway. 
2. Use the `Remove-AzureApplicationGateway` cmdlet to remove the gateway.
3. Verify the gateway has been removed by using the `Get-AzureApplicationGateway` cmdlet.


### Step 1

Get the Application Gateway object and associate to a variable "$getgw":
 
	$getgw =  Get-AzureApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg

### Step 2
	 
Use `Stop-AzureApplicationGateway` to stop the Application Gateway:

	Stop-AzureApplicationGateway -ApplicationGateway $getgw  


Once the application gateway is in a Stopped state, use the `Remove-AzureApplicationGateway` cmdlet to remove the service.


	Remove-AzureApplicationGateway -Name $appgwtest -ResourceGroupName appgw-rg -Force

	

>[AZURE.NOTE] The "-force" switch can be used to suppress the remove confirmation message
>

To verify that the service has been removed, you can use the `Get-AzureApplicationGateway` cmdlet. This step is not required.


	Get-AzureApplicationGateway -Name appgwtest-ResourceGroupName appgw-rg

	


## Next Steps

If you want to configure SSL offload, see [Configure Application Gateway for SSL offload](application-gateway-ssl.md).

If you want to configure an application gateway to use with ILB, see [Create an Application Gateway with an Internal Load Balancer (ILB)](application-gateway-ilb.md).

If you want more information about load balancing options in general, see:

- [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
- [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)

