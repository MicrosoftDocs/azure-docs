---
title: Add a GraphQL API to Azure API Management | Microsoft Docs
description: Learn how to add an existing GraphQL service as an API in Azure API Management. Manage the API and enable queries to pass through to the GraphQL endpoint.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 10/07/2025
ms.custom:
  - devx-track-azurepowershell
  - devx-track-azurecli
  - sfi-image-nochange

# Customer intent: As an API admin, I want to add a GraphQL API to Azure API Management by passing through to an existing GraphQL endpoint.
---

# Import a GraphQL API

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

[!INCLUDE [api-management-graphql-intro.md](../../includes/api-management-graphql-intro.md)]

In this article, you'll:
> [!div class="checklist"]
> * Add a pass-through GraphQL API to your API Management instance.
> * Test your GraphQL API.

If you want to import a GraphQL schema and set up field resolvers that use REST or SOAP API endpoints, see [Import a GraphQL schema and set up field resolvers](graphql-schema-resolve-api.md).

## Prerequisites

- An Azure API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- Azure CLI, if you want to use it to import the API.
    [!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]


- Azure PowerShell, if you want to use it to import the API.
    [!INCLUDE [azure-powershell-requirements-no-header](~/reusable-content/ce-skilling/azure/includes/azure-powershell-requirements-no-header.md)]

## Add a GraphQL API

#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.
1. In the left pane, select **APIs** > **APIs**.
1. Select **Add API**.
1. Under **Define a new API**, select the **GraphQL** tile.

    :::image type="content" source="media/graphql-api/import-graphql-api.png" alt-text="Screenshot of selecting the GraphQL tile.":::

1. In the resulting dialog box, select **Full**, and then enter values in the required fields, as described in the following table.

    :::image type="content" source="media/graphql-api/create-from-graphql-endpoint.png" alt-text="Screenshot of the Create from GraphQL schema page." lightbox="media/graphql-api/create-from-graphql-endpoint.png":::

    | Value | Description |
    |----------------|-------|
    | **Display name** | The name by which your GraphQL API will be displayed. |
    | **Name** | The raw name of the GraphQL API. Automatically populates as you type the display name. |
    | **GraphQL type** | Select **Pass-through GraphQL** to import from an existing GraphQL API endpoint.  |
    | **GraphQL API endpoint** | The base URL with your GraphQL API endpoint name. <br /> For example: *`https://example.com/your-GraphQL-name`*. You can also use a common SWAPI GraphQL endpoint like `https://swapi-graphql.azure-api.net/graphql` for the purpose of demonstration. |
    | **Upload schema** | Optionally select to upload your schema file to replace the schema that's retrieved from the GraphQL endpoint (if you have one).  |
    | **Description** | Add a description of your API. |
    | **URL scheme** |  Select a scheme based on your GraphQL endpoint. Select one of the options that includes a WebSocket scheme (**WS** or **WSS**) if your GraphQL API includes the subscription type. The default selection is **HTTP(S)**. |
    | **API URL suffix**| Add a URL suffix to identify the specific API in the API Management instance. It has to be unique in the API Management instance. |
    | **Base URL** | Uneditable field displaying your API base URL. |
    | **Tags** | Optionally associate your GraphQL API with new or existing tags. |
    | **Products** | Associate your GraphQL API with a product to publish it. |
    | **Version this API?** | Select the checkbox to apply a versioning scheme to your GraphQL API. |

1. Select **Create**.
1. After the API is created, review or modify the schema on the **Schema** tab.
       :::image type="content" source="media/graphql-api/explore-schema.png" alt-text="Screenshot of the GraphQL schema in the portal." lightbox="media/graphql-api/explore-schema.png":::

#### [Azure CLI](#tab/cli)

The following example uses the [az apim api import](/cli/azure/apim/api#az-apim-api-import) command to import a GraphQL passthrough API from the specified URL to an API Management instance named *apim-hello-world*. 

```azurecli
# Details specific to API Management instance.
APIMServiceName="apim-hello-world"
ResourceGroupName="myResourceGroup"

# API-specific details.
APIId="my-graphql-api"
APIPath="myapi"
DisplayName="MyGraphQLAPI"
SpecificationFormat="GraphQL"
SpecificationURL="<GraphQL backend endpoint>"

# Import API.
az apim api import \
    --path $APIPath \
    --resource-group $ResourceGroupName \
    --service-name $APIMServiceName --api-id $APIId \
    --display-name $DisplayName --specification-format $SpecificationFormat \
    --specification-url $SpecificationURL
```

After importing the API, you can update the settings by using the [az apim api update](/cli/azure/apim/api#az-apim-api-update) command, if you need to.


#### [PowerShell](#tab/powershell)

The following example uses the [Import-AzApiManagementApi](/powershell/module/az.apimanagement/import-azapimanagementapi?) Azure PowerShell cmdlet to import a GraphQL passthrough API from the specified URL to an API Management instance named *apim-hello-world*. 

```azurepowershell
# Details specific to API Management instance.
$apimServiceName = "apim-hello-world"
$resourceGroupName = "myResourceGroup"

# API-specific details.
$apiId = "my-graphql-api"
$apiPath = "myapi"
$specificationFormat = "GraphQL"
$specificationUrl = "<GraphQL backend endpoint>"

# Get context of the API Management instance. 
$context = New-AzApiManagementContext -ResourceGroupName $resourceGroupName -ServiceName $apimServiceName

# Import API.
Import-AzApiManagementApi -Context $context -ApiId $apiId -SpecificationFormat $specificationFormat -SpecificationUrl $specificationUrl -Path $apiPath
```

After importing the API, you can update the settings by using the [Set-AzApiManagementApi](/powershell/module/az.apimanagement/set-azapimanagementapi) cmdlet, if you need to.

---

[!INCLUDE [api-management-graphql-test.md](../../includes/api-management-graphql-test.md)]

### Test a subscription

If your GraphQL API supports a subscription, you can test it in the test console.

1. Ensure that your API allows a WebSocket URL scheme (**WS** or **WSS**) that's appropriate for your API. You can enable this setting on the **Settings** tab.
1. Set up a subscription query in the query editor, and then select **Connect** to establish a WebSocket connection to the backend service. 

    :::image type="content" source="media/graphql-api/test-graphql-subscription.png" alt-text="Screenshot of a subscription query in the query editor." lightbox="media/graphql-api/test-graphql-subscription.png":::

1. Review connection details in the **Subscription** pane. 

    :::image type="content" source="media/graphql-api/graphql-websocket-connection.png" alt-text="Screenshot of WebSocket connection in the portal.":::
    
1. Subscribed events appear in the **Subscription** pane. The WebSocket connection is maintained until you disconnect it or connect to a new WebSocket subscription.  

    :::image type="content" source="media/graphql-api/graphql-subscription-event.png" alt-text="Screenshot of GraphQL subscription events in the portal." lightbox="media/graphql-api/graphql-subscription-event.png":::

## Secure your GraphQL API

Secure your GraphQL API by applying both existing [authentication and authorization policies](api-management-policies.md#authentication-and-authorization) and a [GraphQL validation policy](validate-graphql-request-policy.md) to protect against GraphQL-specific attacks.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]