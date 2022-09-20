---
title: Auto-generate a pipeline by using the SAP data partitioning template
titleSuffix: Azure Data Factory
description: Learn how to use the SAP data partitioning template for SAP change data capture (CDC) (preview) extraction in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Auto-generate a pipeline by using the SAP data partitioning template

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Learn how to use the SAP data partitioning template to auto-generate a pipeline as part of your SAP change data capture (CDC) solution (preview). Then, use the pipeline in Azure Data Factory to partition SAP CDC extracted data.

## Create a data partitioning pipeline from a template

To auto-generate an Azure Data Factory pipeline by using the SAP data partitioning template:

1. In Azure Data Factory Studio, go to the Author hub of your data factory. In **Factory Resources**, under **Pipelines** > **Pipelines Actions**, select **Pipeline from template**.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-pipeline-from-template.png" alt-text="Screenshot of the Azure Data Factory resources tab, with Pipeline from template highlighted.":::

1. Select the **Partition SAP data to extract and load into Azure Data Lake Store Gen2 in parallel** template, and then select **Continue**.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-template-selection.png" alt-text="Screenshot of the template gallery, with the SAP data partitioning template highlighted.":::

1. Create new or use existing [linked services](sap-change-data-capture-prepare-linked-service-source-dataset.md) for SAP ODP (preview), Azure Data Lake Storage Gen2, and Azure Synapse Analytics. Use the linked services as inputs in the SAP data partitioning template.

    Under **Inputs**, for the SAP ODP linked service, in **Connect via integration runtime**, select your self-hosted integration runtime. For the Data Lake Storage Gen2 linked service, in **Connect via integration runtime**, select **AutoResolveIntegrationRuntime**.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-template-configuration.png" alt-text="Screenshot of the SAP data partitioning template configuration page, with the Inputs section highlighted.":::

1. Select **Use this template** to auto-generate an SAP data partitioning pipeline that can run multiple Data Factory copy activities to extract multiple partitions in parallel.

    Data Factory copy activities run on a self-hosted integration runtime to concurrently extract full raw data from your SAP system and load it into Data Lake Storage Gen2 as CSV files.  The files are stored in the *sapcdc* container in the *deltachange/\<your pipeline name\>\<your pipeline run timestamp\>* folder path. Be sure that **Extraction mode** for the Data Factory copy activity is set to **Full**.

    To ensure high throughput, deploy your SAP system, self-hosted integration runtime, Data Lake Storage Gen2 instance, Azure integration runtime, and Azure Synapse Analytics instance in the same region.

1. Assign your SAP data extraction context, data source object names, and an array of partitions. Define each element as an array of row selection conditions that serve as runtime parameter values for the SAP data partitioning pipeline.

    For the `selectionRangeList` parameter, enter your array of partitions. Define each partition as an array of row selection conditions. For example, here’s an array of three partitions, where the first partition includes only rows where the value in the **CUSTOMERID** column is between **1** and **1000000** (the first million customers), the second partition includes only rows where the value in the **CUSTOMERID** column is between **1000001** and **2000000** (the second million customers), and the third partition includes the rest of the customers:

   `[[{"fieldName":"CUSTOMERID","sign":"I","option":"BT","low":"1","high":"1000000"}],[{"fieldName":"CUSTOMERID","sign":"I","option":"BT","low":"1000001","high":"2000000"}],[{"fieldName":"CUSTOMERID","sign":"E","option":"BT","low":"1","high":"2000000"}]]`

    The three partitions are extracted by using three Data Factory copy activities that run in parallel.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-partition-extraction-configuration.png" alt-text="Screenshot of the pipeline configuration for the SAP data partitioning template with the parameters section highlighted.":::

1. Select **Save all** and run the SAP data partitioning pipeline.

## Next steps

[Auto-generate a pipeline by using the SAP data replication template](sap-change-data-capture-data-replication-template.md)
