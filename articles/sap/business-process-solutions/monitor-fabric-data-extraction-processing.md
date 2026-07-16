---
title: Monitor Data Extraction and Processing in Fabric
titleSuffix: Business Process Solutions
description: Learn how to monitor data extraction and processing in Fabric in Business Process Solutions.
author: mimansasingh
ms.service: sap-on-azure
ms.subservice:
ms.topic: how-to
ms.date: 02/23/2026
ms.author: mimansasingh
---

# Monitor data extraction and processing in Fabric

This article explains how to monitor data extraction and processing, which are parts of Business Process Solutions. When you configure a Business Process Solutions item, you can use a few templates. The type of deployment determines which template gets built and deployed. For deployments like an SAP + Azure Data Factory source system or a Salesforce or SAP + ECC source system, a different set of pipelines and notebooks is deployed for data extraction.

These pipelines follow a layered processing approach where data moves progressively across stages:

- Pipelines that include `b2s` in their names represent Bronze to Silver processing. These pipelines move data from mirrored databases to the Silver lakehouse.
- Pipelines that include `s2g` in their names represent Silver to Gold processing. These pipelines move curated data from the Silver lakehouse to the Gold lakehouse for reporting and analytics. After successful data extraction to a Gold lakehouse, you can refresh the semantic models and see your data in Power BI reports.

The following pipelines are deployed depending on the source system and data extraction method.

## Data extraction and processing pipelines in Business Process Solutions

The following table contains details about the extraction and processing pipelines that are deployed in your Business Process Solutions item. They're categorized based on source type and extraction tool.

| Source type | Extraction type | Processing stage | Pipeline name |
|---|---|---|---|
| SAP S/4 HANA | Data Factory | Silver to Gold | `bps_orchestration_pipeline_full_processing` |
| SAP S/4 HANA | Open mirroring | Bronze to Silver | `bps_om_b2s_orchestration_pipeline` |
| SAP S/4 HANA | Open mirroring | Silver to Gold | `bps_orchestration_pipeline_full_processing` |
| SAP ECC | Open mirroring | Bronze to Silver | `bps_ecc_b2s_orchestration_pipeline` |
| SAP ECC | Open mirroring | Silver to Gold | `bps_orchestration_pipeline_full_processing` |
| Salesforce | Microsoft Fabric data pipelines | Bronze to Silver | `bps_sf_orchestration_pipeline_b2s_processing` |
| Salesforce | Fabric data pipelines | Silver to Gold | `bps_sf_orchestration_pipeline_s2g_dimension_processing` |
| Salesforce | Fabric data pipelines | Silver to Gold | `bps_sf_orchestration_pipeline_s2g_fact_processing` |

## Access pipeline run history

After a pipeline is triggered, you can use the pipeline run history to view both recent and historical executions. This information helps you to understand how the pipeline behaved during a specific run and whether all activities completed successfully.

To check the run history for a pipeline, follow these steps:

1. Go to the pipeline in Fabric.
1. Select **View run history** to see execution status, duration, and completion details for each run.

    :::image type="content" source="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-view-run-history.png" alt-text="Screenshot that shows the View run history button." lightbox="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-view-run-history.png":::

1. From the dialog, open the execution that you want to check.

    :::image type="content" source="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-execution-logs.png" alt-text="Screenshot that shows a list of execution logs." lightbox="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-execution-logs.png":::

1. After you select the activity name, you can see all the steps that ran as part of a pipeline execution. You can check the input, output, and error message for each step.

## Check logs for a processing notebook executed from a pipeline

When you want to check the logs for a notebook that was executed as part of a pipeline, follow these instructions:

1. Open the pipeline run history, and select the run that you want to check. Follow the instructions in the previous section.
1. After you open the pipeline snapshot, you can see the notebook inside the pipeline.

    :::image type="content" source="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-notebook.png" alt-text="Screenshot that shows notebooks inside a pipeline." lightbox="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-notebook.png":::

1. Select the activity name to open the details, and then in the dialog, open the notebook snapshot.

    :::image type="content" source="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-notebook-snapshot.png" alt-text="Screenshot that shows a notebook snapshot." lightbox="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-notebook-snapshot.png":::

1. The notebook snapshot opens in a new browser tab. After the page loads, you can see the notebook snapshot and the output for each cell.
1. Go to the cell that failed, and check the output of the cell to view the failure message.

    :::image type="content" source="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-notebook-failure.png" alt-text="Screenshot that shows failed notebooks and errors." lightbox="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-notebook-failure.png":::

## Next step
> [!div class="nextstepaction"]
> [Configure insights in Business Process Solutions](configure-insights.md)