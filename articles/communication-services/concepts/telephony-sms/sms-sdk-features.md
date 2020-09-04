---
title: SMS SDK overview for Azure Communication Services
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

> [!div class="nextstepaction"]
> [Get started with sending sms](../../quickstarts/telephony-sms/send-sms.md)

The following documents may be interesting to you:

- Familiarize yourself with general [SMS concepts](../telephony-sms/sms-concepts.md)
- Get an SMS capable [phone number](../../quickstarts/telephony-sms/get-a-phone-number.md)
- [Plan your SMS solution](../telephony-sms/plan-your-telephony-and-SMS-solution.md)