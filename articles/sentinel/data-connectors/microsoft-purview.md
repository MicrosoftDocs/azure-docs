---
title: "Microsoft Purview connector for Microsoft Sentinel"
description: "Learn how to install the connector Microsoft Purview to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 11/14/2022
ms.service: microsoft-sentinel
ms.author: cwatson
ms.custom: miss-api-catalog
---

# Microsoft Purview connector for Microsoft Sentinel

The Microsoft Purview Solution enables data sensitivity enrichment of Microsoft Sentinel. Data classification and sensitivity label logs from Microsoft Purview scans are ingested and visualized through workbooks, analytical rules, and more.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections](../connect-azure-windows-microsoft-services.md?tabs=AP#diagnostic-settings-based-connections)**<br><br>For more information, see [Tutorial: Integrate Microsoft Sentinel and Microsoft Purview](../purview-solution.md). |
| **Log Analytics table(s)** | PurviewDataSensitivityLogs |
| **DCR support** | Not currently supported |
| **Supported by** | Microsoft |

## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-azurepurview?tab=Overview) in the Azure Marketplace.