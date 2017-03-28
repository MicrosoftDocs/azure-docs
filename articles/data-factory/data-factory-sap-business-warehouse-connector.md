---
title: Move data from SAP Business Warehouse using Azure Data Factory | Microsoft Docs
description: Learn about how to move data from SAP Business Warehouse using Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: 

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/15/2017
ms.author: jingwang

---
# Move data From SAP Business Warehouse using Azure Data Factory
This article outlines how you can use the Copy Activity in an Azure Data Factory pipeline to move data to from SAP Business Warehouse to another data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with copy activity and supported data store combinations. Data factory currently supports only moving data from SAP Business Warehouse to other data stores, but not for moving data from other data stores to SAP Business Warehouse.


## Supported versions and installation
This connector supports SAP Business Warehouse version 7.x. It supports copying data from InfoCubes and QueryCubes (including BEx queries) using MDX queries.

To enable the connectivity to the SAP BW instance, install the following components:
- **Data Management Gateway**: Data Factory service supports connecting to on-premises data stores (including SAP Business Warehouse) using a component called Data Management Gateway. To learn about Data Management Gateway and step-by-step instructions for setting up the gateway, see [Moving data between on-premises data store to cloud data store](data-factory-move-data-between-onprem-and-cloud.md) article. Gateway is required even if the SAP Business Warehouse is hosted in an Azure IaaS virtual machine (VM). You can install the gateway on the same VM as the data store or on a different VM as long as the gateway can connect to the database.
- **SAP NetWeaver library** on the gateway machine. You can get the SAP Netweaver library from your SAP administrator, or directly from the [SAP Software Download Center](https://support.sap.com/swdc). Search for the **SAP Note #1025361** to get the download location for the most recent version. Make sure that the architecture for the SAP NetWeaver library (32-bit or 64-bit) matches your gateway installation. Then install all files included in the SAP NetWeaver RFC SDK according to the SAP Note. The SAP NetWeaver library is also included in the SAP Client Tools installation.

## Supported sinks
See [Supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats) table for a list of data stores supported as sources or sinks by the Copy Activity. You can move data from SAP Business Warehouse to any supported sink data store. 

## Copy data wizard
The easiest way to create a pipeline that copies data from SAP Business Warehouse to any of the supported sink data stores is to use the Copy data wizard. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

The following example provides sample JSON definitions that you can use to create a pipeline by using [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). This sample shows how to copy data from an on-premises SAP Business Warehouse to an Azure Blob Storage. However, data can be copied **directly** to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.  

> [!IMPORTANT]
> This sample provides JSON snippets. It does not include step-by-step instructions for creating the data factory. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions.

## Sample: Copy data from SAP Business Warehouse to Azure Blob
The sample has the following data factory entities:

1. A linked service of type [SapBw](#linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [RelationalTable](#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
5. A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [RelationalSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties).

The sample copies data from an SAP Business Warehouse instance to an Azure blob hourly. The JSON properties used in these samples are described in sections following the samples.

As a first step, setup the data management gateway. The instructions are in the [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article.

### SAP Business Warehouse linked service
This linked service links your SAP BW instance to the data factory. The type property is set to **SapBw**. The typeProperties section provides connection information for the SAP BW instance. 

```json
{
    "name": "SapBwLinkedService",
    "properties":
    {
        "type": "SapBw",
        "typeProperties":
        {
            "server": "<server name>",
            "systemNumber": "<system number>",
            "clientId": "<client id>",
            "username": "<SAP user>",
            "password": "<Password for SAP user>",
            "gatewayName": "<gateway name>"
        }
    }
}
```

### Azure Storage linked service
This linked service links your Azure Storage account to the data factory. The type property is set to **AzureStorage**. The typeProperties section provides connection information for the Azure Storage account.

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

### SAP BW input dataset
This dataset defines the SAP Business Warehouse dataset. You set the type of the Data Factory dataset to **RelationalTable**. Currently, you do not specify any type-specific properties for an SAP BW dataset. The query in the Copy Activity definition specifies what data to read from the SAP BW instance. 

Setting external property to true informs the Data Factory service that the table is external to the data factory and is not produced by an activity in the data factory.

Frequency and interval properties defines the schedule. In this case, the data is read from the SAP BW instance hourly. 

```json
{
    "name": "SapBwDataset",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "SapBwLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```



### Azure Blob output dataset
This dataset defines the output Azure Blob dataset. The type property is set to AzureBlob. The typeProperties section provides where the data copied from the SAP BW instance is stored. The data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

```json
{
    "name": "AzureBlobDataSet",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties": {
            "folderPath": "mycontainer/sapbw/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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


### Pipeline with Copy activity
The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **RelationalSource** (for SAP BW source) and **sink** type is set to **BlobSink**. The query specified for the **query** property selects the data in the past hour to copy.

```json
{
    "name": "CopySapBwToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
        				"query": "<MDX query for SAP BW>"
                    },
                    "sink": {
                        "type": "BlobSink",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "SapBwDataset"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobDataSet"
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
                "name": "SapBwToBlob"
            }
        ],
        "start": "2017-03-01T18:00:00Z",
        "end": "2017-03-01T19:00:00Z"
    }
}
```


## Linked service properties
The following table provides description for JSON elements specific to SAP Business Warehouse (BW) linked service.

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
server | Name of the server on which the SAP BW instance resides. | string | Yes
systemNumber | System number of the SAP BW system. | Two-digit decimal number represented as a string. | Yes
clientId | Client ID of the client in the SAP W system. | Three-digit decimal number represented as a string. | Yes
username | Name of the user who has access to the SAP server | string | Yes
password | Password for the user. | string | Yes
gatewayName | Name of the gateway that the Data Factory service should use to connect to the on-premises SAP BW instance. | string | Yes
encryptedCredential | The encrypted credential string. | string | No

## Dataset properties
For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc.).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. There are no type-specific properties supported for the SAP BW dataset of type **RelationalTable**. 


## Copy activity properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, are policies are available for all types of activities.

Whereas, properties available in the **typeProperties** section of the activity vary with each activity type. For Copy activity, they vary depending on the types of sources and sinks.

When source in copy activity is of type **RelationalSource** (which includes SAP BW), the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query | Specifies the MDX query to read data from the SAP BW instance. | MDX query. | Yes |

### Type mapping for SAP BW
As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article, Copy activity performs automatic type conversions from source types to sink types with the following two-step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data from SAP BW, the following mappings are used from SAP BW types to .NET types.

Data type in the ABAP Dictionary | .Net Data Type
-------------------------------- | --------------
ACCP |	Int
CHAR | String
CLNT | String
CURR | Decimal
CUKY | String
DEC | Decimal
FLTP | Double
INT1 | Byte
INT2 | Int16
INT4 | Int
LANG | String
LCHR | String
LRAW | Byte[]
PREC | Int16
QUAN | Decimal
RAW | Byte[]
RAWSTRING | Byte[]
STRING | String
UNIT | String
DATS | String
NUMC | String
TIMS | String

[!INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]
[!INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]
[!INCLUDE [data-factory-type-repeatability-for-relational-sources](../../includes/data-factory-type-repeatability-for-relational-sources.md)]

## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
