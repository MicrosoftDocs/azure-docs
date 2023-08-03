---
title: Import SOAP API to Azure API Management | Microsoft Docs
description: Learn how to import a SOAP API to Azure API Management as a WSDL specification using the Azure portal, Azure CLI, or Azure PowerShell. Then, test the API in the Azure portal.
author: dlepow
ms.service: api-management
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: how-to
ms.date: 10/26/2022
ms.author: danlep
---
# Import SOAP API to API Management

This article shows how to import a WSDL specification, which is a standard XML representation of a SOAP API. The article also shows how to test the API in API Management.

In this article, you learn how to:

> [!div class="checklist"]
> * Import a SOAP API
> * Test the API in the Azure portal

[!INCLUDE [api-management-wsdl-import](../../includes/api-management-wsdl-import.md)]

## Prerequisites

* An API Management instance. If you don't already have one, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).

* Azure CLI
    [!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]


* Azure PowerShell
    [!INCLUDE [azure-powershell-requirements-no-header](../../includes/azure-powershell-requirements-no-header.md)]


 
## <a name="create-api"> </a>Import a backend API

#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **APIs** > **+ Add API**.
1. Under **Create from definition**, select **WSDL**.

    ![SOAP API](./media/import-soap-api/wsdl-api.png)
1. In **WSDL specification**, enter the URL to your SOAP API, or click **Select a file** to select a local WSDL file.
1. In **Import method**, **SOAP pass-through** is selected by default. 
    With this selection, the API is exposed as SOAP, and API consumers have to use SOAP rules. If you want to "restify" the API, follow the steps in [Import a SOAP API and convert it to REST](restify-soap-api.md).

    ![Create SOAP API from WSDL specification](./media/import-soap-api/pass-through.png)
1. The following fields are filled automatically with information from the SOAP API: **Display name**, **Name**, **Description**.
1. Enter other API settings. You can set the values during creation or configure them later by going to the **Settings** tab. 

    For more information about API settings, see [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.
1. Select **Create**.

#### [Azure CLI](#tab/cli)

The following example uses the [az apim api import](/cli/azure/apim/api#az-apim-api-import) command to import a WSDL specification from the specified URL to an API Management instance named *apim-hello-world*. To import using a path to a specification instead of a URL, use the `--specification-path` parameter.

For this example WSDL, the service name is *OrdersAPI*, and one of the available endpoints (interfaces) is *basic*.

```azurecli-interactive
# API Management service-specific details
APIMServiceName="apim-hello-world"
ResourceGroupName="myResourceGroup"

# API-specific details
APIId="order-api"
APIPath="order"
SpecificationFormat="Wsdl"
SpecificationURL="https://fazioapisoap.azurewebsites.net/FazioService.svc?singleWsdl"
WsdlServiceName="OrdersAPI"
WsdlEndpointName="basic"

# Import API
az apim api import --path $APIPath --resource-group $ResourceGroupName \
    --service-name $APIMServiceName --api-id $APIId \
    --specification-format $SpecificationFormat --specification-url $SpecificationURL \
    --wsdl-service-name $WsdlServiceName --wsdl-endpoint-name $WsdlEndpointName
```

#### [PowerShell](#tab/powershell)

The following example uses the [Import-AzApiManagementApi](/powershell/module/az.apimanagement/import-azapimanagementapi?) Azure PowerShell cmdlet to import a WSDL specification from the specified URL to an API Management instance named *apim-hello-world*. To import using a path to a specification instead of a URL, use the `-SpecificationPath` parameter.

For this example WSDL, the service name is *OrdersAPI*, and one of the available endpoints (interfaces) is *basic*.

```powershell-interactive
# API Management service-specific details
$apimServiceName = "apim-hello-world"
$resourceGroupName = "myResourceGroup"

# API-specific det
$apiId = "orders-api"
$apiPath = "orders"
$specificationFormat = "Wsdl"
$specificationUrl = "https://fazioapisoap.azurewebsites.net/FazioService.svc?singleWsdl"
$wsdlServiceName = "OrdersAPI"
$wsdlEndpointName = "basic"

# Get context of the API Management instance. 
$context = New-AzApiManagementContext -ResourceGroupName $resourceGroupName -ServiceName $apimServiceName

# Import API
Import-AzApiManagementApi -Context $context -ApiId $apiId -SpecificationFormat $specificationFormat -SpecificationUrl $specificationUrl -Path $apiPath -WsdlServiceName $wsdlServiceName -WsdlEndpointName $wsdlEndpointName
```

---

[!INCLUDE [api-management-test-api-portal](../../includes/api-management-test-api-portal.md)]

## Wildcard SOAP action

If you need to pass a SOAP request that doesn't have a dedicated action defined in the API, you can configure a wildcard SOAP action. The wildcard action will match any SOAP request that isn't defined in the API.  

To define a wildcard SOAP action:

1. In the portal, select the API you created in the previous step.
1. In the **Design** tab, select **+ Add Operation**.
1. Enter a **Display name** for the operation.
1. In the URL, select `POST` and enter `/soapAction={any}` in the resource. The template parameter inside the curly brackets is arbitrary and doesn't affect the execution.


[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
