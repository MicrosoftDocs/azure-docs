---
# Mandatory fields.
title: Data History (with Azure Data Explorer)
titleSuffix: Azure Digital Twins
description: Understand data history for Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 08/23/2021
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins Data History

**Data History** is an integration feature of Azure Digital Twins. It allows you to connect an Azure Digital Twins instance to an [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) cluster and automatically historize digital twin property updates to Azure Data Explorer. This direct integration simplifies setup, reduces management overhead, and is simpler than writing an Azure function to transform and historize twin property updates. 

Once twin property values are historized to Azure Data Explorer, customers can run joint queries using the [Azure Digital Twins plugin for Azure Data Explorer](concepts-data-explorer-plugin.md) to reason across digital twins, their relationships, and time series data to gain insights into the behavior of modeled environments. Customers can also use these queries to power operational dashboards, enrich 2D and 3D web applications, and drive immersive augmented/mixed reality experiences to convey the current and historical state of assets, processes, and people modeled in Azure Digital Twins. 

## Required resources and data flow

Data History requires the following resources:
* Azure Digital Twins instance
* [Event Hubs](../event-hubs/event-hubs-about.md) namespace containing an Event Hub
* Azure Data Explorer cluster containing a database 

These resources are connected into the following flow:

:::image type="content" source="media/concepts-data-history/data-history-architecture.png" alt-text="Diagram showing the flow of telemetry data into Azure Digital Twins, through Event Hub, to Azure Data Explorer.":::

Data moves through these resources in this order:
1. A property of a digital twin in Azure Digital Twins is updated.
1. Data History forwards a message containing the twin's updated property value and metadata to Event Hub. 
1. The Event Hub forwards the message to the target Azure Data Explorer cluster. 
1. The Azure Data Explorer cluster maps the message fields to the Data History schema, and stores the data as a timestamped record in a Data History table.

## Creating a Data History connection

Once all the [required resources](#required-resources-and-data-flow) are set up, you can use the [Azure CLI](/cli/azure/what-is-azure-cli) to create the Data History connection between them. The CLI command is part of the [az iot](/cli/azure/iot?view=azure-cli-latest&preserve-view=true) extension.

The command to create a Data History connection is shown below. You'll need to fill in placeholders to identify your resources. On the event hub, it uses the $Default consumer group.

```azurecli-interactive
az dt data-history create adx -n <Azure-Digital-Twins-instance-name>
--cn <time-series-database-connection-name>
--adx-cluster-name <Azure-Data-Explorer-cluster-name>
--adx-database-name <Azure-Data-Explorer-database-name> 
--eventhub <event-hub>
--eventhub-namespace <event-hub-namespace>
```

>[!NOTE]
>By default, this command assumes that all resources are in the same resource group as the Azure Digital Twins instance. You can optionally select resources that are in different resource groups by using additional command line parameters. For more information about additional parameters, run:
>
>```azurecli-interactive
>`az dt data-history create adx -h`
>```
>
>For help on other Data History CLI commands, run:
>
>```azurecli-interactive
>az dt data-history -h
>```

## Data schema

Time series data for twin property updates is stored in Azure Data Explorer with the following schema:

| Attribute | Type | Description |
| --- | --- | --- |
| `TimeStamp` | DateTime | The date/time the property update message was processed by Azure Digital Twins |
| `Id` | String | The twin ID |
| `ModelId` | String | The DTDL model ID (DTMI) |
| `Key` | String | The name of the updated property |
| `Value` | Dynamic | The value of the updated property |
| `RelationshipId` | String | For properties defined on relationships (as opposed to twins or devices), this column contains the ID of the relationship; otherwise, empty |
| `RelationshipTarget` | String | For properties defined on relationships, this column defines the twin ID of the twin targeted by the relationship; otherwise, empty |

Below is an example table of twin property updates stored to Azure Data Explorer.

| TimeStamp | Id | ModelId | Key | Value | RelationshipTarget | RelationshipID |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-06-30T20:23:29.8697482Z | solar_plant_3 | dtmi:example:grid:plants:solarPlant;1 | Output | 130 |  |  |
| 2021-06-30T20:23:39.3235925Z| solar_plant_3 | dtmi:example:grid:plants:solarPlant;1 | Output | 140 |  |  |
| 2021-06-30T20:23:47.078367Z | solar_plant_3 | dtmi:example:grid:plants:solarPlant;1 | Output | 130 |  |  |
| 2021-06-30T20:23:57.3794198Z | solar_plant_3 | dtmi:example:grid:plants:solarPlant;1 | Output | 123 |  |  |

### Representing properties with multiple fields 

You may need to store a property with multiple fields. These properties are represented with a JSON object in the `Value` attribute of the schema.

For instance, if you're representing a property with three fields for roll, pitch, and yaw, Data History will store the following JSON object as the `Value`: `{"roll": 20, "pitch": 15, "yaw": 45}`.

## Next steps

Once twin data has been historized to Azure Data Explorer, you can use the Azure Digital Twins query plugin for Azure Data Explorer to run queries across the data. Read more about the plugin here: [Querying historized data](concepts-data-explorer-plugin.md).

Or, dive deeper into Data History with an example scenario in this how-to: [Use Data History feature](how-to-use-data-history.md).