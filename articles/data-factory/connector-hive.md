---
title: Copy data from Hive using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from Hive to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 12/07/2018
ms.author: jingwang

---
# Copy data from Hive using Azure Data Factory 

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from Hive. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

You can copy data from Hive to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Azure Data Factory provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Hive connector.

## Linked service properties

The following properties are supported for Hive linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Hive** | Yes |
| host | IP address or host name of the Hive server, separated by ';' for multiple hosts (only when serviceDiscoveryMode is enable).  | Yes |
| port | The TCP port that the Hive server uses to listen for client connections. If you connect to Azure HDInsights, specify port as 443. | Yes |
| serverType | The type of Hive server. <br/>Allowed values are: **HiveServer1**, **HiveServer2**, **HiveThriftServer** | No |
| thriftTransportProtocol | The transport protocol to use in the Thrift layer. <br/>Allowed values are: **Binary**, **SASL**, **HTTP** | No |
| authenticationType | The authentication method used to access the Hive server. <br/>Allowed values are: **Anonymous**, **Username**, **UsernameAndPassword**, **WindowsAzureHDInsightService** | Yes |
| serviceDiscoveryMode | true to indicate using the ZooKeeper service, false not.  | No |
| zooKeeperNameSpace | The namespace on ZooKeeper under which Hive Server 2 nodes are added.  | No |
| useNativeQuery | Specifies whether the driver uses native HiveQL queries,or converts them into an equivalent form in HiveQL.  | No |
| username | The user name that you use to access Hive Server.  | No |
| password | The password corresponding to the user. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| httpPath | The partial URL corresponding to the Hive server.  | No |
| enableSsl | Specifies whether the connections to the server are encrypted using SSL. The default value is false.  | No |
| trustedCertPath | The full path of the .pem file containing trusted CA certificates for verifying the server when connecting over SSL. This property can only be set when using SSL on self-hosted IR. The default value is the cacerts.pem file installed with the IR.  | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified PEM file. The default value is false.  | No |
| allowHostNameCNMismatch | Specifies whether to require a CA-issued SSL certificate name to match the host name of the server when connecting over SSL. The default value is false.  | No |
| allowSelfSignedServerCert | Specifies whether to allow self-signed certificates from the server. The default value is false.  | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Self-hosted Integration Runtime or Azure Integration Runtime (if your data store is publicly accessible). If not specified, it uses the default Azure Integration Runtime. |No |

**Example:**

```json
{
    "name": "HiveLinkedService",
    "properties": {
        "type": "Hive",
        "typeProperties": {
            "host" : "<cluster>.azurehdinsight.net",
            "port" : "<port>",
            "authenticationType" : "WindowsAzureHDInsightService",
            "username" : "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Hive dataset.

To copy data from Hive, set the type property of the dataset to **HiveObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **HiveObject** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "HiveDataset",
    "properties": {
        "type": "HiveObject",
        "linkedServiceName": {
            "referenceName": "<Hive linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {}
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Hive source.

### HiveSource as source

To copy data from Hive, set the source type in the copy activity to **HiveSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **HiveSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromHive",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Hive input dataset name>",
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
                "type": "HiveSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
