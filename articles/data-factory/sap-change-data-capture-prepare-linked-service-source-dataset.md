---
title: Set up a linked service and dataset for the SAP ODP (preview) connector 
titleSuffix: Azure Data Factory
description: Learn how to set up a linked service and source dataset to use with the SAP ODP (preview) connector in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Set up a linked service and source dataset for the SAP ODP (preview) connector

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Learn how to set up the linked service and source dataset for SAP ODP (preview) in Azure Data Factory.

## Set up an SAP ODP (preview) linked service

To set up an SAP Operational Data Provisioning (ODP) linked service:

1. In Azure Data Factory Studio, go to the **Manage** hub of your data factory instance. In the menu under **Connections**, select **Linked services**. Select **New** to create a new linked service.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-new-linked-service.png" alt-text="Screenshot of the manage hub in Azure Data Factory with the New Linked Service button highlighted.":::

1. Search for **SAP** and select **SAP ODP (preview)**. Select **Continue**.

   :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-linked-service-selection.png" alt-text="Screenshot of the linked service source selection with SAP ODP (preview) selected.":::

1. Set SAP ODP linked service properties. Many of the properties are similar to SAP Table linked service properties. For more information, see [Linked service properties](connector-sap-table.md?tabs=data-factory#linked-service-properties).

   1. In **Name**, enter a unique name for the linked service.
   1. In **Connect via integration runtime**, select your self-hosted integration runtime.
   1. In **Server name**, enter the mapped server name for your SAP system.
   1. In **Subscriber name** property, enter a unique name to register and identify this Data Factory connection as a subscriber that consumes data packages produced in Operational Delta Queue (ODQ) by your SAP system. For example, might name it `<your-data-factory-name>_<your-linked-service-name>`.

    When you use the Delta extraction mode in SAP, the combination of subscriber name (maintained in the linked service) and subscriber process must be unique for every copy activity reading from the same ODP source object. A unique name ensures that the ODP framework can distinguish between copy activities and provide the correct changes.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-linked-service-configuration.png" alt-text="Screenshot of the SAP ODP linked service configuration.":::

1. Test the connection and create your new SAP ODP linked service.

## Prepare the SAP ODP source dataset

To create a Data Factory copy activity that uses an SAP ODP data source:

1. In Azure Data Factory Studio, go to the **Author** hub of your data factory. In **Factory Resources**, under **Pipelines** > **Pipelines Actions**, select **New pipeline**.

   :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-new-pipeline.png" alt-text="Screenshot that shows creating a new pipeline in the Author hub.":::  

1. In **Activities**, select the **Move & transform** dropdown. Select the **Copy data** activity and drag it to the canvas of new pipeline. Select the **Source** tab of the Data Factory copy activity, and then select **New** to create a new source dataset.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-data-source-new.png" alt-text="Screenshot of the Copy data activity's Source configuration.":::

1. Search for **SAP** and select **SAP ODP (preview)**. Select **Continue**.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-source-dataset-selection.png" alt-text="Screenshot of the SAP ODP (preview) dataset type on the New dataset dialog.":::

1. In **Set properties**, enter a name for the SAP ODP linked service data source. In **Linked service**, select the dropdown and select **New**.

1. Select your SAP ODP linked service for the new source dataset and set the rest of the properties for the linked service:

   1. For **Connect via integration runtime**, select your self-hosted integration runtime.
   1. For **Context**, select the context of data extraction via ODP. Here are some examples:

       - To extract ABAP CDS views from S/4HANA, select **ABAP_CDS**.
       - To extract InfoProviders or InfoObjects from SAP BW or BW/4HANA, select **BW**.
       - To extract SAP extractors from SAP ECC, select **SAPI**.
       - To extract SAP application tables from SAP source systems via SLT replication server as a proxy, select **SLT_\<*your queue alias*\>**.

       If you want to extract SAP application tables, but you don’t want to use the SLT replication server as a proxy, you can create SAP extractors by using the RSO2 transaction code or CDS views on top of the tables. Then, extract the tables directly from your SAP source systems by using either an **SAPI** or an **ABAP_CDS** context.

   1. For **Object name**, under the selected data extraction context, select the name of the data source object to extract. If you connect to your SAP source system by using the SLT replication server as a proxy, the **Preview data** feature currently isn't supported.

      To enter the selections yourself, select the **Edit** checkboxes.
  
    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-source-dataset-configuration.png" alt-text="Screenshot of the SAP ODP (preview) dataset configuration page.":::

1. Select **OK** to create your new SAP ODP source dataset.

1. For **Extraction mode** in the Data Factory copy activity, select one of the following options:

    - **Full**. Always extracts the current snapshot of the selected data source object. This option doesn't register the Data Factory copy activity as its delta subscriber that consumes data changes produced in the ODQ by your SAP system.
    - **Delta**. Initially extracts the current snapshot of the selected data source object. This option registers the Data Factory copy activity as its delta subscriber and subsequently extracts new data changes produced in the ODQ by your SAP system since the last extraction.
    - **Recovery**. Repeats the last extraction that was part of a failed pipeline run.

1. For **Subscriber process** in the Data Factory copy activity, enter a unique name to register and identify this Data Factory copy activity as a delta subscriber of the selected data source object. Your SAP system manages its subscription state to keep track of data changes produced in the ODQ and consumed in consecutive extractions. You don't need to manually watermark data changes. For example, you might name the subscriber process `<your pipeline name>`_`<your copy activity name>`.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-source-configuration.png" alt-text="Screenshot of the SAP CDC (preview) source configuration in a Copy activity.":::

1. If you want to extract only data from some columns or rows, you can use the column projection or row selection features:

    1. For **Projection** in the Data Factory copy activity, select **Refresh** to load the dropdown selections with column names of the selected data source object.

       If you have many columns and you want to include only a few columns in your data extraction, select the checkboxes for those columns. If you have many columns and you want to exclude only a few in your data extraction, select the **Select all** checkbox first, and then clear the checkboxes for those columns. If no column is selected, all columns are extracted.

      To enter the selections yourself, select the **Edit** checkboxes.

       :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-source-projection-configuration.png" alt-text="Screenshot of the SAP CDC (preview) source configuration with the Projection, Selection, and Additional columns sections highlighted.":::

    1. For **Selection** in the Data Factory copy activity, select **New** to add a new row selection condition that contains arguments.

        1. For **Field name**, select **Refresh** to load the dropdown selections with column names of the selected data source object. You also can enter the column names manually.
        1. For **Sign**, select **Inclusive** or **Exclusive** to include or exclude only rows that meet the selection condition in your data extraction.
        1. For **Option**, select **EQ**, **CP**, or **BT** to apply the following row selection conditions:

           - **EQ**: True if the value in the **Field name** column is equal to the value of the **Low** argument.
           - **CP**: True if the value in the **Field name** column contains a pattern that's specified in the value of the **Low** argument.
           - **BT**: True if the value in the **Field name** column is between the values of the **Low** and **High** arguments.

        Consult SAP documentation or support notes to ensure that your row selection conditions can be applied to the selected data source object. For example, here are some row selection conditions and their respective arguments:

        | Row selection condition | Field name | Sign | Option | Low | High |
        |---------|---------|---------|---------|---------|---------|
        | Include only rows where the value in *COUNTRY* column is *CHINA*     | *COUNTRY*         | *Inclusive*         | *EQ*         | *CHINA*         |         |
        | Exclude only rows where the value in *COUNTRY* column is *CHINA*     | *COUNTRY*         | *Exclusive*         | *EQ*         | *CHINA*         |         |
        | Include only rows where the value in *FIRSTNAME* column contains *JO** pattern     | *FIRSTNAME*         | *Inclusive*         | *CP*         | *JO**         |         |
        | Include only rows where the value in *CUSTOMERID* column is between *1* and *999999*     | *CUSTOMERID*         | *Inclusive*         | *BT*         | *1*         | *999999*         |
  
        :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-selection-additional-columns.png" alt-text="Screenshot of the SAP ODP (preview) source configuration for a copy activity with the Selection and Additional columns sections highlighted.":::

        Row selections are especially useful to divide large data sets into multiple partitions, where each partition can be extracted using a single copy activity, so you can perform full extractions using multiple copy activities running in parallel. These copy activities will in turn invoke parallel processes on your SAP system to produce data packages in ODQ that can also be consumed by parallel processes in each copy activity, thus increasing throughput significantly.

1. Go to the **Sink** tab of the Data Factory copy activity and select an existing sink dataset or create a new one for any data store, such as Azure Blob Storage or Azure Data Lake Storage Gen2.

    To increase throughput, you can enable the Data Factory copy activity to concurrently extract data packages produced in ODQ by your SAP system and enforce all extraction processes to immediately write them into the sink in parallel. For example, if you use Data Lake Storage Gen2 as sink, leave the **File name** field in **File path** property of sink dataset empty, so all extracted data packages will be written as separate files.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-staging-dataset.png" alt-text="Screenshot of the staging dataset configuration for the solution.":::

1. To increase throughput, select the **Settings** tab of the Data Factory copy activity. Set **Degree of copy parallelism** to concurrently extract data packages that your SAP system produces in the ODQ.

    If you use Azure Blob Storage or Data Lake Storage Gen2 as the sink, the maximum number you can select for effective parallel extractions is 4 or 5 per self-hosted integration runtime machine, but you can install a self-hosted integration runtime as a cluster of up to four machines. For more information, see [High availability and scalability](create-self-hosted-integration-runtime.md?tabs=data-factory#high-availability-and-scalability).

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-settings-parallelism.png" alt-text="Screenshot of a Copy activity with the Degree of parallelism setting highlighted.":::

1. To fine-tune parallel extractions, adjust the maximum size of data packages produced in the ODQ. The default size is 50 MB. 3 GB of an SAP table or object are extracted into 60 files of raw SAP data in Data Lake Storage Gen2. Lowering the maximum size to 15 MB might increase throughput, but more (200) files are produced. To lower the maximum size, select **Code** for the Data Factory pipeline. Edit the **maxPackageSize** property of the Data Factory copy activity.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-configuration.png" alt-text="Screenshot of a pipeline with the Code configuration button highlighted.":::

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-1.png" alt-text="Screenshot of the code configuration for a pipeline with the maxPackageSize setting highlighted.":::

1. If you set **Extraction mode** in the Data Factory copy activity to **Delta**, your initial or subsequent extractions consume full data or new data changes produced in the ODQ by your SAP system since the last extraction.

    For each extraction, you can skip the actual data production or consumption or transfer and simply initialize or advance your delta subscription state. This option is especially useful if you want to perform full and delta extractions by using separate copy activities with different partitions. To set up full and delta extractions by using separate copy activities with different partitions, select **Code** for the Data Factory pipeline. Add the **deltaExtensionNoData** property of the Data Factory copy activity and set it to **true**. Remove that property when you want to resume extracting data.

     :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-2.png" alt-text="Screenshot of the code configuration for a pipeline with the deltaExtensionNoData property highlighted.":::

1. Select **Save all**, and then select **Debug** to run your new pipeline that contains the Data Factory copy activity with the SAP ODP source dataset.

To illustrate the results of full and delta extractions from consecutively running your new pipeline, here's an example of a simple table in SAP ECC:

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-simple-custom-table.png" alt-text="Screenshot of a simple custom table in SAP.":::

Here’s the raw SAP data from an initial or full extraction in CSV format in Data Lake Storage Gen2:

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-sample-data.png" alt-text="Shows sample CDC data from SAP loaded into Data Factory.":::

The file contains the system columns **ODQ_CHANGEMODE**, **ODQ_ENTITYCNTR**, and **SEQUENCENUMBER**. The Data Factory data flow activity uses these columns to merge data changes when it replicates SAP data.

The **ODQ_CHANGEMODE** column marks the type of change for each row or record: **C** (created), **U** (updated), or **D** (deleted). The initial run of your pipeline in *delta* extraction mode always induces a full load that marks all rows as **C** (created).

The following example shows the delta extraction in CSV format in Data Lake Storage Gen2 after three rows of the custom table in SAP ECC are created, updated, and deleted:

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-sample-data-after-deletions.png" alt-text="Shows sample CDC data from SAP loaded into Data Factory after deletions were made.":::

## Next steps

[Debug Data Factory copy activity issues by sending self-hosted integration runtime logs](sap-change-data-capture-debug-shir-logs.md)
