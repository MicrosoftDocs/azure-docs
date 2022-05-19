---
author: craigshoemaker
ms.service: static-web-apps
ms.topic: include
ms.date: 12/17/2021
ms.author: cshoe
---

It's common for a front-end web app to call backend APIs. By default, Azure Static Web Apps provides built-in serverless API endpoints via [Azure Functions](../articles/static-web-apps/apis.md). If you'd rather expose existing Azure resources as API endpoints in your static web app, Azure Static Web Apps integrates with the following Azure services:

* [Azure Functions](../articles/static-web-apps/apis.md)
* [Azure API Management](../articles/static-web-apps/apis-api-management.md)
* [Azure App Service](../articles/static-web-apps/apis-app-service.md)
* [Azure Container Apps](../articles/static-web-apps/apis-container-apps.md)
* [Azure Logic Apps](../articles/static-web-apps/apis-logic-apps.md)

Key features of integrated APIs include:

- **Integrated security** with direct access to user [authentication and role-based authorization](../articles/static-web-apps/user-information.md) data.
- **Seamless routing** that makes the */api* route available to the front-end web app without requiring custom CORS rules.

Each static web app environment can be configured with one type of backend API at a time. You can use the built-in, managed Azure Functions APIs, or you can integrate with one of the supported Azure services.

> [!NOTE]
> Backend APIs integration with other Azure services is only available in the Azure Static Web Apps Standard plan. Built-in, managed Azure Functions APIs are available in all Azure Static Web Apps plans.