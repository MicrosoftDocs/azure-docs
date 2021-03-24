---
title: SMS client library overview for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the SMS client library and its offerings.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2021
ms.topic: overview
ms.service: azure-communication-services
---
# SMS client library overview

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]


[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

Azure Communication Services SMS client libraries can be used to add SMS messaging to your applications.

## SMS client library capabilities

The following list presents the set of features which are currently available in our client libraries.

| Group of features | Capability                                                                            | JS  | Java | .NET | Python |
| ----------------- | ------------------------------------------------------------------------------------- | --- | ---- | ---- | ------ |
| Core Capabilities | Send and receive SMS messages </br> *Unicode emojis supported*                        | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Receive Delivery Reports for messages sent                                            | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | All character sets (language/unicode support)                                         | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Support for long messages (up to 2048 char)                                           | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Auto-concatenation of long messages                                                   | ✔️   | ✔️    | ✔️    | ✔️      |
| Events            | Use Event Grid to configure webhooks to receive inbound messages and delivery reports | ✔️   | ✔️    | ✔️    | ✔️      |
| Phone Number      | Toll-Free numbers                                                                     | ✔️   | ✔️    | ✔️    | ✔️      |
| Regulatory        | Opt-Out Handling                                                                      | ✔️   | ✔️    | ✔️    | ✔️      |
| Monitoring        | Monitor usage for messages sent and received                                          | ✔️   | ✔️    | ✔️    | ✔️      |
| PSTN Calling      | Add PSTN calling capabilities to your SMS-enabled toll-free number                    | ✔️   | ✔️    | ✔️    | ✔️      |

## Next steps

> [!div class="nextstepaction"]
> [Get started with sending sms](../../quickstarts/telephony-sms/send.md)

The following documents may be interesting to you:

- Familiarize yourself with general [SMS concepts](../telephony-sms/concepts.md)
- Get an SMS capable [phone number](../../quickstarts/telephony-sms/get-phone-number.md)
- [Phone number types in Azure Communication Services](../telephony-sms/plan-solution.md)
