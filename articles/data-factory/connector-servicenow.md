---
title: Copy data from ServiceNow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from ServiceNow to supported sink data stores by using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
ms.author: jianleishen
author: jianleishen
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 08/06/2024
---

# Copy data from ServiceNow using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from ServiceNow. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

>[!IMPORTANT]
>The new ServiceNow connector provides improved native ServiceNow support. If you are using the legacy ServiceNow connector in your solution, supported as-is for backward compatibility only, refer to [ServiceNow connector (legacy)](connector-servicenow-legacy.md) article.


## Supported capabilities

This ServiceNow connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

The service provides a built-in driver to enable connectivity. Therefore you don't need to manually install any driver using this connector.

## Prerequisite

To use this connector, you need to have a role with at least read access to *sys_db_object* and *sys_dictionary* tables in ServiceNow.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to ServiceNow using UI

Use the following steps to create a linked service to ServiceNow in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for ServiceNow and select the ServiceNow connector.

    :::image type="content" source="media/connector-servicenow/servicenow-connector.png" alt-text="Screenshot of the ServiceNow connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-servicenow/configure-servicenow-linked-service.png" alt-text="Screenshot of linked service configuration for ServiceNow.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to ServiceNow connector.

## Linked service properties

The following properties are supported for ServiceNow linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **ServiceNowV2** | Yes |
| endpoint | The endpoint of the ServiceNow server (`http://<instance>.service-now.com`).  | Yes |
| authenticationType | The authentication type to use. <br/>Allowed values are: **Basic**, **OAuth2** | Yes |
| username | The user name used to connect to the ServiceNow server for Basic and OAuth2 authentication.  | Yes |
| password | The password corresponding to the user name for Basic and OAuth2 authentication. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| clientId | The client ID for OAuth2 authentication.  | Yes for OAuth authentication|
| clientSecret | The client secret for OAuth2 authentication. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes for OAuth authentication |
| grantType | Specifies the type of OAuth2.0 flow that the client app uses to access token. The default value is password.| Yes for OAuth authentication |

**Example:**

```json
{
    "name": "ServiceNowLinkedService",
    "properties": {
        "type": "ServiceNowV2",
        "typeProperties": {
            "endpoint" : "http://<instance>.service-now.com",
            "authenticationType" : "Basic",
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by ServiceNow dataset.

To copy data from ServiceNow, set the type property of the dataset to **ServiceNowV2Object**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **ServiceNowV2Object** | Yes |
| tableName | Name of the table. | Yes |

> [!Note]
> In copy activities, the tableName in dataset will be the name of the table instead of the label in ServiceNow.

**Example**

```json
{
    "name": "ServiceNowDataset",
    "properties": {
        "type": "ServiceNowV2Object",
        "typeProperties": {
            "tableName": "<table name>"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<ServiceNow linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by ServiceNow source.

### ServiceNow as source

To copy data from ServiceNow, set the source type in the copy activity to **ServiceNowV2Source**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **ServiceNowV2Source** | Yes |
| expression| Use the expression to read data. You can configure the expression in **Query builder**. It has the same usage as the condition builder in ServiceNow. For instructions on how to use it, see this [article](https://docs.servicenow.com/bundle/vancouver-platform-user-interface/page/use/common-ui-elements/concept/c_ConditionBuilder.html). | No |
| *Under `expression`* |  |  |
| type | The expression type. Values can be Constant (default), Unary, Binary, and Field.  | No  |
| value | The constant value. |Yes when the expression type is Constant or Field |
| operators | The operator value. For more information about operators, see *Operators available for choice fields containing strings* section in this [article](https://docs.servicenow.com/bundle/vancouver-platform-user-interface/page/use/common-ui-elements/reference/r_OpAvailableFiltersQueries.html).| Yes when the expression type is Unary or Binary |
| operands | List of expressions on which operator is applied.| Yes when the expression type is Unary or Binary |


**Example:**

```json
"activities": [
    {
        "name": "CopyFromServiceNow",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<ServiceNow input dataset name>",
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
                "type": "ServiceNowV2Source",
                "expression": {
                    "type": "Nary",
                    "operators": [
                        "<"
                    ],
                    "operands": [
                        {
                            "type": "Field",
                            "value": "u_founded"
                        },
                        {
                            "type": "Constant",
                            "value": "2000"
                        }
                    ]
                }
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

## Upgrade your ServiceNow linked service

Here are the steps that help you to upgrade your ServiceNow linked service:

1. Create a new linked service by referring to [Linked service properties](#linked-service-properties).
2. **Query** in source is upgraded to **Query builder**, which has the same usage as the condition builder in ServiceNow. Learn how to configure it referring to [ServiceNow as source](#servicenow-as-source).

## Differences between ServiceNow and ServiceNow (legacy)

The ServiceNow connector offers new functionalities and is compatible with most features of ServiceNow (legacy) connector. The table below shows the feature differences between ServiceNow and ServiceNow (legacy).

| ServiceNow | ServiceNow (legacy) | 
|:--- |:--- |
| useEncryptedEndpoints, useHostVerification and usePeerVerification are not supported in the linked service. | Support useEncryptedEndpoints, useHostVerification and usePeerVerification in the linked service. | 
| Support **Query builder** in the source. | **Query builder** is not supported in the source. | 
| SQL-based queries are not supported. | Support SQL-based queries. | 
| sortBy queries are not supported in **Query builder**. | Support sortBy queries in **Query**. | 
| You can view the schema in the dataset. | You can't view the schema in the dataset. | 

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
