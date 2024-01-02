---
title: API support in Azure Static Web Apps with Azure Functions
description: Learn how to use Azure Functions with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 06/14/2022
ms.author: cshoe
---

# API support in Azure Static Web Apps with Azure Functions

Front end web applications often call back end APIs for data and services. By default, Azure Static Web Apps provides built-in serverless API endpoints via [Azure Functions](apis-functions.md).

Azure Functions APIs in Static Web Apps are supported by two possible configurations depending on the [hosting plan](plans.md#features):

- **Managed functions**:  By default, the API of a static web app is an Azure Functions application managed and deployed by Azure Static Web Apps associated with some restrictions.

- **Bring your own functions**: Optionally, you can [provide an existing Azure Functions application](functions-bring-your-own.md) of any plan type, which is accompanied by all the features of Azure Functions. With this configuration, you're responsible to handle a separate deployment for the Functions app.

The following table contrasts the differences between using managed and existing functions.

| Feature | Managed Functions | Bring your own Functions |
|---|---|---|
| Access to Azure Functions [triggers and bindings](../azure-functions/functions-triggers-bindings.md#supported-bindings) | HTTP only | All |
| Supported Azure Functions [runtimes](../azure-functions/supported-languages.md#languages-by-runtime-version)<sup>1</sup> | Node.js 12<br>Node.js 14<br>Node.js 16<br>Node.js 18 (public preview)<br>.NET Core 3.1<br>.NET 6.0<br>.NET 7.0<br>Python 3.8<br>Python 3.9<br>Python 3.10 | All |
| Supported Azure Functions [hosting plans](../azure-functions/functions-scale.md) | Consumption | Consumption<br>Premium<br>Dedicated |
| [Integrated security](user-information.md) with direct access to user authentication and role-based authorization data | ✔ | ✔ |
| [Routing integration](./configuration.md?#routes) that makes the `/api` route available to the web app securely without requiring custom CORS rules. | ✔ | ✔ |
| [Durable Functions](../azure-functions/durable/durable-functions-overview.md) programming model | ✕ | ✔ |
| [Managed identity](../app-service/overview-managed-identity.md) | ✕ | ✔ |
| [Azure App Service Authentication and Authorization](../app-service/configure-authentication-provider-aad.md) token management | ✕ | ✔ |
| API functions available outside Azure Static Web Apps | ✕ | ✔ |
| [Key Vault references](../app-service/app-service-key-vault-references.md) | ✕ | ✔ |

<sup>1</sup> To specify the runtime version in managed functions, add a configuration file to your frontend app and set the [`apiRuntime` property](configuration.md#platform). Support is subject to the [Azure Functions language runtime support policy](../azure-functions/language-support-policy.md).

[!INCLUDE [APIs overview](../../includes/static-web-apps-apis-overview.md)]

## Configuration

API endpoints are available to the web app through the `api` route.

| Managed functions | Bring your own functions |
|---|---|
| While the `/api` route is fixed, you have control over the source code folder location of the managed functions app. You can change this location by [editing the workflow YAML file](build-configuration.md) located in your repository's _.github/workflows_ folder. | Requests to the `/api` route are sent to your existing Azure Functions app. |

## Troubleshooting and logs

Logs are only available if you add [Application Insights](monitor.md).

| Managed functions | Bring your own functions |
|---|---|
| Turn on logging by enabling Application Insights on your static web app. | Turn on logging by enabling Application Insights on your Azure Functions app. |

## Constraints

In addition to the Static Web Apps API [constraints](apis-overview.md#constraints), the following restrictions are also applicable to Azure Functions APIs:

| Managed functions | Bring your own functions |
|---|---|
| <ul><li>Triggers and bindings are limited to [HTTP](../azure-functions/functions-bindings-http-webhook.md).</li><li>The Azure Functions app must either be in Node.js 12, Node.js 14, Node.js 16, Node.js 18 (public preview), .NET Core 3.1, .NET 6.0, Python 3.8, Python 3.9 or Python 3.10 .</li><li>Some application settings are managed by the service, therefore the following prefixes are reserved by the runtime:<ul><li>*APPSETTING\_, AZUREBLOBSTORAGE\_, AZUREFILESSTORAGE\_, AZURE_FUNCTION\_, CONTAINER\_, DIAGNOSTICS\_, DOCKER\_, FUNCTIONS\_, IDENTITY\_, MACHINEKEY\_, MAINSITE\_, MSDEPLOY\_, SCMSITE\_, SCM\_, WEBSITES\_, WEBSITE\_, WEBSOCKET\_, AzureWeb*</li></ul></li><li>Some application tags are internally used by the service. Therefore, the following tags are reserved:<ul><li> *AccountId, EnvironmentId, FunctionAppId*.</li></ul></li></ul> | <ul><li>You are responsible to manage the Functions app deployment.</li></ul> |

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
