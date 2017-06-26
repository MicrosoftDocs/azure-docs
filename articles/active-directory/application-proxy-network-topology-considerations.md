---
title: Network topology considerations when using Azure Active Directory Application Proxy | Microsoft Docs
description: Covers network topology considerations when using Azure AD Application Proxy.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid:
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/12/2017
ms.author: kgremban

---

# Network topology considerations when using Azure Active Directory Application Proxy

This article explains network topology considerations when using Azure Active Directory (Azure AD) Application Proxy for publishing and accessing your applications remotely.

## Traffic flow

When an application is published through Azure AD Application Proxy, traffic from the users to the applications flows through three connections:

1. The user connects to the Azure AD Application Proxy public endpoint on Azure
2. Application Proxy connects to the connector
3. The connector connects to the target application

 ![Diagram showing traffic flow from user to target application](./media/application-proxy-network-topologies/application-proxy-three-hops.png)

## Tenant location and Application Proxy service

When you sign up for an Azure AD tenant, the region of your tenant is determined by the country you specify. When you enable Application Proxy, the Application Proxy service instances for your tenant are displayed in the same region as your Azure AD tenant, or the closest region to it.

For example, if your Azure AD tenant’s region is the European Union (EU), all your Application Proxy connectors use service instances in Azure datacenters in the EU. When your users access published applications, their traffic goes through the Application Proxy service instances in this location.

## Considerations for reducing latency

All proxy solutions introduce latency into your network connection. No matter which proxy or VPN solution you choose as your remote access solution, it always includes a set of servers enabling the connection to inside your corporate network.

Organizations typically include server endpoints in their perimeter network. With Azure AD Application Proxy, however, traffic flows through the proxy service in the cloud while the connectors reside on your corporate network. No perimeter network is required.

### Connector placement

Application Proxy chooses the location of instances for you, based on your tenant location. You get to decide where to install the connector, giving you the power to define the latency characteristics of your network traffic.

When setting up the Application Proxy service, ask the following questions:

* Where is the app located?
* Where are most users who access the app located?
* Where is the Application Proxy instance located?
* Do you already have a dedicated network connection to Azure datacenters set up, like Azure ExpressRoute or a similar VPN?

The connector has to communicate with Azure and your applications, so the placement of the connector affects the latency of those two connections. When evaluating the placement of the connector, consider the following:

* If you want to use Kerberos constrained delegation (KCD) for single sign-on, then the connector needs a line of sight to a datacenter. 
* When in doubt, install the connector closer to the application.

### General approach to minimize latency

You can try to minimize the latency of the end-to-end traffic by optimizing each of the network connections. Each connection can be optimized by:

* Reducing the distance between the two ends of the hop.
* Choosing the right network to traverse. For example, traversing a private network rather than the public Internet may be faster, due to dedicated links.

If you have a dedicated VPN or ExpressRoute link between Azure and your corporate network, you may want to use that.

## Focus your optimizing strategy

There's little that you can do to control the connection between your users and Azure AD Application Proxy; they may access your apps from a home network, a coffee shop, or a different country. Instead, you can optimize the connections from Application Proxy to the connectors to the apps. Consider incorporating the following patterns in your environment.

### Pattern 1: Put the connector close to the application

Place the connector close to the target application in the customer network. The advantage of this pattern is that the connector is likely to need a line of sight to the domain controller. This approach is sufficient for most scenarios, which is why most of our customers follow this pattern. This pattern can also be combined with pattern 2 to optimize traffic between Application Proxy and the connector.

### Pattern 2: Take advantage of ExpressRoute with public peering

If you have ExpressRoute set up with public peering, you can use the faster ExpressRoute connection for traffic between Application Proxy and the connector. The connector is still on your network, close to the app.

### Pattern 3: Take advantage of ExpressRoute with private peering

If you have a dedicated VPN or ExpressRoute set up with private peering between Azure and your corporate network, you have another option. In this configuration, the virtual network in Azure is typically considered as an extension of the corporate network. So you can install the connector in the Azure datacenter, and still satisfy the low latency requirements of the connector-to-app connection.

Latency is not compromised because traffic is flowing over a dedicated connection. You also get improved Application Proxy service-to-connector latency because the connector is installed in an Azure datacenter close to your Azure AD tenant location.

![Diagram showing connector installed within an Azure datacenter](./media/application-proxy-network-topologies/application-proxy-expressroute-private.png)

### Other approaches

Although the focus of this article is connector placement, you can also change the placement of the application to get better latency characteristics.

