---
title: API support in Azure Static Web Apps with Azure Functions
description: Learn what about the support and features of Azure Static Web Apps APIs
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 05/08/2020
ms.author: cshoe
---

# API support in Azure Static Web Apps with Azure Functions

Azure Static Web Apps provides serverless API endpoints via [Azure Functions](../azure-functions/functions-overview.md). By leveraging Azure Functions, APIs dynamically scale based on demand, and include the following features:

- **Integrated security** with direct access to [user authentication data](user-information.md).
- **Seamless routing** that makes the _api_ route available to the web app without requiring custom CORS rules.
- **Azure Functions v3.x** running Node.js 12.x.
- **HTTP triggers** and output bindings.

## Constraints

- The API route prefix is must be _api_.
- Triggers and bindings are limited to [HTTP](../azure-functions/functions-bindings-http-webhook).
  - All other [Azure Functions triggers and bindings](../azure-functions/functions-triggers-bindings#supported-bindings) are restricted.

## Next steps

> [!div class="nextstepaction"]
> [Add API](add-api.md)