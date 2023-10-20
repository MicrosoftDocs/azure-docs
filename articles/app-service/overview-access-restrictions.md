---
title: App Service Access restrictions
description: This article provides an overview of the access restriction features in App Service
author: madsd
ms.topic: overview
ms.date: 09/01/2022
ms.author: madsd
ms.custom: UpdateFrequency3
---

# Azure App Service access restrictions

Access restrictions in App Service are equivalent to a firewall allowing you to block and filter traffic. Access restrictions apply to **inbound** access only. Most App Service pricing tiers also have the ability to add private endpoints to the app, which is another entry point to the app. Access restrictions don't apply to traffic entering through a private endpoint. For all apps hosted on App Service, the default entry point is publicly available. The only exception is apps hosted in ILB App Service Environment where the default entry point is internal to the virtual network.

## How it works

When traffic reaches App Service, it first evaluates if the traffic originates from a private endpoint or is coming through the default endpoint. If the traffic is sent through a private endpoint, it's sent directly to the site without any restrictions. Restrictions to private endpoints are configured using network security groups.

If you send traffic through the default endpoint (often a public endpoint), the traffic is first evaluated at the app access level. Here you can either enable or disable access. If you enable app access, the traffic is evaluated at the site access level. For any app, you have both the main site and the advanced tools site (also known as scm or kudu site).

You have the option of configuring a set of access restriction rules for each site. Access restriction rules are evaluated in priority order. If some rules have the same priority, they're evaluated in the order they're listed when returned from the Azure Resource Manager API and in Azure portal before sorting. You can also specify the behavior if no rules are matched. The following sections go into details.

:::image type="content" source="media/overview-access-restrictions/access-restriction-diagram.png" alt-text="Diagram of access restrictions high-level flow.":::

## App access

App access allows you to configure if access is available through the default (public) endpoint. If you've never configured the setting, the default behavior is to enable access unless a private endpoint exists after which it's implicitly disabled. You have the ability to explicitly configure this behavior to either enabled or disabled even if private endpoints exist.

:::image type="content" source="media/overview-access-restrictions/app-access-portal.png" alt-text="Screenshot of app access option in Azure portal.":::

In the Azure Resource Manager API, app access is called `publicNetworkAccess`. For ILB App Service Environment, the default entry point for apps is always internal to the virtual network. Enabling app access (`publicNetworkAccess`) doesn't grant direct public access to the web application; instead, it allows access from the default entry point, which corresponds to the internal IP address of the App Service Environment. If you disable app access on an ILB App Service Environment, you can only access the apps through private endpoints added to the individual apps.

## Site access

Site access restrictions let you filter the incoming requests. Site access restrictions allow you to build a list of allow and deny rules that are evaluated in priority order. It's similar to the network security group (NSG) feature in Azure networking.

:::image type="content" source="media/overview-access-restrictions/site-access-portal.png" alt-text="Screenshot of site access options in Azure portal.":::

Site access restriction has several types of rules that you can apply:

### Unmatched rule

You can configure the behavior when no rules are matched (the default action). It's a special rule that always appears as the last rule of the rules collection. If the setting has never been configured, the unmatched rule behavior is to allow all access unless one or more rules exists after which it's implicitly changed to deny all access. You can explicitly configure this behavior to either allow or deny access regardless of defined rules.

### IP-based access restriction rules

The IP-based access restrictions feature helps when you want to restrict the IP addresses that can be used to reach your app. Both IPv4 and IPv6 are supported. Some use cases for this feature:

* Restrict access to your app from a set of well-defined addresses. 
* Restrict access to traffic coming through an external load-balancing service or other network appliances with known egress IP addresses. 

To learn how to enable this feature, see [Configuring access restrictions](./app-service-ip-restrictions.md).

> [!NOTE]
> IP-based access restriction rules only handle virtual network address ranges when your app is in an App Service Environment. If your app is in the multi-tenant service, you need to use [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) to restrict traffic to select subnets in your virtual network.

### Access restriction rules based on service endpoints 

Service endpoints allow you to lock down *inbound* access to your app so that the source address must come from a set of subnets that you select. This feature works together with IP access restrictions. Service endpoints aren't compatible with remote debugging. If you want to use remote debugging with your app, your client can't be in a subnet that has service endpoints enabled. The process for setting service endpoints is similar to the process for setting IP access restrictions. You can build an allow/deny list of access rules that includes public addresses and subnets in your virtual networks.

