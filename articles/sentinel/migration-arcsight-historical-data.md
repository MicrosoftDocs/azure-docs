---
title: Export historical data from ArcSight to Microsoft Sentinel | Microsoft Docs
description: Learn how to migrate your historical data from ArcSight to Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Export historical data from ArcSight to Microsoft Sentinel

This article describes how to migrate your historical data from ArcSight to Microsoft Sentinel. When you finish exporting the data, you ingest the data. Learn how to [select a target Azure platform to host the exported data](migration-ingestion-target-platform.md) and then [select an ingestion tool](migration-ingestion-tool.md).

You can export data from ArcSight in several ways. The export methods you choose depend on the data volumes and the deployed ArcSight environment. You can export the logs to a local folder on the ArcSight server or to another server accessible by ArcSight. 

To export the data:
1. Select one of the following export methods:
    - [Event transfer tool](https://www.microfocus.com/documentation/arcsight/arcsight-esm-7.6/ESM_AdminGuide/#ESM_AdminGuide/EventDataTransfer/EventDataTransfer.htm) in ArcSight ESM version 7.x
    - [lacat script](https://github.com/hpsec/lacat) 
        - If you choose the `lacat` script and have large volumes of data, we suggest to make the following modifications to the script:
          
            ```bash
                TBD
            ```

2. Configure the log export file so that the file is saved in the CSV format. 