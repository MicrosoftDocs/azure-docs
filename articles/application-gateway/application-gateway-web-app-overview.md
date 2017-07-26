---
title: Overview of multi-tenant back-ends with Application Gateway | Microsoft Docs
description: This page provides an overview of the Application Gateway support for multi-tenant back-ends.
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: 

ms.service: application-gateway
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/26/2017
ms.author: gwallace

---

# Application Gateway support for multi tenant backends

Azure Application Gateway supports virtual machine scale set, VM NIC, any reachable public/private IP, or FQDN as part of its back-end pool. By default, Application Gateway does not change the incoming HTTP host header from the client and sends the header back as is to the back-end. There are many back-ends like Azure Web App Service and API Gateway that are multi-tenant in nature and rely on a specific host header or SNI extension to resolve to the correct endpoint where traffic should be directed. Application Gateway now supports ability for users to overwrite incoming the HTTP host header on a per back-end HTTP setting basis. This capability enables support for multi-tenant back-ends like Azure Web App Services and API Gateway. This capability is available for both the Standard and WAF SKU. Multi-tenant back-end support also works with SSL termination and end to end SSL scenarios.

![web app scenario](./media/application-gateway-web-app-overview/scenario.png)

The ability to specify a host override is defined at the HTTP settings and can be applied to any back-end pool during rule creation. Multi-tenant back-end supports the following two ways of overriding host header and SNI extension.

1. The ability to set host name to a fixed value in the HTTP setting. This capability ensures that the host header is overridden to this value for all traffic to every member of a given back-end pool where the HTTP Setting is applied. When using end to end SSL, this overridden host name is used in the SNI extension. This capability enables scenarios where a back-end pool farm expects a host header different from incoming customer host header.

2. The ability to derive the host name from the IP/FQDN of the members of a back-end pool. HTTP settings also provide an option to pick the host name from a back-end pool member's FQDN if configured with the option to derive host name from individual back-end pool member. When end to end SSL, this host name is derived from the FQDN is used in the SNI extension. This capability enables scenarios where a back-end pool can have two or more multi-tenant PaaS services like Azure Web App Services and the request's host header to each member contains the host name derived from its FQDN.

> [!NOTE]
> In both of the preceding cases the settings only affect the live traffic behavior and not the health probe behavior. Custom probes already support the ability to specify a host header. Custom probes now also support the ability to derive the host header from the back-end pool FQDN. For end to end functionality to work, both probe and HTTP settings must be modified to reflect the correct configuration.

With this capability, customers specify the options in HTTP settings and custom probes to the appropriate configuration. This setting is then tied to a listener and a back-end pool by using a Rule.

## Next steps

Learn how to set up an application gateway with a Web App as a back-end pool member by visiting: [Configure App Service Web Apps with Application Gateway](application-gateway-web-app-powershell.md)