---
title: Create and manage an Azure Application Gateway - PowerShell | Microsoft Docs
description: This page provides instructions to create, configure, start, and delete an Azure application gateway by using Azure Resource Manager
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.assetid: 866e9b5f-0222-4b6a-a95f-77bc3d31d17b
ms.service: application-gateway
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/04/2017
ms.author: gwallace

---
# Create, start, or delete an application gateway by using Azure Resource Manager

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-gateway-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-gateway-arm.md)
> * [Azure Classic PowerShell](application-gateway-create-gateway.md)
> * [Azure Resource Manager template](application-gateway-create-gateway-arm-template.md)
> * [Azure CLI](application-gateway-create-gateway-cli.md)

Azure Application Gateway is a layer-7 load balancer. It provides failover, performance-routing HTTP requests between different servers, whether they are on the cloud or on-premises.
Application Gateway provides many Application Delivery Controller (ADC) features including HTTP load balancing, cookie-based session affinity, Secure Sockets Layer (SSL) offload, custom health probes, support for multi-site, and many others.

To find a complete list of supported features, visit [Application Gateway Overview](application-gateway-introduction.md)

This article walks you through the steps to create, configure, start, and delete an application gateway.

> [!IMPORTANT]
> Before you work with Azure resources, it is important to understand that Azure currently has two deployment models: Resource Manager and classic. Make sure that you understand [deployment models and tools](../azure-classic-rm.md) before working with any Azure resource. You can view the documentation for different tools by clicking the tabs at the top of this article. This document covers creating an application gateway by using Azure Resource Manager. To use the classic version, go to [Create an application gateway classic deployment by using PowerShell](application-gateway-create-gateway.md).

## Before you begin

