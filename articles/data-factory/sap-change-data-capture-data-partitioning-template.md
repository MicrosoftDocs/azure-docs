---
title: SAP change data capture solution (Preview) - data partitioning template
titleSuffix: Azure Data Factory
description: This topic describes how to use the SAP data partitioning template for SAP change data capture (Preview) in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Auto-generate a pipeline from the SAP data partitioning template

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This topic introduces and describes auto-generation of a pipeline with the SAP data partitioning template for SAP change data capture (Preview) in Azure Data Factory.

## Steps to use the SAP data partitioning template

To auto-generate ADF pipeline from SAP data partitioning template, complete the following steps.

1.	Create a new pipeline from template.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-pipeline-from-template.png" alt-text="Screenshot of the Azure Data Factory resources tab with the Pipeline from template menu highlighted.":::

1.	Select the **Partition SAP data to extract and load into Azure Data Lake Store Gen2 in parallel** template.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-template-selection.png" alt-text="Screenshot of the template gallery with the SAP data partitioning template highlighted.":::
 
1.	Create SAP CDC and ADLS Gen2 linked services, if you haven’t done so already, and use them as inputs to SAP data partitioning template.  

    For the **Connect via integration runtime** property of SAP ODP linked service, select your SHIR.  For the **Connect via integration runtime** property of ADLS Gen2 linked service, select _AutoResolveIntegrationRuntime_.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-template-configuration.png" alt-text="Screenshot of the SAP data partitioning template configuration page with the Inputs section highlighted.":::

1.	Select **Use this template** button to auto-generate SAP data partitioning pipeline that can run multiple ADF copy activities to extract multiple partitions in parallel.

    ADF copy activities run on SHIR to concurrently extract raw data (full) from your SAP system and load it into ADLS Gen2 as CSV files.  The files can be found in _sapcdc_ container under _deltachange/&lt;your pipeline name&gt;/&lt;your pipeline run timestamp&gt;_ folder path.  The **Extraction mode** property of ADF copy activity is set to _Full_.

    To ensure high throughput, locate your SAP system, SHIR, ADLS Gen2, and Azure IR in the same region.

1.	Assign your SAP data extraction context and data source object names, as well as an array of partitions, each is defined as an array of row selection conditions, as run-time parameter values for SAP data partitioning pipeline.

    For the **selectionRangeList** parameter, enter your array of partition(s), each is defined as an array of row selection condition(s).  For example, here’s an array of three partitions, where the first partition includes only rows where the value in _CUSTOMERID_ column is between _1_ and _1000000_ (the first million customers), the second partition includes only rows where the value in _CUSTOMERID_ column is between _1000001_ and _2000000_ (the second million customers), and the third partition includes the rest of customers:

    _[[{"fieldName":"CUSTOMERID","sign":"I","option":"BT","low":"1","high":"1000000"}],[{"fieldName":"CUSTOMERID","sign":"I","option":"BT","low":"1000001","high":"2000000"}],[{"fieldName":"CUSTOMERID","sign":"E","option":"BT","low":"1","high":"2000000"}]]_

    These three partitions will be extracted using three ADF copy activities running in parallel.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-partition-extraction-configuration.png" alt-text="Screenshot of the pipeline configuration for the SAP data partitioning template with the parameters section highlighted.":::

1.	Select the **Save all** button and you can now run SAP data partitioning pipeline.

## Next steps

[Auto-generate a pipeline from the SAP data replication template](sap-change-data-capture-data-replication-template.md).
