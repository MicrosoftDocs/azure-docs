---
title: Secure an ASP.NET web API using Microsoft Entra
description: Learn how to secure a web API registered in customer's tenant using Microoft Entra
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/10/2023
ms.custom: developer

#Customer intent: As a dev, I want to secure my web API registered in the customer's tenant using Microsoft Entra.
---

# Secure an ASP.NET web API by using Microsoft Entra

Web APIs may contain sensitive information that requires user authentication and authorization. Microsoft identity platform provides capabilities for you to protect your web API against unauthorized access. Applications can use delegated access, acting on behalf of a signed-in user, or app-only access, acting only as the application's own identity when calling protected web APIs.

## Prerequisites

- [An API registration](how-to-register-ciam-app.md?tabs=webapi&preserve-view=true) that exposes scopes (permissions) such as *ToDoList.Read*. If you haven't already, register an API in the Microsoft Entra admin center by following the registration steps.

## Protecting a web API

The following are the steps you complete to protect your web API:

1. [Register your web API](how-to-register-ciam-app.md?tabs=webapi) in the Microsoft Entra admin center.
1. [Configure your web API](how-to-protect-web-api-dotnet-core-prepare-api.md).
1. [Protect your web API endpoints](how-to-protect-web-api-dotnet-core-protect-endpoints.md).
1. [Test your protected web API](how-to-protect-web-api-dotnet-core-test-api.md).

## Next steps

> [!div class="nextstepaction"]
> [Configure your web API >](how-to-protect-web-api-dotnet-core-prepare-api.md)