1. Install the latest version of the Azure PowerShell cmdlets by using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Downloads page](https://azure.microsoft.com/downloads/).
1. If you have an existing virtual network, either select an existing empty subnet or create a subnet in your existing virtual network solely for use by the application gateway. You cannot deploy the application gateway to a different virtual network than the resources you intend to deploy behind the application gateway.
1. The servers that you configure to use the application gateway must exist or have their endpoints created either in the virtual network or with a public IP/VIP assigned.

## What is required to create an application gateway?

* **Back-end server pool:** The list of IP addresses, FQDNs, or NICs of the back-end servers. If IP addresses are used, they should either belong to the virtual network subnet or should be a public IP/VIP.
* **Back-end server pool settings:** Every pool has settings like port, protocol, and cookie-based affinity. These settings are tied to a pool and are applied to all servers within the pool.
* **Front-end port:** This port is the public port that is opened on the application gateway. Traffic hits this port, and then gets redirected to one of the back-end servers.
* **Listener:** The listener has a front-end port, a protocol (Http or Https, these values are case-sensitive), and the SSL certificate name (if configuring SSL offload).
* **Rule:** The rule binds the listener, the back-end server pool and defines which back-end server pool the traffic should be directed to when it hits a particular listener.

## Create an application gateway

The difference between using Azure Classic and Azure Resource Manager is the order in which you create the application gateway and the items that need to be configured.

With Resource Manager, all items that make an application gateway are configured individually and then put together to create the application gateway resource.

The following are the steps that are needed to create an application gateway.

## Create a resource group for Resource Manager

Make sure that you are using the latest version of Azure PowerShell. More info is available at [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

### Step 1

Log in to Azure

```powershell
Login-AzureRmAccount
```

You are prompted to authenticate with your credentials.

### Step 2

Check the subscriptions for the account.

```powershell
Get-AzureRmSubscription
```

### Step 3

Choose which of your Azure subscriptions to use.

```powershell
Select-AzureRmSubscription -Subscriptionid "GUID of subscription"
```

### Step 4

Create a resource group (skip this step if you're using an existing resource group).

```powershell
New-AzureRmResourceGroup -Name appgw-rg -Location "West US"
```

Azure Resource Manager requires that all resource groups specify a location. This location is used as the default location for resources in that resource group. Make sure that all commands to create an application gateway uses the same resource group.

In the example above, we created a resource group called **appgw-RG** and location **West US**.

> [!NOTE]
> If you need to configure a custom probe for your application gateway, visit: [Create an application gateway with custom probes by using PowerShell](application-gateway-create-probe-ps.md). Check out [custom probes and health monitoring](application-gateway-probe-overview.md) for more information.

## Create a virtual network and a subnet

The following example shows how to create a virtual network by using Resource Manager. This example creates a VNET for the Application Gateway. Application Gateway requires it's own subnet, for this reason the subnet created for the Application Gateway is smaller than the VNET address space. By using a smaller subnet it allows for other resources, including but not limited to web servers to be configured in the same VNET.

### Step 1

Assign the address range 10.0.0.0/24 to the subnet variable to be used to create a virtual network. This step creates the subnet configuration object for the Application Gateway, which is used in the next example.

```powershell
$subnet = New-AzureRmVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24
```

### Step 2

Create a virtual network named **appgwvnet** in resource group **appgw-rg** for the West US region using the prefix 10.0.0.0/16 with subnet 10.0.0.0/24. This step completes the configuration of the VNET with a single subnet for the Application Gateway to reside.

```powershell
$vnet = New-AzureRmVirtualNetwork -Name appgwvnet -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $subnet
```

### Step 3

Assign the subnet variable for the next steps, this variable is passed to the `New-AzureRMApplicationGateway` cmdlet in a future step.

```powershell
$subnet=$vnet.Subnets[0]
```

## Create a public IP address

Create a public IP resource **publicIP01** in resource group **appgw-rg** for the West US region. Application Gateway can use a public IP address, internal IP address or both to receive requests for load balancing.  This example only uses a public IP address. In the following example, no DNS name is configured for creating the Public IP address.  Application Gateway does not support custom DNS names on public IP addresses.  If a custom name is required for the public endpoint, a CNAME record should be created to point to the automatically generated DNS name for the public IP address.

```powershell
$publicip = New-AzureRmPublicIpAddress -ResourceGroupName appgw-rg -name publicIP01 -location "West US" -AllocationMethod Dynamic
```

> [!NOTE]
> An IP address is assigned to the application gateway when the service starts.

## Create the application gateway configuration objects

All configuration items must be set up before creating the application gateway. The following steps create the configuration items that are needed for an application gateway resource.

### Step 1

Create an application gateway IP configuration named **gatewayIP01**. When Application Gateway starts, it picks up an IP address from the subnet configured and route network traffic to the IP addresses in the back-end IP pool. Keep in mind that each instance takes one IP address.

```powershell
$gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet
```

### Step 2

Configure the back-end IP address pool named **pool01** with IP addresses for **pool1**. These IP addresses are the IP addresses of the resources that are hosting the web application to be protected by the application gateway. These backend pool members are all validated to be healthy by probes whether they are basic probes or custom probes.  Traffic is then routed to them when requests come into the application gateway. Backend pools can be used by multiple rules within the application gateway, which means one backend pool could be used for multiple web applications that reside on the same host.

```powershell
$pool = New-AzureRmApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 134.170.185.46, 134.170.188.221, 134.170.185.50
```

In this example, there are two back-end pools to route network traffic based on the URL path. One pool receives traffic from URL path "/video" and other pool receive traffic from path "/image". Replace the preceding IP addresses to add your own application IP address endpoints.

### Step 3

Configure application gateway setting **poolsetting01** for the load-balanced network traffic in the back-end pool. Each back-end pool can have its own back-end pool setting.  Backend HTTP settings are used by rules to route traffic to the correct backend pool members. Backend HTTP settings determine the protocol and port that is used when sending traffic to the backend pool members. Cookie-based sessions are also determined by the backend HTTP settings.  If enabled, cookie-based session affinity sends traffic to the same backend as previous requests for each packet.

```powershell
$poolSetting01 = New-AzureRmApplicationGatewayBackendHttpSettings -Name "besetting01" -Port 80 -Protocol Http -CookieBasedAffinity Disabled -RequestTimeout 120
```

### Step 4

Configure the front-end port for an application gateway. The front-end port configuration object is used by a listener to define what port the Application Gateway listens for traffic on the listener.

```powershell
$fp = New-AzureRmApplicationGatewayFrontendPort -Name frontendport01  -Port 80
```

### Step 5

Configure the front-end IP with public IP endpoint. The front-end IP configuration object is used by a listener to relate the outward facing IP address with the listener.

```powershell
$fipconfig = New-AzureRmApplicationGatewayFrontendIPConfig -Name fipconfig01 -PublicIPAddress $publicip
```

### Step 6

Configure the listener. This step configures the listener for the public IP address and port used to receive incoming network traffic. The following example takes the previously configured front-end IP configuration, front-end port configuration, and a protocol (http or https) and configures the listener. In this example, the listener listens to HTTP traffic on port 80 on the public IP address that was created earlier.

```powershell
$listener = New-AzureRmApplicationGatewayHttpListener -Name listener01 -Protocol Http -FrontendIPConfiguration $fipconfig -FrontendPort $fp
```

### Step 7

Create the load balancer routing rule named **rule01** that configures the load balancer behavior. The back-end pool settings, listener, and back-end pool created in the previous steps make up the rule. Based on the criteria defined traffic is routed to the appropriate backend.

```powershell
$rule = New-AzureRmApplicationGatewayRequestRoutingRule -Name rule01 -RuleType Basic -BackendHttpSettings $poolSetting01 -HttpListener $listener -BackendAddressPool $pool
```

### Step 8

Configure the number of instances and size for the application gateway.

```powershell
$sku = New-AzureRmApplicationGatewaySku -Name Standard_Small -Tier Standard -Capacity 2
```

> [!NOTE]
> The default value for **InstanceCount** is 2, with a maximum value of 10. The default value for **GatewaySize** is Medium. You can choose between **Standard_Small**, **Standard_Medium**, and **Standard_Large**.

## Create the application gateway

Create an application gateway with all configuration items from the preceding steps. In this example, the application gateway is called **appgwtest**.

```powershell
$appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Location "West US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku
```

Retrieve DNS and VIP details of the application gateway from the public IP resource attached to the application gateway.

```powershell
Get-AzureRmPublicIpAddress -Name publicIP01 -ResourceGroupName appgw-rg  
```

## Delete the application gateway

To delete an application gateway, follow these steps:

### Step 1

Get the application gateway object and associate it to a variable `$getgw`.

```powershell
$getgw = Get-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg
```

### Step 2

Use `Stop-AzureRmApplicationGateway` to stop the application gateway.

```powershell
Stop-AzureRmApplicationGateway -ApplicationGateway $getgw
```

Once the application gateway is in a stopped state, use the `Remove-AzureRmApplicationGateway` cmdlet to remove the service.

```powershell
Remove-AzureRmApplicationGateway -Name $appgwtest -ResourceGroupName appgw-rg -Force
```

> [!NOTE]
> The **-force** switch can be used to suppress the remove confirmation message.

To verify that the service has been removed, you can use the `Get-AzureRmApplicationGateway` cmdlet. This step is not required.

```powershell
Get-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg
```

## Get application gateway DNS name

Once the gateway is created, the next step is to configure the front end for communication. When using a public IP, application gateway requires a dynamically assigned DNS name, which is not friendly. To ensure end users can hit the application gateway, a CNAME record can be used to point to the public endpoint of the application gateway. [Configuring a custom domain name for in Azure](../cloud-services/cloud-services-custom-domain-name-portal.md). To To find the dynamically created DNS name, retrieve details of the application gateway and its associated IP/DNS name using the PublicIPAddress element attached to the application gateway. The application gateway's DNS name should be used to create a CNAME record, which points the two web applications to this DNS name. The use of A-records is not recommended since the VIP may change on restart of application gateway.

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

## Delete all resources

To delete all resources created in this article, complete the following steps:

```powershell
Remove-AzureRmResourceGroup -Name appgw-RG
```

## Next steps

If you want to configure SSL offload, visit: [Configure an application gateway for SSL offload](application-gateway-ssl.md).

If you want to configure an application gateway to use with an internal load balancer, visit: [Create an application gateway with an internal load balancer (ILB)](application-gateway-ilb.md).

If you want more information about load balancing options in general, visit:

* [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
* [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)

