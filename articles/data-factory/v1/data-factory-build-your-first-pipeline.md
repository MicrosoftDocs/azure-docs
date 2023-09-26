---
title: 'Data Factory tutorial: First data pipeline '
description: This Azure Data Factory tutorial shows you how to create and schedule a data factory that processes data using Hive script on a Hadoop cluster.
author: dcstwh
ms.author: weetok
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
---

# Tutorial: Build your first pipeline to transform data using Hadoop cluster
> [!div class="op_single_selector"]
> * [Overview and prerequisites](data-factory-build-your-first-pipeline.md)
> * [Visual Studio](data-factory-build-your-first-pipeline-using-vs.md)
> * [PowerShell](data-factory-build-your-first-pipeline-using-powershell.md)
> * [Resource Manager template](data-factory-build-your-first-pipeline-using-arm.md)
> * [REST API](data-factory-build-your-first-pipeline-using-rest-api.md)


> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [Quickstart: Create a data factory using Azure Data Factory](../quickstart-create-data-factory-dot-net.md).

In this tutorial, you build your first Azure data factory with a data pipeline. The pipeline transforms input data by running Hive script on an Azure HDInsight (Hadoop) cluster to produce output data.  

This article provides overview and prerequisites for the tutorial. After you complete the prerequisites, you can do the tutorial using one of the following tools/SDKs: Visual Studio, PowerShell, Resource Manager template, REST API. Select one of the options in the drop-down list at the beginning (or) links at the end of this article to do the tutorial using one of these options.    

## Tutorial overview
In this tutorial, you perform the following steps:

1. Create a **data factory**. A data factory can contain one or more data pipelines that move and transform data.

	In this tutorial, you create one pipeline in the data factory.
2. Create a **pipeline**. A pipeline can have one or more activities (Examples: Copy Activity, HDInsight Hive Activity). This sample uses the HDInsight Hive activity that runs a Hive script on a HDInsight Hadoop cluster. The script first creates a table that references the raw web log data stored in Azure blob storage and then partitions the raw data by year and month.

	In this tutorial, the pipeline uses the Hive Activity to transform data by running a Hive query on an Azure HDInsight Hadoop cluster.
3. Create **linked services**. You create a linked service to link a data store or a compute service to the data factory. A data store such as Azure Storage holds input/output data of activities in the pipeline. A compute service such as HDInsight Hadoop cluster processes/transforms data.

	In this tutorial, you create two linked services: **Azure Storage** and **Azure HDInsight**. The Azure Storage linked service links an Azure Storage Account that holds the input/output data to the data factory. Azure HDInsight linked service links an Azure HDInsight cluster that is used to transform data to the data factory.
3. Create input and output **datasets**. An input dataset represents the input for an activity in the pipeline and an output dataset represents the output for the activity.

	In this tutorial, the input and output datasets specify locations of input and output data in the Azure Blob Storage. The Azure Storage linked service specifies what Azure Storage Account is used. An input dataset specifies where the input files are located and an output dataset specifies where the output files are placed.


See [Introduction to Azure Data Factory](data-factory-introduction.md) article for a detailed overview of Azure Data Factory.

Here is the **diagram view** of the sample data factory you build in this tutorial. **MyFirstPipeline** has one activity of type Hive that consumes **AzureBlobInput** dataset as an input and produces **AzureBlobOutput** dataset as an output.

:::image type="content" source="media/data-factory-build-your-first-pipeline/data-factory-tutorial-diagram-view.png" alt-text="Diagram view in Data Factory tutorial":::


In this tutorial, **inputdata** folder of the **adfgetstarted** Azure blob container contains one file named input.log. This log file has entries from three months: January, February, and March of 2016. Here are the sample rows for each month in the input file.

