---
title: Networking considerations with App Service Environment - Azure
description: Explains the ASE network traffic and how to set NSGs and UDRs with your ASE
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: 955a4d84-94ca-418d-aa79-b57a5eb8cb85
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/31/2019
ms.author: ccompy
ms.custom: seodec18
---
# Networking considerations for an App Service Environment #

## Overview ##

 Azure [App Service Environment][Intro] is a deployment of Azure App Service into a subnet in your Azure virtual network (VNet). There are two deployment types for an App Service environment (ASE):

- **External ASE**: Exposes the ASE-hosted apps on an internet-accessible IP address. For more information, see [Create an External ASE][MakeExternalASE].
- **ILB ASE**: Exposes the ASE-hosted apps on an IP address inside your VNet. The internal endpoint is an internal load balancer (ILB), which is why it's called an ILB ASE. For more information, see [Create and use an ILB ASE][MakeILBASE].

All ASEs, External, and ILB, have a public VIP that is used for inbound management traffic and as the from address when making calls from the ASE to the internet. The calls from an ASE that go to the internet leave the VNet through the VIP assigned for the ASE. The public IP of this VIP is the source IP for all calls from the ASE that go to the internet. If the apps in your ASE make calls to resources in your VNet or across a VPN, the source IP is one of the IPs in the subnet used by your ASE. Because the ASE is within the VNet, it can also access resources within the VNet without any additional configuration. If the VNet is connected to your on-premises network, apps in your ASE also have access to resources there without additional configuration.

![External ASE][1] 

If you have an External ASE, the public VIP is also the endpoint that your ASE apps resolve to for:

* HTTP/S 
* FTP/S
* Web deployment
* Remote debugging

![ILB ASE][2]

If you have an ILB ASE, the address of the ILB address is the endpoint for HTTP/S, FTP/S, web deployment, and remote debugging.

## ASE subnet size ##

The size of the subnet used to host an ASE cannot be altered after the ASE is deployed.  The ASE uses an address for each infrastructure role as well as for each Isolated App Service plan instance.  Additionally, there are five addresses used by Azure Networking for every subnet that is created.  An ASE with no App Service plans at all will use 12 addresses before you create an app.  If it is an ILB ASE, then it will use 13 addresses before you create an app in that ASE. As you scale out your ASE, infrastructure roles are added every multiple of 15 and 20 of your App Service plan instances.

   > [!NOTE]
   > Nothing else can be in the subnet but the ASE. Be sure to choose an address space that allows for future growth. You can't change this setting later. We recommend a size of `/24` with 256 addresses.

When you scale up or down, new roles of the appropriate size are added and then your workloads are migrated from the current size to the target size. The original VMs removed only after the workloads have been migrated. If you had an ASE with 100 ASP instances, there would be a period where you need double the number of VMs.  It is for this reason that we recommend the use of a '/24' to accommodate any changes you might require.  

## ASE dependencies ##

### ASE inbound dependencies ###

Just for the ASE to operate, the ASE requires the following ports to be open:

| Use | From | To |
|-----|------|----|
| Management | App Service management addresses | ASE subnet: 454, 455 |
|  ASE internal communication | ASE subnet: All ports | ASE subnet: All ports
|  Allow Azure load balancer inbound | Azure load balancer | ASE subnet: 16001

There are 2 other ports that can show as open on a port scan, 7654 and 1221. They reply with an IP address and nothing more. They can be blocked if desired. 

The inbound management traffic provides command and control of the ASE in addition to system monitoring. The source addresses for this traffic are listed in the [ASE Management addresses][ASEManagement] document. The network security configuration needs to allow access from the ASE management addresses on ports 454 and 455. If you block access from those addresses, your ASE will become unhealthy and then become suspended. The TCP traffic that comes in on ports 454 and 455 must go back out from the same VIP or you will have an asymmetric routing problem. 

Within the ASE subnet, there are many ports used for internal component communication and they can change. This requires all of the ports in the ASE subnet to be accessible from the ASE subnet. 

