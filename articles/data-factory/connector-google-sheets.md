---
title: Transform data in Google Sheets (Preview)
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to transform data in Google Sheets (Preview) by using Data Factory or Azure Synapse Analytics.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 08/10/2023
---

#  Transform data in Google Sheets (Preview) using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Data Flow to transform data in Google Sheets (Preview). To learn more, read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

This Google Sheets connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Mapping data flow](concepts-data-flow-overview.md) (source/-)|&#9312; |

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

## Create a Google Sheets linked service using UI

Use the following steps to create a Google Sheets linked service in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then select New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory U I.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse U I.":::

2. Search for Google Sheets (Preview) and select the Google Sheets (Preview) connector.

    :::image type="content" source="media/connector-google-sheets/google-sheets-connector.png" alt-text="Screenshot showing selecting Google Sheets connector.":::

3. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-google-sheets/configure-google-sheets-linked-service.png" alt-text="Screenshot of configuration for Google Sheets linked service.":::

## Connector configuration details

The following sections provide information about properties that are used to define Data Factory and Synapse pipeline entities specific to Google Sheets.

## Linked service properties

The following properties are supported for the Google Sheets linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **GoogleSheets**. | Yes |
| apiToken | Specify an API token for the Google Sheets. Mark this field as **SecureString** to store it securely. Or, you can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |

**Example:**

```json
{
    "name": "GoogleSheetsLinkedService",
    "properties": {
        "type": "GoogleSheets",
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

When transforming data in mapping data flow, you can read resources from Google Sheets. For more information, see the [source transformation](data-flow-source.md) in mapping data flows. You can only use an [inline dataset](data-flow-source.md#inline-datasets) as source type.


### Source transformation

The below table lists the properties supported by Google Sheets source. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| SpreadSheet ID | The spreadsheet ID in your Google Sheets. Make sure the general access of the spreadsheet is set as **Anyone with the link**. | Yes | String | spreadSheetId |
| Sheet name | The name of the sheet in the spreadsheet. | Yes | String | sheetName |
| Start cell | The start cell of the sheet from where the data is required, for example A2, B4. | Yes  | String | startCell |
| End cell | The end cell of the sheet till where the data is required, for example F10, S600.  | Yes  | String | endCell |

#### Google Sheets source script example

When you use Google Sheets as source type, the associated data flow script is:

```
source(allowSchemaDrift: true,
	validateSchema: false,
	store: 'googlesheets',
	format: 'rest',
	spreadSheetId: $spreadSheetId,
	startCell: 'A2',
	endCell: 'F10',
	sheetName: 'Sheet1') ~> GoogleSheetsSource
```

## Next steps

For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
