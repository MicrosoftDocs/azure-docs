---
title: "Microsoft Sentinel migration: Export ArcSight data to target platform  | Microsoft Docs"
description: Learn how to export your historical data from ArcSight.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
---

# Export historical data from ArcSight

This article describes how to export your historical data from ArcSight. After you complete the steps in this article, you can [select a target platform](migration-ingestion-target-platform.md) to host the exported data, and then [select an ingestion tool](migration-ingestion-tool.md) to migrate the data.

:::image type="content" source="media/migration-export-ingest/export-data.png" alt-text="Diagram illustrating steps involved in export and ingestion." border="false":::

You can export data from ArcSight in several ways. Your selection of an export method depends on the data volumes and the deployed ArcSight environment. You can export the logs to a local folder on the ArcSight server or to another server accessible by ArcSight. 

To export the data, use one of the following methods:
- [ArcSight Event Data Transfer Tool](#arcsight-event-data-transfer-tool): Use this option for large volumes of data, namely terabytes (TB).
- [lacat tool](#lacat-utility): Use for volumes of data smaller than a TB.

## ArcSight Event Data Transfer tool

Use the Event Data Transfer tool to export data from ArcSight Enterprise Security Manager (ESM) version 7.x. To export data from ArcSight Logger, use the [lacat utility](#lacat-utility). 

The Event Data Transfer tool retrieves event data from ESM, which allows you to combine analysis with unstructured data, in addition to the CEF data. The Event Data Transfer tool exports ESM events in three formats: CEF, CSV, and key-value pairs. 

To export data using the Event Data Transfer tool:

1. [Install and configure the Event Transfer Tool](https://www.microfocus.com/documentation/arcsight/arcsight-esm-7.6/ESM_AdminGuide/#ESM_AdminGuide/EventDataTransfer/EventDataTransfer.htm).  
1. Configure the logs export to use a CSV format. For example, this command exports data recorded between 15:45 and 16:45 on May 4, 2016 to a CSV file:

    ```
        arcsight event_transfer -dtype File -dpath <***path***> -format csv -start "05/04/2016 15:45:00" -end "05/04/2016 16:45:00" 
    ```
## lacat utility 

Use the lacat utility to export data from ArcSight Logger. lacat exports CEF records from a Logger archive file, and prints the records to `stdout`. You can redirect the records to a file, or pipe the file for further manipulation with options such as `grep` or `awk`. 

To export data with the lacat utility:

1. [Download the lacat utility](https://github.com/hpsec/lacat). For large volumes of data, we suggest that you modify the script for better performance. [Use the modified version](https://aka.ms/lacatmicrosoft).
1. Follow the examples in the lacat repository on how to run the script.

## Next steps

- [Select a target Azure platform to host the exported historical data](migration-ingestion-target-platform.md)
- [Select a data ingestion tool](migration-ingestion-tool.md)
- [Ingest historical data into your target platform](migration-export-ingest.md)
