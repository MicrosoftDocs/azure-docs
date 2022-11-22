---
title: Monitor scan runs in Microsoft Purview
description: This guide describes how to monitor the scan runs in Microsoft Purview. 
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 08/19/2022
---

# Monitor scan runs in Microsoft Purview

In Microsoft Purview, you can register and scan various types of data sources, and you can view the scan status over time. This article outlines how to monitor and get a bird's eye view of your scan runs in Microsoft Purview.

## Monitor scan runs

1. Go to your Microsoft Purview account -> open **Microsoft Purview governance portal** -> **Data map** -> **Monitoring**. You need to have **Data source admin** role on any collection to access this page. And you will see the scan runs that belong to the collections on which you have data source admin privilege.
 
1. The high-level KPIs show total scan runs within a period. The time period is defaulted at last 30 days, you can also choose to select last seven days. Based on the time filter selected, you can see the distribution of successful, failed, and canceled scan runs by week or by the day in the graph.

    :::image type="content" source="./media/how-to-monitor-scan-runs/monitor-scan-runs.png" alt-text="View scan runs over time"  lightbox="./media/how-to-monitor-scan-runs/monitor-scan-runs.png":::

1. At the bottom of the graph, there is a **View more** link for you to explore further. The link opens the  **Scan status** page. Here you can see a scan name and the number of times it has succeeded, failed, or been canceled in the time period. You can also filter the list by source types.

    :::image type="content" source="./media/how-to-monitor-scan-runs/view-scan-status.png" alt-text="View scan status in details"  lightbox="./media/how-to-monitor-scan-runs/view-scan-status.png":::

1. You can explore a specific scan further by selecting the **scan name**. It connects you to the scan history page, where you can find the list of run IDs with more execution details.

    :::image type="content" source="./media/how-to-monitor-scan-runs/view-scan-history.png" alt-text="View scan history for a given scan"  lightbox="./media/how-to-monitor-scan-runs/view-scan-history.png"::: 

1. You can come back to **Scan Status** page by following the bread crumbs on the top left corner of the run history page.

## Scans no longer run

If your Microsoft Purview scan used to successfully run, but are now failing, check these things:
1. Have credentials to your resource changed or been rotated? If so, you'll need to update your scan to have the correct credentials.
1. Is an [Azure Policy](../governance/policy/overview.md) preventing **updates to Storage accounts**? If so follow the [Microsoft Purview exception tag guide](create-azure-purview-portal-faq.md) to create an exception for Microsoft Purview accounts.
1. Are you using a self-hosted integration runtime? Check that it's up to date with the latest software and that it's connected to your network.

## Next steps

* [Microsoft Purview supported data sources and file types](azure-purview-connector-overview.md)
* [Manage data sources](manage-data-sources.md)
* [Scan and ingestion](concept-scans-and-ingestion.md)
