---
title: Import an OpenAPI specification to Azure API Management | Microsoft Docs
description: Learn how to import an OpenAPI specification to an API Management instance using the Azure portal, Azure CLI, or Azure PowerShell. Then, test the API in the Azure portal.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 11/27/2024
ms.author: danlep
ms.custom: engagement-fy23, devx-track-azurepowershell, devx-track-azurecli
---
# Import an OpenAPI specification

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article shows how to import an "OpenAPI specification" backend API to Azure API Management using various tools. The article also shows how to test the API in API Management. 

In this article, you learn how to:
> [!div class="checklist"]
> * Import an OpenAPI specification using the Azure portal, Azure CLI, or Azure PowerShell
> * Test the API in the Azure portal

> [!NOTE]
> API import limitations are documented in [API import restrictions and known issues](api-management-api-import-restrictions.md).

## Prerequisites

* An API Management instance. If you don't already have one, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).

* Azure CLI
    [!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]


* Azure PowerShell
    [!INCLUDE [azure-powershell-requirements-no-header](~/reusable-content/ce-skilling/azure/includes/azure-powershell-requirements-no-header.md)]

## <a name="create-api"> </a>Import a backend API

For this example, you import the [OpenAPI specification](https://petstore3.swagger.io/api/v3/openapi.json) for the open source [Petstore API](https://petstore3.swagger.io/), but you can substitute an OpenAPI specification of your choice.
	

#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **APIs** > **+ Add API**.
1. Under **Create from definition**, select **OpenAPI**.

    :::image type="content" source="media/import-api-from-oas/oas-api.png" alt-text="Screenshot of creating an API from an OpenAPI specification in the portal." border="false":::
1. Enter API settings. You can set the values during creation or configure them later by going to the **Settings** tab. The settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.
1. Select **Create**.

#### [Azure CLI](#tab/cli)

The following example uses the [az apim api import](/cli/azure/apim/api#az-apim-api-import) command to import an OpenAPI specification from the specified URL to an API Management instance named *apim-hello-world*. To import using a path to a specification instead of a URL, use the `--specification-path` parameter.

```azurecli-interactive
# API Management service-specific details
APIMServiceName="apim-hello-world"
ResourceGroupName="myResourceGroup"

# API-specific details
APIId="swagger-petstore"
APIPath="store"
SpecificationFormat="OpenAPI"
SpecificationURL="https://petstore3.swagger.io/api/v3/openapi.json"

# Import API
az apim api import --path $APIPath --resource-group $ResourceGroupName \
    --service-name $APIMServiceName --api-id $APIId \
    --specification-format $SpecificationFormat --specification-url $SpecificationURL
```

After importing the API, if needed, you can update the settings by using the [az apim api update](/cli/azure/apim/api#az-apim-api-update) command.

#### [PowerShell](#tab/powershell)

The following example uses the [Import-AzApiManagementApi](/powershell/module/az.apimanagement/import-azapimanagementapi?) Azure PowerShell cmdlet to import an OpenAPI specification from the specified URL to an API Management instance named *apim-hello-world*. To import using a path to a specification instead of a URL, use the `-SpecificationPath` parameter.

```powershell-interactive
# API Management service-specific details
$apimServiceName = "apim-hello-world"
$resourceGroupName = "myResourceGroup"

# API-specific details
$apiId = "swagger-petstore"
$apiPath = "store"
$specificationFormat = "OpenAPI"
$specificationUrl = "https://petstore3.swagger.io/api/v3/openapi.json"

# Get context of the API Management instance. 
$context = New-AzApiManagementContext -ResourceGroupName $resourceGroupName -ServiceName $apimServiceName

# Import API
Import-AzApiManagementApi -Context $context -ApiId $apiId -SpecificationFormat $specificationFormat -SpecificationUrl $specificationUrl -Path $apiPath
```

After importing the API, if needed, you can update the settings by using the [Set-AzApiManagementApi](/powershell/module/az.apimanagement/set-azapimanagementapi) cmdlet.

---

## View and edit OpenAPI specification

In the portal, use the OpenAPI specification editor to view, validate, or edit the specification for the API that you imported. 

To use the OpenAPI specification editor:

1. In the Azure portal, navigate to your API Management instance.
1. In the left menu, under **APIs**, select **APIs** > **\<your API\>** > **All operations**.
1. On the **Design** tab, in **Frontend**, select **OpenAPI Specification editor** (pencil icon). You can open the specification in JSON or YAML format.
1. Review or edit the specification as needed. **Save** your changes.

## Validate against an OpenAPI specification schema

You can configure API Management [validation policies](api-management-policies.md#content-validation) to validate requests and responses (or elements of them) against the schema in an OpenAPI specification. For example, use the [validate-content](validate-content-policy.md) policy to validate the size or content of a request or response body.


[!INCLUDE [api-management-test-api-portal](../../includes/api-management-test-api-portal.md)]

[!INCLUDE [api-management-append-apis.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]


## Next steps

> [!div class="nextstepaction"]
> * [Create and publish a product](api-management-howto-add-products.md)
> * [Transform and protect a published API](transform-api.md)
