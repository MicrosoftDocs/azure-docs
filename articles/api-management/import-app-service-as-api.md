---
title: Import an Azure web app to Azure API Management  | Microsoft Docs
description: Learn how to use Azure API Management to import a web API that's hosted in Azure App Service.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 03/28/2025
ms.author: danlep

#customer intent: As an API developer, I want to import a web app as an API to API Management so that I can take advantage of the benefits of using this environment.
---
# Import an Azure web app as an API

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article shows how to use the Azure portal to import an Azure web app as an API to Azure API Management and test the imported API.

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Import a web app, which is hosted in Azure App Service, as an API
> * Test the API in the Azure portal

## Expose a web app by using API Management

[Azure App Service](../app-service/overview.md) is an HTTP-based service for hosting web applications, REST APIs, and mobile backends. API developers can use their preferred technology stacks and pipelines to develop APIs and publish their API backends as web apps in a secure, scalable environment. They can then use API Management to expose the web apps, manage and protect the APIs throughout their lifecycle, and publish them to consumers.

Using API Management to expose a Web Apps-hosted API provides these benefits:

* Decouple managing and securing the front end that's exposed to API consumers from managing and monitoring the backend web app.
* Manage web APIs hosted as web apps in the same environment as your other APIs.
* Apply [policies](api-management-policies.md) to change API behavior, such as call-rate limiting.
* Direct API consumers to the customizable API Management [developer portal](api-management-howto-developer-portal.md) so they can discover and learn about your APIs, request access, and try APIs.

For more information, see [About API Management](api-management-key-concepts.md).

## OpenAPI definition vs. wildcard operations

API Management supports import of web apps hosted in App Service that include an OpenAPI definition (a Swagger definition). However, an OpenAPI definition isn't required.

* If the web app is configured with an OpenAPI definition, API Management will detect that. Alternatively, you can [manually import the definition](import-api-from-oas.md) to API Management. API Management then creates API operations that map directly to the definition, including required paths, parameters, and response types. 

  Having an OpenAPI definition is recommended, because the API is imported to API Management with high fidelity, giving you the flexibility to validate, manage, secure, and update configurations for each operation separately.

* If an OpenAPI definition isn't provided, API Management generates [wildcard operations](add-api-manually.md#add-and-test-a-wildcard-operation) for the common HTTP verbs (GET, PUT, and so on). Append a required path or parameters to a wildcard operation to pass an API request through to the backend API.

  With wildcard operations, you can still take advantage of the same API Management features, but operations aren't defined at the same level of detail by default. In either case, you can [edit](edit-api.md) or [add](add-api-manually.md) operations to the imported API.
 
### Example

Your backend web app might support two GET operations: 
*  `https://<app-service>.azurewebsites.net/customer/{id}`
*  `https://<app-service>.azurewebsites.net/customers`

You import the web app to your API Management service at a path like `https://<api>.azureapi.net/store`. The following table shows the operations that are imported to API Management, with or without an OpenAPI specification: 

| Type |Imported operations  |Sample requests |
|---------|---------|---------|
|OpenAPI specification    | `GET  /customer/{id}`<br/><br/> `GET  /customers`         |  `GET https://<api>.azureapi.net/store/customer/1`<br/><br/>`GET https://<api>.azureapi.net/store/customers`       |
|Wildcard     | `GET  /*`         | `GET https://<api>.azureapi.net/store/customer/1`<br/><br/>`GET https://<api>.azureapi.net/store/customers`  |

The wildcard operation allows the same requests to the backend service as the operations in the OpenAPI specification. However, the OpenAPI-specified operations can be managed separately in API Management. 

## Prerequisites

+ Complete the quickstart [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Make sure there's an app service in your subscription. For more information, see [App Service documentation](../app-service/index.yml).

  For information about creating an example web API and publishing it as an Azure web app, see:

    * [Tutorial: Create a web API with ASP.NET Core](/aspnet/core/tutorials/first-web-api).
    * [Publish an ASP.NET Core app to Azure with Visual Studio Code](/aspnet/core/tutorials/publish-to-azure-webapp-using-vscode).

## Import and publish a backend API

> [!TIP]
> In the following steps, you start the import by using API Management in the Azure portal. You can also link to API Management directly from your web app by selecting **API Management** in the app's **API** menu.  

1. Navigate to your API Management service in the [Azure portal](https://portal.azure.com).
1. In the left menu, in the **APIs section**, select **APIs**, and then select **+ Add API**.
1. Select the **App Service** tile:

    :::image type="content" source="media/import-app-service-as-api/app-service.png" alt-text="Screeenshot that shows the App Service tile.":::

1. Select **Browse** to see the list of app services in your subscription.
1. Select an app service and then click the **Select** button. If an OpenAPI definition is associated with the selected web app, API Management fetches it and imports it. 

    If an OpenAPI definition isn't found, API Management exposes the API by generating wildcard operations for common HTTP verbs. 
1. Add an **API URL suffix**. The suffix is a name that identifies the API in the API Management instance. It has to be unique in the API Management instance.
1. If you want the API to be published and available to developers, switch to the **Full** view and associate the API with a **Product**. This example uses the **Unlimited** product. (You can add your API to a product when you create it or later via the **Settings** tab.)

    > [!NOTE]
    > Products are associations of one or more APIs offered to developers via the developer portal. First, developers must subscribe to a product to get access to the API. After they subscribe, they get a subscription key for any API in the product. As creator of the API Management instance, you're an administrator and are subscribed to every product by default.
    >
    > In certain tiers, each API Management instance comes with two default sample products:
    > * **Starter**
    > * **Unlimited**

1. Enter other API settings. You can set these values when you create the API or configure them later by going to the **Settings** tab. The settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.

1. Select **Create**.
    :::image type="content" source="media/import-app-service-as-api/import-app-service.png" alt-text="Screenshot that shows the Create from App Service window." lightbox="media/import-app-service-as-api/import-app-service.png":::

## Test the new API in the Azure portal

You can call operations directly from the Azure portal. This method provides a convenient way to view and test the operations of an API. You can also test the API in the [developer portal](api-management-howto-developer-portal.md) or by using your own REST client tools.

1. Select the API you created in the previous step.
1. On the **Test** tab, select an operation.

    The page displays fields for query parameters and fields for the headers. One of the headers is `Ocp-Apim-Subscription-Key`. This header is for the subscription key of the product that's associated with the API. If you created the API Management instance, you're an administrator already, so the key is filled in automatically.

1. Press **Send**.

    When the test is successful, the backend responds with **200 OK** and some data.

### Test a wildcard operation in the portal

When wildcard operations are generated, the operations might not map directly to the backend API. For example, a wildcard GET operation imported in API Management uses the path `/` by default. However, your backend API might support a GET operation at the path `/api/todoItems`.

To test the path `/api/todoItems`:

1. Select the API that you created, and then select an operation.
1. On the **Test** tab, under **Template parameters**, update the value next to the wildcard (*) name. For example, enter **api/todoItems**. This value gets appended to the path `/` for the wildcard operation.

    :::image type="content" source="media/import-app-service-as-api/test-wildcard-operation.png" alt-text="Screenshot that shows the steps for testing an operation." lightbox="media/import-app-service-as-api/test-wildcard-operation.png":::

1. Select **Send**.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
