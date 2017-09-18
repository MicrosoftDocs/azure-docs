---
title: Networking considerations with an Azure App Service environment
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
# Networking considerations for an App Service environment #

## Overview ##

 Azure [App Service Environment][Intro] is a deployment of Azure App Service into a subnet in your Azure virtual network (VNet). There are two deployment types for an App Service environment (ASE):

- **External ASE**: Exposes the ASE-hosted apps on an internet-accessible IP address. For more information, see [Create an External ASE][MakeExternalASE].
- **ILB ASE**: Exposes the ASE-hosted apps on an IP address inside your VNet. The internal endpoint is an internal load balancer (ILB), which is why it's called an ILB ASE. For more information, see [Create and use an ILB ASE][MakeILBASE].

There are now two versions of App Service Environment: ASEv1 and ASEv2. For information on ASEv1, see [Introduction to App Service Environment v1][ASEv1Intro]. ASEv1 can be deployed in a classic or Resource Manager VNet. ASEv2 can only be deployed into a Resource Manager VNet.

All calls from an ASE that go to the internet leave the VNet through a VIP assigned for the ASE. The public IP of this VIP is then the source IP for all calls from the ASE that go to the internet. If the apps in your ASE make calls to resources in your VNet or across a VPN, the source IP is one of the IPs in the subnet used by your ASE. Because the ASE is within the VNet, it can also access resources within the VNet without any additional configuration. If the VNet is connected to your on-premises network, apps in your ASE also have access to resources there. You don't need to configure the ASE or your app any further.

![External ASE][1] 

If you have an External ASE, the public VIP is also the endpoint that your ASE apps resolve to for:

* HTTP/S. 
* FTP/S. 
* Web deployment.
* Remote debugging.

![ILB ASE][2]

If you have an ILB ASE, the IP address of the ILB is the endpoint for HTTP/S, FTP/S, web deployment, and remote debugging.

The normal app access ports are:

| Use | From | To |
|----------|---------|-------------|
|  HTTP/HTTPS  | User configurable |  80, 443 |
|  FTP/FTPS    | User configurable |  21, 990, 10001-10020 |
|  Visual Studio remote debugging  |  User configurable |  4016, 4018, 4020, 4022 |

This is true if you're on an External ASE or on an ILB ASE. If you're on an External ASE, you hit those ports on the public VIP. If you're on an ILB ASE, you hit those ports on the ILB. If you lock down port 443, there can be an effect on some features exposed in the portal. For more information, see [Portal dependencies](#portaldep).

## ASE dependencies ##

An ASE inbound access dependency is:

| Use | From | To |
|-----|------|----|
| Management | App Service management addresses | ASE subnet: 454, 455 |
|  ASE internal communication | ASE subnet: All ports | ASE subnet: All ports
|  Allow Azure load balancer inbound | Azure load balancer | ASE subnet: All ports
|  App assigned IP addresses | App assigned addresses | ASE subnet: All ports

The inbound traffic provides command and control of the ASE in addition to system monitoring. The source IPs for this traffic are listed in the [ASE Management addresses][ASEManagement] document. The network security configuration needs to allow access from all IPs on ports 454 and 455.

Within the ASE subnet there are many ports used for internal component communication and they can change.  This requires all of the ports in the ASE subnet to be accessible from the ASE subnet. 

For the communication between the Azure load balancer and the ASE subnet the minimum ports that need to be open are 454, 455 and 16001. The 16001 port is used for keep alive traffic between the load balancer and the ASE. If you are using an ILB ASE then you can lock traffic down to just the 454, 455, 16001 ports.  If you are using an External ASE then you need to take into account the normal app access ports.  If you are using app assigned addresses you need to open it to all ports.  When an address is assigned to a specific app, then the load balancer will use ports that are not known of in advance to send HTTP and HTTPS traffic to the ASE.

If you are using app assigned IP addresses you need to allow traffic from the IPs assigned to your apps to the ASE subnet.

For outbound access, an ASE depends on multiple external systems. Those system dependencies are defined with DNS names and don't map to a fixed set of IP addresses. Thus, the ASE requires outbound access from the ASE subnet to all external IPs across a variety of ports. An ASE has the following outbound dependencies:

