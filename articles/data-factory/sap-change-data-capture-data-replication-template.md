---
title: Auto-generate a pipeline by using the SAP data replication template
titleSuffix: Azure Data Factory
description: Learn how to use the SAP  data replication template for SAP change data capture (CDC) (preview) extraction in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Auto-generate a pipeline by using the SAP data replication template

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Learn how to use the SAP data replication template to auto-generate a pipeline as part of your SAP change data capture (CDC) solution (preview). Then, use the pipeline in Azure Data Factory for SAP CDC extraction in your datasets.

## Create a data replication pipeline from a template

To auto-generate an Azure Data Factory pipeline by using the SAP data replication template:

1. In Azure Data Factory Studio, go to the Author hub of your data factory. In **Factory Resources**, under **Pipelines** > **Pipelines Actions**, select **Pipeline from template**.

   :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-new-pipeline.png" alt-text="Screenshot that shows creating a new pipeline in the Author hub.":::  

1. Select the **Replicate SAP data to Azure Synapse Analytics and persist raw data in Azure Data Lake Storage Gen2** template, and then select **Continue**.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-data-replication-template.png" alt-text="Screenshot of the template gallery, with the SAP data replication template highlighted.":::

1. Create new or use existing [linked services](sap-change-data-capture-prepare-linked-service-source-dataset.md) for SAP ODP (preview), Azure Data Lake Storage Gen2, and Azure Synapse Analytics. Use the linked services as inputs in the SAP data replication template.

    Under **Inputs**, for the SAP ODP linked service, in **Connect via integration runtime**, select your self-hosted integration runtime. For the Data Lake Storage Gen2 and Azure Synapse Analytics linked services, in **Connect via integration runtime**, select **AutoResolveIntegrationRuntime**.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-data-replication-template-configuration.png" alt-text="Screenshot of the configuration page for the SAP data replication template.":::

1. Select **Use this template** to auto-generate an SAP data replication pipeline that contains Azure Data Factory copy activities and data flow activities.

    The Data Factory copy activity runs on the self-hosted integration runtime to extract raw data (full and deltas) from the SAP system. The copy activity loads the raw data into Data Lake Storage Gen2 as a persisted CSV file. Historical changes are archived and preserved. The files are stored in the *sapcdc* container in the *deltachange/\<your pipeline name\>\<your pipeline run timestamp\>* folder path. Be sure that **Extraction mode** for the Data Factory copy activity is set to **Delta**. The **Subscriber process** property of copy activity is parameterized.

    The Data Factory data flow activity runs on the Azure integration runtime to transform the raw data and merge all changes into Azure Synapse Analytics. The process replicates the SAP data.

    To ensure high throughput, deploy your SAP system, self-hosted integration runtime, Data Lake Storage Gen2 instance, Azure integration runtime, and Azure Synapse Analytics instance in the same region.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-data-replication-architecture.png" alt-text="Shows a diagram of the architecture of the SAP data replication scenario.":::

1. Assign your SAP data extraction context, data source object, key column names, subscriber process names, and Synapse SQL schema and table names as runtime parameter values for the SAP data replication pipeline.

    For the `keyColumns` parameter, enter your key column names as an array of strings, like `[“CUSTOMERID”]/[“keyColumn1”, “keyColumn2”, “keyColumn3”, … ]`. Include up to 10 key column names. The Data Factory data flow activity uses key columns in raw SAP data to identify changed rows. A changed row is a row that is created, deleted, or changed.

    For the `subscriberProcess` parameter, enter a unique name for **Subscriber process** in the Data Factory copy activity. For example, you might name it `<your pipeline name>\<your copy activity name>`. You can rename it to start a new Operational Delta Queue subscription in SAP systems.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-data-replication-pipeline-parameters.png" alt-text="Screenshot of the SAP data replication pipeline with the parameters section highlighted.":::

1. Select **Save all** and run the SAP data replication pipeline.

## Create a data delta replication pipeline from a template

If you want to replicate SAP data to Data Lake Storage Gen2 in delta format, complete the steps that are detailed in the preceding section, but instead use the **Replicate SAP data to Azure Data Lake Store Gen2 in Delta format and persist raw data in CSV format** template.

Like in the data replication template, in a data delta pipeline, the Data Factory copy activity runs on the self-hosted integration runtime to extract raw data (full and deltas) from the SAP system. The copy activity loads the raw data into Data Lake Storage Gen2 as a persisted CSV file. Historical changes are archived and preserved. The files are stored in the *sapcdc* container in the *deltachange/\<your pipeline name\>\<your pipeline run timestamp\>* folder path. The **Extraction mode** property of the copy activity is set to **Delta**. The **Subscriber process** property of copy activity is parameterized.

The Data Factory data flow activity runs on the Azure integration runtime to transform the raw data and merge all changes into Data Lake Storage Gen2 as an open source Delta Lake or Lakehouse table. The process replicates the SAP data.

The table is stored in the *saptimetravel* container in the *\<your SAP table or object name\>* folder that has the *\*delta\*log* subfolder and Parquet files. You can [query the table by using an Azure Synapse Analytics serverless SQL pool](../synapse-analytics/sql/query-delta-lake-format.md). You also can use the Delta Lake Time Travel feature with an Azure Synapse Analytics serverless Apache Spark pool. For more information, see [Create a serverless Apache Spark pool in Azure Synapse Analytics by using web tools](../synapse-analytics/quickstart-apache-spark-notebook.md) and [Read older versions of data by using Time Travel](../synapse-analytics/spark/apache-spark-delta-lake-overview.md?pivots=programming-language-python#read-older-versions-of-data-using-time-travel).

To ensure high throughput, deploy your SAP system, self-hosted integration runtime, Data Lake Storage Gen2 instance, Azure integration runtime, and Delta Lake or Lakehouse instances in the same region.

## Next steps

[Manage your SAP CDC solution](sap-change-data-capture-management.md)
