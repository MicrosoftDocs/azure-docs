---
title: Networking features
description: Learn about the networking features in Azure App Service, and learn which features you need for security or other functionality.
author: ccompy

ms.assetid: 5c61eed1-1ad1-4191-9f71-906d610ee5b7
ms.topic: article
ms.date: 03/26/2021
ms.author: ccompy
ms.custom: seodec18

---
# App Service networking features

You can deploy applications in Azure App Service in multiple ways. By default, apps hosted in App Service are accessible directly through the internet and can reach only internet-hosted endpoints. But for many applications, you need to control the inbound and outbound network traffic. There are several features in App Service to help you meet those needs. The challenge is knowing which feature to use to solve a given problem. This article will help you determine which feature to use, based on some example use cases.

There are two main deployment types for Azure App Service: 
- The multitenant public service hosts App Service plans in the Free, Shared, Basic, Standard, Premium, PremiumV2, and PremiumV3 pricing SKUs. 
- The single-tenant App Service Environment (ASE) hosts Isolated SKU App Service plans directly in your Azure virtual network. 

The features you use will depend on whether you're in the multitenant service or in an ASE. 

> [!NOTE]
> Networking features are not available for [apps deployed in Azure Arc](overview-arc-integration.md).

## Multitenant App Service networking features 

Azure App Service is a distributed system. The roles that handle incoming HTTP or HTTPS requests are called *front ends*. The roles that host the customer workload are called *workers*. All the roles in an App Service deployment exist in a multitenant network. Because there are many different customers in the same App Service scale unit, you can't connect the App Service network directly to your network. 

Instead of connecting the networks, you need features to handle the various aspects of application communication. The features that handle requests *to* your app can't be used to solve problems when you're making calls *from* your app. Likewise, the features that solve problems for calls from your app can't be used to solve problems to your app.  

| Inbound features | Outbound features |
|---------------------|-------------------|
| App-assigned address | Hybrid Connections |
| Access restrictions | Gateway-required VNet Integration |
| Service endpoints | VNet Integration |
| Private endpoints ||

Other than noted exceptions, you can use all of these features together. You can mix the features to solve your problems.

## Use cases and features

For any given use case, there might be a few ways to solve the problem. Choosing the best feature sometimes goes beyond the use case itself. The following inbound use cases suggest how to use App Service networking features to solve problems with controlling traffic going to your app:
 
| Inbound use case | Feature |
|---------------------|-------------------|
| Support IP-based SSL needs for your app | App-assigned address |
| Support unshared dedicated inbound address for your app | App-assigned address |
| Restrict access to your app from a set of well-defined addresses | Access restrictions |
| Restrict access to your app from resources in a virtual network | Service endpoints </br> ILB ASE </br> Private endpoints |
| Expose your app on a private IP in your virtual network | ILB ASE </br> Private endpoints </br> Private IP for inbound traffic on an Application Gateway instance with service endpoints |
| Protect your app with a web application firewall (WAF) | Application Gateway and ILB ASE </br> Application Gateway with private endpoints </br> Application Gateway with service endpoints </br> Azure Front Door with access restrictions |
| Load balance traffic to your apps in different regions | Azure Front Door with access restrictions | 
| Load balance traffic in the same region | [Application Gateway with service endpoints][appgwserviceendpoints] | 

The following outbound use cases suggest how to use App Service networking features to solve outbound access needs for your app:

| Outbound use case | Feature |
|---------------------|-------------------|
| Access resources in an Azure virtual network in the same region | VNet Integration </br> ASE |
| Access resources in an Azure virtual network in a different region | Gateway-required VNet Integration </br> ASE and virtual network peering |
| Access resources secured with service endpoints | VNet Integration </br> ASE |
| Access resources in a private network that's not connected to Azure | Hybrid Connections |
| Access resources across Azure ExpressRoute circuits | VNet Integration </br> ASE | 
| Secure outbound traffic from your web app | VNet Integration and network security groups </br> ASE | 
| Route outbound traffic from your web app | VNet Integration and route tables </br> ASE | 


### Default networking behavior

Azure App Service scale units support many customers in each deployment. The Free and Shared SKU plans host customer workloads on multitenant workers. The Basic and higher plans host customer workloads that are dedicated to only one App Service plan. If you have a Standard App Service plan, all the apps in that plan will run on the same worker. If you scale out the worker, all the apps in that App Service plan will be replicated on a new worker for each instance in your App Service plan. 

