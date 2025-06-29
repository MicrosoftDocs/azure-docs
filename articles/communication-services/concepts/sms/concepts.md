---
title: SMS overview
titleSuffix: An Azure Communication Services article
description: This article describes Azure Communication Services short message service (SMS) concepts.
author: prakulka
manager: sundraman
services: azure-communication-services

ms.author: prakulka
ms.date: 04/10/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: references_regions
---

# SMS overview

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

Azure Communication Services enables you to send and receive short message service (SMS) text messages using the Communication Services SMS SDKs. You can use these SDKs to support customer service scenarios, appointment reminders, two-factor authentication, and other real-time communication needs. Azure Communication Services SMS enables you to reliably send messages while exposing deliverability and response metrics.

<!-- [!INCLUDE [Survey Request](../includes/survey-request.md)] -->

## SMS features

Key features of Azure Communication Services SMS SDKs include:

-  **Simple** setup experience for adding SMS capability to your applications.
- **High Velocity** message support over toll free numbers and short codes for A2P (Application to Person) use cases in the United States.
- **Bulk Messaging** supported to enable sending messages to multiple recipients at a time.
- **Two-way** conversations to support scenarios like customer support, alerts, and appointment reminders.
- **Reliable Delivery** with real-time delivery reports for messages sent from your application.
- **Analytics** to track your SMS usage patterns. See [SMS insights](../../concepts/analytics/insights/sms-insights.md) for details.
- **Opt-Out** handling support to automatically detect and respect opt-outs for toll-free numbers and short codes. US carriers mandate and enforce opt-outs for US toll-free numbers. See [opt-out handling FAQ](./sms-faq.md#opt-out-handling) for details.

## Sender types supported

To send SMS, you must have a sender ID—this can be a phone number or an alphanumeric sender ID where supported. Choosing the right sender ID is critical to the success of your messaging campaign. When selecting a number or sender ID type, consider the destination country, regulatory requirements, throughput needs, and your desired timeline for launch. Azure Communication Services enables you to send SMS using various sender types: toll-free number (1-8XX), short codes (12345), 10 digit long codes (1-234-123-1234), mobile numbers (+XX XXXXX XXXXX), and alphanumeric sender ID (CONTOSO). The following table walks you through the features of each sender type:

### Sender Types overview

| Number Type | Description | Provisioning Time | Get Started |
|-------------|-------------|-------------------|-------------|
| **Toll-Free** | Toll free numbers are telephone numbers with distinct three-digit codes that can be used for business to consumer communication without any charge to the consumer. | 5–6 weeks | [Get a toll-free number](../../quickstarts/telephony/get-phone-number.md) |
| **Short Code** | Short codes are 5–6 digit numbers used for business to consumer messaging such as alerts, notifications, and marketing. | 6–8 weeks | [Get a short code](../../quickstarts/sms/apply-for-short-code.md) |
| **Dynamic Alphanumeric Sender ID** | Alphanumeric Sender IDs are displayed as a custom alphanumeric phrase like the company’s name (CONTOSO, MyCompany) on the recipient handset. Alphanumeric sender IDs can be used for various use cases like one-time passcodes, marketing alerts, and flight status notifications. Dynamic alphanumeric sender ID is supported in countries that do not require registration for use. | Instant | [Enable dynamic alphanumeric sender ID](../../quickstarts/sms/enable-alphanumeric-sender-id.md#enable-dynamic-alphanumeric-sender-id) |
| **Preregistered Alphanumeric Sender ID** | Alphanumeric Sender IDs are displayed as a custom alphanumeric phrase like the company’s name (CONTOSO, MyCompany) on the recipient handset. Alphanumeric sender IDs can be used for various use cases like one-time passcodes, marketing alerts, and flight status notifications. Pre-registered alphanumeric sender ID is supported in countries that require registration for use. | 6–8 weeks | [Enable preregistered alphanumeric sender ID](../../quickstarts/sms/enable-alphanumeric-sender-id.md#enable-preregistered-alphanumeric-sender-id) |
| **10DLC** | 10DLC, or 10-Digit Long Code, refers to a 10-digit phone number that is utilized for SMS communications. These numbers are primarily used by businesses and organizations for sending large volumes of Application-to-Person (A2P) SMS messages. | 2–3 weeks | [Apply for 10DLC](../../quickstarts/sms/apply-for-ten-digit-long-code.md) |
| **Mobile Numbers** | Mobile numbers refer to standard mobile phone numbers that can be used by businesses for two-way SMS communication with customers. These numbers are commonly used in various countries for both person-to-person (P2P) and Application-to-Person (A2P) messaging, enabling businesses to send notifications, alerts, and customer engagement messages. | 1–3 weeks | [Acquire a mobile number](../../quickstarts/telephony/get-phone-number.md) |

### Feature Comparison by Sender Type

| Number Type | SMS Support | Voice Support | Format | Throughput |
|-------------|-------------|----------------|--------|------------|
| **Toll-Free** | Two-way SMS | Yes | +1 (8XX) XYZ PQRS | 200 messages/min (can be increased upon request) |
| **Short Code** | Two-way SMS | No | 12345 | 6000 messages/min (can be increased upon request) |
| **Dynamic Alphanumeric Sender ID** | One-way outbound SMS | No | CONTOSO* | 600 messages/min (can be increased upon request) |
| **Preregistered Alphanumeric Sender ID** | One-way outbound SMS | No | CONTOSO* | 600 messages/min (can be increased upon request) |
| **10DLC** | Two-way SMS | Yes | 1 (XXX) ABC DEFG | 200 messages/min (can be increased upon request) |
| **Mobile Numbers** | Two-way SMS | No | +XX XXXXX XXXXX | 200 messages/min (can be increased upon request) |

\* For detailed formatting requirements, see [Alphanumeric sender ID FAQ](./sms-faq.md#alphanumeric-sender-id) .

## Sender Type Availability by Country (destination)

| Supported Destinations           | Toll-Free | Short Code | 10DLC | Mobile Number | Dynamic Alpha | Prereg. Alpha |
|------------------|-----------|------------|-------|----------------|----------------|----------------|
| United States    | ✅        | ✅         | ✅    | –              | –              | –              |
| Canada           | ✅        | ✅         | –     | –              | –              | –              |
| Puerto Rico      | ✅        | –          | –     | –              | –              | –              |
| United Kingdom   | –         | ✅         | –     | ✅             | –             | ✅             |
| Australia        | –         | –          | –     | ✅             | –              | ✅             |
| Austria          | –         | –          | –     | –              | ✅              | ✅             |
| Germany          | –         | –          | –     | –              | ✅             | –              |
| France           | –         | –          | –     | –              | ✅             | –              |
| Italy            | –         | –          | –     | –              | –              | ✅             |
| Ireland          | –         | –          | –     | ✅             | ✅             | –              |
| Finland          | –         | –          | –     | ✅             | –              | ✅             |
| Denmark          | –         | –          | –     | ✅             | ✅             | –              |
| Netherlands      | –         | –          | –     | ✅             | ✅             | –              |
| Sweden           | –         | –          | –     | ✅             | ✅             | –              |
| Poland           | –         | –          | –     | ✅             | ✅             | –              |
| Belgium          | –         | –          | –     | ✅             | –              | –              |
| Latvia           | –         | –          | –     | ✅             | ✅             | –              |
| Estonia          | –         | –          | –     | –              | ✅             | –              |
| Lithuania        | –         | –          | –     | –              | ✅             | –              |
| Portugal         | –         | –          | –     | –              | ✅             | –              |
| Spain            | –         | –          | –     | –              | ✅             | –              |
| Switzerland      | –         | –          | –     | –              | ✅             | –              |
| Czech Republic   | –         | –          | –     | –              | –              | ✅             |
| Norway           | –         | –          | –     | –              | –              | ✅             |
| Slovakia         | –         | –          | –     | –              | –              | ✅             |
| Slovenia         | –         | –          | –     | –              | –              | ✅             |

## Next steps

> [!div class="nextstepaction"]
> [Get started with sending sms](../../quickstarts/sms/send.md)

## Related articles

- [Number lookup overview](../../concepts/numbers/number-lookup-concept.md).
- Check SMS FAQ for questions regarding [SMS](../sms/sms-faq.md).
- Familiarize yourself with the [SMS SDK](../sms/sdk-features.md).
- Get an SMS capable [phone number](../../quickstarts/telephony/get-phone-number.md).
- Get a [short code](../../quickstarts/sms/apply-for-short-code.md).
- Learn about [Phone number types in Azure Communication Services](../telephony/plan-solution.md).
- Apply for [Toll-free verification](./sms-faq.md#toll-free-verification).
