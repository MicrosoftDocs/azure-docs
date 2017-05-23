---
title: Configure SSL Policy and end to end SSL with Application Gateway | Microsoft Docs
description: This article describes how to configure end to end SSL with Application Gateway using Azure Resource Manager PowerShell
services: application-gateway
documentationcenter: na
author: georgewallace
manager: timlt
editor: tysonn

ms.assetid: e6d80a33-4047-4538-8c83-e88876c8834e
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/14/2016
ms.author: gwallace

---
# Configure SSL Policy and end to end SSL with Application Gateway using PowerShell

## Overview

Application Gateway supports end to end encryption of traffic. Application Gateway does this by terminating the SSL connection at the application gateway. The gateway then applies the routing rules to the traffic, re-encrypts the packet, and forwards the packet to the appropriate backend based on the routing rules defined. Any response from the web server goes through the same process back to the end user.

Another feature that application gateway supports is disabling certain SSL protocol versions. Application Gateway supports disabling the following protocol version; **TLSv1.0**, **TLSv1.1**, and **TLSv1.2**.

> [!NOTE]
> SSL 2.0 and SSL 3.0 are disabled by default and cannot be enabled. They are considered unsecure and are not able to be used with Application Gateway.

![scenario image][scenario]

## Scenario

In this scenario, you learn how to create an application gateway using end to end SSL using PowerShell.

This scenario will:

* Create a resource group named **appgw-rg**
* Create a virtual network named **appgwvnet** with a reserved CIDR block of 10.0.0.0/16.
* Create two subnets called **appgwsubnet** and **appsubnet**.
* Create a small application gateway supporting end to end SSL encryption that disables certain SSL protocols.

## Before you begin

To configure end to end SSL with an application gateway, a certificate is required for the gateway and certificates are required for the backend servers. The gateway certificate is used to encrypt and decrypt the traffic sent to it using SSL. The gateway certificate needs to be in Personal Information Exchange (pfx) format. This file format allows for the private key to be exported which is required by the application gateway to perform the encryption and decryption of traffic.

For end to end ssl encryption the backend must be whitelisted with application gateway. This is done by uploading the public certificate of the backends to the application gateway. This ensures that the application gateway only communicates with known backend instances. This further secures the end to end communication.

This process is described in the following steps:

## Create the Resource Group

This section walks you through creating a resource group, that contains the application gateway.

### Step 1

Log in to your Azure Account.

```powershell
Login-AzureRmAccount
```

### Step 2

Select the subscription to use for this scenario.

```powershell
Select-AzureRmsubscription -SubscriptionName "<Subscription name>"
```

### Step 3

