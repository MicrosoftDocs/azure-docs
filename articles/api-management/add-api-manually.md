---
title: Add an API manually using the Azure portal  | Microsoft Docs
description: This tutorial shows you how to use API Management (APIM) to add an API manually.
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
ms.date: 11/07/2017
ms.author: apimpm

---
# Add an API manually 

The steps in this article show how to use the Azure portal to add an API manually to the API Management (APIM) instance. A common scenario when you would want to create a blank API and define it manually is when you want to mock the API. Ability to mock up responses can be useful in a number of scenarios:

+ When the API façade is designed first and the backend implementation comes later. Or, the backend is being developed in parallel.
+ When the backend is temporarily not operational or not able to scale.

For details about mocking an API, see [Mock API responses](mock-api-responses.md).

If you want to import an existing API, see [related topics](#related-topics) section.

In this article, we create a blank API and specify [httpbin.org](http://httpbin.org) (a public testing service) as a backend API.

## Prerequisites

To continue with this article, [Create an Azure API Management instance](get-started-create-service-instance.md)

## Create an API

1. Navigate to your APIM instance in the [Azure portal](https://portal.azure.com/).
2. Select **APIs** from under **API MANAGEMENT**.
3. From the left menu, select **+ Add API**.
4. Select **Blank API** from the list.
5. Enter "*Blank API*" for **Display name**.
6. **Web Service URL** is optional. If you want to mock an API, you might not enter anything. In this case, we enter [http://httpbin.org](http://httpbin.org). This is a public testing service. If you want to import an API that is mapped to a backend automatically, see one of the topics in the [related topics](#related-topics) section.
7. Choose a URL scheme: HTTP, HTTPS, or both. In this case even though the backend has non-secure HTTP access, we specify a secure HTTPS APIM access to the backend. This kind of scenario (HTTPS to HTTP) is called HTTPS termination. You might do it if your API exists within a virtual network (where you know the access is secure even if HTTPS is not used). You might want to use "HTTPS termination" to save on some CPU cycles.
8. Add an API URL suffix. In this case, *hbin*. The suffix is a name that identifies this specific API in this APIM instance. It has to be unique in this APIM instance.
9. Publish the API by associating the API with a product. In this case, the "*Unlimited*" product is used.  If you want for the API to be published and be available to developers, add it to a product. You can do it during API creation or set it later.

    Products are associations of one or more APIs. You can include a number of APIs and offer them to developers through the developer portal. Developers must first subscribe to a product to get access to the API. When they subscribe, they get a subscription key that is good for any API in that product. If you created the APIM instance, you are an administrator already, so you are subscribed to every product by default.

    By default, each API Management instance comes with two sample products:

    * **Starter**
    * **Unlimited** 
10. Select **Create**.

At this point, you have no operations in APIM that map to the operations in your backend API. If you call an operation that is exposed through the backend but not through the APIM, you get a **404**. 

>[!NOTE] 
> By default, when you add an API, even if it is connected to some backend service, APIM will not expose any operations until you whitelist them. To whitelist an operation of your backend service, creating an APIM operation.
>

## Add an operation

This section shows how to add a "/get" operation in order to map it to the backend "http://httpbin.org/get" operation.

1. Select the API you created in the previous step.
2. Click **+ Add Operation**.
3. In the **URL**, select **GET** and enter "*/get*" in the resource.
4. Enter "*FetchData*" for **Display name**.
5. Select **Save**.

### Test the operation

Test the operation in the Azure portal. Alternatively, you can test it in the **Developer portal**.

1. Select the **Test** tab.
2. Select **FetchData**.
3. Press **Send**.

The response that the "http://httpbin.org/get" operation generates appears. If you want to transform your operations, see [Transform and protect your API](transform-api.md).

## Add a parameterized operation

This section shows how to add an operation that takes a parameter. In this case, we map the operation to "http://httpbin.org/status/200".

1. Select the API you created in the previous step.
2. Click **+ Add Operation**.
3. In the **URL**, select **GET** and enter "*/status/{code}*" in the resource. Optionally, you can provide some information associated with this parameter. For example, enter "*Number*" for **TYPE**, "*200*" (default) for **VALUES**.
4. Enter "GetStatus" for **Display name**.
5. Select **Save**.

### Test the operation 

Test the operation in the Azure portal.  Alternatively, you can test it in the **Developer portal**.

1. Select the **Test** tab.
2. Select **GetStatus**. By default the code value is set to "*200*". You can change it to test other values. For example, type "*418*".
3. Press **Send**.

    The response that the "http://httpbin.org/status/200" operation generates appears. If you want to transform your operations, see [Transform and protect your API](transform-api.md).

## Append other APIs

An API can be composed of APIs exposed by different services: **OpenAPI Specification**, **SOAP API**, **API App**, **Function App**, **Logic App**, **Service Fabric**.

To append a different API to your existing API, follow the steps below. Once you import another API, the operations are appended to your current API.

1. Navigate to your APIM instance in the [Azure portal](https://portal.azure.com/).
2. Select **APIs** from under **API MANAGEMENT**.
3. Press ellipsis ". . ." next tp the API that you want to append another API to.
4. Select **Import** from the drop-down menu.
5. Select one of services from which you want to import an API.

## Related topics

+ [Import an API from OpenAPI Specification](import-api-from-oas.md)
+ [Import a SOAP API](import-soap-api.md)
+ [Import a SOAP API and convert to REST](restify-soap-api.md)
+ [Import an API App as an API](import-api-app-as-api.md)
+ [Import a Function App as an API](import-function-app-as-api.md)
+ [Import a Logic App as an API](import-logic-app-as-api.md)
+ [Import a Service Fabric app as an API](import-service-fabric-app-as-api.md)

## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)