---
title: Create a custom probe - Azure Application Gateway - PowerShell classic | Microsoft Docs
description: Learn how to create a custom probe for Application Gateway by using PowerShell in the classic deployment model
services: application-gateway
documentationcenter: na
author: vhorne
manager: jpconnock
editor: ''
tags: azure-service-management

ms.assetid: 338a7be1-835c-48e9-a072-95662dc30f5e
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/26/2017
ms.author: victorh

---
# Create a custom probe for Azure Application Gateway (classic) by using PowerShell

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-probe-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-probe-ps.md)
> * [Azure Classic PowerShell](application-gateway-create-probe-classic-ps.md)

In this article, you add a custom probe to an existing application gateway with PowerShell. Custom probes are useful for applications that have a specific health check page or for applications that do not provide a successful response on the default web application.

> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../azure-resource-manager/resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. Learn how to [perform these steps using the Resource Manager model](application-gateway-create-probe-ps.md).

[!INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

## Create an application gateway

To create an application gateway:

1. Create an application gateway resource.
2. Create a configuration XML file or a configuration object.
3. Commit the configuration to the newly created application gateway resource.

### Create an application gateway resource with a custom probe

To create the gateway, use the `New-AzureApplicationGateway` cmdlet, replacing the values with your own. Billing for the gateway does not start at this point. Billing begins in a later step, when the gateway is successfully started.

The following example creates an application gateway by using a virtual network called "testvnet1" and a subnet called "subnet-1".

```powershell
New-AzureApplicationGateway -Name AppGwTest -VnetName testvnet1 -Subnets @("Subnet-1")
```

To validate that the gateway was created, you can use the `Get-AzureApplicationGateway` cmdlet.

```powershell
Get-AzureApplicationGateway AppGwTest
```

> [!NOTE]
> The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. You can choose between Small, Medium, and Large.
> 
> 

*VirtualIPs* and *DnsName* are shown as blank because the gateway has not started yet. These values are created once the gateway is in the running state.

### Configure an application gateway by using XML

In the following example, you use an XML file to configure all application gateway settings and commit them to the application gateway resource.  

Copy the following text to Notepad.

```xml
<ApplicationGatewayConfiguration xmlns:i="https://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/windowsazure">
<FrontendIPConfigurations>
    <FrontendIPConfiguration>
        <Name>fip1</Name>
        <Type>Private</Type>
    </FrontendIPConfiguration>
</FrontendIPConfigurations>
<FrontendPorts>
    <FrontendPort>
        <Name>port1</Name>
        <Port>80</Port>
    </FrontendPort>
</FrontendPorts>
<Probes>
    <Probe>
        <Name>Probe01</Name>
        <Protocol>Http</Protocol>
        <Host>contoso.com</Host>
        <Path>/path/custompath.htm</Path>
        <Interval>15</Interval>
        <Timeout>15</Timeout>
        <UnhealthyThreshold>5</UnhealthyThreshold>
    </Probe>
    </Probes>
    <BackendAddressPools>
    <BackendAddressPool>
        <Name>pool1</Name>
        <IPAddresses>
            <IPAddress>1.1.1.1</IPAddress>
            <IPAddress>2.2.2.2</IPAddress>
        </IPAddresses>
    </BackendAddressPool>
</BackendAddressPools>
<BackendHttpSettingsList>
    <BackendHttpSettings>
        <Name>setting1</Name>
        <Port>80</Port>
        <Protocol>Http</Protocol>
        <CookieBasedAffinity>Enabled</CookieBasedAffinity>
        <RequestTimeout>120</RequestTimeout>
        <Probe>Probe01</Probe>
    </BackendHttpSettings>
</BackendHttpSettingsList>
<HttpListeners>
    <HttpListener>
        <Name>listener1</Name>
        <FrontendIP>fip1</FrontendIP>
    <FrontendPort>port1</FrontendPort>
        <Protocol>Http</Protocol>
    </HttpListener>
</HttpListeners>
<HttpLoadBalancingRules>
    <HttpLoadBalancingRule>
        <Name>lbrule1</Name>
        <Type>basic</Type>
        <BackendHttpSettings>setting1</BackendHttpSettings>
        <Listener>listener1</Listener>
        <BackendAddressPool>pool1</BackendAddressPool>
    </HttpLoadBalancingRule>
</HttpLoadBalancingRules>
</ApplicationGatewayConfiguration>
```

Edit the values between the parentheses for the configuration items. Save the file with extension .xml.

The following example shows how to use a configuration file to set up the application gateway to load balance HTTP traffic on public port 80 and send network traffic to back-end port 80 between two IP addresses by using a custom probe.

> [!IMPORTANT]
> The protocol item Http or Https is case-sensitive.

A new configuration item \<Probe\> is added to configure custom probes.

The configuration parameters are:

|Parameter|Description|
|---|---|
|**Name** |Reference name for custom probe. |
| **Protocol** | Protocol used (possible values are HTTP or HTTPS).|
| **Host** and **Path** | Complete URL path that is invoked by the application gateway to determine the health of the instance. For example, if you have a website http:\//contoso.com/, then the custom probe can be configured for "http:\//contoso.com/path/custompath.htm" for probe checks to have a successful HTTP response.|
| **Interval** | Configures the probe interval checks in seconds.|
| **Timeout** | Defines the probe time-out for an HTTP response check.|
| **UnhealthyThreshold** | The number of failed HTTP responses needed to flag the back-end instance as *unhealthy*.|

The probe name is referenced in the \<BackendHttpSettings\> configuration to assign which back-end pool uses custom probe settings.

## Add a custom probe to an existing application gateway

Changing the current configuration of an application gateway requires three steps: Get the current XML configuration file, modify to have a custom probe, and configure the application gateway with the new XML settings.

1. Get the XML file by using `Get-AzureApplicationGatewayConfig`. This cmdlet exports the configuration XML to be modified to add a probe setting.

   ```powershell
   Get-AzureApplicationGatewayConfig -Name "<application gateway name>" -Exporttofile "<path to file>"
   ```

1. Open the XML file in a text editor. Add a `<probe>` section after `<frontendport>`.

   ```xml
   <Probes>
    <Probe>
        <Name>Probe01</Name>
        <Protocol>Http</Protocol>
        <Host>contoso.com</Host>
        <Path>/path/custompath.htm</Path>
        <Interval>15</Interval>
        <Timeout>15</Timeout>
        <UnhealthyThreshold>5</UnhealthyThreshold>
    </Probe>
   </Probes>
   ```

   In the backendHttpSettings section of the XML, add the probe name as shown in the following example:

   ```xml
    <BackendHttpSettings>
        <Name>setting1</Name>
        <Port>80</Port>
        <Protocol>Http</Protocol>
        <CookieBasedAffinity>Enabled</CookieBasedAffinity>
        <RequestTimeout>120</RequestTimeout>
        <Probe>Probe01</Probe>
    </BackendHttpSettings>
   ```

   Save the XML file.

1. Update the application gateway configuration with the new XML file by using `Set-AzureApplicationGatewayConfig`. This cmdlet updates your application gateway with the new configuration.

```powershell
Set-AzureApplicationGatewayConfig -Name "<application gateway name>" -Configfile "<path to file>"
```

## Next steps

If you want to configure Secure Sockets Layer (SSL) offload, see [Configure an application gateway for SSL offload](application-gateway-ssl.md).

If you want to configure an application gateway to use with an internal load balancer, see [Create an application gateway with an internal load balancer (ILB)](application-gateway-ilb.md).

