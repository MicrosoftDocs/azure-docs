---
title: Configure SSL offload - Azure Application Gateway - PowerShell classic | Microsoft Docs
description: This article provides instructions to create an application gateway with SSL offload by using the Azure classic deployment model
documentationcenter: na
services: application-gateway
author: vhorne
manager: jpconnock
editor: tysonn

ms.assetid: 63f28d96-9c47-410e-97dd-f5ca1ad1b8a4
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/23/2017
ms.author: victorh

---
# Configure an application gateway for SSL offload by using the classic deployment model

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-ssl-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-ssl-arm.md)
> * [Azure classic PowerShell](application-gateway-ssl.md)
> * [Azure CLI](application-gateway-ssl-cli.md)

Azure Application Gateway can be configured to terminate the Secure Sockets Layer (SSL) session at the gateway to avoid costly SSL decryption tasks to happen at the web farm. SSL offload also simplifies the front-end server setup and management of the web application.

## Before you begin

1. Install the latest version of the Azure PowerShell cmdlets by using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Downloads page](https://azure.microsoft.com/downloads/).
2. Verify that you have a working virtual network with a valid subnet. Make sure that no virtual machines or cloud deployments are using the subnet. The application gateway must be by itself in a virtual network subnet.
3. The servers that you configure to use the application gateway must exist or have their endpoints that are created either in the virtual network or with a public IP address or virtual IP address (VIP) assigned.

To configure SSL offload on an application gateway, complete the following steps in the order listed:

1. [Create an application gateway](#create-an-application-gateway)
2. [Upload SSL certificates](#upload-ssl-certificates)
3. [Configure the gateway](#configure-the-gateway)
4. [Set the gateway configuration](#set-the-gateway-configuration)
5. [Start the gateway](#start-the-gateway)
6. [Verify the gateway status](#verify-the-gateway-status)

## Create an application gateway

To create the gateway, enter the `New-AzureApplicationGateway` cmdlet, replacing the values with your own. Billing for the gateway does not start at this point. Billing begins in a later step, when the gateway is successfully started.

```powershell
New-AzureApplicationGateway -Name AppGwTest -VnetName testvnet1 -Subnets @("Subnet-1")
```

To validate that the gateway was created, you can enter the `Get-AzureApplicationGateway` cmdlet.

In the sample, **Description**, **InstanceCount**, and **GatewaySize** are optional parameters. The default value for **InstanceCount** is **2**, with a maximum value of **10**. The default value for **GatewaySize** is **Medium**. Small and Large are other available values. **VirtualIPs** and **DnsName** are shown as blank, because the gateway has not started yet. These values are created after the gateway is in the running state.

```powershell
Get-AzureApplicationGateway AppGwTest
```

## Upload SSL certificates

Enter `Add-AzureApplicationGatewaySslCertificate` to upload the server certificate in PFX format to the application gateway. The certificate name is a user-chosen name and must be unique within the application gateway. This certificate is referred to by this name in all certificate management operations on the application gateway.

The following sample shows the cmdlet. Replace the values in the sample with your own.

```powershell
Add-AzureApplicationGatewaySslCertificate  -Name AppGwTest -CertificateName GWCert -Password <password> -CertificateFile <full path to pfx file>
```

Next, validate the certificate upload. Enter the `Get-AzureApplicationGatewayCertificate` cmdlet.

The following sample shows the cmdlet on the first line, followed by the output:

```powershell
Get-AzureApplicationGatewaySslCertificate AppGwTest
```

```
VERBOSE: 5:07:54 PM - Begin Operation: Get-AzureApplicationGatewaySslCertificate
VERBOSE: 5:07:55 PM - Completed Operation: Get-AzureApplicationGatewaySslCertificate
Name           : SslCert
SubjectName    : CN=gwcert.app.test.contoso.com
Thumbprint     : AF5ADD77E160A01A6......EE48D1A
ThumbprintAlgo : sha1RSA
State..........: Provisioned
```

> [!NOTE]
> The certificate password must be between 4 to 12 characters made up of letters or numbers. Special characters are not accepted.

## Configure the gateway

An application gateway configuration consists of multiple values. The values can be tied together to construct the configuration.

The values are:

* **Back-end server pool**: The list of IP addresses of the back-end servers. The IP addresses listed should belong to the virtual network subnet or should be a public IP or VIP address.
* **Back-end server pool settings**: Every pool has settings like port, protocol, and cookie-based affinity. These settings are tied to a pool and are applied to all servers within the pool.
* **Front-end port**: This port is the public port that is opened on the application gateway. Traffic hits this port, and then gets redirected to one of the back-end servers.
* **Listener**: The listener has a front-end port, a protocol (Http or Https; these values are case-sensitive), and the SSL certificate name (if configuring an SSL offload).
* **Rule**: The rule binds the listener and the back-end server pool and defines which back-end server pool to direct the traffic to when it hits a particular listener. Currently, only the *basic* rule is supported. The *basic* rule is round-robin load distribution.

**Additional configuration notes**

For SSL certificates configuration, the protocol in **HttpListener** should change to **Https** (case sensitive). Add the **SslCert** element to **HttpListener** with the value set to the same name used in the [Upload SSL certificates](#upload-ssl-certificates) section. The front-end port should be updated to **443**.

**To enable cookie-based affinity**: You can configure an application gateway to ensure that a request from a client session is always directed to the same VM in the web farm. To accomplish this, insert a session cookie that allows the gateway to direct traffic appropriately. To enable cookie-based affinity, set **CookieBasedAffinity** to **Enabled** in the **BackendHttpSettings** element.

You can construct your configuration either by creating a configuration object or by using a configuration XML file.
To construct your configuration by using a configuration XML file, enter the following sample:


```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationGatewayConfiguration xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/windowsazure">
    <FrontendIPConfigurations />
    <FrontendPorts>
        <FrontendPort>
            <Name>FrontendPort1</Name>
            <Port>443</Port>
        </FrontendPort>
    </FrontendPorts>
    <BackendAddressPools>
        <BackendAddressPool>
            <Name>BackendPool1</Name>
            <IPAddresses>
                <IPAddress>10.0.0.1</IPAddress>
                <IPAddress>10.0.0.2</IPAddress>
            </IPAddresses>
        </BackendAddressPool>
    </BackendAddressPools>
    <BackendHttpSettingsList>
        <BackendHttpSettings>
            <Name>BackendSetting1</Name>
            <Port>80</Port>
            <Protocol>Http</Protocol>
            <CookieBasedAffinity>Enabled</CookieBasedAffinity>
        </BackendHttpSettings>
    </BackendHttpSettingsList>
    <HttpListeners>
        <HttpListener>
            <Name>HTTPListener1</Name>
            <FrontendPort>FrontendPort1</FrontendPort>
            <Protocol>Https</Protocol>
            <SslCert>GWCert</SslCert>
        </HttpListener>
    </HttpListeners>
    <HttpLoadBalancingRules>
        <HttpLoadBalancingRule>
            <Name>HttpLBRule1</Name>
            <Type>basic</Type>
            <BackendHttpSettings>BackendSetting1</BackendHttpSettings>
            <Listener>HTTPListener1</Listener>
            <BackendAddressPool>BackendPool1</BackendAddressPool>
        </HttpLoadBalancingRule>
    </HttpLoadBalancingRules>
</ApplicationGatewayConfiguration>
```

## Set the gateway configuration

Next, set the application gateway. You can enter the `Set-AzureApplicationGatewayConfig` cmdlet with either a configuration object or a configuration XML file.

```powershell
Set-AzureApplicationGatewayConfig -Name AppGwTest -ConfigFile D:\config.xml
```

## Start the gateway

After the gateway has been configured, enter the `Start-AzureApplicationGateway` cmdlet to start the gateway. Billing for an application gateway begins after the gateway has been successfully started.

> [!NOTE]
> The `Start-AzureApplicationGateway` cmdlet can take 15-20 minutes to finish.
>
>

```powershell
Start-AzureApplicationGateway AppGwTest
```

## Verify the gateway status

Enter the `Get-AzureApplicationGateway` cmdlet to check the status of the gateway. If `Start-AzureApplicationGateway` succeeded in the previous step, the **State** should be **Running**, and the **VirtualIPs** and **DnsName** should have valid entries.

This sample shows an application gateway that is up, running, and ready to take traffic:

```powershell
Get-AzureApplicationGateway AppGwTest
```

```
Name          : AppGwTest2
Description   :
VnetName      : testvnet1
Subnets       : {Subnet-1}
InstanceCount : 2
GatewaySize   : Medium
State         : Running
VirtualIPs    : {23.96.22.241}
DnsName       : appgw-4c960426-d1e6-4aae-8670-81fd7a519a43.cloudapp.net
```

## Next steps

For more information about load-balancing options in general, see:

* [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
* [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)
