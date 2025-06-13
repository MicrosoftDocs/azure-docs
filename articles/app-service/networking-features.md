---
title: Networking features
description: Learn about the networking features in Azure App Service, and learn which features you need for security or other functionality.
author: seligj95
ms.assetid: 5c61eed1-1ad1-4191-9f71-906d610ee5b7
ms.topic: article
ms.date: 06/13/2025
ms.author: jordanselig
ms.custom: UpdateFrequency3
#customer intent: As a deployment engineer, I want to understand the options for deploying apps in Azure App Services to control network traffic.
---
# App Service networking features

You can deploy applications in Azure App Service in multiple ways. By default, apps hosted in App Service are accessible directly through the internet and can reach only internet-hosted endpoints. For many applications, you need to control the inbound and outbound network traffic. There are several features in App Service to help you meet those needs. The challenge is knowing which feature to use to solve a given problem. Use this article to help you determine which feature to use, based on example use cases.

There are two main deployment types for Azure App Service:

- The multitenant public service hosts App Service plans in the Free, Shared, Basic, Standard, Premium, PremiumV2, PremiumV3, and PremiumV4 pricing SKUs.
- The single-tenant App Service Environment (ASE) hosts Isolated SKU App Service plans directly in your Azure virtual network.

The features that you use depend on whether you're in the multitenant service or in an ASE.

> [!NOTE]
> Networking features aren't available for [apps deployed in Azure Arc](overview-arc-integration.md).

## Multitenant App Service networking features

Azure App Service is a distributed system. The roles that handle incoming HTTP or HTTPS requests are called *front ends*. The roles that host the customer workload are called *workers*. All the roles in an App Service deployment exist in a multitenant network. Because there are many different customers in the same App Service scale unit, you can't connect the App Service network directly to your network.

Instead of connecting the networks, you need features to handle the various aspects of application communication. The features that handle requests *to* your app can't be used to solve problems when you make calls *from* your app. Likewise, the features that solve problems for calls from your app can't be used to solve problems to your app.

| Inbound features     | Outbound features |
|:---------------------|:-------------------|
| App-assigned address | Hybrid Connections |
| Access restrictions  | Gateway-required virtual network integration |
| Service endpoints    | Virtual network integration |
| Private endpoints    ||

Other than noted exceptions, you can use all of these features together. You can mix the features to solve your problems.

## Use cases and features

For any given use case, there might be a few ways to solve the problem. Choosing the best feature sometimes goes beyond the use case itself. The following inbound use cases suggest how to use App Service networking features to solve problems with controlling traffic going to your app:

| Inbound use case     | Feature            |
|:---------------------|:-------------------|
| Support IP-based SSL needs for your app | App-assigned address |
| Support unshared dedicated inbound address for your app | App-assigned address |
| Restrict access to your app from a set of well-defined addresses | Access restrictions |
| Restrict access to your app from resources in a virtual network | Service endpoints </br> Internal Load Balancer (ILB) ASE </br> Private endpoints |
| Expose your app on a private IP in your virtual network | ILB ASE </br> Private endpoints </br> Private IP for inbound traffic on an Application Gateway instance with service endpoints |
| Protect your app with a web application firewall (WAF) | Application Gateway and ILB ASE </br> Application Gateway with private endpoints </br> Application Gateway with service endpoints </br> Azure Front Door with access restrictions |
| Load balance traffic to your apps in different regions | Azure Front Door with access restrictions |
| Load balance traffic in the same region | [Application Gateway with service endpoints](./networking/app-gateway-with-service-endpoints.md) |

The following outbound use cases suggest how to use App Service networking features to solve outbound access needs for your app:

| Outbound use case | Feature |
|---------------------|-------------------|
| Access resources in an Azure virtual network in the same region | Virtual network integration </br> ASE |
| Access resources in an Azure virtual network in a different region | virtual network integration and virtual network peering </br> Gateway-required virtual network integration </br> ASE and virtual network peering |
| Access resources secured with service endpoints | virtual network integration </br> ASE |
| Access resources in a private network that's not connected to Azure | Hybrid Connections |
| Access resources across Azure ExpressRoute circuits | virtual network integration </br> ASE |
| Secure outbound traffic from your web app | virtual network integration and network security groups </br> ASE |
| Route outbound traffic from your web app | virtual network integration and route tables </br> ASE |

