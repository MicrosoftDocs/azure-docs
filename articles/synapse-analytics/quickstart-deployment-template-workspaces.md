---
title: 'Quickstart: Create an Azure Synapse Analytics workspace using an ARM template'
description: Learn how to create an Azure Synapse Analytics workspace by using an Azure Resource Manager template (ARM template).
services: azure-resource-manager
ms.service: azure-synapse-analytics
ms.subservice: workspace
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 02/04/2022
---

# Quickstart: Create an Azure Synapse Analytics workspace by using an ARM template

This Azure Resource Manager template (ARM template) creates an Azure Synapse Analytics workspace with underlying Azure Data Lake Storage. The Azure Synapse Analytics workspace is a securable collaboration boundary for analytics processes in Azure Synapse Analytics.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select **Deploy to Azure**. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Screenshot that shows the button to deploy the Azure Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FSynapse%2Fmaster%2FManage%2FDeployWorkspace%2Fazuredeploy.json":::

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

To create an Azure Synapse Analytics workspace, you must have the Azure Contributor role and User Access Administrator permissions, or the Owner role in the subscription. For more information, see [Assign Azure roles by using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

## Review the template

You can review the template by selecting the **Visualize** link. Then select **Edit template**.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/template-visualize-button.png" alt-text="Screenshot that shows the button to Visualize the deployment template." link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FSynapse%2Fmaster%2FManage%2FDeployWorkspace%2Fazuredeploy.json":::

The template defines two resources:

- Storage account
- Workspace

## Deploy the template

1. Select the following image to sign in to Azure and open the template. This template creates an Azure Synapse Analytics workspace.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Screenshot that shows the button to deploy the ARM template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FSynapse%2Fmaster%2FManage%2FDeployWorkspace%2Fazuredeploy.json":::

1. Enter or update the following values:

   - **Subscription**: Select an Azure subscription.
   - **Resource group**: Select **Create new** and enter a unique name for the resource group and select **OK**. A new resource group facilitates resource clean-up.
   - **Region**: Select a region. An example is **Central US**.
   - **Name**: Enter a name for your workspace.
   - **SQL Administrator login**: Enter the administrator username for the SQL Server.
   - **SQL Administrator password**: Enter the administrator password for the SQL Server.
   - **Tag Values**: Accept the default.
   - **Review and Create**: Select.
   - **Create**: Select.

1. After it's deployed, more permissions are required:

   - In the Azure portal, assign other users of the workspace to the Contributor role in the workspace. For more information, see [Assign Azure roles by using the Azure portal](../role-based-access-control/role-assignments-portal.yml).
   - Assign other users the appropriate [Azure Synapse Analytics role-based access control roles](security/synapse-workspace-synapse-rbac-roles.md) by using Synapse Studio.
   - A member of the Owner role of the Azure Storage account must assign the Storage Blob Data Contributor role to the Azure Synapse Analytics workspace managed service identity and other users.

## Related content

To learn more about Azure Synapse Analytics and Resource Manager:

- Read an [Overview of Azure Synapse Analytics](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md).
- Learn more about [Azure Resource Manager](../azure-resource-manager/management/overview.md).
- [Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md).

Next, you can [create SQL pools](quickstart-create-sql-pool-studio.md) or [create Apache Spark pools](quickstart-create-apache-spark-pool-studio.md) to start analyzing and exploring your data.
