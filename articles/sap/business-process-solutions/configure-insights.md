---
title: Configure Insights in Business Process Solutions
description: Learn how to configure insights in Business Process Solutions, including setting up semantic models, deploying Power BI report templates, and establishing connections to refresh reports and models.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 11/07/2025
ms.author: momakhij
---

# Configure insights in Business Process Solutions

Insights in Business Process Solutions are [Business Templates](business-templates.md), such as Power BI reports and semantic models, designed to help you quickly start analyzing your data. You can explore available templates on the [Business Templates](business-templates.md) page.
This article explains how to configure Insights and establish connections to refresh reports and models.

## Deploy Power BI Report

To deploy a new Power BI report or Semantic model, use the onboarding wizard. On the overview page, select the **+ New Insight** button to open the wizard.
:::image type="content" source="./media/configure-insights/overview-wizard-buttons.png" alt-text="Screenshot showing the Get Started and New Insight buttons on the overview page." lightbox="./media/configure-insights/overview-wizard-buttons.png":::

The wizard guides you through four steps: **Set up insight**, **Set up connections**, **Set up dataset**, and **Review and deploy**.

### Step 1: Set up insight

In this step, you select the source system and the insight to deploy. The wizard opens to the **Set up Business Process Solution insight** page.

Under **Source system**, select an existing source system. If you don't have a source system yet, configure one using [Azure Data Factory](configure-source-system-with-data-factory.md), [Open Mirroring](configure-source-system-with-open-mirroring.md), or [Salesforce](configure-salesforce-source-system.md).

1. Select **Select existing** under **Source system**.
   :::image type="content" source="./media/configure-insights/wizard-select-existing-selected.png" alt-text="Screenshot showing the Select existing option selected under source system." lightbox="./media/configure-insights/wizard-select-existing-selected.png":::
2. Under **Source system name**, select a source system from the dropdown. Each source system shows its name, type, and status (a green indicator for succeeded, red for failed).
   :::image type="content" source="./media/configure-insights/wizard-select-existing-dropdown.png" alt-text="Screenshot showing the source system dropdown with name, type, and status indicators." lightbox="./media/configure-insights/wizard-select-existing-dropdown.png":::
3. Under **Select insight**, the available insights for the selected source system are displayed as cards, grouped by **Area**. You can change the grouping using the **Group by** dropdown, or use the **Search insights** box to filter. Each card shows the insight name, type (Report or Semantic Model), and a preview. **Select** the insight you want to deploy.
   :::image type="content" source="./media/configure-insights/wizard-select-existing-insight-cards.png" alt-text="Screenshot showing the available insight cards for an existing source system." lightbox="./media/configure-insights/wizard-select-existing-insight-cards.png":::
4. Under **Define insight**, the **Insight name** is autopopulated. If an error message appears to indicate the name already exists, update the name to a unique value.
   :::image type="content" source="./media/configure-insights/wizard-select-existing-define-insight.png" alt-text="Screenshot showing the Define insight section for an existing source system." lightbox="./media/configure-insights/wizard-select-existing-define-insight.png":::
5. Select **Next** to proceed.

### Step 2: Set up connections

For an existing source system, this page shows a read-only summary of the connection configuration. No action is required. Select **Next** to proceed.

:::image type="content" source="./media/configure-insights/wizard-connections-readonly.png" alt-text="Screenshot showing the read-only connection details for a succeeded source system." lightbox="./media/configure-insights/wizard-connections-readonly.png":::

If you're configuring a new source system, you need to set up the connection on this page. For detailed prerequisites and field descriptions, see the following articles:

- [Configure a source system with Azure Data Factory](configure-source-system-with-data-factory.md)
- [Configure a source system with Open Mirroring](configure-source-system-with-open-mirroring.md)
- [Configure a Salesforce source system](configure-salesforce-source-system.md)

Select **Next** to proceed.

### Step 3: Set up dataset

Datasets are collections of objects used to extract data from the business application. Business Process Solutions automatically selects and activates the relevant dataset based on the chosen insight. In this step, you can review the basic details, including the list of objects to be extracted and transformed.