```
2016-01-01,02:01:09,SAMPLEWEBSITE,GET,/blogposts/mvc4/step2.png,X-ARR-LOG-ID=2ec4b8ad-3cf0-4442-93ab-837317ece6a1,80,-,1.54.23.196,Mozilla/5.0+(Windows+NT+6.3;+WOW64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/31.0.1650.63+Safari/537.36,-,http://weblogs.asp.net/sample/archive/2007/12/09/asp-net-mvc-framework-part-4-handling-form-edit-and-post-scenarios.aspx,\N,200,0,0,53175,871
2016-02-01,02:01:10,SAMPLEWEBSITE,GET,/blogposts/mvc4/step7.png,X-ARR-LOG-ID=d7472a26-431a-4a4d-99eb-c7b4fda2cf4c,80,-,1.54.23.196,Mozilla/5.0+(Windows+NT+6.3;+WOW64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/31.0.1650.63+Safari/537.36,-,http://weblogs.asp.net/sample/archive/2007/12/09/asp-net-mvc-framework-part-4-handling-form-edit-and-post-scenarios.aspx,\N,200,0,0,30184,871
2016-03-01,02:01:10,SAMPLEWEBSITE,GET,/blogposts/mvc4/step7.png,X-ARR-LOG-ID=d7472a26-431a-4a4d-99eb-c7b4fda2cf4c,80,-,1.54.23.196,Mozilla/5.0+(Windows+NT+6.3;+WOW64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/31.0.1650.63+Safari/537.36,-,http://weblogs.asp.net/sample/archive/2007/12/09/asp-net-mvc-framework-part-4-handling-form-edit-and-post-scenarios.aspx,\N,200,0,0,30184,871
```

When the file is processed by the pipeline with HDInsight Hive Activity, the activity runs a Hive script on the HDInsight cluster that partitions input data by year and month. The script creates three output folders that contain a file with entries from each month.  

```
adfgetstarted/partitioneddata/year=2016/month=1/000000_0
adfgetstarted/partitioneddata/year=2016/month=2/000000_0
adfgetstarted/partitioneddata/year=2016/month=3/000000_0
```

From the sample lines shown above, the first one (with 2016-01-01) is written to the 000000_0 file in the month=1 folder. Similarly, the second one is written to the file in the month=2 folder and the third one is written to the file in the month=3 folder.  

## Prerequisites
Before you begin this tutorial, you must have the following prerequisites:

1. **Azure subscription** - If you don't have an Azure subscription, you can create a free trial account in just a couple of minutes. See the [Free Trial](https://azure.microsoft.com/pricing/free-trial/) article on how you can obtain a free trial account.
2. **Azure Storage** - You use an Azure storage account for storing the data in this tutorial. If you don't have an Azure storage account, see the [Create a storage account](../../storage/common/storage-account-create.md) article. After you have created the storage account, note down the **account name** and **access key**. For information about how to retrieve the storage account access keys, see [Manage storage account access keys](../../storage/common/storage-account-keys-manage.md).
3. Download and review the Hive query file (**HQL**) located at: ```https://adftutorialfiles.blob.core.windows.net/hivetutorial/partitionweblogs.hql```. This query transforms input data to produce output data.
4. Download and review the sample input file (**input.log**) located at: ```https://adftutorialfiles.blob.core.windows.net/hivetutorial/input.log```
5. Create a blob container named **adfgetstarted** in your Azure Blob Storage.
6. Upload **partitionweblogs.hql** file to the **script** folder in the **adfgetstarted** container. Use tools such as [Microsoft Azure Storage Explorer](https://storageexplorer.com/).
7. Upload **input.log** file to the **inputdata** folder in the **adfgetstarted** container.

After you complete the prerequisites, select one of the following tools/SDKs to do the tutorial:

- [Visual Studio](data-factory-build-your-first-pipeline-using-vs.md)
- [PowerShell](data-factory-build-your-first-pipeline-using-powershell.md)
- [Resource Manager template](data-factory-build-your-first-pipeline-using-arm.md)
- [REST API](data-factory-build-your-first-pipeline-using-rest-api.md)

Visual Studio provides a GUI way of building your data factories. Whereas, PowerShell, Resource Manager Template, and REST API options provides scripting/programming way of building your data factories.

> [!NOTE]
> The data pipeline in this tutorial transforms input data to produce output data. It does not copy data from a source data store to a destination data store. For a tutorial on how to copy data using Azure Data Factory, see [Tutorial: Copy data from Blob Storage to SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).
>
> You can chain two activities (run one activity after another) by setting the output dataset of one activity as the input dataset of the other activity. See [Scheduling and execution in Data Factory](data-factory-scheduling-and-execution.md) for detailed information.
