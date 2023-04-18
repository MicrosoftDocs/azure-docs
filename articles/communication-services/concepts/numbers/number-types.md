---
title: Number Type concepts in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Number Type concepts.
author: sadas
manager: rcole
services: azure-communication-services

ms.author: sadas
ms.date: 03/04/2022
ms.topic: conceptual
ms.service: azure-communication-services
---

# Number types

Azure Communication Services allows you to use phone numbers to make voice calls and send SMS messages with the public-switched telephone network (PSTN). In this document, we'll review the phone number types, region availability, and use cases for planning your telephony and SMS solution using Communication Services.

## Available options

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

Azure Communication Services offers three types of Numbers: Toll-Free, Local, and Short Codes.

- **To send or receive an SMS**, choose a Toll-Free Number or a Short Code
- **To make or receive phone calls**, choose a Toll-Free Number or a Local Number

The table below summarizes these number types with supported capabilities:

| Type                                                                  | Example           | Send SMS | Receive SMS | Make Calls | Receive Calls | Typical Use Case                             | Restrictions   |
| :-------------------------------------------------------------------- | :---------------- | :------: | :---------: | :--------: | :-----------: | :------------------------------------------- | :------------- |
| [Toll-Free](../../quickstarts/telephony/get-phone-number.md)          | +1 (8AB) XYZ PQRS |   Yes    |     Yes     |    Yes     |      Yes      | Receive calls on IVR bots, SMS Notifications | SMS in US and CA only |
| [Local (Geographic)](../../quickstarts/telephony/get-phone-number.md) | +1 (ABC) XYZ PQRS |    No    |     No      |    Yes     |      Yes      | Geography Specific Number                    | Calling Only   |
| [Short-Codes](../../quickstarts/sms/apply-for-short-code.md)          | ABC-XYZ           |   Yes    |     Yes     |     No     |      No       | High-velocity SMS                            | SMS only       |

## Next steps

For additional information about getting or managing phone numbers please see the following pages:

- Get a [Toll-Free or Local Phone Number](../../quickstarts/telephony/get-phone-number.md)
- Get a [Short-Code](../../quickstarts/sms/apply-for-short-code.md)
