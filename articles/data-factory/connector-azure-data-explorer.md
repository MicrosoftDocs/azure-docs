---
title: Copy data to or from Azure Data Explorer using Azure Data Factory 
description: Learn how to copy data to or from Azure Data Explorer by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/24/2019
ms.author: orspodek
---

# Copy data to or from Azure Data Explorer using Azure Data Factory

This article outlines how to use the Copy Activity in Azure Data Factory to copy data to or from [Azure Data Explorer](../data-explorer/data-explorer-overview.md). It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

You can copy data from any supported source data store to Azure Data Explorer. You can also copy data from Azure Data Explorer to any supported sink data store. For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md) table.

>[!NOTE]
>Copying data to/from Azure Data Explorer from/to on premises data store using Self-hosted Integration Runtime is supported since version 3.14.

The Azure Data Explorer connector allows you to do the following:

* Copy data by using Azure Active Directory (Azure AD) application token authentication with a **service principal**.
* As a source, retrieve data by using a KQL (Kusto) query.
* As a sink, append data to a destination table.

## Getting started

>[!TIP]
>For a walkthrough of using Azure Data Explorer connector, see [Copy data to/from Azure Data Explorer using Azure Data Factory](../data-explorer/data-factory-load-data.md).

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Azure Data Explorer connector.

## Linked service properties

The Azure Data Explorer connector uses service principal authentication. Follow these steps to get a service principal and grant permissions:

1. Register an application entity in Azure Active Directory (Azure AD) by following [Register your application with an Azure AD tenant](../storage/common/storage-auth-aad-app.md#register-your-application-with-an-azure-ad-tenant). Make note of the following values, which you use to define the linked service:

    - Application ID
    - Application key
    - Tenant ID

2. Grant the service principal proper permission in Azure Data Explorer. Refer to [Manage Azure Data Explorer database permissions](../data-explorer/manage-database-permissions.md) with detailed information on roles and permissions as well as walkthrough on managing permissions. In general, you need to

    - **As source**, grant at least **Database viewer** role to your database.
    - **As sink**, grant at least **Database ingestor** role to your database.

>[!NOTE]
>When using ADF UI to author, the operations of listing databases on linked service or listing tables on dataset may require higher privileged permission granted for the service principal. Alternatively, you can choose to manually input database name and table name. Copy activity execution works as long as the service principal is granted with proper permission to read/write data.

The following properties are supported for Azure Data Explorer linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **AzureDataExplorer** | Yes |
| endpoint | Endpoint URL of the Azure Data Explorer cluster, with the format as `https://<clusterName>.<regionName>.kusto.windows.net`. | Yes |
| database | Name of database. | Yes |
| tenant | Specify the tenant information (domain name or tenant ID) under which your application resides. This is what you normally know as "**Authority ID**" in [Kusto connection string](https://docs.microsoft.com/azure/kusto/api/connection-strings/kusto#application-authentication-properties). Retrieve it by hovering with the mouse in the top-right corner of the Azure portal. | Yes |
| servicePrincipalId | Specify the application's client ID. This is what you normally know as "**AAD application client ID**" in [Kusto connection string](https://docs.microsoft.com/azure/kusto/api/connection-strings/kusto#application-authentication-properties). | Yes |
| servicePrincipalKey | Specify the application's key. This is what you normally know as "**AAD application key**" in [Kusto connection string](https://docs.microsoft.com/azure/kusto/api/connection-strings/kusto#application-authentication-properties). Mark this field as a **SecureString** to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |

**Linked Service Properties Example:**

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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties that are supported by the Azure Data Explorer dataset.

To copy data to Azure Data Explorer, set the type property of the dataset to **AzureDataExplorerTable**.

The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **AzureDataExplorerTable** | Yes |
| table | The name of the table that the linked service refers to. | Yes for sink; No for source |

**Dataset Properties Example**

```json
{
   "name": "AzureDataExplorerDataset",
    "properties": {
        "type": "AzureDataExplorerTable",
        "linkedServiceName": {
            "referenceName": "<Azure Data Explorer linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "table": "<table name>"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Azure Data Explorer source and sink.

### Azure Data Explorer as source

To copy data from Azure Data Explorer, set the **type** property in the Copy activity source to **AzureDataExplorerSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the copy activity source must be set to: **AzureDataExplorerSource** | Yes |
| query | A read-only request given in a [KQL format](/azure/kusto/query/). Use the custom KQL query as a reference. | Yes |
| queryTimeout | The wait time before the query request times out. Default value is 10 min (00:10:00); allowed max value is 1 hour (01:00:00). | No |
| noTruncation | Indicates whether to truncate the returned result set. By default, result is truncated after 500,000 records or 64MB. Truncation is strongly recommended for a proper behavior of the activity. |No |

>[!NOTE]
>Azure Data Explorer source by default has a size limit of 500,000 records or 64 MB. To retrieve all the records without truncation, you can specify `set notruncation;` at the beginning of your query. Refer to [Query limits](https://docs.microsoft.com/azure/kusto/concepts/querylimits) on more details.

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
| type | The **type** property of the copy activity sink must be set to: **AzureDataExplorerSink** | Yes |
| ingestionMappingName | Name of a pre-created **[mapping](/azure/kusto/management/mappings#csv-mapping)** on a Kusto table. To map the columns from source to Azure Data Explorer - which applies to **[all supported source stores/formats](copy-activity-overview.md#supported-data-stores-and-formats)** including CSV/JSON/Avro formats etc., you can use the Copy activity [column mapping](copy-activity-schema-and-type-mapping.md) (implicitly by name or explicitly as configured) and/or Azure Data Explorer mappings. | No |

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
                "ingestionMappingName": "<optional Azure Data Explorer mapping name>"
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

## Next steps

* For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).

* Learn more about [Copy data from Azure Data Factory to Azure Data Explorer](/azure/data-explorer/data-factory-load-data).