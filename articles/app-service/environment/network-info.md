---
title: Networking considerations
description: Learn about App Service Environment network traffic, and how to set network security groups and user-defined routes.
author: madsd
ms.topic: article
ms.date: 03/29/2022
ms.author: madsd
---
# Networking considerations for App Service Environment

> [!IMPORTANT]
> This article is about App Service Environment v2 which is used with Isolated App Service plans. [App Service Environment v2 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-version-1-and-version-2-will-be-retired-on-31-august-2024-2/). There's a new version of App Service Environment that is easier to use and runs on more powerful infrastructure. To learn more about the new version, start with the [Introduction to the App Service Environment](overview.md). If you're currently using App Service Environment v2, please follow the steps in [this article](upgrade-to-asev3.md) to migrate to the new version.

As of 15 January 2024, you can no longer create new App Service Environment v2 resources using any of the available methods including ARM/Bicep templates, Azure Portal, Azure CLI, or REST API. Existing App Service Environment v2 resources will continue to be supported until 31 August 2024. You must [migrate to App Service Environment v3](upgrade-to-asev3.md) before 31 August 2024 to prevent resource deletion and data loss.
>

[App Service Environment][Intro] is a deployment of Azure App Service into a subnet in your Azure virtual network. There are two deployment types for an App Service Environment:

- **External:** This type of deployment exposes the hosted apps by using an IP address that is accessible on the internet. For more information, see [Create an external App Service Environment][MakeExternalASE].
- **Internal load balancer:** This type of deployment exposes the hosted apps on an IP address inside your virtual network. The internal endpoint is an internal load balancer. For more information, see [Create and use an internal load balancer App Service Environment][MakeILBASE].

> [!NOTE]
> This article is about App Service Environment v2, which is used with isolated App Service plans.
>

Regardless of the deployment type, all App Service Environments have a public virtual IP (VIP). This VIP is used for inbound management traffic, and as the address when you're making calls from the App Service Environment to the internet. Such calls leave the virtual network through the VIP assigned for the App Service Environment.

If the apps make calls to resources in your virtual network or across a VPN, the source IP is one of the IPs in the subnet. Because the App Service Environment is within the virtual network, it can also access resources within the virtual network without any additional configuration. If the virtual network is connected to your on-premises network, apps also have access to resources there without additional configuration.

![Diagram that shows the elements of an external deployment.][1] 

If you have an App Service Environment with an external deployment, the public VIP is also the endpoint to which your apps resolve for the following:

* HTTP/S 
* FTP/S
* Web deployment
* Remote debugging

![Diagram that shows the elements of an internal load balancer deployment.][2]

If you have an App Service Environment with an internal load balancer deployment, the address of the internal address is the endpoint for HTTP/S, FTP/S, web deployment, and remote debugging.

## Subnet size

After the App Service Environment is deployed, you can't alter the size of the subnet used to host it. App Service Environment uses an address for each infrastructure role, as well as for each isolated App Service plan instance. Additionally, Azure networking uses five addresses for every subnet that is created.

An App Service Environment with no App Service plans at all will use 12 addresses before you create an app. If you use the internal load balancer deployment, then it will use 13 addresses before you create an app. As you scale out, be aware that infrastructure roles are added at every multiple of 15 and 20 of your App Service plan instances.

> [!IMPORTANT]
> Nothing else can be in the subnet but the App Service Environment. Be sure to choose an address space that allows for future growth. You can't change this setting later. We recommend a size of `/24` with 256 addresses.

When you scale up or down, new roles of the appropriate size are added, and then your workloads are migrated from the current size to the target size. The original VMs are removed only after the workloads have been migrated. For example, if you had an App Service Environment with 100 App Service plan instances, there's a period of time in which you need double the number of VMs.  

## Inbound and outbound dependencies

The following sections cover dependencies to be aware of for your App Service Environment. Another section discusses DNS settings.

### Inbound dependencies

Just for the App Service Environment to operate, the following ports must be open:

