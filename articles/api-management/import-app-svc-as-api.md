---
title: Import an App Service to Azure API Management with the Azure portal  | Microsoft Docs
description: This article shows you how to use Azure API Management to import an API hosted in Azure App Service as an API.
services: api-management
documentationcenter: ''
author: vladvino

ms.service: api-management
ms.topic: article
ms.date: 03/18/2021
ms.author: apimpm

---
# Import an App Service as an API

This article shows how to import an API hosted in Azure App Service to Azure API Management and test the imported API.

In this article, you learn how to:

> [!div class="checklist"]
> * Import an App Service app as an API
> * Test the API in the Azure portal
> * Test the API in the Developer portal

By importing an App Service app to Azure API Management, you take advantage of features to manage, secure, and transform the API. You can apply policies... etc etc...

API Management supports import of App Service apps that include an OpenAPI specification and those without:

* If the app includes an OpenAPI specification, API Management imports it directly to define API operations that map to the backend API.
* If the app doesn't provide an OpenAPI specification, API Management generates wildcard operations for the common HTTP verbs (GET, PUT, and so on). You can append paths or parameters to a wildcard operation to pass specific API requests through to the backend API. You can also edit the wildcard operations or [add API operations](add-api-manually.md) to map to the backend API.

## Prerequisites

+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
+ Make sure there is an App Service in your subscription. For more information, see [App Service documentation](../app-service/index.yml).

  For sample steps to create a web API app and publish to App Service, see:

    * [Tutorial: Create a web API with ASP.NET Core](/aspnet/core/tutorials/first-web-api)
    * [Publish an ASP.NET Core app to Azure with Visual Studio Code](/aspnet/core/tutorials/publish-to-azure-webapp-using-vscode)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## <a name="create-api"> </a>Import and publish a backend API

> [!TIP]
> The following steps start the import by using Azure API Management in the Azure portal. You can also link to API Management directly from your App Service app, by selecting **API Management** from the app's **API** menu.  

1. Navigate to your API Management service in the Azure portal and select **APIs** from the menu.
1. Select **App Service** from the **Add a new API** list.

    :::image type="content" source="media/import-app-svc-as-api/app-svc.png" alt-text="Create from App Service":::
1. Select **Browse** to see the list of App Services in your subscription.
1. Select the app. If there is an OpenAPI definition associated with the selected app, API Management fetches it and imports it. 

    If an OpenAPI definition isn't found, API Management exposes the API by generating wildcard operations for common HTTP verbs. 
1. Add an API URL suffix. The suffix is a name that identifies this specific API in this API Management instance. It has to be unique in this APIM instance.
1. Publish the API by associating the API with a product. In this case, the "*Unlimited*" product is used. If you want the API to be published and be available to developers, add it to a product. You can do it during API creation or set it later.

    Products are associations of one or more APIs. You can include a number of APIs and offer them to developers through the developer portal. Developers must first subscribe to a product to get access to the API. When they subscribe, they get a subscription key that is good for any API in that product. If you created the APIM instance, you are an administrator already, so you are subscribed to every product by default.

    By default, each API Management instance comes with two sample products:

    * **Starter**
    * **Unlimited**   
1. Enter other API settings. You can set the values during creation or configure them later by going to the **Settings** tab. The settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.
1. Select **Create**.

## Test the new API in the Azure portal

Operations can be called directly from the Azure portal, which provides a convenient way to view and test the operations of an API. Testing in the portal is most useful for testing operations of an API imported by using an OpenAPI specification. 

1. Select the API you created in the previous step.
2. Select the **Test** tab.
3. Select some operation.

    The page displays fields for query parameters and fields for the headers. One of the headers is "Ocp-Apim-Subscription-Key", for the subscription key of the product that is associated with this API. If you created the API Management instance, you are an administrator already, so the key is filled in automatically. 
1. Press **Send**.

    When successful, the backend responds with **200 OK** and some data.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Test a wildcard operation



## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-3.1&tabs=visual-studio
