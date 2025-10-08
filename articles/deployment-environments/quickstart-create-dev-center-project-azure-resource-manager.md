---
title: Create a Dev Center and Project for Deployment Environments by Using an ARM Template
description: Learn how to create and configure a dev center and project for Azure Deployment Environments by using an ARM template.
services: deployment-environments
ms.service: azure-deployment-environments
author: RoseHJM
ms.author: rosemalcolm
ms.topic: quickstart-arm
ms.custom: subject-armqs, devx-track-arm-template
ms.date: 07/28/2025
# Customer intent: As an enterprise admin, I want to use an ARM template to create and configure a dev center and project so that I can evaluate Deployment Environments.
---

# Quickstart: Create a dev center and project for Deployment Environments by using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create and configure an Azure Deployment Environments dev center and project for creating an environment.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the
**Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.devcenter%2Fdeployment-environments%2Fazuredeploy.json":::

## Prerequisites

- An Azure subscription. Create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) if you don't have one.
- Owner or Contributor role on an Azure subscription or resource group.
- Microsoft Entra ID. Your organization must use Microsoft Entra ID for identity and access management.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/deployment-environments/).

To view the template, see [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devcenter/deployment-environments/azuredeploy.json).

Azure resources defined in the template:

- [Microsoft.DevCenter/devcenters](/azure/templates/microsoft.devcenter/devcenters). Create a dev center.
- [Microsoft.DevCenter/devcenters/catalogs](/azure/templates/microsoft.devcenter/devcenters/catalogs). Create a catalog.
- [Microsoft.DevCenter/devcenters/environmentTypes](/azure/templates/microsoft.devcenter/devcenters/environmenttypes). Create a dev center environment type.
- [Microsoft.DevCenter/projects](/azure/templates/microsoft.devcenter/projects). Create a project.
- [Microsoft.Authorization/roleAssignments](/azure/templates/microsoft.authorization/roleassignments). Create a role assignment.
- [Microsoft.DevCenter/projects/environmentTypes](/azure/templates/microsoft.devcenter/projects/environmenttypes). Create a project environment type.

## Deploy the template

1. Select **Open Cloud Shell** above either of the following code blocks and follow the instructions to sign in to Azure.
1. When you see the prompt from the console, ensure that you're ready to deploy to your chosen subscription.
1. Select the **PowerShell** shell and follow the prompts.
1. If you want to continue deploying the template, select **Copy** on the code block, and then right-click the shell console and select **Paste**.

   - If you want to use the default parameter values, use this code:

      ```azurepowershell-interactive
      $location = Read-Host "Please enter region name, for example, eastus"
      $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devcenter/deployment-environments/azuredeploy.json"

      Write-Host "Start provisioning..."

      New-AzDeployment -Name (New-Guid) -Location $location -TemplateUri $templateUri

      Write-Host "Provisioning completed."

      ```

   - If you want to input your own values, use this code:

      ```azurepowershell-interactive
      $resourceGroupName = Read-Host "Please enter resource group name: "
      $devCenterName = Read-Host "Please enter dev center name: "
      $projectName = Read-Host "Please enter project name: "
      $environmentTypeName = Read-Host "Please enter environment type name: "
      $userObjectId = Read-Host "Please enter your user object ID, for example, xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

      $location = Read-Host "Please enter region name, for example, eastus"
      $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devcenter/deployment-environments/azuredeploy.json"

      Write-Host "Start provisioning..."

      New-AzDeployment -Name (New-Guid) -Location $location -TemplateUri $templateUri -resourceGroupName $resourceGroupName -devCenterName $devCenterName -projectName $projectName -environmentTypeName $environmentTypeName -userObjectId $userObjectId

      Write-Host "Provisioning completed."

      ```

It takes about 5 minutes to deploy the template.

Azure PowerShell is used to deploy the template. You can also use the Azure portal and Azure CLI. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

### Required parameters

- *Resource group name*: The name of the resource group where the dev center and project will be located.
- *Dev center name*: The name of the dev center.
- *Project name*: The name of the project that's associated with the dev center.
- *Environment type name*: The name of the environment type for both the dev center and the project.
- *User object ID*: The object ID of a user that's granted the *Deployment Environments User* role.

Alternatively, you can provide access to the deployment environments project in the Azure portal. See [Provide user access to Azure Deployment Environments projects](./how-to-manage-deployment-environments-access.md).

## Review deployed resources

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups** in the left pane. 
1. Select the resource group that you created in the previous section.  

## Clean up resources

If you no longer need the resources you created, delete them by following these instructions:

1. Delete any environments that are associated with the project by using the Azure portal or the developer portal.
1. Delete the project resource.
1. Delete the dev center resource.
1. Delete the resource group.
1. Remove role assignments that you don't need anymore from the subscription.

## Next step

In this quickstart, you created and configured a dev center and project. Go to the next quickstart to learn how to create an environment.

> [!div class="nextstepaction"]
> [Quickstart: Create and access an environment](./quickstart-create-access-environments.md)
