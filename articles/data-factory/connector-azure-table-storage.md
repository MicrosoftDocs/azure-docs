---
title: Copy data to and from Azure Table storage
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from supported source stores to Azure Table storage, or from Table storage to supported sink stores, using Azure Data Factory or Synapse Analytics pipelines.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/13/2023
---

# Copy data to and from Azure Table storage using Azure Data Factory or Synapse Analytics

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-azure-table-connector.md)
> * [Current version](connector-azure-table-storage.md)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data to and from Azure Table storage. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of Copy Activity.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Supported capabilities

This Azure Table storage connector is supported for the following capabilities:

| Supported capabilities|IR | Managed private endpoint|
|---------| --------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|✓ <small> Exclude storage account V1|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|✓ <small> Exclude storage account V1|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

You can copy data from any supported source data store to Table storage. You also can copy data from Table storage to any supported sink data store. For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Azure Table connector supports copying data by using account key and service shared access signature authentications.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create an Azure Table storage linked service using UI

Use the following steps to create an Azure Table storage linked service in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Azure Table and select the Azure Table storage connector.

    :::image type="content" source="media/connector-azure-table-storage/azure-table-storage-connector.png" alt-text="Screenshot of the Azure Table storage connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-azure-table-storage/configure-azure-table-storage-linked-service.png" alt-text="Screenshot of configuration for an Azure Table storage linked service.":::

## Connector configuration details

The following sections provide details about properties that are used to define entities specific to Azure Table storage.

## Linked service properties

### Use an account key

You can create an Azure Storage linked service by using the account key. It provides the the service with global access to Storage. The following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **AzureTableStorage**. |Yes |
| connectionString | Specify the information needed to connect to Storage for the connectionString property. <br/>You can also put account key in Azure Key Vault and pull the `accountKey` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. |Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or Self-hosted Integration Runtime (if your data store is located in a private network). If not specified, it uses the default Azure Integration Runtime. |No |

>[!NOTE]
>If you were using "AzureStorage" type linked service, it is still supported as-is, while you are suggested to use this new "AzureTableStorage" linked service type going forward.

**Example:**

