---
title: Invoke Spark programs from Azure Data Factory
description: Learn how to invoke Spark programs from an Azure data factory using the MapReduce Activity.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.assetid: fd98931c-cab5-4d66-97cb-4c947861255c
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/15/2016
ms.author: spelluru

---
# Invoke Spark Programs from Data Factory
## Introduction
You can use the MapReduce Activity in a Data Factory pipeline to run Spark programs on your HDInsight Spark cluster. See [MapReduce Activity](data-factory-map-reduce.md) article for detailed information on using the activity before reading this article. 

## Spark sample on GitHub
The [Spark - Data Factory sample on GitHub](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/Spark) shows how to use MapReduce activity to invoke a Spark program. The spark program just copies data from one Azure Blob container to another. 

## Data Factory entities
The **Spark-ADF/src/ADFJsons** folder contains files for Data Factory entities (linked services, datasets, pipeline).  

There are two **linked services** in this sample: Azure Storage and Azure HDInsight. Specify your Azure storage name and key values in **StorageLinkedService.json** and clusterUri, userName, and password in **HDInsightLinkedService.json**.

There are two **datasets** in this sample: **input.json** and **output.json**. These files are located in the **Datasets** folder.  These files represent input and output datasets for the MapReduce activity

You find sample pipelines in the **ADFJsons/Pipeline** folder. Review a pipeline to understand how to invoke a Spark program by using the MapReduce activity. 

The MapReduce activity is configured to invoke **com.adf.sparklauncher.jar** in the **adflibs** container in your Azure storage (specified in the StorageLinkedService.json). The source code for this program is in Spark-ADF/src/main/java/com/adf/ folder and it calls spark-submit and run Spark jobs. 

> [!IMPORTANT]
> Read through [README.md](https://github.com/Azure/Azure-DataFactory/blob/master/Samples/Spark/README.md) for the latest and additional information before using the sample. 
> 
> Use your own HDInsight Spark cluster with this approach to invoke Spark programs using the MapReduce activity. Using an on-demand HDInsight cluster is not supported.   
> 
> 

## See Also
* [Hive Activity](data-factory-hive-activity.md)
* [Pig Activity](data-factory-pig-activity.md)
* [MapReduce Activity](data-factory-map-reduce.md)
* [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md)
* [Invoke R scripts](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/RunRScriptUsingADFSample)

