---
author: craigshoemaker
ms.service: static-web-apps
ms.topic: include
ms.date: 12/17/2021
ms.author: cshoe
---

It's common for a front-end web app to call backend APIs. By default, Azure Static Web Apps provides built-in serverless API endpoints via [Azure Functions](apis.md). If you prefer to expose existing Azure resources as API endpoints in your static web app, Azure Static Web Apps also integrates with the following Azure services:

* [Azure Functions](apis.md)
* [Azure API Management](apis-api-management.md)
* [Azure Container Apps](apis-container-apps.md)
* [Azure Logic Apps](apis-logic-apps.md)
* [Azure Web Apps](apis-web-apps.md)

Key features of integrated APIs include:

- **Integrated security** with direct access to user [authentication and role-based authorization](user-information.md) data.

- **Seamless routing** that makes the _api_ route available to the web app securely without requiring custom CORS rules.