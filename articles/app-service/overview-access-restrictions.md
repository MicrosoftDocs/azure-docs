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

If the setting has never been configured, the default behavior is to enable access unless a private endpoint exists after which it will be disabled. You have the ability to explicitly configure this behavior.


## Site access

## Advanced use cases

## Next steps

> [!div class="nextstepaction"]
> [How to restrict access](app-service-ip-restrictions.md)

> [!div class="nextstepaction"]
> [Private endpoints for App Service apps](./networking/private-endpoint.md)

