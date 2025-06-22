---
title: Tutorial - Mock API responses in API Management - Azure portal  | Microsoft Docs
description: Use Azure API Management to set a policy on an API. The policy returns a mock response even if the backend isn't available to send real responses.

author: dlepow
ms.service: azure-api-management
ms.custom: mvc, devx-track-azurecli, devdivchpfy22
ms.topic: tutorial
ms.date: 03/24/2025
ms.author: danlep


#customer intent: As a developer, I want to set a policy on an API so that a mock response is returned.
---

# Tutorial: Mock API responses

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Backend APIs are imported into an Azure API Management API or created and managed manually. The steps in this tutorial describe how to:

+ Use API Management to create a blank HTTP API.
+ Manually manage an HTTP API.
+ Set a policy on an API so that it returns a mock response.

This method enables developers to continue with the implementation and testing of the API Management instance even if the backend isn't available to send real responses.

[!INCLUDE [api-management-workspace-try-it](../../includes/api-management-workspace-try-it.md)]

The ability to create mock responses is useful in many scenarios:

+ When the API façade is designed first and the backend implementation occurs later, or when the backend is being developed in parallel.
+ When the backend is temporarily not operational or is not able to scale.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a test API
> * Add an operation to the test API
> * Enable response mocking
> * Test the mocked API

:::image type="content" source="media/mock-api-responses/mock-api-response-02.png" alt-text="Screenshot that shows the APIs page in the Azure portal." lightbox="media/mock-api-responses/mock-api-response-02.png":::

## Prerequisites

+ Learn [API Management terminology](api-management-terminology.md).
+ Understand the [concept of policies in API Management](api-management-howto-policies.md).
+ Complete the quickstart [Create an Azure API Management instance](get-started-create-service-instance.md).

## Create a test API

The steps in this section show how to create an HTTP API with no backend.

1. Sign in to the Azure portal, and then navigate to your API Management instance.
1. Select **APIs** > **+ Add API** > **HTTP** tile:

   :::image type="content" source="media/mock-api-responses/http-api.png" alt-text="Screenshot that shows the first steps for defining an API." lightbox="media/mock-api-responses/http-api.png":::

1. In the **Create an HTTP API** window, select **Full**.
1. In **Display name**, enter *Test API*.
1. In **Products**, select *Unlimited*, if that value is available. This value is available only in some tiers. You can leave the value blank for this tutorial, but you need to associate the API with a product to publish it. For more information, see [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api). 
1. In **Gateways**, select **Managed** if this option is available. (This option is avaiable only in certain service tiers.)
1. Select **Create**.

    :::image type="content" source="media/mock-api-responses/create-http-api.png" alt-text="Screenshot that shows the Create an HTTP API window." lightbox="media/mock-api-responses/create-http-api.png":::

## Add an operation to the test API

