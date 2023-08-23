---
title: Move data from OData sources 
description: Learn about how to move data from OData sources using Azure Data Factory.
author: jianleishen
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: jianleishen
robots: noindex
---
# Move data From an OData source using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-odata-connector.md)
> * [Version 2 (current version)](../connector-odata.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [OData connector in V2](../connector-odata.md).


This article explains how to use the Copy Activity in Azure Data Factory to move data from an OData source. It builds on the [Data Movement Activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with the copy activity.

You can copy data from an OData source to any supported sink data store. For a list of data stores supported as sinks by the copy activity, see the [Supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats) table. Data factory currently supports only moving data from an OData source to other data stores, but not for moving data from other data stores to an OData source.

## Supported versions and authentication types
This OData connector support OData version 3.0 and 4.0, and you can copy data from both cloud OData and on-premises OData sources. For the latter, you need to install the Data Management Gateway. See [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for details about Data Management Gateway.

Below authentication types are supported:

* To access **cloud** OData feed, you can use anonymous, basic (user name and password), or Azure Active Directory based OAuth authentication.
* To access **on-premises** OData feed, you can use anonymous, basic (user name and password), or Windows authentication.

## Getting started
You can create a pipeline with a copy activity that moves data from an OData source by using different tools/APIs.

The easiest way to create a pipeline is to use the **Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

You can also use the following tools to create a pipeline: **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity.

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create **linked services** to link input and output data stores to your data factory.
2. Create **datasets** to represent input and output data for the copy operation.
3. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output.

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools/APIs (except .NET API), you define these Data Factory entities by using the JSON format.  For a sample with JSON definitions for Data Factory entities that are used to copy data from an OData source, see [JSON example: Copy data from OData source to Azure Blob](#json-example-copy-data-from-odata-source-to-azure-blob) section of this article.

The following sections provide details about JSON properties that are used to define Data Factory entities specific to OData source:

## Linked Service properties
The following table provides description for JSON elements specific to OData linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OData** |Yes |
| url |Url of the OData service. |Yes |
| authenticationType |Type of authentication used to connect to the OData source. <br/><br/> For cloud OData, possible values are Anonymous, Basic, and OAuth (note Azure Data Factory currently only support Azure Active Directory based OAuth). <br/><br/> For on-premises OData, possible values are Anonymous, Basic, and Windows. |Yes |
| username |Specify user name if you are using Basic authentication. |Yes (only if you are using Basic authentication) |
| password |Specify password for the user account you specified for the username. |Yes (only if you are using Basic authentication) |
| authorizedCredential |If you are using OAuth, click **Authorize** button in the Data Factory Copy Wizard or Editor and enter your credential, then the value of this property will be auto-generated. |Yes (only if you are using OAuth authentication) |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises OData service. Specify only if you are copying data from on premises OData source. |No |

### Using Basic authentication
```json
{
    "name": "inputLinkedService",
    "properties":
    {
        "type": "OData",
        "typeProperties":
        {
            "url": "https://services.odata.org/OData/OData.svc",
            "authenticationType": "Basic",
            "username": "username",
            "password": "password"
        }
    }
}
```

### Using Anonymous authentication
```json
{
    "name": "ODataLinkedService",
    "properties":
    {
        "type": "OData",
        "typeProperties":
        {
            "url": "https://services.odata.org/OData/OData.svc",
            "authenticationType": "Anonymous"
        }
    }
}
```

### Using Windows authentication accessing on-premises OData source
```json
{
    "name": "inputLinkedService",
    "properties":
    {
        "type": "OData",
        "typeProperties":
        {
            "url": "<endpoint of on-premises OData source e.g. Dynamics CRM>",
            "authenticationType": "Windows",
            "username": "domain\\user",
            "password": "password",
            "gatewayName": "mygateway"
        }
    }
}
```

### Using OAuth authentication accessing cloud OData source
```json
{
    "name": "inputLinkedService",
    "properties":
    {
        "type": "OData",
            "typeProperties":
        {
            "url": "<endpoint of cloud OData source e.g. https://<tenant>.crm.dynamics.com/XRMServices/2011/OrganizationData.svc>",
            "authenticationType": "OAuth",
            "authorizedCredential": "<auto generated by clicking the Authorize button on UI>"
        }
    }
}
```

## Dataset properties
For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc.).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **ODataResource** (which includes OData dataset) has the following properties

| Property | Description | Required |
| --- | --- | --- |
| path |Path to the OData resource |No |

## Copy activity properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policy are available for all types of activities.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type. For Copy activity, they vary depending on the types of sources and sinks.

When source is of type **RelationalSource** (which includes OData) the following properties are available in typeProperties section:

| Property | Description | Example | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |"?$select=Name, Description&$top=5" |No |

## Type Mapping for OData
As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article, Copy activity performs automatic type conversions from source types to sink types with the following two-step approach.

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data from OData, the following mappings are used from OData types to .NET type.

| OData Data Type | .NET Type |
| --- | --- |
| Edm.Binary |Byte[] |
| Edm.Boolean |Bool |
| Edm.Byte |Byte[] |
| Edm.DateTime |DateTime |
| Edm.Decimal |Decimal |
| Edm.Double |Double |
| Edm.Single |Single |
| Edm.Guid |Guid |
| Edm.Int16 |Int16 |
| Edm.Int32 |Int32 |
| Edm.Int64 |Int64 |
| Edm.SByte |Int16 |
| Edm.String |String |
| Edm.Time |TimeSpan |
| Edm.DateTimeOffset |DateTimeOffset |

> [!Note]
> OData complex data types e.g. Object are not supported.

## JSON example: Copy data from OData source to Azure Blob
This example provides sample JSON definitions that you can use to create a pipeline by using [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data from an OData source to an Azure Blob Storage. However, data can be copied to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory. The sample has the following Data Factory entities:

1. A linked service of type [OData](#linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [ODataResource](#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
5. A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [RelationalSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties).

The sample copies data from querying against an OData source to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples.

**OData linked service:**
This example uses the Anonymous authentication. See [OData linked service](#linked-service-properties) section for different types of authentication you can use.

```json
{
    "name": "ODataLinkedService",
    "properties":
    {
        "type": "OData",
        "typeProperties":
        {
            "url": "https://services.odata.org/OData/OData.svc",
            "authenticationType": "Anonymous"
        }
    }
}
```

**Azure Storage linked service:**

```json
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
        }
    }
}
```

**OData input dataset:**

Setting "external": "true" informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

```json
{
    "name": "ODataDataset",
    "properties":
    {
        "type": "ODataResource",
        "typeProperties":
        {
            "path": "Products"
        },
        "linkedServiceName": "ODataLinkedService",
        "structure": [],
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "retryInterval": "00:01:00",
            "retryTimeout": "00:10:00",
            "maximumRetry": 3
        }
    }
}
```

Specifying **path** in the dataset definition is optional.

**Azure Blob output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

```json
{
    "name": "AzureBlobODataDataSet",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties": {
            "folderPath": "mycontainer/odata/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
            "format": {
                "type": "TextFormat",
                "rowDelimiter": "\n",
                "columnDelimiter": "\t"
            },
            "partitionedBy": [
                {
                    "name": "Year",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "yyyy"
                    }
                },
                {
                    "name": "Month",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "MM"
                    }
                },
                {
                    "name": "Day",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "dd"
                    }
                },
                {
                    "name": "Hour",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "HH"
                    }
                }
            ]
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

**Copy activity in a pipeline with OData source and Blob sink:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **RelationalSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **query** property selects the latest (newest) data from the OData source.

```json
{
    "name": "CopyODataToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
                        "query": "?$select=Name, Description&$top=5",
                    },
                    "sink": {
                        "type": "BlobSink",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "ODataDataSet"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobODataDataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "ODataToBlob"
            }
        ],
        "start": "2017-02-01T18:00:00Z",
        "end": "2017-02-03T19:00:00Z"
    }
}
```

Specifying **query** in the pipeline definition is optional. The **URL** that the Data Factory service uses to retrieve data is: URL specified in the linked service (required) + path specified in the dataset (optional) + query in the pipeline (optional).

### Type mapping for OData
As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article, Copy activity performs automatic type conversions from source types to sink types with the following 2-step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data from OData data stores, OData data types are mapped to .NET types.

## Map source to sink columns
To learn about mapping columns in source dataset to columns in sink dataset, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Repeatable read from relational sources
When copying data from relational data stores, keep repeatability in mind to avoid unintended outcomes. In Azure Data Factory, you can rerun a slice manually. You can also configure retry policy for a dataset so that a slice is rerun when a failure occurs. When a slice is rerun in either way, you need to make sure that the same data is read no matter how many times a slice is run. See [Repeatable read from relational sources](data-factory-repeatable-copy.md#repeatable-read-from-relational-sources).

## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
