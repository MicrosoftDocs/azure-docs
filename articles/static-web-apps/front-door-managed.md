---
title: Enable enterprise-grade edge with Azure Front Door
description: Learn about managed Azure Front Door integration with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 11/15/2021
ms.author: cshoe
---

# Enable an enterprise-grade CDN using Azure Front Door in Azure Static Web Apps

Use Azure Front Door to provide faster load times, better security, and enable better performance in your static web app. Azure Front Door increases the points of presence and extends your static web app with an enterprise-grade edge to provide:

* Protection from [Distributed Denial of Service (DDoS) attacks](https://docs.microsoft.com/azure/frontdoor/front-door-ddos)
* Significant reductions in latency
* Increased throughput by bringing static assets geographically closer to your users through [edge load balancing](https://docs.microsoft.com/azure/frontdoor/edge-locations-by-region)
* SSL offloading
* [Enhanced caching](https://docs.microsoft.com/azure/frontdoor/front-door-caching)
* Application acceleration

To enable Azure Front Door in Static Web Apps, you must have the following items in place:

* A custom domain configured for your static web app.
* DNS TTL set for less than 48 hours.

## Caching

When Azure Front Door is enabled in for your static web app, your app is cached at various levels.

* **CDN**: Caching files on edge locations as physically close to users a possible.
* **DNS**: Returning cached results of identical requests on from the DNS server.
* **Browser**: Files are stored in the browser and returned for identical requests.

For further control, you also have the option to create [custom cache control headers](configuration.md) for your static web app.

## Configuration types

You can configure Azure Front Door via a managed experience through the Azure portal, or you [can set it up manually](front-door-manual.md).

A managed experience provides:

* Zero configuration changes
* No downtime
* Automatically managed SSL certifications and custom domains

A manual setup gives you full control over the CDN configuration including the chance to:

* Limit traffic origin by origin
* Add a web application firewall
* Use more advanced features of Azure Front Door

## Enable Azure Front Door

### Prerequisites

* Custom domain configured for your static web app
* Apex domain with TTL set to less than 48 hrs

# [Azure portal](tab/azure-portal)

1. Navigate to your static web app in the Azure portal.

1. Select **Enterprise-grade edge** in the left menu.

1. Check the box labeled **Enable enterprise-grade CDN**.

1. Select **Save**.

1. Select **OK** to confirm the save.

    Enabling this feature may result in additional costs.

# [Azure CLI](tab/azure-portal)

```azurecli
az extension add --yes --source "https://sstrawnwheels.blob.core.windows.net/wheels/enterprise_edge-0.1.0-py3-none-any.whl"
```

---

This feature is enabled only in EUAP