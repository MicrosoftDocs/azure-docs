---
title: Point an Internet domain to Traffic Manager - Azure Traffic Manager
description: This article will help you point your company domain name to a Traffic Manager domain name.
services: traffic-manager
author: greg-lindsay
ms.service: traffic-manager
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 04/27/2023
ms.author: greglin
ms.custom: template-how-to
---

# Point a company Internet domain to an Azure Traffic Manager domain

When you create a Traffic Manager profile, Azure automatically assigns a DNS name for that profile. To use a name from your DNS zone, create a CNAME DNS record that maps to the domain name of your Traffic Manager profile. You can find the Traffic Manager domain name in the **General** section on the Configuration page of the Traffic Manager profile.

For example, to point name `www.contoso.com` to the Traffic Manager DNS name `contoso.trafficmanager.net`, you create the following DNS resource record:

`www.contoso.com IN CNAME contoso.trafficmanager.net.`

All traffic requests to *www\.contoso.com* get directed to *contoso.trafficmanager.net*.

> [!IMPORTANT]
> You cannot point a second-level domain, such as *contoso.com*, to the Traffic Manager domain. DNS protocol standards do not allow CNAME records for second-level domain names.

## Next steps

* [Traffic Manager routing methods](traffic-manager-routing-methods.md)
* [Traffic Manager - Disable, enable or delete a profile](./traffic-manager-manage-profiles.md)
* [Traffic Manager - Disable or enable an endpoint](./traffic-manager-manage-endpoints.md)