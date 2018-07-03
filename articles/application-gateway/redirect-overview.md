---
title: Redirect overview for Azure Application Gateway
description: Learn about the redirect capability in Azure Application Gateway
services: application-gateway
documentationcenter: na
author: amsriva
manager: jpconnock
tags: azure-resource-manager

ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 3/19/2018
ms.author: amsriva

---

# Application Gateway redirect overview

A common scenario for many web applications is to support automatic HTTP to HTTPS redirection to ensure all communication between application and its users occurs over an encrypted path. In the past, customers have used techniques such as creating a dedicated backend pool whose sole purpose is to redirect requests it receives on HTTP to HTTPS.

Application Gateway now supports the ability to redirect traffic on the gateway. This simplifies application configuration, optimizes the resource usage, and supports new redirection scenarios including global and path-based redirection. Application Gateway redirection support is not limited to HTTP -> HTTPS redirection alone. It has a generic redirection mechanism, which allows for traffic redirection received at one listener to another listener on Application Gateway. External site redirection is also supported.

Application Gateway redirection support offers the following capabilities:

-  **Global redirection**

   Redirects from one listener to another listener on the gateway. This enables HTTP to HTTPS redirection on a site.
- **Path-based redirection**

   This type of redirection enables HTTP to HTTPS redirection only on a specific site area, for example a shopping cart area denoted by /cart/*.
- **Redirect to external site**

![redirect](./media/redirect-overview/redirect.png)

With this change, customers need to create a new redirect configuration object, which specifies the target listener or external site to which redirection is desired. The configuration element also supports options to enable appending the URI path and query string to the redirected URL. You can also choose whether redirection is a temporary (HTTP status code 302) or a permanent redirect (HTTP status code 301). Once created, this redirect configuration is attached to the source listener via a new rule. When using a basic rule, the redirect configuration is associated with a source listener and is a global redirect. When a path-based rule is used, the redirect configuration is defined on the URL path map. So it only applies to the specific path area of a site.

### Next steps

[Configure URL redirection on an application gateway](tutorial-url-redirect-powershell.md)