| Use | From | To |
|-----|------|----|
| Azure Storage | ASE subnet | table.core.windows.net, blob.core.windows.net, queue.core.windows.net, file.core.windows.net: 80, 443, 445 (445 is only needed for ASEv1.) |
| Azure SQL Database | ASE subnet | database.windows.net: 1433, 11000-11999, 14000-14999 (For more information, see [SQL Database V12 port usage](../../sql-database/sql-database-develop-direct-route-ports-adonet-v12.md).)|
| Azure management | ASE subnet | management.core.windows.net, management.azure.com: 443 
| SSL certificate verification |  ASE subnet            |  ocsp.msocsp.com, mscrl.microsoft.com, crl.microsoft.com: 443
| Azure Active Directory        | ASE subnet            |  Internet: 443
| App Service management        | ASE subnet            |  Internet: 443
| Azure DNS                     | ASE subnet            |  Internet: 53
| ASE internal communication    | ASE subnet: All ports |  ASE subnet: All ports

If the ASE loses access to these dependencies, it stops working. When that happens long enough, the ASE is suspended.

### Customer DNS ###

If the VNet is configured with a customer-defined DNS server, the tenant workloads use it. The ASE still needs to communicate with Azure DNS for management purposes. 

If the VNet is configured with a customer DNS on the other side of a VPN, the DNS server must be reachable from the subnet that contains the ASE.

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

When you use an ILB ASE, the SCM site isn't internet accessible from outside the VNet. When your app is hosted on an ILB ASE, some capabilities will not work from the portal.  

Many of those capabilities that depend upon the SCM site are also available directly in the Kudu console. You can connect to it directly rather than by using the portal. If your app is hosted in an ILB ASE, use your publishing credentials to sign in. The URL to access the SCM site of an app hosted in an ILB ASE has the following format: 

```
<appname>.scm.<domain name the ILB ASE was created with> 
```

If your ILB ASE is the domain name *contoso.net* and your app name is *testapp*, the app is reached at *testapp.contoso.net*. The SCM site that goes with it is reached at *testapp.scm.contoso.net*.

## Functions and Web jobs ##

Both Functions and Web jobs depend on the SCM site but are supported for use in the portal, even if your apps are in an ILB ASE, so long as your browser can reach the SCM site.  If you are using a self-signed certificate with your ILB ASE, you will need to enable your browser to trust that certificate.  For IE and Edge that means the certificate has to be in the computer trust store.  If you are using Chrome then that means you accepted the certificate in the browser earlier by presumably hitting the scm site directly.  The best solution is to use a commercial certificate that is in the browser chain of trust.  

## ASE IP addresses ##

An ASE has a few IP addresses to be aware of. They are:

- **Public inbound IP address**: Used for app traffic in an External ASE, and management traffic in both an External ASE and an ILB ASE.
- **Outbound public IP**: Used as the "from" IP for outbound connections from the ASE that leave the VNet, which aren't routed down a VPN.
- **ILB IP address**: If you use an ILB ASE.
- **App-assigned IP-based SSL addresses**: Only possible with an External ASE and when IP-based SSL is configured.

All these IP addresses are easily visible in an ASEv2 in the Azure portal from the ASE UI. If you have an ILB ASE, the IP for the ILB is listed.

![IP addresses][3]

### App-assigned IP addresses ###

With an External ASE, you can assign IP addresses to individual apps. You can't do that with an ILB ASE. For more information on how to configure your app to have its own IP address, see [Bind an existing custom SSL certificate to Azure web apps](../../app-service-web/app-service-web-tutorial-custom-ssl.md).

When an app has its own IP-based SSL address, the ASE reserves two ports to map to that IP address. One port is for HTTP traffic, and the other port is for HTTPS. Those ports are listed in the ASE UI in the IP addresses section. Traffic must be able to reach those ports from the VIP or the apps are inaccessible. This requirement is important to remember when you configure Network Security Groups (NSGs).

## Network Security Groups ##

[Network Security Groups][NSGs] provide the ability to control network access within a VNet. When you use the portal, there's an implicit deny rule at the lowest priority to deny everything. What you build are your allow rules.

In an ASE, you don't have access to the VMs used to host the ASE itself. They're in a Microsoft-managed subscription. If you want to restrict access to the apps on the ASE, set NSGs on the ASE subnet. In doing so, pay careful attention to the ASE dependencies. If you block any dependencies, the ASE stops working.

NSGs can be configured through the Azure portal or via PowerShell. The information here shows the Azure portal. You create and manage NSGs in the portal as a top-level resource under **Networking**.

When the inbound and outbound requirements are taken into account, the NSGs should look similar to the NSGs shown in this example. The VNet address range is _192.168.250.0/16_, and the subnet that the ASE is in is _192.168.251.128/25_.

The first two inbound requirements for the ASE to function are shown at the top of the list in this example. They enable ASE management and allow the ASE to communicate with itself. The other entries are all tenant configurable and can govern network access to the ASE-hosted applications. 

