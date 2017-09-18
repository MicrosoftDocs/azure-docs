---
title: Create an application gateway by using URL routing rules | Microsoft Docs
description: This page provides instructions to create and configure an Azure application gateway by using URL routing rules.
documentationcenter: na
services: application-gateway
author: davidmu1
manager: timlt
editor: tysonn

ms.assetid: d141cfbb-320a-4fc9-9125-10001c6fa4cf
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/03/2017
ms.author: davidmu

---
# Create an application gateway by using path-based routing

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-url-route-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-url-route-arm-ps.md)
> * [Azure CLI 2.0](application-gateway-create-url-route-cli.md)

Path-based routing associates routes based on the URL path of an HTTP request. It checks whether there's a route to a back-end pool configured for the URL presented in the application gateway, and then it sends the network traffic to the defined back-end pool. A common use for URL-based routing is to load balance requests for different content types to different back-end server pools.

Azure Application Gateway has two rule types: basic routing and path-based routing. Basic provides round-robin service for the back-end pools. Path-based routing, in addition to round-robin distribution, also uses the path pattern of the request URL to choose the back-end pool.

## Scenario

In the following example, Application Gateway serves traffic for contoso.com with two back-end server pools: a video server pool and an image server pool.

Requests for http://contoso.com/image* are routed to the image server pool (**pool1**), and requests for http://contoso.com/video* are routed to the video server pool (**pool2**). If none of the path patterns match, a default server pool (**pool1**) is selected.

![Url route](./media/application-gateway-create-url-route-arm-ps/figure1.png)

## Before you begin

