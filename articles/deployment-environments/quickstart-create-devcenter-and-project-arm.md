---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title:       # Add a title for the browser tab
description: # Add a meaningful description for search results
author:      thophan-microsoft # GitHub alias
ms.author:   thophan # Microsoft alias
ms.service:  # Add the ms.service or ms.prod value
# ms.prod:   # To use ms.prod, uncomment it and delete ms.service
ms.topic:    # Add the ms.topic value
ms.date:     03/20/2024
---

# Quickstart: Create dev center and project for Azure Deployment Environments by using ARM template

This quickstart describes how to use an Azure Resource Manager (ARM) template to set up a Deployment Environment in Azure.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

This [Environment sandbox](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.devcenter/environment-sandbox) template create and set up the dev center and project resources through deploying the template using the Azure portal. After completing this deployment, developers can use the [developer portal](https://devportal.microsoft.com/) to create environments by following [Quickstart: Create and access an environment](./quickstart-create-access-environments.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the
**Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/articles/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.devcenter%2Fenvironment-sandbox%2Fazuredeploy.json":::

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Owner or Contributor role on an Azure subscription or resource group.
- Microsoft Entra AD. Your organization must use Microsoft Entra AD for identity and access management.
- Microsoft Intune subscription. Your organization must use Microsoft Intune for device management.

## Review the template 

The template used in this QuickStart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/environment-sandbox/).

To view the template, see [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devcenter/environment-sandbox/azuredeploy.json)

Multiple Azure resources are defined in the template: 

- [Microsoft.DevCenter/devcenters](/azure/templates/microsoft.devcenter/devcenters): create a dev center.
- [Microsoft.DevCenter/devcenters/catalogs](/azure/templates/microsoft.devcenter/devcenters/catalogs): create a catalog.
- [Microsoft.DevCenter/devcenters/environmentTypes](/azure/templates/microsoft.devcenter/devcenters/environmenttypes): create a dev center environment type.
- [Microsoft.DevCenter/projects](/azure/templates/microsoft.devcenter/projects): create a project.
- [Microsoft.DevCenter/projects/environmentTypes](/azure/templates/microsoft.devcenter/projects/environmenttypes): create a project environment type.
- [Microsoft.Authorization/roleAssignments](/azure/templates/microsoft.authorization/roleassignments): create a role assignment.