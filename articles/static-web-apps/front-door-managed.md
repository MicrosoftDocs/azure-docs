---
title: Enable enterprise-grade edge with Azure Front Door
description: Learn about managed Azure Front Door integration with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 10/20/2021
ms.author: cshoe
---

# Enable an enterprise-grade CDN using Azure Front Door in Azure Static Web Apps

Enterprise-grade edge 

Extend this Static Web App with enterprise-grade edge powered by Azure Front Door. This seamless integration will protect your applications from Distributed Denial of Service (DDoS) attacks, significantly reduce latency and increase throughput for your global users with edge load balancing, SSL offload and application acceleration. 

 

prerequisites: 

custom domain configured 

apex domain TTL < 48hrs https://www.nslookup.io/blog/what-is-a-good-ttl-for-dns/ 

Why 

Improve page load times by bringing your app assets closer to your users; more points of presence https://docs.microsoft.com/en-us/azure/frontdoor/edge-locations-by-region  

Better security: protect your application against DDoS https://docs.microsoft.com/en-us/azure/frontdoor/front-door-ddos 

Enhanced caching https://docs.microsoft.com/en-us/azure/frontdoor/front-door-caching 

(⚠️ requires further thought) Managed vs bring your own azure front door 

 

Managed: zero config, no downtime, certs and custom domain are managed by static web apps; smart defaults   

 

Bring your own front door: 	 

you need to manage the azure front door instance, configure static web apps to limit traffic origin 

you can add WAF and use more advanced features of AFD  

 

(⚠️ engineering still working on the default strategy) Custom caching configuration on static web apps 

browser - caching files at the browser level 

CDN - caching files on edge locations close to your usrs 

dns - caching 

With static web apps by default, you get this strategy <insert strategy here> 

You can also configure caching by setting up cache control headers in static web apps config. 

how to set it up 

using the portal check box in the Enterprise-grade edge 

# [Azure Portal](tab/azure-portal)

1. Navigate to your static web app in the the Azure portal
1. Enterprise-grade edge
1. Enable enterprise-grade CDN
1. Save
1. OK

# [Azure Portal](tab/azure-portal)

```azurecli
az extension add --yes --source "https://sstrawnwheels.blob.core.windows.net/wheels/enterprise_edge-0.1.0-py3-none-any.whl"
```

---

this feature is enabled only in EUAP


