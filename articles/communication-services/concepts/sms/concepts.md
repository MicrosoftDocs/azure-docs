---
title: SMS concepts in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services SMS concepts.
author: prakulka
manager: sundraman
services: azure-communication-services

ms.author: prakulka
ms.date: 07/10/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: references_regions
---

# SMS overview

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

Azure Communication Services enables you to send and receive SMS text messages using the Communication Services SMS SDKs. These SDKs can be used to support customer service scenarios, appointment reminders, two-factor authentication, and other real-time communication needs. Communication Services SMS allows you to reliably send messages while exposing deliverability and response metrics.

## SMS features

Key features of Azure Communication Services SMS SDKs include:

-  **Simple** setup experience for adding SMS capability to your applications.
- **High Velocity** message support over toll free numbers and short codes for A2P (Application to Person) use cases in the United States.
- **Bulk Messaging** supported to enable sending messages to multiple recipients at a time.
- **Two-way** conversations to support scenarios like customer support, alerts, and appointment reminders.
- **Reliable Delivery** with real-time delivery reports for messages sent from your application.
- **Analytics** to track your SMS usage patterns. See [SMS insights](../../concepts/analytics/insights/sms-insights.md) for details.
- **Opt-Out** handling support to automatically detect and respect opt-outs for toll-free numbers and short codes. Opt-outs for US toll-free numbers are mandated and enforced by US carriers. See [opt-out handling FAQ](./sms-faq.md#opt-out-handling) for details.

## Sender types supported

Sending SMS to any recipient requires getting a phone number. Choosing the right number type is critical to the success of your messaging campaign. Few of the factors to consider when choosing a number type include destination(s) of the message, throughput requirement of your messaging campaign, and the timeline when you want to start sending messages. Azure Communication Services enables you to send SMS using a variety of sender types - toll-free number (1-8XX), short codes (12345), and alphanumeric sender ID (CONTOSO). The following table walks you through the features of each number type:

|Factors              | Toll-Free| Short Code | Dynamic Alphanumeric Sender ID| Pre-registered Alphanumeric Sender ID|
|---------------------|----------|------------|-----------------------|-----------------------|
|**Description**|Toll free numbers are telephone numbers with distinct three-digit codes that can be used for business to consumer communication without any charge to the consumer| Short codes are 5-6 digit numbers used for business to consumer messaging such as alerts, notifications, and marketing |  Alphanumeric Sender IDs are displayed as a custom alphanumeric phrase like the company’s name (CONTOSO, MyCompany) on the recipient handset. Alphanumeric sender IDs can be used for a variety of use cases like one-time passcodes, marketing alerts, and flight status notifications. Dynamic alphanumeric sender ID is supported in countries that do not require registration for use.| Alphanumeric Sender IDs are displayed as a custom alphanumeric phrase like the company’s name (CONTOSO, MyCompany) on the recipient handset. Alphanumeric sender IDs can be used for a variety of use cases like one-time passcodes, marketing alerts, and flight status notifications. Pre-registered alphanumeric sender ID is supported in countries that require registration for use. |
|**Format**|+1 (8XX) XYZ PQRS| 12345  | CONTOSO*       |CONTOSO*       |
|**SMS support**|Two-way SMS| Two-way SMS  | One-way outbound SMS  |One-way outbound SMS  |
|**Calling support**|Yes| No | No |No |
|**Provisioning time**| 5-6 weeks| 6-8 weeks  | Instant       | 4-5 weeks|
|**Throughput**       | 200 messages/min (can be increased upon request)| 6000 messages/ min (can be increased upon request) | 600 messages/ min (can be increased upon request)|600 messages/ min (can be increased upon request)|
|**Supported Destinations**| United States, Canada, Puerto Rico| United States   |  Germany, Netherlands, United Kingdom, Australia, France, Switzerland, Sweden, Italy, Spain, Denmark, Ireland, Portugal, Poland, Austria, Lithuania, Latvia, Estonia| Norway, Finland, Slovakia, Slovenia, Czech Republic|
|**Get started**|[Get a toll-free number](../../quickstarts/telephony/get-phone-number.md)|[Get a short code](../../quickstarts/sms/apply-for-short-code.md) | [Enable alphanumeric sender ID](../../quickstarts/sms/enable-alphanumeric-sender-id.md) |[Enable alphanumeric sender ID](../../quickstarts/sms/enable-alphanumeric-sender-id.md) |

\* See [Alphanumeric sender ID FAQ](./sms-faq.md#alphanumeric-sender-id) for detailed formatting requirements.

## Next steps

> [!div class="nextstepaction"]
> [Get started with sending sms](../../quickstarts/sms/send.md)

The following documents might be interesting to you:

- Check SMS FAQ for questions regarding [SMS](../sms/sms-faq.md)
- Familiarize yourself with the [SMS SDK](../sms/sdk-features.md)
- Get an SMS capable [phone number](../../quickstarts/telephony/get-phone-number.md)
- Get a [short code](../../quickstarts/sms/apply-for-short-code.md)
- [Phone number types in Azure Communication Services](../telephony/plan-solution.md)
- Apply for [Toll-free verification](./sms-faq.md#toll-free-verification)
