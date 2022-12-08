---
title: Monitor scan runs in Microsoft Purview
description: This guide describes how to monitor the scan runs in Microsoft Purview. 
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 12/08/2022
---

# Monitor scan runs in Microsoft Purview

In Microsoft Purview, you can register and scan various types of data sources, and you can view the scan status over time. This article outlines how to monitor and get a bird's eye view of your scan runs in Microsoft Purview.

## Monitor scan runs

1. Go to your Microsoft Purview account -> open **Microsoft Purview governance portal** -> **Data map** -> **Monitoring**. You need to have **Data source admin** role on any collection to access this page. And you'll see the scan runs that belong to the collections on which you have data source admin privilege.

1. The high-level KPIs show total scan runs within a period. The time period is defaulted at last 30 days, you can also choose to select last seven days. Based on the time filter selected, you can see the distribution of successful, failed, canceled, and in progress scan runs by week or by the day in the graph.

    :::image type="content" source="./media/how-to-monitor-scan-runs/monitor-scan-runs.png" alt-text="View scan runs over time"  lightbox="./media/how-to-monitor-scan-runs/monitor-scan-runs.png":::

1. At the bottom of the graph, there's a **View more** link for you to explore further. The link opens the **Scan status** page. Here you can see a scan name and the number of times it has succeeded, failed, or been canceled in the time period. You can also filter the list by source types.

    :::image type="content" source="./media/how-to-monitor-scan-runs/view-scan-status.png" alt-text="View scan status in details"  lightbox="./media/how-to-monitor-scan-runs/view-scan-status.png":::

1. You can explore a specific scan further by selecting the **scan name**. It connects you to the scan history page, where you can find the list of run IDs with more execution details.

    :::image type="content" source="./media/how-to-monitor-scan-runs/view-scan-history.png" alt-text="View scan history for a given scan"  lightbox="./media/how-to-monitor-scan-runs/view-scan-history.png"::: 

1. You can click into the **run ID** to check more about the [scan run details](#scan-run-details). 

## Scan run details

You can navigate to scan run history for a given scan from different places:

- Go to **Data map** -> **Monitoring** as described in [Monitor scan runs](#monitor-scan-runs) section.
- Go to **Data map** -> **Sources** -> select the desired data source -> see **Scans**, **Recent scans** or **Recent failed scans**.
- Go to **Data map** -> **Collections** -> select the desired collection -> **Scans** -> select the scan name that you want to view more.

You can click the **run ID** to check more about the scan run details:

:::image type="content" source="./media/how-to-monitor-scan-runs/monitor-scan-run-details.png" alt-text="Screenshot of view scan run execution details."  lightbox="./media/how-to-monitor-scan-runs/monitor-scan-run-details.png":::

- **Run ID**: The GUID used to identify the given scan run.

- **Run type**: Full or incremental scan.

- **Scan** section summarizes the metrics for discovery phase that Purview connects to the source, extracts the metadata/lineage and classifies the data.

    - **Scan status**:

        | Status      | Description                                                  |
        | ----------- | ------------------------------------------------------------ |
        | Completed   | The scan phase succeeds.                                     |
        | Failed      | The scan phase fails. You can check the error details by clicking the "More info" link next to it. |
        | Canceled    | The scan run is canceled by user.                           |
        | In Progress | The scan is running in progress.                             |
        | Queued      | The scan run is waiting for available integration runtime resource.<br>If you use self-hosted integration runtime, note each node can run a number of concurrent scans at the same time depending on your machine specification (CPU and memory). More scans will be in Queued status. |
        | Throttled   | The scan run is being throttled. It means this Microsoft Purview account at the moment has more ongoing scan runs than the allowed max concurrent count. Learn more about the limit [here](how-to-manage-quotas.md). This particular scan run will be waiting and be executed once your other ongoing scan(s) finishes. |

    - **Scan type**: Manual or scheduled scan.
    - **Assets discovered**: The number of assets enumerated from the source. For both full and incremental scans, it includes all assets in the configured scope, regardless of whether they're existing assets or newly created/updated assets since the last scan run. While for incremental scan, detailed metadata is extracted only for newly created or updated assets additionally.
    - **Assets classified**: The number of assets sampled to classify the data, regardless of whether the assets have any matching classification or not. It's a subset of the discovered assets based on the [sampling mechanism](microsoft-purview-connector-overview.md#sampling-data-for-classification). For incremental scan, only newly created or updated assets may be selected for classification.
    - **Duration**: The scan phase duration and the start/end time.

- **Data ingestion** section summarizes the metrics for ingestion phase that Purview populates the data map with the identified metadata and lineage.

    - **Ingestion status**:

        | Status              | Description                                                  |
        | ------------------- | ------------------------------------------------------------ |
        | Completed           | All of the assets and relationships are ingested into the data map successfully. |
        | Partially completed | Partial of the assets and relationships are ingested into the data map successfully, while some fail. |
        | Failed              | The ingestion phase fails.                                   |
        | Canceled            | The scan run is canceled by user, thus the ingestion is canceled along. |
        | In Progress         | The ingestion is running in progress.                        |
        | Queued              | The ingestion is waiting for available service resource or waiting for scan to discover metadata. |

    - **Assets ingested**: The number of assets ingested into the data map. For full scan, the number is equal to the "assets discovered" count; for incremental scan, it only includes the newly created or updated assets, in which case less than the "assets discovered" count. When scanning file-based source, it's the raw assets count before resource set aggregation.

    - **Relationships ingested**: The number of relationships ingested into the data map. It includes lineage and other relationships like foreign key relationships.

    - **Duration**: The ingestion duration and the start/end time.

## Scans no longer run

If your Microsoft Purview scan used to successfully run, but are now failing, check these things:

1. Check the error message first to see the failure details.
1. Have credentials to your resource changed or been rotated? If so, you'll need to update to make your scan use the correct credentials.
1. Is an [Azure Policy](../governance/policy/overview.md) preventing **updates to Storage accounts**? If so follow the [Microsoft Purview exception tag guide](create-azure-purview-portal-faq.md) to create an exception for Microsoft Purview accounts.
1. Are you using a self-hosted integration runtime? Check that it's up to date with the latest software and that it's connected to your network.

## Next steps

* [Microsoft Purview supported data sources and file types](azure-purview-connector-overview.md)
* [Manage data sources](manage-data-sources.md)
* [Scan and ingestion](concept-scans-and-ingestion.md)
