---
title: Azure direct routing known limitations  - Azure Communication Services
description: Known limitations of direct routing in Azure Communication Services.
author: boris-bazilevskiy
manager: rcole
services: azure-communication-services
ms.author: bobazile
ms.date: 11/08/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: pstn
---

# Known limitations in Azure telephony

This article provides information about limitations and known issues related to telephony in Azure Communication Services.

## Azure Communication Services direct routing known limitations

- Maximum number of configured Session Border Controllers (SBC) is 250 per communication resource.
- When you change direct routing configuration (add SBC, change Voice Route, etc.), wait approximately five minutes for changes to take effect.
- If you move SBC FQDN to another Communication resource, wait approximately an hour, or restart SBC to force configuration change. 
- Azure Communication Services SBC Fully Qualified Domain Name (FQDN) must be different from Teams Direct Routing SBC FQDN.
- One SBC FQDN can be connected to a single resource only. Unique SBC FQDNs are required for pairing to different resources.
- Media bypass/optimization isn't supported.
- Azure Communication Services direct routing isn't available in Government Clouds.
- Multitenant trunks aren't supported.
- Location-based routing isn't supported.
- No quality dashboard is available for customers.
- Enhanced 911 isn't supported.

## Next steps

### Conceptual documentation

- [Phone number types in Azure Communication Services](./plan-solution.md)
- [Plan for Azure direct routing](./direct-routing-infrastructure.md)
- [Pair the Session Border Controller and configure voice routing](./direct-routing-provisioning.md)
- [Managing calls with Call Automation](../call-automation/call-automation.md).
- [Pricing](../pricing.md)

### Quickstarts

- [Outbound call to a phone number](../../quickstarts/telephony/pstn-call.md)