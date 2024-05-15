---
title: Create a Split Experimentation Workspace (preview)
description: Start running an experiment by creating a Split Experimentation Workspace (preview) from an App Configuration store, from Azure Marketplace or from the Azure search bar.
#customerintent: As a developer, I want to learn how to get started with Split Experimentation, by creating a Split Experimentation workspace.
author: maud-lv 
ms.author: malev 
ms.service: azure-app-configuration  
ms.topic: quickstart 
ms.date: 04/23/2024 
---

# Quickstart: Create a Split Experimentation Workspace (preview)

In this quickstart, you create a new Split Experimentation Workspace (preview). You can create a Split Experimentation Workspace in the Azure portal from an App Configuration store, from Azure Marketplace, or from the Azure portal search bar.

Split Experimentation allows you to run A/B tests for your applications and gather feedback for new features.

## Prerequisites

- An Azure subscription. If you don’t have one, [create one for free](https://azure.microsoft.com/free/).
- An [Entra ID app with required configuration](./how-to-set-up-data-access.md).
- An [Azure storage account](../../storage/common/storage-account-create.md)
- A [Workspace-based Application Insights resource connected to an App Configuration store](../../azure-app-configuration/run-experiments-aspnet-core.md#connect-an-application-insights-preview-resource-to-your-configuration-store).

## Create a Split Experimentation Workspace from an App Configuration store

Split Experimentation is available from the left menu in App Configuration. To create a new Split Experimentation Workspace from an App Configuration store, follow the process below.

### Find Split Experimentation Workspace

1. Open the App Configuration store in which you want to create the Split Experimentation Workspace, then select **Experimentation > Split Experimentation Workspace (preview)** from the left menu.

    :::image type="content" source="./media/create/find-in-app-configuration-store.png" alt-text="Screenshot of the Azure portal, finding resource from the App Configuration store left menu.":::

1. On this page, under the Split Experimentation Workspace label, select **Create New**. This action opens a new panel.

    :::image type="content" source="./media/create/create-new-option.png" alt-text="Screenshot of the Azure portal, selecting Create new Split Experimentation Workspace.":::

### Fill out the resource creation form

[!INCLUDE [Split Experimentation Workspace create form](../includes/split-experimentation-workspace-create-form.md)]

## Create a Split Experimentation Workspace from Azure Marketplace

Split Experimentation Workspace is available in Azure Marketplace. To create a Split Experimentation Workspace from Azure Marketplace, follow the steps below.

### Find Split Experimentation Workspace

1. In the Azure portal, go to **Marketplace**.
1. In the pane that opens, enter **Split Experimentation**, then select **Split Experimentation for Azure App Configuration**.
1. Select a plan from the **Plan** dropdown list and select **Subscribe**.

### Fill out the resource creation form

[!INCLUDE [Split Experimentation Workspace create form](../includes/split-experimentation-workspace-create-form.md)]

## Create a Split Experimentation Workspace from the Azure portal search bar

The Azure portal provides direct access to create a Split Experimentation Workspace.

### Find Split Experimentation Workspace

1. Open the Azure portal homepage, go to the search bar at the top, and enter *Split Experimentation Workspace*. Under **Services**, select **Split Experimentation Workspace (preview)**.

    :::image type="content" source="./media/create/find-in-azure-portal-search.png" alt-text="Screenshot of the Azure portal, finding Split Experimentation Workspace from the search bar.":::

1. Select **Create** or **Create Split Experimentation Workspace (preview)**.

    :::image type="content" source="./media/create/create-new-workspace.png" alt-text="Screenshot of the Azure portal, creating a new workspace.":::

    This action opens a new panel. Select or enter the requested information following the instructions below.

### Fill out the resource creation form

[!INCLUDE [Split Experimentation Workspace create form](../includes/split-experimentation-workspace-create-form.md)]

## Next step

> [!div class="nextstepaction"]
> [Manage Split Experimentation Workspace](manage.md)