Create a resource group (skip this step if you're using an existing resource group).

```powershell
New-AzureRmResourceGroup -Name appgw-rg -Location "West US"
```

## Create a virtual network and a subnet for the application gateway

The following example creates a virtual network and two subnets. One subnet is used to hold the application gateway. The other subnet is used for the backends hosting the web application.

### Step 1

Assign an address range for the subnet be used for the Application Gateway itself.

```powershell
$gwSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name 'appgwsubnet' -AddressPrefix 10.0.0.0/24
```

> [!NOTE]
> Subnets configured for application gateway should be properly sized. An application gateway can be configured for up to 10 instances. Each instance takes 1 IP address from the subnet. Too small of a subnet can adversely affect scaling out an application gateway.
> 
> 

### Step 2

Assign an address range to be used for the Backend address pool.

```powershell
$nicSubnet = New-AzureRmVirtualNetworkSubnetConfig  -Name 'appsubnet' -AddressPrefix 10.0.2.0/24
```

### Step 3

Create a virtual network with the subnets defined in the preceding steps.

```powershell
$vnet = New-AzureRmvirtualNetwork -Name 'appgwvnet' -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $gwSubnet, $nicSubnet
```

### Step 4

Retrieve the virtual network resource and subnet resources to be used in the following steps:

```powershell
$vnet = Get-AzureRmvirtualNetwork -Name 'appgwvnet' -ResourceGroupName appgw-rg
$gwSubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name 'appgwsubnet' -VirtualNetwork $vnet
$nicSubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name 'appsubnet' -VirtualNetwork $vnet
```

## Create a public IP address for the front-end configuration

Create a public IP resource to be used for the application gateway. This public IP address is used a following step.

```powershell
$publicip = New-AzureRmPublicIpAddress -ResourceGroupName appgw-rg -Name 'publicIP01' -Location "West US" -AllocationMethod Dynamic
```

> [!IMPORTANT]
> Application Gateway does not support the use of a public IP address created with a domain label defined. Only a public IP address with a dynamically created domain label is supported. If you require a friendly dns name for the application gateway, it is recommended to use a cname record as an alias.

## Create an application gateway configuration object

You must set up all configuration items before creating the application gateway. The following steps create the configuration items that are needed for an application gateway resource.

### Step 1

Create an application gateway IP configuration, this setting configures what subnet the application gateway uses. When application gateway starts, it picks up an IP address from the subnet configured and routes network traffic to the IP addresses in the back-end IP pool. Keep in mind that each instance takes one IP address.

```powershell
$gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name 'gwconfig' -Subnet $gwSubnet
```

### Step 2

Create a front-end IP configuration, this setting maps a private or public ip address to the front-end of the application gateway. The following step associates the public IP address in the preceding step with the front-end IP configuration.

```powershell
$fipconfig = New-AzureRmApplicationGatewayFrontendIPConfig -Name 'fip01' -PublicIPAddress $publicip
```

### Step 3

Configure the back-end IP address pool with the IP addresses of the backend web servers. These IP addresses are the IP addresses that receive the network traffic that comes from the front-end IP endpoint. You replace the following IP addresses to add your own application IP address endpoints.

```powershell
$pool = New-AzureRmApplicationGatewayBackendAddressPool -Name 'pool01' -BackendIPAddresses 1.1.1.1, 2.2.2.2, 3.3.3.3
```

> [!NOTE]
> A fully qualified domain name (FQDN) is also a valid value in place of an ip address for the backend servers by using the -BackendFqdns switch. 

### Step 4

Configure the front-end IP port for the public IP endpoint. This port is the port that end users connect to.

```powershell
$fp = New-AzureRmApplicationGatewayFrontendPort -Name 'port01'  -Port 443
```

### Step 5

Configure the certificate for the application gateway. This certificate is used to decrypt and re-encrypt the traffic on the application gateway.

```powershell
$cert = New-AzureRmApplicationGatewaySslCertificate -Name cert01 -CertificateFile <full path to .pfx file> -Password <password for certificate file>
```

> [!NOTE]
> This sample configures the certificate used for SSL connection. The certificate needs to be in .pfx format, and the password must be between 4 to 12 characters.

### Step 6

Create the HTTP listener for the application gateway. Assign the front-end ip configuration, port, and ssl certificate to use.

```powershell
$listener = New-AzureRmApplicationGatewayHttpListener -Name listener01 -Protocol Https -FrontendIPConfiguration $fipconfig -FrontendPort $fp -SslCertificate $cert
```

### Step 7

Upload the certificate to be used on the ssl enabled backend pool resources.

> [!NOTE]
> The default probe gets the public key from the **default** SSL binding on the back-end's IP address and compares the public key value it receives to the public key value you provide here. The retrieved public key may not necessarily be the intended site to which traffic will flow **if** you are using host headers and SNI on the back-end. If in doubt, visit https://127.0.0.1/ on the back-ends to confirm which certificate is used for the **default** SSL binding. Use the public key from that request in this section. If you are using host-headers and SNI on HTTPS bindings and you do not receive a response and certificate from a manual browser request to https://127.0.0.1/ on the back-ends, you must set up a default SSL binding on the back-ends. If you do not do so, probes will fail and the back-end will be not be whitelisted.

```powershell
$authcert = New-AzureRmApplicationGatewayAuthenticationCertificate -Name 'whitelistcert1' -CertificateFile C:\users\gwallace\Desktop\cert.cer
```

> [!NOTE]
> The certificate provided in this step should be the public key of the pfx cert present on the backend. Export the certificate (not the root certificate) installed on the backend server in .CER format and use it in this step. This step whitelists the backend with the application gateway.

### Step 8

Configure the application gateway back-end http settings. Assign the certificate uploaded in the preceding step to the http settings.

```powershell
$poolSetting = New-AzureRmApplicationGatewayBackendHttpSettings -Name 'setting01' -Port 443 -Protocol Https -CookieBasedAffinity Enabled -AuthenticationCertificates $authcert
```

### Step 9

Create a load balancer routing rule that configures the load balancer behavior. In this example, a basic round robin rule is created.

```powershell
$rule = New-AzureRmApplicationGatewayRequestRoutingRule -Name 'rule01' -RuleType basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool
```

### Step 10

Configure the instance size of the application gateway.  The available sizes are **Standard\_Small**, **Standard\_Medium**, and **Standard\_Large**.  For capacity, the available values are 1 through 10.

```powershell
$sku = New-AzureRmApplicationGatewaySku -Name Standard_Small -Tier Standard -Capacity 2
```

> [!NOTE]
> An instance count of 1 can be chosen for testing purposes. It is important to know that any instance count under two instances is not covered by the SLA and are therefore not recommended. Small gateways are to be used for dev test and not for production purposes.

### Step 11

Configure the SSL policy to be used on the Application Gateway. Application Gateway supports the ability to disable certain SSL protocol versions.

The following values are a list of protocol versions that can be disabled.

* **TLSv1_0**
* **TLSv1_1**
* **TLSv1_2**

The following example disables **TLSv1\_0**.

```powershell
$sslPolicy = New-AzureRmApplicationGatewaySslPolicy -DisabledSslProtocols TLSv1_0
```

## Create the Application Gateway

Using all the preceding steps, create the Application Gateway. The creation of the gateway is a long running process.

```powershell
$appgw = New-AzureRmApplicationGateway -Name appgateway -SslCertificates $cert -ResourceGroupName "appgw-rg" -Location "West US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku -SslPolicy $sslPolicy -AuthenticationCertificates $authcert -Verbose
```

## Disable SSL protocol versions on an existing Application Gateway

The preceding steps take you through creating an application with end to end ssl and disabling certain SSL protocol versions. The following example disables certain SSL policies on an existing application gateway.

### Step 1

Retrieve the application gateway to update.

```powershell
$gw = Get-AzureRmApplicationGateway -Name AdatumAppGateway -ResourceGroupName AdatumAppGatewayRG
```

### Step 2

Define an SSL policy. In the following example, TLSv1.0 and TLSv1.1 are disabled.

```powershell
Set-AzureRmApplicationGatewaySslPolicy -DisabledSslProtocols TLSv1_0, TLSv1_1 -ApplicationGateway $gw
```

### Step 3

Finally, update the gateway. It is important to note that this last step is a long running task. When it is done, end to end ssl is configured on the application gateway.

```powershell
$gw | Set-AzureRmApplicationGateway
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

Learn about hardening the security of your web applications with Web Application Firewall through Application Gateway by visiting [Web Application Firewall Overview](application-gateway-webapplicationfirewall-overview.md)

[scenario]: ./media/application-gateway-end-to-end-ssl-powershell/scenario.png
