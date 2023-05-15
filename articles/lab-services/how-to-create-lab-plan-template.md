---
title: Create a lab plan by using Azure Resource Manager template (ARM template)
titleSuffix: Azure Lab Services
description: Learn how to create an Azure Lab Services lab plan by using Azure Resource Manager template (ARM template).
services: azure-resource-manager
ms.topic: how-to
ms.custom: mode-arm
ms.date: 06/04/2022
---

# Create a lab plan in Azure Lab Services using an ARM template

In this article, you learn how to use an Azure Resource Manager (ARM) template to create a lab plan.  Lab plans are used when creating labs for Azure Lab Services.  For an overview of Azure Lab Services, see [An introduction to Azure Lab Services](lab-services-overview.md).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Screenshot of the Deploy to Azure button to deploy resources with a template." link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.labservices%2flab-plan%2fazuredeploy.json":::

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this article is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/lab-plan/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.labservices/lab-plan/azuredeploy.json":::

One Azure resource is defined in the template:

- **[Microsoft.LabServices/labplans](/azure/templates/microsoft.labservices/labplans)**: The lab plan serves as a collection of configurations and settings that apply to the labs created from it.

More Azure Lab Services template samples can be found in [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Labservices&pageNumber=1&sort=Popular).

## Deploy the template

1. Select the following link to sign in to Azure and open a template. The template creates a lab plan.

    :::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Screenshot of the Deploy to Azure button to deploy resources with a template." link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.labservices%2flab-plan%2fazuredeploy.json":::

1. Optionally, change the name of the lab plan.
1. Select the **Resource group**.
1. Select **Review + create**.
1. Select **Create**.

The Azure portal is used here to deploy the template. You can also use Azure PowerShell, Azure CLI, or the REST API. To learn other deployment methods, see [Deploy resources with ARM templates](../azure-resource-manager/templates/deploy-powershell.md).

## Review deployed resources

You can either use the Azure portal to check the lab plan, or use the Azure PowerShell script to list the lab plan created.

To use Azure PowerShell, first verify the Az.LabServices module is installed.  Then use the **Get-AzLabServicesLabPlan** cmdlet.

```azurepowershell-interactive
Import-Module Az.LabServices

$labplanName = Read-Host -Prompt "Enter your lab plan name"
Get-AzLabServicesLabPlan -Name $labplanName

Write-Host "Press [ENTER] to continue..."
```

## Clean up resources

When no longer needed, [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group
), which deletes the lab plan.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName

Write-Host "Press [ENTER] to continue..."
```

## Next steps

For a step-by-step tutorial that guides you through the process of creating a lab, see:

> [!div class="nextstepaction"]
> [Create a lab using an ARM template](how-to-create-lab-template.md)