| Use | From | To |
|-----|------|----|
| Management | App Service management addresses | App Service Environment subnet: 454, 455 |
|  App Service Environment internal communication | App Service Environment subnet: All ports | App Service Environment subnet: All ports
|  Allow Azure load balancer inbound | Azure load balancer | App Service Environment subnet: 16001

Ports 7564 and 1221 can show as open on a port scan. They reply with an IP address, and nothing more. You can block them if you want to. 

The inbound management traffic provides command and control of the App Service Environment, in addition to system monitoring. The source addresses for this traffic are listed in [App Service Environment management addresses][ASEManagement]. The network security configuration needs to allow access from the App Service Environment management addresses on ports 454 and 455. If you block access from those addresses, your App Service Environment will become unhealthy and then become suspended. The TCP traffic that comes in on ports 454 and 455 must go back out from the same VIP, or you will have an asymmetric routing problem. 

Within the subnet, there are many ports used for internal component communication, and they can change. This requires all of the ports in the subnet to be accessible from the subnet. 

For communication between the Azure load balancer and the App Service Environment subnet, the minimum ports that need to be open are 454, 455, and 16001. If you're using an internal load balancer deployment, then you can lock traffic down to just the 454, 455, 16001 ports. If you're using an external deployment, then you need to take into account the normal app access ports. Specifically, these are:

| Use | Ports |
|----------|-------------|
|  HTTP/HTTPS  | 80, 443 |
|  FTP/FTPS    | 21, 990, 10001-10020 |
|  Visual Studio remote debugging  |  4020, 4022, 4024 |
|  Web deploy service | 8172 |

If you block the application ports, your App Service Environment can still function, but your app might not. If you're using app-assigned IP addresses with an external deployment, you need to allow traffic from the IPs assigned to your apps to the subnet. From the App Service Environment portal, go to **IP addresses**, and see the ports from which you need to allow traffic.

### Outbound dependencies

For outbound access, an App Service Environment depends on multiple external systems. Many of those system dependencies are defined with DNS names, and don't map to a fixed set of IP addresses. Thus, the App Service Environment requires outbound access from the subnet to all external IPs, across a variety of ports. 

App Service Environment communicates out to internet accessible addresses on the following ports:

| Uses | Ports |
|-----|------|
| DNS | 53 |
| NTP | 123 |
| CRL, Windows updates, Linux dependencies, Azure services | 80/443 |
| Azure SQL | 1433 | 
| Monitoring | 12000 |

The outbound dependencies are listed in [Locking down an App Service Environment](./firewall-integration.md). If the App Service Environment loses access to its dependencies, it stops working. When that happens for a long enough period of time, it's suspended. 

### Customer DNS

If the virtual network is configured with a customer-defined DNS server, the tenant workloads use it. The App Service Environment uses Azure DNS for management purposes. If the virtual network is configured with a customer-selected DNS server, the DNS server must be reachable from the subnet.

> [!NOTE]
> Storage mounts or container image pulls in App Service Environment v2 aren't able to use customer-defined DNS in the virtual network, or through the `WEBSITE_DNS_SERVER` app setting.

To test DNS resolution from your web app, you can use the console command `nameresolver`. Go to the debug window in your `scm` site for your app, or go to the app in the portal and select console. From the shell prompt, you can issue the command `nameresolver`, along with the DNS name you wish to look up. The result you get back is the same as what your app would get while making the same lookup. If you use `nslookup`, you do a lookup by using Azure DNS instead.

If you change the DNS setting of the virtual network that your App Service Environment is in, you will need to reboot. To avoid rebooting, it's a good idea to configure your DNS settings for your virtual network before you create your App Service Environment.

<a name="portaldep"></a>

## Portal dependencies

In addition to the dependencies described in the previous sections, there are a few extra considerations you should be aware of that are related to the portal experience. Some of the capabilities in the Azure portal depend on direct access to the source control manager (SCM) site. For every app in Azure App Service, there are two URLs. The first URL is to access your app. The second URL is to access the SCM site, which is also called the _Kudu console_. Features that use the SCM site include:

