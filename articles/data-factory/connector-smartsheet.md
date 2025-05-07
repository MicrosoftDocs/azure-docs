---
title: Transform data in Smartsheet (Preview)
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to transform data in Smartsheet (Preview) by using Data Factory or Azure Synapse Analytics.
ms.author: jianleishen
author: jianleishen
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 01/05/2024
---

#  Transform data in Smartsheet (Preview) using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Data Flow to transform data in Smartsheet (Preview). To learn more, read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

This Smartsheet connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Mapping data flow](concepts-data-flow-overview.md) (source/-)|&#9312; |

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

## Create a Smartsheet linked service using UI

Use the following steps to create a Smartsheet linked service in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then select New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory U I.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse U I.":::

2. Search for Smartsheet (Preview) and select the Smartsheet (Preview) connector.

    :::image type="content" source="media/connector-smartsheet/smartsheet-connector.png" alt-text="Screenshot showing selecting Smartsheet connector.":::

3. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-smartsheet/configure-smartsheet-linked-service.png" alt-text="Screenshot of configuration for Smartsheet linked service.":::

## Connector configuration details

The following sections provide information about properties that are used to define Data Factory and Synapse pipeline entities specific to Smartsheet.

## Linked service properties

The following properties are supported for the Smartsheet linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Smartsheet**. |Yes |
| apiToken | Specify an API token for the Smartsheet. Mark this field as **SecureString** to store it securely. Or, you can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |

**Example:**

```json
{
    "name": "SmartsheetLinkedService",
    "properties": {
        "type": "Smartsheet",
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

When transforming data in mapping data flow, you can read tables from Smartsheet. For more information, see the [source transformation](data-flow-source.md) in mapping data flows. You can only use an [inline dataset](data-flow-source.md#inline-datasets) as source type.

### Source transformation

The below table lists the properties supported by Smartsheet source. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Entity type | The type of the data asset in Smartsheet. | Yes when use inline mode| `sheets`  `reports` | entityType |
| Entity name | The name of a sheet or a report in Smartsheet. | Yes when use inline mode| String | entityId |

#### Smartsheet source script examples

```
source(allowSchemaDrift: true,
	validateSchema: false,
	store: 'smartsheet',
	format: 'rest',
	entityId: 'Sheet1',
	entityType: 'sheets') ~> SmartsheetSource
```

## Related content

For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
