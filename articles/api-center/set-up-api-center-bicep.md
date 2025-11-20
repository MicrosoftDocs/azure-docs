---
title: Quickstart - Create Your Azure API Center - Bicep
description: Learn how to use Bicep to set up an API center for API discovery, reuse, and governance. 
author: dlepow
ms.service: azure-api-center
ms.custom: devx-track-azurepowershell, devx-track-bicep
ms.topic: quickstart
ms.date: 10/17/2025
ms.author: danlep 
---

# Quickstart: Create your API center - Bicep

[!INCLUDE [quickstart-intro](includes/quickstart-intro.md)]

[!INCLUDE [resource-manager-quickstart-bicep-introduction](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

[!INCLUDE [quickstart-prerequisites](includes/quickstart-prerequisites.md)]

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

* For Azure PowerShell: 
    [!INCLUDE [azure-powershell-requirements-no-header.md](~/reusable-content/ce-skilling/azure/includes/azure-powershell-requirements-no-header.md)]

## Review the Bicep file

The Bicep file used in this quickstart is from
[Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/azure-api-center-create/).

In this example, the Bicep file creates an API center in the Free plan and registers a sample API in the default workspace. Currently, Azure API Center supports a single, default workspace for all child resources.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.apicenter/azure-api-center-create/main.bicep":::

The following Azure resources are defined in the Bicep file:

* [Microsoft.ApiCenter/services](/azure/templates/microsoft.apicenter/services)
* [Microsoft.ApiCenter/services/workspaces](/azure/templates/microsoft.apicenter/services/workspaces)
* [Microsoft.ApiCenter/services/workspaces/apis](/azure/templates/microsoft.apicenter/services/workspaces/apis)

## Deploy the Bicep file

You can use Azure CLI or Azure PowerShell to deploy the Bicep file. For more information about deploying Bicep files, see [Deploy Bicep files](../azure-resource-manager/bicep/deploy-cli.md).

1. Copy and save the Bicep file as *main.bicep* to your local computer. If you're using Azure Cloud Shell, upload the file to your home directory.

1. Deploy the Bicep file using either Azure CLI or Azure PowerShell. If necessary, include the path to the *main.bicep* file location.

    # [CLI](#tab/CLI)

    ```azurecli
    # Create a resource group in one of the supported regions for Azure API Center
    
    az group create --name exampleRG --location eastus

    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters apiName="<api-name>" apiType="<api-type>" 
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    # Create a resource group in one of the supported regions for Azure API Center

    New-AzResourceGroup -Name exampleRG -Location eastus

    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -apiName "<api-name>" -apiType "<api-type>"
    ```

    ---

Replace `<api-name>` and `<api-type>` with the name and type of an API that you want to register in your API center.

When the deployment finishes, you should see a message indicating the deployment succeeded.

[!INCLUDE [quickstart-template-review-resources](includes/quickstart-template-review-resources.md)]

[!INCLUDE [quickstart-next-steps](includes/quickstart-next-steps.md)]
