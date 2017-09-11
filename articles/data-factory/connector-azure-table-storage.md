---
title: Copy data to/from Azure Table Storage using Data Factory | Microsoft Docs
description: Learn how to copy data from supported source stores to Azure Table Storage (or) from Table Storage to supported sink stores by using Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/30/2017
ms.author: jingwang

---
# Copy data to or from Azure Table using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-azure-table-connector.md)
> * [Version 2 - Preview](connector-azure-table-storage.md)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data to and from Azure Table. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Azure Table Storage connector in V1](v1/data-factory-azure-table-connector.md).

## Supported scenarios

You can copy data from any supported source data store to Azure Table, or copy data from Azure Table to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Azure Table connector supports copying data using both **account key** and **Service SAS** (Shared Access Signature) authentications.

## Get started
You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to Azure Table Storage.

## Linked service properties

### Using account key

You can create an Azure Storage linked service by using the account key, which provides the data factory with global access to the Azure Storage. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureStorage** |Yes |
| connectionString | Specify information needed to connect to Azure storage for the connectionString property. Mark this field as SecureString. |Yes |

**Example:**

```json
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
        }
    }
}
```

### Using Service SAS authentication

You can also create an Azure Storage linked service by using a Shared Access Signature (SAS), which provides the data factory with restricted/time-bound access to all/specific resources in the storage.

A Shared Access Signature (SAS) provides delegated access to resources in your storage account. It allows you to grant a client limited permissions to objects in your storage account for a specified period of time and with a specified set of permissions, without having to share your account access keys. The SAS is a URI that encompasses in its query parameters all the information necessary for authenticated access to a storage resource. To access storage resources with the SAS, the client only needs to pass in the SAS to the appropriate constructor or method. For detailed information about SAS, see [Shared Access Signatures: Understanding the SAS Model](../storage/common/storage-dotnet-shared-access-signature-part-1.md)

