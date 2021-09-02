---
title: Install Azure Data Factory Analytics solution from Azure Marketplace 
description: Learn how to install an Azure Data Factory Analytics solution from Azure Marketplace.
author: minhe-msft
ms.author: hemin
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: monitoring
ms.topic: conceptual
ms.date: 09/02/2021
---

# Install Azure Data Factory Analytics solution from Azure Marketplace

This solution provides you a summary of overall health of your Data Factory, with options to drill into details and to troubleshoot unexpected behavior patterns. With rich, out of the box views you can get insights into key processing including:

* At a glance summary of data factory pipeline, activity and trigger runs
* Ability to drill into data factory activity runs by type
* Summary of data factory top pipeline, activity errors

1. Go to **Azure Marketplace**, choose **Analytics** filter, and search for **Azure Data Factory Analytics (Preview)**

   ![Go to "Azure Marketplace", enter "Analytics filter", and select "Azure Data Factory Analytics (Preview")](media/data-factory-monitor-oms/monitor-oms-image3.png)

1. Details about **Azure Data Factory Analytics (Preview)**

   ![Details about "Azure Data Factory Analytics (Preview)"](media/data-factory-monitor-oms/monitor-oms-image4.png)

1. Select **Create** and then create or select the **Log Analytics Workspace**.

   ![Creating a new solution](media/data-factory-monitor-oms/monitor-log-analytics-image-5.png)

## Monitor Data Factory metrics

Installing this solution creates a default set of views inside the workbooks section of the chosen Log Analytics workspace. As a result, the following metrics become enabled:

* ADF Runs - 1) Pipeline Runs by Data Factory
* ADF Runs - 2) Activity Runs by Data Factory
* ADF Runs - 3) Trigger Runs by Data Factory
* ADF Errors - 1) Top 10 Pipeline Errors by Data Factory
* ADF Errors - 2) Top 10 Activity Runs by Data Factory
* ADF Errors - 3) Top 10 Trigger Errors by Data Factory
* ADF Statistics - 1) Activity Runs by Type
* ADF Statistics - 2) Trigger Runs by Type
* ADF Statistics - 3) Max Pipeline Runs Duration

![Window with "Workbooks (Preview)" and "AzureDataFactoryAnalytics" highlighted](media/data-factory-monitor-oms/monitor-oms-image6.png)

You can visualize the preceding metrics, look at the queries behind these metrics, edit the queries, create alerts, and take other actions.

![Graphical representation of pipeline runs by data factory"](media/data-factory-monitor-oms/monitor-oms-image8.png)

> [!NOTE]
> Azure Data Factory Analytics (Preview) sends diagnostic logs to _Resource-specific_ destination tables. You can write queries against the following tables: _ADFPipelineRun_, _ADFTriggerRun_, and _ADFActivityRun_.

## Next Steps
[Data Factory metrics](monitor-adf-metrics.md)