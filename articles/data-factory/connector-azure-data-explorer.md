---
title: Copy data to or from Azure Data Explorer
description: Learn how to copy data to or from Azure Data Explorer by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
ms.author: orspodek
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.devlang: na
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 02/18/2020
---

# Copy data to or from Azure Data Explorer by using Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how to use the copy activity in Azure Data Factory to copy data to or from [Azure Data Explorer](/azure/data-explorer/data-explorer-overview). It builds on the [copy activity overview](copy-activity-overview.md) article, which offers a general overview of copy activity.

>[!TIP]
>For Azure Data Factory and Azure Data Explorer integration in general, learn more from [Integrate Azure Data Explorer with Azure Data Factory](/azure/data-explorer/data-factory-integration).

## Supported capabilities

This Azure Data Explorer connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source/sink matrix](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)

You can copy data from any supported source data store to Azure Data Explorer. You can also copy data from Azure Data Explorer to any supported sink data store. For a list of data stores that the copy activity supports as sources or sinks, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

>[!NOTE]
>Copying data to or from Azure Data Explorer through an on-premises data store by using self-hosted integration runtime is supported in version 3.14 and later.

With the Azure Data Explorer connector, you can do the following:

* Copy data by using Azure Active Directory (Azure AD) application token authentication with a **service principal**.
* As a source, retrieve data by using a KQL (Kusto) query.
* As a sink, append data to a destination table.

## Getting started

>[!TIP]
>For a walkthrough of Azure Data Explorer connector, see [Copy data to/from Azure Data Explorer using Azure Data Factory](/azure/data-explorer/data-factory-load-data) and [Bulk copy from a database to Azure Data Explorer](/azure/data-explorer/data-factory-template).

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Azure Data Explorer connector.

## Linked service properties

The Azure Data Explorer connector uses service principal authentication. Follow these steps to get a service principal and to grant permissions:

