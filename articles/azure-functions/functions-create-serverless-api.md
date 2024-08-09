---
title: Customize an HTTP endpoint in Azure Functions
description: Learn how to customize an HTTP trigger endpoint in Azure Functions.
author: mattchenderson
ms.author: mahender
ms.service: azure-functions
ms.topic: how-to
ms.date: 06/27/2024
ms.custom: mvc

#Customer intent: As a developer, I want to customize HTTP trigger endpoints in Azure Functions so that I can build a highly scalable API.
---

# Customize an HTTP endpoint in Azure Functions

In this article, you learn how to build highly scalable APIs with Azure Functions by customizing an HTTP trigger to handle specific actions in your API design. Azure Functions includes a collection of built-in HTTP triggers and bindings, which make it easy to author an endpoint in various languages, including Node.js, C#, and more. You also prepare to grow your API by integrating it with Azure Functions proxies and setting up mock APIs. Because these tasks are accomplished on top of the Functions serverless compute environment, you don't need to be concerned about scaling resources. Instead, you can just focus on your API logic.

[!INCLUDE [functions-legacy-proxies-deprecation](../../includes/functions-legacy-proxies-deprecation.md)]

## Prerequisites

[!INCLUDE [Previous quickstart note](../../includes/functions-quickstart-previous-topics.md)]

After you create this function app, you can follow the procedures in this article.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Customize your HTTP function

By default, you configure your HTTP trigger function to accept any HTTP method. In this section, you modify the function to respond only to GET requests with `/api/hello`. You can use the default URL, `https://<yourapp>.azurewebsites.net/api/<funcname>?code=<functionkey>`:

1. Navigate to your function in the Azure portal. Select **Integration** in the left menu, and then select **HTTP (req)** under **Trigger**.

    :::image type="content" source="./media/functions-create-serverless-api/customizing-http.png" alt-text="Screenshot that shows how to edit the HTTP trigger settings of a function." lightbox="./media/functions-create-serverless-api/customizing-http.png":::

1. Use the HTTP trigger settings as specified in the following table.

    | Field | Sample value | Description |
    |---|---|---|
    | Route template | hello | Determines what route is used to invoke this function |
    | Authorization level | Anonymous | Optional: Makes your function accessible without an API key |
    | Selected HTTP methods | GET | Allows only selected HTTP methods to be used to invoke this function |

    Because a global setting handles the `/api` base path prefix in the route template, you don't need to set it here.

1. Select **Save**.

For more information about customizing HTTP functions, see [Azure Functions HTTP triggers and bindings overview](./functions-bindings-http-webhook.md).

### Test your API

Next, test your function to see how it works with the new API surface:

1. On the **Function** page, select **Code + Test** from the left menu.

1. Select **Get function URL** from the top menu and copy the URL. Confirm that your function now uses the `/api/hello` path.

1. Copy the URL to a new browser tab or your preferred REST client. Browsers use GET by default.

1. Add parameters to the query string in your URL. For example, `/api/hello/?name=John`.

1. Press Enter to confirm that your function is working. You should see the response, "*Hello John*."

1. You can also call the endpoint with another HTTP method to confirm that the function isn't executed. To do so, use one of these HTTP test tools:

[!INCLUDE [api-test-http-request-tools](../../includes/api-test-http-request-tools.md)]

## Proxies overview

In the next section, you surface your API through a proxy. Azure Functions proxies allow you to forward requests to other resources. You define an HTTP endpoint as you would with an HTTP trigger. However, instead of writing code to execute when that endpoint is called, you provide a URL to a remote implementation. Doing so allows you to compose multiple API sources into a single API surface, which is easier for clients to consume, and is useful if you wish to build your API as microservices.

A proxy can point to any HTTP resource, such as:

