---
title: Import an API App as an API with the Azure portal  | Microsoft Docs
description: This tutorial shows you how to use API Management (APIM) to import API App as an API.
services: api-management
documentationcenter: ''
author: juliako
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 10/16/2017
ms.author: apimpm

---
# Import an API App as an API

This article shows how to import a API App as an API. The article also shows how to test the APIM API.

In this article, you learn how to:

> [!div class="checklist"]
> * Import an API App as an API
> * Test the API in the Azure portal
> * Test the API in the Developer portal

## Prerequisites

+ [Create an Azure API Management instance](get-started-create-service-instance.md)
+ An API App

## <a name="create-api"> </a>Import and publish a back-end API

1. Navigate to your APIM instance in the [Azure portal](https://portal.azure.com/).
2. Select **APIs** from under **API MANAGEMENT**.
3. Select **API App** from the **Add a new API** list.
4. Press **Browse** to see the list of API Apps in your subscription.
5. Select the app. APIM finds the swagger associated with the selected app, fetches it, and imports it. 

    In case APIM does not find swagger, it exposes the API as a "pass-through" API. 
1. Add an API URL suffix. The suffix is a name that identifies this specific API in this APIM instance. It has to be unique in this APIM instance.
2. Publish the API by associating the API with a product. In this case, the "*Unlimited*" product is used.  If you want for the API to be published and be available to developers, add it to a product. You can do it during API creation or set it later.

    Products are associations of one or more APIs. You can include a number of APIs and offer them to developers through the developer portal. Developers must first subscribe to a product to get access to the API. When they subscribe, they get a subscription key that is good for any API in that product. If you created the APIM instance, you are an administrator already, so you are subscribed to every product by default.

    By default, each API Management instance comes with two sample products:

    * **Starter**
    * **Unlimited**   
8. Select **Create**.

### Test the new APIM API in the administrative portal

Operations can be called directly from the administrative portal, which provides a convenient way to view and test the operations of an API.  

1. Select the API you created in the previous step.
2. Press the **Test** tab.
3. Select some operation.

    The page displays fields for query parameters and fields for the headers. One of the headers is "Ocp-Apim-Subscription-Key", for the subscription key of the product that is associated with this API. If you created the APIM instance, you are an administrator already, so the key is filled in automatically. 
1. Press **Send**.

    Backend responds with **200 OK** and some data.

### <a name="call-operation"> </a>Call an operation from the developer portal

Operations can also be called **Developer portal** to test APIs. 

1. Select the API you created in the "Import and publish a back-end API" step.
2. Press **Developer portal**.

    The "Developer portal" site opens up.
3. Select the **API** that you created.
4. Click the operation you want to test.
5. Press **Try it**.
6. Press **Send**.
    
    After an operation is invoked, the developer portal displays the **Response status**, the **Response headers**, and any **Response content**.

## Append other APIs

An API can be composed of APIs exposed by different services: **OpenAPI Specification**, **SOAP API**, **API App**, **Function App**, **Logic App**, **Service Fabric**.

To append a different API to your existing API, follow the steps below. Once you import another API, the operations are appended to your current API.

1. Navigate to your APIM instance in the [Azure portal](https://portal.azure.com/).
2. Select **APIs** from under **API MANAGEMENT**.
3. Press ellipsis ". . ." next tp the API that you want to append another API to.
4. Select **Import** from the drop-down menu.
5. Select one of services from which you want to import an API.

## Related topics

+ [Add an API manually](add-api-manually.md)
+ [Import an API from OpenAPI Specification](import-api-from-oas.md)
+ [Import a SOAP API and convert to REST](restify-soap-api.md)
+ [Import an API App as an API](import-api-app-as-api.md)
+ [Import a Function App as an API](import-function-app-as-api.md)
+ [Import a Logic App as an API](import-logic-app-as-api.md)
+ [Import a Service Fabric app as an API](import-service-fabric-app-as-api.md)

## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)