#### Outbound addresses

The worker VMs are broken down in large part by the App Service plans. The Free, Shared, Basic, Standard, and Premium plans all use the same worker VM type. The PremiumV2 plan uses another VM type. PremiumV3 uses yet another VM type. When you change the VM family, you get a different set of outbound addresses. If you scale from Standard to PremiumV2, your outbound addresses will change. If you scale from PremiumV2 to PremiumV3, your outbound addresses will change. In some older scale units, both the inbound and outbound addresses will change when you scale from Standard to PremiumV2. 

There are a number of addresses that are used for outbound calls. The outbound addresses used by your app for making outbound calls are listed in the properties for your app. These addresses are shared by all the apps running on the same worker VM family in the App Service deployment. If you want to see all the addresses that your app might use in a scale unit, there's property called `possibleOutboundAddresses` that will list them. 

![Screenshot that shows app properties.](media/networking-features/app-properties.png)

App Service has a number of endpoints that are used to manage the service.  Those addresses are published in a separate document and are also in the `AppServiceManagement` IP service tag. The `AppServiceManagement` tag is used only in App Service Environments where you need to allow such traffic. The App Service inbound addresses are tracked in the `AppService` IP service tag. There's no IP service tag that contains the outbound addresses used by App Service. 

![Diagram that shows App Service inbound and outbound traffic.](media/networking-features/default-behavior.png)

### App-assigned address 

The app-assigned address feature is an offshoot of the IP-based SSL capability. You access it by setting up SSL with your app. You can use this feature for IP-based SSL calls. You can also use it to give your app an address that only it has. 

![Diagram that illustrates app-assigned address.](media/networking-features/app-assigned-address.png)

When you use an app-assigned address, your traffic still goes through the same front-end roles that handle all the incoming traffic into the App Service scale unit. But the address that's assigned to your app is used only by your app. Use cases for this feature:

* Support IP-based SSL needs for your app.
* Set a dedicated address for your app that's not shared.

To learn how to set an address on your app, see [Add a TLS/SSL certificate in Azure App Service][appassignedaddress]. 

### Access restrictions 

Access restrictions let you filter *inbound* requests. The filtering action takes place on the front-end roles that are upstream from the worker roles where your apps are running. Because the front-end roles are upstream from the workers, you can think of access restrictions as network-level protection for your apps. 

This feature allows you to build a list of allow and deny rules that are evaluated in priority order. It's similar to the network security group (NSG) feature in Azure networking. You can use this feature in an ASE or in the multitenant service. When you use it with an ILB ASE or private endpoint, you can restrict access from private address blocks.
> [!NOTE]
> Up to 512 access restriction rules can be configured per app. 

![Diagram that illustrates access restrictions.](media/networking-features/access-restrictions.png)

#### IP-based access restriction rules

The IP-based access restrictions feature helps when you want to restrict the IP addresses that can be used to reach your app. Both IPv4 and IPv6 are supported. Some use cases for this feature:
* Restrict access to your app from a set of well-defined addresses. 
* Restrict access to traffic coming through an external load-balancing service or other network appliances with known egress IP addresses. 

To learn how to enable this feature, see [Configuring access restrictions][iprestrictions].

> [!NOTE]
> IP-based access restriction rules only handle virtual network address ranges when your app is in an App Service Environment. If your app is in the multitenant service, you need to use [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) to restrict traffic to select subnets in your virtual network.

#### Access restriction rules based on service endpoints 

Service endpoints allow you to lock down *inbound* access to your app so that the source address must come from a set of subnets that you select. This feature works together with IP access restrictions. Service endpoints aren't compatible with remote debugging. If you want to use remote debugging with your app, your client can't be in a subnet that has service endpoints enabled. The process for setting service endpoints is similar to the process for setting IP access restrictions. You can build an allow/deny list of access rules that includes public addresses and subnets in your virtual networks. 

Some use cases for this feature:

* Set up an application gateway with your app to lock down inbound traffic to your app.
* Restrict access to your app to resources in your virtual network. These resources can include VMs, ASEs, or even other apps that use VNet Integration. 

![Diagram that illustrates the use of service endpoints with Application Gateway.](media/networking-features/service-endpoints-appgw.png)

To learn more about configuring service endpoints with your app, see [Azure App Service access restrictions][serviceendpoints].

#### Access restriction rules based on service tags

