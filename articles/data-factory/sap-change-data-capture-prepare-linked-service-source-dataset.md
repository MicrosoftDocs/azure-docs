---
title: Set up a linked service and dataset for the SAP CDC solution (preview) 
titleSuffix: Azure Data Factory
description: Learn how to set up a linked service and source dataset to use with the SAP change data capture (CDC) solution (preview) in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Set up a linked service and source dataset for your SAP CDC solution (preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Learn how to set up the linked service and source dataset for your SAP change data capture (CDC) solution (preview) in Azure Data Factory.

## Set up a linked service

To set up an SAP ODP (preview) linked service for your SAP CDC solution:

1. In Azure Data Factory Studio, go to the Manage hub of your data factory. In the menu under **Connections**, select **Linked services**. Select **New** to create a new linked service.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-new-linked-service.png" alt-text="Screenshot of the Manage hub in Azure Data Factory Studio, with the New linked service button highlighted.":::

1. In **New linked service**, search for **SAP**. Select **SAP ODP (Preview)**, and then select **Continue**.

   :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-linked-service-selection.png" alt-text="Screenshot of the linked service source selection, with SAP ODP (Preview) selected.":::

1. Set the linked service properties. Many of the properties are similar to SAP Table linked service properties. For more information, see [Linked service properties](connector-sap-table.md?tabs=data-factory#linked-service-properties).

   1. In **Name**, enter a unique name for the linked service.
   1. In **Connect via integration runtime**, select your self-hosted integration runtime.
   1. In **Server name**, enter the mapped server name for your SAP system.
   1. In **Subscriber name**, enter a unique name to register and identify this Data Factory connection as a subscriber that consumes data packages that are produced in the Operational Delta Queue (ODQ) by your SAP system. For example, you might name it `<your data factory -name>_<your linked service name>`.

    When you use delta extraction mode in SAP, the combination of subscriber name (maintained in the linked service) and subscriber process must be unique for every copy activity that reads from the same ODP source object. A unique name ensures that the ODP framework can distinguish between copy activities and provide the correct delta.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-linked-service-configuration.png" alt-text="Screenshot of the SAP ODP linked service configuration.":::

1. Select **Test connection**, and then select **Create**.

## Create a copy activity

To create a Data Factory copy activity that uses an SAP ODP (preview) data source, complete the steps in the following sections.

### Set up the source dataset

1. In Azure Data Factory Studio, go to the Author hub of your data factory. In **Factory Resources**, under **Pipelines** > **Pipelines Actions**, select **New pipeline**.

   :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-new-pipeline.png" alt-text="Screenshot that shows creating a new pipeline in the Data Factory Studio Author hub.":::  

1. In **Activities**, select the **Move & transform** dropdown. Select the **Copy data** activity and drag it to the canvas of the new pipeline. Select the **Source** tab of the Data Factory copy activity, and then select **New** to create a new source dataset.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-data-source-new.png" alt-text="Screenshot of the Copy data activity Source configuration.":::

1. In **New dataset**, search for **SAP**. Select **SAP ODP (Preview)**, and then select **Continue**.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-source-dataset-selection.png" alt-text="Screenshot of the SAP ODP (Preview) dataset type in the New dataset dialog.":::

1. In **Set properties**, enter a name for the SAP ODP linked service data source. In **Linked service**, select the dropdown and select **New**.

1. Select your SAP ODP linked service for the new source dataset and set the rest of the properties for the linked service:

   1. In **Connect via integration runtime**, select your self-hosted integration runtime.

   1. In **Context**, select the context of the ODP data extraction. Here are some examples:

       - To extract ABAP CDS views from S/4HANA, select **ABAP_CDS**.
       - To extract InfoProviders or InfoObjects from SAP BW or BW/4HANA, select **BW**.
       - To extract SAP extractors from SAP ECC, select **SAPI**.
       - To extract SAP application tables from SAP source systems via SAP LT replication server as a proxy, select **SLT_\<your queue alias\>**.

       If you want to extract SAP application tables, but you don’t want to use SAP Landscape Transformation Replication Server (SLT) as a proxy, you can create SAP extractors by using the RSO2 transaction code or Core Data Services (CDS) views with the tables. Then, extract the tables directly from your SAP source systems by using either an **SAPI** or an **ABAP_CDS** context.

   1. For **Object name**, under the selected data extraction context, select the name of the data source object to extract. If you connect to your SAP source system by using SLT as a proxy, the **Preview data** feature currently isn't supported.

      To enter the selections directly, select the **Edit** checkbox.
  
    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-source-dataset-configuration.png" alt-text="Screenshot of the SAP ODP (Preview) dataset configuration page.":::

1. Select **OK** to create your new SAP ODP source dataset.

1. In the Data Factory copy activity, in **Extraction mode**, select one of the following options:

    - **Full**: Always extracts the current snapshot of the selected data source object. This option doesn't register the Data Factory copy activity as its delta subscriber that consumes data changes produced in the ODQ by your SAP system.
    - **Delta**: Initially extracts the current snapshot of the selected data source object. This option registers the Data Factory copy activity as its delta subscriber and then extracts new data changes produced in the ODQ by your SAP system since the last extraction.
    - **Recovery**: Repeats the last extraction that was part of a failed pipeline run.

1. In **Subscriber process**, enter a unique name to register and identify this Data Factory copy activity as a delta subscriber of the selected data source object. Your SAP system manages its subscription state to keep track of data changes that are produced in the ODQ and consumed in consecutive extractions. You don't need to manually watermark data changes. For example, you might name the subscriber process `<your pipeline name>_<your copy activity name>`.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-source-configuration.png" alt-text="Screenshot of the SAP CDC source configuration in a Data Factory copy activity.":::

1. If you want to extract data from only some columns or rows, you can use the column projection or row selection features:

    1. In **Projection**, select **Refresh** to load the dropdown selections with column names of the selected data source object.

       If you want to include only a few columns in your data extraction, select the checkboxes for those columns. If you want to exclude only a few columns from your data extraction, select the **Select all** checkbox first, and then clear the checkboxes for columns you want to exclude. If no column is selected, all columns are extracted.

       To enter the selections directly, select the **Edit** checkbox.

       :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-source-projection-configuration.png" alt-text="Screenshot of the SAP CDC source configuration with the Projection, Selection, and Additional columns sections highlighted.":::

    1. In **Selection**, select **New** to add a new row selection condition that contains arguments.

        1. In **Field name**, select **Refresh** to load the dropdown selections with column names of the selected data source object. You also can enter the column names manually.
        1. In **Sign**, select **Inclusive** or **Exclusive** to include or exclude rows that meet the selection condition in your data extraction.
        1. In **Option**, select **EQ**, **CP**, or **BT** to apply the following row selection conditions:

           - **EQ**: True if the value in the **Field name** column is equal to the value of the **Low** argument.
           - **CP**: True if the value in the **Field name** column contains a pattern that's specified in the value of the **Low** argument.
           - **BT**: True if the value in the **Field name** column is between the values of the **Low** and **High** arguments.

        To ensure that your row selection conditions can be applied to the selected data source object, see SAP documentation or support notes for the data source object.

        The following table shows example row selection conditions and their respective arguments:

        | Row selection condition | Field name | Sign | Option | Low | High |
        |---------|---------|---------|---------|---------|---------|
        | Include only rows in which the value in the **COUNTRY** column is **CHINA**     | **COUNTRY**         | **Inclusive**         | **EQ**         | **CHINA**         |         |
        | Exclude only rows in which the value in the **COUNTRY** column is **CHINA**     | **COUNTRY**         | **Exclusive**         | **EQ**         | **CHINA**         |         |
        | Include only rows in which the value in the **FIRSTNAME** column contains the **JO\*** pattern     | **FIRSTNAME**         | **Inclusive**         | **CP**         | **JO\***         |         |
        | Include only rows in which the value in the **CUSTOMERID** column is between **1** and **999999**     | **CUSTOMERID**         | **Inclusive**         | **BT**         | **1**         | **999999**         |
  
        :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-selection-additional-columns.png" alt-text="Screenshot of the SAP ODP source configuration for a copy activity with the Selection and Additional columns sections highlighted.":::

        Row selections are especially useful to divide large data sets into multiple partitions. You can extract each partition by using a single copy activity. You can perform full extractions by using multiple copy activities running in parallel. These copy activities in turn invoke parallel processes on your SAP system to produce separate data packages in the ODQ. Parallel processes in each copy activity can consume packages and increase throughput significantly.

### Set up the source sink

- In the Data Factory copy activity, select the **Sink** tab. Select an existing sink dataset or create a new one for a data store like Azure Blob Storage or Azure Data Lake Storage Gen2.

    To increase throughput, you can enable the Data Factory copy activity to concurrently extract data packages that your SAP system produces in the ODQ. You can enforce all extraction processes to immediately write them to the sink in parallel. For example, if you use Data Lake Storage Gen2 as a sink, in **File path** for the sink dataset, leave **File name** empty. All extracted data packages will be written as separate files.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-staging-dataset.png" alt-text="Screenshot of the staging dataset configuration for the solution.":::

### Configure copy activity settings

1. To increase throughput, in the Data Factory copy activity, select the **Settings** tab. Set **Degree of copy parallelism** to concurrently extract data packages that your SAP system produces in the ODQ.

    If you use Azure Blob Storage or Data Lake Storage Gen2 as the sink, the maximum number of effective parallel extractions you can set is four or five per self-hosted integration runtime machine. You can install a self-hosted integration runtime as a cluster of up to four machines. For more information, see [High availability and scalability](create-self-hosted-integration-runtime.md?tabs=data-factory#high-availability-and-scalability).

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-settings-parallelism.png" alt-text="Screenshot of a Copy activity with the Degree of parallelism setting highlighted.":::

1. To fine-tune parallel extractions, adjust the maximum size of data packages that are produced in the ODQ. The default size is 50 MB. 3 GB of an SAP table or object are extracted into 60 files of raw SAP data in Data Lake Storage Gen2. Lowering the maximum size to 15 MB might increase throughput, but more (200) files are produced. To lower the maximum size, in the pipeline navigation menu, select **Code**.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-configuration.png" alt-text="Screenshot of a pipeline with the Code configuration button highlighted.":::

    Then, in the JSON file, edit `maxPackageSize` to lower the maximum size.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-1.png" alt-text="Screenshot of the code configuration for a pipeline with the maxPackageSize setting highlighted.":::

1. If you set **Extraction mode** in the Data Factory copy activity to **Delta**, your initial or subsequent extractions consume full data or new data changes produced in the ODQ by your SAP system since the last extraction.

    For each extraction, you can skip the actual data production, consumption, or transfer, and instead directly initialize or advance your delta subscription state. This option is especially useful if you want to perform full and delta extractions by using separate copy activities by using different partitions. To set up full and delta extractions by using separate copy activities with different partitions, in the pipeline navigation menu, select **Code**. In the JSON file, add the `deltaExtensionNoData` property and set it to `true`. To resume extracting data, remove that property or set it to `false`.

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

[Debug copy activity by sending self-hosted integration runtime logs](sap-change-data-capture-debug-shir-logs.md)
