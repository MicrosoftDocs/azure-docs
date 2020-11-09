---
title: Monitor the health of your data connectors with this Azure Sentinel workbook | Microsoft Docs
description: Use the Health Monitoring workbook to keep track of your data connectors' connectivity and performance.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/09/2020
ms.author: yelevin

---
# Monitor the health of your data connectors with this Azure Sentinel workbook

> [!IMPORTANT]
> The **Data connectors health monitoring workbook** is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The **Data connectors health monitoring workbook** allows you to keep track of your data connectors' health, connectivity, and performance, from within Azure Sentinel. The workbook provides additional monitors, detects anomalies, and gives insight regarding the workspace’s data ingestion status. You can use the workbook’s logic to monitor the general health of the ingested data, and to build custom views and rule-based alerts.

## Use the health monitoring workbook

1. From the Azure Sentinel portal, select **Workbooks** from the **Threat management** menu.

1. In the **Workbooks** gallery, enter *health* in the search bar, and select **Data collection health monitoring** from among the results.

1. Select **View template** to use the workbook as is, or select **Save** to create an editable copy of the workbook. When the copy is created, select **View saved workbook**.

1. Once in the workbook, first select the **subscription** and **workspace** you wish to view, then define the **TimeRange** to filter the data according to your needs. Use the **Show help** toggle to display in-place explanation of the workbook.

    :::image type="content" source="media/monitor-data-connector-health/data-health-workbook-1.png" alt-text="data connector health monitoring workbook landing page" lightbox="media/monitor-data-connector-health/data-health-workbook-1.png":::

There are three tabbed sections in this workbook:

1. The **Overview** tab shows the general status of data ingestion in the selected workspace: 
volume measures, EPS rates and time last log received.

1. The **Data collection anomalies** tab will help you to detect anomalies in the data ingestion patterns, by log type, table, and data source.

1. The **Agent info** tab shows you information about the health of the Log Analytics agents installed on your various machines, whether Azure VM, other cloud VM, on-premises VM, or physical. You can monitor the following:
   1. System location
   1. Heartbeat status and latency
   1. Available memory and disk space
   1. Agent operations

    In this section you must select the tab that describes your machines’ environment: choose the **Azure-managed machines** tab if you want to view only the Azure Arc-managed machines; choose the **All machines** tab to view both managed and non-Azure machines with the Log Analytics agent installed.

## Next steps
Learn how to [onboard your data to Azure Sentinel](quickstart-onboard.md), [connect data sources](connect-data-sources.md), and [get visibility into your data, and potential threats](quickstart-get-visibility.md).

