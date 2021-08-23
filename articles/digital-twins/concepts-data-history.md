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

Data History is an integration feature of Azure Digital Twins. It connects an Azure Digital Twins instance to an [Azure Data Explorer (ADX)](https://docs.microsoft.com/en-us/azure/data-explorer/data-explorer-overview) cluster and automatically historizes digital twin property updates to ADX. The direct integration simplifies setup, reduces management overhead, and eliminates the need to write an Azure function to transform and historize twin property updates. Once the twin property values are historized to ADX, customers can run joint queries using the [Azure Digital Twins plugin for ADX](concepts-data-explorer-plugin.md) to reason across digital twins, their relationships, and time series data to gain insights into the behavior of modeled environments. Customers can also use these queries to power operational dashboards, enrich 2D and 3D web applications, and drive immersive AR/MR experiences to convey the current and historical state of assets, processes, and people modeled in Azure Digital Twins. 

## Data History architecture

Data History configures a connection between an Azure Digital Twins instance, an Event Hub, and an ADX cluster: 

:::image type="content" source="media/concepts-data-history/data-history-architecture.png" alt-text="Diagram showing the flow of telemetry data into Azure Digital Twins, through Event Hub, to Azure Data Explorer.":::

When a property in a digital twin is updated, Data History forwards a message containing the twin's updated property value and metadata to Event Hub. The Event Hub then forwards the message to the target ADX cluster. The ADX cluster maps the message fields to the Data History schema and stores the data as a timestamped record in a Data History table.

### Resources required to use Data History

Data History requires an Azure Digital Twins instance, an Event Hubs namespace with an Event Hub, and an ADX cluster with a database. The walkthrough below includes steps to provision these resources, create a Data History connection between them, and historize sample digital twin updates to ADX. To run the Data History commands in the CLI, you'll need to install a pre-release version of the [azure-iot](/cli/azure/iot?view=azure-cli-latest&preserve-view=true) CLI extension. If you already have these resources available in your account, you can connect them using the Azure CLI.

## Creating a Data History connection using the CLI

>[!NOTE]
> Run the following CLI commands a locally on your machine rather than in Cloud Shell to avoid a known [MSI issue in Cloud Shell](https://github.com/Azure/azure-cli/issues/17695).

Run az login before creating the connection ensure the CLI is running under a normal device login that enables ADX connections (Cloud shell can otherwise default to a restricted set of MSI Audience IDs, thereby blocking a Data History connection). 

```azurecli-interactive
az login
```

For access to the Data History CLI commands, install the preview version of the azure-iot plugin extension. First, ensure your Azure CLI is updated to the latest version.

```azurecli-interactive
az upgrade
```

If you already have the azure-iot plugin extension, remove it.

```azurecli-interactive
az extension remove --name azure-iot
```

Install the new pre-release azure IoT plugin extension.

```azurecli-interactive
az extension add --source https://datahistorypp.blob.core.windows.net/files/azure_iot-255.255.5.7-py3-none-any.whl
```

The CLI command below creates a data history connection between the resources mentioned above. On the Event Hub, it uses the $Default consumer group.

```azurecli-interactive
az dt data-history create adx -n {instance_name} 
--cn {time_series_database_connection_name}
--adx-cluster-name {adx_cluster_name} 
--adx-database-name {adx_database_name} 
--eventhub {event_hub} 
--eventhub-namespace {event_hub_namespace}
```

>[!NOTE]
> By default, this command assumes that all resources are in the same resource group as the Azure Digital Twins instance.  You can optionally select resources that are in different resource groups by using additional command line parameters. See Appendix 2 or run `az dt data-history create adx -h` for details on additional parameters.

For help on other Data History CLI commands, enter:

```azurecli-interactive
az dt data-history -h
```

## Schema for time series data in ADX

Below is the schema used to store twin property updates to ADX:

| Attribute | Type | Description |
| --- | --- | --- |
| TimeStamp | DateTime | The date/time the property update message was processed by Azure Digital Twins |
| Id | String | Twin ID |
| ModelId | String | DTDL model ID (DTMI) |
| Key | String | Name of the updated property |
| Value | Dynamic | Value of the update property |
| RelationshipId | String | For properties defined on relationships (as opposed to twins or devices), this column contains the ID of the relationship; otherwise, empty |
| RelationshipTarget | String | For properties defined on relationships, this column defines the twin ID of the twin targeted by the relationship |

Below is an example table of twin property updates stored to ADX.

| TimeStamp | Id | ModelId | Key | Value | RelationshipTarget | RelationshipID |
| --- | --- | --- | --- | --- | --- | --- |
| 2021-06-30T20:23:29.8697482Z | solar_plant_3 | dtmi:example:grid:plants:solarPlant;1 | Output | 130 |  |  |
| 2021-06-30T20:23:39.3235925Z| solar_plant_3 | dtmi:example:grid:plants:solarPlant;1 | Output | 140 |  |  |
| 2021-06-30T20:23:47.078367Z | solar_plant_3 | dtmi:example:grid:plants:solarPlant;1 | Output | 130 |  |  |
| 2021-06-30T20:23:57.3794198Z | solar_plant_3 | dtmi:example:grid:plants:solarPlant;1 | Output | 123 |  |  |

### Representing properties with multiple fields 

You may want to store a property in your schema with multiple fields. These properties are represented by storing a JSON object in the `Value` attribute of the schema.

For instance, if you're representing a property with three fields for roll, pitch, and yaw, Data History will store the following JSON object as the `Value`: `{"roll": 20, "pitch": 15, "yaw": 45}`.

## Next steps

Once twin data has been historized to Azure Data Explorer, you can use the Azure Digital Twins query plugin for Azure Data Explorer to run queries across the data. Read more about the plugin here: [Querying historized data](concepts-data-explorer-plugin.md).