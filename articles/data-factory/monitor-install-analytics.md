---
title: Install Azure Data Factory Analytics solution from Azure Marketplace 
description: Learn how to install an Azure Data Factory Analytics solution from Azure Marketplace.
author: joshuha-msft
ms.author: joowen
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: monitoring
ms.topic: conceptual
ms.date: 09/02/2021
---

# Install Azure Data Factory Analytics solution from Azure Marketplace

This solution provides you with a summary of overall health of your data factory, with options to drill into details and troubleshoot unexpected behavior patterns. With rich, out-of-the-box views, you can get insights into key processing including:

* At-a-glance summary of data factory pipeline, activity, and trigger runs.
* Ability to drill into data factory activity runs by type.
* Summary of data factory top pipeline activity errors.

1. Go to **Azure Marketplace**, select the **Analytics** filter, and search for **Azure Data Factory Analytics (Preview)**.

   :::image type="content" source="media/data-factory-monitor-oms/monitor-oms-image3.png" alt-text="Screenshot that shows going to Azure Marketplace, selecting the Analytics filter, and selecting Azure Data Factory Analytics (Preview).":::

1. Review the details about **Azure Data Factory Analytics (Preview)**.

   :::image type="content" source="media/data-factory-monitor-oms/monitor-oms-image4.png" alt-text="Screenshot that shows details about Azure Data Factory Analytics (Preview).":::

1. Select **Create**, and then create or select **Log Analytics Workspace**.

   :::image type="content" source="media/data-factory-monitor-oms/monitor-log-analytics-image-5.png" alt-text="Screenshot that shows creating a new solution.":::

## Monitor Data Factory metrics

Installing this solution creates a default set of views inside the workbooks section of the chosen Log Analytics workspace. As a result, the following metrics are enabled:

* Data runs - 1) Pipeline runs by data factory
* ADF runs - 2) Activity runs by data factory
* ADF runs - 3) Trigger runs by data factory
* ADF errors - 1) Top 10 pipeline errors by data factory
* ADF errors - 2) Top 10 activity runs by data factory
* ADF errors - 3) Top 10 trigger errors by data factory
* ADF statistics - 1) Activity runs by type
* ADF statistics - 2) Trigger runs by type
* ADF statistics - 3) Max Pipeline runs duration

:::image type="content" source="media/data-factory-monitor-oms/monitor-oms-image6.png" alt-text="Screenshot that shows a window with Workbooks (Preview) and AzureDataFactoryAnalytics highlighted.":::

You can visualize the preceding metrics, look at the queries behind these metrics, edit the queries, create alerts, and take other actions.

:::image type="content" source="media/data-factory-monitor-oms/monitor-oms-image8.png" alt-text="Screenshot that shows a graphical representation of pipeline runs by data factory.":::

> [!NOTE]
> Azure Data Factory Analytics (Preview) sends diagnostic logs to _Resource-Specific_ destination tables. You can write queries against the following tables: _ADFPipelineRun_, _ADFTriggerRun_, and _ADFActivityRun_.

## Next steps

[Monitor and manage pipelines programmatically](monitor-programmatically.md)