An API exposes one or more operations. In this section, you add an operation to the HTTP API you created. Calling the operation after completing the steps in this section triggers an error. After you complete the steps in the [Enable response mocking](#enable-response-mocking) section, you won't get an error.

### [Portal](#tab/azure-portal)

1. Select the API that you created in the previous step.
1. Select **+ Add Operation**.
1. In the **Frontend** window, enter the following values:

     | Setting             | Value         | Description   |
    |------|------|-----------------------------------------|
    | **Display name**    | *Test call*  | The name that's displayed in the [developer portal](api-management-howto-developer-portal.md).    |
    | **URL** (first box) | GET | Select one of the predefined HTTP verbs.    |
    | **URL**  (second box)| */test*   | A URL path for the API.            |
    | **Description** |   |  An optional description of the operation. It provides documentation in the developer portal to the developers who use the API.                         |

    :::image type="content" source="media/mock-api-responses/frontend-window.png" alt-text="Screenshot that shows the Frontend window." lightbox="media/mock-api-responses/frontend-window.png":::

1. Select the **Responses** tab, which  is located under the **URL**, **Display name**, and **Description** boxes. You'll enter values on this tab to define response status codes, content types, examples, and schemas.
1. Select **+ Add response**, and then select **200 OK** from the list.

    :::image type="content" source="media/mock-api-responses/add-response.png" alt-text="Screenshot that shows the Responses tab." lightbox="media/mock-api-responses/add-response.png":::

1. In the **Representations** section, select **+ Add representation**.
1. Enter *application/json* into the search box and then select the **application/json** content type.
1. In the **Sample** box, enter  `{ "sampleField" : "test" }`.
1. Select **Save**.

    :::image type="content" source="media/mock-api-responses/add-representation.png" alt-text="Screenshot that shows the Representations section." lightbox="media/mock-api-responses/add-representation.png":::

Although it's not required for this example, you can configure more settings for an API operation on other tabs, as described in the following table:

|Tab      |Description  |
|---------|---------|
|**Query**     |  Add query parameters. Besides providing a name and description, you can also provide values that are assigned to a query parameter. You can mark one of the values as default (optional).        |
|**Request**     |  Define request content types, examples, and schemas.       |

### [Azure CLI](#tab/azure-cli)

To begin using Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

To add an operation to your test API, run the [az apim api operation create](/cli/azure/apim/api/operation#az-apim-api-operation-create) command:

```azurecli
az apim api operation create --resource-group <resource-group> \
    --display-name "Test call" --api-id test-api --method GET \
    --url-template /test --service-name <API-management-service-name> 
```

Run the [az apim api operation list](/cli/azure/apim/api/operation#az-apim-api-operation-list) command to see all your operations for an API:

```azurecli
az apim api operation list --resource-group <resource-group-name> \
    --api-id test-api --service-name <API-management-service-name> --output table
```

Keep this operation for use in the rest of this article. If you want to remove an operation, you can use the [az apim api operation delete](/cli/azure/apim/api/operation#az-apim-api-operation-delete) command. Get the operation ID from the previous command.

```azurecli
az apim api operation delete --resource-group <resource-group-name> \
    --api-id test-api --operation-id <ID> \
    --service-name <API-management-service-name>
```

---

## Enable response mocking

1. Select the API you created in [Create a test API](#create-a-test-api).
1. Ensure that the **Design** tab is selected.
1. Select the test operation that you added.
1. In the **Inbound processing** section, select **+ Add policy**.

    :::image type="content" source="media/mock-api-responses/add-policy.png" alt-text="Screenshot that shows the first steps for enabling response mocking." lightbox="media/mock-api-responses/add-policy.png" :::

1. Select the **Mock responses** tile from the gallery:

    :::image type="content" source="media/mock-api-responses/mock-responses-policy-tile.png" alt-text="Screenshot that shows the Mock responses tile." border="false":::

1. Ensure that **200 OK, application/json** appears in the **API Management response** box. This selection indicates that your API should return the response sample that you defined in the previous section.

    :::image type="content" source="media/mock-api-responses/set-mocking-response.png" alt-text="Screenshot that shows the API Management response selection." lightbox="media/mock-api-responses/set-mocking-response.png":::

1. Select **Save**.

    > [!TIP]
    > A yellow bar displaying the text **Mocking is enabled** appears. This message indicates that the responses returned from API Management are mocked by the [mocking policy](mock-response-policy.md) and aren't produced by the backend.

## Test the mocked API

1. Select the API you created in [Create a test API](#create-a-test-api).
1. On the **Test** tab, ensure that the **Test call** API is selected, and then select **Send** to make a test call:

   :::image type="content" source="media/mock-api-responses/test-mock-api.png" alt-text="Screenshot that shows the steps for testing the mocked API." lightbox="media/mock-api-responses/test-mock-api.png":::

1. The **HTTP response** displays the JSON provided as a sample in the first section of the tutorial:

    :::image type="content" source="media/mock-api-responses/http-response.png" alt-text="Screenshot that shows the mock HTTP response." lightbox="media/mock-api-responses/http-response.png":::

## Next step

Go to the next tutorial:

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
