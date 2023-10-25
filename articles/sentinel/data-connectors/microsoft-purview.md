---
title: "Microsoft Purview (Preview) connector for Microsoft Sentinel"
description: "Learn how to install the connector Microsoft Purview (Preview) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Microsoft Purview (Preview) connector for Microsoft Sentinel

Connect to Microsoft Purview to enable data sensitivity enrichment of Microsoft Sentinel. Data classification and sensitivity label logs from Microsoft Purview scans can be ingested and visualized through workbooks, analytical rules, and more. For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2224125&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AzureDiagnostics (PurviewDataSensitivityLogs)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**View files that contain a specific classification (example shows Social Security Number)**
   ```kusto
PurviewDataSensitivityLogs
 
   | where Classification has "Social Security Number"
   ```



## Vendor installation instructions

Connect Microsoft Purview to Microsoft Sentinel

Within the Azure Portal, navigate to your Purview resource:
 1. In the search bar, search for **Purview accounts.**
 2. Select the specific account that you would like to be set up with Sentinel.

Inside your Microsoft Purview resource:
 3. Select **Diagnostic Settings.**
 4. Select **+ Add diagnostic setting.**
 5. In the **Diagnostic setting** blade:
   - Select the Log Category as **DataSensitivityLogEvent**.
   - Select **Send to Log Analytics**.
   - Chose the log destination workspace. This should be the same workspace that is used by **Microsoft Sentinel.**
  - Click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-azurepurview?tab=Overview) in the Azure Marketplace.
