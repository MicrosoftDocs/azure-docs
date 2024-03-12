---
title: Try phone calling - Azure Communication Services
description: Confirm a phone number can connect without an app or other code.
author: boris-bazilevskiy
manager: dacarte
services: azure-communication-services

ms.author: boris.bazilevskiy
ms.date: 03/13/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: pstn
---

# Try Phone Calling

Try Phone Calling, now in public preview, is a tool in Azure portal to help customers confirm the setup of a telephony connection by making a phone call. It applies to both Voice Calling (PSTN) and direct routing. Try Phone Calling enables developers to quickly test Azure Communication Services calling capabilities, without an existing app or code on their end.

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/).
- Create an Azure Communication Services resource. For details, see Create an [Azure Communication Resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource) You can record your resource *connection string* for this sample, or let the tool get it for you.
- A calling-enabled telephone number, as described in [Get a phone number](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/telephony/get-phone-number?tabs=windows&amp;pivots=platform-azp).

## Overview

From the Try Phone Calling feature in [Preview Portal](https://preview.portal.azure.com/#home) **or ???** can type a phone number, select a caller ID for this call, and the tool generates the code. You can also select **Use my connection string** and Try Phone Calling automatically gets the *connection string* for the resource.

![al text](../media/try-phone-calling.png "Make a phone call")

You can run generated code right from the tool page and see the status of the call. You can also copy the generated code into an application and enrich it with other Azure Communication Services features such as chat, video, and SMS.

## Next steps

See [Preview Portal](https://preview.portal.azure.com/#home) **or ???**
