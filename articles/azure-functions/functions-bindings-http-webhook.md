---
title: Azure Functions HTTP triggers and bindings
description: Learn to use HTTP triggers and bindings in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 01/30/2020
ms.author: cshoe
---

# Azure Functions HTTP triggers and bindings overview

This article explains how to work with HTTP triggers and output bindings in Azure Functions.

An HTTP trigger can be customized to respond to [webhooks](https://en.wikipedia.org/wiki/Webhook).

[!INCLUDE [HTTP client best practices](../../includes/functions-http-client-best-practices.md)]

The code in this article defaults to .NET Core syntax, used in Functions version 2.x and higher. For information on the 1.x syntax, see the [1.x functions templates](https://github.com/Azure/azure-functions-templates/tree/v1.x/Functions.Templates/Templates).

## Packages - Functions 1.x

The HTTP bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.Http](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Http) NuGet package, version 1.x. Source code for the package is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/tree/v2.x/src/WebJobs.Extensions.Http) GitHub repository.

[!INCLUDE [functions-package-auto](../../includes/functions-package-auto.md)]

## Packages - Functions 2.x and higher

The HTTP bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.Http](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Http) NuGet package, version 3.x. Source code for the package is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.Http/) GitHub repository.

[!INCLUDE [functions-package](../../includes/functions-package-auto.md)]

## Next steps

[Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
