---
title: SMS concepts in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services SMS concepts.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 06/30/2021
ms.topic: overview
ms.service: azure-communication-services
---

# SMS concepts

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

Azure Communication Services enables you to send and receive SMS text messages using the Communication Services SMS SDKs. These SDKs can be used to support customer service scenarios, appointment reminders, two-factor authentication, and other real-time communication needs. Communication Services SMS allows you to reliably send messages while exposing deliverability and response metrics.

Key features of Azure Communication Services SMS SDKs include:

-  **Simple** setup experience for adding SMS capability to your applications.
- **High Velocity** message support over toll free numbers for A2P (Application to Person) use cases in the United States.
- **Bulk Messaging** supported to enable sending messages to multiple recipients at a time.
- **Two-way** conversations to support scenarios like customer support, alerts, and appointment reminders.
- **Reliable Delivery** with real-time delivery reports for messages sent from your application.
- **Analytics** to track your SMS usage patterns.
- **Opt-Out** handling support to automatically detect and respect opt-outs for toll-free numbers. Opt-outs for US toll-free numbers are mandated and enforced by US carriers.

## Next steps

> [!div class="nextstepaction"]
> [Get started with sending sms](../../quickstarts/telephony-sms/send.md)

The following documents may be interesting to you:

- Familiarize yourself with the [SMS SDK](../telephony-sms/sdk-features.md)
- Get an SMS capable [phone number](../../quickstarts/telephony-sms/get-phone-number.md)
- [Phone number types in Azure Communication Services](../telephony-sms/plan-solution.md)
