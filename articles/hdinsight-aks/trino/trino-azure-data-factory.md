---
title: Connect Trino to Azure Data Factory
description: Azure HDInsight on AKS Trino connector in Azure Data Factory
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Connect Trino to Azure Data Factory 

Azure HDInsight on AKS Trino provides a mechanism to connect your Trino cluster with Azure Data Factory. This article outlines the different configurations required to connect to Azure Data Factory.

## Supported capabilities

This Azure Blob Storage connector is supported for the following capabilities:

| Supported capabilities|IR | 
|---------| --------| 
|[Copy activity](/azure/data-factory/copy-activity-overview) (source/sink)|&#9312; |
|[Script activity](/azure/data-factory/transform-data-using-script)|&#9312; |

<small>*&#9312; Azure integration runtime*</small>

## Create a linked service to Trino using Azure portal

Use the following steps to create a linked service to Azure HDInsight on AKS Trino in the Azure portal.

1. Browse to the Manage tab in your Azure Data Factory and select Linked Services, then click New:

   :::image type="content" source="./media/trino-azure-data-factory/new-linked-service.png" alt-text="Screenshot showing how to create a new linked service with Azure Data Factory UI.":::

1. Search for Trino and select *Azure HDInsight on AKS Trino* connector.

1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="./media/trino-azure-data-factory/configure-new-linked-service.png" alt-text="Screenshot showing how to configure a new linked service with Azure Data Factory UI.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Azure HDInsight on AKS Trino connector.

## Linked service properties

The Azure HDInsight on AKS Trino supports the following authentication types. 

- Service principal authentication

> [!NOTE]
> Give access to the service principal ID (object ID) to your Trino cluster. Follow the steps to grant access(Give Manage Authorization page link).

The following properties are supported for Azure HDInsight on AKS Trino linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| Name | Name of the linked service | Yes |
| Connect via | The integration runtime to be used to connect to the trino cluster |Yes|
| Connection string | Specify the information needed to connect to Trino cluster for the `connectionString` property. <br/> You can also put the connection string in Azure Key Vault. | Yes |
| Catalog | The default catalog context to use when executing the query | Yes |
| Schema | The default schema to use when executing a query  | No |
| Authentication type | The authentication mechanism used to connect to the Trino cluster. <br/>Allowed values are: **Service Principal** | Yes |
| Session properties | Allows you to provide properties for a session in Trino. These values are the key value pairs| No |
| Other connection properties | Allow to specify any other Trino ODBC driver connection properties | No |

Example

:::image type="content" source="./media/trino-azure-data-factory/set-properties.png" alt-text="Screenshot showing how to set-properties.":::

```json
{
    "name": "mycontosoTrino",
    "type": "Microsoft.DataFactory/factories/linkedservices",
    "properties": {
        "annotations": [],
        "type": "AzureTrino",
        "typeProperties": {
            "connectionString": "Host=mycluster.contosopool.eastus2.projecthilo.net;Port=443;Protocol=https;Catalog=system",
            "servicePrincipalId": "02a2508a-b54f-4490-8b1b-042292292c1f",
            "servicePrincipalKey": {
                "type": "SecureString",
                "value": "**********"
            },
            "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db47"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](/azure/data-factory/concepts-datasets-linked-services?tabs=data-factory) article. This section provides a list of properties supported by HDInsight on AKS Trino dataset.

To copy data from Azure HDInsight on AKS Trino, set the type property of the dataset to **AzureTrino**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **TrinoObject** | Yes |
| schema | Name of the schema |No (if "query" in activity source is specified)  |
| table | Name of the table |No (if "query" in activity source is specified)  |


**Example**

:::image type="content" source="./media/trino-azure-data-factory/source-tab.png" alt-text="Screenshot showing source tab.":::

```json
{
    "name": "MyTrinoDataset",
    "properties": {
        "type": "TrinoObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Trino linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](/azure/data-factory/concepts-pipelines-activities?tabs=data-factory) article. This section provides a list of properties supported by Azure HDInsight on AKS Trino source.

### HDInsight on AKS Trino as source

To copy data from Azure HDInsight on AKS Trino, set the source type in the copy activity to **AzureTrino**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **AzureTrino** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"` | No (if "table" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromMyTrino",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<HDInsight on AKS input dataset name>",
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
                "type": "AzureTrino",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```
> [!NOTE]
> Trino cannot be used as a sink for bulk insert. You can sink into the underlying storage such as ADLS Gen 2.

## Script activity 

The script activity allows users to provide custom queries to execute and results consumed by subsequent pipeline stages. This section provides a list of properties supported by Azure HDInsight on AKS Trino source.


**Example:**

:::image type="content" source="./media/trino-azure-data-factory/settings-tab.png" alt-text="Screenshot showing how to settings tab.":::

```json
{
    "name": "Mypipeline",
    "properties": {
        "activities": [
            {
                "name": "MyTrinoScript",
                "type": "Script",
                "dependsOn": [],
                "policy": {
                    "timeout": "0.12:00:00",
                    "retry": 0,
                    "retryIntervalInSeconds": 30,
                    "secureOutput": false,
                    "secureInput": false
                },
                "userProperties": [],
                "linkedServiceName": {
                    "referenceName": "ContosoTrino",
                    "type": "LinkedServiceReference"
                },
                "typeProperties": {
                    "scripts": [
                        {
                            "type": "Query",
                            "text": "SELECT * FROM MyTable;"
                        }
                    ],
                    "scriptBlockExecutionTimeout": "02:00:00"
                }
            }
        ],
        "annotations": []
    }
}
```
