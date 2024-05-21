---
title: Quickstart - Create your Azure API center - ARM template
description: In this quickstart, use an Azure Resource Manager template to set up an API center for API discovery, reuse, and governance. 
author: dlepow
ms.service: api-center
ms.topic: quickstart
ms.date: 05/13/2024
ms.author: danlep 
---

# Quickstart: Create your API center - ARM template

[!INCLUDE [quickstart-intro](includes/quickstart-intro.md)]

[!INCLUDE [resource-manager-quickstart-introduction](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Screenshot of the Deploy to Azure button to deploy resources with a template." link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.apicenter%2Fazure-api-center-create%2Fazuredeploy.json":::


[!INCLUDE [quickstart-prerequisites](includes/quickstart-prerequisites.md)]

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

* For Azure PowerShell: 
    [!INCLUDE [azure-powershell-requirements-no-header.md](../../includes/azure-powershell-requirements-no-header.md)]

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/azure-api-center-create/).

In this example, the template creates an API center in the Free plan and registers a sample API in the default workspace. Currently, API Center supports a single, default workspace for all child resources.


:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.apicenter/azure-api-center-create/azuredeploy.json":::

The following Azure resources are defined in the template:

* [Microsoft.ApiCenter/services](/azure/templates/microsoft.apicenter/services)
* [Microsoft.ApiCenter/services/workspaces](/azure/templates/microsoft.apicenter/services/workspaces)
* [Microsoft.ApiCenter/services/workspaces/apis](/azure/templates/microsoft.apicenter/services/workspaces/apis)

## Deploy the template

Deploy the template using any standard method for [deploying an ARM template](../azure-resource-manager/templates/deploy-cli.md) such as the following examples using Azure CLI and PowerShell. 

1. Save the template file as **azuredeploy.json** to your local computer.
1. Deploy the template using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    # Create a resource group in one of the supported regions for Azure API Center
    
    az group create --name exampleRG --location eastus

    az deployment group create --resource-group exampleRG --template-file azuredeploy.json --parameters apiName="<api-name>" apiType="<api-type>" 
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    # Create a resource group in one of the supported regions for Azure API Center

    New-AzResourceGroup -Name exampleRG -Location eastus

    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./azuredeploy.json -apiName "<api-name>" -apiType "<api-type>"
    ```
    ---

Replace **\<api-name\>** and **\<api-type\>** with the name and type of an API that you want to register in your API center.

When the deployment finishes, you should see a message indicating the deployment succeeded.

[!INCLUDE [quickstart-template-review-resources](includes/quickstart-template-review-resources.md)]

[!INCLUDE [quickstart-next-steps](includes/quickstart-next-steps.md)]
