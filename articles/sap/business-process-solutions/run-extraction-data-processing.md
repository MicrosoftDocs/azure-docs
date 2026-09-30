---
title: Run Extraction and Data Processing in Business Process Solutions
description: This article provides detailed instructions for running data extraction and processing in Business Process Solutions, including steps for SAP and Salesforce systems by using Azure Data Factory, open mirroring, and Fabric pipelines.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 11/07/2025
ms.author: momakhij
---

# Run extraction and data processing in Business Process Solutions

This article describes the steps that are required to run extraction and data processing in Business Process Solutions. It shows you how to initiate data extraction for different types of source systems configured with different connectors. It also shows which pipelines you need to run for data processing.

## Quick reference

| Source type | Extraction pipeline | Processing pipelines |
| --- | --- | --- |
| [SAP S/4HANA (ADF)](#sap-with-azure-data-factory) | [Orchestration Master](#sap-with-azure-data-factory) | [bps_orchestration_pipeline_full_processing](#sap-s4-hana-data-processing-with-azure-data-factory) |
| [SAP S/4HANA (Open Mirroring)](#sap-with-open-mirroring) | [Replication](#sap-with-open-mirroring) | [bps_om_b2s_orchestration_pipeline](#sap-s4-hana-data-processing-with-open-mirroring) → [bps_orchestration_pipeline_full_processing](#sap-s4-hana-data-processing-with-open-mirroring) |
| [SAP Datasphere](#sap-s4-hana-data-processing-with-sap-datasphere) | [Shortcuts replication](#sap-s4-hana-data-processing-with-sap-datasphere) | [bps_datasphere_b2s_orchestration_pipeline](#sap-s4-hana-data-processing-with-sap-datasphere) → [bps_orchestration_pipeline_full_processing](#sap-s4-hana-data-processing-with-sap-datasphere) |
| [SAP ECC](#sap-ecc-data-processing-with-open-mirroring) | [Replication](#sap-ecc-data-processing-with-open-mirroring) | [bps_ecc_b2s_orchestration_pipeline](#sap-ecc-data-processing-with-open-mirroring) → [bps_orchestration_pipeline_full_processing](#sap-ecc-data-processing-with-open-mirroring) |
| [Salesforce](#salesforce-data-extraction-with-fabric-pipelines) | [bps_sf_salesforce_data_pull](#salesforce-data-extraction-with-fabric-pipelines) | [Bronze → Silver](#salesforce-data-processing-with-fabric-pipelines) → [Dimensions](#salesforce-data-processing-with-fabric-pipelines) → [Facts](#salesforce-data-processing-with-fabric-pipelines) |

## SAP data extraction

This section describes the steps to extract data by using Azure Data Factory or open mirroring based on the source system type.

### SAP with open mirroring

After you create the resources in your workspace, you can start pushing data to your mirrored database. To start processing your parquet files in your mirrored database, you need to enable the replication in the mirrored database. To enable replication, open the mirrored database resource and select **Start replication**.

:::image type="content" source="./media/run-extraction-data-processing/start-replication.png" alt-text="Screenshot that shows how to start mirrored database replication." lightbox="./media/run-extraction-data-processing/start-replication.png":::

After you enable the replication, wait for 30 minutes for all the tables to replicate. Check the number of records to see if data was replicated successfully. Then you can start data processing. This procedure applies to SAP S/4HANA and SAP ECC source systems by using an open-mirroring connector.

### SAP with Azure Data Factory

This section applies to source systems where you configured Data Factory for data extraction. You need to run two pipelines to copy the data from the SAP system to your Silver lakehouse. Open the Azure portal, and go to the resource group that you created when you created the source system. Then open the Data Factory resource and start the studio from the overview page. Follow the steps in the next section to start data replication.

#### Extract and process data

Start extracting data from the SAP system to the Silver lakehouse. This pipeline copies the data from the SAP system to the Silver lakehouse in Fabric. To start data extraction, follow these steps:

1. Open Data Factory and go to the **Orchestration Master** pipeline.
1. Select **Add Trigger** to start the processing.

   :::image type="content" source="./media/run-extraction-data-processing/trigger-orchestration-master.png" alt-text="Screenshot that shows how to trigger the Orchestration Master pipeline." lightbox="./media/run-extraction-data-processing/trigger-orchestration-master.png":::

1. After extraction finishes, you see tables in the Fabric Silver lakehouse.
1. View the tables by using the lakehouse view. You can also run SQL queries in the SQL analytics endpoint view.

## SAP data processing

### SAP S/4 HANA data processing with Azure Data Factory

After Data Factory replicates your SAP data, run pipelines to process the data. Because you have a medallion architecture in Business Process Solutions, the data flows from the Silver to the Gold layer.

Run `bps_orchestration_pipeline_full_processing`. This pipeline processes and copies data from the Silver lakehouse to the Gold lakehouse. After this pipeline finishes, refresh your semantic model so that you can view data in your Power BI reports.

### SAP S/4 HANA data processing with open mirroring

After your SAP data is replicated to the mirroring database, you need to run pipelines to process the data. Because you have a medallion architecture in Business Process Solutions, the data flows from Bronze to Silver to Gold layers. Run the pipelines in the following order:

1. `bps_om_b2s_orchestration_pipeline`: This pipeline copies the data from your mirrored database to the Silver lakehouse. After this pipeline is finished, you can see data in your Silver lakehouse.
1. `bps_orchestration_pipeline_full_processing`: This pipeline processes and copies data from the Silver lakehouse to the Gold lakehouse. After this pipeline is finished, refresh your semantic model so that you can view data in your Power BI reports.

### SAP S/4 HANA data processing with SAP Datasphere

After you replicate your SAP data to the lakehouse by using shortcuts, run pipelines to process the data. Because Business Process Solutions uses a medallion architecture, the data flows from Bronze to Silver to Gold layers. Run the pipelines in the following order:

1. `bps_datasphere_b2s_orchestration_pipeline`: This pipeline copies the data from your bronze lakehouse to the Silver lakehouse. When this pipeline finishes, you can see data in your Silver lakehouse.
1. `bps_orchestration_pipeline_full_processing`: This pipeline processes and copies data from the Silver lakehouse to the Gold lakehouse. When this pipeline finishes, refresh your semantic model so that you can view data in your Power BI reports.

### SAP ECC data processing with open mirroring

After your ECC data is replicated to the mirroring database, you need to run pipelines to process the data. Because you have a medallion architecture in Business Process Solutions, the data flows from Bronze to Silver to Gold layers. Run the pipelines in the following order:

1. `bps_ecc_b2s_orchestration_pipeline`: This pipeline copies the data from your mirrored database to the Silver lakehouse. After this pipeline is finished, you can see data in your Silver lakehouse.
1. `bps_orchestration_pipeline_full_processing`: This pipeline processes and copies data from the Silver lakehouse to the Gold lakehouse. After this pipeline is finished, refresh your semantic model so that you can view data in your Power BI reports.

## Salesforce: Data extraction and processing

### Salesforce data extraction with Fabric pipelines

To start the replication process, follow these steps:

1. Go to the workspace.
1. Run the pipeline `bps_sf_salesforce_data_pull`. This pipeline pulls the table metadata and data from your Salesforce system to the Bronze lakehouse.

### Salesforce data processing with Fabric pipelines

After your Salesforce data replicates to the Bronze lakehouse, run pipelines to process the data. Because you use a medallion architecture in Business Process Solutions, the data flows from Bronze to Silver to Gold layers. Run the pipelines in the following order:

1. `bps_sf_orchestration_pipeline_b2s_processing`: This pipeline copies the data from your Bronze lakehouse to the Silver lakehouse. When this pipeline finishes, you can see data in your Silver lakehouse.
1. `bps_sf_orchestration_pipeline_s2g_dimension_processing`: This pipeline processes and copies dimension tables from the Silver lakehouse to the Gold lakehouse.
1. `bps_sf_orchestration_pipeline_s2g_fact_processing`: This pipeline processes and copies fact tables from the Silver lakehouse to the Gold lakehouse. When this pipeline finishes, refresh your semantic model so that you can view data in your Power BI reports.

## Monitoring and troubleshooting

### Pipeline fails

If a pipeline fails, start with the run history for the pipeline that failed. Review the activity-level error and identify the step where the job stopped.

To troubleshoot the failure, follow these steps:

1. Open the Monitor tab in your workspace.
1. Apply the filters to narrow down the pipeline runs based on status, date, or other criteria.
1. Review the error details in the run log for the exact message and source action.
   :::image type="content" source="./media/run-extraction-data-processing/monitor-pipelines-notebooks.jpg" alt-text="Screenshot that shows how to monitor pipeline runs in notebooks." lightbox="./media/run-extraction-data-processing/monitor-pipelines-notebooks.jpg":::
1. Select the failed activity to view the detailed error message and snapshot of the execution.
1. Check the activities to identify the root cause of the failure and take appropriate corrective actions.
   :::image type="content" source="./media/run-extraction-data-processing/check-failure-snapshot.jpg" alt-text="Screenshot that shows how to check failure snapshot." lightbox="./media/run-extraction-data-processing/check-failure-snapshot.jpg":::

## Next step

> [!div class="nextstepaction"]
> [Configure insights in Business Process Solutions](configure-insights.md)
