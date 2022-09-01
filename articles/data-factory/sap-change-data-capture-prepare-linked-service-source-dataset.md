---
title: SAP change data capture solution (preview) - Prepare linked service and dataset
titleSuffix: Azure Data Factory
description: This article introduces and describes preparation of the linked service and source dataset for SAP change data capture (preview) in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Prepare the SAP ODP linked service and source dataset for the SAP CDC solution in Azure Data Factory (preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article introduces and describes preparation of the linked service and source dataset for SAP change data capture (preview) in Azure Data Factory.

## Prepare the SAP ODP linked service

To prepare SAP ODP linked service, complete the following steps:

1. On Data Factory Studio, go to the **Linked services** section of **Manage** hub and select the **New** button to create a new linked service.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-new-linked-service.png" alt-text="Screenshot of the manage hub in Azure Data Factory with the New Linked Service button highlighted.":::

1. Search for *SAP* and select *SAP CDC (preview)*.

   :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-linked-service-selection.png" alt-text="Screenshot of the linked service source selection with SAP CDC (preview) selected.":::

1. Set SAP ODP linked service properties, many of them are similar to SAP Table linked service properties, see [Linked service properties](connector-sap-table.md?tabs=data-factory#linked-service-properties).

   1. For the **Connect via integration runtime** property, select your self-hosted integration runtime.
   1. For the **Server name** property, enter the mapped server name for your SAP system.
   1. For the **Subscriber name** property, enter a unique name to register and identify this Data Factory connection as a subscriber that consumes data packages produced in ODQ by your SAP system. For example, you can name it <*your data factory name*>_<*your linked service name*>.

    When using extraction mode "Delta", the combination of Subscriber name (maintained in the linked service) and Subscriber process has to be unique for every copy activity reading from the same ODP source object to ensure that the ODP framework can distinguish these copy activities and provide the correct chances.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-linked-service-configuration.png" alt-text="Screenshot of the SAP ODP linked service configuration.":::

1. Test the connection and create your new SAP ODP linked service.

## Prepare the SAP ODP source dataset

To prepare a Data Factory copy activity with an SAP ODP data source:

1. On Data Factory Studio, go to the **Pipeline** section of the **Author** hub, select the **…** button to drop down the **Pipeline Actions** menu, and select the **New pipeline** item.
1. Drag & drop the **Copy data** activity onto the canvas of new pipeline, go to the **Source** tab of the Data Factory copy activity, and select the **New** button to create a new source dataset.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-source-configuration.png" alt-text="Screenshot of the Copy data activity's Source configuration.":::

1. Search for *SAP* and select *SAP CDC (preview)*.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-source-dataset-selection.png" alt-text="Screenshot of the SAP CDC (preview) dataset type on the New dataset dialog.":::

1. Select your new SAP ODP linked service for the new source dataset and set the rest of its properties.

   1. For the **Connect via integration runtime** property, select your self-hosted integration runtime.
   1. For the **Context** property, select the context of data extraction via ODP, such as: 

       - *ABAP_CDS* for extracting ABAP CDS views from S/4HANA
       - *BW* for extracting InfoProviders or InfoObjects from SAP BW or BW/4HANA
       - *SAPI* for extracting SAP extractors from SAP ECC
       - *SLT~_<*your queue alias*> for extracting SAP application tables from SAP source systems via SLT replication server as a proxy

       If you want to extract SAP application tables, but don’t want to use SLT replication server as a proxy, you can create SAP extractors via RSO2 transaction code or CDS views on top of those tables and extract them directly from your SAP source systems in *SAPI/ABAP_CDS* context, respectively.

   1. For the **Object name** property, select the name of data source object to extract under the selected data extraction context. If you connect to your SAP source system via SLT replication server as a proxy, the **Preview data** feature isn't supported for now.
   1. Select the **Edit** checkboxes, if loading the dropdown menu selections takes too long and you want to type them yourself.
  
    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-source-dataset-configuration.png" alt-text="Screenshot of the SAP CDC (preview) dataset configuration page.":::

1. Select the **OK** button to create your new SAP ODP source dataset.
1. For the **Extraction** mode property of the Data Factory copy activity, select one of the following modes:
    - *Full* for always extracting the current snapshot of selected data source object without registering the Data Factory copy activity as its “delta” subscriber that consumes data changes produced in ODQ by your SAP system
    - *Delta* for initially extracting the current snapshot of selected data source object, registering the Data Factory copy activity as its “delta” subscriber, and subsequently extracting new data changes produced in ODQ by your SAP system since the last extraction
    - *Recovery* for repeating the last extraction that was part of a failed pipeline run

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

        Consult SAP docs or support notes to ensure that your row selection conditions can be applied to the selected data source object. For example, here are some row selection conditions and their respective arguments:

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

1. Go to the **Settings** tab of the Data Factory copy activity and increase throughput by setting the **Degree of copy parallelism** property to concurrently extract data packages produced in ODQ by your SAP system.

    If you use Azure Blob Storage or Data Lake Storage Gen2 as sink, the maximum number of effective parallel extractions is four or five per self-hosted integration runtime machine, but you can install self-hosted integration runtime as a cluster of up to four machines, see [High availability and scalability](create-self-hosted-integration-runtime.md?tabs=data-factory#high-availability-and-scalability).

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-settings-parallelism.png" alt-text="Screenshot of a Copy activity with the Degree of parallelism setting highlighted.":::

1. Adjust the maximum size of data packages produced in ODQ to fine-tune parallel extractions. The default size is 50 MB, so 3 GB of SAP table or object will be extracted into 60 files of raw SAP data in Data Lake Storage Gen2. Lowering it to 15 MB could increase throughput, but will produce more (200) files. To do so, select the **Code** button of the Data Factory pipeline to edit the **maxPackageSize** property of the Data Factory copy activity.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-configuration.png" alt-text="Screenshot of a pipeline with the Code configuration button highlighted.":::

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-1.png" alt-text="Screenshot of the code configuration for a pipeline with the maxPackageSize setting highlighted.":::

1. If you set the **Extraction mode** property of the Data Factory copy activity to *Delta*, your initial or subsequent extractions will respectively consume full data or new data changes produced in ODQ by your SAP system since the last extraction.

    For each extraction, you can skip the actual data production or consumption or transfer and simply initialize or advance your “delta” subscription state. This is especially useful when you want to perform full and delta extractions using separate copy activities with different partitions. To do so, select the **Code** button of the Data Factory pipeline to add the **deltaExtensionNoData** property of the Data Factory copy activity and set it to *true*. Remove that property when you want to resume extracting data.

     :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-2.png" alt-text="Screenshot of the code configuration for a pipeline with the deltaExtensionNoData property highlighted.":::

1. Select the **Save all** and **Debug** buttons to run your new pipeline containing the Data Factory copy activity with SAP ODP source dataset.

To illustrate the results of full and delta extractions from consecutively running your new pipeline, let’s use the following simple or small custom table in SAP ECC as an example of data source object to extract.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-simple-custom-table.png" alt-text="Screenshot of a simple custom table in SAP.":::

Here’s the raw SAP data from initial or full extraction as CSV file in Data Lake Storage Gen2. It contains system columns or fields (ODQ_CHANGEMODE/ODQ_ENTITYCNTR/_SEQUENCENUMBER) that can be used by the Data Factory data flow activity to merge data changes when replicating SAP data. The ODQ_CHANGEMODE column marks the type of change for each row or record: (C)reated, (U)pdated, or (D)eleted. The initial run of your pipeline with *Delta* extraction mode always induces a full load that marks all rows as (C)reated.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-sample-data.png" alt-text="Shows sample CDC data from SAP loaded into Data Factory.":::

After creating, updating, and deleting three rows of the custom table in SAP ECC, here’s the raw SAP data from subsequent or delta extraction as CSV file in Data Lake Storage Gen2.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-sample-data-after-deletions.png" alt-text="Shows sample CDC data from SAP loaded into Data Factory after deletions were made.":::

## Next steps

[Debug the Data Factory copy activity issues by sending self-hosted integration runtime logs](sap-change-data-capture-debug-shir-logs.md)
