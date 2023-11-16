---
title: Copy data from Azure Database for MariaDB
description: Learn how to copy data from Azure Database for MariaDB to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/13/2023
---

# Copy data from Azure Database for MariaDB using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Azure Database for MariaDB. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

This Azure Database for MariaDB connector is supported for the following capabilities:

| Supported capabilities|IR | Managed private endpoint|
|---------| --------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|✓ |
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|✓ |

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*
 
You can copy data from Azure Database for MariaDB to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Azure Database for MariaDB using UI

Use the following steps to create a linked service to Azure Database for MariaDB in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Maria and select the Azure Database for MariaDB connector.

   :::image type="content" source="media/connector-azure-database-for-mariadb/azure-database-for-mariadb-connector.png" alt-text="Screenshot of the Azure Database for MariaDB connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-azure-database-for-mariadb/configure-azure-database-for-mariadb-linked-service.png" alt-text="Screenshot of linked service configuration for Azure Database for MariaDB.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Azure Database for MariaDB connector.

## Linked service properties

The following properties are supported for Azure Database for MariaDB linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureMariaDB** | Yes |
| connectionString | A connection string to connect to Azure Database for MariaDB. You can find it from the Azure portal -> your Azure Database for MariaDB -> Connection strings -> ADO.NET one. <br/> You can also put password in Azure Key Vault and pull the `pwd` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. If not specified, it uses the default Azure Integration Runtime. |No |

**Example:**

```json
{
    "name": "AzureDatabaseForMariaDBLinkedService",
    "properties": {
        "type": "AzureMariaDB",
        "typeProperties": {
            "connectionString": "Server={your_server}.mariadb.database.azure.com; Port=3306; Database={your_database}; Uid={your_user}@{your_server}; Pwd={your_password}; SslMode=Preferred;"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example: store password in Azure Key Vault**

```json
{
    "name": "AzureDatabaseForMariaDBLinkedService",
    "properties": {
        "type": "AzureMariaDB",
        "typeProperties": {
            "connectionString": "Server={your_server}.mariadb.database.azure.com; Port=3306; Database={your_database}; Uid={your_user}@{your_server}; SslMode=Preferred;",
            "pwd": { 
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

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Azure Database for MariaDB dataset.

To copy data from Azure Database for MariaDB, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **AzureMariaDBTable** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "AzureDatabaseForMariaDBDataset",
    "properties": {
        "type": "AzureMariaDBTable",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Azure Database for MariaDB linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Azure Database for MariaDB source.

### Azure Database for MariaDB as source

To copy data from Azure Database for MariaDB, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **AzureMariaDBSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromAzureDatabaseForMariaDB",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Azure Database for MariaDB input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "AzureMariaDBSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```
## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