1. Register an application entity in Azure Active Directory by following the steps in [Register your application with an Azure AD tenant](../storage/common/storage-auth-aad-app.md#register-your-application-with-an-azure-ad-tenant). Make note of the following values, which you use to define the linked service:

    - Application ID
    - Application key
    - Tenant ID

2. Grant the service principal the correct permissions in Azure Data Explorer. See [Manage Azure Data Explorer database permissions](/azure/data-explorer/manage-database-permissions) for detailed information about roles and permissions and about managing permissions. In general, you must:

    - **As source**, grant at least the **Database viewer** role to your database
    - **As sink**, grant at least the **Database ingestor** role to your database

>[!NOTE]
>When you use the Data Factory UI to author, your login user account is used to list Azure Data Explorer clusters, databases, and tables. Manually enter the name if you don't have permission for these operations.

The following properties are supported for the Azure Data Explorer linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **AzureDataExplorer**. | Yes |
| endpoint | Endpoint URL of the Azure Data Explorer cluster, with the format as `https://<clusterName>.<regionName>.kusto.windows.net`. | Yes |
| database | Name of database. | Yes |
| tenant | Specify the tenant information (domain name or tenant ID) under which your application resides. This is known as "Authority ID" in [Kusto connection string](https://docs.microsoft.com/azure/kusto/api/connection-strings/kusto#application-authentication-properties). Retrieve it by hovering the mouse pointer in the upper-right corner of the Azure portal. | Yes |
| servicePrincipalId | Specify the application's client ID. This is known as "AAD application client ID" in [Kusto connection string](https://docs.microsoft.com/azure/kusto/api/connection-strings/kusto#application-authentication-properties). | Yes |
| servicePrincipalKey | Specify the application's key. This is known as "AAD application key" in [Kusto connection string](https://docs.microsoft.com/azure/kusto/api/connection-strings/kusto#application-authentication-properties). Mark this field as a **SecureString** to store it securely in Data Factory, or [reference secure data stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |

**Linked service properties example:**

```json
{
    "name": "AzureDataExplorerLinkedService",
    "properties": {
        "type": "AzureDataExplorer",
        "typeProperties": {
            "endpoint": "https://<clusterName>.<regionName>.kusto.windows.net ",
            "database": "<database name>",
            "tenant": "<tenant name/id e.g. microsoft.onmicrosoft.com>",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": {
                "type": "SecureString",
                "value": "<service principal key>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see [Datasets in Azure Data Factory](concepts-datasets-linked-services.md). This section lists properties that the Azure Data Explorer dataset supports.

To copy data to Azure Data Explorer, set the type property of the dataset to **AzureDataExplorerTable**.

The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **AzureDataExplorerTable**. | Yes |
| table | The name of the table that the linked service refers to. | Yes for sink; No for source |

**Dataset properties example:**

```json
{
   "name": "AzureDataExplorerDataset",
    "properties": {
        "type": "AzureDataExplorerTable",
        "typeProperties": {
            "table": "<table name>"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Azure Data Explorer linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see [Pipelines and activities in Azure Data Factory](concepts-pipelines-activities.md). This section provides a list of properties that Azure Data Explorer sources and sinks support.

### Azure Data Explorer as source

To copy data from Azure Data Explorer, set the **type** property in the Copy activity source to **AzureDataExplorerSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the copy activity source must be set to: **AzureDataExplorerSource** | Yes |
| query | A read-only request given in a [KQL format](/azure/kusto/query/). Use the custom KQL query as a reference. | Yes |
| queryTimeout | The wait time before the query request times out. Default value is 10 min (00:10:00); allowed max value is 1 hour (01:00:00). | No |
| noTruncation | Indicates whether to truncate the returned result set. By default, result is truncated after 500,000 records or 64 megabytes (MB). Truncation is strongly recommended to ensure the correct behavior of the activity. |No |

>[!NOTE]
>By default, Azure Data Explorer source has a size limit of 500,000 records or 64 MB. To retrieve all the records without truncation, you can specify `set notruncation;` at the beginning of your query. For more information, see [Query limits](https://docs.microsoft.com/azure/kusto/concepts/querylimits).

**Example:**

```json
"activities":[
    {
        "name": "CopyFromAzureDataExplorer",
        "type": "Copy",
        "typeProperties": {
            "source": {
                "type": "AzureDataExplorerSource",
                "query": "TestTable1 | take 10",
                "queryTimeout": "00:10:00"
            },
            "sink": {
                "type": "<sink type>"
            }
        },
        "inputs": [
            {
                "referenceName": "<Azure Data Explorer input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<output dataset name>",
                "type": "DatasetReference"
            }
        ]
    }
]
```

### Azure Data Explorer as sink

To copy data to Azure Data Explorer, set the type property in the copy activity sink to **AzureDataExplorerSink**. The following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the copy activity sink must be set to: **AzureDataExplorerSink**. | Yes |
| ingestionMappingName | Name of a pre-created [mapping](/azure/kusto/management/mappings#csv-mapping) on a Kusto table. To map the columns from source to Azure Data Explorer (which applies to [all supported source stores and formats](copy-activity-overview.md#supported-data-stores-and-formats), including CSV/JSON/Avro formats), you can use the copy activity [column mapping](copy-activity-schema-and-type-mapping.md) (implicitly by name or explicitly as configured) and/or Azure Data Explorer mappings. | No |
| additionalProperties | A property bag which can be used for specifying any of the ingestion properties which aren't being set already by the Azure Data Explorer Sink. Specifically, it can be useful for specifying ingestion tags. Learn more from [Azure Data Explore data ingestion doc](https://docs.microsoft.com/azure/data-explorer/ingestion-properties). | No |

**Example:**

```json
"activities":[
    {
        "name": "CopyToAzureDataExplorer",
        "type": "Copy",
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "AzureDataExplorerSink",
                "ingestionMappingName": "<optional Azure Data Explorer mapping name>",
                "additionalProperties": {<additional settings for data ingestion>}
            }
        },
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Azure Data Explorer output dataset name>",
                "type": "DatasetReference"
            }
        ]
    }
]
```

## Lookup activity properties

For more information about the properties, see [Lookup activity](control-flow-lookup-activity.md).

## Next steps

* For a list of data stores that the copy activity in Azure Data Factory supports as sources and sinks, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).

* Learn more about how to [copy data from Azure Data Factory to Azure Data Explorer](/azure/data-explorer/data-factory-load-data).
