---
title: Copy data from Web Table
description: Learn about Web Table Connector that lets you copy data from a web table to data stores supported as sinks by Azure Data Factory and Synapse Analytics. 
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/20/2023
ms.author: jianleishen
---
# Copy data from Web table by using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from a Web table database. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

The difference among this Web table connector, the [REST connector](connector-rest.md) and the [HTTP connector](connector-http.md) are:

- **Web table connector** extracts table content from an HTML webpage.
- **REST connector** specifically support copying data from RESTful APIs.
- **HTTP connector** is generic to retrieve data from any HTTP endpoint, e.g. to download file. 

## Supported capabilities

This Web table connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

Specifically, this Web table connector supports **extracting table content from an HTML page**.

## Prerequisites

To use this Web table connector, you need to set up a Self-hosted Integration Runtime. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article for details.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Web Table using UI

Use the following steps to create a linked service to Web Table in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for Web and select the Web Table connector.

   :::image type="content" source="media/connector-web-table/web-table-connector.png" alt-text="Select the Web Table connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-web-table/configure-web-table-linked-service.png" alt-text="Configure a linked service to Web Table.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Web table connector.

## Linked service properties

The following properties are supported for Web table linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Web** |Yes |
| url | URL to the Web source |Yes |
| authenticationType | Allowed value is: **Anonymous**. |Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. A Self-hosted Integration Runtime is required as mentioned in [Prerequisites](#prerequisites). |Yes |

**Example:**

```json
{
    "name": "WebLinkedService",
    "properties": {
        "type": "Web",
        "typeProperties": {
            "url" : "https://en.wikipedia.org/wiki/",
            "authenticationType": "Anonymous"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Web table dataset.

To copy data from Web table, set the type property of the dataset to **WebTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **WebTable** | Yes |
| path |A relative URL to the resource that contains the table. |No. When path is not specified, only the URL specified in the linked service definition is used. |
| index |The index of the table in the resource. See [Get index of a table in an HTML page](#get-index-of-a-table-in-an-html-page) section for steps to getting index of a table in an HTML page. |Yes |

**Example:**

```json
{
    "name": "WebTableInput",
    "properties": {
        "type": "WebTable",
        "typeProperties": {
            "index": 1,
            "path": "AFI's_100_Years...100_Movies"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Web linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Web table source.

### Web table as source

To copy data from Web table, set the source type in the copy activity to **WebSource**, no additional properties are supported.

**Example:**

```json
"activities":[
    {
        "name": "CopyFromWebTable",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Web table input dataset name>",
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
                "type": "WebSource"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Get index of a table in an HTML page

To get the index of a table which you need to configure in [dataset properties](#dataset-properties), you can use e.g. Excel 2016 as the tool as follows:

1. Launch **Excel 2016** and switch to the **Data** tab.
2. Click **New Query** on the toolbar, point to **From Other Sources** and click **From Web**.

    :::image type="content" source="./media/copy-data-from-web-table/PowerQuery-Menu.png" alt-text="Power Query menu":::
3. In the **From Web** dialog box, enter **URL** that you would use in linked service JSON (for example: https://en.wikipedia.org/wiki/) along with path you would specify for the dataset (for example: AFI%27s_100_Years...100_Movies), and click **OK**.

    :::image type="content" source="./media/copy-data-from-web-table/FromWeb-DialogBox.png" alt-text="From Web dialog":::

    URL used in this example: https://en.wikipedia.org/wiki/AFI%27s_100_Years...100_Movies
4. If you see **Access Web content** dialog box, select the right **URL**, **authentication**, and click **Connect**.

   :::image type="content" source="./media/copy-data-from-web-table/AccessWebContentDialog.png" alt-text="Access Web content dialog box":::
5. Click a **table** item in the tree view to see content from the table and then click **Edit** button at the bottom.  

   :::image type="content" source="./media/copy-data-from-web-table/Navigator-DialogBox.png" alt-text="Navigator dialog":::
6. In the **Query Editor** window, click **Advanced Editor** button on the toolbar.

    :::image type="content" source="./media/copy-data-from-web-table/QueryEditor-AdvancedEditorButton.png" alt-text="Advanced Editor button":::
7. In the Advanced Editor dialog box, the number next to "Source" is the index.

    :::image type="content" source="./media/copy-data-from-web-table/AdvancedEditor-Index.png" alt-text="Advanced Editor - Index":::

If you are using Excel 2013, use [Microsoft Power Query for Excel](https://www.microsoft.com/download/details.aspx?id=39379) to get the index. See [Connect to a web page](https://support.office.com/article/Connect-to-a-web-page-Power-Query-b2725d67-c9e8-43e6-a590-c0a175bd64d8) article for details. The steps are similar if you are using [Microsoft Power BI for Desktop](https://powerbi.microsoft.com/desktop/).


## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
