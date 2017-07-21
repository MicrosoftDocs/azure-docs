---
title: Networking considerations with an Azure App Service Environment
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
ms.date: 05/08/2017
ms.author: ccompy
---
# Networking considerations for an App Service Environment #

## Overview ##

The [App Service Environment][Intro] is a deployment of the Azure App Service into a subnet in your Azure Virtual Network. There are two deployment types for the App Service Environment (ASE):

- **External ASE**: Exposes the ASE hosted apps on an internet accessible IP address. For more information, see [Create an External ASE][MakeExternalASE].
- **ILB ASE**: Exposes the ASE hosted apps on an IP address inside your virtual network. The internal endpoint is an internal load balancer (ILB), which is why it is called an ILB ASE. For more information, see [Create and use an ILB ASE][MakeILBASE].

There are now two versions of the App Service Environment. The initial version of the ASE is called ASEv1, and the newer version is called ASEv2. For information on ASEv1, see [Introduction to the App Service Environment v1][ASEv1Intro]. An ASEv1 can be deployed in a classic or Resource Manager virtual network. An ASEv2 can only be deployed into a Resource Manager virtual network.

All calls from an ASE that go to the Internet leave the virtual network through a VIP assigned for the ASE. The public IP of this VIP is then the source IP for all calls from the ASE that go to the internet.  If the apps in your ASE make calls to resources in your virtual network or across a VPN then the source IP will be one of the IPs in the subnet used by your ASE.  Because the ASE is within the virtual network, it can also access resources within the virtual network without any additional configuration. If the virtual network is connected to your on-premises network, then it also has access to resources there without any additional configuration of the ASE or your app.

![][1] 

If you have an External ASE, then that public VIP is also the endpoint that your ASE apps will resolve to for HTTP/S, FTP/S, web deploy and remote debugging.

![][2]

If you have an ILB ASE, then the IP address of the ILB is the endpoint for HTTP/S, FTP/S, web deploy and remote debugging.

The normal app access ports are:

| Use | From | To |
|----------|---------|-------------|
|  HTTP/HTTPS  | User configurable |  80, 443 |
|  FTP/FTPS    | User configurable |  21, 990, 10001-10020 |
|  Visual Studio remote debugging  |  User configurable |  4016, 4018, 4020, 4022 |

This is true if you're on an External ASE or on an ILB ASE. If you're on an External ASE, those are the ports you hit on the public VIP. If you're on an ILB ASE, you hit those ports on the ILB. If you lock down port 443, there can be an impact to some features exposed in the portal. For more information, see [Portal dependencies](#portaldep).

## ASE dependencies ##

An ASE inbound access dependency is:

| Use | From | To |
|-----|------|----|
| Management | Internet | ASE subnet: 454, 455 |
|  ASE internal communication | ASE subnet: all ports | ASE subnet: all ports
|  Allow Azure Load Balancer Inbound | Azure Load Balancer | Any

The inbound traffic provides command and control of the ASE in addition to system monitoring. The source IPs for this traffic aren't constant. This means that the network security configuration needs to allow access from all IPs on ports 454 and 455.

For outbound access, an ASE depends on multiple external systems. Those system dependencies are defined with DNS names and don't map to a fixed set of IP addresses. This means that the ASE requires outbound access from the ASE subnet to all external IPs across a variety of ports. An ASE has the following outbound dependencies:

| Use | From | To |
|-----|------|----|
| Azure Storage | ASE Subnet | table.core.windows.net, blob.core.windows.net, queue.core.windows.net, file.core.windows.net: 80, 443, 445 (445 is only needed for ASEv1) |
| SQL Database | ASE Subnet | database.windows.net: 1433, 11000-11999, 14000-14999 (For more information, see [Sql Database V12 port usage](../../sql-database/sql-database-develop-direct-route-ports-adonet-v12.md))|
| Azure management | ASE Subnet | management.core.windows.net, management.azure.com: 443 
| SSL certificate verification |  ASE Subnet            |  ocsp.msocsp.com, mscrl.microsoft.com, crl.microsoft.com: 443
| Azure Active Directory        | ASE Subnet            |  Internet: 443
| App Service management        | ASE Subnet            |  Internet: 443
| Azure DNS                     | ASE Subnet            | Internet: 53
| ASE internal communication    | ASE Subnet: All ports | ASE Subnet: All ports

If the ASE loses access to these dependencies, it stops working. When that happens long enough, the ASE is suspended.

**Customer DNS**

If the virtual network is configured with a customer-defined DNS server, the tenant workloads use it. The ASE still needs to communicate with Azure DNS for management purposes. 

If the virtual network is configured with a customer DNS on the other side of a VPN, the DNS server must be reachable from the subnet that contains the ASE.

<a name="portaldep"></a>
## Portal Dependencies ##

