---
title: SMS concepts in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services SMS concepts.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 09/30/2020
ms.topic: overview
ms.service: azure-communication-services
---

# SMS concepts

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

Azure Communication Services enables you to send and receive SMS text messages using the Communication Services SMS client libraries. These client libraries can be used to support customer service scenarios, appointment reminders, two-factor authentication, and other real-time communication needs. Communication Services SMS allows you to reliably send messages while exposing deliverability and response rate insights surrounding your campaigns.

Key features of Azure Communication Services SMS client libraries include:

-  **Simple** setup experience for adding SMS capability to your applications.
- **High Velocity** message support over toll free numbers for A2P (Application to Person) use cases in the United States.
- **Two-way** conversations to support scenarios like customer support, alerts, and appointment reminders.
- **Reliable Delivery** with real-time delivery reports for messages sent from your application.
- **Analytics** to track your usage patterns and customer engagement.
- **Opt-Out** handling support to automatically detect and respect opt-outs for toll-free numbers. Opt-outs for US toll-free numbers are mandated and enforced by US carriers.
  - STOP - If a text message recipient wishes to opt-out, they can send ‘STOP’ to the toll-free number. The carrier sends the following default response for STOP: *"NETWORK MSG: You replied with the word "stop" which blocks all texts sent from this number. Text back "unstop" to receive messages again."*
  - START/UNSTOP - If the recipient wishes to resubscribe to text messages from a toll-free number, they can send ‘START’ or ‘UNSTOP to the toll-free number. The carrier sends the following default response for START/UNSTOP: *“NETWORK MSG: You have replied “unstop” and will begin receiving messages again from this number.”*
  - Azure Communication Services will detect the STOP message and block all further messages to the recipient. The delivery report will indicate a failed delivery with status message as “Sender blocked for given recipient.”
  - The STOP, UNSTOP and START messages will be relayed back to you. Azure Communication Services encourages you to monitor and implement these opt-outs to ensure that no further message send attempts are made to recipients who have opted out of your communications.


## Next steps

> [!div class="nextstepaction"]
> [Get started with sending sms](../../quickstarts/telephony-sms/send.md)

The following documents may be interesting to you:

- Familiarize yourself with the [SMS client library](../telephony-sms/sdk-features.md)
- Get an SMS capable [phone number](../../quickstarts/telephony-sms/get-phone-number.md)
- [Plan your SMS solution](../telephony-sms/plan-solution.md)
