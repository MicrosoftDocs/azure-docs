---
title: Add a blank API using the Azure portal  | Microsoft Docs
description: This tutorial shows you how to use API Management (APIM) to add an blank API.
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
# Add a blank API 

The steps in this article show how to use the Azure portal to add a blank API to the API Management (APIM) instance. A common scenario when you would want to add a blank API is when you want to mock the API. Ability to mock up responses can be useful in a number of scenarios:

+ When the API façade is designed first and the backend implementation comes later. Or, the backend is being developed in parallel.
+ When the backend is temporarily not operational or not able to scale.

For details about mocking an API, see [Mock API responses](mock-api-responses.md).

You might also want to create a blank API and compose it from multiple APIs by importing other APIs (for example, an **OpenAPI specification** and/or **Logic App**, and/or **Functions App**).

In this article, we create a blank API and specify [httpbin.org](httpbin.org) (a public API) as a backend.

## Prerequisites

To continue with this article, [Create an Azure API Management instance](get-started-create-service-instance.md)

## Create an API

1. Navigate to your APIM instance in the [Azure portal](https://portal.azure.com/).
2. Select **APIs** from under **API MANAGEMENT**.
3. From the left menu, select **+ Add API**.
4. Select **Blank API** from the list.
5. Enter "*Blank API*" for **Display name**.
6. Enter "*Unlimited*" for **Products**.
7. Select **Create**.

At this point, you have no operations. If you call an operation that is exposed through the backend but not through the APIM, you get a **404**. 

>[!NOTE] By default, when you add an API, even if it is connected to some backend service, APIM will not expose any operations until you whitelist them. To whitelist an operation of your backend service, creating an APIM operation.

## Add an operation

This section shows how to add a "/get" operation in order to map it to the backend "http://httpbin.org/get" operation.

1. Select the API you created in the previous step.
2. Click **+ Add Operation**.
3. In the **URL**, select **GET** and enter "/get" in the resource.

4. Enter "FetchData" for **Display name**.
5. Select **Save**.

## Add a parameterized operation

1. Select the API you created in the previous step.
2. Click **+ Add Operation**.
3. In the **URL**, select **GET** and enter "/status/{code}" in the resource. Optionally, you can provide some information associated with this parameter. For example, enter "Number" for **TYPE**, "200" for **VALUES**.
4. Enter "GetStatus" for **Display name**.
5. Select **Save**.

## Test the API

1. Select the API you created in the "Create a test API" step.
2. Open the **Test** tab.
3. Select **Send** to make a test call.

## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)