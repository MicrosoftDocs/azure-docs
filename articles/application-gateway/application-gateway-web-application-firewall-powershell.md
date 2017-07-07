---
title: Configure web application firewall - Azure Application Gateway | Microsoft Docs
description: This article provides guidance on how to start using web application firewall on an existing or new application gateway.
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.assetid: 670b9732-874b-43e6-843b-d2585c160982
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/03/2017
ms.author: gwallace

---
# Configure web application firewall on a new or existing Application Gateway

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-web-application-firewall-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-web-application-firewall-powershell.md)

Learn how to create an web application firewall enabled application gateway or add web application firewall to an existing application gateway.

The web application firewall (WAF) in Azure Application Gateway protects web applications from common web-based attacks like SQL injection, cross-site scripting attacks, and session hijacks.

Azure Application Gateway is a layer-7 load balancer. It provides failover, performance-routing HTTP requests between different servers, whether they are on the cloud or on-premises. Application provides many Application Delivery Controller (ADC) features including HTTP load balancing, cookie-based session affinity, Secure Sockets Layer (SSL) offload, custom health probes, support for multi-site, and many others. To find a complete list of supported features, visit Application Gateway Overview

The following article shows how to [add web application firewall to an existing application gateway](#add-web-application-firewall-to-an-existing-application-gateway) and [create an application gateway that uses web application firewall](#create-an-application-gateway-with-web-application-firewall).

![scenario image][scenario]

## WAF configuration differences

If you have read [Create an Application Gateway with PowerShell](application-gateway-create-gateway-arm.md), you understand the SKU settings to configure when creating an application gateway. WAF provides additional settings to define when configuring the SKU on an application gateway. There are no additional changes that you make on the application gateway itself.

| **Setting** | **Details**
|---|---|
|**SKU** |A normal application gateway without WAF supports **Standard\_Small**, **Standard\_Medium**, and **Standard\_Large** sizes. With the introduction of WAF, there are two additional SKUs, **WAF\_Medium** and **WAF\_Large**. WAF is not supported on small application gateways.|
|**Tier** | The available values are **Standard** or **WAF**. When using web application firewall, **WAF** must be chosen.|
|**Mode** | This setting is the mode of WAF. allowed values are **Detection** and **Prevention**. When WAF is set up in detection mode, all threats are stored in a log file. In prevention mode, events are still logged but the attacker receives a 403 unauthorized response from the application gateway.|

## Add web application firewall to an existing application gateway

Make sure that you are using the latest version of Azure PowerShell. More info is available at [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

1. Log in to your Azure Account.

    ```powershell
    Login-AzureRmAccount
    ```

2. Select the subscription to use for this scenario.

    ```powershell
    Select-AzureRmSubscription -SubscriptionName "<Subscription name>"
    ```

3. Retrieve the gateway that you are adding web application firewall to.

    ```powershell
    $gw = Get-AzureRmApplicationGateway -Name "AdatumGateway" -ResourceGroupName "MyResourceGroup"
    ```

1. Configure the web application firewall sku. The available sizes are **WAF\_Large** and **WAF\_Medium**. When web application firewall is used the tier must be **WAF**, the capacity must be confirmed when setting the sku.

    ```powershell
    $gw | Set-AzureRmApplicationGatewaySku -Name WAF_Large -Tier WAF -Capacity 2
    ```

1. Configure the WAF settings as defined in the following example:

   For **FirewallMode**, the available values are Prevention and Detection.

    ```powershell
    $gw | Set-AzureRmApplicationGatewayWebApplicationFirewallConfiguration -Enabled $true -FirewallMode Prevention
    ```

1. Update the application gateway with the settings defined in the preceding step.

    ```powershell
    Set-AzureRmApplicationGateway -ApplicationGateway $gw
    ```

This command updates the application gateway with web application firewall. It is recommended to view [Application Gateway Diagnostics](application-gateway-diagnostics.md) to understand how to view logs for your application gateway. Due to the security nature of WAF, logs need to be reviewed regularly to understand the security posture of your web applications.

## Create an Application Gateway with web application firewall

The following steps take you through the entire process from beginning to end for creating an Application Gateway with web application firewall.

Make sure that you are using the latest version of Azure PowerShell. More info is available at [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

1. Log in to Azure by running `Login-AzureRmAccount`, you are prompted to authenticate with your credentials.

1. Check the subscriptions for the account by running `Get-AzureRmSubscription`

1. Choose which of your Azure subscriptions to use.

    ```powershell
    Select-AzureRmsubscription -SubscriptionName "<Subscription name>"
    ```

### Create a resource group

Create a resource group for the application gateway.

```powershell
New-AzureRmResourceGroup -Name appgw-rg -Location "West US"
```

Azure Resource Manager requires that all resource groups specify a location. This location is used as the default location for resources in that resource group. Make sure that all commands to create an application gateway uses the same resource group.

In the preceding example, we created a resource group called "appgw-RG" and location "West US".

> [!NOTE]
> If you need to configure a custom probe for your application gateway, see [Create an application gateway with custom probes by using PowerShell](application-gateway-create-probe-ps.md). Check out [custom probes and health monitoring](application-gateway-probe-overview.md) for more information.

### Configure virtual network

Application Gateway requires a subnet of its own. In this step you create a virtual network with an address space of 10.0.0.0/16 and two subnets, one for the application gateway and one for backend pool members.

```powershell
# Create a subnet configuration object for the application gateway subnet. A subnet for an application should have a minimum of 28 mask bits. This value leaves 10 available addresses in the subnet for Application Gateway instances. With a smaller subnet, you may not be able to add more instance of your application gateway in the future.
$gwSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name 'appgwsubnet' -AddressPrefix 10.0.0.0/24

# Create a subnet configuration object for the backend pool members subnet
$nicSubnet = New-AzureRmVirtualNetworkSubnetConfig  -Name 'appsubnet' -AddressPrefix 10.0.2.0/24

# Create the virtual network with the previous created subnets
$vnet = New-AzureRmvirtualNetwork -Name 'appgwvnet' -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $gwSubnet, $nicSubnet
```

### Configure public IP address

In order to handle external requests, application gateway requires a public IP address. This public IP address must not have a `DomainNameLabel` defined to be used by the application gateway.

```powershell
# Create a public IP address for use with the application gateway. Defining the domainnamelabel during creation is not supported for use with application gateway
$publicip = New-AzureRmPublicIpAddress -ResourceGroupName appgw-rg -name 'appgwpip' -Location "West US" -AllocationMethod Dynamic
```

### Configure the application gateway

```powershell
# Create a IP configuration. This configures what subnet the Application Gateway uses. When Application Gateway starts, it picks up an IP address from the subnet configured and routes network traffic to the IP addresses in the back-end IP pool.
$gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name 'gwconfig' -Subnet $gwSubnet

# Create a backend pool to hold the addresses or NICs for the application that application gateway is protecting.
$pool = New-AzureRmApplicationGatewayBackendAddressPool -Name 'pool01' -BackendIPAddresses 1.1.1.1, 2.2.2.2, 3.3.3.3

# Upload the authenication certificate that will be used to communicate with the backend servers
$authcert = New-AzureRmApplicationGatewayAuthenticationCertificate -Name 'whitelistcert1' -CertificateFile <full path to .cer file>

# Conifugre the backend HTTP settings to be used to define how traffic is routed to the backend pool. The authenication certificate used in the previous step is added to the backend http settings.
$poolSetting = New-AzureRmApplicationGatewayBackendHttpSettings -Name 'setting01' -Port 443 -Protocol Https -CookieBasedAffinity Enabled -AuthenticationCertificates $authcert

# Create a frontend port to be used by the listener.
$fp = New-AzureRmApplicationGatewayFrontendPort -Name 'port01'  -Port 443

# Create a frontend IP configuration to associate the public IP address with the application gateway
$fipconfig = New-AzureRmApplicationGatewayFrontendIPConfig -Name 'fip01' -PublicIPAddress $publicip

# Configure the certificate for the application gateway. This certificate is used to decrypt and re-encrypt the traffic on the application gateway.
$cert = New-AzureRmApplicationGatewaySslCertificate -Name cert01 -CertificateFile <full path to .pfx file> -Password <password for certificate file>

# Create the HTTP listener for the application gateway. Assign the front-end ip configuration, port, and ssl certificate to use.
$listener = New-AzureRmApplicationGatewayHttpListener -Name listener01 -Protocol Https -FrontendIPConfiguration $fipconfig -FrontendPort $fp -SslCertificate $cert

#Create a load balancer routing rule that configures the load balancer behavior. In this example, a basic round robin rule is created.
$rule = New-AzureRmApplicationGatewayRequestRoutingRule -Name 'rule01' -RuleType basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool

# Configure the SKU of the application gateway
$sku = New-AzureRmApplicationGatewaySku -Name WAF_Medium -Tier WAF -Capacity 2

#Configure the waf configuration settings.
$config = New-AzureRmApplicationGatewayWebApplicationFirewallConfiguration -Enabled $true -FirewallMode "Prevention"

# Create the application gateway utilizing all the previously created configuration objects
$appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Location "West US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku -WebApplicationFirewallConfig $config -SslCertificates $cert -AuthenticationCertificates $authcert
```

> [!NOTE]
> Application gateways created with the basic web application firewall configuration are configured with CRS 3.0 for protections.

## Get application gateway DNS name

Once the gateway is created, the next step is to configure the front end for communication. When using a public IP, application gateway requires a dynamically assigned DNS name, which is not friendly. To ensure end users can hit the application gateway, a CNAME record can be used to point to the public endpoint of the application gateway. [Configuring a custom domain name for in Azure](../cloud-services/cloud-services-custom-domain-name-portal.md). To do this, retrieve details of the application gateway and its associated IP/DNS name using the PublicIPAddress element attached to the application gateway. The application gateway's DNS name should be used to create a CNAME record, which points the two web applications to this DNS name. The use of A-records is not recommended since the VIP may change on restart of application gateway.

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

Learn how to configure diagnostic logging, to log the events that are detected or prevented with web application firewall by visiting [Application Gateway Diagnostics](application-gateway-diagnostics.md)

[scenario]: ./media/application-gateway-web-application-firewall-powershell/scenario.png
