---
title: Quickstart - Create your Azure API center - Bicep
description: In this quickstart, use Bicep to set up an API center for API discovery, reuse, and governance. 
author: dlepow
ms.service: api-center
ms.topic: quickstart
ms.date: 05/13/2024
ms.author: danlep 
---

# Quickstart: Create your API center - Bicep

[!INCLUDE [quickstart-intro](includes/quickstart-intro.md)]

[!INCLUDE [resource-manager-quickstart-bicep-introduction](../../includes/resource-manager-quickstart-bicep-introduction.md)]

[!INCLUDE [quickstart-prerequisites](includes/quickstart-prerequisites.md)]

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

* For Azure PowerShell: 
    [!INCLUDE [azure-powershell-requirements-no-header.md](../../includes/azure-powershell-requirements-no-header.md)]

## Review the Bicep file

The Bicep file used in this quickstart is from
[Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/azure-api-center-create/). 

In this example, the Bicep file creates an API center in the Free plan and registers a sample API in the default workspace. Currently, API Center supports a single, default workspace for all child resources.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.apicenter/azure-api-center-create/main.bicep":::

The following Azure resources are defined in the Bicep file:

* [Microsoft.ApiCenter/services](/azure/templates/microsoft.apicenter/services)
* [Microsoft.ApiCenter/services/workspaces](/azure/templates/microsoft.apicenter/services/workspaces)
* [Microsoft.ApiCenter/services/workspaces/apis](/azure/templates/microsoft.apicenter/services/workspaces/apis)

## Deploy the Bicep file

You can use Azure CLI or Azure PowerShell to deploy the Bicep file. For more information about deploying Bicep files, see [Deploy](../azure-resource-manager/bicep/deploy-cli.md).

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

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

Replace **\<api-name\>** and **\<api-type\>** with the name and type of an API that you want to register in your API center.

When the deployment finishes, you should see a message indicating the deployment succeeded.

[!INCLUDE [quickstart-template-review-resources](includes/quickstart-template-review-resources.md)]

[!INCLUDE [quickstart-next-steps](includes/quickstart-next-steps.md)]
