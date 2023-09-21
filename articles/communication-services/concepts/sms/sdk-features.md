---
title: SMS SDK overview for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the SMS SDK and its offerings.
author: probableprime
manager: chpalm
services: azure-communication-services

ms.author: prakulka
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: sms
---
# SMS SDK overview

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

Azure Communication Services SMS SDKs can be used to add SMS messaging to your applications.

## SMS SDK capabilities

The following list presents the set of features that are currently available in our SDKs.

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
| Phone Number      | Toll-Free numbers, Short Codes                                         | ✔️   | ✔️    | ✔️    | ✔️      |
| PSTN Calling      | Add PSTN calling capabilities to your SMS-enabled toll-free number                    | ✔️   | ✔️    | ✔️    | ✔️      |

## Next steps

> [!div class="nextstepaction"]
> [Get started with sending sms](../../quickstarts/sms/send.md)

The following documents may be interesting to you:

- Familiarize yourself with general [SMS concepts](../sms/concepts.md)
- Get an SMS capable [phone number](../../quickstarts/telephony/get-phone-number.md)
- [Phone number types in Azure Communication Services](../telephony/plan-solution.md)
