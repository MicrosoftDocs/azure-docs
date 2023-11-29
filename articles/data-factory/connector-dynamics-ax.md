---
title: Copy data from Dynamics AX
description: Learn how to copy data from Dynamics AX to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 10/20/2023
---

# Copy data from Dynamics AX using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from Dynamics AX source. The article builds on [Copy Activity](copy-activity-overview.md), which presents a general overview of Copy Activity.

## Supported capabilities

This Dynamics AX connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that supports as sources and sinks, see [Supported data stores](connector-overview.md#supported-data-stores).

Specifically, this Dynamics AX connector supports copying data from Dynamics AX using **OData protocol** with **Service Principal authentication**.

>[!TIP]
>You can also use this connector to copy data from **Dynamics 365 Finance and Operations**. Refer to Dynamics 365's [OData support](/dynamics365/unified-operations/dev-itpro/data-entities/odata) and [Authentication method](/dynamics365/unified-operations/dev-itpro/data-entities/services-home-page#authentication).

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Dynamics AX using UI

Use the following steps to create a linked service to Dynamics AX in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for Dynamics and select the Dynamics AX connector.

    :::image type="content" source="media/connector-dynamics-ax/dynamics-ax-connector.png" alt-text="Select the Dynamics AX connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-dynamics-ax/configure-dynamics-ax-linked-service.png" alt-text="Configure a linked service to Dynamics AX.":::

## Connector configuration details

The following sections provide details about properties you can use to define Data Factory entities that are specific to Dynamics AX connector.

## Prerequisites

To use service principal authentication, follow these steps:

1. Register an application with the Microsoft Identity platform. To learn how, see [Quickstart: Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md). Make note of these values, which you use to define the linked service:

    - Application ID
    - Application key
    - Tenant ID

2. Go to Dynamics AX, and grant this service principal proper permission to access your Dynamics AX.

## Linked service properties

The following properties are supported for Dynamics AX linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **DynamicsAX**. |Yes |
| url | The Dynamics AX (or Dynamics 365 Finance and Operations) instance OData endpoint. |Yes |
| servicePrincipalId | Specify the application's client ID. | Yes |
| servicePrincipalKey | Specify the application's key. Mark this field as a **SecureString** to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| tenant | Specify the tenant information (domain name or tenant ID) under which your application resides. Retrieve it by hovering the mouse in the top-right corner of the Azure portal. | Yes |
| aadResourceId | Specify the AAD resource you are requesting for authorization. For example, if your Dynamics URL is `https://sampledynamics.sandbox.operations.dynamics.com/data/`, the corresponding AAD resource is usually `https://sampledynamics.sandbox.operations.dynamics.com`. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. You can choose Azure Integration Runtime or a self-hosted Integration Runtime (if your data store is located in a private network). If not specified, the default Azure Integration Runtime is used. |No |

**Example**

```json
{
    "name": "DynamicsAXLinkedService",
    "properties": {
        "type": "DynamicsAX",
        "typeProperties": {
            "url": "<Dynamics AX instance OData endpoint>",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": {
                "type": "SecureString",
                "value": "<service principal key>"
            },
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>",
            "aadResourceId": "<AAD resource, e.g. https://sampledynamics.sandbox.operations.dynamics.com>"
        }
    },
    "connectVia": {
        "referenceName": "<name of Integration Runtime>",
        "type": "IntegrationRuntimeReference"
    }
}

```

## Dataset properties

This section provides a list of properties that the Dynamics AX dataset supports.

For a full list of sections and properties that are available for defining datasets, see [Datasets and linked services](concepts-datasets-linked-services.md). 

To copy data from Dynamics AX, set the **type** property of the dataset to **DynamicsAXResource**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the dataset must be set to **DynamicsAXResource**. | Yes |
| path | The path to the Dynamics AX OData entity. | Yes |

**Example**

```json
{
    "name": "DynamicsAXResourceDataset",
    "properties": {
        "type": "DynamicsAXResource",
        "typeProperties": {
            "path": "<entity path e.g. dd04tentitySet>"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Dynamics AX linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy Activity properties

This section provides a list of properties that the Dynamics AX source supports.

For a full list of sections and properties that are available for defining activities, see [Pipelines](concepts-pipelines-activities.md). 

### Dynamics AX as source

To copy data from Dynamics AX, set the **source** type in Copy Activity to **DynamicsAXSource**. The following properties are supported in the Copy Activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the Copy Activity source must be set to **DynamicsAXSource**. | Yes |
| query | OData query options for filtering data. Example: `"?$select=Name,Description&$top=5"`.<br/><br/>**Note**: The connector copies data from the combined URL: `[URL specified in linked service]/[path specified in dataset][query specified in copy activity source]`. For more information, see [OData URL components](https://www.odata.org/documentation/odata-version-3-0/url-conventions/). | No |
| httpRequestTimeout | The timeout (the **TimeSpan** value) for the HTTP request to get a response. This value is the timeout to get a response, not the timeout to read response data. If not specified, the default value is **00:05:00** (5 minutes). | No |

**Example**

```json
"activities":[
    {
        "name": "CopyFromDynamicsAX",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Dynamics AX input dataset name>",
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
                "type": "DynamicsAXSource",
                "query": "$top=10"
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

## Next steps

For a list of data stores that Copy Activity supports as sources and sinks, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).