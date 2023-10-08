---
title: Copy and transform data in Microsoft Fabric Lakehouse Table (Preview) 
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data to and from Microsoft Fabric Lakehouse Table  (Preview) using Azure Data Factory or Azure Synapse Analytics pipelines.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 09/28/2023
---

# Copy data in Microsoft Fabric Lakehouse Table (Preview) using Azure Data Factory or Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity to copy data from and to Microsoft Fabric Lakehouse Table (Preview). To learn more, read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

This Microsoft Fabric Lakehouse Table connector is supported for the following capabilities:

| Supported capabilities|IR | Managed private endpoint|
|---------| --------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|✓ |

<small>*&#9312; Azure integration runtime  &#9313; Self-hosted integration runtime*</small>

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a Microsoft Fabric Lakehouse linked service using UI

Use the following steps to create a Microsoft Fabric Lakehouse linked service in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then select New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Microsoft Fabric Lakehouse and select the connector.

    :::image type="content" source="media/connector-microsoft-fabric-lakehouse/microsoft-fabric-lakehouse-connector.png" alt-text="Select Microsoft Fabric Lakehouse connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-microsoft-fabric-lakehouse/configure-microsoft-fabric-lakehouse-linked-service.png" alt-text="Screenshot of configuration for Microsoft Fabric Lakehouse linked service.":::


## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Microsoft Fabric Lakehouse.

## Linked service properties

The Microsoft Fabric Lakehouse connector supports the following authentication types. See the corresponding sections for details:

- [Service principal authentication](#service-principal-authentication)

### Service principal authentication

To use service principal authentication, follow these steps.

1. Register an application with the Microsoft Identity platform. To learn how, see [Quickstart: Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md). Make note of these values, which you use to define the linked service:

    - Application ID
    - Application key
    - Tenant ID

2. Grant the service principal at least the **Contributor** role in Microsoft Fabric workspace. 

These properties are supported for the linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Lakehouse**. |Yes |
| workspaceId | The Microsoft Fabric workspace ID. | Yes |
| artifactId | The Microsoft Fabric Lakehouse object ID. | Yes |
| tenant | Specify the tenant information (domain name or tenant ID) under which your application resides. Retrieve it by hovering the mouse in the upper-right corner of the Azure portal. | Yes |
| servicePrincipalId | Specify the application's client ID. | Yes |
| servicePrincipalCredentialType | The credential type to use for service principal authentication. Allowed values are **ServicePrincipalKey** and **ServicePrincipalCert**. | Yes |
| servicePrincipalCredential | The service principal credential. <br/> When you use **ServicePrincipalKey** as the credential type, specify the application's key. Mark this field as **SecureString** to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). <br/> When you use **ServicePrincipalCert** as the credential, reference a certificate in Azure Key Vault, and ensure the certificate content type is **PKCS #12**.| Yes |
| azureCloudType | For service principal authentication, specify the type of Azure cloud environment to which your Azure Active Directory application is registered. <br/> Allowed values are **AzurePublic**, **AzureChina**, **AzureUsGovernment**, and **AzureGermany**. By default, the data factory or Synapse pipeline's cloud environment is used. | No |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use the Azure integration runtime or a self-hosted integration runtime if your data store is in a private network. If not specified, the default Azure integration runtime is used. |No |

**Example: using service principal key authentication**

You can also store service principal key in Azure Key Vault.

```json
{
    "name": "MicrosoftFabricLakehouseLinkedService",
    "properties": {
        "type": "Lakehouse",
        "typeProperties": {
            "workspaceId": "<Microsoft Fabric workspace ID>",
            "artifactId": "<Microsoft Fabric Lakehouse object ID>",
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalCredentialType": "ServicePrincipalKey",
            "servicePrincipalCredential": {
                "type": "SecureString",
                "value": "<service principal key>"
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

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article.

The following properties are supported for Microsoft Fabric Lakehouse Table dataset:

| Property  | Description                                                  | Required                    |
| :-------- | :----------------------------------------------------------- | :-------------------------- |
| type      | The **type** property of the dataset must be set to **LakehouseTable**. | Yes                         |
| schema | Name of the schema. |No for source. Yes for sink  |
| table | Name of the table/view. |No for source. Yes for sink  |

### Dataset properties example

```json
{ 
    "name": "LakehouseTableDataset", 
    "properties": {
        "type": "LakehouseTable",
        "linkedServiceName": { 
            "referenceName": "<Microsoft Fabric Lakehouse linked service name>", 
            "type": "LinkedServiceReference" 
        }, 
        "typeProperties": { 
            "table": "<table_name>"   
        }, 
        "schema": [< physical schema, optional, retrievable during authoring >] 
    } 
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see [Copy activity configurations](copy-activity-overview.md#configuration) and [Pipelines and activities](concepts-pipelines-activities.md). This section provides a list of properties supported by the Microsoft Fabric Lakehouse Table source and sink.

### Microsoft Fabric Lakehouse Table as a source type

To copy data from Microsoft Fabric Lakehouse Table, set the **type** property in the Copy Activity source to **LakehouseTableSource**. The following properties are supported in the Copy Activity **source** section:

| Property                     | Description                                                  | Required |
| :--------------------------- | :----------------------------------------------------------- | :------- |
| type                         | The **type** property of the Copy Activity source must be set to **LakehouseTableSource**. | Yes      |
| timestampAsOf                      | 	The timestamp to query an older snapshot. | No      |
| versionAsOf                       | The version to query an older snapshot. | No     |

**Example: Microsoft Fabric Lakehouse Table source**

```json
"activities":[
    {
        "name": "CopyFromLakehouseTable",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Microsoft Fabric Lakehouse Table input dataset name>",
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
                "type": "LakehouseTableSource",
                "timestampAsOf": "2023-09-23T00:00:00.000Z",
                "versionAsOf": 2
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### Microsoft Fabric Lakehouse Table as a sink type

To copy data from Microsoft Fabric Lakehouse Table, set the **type** property in the Copy Activity source to **LakehouseTableSink**. The following properties are supported in the Copy activity **sink** section:

| Property                     | Description                                                  | Required |
| :--------------------------- | :----------------------------------------------------------- | :------- |
| type                         | The **type** property of the Copy Activity source must be set to **LakehouseTableSink**. | Yes      |
| tableActionOption            | The way to write data to the sink table. Allowed values are `Append` and `Overwrite`. | No   |
| partitionOption  | Allowed values are `None` and `PartitionByKey`. Create partitions in folder structure based on one or multiple columns when the value is `PartitionByKey`. Each distinct column value (pair) will be a new partition (e.g. year=2000/month=01/file). It supports insert-only mode and requires an empty directory in sink.  | No      |
| partitionNameList  | The destination columns in schemas mapping. Supported data types are string, integer, boolean and datetime. Format respects type conversion settings under "Mapping" tab.  | No     |

**Example: Microsoft Fabric Lakehouse Table sink**

```json
"activities":[
    {
        "name": "CopyToLakehouseTable",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Microsoft Fabric Lakehouse Table output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "LakehouseTableSink",
                "tableActionOption ": "Append"
            }
        }
    }
]
```

## Next steps

For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
