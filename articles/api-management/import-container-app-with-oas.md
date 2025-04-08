---
title: Import an Azure Container App to Azure API Management | Microsoft Docs
description: Learn how to use Azure API Management to import a web API that's hosted in Azure Container Apps.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 03/31/2025
ms.author: danlep

#customer intent: As an API developer, I want to import a web API that's hosted in Azure Container Apps. 

---
# Import an Azure container app as an API

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article describes how to import an Azure container app to Azure API Management as an API and test the imported API by using the Azure portal.  

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Import a container app that exposes a web API
> * Test the API in the Azure portal

## Expose a container app by using API Management

[Azure Container Apps](../container-apps/overview.md) allows you to deploy containerized apps without managing complex infrastructure. API developers can write code with their preferred programming language or framework, build microservices with full support for Distributed Application Runtime (Dapr), and scale based on HTTP traffic or other events.

By using API Management to expose a web API that's hosted in a container app, you gain the following benefits:

* Decouple managing and securing the frontend that's exposed to API consumers from managing and monitoring the backend web API.
* Manage web APIs hosted as container apps in the same environment as your other APIs.
* Apply [policies](api-management-policies.md) to change API behavior, such as call-rate limiting.
* Direct API consumers to the customizable API Management [developer portal](api-management-howto-developer-portal.md) so they can discover and learn about your APIs, request access, and try APIs.

For more information, see [About API Management](api-management-key-concepts.md).

## OpenAPI specification vs. wildcard operations

API Management supports importing container apps that provide an OpenAPI specification (a Swagger definition). An OpenAPI specification isn't required, but we recommend that you provide one.  API Management can import individual operations, which allows you to validate, manage, secure, and update configurations for each operation separately.

If the container app exposes an OpenAPI specification, API Management creates API operations that map directly to the definition. API Management will look in several locations for an OpenAPI specification:

* The container app configuration
* `/openapi.json`
* `/openapi.yml`
* `/swagger/v1/swagger.json`

If an OpenAPI specification isn't provided, API Management generates [wildcard operations](add-api-manually.md#add-and-test-a-wildcard-operation) for the common HTTP verbs (GET, PUT, and so on). You can still take advantage of the same API Management features, but operations aren't defined at the same level of detail.

In either case, you can [edit](edit-api.md) or [add](add-api-manually.md) operations to the API after you import it.
 
### Example

Your backend container app might support two GET operations:

*  `https://<app-service>.azurewebsites.net/customer/{id}`
*  `https://<app-service>.azurewebsites.net/customers`

You import the container app to your API Management service at a path like `https://<api>.azure-api.net/store`. The following table shows the operations that are imported to API Management, either with or without an OpenAPI specification: 

| Type |Imported operations  |Sample requests |
|---------|---------|---------|
|OpenAPI specification    | `GET  /customer/{id}`<br/><br/> `GET  /customers`         |  `GET https://<api>.azure-api.net/store/customer/1`<br/><br/>`GET https://<api>.azure-api.net/store/customers`       |
|Wildcard     | `GET  /*`         | `GET https://contosoapi.azure-api.net/store/customer/1`<br/><br/>`GET https://<api>.azure-api.net/store/customers`  |

The wildcard operation allows the same requests to the backend service as the operations in the OpenAPI specification. However, the OpenAPI-specified operations can be managed separately in API Management. 

## Prerequisites

+ Complete the [Create an Azure API Management instance](get-started-create-service-instance.md) quickstart.
+ Make sure there's a container app that exposes a web API in your subscription. For more information, see [Container Apps documentation](../container-apps/index.yml).

## Import and publish a backend API 

1. Navigate to your API Management service in the Azure portal and select **APIs** > **APIs** in the left pane.
1. Under **Create from Azure resource**, select **Container App**:

    :::image type="content" source="media/import-container-app-with-oas/add-api.png" alt-text="Screenshot that shows the Container App tile.":::

1. Select **Browse** to see a list of container apps in your subscription.
1. Select a container app. If an OpenAPI definition is associated with the selected container app, API Management fetches it and imports it. If an OpenAPI definition isn't found, API Management exposes the API by generating wildcard operations for common HTTP verbs.
1. Add an **API URL suffix**. The suffix is a name that identifies the API in the API Management instance. It has to be unique in the API Management instance.
1. Associate the API with a product. Select **Full** and then, in **Product**, select the product. In this case, the **Unlimited** product is used. If you want the API to be published and be available to developers, you need to add it to a product.

    > [!NOTE]
    > *Products* are associations of one or more APIs. You can include many APIs and offer them to developers through the developer portal. Developers must first subscribe to a product to get access to the API. When they subscribe, they get a subscription key that's good for any API in that product. If you created the API Management instance, you're an administrator and subscribed to every product by default.
    >
    > In some pricing tiers, an API Management instance comes with two sample products when you create it:
    > * **Starter**
    > * **Unlimited**

1. Enter other API settings. You can set these values when you create the API or configure them later on the **Settings** tab. These settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.
1. Select **Create**.

    :::image type="content" source="media/import-container-app-with-oas/import-container-app.png" alt-text="Screenshot that shows the Create from Container App window." lightbox="media/import-container-app-with-oas/import-container-app.png":::

## Test the new API in the Azure portal

You can call operations directly from the Azure portal. This method is a convenient way to view and test the operations of an API. You can also test the API in the [developer portal](api-management-howto-developer-portal.md) or by using your own REST client tools.

To test the API in the Azure portal:

1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation.

    The page displays fields for query parameters and fields for the headers. One of the headers is `Ocp-Apim-Subscription-Key`. This header is for the subscription key of the product that's associated with the API. If you created the API Management instance, you're an administrator, so the key is filled in automatically.

1. Select **Send**.

    When the test is successful, the backend responds with **200 OK** and some data.

### Test wildcard operation in the portal

When wildcard operations are generated, the operations might not map directly to the backend API. For example, a wildcard GET operation imported in API Management uses the path `/` by default. However, your backend API might support a GET operation at the following path:

`/api/TodoItems`

To test the `/api/TodoItems` path:

1. Select the API that you created, and then select the operation.
1. Select the **Test** tab.
1. In **Template parameters**, update the value next to the wildcard (*) name. For example, enter `api/TodoItems`. This value is appended to the path `/` for the wildcard operation.

    :::image type="content" source="media/import-container-app-with-oas/test-wildcard-operation.png" alt-text="Screenshot that shows the steps for testing wildcard operation." lightbox="media/import-container-app-with-oas/test-wildcard-operation.png":::

1. Select **Send**.

[!INCLUDE [api-management-append-apis.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
