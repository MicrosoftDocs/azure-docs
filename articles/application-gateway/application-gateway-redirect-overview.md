---
title: Redirect overview for Azure Application Gateway | Microsoft Docs
description: Learn about the redirect capability in Azure Application Gateway
services: application-gateway
documentationcenter: na
author: amsriva
manager: jpconnock
editor: ''
tags: azure-resource-manager

ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/18/2017
ms.author: amsriva

---

# Application Gateway redirect overview

A common scenario for many web applications is to support automatic HTTP to HTTPS redirection to ensure all communication between application and its users occurs over an encrypted path. In the past, customers have used techniques such as creating a dedicated backend pool whose sole purpose is to redirect requests it receives on HTTP to HTTPS.  Application gateway now supports ability to redirect traffic on the Application Gateway. This simplifies application configuration, optimizes the resource usage, and supports new redirection scenarios including global and path-based redirection. Application Gateway redirection support is not limited to HTTP -> HTTPS redirection alone. This is a generic redirection mechanism, which allows for redirection of traffic received at one listener to another listener on Application Gateway. It also supports redirection to an external site as well. Application Gateway redirection support offers the following capabilities:

1. Global redirection from one listener to another listener on the Gateway. This enables HTTP to HTTPS redirection on a site.
2. Path-based redirection. This type of redirection enables HTTP to HTTPS redirection only on a specific site area, for example a shopping cart area denoted by /cart/*.
3. Redirect to external site.

![redirect](./media/application-gateway-redirect-overview/redirect.png)

With this change, customers would need to create a new redirect configuration object, which specifies the target listener or external site to which redirection is desired. The configuration element also supports options to enable appending the URI path and query string to the redirected URL. Customers could also choose whether redirection is a temporary (HTTP status code 302) or a permanent redirect (HTTP status code 301). Once created this redirect configuration is attached to the source listener via a new rule. When using a basic rule, the redirect configuration is associated with a source listener and is a global redirect. When a path-based rule is used, the redirect configuration is defined on the URL path map and hence only applies to the specific path area of a site.

### Next steps

[Configure HTTP to HTTPS redirection on an application gateway](redirect-http-to-https-portal.md)
