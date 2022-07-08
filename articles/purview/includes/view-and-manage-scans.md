---
author: whhender
ms.author: whhender
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: include
ms.date: 6/04/2021
ms.custom: ignite-fall-2021
---

### View your scans and scan runs

To view existing scans, do the following:

1. Go to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/). Select the **Data Map** tab under the left pane.

1. Select the desired data source. You will see a list of existing scans on that data source under **Recent scans**, or can view all scans under the **Scans** tab.

1. Select the scan that has results you want to view.

1. This page will show you all of the previous scan runs along with the status and metrics for each scan run. It will also display whether your scan was scheduled or manual, how many assets had classifications applied, how many total assets were discovered, the start and end time of the scan, and the total scan duration.

### Manage your scans - edit, delete, or cancel

To manage or delete a scan, do the following:

1. Go to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/). Select the **Data Map** tab under the left pane.

1. Select the desired data source. You will see a list of existing scans on that data source under **Recent scans**, or can view all scans under the **Scans** tab.

1. Select the scan you would like to manage. You can edit the scan by selecting **Edit scan**.

1. You can cancel an in progress scan by selecting **Cancel scan run**.

1. You can delete your scan by selecting **Delete scan**.

> [!NOTE]
> * Deleting your scan does not delete catalog assets created from previous scans.
> * The asset will no longer be updated with schema changes if your source table has changed and you re-scan the source table after editing the description in the schema tab of Microsoft Purview.
