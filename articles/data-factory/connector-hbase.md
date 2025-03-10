---
title: Copy data from HBase
description: Learn how to copy data from HBase to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 01/26/2025
ms.author: jianleishen
---
# Copy data from HBase using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

> [!IMPORTANT]
> This connector is at [End of Support stage](connector-deprecation-plan.md). You are recommended to migrate to [ODBC connector](connector-odbc.md) by installing a driver.

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from HBase. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

This HBase connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Prerequisites

If your data store is a managed cloud data service, you can use the Azure Integration Runtime. If the access is restricted to IPs that are approved in the firewall rules, you can add [Azure Integration Runtime IPs](azure-integration-runtime-ip-addresses.md) to the allowlist. 

You can also use the [managed virtual network integration runtime](tutorial-managed-virtual-network-on-premise-sql-server.md) feature in Azure Data Factory to access the on-premises network without installing and configuring a self-hosted integration runtime.

For more information about the network security mechanisms and options supported by Data Factory, see [Data access strategies](data-access-strategies.md).

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Hbase using UI

Use the following steps to create a linked service to Hbase in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Hbase and select the Hbase connector.

   :::image type="content" source="media/connector-hbase/hbase-connector.png" alt-text="Screenshot of the Hbase connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-hbase/configure-hbase-linked-service.png" alt-text="Screenshot of linked service configuration for Hbase.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to HBase connector.

## Linked service properties

The following properties are supported for HBase linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **HBase** | Yes |
| host | The IP address or host name of the HBase server. (i.e.  `[clustername].azurehdinsight.net`， `192.168.222.160`)  | Yes |
| port | The TCP port that the HBase instance uses to listen for client connections. The default value is 9090. If you connect to Azure HDInsights, specify port as 443. | No |
| httpPath | The partial URL corresponding to the HBase server, e.g. `/hbaserest0` when using HDInsights cluster. | No |
| authenticationType | The authentication mechanism to use to connect to the HBase server. <br/>Allowed values are: **Anonymous**, **Basic** | Yes |
| username | The user name used to connect to the HBase instance.  | No |
| password | The password corresponding to the user name. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| enableSsl | Specifies whether the connections to the server are encrypted using TLS. The default value is false.  | No |
| trustedCertPath | The full path of the .pem file containing trusted CA certificates for verifying the server when connecting over TLS. This property can only be set when using TLS on self-hosted IR. The default value is the cacerts.pem file installed with the IR.  | No |
| allowHostNameCNMismatch | Specifies whether to require a CA-issued TLS/SSL certificate name to match the host name of the server when connecting over TLS. The default value is false.  | No |
| allowSelfSignedServerCert | Specifies whether to allow self-signed certificates from the server. The default value is false.  | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. You can only use Azure Integration Runtime. |No |

>[!NOTE]
>If your cluster doesn't support sticky session e.g. HDInsight, explicitly add node index at the end of the http path setting, e.g. specify `/hbaserest0` instead of `/hbaserest`.

**Example for HDInsights HBase:**

```json
{
    "name": "HBaseLinkedService",
    "properties": {
        "type": "HBase",
        "typeProperties": {
            "host" : "<cluster name>.azurehdinsight.net",
            "port" : "443",
            "httpPath" : "/hbaserest0",
            "authenticationType" : "Basic",
            "username" : "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            },
            "enableSsl" : true
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example for generic HBase:**

```json
{
    "name": "HBaseLinkedService",
    "properties": {
        "type": "HBase",
        "typeProperties": {
            "host" : "<host e.g. 192.168.222.160>",
            "port" : "<port>",
            "httpPath" : "<e.g. /gateway/sandbox/hbase/version>",
            "authenticationType" : "Basic",
            "username" : "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            },
            "enableSsl" : true,
            "trustedCertPath" : "<trustedCertPath>",
            "allowHostNameCNMismatch" : true,
            "allowSelfSignedServerCert" : true
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by HBase dataset.

To copy data from HBase, set the type property of the dataset to **HBaseObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **HBaseObject** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "HBaseDataset",
    "properties": {
        "type": "HBaseObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<HBase linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by HBase source.

### HBaseSource as source

To copy data from HBase, set the source type in the copy activity to **HBaseSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **HBaseSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromHBase",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<HBase input dataset name>",
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
                "type": "HBaseSource",
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

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
