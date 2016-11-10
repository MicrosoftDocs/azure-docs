---
title: Configure Web Application Firewall on new or existing Application Gateway | Microsoft Docs
description: This article provides guidance on how to start using web application firewall on an existing or new application gateway.
documentationcenter: na
services: application-gateway
author: georgewallace
manager: carmonm
editor: tysonn

ms.assetid: 670b9732-874b-43e6-843b-d2585c160982
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/10/2016
ms.author: gwallace

---
# Configure Web Application Firewall on a new or existing Application Gateway
> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-web-application-firewall-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-web-application-firewall-powershell.md)
> 
> 

The web application firewall (WAF) in Azure Application Gateway protects web applications from common web-based attacks like SQL injection, cross-site scripting attacks, and session hijacks.

Azure Application Gateway is a layer-7 load balancer. It provides failover, performance-routing HTTP requests between different servers, whether they are on the cloud or on-premises. Application provides many Application Delivery Controller (ADC) features including HTTP load balancing, cookie-based session affinity, Secure Sockets Layer (SSL) offload, custom health probes, support for multi-site, and many others. To find a complete list of supported features, visit Application Gateway Overview

The following article shows how to [add web application firewall to an existing application gateway](#add-web-application-firewall-to-an-existing-application-gateway) and [create an application gateway that uses web application firewall](#create-an-application-gateway-with-web-application-firewall).

![scenario image][scenario]

## WAF configuration differences
If you have read [Create an Application Gateway with PowerShell](application-gateway-create-gateway-arm.md), you understand the SKU settings to configure when creating an application gateway. WAF provides additional settings to define when configuring the SKU on an application gateway. There are no additional changes that you make on the application gateway itself.

**SKU** - A normal application gateway without WAF supports **Standard\_Small**, **Standard\_Medium**, and **Standard\_Large** sizes. With the introduction of WAF, there are two additional SKUs, **WAF\_Medium** and **WAF\_Large**. WAF is not supported on small application gateways.

**Tier** - The available values are **Standard** or **WAF**. When using Web Application Firewall, **WAF** must be chosen.

**Mode** - This setting is the mode of WAF. allowed values are **Detection** and **Prevention**. When WAF is set up in detection mode, all threats are stored in a log file. In prevention mode, events are still logged but the attacker receives a 403 unauthorized response from the application gateway.

## Add web application firewall to an existing application gateway
Make sure that you are using the latest version of Azure PowerShell. More info is available at [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

### Step 1
Log in to your Azure Account.

```powershell
    Login-AzureRmAccount
```

### Step 2
Select the subscription to use for this scenario.

```powershell
    Select-AzureRmSubscription -SubscriptionName "<Subscription name>"
```

### Step 3
Retrieve the gateway that you are adding Web Application Firewall to.

```powershell
    $gw = Get-AzureRmApplicationGateway -Name "AdatumGateway" -ResourceGroupName "MyResourceGroup"
```

### Step 4
Configure the web application firewall sku. The available sizes are **WAF\_Large** and **WAF\_Medium**. When web application firewall is used the tier must be **WAF**, the capacity must be confirmed when setting the sku.

```powershell
    $gw | Set-AzureRmApplicationGatewaySku -Name WAF_Large -Tier WAF -Capacity 2
```

### Step 5
Configure the WAF settings as defined in the following example:

For the **WafMode** setting, the available values are Prevention and Detection.

```powershell
    $gw | Set-AzureRmApplicationGatewayWebApplicationFirewallConfiguration -Enabled $true -FirewallMode Prevention
```

### Step 6
Update the application gateway with the settings defined in the preceding step.

```powershell
    Set-AzureRmApplicationGateway -ApplicationGateway $gw
```

This command updates the application gateway with Web Application Firewall. It is recommended to view [Application Gateway Diagnostics](application-gateway-diagnostics.md) to understand how to view logs for your application gateway. Due to the security nature of WAF, logs need to be reviewed regularly to understand the security posture of your web applications.

## Create an Application Gateway with Web Application Firewall
The following steps take you through the entire process from beginning to end for creating an Application Gateway with Web Application Firewall.

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
    Select-AzureRmsubscription -SubscriptionName "<Subscription name>"
```

### Step 4
Create a resource group (skip this step if you're using an existing resource group).

```powershell
    New-AzureRmResourceGroup -Name appgw-rg -Location "West US"
```

Azure Resource Manager requires that all resource groups specify a location. This location is used as the default location for resources in that resource group. Make sure that all commands to create an application gateway uses the same resource group.

In the preceding example, we created a resource group called "appgw-RG" and location "West US".

> [!NOTE]
> If you need to configure a custom probe for your application gateway, see [Create an application gateway with custom probes by using PowerShell](application-gateway-create-probe-ps.md). Check out [custom probes and health monitoring](application-gateway-probe-overview.md) for more information.
> 
> 

### Step 5
Assign an address range for the subnet be used for the Application Gateway itself.

```powershell
    $gwSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name 'appgwsubnet' -AddressPrefix 10.0.0.0/24
```

> [!NOTE]
> A subnet for an application should have a minimum of 28 mask bits. This value leaves 10 available addresses in the subnet for Application Gateway instances. With a smaller subnet, you may not be able to add more instance of your application gateway in the future.
> 
> 

### Step 6
Assign an address range to be used for the Backend address pool.

```powershell
    $nicSubnet = New-AzureRmVirtualNetworkSubnetConfig  -Name 'appsubnet' -AddressPrefix 10.0.2.0/24
```

### Step 7
Create a virtual network with the preceding subnets in the resource group created in step: [Create the Resource Group](#create-the-resource-group)

```powershell
    $vnet = New-AzureRmvirtualNetwork -Name 'appgwvnet' -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $gwSubnet, $nicSubnet
```

### Step 8
Retrieve the virtual network resource and subnet resources to be used in the following steps:

```powershell
    $vnet = Get-AzureRmvirtualNetwork -Name 'appgwvnet' -ResourceGroupName appgw-rg
    $gwSubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name 'appgwsubnet' -VirtualNetwork $vnet
    $nicSubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name 'appsubnet' -VirtualNetwork $vnet
```

### Step 9
Create a public IP resource to be used for the application gateway. This public IP address is used in one of the following steps:

```powershell
    $publicip = New-AzureRmPublicIpAddress -ResourceGroupName appgw-rg -name 'appgwpip' -Location "West US" -AllocationMethod Dynamic
```

> [!IMPORTANT]
> Application Gateway does not support the use of a public IP address created with a domain label defined. Only a public IP address with a dynamically created domain label is supported. If you require a friendly dns name for the application gateway, it is recommended to use a cname record as an alias.
> 
> 

### Step 10
You must set up all configuration items before creating the application gateway. The following steps create the configuration items that are needed for an application gateway resource.

Create an application gateway IP configuration, this configures what subnet the Application Gateway uses. When Application Gateway starts, it picks up an IP address from the subnet configured and routes network traffic to the IP addresses in the back-end IP pool. Keep in mind that each instance takes one IP address.

```powershell
    $gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name 'gwconfig' -Subnet $gwSubnet
```

### Step 11
Configure the back-end IP address pool with the IP addresses of the backend web servers. These IP addresses are the IP addresses that receive the network traffic that comes from the front-end IP endpoint. You replace the following IP addresses to add your own application IP address endpoints.

```powershell
    $pool = New-AzureRmApplicationGatewayBackendAddressPool -Name 'pool01' -BackendIPAddresses 1.1.1.1, 2.2.2.2, 3.3.3.3
```

### Step 12
Upload the certificate to be used on the ssl enabled backend pool resources.

```powershell
    $authcert = New-AzureRmApplicationGatewayAuthenticationCertificate -Name 'whitelistcert1' -CertificateFile <full path to .cer file>
```

### Step 13
Configure the application gateway back-end http settings. Assign the certificate uploaded in the preceding step to the http settings.

```powershell
    $poolSetting = New-AzureRmApplicationGatewayBackendHttpSettings -Name 'setting01' -Port 443 -Protocol Https -CookieBasedAffinity Enabled -AuthenticationCertificates $authcert
```

### Step 14
Configure the front-end IP port for the public IP endpoint. This port is the port that end users connect to.

```powershell
    $fp = New-AzureRmApplicationGatewayFrontendPort -Name 'port01'  -Port 443
```

### Step 15
Create a front-end IP configuration, this setting maps a private or public ip address to the front-end of the application gateway. The following step associates the public IP address in the preceding step with the front-end IP configuration.

```powershell
    $fipconfig = New-AzureRmApplicationGatewayFrontendIPConfig -Name 'fip01' -PublicIPAddress $publicip
```

### Step 16
Configure the certificate for the application gateway. This certificate is used to decrypt and re-encrypt the traffic on the application gateway.

```powershell
    $cert = New-AzureRmApplicationGatewaySslCertificate -Name cert01 -CertificateFile <full path to .pfx file> -Password <password for certificate file>
```

### Step 17
Create the HTTP listener for the application gateway. Assign the front-end ip configuration, port, and ssl certificate to use.

```powershell
    $listener = New-AzureRmApplicationGatewayHttpListener -Name listener01 -Protocol Https -FrontendIPConfiguration $fipconfig -FrontendPort $fp -SslCertificate $cert
```

### Step 18
Create a load balancer routing rule that configures the load balancer behavior. In this example, a basic round robin rule is created.

```powershell
    $rule = New-AzureRmApplicationGatewayRequestRoutingRule -Name 'rule01' -RuleType basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool
```

### Step 19
Configure the instance size of the application gateway.

```powershell
    $sku = New-AzureRmApplicationGatewaySku -Name WAF_Medium -Tier WAF -Capacity 2
```

> [!NOTE]
> You can choose between **WAF\_Medium** and **WAF\_Large**, the tier when using WAF is always **WAF**. Capacity is any number between 1 and 10.
> 
> 

### Step 20
Configure the mode for WAF, acceptable values are **Prevention** and **Detection**.

```powershell
    $config = New-AzureRmApplicationGatewayWafConfig -Enabled $true -WafMode "Prevention"
```

### Step 21
Create an application gateway with all configuration items from the preceding steps. In this example, the application gateway is called "appgwtest".

```powershell
    $appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Location "West US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku -WebApplicationFirewallConfig $config -SslCertificates $cert -AuthenticationCertificates $authcert
```

## Get application gateway DNS name
Once the gateway is created, the next step is to configure the front end for communication. When using a public IP, application gateway requires a dynamically assigned DNS name, which is not friendly. To ensure end users can hit the application gateway a CNAME record can be used to point to the public endpoint of the application gateway. [Configuring a custom domain name for in Azure](../cloud-services/cloud-services-custom-domain-name-portal.md). To do this, retrieve details of the application gateway and its associated IP/DNS name using the PublicIPAddress element attached to the application gateway. The application gateway's DNS name should be used to create a CNAME record, which points the two web applications to this DNS name. The use of A-records is not recommended since the VIP may change on restart of application gateway.

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
Learn how to configure diagnostic logging, to log the events that are detected or prevented with Web Application Firewall by visiting [Application Gateway Diagnostics](application-gateway-diagnostics.md)

[scenario]: ./media/application-gateway-web-application-firewall-powershell/scenario.png
