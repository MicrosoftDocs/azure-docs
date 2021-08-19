---
title: API support in Azure Static Web Apps with Azure Functions
description: Learn what API features Azure Static Web Apps supports
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 05/18/2020
ms.author: cshoe
---

# API support in Azure Static Web Apps with Azure Functions

Azure Static Web Apps provides serverless API endpoints via [Azure Functions](../azure-functions/functions-overview.md). By using Azure Functions, APIs dynamically scale based on demand, and include the following features:

- **Integrated security** with direct access to user [authentication and role-based authorization](user-information.md) data.

- **Seamless routing** that makes the _api_ route available to the web app securely without requiring custom CORS rules.

Azure Static Web Apps APIs are supported by two possible configurations:

- **Managed functions**:  By default, the API of a static web app is an Azure Functions application managed and deployed by Azure Static Web Apps associated with some restrictions.

- **Bring your own functions**: Optionally, you can [provide an existing Azure Functions application](functions-bring-your-own.md) of any plan type, which is accompanied by all the features of Azure Functions. With this configuration, you're responsible to handle a separate deployment for the Functions app.

The following table contrasts the differences between using managed and existing functions.

| Feature | Managed Functions | Bring your own Functions |
| --- | --- | --- |
| Access to Azure Functions [triggers](../azure-functions/functions-triggers-bindings.md#supported-bindings) | Http only | All |
| Supported Azure Functions [runtimes](../azure-functions/supported-languages.md#languages-by-runtime-version) | Node.js 12<br>.NET Core 3.1<br>Python 3.8 | All |
| Supported Azure Functions [hosting plans](../azure-functions/functions-scale.md) | Consumption | Consumption<br>Premium<br>Dedicated |
| [Integrated security](user-information.md) with direct access to user authentication and role-based authorization data | ✔ | ✔ |
| [Routing integration](./configuration.md?#routes) that makes the _api_ route available to the web app securely without requiring custom CORS rules. | ✔ | ✔ |
| [Durable Functions](../azure-functions/durable/durable-functions-overview.md) programming model | | ✔ |
| [Managed identity](../app-service/overview-managed-identity.md) | | ✔ |
| [Azure App Service Authentication and Authorization](../app-service/configure-authentication-provider-aad.md) token management | | ✔ |
| API functions available outside Azure Static Web Apps |  | ✔ |

## Configuration

API endpoints are available to the web app through the _api_ route.

| Managed functions | Bring your own functions |
| --- | --- |
| While the _api_ route is fixed, you have control over the folder location of the managed functions app. You can change this location by [editing the workflow YAML file](github-actions-workflow.md#build-and-deploy) located in your repository's _.github/workflows_ folder. | Requests to the _api_ route are sent to your existing Azure Functions app. |

## Troubleshooting and logs

Logs are only available if you add [Application Insights](monitor.md).

| Managed functions | Bring your own functions |
| --- | --- |
| Turn on logging by enabling Application Insights on your static web app. | Turn on logging by enabling Application Insights on your Azure Functions app. |

## Constraints

- The API route prefix must be _api_.
- Route rules for API functions only support [redirects](configuration.md#defining-routes) and [securing routes with roles](configuration.md#securing-routes-with-roles).

| Managed functions | Bring your own functions |
| --- | --- |
| <ul><li>Triggers are limited to [HTTP](../azure-functions/functions-bindings-http-webhook.md).</li><li>The Azure Functions app must either be in Node.js 12, .NET Core 3.1, or Python 3.8.</li><li>Some application settings are managed by the service, therefore the following prefixes are reserved by the runtime:<ul><li>*APPSETTING\_, AZUREBLOBSTORAGE\_, AZUREFILESSTORAGE\_, AZURE_FUNCTION\_, CONTAINER\_, DIAGNOSTICS\_, DOCKER\_, FUNCTIONS\_, IDENTITY\_, MACHINEKEY\_, MAINSITE\_, MSDEPLOY\_, SCMSITE\_, SCM\_, WEBSITES\_, WEBSITE\_, WEBSOCKET\_, AzureWeb*</li></ul></li></ul> | <ul><li>You are responsible to manage the Functions app deployment.</li></ul> |

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
