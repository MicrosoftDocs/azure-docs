---
title: Customize an HTTP endpoint in Azure Functions
description: Learn how to customize an HTTP trigger endpoint in Azure Functions
author: mattchenderson
ms.topic: conceptual
ms.date: 04/27/2020
ms.author: mahender
ms.custom: mvc
---

# Customize an HTTP endpoint in Azure Functions

In this article, you learn how Azure Functions allows you to build highly scalable APIs. Azure Functions comes with a collection of built-in HTTP triggers and bindings, which make it easy to author an endpoint in various languages, including Node.js, C#, and more. In this article, you'll customize an HTTP trigger to handle specific actions in your API design. You'll also prepare for growing your API by integrating it with Azure Functions Proxies and setting up mock APIs. These tasks are accomplished on top of the Functions serverless compute environment, so you don't have to worry about scaling resources - you can just focus on your API logic.

[!INCLUDE [functions-legacy-proxies-deprecation](../../includes/functions-legacy-proxies-deprecation.md)]

## Prerequisites 

[!INCLUDE [Previous quickstart note](../../includes/functions-quickstart-previous-topics.md)]

The resulting function will be used for the rest of this article.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Customize your HTTP function

By default, your HTTP trigger function is configured to accept any HTTP method. You can also use the default URL, `http://<yourapp>.azurewebsites.net/api/<funcname>?code=<functionkey>`. In this section, you modify the function to respond only to GET requests with `/api/hello`. 

1. Navigate to your function in the Azure portal. Select **Integration** in the left menu, and then select **HTTP (req)** under **Trigger**.

    :::image type="content" source="./media/functions-create-serverless-api/customizing-http.png" alt-text="Customizing an HTTP function":::

1. Use the HTTP trigger settings as specified in the following table.

    | Field | Sample value | Description |
    |---|---|---|
    | Route template | hello | Determines what route is used to invoke this function |
    | Authorization level | Anonymous | Optional: Makes your function accessible without an API key |
    | Selected HTTP methods | GET | Allows only selected HTTP methods to be used to invoke this function |

    You didn't include the `/api` base path prefix in the route template, because it's handled by a global setting.

1. Select **Save**.

For more information about customizing HTTP functions, see [Azure Functions HTTP bindings](./functions-bindings-http-webhook.md).

### Test your API

Next, test your function to see how it works with the new API surface:
1. On the function page, select **Code + Test** from the left menu.

1. Select **Get function URL** from the top menu and copy the URL. Confirm that it now uses the `/api/hello` path.
 
1. Copy the URL into a new browser tab or your preferred REST client. 

   Browsers use GET by default.
 
1. Add parameters to the query string in your URL. 

   For example, `/api/hello/?name=John`.
 
1. Press Enter to confirm that it's working. You should see the response, "*Hello John*."

1. You can also try calling the endpoint with another HTTP method to confirm that the function isn't executed. To do so, use a REST client, such as cURL, Postman, or Fiddler.

## Proxies overview

In the next section, you'll surface your API through a proxy. Azure Functions Proxies allows you to forward requests to other resources. You define an HTTP endpoint just like with HTTP trigger. However, instead of writing code to execute when that endpoint is called, you provide a URL to a remote implementation. Doing so allows you to compose multiple API sources into a single API surface, which is easy for clients to consume, which is useful if you wish to build your API as microservices.

