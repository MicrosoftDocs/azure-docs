---
title: Set up the linked service and dataset for SAP ODP (preview) 
titleSuffix: Azure Data Factory
description: Learn how to set up the linked service and source dataset for SAP change data capture (preview) in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Set up a linked service and source dataset for the SAP ODP (review)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Learn how to set up the linked service and source dataset for SAP ODP (preview) in Azure Data Factory.

## Set up an SAP ODP linked service

To set up an SAP Operational Data Provisioning (ODP) linked service:

1. In the Azure Data Factory Studio hub menu, select **Manage**. In the left menu under **Connections**, select **Linked services**. Select **New** to create a new linked service.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-new-linked-service.png" alt-text="Screenshot of the manage hub in Azure Data Factory with the New Linked Service button highlighted.":::

1. Search for **SAP** and select **SAP ODP (preview)**. Select **Continue**.

   :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-linked-service-selection.png" alt-text="Screenshot of the linked service source selection with SAP ODP (preview) selected.":::

1. Set SAP ODP linked service properties. Many of the properties are similar to SAP Table linked service properties. For more information,, see [Linked service properties](connector-sap-table.md?tabs=data-factory#linked-service-properties).

   1. In **Name**, enter a unique name for the linked service.
   1. In **Connect via integration runtime**, select your self-hosted integration runtime.
   1. In **Server name**, enter the mapped server name for your SAP system.
   1. In **Subscriber name** property, enter a unique name to register and identify this Data Factory connection as a subscriber that consumes data packages produced in Operational Delta Queue (ODQ) by your SAP system. For example, might name it `<your-data-factory-name>_<your-linked-service-name>`.

    When you use the Delta extraction mode in SAP, the combination of subscriber name (maintained in the linked service) and subscriber process must be unique for every copy activity reading from the same ODP source object. A unique name ensures that the ODP framework can distinguish between copy activities and provide the correct changes.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-linked-service-configuration.png" alt-text="Screenshot of the SAP ODP linked service configuration.":::

1. Test the connection and create your new SAP ODP linked service.

## Prepare the SAP ODP source dataset

To prepare a Data Factory copy activity with an SAP ODP data source:

1. In the Azure Data Factory Studio hub menu, select **Author**. In **Factory Resources**, select the **Pipeline Actions** dropdown and select **New pipeline**.

   :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-new-pipeline.png" alt-text="Screenshot that shows creating a new pipeline in the Author hub.":::  

1. In **Activities**, select the **Move & transform** dropdown. Select the **Copy data** activity and drag it to the canvas of new pipeline. Select the **Source** tab of the Data Factory copy activity, and select the **New** button to create a new source dataset.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-data-source-new.png" alt-text="Screenshot of the Copy data activity's Source configuration.":::

1. Search for **SAP** and select **SAP ODP (preview)**. Select **Continue**.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-source-dataset-selection.png" alt-text="Screenshot of the SAP ODP (preview) dataset type on the New dataset dialog.":::

1. In **Set properties**, enter a name for the SAP ODP linked service data source. In **Linked service**, select the dropdown and select **New**.

1. Select your new SAP ODP linked service for the new source dataset and set the rest of the properties for the linked service:

   1. For the **Connect via integration runtime** property, select your self-hosted integration runtime.
   1. For the **Context** property, select the context of data extraction via ODP, such as:

       - **ABAP_CDS** to extract ABAP CDS views from S/4HANA.
       - **BW** to extract InfoProviders or InfoObjects from SAP BW or BW/4HANA.
       - **SAPI** to extract SAP extractors from SAP ECC.
       - **SLT_\<*your queue alias*\>** to extract SAP application tables from SAP source systems via SLT replication server as a proxy.

       If you want to extract SAP application tables, but don’t want to use SLT replication server as a proxy, you can create SAP extractors via RSO2 transaction code or CDS views on top of those tables and extract them directly from your SAP source systems in *SAPI/ABAP_CDS* context, respectively.

   1. For the **Object name** property, select the name of data source object to extract under the selected data extraction context. If you connect to your SAP source system via SLT replication server as a proxy, the **Preview data** feature isn't supported for now.

   1. (Optional) If you want to enter the selections yourself, select the **Edit** checkboxes.
  
    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-source-dataset-configuration.png" alt-text="Screenshot of the SAP ODP (preview) dataset configuration page.":::

1. Select **OK** to create your new SAP ODP source dataset.

1. For the **Extraction** mode property of the Data Factory copy activity, select one of the following modes:

    - **Full** to always extract the current snapshot of the selected data source object. This option doesn't register the Data Factory copy activity as its “delta” subscriber that consumes data changes produced in ODQ by your SAP system.
    - **Delta** to initially extract the current snapshot of the selected data source object. This option registers the Data Factory copy activity as its “delta” subscriber and subsequently extracts new data changes produced in ODQ by your SAP system since the last extraction.
    - **Recovery** to repeat the last extraction that was part of a failed pipeline run.

1. For the **Subscriber process** property of the Data Factory copy activity, enter a unique name to register and identify this Data Factory copy activity as a “delta” subscriber of the selected data source object, so your SAP system can manage its subscription state to keep track of data changes produced in ODQ and consumed in consecutive extractions, eliminating the need for watermarking them yourself. For example, you can name it <*your pipeline name*>_<*your copy activity name*>.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-source-configuration.png" alt-text="Screenshot of the SAP CDC (preview) source configuration in a Copy activity.":::

1. If you want to extract only data from some columns or rows, you can use the column projection or row selection features:
    1. For the **Projection** property of the Data Factory copy activity, select the **Refresh** button to load the dropdown menu selections with column names of the selected data source object.

       If you have many columns and you want to include only a few in your data extraction, select the checkboxes for those columns. If you have many columns and you want to exclude only a few in your data extraction, select the **Select all** checkbox first and then clear the checkboxes for those columns. If no column is selected, all will be extracted by default.

       Select the **Edit** checkbox, if loading the dropdown menu selections takes too long and you want to add or type them yourself.

       :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-source-projection-configuration.png" alt-text="Screenshot of the SAP CDC (preview) source configuration with the Projection, Selection, and Additional columns sections highlighted.":::

    1. For the **Selection** property of the Data Factory copy activity, select the **New** button to add a new row selection condition containing **Field name/Sign/Option/Low/High** arguments.

        1. For the **Field name** argument, select the **Refresh** button to load the dropdown menu selections with column names of the selected data source object. if loading the dropdown menu selections takes too long, you can type it yourself.
        1. For the **Sign** argument, select *Inclusive/Exclusive* to respectively include or exclude only rows that meet the selection condition in your data extraction.
        1. For the **Option** argument, select *EQ/CP/BT* to respectively apply the following row selection conditions:

           - “True if the value in **Field name** column is equal to the value of **Low** argument”
           - ”True if the value in **Field name** column contains a pattern specified in the value of **Low** argument”
           - ”True if the value in **Field name** column is between the values of **Low** and **High** arguments”

        Consult SAP documentation or support notes to ensure that your row selection conditions can be applied to the selected data source object. For example, here are some row selection conditions and their respective arguments:

        | Row selection condition | Field name | Sign | Option | Low | High |
        |---------|---------|---------|---------|---------|---------|
        | Include only rows where the value in *COUNTRY* column is *CHINA*     | *COUNTRY*         | *Inclusive*         | *EQ*         | *CHINA*         |         |
        | Exclude only rows where the value in *COUNTRY* column is *CHINA*     | *COUNTRY*         | *Exclusive*         | *EQ*         | *CHINA*         |         |
        | Include only rows where the value in *FIRSTNAME* column contains *JO** pattern     | *FIRSTNAME*         | *Inclusive*         | *CP*         | *JO**         |         |
        | Include only rows where the value in *CUSTOMERID* column is between *1* and *999999*     | *CUSTOMERID*         | *Inclusive*         | *BT*         | *1*         | *999999*         |
  
        :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-selection-additional-columns.png" alt-text="Screenshot of the SAP CDC (preview) source configuration for a Copy activity with the Selection and Additional columns sections highlighted.":::

        Row selections are especially useful to divide large data sets into multiple partitions, where each partition can be extracted using a single copy activity, so you can perform full extractions using multiple copy activities running in parallel. These copy activities will in turn invoke parallel processes on your SAP system to produce data packages in ODQ that can also be consumed by parallel processes in each copy activity, thus increasing throughput significantly.

1. Go to the **Sink** tab of the Data Factory copy activity and select an existing sink dataset or create a new one for any data store, such as Azure Blob Storage or Azure Data Lake Storage Gen2.

    To increase throughput, you can enable the Data Factory copy activity to concurrently extract data packages produced in ODQ by your SAP system and enforce all extraction processes to immediately write them into the sink in parallel. For example, if you use Data Lake Storage Gen2 as sink, leave the **File name** field in **File path** property of sink dataset empty, so all extracted data packages will be written as separate files.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-staging-dataset.png" alt-text="Screenshot of the staging dataset configuration for the solution.":::

1. To increase throughput, go to the **Settings** tab of the Data Factory copy activity. Set the **Degree of copy parallelism** property to concurrently extract data packages produced in ODQ by your SAP system.

    If you use Azure Blob Storage or Data Lake Storage Gen2 as the sink, the maximum number of effective parallel extractions is four or five per self-hosted integration runtime machine, but you can install a self-hosted integration runtime as a cluster of up to four machines. For more information, see [High availability and scalability](create-self-hosted-integration-runtime.md?tabs=data-factory#high-availability-and-scalability).

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-settings-parallelism.png" alt-text="Screenshot of a Copy activity with the Degree of parallelism setting highlighted.":::

1. Adjust the maximum size of data packages produced in ODQ to fine-tune parallel extractions. The default size is 50 MB. 3 GB of SAP table or object are extracted into 60 files of raw SAP data in Data Lake Storage Gen2. Lowering the maximum size to 15 MB might increase throughput, but more (200) files are produced. To lower the maximum size, select the **Code** button of the Data Factory pipeline. Edit the **maxPackageSize** property of the Data Factory copy activity.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-configuration.png" alt-text="Screenshot of a pipeline with the Code configuration button highlighted.":::

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-1.png" alt-text="Screenshot of the code configuration for a pipeline with the maxPackageSize setting highlighted.":::

1. If you set the **Extraction mode** property of the Data Factory copy activity to **Delta**, your initial or subsequent extractions consume full data or new data changes produced in ODQ by your SAP system since the last extraction.

    For each extraction, you can skip the actual data production or consumption or transfer and simply initialize or advance your delta subscription state. This is especially useful if you want to perform full and delta extractions by using separate copy activities with different partitions. to do full and delta extractions by using separate copy activities with different partitions, select the **Code** button of the Data Factory pipeline. Add the **deltaExtensionNoData** property of the Data Factory copy activity and set it to **true**. Remove that property when you want to resume extracting data.

     :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-2.png" alt-text="Screenshot of the code configuration for a pipeline with the deltaExtensionNoData property highlighted.":::

1. Select **Save all**, and then select **Debug** to run your new pipeline that contains the Data Factory copy activity with the SAP ODP source dataset.

To illustrate the results of full and delta extractions from consecutively running your new pipeline, here's an example simple table in SAP ECC:

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-simple-custom-table.png" alt-text="Screenshot of a simple custom table in SAP.":::

Here’s the raw SAP data from an initial or full extraction in CSV format in Data Lake Storage Gen2:

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-sample-data.png" alt-text="Shows sample CDC data from SAP loaded into Data Factory.":::

The file contains the system columns **ODQ_CHANGEMODE**, **ODQ_ENTITYCNTR**, and **SEQUENCENUMBER**. The Data Factory data flow activity uses these columns to merge data changes when it replicates SAP data. 

The **ODQ_CHANGEMODE** column marks the type of change for each row or record: **C** (created), **U** (updated), or **D** (deleted). The initial run of your pipeline in *delta* extraction mode always induces a full load that marks all rows as **C** (created).

The following example shows the delta extraction in CSV format in Data Lake Storage Gen2 after three rows of the custom table in SAP ECC are created, updated, and deleted:

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-sample-data-after-deletions.png" alt-text="Shows sample CDC data from SAP loaded into Data Factory after deletions were made.":::

## Next steps

[Debug Data Factory copy activity issues by sending self-hosted integration runtime logs](sap-change-data-capture-debug-shir-logs.md)
