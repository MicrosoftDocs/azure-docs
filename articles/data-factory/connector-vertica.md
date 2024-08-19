---
title: Copy data from Vertica
description: Learn how to copy data from Vertica to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 08/12/2024
ms.author: jianleishen
---
# Copy data from Vertica using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Vertica. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

This Vertica connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; (only for the legacy driver version) &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; (only for the legacy driver version) &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

To use the Vertica connector with the recommended driver version, install the Vertica ODBC driver on the machine running the self-hosted Integration runtime by following these steps:

1. Download the Vertica client setup for ODBC driver from [Client Drivers | OpenText™ Vertica™](https://www.vertica.com/download/vertica/client-drivers/). Take Windows system setup as an example:

   :::image type="content" source="media/connector-vertica/download.png" alt-text="Screenshot of a Windows system setup example.":::  

1. Open the downloaded .exe to begin the installation process. 

   :::image type="content" source="media/connector-vertica/install.png" alt-text="Screenshot of the installation process.":::

1. Select **ODBC driver** under Vertica Component List, then select **Next** to start the installation.

   :::image type="content" source="media/connector-vertica/select-odbc-driver.png" alt-text="Screenshot of selecting ODBC driver.":::

1. After the installation process is successfully completed, you can go to  Start -> ODBC Data Source Administrator to confirm the successful installation.

   :::image type="content" source="media/connector-vertica/confirm-the successful-installation.png" alt-text="Screenshot of confirming the successful installation.":::

## Getting started

You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

## Create a linked service to Vertica using UI

Use the following steps to create a linked service to Vertica in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Vertica and select the Vertica connector.

   :::image type="content" source="media/connector-vertica/vertica-connector.png" alt-text="Screenshot of the Vertica connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-vertica/configure-vertica-linked-service.png" alt-text="Screenshot of linked service configuration for Vertica.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Vertica connector.

## Linked service properties

If you use the recommended driver version, the following properties are supported for Vertica linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Vertica** | Yes |
| server | The name or the IP address of the server to which you want to connect. | Yes |
| port | The port number of the server listener. | No, default is 5433 |
| database | Name of the Vertica database. | Yes |
| uid | The user ID that is used to connect to the database.  | Yes |
| pwd | The password that the application uses to connect to the database. | Yes |
| version | The version when you select the recommended driver version. The value is `2.0`. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. You can only use the self-hosted integration runtime and its version should be 5.44.8969.2 or above. |No |

**Example:**

```json
{
    "name": "VerticaLinkedService",
    "properties": {
        "type": "Vertica",
        "version": "2.0",
        "typeProperties": {
            "Server": "<server>",
            "port": 5433,
            "uid": "<username>",
            "database": "<database>",
            "pwd": {
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

**Example: store password in Azure Key Vault**

```json
{
    "name": "VerticaLinkedService",
    "properties": {
        "type": "Vertica",
        "version": "2.0",
        "typeProperties": {
            "Server": "<server>",
            "port": 5433,
            "uid": "<username>",
            "database": "<database>",
            "pwd": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<secretName>" 
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

If you use the legacy driver version, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Vertica** | Yes |
| connectionString | An ODBC connection string to connect to Vertica.<br/>You can also put password in Azure Key Vault and pull the `pwd` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

**Example:**

```json
{
    "name": "VerticaLinkedService",
    "properties": {
        "type": "Vertica",
        "typeProperties": {
            "connectionString": "Server=<server>;Port=<port>;Database=<database>;UID=<user name>;PWD=<password>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Vertica dataset.

To copy data from Vertica, set the type property of the dataset to **VerticaTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **VerticaTable** | Yes |
| schema | Name of the schema. |No (if "query" in activity source is specified)  |
| table | Name of the table. |No (if "query" in activity source is specified)  |

**Example**

```json
{
    "name": "VerticaDataset",
    "properties": {
        "type": "VerticaTable",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Vertica linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Vertica source.

### Vertica as source

To copy data from Vertica, set the source type in the copy activity to **VerticaSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **VerticaSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "schema+table" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromVertica",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Vertica input dataset name>",
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
                "type": "VerticaSource",
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

## Upgrade the Vertica driver version 

Here are steps that help you upgrade your Vertica driver version: 

1. Install a Vertica driver by following the steps in [Prerequisite](#prerequisites). 
1. In **Edit linked service page**, select **Recommended** under **Driver version** and configure the linked service by referring to [Linked service properties](#linked-service-properties). 
1. Apply a self-hosted integration runtime with version 5.44.8969.2 or above. Azure integration runtime is not supported by the recommended driver version. 

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