Increasingly, organizations are moving their networks into hosted environments. This enables them to place their apps in a hosted environment that is also part of their corporate network, and still be within the domain. In this case, the patterns discussed in the preceding sections can be applied to the new application location.

Consider using [connector groups](active-directory-application-proxy-connectors.md) to target apps that are in different locations and networks. If you're considering this option, see [Azure AD Domain Services](../active-directory-domain-services/active-directory-ds-overview.md).

## Common use cases

In this section, we walk through a few common scenarios. Assume that the Azure AD tenant (and therefore proxy service endpoint) is located in the United States (US). The considerations discussed in these use cases also apply to other regions around the globe.

For these scenarios, we call each connection a "hop" and number them for easier discussion:

- **Hop 1**: User to Azure AD Application Proxy
- **Hop 2**: Azure AD Application Proxy to the connector
- **Hop 3**: Connector to target application 

### Use case 1

**Scenario:** The app is in an organization's network in the US, with users in the same region. No ExpressRoute or VPN exists between the Azure datacenter and the corporate network.

**Recommendation:** Follow pattern 1, explained in the previous section. For improved latency, consider using ExpressRoute, if needed.

This is a simple pattern. You optimize hop 3 by placing the connector near the app. This is also a natural choice, because the connector typically is installed with line of sight to the app and to the datacenter to perform KCD operations.

![Diagram showing that users, proxy, connector, and app are all in the US](./media/application-proxy-network-topologies/application-proxy-pattern1.png)

### Use case 2

**Scenario:** The app is in an organization's network in the US, with users spread out globally. No ExpressRoute or VPN exists between the Azure datacenter and the corporate network.

**Recommendation:** Follow pattern 2, explained in the previous section. 

Again, the common pattern is to optimize hop 3, where you place the connector near the app. Hop 3 is not typically expensive, if it is all within the same region. However, hop 1 can be more expensive depending on where the user is, because users across the world must access the Application Proxy instance in the US. It's worth noting that any proxy solution has similar characteristics regarding users being spread out globally.

![Diagram showing that users are spread globally, but the proxy, connector, and app are in the US](./media/application-proxy-network-topologies/application-proxy-pattern2.png)

### Use case 3

**Scenario:** The app is in an organization's network in the US. ExpressRoute with public peering exists between Azure and the corporate network.

**Recommendation:** Place the connector as close as possible to the app. The system automatically uses ExpressRoute for hop 2. This follows pattern 2, explained in the previous section.

If the ExpressRoute link is using public peering, the traffic between the proxy and the connector flows over that link. Hop 2 has optimized latency.

![Diagram showing ExpressRoute between the proxy and connector](./media/application-proxy-network-topologies/application-proxy-pattern3.png)

### Use case 4

**Scenario:** The app is in an organization's network in the US. ExpressRoute with private peering exists between Azure and the corporate network.

**Recommendation:** Place the connector in the Azure datacenter that is connected to the corporate network through ExpressRoute private peering. This follows pattern 3, explained in the previous section.

The connector can be placed in the Azure datacenter. Since the connector still has a line of sight to the application and the datacenter through the private network, hop 3 remains optimized. In addition, hop 2 is optimized further.

![Diagram showing the connector in an Azure datacenter, and ExpressRoute between the connector and app](./media/application-proxy-network-topologies/application-proxy-pattern4.png)

### Use case 5

**Scenario:** The app is in an organization's network in the EU, with the Application Proxy instance and most users in the US.

**Recommendation:** Place the connector near the app. Because US users are accessing an Application Proxy instance that happens to be in the same region, hop 1 is not too expensive. Hop 3 is optimized. Consider using ExpressRoute to optimize hop 2. 

![Diagram showing users and proxy in the US, with the connector and app in the EU](./media/application-proxy-network-topologies/application-proxy-pattern5b.png)

You can also consider using one other variant in this situation. If most users in the organization are in the US, then chances are that your network extends to the US as well. If that is the case, the connector can be placed in the US, and can use the dedicated internal corporate network line to the application in the EU. This way hops 2 and 3 are optimized.

![Diagram showing users, proxy, and connector in the US, app in the EU](./media/application-proxy-network-topologies/application-proxy-pattern5c.png)

## Next steps

- [Enable Application Proxy](active-directory-application-proxy-enable.md)
- [Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)
- [Enable conditional access](active-directory-application-proxy-conditional-access.md)
- [Troubleshoot issues you're having with Application Proxy](active-directory-application-proxy-troubleshoot.md)
