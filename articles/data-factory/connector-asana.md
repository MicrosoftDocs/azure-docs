---
title: Transform data in Asana (Preview)
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to transform data in Asana (Preview) by using Data Factory or Azure Synapse Analytics.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/13/2023
---

#  Transform data in Asana (Preview) using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Data Flow to transform data in Asana (Preview). To learn more, read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

This Asana connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Mapping data flow](concepts-data-flow-overview.md) (source/-)|&#9312; |

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

## Create an Asana linked service using UI

Use the following steps to create an Asana linked service in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then select New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory U I.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse U I.":::

2. Search for Asana (Preview) and select the Asana (Preview) connector.

    :::image type="content" source="media/connector-asana/asana-connector.png" alt-text="Screenshot showing selecting Asana connector.":::

3. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-asana/configure-asana-linked-service.png" alt-text="Screenshot of configuration for Asana linked service.":::

## Connector configuration details

The following sections provide information about properties that are used to define Data Factory and Synapse pipeline entities specific to Asana.

## Linked service properties

The following properties are supported for the Asana linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Asana**. |Yes |
| apiToken | Specify an API token for the Asana. Mark this field as **SecureString** to store it securely. Or, you can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |

**Example:**

```json
{
    "name": "AsanaLinkedService",
    "properties": {
        "type": "Asana",
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

When transforming data in mapping data flow, you can read tables from Asana. For more information, see the [source transformation](data-flow-source.md) in mapping data flows. You can only use an [inline dataset](data-flow-source.md#inline-datasets) as source type.

### Source transformation

The below table lists the properties supported by Asana source. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Workspace | The ID of the workspace in Asana. | Yes  | String | workspaceId |
| Entity | The ID of the entity in Asana.| Yes | String | entityId |
| Entity Type | The type of the entity in Asana. | Yes  | `teams`<br>`portfolios`<br>`projects` | entityType |


#### Asana source script examples 

When you use Asana as source type, the associated data flow script is:

```
source(allowSchemaDrift: true,
    validateSchema: false,
    store: 'asana',
    format: 'rest',
    workspaceId: '9876543210',
    entityId: '1234567890',
    entityType: 'teams') ~> AsanaSource
```

## Next steps

For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