To learn more about editing a dataset, adding custom objects, and maintaining relationships, see [Manage Datasets](manage-datasets.md#modify-dataset-tables-and-relationships).

:::image type="content" source="./media/configure-insights/wizard-dataset-template.png" alt-text="Screenshot showing the dataset template details including name, version, and supported systems." lightbox="./media/configure-insights/wizard-dataset-template.png":::

In the Name Dataset step, the system suggests a dataset name derived from the selected insight and source system.
:::image type="content" source="./media/configure-insights/wizard-dataset-name.png" alt-text="Screenshot showing the dataset name field autopopulated based on insight and source system." lightbox="./media/configure-insights/wizard-dataset-name.png":::

Select **Next** to proceed.

### Step 4: Review and deploy

The **Review and deploy** page displays a summary of all configurations. The sections shown depend on the source system:

  - **Set up insight**: Source system type, source system name, system version, insight name, and insight type.
  - **Set up connections**: This page depends on the source type and connection type you select in the previous steps. It isn't shown for existing source system.
  - **Set up dataset**: Template name and dataset name.

:::image type="content" source="./media/configure-insights/wizard-review-new.png" alt-text="Screenshot showing the review page with insight, connections, and dataset sections for a new source system." lightbox="./media/configure-insights/wizard-review-new.png":::

Review the details and select the **Deploy** button to deploy the insight.
:::image type="content" source="./media/configure-insights/wizard-deploy-button.png" alt-text="Screenshot showing the Deploy button on the review and deploy page." lightbox="./media/configure-insights/wizard-deploy-button.png":::

Once the deployment completes, you can see the report in your workspace and in the Business Process Solutions item overview page.

> [!NOTE]
> Power BI Report deployment automatically deploys the semantic model. You don't need to deploy the semantic model separately.

## Connection for Semantic Model Refreshes

> [!NOTE]
> Refresh the semantic model only after data is available in the gold lakehouse.

To refresh the semantic model, we need to set up a connection in fabric, else we won't be able to automatically refresh the reports via pipelines. To set up the connection, follow the steps:

1. Open the Semantic Model item, Click on **File**, and then select **Settings** button.
   :::image type="content" source="./media/configure-insights/model-settings.png" alt-text="Screenshot showing how to open the semantic model settings." lightbox="./media/configure-insights/model-settings.png":::
2. Open the **Gateway and cloud connections** and under cloud connections, click on Create a connection.
3. Now, Enter a unique name for your connection, multiple reports can use this connection. Select Authentication method as OAuth 2.0.
   :::image type="content" source="./media/configure-insights/lakehouse-connection.png" alt-text="Screenshot showing how to create a Microsoft Fabric lakehouse connection." lightbox="./media/configure-insights/lakehouse-connection.png":::
4. Now, click on **Edit credentials** and provide the credentials. Click on **Create**.
5. Once connection is created, navigate back to the semantic model and associate the connection.
   :::image type="content" source="./media/configure-insights/associate-connection.png" alt-text="Screenshot showing how to associate a connection to the semantic model." lightbox="./media/configure-insights/associate-connection.png":::
6. Once done, try to refresh the semantic model and check if it completes successfully.

If you encounter problems with model refresh, check our [troubleshooting page](troubleshooting.md).

## Import Lakehouse Views

> [!NOTE]
> This step is optional. Run this notebook only after data is available in the gold lakehouse.

Some Insights require additional transformations delivered through SQL views on top of the lakehouse. To deploy these views, run the provided notebook from your workspace:

1. Navigate to your workspace.
2. Open the notebook **bps_gold_view_creation**.
   :::image type="content" source="./media/configure-insights/gold-view-notebook.png" alt-text="Screenshot showing how to open the bps_gold_view_creation notebook." lightbox="./media/configure-insights/gold-view-notebook.png":::
3. Click on the **Run All** button.
   :::image type="content" source="./media/configure-insights/run-gold-view-notebook.png" alt-text="Screenshot showing how to run the bps_gold_view_creation notebook." lightbox="./media/configure-insights/run-gold-view-notebook.png":::
4. Once the notebook run is finished, you should see the sql views in your gold lakehouse.

## Summary

In this article, we described the steps required to configure Insights in Business Process Solutions. You learned how to deploy Power BI reports and semantic models, set up connections for refreshing reports and models, and deploy lakehouse views. Now you can start exploring the reports and models to gain insights from your data.