For the communication between the Azure load balancer and the ASE subnet the minimum ports that need to be open are 454, 455 and 16001. The 16001 port is used for keep alive traffic between the load balancer and the ASE. If you are using an ILB ASE, then you can lock traffic down to just the 454, 455, 16001 ports.  If you are using an External ASE, then you need to take into account the normal app access ports.  

The other ports you need to concern yourself with are the application ports:

| Use | Ports |
|----------|-------------|
|  HTTP/HTTPS  | 80, 443 |
|  FTP/FTPS    | 21, 990, 10001-10020 |
|  Visual Studio remote debugging  |  4020, 4022, 4024 |
|  Web Deploy service | 8172 |

If you block the application ports, your ASE can still function but your app might not.  If you are using app assigned IP addresses with an External ASE, you will need to allow traffic from the IPs assigned to your apps to the ASE subnet on the ports shown in the ASE portal > IP Addresses page.

### ASE outbound dependencies ###

For outbound access, an ASE depends on multiple external systems. Many of those system dependencies are defined with DNS names and don't map to a fixed set of IP addresses. Thus, the ASE requires outbound access from the ASE subnet to all external IPs across a variety of ports. 

The ASE communicates out to internet accessible addresses on the following ports:

| Uses | Ports |
|-----|------|
| DNS | 53 |
| NTP | 123 |
| 8CRL, Windows updates, Linux dependencies, Azure services | 80/443 |
| Azure SQL | 1433 | 
| Monitoring | 12000 |

The outbound dependencies are listed in the document that describes [Locking down App Service Environment outbound traffic](./firewall-integration.md). If the ASE loses access to its dependencies, it stops working. When that happens long enough, the ASE is suspended. 

### Customer DNS ###

If the VNet is configured with a customer-defined DNS server, the tenant workloads use it. The ASE uses Azure DNS for management purposes. If the VNet is configured with a customer-selected DNS server, the DNS server must be reachable from the subnet that contains the ASE.

To test DNS resolution from your web app, you can use the console command *nameresolver*. Go to the debug window in your scm site for your app or go to the app in the portal and select console. From the shell prompt you can issue the command *nameresolver* along with the DNS name you wish to look up. The result you get back is the same as what your app would get while making the same lookup. If you use nslookup, you will do a lookup using Azure DNS instead.

If you change the DNS setting of the VNet that your ASE is in, you will need to reboot your ASE. To avoid rebooting your ASE, it is highly recommended that you configure your DNS settings for your VNet before you create your ASE.  

<a name="portaldep"></a>

## Portal dependencies ##

In addition to the ASE functional dependencies, there are a few extra items related to the portal experience. Some of the capabilities in the Azure portal depend on direct access to _SCM site_. For every app in Azure App Service, there are two URLs. The first URL is to access your app. The second URL is to access the SCM site, which is also called the _Kudu console_. Features that use the SCM site include:

-   Web jobs
-   Functions
-   Log streaming
-   Kudu
-   Extensions
-   Process Explorer
-   Console

When you use an ILB ASE, the SCM site isn't accessible from outside the VNet. Some capabilities will not work from the app portal because they require access to the SCM site of an app. You can connect to the SCM site directly instead of using the portal. 

If your ILB ASE is the domain name *contoso.appserviceenvironnment.net* and your app name is *testapp*, the app is reached at *testapp.contoso.appserviceenvironment.net*. The SCM site that goes with it is reached at *testapp.scm.contoso.appserviceenvironment.net*.

## ASE IP addresses ##

An ASE has a few IP addresses to be aware of. They are:

- **Public inbound IP address**: Used for app traffic in an External ASE, and management traffic in both an External ASE and an ILB ASE.
- **Outbound public IP**: Used as the "from" IP for outbound connections from the ASE that leave the VNet, which aren't routed down a VPN.
- **ILB IP address**: The ILB IP address only exists in an ILB ASE.
- **App-assigned IP-based SSL addresses**: Only possible with an External ASE and when IP-based SSL is configured.

