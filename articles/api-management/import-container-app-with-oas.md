---
title: Import Azure Container App to Azure API Management | Microsoft Docs
description: This article shows you how to use Azure API Management to import a web API hosted in Azure Container Apps.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 11/03/2021
ms.author: danlep

---
# Import an Azure Container App as an API

This article shows how to import an Azure Container App to Azure API Management and test the imported API using the Azure portal.  In this article, you learn how to:

> [!div class="checklist"]
> * Import a Container App that exposes a Web API
> * Test the API in the Azure portal

## Expose Container App with API Management

[Azure Container Apps](../container-apps/overview.md) allows you to deploy containerized apps without managing complex infrastructure. API developers can write code using their preferred programming language or framework, build microservices with full support for Distributed Application Runtime (Dapr), and scale based on HTTP traffic or other events.

API Management is the recommended environment to expose a Container App hosted web API, for several reasons:

* Decouple managing and securing the front end exposed to API consumers from managing and monitoring the backend web API
* Manage web APIs hosted as Container Apps in the same environment as your other APIs
* Apply [policies](api-management-policies.md) to change API behavior, such as call rate limiting
* Direct API consumers to API Management's customizable [developer portal](api-management-howto-developer-portal.md) to discover and learn about your APIs, request access, and try them

For more information, see [About API Management](api-management-key-concepts.md).

## OpenAPI specification versus wildcard operations

API Management supports import of Container Apps that provide an OpenAPI specification (Swagger definition). However, an OpenAPI specification isn't required. We recommend providing an OpenAPI specification.  API Management can import individual operations, allowing you to validate, manage, secure, and update configurations for each operation separately.

If the Container App exposes an OpenAPI specification, API Management creates API operations that map directly to the definition. API Management will look in several locations for an OpenAPI Specification

* The Container App configuration.
* `/openapi.json`
* `/openapi.yml`
* `/swagger/v1/swagger.json`

If an OpenAPI specification isn't provided, API Management generates [wildcard operations](add-api-manually.md#add-and-test-a-wildcard-operation) for the common HTTP verbs (GET, PUT, and so on). You can still take advantage of the same API Management features, but operations aren't defined at the same level of detail.

In either case, you can [edit](edit-api.md) or [add](add-api-manually.md) operations to the API after import.
 
### Example

Your backend Container App might support two GET operations:

*  `https://myappservice.azurewebsites.net/customer/{id}`
*  `https://myappservice.azurewebsites.net/customers`

You import the Container App to your API Management service at a path such as `https://contosoapi.azure-api.net/store`. The following table shows the operations that are imported to API Management, either with or without an OpenAPI specification: 

| Type |Imported operations  |Sample requests |
|---------|---------|---------|
|OpenAPI specification    | `GET  /customer/{id}`<br/><br/> `GET  /customers`         |  `GET https://contosoapi.azure-api.net/store/customer/1`<br/><br/>`GET https://contosoapi.azure-api.net/store/customers`       |
|Wildcard     | `GET  /*`         | `GET https://contosoapi.azure-api.net/store/customer/1`<br/><br/>`GET https://contosoapi.azure-api.net/store/customers`  |

The wildcard operation allows the same requests to the backend service as the operations in the OpenAPI specification. However, the OpenAPI-specified operations can be managed separately in API Management. 

## Prerequisites

+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Make sure there's a Container App that exposes a Web API in your subscription. For more information, see [Container Apps documentation](../container-apps/index.yml).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## <a name="create-api"> </a>Import and publish a backend API 

1. Navigate to your API Management service in the Azure portal and select **APIs** from the menu.
2. Select **Container App** from the list.

    :::image type="content" source="media/import-container-app-with-oas/add-api.png" alt-text="Create from Container App":::

3. Select **Browse** to see the list of Container Apps in your subscription.
4. Select a Container App. If an OpenAPI definition is associated with the selected Container App, API Management fetches it and imports it. If an OpenAPI definition isn't found, API Management exposes the API by generating wildcard operations for common HTTP verbs.
1. Add an API URL suffix. The suffix is a name that identifies this specific API in this API Management instance. It has to be unique in this API Management instance.
2. Publish the API by associating the API with a product. In this case, the "*Unlimited*" product is used. If you want the API to be published and be available to developers, add it to a product.

    > [!NOTE]
    > Products are associations of one or more APIs. You can include many APIs and offer them to developers through the developer portal. Developers must first subscribe to a product to get access to the API. When they subscribe, they get a subscription key that is good for any API in that product. If you created the API Management instance, you're an administrator and subscribed to every product by default.
    >
    > Each API Management instance comes with two sample products when created:
    > * **Starter**
    > * **Unlimited**

3. Enter other API settings. You can set the values during creation or configure them later by going to the **Settings** tab. The settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.
4. Select **Create**.

    :::image type="content" source="media/import-container-app-with-oas/import-container-app.png" alt-text="Create API from Container App":::

## Test the new API in the Azure portal

Operations can be called directly from the Azure portal, which provides a convenient way to view and test the operations of an API. You can also test the API in the [developer portal](api-management-howto-developer-portal.md) or using your own REST client tools.

1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation.

    The page displays fields for query parameters and fields for the headers. One of the headers is `Ocp-Apim-Subscription-Key`, for the subscription key of the product that is associated with this API. If you created the API Management instance, you are an administrator already, so the key is filled in automatically.

1. Press **Send**.

    When the test is successful, the backend responds with **200 OK** and some data.

### Test wildcard operation in the portal

When wildcard operations are generated, the operations might not map directly to the backend API. For example, a wildcard GET operation imported in API Management uses the path `/` by default. However, your backend API might support a GET operation at the following path:

`/api/TodoItems`

You can test the path `/api/TodoItems` as follows.

1. Select the API you created, and select the operation.
1. Select the **Test** tab.
1. In **Template parameters**, update the value next to the wildcard (*) name. For example, enter `api/TodoItems`. This value gets appended to the path `/` for the wildcard operation.

    :::image type="content" source="media/import-container-app-with-oas/test-wildcard-operation.png" alt-text="Test wildcard operation":::

1. Select **Send**.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
