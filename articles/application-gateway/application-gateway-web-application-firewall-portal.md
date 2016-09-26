<properties
   pageTitle="Create an application gateway with web application firewall using the portal | Microsoft Azure"
   description="Learn how to create an Application Gateway with web application firewall by using the portal"
   services="application-gateway"
   documentationCenter="na"
   authors="georgewallace"
   manager="carmonm"
   editor="tysonn"
   tags="azure-resource-manager"
/>
<tags  
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/26/2016"
   ms.author="gwallace" />

# Create an application gateway with web application firewall by using the portal

> [AZURE.SELECTOR]
- [Azure portal](application-gateway-web-application-firewall-portal.md)
- [Azure Resource Manager PowerShell](application-gateway-web-application-firewall-powershell.md)

Azure Application Gateway is a layer-7 load balancer. It provides failover, performance-routing HTTP requests between different servers, whether they are on the cloud or on-premises.
Application provides many Application Delivery Controller (ADC) features including HTTP load balancing, cookie-based session affinity, Secure Sockets Layer (SSL) offload, custom health probes, support for multi-site, and many others.
To find a complete list of supported features, visit [Application Gateway Overview](application-gateway-introduction.md)

The web application firewall (WAF) in Azure Application Gateway protects web applications from common web-based attacks like SQL injection, cross-site scripting attacks, and session hijacks.

## Scenarios

In this article there are two scenarios:

In the first scenario, you learn to [add web application firewall to an existing application gateway](#add-web-application-firewall-to-an-existing-application-gateway).

In the second scenario, you learn to [create an application gateway with web application firewall](#create-an-application-gateway-with-web-application-firewall)

![Scenario example][scenario]

>[AZURE.NOTE] Additional configuration of the application gateway, including custom health probes, backend pool addresses, and additional rules are configured after the application gateway is configured and not during initial deployment.

## Before you begin

Azure Application Gateway requires its own subnet. When creating a virtual network, ensure that you leave enough address space to have multiple subnets. Once you deploy an application gateway to a subnet,
only additional application gateways are able to be added to the subnet.

## Add web application firewall to an existing application gateway

This scenario updates an existing application gateway to support web application firewall in prevention mode.

### Step 1

Navigate to the Azure portal, select an existing Application Gateway.

![Creating Application Gateway][1]

### Step 2

Click **Configuration** and update the application gateway settings. When complete click **Save**

The settings to update an existing application gateway to support web application firewall are:

- **Tier** - The tier selected must be **WAF** to support web application firewall
- **SKU size** - This setting is the size of the application gateway with web application firewall, available options are (**Medium** and **Large**).
- **Firewall status** - This setting either disables or enables web application firewall.
- **Firewall mode** - This setting is how web application firewall deals with malicious traffic. **Detection** mode only logs the events, where **Prevention** mode logs the events and stops the malicious traffic.

![blade showing basic settings][2]

>[AZURE.NOTE] To view web application firewall logs, diagnostics must be enabled and ApplicationGatewayFirewallLog selected. An instance count of 1 can be chosen for testing purposes. It is important to know that any instance count under two instances is not covered by the SLA and are therefore not recommended. Small gateways are not available when using web application firewall.

## Create an application gateway with web application firewall

This scenario will:

- Create a medium web application firewall application gateway with two instances.
- Create a virtual network named AdatumAppGatewayVNET with a reserved CIDR block of 10.0.0.0/16.
- Create a subnet called Appgatewaysubnet that uses 10.0.0.0/28 as its CIDR block.
- Configure a certificate for SSL offload.

### Step 1

Navigate to the Azure portal, click **New** > **Networking** > **Application Gateway**

![Creating Application Gateway][1-1]

### Step 2

Next fill out the basic information about the application gateway. Be sure to choose **WAF** as the tier. When complete click **OK**

The information needed for the basic settings is:

- **Name** - The name for the application gateway.
- **Tier** - The tier of the application gateway, available options are (**Standard** and **WAF**). Web application firewall is only available in the WAF Tier.
- **SKU size** - This setting is the size of the application gateway, available options are (**Medium** and **Large**).
- **Instance count** - The number of instances, this value should be a number between **2** and **10**.
- **Resource group** - The resource group to hold the application gateway, it can be an existing resource group or a new one.
- **Location** - The region for the application gateway, it is the same location at the resource group. *The location is important as the virtual network and public IP must be in the same location as the gateway*.

![blade showing basic settings][2-2]

>[AZURE.NOTE] An instance count of 1 can be chosen for testing purposes. It is important to know that any instance count under two instances is not covered by the SLA and are therefore not recommended. Small gateways are not supported for web application firewall scenarios.

### Step 3

Once the basic settings are defined, the next step is to define the virtual network to be used. The virtual network houses the application that the application gateway does load balancing for.

Click **Choose a virtual network** to configure the virtual network.

![blade showing settings for application gateway][3]

### Step 4

In the **Choose Virtual Network** blade, click **Create New**

While not explained in this scenario, an existing Virtual Network could be selected at this point.  If an existing virtual network is used, it is important to know that the virtual network needs an empty subnet or a subnet of only application gateway resources to be used.

![choose virtual network blade][4]

### Step 5

Fill out the network information in the **Create Virtual Network** blade as described in the preceding [Scenario](#scenario) description.

![Create virtual network blade with information entered][5]

### Step 6

Once the virtual network is created, the next step is to define the front-end IP for the application gateway. At this point, the choice is between a public 
or a private IP address for the front-end. The choice depends on whether the application is internet facing or internal only. This scenario assumes 
using a public IP address. To choose a private IP address, the **Private** button can be clicked. An automatically assigned IP address is chosen or you 
can click the **Choose a specific private IP address** checkbox to enter one manually.

Click **Choose a public IP address**. If an existing public IP address is available it can be chosen at this point, in this scenario you create a new public IP address. Click **Create new**

![Choose public IP address blade][6]

### Step 7

Next give the public IP address a friendly name and click **OK**

![Create public IP Address blade][7]

### Step 8

Next, you setup the listener configuration.  If **http** is used, nothing is left to configure and **OK** can be clicked. To use **https**
further configuration is required.

To use **https**, a certificate is required. The private key of the certificate is needed so a .pfx export of the certificate needs to be provided and the password for the file.

Click **HTTPS**, click the **folder** icon next to the **Upload PFX certificate** textbox.
Navigate to the .pfx certificate file on your file system. Once it is selected, give the certificate a friendly name and type the password for the .pfx file.

Once complete click **OK** to review the settings for the Application Gateway.

![Listener Configuration section on Settings blade][8]

### Step 9

Configure the **WAF** specific settings.

- **Firewall status** - This setting turns WAF on or off.
- **Firewall mode** - This setting determines the actions WAF takes on malicious traffic. If **Detection** is chosen, traffic is only logged.  If **Prevention** is chosen, traffic is logged and stopped with a 403 Unauthorized.

![web application firewall settings][9]

### Step 10

Review the Summary page and click **OK**.  Now the application gateway is queued up and created.

### Step 12

Once the application gateway has been created, navigate to it in the portal to continue configuration of the application gateway.

![Application Gateway resource view][10]

These steps create a basic application gateway with default settings for the listener, backend pool, backend http settings, and rules. You can modify these settings to suit your deployment once the provisioning is successful

## Next steps

Learn how to configure diagnostic logging, to log the events that are detected or prevented with Web Application Firewall by visiting [Application Gateway Diagnostics](application-gateway-diagnostics.md)

Learn how to create custom health probes by visiting [Create a custom health probe](application-gateway-create-probe-portal.md)

Learn how to configure SSL Offloading and take the costly SSL decryption off your web servers by visiting [Configure SSL Offload](application-gateway-ssl-portal.md)

<!--Image references-->
[1]: ./media/application-gateway-web-application-firewall-portal/figure1.png
[2]: ./media/application-gateway-web-application-firewall-portal/figure2.png
[1-1]: ./media/application-gateway-web-application-firewall-portal/figure1-1.png
[2-2]: ./media/application-gateway-web-application-firewall-portal/figure2-2.png
[3]: ./media/application-gateway-web-application-firewall-portal/figure3.png
[4]: ./media/application-gateway-web-application-firewall-portal/figure4.png
[5]: ./media/application-gateway-web-application-firewall-portal/figure5.png
[6]: ./media/application-gateway-web-application-firewall-portal/figure6.png
[7]: ./media/application-gateway-web-application-firewall-portal/figure7.png
[8]: ./media/application-gateway-web-application-firewall-portal/figure8.png
[9]: ./media/application-gateway-web-application-firewall-portal/figure9.png
[10]: ./media/application-gateway-web-application-firewall-portal/figure10.png
[scenario]: ./media/application-gateway-web-application-firewall-portal/scenario.png