```json
{
    "name": "AzureTableStorageLinkedService",
    "properties": {
        "type": "AzureTableStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example: store account key in Azure Key Vault**

```json
{
    "name": "AzureTableStorageLinkedService",
    "properties": {
        "type": "AzureTableStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;",
            "accountKey": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<secretName>" 
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Use shared access signature authentication

You also can create a Storage linked service by using a shared access signature. It provides the service with restricted/time-bound access to all/specific resources in the storage.

A shared access signature provides delegated access to resources in your storage account. You can use it to grant a client limited permissions to objects in your storage account for a specified time and with a specified set of permissions. You don't have to share your account access keys. The shared access signature is a URI that encompasses in its query parameters all the information necessary for authenticated access to a storage resource. To access storage resources with the shared access signature, the client only needs to pass in the shared access signature to the appropriate constructor or method. For more information about shared access signatures, see [Shared access signatures: Understand the shared access signature model](../storage/common/storage-sas-overview.md).

> [!NOTE]
> Both **service shared access signatures** and **account shared access signatures** are now supported. For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../storage/common/storage-sas-overview.md). 

> [!TIP]
> To generate a service shared access signature for your storage account, you can execute the following PowerShell commands. Replace the placeholders and grant the needed permission.
> `$context = New-AzStorageContext -StorageAccountName <accountName> -StorageAccountKey <accountKey>`
> `New-AzStorageContainerSASToken -Name <containerName> -Context $context -Permission rwdl -StartTime <startTime> -ExpiryTime <endTime> -FullUri`

To use shared access signature authentication, the following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **AzureTableStorage**. |Yes |
| sasUri | Specify SAS URI of the shared access signature URI to the table. <br/>Mark this field as a SecureString to store it securely. You can also put SAS token in Azure Key Vault to leverage auto rotation and remove the token portion. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. | Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use the Azure Integration Runtime or the Self-hosted Integration Runtime (if your data store is located in a private network). If not specified, it uses the default Azure Integration Runtime. |No |

>[!NOTE]
>If you were using "AzureStorage" type linked service, it is still supported as-is, while you are suggested to use this new "AzureTableStorage" linked service type going forward.

**Example:**

```json
{
    "name": "AzureTableStorageLinkedService",
    "properties": {
        "type": "AzureTableStorage",
        "typeProperties": {
            "sasUri": {
                "type": "SecureString",
                "value": "<SAS URI of the Azure Storage resource e.g. https://<account>.table.core.windows.net/<table>?sv=<storage version>&amp;st=<start time>&amp;se=<expire time>&amp;sr=<resource>&amp;sp=<permissions>&amp;sip=<ip range>&amp;spr=<protocol>&amp;sig=<signature>>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example: store account key in Azure Key Vault**

```json
{
    "name": "AzureTableStorageLinkedService",
    "properties": {
        "type": "AzureTableStorage",
        "typeProperties": {
            "sasUri": {
                "type": "SecureString",
                "value": "<SAS URI of the Azure Storage resource without token e.g. https://<account>.table.core.windows.net/<table>>"
            },
            "sasToken": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<secretName>" 
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

When you create a shared access signature URI, consider the following points:

- Set appropriate read/write permissions on objects based on how the linked service (read, write, read/write) is used.
- Set **Expiry time** appropriately. Make sure that the access to Storage objects doesn't expire within the active period of the pipeline.
- The URI should be created at the right table level based on the need.

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Azure Table dataset.

To copy data to and from Azure Table, set the type property of the dataset to **AzureTable**. The following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to **AzureTable**. |Yes |
| tableName |The name of the table in the Table storage database instance that the linked service refers to. |Yes |

**Example:**

```json
{
    "name": "AzureTableDataset",
    "properties":
    {
        "type": "AzureTable",
        "typeProperties": {
            "tableName": "MyTable"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Azure Table storage linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

### Schema inference by the service

For schema-free data stores such as Azure Table, the service infers the schema in one of the following ways:

* If you specify the column mapping in copy activity, the service uses the source side column list to retrieve data. In this case, if a row doesn't contain a value for a column, a null value is provided for it.
* If you don't specify the column mapping in copy activity, the service infers the schema by using the first row in the data. In this case, if the first row doesn't contain the full schema (e.g. some columns have null value), some columns are missed in the result of the copy operation.

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Azure Table source and sink.

### Azure Table as a source type

To copy data from Azure Table, set the source type in the copy activity to **AzureTableSource**. The following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **AzureTableSource**. |Yes |
| azureTableSourceQuery |Use the custom Table storage query to read data.<br/>The source query is a direct map from the `$filter` query option supported by Azure Table Storage, learn more about the syntax from [this doc](/rest/api/storageservices/querying-tables-and-entities#supported-query-options), and see the examples in the following [azureTableSourceQuery examples section](#azuretablesourcequery-examples). |No |
| azureTableSourceIgnoreTableNotFound |Indicates whether to allow the exception of the table to not exist.<br/>Allowed values are **True** and **False** (default). |No |

### azureTableSourceQuery examples

>[!NOTE]
>Azure Table query operation times out in 30 seconds as [enforced by Azure Table service](/rest/api/storageservices/setting-timeouts-for-table-service-operations). Learn how to optimize the query from [Design for querying](../storage/tables/table-storage-design-for-query.md) article.

If you want to filter the data against a datetime type column, refer to this example:

```json
"azureTableSourceQuery": "LastModifiedTime gt datetime'2017-10-01T00:00:00' and LastModifiedTime le datetime'2017-10-02T00:00:00'"
```

If you want to filter the data against a string type column, refer to this example:

```json
"azureTableSourceQuery": "LastModifiedTime ge '201710010000_0000' and LastModifiedTime le '201710010000_9999'"
```

If you use the pipeline parameter, cast the datetime value to proper format according to the previous samples.

### Azure Table as a sink type

To copy data to Azure Table, set the sink type in the copy activity to **AzureTableSink**. The following properties are supported in the copy activity **sink** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to **AzureTableSink**. |Yes |
| azureTableDefaultPartitionKeyValue |The default partition key value that can be used by the sink. |No |
| azureTablePartitionKeyName |Specify the name of the column whose values are used as partition keys. If not specified, "AzureTableDefaultPartitionKeyValue" is used as the partition key. |No |
| azureTableRowKeyName |Specify the name of the column whose column values are used as the row key. If not specified, use a GUID for each row. |No |
| azureTableInsertType |The mode to insert data into Azure Table. This property controls whether existing rows in the output table with matching partition and row keys have their values replaced or merged. <br/><br/>Allowed values are **merge** (default) and **replace**. <br/><br> This setting applies at the row level not the table level. Neither option deletes rows in the output table that do not exist in the input. To learn about how the merge and replace settings work, see [Insert or merge entity](/rest/api/storageservices/Insert-Or-Merge-Entity) and [Insert or replace entity](/rest/api/storageservices/Insert-Or-Replace-Entity). |No |
| writeBatchSize |Inserts data into Azure Table when writeBatchSize or writeBatchTimeout is hit.<br/>Allowed values are integer (number of rows). |No (default is 10,000) |
| writeBatchTimeout |Inserts data into Azure Table when writeBatchSize or writeBatchTimeout is hit.<br/>Allowed values are timespan. An example is "00:20:00" (20 minutes). |No (default is 90 seconds, storage client's default timeout) |
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No |

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

Map a source column to a destination column by using the **"translator"** property before you can use the destination column as azureTablePartitionKeyName.

In the following example, source column DivisionID is mapped to the destination column DivisionID:

```json
"translator": {
    "type": "TabularTranslator",
    "columnMappings": "DivisionID: DivisionID, FirstName: FirstName, LastName: LastName"
}
```

"DivisionID" is specified as the partition key.

```json
"sink": {
    "type": "AzureTableSink",
    "azureTablePartitionKeyName": "DivisionID"
}
```

## Data type mapping for Azure Table

When you copy data from and to Azure Table, the following mappings are used from Azure Table data types to interim data types used internally within the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

When you move data to and from Azure Table, the following [mappings defined by Azure Table](/rest/api/storageservices/Understanding-the-Table-Service-Data-Model) are used from Azure Table OData types to .NET type and vice versa.

| Azure Table data type | Interim service data type | Details |
|:--- |:--- |:--- |
| Edm.Binary |byte[] |An array of bytes up to 64 KB. |
| Edm.Boolean |bool |A Boolean value. |
| Edm.DateTime |DateTime |A 64-bit value expressed as Coordinated Universal Time (UTC). The supported DateTime range begins midnight, January 1, 1601 A.D. (C.E.), UTC. The range ends December 31, 9999. |
| Edm.Double |double |A 64-bit floating point value. |
| Edm.Guid |Guid |A 128-bit globally unique identifier. |
| Edm.Int32 |Int32 |A 32-bit integer. |
| Edm.Int64 |Int64 |A 64-bit integer. |
| Edm.String |String |A UTF-16-encoded value. String values can be up to 64 KB. |

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
