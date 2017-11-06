---
title: 'Configure a web application firewall: Azure Application Gateway | Microsoft Docs'
description: This article provides guidance on how to start using a web application firewall on an existing or new application gateway.
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
# Configure a web application firewall on a new or existing application gateway

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-web-application-firewall-portal.md)
> * [PowerShell](application-gateway-web-application-firewall-powershell.md)
> * [Azure CLI](application-gateway-web-application-firewall-cli.md)

Learn how to create a web application firewall (WAF)-enabled application gateway. Also learn how to add a WAF to an existing application gateway.

The WAF in Azure Application Gateway protects web applications from common web-based attacks like SQL injection, cross-site scripting attacks, and session hijacks.

 Application Gateway is a layer-7 load balancer. It provides failover, performance-routing HTTP requests between different servers, whether they're on the cloud or on-premises. Application Gateway provides many application delivery controller (ADC) features:

 * HTTP load balancing
 * Cookie-based session affinity
 * Secure Sockets Layer (SSL) offload
 * Custom health probes
 * Support for multisite functionality
 
 To find a complete list of supported features, see [Overview of Application Gateway](application-gateway-introduction.md).

This article shows how to [add a WAF to an existing application gateway](#add-web-application-firewall-to-an-existing-application-gateway). It also shows how to [create an application gateway that uses a WAF](#create-an-application-gateway-with-web-application-firewall).

![Scenario image][scenario]

## WAF configuration differences

If you've read [Create an application gateway with PowerShell](application-gateway-create-gateway-arm.md), you understand the SKU settings to configure when you create an application gateway. The WAF provides additional settings to define when you configure an SKU on an application gateway. There are no additional changes that you make on the application gateway itself.

| **Setting** | **Details**
|---|---|
|**SKU** |A normal application gateway without a WAF supports **Standard\_Small**, **Standard\_Medium**, and **Standard\_Large** sizes. With the introduction of a WAF, there are two additional SKUs, **WAF\_Medium** and **WAF\_Large**. A WAF is not supported on small application gateways.|
|**Tier** | The available values are **Standard** or **WAF**. When you use a WAF, you must choose **WAF**.|
|**Mode** | This setting is the mode of the WAF. Allowed values are **Detection** and **Prevention**. When the WAF is set up in **Detection** mode, all threats are stored in a log file. In **Prevention** mode, events are still logged but the attacker receives a 403 unauthorized response from the application gateway.|

## Add a web application firewall to an existing application gateway

Make sure that you use the latest version of Azure PowerShell. For more information, see [Use Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

1. Sign in to your Azure account.

    ```powershell
    Login-AzureRmAccount
    ```

2. Select the subscription to use for this scenario.

    ```powershell
    Select-AzureRmSubscription -SubscriptionName "<Subscription name>"
    ```

3. Retrieve the gateway where you want to add a WAF.

    ```powershell
    $gw = Get-AzureRmApplicationGateway -Name "AdatumGateway" -ResourceGroupName "MyResourceGroup"
    ```

4. Configure the WAF SKU. The available sizes are **WAF\_Large** and **WAF\_Medium**. When you use a WAF, the tier must be **WAF**. Confirm the capacity when you set the SKU.

    ```powershell
    $gw | Set-AzureRmApplicationGatewaySku -Name WAF_Large -Tier WAF -Capacity 2
    ```

5. Configure the WAF settings as defined in the following example. For **FirewallMode**, the available values are **Prevention** and **Detection**.

    ```powershell
    $gw | Set-AzureRmApplicationGatewayWebApplicationFirewallConfiguration -Enabled $true -FirewallMode Prevention
    ```

6. Update the application gateway with the settings you defined in the preceding step.

    ```powershell
    Set-AzureRmApplicationGateway -ApplicationGateway $gw
    ```

This command updates the application gateway with a WAF. To understand how to view logs for your application gateway, see [Application Gateway diagnostics](application-gateway-diagnostics.md). Due to the security nature of a WAF, review logs regularly to understand the security posture of your web applications.

## Create an application gateway with a web application firewall

The following steps take you through the entire process of creating an application gateway with a WAF.

Make sure that you use the latest version of Azure PowerShell. For more information, see [Use Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

1. Sign in to Azure by running `Login-AzureRmAccount`. You're prompted to authenticate with your credentials.

2. Check the subscriptions for the account by running `Get-AzureRmSubscription`.

3. Choose which Azure subscription to use.

    ```powershell
    Select-AzureRmsubscription -SubscriptionName "<Subscription name>"
    ```

### Create a resource group

Create a resource group for the application gateway.

```powershell
New-AzureRmResourceGroup -Name appgw-rg -Location "West US"
```

Azure Resource Manager requires that all resource groups specify a location. This location is used as the default location for resources in that resource group. Make sure that all commands to create an application gateway use the same resource group.

In the preceding example, we created a resource group called "appgw-RG" with the location "West US."

> [!NOTE]
> If you need to configure a custom probe for your application gateway, see [Create an application gateway with custom probes by using PowerShell](application-gateway-create-probe-ps.md). For more information, see [Custom probes and health monitoring](application-gateway-probe-overview.md).

### Configure a virtual network

An application gateway requires a subnet of its own. In this step, you create a virtual network with an address space of 10.0.0.0/16 and two subnets, one for the application gateway and one for back-end pool members.

```powershell
# Create a subnet configuration object for the application gateway subnet. A subnet for an application should have a minimum of 28 mask bits. This value leaves 10 available addresses in the subnet for application gateway instances. With a smaller subnet, you might not be able to add more instances of your application gateway in the future.
$gwSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name 'appgwsubnet' -AddressPrefix 10.0.0.0/24

# Create a subnet configuration object for the back-end pool members subnet.
$nicSubnet = New-AzureRmVirtualNetworkSubnetConfig  -Name 'appsubnet' -AddressPrefix 10.0.2.0/24

# Create the virtual network with the previously created subnets.
$vnet = New-AzureRmvirtualNetwork -Name 'appgwvnet' -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $gwSubnet, $nicSubnet
```

### Configure the public IP address

To handle external requests, the application gateway requires a public IP address. This public IP address must not have a `DomainNameLabel` defined to be used by the application gateway.

```powershell
# Create a public IP address for use with the application gateway. Defining the `DomainNameLabel` during creation is not supported for use with the application gateway.
$publicip = New-AzureRmPublicIpAddress -ResourceGroupName appgw-rg -name 'appgwpip' -Location "West US" -AllocationMethod Dynamic
```

### Configure the application gateway

```powershell
# Create an IP configuration to configure which subnet the application gateway uses. When the application gateway starts, it picks up an IP address from the configured subnet and routes network traffic to the IP addresses in the back-end IP pool.
$gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name 'gwconfig' -Subnet $gwSubnet

# Create a back-end pool to hold the addresses or NIC handles for the application that the application gateway is protecting.
$pool = New-AzureRmApplicationGatewayBackendAddressPool -Name 'pool01' -BackendIPAddresses 1.1.1.1, 2.2.2.2, 3.3.3.3

# Upload the authentication certificate to be used to communicate with the back-end servers.
$authcert = New-AzureRmApplicationGatewayAuthenticationCertificate -Name 'whitelistcert1' -CertificateFile <full path to .cer file>

# Configure the back-end HTTP settings to be used to define how traffic is routed to the back-end pool. The authentication certificate used in the previous step is added to the back-end HTTP settings.
$poolSetting = New-AzureRmApplicationGatewayBackendHttpSettings -Name 'setting01' -Port 443 -Protocol Https -CookieBasedAffinity Enabled -AuthenticationCertificates $authcert

# Create a front-end port to be used by the listener.
$fp = New-AzureRmApplicationGatewayFrontendPort -Name 'port01'  -Port 443

# Create a front-end IP configuration to associate the public IP address with the application gateway.
$fipconfig = New-AzureRmApplicationGatewayFrontendIPConfig -Name 'fip01' -PublicIPAddress $publicip

# Configure the certificate for the application gateway. This certificate is used to decrypt and re-encrypt the traffic on the application gateway.
$cert = New-AzureRmApplicationGatewaySslCertificate -Name cert01 -CertificateFile <full path to .pfx file> -Password <password for certificate file>

# Create the HTTP listener for the application gateway. Assign the front-end IP configuration, port, and SSL certificate to use.
$listener = New-AzureRmApplicationGatewayHttpListener -Name listener01 -Protocol Https -FrontendIPConfiguration $fipconfig -FrontendPort $fp -SslCertificate $cert

# Create a load-balancer routing rule that configures the load balancer behavior. In this example, a basic round-robin rule is created.
$rule = New-AzureRmApplicationGatewayRequestRoutingRule -Name 'rule01' -RuleType basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool

# Configure the SKU of the application gateway.
$sku = New-AzureRmApplicationGatewaySku -Name WAF_Medium -Tier WAF -Capacity 2

# Define the SSL policy to use.
$policy = New-AzureRmApplicationGatewaySslPolicy -PolicyType Predefined -PolicyName AppGwSslPolicy20170401S

# Configure the WAF configuration settings.
$config = New-AzureRmApplicationGatewayWebApplicationFirewallConfiguration -Enabled $true -FirewallMode "Prevention"

# Create the application gateway by using all the previously created configuration objects.
$appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Location "West US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku -WebApplicationFirewallConfig $config -SslCertificates $cert -AuthenticationCertificates $authcert
```

> [!NOTE]
> Application gateways created with the basic WAF configuration are configured with CRS 3.0 for protections.

## Get an application gateway DNS name

After the gateway is created, the next step is to configure the front end for communication. When you use a public IP, the application gateway requires a dynamically assigned DNS name, which is not friendly. To ensure that users can hit the application gateway, use a CNAME record to point to the public endpoint of the application gateway. For more information, see [Configure a custom domain name for an Azure cloud service](../cloud-services/cloud-services-custom-domain-name-portal.md). 

To configure an alias, retrieve details of the application gateway and its associated IP/DNS name by using the PublicIPAddress element attached to the application gateway. Use the application gateway's DNS name to create a CNAME record, which points the two web applications to this DNS name. We do not recommend using A records, because the VIP might change when the application gateway restarts.

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

To learn how to configure diagnostic logging to log the events that are detected or prevented with a WAF, see [Application Gateway diagnostics](application-gateway-diagnostics.md).

[scenario]: ./media/application-gateway-web-application-firewall-powershell/scenario.png
