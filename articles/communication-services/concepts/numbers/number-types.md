---
title: Phone number types
titleSuffix: An Azure Communication Services article
description: Learn about phone number types you can use to make voice call and send SMS messages in Azure Communication Services.
author: sadas
manager: rcole
services: azure-communication-services

ms.author: sadas
ms.date: 03/04/2022
ms.topic: conceptual
ms.service: azure-communication-services
---

# Number types

Azure Communication Services enables you to use phone numbers to make voice calls and send SMS messages with the public-switched telephone network (PSTN). This article describes the phone number types, region availability, and use cases for planning your telephony and SMS solution using Azure Communication Services.

## Available options

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

Azure Communication Services offers three types of Numbers: Toll-Free, Local, Alphanumeric Sender IDs and Short Codes.

- **To send or receive an SMS**, choose a Toll-Free Number, local number or a Short Code
- **To make or receive phone calls**, choose a Toll-Free Number or a Local Number

This table summarizes the number types and supported capabilities:

| Type | Example | Send SMS | Receive SMS | Make Calls | Receive Calls | Typical Use Case | Restrictions |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| [Toll-Free](../../quickstarts/telephony/get-phone-number.md) | +1 (8AB) XYZ PQRS | Yes | Yes | Yes | Yes | Receive calls on IVR bots, SMS Notifications | SMS in US and CA only |
| [Local (Geographic)](../../quickstarts/telephony/get-phone-number.md) | +1 (ABC) XYZ PQRS | No | No | Yes | Yes | Geography Specific Number | Calling Only |
| [Short-Codes](../../quickstarts/sms/apply-for-short-code.md) | ABC-XYZ | Yes | Yes | No | No | High-velocity SMS | SMS only |
| [Alphanumeric Sender ID](../../quickstarts/sms/enable-alphanumeric-sender-id.md#enable-dynamic-alphanumeric-sender-id) | CONTOSO | Yes | Yes | No | No | High-velocity SMS | SMS only |

## Next steps

For more information about getting or managing phone numbers, see:

- Get a [Toll-Free or Local Phone Number](../../quickstarts/telephony/get-phone-number.md)
- Get a [Short-Code](../../quickstarts/sms/apply-for-short-code.md)
- [Quickstart: Look up operator information for a phone number](../../quickstarts/telephony/number-lookup.md)
