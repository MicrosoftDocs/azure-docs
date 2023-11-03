---
title: Network topology considerations for Microsoft Entra application proxy
description: Covers network topology considerations when using Microsoft Entra application proxy.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: conceptual
ms.date: 09/14/2023
ms.author: kenwith
ms.reviewer: ashishj
---

# Optimize traffic flow with Microsoft Entra application proxy

This article explains how to optimize traffic flow and network topology considerations when using Microsoft Entra application proxy for publishing and accessing your applications remotely.

## Traffic flow

When an application is published through Microsoft Entra application proxy, traffic from the users to the applications flows through three connections:

1. The user connects to the Microsoft Entra application proxy service public endpoint on Azure
1. The Application Proxy connector connects to the Application Proxy service (outbound)
1. The Application Proxy connector connects to the target application

:::image type="content" source="./media/application-proxy-network-topology/application-proxy-three-hops.png" alt-text="Diagram showing traffic flow from user to target application." lightbox="./media/application-proxy-network-topology/application-proxy-three-hops.png":::

## Optimize connector groups to use closest Application Proxy cloud service

When you sign up for a Microsoft Entra tenant, the region of your tenant is determined by the country/region you specify. When you enable Application Proxy, the **default** Application Proxy cloud service instances for your tenant are chosen in the same region as your Microsoft Entra tenant, or the closest region to it.

For example, if your Microsoft Entra tenant's country or region is the United Kingdom, all your Application Proxy connectors at **default** will be assigned to use service instances in European data centers. When your users access published applications, their traffic goes through the Application Proxy cloud service instances in this location.

If you have connectors installed in regions different from your default region, it may be beneficial to change which region your connector group is optimized for to improve performance accessing these applications. Once a region is specified for a connector group it will connect to Application Proxy cloud services in the designated region.

In order to optimize the traffic flow and reduce latency to a connector group assign the connector group to the closest region. To assign a region:

> [!IMPORTANT]
> Connectors must be using at least version 1.5.1975.0 to use this capability.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Application Administrator](../roles/permissions-reference.md#application-administrator).
1. Select your username in the upper-right corner. Verify you're signed in to a directory that uses Application Proxy. If you need to change directories, select **Switch directory** and choose a directory that uses Application Proxy.
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Application proxy**.
1. Select **New Connector Group**, provide a **Name** for the connector group.
1. Next, under **Advanced Settings** and select the drop-down under Optimize for a specific region and select the region closest to the connectors.
1. Select **Create**.
    
    :::image type="content" source="./media/application-proxy-network-topology/geo-routing.png" alt-text="Configure a new connector group." lightbox="./media/application-proxy-network-topology/geo-routing.png":::

1. Once the new connector group is created, you can select which connectors to assign to this connector group. 
   - You can only move connectors to your connector group if it is in a connector group using the default region. The best approach is to always start with your connectors placed in the “Default group” and then move it to the appropriate connector group.
   - You can only change the region of a connector group if there are **no** connectors assigned to it or apps assigned to it.
1. Next assign the connector group to your applications. When accessing the apps, traffic should now go to the Application Proxy cloud service in the region the connector group is optimized for.

## Considerations for reducing latency

All proxy solutions introduce latency into your network connection. No matter which proxy or VPN solution you choose as your remote access solution, it always includes a set of servers enabling the connection to inside your corporate network.

Organizations typically include server endpoints in their perimeter network. With Microsoft Entra application proxy, however, traffic flows through the proxy service in the cloud while the connectors reside on your corporate network. No perimeter network is required.

The next sections contain additional suggestions to help you reduce latency even further. 

### Connector placement

Application Proxy chooses the location of instances for you, based on your tenant location. However, you get to decide where to install the connector, giving you the power to define the latency characteristics of your network traffic.

When setting up the Application Proxy service, ask the following questions:

- Where is the app located?
- Where are most users who access the app located?
- Where is the Application Proxy instance located?
- Do you already have a dedicated network connection to Azure datacenters set up, like Azure ExpressRoute or a similar VPN?

The connector has to communicate with both Azure and your applications (steps 2 and 3 in the Traffic flow diagram), so the placement of the connector affects the latency of those two connections. When evaluating the placement of the connector, keep in mind the following points:

- If you want to use Kerberos constrained delegation (KCD) for single sign-on, then the connector needs a line of sight to a datacenter. Additionally, the connector server needs to be domain joined.  
- When in doubt, install the connector closer to the application.

### General approach to minimize latency

You can minimize the latency of the end-to-end traffic by optimizing each network connection. Each connection can be optimized by:

- Reducing the distance between the two ends of the hop.
- Choosing the right network to traverse. For example, traversing a private network rather than the public Internet may be faster, due to dedicated links.

If you have a dedicated VPN or ExpressRoute link between Azure and your corporate network, you may want to use that.

## Focus your optimization strategy

There's little that you can do to control the connection between your users and the Application Proxy service. Users may access your apps from a home network, a coffee shop, or a different country/region. Instead, you can optimize the connections from the Application Proxy service to the Application Proxy connectors to the apps. Consider incorporating the following patterns in your environment.

### Pattern 1: Put the connector close to the application

Place the connector close to the target application in the customer network. This configuration minimizes step 3 in the topography diagram, because the connector and application are close.

If your connector needs a line of sight to the domain controller, then this pattern is advantageous. Most of our customers use this pattern, because it works well for most scenarios. This pattern can also be combined with pattern 2 to optimize traffic between the service and the connector.

### Pattern 2: Take advantage of ExpressRoute with Microsoft peering

If you have ExpressRoute set up with Microsoft peering, you can use the faster ExpressRoute connection for traffic between Application Proxy and the connector. The connector is still on your network, close to the app.

### Pattern 3: Take advantage of ExpressRoute with private peering

If you have a dedicated VPN or ExpressRoute set up with private peering between Azure and your corporate network, you have another option. In this configuration, the virtual network in Azure is typically considered as an extension of the corporate network. So you can install the connector in the Azure datacenter, and still satisfy the low latency requirements of the connector-to-app connection.

Latency is not compromised because traffic is flowing over a dedicated connection. You also get improved Application Proxy service-to-connector latency because the connector is installed in an Azure datacenter close to your Microsoft Entra tenant location.

:::image type="content" source="./media/application-proxy-network-topology/application-proxy-expressroute-private.png" alt-text="Diagram showing connector installed within an Azure datacenter" lightbox="./media/application-proxy-network-topology/application-proxy-expressroute-private.png":::

### Other approaches

Although the focus of this article is connector placement, you can also change the placement of the application to get better latency characteristics.

Increasingly, organizations are moving their networks into hosted environments. This enables them to place their apps in a hosted environment that is also part of their corporate network, and still be within the domain. In this case, the patterns discussed in the preceding sections can be applied to the new application location. If you're considering this option, see [Microsoft Entra Domain Services](/entra/identity/domain-services/overview).

Additionally, consider organizing your connectors using [connector groups](application-proxy-connector-groups.md) to target apps that are in different locations and networks.

## Common use cases

In this section, we walk through a few common scenarios. Assume that the Microsoft Entra tenant (and therefore proxy service endpoint) is located in the United States (US). The considerations discussed in these use cases also apply to other regions around the globe.

For these scenarios, we call each connection a "hop" and number them for easier discussion:

- **Hop 1**: User to the Application Proxy service
- **Hop 2**: Application Proxy service to the Application Proxy connector
- **Hop 3**: Application Proxy connector to the target application 

### Use case 1

**Scenario:** The app is in an organization's network in the US, with users in the same region. No ExpressRoute or VPN exists between the Azure datacenter and the corporate network.

**Recommendation:** Follow pattern 1, explained in the previous section. For improved latency, consider using ExpressRoute, if needed.

This is a simple pattern. You optimize hop 3 by placing the connector near the app. This is also a natural choice, because the connector typically is installed with line of sight to the app and to the datacenter to perform KCD operations.

:::image type="content" source="./media/application-proxy-network-topology/application-proxy-pattern1.png" alt-text="Diagram that shows users, proxy, connector, and app are all in the US." lightbox="./media/application-proxy-network-topology/application-proxy-pattern1.png":::

### Use case 2

**Scenario:** The app is in an organization's network in the US, with users spread out globally. No ExpressRoute or VPN exists between the Azure datacenter and the corporate network.

**Recommendation:** Follow pattern 1, explained in the previous section.

Again, the common pattern is to optimize hop 3, where you place the connector near the app. Hop 3 is not typically expensive, if it is all within the same region. However, hop 1 can be more expensive depending on where the user is, because users across the world must access the Application Proxy instance in the US. It's worth noting that any proxy solution has similar characteristics regarding users being spread out globally.

:::image type="content" source="./media/application-proxy-network-topology/application-proxy-pattern2.png" alt-text="Users are spread globally, but everything else is in the US" lightbox="./media/application-proxy-network-topology/application-proxy-pattern2.png":::

### Use case 3

**Scenario:** The app is in an organization's network in the US. ExpressRoute with Microsoft peering exists between Azure and the corporate network.

**Recommendation:** Follow patterns 1 and 2, explained in the previous section.

First, place the connector as close as possible to the app. Then, the system automatically uses ExpressRoute for hop 2.

If the ExpressRoute link is using Microsoft peering, the traffic between the proxy and the connector flows over that link. Hop 2 has optimized latency.

:::image type="content" source="./media/application-proxy-network-topology/application-proxy-pattern3.png" alt-text="Diagram showing ExpressRoute between the proxy and connector" lightbox="./media/application-proxy-network-topology/application-proxy-pattern3.png":::

### Use case 4

**Scenario:** The app is in an organization's network in the US. ExpressRoute with private peering exists between Azure and the corporate network.

**Recommendation:** Follow pattern 3, explained in the previous section.

Place the connector in the Azure datacenter that is connected to the corporate network through ExpressRoute private peering.

The connector can be placed in the Azure datacenter. Since the connector still has a line of sight to the application and the datacenter through the private network, hop 3 remains optimized. In addition, hop 2 is optimized further.

:::image type="content" source="./media/application-proxy-network-topology/application-proxy-pattern4.png" alt-text="Connector in Azure datacenter, ExpressRoute between connector and app" lightbox="./media/application-proxy-network-topology/application-proxy-pattern4.png":::

### Use case 5

**Scenario:** The app is in an organization's network in Europe, default tenant region is US, with most users in the Europe.

**Recommendation:** Place the connector near the app. Update the connector group so it is optimized to use Europe Application Proxy service instances. For steps see, [Optimize connector groups to use closest Application Proxy cloud service](application-proxy-network-topology.md#optimize-connector-groups-to-use-closest-application-proxy-cloud-service).

Because Europe users are accessing an Application Proxy instance that happens to be in the same region, hop 1 is not expensive. Hop 3 is optimized. Consider using ExpressRoute to optimize hop 2.

### Use case 6

**Scenario:** The app is in an organization's network in Europe, default tenant region is US, with most users in the US.

**Recommendation:** Place the connector near the app. Update the connector group so it is optimized to use Europe Application Proxy service instances. For steps see, [Optimize connector groups to use closest Application Proxy cloud service](application-proxy-network-topology.md#optimize-connector-groups-to-use-closest-application-proxy-cloud-service). Hop 1 can be more expensive since all US users must access the Application Proxy instance in Europe.

You can also consider using one other variant in this situation. If most users in the organization are in the US, then chances are that your network extends to the US as well. Place the connector in the US, continue to use the default US region for your connector groups, and use the dedicated internal corporate network line to the application in Europe. This way hops 2 and 3 are optimized.

:::image type="content" source="./media/application-proxy-network-topology/application-proxy-pattern5c.png" alt-text="Diagram shows users, proxy, and connector in the US, app in Europe." lightbox="./media/application-proxy-network-topology/application-proxy-pattern5c.png":::

## Next steps

- [Enable Application Proxy](application-proxy-add-on-premises-application.md)
- [Enable single-sign on](application-proxy-configure-single-sign-on-with-kcd.md)
- [Enable Conditional Access](./application-proxy-integrate-with-sharepoint-server.md)
- [Troubleshoot issues you're having with Application Proxy](application-proxy-troubleshoot.md)
