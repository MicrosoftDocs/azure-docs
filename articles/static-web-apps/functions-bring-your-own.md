---
title: Bring your own functions to Azure Static Web Apps
description: Use an existing Azure Functions app with your Azure Static Web Apps site.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 05/07/2021
ms.author: cshoe
---

# Bring your own functions to Azure Static Web Apps

Azure Static Web Apps APIs are supported by two possible configurations:

- **Managed functions**:  By default, the API of a static web app is an Azure Functions application managed and deployed by Azure Static Web Apps associated with some restrictions.

- **Bring your own functions**: Optionally, you can provide an existing Azure Functions application, which is accompanied by all the features of Azure Functions. With this configuration, you're responsible to handle a separate deployment for the Functions app.

The following table contrasts the differences between using managed and existing functions.

| Feature | Managed Functions | Bring your own Functions |
| --- | --- | --- |
| Access to [HTTP trigger and input/output bindings](../azure-functions/functions-triggers-bindings.md) | ✔ | ✔ |
| [Integrated security](user-information.md) with direct access to user authentication and role-based authorization data | ✔ | ✔ |
| [Routing integration](./configuration.md?#routes) that makes the _api_ route available to the web app securely without requiring custom CORS rules. | ✔ | ✔ |
| [Azure Functions Premium plan](../azure-functions/functions-premium-plan.md) | | ✔ |
| [Durable Functions](../azure-functions/durable/durable-functions-overview.md) programming model | | ✔ |
| [Managed identity](../app-service/overview-managed-identity.md) | | ✔ |
| [Azure App Service Authentication and Authorization](../app-service/configure-authentication-provider-aad.md) token management | | ✔ |
| [Custom handlers](../azure-functions/functions-custom-handlers.md) | | ✔ |
| API functions available outside Azure Static Web Apps |  | ✔ |
| Access to all Azure Functions [triggers and bindings](../azure-functions/functions-triggers-bindings.md) | | ✔ |

## Link an existing Azure Functions app

Before you associate an existing Functions app, you first need to adjust to configuration of your static web app.

1. Blank out the `api_location` value in the [workflow configuration](./github-actions-workflow.md) file.

1. Open your Static Web Apps instance in the [Azure portal](https://portal.azure.com).

1. From the _Settings_ menu, select **Functions**.

1. From the _Environment_ dropdown, select **Production**.

1. Next to the _Functions source_ label, select **Link to a Function app**.

1. From the _Subscription_ dropdown, select your Azure subscription name.

1. From the _Function App_ dropdown, select the name of the existing Functions app you want to link to your static web app.

1. Select the **Link** button.

    :::image type="content" source="media/functions-bring-your-own/azure-static-web-apps-link-existing-functions-app.png" alt-text="Link an existing Functions app":::

## Deployment

You're responsible for setting up a [deployment workflow](../azure-functions/functions-deployment-technologies.md) for your Azure Functions app.

## Security constraints

The only supported Azure App Service Authentication and authorization provider is version 2.

If authentication and authorization policies aren't already set up on your existing Functions app, then the static web app has exclusive access to the API. To make your Functions app accessible to other applications, add another identity provider or change the security settings to allow unauthenticated access.

## Restrictions

- Only one Azure Functions app is available to a single static web app.
- The `api_location` value in the [workflow configuration](./github-actions-workflow.md) must be blank.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
