---
title: Monitoring data extraction and processing in Fabric
titleSuffix: Business Process Solutions
description: Learn how to monitor data extraction and processing in Fabric in Business Process Solutions.
author: mimansasingh
ms.service: sap-on-azure
ms.subservice:
ms.topic: how-to
ms.date: 02/23/2026
ms.author: mimansasingh
---

# Monitoring data extraction and processing in Fabric

This article explains how to monitor data extraction and processing that are part of the Business Process Solutions. When Business Process Solution item is configured, there are few templates, which gets built and deployed depending upon the type of deployment. For different deployments like SAP + ADF source system or Salesforce or SAP + ECC source system, different set of pipelines and notebooks gets deployed for data extraction. These pipelines follow a layered processing approach where data moves progressively across stages.

Pipelines that include **B2S** in their name represent Bronze to Silver processing. These pipelines move data from mirrored databases into the Silver Lakehouse.
Pipelines that include **S2G** in their name represent Silver to Gold processing. These pipelines move curated data from the Silver Lakehouse into the Gold Lakehouse for reporting and analytics. After successful data extraction to gold lakehouse, we can refresh the semantic models and see our data in Power BI reports.

Below are the different pipelines, which get deployed depending on the source system and data extraction method.

## Data extraction and processing pipelines in Business Process Solutions

The following table contains details about the extraction and processing pipelines that are deployed in your Business Process Solutions item. We categorize it based on source type and extraction tool.

| Source Type | Extraction type | Processing stage | Pipeline name |
|---|---|---|---|
| SAP S/4 HANA | Azure Data Factory | Silver to Gold | bps_orchestration_pipeline_full_processing |
| SAP S/4 HANA | Open Mirroring | Bronze to Silver | bps_om_b2s_orchestration_pipeline |
| SAP S/4 HANA | Open Mirroring | Silver to Gold | bps_orchestration_pipeline_full_processing |
| SAP ECC | Open Mirroring | Bronze to Silver | bps_ecc_b2s_orchestration_pipeline |
| SAP ECC | Open Mirroring | Silver to Gold | bps_orchestration_pipeline_full_processing |
| Salesforce | Fabric data pipelines | Bronze to Silver | bps_sf_orchestration_pipeline_b2s_processing |
| Salesforce | Fabric data pipelines | Silver to Gold | bps_sf_orchestration_pipeline_s2g_dimension_processing |
| Salesforce | Fabric data pipelines | Silver to Gold | bps_sf_orchestration_pipeline_s2g_fact_processing |

## Access pipeline run history

Once a pipeline is triggered, the pipeline run history allows us to view both recent and historical executions. This helps us to understand how the pipeline behaved during a specific run and whether all activities completed successfully.

Use the following steps to check the run history for a pipeline

1. Navigate to the pipeline in Fabric
1. Select "View run history" to see execution status, duration, and completion details for each run.

    :::image type="content" source="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-view-run-history.png" alt-text="Screenshot showing view run history button." lightbox="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-view-run-history.png":::

1. From the dialog box, open the execution you want to check.

    :::image type="content" source="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-execution-logs.png" alt-text="Screenshot showing list of execution logs." lightbox="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-execution-logs.png":::

1. Once you select the activity name you should be able to see all the steps that were executed as a part of pipeline execution and you can check the input, output and error message for each step.

## Check logs for a processing notebook executed from pipeline

When you want to check the logs for a notebook that was executed as a part of pipeline, follow the instructions

1. Open the pipeline run history and select the run that you want to check, follow the instructions mentioned in the previous section.
1. Once you open the pipeline snapshot, you should be able to see the notebook inside the pipeline.

    :::image type="content" source="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-notebook.png" alt-text="Screenshot showing notebooks inside pipeline." lightbox="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-notebook.png":::

1. Select the activity name to open the details and then from the dialog box open the Notebook snapshot.

    :::image type="content" source="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-notebook-snapshot.png" alt-text="Screenshot showing notebook snapshot." lightbox="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-notebook-snapshot.png":::

1. The notebook snapshot opens in a new browser tab. Once the page is loaded, you should be able to see the notebook snapshot and the output for each cell.
1. Navigate to the cell that failed, and check the output of the cell to view the failure message.

    :::image type="content" source="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-notebook-failure.png" alt-text="Screenshot showing failed notebooks and errors." lightbox="./media/monitoring-fabric-data-extraction-and-processing/fabric-monitoring-notebook-failure.png":::

## Next steps

Now that you have replicated your data and processed your data, you can proceed to deploying reports and semantic models.

- [Configure Insights in Business Process Solutions](configure-insights.md)