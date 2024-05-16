---
title: Create a lab plan using Bicep or ARM
titleSuffix: Azure Lab Services
description: Learn how to create an Azure Lab Services lab plan by using Bicep or ARM templates.
ms.topic: how-to
ms.date: 08/28/2023
ms.custom: mode-api, devx-track-bicep, devx-track-arm-template
---

# Create a lab plan using a Bicep file or ARM template

In this article, you learn how to create a lab plan using a Bicep file or Azure Resource Manager (ARM) template.  For a detailed overview of Azure Lab Services, see [An introduction to Azure Lab Services](lab-services-overview.md).

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]

## Review the Bicep file

# [Bicep](#tab/bicep)

The Bicep file used in this article is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/lab-plan/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.labservices/lab-plan/main.bicep":::

# [ARM](#tab/arm)

The template used in this article is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/lab-plan/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.labservices/lab-plan/azuredeploy.json":::

One Azure resource is defined in the template:

- **[Microsoft.LabServices/labplans](/azure/templates/microsoft.labservices/labplans)**: The lab plan serves as a collection of configurations and settings that apply to the labs created from it.

More Azure Lab Services template samples can be found in [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Labservices&pageNumber=1&sort=Popular).

---

## Deploy the resources

# [Bicep](#tab/bicep)

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters adminUsername=<admin-username>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -adminUsername "<admin-username>"
    ```

    ---

  > [!NOTE]
  > Replace **\<admin-username\>** with a unique username. You'll also be prompted to enter adminPassword. The minimum password length is 12 characters.

  When the deployment finishes, you should see a messaged indicating the deployment succeeded.

# [ARM](#tab/arm)

1. Select the following link to sign in to Azure and open a template. The template creates a lab plan.

    :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.labservices%2flab-plan%2fazuredeploy.json":::

1. Optionally, change the name of the lab plan.
1. Select the **Resource group**.
1. Select **Review + create**.
1. Select **Create**.

The Azure portal is used here to deploy the template. You can also use Azure PowerShell, Azure CLI, or the REST API. To learn other deployment methods, see [Deploy resources with ARM templates](../azure-resource-manager/templates/deploy-powershell.md).

---

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

To use Azure PowerShell, first verify the `Az.LabServices` module is installed.  Then use the `Get-AzLabServicesLabPlan` cmdlet.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the VM and all of the resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next step

In this article, you deployed a simple virtual machine using a Bicep file or ARM template. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.

> [!div class="nextstepaction"]
> [Managing Labs](how-to-manage-labs.md)