A proxy can point to any HTTP resource, such as:
- Azure Functions 
- API apps in [Azure App Service](../app-service/overview.md)
- Docker containers in [App Service on Linux](../app-service/overview.md#app-service-on-linux)
- Any other hosted API

To learn more about proxies, see [Working with Azure Functions Proxies].

> [!NOTE]
> Proxies is available in Azure Functions versions 1.x to 3.x.

## Create your first proxy

In this section, you create a new proxy, which serves as a frontend to your overall API. 

### Setting up the frontend environment

Repeat the steps to [Create a function app](./functions-get-started.md) to create a new function app in which you'll create your proxy. This new app's URL serves as the frontend for our API, and the function app you were previously editing serves as a backend.

1. Navigate to your new frontend function app in the portal.
1. Select **Configuration** and choose **Application Settings**.
1. Scroll down to **Application settings**, where key/value pairs are stored, and create a new setting with the key `HELLO_HOST`. Set its value to the host of your backend function app, such as `<YourBackendApp>.azurewebsites.net`. This value is part of the URL that you copied earlier when testing your HTTP function. You'll reference this setting in the configuration later.

    > [!NOTE] 
    > App settings are recommended for the host configuration to prevent a hard-coded environment dependency for the proxy. Using app settings means that you can move the proxy configuration between environments, and the environment-specific app settings will be applied.

1. Select **Save**.

### Creating a proxy on the frontend

1. Navigate back to your front-end function app in the portal.

1. In the left-hand menu, select **Proxies**, and then select **Add**. 

1. On the **New Proxy** page, use the settings in the following table, and then select **Create**.

    | Field | Sample value | Description |
    |---|---|---|
    | Name | HelloProxy | A friendly name used only for management |
    | Route template | /api/remotehello | Determines what route is used to invoke this proxy |
    | Backend URL | https://%HELLO_HOST%/api/hello | Specifies the endpoint to which the request should be proxied |

    
    :::image type="content" source="./media/functions-create-serverless-api/creating-proxy.png" alt-text="Creating a proxy":::

    Azure Functions Proxies doesn't provide the `/api` base path prefix, which must be included in the route template. The `%HELLO_HOST%` syntax references the app setting you created earlier. The resolved URL will point to your original function.

1. Try out your new proxy by copying the proxy URL and testing it in the browser or with your favorite HTTP client:
    - For an anonymous function use:
        `https://YOURPROXYAPP.azurewebsites.net/api/remotehello?name="Proxies"`.
    - For a function with authorization use:
        `https://YOURPROXYAPP.azurewebsites.net/api/remotehello?code=YOURCODE&name="Proxies"`.

## Create a mock API

Next, you'll use a proxy to create a mock API for your solution. This proxy allows client development to progress, without needing the backend fully implemented. Later in development, you can create a new function app, which supports this logic and redirect your proxy to it.

To create this mock API, we'll create a new proxy, this time using the [App Service Editor](https://github.com/projectkudu/kudu/wiki/App-Service-Editor). To get started, navigate to your function app in the portal. Select **Platform features**, and under **Development Tools** find **App Service Editor**. The App Service Editor opens in a new tab.

Select `proxies.json` in the left navigation. This file stores the configuration for all of your proxies. If you use one of the [Functions deployment methods](./functions-continuous-deployment.md), you maintain this file in source control. To learn more about this file, see [Proxies advanced configuration](./legacy-proxies.md#advanced-configuration).

If you've followed along so far, your proxies.json should look like as follows:

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

Next, you'll add your mock API. Replace your proxies.json file with the following code:

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

This code adds a new proxy, `GetUserByName`, without the `backendUri` property. Instead of calling another resource, it modifies the default response from Proxies using a response override. Request and response overrides can also be used with a backend URL. This technique is useful when proxying to a legacy system, where you might need to modify headers, query parameters, and so on. To learn more about request and response overrides, see [Modifying requests and responses in Proxies](./legacy-proxies.md).

Test your mock API by calling the `<YourProxyApp>.azurewebsites.net/api/users/{username}` endpoint using a browser or your favorite REST client. Be sure to replace _{username}_ with a string value representing a username.

## Next steps

In this article, you learned how to build and customize an API on Azure Functions. You also learned how to bring multiple APIs, including mocks, together as a unified API surface. You can use these techniques to build out APIs of any complexity, all while running on the serverless compute model provided by Azure Functions.

The following references may be helpful as you develop your API further:

- [Azure Functions HTTP bindings](./functions-bindings-http-webhook.md)
- [Working with Azure Functions Proxies]
- [Documenting an Azure Functions API (preview)](./functions-openapi-definition.md)


[Create your first function]: ./functions-get-started.md
[Working with Azure Functions Proxies]: ./legacy-proxies.md
