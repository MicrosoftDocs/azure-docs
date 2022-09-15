---
title: SAP change data capture solution (Preview) - configure copy activity
titleSuffix: Azure Data Factory
description: This article introduces and describes configuration of a copy activity for SAP change data capture (Preview) in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 09/08/2022
ms.author: ulrichchrist
---

# Configure a copy activity using the SAP CDC connector in Azure Data Factory and Azure Synapse Analytics (Preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article introduces and describes configuration of a copy activity using the SAP CDC connector (Preview) as a source in Azure Data Factory and Azure Synapse Analytics.

## Create a copy activity with an SAP CDC data source

To prepare an ADF copy activity with an SAP CDC data source, complete the following steps:

1.	In ADF Studio, go to the **Pipeline** section of the **Author** hub, select the **…** button to drop down the **Pipeline Actions** menu, and select the **New pipeline** item.
1.	Drag & drop the **Copy data** activity onto the canvas of new pipeline, go to the **Source** tab of ADF copy activity.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-source-configuration.png" alt-text="Screenshot of the Copy data activity's Source configuration.":::

1.	Select an SAP CDC dataset in the drop down box **Source dataset** or select the **New** button to create a new source dataset following the steps in [Prepare the SAP ODP linked service and source dataset for the SAP CDC solution in Azure Data Factory](sap-change-data-capture-prepare-linked-service-source-dataset.md)
1.	For the **Extraction** mode property of ADF copy activity, select one of the following modes:
    - _Full_ for always extracting the current snapshot of selected data source object w/o registering ADF copy activity as its “delta” subscriber that consumes data changes produced in ODQ by your SAP system
    - _Delta_ for initially extracting the current snapshot of selected data source object, registering ADF copy activity as its “delta” subscriber, and subsequently extracting new data changes produced in ODQ by your SAP system since the last extraction
    - _Recovery_ for repeating the last extraction that was part of a failed pipeline run

1.	For the **Subscriber process** property of ADF copy activity, enter a unique name to register and identify this ADF copy activity as a “delta” subscriber of the selected data source object, so your SAP system can manage its subscription state to keep track of data changes produced in ODQ and consumed in consecutive extractions, eliminating the need for watermarking them yourself. For example, you can name it <_your pipeline name_>_<_your copy activity name_>. Make sure you are only using upper case letters

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-source-configuration.png" alt-text="Screenshot of the SAP CDC (Preview) source configuration in a Copy activity.":::

1.	If you want to extract only data from some columns/rows, you can use the column projection/row selection features:
    1. For the **Projection** property of ADF copy activity, select the **Refresh** button to load the dropdown menu selections w/ column names of the selected data source object.  

       If you have many columns and you want to include only a few in your data extraction, select the check boxes for those columns.  If you have many columns and you want to exclude only a few in your data extraction, select the **Select all** check box first and then unselect the check boxes for those columns.  If no column is selected, all will be extracted by default.  

       Check the **Edit** check box, if loading the dropdown menu selections takes too long and you want to add/type them yourself.

       :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-source-projection-configuration.png" alt-text="Screenshot of the SAP CDC (Preview) source configuration with the Projection, Selection, and Additional columns sections highlighted.":::

    1.	For the **Selection** property of ADF copy activity, select the **New** button to add a new row selection condition containing **Field name/Sign/Option/Low/High** arguments. 
        1.	For the **Field name** argument, select the **Refresh** button to load the dropdown menu selections w/ column names of the selected data source object.  if loading the dropdown menu selections takes too long, you can type it yourself.  
        1.	For the **Sign** argument, select _Inclusive/Exclusive_ to respectively include/exclude only rows that meet the selection condition in your data extraction.  
        1.	For the **Option** argument, select _EQ/CP/BT_ to respectively apply the following row selection conditions: 
           - “True if the value in **Field name** column is equal to the value of **Low** argument”
           - ”True if the value in **Field name** column contains a pattern specified in the value of **Low** argument”
           - ”True if the value in **Field name** column is between the values of **Low** and **High** arguments”

        Please consult SAP docs/support notes to ensure that your row selection conditions can be applied to the selected data source object.  For example, here are some row selection conditions and their respective arguments:


        |**Row selection condition**  |**Field name**  |**Sign**  |**Option**  |**Low**  |**High**  |
        |---------|---------|---------|---------|---------|---------|
        |Include only rows where the value in _COUNTRY_ column is _CHINA_     |_COUNTRY_         |_Inclusive_         |_EQ_         |_CHINA_         |         |
        |Exclude only rows where the value in _COUNTRY_ column is _CHINA_     |_COUNTRY_         |_Exclusive_         |_EQ_         |_CHINA_         |         |
        |Include only rows where the value in _FIRSTNAME_ column contains _JO*_ pattern     |_FIRSTNAME_         |_Inclusive_         |_CP_         |_JO*_         |         |
        |Include only rows where the value in _CUSTOMERID_ column is between _1_ and _999999_     |_CUSTOMERID_         |_Inclusive_         |_BT_         |_1_         |_999999_         |
        
        :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-selection-additional-columns.png" alt-text="Screenshot of the SAP CDC (Preview) source configuration for a Copy activity with the Selection and Additional columns sections highlighted."::: 
        
        Row selections are especially useful to divide large data sets into multiple partitions, where each partition can be extracted using a single copy activity, so you can perform full extractions using multiple copy activities running in parallel.  These copy activities will in turn invoke parallel processes on your SAP system to produce data packages in ODQ that can also be consumed by parallel processes in each copy activity, thus increasing throughput significantly.
        