![Inbound security rules][4]

A default rule enables the IPs in the VNet to talk to the ASE subnet. Another default rule enables the load balancer, also known as the public VIP, to communicate with the ASE. To see the default rules, select **Default rules** next to the **Add** icon. If you put a deny everything else rule after the NSG rules shown, you prevent traffic between the VIP and the ASE. To prevent traffic coming from inside the VNet, add your own rule to allow inbound. Use a source equal to AzureLoadBalancer with a destination of **Any** and a port range of **\***. Because the NSG rule is applied to the ASE subnet, you don't need to be specific in the destination.

If you assigned an IP address to your app, make sure you keep the ports open. To see the ports, select **App Service Environment** > **IP addresses**.  

All the items shown in the following outbound rules are needed, except for the last item. They enable network access to the ASE dependencies that were noted earlier in this article. If you block any of them, your ASE stops working. The last item in the list enables your ASE to communicate with other resources in your VNet.

![Outbound security rules][5]

After your NSGs are defined, assign them to the subnet that your ASE is on. If you don’t remember the ASE VNet or subnet, you can see it from the ASE management portal. To assign the NSG to your subnet, go to the subnet UI and select the NSG.

## Routes ##

Routes become problematic most commonly when you configure your VNet with Azure ExpressRoute. There are three types of routes in a VNet:

-   System routes
-   BGP routes
-   User-defined routes (UDRs)

BGP routes override system routes. UDRs override BGP routes. For more information about routes in Azure virtual networks, see [User-defined routes overview][UDRs].

The Azure SQL database that the ASE uses to manage the system has a firewall. It requires communication to originate from the ASE public VIP. Connections to the SQL database from the ASE will be denied if they are sent down the ExpressRoute connection and out another IP address.

If replies to incoming management requests are sent down the ExpressRoute, the reply address is different than the original destination. This mismatch breaks the TCP communication.

For your ASE to work while your VNet is configured with an ExpressRoute, the easiest thing to do is:

-   Configure ExpressRoute to advertise _0.0.0.0/0_. By default, it force tunnels all outbound traffic on-premises.
-   Create a UDR. Apply it to the subnet that contains the ASE with an address prefix of _0.0.0.0/0_ and a next hop type of _Internet_.

If you make these two changes, internet-destined traffic that originates from the ASE subnet isn't forced down the ExpressRoute and the ASE works. 

> [!IMPORTANT]
> The routes defined in a UDR must be specific enough to take precedence over any routes advertised by the ExpressRoute configuration. The preceding example uses the broad 0.0.0.0/0 address range. It can potentially be accidentally overridden by route advertisements that use more specific address ranges.
>
> ASEs aren't supported with ExpressRoute configurations that cross-advertise routes from the public-peering path to the private-peering path. ExpressRoute configurations with public peering configured receive route advertisements from Microsoft. The advertisements contain a large set of Microsoft Azure IP address ranges. If the address ranges are cross-advertised on the private-peering path, all outbound network packets from the ASE's subnet are force tunneled to a customer's on-premises network infrastructure. This network flow is currently not supported with ASEs. One solution to this problem is to stop cross-advertising routes from the public-peering path to the private-peering path.

To create a UDR, follow these steps:

1. Go to the Azure portal. Select **Networking** > **Route Tables**.

2. Create a new route table in the same region as your VNet.

3. From within your route table UI, select **Routes** > **Add**.

4. Set the **Next hop type** to **Internet** and the **Address prefix** to **0.0.0.0/0**. Select **Save**.

    You then see something like the following:

    ![Functional routes][6]

5. After you create the new route table, go to the subnet that contains your ASE. Select your route table from the list in the portal. After you save the change, you should then see the NSGs and routes noted with your subnet.

    ![NSGs and routes][7]

### Deploy into existing Azure virtual networks that are integrated with ExpressRoute ###

To deploy your ASE into a VNet that's integrated with ExpressRoute, preconfigure the subnet where you want the ASE deployed. Then use a Resource Manager template to deploy it. To create an ASE in a VNet that already has ExpressRoute configured:

- Create a subnet to host the ASE.

    > [!NOTE]
    > Nothing else can be in the subnet but the ASE. Be sure to choose an address space that allows for future growth. You can't change this setting later. We recommend a size of `/25` with 128 addresses.

- Create UDRs (for example, route tables) as described earlier, and set that on the subnet.
- Create the ASE by using a Resource Manager template as described in [Create an ASE by using a Resource Manager template][MakeASEfromTemplate].

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
[ASEManagement]: ./management-addresses.md
