---
title: Overview of Advanced Messaging for WhatsApp
titleSuffix: An Azure Communication Services article
description: Learn about Azure Communication Services Advanced Messaging for WhatsApp.
author: darmour
manager: sundraman
services: azure-communication-services
ms.author: darmour
ms.date: 02/12/2024
ms.topic: overview
ms.service: azure-communication-services
ms.subservice: advanced-messaging
---

# Overview of Advanced Messaging for WhatsApp

Azure Communication Services enables you to send and receive WhatsApp messages using the Azure Communication Services Messaging SDK. You can use this SDK to engage in conversations with customers for product inquiry and customer service scenarios. You can also use it to send messages such as appointment reminders, shipping updates, two-factor authentication, and other notification scenarios.

<!-- [!INCLUDE [Survey Request](../includes/survey-request.md)] -->

## Advanced Messaging for WhatsApp features

The key features of Azure Communications Services Advanced Messaging for WhatsApp include:

* Create new or connect existing WhatsApp Business Accounts to Azure Communication Services.
* Participate in conversations with WhatsApp users world-wide.
* Support for business-initiated and customer-initiated conversations.
* Initiate conversations with WhatsApp users using templates.
* Reply to user’s inquiries and trigger automation using Azure Event Grid notifications.
* Receive delivery reports for messages sent, delivered, and read.

## WhatsApp usernames and business-scoped user IDs

WhatsApp is launching usernames in 2026, allowing users to display a username instead of their phone number. To support this change, Meta introduces a new identifier called the **business-scoped user ID (BSUID)**. BSUIDs begin appearing in webhook payloads and will be supported as recipient identifiers in send requests starting in June 2026.

> [!WARNING]
> **Breaking change:** The `from` and `to` fields in Advanced Messaging events may now be empty when a user hides their phone number. Update your event handlers to use the new `fromBSUID` and `toBSUID` fields. For more information, see [WhatsApp usernames and BSUIDs](./whatsapp-username-support-overview.md).

## Next steps

To get started with Advanced Messaging for WhatsApp, see:

- [Register WhatsApp Business Account](../../../quickstarts/advanced-messaging/whatsapp/connect-whatsapp-business-account.md).
- [Advanced Messaging for WhatsApp Terms of Services](./whatsapp-terms-of-service.md).
- [Try Advanced Messaging Sandbox](../../../quickstarts/advanced-messaging/whatsapp/whatsapp-sandbox-quickstart.md).
- [Get Started With Advanced Communication Messages SDK](../../../quickstarts//advanced-messaging/whatsapp/get-started.md).
- [Handle Advanced Messaging Events](../../../quickstarts/advanced-messaging/whatsapp/handle-advanced-messaging-events.md).
- [View Messaging Policy](../../../concepts/sms/messaging-policy.md).
- [Pricing for Advanced Messaging for WhatsApp](./pricing.md).
