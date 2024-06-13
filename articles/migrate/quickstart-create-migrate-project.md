---
title: Quickstart to create an Azure Migrate project using an Azure Resource Manager template.
description: In this quickstart, you learn how to create an Azure Migrate project using an Azure Resource Manager template (ARM template).
ms.date: 07/28/2021
author: vijain
ms.author: vijain
ms.manager: kmadnani
ms.service: azure-migrate
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create an Azure Migrate project using an ARM template

This quickstart describes how to set up an Azure Migrate project Recovery by using an Azure Resource Manager template (ARM template). Azure Migrate provides a centralized hub to assess and migrate to Azure on-premises servers, infrastructure, applications, and data. Azure Migrate supports assessment and migration of on-premises VMware VMs, Hyper-V VMs, physical servers, other virtualized VMs, databases, web apps, and virtual desktops.

This template creates an Azure Migrate project that will be used further for assessing and migrating your Azure on-premises servers, infrastructure, applications, and data.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.migrate%2Fmigrate-project-create%2Fazuredeploy.json":::

## Prerequisites

If you don't have an active Azure subscription, you can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/migrate-project-create/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.migrate/migrate-project-create/azuredeploy.json":::

## Deploy the template

To deploy the template, the **Subscription**, **Resource group**, **Project name**, and **Location** are required.

1. To sign in to Azure and open the template, select the **Deploy to Azure** image.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.migrate%2Fmigrate-project-create%2Fazuredeploy.json":::

2. Select or enter the following values:

   :::image type="content" source="media/quickstart-create-migrate-project-template/create-migrate-project.png" alt-text="Template to create an Azure Migrate project.":::

   - **Subscription**: Select your Azure subscription.
   - **Resource group**: Select an existing group or select **Create new** to add a group.
   - **Region**: Defaults to the resource group's location and becomes unavailable after a
     resource group is selected.
   - **Migrate Project Name**: Provide a name for the vault.
   - **Location**: Select the location where you want to deploy the Azure Migrate project and its resources.

3. Click **Review + create** button to start the deployment.

## Validate the deployment

To confirm that the Azure Migrate project was created, use the Azure portal.


1. Navigate to Azure Migrate by searching for **Azure Migrate** in the search bar on the Azure portal.
2. Click the **Discover,** **Assess,** and **Migrate** button under the Servers, databases and web apps tile.
3. Select the **Azure subscription** and **Project** as per the values specified in the deployment.


## Next steps

In this quickstart, you created an Azure Migrate project. To learn more about Azure Migrate and its capabilities,
continue to the Azure Migrate overview.

> [!div class="nextstepaction"]
> [Azure Migrate overview](migrate-services-overview.md)
>