1.	Go to the **Sink** tab of ADF copy activity and select an existing sink dataset or create a new one for any data store, such as Azure Blob Storage/ADLS Gen2.

    To increase throughput, you can enable ADF copy activity to concurrently extract data packages produced in ODQ by your SAP system and enforce all extraction processes to immediately write them into the sink in parallel.  For example, if you use ADLS Gen2 as sink, leave the **File name** field in **File path** property of sink dataset empty, so all extracted data packages will be written as separate files.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-staging-dataset.png" alt-text="Screenshot of the staging dataset configuration for the solution.":::

1.	Go to the **Settings** tab of ADF copy activity and increase throughput by setting the **Degree of copy parallelism** property to concurrently extract data packages produced in ODQ by your SAP system.

    If you use Azure Blob Storage/ADLS Gen2 as sink, the maximum number of effective parallel extractions is four/five per SHIR machine, but you can install SHIR as a cluster of up to four machines, see [High availability and scalability](create-self-hosted-integration-runtime.md?tabs=data-factory#high-availability-and-scalability).

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-settings-parallelism.png" alt-text="Screenshot of a Copy activity with the Degree of parallelism setting highlighted.":::

1.	Adjust the maximum size of data packages produced in ODQ to fine-tune parallel extractions.  The default size is 50 MB, so 3 GB of SAP table/object will be extracted into 60 files of raw SAP data in ADLS Gen2.  Lowering it to 15 MB could increase throughput, but will produce more (200) files.  To do so, select the **Code** button of ADF pipeline to edit the **maxPackageSize** property of ADF copy activity.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-configuration.png" alt-text="Screenshot of a pipeline with the Code configuration button highlighted.":::

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-1.png" alt-text="Screenshot of the code configuration for a pipeline with the maxPackageSize setting highlighted.":::

1.	If you set the **Extraction mode** property of ADF copy activity to _Delta_, your initial/subsequent extractions will respectively consume full data/new data changes produced in ODQ by your SAP system since the last extraction.  

    For each extraction, you can skip the actual data production/consumption/transfer and simply initialize/advance your “delta” subscription state.  This is especially useful when you want to perform full and delta extractions using separate copy activities w/ different partitions.  To do so, select the **Code** button of ADF pipeline to add the **deltaExtensionNoData** property of ADF copy activity and set it to _true_.  Remove that property when you want to resume extracting data.

     :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-copy-code-2.png" alt-text="Screenshot of the code configuration for a pipeline with the deltaExtensionNoData property highlighted.":::    

1.	Select the **Save all** and **Debug** buttons to run your new pipeline containing ADF copy activity w/ SAP ODP source dataset.

To illustrate the results of full and delta extractions from consecutively running your new pipeline, let’s use the following simple/small custom table in SAP ECC as an example of data source object to extract.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-simple-custom-table.png" alt-text="Screenshot of a simple custom table in SAP.":::

Here’s the raw SAP data from initial/full extraction as CSV file in ADLS Gen2.  It contains system columns/fields (ODQ_CHANGEMODE/ODQ_ENTITYCNTR/_SEQUENCENUMBER) that can be used by ADF data flow activity to merge data changes when replicating SAP data.  The ODQ_CHANGEMODE column marks the type of change for each row/record: (C)reated, (U)pdated, or (D)eleted.  The initial run of your pipeline w/ _Delta_ extraction mode always induces a full load that marks all rows as (C)reated.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-sample-data.png" alt-text="Shows sample CDC data from SAP loaded into ADF.":::

After creating, updating, and deleting three rows of the custom table in SAP ECC, here’s the raw SAP data from subsequent/delta extraction as CSV file in ADLS Gen2.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-sample-data-after-deletions.png" alt-text="Shows sample CDC data from SAP loaded into ADF after deletions were made.":::

## Next steps

[Debug ADF copy activity issues by sending SHIR logs](sap-change-data-capture-debug-shir-logs.md)