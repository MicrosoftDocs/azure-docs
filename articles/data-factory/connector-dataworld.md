---
title: Transform data in data.world (Preview)
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to transform data in data.world (Preview) by using Data Factory or Azure Synapse Analytics.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/13/2023
---

#  Transform data in data.world (Preview) using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Data Flow to transform data in data.world (Preview). To learn more, read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

This data.world connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Mapping data flow](concepts-data-flow-overview.md) (source/-)|&#9312; |

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

## Create a data.world linked service using UI

Use the following steps to create a data.world linked service in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then select New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory U I.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse U I.":::

2. Search for data.world (Preview) and select the data.world (Preview) connector.

    :::image type="content" source="media/connector-dataworld/dataworld-connector.png" alt-text="Screenshot showing selecting data.world connector.":::

3. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-dataworld/configure-dataworld-linked-service.png" alt-text="Screenshot of configuration for data.world linked service.":::

## Connector configuration details

The following sections provide information about properties that are used to define Data Factory and Synapse pipeline entities specific to data.world.

## Linked service properties

The following properties are supported for the data.world linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Dataworld**. |Yes |
| apiToken | Specify an API token for the data.world. Mark this field as **SecureString** to store it securely. Or, you can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |

**Example:**

```json
{
    "name": "DataworldLinkedService",
    "properties": {
        "type": "Dataworld",
        "typeProperties": {
            "apiToken": {
                "type": "SecureString",
                "value": "<API token>"
            }
        }
    }
}
```

## Mapping data flow properties

When transforming data in mapping data flow, you can read tables from data.world. For more information, see the [source transformation](data-flow-source.md) in mapping data flows. You can only use an [inline dataset](data-flow-source.md#inline-datasets) as source type.


### Source transformation

The below table lists the properties supported by data.world source. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Dataset name| The ID of the dataset in data.world.| Yes | String | datasetId |
| Table name | The ID of the table within the dataset in data.world. | No (if `query` is specified) | String | tableId |
| Query | Enter a SQL query to fetch data from data.world. An example is `select * from MyTable`.| No (if `tableId` is specified)| String | query |
| Owner | The owner of the dataset in data.world. | Yes | String | owner |

#### data.world source script example

When you use data.world as source type, the associated data flow script is:

```
source(allowSchemaDrift: true,
	validateSchema: false,
	store: 'dataworld',
	format: 'rest',
	owner: 'owner1',
	datasetId: 'dataset1',
	tableId: 'MyTable') ~> DataworldSource
```

## Next steps

For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