> [!NOTE]
> Access restriction rules based on service endpoints are not supported on apps that have private endpoint configured or apps that use IP-based SSL ([App-assigned address](./networking-features.md#app-assigned-address)).

To learn more about configuring service endpoints with your app, see [Azure App Service access restrictions](../virtual-network/virtual-network-service-endpoints-overview.md).

#### Any service endpoint source

For testing or in specific scenarios, you may want to allow traffic from any service endpoint enabled subnet. You can do that by defining an IP-based rule with the text "AnyVnets" instead of an IP range. You can't create these rules in the portal, but you can modify an existing IP-based rule and replace the IP address with the "AnyVnets" string.

### Access restriction rules based on service tags

[Azure service tags](../virtual-network/service-tags-overview.md) are well defined sets of IP addresses for Azure services. Service tags group the IP ranges used in various Azure services and is often also further scoped to specific regions. This type of rule allows you to filter *inbound* traffic from specific Azure services. 

For a full list of tags and more information, visit the service tag link.

To learn how to enable this feature, see [Configuring access restrictions](./app-service-ip-restrictions.md).

### Multi-source rules

Multi-source rules allow you to combine up to eight IP ranges or eight Service Tags in a single rule. You might use multi-source rules if you have more than 512 IP ranges. You can also use multi-source rules if you want to create logical rules where multiple IP ranges are combined with a single http header filter.

Multi-source rules are defined the same way you define single-source rules, but with each range separated with comma.

You can't create these rules in the portal, but you can modify an existing service tag or IP-based rule and add more sources to the rule.

### Http header filtering for site access restriction rules

For any rule, regardless of type, you can add http header filtering. Http header filters allow you to further inspect the incoming request and filter based on specific http header values. Each header can have up to eight values per rule. The following lists the supported http headers:

* **X-Forwarded-For**. [Standard header](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Forwarded-For) for identifying the originating IP address of a client connecting through a proxy server. Accepts valid CIDR values.
* **X-Forwarded-Host**. [Standard header](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Forwarded-Host) for identifying the original host requested by the client. Accepts any string up to 64 characters in length.
* **X-Azure-FDID**. [Custom header](../frontdoor/front-door-http-headers-protocol.md#from-the-front-door-to-the-backend) for identifying the reverse proxy instance. Azure Front Door sends a guid identifying the instance, but it can for third party proxies be used to identify the specific instance. Accepts any string up to 64 characters in length.
* **X-FD-HealthProbe**. [Custom header](../frontdoor/front-door-http-headers-protocol.md#from-the-front-door-to-the-backend) for identifying the health probe of the reverse proxy. Azure Front Door sends "1" to uniquely identify a health probe request. The header can for third party proxies be used to identify health probes. Accepts any string up to 64 characters in length.

Some use cases for http header filtering are:
* Restrict access to traffic from proxy servers forwarding the host name
* Restrict access to a specific Azure Front Door instance with a service tag rule and X-Azure-FDID header restriction

## Advanced use cases

Combining the above features allow you to solve some specific use cases that are described in the following sections.

### Block a single IP address

If you want to deny/block one or more specific IP addresses, you can add the IP addresses as deny rules and configure the unmatched rule to allow all unmatched traffic.

### Restrict access to the advanced tools site

The advanced tools site, which is also known as scm or kudu, has an individual rules collection that you can configure. You can also configure the unmatched rule for this site. A setting allows you to use the rules configured for the main site. You can't selectively allow access to certain advanced tool site features. For example, you can't selectively allow access only to the WebJobs management console in the advanced tools site.

### Deploy through a private endpoint

You might have a site that is publicly accessible, but your deployment system is in a virtual network. You can keep the deployment traffic private by adding a private endpoint. You then need to ensure that public app access is enabled. Finally you need to set the unmatched rule for the advanced tools site to deny, which blocks all public traffic to that endpoint.

### Allow external partner access to private endpoint protected site

In this scenario, you're accessing your site through a private endpoint and are deploying through a private endpoint. You may want to temporarily invite an external partner to test the site. You can do that by enabling public app access. Add a rule (IP-based) to identify the client of the partner. Configure unmatched rules action to deny for both main and advanced tools site. 

### Restrict access to a specific Azure Front Door instance

Traffic from Azure Front Door to your application originates from a well known set of IP ranges defined in the `AzureFrontDoor.Backend` service tag. Using a service tag restriction rule, you can restrict traffic to only originate from Azure Front Door. To ensure traffic only originates from your specific instance, you need to further filter the incoming requests based on the unique http header that Azure Front Door sends called X-Azure-FDID. You can find the Front Door ID in the portal.

## Next steps
> [!NOTE]
> Access restriction rules that block public access to your site can also block services such as log streaming. If you require these, you will need to allow your App Service's IP address in your restrictions.

> [!div class="nextstepaction"]
> [How to restrict access](app-service-ip-restrictions.md)

> [!div class="nextstepaction"]
> [Private endpoints for App Service apps](./networking/private-endpoint.md)

