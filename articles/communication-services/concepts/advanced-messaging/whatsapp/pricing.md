---
title: Pricing for Advanced Messaging
titleSuffix: An Azure Communication Services article
description: Learn about pricing for Advanced Messaging in Azure Communication Services.
author: darmour
manager: sundraman
services: azure-communication-services
ms.author: darmour
ms.date: 02/12/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: advanced-messaging
---

# Pricing for Advanced Messaging

Prices for Advanced Messaging in Azure Communication Services consist of two components: the usage fee and the channel fee.

## Advanced Messaging usage fee

The Azure Communication Services Advanced Messaging usage fee is based on the number of messages exchanged between the platform and an end user.

| **Message Type** | **Message Fee** |
|------------------|-----------------|
| Inbound Message  | \$0.005/message |
| Outbound Message | \$0.005/message |

## Advanced Messaging channel price

### WhatsApp

When you connect your WhatsApp Business account to Azure, Azure Communication Services becomes the billing entity for your WhatsApp usage. WhatsApp provides these rates, and they’re included in your Azure bill. WhatsApp describes their pricing in detail here: [WhatsApp Pricing Documentation](https://developers.facebook.com/docs/whatsapp/pricing).


**Effective July 1, 2025**, WhatsApp will implement the following changes to their pricing model:

- The conversation-based pricing model will be deprecated.
- WhatsApp will charge [per-message for template messages](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing#per-message-pricing) instead of per-conversation.
- Utility template messages sent within an open customer service window [will become free](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing#free-utility-templates-in-the-customer-service-window).

See [Pricing Updates on the WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing/) for additional details.

## Pricing example: Contoso sends appointment reminders to their WhatsApp customers

Contoso provides a virtual visit solution for its patients. Contoso is scheduling the visit and sends WhatsApp invites to all patients reminding them about their upcoming visit. WhatsApp classifies appointment reminders as **Utility Conversations**. In this case, each WhatsApp conversation is a single message.
Contoso sends appointment reminders to 2,000 patients in North America each month and the pricing would be:

**Advanced Messaging usage for messages:**

2,000 messages × \$0.005/message = \$10.00 USD + WhatsApp Fee 

Please see WhatsApp pricing in detail here: [WhatsApp Pricing Documentation](https://developers.facebook.com/docs/whatsapp/pricing).

## Next steps

-   [Register WhatsApp Business Account](../../../quickstarts/advanced-messaging/whatsapp/connect-whatsapp-business-account.md)
-   [Advanced Messaging for WhatsApp Terms of Services](./whatsapp-terms-of-service.md)
-   [Try Advanced Messaging Sandbox](../../../quickstarts//advanced-messaging/whatsapp/whatsapp-sandbox-quickstart.md)
-   [Get Started With Advanced Communication Messages SDK](../../../quickstarts//advanced-messaging/whatsapp/get-started.md)
-   [Messaging Policy](../../../concepts/sms/messaging-policy.md)
