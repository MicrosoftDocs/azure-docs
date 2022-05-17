---
title: Export historical data from Splunk to Microsoft Sentinel | Microsoft Docs
description: Learn how to export your historical data from Splunk to Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Export historical data from Splunk to Microsoft Sentinel

This article describes how to export your historical data from Splunk to Microsoft Sentinel. When you finish exporting the data, you ingest the data. Learn how to [select a target Azure platform to host the exported data](migration-ingestion-target-platform.md) and then [select an ingestion tool](migration-ingestion-tool.md).

You can export data from Splunk in several ways. Your selection of an export method depends on the data volumes involved and your level of interactivity. For example, exporting a single, on-demand search via Splunk Web might be appropriate for a low-volume export. Alternatively, if you want to set up a higher-volume, scheduled export, the SDK and REST options work best. 

For large exports, the most stable method for data retrieval is `dump` or the Command Line Interface (CLI). You can export the logs to a local folder on the Splunk server or to another server accessible by Splunk.  

To export your historical data from Splunk, use one of the [Splunk export methods](https://docs.splunk.com/Documentation/Splunk/8.2.5/Search/Exportsearchresults). The output format should be CSV. 

## CLI example

This CLI command exports data recorded between 23:59 and 01:00 on September 14, 2021 to a CSV file: 

```bash
splunk search "index=_internal earliest=09/14/2021:23:59:00 latest=09/16/2021:01:00:00 " -output csv > c:/data.csv  
```
## dump example

This `dump` command exports data recorded on the specified date to a CSV file:

```bash
index=bigdata | eval _dstpath=strftime(_time, "%Y%m%d/%H") + "/" + host | dump basefilename=MyExport format=csv 
```