In addition to the functional dependencies that an ASE has, there are a few extra items related to the portal experience. Some of the capabilities in the Azure portal depend on direct access to _SCM site_. For every app in the Azure App Service, there are two URLs. The first URL is to access your app. The second URL is to access the SCM site, which is also called the _Kudu console_. Some of the features that use the SCM site include:

-   Web jobs
-   Functions
-   Logstream
-   Kudu
-   Extensions
-   Process Explorer
-   Console

This is most challenging when using an ILB ASE, since the SCM site isn't Internet accessible outside of the virtual network. For this reason, those capabilities that depend on SCM site access are grayed out in the Azure portal when your app is hosted on an ILB ASE.

Many of those capabilities that depend upon the SCM site are also available directly in the Kudu console. You can directly connect to it rather than by using the portal. If your app is hosted in an ILB ASE, you need to log in by using your publishing credentials. The URL to access the SCM site of an app hosted in an ILB ASE has the following format: 

```
<appname>.scm.<domain name the ILB ASE was created with> 
```

If your ILB ASE is the domain name *contoso.net* and your app name is *testapp*, my app is reached at *testapp.contoso.net*. The SCM site that goes with it is reached at *testapp.scm.contoso.net*.

## ASE IP addresses ##

An ASE has more than a few IP addresses to be aware of. They are:

- **Public inbound IP address**: Used for app traffic in an External ASE, and management traffic in both an External ASE and an ILB ASE.
- **Outbound public IP**: Used as the "from" IP for outbound connections from the ASE that leave the virtual network, which are not routed down a VPN.
- **ILB IP address**: If you're using an ILB ASE.
- **App assigned IP-based SSL addresses**: Only possible with an External ASE and when IP-based SSL is configured.

All these IP addresses are easily visible in an ASEv2 in the Azure portal from the ASE UI. If you have an ILB ASE, the IP for the ILB is listed.

![][3]

**App-assigned IP addresses**

With an External ASE, you can assign IP addresses to individual apps. You can't do that with an ILB ASE. For more information on how to configure your app to have its own IP address, see [Bind an existing custom SSL certificate to Azure Web Apps](../../app-service-web/app-service-web-tutorial-custom-ssl.md).

When an app has its own IP-based SSL address, the ASE reserves two ports to map to that IP address. One port is for HTTP traffic, and the other port is for HTTPS. Those ports are listed in the ASE UI in the IP addresses section. Traffic must be able to reach those ports from the VIP or the apps are inaccessible. This is important to remember when you configure Network Security Groups.

## Network Security Groups ##

[Network Security Groups][NSGs] (NSGs) provide the ability to control network access within a virtual network. When you use the portal, there's an implicit deny rule at the lowest priority to deny everything. What you build are your allow rules.

In an ASE, you don't have access to the VMs used to host the ASE itself. They're in a Microsoft managed subscription. If you want to restrict access to the apps on the ASE, set NSGs on the ASE subnet. In doing so, pay careful attention to the ASE dependencies. If you block any dependencies, the ASE stops working.

NSGs can be configured through the Azure portal or via PowerShell. The information here shows the Azure portal. You create and manage NSGs in the portal as a top-level resource under **Networking**.

Taking into account the inbound and outbound requirements, the NSGs should look similar to those  shown in this example. The virtual network address range is _192.168.250.0/16_, and the subnet that the ASE is in is _192.168.251.128/25_.

The first two inbound requirements for the ASE to function are at the top in this example. They enable ASE management and allow the ASE to communicate with itself. The other entries are all tenant configurable and can govern network access to the ASE hosted applications.   

![][4]

A default rule enables the IPs in the virtual network to talk to the ASE subnet. There is also a default rule that enables the load balancer, aka the public VIP, to communicate with the ASE. To see the default rules, click **Default rules** next to the **Add** icon. If you put a deny everything else rule after the NSG rules shown, you prevent traffic between the VIP and the ASE. To prevent traffic coming from inside the virtual network, add your own rule to allow inbound. Use a source equal to AzureLoadBalancer with a destination of Any and a port range of \*.  Because the NSG rule is applied to the ASE subnet, you don't need to be specific in the destination.

If you assigned an IP address to your app, you also need to make sure you keep the ports used with that open. You can see the ports used in the **App Service Environment** > **IP Addresses** UI.  

All but the last item shown in the following outbound rules are needed. They enable network access to the ASE dependencies that were noted earlier in this document. If you block any of them, your ASE stops working. The last item in the list enables your ASE to communicate with other resources in your virtual network.

![][5]

After your NSGs are defined, assign them to the subnet that your ASE is on. If you don’t remember the ASE virtual network or subnet, you can see it from the ASE management portal. To assign the NSG to your subnet, go to the subnet UI and select the NSG.

## Routes ##

Routes become problematic most commonly when you configure your virtual network with Azure ExpressRoute. There are three types of routes in an Azure virtual network:

-   System routes
-   BGP routes
-   User-defined routes (UDRs)

BGP routes override System routes. UDRs override BGP routes. For more information about routes in Azure virtual networks, see [User-defined routes overview][UDRs].

