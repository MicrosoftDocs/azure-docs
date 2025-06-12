---
title: Copy data from Amazon Redshift
description: Learn how to copy data from Amazon Redshift to supported sink data stores using Azure Data Factory or Synapse Analytics pipelines.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 05/28/2025
---

# Copy data from Amazon Redshift using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from an Amazon Redshift. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> The Amazon Redshift version 2.0 (Preview) provides improved native Amazon Redshift support. If you are using the Amazon Redshift version 1.0 in your solution, you are recommended to [upgrade your Amazon Redshift connector](#upgrade-the-amazon-redshift-connector) at your earliest convenience. Refer to this [section](#differences-between-amazon-redshift-connector-version-20-and-version-10) for details on the difference between version 2.0 (Preview) and version 1.0.

## Supported capabilities

This Amazon Redshift connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; (only for version 1.0) &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; (only for version 1.0) &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

For version 2.0 (Preview), you need to [install the Amazon Redshift ODBC driver](https://docs.aws.amazon.com/redshift/latest/mgmt/odbc20-install-win.html) manually. For version 1.0, the service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver. 

The Amazon Redshift connector supports retrieving data from Redshift using query or built-in Redshift UNLOAD support.

The connector supports the Windows versions in this [article](create-self-hosted-integration-runtime.md#prerequisites).

> [!TIP]
> To achieve the best performance when copying large amounts of data from Redshift, consider using the built-in Redshift UNLOAD through Amazon S3. See [Use UNLOAD to copy data from Amazon Redshift](#use-unload-to-copy-data-from-amazon-redshift) section for details.

## Prerequisites

* If you are copying data to an on-premises data store using [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md), grant Integration Runtime (use IP address of the machine) the access to Amazon Redshift cluster. See [Authorize access to the cluster](https://docs.aws.amazon.com/redshift/latest/gsg/rs-gsg-authorize-cluster-access.html) for instructions. If you use the version 2.0, your self-hosted integration runtime version should be 5.54.0.0 or above.
* If you are copying data to an Azure data store, see [Azure Data Center IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653) for the Compute IP address and SQL ranges used by the Azure data centers.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Amazon Redshift using UI

Use the following steps to create a linked service to Amazon Redshift in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for Amazon and select the Amazon Redshift connector.

    :::image type="content" source="media/connector-amazon-redshift/amazon-redshift-connector.png" alt-text="Select the Amazon Redshift connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-amazon-redshift/configure-amazon-redshift-linked-service.png" alt-text="Configure a linked service to Amazon Redshift.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Amazon Redshift connector.

## Linked service properties

The following properties are supported for Amazon Redshift linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AmazonRedshift** | Yes |
| version | The version that you specify.  | Yes for version 2.0 (Preview). |
| server |IP address or host name of the Amazon Redshift server. |Yes |
| port |The number of the TCP port that the Amazon Redshift server uses to listen for client connections. |No, default is 5439 |
| database |Name of the Amazon Redshift database. |Yes |
| username |Name of user who has access to the database. |Yes |
| password |Password for the user account. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. <br>If you select version 2.0 (Preview), you can only use the self-hosted integration runtime and its version should be 5.54.0.0 or above.<br>If you select version 1.0, you can use Azure Integration Runtime or Self-hosted Integration Runtime (if your data store is located in private network). If not specified, it uses the default Azure Integration Runtime. |No |

**Example: version 2.0 (Preview)**

```json
{
    "name": "AmazonRedshiftLinkedService",
    "properties":
    {
        "type": "AmazonRedshift",
        "version": "2.0",
        "typeProperties":
        {
            "server": "<server name>",
            "database": "<database name>",
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example: version 1.0**

```json
{
    "name": "AmazonRedshiftLinkedService",
    "properties":
    {
        "type": "AmazonRedshift",
        "typeProperties":
        {
            "server": "<server name>",
            "database": "<database name>",
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Amazon Redshift dataset.

To copy data from Amazon Redshift, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **AmazonRedshiftTable** | Yes |
| schema | Name of the schema. |No (if "query" in activity source is specified)  |
| table | Name of the table. |No (if "query" in activity source is specified)  |
| tableName | Name of the table with schema. This property is supported for backward compatibility. Use `schema` and `table` for new workload. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "AmazonRedshiftDataset",
    "properties":
    {
        "type": "AmazonRedshiftTable",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Amazon Redshift linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

If you were using `RelationalTable` typed dataset, it is still supported as-is, while you are suggested to use the new one going forward.

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Amazon Redshift source.

### Amazon Redshift as source

To copy data from Amazon Redshift, set the source type in the copy activity to **AmazonRedshiftSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **AmazonRedshiftSource** | Yes |
| query |Use the custom query to read data. For example: select * from MyTable. |No (if "tableName" in dataset is specified) |
| redshiftUnloadSettings | Property group when using Amazon Redshift UNLOAD. | No |
| s3LinkedServiceName | Refers to an Amazon S3 to-be-used as an interim store by specifying a linked service name of "AmazonS3" type. | Yes if using UNLOAD |
| bucketName | Indicate the S3 bucket to store the interim data. If not provided, the service generates it automatically.  | Yes if using UNLOAD |

**Example: Amazon Redshift source in copy activity using UNLOAD**

```json
"source": {
    "type": "AmazonRedshiftSource",
    "query": "<SQL query>",
    "redshiftUnloadSettings": {
        "s3LinkedServiceName": {
            "referenceName": "<Amazon S3 linked service>",
            "type": "LinkedServiceReference"
        },
        "bucketName": "bucketForUnload"
    }
}
```

Learn more on how to use UNLOAD to copy data from Amazon Redshift efficiently from next section.

## Use UNLOAD to copy data from Amazon Redshift

[UNLOAD](https://docs.aws.amazon.com/redshift/latest/dg/r_UNLOAD.html) is a mechanism provided by Amazon Redshift, which can unload the results of a query to one or more files on Amazon Simple Storage Service (Amazon S3). It is the way recommended by Amazon for copying large data set from Redshift.

**Example: copy data from Amazon Redshift to Azure Synapse Analytics using UNLOAD, staged copy and PolyBase**

For this sample use case, copy activity unloads data from Amazon Redshift to Amazon S3 as configured in "redshiftUnloadSettings", and then copy data from Amazon S3 to Azure Blob as specified in "stagingSettings", lastly use PolyBase to load data into Azure Synapse Analytics. All the interim format is handled by copy activity properly.

:::image type="content" source="media/copy-data-from-amazon-redshift/redshift-to-sql-dw-copy-workflow.png" alt-text="Redshift to Azure Synapse Analytics copy workflow":::

```json
"activities":[
    {
        "name": "CopyFromAmazonRedshiftToSQLDW",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "AmazonRedshiftDataset",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "AzureSQLDWDataset",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "AmazonRedshiftSource",
                "query": "select * from MyTable",
                "redshiftUnloadSettings": {
                    "s3LinkedServiceName": {
                        "referenceName": "AmazonS3LinkedService",
                        "type": "LinkedServiceReference"
                    },
                    "bucketName": "bucketForUnload"
                }
            },
            "sink": {
                "type": "SqlDWSink",
                "allowPolyBase": true
            },
            "enableStaging": true,
            "stagingSettings": {
                "linkedServiceName": "AzureStorageLinkedService",
                "path": "adfstagingcopydata"
            },
            "dataIntegrationUnits": 32
        }
    }
]
```

## Data type mapping for Amazon Redshift

When you copy data from Amazon Redshift, the following mappings apply from Amazon Redshift's data types to the internal data types used by the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Amazon Redshift data type | Interim service data type (for version 2.0 (Preview)) | Interim service data type (for version 1.0) |
|:--- |:--- |:--- |
| BIGINT |Int64 |Int64 |
| BOOLEAN |Boolean |String |
| CHAR |String |String |
| DATE |DateTime |DateTime |
| DECIMAL |String |Decimal |
| DOUBLE PRECISION |Double |Double |
| INTEGER |Int32 |Int32 |
| REAL |Single |Single |
| SMALLINT |Int16 |Int16 |
| TEXT |String |String |
| TIMESTAMP |DateTime |DateTime |
| VARCHAR |String |String |

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Upgrade the Amazon Redshift connector

Here are steps that help you upgrade the Amazon Redshift connector:

1. In **Edit linked service** page, select version 2.0 (Preview) and configure the linked service by referring to [linked service properties](#linked-service-properties).

2. The data type mapping for the Amazon Redshift linked service version 2.0 (Preview) is different from that for the version 1.0. To learn the latest data type mapping, see [Data type mapping for Amazon Redshift](#data-type-mapping-for-amazon-redshift).

3. Apply a self-hosted integration runtime with version 5.54.0.0 or above. Azure integration runtime is not supported by version 2.0 (Preview).

## <a name="differences-between-amazon-redshift-connector-version-20-and-version-10"></a>Differences between Amazon Redshift connector version 2.0 (Preview) and version 1.0

The Amazon Redshift connector version 2.0 (Preview) offers new functionalities and is compatible with most features of version 1.0. The following table shows the feature differences between version 2.0 (Preview) and version 1.0.

| Version 2.0 (Preview) | Version 1.0 |
| :----------- | :------- |
| Only support the self-hosted integration runtime with version 5.54.0.0 or above. | Support the Azure integration runtime and self-hosted integration runtime. |
| The following mappings are used from Amazon Redshift data types to interim service data type.<br><br>BOOLEAN -> Boolean <br>DECIMAL -> String| The following mappings are used from Amazon Redshift data types to interim service data type.<br><br>BOOLEAN -> String <br>DECIMAL -> Decimal|  

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
