---
title: Azure direct routing known limitations  - Azure Communication Services
description: Known limitations of direct routing in Azure Communication Services.
author: boris-bazilevskiy
manager: rcole
services: azure-communication-services

ms.author: bobazile
ms.date: 09/29/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: pstn
---

# Known limitations in Azure telephony

This article provides information about limitations and known issues related to telephony in Azure Communication Services.

## Azure Communication Services direct routing known limitations

- Anonymous calling isn't supported
    - will be fixed in GA release
- Different set of Media Processors (MP) is used with different IP addresses. Currently [any Azure IP address](./direct-routing-infrastructure.md#media-traffic-ip-and-port-ranges) can be used for media connection between Azure MP and Session Border Controller (SBC).
    - will be fixed in GA release
- Azure Communication Services SBC Fully Qualified Domain Name (FQDN) must be different from Teams Direct Routing SBC FQDN
- Wildcard SBC certificates require extra workaround. Contact Azure support for details.
    - will be fixed in GA release
- Media bypass/optimization isn't supported
- No indication of SBC connection status/details in Azure portal
    - will be fixed in GA release
- Azure Communication Services direct routing isn't available in Government Clouds
- Multi-tenant trunks aren't supported
- Location-based routing isn't supported
- No quality dashboard is available for customers
- Enhanced 911 isn't supported 
- PSTN numbers missing from Call Summary logs 

## Next steps

### Conceptual documentation

- [Phone number types in Azure Communication Services](./plan-solution.md)
- [Plan for Azure direct routing](./direct-routing-infrastructure.md)
- [Pair the Session Border Controller and configure voice routing](./direct-routing-provisioning.md)
- [Pricing](../pricing.md)

### Quickstarts

- [Call to Phone](../../quickstarts/telephony/pstn-call.md)