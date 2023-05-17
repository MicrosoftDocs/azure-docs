---
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: include
ms.date: 12/08/2022
ms.custom: ignite-fall-2021
---

### View your scans and scan runs

To view existing scans:

1. Go to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/). Select the **Data map** tab on the left pane.
1. Select the desired data source. You can view a list of existing scans on that data source under **Recent scans**, or you can view all scans on the **Scans** tab.
1. Select the scan that has results you want to view. The page shows you all of the previous scan runs, along with the status and metrics for each scan run. 
1. Click the **run ID** to check more about the [scan run details](../how-to-monitor-scan-runs.md#scan-run-details).

### Manage your scans - edit, delete, or cancel

To manage or delete a scan:

1. Go to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/). Select the **Data Map** tab on the left pane.

1. Select the desired data source. You can view a list of existing scans on that data source under **Recent scans**, or you can view all scans on the **Scans** tab.

1. Select the scan that you want to manage. You can then:

   - Edit the scan by selecting **Edit scan**.
   - Cancel an in-progress scan by selecting **Cancel scan run**.
   - Delete your scan by selecting **Delete scan**.

> [!NOTE]
>
> * Deleting your scan does not delete catalog assets created from previous scans.
> * The asset will no longer be updated with schema changes if your source table has changed and you re-scan the source table after editing the description on the **Schema** tab of Microsoft Purview.
