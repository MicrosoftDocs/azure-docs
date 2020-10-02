---
title: Plan your Azure Communication Services telephony and SMS solution
titleSuffix: An Azure Communication Services concept document
description: Learn how to effectively plan your use of phone numbers and telephony.
author: stkozak
manager: rampras
services: azure-communication-services

ms.author: stkozak
ms.date: 06/23/2020
ms.topic: overview
ms.service: azure-communication-services
---
# Plan your telephony and SMS solution

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]


In this document, we'll review the decision flows that you can use to select phone number types, plans, and capabilities made available through Azure Communication Services.

## Acquiring phone numbers in Azure Communications Services

Azure Communication Services allows you to use phone numbers to place and receive telephony calls and SMS messages. These phone numbers can be used to configure caller ID for outbound calls placed by your service.

There are two phone number types that you can choose from: **geographic** and **toll-free**. If your phone number will be used by an application (for example, to make calls or send messages on behalf of your service), you can select a toll-free or geographic number. You can select a toll-free number if your application is sending SMS messages and/or making calls. 

If your phone number is being used by a person (for example, a user of your calling application), the geographic phone number can be used. Note that geographic numbers can be used to make calls but not to send SMS messages. Toll-free numbers cannot be used by people and can only be assigned to applications.

Now, let's review these phone number types and capabilities available through Communication Services. 

## Phone numbers and capabilities

For most phone numbers, we allow you to configure an "a la carte" set of plans. Some developers only need an outbound calling plan; some might opt for outbound calling and outbound SMS plans. These plans can be selected as you lease your telephone numbers within Azure Communication Services.

The plans that are available to you depending on the country that you're operating within, your use case, and the phone number type that you've selected:	

:::image type="content" source="../media/plan-solution/sample-decision-flow.PNG" alt-text="Diagram showing sample decision flow.":::

<!-- Tami/team have rejected this multiple times despite updates, says it needs to be higher res - need to work with her to get approval for this image. Commenting out to move our staging forward. :::image type="content" source="../../media/example-decision-flow.png" alt-text="Example for the decision flow"::: -->

<!-- Before you can select a phone number type, let’s review the international phone numbering plan.

### Optional reading. International public telecommunication numbering plan (E.164)

> [!NOTE]
> We recommend reviewing this information even if you are familiar with the E.164 phone numbering plan to better understand the number types and capabilities offered by Azure Communication Services direct offer.

The international public telecommunication numbering plan is defined in The International Telecommunication Union (ITU) recommendation E.164. Conforming numbers are limited to a maximum of 15 digits.

The phone number consists of

-	A prefix “+”
-	An international dialing prefix or country/region code (one, two or three digits) 
-	*(Optional)* A national destination code or numbering plan, commonly referred to as an area code. The length of this code depends on the country. In the United States, it's three digits. In Australia and New Zealand, it's one digit. Germany, Japan, Mexico, and some other countries have variable lengths of the area codes. For example, in Germany, the area code can be anywhere from two to five digits, while in Japan it can be anywhere from one to five digits.
-	A subscriber number

> [!NOTE]
> The classification above does not fully conform to the ITU E.164 standard and intended to provide a simplified description. For example, the subscriber number is subdivided within the standard. If you're interested in learning about the international numbering plan more deeply, the [ITU E.164 standard](https://www.itu.int/rec/T-REC-E.164) is an excellent place to start.  

Here are some examples that will help you better understand the numbering plan:

A regional phone number in the US:

:::image type="content" source="../media/plan-solution/regional-us.png" alt-text="Example of a regional phone number in the US":::

A regional phone number in Canada:

:::image type="content" source="../media/plan-solution/regional-canada.png" alt-text="Example of a regional phone number in Canada":::

A toll-free number in North America region:

:::image type="content" source="../media/plan-solution/tollfree-us.png" alt-text="Example of a toll free number in North America":::

A mobile phone number in the UK:

:::image type="content" source="../media/plan-solution/mobile-uk.png" alt-text="Example of a mobile number in the UK"::: -->

Next, let's review specific phone number types available in Azure Communication Services.

## Phone number types in Azure Communication Services

Microsoft offers regional and toll-free plans for numbers in US.

The table below summarizes these phone number types: 

| Phone number type | Example                              | Country availability    | Phone Number Capability |Common use case                                                                                                     |
| ----------------- | ------------------------------------ | ----------------------- | ------------------------|------------------------------------------------------------------------------------------------------------------- |
| Geographic        | +1 (local area code) XXX XX XX  | US                      | PSTN Calling (Outbound) | Assigning phone numbers to users in your applications  |
| Toll-Free         | +1 (toll-free area *code*) XXX XX XX | US                      | PSTN Calling (Outbound), SMS (Inbound/Outbound)| Assigning phone numbers to Interactive Voice Response (IVR) systems/Bots, SMS applications                                        |

### Geographic Numbers
Geographic numbers are 10-digit telephone numbers consisting of the local area codes in US. These phone numbers are generally used by individuals and local businesses. Azure Communication Services offers geographic numbers in US. These numbers can be used with the calling capability. For example, +1 (206) XXX-XXXX, area code 206 is assigned to city of Seattle, Bainbridge Island and Vashon Island.

### Toll-Free Numbers
Toll-free numbers are 10-digit telephone numbers with distinct area codes that can be called from any phone number free of charge. These are generally used for customer service purposes. 

## Plans 

Let’s look at the capabilities you can enable for your phone numbers. These capabilities vary by country due to regulatory requirements. Azure Communication Services offers the following capabilities:

- **One-way outbound SMS** This plan allows you to send SMS to your users using phone numbers acquired in your Azure Communication Services resource. This plan is useful for scenarios like notifications and two-factor authentication alerts. 
- **Two-way inbound and outbound SMS** This plan allows you to send and receive messages from your users using phone numbers acquired in your Azure Communication Services resource. This plan is useful scenarios like customer service.
- **One-way outbound PSTN calling** This plan allows you to make calls to your users and configure Caller ID for outbound calls placed by your service. This plan enables scenarios like customer service.

## Country/Region availability

The following table shows you where you can acquire different types of phone numbers along with the inbound and outbound calling and SMS capabilities associated with these phone number types.

|Number Type| Acquire Numbers In | Make Calls To                                        | Receive Calls From                                    |Send Messages To  |
|-----------| ------------------ | ---------------------------------------------------  |-------------------------------------------------------|------------------|
| Regional  | US                 | US, Canada, United Kingdom, Germany, France,.. +more*| US, Canada, United Kingdom, Germany, France,.. +more* |NA                |
| Toll-Free | US                 | US                                                   | US                                                    |US                |

*For more details about call destinations and pricing, refer to the [pricing page](../pricing.md).

## Next steps

### Quickstarts

- [Get a phone Number](../../quickstarts/telephony-sms/get-phone-number.md)
- [Place a call](../../quickstarts/voice-video-calling/calling-client-samples.md)
- [Send an SMS](../../quickstarts/telephony-sms/send.md)

### Conceptual documentation

- [Voice and video concepts](../voice-video-calling/about-call-types.md)
- [Call Flows](../call-flows.md)
- [Pricing](../pricing.md)
