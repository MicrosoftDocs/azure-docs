---
title: Export historical data from ArcSight to Microsoft Sentinel | Microsoft Docs
description: Learn how to export your historical data from ArcSight to Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Export historical data from ArcSight to Microsoft Sentinel

This article describes how to export your historical data from ArcSight to Microsoft Sentinel. When you finish exporting the data, you ingest the data. Learn how to [select a target Azure platform to host the exported data](migration-ingestion-target-platform.md) and then [select an ingestion tool](migration-ingestion-tool.md).

You can export data from ArcSight in several ways. Your selection of an export method depends on the data volumes and the deployed ArcSight environment. You can export the logs to a local folder on the ArcSight server or to another server accessible by ArcSight. 

To export the data, use one of the following methods:
- [ArcSight Event Data Transfer Tool](#arcsight-event-data-transfer-tool-arcsight-esm-version-7x): Use this option for large volumes of data, namely terabytes (TB).
- [lacat tool](#lacat-utility): Use for volumes of data smaller than a TB.

## ArcSight Event Data Transfer Tool (ArcSight ESM version 7.x)

Use this tool to export large volumes of data, namely TBs. To flexibly combine your analysis with unstructured data, in addition to the structured CEF data, use Enterprise Security Manager (ESM) events. The Event Data Transfer Tool exports ESM events in three formats: CEF, CSV, and key-value pairs.

To export your data with the Event Data Transfer Tool:

1. [Install and configure the Event Transfer Tool](https://www.microfocus.com/documentation/arcsight/arcsight-esm-7.6/ESM_AdminGuide/#ESM_AdminGuide/EventDataTransfer/EventDataTransfer.htm).  
1. Configure the logs export to use a CSV format. For example, this command exports data recorded between 15:45 and 16:45 on May 4, 2016 to a CSV file:

        ```bash
            arcsight event_transfer -dtype File -dpath <***path***> -format csv -start "05/04/2016 15:45:00" -end "05/04/2016 16:45:00" 
        ```
## lacat utility 

Use this tool for any volume of data smaller than than a TB. lacat is a simple utility that exports CEF records from a logger archive file, and prints them the records to `stdout` by design. You can then redirect the records to a file or pipe them for further manipulation, such as `grep`, `awk`, and so on. 

To export data with the lacat utility:

1. [Download the lacat utility](https://github.com/hpsec/lacat).
1. Follow the examples in the [lacat repository](https://github.com/hpsec/lacat) on how to run the script.