> [!IMPORTANT]
> Azure Data Factory now only supports **Service SAS** but not Account SAS. See [Types of Shared Access Signatures](../storage/common/storage-dotnet-shared-access-signature-part-1.md#types-of-shared-access-signatures) for details about these two types and how to construct. The SAS URL generable from Azure portal or Storage Explorer is an Account SAS, which is not supported.
>

To use Service SAS authentication, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureStorage** |Yes |
| sasUri | Specify Shared Access Signature URI to the Azure Storage resources such as blob, container, or table. Mark this field as SecureString. |Yes |

**Example:**

```json
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "sasUri": {
                "type": "SecureString",
                "value": "<SAS URI of the Azure Storage resource>"
            }
        }
    }
}
```

When creating an **SAS URI**, considering the following points:

- Set appropriate read/write **permissions** on objects based on how the linked service (read, write, read/write) is used in your data factory.
- Set **Expiry time** appropriately. Make sure that the access to Azure Storage objects does not expire within the active period of the pipeline.
- Uri should be created at the right table level based on the need.

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Azure Table dataset.

To copy data to/from Azure Table, set the type property of the dataset to **AzureTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **AzureTable** |Yes |
| tableName |Name of the table in the Azure Table Database instance that linked service refers to. |Yes |

**Example:**

```json
{
    "name": "AzureTableDataset",
    "properties":
    {
        "type": "AzureTable",
        "linkedServiceName": {
            "referenceName": "<Azure Storage linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "MyTable"
        }
    }
}
```

### Schema by Data Factory

For schema-free data stores such as Azure Table, the Data Factory service infers the schema in one of the following ways:

1. If you specify the structure of data by using the **structure** property in the dataset definition, the Data Factory service honors this structure as the schema. In this case, if a row does not contain a value for a column, a null value is provided for it.
2. If you don't specify the structure of data by using the **structure** property in the dataset definition, Data Factory infers the schema by using the first row in the data. In this case, if the first row does not contain the full schema, some columns are missed in the result of copy operation.

Therefore, for schema-free data sources, the best practice is to specify the structure of data using the **structure** property.

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Azure Table source and sink.

### Azure Table as source

To copy data from Azure Table, set the source type in the copy activity to **AzureTableSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **AzureTableSource** |Yes |
| azureTableSourceQuery |Use the custom Azure table query to read data. See examples in the next section. |No |
| azureTableSourceIgnoreTableNotFound |Indicate whether swallow the exception of table not exist.<br/>Allowed values are: **True**, and **False** (default). |No |

### azureTableSourceQuery examples

If Azure Table column is of string type:

```json
"azureTableSourceQuery": "$$Text.Format('PartitionKey ge \\'{0:yyyyMMddHH00_0000}\\' and PartitionKey le \\'{0:yyyyMMddHH00_9999}\\'', <datetime parameter>)"
```

If Azure Table column is of datetime type:

```json
"azureTableSourceQuery": "$$Text.Format('DeploymentEndTime gt datetime\\'{0:yyyy-MM-ddTHH:mm:ssZ}\\' and DeploymentEndTime le datetime\\'{1:yyyy-MM-ddTHH:mm:ssZ}\\'', <datetime parameter>, <datetime parameter>)"
```

### Azure Table as sink

To copy data from Azure Table, set the source type in the copy activity to **AzureTableSink**. The following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **AzureTableSink** |Yes |
| azureTableDefaultPartitionKeyValue |Default partition key value that can be used by the sink. |No |
| azureTablePartitionKeyName |Specify name of the column whose values are used as partition keys. If not specified, "AzureTableDefaultPartitionKeyValue" is used as the partition key. |No |
| azureTableRowKeyName |Specify name of the column whose column values are used as row key. If not specified, use a GUID for each row. |No |
| azureTableInsertType |The mode to insert data into Azure table. This property controls whether existing rows in the output table with matching partition and row keys have their values replaced or merged. <br/><br/>Allowed values are: **merge** (default), and **replace**. <br/><br> This setting applies at the row level, not the table level, and neither option deletes rows in the output table that do not exist in the input. To learn about how these settings (merge and replace) work, see [Insert or Merge Entity](https://msdn.microsoft.com/library/azure/hh452241.aspx) and [Insert or Replace Entity](https://msdn.microsoft.com/library/azure/hh452242.aspx) topics. |No |
| writeBatchSize |Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit.<br/>Allowed values are: integer (number of rows) |No (default is 10000) |
| writeBatchTimeout |Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit.<br/>Allowed values are: timespan. Example: "00:20:00" (20 minutes) |No (Default is 90 sec - storage client's default timeout) |

**Example:**

```json
"activities":[
    {
        "name": "CopyToAzureTable",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Azure Table output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "AzureTableSink",
                "azureTablePartitionKeyName": "<column name>",
                "azureTableRowKeyName": "<column name>"
            }
        }
    }
]
```

### azureTablePartitionKeyName

Map a source column to a destination column using the "translator" property before you can use the destination column as the azureTablePartitionKeyName.

In the following example, source column DivisionID is mapped to the destination column DivisionID.

```json
"translator": {
    "type": "TabularTranslator",
    "columnMappings": "DivisionID: DivisionID, FirstName: FirstName, LastName: LastName"
}
```

The "DivisionID" is specified as the partition key.

```json
"sink": {
    "type": "AzureTableSink",
    "azureTablePartitionKeyName": "DivisionID"
}
```

## Data type mapping for Azure Table

When copying data from/to Azure Table, the following mappings are used from Azure Table data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

When moving data to & from Azure Table, the following [mappings defined by Azure Table service](https://msdn.microsoft.com/library/azure/dd179338.aspx) are used from Azure Table OData types to .NET type and vice versa.

| Azure Table data type | Data factory interim data type | Details |
|:--- |:--- |:--- |
| Edm.Binary |byte[] |An array of bytes up to 64 KB. |
| Edm.Boolean |bool |A Boolean value. |
| Edm.DateTime |DateTime |A 64-bit value expressed as Coordinated Universal Time (UTC). The supported DateTime range begins from 12:00 midnight, January 1, 1601 A.D. (C.E.), UTC. The range ends at December 31, 9999. |
| Edm.Double |double |A 64-bit floating point value. |
| Edm.Guid |Guid |A 128-bit globally unique identifier. |
| Edm.Int32 |Int32 |A 32-bit integer. |
| Edm.Int64 |Int64 |A 64-bit integer. |
| Edm.String |String |A UTF-16-encoded value. String values may be up to 64 KB. |

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).