### Default networking behavior

Azure App Service scale units support many customers in each deployment. The Free and Shared SKU plans host customer workloads on multitenant workers. The Basic and higher plans host customer workloads that are dedicated to only one App Service plan. If you have a Standard App Service plan, all the apps in that plan run on the same worker. If you scale out the worker, all the apps in that App Service plan are replicated on a new worker for each instance in your App Service plan.

#### Outbound addresses

The worker virtual machines are broken down in large part by the App Service plans. The Free, Shared, Basic, Standard, and Premium plans all use the same worker virtual machine type. The PremiumV2 plan uses another virtual machine type. PremiumV3 uses yet another virtual machine type. And PremiumV4 uses yet another virtual machine type.

When you change the virtual machine family, you get a different set of outbound addresses. If you scale from Standard to PremiumV2, your outbound addresses change. If you scale from PremiumV2 to PremiumV3, your outbound addresses change. In some older scale units, both the inbound and outbound addresses change when you scale from Standard to PremiumV2.

There are many addresses that are used for outbound calls. The outbound addresses used by your app for making outbound calls are listed in the properties for your app. All the apps that run on the same worker virtual machine family in the App Service deployment share these addresses. If you want to see all the addresses that your app might use in a scale unit, there's property called `possibleOutboundAddresses` that lists them.

> [!NOTE]
> Apps on the PremiumV4 SKU don't expose their outbound IP addresses.

:::image type="content" source="media/networking-features/app-properties.png" alt-text="Screenshot that shows app properties, including possible outbound addresses." lightbox="media/networking-features/app-properties.png":::

App Service has many endpoints that are used to manage the service. Those addresses are published in a separate document and are also in the `AppServiceManagement` IP service tag. The `AppServiceManagement` tag is used only in App Service Environments where you need to allow such traffic. The App Service inbound addresses are tracked in the `AppService` IP service tag. There's no IP service tag that contains the outbound addresses used by App Service.

:::image type="content" source="media/networking-features/default-behavior.png" alt-text="Diagram that shows App Service inbound and outbound traffic." border="false":::

### App-assigned address

The app-assigned address feature is an offshoot of the IP-based SSL capability. To access it, set up SSL with your app. You can use this feature for IP-based SSL calls. You can also use it to give your app an address that only it has.

:::image type="content" source="media/networking-features/app-assigned-address.png" alt-text="Diagram that illustrates app-assigned address." border="false":::

When you use an app-assigned address, your traffic still goes through the same front-end roles that handle all the incoming traffic into the App Service scale unit. The address that's assigned to your app is used only by your app. Use cases for this feature:

- Support IP-based SSL needs for your app.
- Set a dedicated address for your app that's not shared.

To learn how to set an address on your app, see [Add a TLS/SSL certificate in Azure App Service](./configure-ssl-certificate.md).

### Access restrictions

Access restrictions let you filter *inbound* requests. The filtering action takes place on the front-end roles that are upstream from the worker roles where your apps run. Because the front-end roles are upstream from the workers, you can think of access restrictions as network-level protection for your apps. For more information, see [Azure App Service access restrictions](./overview-access-restrictions.md).

This feature allows you to build a list of allow and deny rules that are evaluated in priority order. It's similar to the network security group (NSG) feature in Azure networking. You can use this feature in an ASE or in the multitenant service. When you use it with an ILB ASE, you can restrict access from private address blocks. For more information, see [Set up Azure App Service access restrictions](./app-service-ip-restrictions.md).

> [!NOTE]
> You can configure up to 512 access restriction rules per app.

:::image type="content" source="media/networking-features/access-restrictions.png" alt-text="Diagram that illustrates access restrictions." border="false":::

