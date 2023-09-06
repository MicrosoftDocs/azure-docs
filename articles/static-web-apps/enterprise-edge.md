---
title: Enterprise-grade edge in Azure Static Web Apps
description: Learn about Azure Static Web Apps enterprise-grade edge
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 01/11/2021
ms.author: cshoe
---

# Enterprise-grade edge

Use Azure Static Web Apps enterprise-grade edge to enable faster page loads, enhance security, and optimize reliability for your global applications. Enterprise edge combines the capabilities of Azure Static Web Apps, Azure Front Door, and Azure Content Delivery Network (CDN) into a single secure cloud CDN platform.

Key features of Azure Static Web Apps enterprise-grade edge include:

* Global presence in 118+ [edge locations](../frontdoor/edge-locations-by-region.md) across 100 metro cities.

* Caching assets at the [edge](../frontdoor/front-door-caching.md).

* Proactive protection against [Distributed Denial of Service (DDoS) attacks](../frontdoor/front-door-ddos.md).

* Native support of end-to-end IPv6 connectivity and [HTTP/2 protocol](../frontdoor/front-door-http2.md).

* Optimized file compression.

## Caching

When enterprise-grade edge is enabled for your static web app, you benefit from caching at various levels.

* **CDN**: Caching content on edge locations as physically close to users a possible to reduce latency.

* **DNS**: Caching DNS records for faster lookups.

* **Browser**: Files are stored in the browser and returned for identical requests.

For further control, you can also create [custom cache control headers](configuration.md) for your static web app.

## Configuration types

You can enable enterprise-grade edge powered by Azure Front Door via a managed experience through the Azure portal, or you [can set it up manually](front-door-manual.md?pivots=swa-afd-manual-afd).

A managed experience provides:

* Zero configuration changes
* No downtime
* Automatically managed SSL certifications and custom domains

A manual setup gives you full control over the CDN configuration including the chance to:

* Limit traffic origin by origin
* Add a web application firewall
* Use more advanced features of Azure Front Door

## Enable enterprise-grade edge

### Prerequisites

* [Custom domain](./custom-domain.md) configured for your static web app with a time to live (TTL) set to less than 48 hrs.
* An application deployed with [Azure Static Web Apps](./get-started-portal.md) that uses the Standard hosting plan.

# [Azure portal](#tab/azure-portal)

1. Go to your static web app in the Azure portal.

1. Select **Enterprise-grade edge** in the left menu.

1. Check the box labeled **Enable enterprise-grade edge**.

1. Select **Save**.

1. Select **OK** to confirm the save.

    Enabling this feature incurs extra costs.

# [Azure CLI](#tab/azure-cli)

```azurecli

az extension add -n enterprise-edge

az staticwebapp enterprise-edge enable -n my-static-webapp -g my-resource-group
```

---

## Limitations

- Private Endpoint can't be used with enterprise-grade edge. 

## Next steps

> [!div class="nextstepaction"]
> [Application configuration](configuration.md)
