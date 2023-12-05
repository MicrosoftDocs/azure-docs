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

Azure Communication Services Number Lookup is part of the Phone Numbers SDK. It can be used for your applications to add additional checks before sending an SMS or placing a call.

## Number Lookup SDK capabilities

The following list presents the set of features which are currently available in our SDKs.

| Group of features | Capability                                                                            | .NET  | JS | Java | Python |
| ----------------- | ------------------------------------------------------------------------------------- | --- | ---- | ---- | ------ |
| Core Capabilities | Get Number Type                                                          | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Get Carrier registered name                                         | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Get associated Mobile Network Code, if available (two or three decimal digits used to identify network operator within a country) | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Get associated Mobile Country Code, if available (three decimal digits used to identify the country of a mobile operator) | ✔️   | ✔️    | ✔️    | ✔️      |
|                   | Get associated ISO Country Code | ✔️   | ✔️    | ✔️    | ✔️      |
| Phone Number      | All number types in E164 format                                      | ✔️   | ✔️    | ✔️    | ✔️      |


## Next steps

> [!div class="nextstepaction"]
> [Get started with Number Lookup API](../../quickstarts/telephony/number-lookup.md)

- [Number Lookup Concept](../numbers/number-lookup-concept.md)