### Private endpoint

Private endpoint is a network interface that connects you privately and securely to your Web App by Azure private link. Private endpoint uses a private IP address from your virtual network, effectively bringing the web app into your virtual network. This feature is only for *inbound* flows to your web app.
For more information, see [Using Private Endpoints for App Service apps](./networking/private-endpoint.md).

Some use cases for this feature:

- Restrict access to your app from resources in a virtual network.
- Expose your app on a private IP in your virtual network.
- Protect your app with a WAF.

Private endpoints prevent data exfiltration. The only thing you can reach across the private endpoint is the app with which it's configured.

### Network Security Perimeter

Azure [Network Security Perimeter](../private-link/network-security-perimeter-concepts.md) (NSP) is a service that provides a secure perimeter for communication of Platform as a Service (PaaS) services. These PaaS services can communicate with each other within the perimeter. They can also communicate with resources outside the perimeter using public inbound and outbound access rules.

NSP rule enforcement primarily uses identity-based security. This approach can't be fully enforced in platform services like App Services and Functions that allow you to deploy your own code and use the identity to represent the platform. If you need to communicate with PaaS services that are part of an NSP, add virtual network integration to your App Service or Functions instances. Communicate with the PaaS resources using private endpoints.

### Hybrid Connections

App Service Hybrid Connections enables your apps to make *outbound* calls to specified TCP endpoints. The endpoint can be on-premises, in a virtual network, or anywhere that allows outbound traffic to Azure on port 443. To use the feature, you need to install a relay agent called Hybrid Connection Manager on a Windows Server 2012 or newer host. Hybrid Connection Manager needs to be able to reach Azure Relay at port 443. You can download Hybrid Connection Manager from the App Service Hybrid Connections UI in the portal.

:::image type="content" source="media/networking-features/hybrid-connections.png" alt-text="Diagram that shows the Hybrid Connections network flow." border="false":::

App Service Hybrid Connections is built on the Azure Relay Hybrid Connections capability. App Service uses a specialized form of the feature that only supports making outbound calls from your app to a TCP host and port. This host and port only need to resolve on the host where Hybrid Connection Manager is installed.

When the app, in App Service, does a DNS lookup on the host and port defined in your hybrid connection, the traffic automatically redirects to go through the hybrid connection and out of Hybrid Connection Manager. For more information, see [App Service Hybrid Connections](./app-service-hybrid-connections.md).

This feature is commonly used to:

- Access resources in private networks that aren't connected to Azure with a VPN or ExpressRoute.
- Support the migration of on-premises apps to App Service without the need to move supporting databases.
- Provide access with improved security to a single host and port per hybrid connection. Most networking features open access to a network. With Hybrid Connections, you can reach only the single host and port.
- Cover scenarios not covered by other outbound connectivity methods.
- Perform development in App Service in a way that allows the apps to easily use on-premises resources.

Because this feature enables access to on-premises resources without an inbound firewall hole, it's popular with developers. The other outbound App Service networking features are related to Azure Virtual Network. Hybrid Connections doesn't depend on going through a virtual network. It can be used for a wider variety of networking needs.

App Service Hybrid Connections is unaware of what you're doing on top of it. You can use it to access a database, a web service, or an arbitrary TCP socket on a mainframe. The feature essentially tunnels TCP packets.

Hybrid Connections is popular for development. You can also use it in production applications. It's great for accessing a web service or database, but it's not appropriate for situations that involve creating many connections.

### <a id="regional-vnet-integration"></a>Virtual network integration

App Service virtual network integration enables your app to make *outbound* requests into an Azure virtual network.

The virtual network integration feature enables you to place the back end of your app in a subnet in a Resource Manager virtual network. The virtual network must be in the same region as your app. This feature isn't available from an App Service Environment, which is already in a virtual network. Use cases for this feature:

