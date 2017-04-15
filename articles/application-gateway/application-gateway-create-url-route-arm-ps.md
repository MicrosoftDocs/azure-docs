---
title: Create an application gateway using URL routing rules | Microsoft Docs
description: This page provides instructions to create, configure an Azure application gateway using URL routing rules
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.assetid: d141cfbb-320a-4fc9-9125-10001c6fa4cf
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/03/2017
ms.author: gwallace

---
# Create an application gateway using Path-based routing

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-url-route-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-url-route-arm-ps.md)

URL Path-based routing enables you to associate routes based on the URL path of an Http request. It checks if there is a route to a back-end pool configured for the URL presented in the Application Gateway and sends the network traffic to the defined back-end pool. A common use for URL-based routing is to load balance requests for different content types to different back-end server pools.

URL-based routing introduces a new rule type to application gateway. Application gateway has two rule types: basic and PathBasedRouting. Basic rule type provides round-robin service for the back-end pools while PathBasedRouting in addition to round robin distribution, also takes path pattern of the request URL into account while choosing the backend pool.

## Scenario

In the following example, Application Gateway is serving traffic for contoso.com with two back-end server pools: video server pool and image server pool.

Requests for http://contoso.com/image* are routed to image server pool (pool1), and http://contoso.com/video* are routed to video server pool (pool2). if none of the path patterns match , a default server pool (pool1) is selected.

![url route](./media/application-gateway-create-url-route-arm-ps/figure1.png)

## Before you begin

