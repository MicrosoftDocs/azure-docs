---
title: Import a GraphQL API to Azure API Management | Microsoft Docs
titleSuffix: 
description: Learn how to add an existing GraphQL service as an API in Azure API Management using the Azure portal, Azure CLI, or Azure PowerShell. Manage the API and enable queries to pass through to the GraphQL endpoint.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 10/27/2022
ms.custom: event-tier1-build-2022
---

# Import a GraphQL API

[!INCLUDE [api-management-graphql-intro.md](../../includes/api-management-graphql-intro.md)]

In this article, you'll:
> [!div class="checklist"]
> * Learn more about the benefits of using GraphQL APIs.
> * Add a GraphQL API to your API Management instance.
> * Test your GraphQL API.
> * Learn the limitations of your GraphQL API in API Management.

If you want to import a GraphQL schema and set up field resolvers using REST or SOAP API endpoints, see [Import a GraphQL schema and set up field resolvers](graphql-schema-resolve-api.md).

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A GraphQL API. 
- Azure CLI
    [!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]


- Azure PowerShell
    [!INCLUDE [azure-powershell-requirements-no-header](../../includes/azure-powershell-requirements-no-header.md)]

## Add a GraphQL API

#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **APIs** > **+ Add API**.
1. Under **Define a new API**, select the **GraphQL** icon.

    :::image type="content" source="media/graphql-api/import-graphql-api.png" alt-text="Screenshot of selecting GraphQL icon from list of APIs.":::

1. In the dialog box, select **Full** and complete the required form fields.

    :::image type="content" source="media/graphql-api/create-from-graphql-schema.png" alt-text="Screenshot of fields for creating a GraphQL API.":::

    | Field | Description |
    |----------------|-------|
    | **Display name** | The name by which your GraphQL API will be displayed. |
    | **Name** | Raw name of the GraphQL API. Automatically populates as you type the display name. |
    | **GraphQL API endpoint** | The base URL with your GraphQL API endpoint name. <br /> For example: *`https://example.com/your-GraphQL-name`*. You can also use a common "Star Wars" GraphQL endpoint such as `https://swapi-graphql.azure-api.net/graphql` as a demo. |
    | **Upload schema** | Optionally select to browse and upload your schema file to replace the schema retrieved from the GraphQL endpoint (if available).  |
    | **Description** | Add a description of your API. |
    | **URL scheme** | Select **HTTP**, **HTTPS**, or **Both**. Default selection: *Both*. |
    | **API URL suffix**| Add a URL suffix to identify this specific API in this API Management instance. It has to be unique in this API Management instance. |
    | **Base URL** | Uneditable field displaying your API base URL |
    | **Tags** | Associate your GraphQL API with new or existing tags. |
    | **Products** | Associate your GraphQL API with a product to publish it. |
    | **Gateways** | Associate your GraphQL API with existing gateways. Default gateway selection: *Managed*. |
    | **Version this API?** | Select to apply a versioning scheme to your GraphQL API. |

1. Select **Create**.
1. After the API is created, browse the schema on the **Design** tab, in the **Frontend** section.
       :::image type="content" source="media/graphql-api/explore-schema.png" alt-text="Screenshot of exploring the GraphQL schema in the portal.":::

#### [Azure CLI](#tab/cli)

The following example uses the [az apim api import](/cli/azure/apim/api#az-apim-api-import) command to import a GraphQL passthrough API from the specified URL to an API Management instance named *apim-hello-world*. 

```azurecli-interactive
# API Management service-specific details
APIMServiceName="apim-hello-world"
ResourceGroupName="myResourceGroup"

# API-specific details
APIId="my-graphql-api"
APIPath="myapi"
DisplayName="MyGraphQLAPI"
SpecificationFormat="GraphQL"
SpecificationURL="<GraphQL backend endpoint>"

# Import API
az apim api import --path $APIPath --resource-group $ResourceGroupName \
    --service-name $APIMServiceName --api-id $APIId \
    --display-name $DisplayName --specification-format $SpecificationFormat --specification-url $SpecificationURL
```

After importing the API, if needed, you can update the settings by using the [az apim api update](/cli/azure/apim/api#az-apim-api-update) command.


#### [PowerShell](#tab/powershell)

The following example uses the [Import-AzApiManagementApi](/powershell/module/az.apimanagement/import-azapimanagementapi?) Azure PowerShell cmdlet to import a GraphQL passthrough API from the specified URL to an API Management instance named *apim-hello-world*. 

```powershell-interactive
# API Management service-specific details
$apimServiceName = "apim-hello-world"
$resourceGroupName = "myResourceGroup"

# API-specific details
$apiId = "my-graphql-api"
$apiPath = "myapi"
$specificationFormat = "GraphQL"
$specificationUrl = "<GraphQL backend endpoint>"

# Get context of the API Management instance. 
$context = New-AzApiManagementContext -ResourceGroupName $resourceGroupName -ServiceName $apimServiceName

# Import API
Import-AzApiManagementApi -Context $context -ApiId $apiId -SpecificationFormat $specificationFormat -SpecificationUrl $specificationUrl -Path $apiPath
```

After importing the API, if needed, you can update the settings by using the [Set-AzApiManagementApi](/powershell/module/az.apimanagement/set-azapimanagementapi) cmdlet.

---

[!INCLUDE [api-management-graphql-test.md](../../includes/api-management-graphql-test.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps
> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
