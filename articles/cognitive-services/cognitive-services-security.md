---
title: Cognitive Services Security
titleSuffix: Azure Cognitive Services
description: Learn about the various security considerations for Cognitive Services usage.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 03/13/2020
ms.author: dapine
---

# Introduction

## Transport Layer Security (TLS)

All of the Cognitive Services endpoints exposed over HTTP enforce TLS 1.2. With an enforced security protocol, consumers attempting to call a Cognitive Services endpoint should adhere to guidelines:

* The client Operating System (OS) would need to support TLS 1.2
* The language (and platform) used to make the HTTP call would need to specify TLS 1.2 as part of the request
    * Depending on the language and platform, this can be done either implicitly or explicitly

For .NET users, consider the <a href="https://docs.microsoft.com/dotnet/framework/network-programming/tls" target="_blank">Transport Layer Security best practices <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

## Authentication

## Environment variables and application configuration

## Next steps

* Explore the various [Cognitive Services](welcome.md)
* Learn more about [Cognitive Services Virtual Networks](cognitive-services-virtual-networks.md)
