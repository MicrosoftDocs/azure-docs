---
title: Monitor Azure Data Factory with OMS | Microsoft Docs
description: Learn how to monitor Azure Data Factory by routing data to Operations Management Suite (OMS) for analysis.
services: data-factory
documentationcenter: ''
author: douglaslMS
manager: craigg
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/20/2018
ms.author: douglasl
---
# Monitor Azure Data Factory with Operations Management Suite (OMS)

You can use Azure Data Factory integration with Azure Monitor to route data to Operations Management Suite (OMS). This integration is useful in the following scenarios:

1.  You want to write complex queries on a rich set of metrics that is published by Data Factory to OMS. You can also create custom alerts on these queries via OMS.

2.  You want to monitor across data factories. You can route data from multiple data factories to a single OMS workspace.

## Get Started

### Configure Diagnostic Settings and OMS Workspace

Enable Diagnostic Settings for your data factory.

1.  Select **Azure Monitor** -> **Diagnostics settings** -> Select the data factory -> Turn on diagnostics.

    ![monitor-oms-image1.png](media/data-factory-monitor-oms/monitor-oms-image1.png)

2.  Provide diagnostic settings including configuration of the OMS workspace.

    ![monitor-oms-image2.png](media/data-factory-monitor-oms/monitor-oms-image2.png)

### Install Azure Data Factory Analytics OMS pack from Azure Marketplace

![monitor-oms-image3.png](media/data-factory-monitor-oms/monitor-oms-image3.png)

![monitor-oms-image4.png](media/data-factory-monitor-oms/monitor-oms-image4.png)

Click **Create** and select the OMS Workspace and OMS Workspace settings.

![monitor-oms-image5.png](media/data-factory-monitor-oms/monitor-oms-image5.png)

## Monitor Azure Data Factory Metrics using OMS

Installing the **Azure Data Factory Analytics** OMS pack creates a default set of views that enables the following metrics:

- ADF Runs- 1) Pipeline Runs by Data Factory

- ADF Runs- 2) Activity Runs by Data Factory

- ADF Runs- 3) Trigger Runs by Data Factory

- ADF Errors- 1) Top 10 Pipeline Errors by Data Factory

- ADF Errors- 2) Top 10 Activity Runs by Data Factory

- ADF Errors- 3) Top 10 Trigger Errors by Data Factory

- ADF Statistics- 1) Activity Runs by Type

- ADF Statistics- 2) Trigger Runs by Type

- ADF Statistics- 3) Max Pipeline Runs Duration

![monitor-oms-image6.png](media/data-factory-monitor-oms/monitor-oms-image6.png)

![monitor-oms-image7.png](media/data-factory-monitor-oms/monitor-oms-image7.png)

You can visualize the above metrics, look at the queries behind these metrics, edit the queries, create alerts, and so forth.

![monitor-oms-image8.png](media/data-factory-monitor-oms/monitor-oms-image8.png)

## Next steps

See [Monitor and manage pipelines programmatically](https://docs.microsoft.com/en-us/azure/data-factory/monitor-programmatically) to learn about monitoring and managing pipelines by running scripts.
