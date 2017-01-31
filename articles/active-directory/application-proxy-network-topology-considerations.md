---
title: Network topology considerations when using Azure AD Application Proxy | Microsoft Docs
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
ms.date: 01/12/2017
ms.author: kgremban

---

# Network topology considerations when using Azure AD Application Proxy
> [!NOTE]
> Application Proxy is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).
> 

This article explains network topology considerations when using Azure AD Application Proxy for publishing and accessing your applications remotely. 

## Traffic flow

When an application is published through Azure AD App Proxy, all traffic from the users to the target backend applications flows through the following hops:

* Hop 1: User to Azure AD App Proxy service’s public endpoint on Azure
* Hop 2: App proxy service to the connector
* Hop 3: Connector to target application

 ![AzureAD Iaas Multiple Cloud Vendors](./media/application-proxy-network-topologies/application-proxy-three-hops.png)

## Tenant location and App Proxy service

When you sign up for an Azure AD tenant, the region of your tenant (US, EMEA, APAC, etc.) is determined based on the country you specify. When you enable App proxy, the App Proxy service instances for your tenant are displayed in the same region as your Azure AD tenant, or the closest region to it. 

For example, if your Azure AD Tenant’s region is European Union (EU), all of your Azure AD App Proxy connectors will be connected to the App Proxy service instances in Azure data centers in EU. This also means that all of your users will go through the App Proxy service instances in this location, when trying to access published applications.

## Considerations for reducing latency

All proxy solutions will introduce latency into your network connection. No matter which proxy or VPN solution that you choose as your remote access solution, it will always include a set of servers enabling the connection to inside your corporate network. 

Corporations have typically included server endpoints in their network's demilitarized zone (DMZ). But with Azure AD App Proxy, no DMZ is required.  This is because with App Proxy traffic flows through the proxy service in the cloud, while the connectors reside on your corporate network.

### Connector placement

App Proxy service chooses the location of instances for you, based on your tenant location. Therefore, you get to decide where to install the connector, giving you the power to define the end-to-end latency characteristics of your network traffic.

When settingup the App Proxy service, here are some questions you should ask:

* Where is the app located?
* Where are the majority of users accessing the app located?
* Where is the App Proxy instance located (this is based on your tenant)?
* Do you already have a dedicated network connection to Azure Data Centers (such as Express Route or a similar VPN set up)?

The placement of the connector will determine the latency of hop #2 and hop #3. When evaluating the placement of the Connector you should consider the following:

* The connector needs a line-of-sight to a data center to perform Kerberos constrained delegation (KCD) operations, when you want single sign-on (SSO) to backend applications.
* The connector is typically installed closer to the application, to reduce time from the connector to the application.

### General approach to minimize latency

You can try and minimize the latency of the end-to-end traffic by optimizing each of the network hops, so that the traffic flows over.

Each hop can be optimized by:

* Reducing the distance between the two ends of the hop.
* Choosing the right network to traverse. For example, traversing a private network rather than the public Internet may be faster, due to dedicated links.
 
If you have a dedicated VPN/Express Route link between Azure and your corporate network, you may want to leverage that.

## Focus your optimizing strategy

Because your users may access apps remotely over the Internet, you should always focus on optimizing hops 2 and 3. Below are some of the common patterns you can incorporate.

### Pattern #1: Optimize hop #3:

To optimize hop 3, the connector is placed close to the target application in the customer network. The advantage with doing this is that the connector is likely to need line-of-sight to the Domain Controller, as mentioned above. This approach is usually enough for most customers and scenarios. Most of our customers follow this pattern.

 ![AzureAD Iaas Multiple Cloud Vendors](./media/application-proxy-network-topologies/application-proxy-hop3.png)


> [!NOTE]
There are some scenarios where you will need to optimize both hop #2 and hop #3 to get the latency characteristics you want. For example, if you have a VPN or ExpressRoute setup between your network and the Azure datacenter, this scenario allows you to optimize hop #2, in addition to hop #3.
>

### Pattern #2: Take advantage of ExpressRoute with public peering

If you have an ExpressRoute setup with public peering, then we will leverage the faster ExpressRoute connection for hop #2. Hop #3 is already optimized, by placing the connector close to the app in the customer network.

![AzureAD Iaas Multiple Cloud Vendors](./media/application-proxy-network-topologies/application-proxy-expressroute-public.png)

### Pattern #3: Taking advantage ExpressRoute with private peering

If you have a dedicated VPN or ExpressRoute setup with private peering between Azure and your corporate network that the app is installed, you have another option. In this configuration, the virtual network in Azure is typically considered as extension of the corporate network. So you can install the connector in the Azure datacenter, and still satisfy the low latency requirements of the connector-to-app connection for hop #3. 

Latency is not compromised because traffic is flowing over a dedicated connection. However, you get the added benefit of improving the latency characteristics of hop #2. This is because the Proxy service-to-connector connection (hop #2) is a shorter hop, as the connector is installed in an Azure datacenter close to your AAD tenant (and therefore App Proxy) location.