- Access resources in Resource Manager virtual networks in the same region.
- Access resources in peered virtual networks, including cross region connections.
- Access resources that are secured with service endpoints.
- Access resources that are accessible across ExpressRoute or VPN connections.
- Access resources in private networks without the need and cost of a virtual network gateway.
- Help to secure all outbound traffic.
- Force tunnel all outbound traffic.

:::image type="content" source="media/networking-features/vnet-integration.png" alt-text="Diagram that illustrates virtual network integration." lightbox="media/networking-features/vnet-integration.png" border="false":::

To learn more, see [App Service virtual network integration](./overview-vnet-integration.md).

#### Gateway-required virtual network integration

Gateway-required virtual network integration was the first edition of virtual network integration in App Service. The feature uses a point-to-site VPN to connect the host that your app runs on to a Virtual Network gateway on your virtual network. When you configure the feature, your app gets one of the point-to-site assigned addresses assigned to each instance.

:::image type="content" source="media/networking-features/gw-vnet-integration.png" alt-text="Diagram that illustrates gateway-required virtual network integration." border="false":::

Gateway required integration allows you to connect directly to a virtual network in another region without peering and to connect to a classic virtual network. The feature is limited to App Service Windows plans and doesn't work with ExpressRoute-connected virtual networks. We recommend that you use the regional virtual network integration. For more information, see [Configure gateway-required virtual network integration](./configure-gateway-required-vnet-integration.md).

### App Service Environment

An App Service Environment (ASE) is a single-tenant deployment of the Azure App Service that runs in your virtual network. Some cases such for this feature:

- Access resources in your virtual network.
- Access resources across ExpressRoute.
- Expose your apps with a private address in your virtual network.
- Access resources across service endpoints.
- Access resources across private endpoints.

With an ASE, you don't need to use virtual network integration because the ASE is already in your virtual network. If you want to access resources like SQL or Azure Storage over service endpoints, enable service endpoints on the ASE subnet. If you want to access resources in the virtual network or private endpoints in the virtual network, you don't need to do any extra configuration. If you want to access resources across ExpressRoute, you're already in the virtual network, and don't need to configure anything on the ASE or the apps in it.

Because the apps in an ILB ASE can be exposed on a private IP address, you can add WAF devices to expose just some apps to the internet. Not exposing others helps keep the rest secure. This feature can help make the development of multi-tier applications easier.

Some things aren't currently possible from the multitenant service but are possible from an ASE. Here are some examples:

- Host your apps in a single tenant service.
- Scale up to many more instances than are possible in the multitenant service.
- Load private CA client certificates for use by your apps with private CA-secured endpoints.
- Force TLS 1.2 across all apps hosted in the system without any ability to disable it at the app level.

:::image type="content" source="media/networking-features/app-service-environment.png" alt-text="Diagram that illustrates an ASE in a virtual network." lightbox="media/networking-features/app-service-environment.png" border="false":::

The ASE provides the best story around isolated and dedicated app hosting. The approach involves some management challenges. Some things to consider before you use an operational ASE:

- An ASE runs inside your virtual network, but it has dependencies outside the virtual network. Those dependencies must be allowed. For more information, see [Networking considerations for an App Service Environment](./environment/network-info.md).
- An ASE doesn't scale immediately like the multitenant service. You need to anticipate scaling needs rather than reactively scaling.
- An ASE has a higher up-front cost. To get the most out of your ASE, you should plan to put many workloads into one ASE rather than using it for small efforts.
- The apps in an ASE can't selectively restrict access to some apps in the ASE and not others.
- An ASE is in a subnet. Any networking rules apply to all the traffic to and from that ASE. If you want to assign inbound traffic rules for just one app, use access restrictions.

## Combining features

The features noted for the multitenant service can be used together to solve more elaborate use cases. Two of the more common use cases are described here as examples. By understanding what the various features do, you can meet nearly all your system architecture needs.

### Place an app into a virtual network

You might wonder how to put an app into a virtual network. If you put your app into a virtual network, the inbound and outbound endpoints for the app are within the virtual network. An ASE is the best way to solve this problem. But you can meet most of your needs within the multitenant service by combining features. For example, you can host intranet-only applications with private inbound and outbound addresses by:

