---
title: Configure retry options with Azure Storage management library for .NET
titleSuffix: Azure Storage
description: Learn how to configure retry options with Azure Storage management library for .NET
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-storage
ms.topic: how-to
ms.date: 11/07/2024
ms.devlang: csharp
ms.custom: template-how-to, devguide-csharp, devx-track-dotnet
---

# Configure retry options with the Azure Storage management library for .NET

In this article, you learn how to configure retry options for an application that calls management plane APIs. The scale targets are different between the Storage resource provider and the data plane, so it's important to configure retry options based on where the request is being sent.

When you reach the limit, you receive the HTTP status code 429 Too many requests. The response includes a Retry-After value, which specifies the number of seconds your application should wait (or sleep) before sending the next request. If you send a request before the retry value elapses, your request isn't processed and a new retry value is returned.

```csharp
response.Headers.GetValues("x-ms-ratelimit-remaining-subscription-reads").GetValue(0)
```