![AzureAD Iaas Multiple Cloud Vendors](./media/application-proxy-network-topologies/application-proxy-expressroute-private.png)

### Other approaches

The focus on this article so far has been on connector placement. However,  if moving the application is an option for you (for example, to Azure or another hosted environment), then the application’s placement can be changed to get better latency characteristics. 

Increasingly, organizations are moving their networks into hosted environments. This enables them to place their apps in the hosted environment that is also part of their corporate network, and still be within the domain. In this case, the above patterns can be applied to the new application location.

Consider using connector groups to target apps that are in different locations and networks. If you're considering this option, see [Azure AD Domain Services](https://azure.microsoft.com/en-us/services/active-directory-ds). 

## Common scenarios

In this section, we walk through a few use cases. For all the use cases below, assume that the Azure AD tenant (and therefore proxy service endpoint) is in the U.S. In other regions around the globe, the same considerations will usually apply.

### Use Case 1

The app is in a customer's network in the U.S. with users in the same region. No ExpressRoute or VPN exists between and Azure DC and the corporate network.

**Recommendation:** Follow use case #1 above. For improved latency, consider leveraging ExpressRoute, if needed <see use case #3 and #4>.

This is a simple pattern. The most common pattern is to optimize hop #3, where the connector is placed near the app. This is also a natural choice, because the connector typically is installed with line of sight to the app and to the DC to perform KCD operations.
This use case follows the pattern #1 below.

![AzureAD Iaas Multiple Cloud Vendors](./media/application-proxy-network-topologies/application-proxy-pattern1.png)

### Use Case 2

The app is in a customer's network in the U.S. with users spread out globally. No ExpressRoute or VPN exists between and Azure DC and the corporate network.

**Recommendation:** Follow use case #2 above. For improved latency, consider leveraging ExpressRoute, if needed (see use case #3 and #4).

Again, the common pattern is to optimize hop #3 where the connector is placed near the app for reasons covered above. Hop #3 is not typically expensive, if it is all within the same region. However, hop #1 can be more expensive depending on where the user is, because all users will access the App Proxy instance in the U.S. It's worth noting that any proxy solution will have similar characteristics here with respect to users being spread out globally.

This use case follows the pattern #2 below.

![AzureAD Iaas Multiple Cloud Vendors](./media/application-proxy-network-topologies/application-proxy-pattern2.png)

### Use Case 3

The app is in a customer's network in the U.S. ExpressRoute with public peering exists between Azure and the corporate network.

**Recommendation:** Place the connector as close as possible to the app. The system will automatically use ExpressRoute for hop #2. This follows pattern #2 described above.

If the ExpressRoute link is using public peering, then the traffic between the proxy and the connector will flow over that link, and hop #2 will have optimized latency.

This use case follows the pattern #3 below.

![AzureAD Iaas Multiple Cloud Vendors](./media/application-proxy-network-topologies/application-proxy-pattern3.png)

### Use Case 4

The app is in a customer's network in the US. ExpressRoute with private peering exists between Azure and the corporate network.

**Recommendation:** Place the connector in the Azure DC that is connected to the corporate network through ExpressRoute private peering. This follows pattern #3 described above.

The connector can be placed in the Azure DC. Since it still has a line-of-sight to the application and the DC through the private network, hop #3 remains optimized. However, this setup additionally optimizes hop #2 further.

This use case follows the pattern #4 below.

![AzureAD Iaas Multiple Cloud Vendors](./media/application-proxy-network-topologies/application-proxy-pattern4.png)

### Use Case 5

The app is in a customer's network in the E.U. with most users in the US.

**Recommendation:** Place the connector near the app. For the reasons covered above, this is the best choice. Since U.S. users are accessing an App Proxy instance that happens to be in the same region, Hop #1 is not too expensive. Hop #3 is optimized. However, Hop #2 is typically expensive in this use case.

This use case follows the pattern #5a below.

![AzureAD Iaas Multiple Cloud Vendors](./media/application-proxy-network-topologies/application-proxy-pattern5a.png)

Consider leveraging ExpressRoute as called out in patterns #2 and #3 above. Below I show pattern #2 applied.

This use case follows the pattern #5b below.

![AzureAD Iaas Multiple Cloud Vendors](./media/application-proxy-network-topologies/application-proxy-pattern5b.png)

One other variant to this use-case that you can consider employing is below.

If most users in the organization are in the US, then chances are that your network ‘extends’ to the US as well. If that is the case, the connector can be placed in the US and can leverage the dedicated internal corporate network line to the application in the EU. This way hop #2 and hop #3 are optimized.

This use case follows the pattern #5c below.

![AzureAD Iaas Multiple Cloud Vendors](./media/application-proxy-network-topologies/application-proxy-pattern5c.png)

## Next steps
[Enable Application Proxy](active-directory-application-proxy-enable.md)<br>
[Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)<br>
[Enable conditional access](active-directory-application-proxy-conditional-access.md)<br>
[Troubleshoot issues you're having with Application Proxy](active-directory-application-proxy-troubleshoot.md)


