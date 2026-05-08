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

## SAP data extraction

This section describes the steps to extract data by using Azure Data Factory or open mirroring based on the source system type.

### SAP with open mirroring

After the resources are created in your workspace, you can start pushing data to your mirrored database. To start processing your parquet files in your mirrored database, you need to enable the replication in the mirrored database. To enable replication, open the mirrored database resource and select **Start replication**.

:::image type="content" source="./media/run-extraction-data-processing/start-replication.png" alt-text="Screenshot that shows how to start mirrored database replication." lightbox="./media/run-extraction-data-processing/start-replication.png":::

After the replication is enabled, wait for 30 minutes for all the tables to replicate. Check the number of records to see if data was replicated successfully. Then you can start data processing. This procedure applies to SAP S/4HANA and SAP ECC source systems by using an open-mirroring connector.

### SAP with Azure Data Factory

This section applies to source systems where you configured Data Factory for data extraction. You need to run two pipelines to copy the data from the SAP system to your Silver lakehouse. Open the Azure portal, and go to the resource group that you created when you created the source system. Then open the Data Factory resource and start the studio from the overview page. Follow the steps in the next section to start data replication.

#### Extract field metadata

Before you start extracting data, you need to process field metadata from the source system to ensure correct data mapping. This pipeline copies the table schema from the DD03ND table in the SAP system to the Microsoft Fabric SQL database:

1. Open Data Factory and go to the **Get field metadata** pipeline.
1. Select **Add Trigger** to start the processing.

   :::image type="content" source="./media/run-extraction-data-processing/get-field-meta-data.png" alt-text="Screenshot that shows how to trigger the Get field metadata pipeline." lightbox="./media/run-extraction-data-processing/get-field-meta-data.png":::

1. Extraction takes a couple of minutes, and it fills a metadata table. After the process is finished, you can start data extraction.

#### Extract and process data

Start extracting data from the SAP system to the Silver lakehouse. This pipeline copies the data from the SAP system to the Silver lakehouse in Fabric. To start data extraction, follow these steps:

1. Open Data Factory and go to the **Orchestration Master** pipeline.
1. Select **Add Trigger** to start the processing.

   :::image type="content" source="./media/run-extraction-data-processing/trigger-orchestration-master.png" alt-text="Screenshot that shows how to trigger the Orchestration Master pipeline." lightbox="./media/run-extraction-data-processing/trigger-orchestration-master.png":::

1. After extraction is finished, you can see tables in the Fabric Silver lakehouse.
1. You can view the tables by using the lakehouse view. You can also run SQL queries in the SQL analytics endpoint view.

## SAP data processing

### SAP S/4 HANA data processing with Azure Data Factory

After your SAP data is replicated by using Data Factory, you need to run pipelines to process the data. Because you have a medallion architecture in Business Process Solutions, the data flows from the Silver to the Gold layer.

You need to run `bps_orchestration_pipeline_full_processing`. This pipeline processes and copies data from the Silver lakehouse to the Gold lakehouse. After this pipeline is finished, refresh your semantic model so that you can view data in your Power BI reports.

### SAP S/4 HANA data processing with open mirroring

After your SAP data is replicated to the mirroring database, you need to run pipelines to process the data. Because you have a medallion architecture in Business Process Solutions, the data flows from Bronze to Silver to Gold layers. Run the pipelines in the following order:

1. `bps_om_b2s_orchestration_pipeline`: This pipeline copies the data from your mirrored database to the Silver lakehouse. After this pipeline is finished, you can see data in your Silver lakehouse.
1. `bps_orchestration_pipeline_full_processing`: This pipeline processes and copies data from the Silver lakehouse to the Gold lakehouse. After this pipeline is finished, refresh your semantic model so that you can view data in your Power BI reports.

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

After your Salesforce data is replicated to the Bronze lakehouse, you need to run pipelines to process the data. Because you have a medallion architecture in Business Process Solutions, the data flows from Bronze to Silver to Gold layers. Run the pipelines in the following order:

1. `bps_sf_orchestration_pipeline_b2s_processing`: This pipeline copies the data from your Bronze lakehouse to the Silver lakehouse. After this pipeline is finished, you can see data in your Silver lakehouse.
1. `bps_sf_orchestration_pipeline_s2g_dimension_processing`: This pipeline processes and copies dimension tables from the Silver lakehouse to the Gold lakehouse.
1. `bps_sf_orchestration_pipeline_s2g_fact_processing`: This pipeline processes and copies fact tables from the Silver lakehouse to the Gold lakehouse. After this pipeline is finished, refresh your semantic model so that you can view data in your Power BI reports.

## Next step
> [!div class="nextstepaction"]
> [Configure insights in Business Process Solutions](configure-insights.md)