The Azure SQL Database that the ASE uses to manage the system has a whitelist. It requires communication to originate from the ASE public VIP. If replies to incoming management requests are sent down the ExpressRoute, the reply address is different than the destination. This  breaks the TCP communication.

What all this means is that, for your ASE to work while your virtual network is configured with an ExpressRoute, the easiest thing to do is:

-   Configure ExpressRoute to advertise _0.0.0.0/0_, which by default force tunnels all outbound traffic on-premises.
-   Create a UDR, and apply it to the subnet that contains the App Service Environment, with an address prefix of _0.0.0.0/0_ and a next hop type of _Internet_.

If you make these two changes, Internet-destined traffic that originates from the ASE subnet isn't forced down the ExpressRoute and the ASE works. 

> [!IMPORTANT]
> The routes defined in a UDR must be specific enough to take precedence over any routes advertised by the ExpressRoute configuration. The preceding example uses the broad 0.0.0.0/0 address range. It can potentially be accidentally overridden by route advertisements that use more specific address ranges.
>

ASEs aren't supported with ExpressRoute configurations that cross-advertise routes from the public-peering path to the private-peering path. ExpressRoute configurations, with public peering configured, receive route advertisements from Microsoft for a large set of Microsoft Azure IP address ranges. If these address ranges are cross-advertised on the private-peering path, all outbound network packets from the ASE's subnet are force-tunneled to a customer's on-premises network infrastructure. This network flow is currently not supported with ASEs. One solution to this problem is to stop cross-advertising routes from the public-peering path to the private-peering path.

To create a UDR as described:

1. Go to the Azure portal > **Networking** > **Route Tables**.

2. Create a new Route Table in the same region as your virtual network.

3. From within your Route Table UI, select **Routes** > **Add**.

4. Set the **Next hop type** to **Internet** and the **Address prefix** to _0.0.0.0/0_. Click  **Save**.

You then see something like this:

![][6]

After you create the new Route Table, go to the subnet that contains your ASE. Select your Route Table from the list you get in the portal. After you save the change, you should then see the NSGs and Routes noted with your subnet.

![][7]

### Deploy into existing Azure virtual networks that are integrated with ExpressRoute ###

To deploy your ASE into a virtual network that's already integrated with ExpressRoute, preconfigure the subnet where you want the ASE deployed and then deploy by using a Resource Manager template. To create an ASE in a virtual network that already has ExpressRoute configured:

- Create a subnet to host the ASE.

    > [!NOTE]
    > Nothing else can be in the subnet but the ASE. Be sure to choose an address space that allows for future growth. You can't change this setting later. We recommend a size of `/25` with 128 addresses.

- Create UDRs (for example, Route Tables) as described earlier and set that on the subnet.
- Create the ASE by using a Resource Manager template as described in [Create an ASE by using an ARM template][MakeASEfromTemplate].

<!--Image references-->
[1]: ./media/network_considerations_with_an_app_service_environment/networkase-overflow.png
[2]: ./media/network_considerations_with_an_app_service_environment/networkase-overflow2.png
[3]: ./media/network_considerations_with_an_app_service_environment/networkase-ipaddresses.png
[4]: ./media/network_considerations_with_an_app_service_environment/networkase-inboundnsg.png
[5]: ./media/network_considerations_with_an_app_service_environment/networkase-outboundnsg.png
[6]: ./media/network_considerations_with_an_app_service_environment/networkase-udr.png
[7]: ./media/network_considerations_with_an_app_service_environment/networkase-subnet.png

<!--Links-->
[Intro]: ./intro.md
[MakeExternalASE]: ./create-external-ase.md
[MakeASEfromTemplate]: ./create-from-template.md
[MakeILBASE]: ./create-ilb-ase.md
[ASENetwork]: ./network-info.md
[ASEReadme]: ./readme.md
[UsingASE]: ./using-an-ase.md
[UDRs]: ../../virtual-network/virtual-networks-udr-overview.md
[NSGs]: ../../virtual-network/virtual-networks-nsg.md
[ConfigureASEv1]: ../../app-service-web/app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: ../../app-service-web/app-service-app-service-environment-intro.md
[webapps]: ../../app-service-web/app-service-web-overview.md
[mobileapps]: ../../app-service-mobile/app-service-mobile-value-prop.md
[APIapps]: ../../app-service-api/app-service-api-apps-why-best-platform.md
[Functions]: ../../azure-functions/index.yml
[Pricing]: http://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/resource-group-overview.md
[ConfigureSSL]: ../../app-service-web/web-sites-purchase-ssl-web-site.md
[Kudu]: http://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[AppDeploy]: ../../app-service-web/web-sites-deploy.md
[ASEWAF]: ../../app-service-web/app-service-app-service-environment-web-application-firewall.md
[AppGW]: ../../application-gateway/application-gateway-web-application-firewall-overview.md
