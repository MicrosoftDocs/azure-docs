---
title: Emergency calling for Zoom Phone Cloud Peering with Azure Communications Gateway
description: Understand Azure Communications Gateway's support for emergency calling with Zoom Phone Cloud Peering
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.date: 11/06/2023
ms.custom: template-concept
---

# Emergency calling for Zoom Phone Cloud Peering with Azure Communications Gateway

Azure Communications Gateway supports Zoom Phone subscribers making emergency calls from Zoom clients. This article describes how Azure Communications Gateway routes these calls to your network and the key facts you need to consider.

## Emergency calling in the United States and Canada

By default, Zoom routes emergency calls in the United States and Canada over dedicated trunks to emergency service providers. Emergency calls therefore don't reach your Azure Communications Gateway deployment or your network.

If you want Zoom to route emergency calls to your network (via Azure Communications Gateway), refer to the _Zoom Phone Provider Exchange Solution Reference Guide_ and contact your Zoom representative. You must then configure Azure Communications Gateway and your network to handle emergency calls in the same way as emergency calls outside the United States and Canada.

## Emergency calling outside the United States and Canada

Azure Communications Gateway routes emergency calls from Zoom clients to your network in the same way as other originating calls. Zoom signals emergency numbers in the format `+<country-code><emergency-short-code>` (for example `+44999`), where the emergency short codes are as specified in https://support.zoom.us/hc/articles/360029961151-Special-service-numbers.

You must:

1. Identify the combinations of country codes and emergency short codes that you need to support.
2. Specify these combinations (prefixed with `+`) when you [deploy Azure Communications Gateway](deploy.md#collect-basic-information-for-deploying-an-azure-communications-gateway), or by editing your existing configuration.
3. Configure your network to treat calls to these numbers as emergency calls.

If your network can't route emergency calls in the format  `+<country-code><emergency-short-code>`, contact your onboarding team or raise a support request to discuss your requirements for number conversion.

## Next steps

- Learn about [Azure Communications Gateway's interoperability with Zoom Phone Cloud Peering](interoperability-zoom.md).
