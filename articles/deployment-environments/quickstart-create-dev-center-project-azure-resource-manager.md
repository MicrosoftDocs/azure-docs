---
title: Create dev center and project for Azure Deployment Environment by using Azure Resource Manager template (ARM template)
description: Learn how to create and configure Dev Center and Project for Azure Deployment Environment by using Azure Resource Manager template (ARM template).
services: deployment-environments
ms.service: deployment-environments
author: thophan-microsoft
ms.author: thophan
ms.topic: quickstart-arm
ms.custom: subject-armqs
ms.date: 03/21/2024

# Customer intent: As an enterprise admin, I want a quick method to create and configure a Dev Center and Project resource to evaluate Deployment Environments.
---

# Quickstart: Create dev center and project for Azure Deployment Environments by using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create and configure a dev center and project for creating an environment.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the
**Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.devcenter%2Fdeployment-environments%2Fazuredeploy.json":::

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Owner or Contributor role on an Azure subscription or resource group.
- Microsoft Entra AD. Your organization must use Microsoft Entra AD for identity and access management.
- Microsoft Intune subscription. Your organization must use Microsoft Intune for device management.

## Review the template

The template used in this quickStart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/deployment-environments/).

To view the template, see [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devcenter/deployment-environments/azuredeploy.json).

Azure resources defined in the template:

- [Microsoft.DevCenter/devcenters](/azure/templates/microsoft.devcenter/devcenters): create a dev center.
- [Microsoft.DevCenter/devcenters/catalogs](/azure/templates/microsoft.devcenter/devcenters/catalogs): create a catalog.
- [Microsoft.DevCenter/devcenters/environmentTypes](/azure/templates/microsoft.devcenter/devcenters/environmenttypes): create a dev center environment type.
- [Microsoft.DevCenter/projects](/azure/templates/microsoft.devcenter/projects): create a project.
- [Microsoft.Authorization/roleAssignments](/azure/templates/microsoft.authorization/roleassignments): create a role assignment.
- [Microsoft.DevCenter/projects/environmentTypes](/azure/templates/microsoft.devcenter/projects/environmenttypes): create a project environment type.

## Deploy the template

1. Select **Open Cloud Shell** on either of the following code blocks and follow instructions to sign in to Azure.
2. Wait until you see the prompt from the console, then ensure you're set to deploy to the subscription you want.
3. If you want to continue deploying the template, select **Copy** on the code block, then right-click the shell console and select **Paste**.

   1. If you want to use the default parameter values:

      ```azurepowershell-interactive
      $location = Read-Host "Please enter region name e.g. eastus"
      $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devcenter/deployment-environments/azuredeploy.json"

      Write-Host "Start provisioning..."

      New-AzDeployment -Name (New-Guid) -Location $location -TemplateUri $templateUri

      Write-Host "Provisioning completed."

      ```

   2. If you want to input your own values:

      ```azurepowershell-interactive
      $resourceGroupName = Read-Host "Please enter resource group name: "
      $devCenterName = Read-Host "Please enter dev center name: "
      $projectName = Read-Host "Please enter project name: "
      $environmentTypeName = Read-Host "Please enter environment type name: "
      $userObjectId = Read-Host "Please enter your user object ID e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

      $location = Read-Host "Please enter region name e.g. eastus"
      $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devcenter/deployment-environments/azuredeploy.json"

      Write-Host "Start provisioning..."

      New-AzDeployment -Name (New-Guid) -Location $location -TemplateUri $templateUri -resourceGroupName $resourceGroupName -devCenterName $devCenterName -projectName $projectName -environmentTypeName $environmentTypeName -userObjectId $userObjectId

      Write-Host "Provisioning completed."

      ```

It takes about 5 minutes to deploy the template.

Azure PowerShell is used to deploy the template. You can also use the Azure portal and Azure CLI. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

### Required parameters

- *Resource Group Name*: The name of the resource group where the dev center and project are located.
- *Dev Center Name*: The name of the dev center.
- *Project Name*: The name of the project that is associated with the dev center.
- *Environment Type Name*: The name of the environment type for both the dev center and project.
- *User Object ID*: The object ID of the user that is granted the *Deployment Environments User* role.

Alternatively, you can provide access to deployment environments project in the Azure portal. See [Provide user access to Azure Deployment Environments projects](./how-to-configure-deployment-environments-user.md).

## Review deployed resources

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Resource groups** from the left pane. 
3. Select the resource group that you created in the previous section.  

## Clean up resources

1. Delete any environments associated with the project either through the Azure portal or the developer portal.
2. Delete the project resource.
3. Delete the dev center resource.
4. Delete the resource group.
5. Remove the role assignments that you don't need anymore from the subscription.

## Next steps

In this quickstart, you created and configured a dev center and project. Advance to the next quickstart to learn how to create an environment.

> [!div class="nextstepaction"]
> [Quickstart: Create and access an environment](./quickstart-create-access-environments.md)