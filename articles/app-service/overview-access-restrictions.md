---
title: App Service Access restrictions
description: This article provides an overview of the access restriction features in App Service
author: madsd
ms.topic: overview
ms.date: 08/15/2022
ms.author: madsd
---

# Azure App Service access restrictions

Access restrictions in App Service is equivalent to a firewall allowing you to block and filter traffic. Access restrictions apply to **inbound** access only. Most App Service pricing tiers also have the ability to add private endpoints to the app, which is an additional entry point to the app. Access restrictions do not apply to traffic entering through a private endpoint. For all apps hosted on App Service, the default entry point is publicly available. The only exception is apps hosted in ILB App Service Environment where the default entry point is internal to the virtual network.

## How it works

When traffic reaches App Service, it will first evaluate if the traffic originates from a private endpoint or is coming through the default endpoint. If the traffic is sent through a private endpoint, it will be sent directly to the site without any restrictions. Restrictions to private endpoints are configured using network security groups.

If the traffic is sent through the default endpoint (often a public endpoint), the traffic is first evaluated at the site access level. Here you can either enable or disable access. If site access is enabled, the traffic will be evaluated at the app access level. For any app, you will have both the main site and the advanced tools site (also known as scm or kudu site). You have the option of configuring a set of access restriction rules for each site. You can also specify the behavior if no rules are matched. The following sections will go into details. 

:::image type="content" source="media/overview-access-restrictions/access-restriction-diagram.png" alt-text="Diagram of access restrictions high-level flow":::

## App access

App access allows you to configure if access is available thought the default (public) endpoint. If the setting has never been configured, the default behavior is to enable access unless a private endpoint exists after which it will be implicitly disabled. You have the ability to explicitly configure this behavior to either enabled or disabled even if private endpoints exist.

## Site access

Site access restrictions let you filter the incoming requests. Site access restrictions allows you to build a list of allow and deny rules that are evaluated in priority order. It's similar to the network security group (NSG) feature in Azure networking. You can also configure the behavior when no rules are matched (the default action). If the setting has never been configured, the unmatched rule behavior is to allow all access unless one or more rules exists after which it will be implicitly changed to deny all access. You can explicitly configure this behavior to either allow or deny access regardless of defined rules.

Site access restriction has several types of rules that you can apply: 

### IP-based restriction rules

The IP-based access restrictions feature helps when you want to restrict the IP addresses that can be used to reach your app. Both IPv4 and IPv6 are supported. Some use cases for this feature:
* Restrict access to your app from a set of well-defined addresses. 
* Restrict access to traffic coming through an external load-balancing service or other network appliances with known egress IP addresses. 

To learn how to enable this feature, see [Configuring access restrictions][iprestrictions].

> [!NOTE]
> IP-based access restriction rules only handle virtual network address ranges when your app is in an App Service Environment. If your app is in the multi-tenant service, you need to use [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) to restrict traffic to select subnets in your virtual network.

### Restriction rules based on service endpoints 

Service endpoints allow you to lock down *inbound* access to your app so that the source address must come from a set of subnets that you select. This feature works together with IP access restrictions. Service endpoints aren't compatible with remote debugging. If you want to use remote debugging with your app, your client can't be in a subnet that has service endpoints enabled. The process for setting service endpoints is similar to the process for setting IP access restrictions. You can build an allow/deny list of access rules that includes public addresses and subnets in your virtual networks.

> [!NOTE]
> Access restriction rules based on service endpoints are not supported on apps that use IP-based SSL ([App-assigned address](#app-assigned-address)).

Some use cases for this feature:

* Set up an application gateway with your app to lock down inbound traffic to your app.
* Restrict access to your app to resources in your virtual network. These resources can include VMs, ASEs, or even other apps that use virtual network integration. 

![Diagram that illustrates the use of service endpoints with Application Gateway.](media/networking-features/service-endpoints-appgw.png)

To learn more about configuring service endpoints with your app, see [Azure App Service access restrictions][serviceendpoints].

### Restriction rules based on service tags

[Azure service tags][servicetags] are well defined sets of IP addresses for Azure services. Service tags group the IP ranges used in various Azure services and is often also further scoped to specific regions. This allows you to filter *inbound* traffic from specific Azure services. 

For a full list of tags and more information, visit the service tag link above. 
To learn how to enable this feature, see [Configuring access restrictions][iprestrictions].

#### Http header filtering for site access restriction rules

For each rule, you can add additional http header filtering. This allows you to further inspect the incoming request and filter based on specific http header values. Each header can have up to eight values per rule. The following list of http headers is currently supported: 
* X-Forwarded-For
* X-Forwarded-Host
* X-Azure-FDID
* X-FD-HealthProbe

Some use cases for http header filtering are:
* Restrict access to traffic from proxy servers forwarding the host name
* Restrict access to a specific Azure Front Door instance with a service tag rule and X-Azure-FDID header restriction

## Advanced use cases

## Next steps

> [!div class="nextstepaction"]
> [How to restrict access](app-service-ip-restrictions.md)

> [!div class="nextstepaction"]
> [Private endpoints for App Service apps](./networking/private-endpoint.md)

