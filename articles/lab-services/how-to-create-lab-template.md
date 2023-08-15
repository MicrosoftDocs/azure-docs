---
title: Create a lab by using Azure Resource Manager template (ARM template)
titleSuffix: Azure Lab Services
description: Learn how to create an Azure Lab Services lab by using Azure Resource Manager template (ARM template).
services: azure-resource-manager
ms.topic: how-to
ms.custom: subject-armqs, devx-track-arm-template
ms.date: 05/10/2022
---

# Create a lab in Azure Lab Services using an ARM template

In this article, you learn how to use an Azure Resource Manager (ARM) template to create a lab.  You learn how to create a lab with Windows 11 Pro image.  Once a lab is created, an educator [configures the template](how-to-create-manage-template.md), [adds lab users](how-to-manage-lab-users.md), and [publishes the lab](tutorial-setup-lab.md#publish-lab).  For an overview of Azure Lab Services, see [An introduction to Azure Lab Services](lab-services-overview.md).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Screenshot of the Deploy to Azure button to deploy resources with a template." link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.labservices%2flab-using-lab-plan%2fazuredeploy.json":::

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]
[!INCLUDE [Existing lab plan](./includes/lab-services-prerequisite-lab-plan.md)]

## Review the template

The template used in this article is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/lab/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.labservices/lab-using-lab-plan/azuredeploy.json":::

One Azure resource is defined in the template:

- **[Microsoft.LabServices/labs](/azure/templates/microsoft.labservices/labs)**: resource type description.

More Azure Lab Services template samples can be found in [Azure Quickstart Templates](/samples/browse/?expanded=azure&products=azure-resource-manager&terms=lab%20services).  For more information how to create a lab without a lab plan using automation, see [Create Azure LabServices lab template](/samples/azure/azure-quickstart-templates/lab/).

## Deploy the template

1. Select the following link to sign in to Azure and open a template. The template creates a lab.

    :::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Screenshot of the Deploy to Azure button to deploy resources with a template." link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.labservices%2flab-using-lab-plan%2fazuredeploy.json":::

2. Optionally, change the name of the lab.
3. Select the **resource group** the lab plan you're going to use.
4. Enter the required values for the template:

    1. **adminUser**. The name of the user that will be added as an administrator for the lab VM.
    2. **adminPassword**.  The password for the administrator user for the lab VM.
    3. **labPlanId**.  The resource ID for the lab plan to be used.  The **Id** is listed in the **Properties** page of the lab plan resource in Azure.

        :::image type="content" source="./media/how-to-create-lab-template/lab-plan-properties-id.png" alt-text="Screenshot of properties page for lab plan in Azure Lab Services with I D property highlighted.":::

5. Select **Review + create**.
6. Select **Create**.

The Azure portal is used here to deploy the template. You can also use Azure PowerShell, Azure CLI, or the REST API. To learn other deployment methods, see [Deploy resources with ARM templates](../azure-resource-manager/templates/deploy-powershell.md).

## Review deployed resources

You can either use the Azure portal to check the lab, or use the Azure PowerShell script to list the lab resource created.

To use Azure PowerShell, first verify the Az.LabServices module is installed. Then use the **Get-AzLabServicesLab** cmdlet.

```azurepowershell-interactive
Import-Module Az.LabServices

$lab = Read-Host -Prompt "Enter your lab name"
Get-AzLabServicesLab -Name $lab

Write-Host "Press [ENTER] to continue..."
```

To verify educators can use the lab, navigate to the Azure Lab Services website: [https://labs.azure.com](https://labs.azure.com).  For more information about managing labs, see [View all labs](./how-to-manage-labs.md).

## Clean up resources

When no longer needed, [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group
), which deletes the lab and other resources in the same group.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName

Write-Host "Press [ENTER] to continue..."
```

Alternately, an educator may delete a lab from the Azure Lab Services website: [https://labs.azure.com](https://labs.azure.com).  For more information about deleting labs, see [Delete a lab](how-to-manage-labs.md#delete-a-lab).

## Next steps

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)