All these IP addresses are visible in the Azure portal from the ASE UI. If you have an ILB ASE, the IP for the ILB is listed.

   > [!NOTE]
   > These IP addresses will not change so long as your ASE stays up and running.  If your ASE becomes suspended and restored, the addresses used by your ASE will change. The normal cause for an ASE to become suspended is if you block inbound management access or block access to an ASE dependency. 

![IP addresses][3]

### App-assigned IP addresses ###

With an External ASE, you can assign IP addresses to individual apps. You can't do that with an ILB ASE. For more information on how to configure your app to have its own IP address, see [Bind an existing custom SSL certificate to Azure App Service](../app-service-web-tutorial-custom-ssl.md).

When an app has its own IP-based SSL address, the ASE reserves two ports to map to that IP address. One port is for HTTP traffic, and the other port is for HTTPS. Those ports are listed in the ASE UI in the IP addresses section. Traffic must be able to reach those ports from the VIP or the apps are inaccessible. This requirement is important to remember when you configure Network Security Groups (NSGs).

## Network Security Groups ##

[Network Security Groups][NSGs] provide the ability to control network access within a VNet. When you use the portal, there's an implicit deny rule at the lowest priority to deny everything. What you build are your allow rules.

In an ASE, you don't have access to the VMs used to host the ASE itself. They're in a Microsoft-managed subscription. If you want to restrict access to the apps on the ASE, set NSGs on the ASE subnet. In doing so, pay careful attention to the ASE dependencies. If you block any dependencies, the ASE stops working.

NSGs can be configured through the Azure portal or via PowerShell. The information here shows the Azure portal. You create and manage NSGs in the portal as a top-level resource under **Networking**.

The required entries in an NSG, for an ASE to function, are to allow traffic:

**Inbound**
* from the IP service tag AppServiceManagement on ports 454,455
* from the load balancer on port 16001
* from the ASE subnet to the ASE subnet on all ports

**Outbound**
* to all IPs on port 123
* to all IPs on ports 80, 443
* to the IP service tag AzureSQL on ports 1433
* to all IPs on port 12000
* to the ASE subnet on all ports

The DNS port does not need to be added as traffic to DNS is not affected by NSG rules. These ports do not include the ports that your apps require for successful use. The normal app access ports are:

| Use | Ports |
|----------|-------------|
|  HTTP/HTTPS  | 80, 443 |
|  FTP/FTPS    | 21, 990, 10001-10020 |
|  Visual Studio remote debugging  |  4020, 4022, 4024 |
|  Web Deploy service | 8172 |

When the inbound and outbound requirements are taken into account, the NSGs should look similar to the NSGs shown in this example. 

![Inbound security rules][4]

A default rule enables the IPs in the VNet to talk to the ASE subnet. Another default rule enables the load balancer, also known as the public VIP, to communicate with the ASE. To see the default rules, select **Default rules** next to the **Add** icon. If you put a deny everything else rule before the default rules, you prevent traffic between the VIP and the ASE. To prevent traffic coming from inside the VNet, add your own rule to allow inbound. Use a source equal to AzureLoadBalancer with a destination of **Any** and a port range of **\***. Because the NSG rule is applied to the ASE subnet, you don't need to be specific in the destination.

If you assigned an IP address to your app, make sure you keep the ports open. To see the ports, select **App Service Environment** > **IP addresses**.  

All the items shown in the following outbound rules are needed, except for the last item. They enable network access to the ASE dependencies that were noted earlier in this article. If you block any of them, your ASE stops working. The last item in the list enables your ASE to communicate with other resources in your VNet.

![Outbound security rules][5]

After your NSGs are defined, assign them to the subnet that your ASE is on. If you don’t remember the ASE VNet or subnet, you can see it from the ASE portal page. To assign the NSG to your subnet, go to the subnet UI and select the NSG.

## Routes ##

