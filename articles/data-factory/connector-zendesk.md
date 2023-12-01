---
title: Transform data in Zendesk (Preview)
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to transform data in Zendesk (Preview) by using Data Factory or Azure Synapse Analytics.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 04/12/2023
---

#  Transform data in Zendesk (Preview) using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Data Flow to transform data in Zendesk (Preview). To learn more, read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

This Zendesk connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Mapping data flow](concepts-data-flow-overview.md) (source/-)|&#9312; |

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

## Create a Zendesk linked service using UI

Use the following steps to create a Zendesk linked service in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then select New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory U I.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse U I.":::

2. Search for Zendesk (Preview) and select the Zendesk (Preview) connector.

    :::image type="content" source="media/connector-zendesk/zendesk-connector.png" alt-text="Screenshot showing selecting Zendesk connector.":::

3. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-zendesk/configure-zendesk-linked-service.png" alt-text="Screenshot of configuration for Zendesk linked service.":::

## Connector configuration details

The following sections provide information about properties that are used to define Data Factory and Synapse pipeline entities specific to Zendesk.

## Linked service properties

The following properties are supported for the Zendesk linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Zendesk**. |Yes |
| url | The base URL of your Zendesk service. | Yes |
| authenticationType | Type of authentication used to connect to the Zendesk service. Allowed values are **basic** and **token**. Refer to corresponding sections below on more properties and examples respectively.|Yes |

### Basic authentication

Set the **authenticationType** property to **basic**. In addition to the generic properties that are described in the preceding section, specify the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| userName | The user name used to log in to Zendesk. |Yes  |
| password | Specify a password for the user account you specified for the user name. Mark this field as **SecureString** to store it securely. Or, you can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes  |

**Example:**

```json
{
    "name": "ZendeskLinkedService",
    "properties": {
        "type": "Zendesk",
        "typeProperties": {
            "url": "<base url>",
            "authenticationType": "basic",
            "userName": "<user name>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        }
    }
}
```

### Token authentication

Set the **authenticationType** property to **token**. In addition to the generic properties that are described in the preceding section, specify the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| apiToken | Specify an API token for the Zendesk. Mark this field as **SecureString** to store it securely. Or, you can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |

**Example:**

```json
{
    "name": "ZendeskLinkedService",
    "properties": {
        "type": "Zendesk",
        "typeProperties": {
            "url": "<base url>",
            "authenticationType": "token",
            "apiToken": {
                "type": "SecureString",
                "value": "<API token>"
            }
        }
    }
}
```

## Mapping data flow properties

When transforming data in mapping data flow, you can read tables from Zendesk. For more information, see the [source transformation](data-flow-source.md) in mapping data flows. You can only use an [inline dataset](data-flow-source.md#inline-datasets) as source type.

### Source transformation

The below table lists the properties supported by Zendesk source. You can edit these properties in the **Source options** tab.


| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Entity | The logical name of the entity in Zendesk. | Yes when use inline mode| `activities`<br/>`group_memberships`<br/>`groups`<br/>`organizations`<br/>`requests`  <br/>`satisfaction_ratings`<br/>`sessions`<br/>`tags`<br/>`targets`<br/>`ticket_audits`<br/>`ticket_fields`<br/>`ticket_metrics`<br/>`tickets`<br/>`triggers`<br/>`users`<br/>`views`  | entity |

#### Zendesk source script examples

```
source(allowSchemaDrift: true,
	validateSchema: false,
	store: 'zendesk',
	format: 'rest',
	entity: 'tickets') ~> ZendeskSource
```

## Next steps

For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
