---
title: Export historical data from QRadar to Microsoft Sentinel | Microsoft Docs
description: Learn how to export your historical data from QRadar to Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Export historical data from QRadar to Microsoft Sentinel

This article describes how to export your historical data from QRadar to Microsoft Sentinel. When you finish exporting the data, you ingest the data. Learn how to [select a target Azure platform to host the exported data](migration-ingestion-target-platform.md) and then [select an ingestion tool](migration-ingestion-tool.md).

Follow the steps in these sections to export your historical data to Microsoft Sentinel with [QRadar forwarding destination](https://www.ibm.com/docs/en/qsip/7.5?topic=administration-forward-data-other-systems).

## Configure QRadar forwarding destination

Configure the QRadar forwarding destination, including your profile, rules, and destination address:

1. [Configure a forwarding profile](https://www.ibm.com/docs/en/qsip/7.5?topic=systems-configuring-forwarding-profiles).
1. [Add a forwarding destination](https://www.ibm.com/docs/en/qsip/7.5?topic=systems-adding-forwarding-destinations):
    1. Set the **Event Format** to **JSON**.
    2. Set the **Destination Address** to a server that has syslog running on TCP port 5141 and stores the ingested logs to a local folder path.
    3. Select the forwarding profile created in step 1. 
    4. Enable the forwarding destination configuration.

## Configure routing rules

Configure routing rules:

1. [Configure routing rules to forward data](https://www.ibm.com/docs/en/qsip/7.5?topic=systems-configuring-routing-rules-forward-data).
1. Set the **Mode** to **Offline**.
1. Select the relevant **Forwarding Event Processor**.
1. Set the **Data Source** to **Events**.
1. Select **Add Filter** to add filter criteria for data that needs to be exported. For example, use the **Log Source Time** field to set a timestamp range.
1. Select **Forward** and select the forwarding destination created when you [configured the QRadar forwarding destination](#configure-qradar-forwarding-destination) in step 2.
1. [Enable the routing rule configuration](https://www.ibm.com/docs/en/qsip/7.5?topic=systems-viewing-managing-routing-rules).
1. Repeat steps 1-7 for each event processor from which you need to export data.  