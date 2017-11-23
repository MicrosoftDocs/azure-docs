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
ms.date: 11/20/2017
ms.author: apimpm

---
# Add an API manually 

The steps in this article show how to use the Azure portal to add an API manually to the API Management (APIM) instance. A common scenario when you would want to create a blank API and define it manually is when you want to mock the API. For details about mocking an API, see [Mock API responses](mock-api-responses.md).

If you want to import an existing API, see [related topics](#related-topics) section.

In this article, we create a blank API and specify [httpbin.org](http://httpbin.org) (a public testing service) as a back end API.

## Prerequisites

Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Create an API

1. Select **APIs** from under **API MANAGEMENT**.
2. From the left menu, select **+ Add API**.
3. Select **Blank API** from the list.
4. Enter "*Blank API*" for **Display name**.
5. **Web Service URL** is optional. If you want to mock an API, you might not enter anything. In this case, we enter [http://httpbin.org](http://httpbin.org). This is a public testing service. If you want to import an API that is mapped to a back end automatically, see one of the topics in the [related topics](#related-topics) section.
6. Choose a URL scheme: HTTP, HTTPS, or both. In this case even though the back end has non-secure HTTP access, we specify a secure HTTPS APIM access to the back end. This kind of scenario (HTTPS to HTTP) is called HTTPS termination. You might do it if your API exists within a virtual network (where you know the access is secure even if HTTPS is not used). You might want to use "HTTPS termination" to save on some CPU cycles.
7. Add an API URL suffix. In this case, *hbin*. The suffix is a name that identifies this specific API in this APIM instance. It has to be unique in this APIM instance.
8. Publish the API by associating the API with a product. In this case, the "*Unlimited*" product is used.  If you want for the API to be published and be available to developers, add it to a product. You can do it during API creation or set it later.

    Products are associations of one or more APIs. You can include a number of APIs and offer them to developers through the developer portal. Developers must first subscribe to a product to get access to the API. When they subscribe, they get a subscription key that is good for any API in that product. If you created the APIM instance, you are an administrator already, so you are subscribed to every product by default.

    By default, each API Management instance comes with two sample products:

    * **Starter**
    * **Unlimited** 
9. Select **Create**.

At this point, you have no operations in APIM that map to the operations in your back end API. If you call an operation that is exposed through the back end but not through the APIM, you get a **404**. 

>[!NOTE] 
> By default, when you add an API, even if it is connected to some back end service, APIM will not expose any operations until you whitelist them. To whitelist an operation of your back end service, create an APIM operation that maps to the back end operation.
>

## Add and test an operation

This section shows how to add a "/get" operation in order to map it to the back end "http://httpbin.org/get" operation.

### Add the operation

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

## Add and test a parameterized operation

This section shows how to add an operation that takes a parameter. In this case, we map the operation to "http://httpbin.org/status/200".

### Add the operation

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

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
