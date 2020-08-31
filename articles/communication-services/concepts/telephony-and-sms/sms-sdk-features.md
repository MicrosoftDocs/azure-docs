---
title: SMS SDK overview
description: Provides an overview of the SMS SDK and its offerings.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-communication-services
---
# SMS SDK Overview

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]


## SMS SDK Capabilities

The following list presents the set of features which are currently available in our SDKs.

| Group of features | Capability                                                                                                          | JS  | Java | .NET | Python|
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | --- | -----| ---- | ----- |
| Core Capabilities | Send and receive SMS messages </br> *Unicode emojis supported*                                                      | ✔️   | ✔️  | ✔️  | ✔️   |
|                   | Receive Delivery Reports for messages sent                                                                          | ✔️   | ✔️  | ✔️  | ✔️   |
|                   | All character sets (language/unicode support)                                                                       | ✔️   | ✔️  | ✔️  | ✔️   |
|                   | Support for long messages (up to 2048 char)                                                                         | ✔️   | ✔️  | ✔️  | ✔️   |
|                   | Auto-concatenation of long messages                                                                                 | ✔️   | ✔️  | ✔️  | ✔️   |
| Events            | Use Event Grid to configure webhooks to receive inbound messages and delivery reports                               | ✔️   | ✔️  | ✔️  | ✔️   |
| Phone Number      | Toll-Free numbers                                                                                                   | ✔️   | ✔️  | ✔️  | ✔️   |
| Regulatory        | Opt-Out Handling                                                                                                    | ✔️   | ✔️  | ✔️  | ✔️   |
| Monitoring        | Monitor usage for messages sent and received                                                                | ✔️   | ✔️  | ✔️  | ✔️   |
| PSTN Calling      | Add PSTN calling capabilities to your SMS-enabled telephone number                                                             | ✔️   | ✔️  | ✔️  | ✔️   |

## Next steps

- Familiarize yourself with general [SMS concepts](../telephony-and-sms/sms.md)
- Get an SMS capable [phone number](../../quickstarts/telephony-and-sms/get-a-phone-number.md)
- Get started with [sending sms](../../quickstarts/telephony-and-sms/send-sms.md)