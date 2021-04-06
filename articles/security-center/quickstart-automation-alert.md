---
title: Create a security automation for specific security alerts by using an Azure Resource Manager template (ARM template)
description: Learn how to create an Azure Security Center automation to trigger a logic app, which will be triggered by specific Security Center alerts by using an Azure Resource Manager template (ARM template).
services: azure-resource-manager
author: memildin
ms.service: azure-resource-manager
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: memildin
ms.date: 08/20/2020
---

# Quickstart: Create an automatic response to a specific security alert using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create a workflow automation that triggers a logic app when specific security alerts are received by Azure Security Center.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-securitycenter-create-automation-for-alertnamecontains%2fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

For a list of the roles and permissions required to work with Azure Security Center's workflow automation feature, see [workflow automation](workflow-automation.md).

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-securitycenter-create-automation-for-alertnamecontains/).

:::code language="json" source="~/quickstart-templates/101-securitycenter-create-automation-for-alertnamecontains/azuredeploy.json":::

### Relevant resources

- [**Microsoft.Security/automations**](/azure/templates/microsoft.security/automations): The automation that will trigger the logic app, upon receiving an Azure Security Center alert that contains a specific string.
- [**Microsoft.Logic/workflows**](/azure/templates/microsoft.logic/workflows): An empty triggerable Logic App.

For other Security Center quickstart templates, see these [community contributed templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Security&pageNumber=1&sort=Popular).

## Deploy the template

- **PowerShell**:

  ```azurepowershell-interactive
  New-AzResourceGroup -Name <resource-group-name> -Location <resource-group-location> #use this command when you need to create a new resource group for your deployment
  New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-securitycenter-create-automation-for-alertnamecontains/azuredeploy.json
  ```

- **CLI**:

  ```azurecli-interactive
  az group create --name <resource-group-name> --location <resource-group-location> #use this command when you need to create a new resource group for your deployment
  az deployment group create --resource-group <my-resource-group> --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-securitycenter-create-automation-for-alertnamecontains/azuredeploy.json
  ```

- **Portal**:

  [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-securitycenter-create-automation-for-alertnamecontains%2fazuredeploy.json)

  To find more information about this deployment option, see [Use a deployment button to deploy templates from GitHub repository](../azure-resource-manager/templates/deploy-to-azure-button.md).

## Review deployed resources

Use the Azure portal to check the workflow automation has been deployed.

1. From the [Azure portal](https://portal.azure.com), open **Security Center**.
1. From the top menu bar, select the filter icon, and select the specific subscription on which you deployed the new workflow automation.
1. From Security Center's sidebar, open **workflow automation** and check for your new automation.
    :::image type="content" source="./media/quickstart-automation-alert/validating-template-run.png" alt-text="List of configured automations" lightbox="./media/quickstart-automation-alert/validating-template-run.png":::
    >[!TIP]
    > If you have many workflow automations on your subscription, use the **filter by name** option.

## Clean up resources

When no longer needed, delete the workflow automation using the Azure portal.

1. From the [Azure portal](https://portal.azure.com), open **Security Center**.
1. From the top menu bar, select the filter icon, and select the specific subscription on which you deployed the new workflow automation.
1. From Security Center's sidebar, open **workflow automation** and find the automation to be deleted.
    :::image type="content" source="./media/quickstart-automation-alert/deleting-workflow-automation.png" alt-text="Steps for removing a workflow automation" lightbox="./media/quickstart-automation-alert/deleting-workflow-automation.png":::
1. Select the checkbox for the item to be deleted.
1. From the toolbar, select **Delete**.

## Next steps

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)
