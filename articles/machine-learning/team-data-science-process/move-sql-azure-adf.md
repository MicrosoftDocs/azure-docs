---
title: SQL Server data to SQL Azure with Azure Data Factory - Team Data Science Process
description: Set up an ADF pipeline that composes two data migration activities that together move data on a daily basis between databases on-premises and in the cloud.
services: machine-learning
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 11/04/2017
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---
# Move data from an on-premises SQL server to SQL Azure with Azure Data Factory

This article shows how to move data from an on-premises SQL Server Database to a SQL Azure Database via Azure Blob Storage using the Azure Data Factory (ADF):  this method is a supported legacy approach which has the advantages of a replicated staging copy, though [we suggest to look at our Datamigration page for the latest options](https://datamigration.microsoft.com/scenario/sql-to-azuresqldb?step=1).

For a table that summarizes various options for moving data to an Azure SQL Database, see [Move data to an Azure SQL Database for Azure Machine Learning](move-sql-azure.md).

## <a name="intro"></a>Introduction: What is ADF and when should it be used to migrate data?
Azure Data Factory is a fully managed cloud-based data integration service that orchestrates and automates the movement and transformation of data. The key concept in the ADF model is pipeline. A pipeline is a logical grouping of Activities, each of which defines the actions to perform on the data contained in Datasets. Linked services are used to define the information needed for Data Factory to connect to the data resources.

With ADF, existing data processing services can be composed into data pipelines that are highly available and managed in the cloud. These data pipelines can be scheduled to ingest, prepare, transform, analyze, and publish data, and ADF manages and orchestrates the complex data and processing dependencies. Solutions can be quickly built and deployed in the cloud, connecting a growing number of on-premises and cloud data sources.

Consider using ADF:

* when data needs to be continually migrated in a hybrid scenario that accesses both on-premises and cloud resources
* when the data is transacted or needs to be modified or have business logic added to it when being migrated.

ADF allows for the scheduling and monitoring of jobs using simple JSON scripts that manage the movement of data on a periodic basis. ADF also has other capabilities such as support for complex operations. For more information on ADF, see the documentation at [Azure Data Factory (ADF)](https://azure.microsoft.com/services/data-factory/).

## <a name="scenario"></a>The Scenario
We set up an ADF pipeline that composes two data migration activities. Together they move data on a daily basis between an on-premises SQL database and an Azure SQL Database in the cloud. The two activities are:

* copy data from an on-premises SQL Server database to an Azure Blob Storage account
* copy data from the Azure Blob Storage account to an Azure SQL Database.

> [!NOTE]
> The steps shown here have been adapted from the more detailed tutorial provided by the ADF team: [Copy data from an on-premises SQL Server database to Azure Blob storage](https://docs.microsoft.com/azure/data-factory/tutorial-hybrid-copy-portal/) References to the relevant sections of that topic are provided when appropriate.
>
>

## <a name="prereqs"></a>Prerequisites
This tutorial assumes you have:

* An **Azure subscription**. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial/).
* An **Azure storage account**. You use an Azure storage account for storing the data in this tutorial. If you don't have an Azure storage account, see the [Create a storage account](../../storage/common/storage-account-create.md) article. After you have created the storage account, you need to obtain the account key used to access the storage. See [Manage storage account access keys](../../storage/common/storage-account-keys-manage.md).
* Access to an **Azure SQL Database**. If you must set up an Azure SQL Database, the topic [Getting Started with Microsoft Azure SQL Database](../../sql-database/sql-database-get-started.md) provides information on how to provision a new instance of an Azure SQL Database.
* Installed and configured **Azure PowerShell** locally. For instructions, see [How to install and configure Azure PowerShell](/powershell/azure/overview).

> [!NOTE]
> This procedure uses the [Azure portal](https://portal.azure.com/).
>
>

## <a name="upload-data"></a> Upload the data to your on-premises SQL Server
We use the [NYC Taxi dataset](https://chriswhong.com/open-data/foil_nyc_taxi/) to demonstrate the migration process. The NYC Taxi dataset is available, as noted in that post, on Azure blob storage [NYC Taxi Data](https://www.andresmh.com/nyctaxitrips/). The data has two files, the trip_data.csv file, which contains trip details, and the  trip_far.csv file, which contains details of the fare paid for each trip. A sample and description of these files are provided in [NYC Taxi Trips Dataset Description](sql-walkthrough.md#dataset).

You can either adapt the procedure provided here to a set of your own data or follow the steps as described by using the NYC Taxi dataset. To upload the NYC Taxi dataset into your on-premises SQL Server database, follow the procedure outlined in [Bulk Import Data into SQL Server Database](sql-walkthrough.md#dbload). These instructions are for a SQL Server on an Azure Virtual Machine, but the procedure for uploading to the on-premises SQL Server is the same.

## <a name="create-adf"></a> Create an Azure Data Factory
The instructions for creating a new Azure Data Factory and a resource group in the [Azure portal](https://portal.azure.com/) are provided [Create an Azure Data Factory](../../data-factory/tutorial-hybrid-copy-portal.md#create-a-data-factory). Name the new ADF instance *adfdsp* and name the resource group created *adfdsprg*.

## Install and configure Azure Data Factory Integration Runtime
The Integration Runtime is a customer managed data integration infrastructure used by Azure Data Factory to provide data integration capabilities across different network environments. This runtime was formerly called "Data Management Gateway".

To set up, [follow the instructions for creating a pipeline](https://docs.microsoft.com/azure/data-factory/tutorial-hybrid-copy-portal#create-a-pipeline)

## <a name="adflinkedservices"></a>Create linked services to connect to the data resources
A linked service defines the information needed for Azure Data Factory to connect to a data resource. We have three resources in this scenario for which linked services are needed:

1. On-premises SQL Server
2. Azure Blob Storage
3. Azure SQL database

The step-by-step procedure for creating linked services is provided in [Create linked services](../../data-factory/tutorial-hybrid-copy-portal.md#create-a-pipeline).


## <a name="adf-tables"></a>Define and create tables to specify how to access the datasets
Create tables that specify the structure, location, and availability of the datasets with the following script-based procedures. JSON files are used to define the tables. For more information on the structure of these files, see [Datasets](../../data-factory/concepts-datasets-linked-services.md).

> [!NOTE]
> You should execute the `Add-AzureAccount` cmdlet before executing the [New-AzureDataFactoryTable](https://msdn.microsoft.com/library/azure/dn835096.aspx) cmdlet to confirm that the right Azure subscription is selected for the command execution. For documentation of this cmdlet, see [Add-AzureAccount](/powershell/module/servicemanagement/azure/add-azureaccount?view=azuresmps-3.7.0).
>
>

The JSON-based definitions in the tables use the following names:

* the **table name** in the on-premises SQL server is *nyctaxi_data*
* the **container name** in the Azure Blob Storage account is *containername*

Three table definitions are needed for this ADF pipeline:

1. [SQL on-premises Table](#adf-table-onprem-sql)
2. [Blob Table](#adf-table-blob-store)
3. [SQL Azure Table](#adf-table-azure-sql)

> [!NOTE]
> These procedures use Azure PowerShell to define and create the ADF activities. But these tasks can also be accomplished using the Azure portal. For details, see [Create datasets](../../data-factory/tutorial-hybrid-copy-portal.md#create-a-pipeline).
>
>

### <a name="adf-table-onprem-sql"></a>SQL on-premises Table
The table definition for the on-premises SQL Server is specified in the following JSON file:

```json
{
    "name": "OnPremSQLTable",
    "properties":
    {
        "location":
        {
            "type": "OnPremisesSqlServerTableLocation",
            "tableName": "nyctaxi_data",
            "linkedServiceName": "adfonpremsql"
        },
        "availability":
        {
            "frequency": "Day",
            "interval": 1,
            "waitOnExternal":
            {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
            }
        }
    }
}
```

The column names were not included here. You can sub-select on the column names by including them here (for details check the [ADF documentation](../../data-factory/copy-activity-overview.md) topic.

Copy the JSON definition of the table into a file called *onpremtabledef.json* file and save it to a known location (here assumed to be *C:\temp\onpremtabledef.json*). Create the table in ADF with the following Azure PowerShell cmdlet:

    New-AzureDataFactoryTable -ResourceGroupName ADFdsprg -DataFactoryName ADFdsp –File C:\temp\onpremtabledef.json


### <a name="adf-table-blob-store"></a>Blob Table
Definition for the table for the output blob location is in the following (this maps the ingested data from on-premises to Azure blob):

```json
{
    "name": "OutputBlobTable",
    "properties":
    {
        "location":
        {
            "type": "AzureBlobLocation",
            "folderPath": "containername",
            "format":
            {
                "type": "TextFormat",
                "columnDelimiter": "\t"
            },
            "linkedServiceName": "adfds"
        },
        "availability":
        {
            "frequency": "Day",
            "interval": 1
        }
    }
}
```

Copy the JSON definition of the table into a file called *bloboutputtabledef.json* file and save it to a known location (here assumed to be *C:\temp\bloboutputtabledef.json*). Create the table in ADF with the following Azure PowerShell cmdlet:

    New-AzureDataFactoryTable -ResourceGroupName adfdsprg -DataFactoryName adfdsp -File C:\temp\bloboutputtabledef.json

### <a name="adf-table-azure-sql"></a>SQL Azure Table
Definition for the table for the SQL Azure output is in the following (this schema maps the data coming from the blob):

```json
{
    "name": "OutputSQLAzureTable",
    "properties":
    {
        "structure":
        [
            { "name": "column1", "type": "String"},
            { "name": "column2", "type": "String"}
        ],
        "location":
        {
            "type": "AzureSqlTableLocation",
            "tableName": "your_db_name",
            "linkedServiceName": "adfdssqlazure_linked_servicename"
        },
        "availability":
        {
            "frequency": "Day",
            "interval": 1
        }
    }
}
```

Copy the JSON definition of the table into a file called *AzureSqlTable.json* file and save it to a known location (here assumed to be *C:\temp\AzureSqlTable.json*). Create the table in ADF with the following Azure PowerShell cmdlet:

    New-AzureDataFactoryTable -ResourceGroupName adfdsprg -DataFactoryName adfdsp -File C:\temp\AzureSqlTable.json


## <a name="adf-pipeline"></a>Define and create the pipeline
Specify the activities that belong to the pipeline and create the pipeline with the following script-based procedures. A JSON file is used to define the pipeline properties.

* The script assumes that the **pipeline name** is *AMLDSProcessPipeline*.
* Also note that we set the periodicity of the pipeline to be executed on daily basis and use the default execution time for the job (12 am UTC).

> [!NOTE]
> The following procedures use Azure PowerShell to define and create the ADF pipeline. But this task can also be accomplished using the
> Azure portal. For details, see [Create pipeline](../../data-factory/tutorial-hybrid-copy-portal.md#create-a-pipeline).
>
>

Using the table definitions provided previously, the pipeline definition for the ADF is specified as follows:

```json
{
    "name": "AMLDSProcessPipeline",
    "properties":
    {
        "description" : "This pipeline has one Copy activity that copies data from an on-premises SQL to Azure blob",
        "activities":
        [
            {
                "name": "CopyFromSQLtoBlob",
                "description": "Copy data from on-premises SQL server to blob",
                "type": "CopyActivity",
                "inputs": [ {"name": "OnPremSQLTable"} ],
                "outputs": [ {"name": "OutputBlobTable"} ],
                "transformation":
                {
                    "source":
                    {
                        "type": "SqlSource",
                        "sqlReaderQuery": "select * from nyctaxi_data"
                    },
                    "sink":
                    {
                        "type": "BlobSink"
                    }
                },
                "Policy":
                {
                    "concurrency": 3,
                    "executionPriorityOrder": "NewestFirst",
                    "style": "StartOfInterval",
                    "retry": 0,
                    "timeout": "01:00:00"
                }
            },
            {
                "name": "CopyFromBlobtoSQLAzure",
                "description": "Push data to Sql Azure",
                "type": "CopyActivity",
                "inputs": [ {"name": "OutputBlobTable"} ],
                "outputs": [ {"name": "OutputSQLAzureTable"} ],
                "transformation":
                {
                    "source":
                    {
                        "type": "BlobSource"
                    },
                    "sink":
                    {
                        "type": "SqlSink",
                        "WriteBatchTimeout": "00:5:00",
                    }
                },
                "Policy":
                {
                    "concurrency": 3,
                    "executionPriorityOrder": "NewestFirst",
                    "style": "StartOfInterval",
                    "retry": 2,
                    "timeout": "02:00:00"
                }
            }
        ]
    }
}
```

Copy this JSON definition of the pipeline into a file called *pipelinedef.json* file and save it to a known location (here assumed to be *C:\temp\pipelinedef.json*). Create the pipeline in ADF with the following Azure PowerShell cmdlet:

    New-AzureDataFactoryPipeline  -ResourceGroupName adfdsprg -DataFactoryName adfdsp -File C:\temp\pipelinedef.json


## <a name="adf-pipeline-start"></a>Start the Pipeline
The pipeline can now be run using the following command:

    Set-AzureDataFactoryPipelineActivePeriod -ResourceGroupName ADFdsprg -DataFactoryName ADFdsp -StartDateTime startdateZ –EndDateTime enddateZ –Name AMLDSProcessPipeline

The *startdate* and *enddate* parameter values need to be replaced with the actual dates between which you want the pipeline to run.

Once the pipeline executes, you should be able to see the data show up in the container selected for the blob, one file per day.

Note that we have not leveraged the functionality provided by ADF to pipe data incrementally. For more information on how to do this and other capabilities provided by ADF, see the [ADF documentation](https://azure.microsoft.com/services/data-factory/).