- Web jobs
- Functions
- Log streaming
- Kudu
- Extensions
- Process Explorer
- Console

When you use an internal load balancer, the SCM site isn't accessible from outside the virtual network. Some capabilities don't work from the app portal because they require access to the SCM site of an app. You can connect to the SCM site directly, instead of by using the portal. 

If your internal load balancer is the domain name `contoso.appserviceenvironment.net`, and your app name is *testapp*, the app is reached at `testapp.contoso.appserviceenvironment.net`. The SCM site that goes with it is reached at `testapp.scm.contoso.appserviceenvironment.net`.

## IP addresses

An App Service Environment has a few IP addresses to be aware of. They are:

- **Public inbound IP address:** Used for app traffic in an external deployment, and management traffic in both internal and external deployments.
- **Outbound public IP:** Used as the "from" IP for outbound connections that leave the virtual network. These connections aren't routed down a VPN.
- **Internal load balancer IP address:** This address only exists in an internal deployment.
- **App-assigned IP-based TLS/SSL addresses:** These addresses are only possible with an external deployment, and when IP-based TLS/SSL binding is configured.

All these IP addresses are visible in the Azure portal from the App Service Environment UI. If you have an internal deployment, the IP for the internal load balancer is listed.

> [!NOTE]
> These IP addresses don't change, as long as your App Service Environment is running. If your App Service Environment becomes suspended and is then restored, the addresses used will change. The normal cause for a suspension is if you block inbound management access, or you block access to a dependency. 

### App-assigned IP addresses

With an external deployment, you can assign IP addresses to individual apps. You can't do that with an internal deployment. For more information on how to configure your app to have its own IP address, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](../configure-ssl-bindings.md).

When an app has its own IP-based SSL address, the App Service Environment reserves two ports to map to that IP address. One port is for HTTP traffic, and the other port is for HTTPS. Those ports are listed in the **IP addresses** section of your App Service Environment portal. Traffic must be able to reach those ports from the VIP. Otherwise, the apps are inaccessible. This requirement is important to remember when you configure network security groups (NSGs).

## Network security groups

[NSGs][NSGs] provide the ability to control network access within a virtual network. When you use the portal, there's an implicit *deny rule* at the lowest priority to deny everything. What you build are your *allow rules*.

You don't have access to the VMs used to host the App Service Environment itself. They're in a subscription that Microsoft manages. If you want to restrict access to the apps, set NSGs on the subnet. In doing so, pay careful attention to the dependencies. If you block any dependencies, the App Service Environment stops working.

You can configure NSGs through the Azure portal or via PowerShell. The information here shows the Azure portal. You create and manage NSGs in the portal as a top-level resource under **Networking**.

The required entries in an NSG are to allow traffic:

**Inbound**

* TCP from the IP service tag `AppServiceManagement` on ports 454, 455
* TCP from the load balancer on port 16001
* From the App Service Environment subnet to the App Service Environment subnet on all ports

**Outbound**

* UDP to all IPs on port 53
* UDP to all IPs on port 123
* TCP to all IPs on ports 80, 443
* TCP to the IP service tag `Sql` on port 1433
* TCP to all IPs on port 12000
* To the App Service Environment subnet on all ports

These ports don't include the ports that your apps require for successful use. For example, suppose your app needs to call a MySQL server on port 3306. Network Time Protocol (NTP) on port 123 is the time synchronization protocol used by the operating system. The NTP endpoints aren't specific to App Service, can vary with the operating system, and aren't in a well-defined list of addresses. To prevent time synchronization issues, you then need to allow UDP traffic to all addresses on port 123. The outbound TCP to port 12000 traffic is for system support and analysis. The endpoints are dynamic, and aren't in a well-defined set of addresses.

The normal app access ports are:

| Use | Ports |
|----------|-------------|
|  HTTP/HTTPS  | 80, 443 |
|  FTP/FTPS    | 21, 990, 10001-10020 |
|  Visual Studio remote debugging  |  4020, 4022, 4024 |
|  Web Deploy service | 8172 |

