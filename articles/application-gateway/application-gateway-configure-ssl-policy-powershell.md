---
title: Configure TLS policy using PowerShell
titleSuffix: Azure Application Gateway
description: This article provides instructions to configure TLS Policy on Azure Application Gateway
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 06/06/2023
ms.author: greglin 
ms.custom: devx-track-azurepowershell
---

# Configure TLS policy versions and cipher suites on Application Gateway

Learn how to configure TLS/SSL policy versions and cipher suites on Application Gateway. You can select from a list of predefined policies that contain different configurations of TLS policy versions and enabled cipher suites. You also have the ability to define a [custom TLS policy](#configure-a-custom-tls-policy) based on your requirements.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

> [!NOTE]
> We recommend using TLS 1.2 as your minimum TLS protocol version for better security on your Application Gateway. 

## Get available TLS options

The `Get-AzApplicationGatewayAvailableSslOptions` cmdlet provides a listing of available pre-defined policies, available cipher suites, and protocol versions that can be configured. The following example shows an example output from running the cmdlet.

> [!IMPORTANT]
> The default TLS policy is set to AppGwSslPolicy20220101 for API versions 2023-02-01 or higher. Visit [TLS policy overview](./application-gateway-ssl-policy-overview.md#default-tls-policy) to know more.

```
DefaultPolicy: AppGwSslPolicy20150501
PredefinedPolicies:
    /subscriptions/xxx-xxx/resourceGroups//providers/Microsoft.Network/ApplicationGatewayAvailableSslOptions/default/Applic
ationGatewaySslPredefinedPolicy/AppGwSslPolicy20150501
    /subscriptions/xxx-xxx/resourceGroups//providers/Microsoft.Network/ApplicationGatewayAvailableSslOptions/default/Applic
ationGatewaySslPredefinedPolicy/AppGwSslPolicy20170401
    /subscriptions/xxx-xxx/resourceGroups//providers/Microsoft.Network/ApplicationGatewayAvailableSslOptions/default/Applic
ationGatewaySslPredefinedPolicy/AppGwSslPolicy20170401S
    /subscriptions/xxx-xxx/resourceGroups//providers/Microsoft.Network/ApplicationGatewayAvailableSslOptions/default/Applic
ationGatewaySslPredefinedPolicy/AppGwSslPolicy20220101
    /subscriptions/xxx-xxx/resourceGroups//providers/Microsoft.Network/ApplicationGatewayAvailableSslOptions/default/Applic
ationGatewaySslPredefinedPolicy/AppGwSslPolicy20220101S

AvailableCipherSuites:
    TLS_AES_128_GCM_SHA256
    TLS_AES_256_GCM_SHA384
    TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
    TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
    TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
    TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
    TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
    TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
    TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
    TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
    TLS_DHE_RSA_WITH_AES_256_CBC_SHA
    TLS_DHE_RSA_WITH_AES_128_CBC_SHA
    TLS_RSA_WITH_AES_256_GCM_SHA384
    TLS_RSA_WITH_AES_128_GCM_SHA256
    TLS_RSA_WITH_AES_256_CBC_SHA256
    TLS_RSA_WITH_AES_128_CBC_SHA256
    TLS_RSA_WITH_AES_256_CBC_SHA
    TLS_RSA_WITH_AES_128_CBC_SHA
    TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
    TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
    TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
    TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
    TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA
    TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA
    TLS_DHE_DSS_WITH_AES_256_CBC_SHA256
    TLS_DHE_DSS_WITH_AES_128_CBC_SHA256
    TLS_DHE_DSS_WITH_AES_256_CBC_SHA
    TLS_DHE_DSS_WITH_AES_128_CBC_SHA
    TLS_RSA_WITH_3DES_EDE_CBC_SHA
    TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA

AvailableProtocols:
    TLSv1_0
    TLSv1_1
    TLSv1_2
    TLSv1_3
```

## List pre-defined TLS Policies

Application gateway comes with multiple pre-defined policies that can be used. The `Get-AzApplicationGatewaySslPredefinedPolicy` cmdlet retrieves these policies. Each policy has different protocol versions and cipher suites enabled. These pre-defined policies can be used to quickly configure a TLS policy on your application gateway. By default **AppGwSslPolicy20150501** is selected if no specific TLS policy is defined.

The following output is an example of running `Get-AzApplicationGatewaySslPredefinedPolicy`.

```
Name: AppGwSslPolicy20150501
MinProtocolVersion: TLSv1_0
CipherSuites:
    TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
    TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
    TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
    TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
    TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
    TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
    TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
    TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
    TLS_DHE_RSA_WITH_AES_256_CBC_SHA
    TLS_DHE_RSA_WITH_AES_128_CBC_SHA
    TLS_RSA_WITH_AES_256_GCM_SHA384
 ...
Name: AppGwSslPolicy20170401
MinProtocolVersion: TLSv1_1
CipherSuites:
    TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
    TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
    TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA
    TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA
    TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
    TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
    TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
...
```

## Configure a custom TLS policy

When configuring a custom TLS policy, you pass the following parameters: PolicyType, MinProtocolVersion, CipherSuite, and ApplicationGateway. If you attempt to pass other parameters, you get an error when creating or updating the Application Gateway. The following example sets a custom TLS policy on an application gateway. It sets the minimum protocol version to `TLSv1_1` and enables the following cipher suites:

* TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256

```powershell
# get an application gateway resource
$gw = Get-AzApplicationGateway -Name AdatumAppGateway -ResourceGroup AdatumAppGatewayRG

# set the TLS policy on the application gateway
Set-AzApplicationGatewaySslPolicy -ApplicationGateway $gw -PolicyType Custom -MinProtocolVersion TLSv1_1 -CipherSuite "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256", "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384"

# validate the TLS policy locally
Get-AzApplicationGatewaySslPolicy -ApplicationGateway $gw

# update the gateway with validated TLS policy
Set-AzApplicationGateway -ApplicationGateway $gw
```

> [!IMPORTANT]
> - If you're using a custom SSL policy in Application Gateway v1 SKU (Standard or WAF), make sure that you add the mandatory cipher &#34;TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256&#34; to the list. This cipher is required to enable metrics and logging in the Application Gateway v1 SKU. This is not mandatory for Application Gateway v2 SKU (Standard_v2 or WAF_v2).
> - Cipher suites "TLS_AES_128_GCM_SHA256" and "TLS_AES_256_GCM_SHA384" with TLSv1.3 are not customizable and included by default when setting a CustomV2 policy with a minimum TLS version of 1.2 or 1.3. These two cipher suites won't appear in the Get Details output, with an exception of Portal.

To set minimum protocol version to 1.3, you must use the following command:

```powershell
Set-AzApplicationGatewaySslPolicy -ApplicationGateway $AppGW -MinProtocolVersion TLSv1_3 -PolicyType CustomV2 -CipherSuite @()
```

This illustration further explains the usage of CustomV2 policy with minimum protocol versions 1.2 and 1.3.

:::image type="content" source="media/application-gateway-configure-ssl-policy-powershell/custom-v2-PS-commands.png" alt-text="Diagram that shows use of ciphersuite parameter for the CustomV2 policy.":::

## Create an application gateway with a pre-defined TLS policy

When configuring a Predefined TLS policy, you pass the following parameters: PolicyType, PolicyName, and ApplicationGateway. If you attempt to pass other parameters, you get an error when creating or updating the Application Gateway.

The following example creates a new application gateway with a pre-defined TLS policy.

```powershell
# Create a resource group
$rg = New-AzResourceGroup -Name ContosoRG -Location "East US"

# Create a subnet for the application gateway
$subnet = New-AzVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24

# Create a virtual network with a 10.0.0.0/16 address space
$vnet = New-AzVirtualNetwork -Name appgwvnet -ResourceGroupName $rg.ResourceGroupName -Location "East US" -AddressPrefix 10.0.0.0/16 -Subnet $subnet

# Retrieve the subnet object for later use
$subnet = $vnet.Subnets[0]

# Create a public IP address
$publicip = New-AzPublicIpAddress -ResourceGroupName $rg.ResourceGroupName -name publicIP01 -location "East US" -AllocationMethod Dynamic

# Create an ip configuration object
$gipconfig = New-AzApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet

# Create a backend pool for backend web servers
$pool = New-AzApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 134.170.185.46, 134.170.188.221,134.170.185.50

# Define the backend http settings to be used.
$poolSetting = New-AzApplicationGatewayBackendHttpSettings -Name poolsetting01 -Port 80 -Protocol Http -CookieBasedAffinity Enabled

# Create a new port for TLS
$fp = New-AzApplicationGatewayFrontendPort -Name frontendport01  -Port 443

# Upload an existing pfx certificate for TLS offload
$password = ConvertTo-SecureString -String "P@ssw0rd" -AsPlainText -Force
$cert = New-AzApplicationGatewaySslCertificate -Name cert01 -CertificateFile C:\folder\contoso.pfx -Password $password

# Create a frontend IP configuration for the public IP address
$fipconfig = New-AzApplicationGatewayFrontendIPConfig -Name fipconfig01 -PublicIPAddress $publicip

# Create a new listener with the certificate, port, and frontend ip.
$listener = New-AzApplicationGatewayHttpListener -Name listener01  -Protocol Https -FrontendIPConfiguration $fipconfig -FrontendPort $fp -SslCertificate $cert

# Create a new rule for backend traffic routing
$rule = New-AzApplicationGatewayRequestRoutingRule -Name rule01 -RuleType Basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool

# Define the size of the application gateway
$sku = New-AzApplicationGatewaySku -Name Standard_Small -Tier Standard -Capacity 2

# Configure the TLS policy to use a different pre-defined policy
$policy = New-AzApplicationGatewaySslPolicy -PolicyType Predefined -PolicyName AppGwSslPolicy20170401S

# Create the application gateway.
$appgw = New-AzApplicationGateway -Name appgwtest -ResourceGroupName $rg.ResourceGroupName -Location "East US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku -SslCertificates $cert -SslPolicy $policy
```

## Update an existing application gateway with a pre-defined TLS policy

To set a custom TLS policy, pass the following parameters: **PolicyType**, **MinProtocolVersion**, **CipherSuite**, and **ApplicationGateway**. To set a Predefined TLS policy, pass the following parameters: **PolicyType**, **PolicyName**, and **ApplicationGateway**. If you attempt to pass other parameters, you get an error when creating or updating the Application Gateway.

> [!NOTE]
> Using a new Predefined or Customv2 policy enhances SSL security and performance posture of the entire gateway (SSL Policy and SSL Profile). Hence, both old and new policies cannot co-exist. You are required to use any of the older predefined or custom policies across the gateway, in case there are clients requiring older TLS version or ciphers (for example, TLS v1.0).

In the following example, there are code samples for both Custom Policy and Predefined Policy. Uncomment the policy you want to use.

```powershell
# You have to change these parameters to match your environment.
$AppGWname = "YourAppGwName"
$RG = "YourResourceGroupName"

$AppGw = get-Azapplicationgateway -Name $AppGWname -ResourceGroupName $RG

# Choose either custom policy or predefined policy and uncomment the one you want to use.

# TLS Custom Policy
# Set-AzApplicationGatewaySslPolicy -PolicyType Custom -MinProtocolVersion TLSv1_2 -CipherSuite "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256", "TLS_RSA_WITH_AES_128_CBC_SHA256" -ApplicationGateway $AppGw

# TLS Predefined Policy
# Set-AzApplicationGatewaySslPolicy -PolicyType Predefined -PolicyName "AppGwSslPolicy20170401S" -ApplicationGateway $AppGW

# Update AppGW
# The TLS policy options are not validated or updated on the Application Gateway until this cmdlet is executed.
$SetGW = Set-AzApplicationGateway -ApplicationGateway $AppGW
```

## Next steps

Visit [Application Gateway redirect overview](./redirect-overview.md) to learn how to redirect HTTP traffic to an HTTPS endpoint. 

Check out setting up listener specific SSL policies at [setting up SSL listener specific policy through Portal](./application-gateway-configure-listener-specific-ssl-policy.md)
