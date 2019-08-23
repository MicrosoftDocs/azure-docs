---
title: Import an OpenAPI specification using the Azure portal | Microsoft Docs
description: Learn how to import an OpenAPI specification with API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 07/12/2019
ms.author: apimpm

---
# Import an OpenAPI specification

This article shows how to import an "OpenAPI specification" back-end API residing at https://conferenceapi.azurewebsites.net?format=json. This back-end API is provided by Microsoft and hosted on Azure. The article also shows how to test the APIM API.

> [!IMPORTANT]
> See this [document](https://blogs.msdn.microsoft.com/apimanagement/2018/04/11/important-changes-to-openapi-import-and-export/) for important information and tips related to OpenAPI import.

In this article, you learn how to:

> [!div class="checklist"]
> * Import an "OpenAPI specification" back-end API
> * Test the API in the Azure portal
> * Test the API in the Developer portal

## Prerequisites

Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## <a name="create-api"> </a>Import and publish a back-end API

1. Select **APIs** from under **API MANAGEMENT**.
2. Select **OpenAPI specification** from the **Add a new API** list.
    ![OpenAPI specification](./media/import-api-from-oas/oas-api.png)
3. Enter appropriate settings. You can set all the API values during creation. Alternately, you can set some of them later by going to the **Settings** tab. <br/> If you press **tab** some (or all) of the fields get filled up with the info from the specified back-end service.

    ![Create an API](./media/api-management-get-started/create-api.png)

    |Setting|Value|Description|
    |---|---|---|
    |**OpenAPI Specification**|https://conferenceapi.azurewebsites.net?format=json|References the service implementing the API. API management forwards requests to this address.|
    |**Display name**|*Demo Conference API*|If you press tab after entering the service URL, APIM will fill out this field based on what is in the json. <br/>This name is displayed in the Developer portal.|
    |**Name**|*demo-conference-api*|Provides a unique name for the API. <br/>If you press tab after entering the service URL, APIM will fill out this field based on what is in the json.|
    |**Description**|Provide an optional description of the API.|If you press tab after entering the service URL, APIM will fill out this field based on what is in the json.|
    |**API URL suffix**|*conference*|The suffix is appended to the base URL for the API management service. API Management distinguishes APIs by their suffix and therefore the suffix must be unique for every API for a given publisher.|
    |**URL scheme**|*HTTPS*|Determines which protocols can be used to access the API. |
    |**Products**|*Unlimited*| Publish the API by associating the API with a product. To optionally add this new API to a product, type the product name. This step can be repeated multiple times to add the API to multiple products.<br/>Products are associations of one or more APIs. You can include a number of APIs and offer them to developers through the developer portal. Developers must first subscribe to a product to get access to the API. When they subscribe, they get a subscription key that is good for any API in that product. If you created the APIM instance, you are an administrator already, so you are subscribed to every product by default.<br/> By default, each API Management instance comes with two sample products: **Starter** and **Unlimited**. |

4. Select **Create**.

> [!NOTE]
> The API import limitations are documented in [another article](api-management-api-import-restrictions.md).

## Test the new APIM API in the Azure portal

Operations can be called directly from the Azure portal, which provides a convenient way to view and test the operations of an API.

![Test API](./media/api-management-get-started/01-import-first-api-01.png)

1. Select the API you created in the previous step.
2. Press the **Test** tab.
3. Click on **GetSpeakers**.

    The page displays fields for query parameters but in this case we don't have any. The page also displays fields for the headers. One of the headers is "Ocp-Apim-Subscription-Key", for the subscription key of the product that is associated with this API. If you created the APIM instance, you are an administrator already, so the key is filled in automatically.
4. Press **Send**.

    Backend responds with **200 OK** and some data.

## <a name="call-operation"> </a>Call an operation from the Developer portal

Operations can also be called **Developer portal** to test APIs.

1. Select the API you created in the "Import and publish a back-end API" step.
2. Press **Developer portal**.

    ![Test in Developer portal](./media/api-management-get-started/developer-portal.png)

    The "Developer portal" site opens up.
3. Select **API**.
4. Select **Demo Conference API**.
5. Click **GetSpeakers**.

    The page displays fields for query parameters but in this case we don't have any. The page also displays fields for the headers. One of the headers is "Ocp-Apim-Subscription-Key", for the subscription key of the product that is associated with this API. If you created the APIM instance, you are an administrator already, so the key is filled in automatically.
6. Press **Try it**.
7. Press **Send**.

    After an operation is invoked, the developer portal displays the **Response status**, the **Response headers**, and any **Response content**.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