A default rule enables the IPs in the virtual network to talk to the subnet. Another default rule enables the load balancer, also known as the public VIP, to communicate with the App Service Environment. To see the default rules, select **Default rules** (next to the **Add** icon).

If you put a _deny everything else_ rule before the default rules, you prevent traffic between the VIP and the App Service Environment. To prevent traffic coming from inside the virtual network, add your own rule to allow inbound. Use a source equal to `AzureLoadBalancer`, with a destination of **Any** and a port range of **\***. Because the NSG rule is applied to the subnet, you don't need to be specific in the destination.

If you assigned an IP address to your app, make sure you keep the ports open. To see the ports, select **App Service Environment** > **IP addresses**.  

After your NSGs are defined, assign them to the subnet. If you don't remember the virtual network or subnet, you can see it from the App Service Environment portal. To assign the NSG to your subnet, go to the subnet UI and select the NSG.

## Routes

*Forced tunneling* is when you set routes in your virtual network so the outbound traffic doesn't go directly to the internet. Instead, the traffic goes somewhere else, like an Azure ExpressRoute gateway or a virtual appliance. If you need to configure your App Service Environment in such a manner, see [Configuring your App Service Environment with forced tunneling][forcedtunnel].

When you create an App Service Environment in the portal, you automatically create a set of route tables on the subnet. Those routes simply say to send outbound traffic directly to the internet.  

To create the same routes manually, follow these steps:

1. Go to the Azure portal, and select **Networking** > **Route Tables**.

2. Create a new route table in the same region as your virtual network.

3. From within your route table UI, select **Routes** > **Add**.

4. Set the **Next hop type** to **Internet**, and the **Address prefix** to **0.0.0.0/0**. Select **Save**.

    You then see something like the following:

    ![Screenshot that shows functional routes.][6]

5. After you create the new route table, go to the subnet. Select your route table from the list in the portal. After you save the change, you should then see the NSGs and routes noted with your subnet.

    ![Screenshot that shows NSGs and routes.][7]

## Service endpoints

Service endpoints enable you to restrict access to multi-tenant services to a set of Azure virtual networks and subnets. For more information, see [Virtual Network service endpoints][serviceendpoints]. 

When you enable service endpoints on a resource, there are routes created with higher priority than all other routes. If you use service endpoints on any Azure service, with a force-tunneled App Service Environment, the traffic to those services isn't force-tunneled. 

When service endpoints are enabled on a subnet with an instance of Azure SQL, all Azure SQL instances connected to from that subnet must have service endpoints enabled. If you want to access multiple Azure SQL instances from the same subnet, you can't enable service endpoints on one Azure SQL instance and not on another. No other Azure service behaves like Azure SQL with respect to service endpoints. When you enable service endpoints with Azure Storage, you lock access to that resource from your subnet. You can still access other Azure Storage accounts, however, even if they don't have service endpoints enabled.  

![Diagram that shows service endpoints.][8]

<!--Image references-->
[1]: ./media/network_considerations_with_an_app_service_environment/networkase-overflow.png
[2]: ./media/network_considerations_with_an_app_service_environment/networkase-overflow2.png
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
[NSGs]: ../../virtual-network/network-security-groups-overview.md
[ConfigureASEv1]: app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: app-service-app-service-environment-intro.md
[mobileapps]: /previous-versions/azure/app-service-mobile/app-service-mobile-value-prop
[Functions]: ../../azure-functions/index.yml
[Pricing]: https://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/management/overview.md
[ConfigureSSL]: ../configure-ss-cert.md
[Kudu]: https://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[ASEWAF]: ./integrate-with-application-gateway.md
[AppGW]: ../../web-application-firewall/ag/ag-overview.md
[ASEManagement]: ./management-addresses.md
[serviceendpoints]: ../../virtual-network/virtual-network-service-endpoints-overview.md
[forcedtunnel]: ./forced-tunnel-support.md
[serviceendpoints]: ../../virtual-network/virtual-network-service-endpoints-overview.md