1. Install the latest version of the Azure PowerShell cmdlets by using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Downloads page](https://azure.microsoft.com/downloads/).
2. Create a virtual network and subnet for an application gateway. Make sure that no virtual machines or cloud deployments use that subnet. The application gateway must be by itself in a virtual network subnet.
3. Make sure that the servers added to the back-end pool for the application gateway exist, or that they have their endpoints created either in the virtual network or with a public IP/VIP assigned.

## Requirements to create an application gateway

* **Back-end server pool**: The list of IP addresses of the back-end servers. The IP addresses listed should either belong to the virtual network subnet or  be a public IP/VIP.
* **Back-end server pool settings**: Such as port, protocol, and cookie-based affinity. These are tied to a pool and applied to all servers within the pool.
* **Front-end port**: The public port that's opened on the application gateway. Traffic hits this port, and then redirects to one of the back-end servers.
* **Listener**: The listener has a front-end port, a protocol (Http or Https, which are case-sensitive), and the SSL certificate name (if configuring SSL offload).
* **Rule**: The rule binds the listener and the back-end server pool and defines to which pool the traffic should be directed when it hits a listener.

## Create an application gateway

The difference between using the Azure classic portal and Azure Resource Manager is the order in which you create the application gateway and the items that need to be configured.

With Resource Manager, all items that make an application gateway are configured individually and then put together to create the application gateway resource.

Follow these steps to create an application gateway:

1. Create a resource group for Resource Manager.
2. Create a virtual network, subnet, and public IP for the application gateway.
3. Create an application gateway configuration object.
4. Create an application gateway resource.

## Create a resource group for Resource Manager

Make sure that you use the latest version of Azure PowerShell. Find more info at [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

### Step 1

Log in to Azure.

```powershell
Login-AzureRmAccount
```

You're prompted to authenticate with your credentials.<BR>

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

Create a resource group. (Skip this step if you're using an existing resource group.)

```powershell
$resourceGroup = New-AzureRmResourceGroup -Name appgw-RG -Location "West US"
```

Alternatively, you can create tags for a resource group for an application gateway:

```powershell
$resourceGroup = New-AzureRmResourceGroup -Name appgw-RG -Location "West US" -Tags @{Name = "testtag"; Value = "Application Gateway URL routing"} 
```

Azure Resource Manager requires that resource groups specify a default location, which is used for all resources in that group. Make sure that all commands to create an application gateway use the same resource group.

In the preceding example, we created a resource group called "appgw-RG" and used the location "West US."

> [!NOTE]
> If you need to configure a custom probe for your application gateway, go to [Create an application gateway with custom probes by using PowerShell](application-gateway-create-probe-ps.md). See [
Application Gateway health monitoring overview](application-gateway-probe-overview.md) for more information.
> 
> 

## Create a virtual network and a subnet for the application gateway

The following example shows how to create a virtual network by using Resource Manager. This example creates a virtual network for the application gateway. Application Gateway requires its own subnet. For this reason, the subnet created for the application gateway is smaller than the virtual network address space. This lets other resources, including but not limited to web servers, be configured in the same virtual network.

### Step 1

Assign the address range 10.0.0.0/24 to the subnet variable to be used to create a virtual network.  This creates the subnet configuration object for the application gateway, which is used in the next example.

```powershell
$subnet = New-AzureRmVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24
```

### Step 2

Create a virtual network named **appgwvnet** in resource group **appgw-rg** for the West US region by using the prefix 10.0.0.0/16 with subnet 10.0.0.0/24. This completes the configuration of the virtual network with a single subnet for the application gateway to reside.

```powershell
$vnet = New-AzureRmVirtualNetwork -Name appgwvnet -ResourceGroupName appgw-RG -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $subnet
```

### Step 3

Assign the subnet variable for the next steps. This is passed to the `New-AzureRMApplicationGateway` cmdlet in a future step.

```powershell
$subnet=$vnet.Subnets[0]
```

## Create a public IP address for the front-end configuration

Create a public IP resource **publicIP01** in resource group **appgw-rg** for the West US region. Application Gateway can use a public IP address, an internal IP address, or both to receive requests for load balancing.  This example uses only a public IP address. In the following example, no DNS name is configured for creating the public IP address, because Application Gateway does not support custom DNS names on public IP addresses.  If a custom name is required for the public endpoint, create a CNAME record to point to the automatically generated DNS name for the public IP address.

```powershell
$publicip = New-AzureRmPublicIpAddress -ResourceGroupName appgw-RG -name publicIP01 -location "West US" -AllocationMethod Dynamic
```

An IP address is assigned to the application gateway when the service starts.

## Create the application gateway configuration

All configuration items must be set up before you create the application gateway. The following steps create the configuration items needed for an application gateway resource.

### Step 1

Create an application gateway IP configuration named **gatewayIP01**. When Application Gateway starts, it picks up an IP address from the configured subnet and routes network traffic to the IP addresses in the back-end IP pool. Keep in mind that each instance takes one IP address.

```powershell
$gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet
```

### Step 2

Configure the back-end IP address pool named **pool1** and **pool2** with IP addresses for **pool1** and **pool2**. These are the IP addresses of the resources that host the web application to be protected by the application gateway. These back-end pool members are all validated to be healthy by either basic or custom probes. Traffic is then routed to them when requests come into the application gateway. Back-end pools can be used by multiple rules within the application gateway. This means one back-end pool can be used for multiple web applications that reside on the same host.

```powershell
$pool1 = New-AzureRmApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 134.170.185.46, 134.170.188.221, 134.170.185.50

$pool2 = New-AzureRmApplicationGatewayBackendAddressPool -Name pool02 -BackendIPAddresses 134.170.186.47, 134.170.189.222, 134.170.186.51
```

In this example, two back-end pools route network traffic based on the URL path. One pool receives traffic from the URL path "/video," and the other pool receives traffic from the path "/image." Replace the preceding IP addresses to add your own application IP address endpoints. 

### Step 3

Configure application gateway settings **poolsetting01** and **poolsetting02** for the load-balanced network traffic in the back-end pool. In this example, you configure different back-end pool settings for the back-end pools. Each back-end pool can have its own settings.  Rules use back-end HTTP settings to route traffic to the correct back-end pool members. This determines the protocol and port that's used for sending traffic to the back-end pool members. Cookie-based sessions are also determined by the back-end HTTP settings. If enabled, cookie-based session affinity sends traffic to the same back end as previous requests for each packet.

```powershell
$poolSetting01 = New-AzureRmApplicationGatewayBackendHttpSettings -Name "besetting01" -Port 80 -Protocol Http -CookieBasedAffinity Disabled -RequestTimeout 120

$poolSetting02 = New-AzureRmApplicationGatewayBackendHttpSettings -Name "besetting02" -Port 80 -Protocol Http -CookieBasedAffinity Enabled -RequestTimeout 240
```

### Step 4

Configure the front-end IP with public IP endpoints. A listener uses the front-end IP configuration object to relate the outward-facing IP address with the listener.

```powershell
$fipconfig01 = New-AzureRmApplicationGatewayFrontendIPConfig -Name "frontend1" -PublicIPAddress $publicip
```

### Step 5

Configure the front-end port for an application gateway. The listener uses the front-end port configuration object to define what port the application gateway listens for traffic on the listener.

```powershell
$fp01 = New-AzureRmApplicationGatewayFrontendPort -Name "fep01" -Port 80
```

### Step 6

Configure the listener for the public IP address and port used to receive incoming network traffic. The following example takes the previously configured front-end IP configuration, front-end port configuration, and a protocol (Http or Https, which are case-sensitive), and configures the listener. In this example, the listener listens to HTTP traffic on port 80 on the public IP address that was created earlier.

```powershell
$listener = New-AzureRmApplicationGatewayHttpListener -Name "listener01" -Protocol Http -FrontendIPConfiguration $fipconfig01 -FrontendPort $fp01
```

### Step 7

Configure URL rule paths for the back-end pools. This step configures the relative path used by Application Gateway and defines the mapping between the URL path and the back-end pool that's assigned to handle the incoming traffic.

> [!IMPORTANT]
> Each path must start with a "/," and an asterisk is only allowed at the end. Valid examples are /xyz, /xyz*, or /xyz/*. The string fed to the path matcher does not include any text after the first "?" or "#," and those characters are not allowed. 

The following example creates two rules: one for an "/image/" path routing traffic to back-end **pool1**, and another for a "/video/" path routing traffic to back-end **pool2**. These rules ensure that traffic for each set of URLs is routed to the back end. For example, http://contoso.com/image/figure1.jpg goes to **pool1** and http://contoso.com/video/example.mp4 goes to **pool2**.

```powershell
$imagePathRule = New-AzureRmApplicationGatewayPathRuleConfig -Name "pathrule1" -Paths "/image/*" -BackendAddressPool $pool1 -BackendHttpSettings $poolSetting01

$videoPathRule = New-AzureRmApplicationGatewayPathRuleConfig -Name "pathrule2" -Paths "/video/*" -BackendAddressPool $pool2 -BackendHttpSettings $poolSetting02
```

If the path doesn't match any of the pre-defined path rules, the rule path map configuration also configures a default back-end address pool. For example, http://contoso.com/shoppingcart/test.html goes to **pool1** because it is defined as the default pool for unmatched traffic.

```powershell
$urlPathMap = New-AzureRmApplicationGatewayUrlPathMapConfig -Name "urlpathmap" -PathRules $videoPathRule, $imagePathRule -DefaultBackendAddressPool $pool1 -DefaultBackendHttpSettings $poolSetting02
```

### Step 8

Create a rule setting. This step configures the application gateway to use URL path-based routing. The `$urlPathMap` variable defined in the earlier step is now used to create the path-based rule. In this step, we associate the rule with a listener and the URL path mapping created earlier.

```powershell
$rule01 = New-AzureRmApplicationGatewayRequestRoutingRule -Name "rule1" -RuleType PathBasedRouting -HttpListener $listener -UrlPathMap $urlPathMap
```

### Step 9

Configure the number of instances and size for the application gateway.

```powershell
$sku = New-AzureRmApplicationGatewaySku -Name "Standard_Small" -Tier Standard -Capacity 2
```

## Create an application gateway

Create an application gateway with all configuration objects from the preceding steps.

```powershell
$appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-RG -Location "West US" -BackendAddressPools $pool1,$pool2 -BackendHttpSettingsCollection $poolSetting01, $poolSetting02 -FrontendIpConfigurations $fipconfig01 -GatewayIpConfigurations $gipconfig -FrontendPorts $fp01 -HttpListeners $listener -UrlPathMaps $urlPathMap -RequestRoutingRules $rule01 -Sku $sku
```

## Get an application gateway DNS name

After you've created the gateway, you'll configure the front end for communication. When using a public IP, Application Gateway requires a dynamically assigned DNS name, which is not friendly. To ensure customers can hit the application gateway, you can use a CNAME record to point to the public endpoint of the application gateway. For more information, see [Configuring a custom domain name for an Azure cloud service](../cloud-services/cloud-services-custom-domain-name-portal.md).

To configure the front-end IP CNAME record, retrieve details of the application gateway and its associated IP/DNS name by using the PublicIPAddress element attached to the application gateway. Use the application gateway's DNS name to create a CNAME record. We don't recommend the use of A records because the VIP might change on restart of Application Gateway.

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

If you want to learn about Secure Sockets Layer (SSL) offload, see [Configure an application gateway for SSL offload by using Azure Resource Manager](application-gateway-ssl-arm.md).

