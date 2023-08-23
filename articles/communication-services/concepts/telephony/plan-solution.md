---
title: Phone number types in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn how to effectively use different types of phone numbers for SMS and telephony.
author: prakulka
manager: nmurav
services: azure-communication-services

ms.author: prakulka
ms.date: 06/30/2021
ms.topic: conceptual
ms.custom: references_regions
ms.service: azure-communication-services
ms.subservice: pstn
---
# Phone number types in Azure Communication Services

> [!IMPORTANT]
> Phone number purchasing availability is currently restricted to paid Azure subscriptions. Phone numbers cannot be purchased on trial accounts or using Azure free credits. For more information, visit the [subscription eligibility](../numbers/sub-eligibility-number-capability.md) section of this document. For those on non-paid Azure subscriptions, you can [get a trial phone number](../../quickstarts/telephony/get-trial-phone-number.md).


Azure Communication Services allows you to use phone numbers to make voice calls and send SMS messages with the public-switched telephone network (PSTN). In this document, we'll review the phone number types, configuration options, and region availability for planning your telephony and SMS solution using Communication Services.

## Azure Subscriptions eligibility

To acquire a phone number, you need to be on a paid Azure subscription. Phone numbers can't be acquired on trial accounts or by Azure free credits.

Phone number availability is currently restricted to Azure subscriptions that have a billing address in supported regions. To see all the supported billing locations, visit the [subscription eligibility](../numbers/sub-eligibility-number-capability.md) page.


## Number types and features
Communication Services offers two types of phone numbers: **local** and **toll-free**.

### Local numbers
Local (Geographic) numbers are 10-digit telephone numbers consisting of the local area codes in the United States. For example, `+1 (206) XXX-XXXX` is a local number with an area code of `206`. This area code is assigned to the city of Seattle. These phone numbers are generally used by individuals and local businesses. Azure Communication Services offers local numbers in the United States. These numbers can be used to place phone calls, but not to send SMS messages.

### Toll-free Numbers
Toll-free numbers are 10-digit telephone numbers with distinct area codes that can be called from any phone number free of charge. For example, `+1 (800) XXX-XXXX` is a toll-free number in the North America region. These phone numbers are generally used for customer service purposes. Azure Communication Services offers toll-free numbers in the United states. These numbers can be used to place phone calls and to send SMS messages. Toll-free numbers can't be used by people and can only be assigned to applications.

#### Choosing a phone number type

If your phone number will be used by an application (for example, to make calls or send messages on behalf of your service), you can select a toll-free or local (geographic) number. You can select a toll-free number if your application is sending SMS messages and/or making calls.

If your phone number is being used by a person (for example, a user of your calling application), the local (geographic) phone number must be used.

The table below summarizes these phone number types:

| Phone number type | Example                              | Country/Region availability    | Phone Number Capability |Common use case                                                                                                     |
| ----------------- | ------------------------------------ | ----------------------- | ------------------------|------------------------------------------------------------------------------------------------------------------- |
| Local (Geographic)        | +1 (local area code) XXX XX XX  | US*                      | Calling (Outbound) | Assigning phone numbers to users in your applications  |
| Toll-Free         | +1 (toll-free area *code*) XXX XX XX | US*                      | Calling (Outbound), SMS (Inbound/Outbound)| Assigning phone numbers to Interactive Voice Response (IVR) systems/Bots, SMS applications                                        |

*To find all countries/regions where telephone numbers are available, please refer to [subscription eligibility and number capabilities page](../numbers/sub-eligibility-number-capability.md).

### Phone number capabilities in Azure Communication Services

[!INCLUDE [Emergency Calling Notice](../../includes/emergency-calling-notice-include.md)]

For most phone numbers, we allow you to configure an "a la carte" set of capabilities. These capabilities can be selected as you lease your telephone numbers within Azure Communication Services.

The capabilities that are available to you depend on the country/region that you're operating within, your use case, and the phone number type that you've selected. These capabilities vary by country/region due to regulatory requirements. Azure Communication Services offers the following phone number capabilities:

- **One-way outbound SMS** This option allows you to send SMS messages to your users. This can be useful in notification and two-factor authentication scenarios.
- **Two-way inbound and outbound SMS** This option allows you to send and receive messages from your users using phone numbers. This can be useful in customer service scenarios.
- **One-way outbound telephone calling** This option allows you to make calls to your users and configure Caller ID for outbound calls placed by your service. This can be useful in customer service and voice notification scenarios.

## Country/region availability

SMS and Telephony are available in number of locations. You can find all the supported regions, number types and available capabilities in the [Azure Communication Services documentation](../numbers/sub-eligibility-number-capability.md).

**For more information about call destinations and pricing, see the [pricing page](../pricing.md).


## Next steps

### Quickstarts

- [Get a phone Number](../../quickstarts/telephony/get-phone-number.md)
- [Manage inbound and outbound calls](../../quickstarts/voice-video-calling/callflows-for-customer-interactions.md) with Call Automation.
- [Place a call](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
- [Send an SMS](../../quickstarts/sms/send.md)

### Conceptual documentation

- [Voice and video concepts](../voice-video-calling/about-call-types.md)
- [Telephony concepts](./telephony-concept.md)
- [Call Automation concepts](../voice-video-calling/call-automation.md)
- [Call Flows](../call-flows.md)
- [Pricing](../pricing.md)