- Creating an application gateway with private inbound and outbound addresses.
- Securing inbound traffic to your app with service endpoints.
- Using the virtual network integration feature so the back end of your app is in your virtual network.

This deployment style doesn't give you a dedicated address for outbound traffic to the internet or the ability to lock down all outbound traffic from your app. It gives you a much of what you would only otherwise get with an ASE.

### Create multi-tier applications

A multi-tier application is an application in which the API back-end apps can be accessed only from the front-end tier. There are two ways to create a multi-tier application. Both start by using virtual network integration to connect your front-end web app to a subnet in a virtual network. Doing so enables your web app to make calls into your virtual network. After your front-end app is connected to the virtual network, decide how to lock down access to your API application. You can:

- Host both the front end and the API app in the same ILB ASE, and expose the front-end app to the internet by using an application gateway.
- Host the front end in the multitenant service and the back end in an ILB ASE.
- Host both the front end and the API app in the multitenant service.

If you're hosting both the front end and API app for a multi-tier application, you can:

- Expose your API application by using private endpoints in your virtual network:

  :::image type="content" source="media/networking-features/multi-tier-app-private-endpoint.png" alt-text="Diagram that illustrates the use of private endpoints in a two-tier app." lightbox="media/networking-features/multi-tier-app-private-endpoint.png":::

- Use service endpoints to ensure inbound traffic to your API app comes only from the subnet used by your front-end web app:

  :::image type="content" source="media/networking-features/multi-tier-app.png" alt-text="Diagram that illustrates the use of service endpoints to help secure an app." border="false":::

Here are some considerations to help you decide which method to use:

- When you use service endpoints, you only need to secure traffic to your API app to the integration subnet. Service endpoints help to secure the API app, but you could still have data exfiltration from your front-end app to other apps in the app service.
- When you use private endpoints, you have two subnets at play, which adds complexity. Also, the private endpoint is a top-level resource and adds management overhead. The benefit of using private endpoints is that you don't have the possibility of data exfiltration.

Either method works with multiple front ends. On a small scale, service endpoints are easier to use because you simply enable service endpoints for the API app on the front-end integration subnet. As you add more front-end apps, you need to adjust every API app to include service endpoints with the integration subnet. When you use private endpoints, there's more complexity, but you don't have to change anything on your API apps after you set a private endpoint.

### Line-of-business applications

Line-of-business (LOB) applications are internal applications that aren't normally exposed for access from the internet. These applications are called from inside corporate networks where access can be strictly controlled. If you use an ILB ASE, it's easy to host your line-of-business applications. If you use the multitenant service, you can either use private endpoints or use service endpoints combined with an application gateway. There are two reasons to use an application gateway with service endpoints instead of using private endpoints:

- You need WAF protection on your LOB apps.
- You want to load balance to multiple instances of your LOB apps.

If neither of these needs apply, you're better off using private endpoints. With private endpoints available in App Service, you can expose your apps on private addresses in your virtual network. The private endpoint you place in your virtual network can be reached across ExpressRoute and VPN connections.

Configuring private endpoints exposes your apps on a private address. You need to configure DNS to reach that address from on-premises. To make this configuration work, forward the Azure DNS private zone that contains your private endpoints to your on-premises DNS servers. Azure DNS private zones don't support zone forwarding, but you can support zone forwarding by using [Azure DNS private resolver](../dns/dns-private-resolver-overview.md).

## App Service ports

If you scan App Service, you find several ports that are exposed for inbound connections. There's no way to block or control access to these ports in the multitenant service. Here's the list of exposed ports:

| Use | Port or ports |
|----------|-------------|
|  HTTP/HTTPS  | 80, 443 |
|  Management | 454, 455 |
|  FTP/FTPS    | 21, 990, 10001-10300 |
|  Visual Studio remote debugging  |  4020, 4022, 4024 |
|  Web Deploy service | 8172 |
|  Infrastructure use | 7654, 1221 |
