---
title: Create a security automation for specific security alerts by using an Azure Resource Manager template (ARM template) or Bicep
description: Learn how to create a Microsoft Defender for Cloud automation to trigger a logic app, which will be triggered by specific Defender for Cloud alerts by using an Azure Resource Manager template (ARM template) or Bicep.
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep, devx-track-arm-template
ms.date: 01/09/2023
---

# Quickstart: Create an automatic response to a specific security alert using an ARM template or Bicep

In this quickstart, you'll learn how to use an Azure Resource Manager template (ARM template) or a Bicep file to create a workflow automation. The workflow automation will trigger a logic app when specific security alerts are received by Microsoft Defender for Cloud.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

For a list of the roles and permissions required to work with Microsoft Defender for Cloud's workflow automation feature, see [workflow automation](workflow-automation.md).

The examples in this quickstart assume you have an existing Logic App. To deploy the example, you pass in parameters that contain the logic app name and resource group. For information about deploying a logic app, see [Quickstart: Create and deploy a Consumption logic app workflow in multi-tenant Azure Logic Apps with Bicep](../logic-apps/quickstart-create-deploy-bicep.md) or [Quickstart: Create and deploy a Consumption logic app workflow in multi-tenant Azure Logic Apps with an ARM template](../logic-apps/quickstart-create-deploy-azure-resource-manager-template.md).

## ARM template tutorial

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.security%2fsecuritycenter-create-automation-for-alertnamecontains%2fazuredeploy.json)

### Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/securitycenter-create-automation-for-alertnamecontains/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.security/securitycenter-create-automation-for-alertnamecontains/azuredeploy.json":::

### Relevant resources

- [**Microsoft.Security/automations**](/azure/templates/microsoft.security/automations): The automation that will trigger the logic app, upon receiving a Microsoft Defender for Cloud alert that contains a specific string.
- [**Microsoft.Logic/workflows**](/azure/templates/microsoft.logic/workflows): An empty triggerable Logic App.

For other Defender for Cloud quickstart templates, see these [community contributed templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Security&pageNumber=1&sort=Popular).

### Deploy the template

- **PowerShell**:

  ```azurepowershell-interactive
  New-AzResourceGroup -Name <resource-group-name> -Location <resource-group-location> #use this command when you need to create a new resource group for your deployment
  New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.security/securitycenter-create-automation-for-alertnamecontains/azuredeploy.json
  ```

- **CLI**:

  ```azurecli-interactive
  az group create --name <resource-group-name> --location <resource-group-location> #use this command when you need to create a new resource group for your deployment
  az deployment group create --resource-group <my-resource-group> --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.security/securitycenter-create-automation-for-alertnamecontains/azuredeploy.json
  ```

- **Portal**:

  [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.security%2fsecuritycenter-create-automation-for-alertnamecontains%2fazuredeploy.json)

  To find more information about this deployment option, see [Use a deployment button to deploy templates from GitHub repository](../azure-resource-manager/templates/deploy-to-azure-button.md).

### Review deployed resources

Use the Azure portal to check the workflow automation has been deployed.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **filter**.

1. Select the specific subscription on which you deployed the new workflow automation.

1. From Microsoft Defender for Cloud's menu, open **workflow automation** and check for your new automation.
    :::image type="content" source="./media/quickstart-automation-alert/validating-template-run.png" alt-text="List of configured automations." lightbox="./media/quickstart-automation-alert/validating-template-run.png":::

    >[!TIP]
    > If you have many workflow automations on your subscription, use the **filter by name** option.

### Clean up resources

When no longer needed, delete the workflow automation using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **filter**.

1. Select the specific subscription on which you deployed the new workflow automation.

1. From Microsoft Defender for Cloud's menu, open **workflow automation** and find the automation to be deleted.
    :::image type="content" source="./media/quickstart-automation-alert/deleting-workflow-automation.png" alt-text="Steps for removing a workflow automation." lightbox="./media/quickstart-automation-alert/deleting-workflow-automation.png":::

1. Select the checkbox for the item to be deleted.

1. From the toolbar, select **Delete**.

## Bicep tutorial

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

### Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/securitycenter-create-automation-for-alertnamecontains/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.security/securitycenter-create-automation-for-alertnamecontains/main.bicep":::

### Relevant resources

- [**Microsoft.Security/automations**](/azure/templates/microsoft.security/automations): The automation that will trigger the logic app, upon receiving a Microsoft Defender for Cloud alert that contains a specific string.
- [**Microsoft.Logic/workflows**](/azure/templates/microsoft.logic/workflows): An empty triggerable Logic App.

For other Defender for Cloud quickstart templates, see these [community contributed templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Security&pageNumber=1&sort=Popular).

### Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.

1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters automationName=<automation-name> logicAppName=<logic-name> logicAppResourceGroupName=<group-name> alertSettings={alert-settings}
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -automationName "<automation-name>" -logicAppName "<logic-name>" -logicAppResourceGroupName "<group-name>" -alertSettings "{alert-settings}"
    ```

    ---

    You're required to enter the following parameters:

    - **automationName**: Replace **\<automation-name\>** with the name of the automation. It has a minimum length of three characters and a maximum length of 24 characters.
    - **logicAppName**: Replace **\<logic-name\>** with the name of the logic app. It has a minimum length of three characters.
    - **logicAppResourceGroupName**: Replace **\<group-name\>** with the name of the resource group in which the resources are located. It has a minimum length of three characters.
    - **alertSettings**: Replace **\{alert-settings\}** with the alert settings object used for deploying the automation.

    > [!NOTE]
    > When the deployment finishes, you should see a message indicating the deployment succeeded.

### Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

### Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and all of its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

For step-by-step tutorials that guide you through the process of creating an ARM template or a Bicep file, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)
> [Quickstart: Create Bicep files with Visual Studio Code](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md)
