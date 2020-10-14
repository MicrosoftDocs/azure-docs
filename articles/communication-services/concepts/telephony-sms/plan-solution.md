---
title: Plan your Azure Communication Services telephony and SMS solution
titleSuffix: An Azure Communication Services concept document
description: Learn how to effectively plan your use of phone numbers and telephony.
author: prakulka
manager: nmurav
services: azure-communication-services

ms.author: prakulka
ms.date: 10/05/2020
ms.topic: overview
ms.custom: references_regions
ms.service: azure-communication-services
---
# Plan your telephony and SMS solution

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]


Azure Communication Services allows you to use phone numbers to make voice calls and send SMS messages with the public-switched telephone network (PSTN). In this document, we'll review the phone number types, configuration options, and region availability for planning your telephony and SMS solution using Communication Services.

[!INCLUDE [Emergency Calling Notice](../../includes/emergency-calling-notice-include.md)]


## Phone number types in Azure Communication Services
 
Communication Services offers two types of phone numbers: **local** and **toll-free**. 

### Local numbers
Local (Geographic) numbers are 10-digit telephone numbers consisting of the local area codes in the United States. For example, `+1 (206) XXX-XXXX` is a local number with an area code of `206`. This area code is assigned to the city of Seattle. These phone numbers are generally used by individuals and local businesses. Azure Communication Services offers local numbers in the United States. These numbers can be used to place phone calls, but not to send SMS messages. 

### Toll-free Numbers
Toll-free numbers are 10-digit telephone numbers with distinct area codes that can be called from any phone number free of charge. For example, `+1 (800) XXX-XXXX` is a toll-free number in the North America region. These phone numbers are generally used for customer service purposes. Azure Communication Services offers toll-free numbers in the United states. These numbers can be used to place phone calls and to send SMS messages. Toll-free numbers cannot be used by people and can only be assigned to applications.

#### Choosing a phone number type

If your phone number will be used by an application (for example, to make calls or send messages on behalf of your service), you can select a toll-free or local (geographic) number. You can select a toll-free number if your application is sending SMS messages and/or making calls.

If your phone number is being used by a person (for example, a user of your calling application), the local (geographic) phone number must be used. 

The table below summarizes these phone number types: 

| Phone number type | Example                              | Country availability    | Phone Number Capability |Common use case                                                                                                     |
| ----------------- | ------------------------------------ | ----------------------- | ------------------------|------------------------------------------------------------------------------------------------------------------- |
| Local (Geographic)        | +1 (local area code) XXX XX XX  | US                      | Calling (Outbound) | Assigning phone numbers to users in your applications  |
| Toll-Free         | +1 (toll-free area *code*) XXX XX XX | US                      | Calling (Outbound), SMS (Inbound/Outbound)| Assigning phone numbers to Interactive Voice Response (IVR) systems/Bots, SMS applications                                        |


## Phone number configuration in Azure Communication Services 

For most phone numbers, we allow you to configure an "a la carte" set of capabilities. These capabilities can be selected as you lease your telephone numbers within Azure Communication Services.

The capabilities that are available to you depend on the country that you're operating within, your use case, and the phone number type that you've selected. These capabilities vary by country due to regulatory requirements. Azure Communication Services offers the following phone number capabilities:

- **One-way outbound SMS** This option allows you to send SMS messages to your users. This can be useful in notification and two-factor authentication scenarios. 
- **Two-way inbound and outbound SMS** This option allows you to send and receive messages from your users using phone numbers. This can be useful in customer service scenarios.
- **One-way outbound telephone calling** This option allows you to make calls to your users and configure Caller ID for outbound calls placed by your service. This can be useful in customer service and voice notification scenarios.

## Country/region availability

The following table shows you where you can acquire different types of phone numbers along with the inbound and outbound calling and SMS capabilities associated with these phone number types.

|Number Type| Acquire Numbers In | Make Calls To                                        | Receive Calls From                                    |Send Messages To       | Receive Messages From |
|-----------| ------------------ | ---------------------------------------------------  |-------------------------------------------------------|-----------------------|--------|
| Local (Geographic)  | US                 | US, Canada, United Kingdom, Germany, France,. +more*| US, Canada, United Kingdom, Germany, France,. +more* |Not available| Not available |
| Toll-Free | US                 | US                                                   | US                                                    |US                | US |

*For more details about call destinations and pricing, refer to the [pricing page](../pricing.md).

## Azure Subscriptions eligibility

To acquire a phone number, you need to be on a paid Azure subscription. Phone numbers can't be acquired on trial accounts or by Azure free credits. 

Currently, phone number availability is restricted to Azure subscriptions that have a billing address in the United States.

## Next steps

### Quickstarts

- [Get a phone Number](../../quickstarts/telephony-sms/get-phone-number.md)
- [Place a call](../../quickstarts/voice-video-calling/calling-client-samples.md)
- [Send an SMS](../../quickstarts/telephony-sms/send.md)

### Conceptual documentation

- [Voice and video concepts](../voice-video-calling/about-call-types.md)
- [Call Flows](../call-flows.md)
- [Pricing](../pricing.md)