[Azure service tags][servicetags] are well defined sets of IP addresses for Azure services. Service tags group the IP ranges used in various Azure services and is often also further scoped to specific regions. This allows you to filter *inbound* traffic from specific Azure services. 

For a full list of tags and more information, visit the service tag link above. 
To learn how to enable this feature, see [Configuring access restrictions][iprestrictions].

#### Http header filtering for access restriction rules

For each access restriction rule, you can add additional http header filtering. This allows you to further inspect the incoming request and filter based on specific http header values. Each header can have up to 8 values per rule. The following list of http headers is currently supported: 
* X-Forwarded-For
* X-Forwarded-Host
* X-Azure-FDID
* X-FD-HealthProbe

Some use cases for http header filtering are:
* Restrict access to traffic from proxy servers forwarding the host name
* Restrict access to a specific Azure Front Door instance with a service tag rule and X-Azure-FDID header restriction

### Private Endpoint

Private Endpoint is a network interface that connects you privately and securely to your Web App by Azure private link. Private Endpoint uses a private IP address from your virtual network, effectively bringing the web app into your virtual network. This feature is only for *inbound* flows to your web app.
For more information, see
[Using private endpoints for Azure Web App][privateendpoints].

Some use cases for this feature:

* Restrict access to your app from resources in a virtual network. 
* Expose your app on a private IP in your virtual network. 
* Protect your app with a WAF.

Private endpoints prevent data exfiltration because the only thing you can reach across the private endpoint is the app with which it's configured. 
 
### Hybrid Connections

App Service Hybrid Connections enables your apps to make *outbound* calls to specified TCP endpoints. The endpoint can be on-premises, in a virtual network, or anywhere that allows outbound traffic to Azure on port 443. To use the feature, you need to install a relay agent called Hybrid Connection Manager on a Windows Server 2012 or newer host. Hybrid Connection Manager needs to be able to reach Azure Relay at port 443. You can download Hybrid Connection Manager from the App Service Hybrid Connections UI in the portal. 

![Diagram that shows the Hybrid Connections network flow.](media/networking-features/hybrid-connections.png)

App Service Hybrid Connections is built on the Azure Relay Hybrid Connections capability. App Service uses a specialized form of the feature that only supports making outbound calls from your app to a TCP host and port. This host and port only need to resolve on the host where Hybrid Connection Manager is installed. 

When the app, in App Service, does a DNS lookup on the host and port defined in your hybrid connection, the traffic automatically redirects to go through the hybrid connection and out of Hybrid Connection Manager. To learn more, see [App Service Hybrid Connections][hybridconn].

This feature is commonly used to:

* Access resources in private networks that aren't connected to Azure with a VPN or ExpressRoute.
* Support the migration of on-premises apps to App Service without the need to move supporting databases.  
* Provide access with improved security to a single host and port per hybrid connection. Most networking features open access to a network. With Hybrid Connections, you can only reach the single host and port.
* Cover scenarios not covered by other outbound connectivity methods.
* Perform development in App Service in a way that allows the apps to easily use on-premises resources. 

Because this feature enables access to on-premises resources without an inbound firewall hole, it's popular with developers. The other outbound App Service networking features are related to Azure Virtual Network. Hybrid Connections doesn't depend on going through a virtual network. It can be used for a wider variety of networking needs. 

Note that App Service Hybrid Connections is unaware of what you're doing on top of it. So you can use it to access a database, a web service, or an arbitrary TCP socket on a mainframe. The feature essentially tunnels TCP packets. 

Hybrid Connections is popular for development, but it's also used in production applications. It's great for accessing a web service or database, but it's not appropriate for situations that involve creating many connections. 

### Gateway-required VNet Integration 

Gateway-required App Service VNet Integration enables your app to make *outbound* requests into an Azure virtual network. The feature works by connecting the host your app is running on to a Virtual Network gateway on your virtual network by using a point-to-site VPN. When you configure the feature, your app gets one of the point-to-site addresses assigned to each instance. This feature enables you to access resources in either classic or Azure Resource Manager virtual networks in any region. 

![Diagram that illustrates gateway-required VNet Integration.](media/networking-features/gw-vnet-integration.png)

This feature solves the problem of accessing resources in other virtual networks. It can even be used to connect through a virtual network to either other virtual networks or on-premises. It doesn't work with ExpressRoute-connected virtual networks, but it does work with site-to-site VPN-connected networks. It's usually inappropriate to use this feature from an app in an App Service Environment (ASE) because the ASE is already in your virtual network. Use cases for this feature:

