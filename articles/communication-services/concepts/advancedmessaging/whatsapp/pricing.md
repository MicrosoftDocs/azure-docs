---
title: Pricing for Advanced Messaging for WhatsApp
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Service WhatsApp pricing concepts.
author: darmour
manager: sundraman
services: azure-communication-services
ms.author: darmour
ms.date: 06/26/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: advancedmessaging
---

# Advanced Messaging pricing in Azure Communication Services #

Prices for Advanced Messaging in Azure Communication Services consists of two components: the usage fee and the channel fee.

## Advanced Messaging usage fee ##

The Azure Communication Services Advanced Messaging usage fee is based on the number of messages exchanged between the platform and an end user.

| **Message Type** | **Message Fee** |
|------------------|-----------------|
| Inbound Message  | \$0.005/message |
| Outbound Message | \$0.005/message |

## Advanced Messaging channel price ##

**WhatsApp**

When you connect your WhatsApp Business account to Azure, Azure Communication Services becomes the billing entity for your WhatsApp usage. These rates are set by WhatsApp and will be included in your Azure bill. The information below summarizes the key aspects of WhatsApp pricing. WhatsApp describes their pricing in detail here: [Conversation-Based Pricing](https://developers.facebook.com/docs/whatsapp/pricing).

WhatsApp charges per conversation, not individual message. Conversations are 24-hour message threads between a business and its customers. Conversations are categorized with one of the following categories:

-   **Marketing** — Marketing conversations include promotions or offers, informational updates, or invitations for customers to respond or take action.
-   **Utility** — Utility conversations facilitate a specific, agreed-upon request or transaction, or update a customer about an ongoing transaction. These may include transaction confirmations, transaction updates, and/or post-purchase notifications.
-   **Authentication** — Authentication conversations enable you to authenticate users with one-time passcodes, potentially at multiple steps in the login process (e.g., account verification, account recovery, integrity challenges).
-   **Service** — Service conversations help you resolve customer inquiries.

For service conversations, WhatsApp provides 1,000 fee conversations each month across all business phone numbers. Marketing, utility and authentication conversations are not part of the free tier.

WhatsApp rates vary based on conversation category and country/region rate. Rates vary between \$0.003 and \$0.1597 depending on the category and country/region. WhatsApp provides a detailed explanation of their pricing, including the current rate card here: [Conversation-Based Pricing](https://developers.facebook.com/docs/whatsapp/pricing).

**Pricing example: Alice sends appointment reminders to its WhatsApp customers**

Alice is managing a virtual visit solution for her organization’s patients. Alice will be scheduling the visit and sends WhatsApp invites to all patients reminding them about their upcoming visit. WhatsApp classifies appointment reminders as “Utility Conversations". In this case, each WhatsApp conversation is a single message.

Alice sends appointment reminders to 2,000 patients in North America each month and the pricing would be:

### Advanced Messaging Usage for messages ###

2,000 WhatsApp Conversations = 2,000 messages x \$0.005/message = \$10 USD

**WhatsApp Fees (rates subject to change):**

2,000 WhatsApp Conversations \* \$0.015/utility conversation = \$30 USD

To get the latest WhatsApp rates, refer to WhatsApp’s pricing documentation: [Conversation-Based Pricing](https://developers.facebook.com/docs/whatsapp/pricing).

**Pricing example: A WhatsApp user reaches out to a business for support**

Contoso is a business which provides a contact center for customers to seek product information and support. All these cases are closed within 24 hours and have an average of 20 messages each. Each case equals one WhatsApp Conversation. WhatsApp classifies contact center conversations as “Service Conversations.”

Contoso manages 2,000 cases in North America each month and the pricing would be:

### Advanced Messaging Usage For Conversation ###

2,000 WhatsApp Conversations \* 20 messages/conversation x \$0.005/message = \$200 USD

**WhatsApp Fees (rates subject to change):** 1,000 WhatsApp free conversations/month + 1,000 WhatsApp conversations \* \$0.0088/service conversation = \$8.80 USD

To get the latest WhatsApp rates, refer to WhatsApp’s pricing documentation: [Conversation-Based Pricing](https://developers.facebook.com/docs/whatsapp/pricing).

## Next steps ##

-   [Connecting a WhatsApp Business Account](./connecting-whatsapp-business-account.md)
-   [Advanced Messaging for WhatsApp Terms of Services](./whatsapp-termsof-service.md)
-   [Trying the WhatsApp Sandbox]()
-   [Get Started With AdvancedMessages](../../../quickstarts//advancedmessaging/whatsapp/get-started.md)
-   [Messaging Policy](https://learn.microsoft.com/azure/communication-services/concepts/sms/messaging-policy)