1. Install the latest version of the Azure PowerShell cmdlets by using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Downloads page](https://azure.microsoft.com/downloads/).
2. You create a virtual network and subnet for Application Gateway. Make sure that no virtual machines or cloud deployments are using the subnet. The application gateway must be by itself in a virtual network subnet.
3. The servers added to the back-end pool to use the application gateway must exist or have their endpoints created either in the virtual network or with a public IP/VIP assigned.

## What is required to create an application gateway?

* **Back-end server pool:** The list of IP addresses of the back-end servers. The IP addresses listed should either belong to the virtual network subnet or should be a public IP/VIP.
* **Back-end server pool settings:** Every pool has settings like port, protocol, and cookie-based affinity. These settings are tied to a pool and are applied to all servers within the pool.
* **Front-end port:** This port is the public port that is opened on the application gateway. Traffic hits this port, and then gets redirected to one of the back-end servers.
* **Listener:** The listener has a front-end port, a protocol (Http or Https, these values are case-sensitive), and the SSL certificate name (if configuring SSL offload).
* **Rule:** The rule binds the listener, the back-end server pool and defines which back-end server pool the traffic should be directed to when it hits a particular listener.

## Create an application gateway

The difference between using Azure Classic and Azure Resource Manager is the order in which you create the application gateway and the items that need to be configured.

With Resource Manager, all items that make an application gateway are configured individually and then put together to create the application gateway resource.

Here are the steps that are needed to create an application gateway:

1. Create a resource group for Resource Manager.
2. Create a virtual network, subnet, and public IP for the application gateway.
3. Create an application gateway configuration object.
4. Create an application gateway resource.

## Create a resource group for Resource Manager

Make sure that you are using the latest version of Azure PowerShell. More info is available at [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

### Step 1

Log in to Azure

```powershell
Login-AzureRmAccount
```

You are prompted to authenticate with your credentials.<BR>

### Step 2

Check the subscriptions for the account.

```powershell
Get-AzureRmSubscription
```

### Step 3

Choose which of your Azure subscriptions to use. <BR>

```powershell
Select-AzureRmSubscription -Subscriptionid "GUID of subscription"
```

### Step 4

Create a resource group (skip this step if you're using an existing resource group).

```powershell
$resourceGroup = New-AzureRmResourceGroup -Name appgw-RG -Location "West US"
```

Alternatively you can also create tags for a resource group for application gateway:

```powershell
$resourceGroup = New-AzureRmResourceGroup -Name appgw-RG -Location "West US" -Tags @{Name = "testtag"; Value = "Application Gateway URL routing"} 
```

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. Make sure that all commands to create an application gateway use the same resource group.

In the example above, we created a resource group called "appgw-RG" and location "West US".

> [!NOTE]
> If you need to configure a custom probe for your application gateway, see [Create an application gateway with custom probes by using PowerShell](application-gateway-create-probe-ps.md). Check out [custom probes and health monitoring](application-gateway-probe-overview.md) for more information.
> 
> 

## Create a virtual network and a subnet for the application gateway

The following example shows how to create a virtual network by using Resource Manager. This example creates a VNET for the Application Gateway. Application Gateway requires it's own subnet, for this reason the subnet created for the Application Gateway is smaller than the VNET address space. This allows for other resources, including but not limited to web servers to be configured in the same VNET.

### Step 1

Assign the address range 10.0.0.0/24 to the subnet variable to be used to create a virtual network.  This creates the subnet configuration object for the Application Gateway which is used in the next example.

```powershell
$subnet = New-AzureRmVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24
```

### Step 2

Create a virtual network named **appgwvnet** in resource group **appgw-rg** for the West US region using the prefix 10.0.0.0/16 with subnet 10.0.0.0/24. This completes the configuration of the VNET with a single subnet for the Application Gateway to reside.

```powershell
$vnet = New-AzureRmVirtualNetwork -Name appgwvnet -ResourceGroupName appgw-RG -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $subnet
```

### Step 3

Assign the subnet variable for the next steps, this is passed to the `New-AzureRMApplicationGateway` cmdlet in a future step.

```powershell
$subnet=$vnet.Subnets[0]
```

## Create a public IP address for the front-end configuration

Create a public IP resource **publicIP01** in resource group **appgw-rg** for the West US region. Application Gateway can use a public IP address, internal IP address or both to receieve requests for load balancing.  This example only uses a public IP address. In the following example no DNS name is configured for creating the Public IP address.  Application Gateway does not support custom DNS names on public IP addreses.  If a custom name is required for the public endpoint, a CNAME record should be created to point to the automatically generated DNS name for the public IP address.

```powershell
$publicip = New-AzureRmPublicIpAddress -ResourceGroupName appgw-RG -name publicIP01 -location "West US" -AllocationMethod Dynamic
```

An IP address is assigned to the application gateway when the service starts.

## Create application gateway configuration

All configuration items must be set up before creating the application gateway. The following steps create the configuration items that are needed for an application gateway resource.

### Step 1

Create an application gateway IP configuration named **gatewayIP01**. When Application Gateway starts, it picks up an IP address from the subnet configured and route network traffic to the IP addresses in the back-end IP pool. Keep in mind that each instance takes one IP address.

```powershell
$gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet
```

### Step 2

Configure the back-end IP address pool named **pool01** and **pool2** with IP addresses for **pool1** and **pool2**. These IP addresses are the IP addresses of the resources that are hosting the web application to be protected by the application gateway. These backend pool members are all validated to be healthy by probes whether they are basic probes or custom probes.  Traffic is then routed to them when requests come into the application gateway. Backend pools can be used by multiple rules within the application gateway which means one backend pool could be used for multiple web applications that reside on the same host.

```powershell
$pool1 = New-AzureRmApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 134.170.185.46, 134.170.188.221, 134.170.185.50

$pool2 = New-AzureRmApplicationGatewayBackendAddressPool -Name pool02 -BackendIPAddresses 134.170.186.47, 134.170.189.222, 134.170.186.51
```

In this example, there are two back-end pools to route network traffic based on the URL path. One pool receives traffic from URL path "/video" and other pool receive traffic from path "/image". Replace the preceding IP addresses to add your own application IP address endpoints. 

### Step 3

Configure application gateway setting **poolsetting01** and **poolsetting02** for the load-balanced network traffic in the back-end pool. In this example, you configure different back-end pool settings for the back-end pools. Each back-end pool can have its own back-end pool setting.  Backend HTTP settings are used by rules to route traffic to the correct backend pool members. This determines the protocol and port that is used when sending traffic to the backend pool members. Cookie-based sessions are also determined by the backend HTTP settings.  If enabled, cookie-based session affinity will send traffic to the same backend as previous requests for each packet.

```powershell
$poolSetting01 = New-AzureRmApplicationGatewayBackendHttpSettings -Name "besetting01" -Port 80 -Protocol Http -CookieBasedAffinity Disabled -RequestTimeout 120

$poolSetting02 = New-AzureRmApplicationGatewayBackendHttpSettings -Name "besetting02" -Port 80 -Protocol Http -CookieBasedAffinity Enabled -RequestTimeout 240
```

### Step 4

Configure the front-end IP with public IP endpoint. The front-end IP configuration object is used by a listener to relate the outward facing IP address with the listener.

```powershell
$fipconfig01 = New-AzureRmApplicationGatewayFrontendIPConfig -Name "frontend1" -PublicIPAddress $publicip
```

### Step 5

Configure the front-end port for an application gateway. The front-end port configuration object is used by a listener to define what port the Application Gateway will listen for traffic on the listener.

```powershell
$fp01 = New-AzureRmApplicationGatewayFrontendPort -Name "fep01" -Port 80
```

### Step 6

Configure the listener. This step configures the listener for the public IP address and port used to receive incoming network traffic. The following example takes the previously configured front-end IP configuration,  front-end port configuration and a protocol (http or https) and configures the listener. In this example the listener listens to HTTP traffic on port 80 on the public IP address that was created earlier.

```powershell
$listener = New-AzureRmApplicationGatewayHttpListener -Name "listener01" -Protocol Http -FrontendIPConfiguration $fipconfig01 -FrontendPort $fp01
```

### Step 7

Configure URL rule paths for the back-end pools. This step configures the relative path used by application gateway to define the mapping between URL path and which back-end pool is assigned to handle the incoming traffic.

> [!IMPORTANT]
> Each path must start with / and the only place a "\*" is allowed, is at the end. Valid examples are /xyz, /xyz* or /xyz/*. The string fed to the path matcher does not include any text after the first "?" or "#", and those characters are not allowed. 

The following example creates two rules: one for "/image/" path routing traffic to back-end "pool1" and another one for "/video/" path routing traffic to back-end "pool2". These rules ensure that traffic for each set of urls is routed to the backend. For example, http://contoso.com/image/figure1.jpg will go to pool1 and http://contoso.com/video/example.mp4 will go to pool2.

```powershell
$imagePathRule = New-AzureRmApplicationGatewayPathRuleConfig -Name "pathrule1" -Paths "/image/*" -BackendAddressPool $pool1 -BackendHttpSettings $poolSetting01

$videoPathRule = New-AzureRmApplicationGatewayPathRuleConfig -Name "pathrule2" -Paths "/video/*" -BackendAddressPool $pool2 -BackendHttpSettings $poolSetting02
```

If the path doesn't match any of the pre-defined path rules, the rule path map configuration also configures a default back-end address pool. For example, http://contoso.com/shoppingcart/test.html will go to pool1 as it is defined as the default pool for un-matched traffic.

```powershell
$urlPathMap = New-AzureRmApplicationGatewayUrlPathMapConfig -Name "urlpathmap" -PathRules $videoPathRule, $imagePathRule -DefaultBackendAddressPool $pool1 -DefaultBackendHttpSettings $poolSetting02
```

### Step 8

Create a rule setting. This step configures the application gateway to use URL path-based routing. The `$urlPathMap` variable defined in the earlier step is now used to create the path-based rule. In this step we associate the rule with a listener and the url path mapping created earlier.

```powershell
$rule01 = New-AzureRmApplicationGatewayRequestRoutingRule -Name "rule1" -RuleType PathBasedRouting -HttpListener $listener -UrlPathMap $urlPathMap
```

### Step 9

Configure the number of instances and size for the application gateway.

```powershell
$sku = New-AzureRmApplicationGatewaySku -Name "Standard_Small" -Tier Standard -Capacity 2
```

## Create Application Gateway

Create an application gateway with all configuration objects from the preceding steps.

```powershell
$appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-RG -Location "West US" -BackendAddressPools $pool1,$pool2 -BackendHttpSettingsCollection $poolSetting01, $poolSetting02 -FrontendIpConfigurations $fipconfig01 -GatewayIpConfigurations $gipconfig -FrontendPorts $fp01 -HttpListeners $listener -UrlPathMaps $urlPathMap -RequestRoutingRules $rule01 -Sku $sku
```

## Get application gateway DNS name

Once the gateway is created, the next step is to configure the front end for communication. When using a public IP, application gateway requires a dynamically assigned DNS name, which is not friendly. To ensure end users can hit the application gateway a CNAME record can be used to point to the public endpoint of the application gateway. [Configuring a custom domain name for in Azure](../cloud-services/cloud-services-custom-domain-name-portal.md). To configure the frontend IP CNAME record, retrieve details of the application gateway and its associated IP/DNS name using the PublicIPAddress element attached to the application gateway. The application gateway's DNS name should be used to create a CNAME record, which points the two web applications to this DNS name. The use of A-records is not recommended since the VIP may change on restart of application gateway.

```powershell
Get-AzureRmPublicIpAddress -ResourceGroupName appgw-RG -Name publicIP01
```

```
Name                     : publicIP01
ResourceGroupName        : appgw-RG
Location                 : westus
Id                       : /subscriptions/<subscription_id>/resourceGroups/appgw-RG/providers/Microsoft.Network/publicIPAddresses/publicIP01
Etag                     : W/"00000d5b-54ed-4907-bae8-99bd5766d0e5"
ResourceGuid             : 00000000-0000-0000-0000-000000000000
ProvisioningState        : Succeeded
Tags                     : 
PublicIpAllocationMethod : Dynamic
IpAddress                : xx.xx.xxx.xx
PublicIpAddressVersion   : IPv4
IdleTimeoutInMinutes     : 4
IpConfiguration          : {
                                "Id": "/subscriptions/<subscription_id>/resourceGroups/appgw-RG/providers/Microsoft.Network/applicationGateways/appgwtest/frontendIP
                            Configurations/frontend1"
                            }
DnsSettings              : {
                                "Fqdn": "00000000-0000-xxxx-xxxx-xxxxxxxxxxxx.cloudapp.net"
                            }
```

## Next steps

If you want to learn Secure Sockets Layer (SSL) offload, see [Configure an application gateway for SSL offload](application-gateway-ssl-arm.md).