* Access resources on private IPs in your Azure virtual networks. 
* Access resources on-premises if there's a site-to-site VPN. 
* Access resources in peered virtual networks. 

When this feature is enabled, your app will use the DNS server that the destination virtual network is configured with. For more information on this feature, see [App Service VNet Integration][vnetintegrationp2s]. 

### VNet Integration

Gateway-required VNet Integration is useful, but it doesn't solve the problem of accessing resources across ExpressRoute. On top of needing to reach across ExpressRoute connections, there's a need for apps to be able to make calls to services secured by service endpoint. Another VNet Integration capability can meet these needs. 

The new VNet Integration feature enables you to place the back end of your app in a subnet in a Resource Manager virtual network in the same region as your app. This feature isn't available from an App Service Environment, which is already in a virtual network. Use cases for this feature:

* Access resources in Resource Manager virtual networks in the same region.
* Access resources that are secured with service endpoints. 
* Access resources that are accessible across ExpressRoute or VPN connections.
* Help to secure all outbound traffic. 
* Force tunnel all outbound traffic. 

![Diagram that illustrates VNet Integration.](media/networking-features/vnet-integration.png)

To learn more, see [App Service VNet Integration][vnetintegration].

### App Service Environment 

An App Service Environment (ASE) is a single-tenant deployment of the Azure App Service that runs in your virtual network. Some cases such for this feature:

* Access resources in your virtual network.
* Access resources across ExpressRoute.
* Expose your apps with a private address in your virtual network. 
* Access resources across service endpoints. 

With an ASE, you don't need to use features like VNet Integration or service endpoints because the ASE is already in your virtual network. If you want to access resources like SQL or Azure Storage over service endpoints, enable service endpoints on the ASE subnet. If you want to access resources in the virtual network, you don't need to do any additional configuration. If you want to access resources across ExpressRoute, you're already in the virtual network and don't need to configure anything on the ASE or the apps in it. 

Because the apps in an ILB ASE can be exposed on a private IP address, you can easily add WAF devices to expose just the apps that you want to the internet and help keep the rest secure. This feature can help make the development of multitier applications easier. 

Some things aren't currently possible from the multitenant service but are possible from an ASE. Here are some examples:

* Expose your apps on a private IP address.
* Help secure all outbound traffic with network controls that aren't a part of your app.
* Host your apps in a single-tenant service. 
* Scale up to many more instances than are possible in the multitenant service. 
* Load private CA client certificates for use by your apps with private CA-secured endpoints.
* Force TLS 1.1 across all apps hosted in the system without any ability to disable it at the app level. 
* Provide a dedicated outbound address for all the apps in your ASE that aren't shared with customers. 

![Diagram that illustrates an ASE in a virtual network.](media/networking-features/app-service-environment.png)

The ASE provides the best story around isolated and dedicated app hosting, but it does involve some management challenges. Some things to consider before you use an operational ASE:
 
 * An ASE runs inside your virtual network, but it does have dependencies outside the virtual network. Those dependencies must be allowed. For more information, see [Networking considerations for an App Service Environment][networkinfo].
 * An ASE doesn't scale immediately like the multitenant service. You need to anticipate scaling needs rather than reactively scaling. 
 * An ASE does have a higher up-front cost. To get the most out of your ASE, you should plan to put many workloads into one ASE rather than using it for small efforts.
 * The apps in an ASE can't selectively restrict access to some apps in the ASE and not others.
 * An ASE is in a subnet, and any networking rules apply to all the traffic to and from that ASE. If you want to assign inbound traffic rules for just one app, use access restrictions. 

## Combining features 

The features noted for the multitenant service can be used together to solve more elaborate use cases. Two of the more common use cases are described here, but they're just examples. By understanding what the various features do, you can meet nearly all your system architecture needs.

### Place an app into a virtual network

You might wonder how to put an app into a virtual network. If you put your app into a virtual network, the inbound and outbound endpoints for the app are within the virtual network. An ASE is the best way to solve this problem. But you can meet most of your needs within the multitenant service by combining features. For example, you can host intranet-only applications with private inbound and outbound addresses by:

* Creating an application gateway with private inbound and outbound addresses.
* Securing inbound traffic to your app with service endpoints. 
* Using the new VNet Integration feature so the back end of your app is in your virtual network. 

