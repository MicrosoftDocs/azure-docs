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

- **Integrated security** with direct access to user [authentication and role-based authorization](user-information.md) data.
- **Seamless routing** that makes the _api_ route available to the web app without requiring custom CORS rules.
- **Azure Functions** running Node.js.
- **HTTP triggers** and output bindings.

## Configuration

API endpoints are available to the web app through the _api_ route. While this route is fixed, you have control over the folder where you locate the associated Azure Functions app. You can change this location by editing the workflow YAML file located in your repository's _.github/workflows_ folder.

Set the the following location's value to the desired folder location for the API app in your repository.

```schema
jobs
└── steps
  └── with
    └── api_location
```

## Constraints

Azure Static Web Apps provides an API through Azure Functions. The capabilities of Azure Functions are focused to a specific set of features that enable you to create an API for a web app and allow the web app to connect to API securely. These features come with some constraints, including:

- The API route prefix is must be _api_.
- Triggers and bindings are limited to [HTTP](../azure-functions/functions-bindings-http-webhook.md).
  - All other [Azure Functions triggers and bindings](../azure-functions/functions-triggers-bindings.md#supported-bindings) are restricted.

## Next steps

> [!div class="nextstepaction"]
> [Add API](add-api.md)
