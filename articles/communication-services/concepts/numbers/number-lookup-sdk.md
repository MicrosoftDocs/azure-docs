---
title: Number Lookup SDK overview for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the Number Lookup SDK and its offerings.
author: henikaraa
manager: rcole
services: azure-communication-services

ms.author: henikaraa
ms.date: 05/02/2023
ms.topic: conceptual
ms.service: azure-communication-services
---

# Number Lookup SDK overview

[!INCLUDE [Private Preview Notice](../../includes/public-preview-include.md)]

Azure Communication Services Number Lookup is part of the Phone Numbers SDK. You can use Number Lookup in your application to check numbers before sending an SMS or placing a call.

## Number Lookup SDK capabilities

The following list presents the set of features available in our SDKs.

| Group of features | Capability | .NET  | JS | Java | Python |
| --- | --- | --- | --- | --- | --- |
| Core capabilities | Get number format | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Get number type   | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Get carrier registered name | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Get associated mobile network code, if available (two or three decimal digits used to identify network operator within a country or region) | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Get associated mobile country code, if available (three decimal digits used to identify the country or region of a mobile operator) | ✔️ | ✔️ | ✔️ | ✔️ |
|                   | Get associated ISO country code | ✔️ | ✔️ | ✔️ | ✔️ |
| Phone Number      | All number types in E164 format | ✔️ | ✔️ | ✔️ | ✔️ |

## Next steps

> [!div class="nextstepaction"]
> [Get started with Number Lookup API](../../quickstarts/telephony/number-lookup.md)

- [Number Lookup Concept](../numbers/number-lookup-concept.md)
