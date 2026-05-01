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

Insights in Business Process Solutions are [business templates](business-templates.md), such as Power BI reports and semantic models. These templates are designed to help you quickly start analyzing your data. You can explore available templates on the [business templates](business-templates.md) page.
This article explains how to configure insights and establish connections to refresh reports and models.

## Deploy a Power BI report

To deploy a new Power BI report or semantic model, use the onboarding wizard. On the overview page, select **+ New Insight** to open the wizard.

:::image type="content" source="./media/configure-insights/overview-wizard-buttons.png" alt-text="Screenshot that shows the Get started and New insight buttons on the overview page." lightbox="./media/configure-insights/overview-wizard-buttons.png":::

The wizard guides you through four steps:

- Set up the insight.
- Set up the connections.
- Set up the dataset.
- Review and deploy.

### Step 1: Set up the insight

In this step, you select the source system and the insight to deploy. The wizard opens to the **Set up Business Process Solutions insight** page.

Under **Source system**, select an existing source system. If you don't have a source system yet, configure one by using [Azure Data Factory](configure-source-system-with-data-factory.md), [open mirroring](configure-source-system-with-open-mirroring.md), or [Salesforce](configure-salesforce-source-system.md).

1. Under **Source system**, choose **Select existing**.

   :::image type="content" source="./media/configure-insights/wizard-select-existing-selected.png" alt-text="Screenshot that shows the Select existing option selected under source system." lightbox="./media/configure-insights/wizard-select-existing-selected.png":::

1. Under **Source system name**, select a source system from the dropdown list. Each source system shows its name, type, and status. (A green indicator is used for succeeded, and red is used for failed.)

   :::image type="content" source="./media/configure-insights/wizard-select-existing-dropdown.png" alt-text="Screenshot that shows the source system dropdown list with name, type, and status indicators." lightbox="./media/configure-insights/wizard-select-existing-dropdown.png":::

1. Under **Select insight**, the available insights for the selected source system appear as cards, which are grouped by **Area**. You can change the grouping by using the **Group by** dropdown list. You can also use the **Search insights** box for filtering. Each card shows the insight name, type (**Report** or **Semantic Model**), and a preview. Select the insight that you want to deploy.

   :::image type="content" source="./media/configure-insights/wizard-select-existing-insight-cards.png" alt-text="Screenshot that shows the available insight cards for an existing source system." lightbox="./media/configure-insights/wizard-select-existing-insight-cards.png":::

1. Under **Define insight**, the insight name is autopopulated. If an error message appears to indicate that the name already exists, update the name to a unique value.

   :::image type="content" source="./media/configure-insights/wizard-select-existing-define-insight.png" alt-text="Screenshot that shows the Define insight section for an existing source system." lightbox="./media/configure-insights/wizard-select-existing-define-insight.png":::

1. Select **Next** to proceed.

### Step 2: Set up the connections

For an existing source system, this page shows a read-only summary of the connection configuration. No action is required. Select **Next** to proceed.

:::image type="content" source="./media/configure-insights/wizard-connections-readonly.png" alt-text="Screenshot that shows the read-only connection details for a succeeded source system." lightbox="./media/configure-insights/wizard-connections-readonly.png":::

If you're configuring a new source system, you need to set up the connection on this page. For detailed prerequisites and field descriptions, see the following articles:

- [Configure a source system with Azure Data Factory](configure-source-system-with-data-factory.md)
- [Configure a source system with open mirroring](configure-source-system-with-open-mirroring.md)
- [Configure a Salesforce source system](configure-salesforce-source-system.md)

Select **Next** to proceed.

### Step 3: Set up the dataset

Datasets are collections of objects that are used to extract data from the business application. Business Process Solutions automatically selects and activates the relevant dataset based on the insight that you chose. In this step, you can review the basic details, which includes the list of objects to be extracted and transformed.

