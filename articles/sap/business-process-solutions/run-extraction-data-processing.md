---
title: Run extraction and data processing in Business Process Solutions
description: This article provides detailed instructions for running data extraction and processing in Business Process Solutions, including steps for SAP and Salesforce systems using Azure Data Factory, Open Mirroring, and Fabric pipelines.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice:
ms.topic: how-to
ms.date: 11/07/2025
ms.author: momakhij
---

# Run extraction and data processing in Business Process Solutions

In this article, we'll describe the steps required to run extraction and data processing in Business Process Solutions. This document contains steps on how you can initiate data extraction for different types of source systems configured with different connectors, and which pipelines need to be executed for data processing.

## SAP Data Extraction

This section describes the steps to extract data using Azure Data Factory or Open Mirroring based on the source system type.

### SAP with Open Mirroring

Once the resources are created in your workspace, you can start pushing data to your mirrored database. To start processing your parquet files in your mirrored database, we need to enable the replication in the mirrored database, to enable replication, open the mirrored database resource and click on the **Start replication** button.
:::image type="content" source="./media/run-extraction-data-processing/start-replication.png" alt-text="Screenshot showing how to start mirrored database replication." lightbox="./media/run-extraction-data-processing/start-replication.png":::
After the replication is enabled, wait for 30 minutes for all the tables to get replicated, check the number of records to see if data has been replicated successfully. Once done now you can start data processing. This is applicable for SAP S/4HANA and SAP ECC source systems using Open Mirroring connector.

### SAP with Azure Data Factory

This section is applicable for source systems where you have configured Azure Data Factory for data extraction. We need to run two pipelines to copy the data from SAP system to our Silver Lakehouse. Open Azure portal and navigate to the resource group we created when creating the source system. Now open the Azure data factory resource and launch the studio from the overview page. Follow the section to start the data replication:

#### Extract field metadata

Before you start extracting data, you need to process field metadata from the source system to ensure correct data mapping. This pipeline copies the table schema from the DD03ND table in SAP system to the Fabric SQL database:

1. Open Azure Data Factory and navigate to **Get field metadata** pipeline.
2. Click** Add Trigger** to start the processing.
   :::image type="content" source="./media/run-extraction-data-processing/get-field-meta-data.png" alt-text="Screenshot showing how to trigger the Get field metadata pipeline." lightbox="./media/run-extraction-data-processing/get-field-meta-data.png":::
3. The extraction takes couple of minutes, and it fills metadata table. Once completed, you can start data extraction.

#### Extract and process data

Once the field metadata extraction is completed, you can start extracting data from SAP system to the Silver Lakehouse. This pipeline copies the data from SAP system to the Silver Lakehouse in Fabric. Follow the steps to start data extraction:

1. Open Azure Data Factory and navigate to **Orchestration Master** pipeline.
2. Click Add Trigger to start the processing.
   :::image type="content" source="./media/run-extraction-data-processing/trigger-orchestration-master.png" alt-text="Screenshot showing how to trigger the Orchestration Master pipeline." lightbox="./media/run-extraction-data-processing/trigger-orchestration-master.png":::
3. Once the extraction is completed, you should see tables in the Fabric Silver Lakehouse.
4. You can view the tables using the Lakehouse view or the run SQL queries in the SQL analytics endpoint view.

## SAP data processing

### SAP S/4 HANA data processing with Azure Data Factory

After your SAP data is replicated using Azure data factory, we need to execute pipelines in order to process the data. Since we have a medallion architecture in Business process solution the data flows from Silver -> Gold Layer. We need to execute the following pipeline:

**bps_orchestration_pipeline_full_processing** – This pipeline processes and copies data from silver lakehouse to gold lakehouse. Once this pipeline is completed, you should be able to refresh your semantic model and view data in your Power BI reports.

### SAP S/4 HANA data processing with Open Mirroring

After your SAP data is replicated to the mirroring database, we need to execute pipelines in order to process the data. Since we have a medallion architecture in Business process solution the data flows from Bronze -> Silver -> Gold Layers. We need to execute the pipelines in the following order:

1. **bps_om_b2s_orchestration_pipeline** – This copies the data from your mirrored database to Silver lakehouse. Once this pipeline is completed, you should be able to see data in your silver lakehouse.
2. **bps_orchestration_pipeline_full_processing** – This pipeline processes and copies data from silver lakehouse to gold lakehouse. Once this pipeline is completed, you should be able to refresh your semantic model and view data in your Power BI reports.

### SAP ECC data processing with Open Mirroring

After your ECC data is replicated to the mirroring database, we need to execute pipelines in order to process the data. Since we have a medallion architecture in Business process solution the data flows from Bronze -> Silver -> Gold Layers. We need to execute the pipelines in the following order:

1. **bps_ecc_b2s_orchestration_pipeline** – This copies the data from your mirrored database to Silver lakehouse. Once this pipeline is completed, you should be able to see data in your silver lakehouse.
2. **bps_orchestration_pipeline_full_processing** – This pipeline processes and copies data from silver lakehouse to gold lakehouse. Once this pipeline is completed, you should be able to refresh your semantic model and view data in your Power BI reports.

## Salesforce - data extraction and processing

### Salesforce data extraction with Fabric pipelines

To start the replication process, follow the steps:

1. Navigate to the workspace.
2. Run the pipeline **bps_sf_salesforce_data_pull**, this pipeline pulls the table metadata and data from your salesforce system to the bronze lakehouse.

### Salesforce data processing with Fabric pipelines

After your Salesforce data is replicated to the bronze lakehouse, we need to execute pipelines in order to process the data. Since we have a medallion architecture in Business process solution the data flows from Bronze -> Silver -> Gold Layers. We need to execute the pipelines in the following order:

1. **bps_sf_orchestration_pipeline_b2s_processing** – This copies the data from your bronze lakehouse to Silver lakehouse. Once this pipeline is completed you should be able to see data in your silver lakehouse.
2. **bps_sf_orchestration_pipeline_s2g_dimension_processing** – This pipeline processes and copies dimension tables from silver lakehouse to gold lakehouse.
3. **bps_sf_orchestration_pipeline_s2g_fact_processing** – This pipeline processes and copies fact tables from silver lakehouse to gold lakehouse. Once this pipeline is completed you should be able to refresh your semantic model and view data in your Power BI reports.

## Next steps

Now that you have replicated your data and processed your data, you can proceed to deploying reports and semantic models.

- [Configure Insights in Business Process Solutions](configure-insights.md)
