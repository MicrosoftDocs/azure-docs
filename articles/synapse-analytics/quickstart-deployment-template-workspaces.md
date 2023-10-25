---
title: 'Quickstart: Create an Azure Synapse workspace Azure Resource Manager template (ARM template)'
description: Learn how to create a Synapse workspace by using Azure Resource Manager template (ARM template).
services: azure-resource-manager
ms.service: synapse-analytics
ms.subservice: workspace
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 02/04/2022
---

# Quickstart: Create an Azure Synapse workspace using an ARM template

This Azure Resource Manager (ARM) template will create an Azure Synapse workspace with underlying Data Lake Storage. The Azure Synapse workspace is a securable collaboration boundary for analytics processes in Azure Synapse Analytics.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure 1](../media/template-deployments/deploy-to-azure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FSynapse%2Fmaster%2FManage%2FDeployWorkspace%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

To create an Azure Synapse workspace, a user must have **Azure Contributor** role and **User Access Administrator** permissions, or the **Owner** role in the subscription. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md). 

## Review the template

You can review the template by selecting the **Visualize** link. Then select **Edit template**.

[![Visualize](../media/template-deployments/template-visualize-button.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FSynapse%2Fmaster%2FManage%2FDeployWorkspace%2Fazuredeploy.json)

The template defines two resources:

- Storage account
- Workspace

## Deploy the template

1. Select the following image to sign in to Azure and open the template. This template creates a Synapse workspace.

   [![Deploy to Azure 2](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FSynapse%2Fmaster%2FManage%2FDeployWorkspace%2Fazuredeploy.json)

1. Enter or update the following values:

   - **Subscription**: Select an Azure subscription.
   - **Resource group**: Select **Create new** and enter a unique name for the resource group and select **OK**. A new resource group will facilitate resource clean up.
   - **Region**: Select a region.  For example, **Central US**.
   - **Name**: Enter a name for your workspace.
   - **SQL Administrator login**: Enter the administrator username for the SQL Server.
   - **SQL Administrator password**: Enter the administrator password for the SQL Server.
   - **Tag Values**: Accept the default.
   - **Review and Create**: Select.
   - **Create**: Select.

1. Once deployed, additional permissions are required. 
- In the Azure portal, assign other users of the workspace to the **Contributor** role in the workspace. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md). 
- Assign other users the appropriate **[Synapse RBAC roles](security/synapse-workspace-synapse-rbac-roles.md)** using Synapse Studio.
- A member of the **Owner** role of the Azure Storage account must assign the **Storage Blob Data Contributor** role to the Azure Synapse workspace MSI and other users.

## Next steps

To learn more about Azure Synapse Analytics and Azure Resource Manager,

- Read an [Overview of Azure Synapse Analytics](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)
- Learn more about [Azure Resource Manager](../azure-resource-manager/management/overview.md)
- [Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)

Next, you can [create SQL pools](quickstart-create-sql-pool-studio.md) or [create Apache Spark pools](quickstart-create-apache-spark-pool-studio.md) to start analyzing and exploring your data.
