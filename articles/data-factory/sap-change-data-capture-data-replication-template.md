---
title: SAP change data capture solution (Preview) - data replication template
titleSuffix: Azure Data Factory
description: This topic describes how to use the SAP data replication template for SAP change data capture (Preview) in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Auto-generate a pipeline from the SAP data replication template

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This topic describes how to use the SAP data replication template for SAP change data capture (Preview) in Azure Data Factory.

## Steps to auto-generate a pipeline from the SAP data replication template

1.	Create a new pipeline from template.

1.	Select the **Replicate SAP data to Azure Synapse Analytics and persist raw data in Azure Data Lake Store Gen2** template.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-data-replication-template.png" alt-text="Screenshot of the template gallery with the SAP data replication template highlighted.":::

1.	Create SAP CDC, ADLS Gen2, and Azure Synapse Analytics linked services, if you haven’t done so already, and use them as inputs to SAP data replication template.  

    For the **Connect via integration runtime** property of the SAP ODP linked service, select your SHIR.  For the **Connect via integration runtime** property of ADLS Gen2/Azure Synapse Analytics linked services, select _AutoResolveIntegrationRuntime_.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-data-replication-template-configuration.png" alt-text="Screenshot of the configuration page for the SAP data replication template.":::

1.	Select the **Use this template** button to auto-generate an SAP data replication pipeline that contains Azure Data Factory copy and dataflow activities.

    The data factory copy activity runs on the SHIR to extract raw data (full + deltas) from SAP systems and load it into ADLS Gen2 where it’s persisted as CSV files, archiving/preserving historical changes.  The files can be found in the _sapcdc_ container under the _deltachange/&lt;your pipeline name\&gt;/&lt;your pipeline run timestamp&gt;_ folder path.  The **Extraction mode** property of the copy activity is set to _Delta_.  The **Subscriber process** property of copy activity is parameterized.

    The data factory data flow activity runs on the Azure IR to transform the raw data and merge all changes into Azure Synapse Analytics, replicating SAP data.

    To ensure high throughput, locate your SAP system, SHIR, ADLS Gen2, Azure IR, and Azure Synapse Analytics in the same region.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-data-replication-architecture.png" alt-text="Shows a diagram of the architecture of the SAP data replication scenario.":::

1.	Assign your SAP data extraction context, data source object, key column, and subscriber process names, as well as Synapse SQL schema and table names as run-time parameter values for SAP data replication pipeline.

    For the **keyColumns** parameter, enter your key column name(s) as an array of string(s), such as _[“CUSTOMERID”]/[“keyColumn1”, “keyColumn2”, “keyColumn3”, … up to 10 key column names]_.  The key column(s) in raw SAP data will be used by ADF data flow activity to identify changed (created/updated/deleted) rows.

    For the **subscriberProcess** parameter, enter a unique name for the Subscriber process property of ADF copy activity.  For example, you can name it _&lt;your pipeline name&gt;\_&lt;your copy activity name&gt;_.  You can rename it to start a new ODQ subscription in SAP systems.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-data-replication-pipeline-parameters.png" alt-text="Screenshot of the SAP data replication pipeline with the parameters section highlighted.":::

1.	Select the **Save all** button and you can now run SAP data replication pipeline.

1.	If you want to replicate SAP data to ADLS Gen2 in Delta format, complete the same steps as above, except using the **Replicate SAP data to Azure Data Lake Store Gen2 in Delta format and persist raw data in CSV format** template.

    ADF copy activity runs on SHIR to extract raw data (full + deltas) from SAP systems and load it into ADLS Gen2 where it’s persisted as CSV files, archiving/preserving historical changes.  The files can be found in the _sapcdc_ container under the _deltachange/&lt;your pipeline name&gt;/&lt;your pipeline run timestamp&gt;_ folder path.  The **Extraction mode** property of ADF copy activity is set to _Delta_.  The **Subscriber process** property of ADF copy activity is parameterized.

    ADF data flow activity runs on Azure IR to transform the raw data and merge all changes into ADLS Gen2 as Delta Lake/Lakehouse table, replicating SAP data.  The table can be found in the _saptimetravel_ container under the _<your SAP table/object name>_ folder containing the _\_delta\_log_ subfolder and Parquet files.  It can be queried using Synapse serverless SQL pool, see [Query Delta Lake files using serverless SQL pool in Azure Synapse Analytics](../synapse-analytics/sql/query-delta-lake-format.md), while time travel can be done using Synapse serverless Apache Spark pool, see [Quickstart: Create a serverless Apache Spark pool in Azure Synapse Analytics using web tools](../synapse-analytics/quickstart-apache-spark-notebook.md) and [Read older versions of data using Time Travel](../synapse-analytics/spark/apache-spark-delta-lake-overview.md?pivots=programming-language-python#read-older-versions-of-data-using-time-travel). 

    To ensure high throughput, locate your SAP system, SHIR, ADLS Gen2, Azure IR, and Delta Lake/Lakehouse in the same region.

## Next steps

[Managing your SAP change data capture solution](sap-change-data-capture-management.md).
