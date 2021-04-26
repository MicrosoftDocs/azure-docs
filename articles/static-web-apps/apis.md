---
title: API support in Azure Static Web Apps with Azure Functions
description: Learn what API features Azure Static Web Apps supports
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 05/08/2020
ms.author: cshoe
---

# API support in Azure Static Web Apps Preview with Azure Functions

Azure Static Web Apps provides serverless API endpoints via [Azure Functions](../azure-functions/functions-overview.md). By leveraging Azure Functions, APIs dynamically scale based on demand, and include the following features:

- **Integrated security** with direct access to user [authentication and role-based authorization](user-information.md) data.
- **Seamless routing** that makes the _api_ route available to the web app securely without requiring custom CORS rules.
- **HTTP triggers** and input/output bindings.

## Configuration

API endpoints are available to the web app through the _api_ route. While this route is fixed, you have control over the folder and project where you locate the associated Azure Functions app. You can change this location by [editing the workflow YAML file](github-actions-workflow.md#build-and-deploy) located in your repository's _.github/workflows_ folder.

## Constraints

Azure Static Web Apps provides an API through Azure Functions. The capabilities of Azure Functions are focused to a specific set of features that enable you to create an API for a web app and allow the web app to connect to API securely. These features come with some constraints, including:

- The API route prefix must be _api_.
- The API must either be a Node.js 12, .NET Core 3.1, or Python 3.8 Azure Functions app.
- Route rules for API functions only support [redirects](routes.md#redirects) and [securing routes with roles](routes.md#securing-routes-with-roles).
- Triggers are limited to [HTTP](../azure-functions/functions-bindings-http-webhook.md).
  - Input and output [bindings](../azure-functions/functions-triggers-bindings.md#supported-bindings) are supported.
- Logs are only available if you add [Application Insights](../azure-functions/functions-monitoring.md) to your Functions app.
- Some application settings are managed by the service. Therefore, you can't configure app settings that start with the following prefixes:
	- `APPSETTING_`
	- `AZUREBLOBSTORAGE_`
	- `AZUREFILESSTORAGE_`
	- `AZURE_FUNCTION_`
	- `CONTAINER_`
	- `DIAGNOSTICS_`
	- `DOCKER_`
	- `FUNCTIONS_`
	- `IDENTITY_`
	- `MACHINEKEY_`
	- `MAINSITE_`
	- `MSDEPLOY_`
	- `SCMSITE_`
	- `SCM_`
	- `WEBSITES_`
	- `WEBSITE_`
	- `WEBSOCKET_`
	- `AzureWeb`

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
