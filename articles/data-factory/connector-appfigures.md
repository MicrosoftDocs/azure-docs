---
title: Transform data in AppFigures (Preview)
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to transform data in AppFigures (Preview) by using Data Factory or Azure Synapse Analytics.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/20/2023
---

#  Transform data in AppFigures (Preview) using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Data Flow to transform data in AppFigures (Preview). To learn more, read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

This AppFigures connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Mapping data flow](concepts-data-flow-overview.md) (source/-)|&#9312; |

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

## Create an AppFigures linked service using UI

Use the following steps to create an AppFigures linked service in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then select New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory U I.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse U I.":::

2. Search for AppFigures (Preview) and select the AppFigures (Preview) connector.

    :::image type="content" source="media/connector-appfigures/appfigures-connector.png" alt-text="Screenshot showing selecting AppFigures connector.":::

3. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-appfigures/configure-appfigures-linked-service.png" alt-text="Screenshot of configuration for AppFigures linked service.":::

## Connector configuration details

The following sections provide information about properties that are used to define Data Factory and Synapse pipeline entities specific to AppFigures.

## Linked service properties

The following properties are supported for the AppFigures linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **AppFigures**. |Yes |
| userName | Specify a user name for the AppFigures. |Yes |
| password | Specify a password for the AppFigures. Mark this field as **SecureString** to store it securely. Or, you can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
| clientKey | Specify a client key for the AppFigures. Mark this field as **SecureString** to store it securely. Or, you can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |

**Example:**

```json
{
    "name": "AppFiguresLinkedService",
    "properties": {
        "type": "AppFigures",
        "typeProperties": {
            "userName": "<username>",
            "password": "<password>",
            "clientKey": "<client key>"
        }
    }
}
```

## Mapping data flow properties

When transforming data in mapping data flow, you can read tables from AppFigures. For more information, see the [source transformation](data-flow-source.md) in mapping data flows. You can only use an [inline dataset](data-flow-source.md#inline-datasets) as source type.

### Source transformation

The below table lists the properties supported by AppFigures source. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Entity type | The type of the entity in AppFigures. | Yes  | `products`<br>`ads`<br>`sales` | *(for inline dataset only)*<br>entityType |


#### AppFigures source script examples 

When you use AppFigures as source type, the associated data flow script is:

```
source(allowSchemaDrift: true,
	validateSchema: false,
	store: 'appfigures',
	format: 'rest',
	entityType: 'products') ~> AppFiguresSource
```

## Next steps

For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