Forced tunneling is when you set routes in your VNet so the outbound traffic doesn't go directly to the internet but somewhere else like an ExpressRoute gateway or a virtual appliance.  If you need to configure your ASE in such a manner, then read the document on [Configuring your App Service Environment with Forced Tunneling][forcedtunnel].  This document will tell you the options available to work with ExpressRoute and forced tunneling.

When you create an ASE in the portal we also create a set of route tables on the subnet that is created with the ASE.  Those routes simply say to send outbound traffic directly to the internet.  
To create the same routes manually, follow these steps:

1. Go to the Azure portal. Select **Networking** > **Route Tables**.

2. Create a new route table in the same region as your VNet.

3. From within your route table UI, select **Routes** > **Add**.

4. Set the **Next hop type** to **Internet** and the **Address prefix** to **0.0.0.0/0**. Select **Save**.

    You then see something like the following:

    ![Functional routes][6]

5. After you create the new route table, go to the subnet that contains your ASE. Select your route table from the list in the portal. After you save the change, you should then see the NSGs and routes noted with your subnet.

    ![NSGs and routes][7]

## Service Endpoints ##

Service Endpoints enable you to restrict access to multi-tenant services to a set of Azure virtual networks and subnets. You can read more about Service Endpoints in the [Virtual Network Service Endpoints][serviceendpoints] documentation. 

When you enable Service Endpoints on a resource, there are routes created with higher priority than all other routes. If you use Service Endpoints on any Azure service, with a forced tunneled ASE, the traffic to those services will not be forced tunneled. 

When Service Endpoints is enabled on a subnet with an Azure SQL instance, all Azure SQL instances connected to from that subnet must have Service Endpoints enabled. if you want to access multiple Azure SQL instances from the same subnet, you can't enable Service Endpoints on one Azure SQL instance and not on another. No other Azure service behaves like Azure SQL with respect to Service Endpoints. When you enable Service Endpoints with Azure Storage, you lock access to that resource from your subnet but can still access other Azure Storage accounts even if they do not have Service Endpoints enabled.  

![Service Endpoints][8]

<!--Image references-->
[1]: ./media/network_considerations_with_an_app_service_environment/networkase-overflow.png
[2]: ./media/network_considerations_with_an_app_service_environment/networkase-overflow2.png
[3]: ./media/network_considerations_with_an_app_service_environment/networkase-ipaddresses.png
[4]: ./media/network_considerations_with_an_app_service_environment/networkase-inboundnsg.png
[5]: ./media/network_considerations_with_an_app_service_environment/networkase-outboundnsg.png
[6]: ./media/network_considerations_with_an_app_service_environment/networkase-udr.png
[7]: ./media/network_considerations_with_an_app_service_environment/networkase-subnet.png
[8]: ./media/network_considerations_with_an_app_service_environment/serviceendpoint.png

<!--Links-->
[Intro]: ./intro.md
[MakeExternalASE]: ./create-external-ase.md
[MakeASEfromTemplate]: ./create-from-template.md
[MakeILBASE]: ./create-ilb-ase.md
[ASENetwork]: ./network-info.md
[UsingASE]: ./using-an-ase.md
[UDRs]: ../../virtual-network/virtual-networks-udr-overview.md
[NSGs]: ../../virtual-network/security-overview.md
[ConfigureASEv1]: app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: app-service-app-service-environment-intro.md
[mobileapps]: ../../app-service-mobile/app-service-mobile-value-prop.md
[Functions]: ../../azure-functions/index.yml
[Pricing]: https://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/resource-group-overview.md
[ConfigureSSL]: ../web-sites-purchase-ssl-web-site.md
[Kudu]: https://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[ASEWAF]: app-service-app-service-environment-web-application-firewall.md
[AppGW]: ../../application-gateway/application-gateway-web-application-firewall-overview.md
[ASEManagement]: ./management-addresses.md
[serviceendpoints]: ../../virtual-network/virtual-network-service-endpoints-overview.md
[forcedtunnel]: ./forced-tunnel-support.md
[serviceendpoints]: ../../virtual-network/virtual-network-service-endpoints-overview.md
