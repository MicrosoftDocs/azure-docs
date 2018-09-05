---
title: Overview of multi-tenant back ends with Azure Application Gateway
description: This page provides an overview of the Application Gateway support for multi-tenant back ends.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.date: 8/1/2018
ms.author: victorh

---

# Application Gateway support for multi-tenant back ends

Azure Application Gateway supports virtual machine scale sets, network interfaces, public/private IP, or fully qualified domain name (FQDN) as part of its back-end pools. By default, application gateway does not change the incoming HTTP host header from the client and sends the header unaltered to the back end. There are many services like [Azure Web Apps](../app-service/app-service-web-overview.md) that are multi-tenant in nature and rely on a specific host header or SNI extension to resolve to the correct endpoint. Application Gateway now supports the ability for users to overwrite the incoming HTTP host header based on the back-end HTTP settings. This capability enables support for multi-tenant back ends Azure web apps and API management. This capability is available for both the standard and WAF SKU. Multi-tenant back-end support also works with SSL termination and end to end SSL scenarios.

> [!NOTE]
> Authentication certificate setup is not required for trusted Azure services such as Azure Web Apps.

![web app scenario](./media/application-gateway-web-app-overview/scenario.png)

The ability to specify a host override is defined at the HTTP settings and can be applied to any back-end pool during rule creation. Multi-tenant back ends support the following two ways of overriding host header and SNI extension.

1. The ability to set the host name to a fixed value in the HTTP settings. This capability ensures that the host header is overridden to this value for all traffic to the back-end pool where the HTTP settings are applied. When using end to end SSL, this overridden host name is used in the SNI extension. This capability enables scenarios where a back-end pool farm expects a host header that is different from the incoming customer host header.

2. The ability to derive the host name from the IP or FQDN of the back-end pool members. HTTP settings also provide an option to pick the host name from a back-end pool member's FQDN if configured with the option to derive host name from an individual back-end pool member. When using end to end SSL, this host name is derived from the FQDN and is used in the SNI extension. This capability enables scenarios where a back-end pool can have two or more multi-tenant PaaS services like Azure web apps and the request's host header to each member contains the host name derived from its FQDN.

> [!NOTE]
> In both of the preceding cases the settings only affect the live traffic behavior and not the health probe behavior. Custom probes already support the ability to specify a host header in the probe configuration. Custom probes now also support the ability to derive the host header behavior from the currently configured HTTP settings. This configuration can be specified by using the `PickHostNameFromBackendHttpSettings` parameter in the probe configuration. For end to end functionality to work, both the probe and the HTTP settings must be modified to reflect the correct configuration.

With this capability, customers specify the options in the HTTP settings and custom probes to the appropriate configuration. This setting is then tied to a listener and a back-end pool by using a rule.

## Next steps

Learn how to set up an application gateway with a web app as a back-end pool member by visiting: [Configure App Service web apps with Application Gateway](application-gateway-web-app-powershell.md)
