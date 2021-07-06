---
title: SMS SDK overview for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the SMS SDK and its offerings.
author: mikben
manager: jken
services: azure-communication-services
ms.author: prakulka
ms.date: 06/30/2021
ms.topic: overview
ms.service: azure-communication-services
---
# SMS SDK overview

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

Azure Communication Services SMS SDKs can be used to add SMS messaging to your applications.

## SMS SDK capabilities

The following list presents the set of features which are currently available in our SDKs.

| Group of features | Capability                                                                            | JS  | Java | .NET | Python |
| ----------------- | ------------------------------------------------------------------------------------- | --- | ---- | ---- | ------ |
| Core Capabilities | Send and receive SMS messages                                                         | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Enable Delivery Reports for messages sent                                             | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | All character sets (language/unicode support)                                         | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Support for long messages (up to 2048 bytes)                                          | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Auto-concatenation of long messages                                                   | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Send messages to multiple recipients at a time                                        | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Support for idempotency                                                               | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Custom tags for messages.                                                             | ✔️   | ✔️    | ✔️    | ✔️      |
| Events            | Use Event Grid to configure webhooks to receive inbound messages and delivery reports | ✔️   | ✔️    | ✔️    | ✔️      |
| Phone Number      | Toll-Free numbers                                                                     | ✔️   | ✔️    | ✔️    | ✔️      |
| PSTN Calling      | Add PSTN calling capabilities to your SMS-enabled toll-free number                    | ✔️   | ✔️    | ✔️    | ✔️      |

## Next steps

> [!div class="nextstepaction"]
> [Get started with sending sms](../../quickstarts/telephony-sms/send.md)

The following documents may be interesting to you:

- Familiarize yourself with general [SMS concepts](../telephony-sms/concepts.md)
- Get an SMS capable [phone number](../../quickstarts/telephony-sms/get-phone-number.md)
- [Phone number types in Azure Communication Services](../telephony-sms/plan-solution.md)