To learn more about editing a dataset, adding custom objects, and maintaining relationships, see [Manage datasets](manage-datasets.md#modify-dataset-tables-and-relationships).

:::image type="content" source="./media/configure-insights/wizard-dataset-template.png" alt-text="Screenshot that shows the dataset template details like name, version, and supported systems." lightbox="./media/configure-insights/wizard-dataset-template.png":::

In the **Name Dataset** step, the system suggests a dataset name derived from the selected insight and source system.
:::image type="content" source="./media/configure-insights/wizard-dataset-name.png" alt-text="Screenshot that shows the dataset name field autopopulated based on insight and source system." lightbox="./media/configure-insights/wizard-dataset-name.png":::

Select **Next** to proceed.

### Step 4: Review and deploy

The **Review and deploy** page displays a summary of all configurations. The sections that are shown depend on the source system:

  - **Set up insight**: Source system type, source system name, system version, insight name, and insight type.
  - **Set up connections**: This page depends on the source type and connection type that you select in the previous steps. It isn't shown for the existing source system.
  - **Set up dataset**: Template name and dataset name.

:::image type="content" source="./media/configure-insights/wizard-review-new.png" alt-text="Screenshot that shows the review page with insight, connections, and dataset sections for a new source system." lightbox="./media/configure-insights/wizard-review-new.png":::

Review the details and select **Deploy** to deploy the insight.

:::image type="content" source="./media/configure-insights/wizard-deploy-button.png" alt-text="Screenshot that shows the Deploy button on the Review and deploy page." lightbox="./media/configure-insights/wizard-deploy-button.png":::

After the deployment finishes, you can see the report in your workspace and on the Business Process Solutions item overview page.

> [!NOTE]
> A Power BI report deployment automatically deploys the semantic model. You don't need to deploy the semantic model separately.

## Connection for semantic model refreshes

> [!NOTE]
> Refresh the semantic model only after data is available in the Gold lakehouse.

To refresh the semantic model, you need to set up a connection in Microsoft Fabric. Otherwise, you can't automatically refresh the reports via pipelines. To set up the connection, follow these steps:

1. Open the **Semantic Model** item, select **File**, and then select **Settings**.

   :::image type="content" source="./media/configure-insights/model-settings.png" alt-text="Screenshot that shows how to open the semantic model settings." lightbox="./media/configure-insights/model-settings.png":::

1. Open **Gateway and cloud connections**, and under **Cloud connections**, select **Create a connection**.
1. Enter a unique name for your connection. Multiple reports can use this connection. For the authentication method, select **OAuth 2.0**.

   :::image type="content" source="./media/configure-insights/lakehouse-connection.png" alt-text="Screenshot that shows how to create a Microsoft Fabric lakehouse connection." lightbox="./media/configure-insights/lakehouse-connection.png":::

1. Select **Edit credentials** and enter the credentials. Select **Create**.
1. After the connection is created, go back to the semantic model and associate the connection.

   :::image type="content" source="./media/configure-insights/associate-connection.png" alt-text="Screenshot that shows how to associate a connection to the semantic model." lightbox="./media/configure-insights/associate-connection.png":::

1. After you finish, try to refresh the semantic model and check if it finishes successfully.

If you encounter problems with model refresh, see [Troubleshoot known issues](troubleshooting.md).

## Import lakehouse views

> [!NOTE]
> This step is optional. Run this notebook only after data is available in the Gold lakehouse.

Some insights require more transformations that are delivered through SQL views on top of the lakehouse. To deploy these views, run the provided notebook from your workspace:

1. Go to your workspace.
1. Open the notebook **bps_gold_view_creation**.

   :::image type="content" source="./media/configure-insights/gold-view-notebook.png" alt-text="Screenshot that shows how to open the bps_gold_view_creation notebook." lightbox="./media/configure-insights/gold-view-notebook.png":::

1. Select **Run all**.

   :::image type="content" source="./media/configure-insights/run-gold-view-notebook.png" alt-text="Screenshot that shows how to run the bps_gold_view_creation notebook." lightbox="./media/configure-insights/run-gold-view-notebook.png":::

1. After the notebook run is finished, you see the SQL views in your Gold lakehouse.

## Summary

This article described the steps that are required to configure insights in Business Process Solutions. You learned how to deploy Power BI reports and semantic models. You also learned how to set up connections for refreshing reports and models and how to deploy lakehouse views. Now you can start exploring the reports and models to gain insights from your data.