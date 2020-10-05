---
title: Plan your Azure Communication Services telephony and SMS solution
titleSuffix: An Azure Communication Services concept document
description: Learn how to effectively plan your use of phone numbers and telephony.
author: prakulka
manager: nmurav
services: azure-communication-services

ms.author: stkozak
ms.date: 10/05/2020
ms.topic: overview
ms.service: azure-communication-services
---
# Plan your telephony and SMS solution

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]


In this document, we'll review the phone number types, plans, and country/region availability for planning your telephony and SMS solution through Azure Communication Services.

## Phone number types in Azure Communication Services
Azure Communication Services allows you to use phone numbers to make voice calls with traditional phone network (PSTN) and send and/or receive SMS messages. 

There are two phone number types that you can choose from: **local** and **toll-free**. 

### Local Numbers
Local (Geographic) numbers are 10-digit telephone numbers consisting of the local area codes in US. For example, +1 (206) XXX-XXXX, area code 206 is assigned to city of Seattle, Bainbridge Island and Vashon Island. These phone numbers are generally used by individuals and local businesses. Azure Communication Services offers geographic numbers in US. These numbers can be used with the calling capability. 

### Toll-Free Numbers
Toll-free numbers are 10-digit telephone numbers with distinct area codes that can be called from any phone number free of charge. For example, +1 (800) XXX-XXXX, is a toll free number in North America region. These phone numbers are generally used for customer service purposes. Azure Communication Services offers toll-free numbers in US. These numbers can be used with calling and/or SMS capability. 

If your phone number will be used by an application (for example, to make calls or send messages on behalf of your service), you can select a toll-free or local (geographic) number. You can select a toll-free number if your application is sending SMS messages and/or making calls. 

If your phone number is being used by a person (for example, a user of your calling application), the local (geographic) phone number can be used. 

Note that geographic numbers can be used to make calls but not to send SMS messages. Toll-free numbers cannot be used by people and can only be assigned to applications.

The table below summarizes these phone number types: 

| Phone number type | Example                              | Country availability    | Phone Number Capability |Common use case                                                                                                     |
| ----------------- | ------------------------------------ | ----------------------- | ------------------------|------------------------------------------------------------------------------------------------------------------- |
| Local (Geographic)        | +1 (local area code) XXX XX XX  | US                      | Calling (Outbound) | Assigning phone numbers to users in your applications  |
| Toll-Free         | +1 (toll-free area *code*) XXX XX XX | US                      | Calling (Outbound), SMS (Inbound/Outbound)| Assigning phone numbers to Interactive Voice Response (IVR) systems/Bots, SMS applications                                        |

Now, let's review the phone number plans available through Communication Services. 

## Phone number plans in Azure Communication Services 
For most phone numbers, we allow you to configure an "a la carte" set of plans. Some developers only need an outbound calling plan; some might opt for outbound calling and outbound SMS plans. These plans can be selected as you lease your telephone numbers within Azure Communication Services.

The plans that are available to you depend on the country that you're operating within, your use case, and the phone number type that you've selected.

Let’s look at the plans you can enable for your phone numbers. These plans vary by country due to regulatory requirements. Azure Communication Services offers the following plans:

- **One-way outbound SMS** This plan allows you to send SMS to your users. This plan is useful for scenarios like notifications and two-factor authentication alerts. 
- **Two-way inbound and outbound SMS** This plan allows you to send and receive messages from your users using phone numbers. This plan is useful scenarios like customer service.
- **One-way outbound PSTN calling** This plan allows you to make calls to your users and configure Caller ID for outbound calls placed by your service. This plan enables scenarios like customer service.

## Country/Region availability

The following table shows you where you can acquire different types of phone numbers along with the inbound and outbound calling and SMS capabilities associated with these phone number types.

|Number Type| Acquire Numbers In | Make Calls To                                        | Receive Calls From                                    |Send Messages To       | Receive Messages From |
|-----------| ------------------ | ---------------------------------------------------  |-------------------------------------------------------|-----------------------|--------|
| Local (Geographic)  | US                 | US, Canada, United Kingdom, Germany, France,. +more*| US, Canada, United Kingdom, Germany, France,. +more* |Not available| Not available |
| Toll-Free | US                 | US                                                   | US                                                    |US                | US |

*For more details about call destinations and pricing, refer to the [pricing page](../pricing.md).

## Azure Subscriptions eligibility

To acquire a phone number, you need to be on paid Azure subscription. You cannot get a phone number for PSTN or SMS on a trial account. 

## Next steps

### Quickstarts

- [Get a phone Number](../../quickstarts/telephony-sms/get-phone-number.md)
- [Place a call](../../quickstarts/voice-video-calling/calling-client-samples.md)
- [Send an SMS](../../quickstarts/telephony-sms/send.md)

### Conceptual documentation

- [Voice and video concepts](../voice-video-calling/about-call-types.md)
- [Call Flows](../call-flows.md)
- [Pricing](../pricing.md)
