---
title: Configure SSL offload - Azure Application Gateway - PowerShell | Microsoft Docs
description: This article provides instructions to create an application gateway with SSL offload by using Azure Resource Manager
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.assetid: 3c3681e0-f928-4682-9d97-567f8e278e13
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/19/2017
ms.author: gwallace

---
# Configure an application gateway for SSL offload by using Azure Resource Manager

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-ssl-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-ssl-arm.md)
> * [Azure classic PowerShell](application-gateway-ssl.md)
> * [Azure CLI 2.0](application-gateway-ssl-cli.md)

Azure Application Gateway can be configured to terminate the Secure Sockets Layer (SSL) session at the gateway to avoid costly SSL decryption tasks to happen at the web farm. SSL offload also simplifies the front-end server setup and management of the web application.

## Before you begin

1. Install the latest version of the Azure PowerShell cmdlets by using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Downloads page](https://azure.microsoft.com/downloads/).
2. Create a virtual network and a subnet for the application gateway. Make sure that no virtual machines or cloud deployments are using the subnet. The application gateway must be by itself in a virtual network subnet.
3. The servers that you configure to use the application gateway must exist or have their endpoints created either in the virtual network or with a public IP address or virtual IP address (VIP) assigned.

## What is required to create an application gateway?

* **Back-end server pool**: The list of IP addresses of the back-end servers. The IP addresses listed should belong to the virtual network subnet or should be a public IP/VIP.
* **Back-end server pool settings**: Every pool has settings like port, protocol, and cookie-based affinity. These settings are tied to a pool and are applied to all servers within the pool.
* **Front-end port**: This port is the public port that is opened on the application gateway. Traffic hits this port, and then gets redirected to one of the back-end servers.
* **Listener**: The listener has a front-end port, a protocol (Http or Https; these settings are case-sensitive), and the SSL certificate name (if configuring SSL offload).
* **Rule**: The rule binds the listener and the back-end server pool and defines which back-end server pool to direct the traffic to when it hits a particular listener. Currently, only the *basic* rule is supported. The *basic* rule is round-robin load distribution.

**Additional configuration notes**

For SSL certificates configuration, the protocol in **HttpListener** should change to **Https** (case sensitive). Add the **SslCertificate** element to **HttpListener** with the variable value configured for the SSL certificate. The front-end port should be updated to **443**.

**To enable cookie-based affinity**: You can configure an application gateway to ensure that a request from a client session is always directed to the same VM in the web farm. To accomplish this, insert a session cookie that allows the gateway to direct traffic appropriately. To enable cookie-based affinity, set **CookieBasedAffinity** to **Enabled** in the **BackendHttpSettings** element.

## Create an application gateway

The difference between using the Azure classic deployment model and using Azure Resource Manager is the order in which you create an application gateway and the items that need to be configured.

With Resource Manager, all components of an application gateway are configured individually, and then put together to create an application gateway resource.

Here are the steps needed to create an application gateway:

1. [Create a resource group for Resource Manager](#create-a-resource-group-for-resource-manager)
2. [Create virtual network, subnet, and public IP for the application gateway](#create-virtual-network-subnet-and-public-IP-for-the-application-gateway)
3. [Create an application gateway configuration object](#create-an-application-gateway-configuration-object)
4. [Create an application gateway resource](#create-an-application-gateway-resource)

## Create a resource group for Resource Manager

Make sure that you switch PowerShell mode to use the Azure Resource Manager cmdlets. For more information, see [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

   1. Enter the following command:

   ```powershell
   Login-AzureRmAccount
   ```

   2. To check the subscriptions for the account, enter the following commands:

   ```powershell
   Get-AzureRmSubscription
   ```

   You are prompted to authenticate with your credentials.

   3. To choose which of your Azure subscriptions to use, enter the following command:

   ```powershell
   Select-AzureRmSubscription -Subscriptionid "GUID of subscription"
   ```

   4. To create a resource group, enter the following command. (Skip this step if you're using an existing resource group.)

   ```powershell
   New-AzureRmResourceGroup -Name appgw-rg -Location "West US"
   ```

Azure Resource Manager requires that all resource groups specify a location. This setting is used as the default location for resources in that resource group. Make sure that all commands to create an application gateway use the same resource group.

In the previous example, we created a resource group called **appgw-RG** and the location is **West US**.

## Create a virtual network and a subnet for the application gateway

The following example shows how to create a virtual network by using Resource Manager:

   1. Enter the following command:

   ```powershell
   $subnet = New-AzureRmVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24
   ```

   This sample assigns the address range **10.0.0.0/24** to a subnet variable to be used to create a virtual network.

   2. Enter the following command:

   ```powershell
   $vnet = New-AzureRmVirtualNetwork -Name appgwvnet -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $subnet
   ```

   This sample creates a virtual network named **appgwvnet** in resource group **appgw-rg** for the **West US** region by using the prefix **10.0.0.0/16** with subnet **10.0.0.0/24**.

   3. Enter the following command:

   ```powershell
   $subnet = $vnet.Subnets[0]
   ```

   This sample assigns the subnet object to variable **$subnet** for the next steps.

## Create a public IP address for the front-end configuration

To create a public IP address for the front-end configuration, enter the following command:

```powershell
$publicip = New-AzureRmPublicIpAddress -ResourceGroupName appgw-rg -name publicIP01 -location "West US" -AllocationMethod Dynamic
```

This sample creates a public IP resource **publicIP01** in resource group **appgw-rg** for the **West US** region.

## Create an application gateway configuration object

   1. To create an application gateway configuration object, enter the following command:

   ```powershell
   $gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet
   ```

   This sample creates an application gateway IP configuration named **gatewayIP01**. When Application Gateway starts, it picks up an IP address from the configured subnet and routes the network traffic to the IP addresses in the back-end IP pool. Keep in mind that each instance takes one IP address.

   2. Enter the following command:

   ```powershell
   $pool = New-AzureRmApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 134.170.185.46, 134.170.188.221,134.170.185.50
   ```

   This sample configures the back-end IP address pool named **pool01** with IP addresses **134.170.185.46**, **134.170.188.221**, and **134.170.185.50**. Those values are the IP addresses that receive the network traffic that comes from the front-end IP endpoint. Replace the IP addresses from the preceding example with the IP addresses of your web application endpoints.

   3. Enter the following command:

   ```powershell
   $poolSetting = New-AzureRmApplicationGatewayBackendHttpSettings -Name poolsetting01 -Port 80 -Protocol Http -CookieBasedAffinity Enabled
   ```

   This sample configures application gateway setting **poolsetting01** to load-balance network traffic in the back-end pool.

   4. Enter the following command:

   ```powershell
   $fp = New-AzureRmApplicationGatewayFrontendPort -Name frontendport01  -Port 443
   ```

   This sample configures the front-end IP port named **frontendport01** for the public IP endpoint.

   5. Enter the following command:

   ```powershell
   $cert = New-AzureRmApplicationGatewaySslCertificate -Name cert01 -CertificateFile <full path for certificate file> -Password "<password>"
   ```

   This sample configures the certificate used for SSL connection. The certificate needs to be in PFX format, and the password must be between 4 to 12 characters.

   6. Enter the following command:

   ```powershell
   $fipconfig = New-AzureRmApplicationGatewayFrontendIPConfig -Name fipconfig01 -PublicIPAddress $publicip
   ```

   This sample creates the front-end IP configuration named **fipconfig01** and associates the public IP address with the front-end IP configuration.

   7. Enter the following command:

   ```powershell
   $listener = New-AzureRmApplicationGatewayHttpListener -Name listener01  -Protocol Https -FrontendIPConfiguration $fipconfig -FrontendPort $fp -SslCertificate $cert
   ```

   This sample creates the listener named **listener01** and associates the front-end port to the front-end IP configuration and certificate.

   8. Enter the following command:

   ```powershell
   $rule = New-AzureRmApplicationGatewayRequestRoutingRule -Name rule01 -RuleType Basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool
   ```

   This sample creates the load-balancer routing rule named **rule01** that configures the load-balancer behavior.

   9. Enter the following command:

   ```powershell
   $sku = New-AzureRmApplicationGatewaySku -Name Standard_Small -Tier Standard -Capacity 2
   ```

   This sample configures the instance size of the application gateway.

   > [!NOTE]
   > The default value for **InstanceCount** is **2**, with a maximum value of 10. The default value for **GatewaySize** is **Medium**. You can choose between Standard_Small, Standard_Medium, and Standard_Large.

   10. Enter the following command:

   ```powershell
   $policy = New-AzureRmApplicationGatewaySslPolicy -PolicyType Predefined -PolicyName AppGwSslPolicy20170401S
   ```

   This step defines the SSL policy to use on the application gateway. For more information, see [Configure SSL policy versions and cipher suites on Application Gateway](application-gateway-configure-ssl-policy-powershell.md).

## Create an application gateway by using New-AzureApplicationGateway

Enter the following command:

```powershell
$appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Location "West US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku -SslCertificates $cert -SslPolicy $policy
```

This sample creates an application gateway with all the configuration items from the preceding steps. In the example, the application gateway is called **appgwtest**.

## Get the application gateway DNS name

After the gateway is created, the next step is to configure the front end for communication. Application Gateway requires a dynamically assigned DNS name when using a public IP, which is not friendly. To ensure end users can hit the application gateway, you can use a CNAME record to point to the public endpoint of the application gateway. For more information, see [Configuring a custom domain name in Azure](../cloud-services/cloud-services-custom-domain-name-portal.md). 

To get the application gateway DNS name, retrieve the details of the application gateway and its associated IP/DNS name by using the **PublicIPAddress** element attached to the application gateway. Use the application gateway's DNS name to create a CNAME record, which points the two web applications to this DNS name. We don't recommend the use of A-records, because the VIP can change on restart of the application gateway.


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

If you want to configure an application gateway to use with an internal load balancer, see [Create an application gateway with an internal load balancer](application-gateway-ilb.md).

For more information about load-balancing options in general, see:

* [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
* [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)
