---
title: Create Dev Center and Project for Azure Deployment Environment by using Azure Resource Manager template (ARM template)
description: Learn how to create and configure Dev Center and Project for Azure Deployment Environment by using Azure Resource Manager template (ARM template).
services: deployment-environments
ms.service: deployment-environments
author: thophan-microsoft
ms.author: thophan
ms.topic: quickstart-arm
ms.custom: subject-armqs
ms.date: 03/21/2024

# Customer intent: As an enterprise admin, I want a quick method to create and configure a Dev Center and Project resource to evaluate Deployment Environment.
---

# Quickstart: Create dev center and project for Azure Deployment Environments by using ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create and configure a dev center and project for creating an environment.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the
**Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/articles/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.devcenter%2Fenvironment-sandbox%2Fazuredeploy.json":::

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Owner or Contributor role on an Azure subscription or resource group.
- Microsoft Entra AD. Your organization must use Microsoft Entra AD for identity and access management.
- Microsoft Intune subscription. Your organization must use Microsoft Intune for device management.

## Review the template 

The template used in this quickStart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/environment-sandbox/).

To view the template, see [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devcenter/environment-sandbox/azuredeploy.json)

Azure resources defined in the template: 

- [Microsoft.DevCenter/devcenters](/azure/templates/microsoft.devcenter/devcenters): create a dev center.
- [Microsoft.DevCenter/devcenters/catalogs](/azure/templates/microsoft.devcenter/devcenters/catalogs): create a catalog.
- [Microsoft.DevCenter/devcenters/environmentTypes](/azure/templates/microsoft.devcenter/devcenters/environmenttypes): create a dev center environment type.
- [Microsoft.DevCenter/projects](/azure/templates/microsoft.devcenter/projects): create a project.
- [Microsoft.Authorization/roleAssignments](/azure/templates/microsoft.authorization/roleassignments): create a role assignment.
- [Microsoft.DevCenter/projects/environmentTypes](/azure/templates/microsoft.devcenter/projects/environmenttypes): create a project environment type.

## Deploy the template



## Review deployed resources



## Clean up resources

1. If there are environments associated with the project resource, delete them first either through the Azure Portal or the developer portal
2. Delete the project resource
3. Delete the dev center resource
4. Delete the resource group

## Next steps

- [Quickstart: Create and access an environment](./quickstart-create-access-environments.md)