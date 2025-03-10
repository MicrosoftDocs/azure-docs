---
title: Tutorial - Mock API responses in API Management - Azure portal  | Microsoft Docs
description: In this tutorial, you use API Management to set a policy on an API. The policy returns a mocked response even if the backend isn't available to send real responses.

author: dlepow
ms.service: azure-api-management
ms.custom: mvc, devx-track-azurecli, devdivchpfy22
ms.topic: tutorial
ms.date: 12/17/2021
ms.author: danlep

---
# Tutorial: Mock API responses

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Backend APIs are imported into an API Management (APIM) API or created and managed manually. The steps in this tutorial, show you how to:

+ Use API Management to create a blank HTTP API
+ Manage an HTTP API manually
+ Set a policy on an API so it returns a mocked response

This method lets developers continue with the implementation and testing of the API Management instance even if the backend isn't available to send real responses.

[!INCLUDE [api-management-workspace-try-it](../../includes/api-management-workspace-try-it.md)]

The ability to mock up responses is useful in many scenarios:

+ When the API façade is designed first and the backend implementation comes later. Or, the backend is being developed in parallel.
+ When the backend is temporarily not operational or not able to scale.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a test API
> * Add an operation to the test API
> * Enable response mocking
> * Test the mocked API

:::image type="content" source="media/mock-api-responses/mock-api-response-02.png" alt-text="Mocked API response":::

## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Understand the [concept of policies in Azure API Management](api-management-howto-policies.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).

## Create a test API

The steps in this section show how to create an HTTP API with no backend.

1. Sign in to the Azure portal, and then navigate to your API Management instance.
1. Select **APIs** > **+ Add API** > **HTTP** tile.

   :::image type="content" source="media/mock-api-responses/http-api.png" alt-text="Define a HTTP API":::

1. In the **Create an HTTP API** window, select **Full**.
1. Enter *Test API* for **Display name**.
1. Select **Unlimited** for **Products**.
1. Ensure that **Managed** is selected for **Gateways**.
1. Select **Create**.

    :::image type="content" source="media/mock-api-responses/create-http-api.png" alt-text="Create an HTTP API":::

## Add an operation to the test API

An API exposes one or more operations. In this section, you'll add an operation to the HTTP API you created. Calling the operation after completing the steps in this section triggers an error. After you complete the steps in the [Enable response mocking](#enable-response-mocking) section, you'll get no errors.

### [Portal](#tab/azure-portal)

1. Select the API you created in the previous step.
1. Select **+ Add Operation**.
1. In the **Frontend** window, enter the following values.

   :::image type="content" source="media/mock-api-responses/frontend-window.png" alt-text="Frontend window":::

     | Setting             | Value                             | Description                                                                                                                                                                                   |
    |---------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Display name**    | *Test call*                       | The name that is displayed in the [developer portal](api-management-howto-developer-portal.md).                                                                                                                                       |
    | **URL** (HTTP verb) | GET                               | Select one of the predefined HTTP verbs.                                                                                                                                         |
    | **URL**             | */test*                           | A URL path for the API.                                                                                                                                                                       |
    | **Description**     |                                   |  Optional description of the operation, used to provide documentation in the developer portal to the developers using this API.                                                    |

1. Select the **Responses** tab, located under the URL, Display name, and Description fields. Enter settings on this tab to define response status codes, content types, examples, and schemas.
1. Select **+ Add response**, and select **200 OK** from the list.

    :::image type="content" source="media/mock-api-responses/add-response.png" alt-text="Add response to the API operation":::

1. Under the **Representations** heading on the right, select **+ Add representation**.
1. Enter *application/json* into the search box and select the **application/json** content type.
1. In the **Sample** text box, enter  `{ "sampleField" : "test" }`.
1. Select **Save**.

    :::image type="content" source="media/mock-api-responses/add-representation.png" alt-text="Add representation to the API operation":::

Although not required for this example, you can configure more settings for an API operation on other tabs, including:

|Tab      |Description  |
|---------|---------|
|**Query**     |  Add query parameters. Besides providing a name and description, you can also provide values that are assigned to a query parameter. You can mark one of the values as default (optional).        |
|**Request**     |  Define request content types, examples, and schemas.       |

### [Azure CLI](#tab/azure-cli)

To begin using Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

To add an operation to your test API, run the [az apim api operation create](/cli/azure/apim/api/operation#az-apim-api-operation-create) command:

```azurecli
az apim api operation create --resource-group apim-hello-word-resource-group \
    --display-name "Test call" --api-id test-api --method GET \
    --url-template /test --service-name apim-hello-world 
```

Run the [az apim api operation list](/cli/azure/apim/api/operation#az-apim-api-operation-list) command to see all your operations for an API:

```azurecli
az apim api operation list --resource-group apim-hello-word-resource-group \
    --api-id test-api --service-name apim-hello-world --output table
```

To remove an operation, use the [az apim api operation delete](/cli/azure/apim/api/operation#az-apim-api-operation-delete) command. Get the operation ID from the previous command.

```azurecli
az apim api operation delete --resource-group apim-hello-word-resource-group \
    --api-id test-api --operation-id 00000000000000000000000000000000 \
    --service-name apim-hello-world
```

Keep this operation for use in the rest of this article.

---

## Enable response mocking

1. Select the API you created in [Create a test API](#create-a-test-api).
1. In the window on the right, ensure that the **Design** tab is selected.
1. Select the test operation that you added.
1. In the **Inbound processing** window, select **+ Add policy**.

    :::image type="content" source="media/mock-api-responses/add-policy.png" alt-text="Add processing policy" border="false":::

1. Select **Mock responses**  from the gallery.

    :::image type="content" source="media/mock-api-responses/mock-responses-policy-tile.png" alt-text="Mock responses policy tile" border="false":::

1. In the **API Management response** textbox, type **200 OK, application/json**. This selection indicates that your API should return the response sample you defined in the previous section.

    :::image type="content" source="media/mock-api-responses/set-mocking-response.png" alt-text="Set mocking response":::

1. Select **Save**.

    > [!TIP]
    > A yellow bar with the text **Mocking is enabled** displays. This indicates that the responses returned from API Management are mocked by the [mocking policy](mock-response-policy.md) and aren't produced by the backend.

## Test the mocked API

1. Select the API you created in [Create a test API](#create-a-test-api).
1. Select the **Test** tab.
1. Ensure that the **Test call** API is selected, and then select **Send** to make a test call.

   :::image type="content" source="media/mock-api-responses/test-mock-api.png" alt-text="Test the mocked API":::

1. The **HTTP response** displays the JSON provided as a sample in the first section of the tutorial.

    :::image type="content" source="media/mock-api-responses/http-response.png" alt-text="Mock HTTP response":::

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a test API
> * Add an operation to the test API
> * Enable response mocking
> * Test the mocked API

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
