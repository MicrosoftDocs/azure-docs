---
title: Create a Split Experimentation Workspace (preview)
description: Start running an experiment by creating a Split Experimentation Workspace (preview) from an App Configuration store, from Azure Marketplace, or from the Azure search bar.
#customerintent: As a developer, I want to learn how to get started with Split Experimentation, by creating a Split Experimentation workspace.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.custom:
  - build-2024
ms.topic: quickstart
ms.date: 04/23/2024
---

# Quickstart: Create a Split Experimentation Workspace (preview)

In this quickstart, you create a new Split Experimentation Workspace (preview). You can create a Split Experimentation Workspace in the Azure portal from an App Configuration store, from Azure Marketplace, or from the Azure portal search bar.

Split Experimentation allows you to run A/B tests for your applications and gather feedback for new features.

## Prerequisites

- An Azure subscription. If you don’t have one, [create one for free](https://azure.microsoft.com/free/).
- A [Microsoft Entra ID app with required configuration](./how-to-set-up-data-access.md).
- An [Azure storage account](../../storage/common/storage-account-create.md)
- A [Workspace-based Application Insights resource connected to an App Configuration store](../../azure-app-configuration/run-experiments-aspnet-core.md#connect-an-application-insights-preview-resource-to-your-configuration-store).

## Find Split Experimentation Workspace (preview)

Find Split Experimentation Workspace (preview) in one of the following ways:

- Find Split Experimentation Workspace from Azure App Configuration.

    1. Open the App Configuration store in which you want to create the Split Experimentation Workspace, then select **Experimentation > Split Experimentation Workspace (preview)** from the left menu.

        :::image type="content" source="./media/create/find-in-app-configuration-store.png" alt-text="Screenshot of the Azure portal, finding resource from the App Configuration store left menu.":::
    1. On this panel, under the Split Experimentation Workspace label, select **Create new**.

        :::image type="content" source="./media/create/create-new-option.png" alt-text="Screenshot of the Azure portal, selecting Create new Split Experimentation Workspace.":::

- Find Split Experimentation Workspace from the Azure search bar.

    1. Open the Azure portal homepage, go to the search bar at the top, and enter *Split Experimentation Workspace*.

        :::image type="content" source="./media/create/find-in-azure-portal-search.png" alt-text="Screenshot of the Azure portal, finding Split Experimentation Workspace from the search bar.":::

    1. Under **Services**, select **Split Experimentation Workspace (preview)**, then select **Create** or **Create Split Experimentation Workspace (preview)**.

        :::image type="content" source="./media/create/create-new-workspace.png" alt-text="Screenshot of the Azure portal, creating a new workspace.":::

- Find Split Experimentation Workspace from Azure Marketplace.

    1. In the Azure portal, go to **Marketplace**, then, in the pane that opens, enter **Split Experimentation** and select **Split Experimentation for Azure App Configuration**.

        :::image type="content" source="./media/create/find-in-azure-marketplace.png" alt-text="Screenshot of the Azure portal, creating a new workspace from Azure Marketplace.":::

    1. The **Monthly Pay As You Go** plan is selected by default. Click on **Subscribe**.

## Create Split Experimentation Workspace (preview)

### Basics

Under **Basics**, select or enter the following information, then select **Next**. This tab contains basic information about your Split Experimentation Workspace.

:::image type="content" source=".\media\create\create-basic-tab.png" alt-text="Screenshot of the Azure portal, filling out the basic tab to create a new resource.":::

- **Subscription:** Select the Azure subscription you want to use for the resource.
- **Resource group:** Select an existing resource group or create a new one for the resource.
- **Resource name** Enter a name for your Split Experimentation Workspace.
- **Region:** Select the region where you want to deploy the resource.
- **Pricing plan:** **Monthly Pay As You Go** is displayed on screen. This is the only plan available.

### Data source

Under **Data Source**, select the following information, then select **Next**. The data source is the resource that provides Split with the feature flag impressions and events data for analyzing the experiments.

:::image type="content" source=".\media\create\create-data-source-tab.png" alt-text="Screenshot of the Azure portal, filling out the data source tab to create a new resource.":::

- Enable **Data Ingestion** by selecting the checkbox to allow ingestion of impressions and events from the data source. If you deselect the checkbox, you can enable data ingestion later using the App Configuration portal by navigating to **Experimentation > Split Experimentation Workspace.**

> [!NOTE]
> If you do not enable **Data Ingestion** for your Split Experimentation Workspace resource, feature evaluation and customer events will not be exported from your **Data Source** to Split.

- Under **Log Analytics workspace**, select the **Application Insights** resource you want to use for this experiment. It must be the same Application Insights workspace you connected to your App Configuration store in the previous step.
- Under **Export Destination Details**, select the **Storage Account** you want to use for storing impressions and events data. A data export rule will be created in the selected Log Analytics workspace to export data to the storage account entered and configured below.

> [!NOTE]
> When creating a new storage account for your experimentation, you must use the same region as your Log Analytics workspace.

### Data access policy

Under **Data Access Policy**, select the Microsoft Entra ID application to use for authentication and authorization in your Split workspace, then select **Review + create**.

:::image type="content" source=".\media\create\create-data-access-policy-tab.png" alt-text="Screenshot of the Azure portal, filling out the data access policy tab to create a new resource.":::

If your group already uses a shared enterprise application, you may contact the administrator of your group to add you as a user. Otherwise, [create and set up your Microsoft Entra ID application](../../partner-solutions/split-experimentation/how-to-set-up-data-access.md) for Split Experimentation Workspace, then add yourself as a user.

### Review and create

Under **Review + create**, review the information listed for your new Split Experimentation resource, read the terms, and select **Create**.

## Next step

> [!div class="nextstepaction"]
> [Manage Split Experimentation Workspace](manage.md)
