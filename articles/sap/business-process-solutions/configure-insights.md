---
title: Configure Insights in Business Process Solutions
description: Learn how to configure insights in Business Process Solutions, including setting up semantic models, deploying Power BI report templates, and establishing connections to refresh reports and models.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice:
ms.topic: how-to
ms.date: 11/07/2025
ms.author: momakhij
---

# Configure insights in Business Process Solutions

Insights in Business Process Solutions are analytics templates, such as Power BI reports and semantic models, designed to help you quickly start analysing your data. You can explore available templates on the Business Templates page.
This article explains how to configure Insights and establish connections to refresh reports and models.

## Import Lakehouse Views

Some Insights require additional transformations delivered through SQL views on top of the lakehouse. To deploy these views, run the provided notebook from your workspace:

1. Navigate to your workspace.
2. Open the notebook **bps_gold_view_creation**.
   :::image type="content" source="./media/configure-insights/gold-view-notebook.png" alt-text="Screenshot showing how to open the bps_gold_view_creation notebook." lightbox="./media/configure-insights/gold-view-notebook.png":::
3. Click on the **Run All** button.
   :::image type="content" source="./media/configure-insights/run-gold-view-notebook.png" alt-text="Screenshot showing how to run the bps_gold_view_creation notebook." lightbox="./media/configure-insights/run-gold-view-notebook.png":::
4. Once the notebook run is finished, you should see the sql views in your gold lakehouse.

## Deploy Power BI Report

To create a new Power BI report, make sure you have enabled the dataset for the report and ran the extraction and processing of data successfully. Once that is done, navigate to the Insights page and use the following instructions:

1. Click on the **Deploy Insights** tab and click on the **New Insights** button.
2. Select the report/semantic model you would like to deploy. Click on the **Deploy** button.
   :::image type="content" source="./media/configure-insights/deploy-insights.png" alt-text="Screenshot showing the deploy insights interface." lightbox="./media/configure-insights/deploy-insights.png":::
3. Enter a unique name for the report and select the source system for the report. Click on the Deploy button.
   :::image type="content" source="./media/configure-insights/new-insights-details.png" alt-text="Screenshot showing the report input fields." lightbox="./media/configure-insights/new-insights-details.png":::
4. Once the deployment completes, you should be able to see the report in your workspace.

> [!NOTE]
> Power BI Report deployment automatically deploys the semantic model, you don't need to deploy the semantic model separately.

## Connection for Semantic Model Refresh

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

## Summary

In this article, we described the steps required to configure Insights in Business Process Solutions. You learned how to deploy lakehouse views, Power BI reports, and semantic models, and how to set up connections for refreshing reports and models. Now you can start exploring the reports and models to gain insights from your data.
