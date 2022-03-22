---
title: Import Azure Web App to Azure API Management  | Microsoft Docs
description: This article shows you how to use Azure API Management to import a web API hosted in Azure App Service.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 04/27/2021
ms.author: danlep

---
# Import an Azure Web App as an API

This article shows how to import an Azure Web App to Azure API Management and test the imported API, using the Azure portal.

> [!NOTE]
> You can use the API Management Extension for Visual Studio Code to import and manage your APIs. Follow the [API Management Extension tutorial](visual-studio-code-tutorial.md) to install and get started.

In this article, you learn how to:

> [!div class="checklist"]
> * Import a Web App hosted in App Service
> * Test the API in the Azure portal

## Expose Web App with API Management

[Azure App Service](../app-service/overview.md) is an HTTP-based service for hosting web applications, REST APIs, and mobile backends. API developers can use their preferred technology stacks and pipelines to develop APIs and publish their API backends as Web Apps in a secure, scalable environment. Then, use API Management to expose the Web Apps, manage and protect the APIs throughout their lifecycle, and publish them to consumers.

API Management is the recommended environment to expose a Web App-hosted API, for several reasons:

* Decouple managing and securing the front end exposed to API consumers from managing and monitoring the backend Web App
* Manage web APIs hosted as Web Apps in the same environment as your other APIs
* Apply [policies](api-management-policies.md) to change API behavior, such as call rate limiting
* Direct API consumers to API Management's customizable [developer portal](api-management-howto-developer-portal.md) to discover and learn about your APIs, request access, and try them

For more information, see [About API Management](api-management-key-concepts.md).

## OpenAPI specification versus wildcard operations

API Management supports import of Web Apps hosted in App Service that include an OpenAPI specification (Swagger definition). However, an OpenAPI specification isn't required.

* If the Web App has an OpenAPI specification configured in an API definition, API Management creates API operations that map directly to the definition, including required paths, parameters, and response types. 

  Having an OpenAPI specification is recommended, because the API is imported to API Management with high fidelity, giving you flexibility to validate, manage, secure, and update configurations for each operation separately.

* If an OpenAPI specification isn't provided, API Management generates [wildcard operations](add-api-manually.md#add-and-test-a-wildcard-operation) for the common HTTP verbs (GET, PUT, and so on). Append a required path or parameters to a wildcard operation to pass an API request through to the backend API.

  With wildcard operations, you can still take advantage of the same API Management features, but operations aren't defined at the same level of detail by default. In either case, you can [edit](edit-api.md) or [add](add-api-manually.md) operations to the imported API.
 
### Example
Your backend Web App might support two GET operations: 
*  `https://myappservice.azurewebsites.net/customer/{id}`
*  `https://myappservice.azurewebsites.net/customers`

You import the Web App to your API Management service at a path such as `https://contosoapi.azureapi.net/store`. The following table shows the operations that are imported to API Management, either with or without an OpenAPI specification: 

| Type |Imported operations  |Sample requests |
|---------|---------|---------|
|OpenAPI specification    | `GET  /customer/{id}`<br/><br/> `GET  /customers`         |  `GET https://contosoapi.azureapi.net/store/customer/1`<br/><br/>`GET https://contosoapi.azureapi.net/store/customers`       |
|Wildcard     | `GET  /*`         | `GET https://contosoapi.azureapi.net/store/customer/1`<br/><br/>`GET https://contosoapi.azureapi.net/store/customers`  |

The wildcard operation allows the same requests to the backend service as the operations in the OpenAPI specification. However, the OpenAPI-specified operations can be managed separately in API Management. 

## Prerequisites

+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Make sure there is an App Service in your subscription. For more information, see [App Service documentation](../app-service/index.yml).

  For steps to create an example web API and publish as an Azure Web App, see:

    * [Tutorial: Create a web API with ASP.NET Core](/aspnet/core/tutorials/first-web-api)
    * [Publish an ASP.NET Core app to Azure with Visual Studio Code](/aspnet/core/tutorials/publish-to-azure-webapp-using-vscode)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## <a name="create-api"> </a>Import and publish a backend API

> [!TIP]
> The following steps start the import by using Azure API Management in the Azure portal. You can also link to API Management directly from your Web App, by selecting **API Management** from the app's **API** menu.  

1. Navigate to your API Management service in the Azure portal and select **APIs** from the menu.
1. Select **App Service** from the list.

    :::image type="content" source="media/import-app-service-as-api/app-service.png" alt-text="Create from App Service":::
1. Select **Browse** to see the list of App Services in your subscription.
1. Select an App Service. If an OpenAPI definition is associated with the selected Web App, API Management fetches it and imports it. 

    If an OpenAPI definition isn't found, API Management exposes the API by generating wildcard operations for common HTTP verbs. 
1. Add an API URL suffix. The suffix is a name that identifies this specific API in this API Management instance. It has to be unique in this APIM instance.
1. Publish the API by associating the API with a product. In this case, the "*Unlimited*" product is used. If you want the API to be published and be available to developers, add it to a product. You can do it during API creation or set it later.

    > [!NOTE]
    > Products are associations of one or more APIs. You can include many APIs and offer them to developers through the developer portal. Developers must first subscribe to a product to get access to the API. When they subscribe, they get a subscription key that is good for any API in that product. If you created the APIM instance, you are an administrator already, so you are subscribed to every product by default.
    >
    > By default, each API Management instance comes with two sample products:
    > * **Starter**
    > * **Unlimited**   
1. Enter other API settings. You can set the values during creation or configure them later by going to the **Settings** tab. The settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.
1. Select **Create**.
    :::image type="content" source="media/import-app-service-as-api/import-app-service.png" alt-text="Create API from App Service":::

## Test the new API in the Azure portal

Operations can be called directly from the Azure portal, which provides a convenient way to view and test the operations of an API. You can also test the API in the [developer portal](api-management-howto-developer-portal.md) or using your own REST client tools.

1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation.

    The page displays fields for query parameters and fields for the headers. One of the headers is "Ocp-Apim-Subscription-Key", for the subscription key of the product that is associated with this API. If you created the API Management instance, you are an administrator already, so the key is filled in automatically. 
1. Press **Send**.

    When the test is successful, the backend responds with **200 OK** and some data.

### Test wildcard operation in the portal

When wildcard operations are generated, the operations might not map directly to the backend API. For example, a wildcard GET operation imported in API Management uses the path `/` by default. However, your backend API might support a GET operation at the following path:

`/api/TodoItems`

You can test the path `/api/TodoItems` as follows. 

1. Select the API you created, and select the operation.
1. Select the **Test** tab.
1. In **Template parameters**, update the value next to the wildcard (*) name. For example, enter `api/TodoItems`. This value gets appended to the path `/` for the wildcard operation.

    :::image type="content" source="media/import-app-service-as-api/test-wildcard-operation.png" alt-text="Test wildcard operation":::
1. Select **Send**.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