This deployment style won't give you a dedicated address for outbound traffic to the internet or the ability to lock down all outbound traffic from your app. It will give you a much of what you would only otherwise get with an ASE. 

### Create multitier applications

A multitier application is an application in which the API back-end apps can be accessed only from the front-end tier. There are two ways to create a multitier application. Both start by using VNet Integration to connect your front-end web app to a subnet in a virtual network. Doing so will enable your web app to make calls into your virtual network. After your front-end app is connected to the virtual network, you need to decide how to lock down access to your API application. You can:

* Host both the front end and the API app in the same ILB ASE, and expose the front-end app to the internet by using an application gateway.
* Host the front end in the multitenant service and the back end in an ILB ASE.
* Host both the front end and the API app in the multitenant service.

If you're hosting both the front end and API app for a multitier application, you can:

- Expose your API application by using private endpoints in your virtual network:

  ![Diagram that illustrates the use of private endpoints in a two-tier app.](media/networking-features/multi-tier-app-private-endpoint.png)

- Use service endpoints to ensure inbound traffic to your API app comes only from the subnet used by your front-end web app:

  ![Diagram that illustrates the use of service endpoints to help secure an app.](media/networking-features/multi-tier-app.png)

Here are some considerations to help you decide which method to use:

* When you use service endpoints, you only need to secure traffic to your API app to the integration subnet. This helps to secure the API app, but you could still have data exfiltration from your front-end app to other apps in the app service.
* When you use private endpoints, you have two subnets at play, which adds complexity. Also, the private endpoint is a top-level resource and adds management overhead. The benefit of using private endpoints is that you don't have the possibility of data exfiltration. 

Either method will work with multiple front ends. On a small scale, service endpoints are easier to use because you simply enable service endpoints for the API app on the front-end integration subnet. As you add more front-end apps, you need to adjust every API app to include service endpoints with the integration subnet. When you use private endpoints, there's more complexity, but you don't have to change anything on your API apps after you set a private endpoint. 

### Line-of-business applications

Line-of-business (LOB) applications are internal applications that aren't normally exposed for access from the internet. These applications are called from inside corporate networks where access can be strictly controlled. If you use an ILB ASE, it's easy to host your line-of-business applications. If you use the multitenant service, you can either use private endpoints or use service endpoints combined with an application gateway. There are two reasons to use an application gateway with service endpoints instead of using private endpoints:
* You need WAF protection on your LOB apps.
* You want to load balance to multiple instances of your LOB apps.

If neither of these needs apply, you're better off using private endpoints. With private endpoints available in App Service, you can expose your apps on private addresses in your virtual network. The private endpoint you place in your virtual network can be reached across ExpressRoute and VPN connections. 

Configuring private endpoints will expose your apps on a private address, but you'll need to configure DNS to reach that address from on-premises. To make this configuration work, you'll need to forward the Azure DNS private zone that contains your private endpoints to your on-premises DNS servers. Azure DNS private zones don't support zone forwarding, but you can support zone forwarding by using a DNS server for that purpose. The [DNS Forwarder](https://azure.microsoft.com/resources/templates/dns-forwarder/) template makes it easier to forward your Azure DNS private zone to your on-premises DNS servers.

## App Service ports

If you scan App Service, you'll find several ports that are exposed for inbound connections. There's no way to block or control access to these ports in the multitenant service. Here's the list of exposed ports:

| Use | Port or ports |
|----------|-------------|
|  HTTP/HTTPS  | 80, 443 |
|  Management | 454, 455 |
|  FTP/FTPS    | 21, 990, 10001-10020 |
|  Visual Studio remote debugging  |  4020, 4022, 4024 |
|  Web Deploy service | 8172 |
|  Infrastructure use | 7654, 1221 |

<!--Links-->
[appassignedaddress]: ./configure-ssl-certificate.md
[iprestrictions]: ./app-service-ip-restrictions.md
[serviceendpoints]: ./app-service-ip-restrictions.md
[hybridconn]: ./app-service-hybrid-connections.md
[vnetintegrationp2s]: ./web-sites-integrate-with-vnet.md
[vnetintegration]: ./web-sites-integrate-with-vnet.md
[networkinfo]: ./environment/network-info.md
[appgwserviceendpoints]: ./networking/app-gateway-with-service-endpoints.md
[privateendpoints]: ./networking/private-endpoint.md
[servicetags]: ../virtual-network/service-tags-overview.md