- Azure Functions
- API apps in [Azure App Service](../app-service/overview.md)
- Docker containers in [App Service on Linux](../app-service/overview.md#app-service-on-linux)
- Any other hosted API

To learn more about Azure Functions proxies, see [Work with legacy proxies].

> [!NOTE]
> Azure Functions proxies is available in Azure Functions versions 1.x to 3.x.

## Create your first proxy

In this section, you create a new proxy, which serves as a frontend to your overall API.

### Set up the frontend environment

Repeat the steps in [Create a function app](./functions-create-function-app-portal.md#create-a-function-app) to create a new function app in which you create your proxy. This new app's URL serves as the frontend for our API, and the function app you previously edited serves as a backend:

1. Navigate to your new frontend function app in the portal.
1. Expand **Settings**, and then select **Environment variables**.
1. Select the **App settings** tab, where key/value pairs are stored.
1. Select **+ Add** to create a new setting. Enter **HELLO_HOST** for its **Name** and set its **Value** to the host of your backend function app, such as `<YourBackendApp>.azurewebsites.net`.

    This value is part of the URL that you copied earlier when you tested your HTTP function. You later reference this setting in the configuration.

    > [!NOTE]
    > It's recommended that you use app settings for the host configuration to prevent a hard-coded environment dependency for the proxy. Using app settings means that you can move the proxy configuration between environments, and the environment-specific app settings will be applied.

1. Select **Apply** to save the new setting. On the **App settings** tab, select **Apply**, and then select **Confirm** to restart the function app.

### Create a proxy on the frontend

1. Navigate back to your front-end function app in the portal.

1. In the left-hand menu, expand **Functions**, select **Proxies**, and then select **Add**.

1. On the **New proxy** page, use the settings in the following table, and then select **Create**.

    | Field | Sample value | Description |
    |---|---|---|
    | Name | HelloProxy | A friendly name used only for management |
    | Route template | /api/remotehello | Determines what route is used to invoke this proxy |
    | Backend URL | https://%HELLO_HOST%/api/hello | Specifies the endpoint to which the request should be proxied |

    :::image type="content" source="./media/functions-create-serverless-api/creating-proxy.png" alt-text="Screenshot that shows the settings in the New proxy page." lightbox="./media/functions-create-serverless-api/creating-proxy.png":::

    Because Azure Functions proxies don't provide the `/api` base path prefix, you must include it in the route template. The `%HELLO_HOST%` syntax references the app setting you created earlier. The resolved URL points to your original function.

1. Try out your new proxy by copying the proxy URL and testing it in the browser or with your favorite HTTP client:
    - For an anonymous function, use:
        `https://YOURPROXYAPP.azurewebsites.net/api/remotehello?name="Proxies"`.
    - For a function with authorization, use:
        `https://YOURPROXYAPP.azurewebsites.net/api/remotehello?code=YOURCODE&name="Proxies"`.

## Create a mock API

Next, you use a proxy to create a mock API for your solution. This proxy allows client development to progress, without needing to fully implement the backend. Later in development, you can create a new function app that supports this logic, and redirect your proxy to it:

1. To create this mock API, create a new proxy, this time using [App Service Editor](https://github.com/projectkudu/kudu/wiki/App-Service-Editor). To get started, navigate to your function app in the Azure portal. Select **Platform features**, and then select **App Service Editor** under **Development Tools**.

   The App Service Editor opens in a new tab.

1. Select `proxies.json` in the left pane. This file stores the configuration for all of your proxies. If you use one of the [Functions deployment methods](./functions-continuous-deployment.md), you maintain this file in source control. For more information about this file, see [Proxies advanced configuration](./legacy-proxies.md#advanced-configuration).

   Your *proxies.json* file should appear as follows:

   ```json
   {
       "$schema": "http://json.schemastore.org/proxies",
       "proxies": {
           "HelloProxy": {
               "matchCondition": {
                   "route": "/api/remotehello"
               },
               "backendUri": "https://%HELLO_HOST%/api/hello"
           }
       }
   }
   ```

1. Add your mock API. Replace your *proxies.json* file with the following code:

   ```json
   {
       "$schema": "http://json.schemastore.org/proxies",
       "proxies": {
           "HelloProxy": {
               "matchCondition": {
                   "route": "/api/remotehello"
               },
               "backendUri": "https://%HELLO_HOST%/api/hello"
           },
           "GetUserByName" : {
               "matchCondition": {
                   "methods": [ "GET" ],
                   "route": "/api/users/{username}"
               },
               "responseOverrides": {
                   "response.statusCode": "200",
                   "response.headers.Content-Type" : "application/json",
                   "response.body": {
                       "name": "{username}",
                       "description": "Awesome developer and master of serverless APIs",
                       "skills": [
                           "Serverless",
                           "APIs",
                           "Azure",
                           "Cloud"
                       ]
                   }
               }
           }
       }
   }
   ```

   This code adds a new proxy, `GetUserByName`, which omits the `backendUri` property. Instead of calling another resource, it modifies the default response from Azure Functions proxies by using a response override. You can also use request and response overrides with a backend URL. This technique is useful when you proxy to a legacy system, where you might need to modify headers, query parameters, and so on. For more information about request and response overrides, see [Modify requests and responses](./legacy-proxies.md#modify-requests-responses).

1. Test your mock API by calling the `<YourProxyApp>.azurewebsites.net/api/users/{username}` endpoint with a browser or your favorite REST client. Replace *{username}* with a string value that represents a username.

## Related content

In this article, you learned how to build and customize an API with Azure Functions. You also learned how to bring multiple APIs, including mock APIS, together as a unified API surface. You can use these techniques to build out APIs of any complexity, all while running on the serverless compute model provided by Azure Functions.

For more information about developing your API:

- [Azure Functions HTTP triggers and bindings overview](./functions-bindings-http-webhook.md)
- [Work with legacy proxies](./legacy-proxies.md)
- [Expose serverless APIs from HTTP endpoints using Azure API Management](./functions-openapi-definition.md)
