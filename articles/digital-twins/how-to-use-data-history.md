---
# Mandatory fields.
title: Use Data History feature
titleSuffix: Azure Digital Twins
description: See how to set up and use Data History for Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 08/23/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Use Azure Digital Twins Data History

The walkthrough below sets up the required Data History resources (an Azure Digital Twins instance, an Event Hub and namespace, an Azure Data Explorer cluster and database), configures a connection between them, and demonstrates how property updates to a digital twin are historized to Azure Data Explorer. As part of this exercise, you will create a twin graph of a dairy operation, continuously update the twin graph with telemetry data, historize the twin updates to Azure Data Explorer, and run Azure Data Explorer queries to analyze selected operations in the dairy process.

To run the Data History commands in the CLI, you'll need to install a pre-release version of the [azure-iot](/cli/azure/iot?view=azure-cli-latest&preserve-view=true) CLI extension. If you already have these resources available in your account, you can connect them using the Azure CLI.

In each CLI command below, replace `<username>` with your Azure username (use Find/Replace in your own copy to make things go faster).  These commands use the region West Central US.  For private preview, your Azure Digital Twins instance must reside in this region or in or one of the other preview regions (westcentralus, westeurope, or australiaeast). 

## Prerequisites

Start by setting up an **Azure Digital Twins instance**. For instructions, see [Set up an Azure Digital Twins instance and authentication](./how-to-set-up-instance-portal.md).

### Set up Cloud Shell session
[!INCLUDE [Cloud Shell for Azure Digital Twins](../../includes/digital-twins-cloud-shell.md)]

## Create an Event Hub namespace and Event Hub

Create an Event Hubs namespace:

```azurecli-interactive
az eventhubs namespace create --name <username>DhNamespace --resource-group <username>DhTest -l westcentralus
```

Create an Event Hub:

```azurecli-interactive
az eventhubs eventhub create --name <username>DhEventHub --resource-group <username>DhTest --namespace-name <username>DhNamespace
```

## Create a Kusto (Azure Data Explorer) cluster and database

If you do not have it already, add the Kusto CLI extension (currently in preview):

```azurecli-interactive
az extension add -n kusto
```

Create the Kusto cluster (requires 5-10 minutes to execute).

```azurecli-interactive
az kusto cluster create --cluster-name <username>DhCluster --sku name="Dev(No SLA)_Standard_E2a_v4" tier="Basic" --resource-group <username>DhTest --location westcentralus --type SystemAssigned
```

>[!NOTE]
> The Dev/Test cluster provisioned above has a single node for the engine and data-management cluster. This cluster type is the lowest cost configuration because of its low instance count and no engine markup charge. Additionally, there's no SLA for this cluster configuration because it lacks redundancy. [Read more](/azure/data-explorer/manage-cluster-choose-sku) about how select the right Azure Data Explorer compute SKU for your production workload.

Create a database in your new Kusto cluster:

```azurecli-interactive
az kusto database create --cluster-name <username>DhCluster --database-name <username>DhDb --resource-group <username>DhTest --read-write-database soft-delete-period=P365D hot-cache-period=P31D location=westcentralus
```

## Create a Data History connection

Use the command below to create a Data History connection between the Azure Digital Twins instance, the Event Hub, and the Azure Data Explorer cluster:

```azurecli-interactive
az dt data-history create adx -n <username>DhAdtInstance --cn <username>DhConnection --adx-cluster-name <username>DhCluster --adx-database-name <username>DhDb --eventhub <username>DhEventHub --eventhub-namespace <username>DhNamespace
```

>[!NOTE]
> If you encounter the error "Could not create Azure Digital Twins instance connection. Unable to create table and mapping rule in database. Check your permissions for the Azure Database Explorer and run `az login` to refresh your credentials." you need to add yourself as a 'AllDatabasesAdmin' under 'Permissions' in your Azure Data Explorer cluster.
>
>If you encounter the error "Failed to connect to MSI. Please make sure MSI is configured correctly" and have [run the command in Cloud Shell](https://github.com/Azure/azure-cli/issues/17695), try running the command locally on your machine.

By default, in the command above all resources are in the same resource group as the Azure Digital Twins instance. You also can specify resources that are in different resource groups. Run az dt data-history create adx -h or see Appendix 2 for details on other parameters.

Once the connection is set up, the default settings on your Azure Data Explorer cluster will result in an ingestion latency of approximately 10 minutes or less. You can reduce this latency by enabling [streaming ingestion](/azure/data-explorer/ingest-data-streaming) (less than 10 seconds of latency) or an [ingestion batching policy](/azure/data-explorer/kusto/management/batchingpolicy). [View the historized twin updates in Azure Data Explorer](#view-the-historized-twin-updates-in-azure-data-explorer) later in this article applies a batching policy to accelerate ingestion into your cluster. Read more about Azure Data Explorer ingestion latency in [Appendix: End-to-end ingestion latency](#appendix-end-to-end-ingestion-latency).

## Create a twin graph and send telemetry to it

Next, create a twin graph in your Azure Digital Twins instance that can receive telemetry updates. To set up a sample graph, you can use either the Azure Digital Twins Data Simulator or the Azure CLI. The Azure Digital Twins Data Simulator continuously pushes telemetry to several twins in an Azure Digital Twins instance, whereas you can use the CLI to create and update a single twin in an ad-hoc manner.

# [Azure Digital Twins Data Simulator](#tab/data-simulator)

Use the Azure Digital Twins Data Simulator to provision a sample twin graph and push telemetry data to it. The twin graph models pasteurization processes for a dairy company.

Navigate to this [link](https://explorer.digitaltwins.azure.net/flights/data-pusher?web=1&wdLOR=c120562AB-645B-43EC-8FD0-E9A5A99DC417) to open the web application below.

:::image type="content" source="media/how-to-use-data-history/data-simulator.png" alt-text="Screenshot of the Azure Digital Twins Data simulator. The screen shows configuration fields for Instance URL, Frequency of live stream data, and Simulation status, and a button to Generate environment.":::

Enter the URL of your in instance and click "Generate Environment". Once you see green dots under "Simulation Status", click "Start Simulation" to push simulated data to your Azure Digital Twins instance. To continuously update the twins in your Azure Digital Twins instance, keep this browser window in the foreground on your desktop (i.e. open it in a tab in a separate window). 

Open the Azure portal and view the Event Hubs namespace resource you created. You should see charts showing the flow of messages into and out of the Namespace, indicating the flow of messages to from Azure Digital Twins to the Event Hub and back out to Azure Data Explorer.

:::image type="content" source="media/how-to-use-data-history/simulated-environment-portal.png" alt-text="Screenshot of the Azure portal showing an Event Hubs namespace for the simulated environment.":::

# [CLI](#tab/cli) 

Start by creating a DTDL model of a pump. Create a text file called *pump.json* on your computer.  Copy the below text and save it to the file.

```JSON
{
  "@id": "dtmi:example:Pump;1",
  "@type": "Interface",
  "displayName": "Pump",
  "contents": [
    {
      "@type": ["Property", "VolumeFlowRate"],
      "name": "Flow_Rate",
      "schema": "double",
      "unit": "litrePerSecond"
    },
    {
      "@type": ["Property", "AngularVelocity"],
      "name": "RPM",
      "schema": "double",
      "unit": "revolutionPerMinute"
    }
  ],
  "@context": "dtmi:dtdl:context;2"
}
```

Next, upload the model to Azure Digital Twins.  Run the Azure CLI command below from the same folder where you saved the model.

```azurecli-interactive
az dt model create --dt-name <username>DhAdtInstance --models pump.json
```

Create a digital twin based on the model:

```azurecli-interactive
az dt twin create --dt-name <username>DhAdtInstance --dtmi "dtmi:example:Pump;1" --twin-id pump_01 --properties '{"Flow_Rate":100, "RPM":1000}'
```

Apply updates to the twin to trigger Data History to historize the changes to Azure Data Explorer.

```azurecli-interactive
az dt twin update -n <username>DhAdtInstance --twin-id pump_01 --json-patch '[{"op":"replace", "path":"/Flow_Rate", "value": 110}, {"op":"replace", "path":"/RPM", "value": 1100}]'

az dt twin update -n <username>DhAdtInstance --twin-id pump_01 --json-patch '[{"op":"replace", "path":"/Flow_Rate", "value": 120}, {"op":"replace", "path":"/RPM", "value": 1200}]'

az dt twin update -n <username>DhAdtInstance --twin-id pump_01 --json-patch '[{"op":"replace", "path":"/Flow_Rate", "value": 130}, {"op":"replace", "path":"/RPM", "value": 1300}]'

az dt twin update -n <username>DhAdtInstance --twin-id pump_01 --json-patch '[{"op":"replace", "path":"/Flow_Rate", "value": 140}, {"op":"replace", "path":"/RPM", "value": 1400}]'
```

---

## View the historized twin updates in Azure Data Explorer

In the Portal, navigate to the Azure Data Explorer cluster you created earlier.  Click on Databases in the left nav.  Click the checkbox next to the database you created, then click Query.

:::image type="content" source="media/how-to-use-data-history/azure-data-explorer-database.png" alt-text="Screenshot of the Azure portal showing a database in an Azure Data Explorer cluster.":::

Next, get the name of the Data History table in the left-hand column.

:::image type="content" source="media/how-to-use-data-history/data-history-table.png" alt-text="Screenshot of the Azure portal showing the query view for the database. The name of the Data History table is highlighted.":::

Replace `<table_name>` in the below Kusto queries with this table name.

Run the below command to change ingestion to batched mode and ingest every 10 seconds.

```kusto
.alter table <table_name> policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:10", "MaximumNumberOfItems": 500, "MaximumRawDataSizeMB": 1024}'
```

After pasting the updated command, click the Run button. 

Confirm that Azure Data Explorer has ingested twin updates into the table by running the following command.  It may take up to 5 minutes for the first batch of ingested data to appear.

```kusto
<table_name>
| count
```

View 100 records in the table:

```kusto
<table_name>
| limit 100
```

Next, chart the **outflow** of all salt machine twins in the Oslo dairy (Azure Digital Twins Data Pusher example).  In the query below, update `<ADT-instance>` with the URL of your instance, starting with `https://`.  This Kusto query uses the Azure Digital Twins plugin to select the twins of interest, joins those twins against the Data History time series in Azure Data Explorer, and then charts the results.

```kusto
let ADTendpoint = <ADT-instance>;
let ADTquery = ```SELECT SALT_MACHINE.$dtId as tid
FROM DIGITALTWINS FACTORY 
JOIN SALT_MACHINE RELATED FACTORY.contains 
WHERE FACTORY.$dtId = 'OsloFactory'
AND IS_OF_MODEL(SALT_MACHINE , 'dtmi:assetGen:SaltMachine;1')```;
evaluate azure_digital_twins_query_request(ADTendpoint, ADTquery)
| extend Id = tostring(tid)
| join kind=inner (<table_name>) on Id
| extend val_double = todouble(Value)
| where Key == "OutFlow"
| render timechart with (ycolumns = val_double)
```

For more information on how to use the Azure Digital Twins plugin for Azure Data Explorer, see the [documentation](concepts-data-explorer-plugin.md), [blog](https://techcommunity.microsoft.com/t5/internet-of-things/adding-context-to-iot-data-just-became-easier/ba-p/2459987), and [sample Kusto queries on GitHub](https://github.com/Azure-Samples/azure-digital-twins-getting-started/tree/main/adt-adx-queries).

## Appendix: End-to-end ingestion latency

Azure Digital Twins Data History builds on the existing ingestion mechanism provided by Azure Data Explorer. Azure Digital Twins will ensure that property updates are made available to Azure Data Explorer within less than two seconds. Additional latency may be introduced by Azure Data Explorer ingesting the data. 

There are two methods in Azure Data Explorer for ingesting data: streaming ingestion and batch ingestion. These can be configured for individual tables by a customer according to their needs and the specific data ingestion scenario. Streaming ingestion has the lowest latency. However, due to processing overhead, this mode should only be used if less than 4GB of data is ingested every hour. Batch ingestion works best if high ingestion data rates are expected. Azure Data Explorer uses batch ingestion by default. The following table summarizes the expected worst-case end-to-end latency: 

| Azure Data Explorer configuration | Expected end-to-end latency | Recommended data rate |
| --- | --- | --- |
| Streaming ingestion | <12 sec (<3 sec typical) | <4 GB / hr |
| Batch ingestion | Varies (12 sec-15 m, depending on configuration) | >4 GB / hr

### Batch ingestion (default)

If not configured otherwise, Azure Data Explorer will use **batch ingestion**. The default settings may lead to data being available for query only 5-10 minutes after an update to a digital twin was performed. The ingestion policy can be altered, such that the batch processing occurs at most every 10 seconds (at minimum; or 15 minutes at maximum). To alter the ingestion policy, the following command must be issued in the Azure Data Explorer query view: 

```kusto
.alter table <table_name> policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:10", "MaximumNumberOfItems": 500, "MaximumRawDataSizeMB": 1024}' 
```

Ensure that `<table_name>` is replaced with the name of the table that was set up for you. MaximumBatchingTimeSpan should be set to the preferred batching interval. Please note that it may take 5-10 minutes for the policy to take effect. You can read more about ingestion batching at the following link: [Kusto IngestionBatching policy management command](/azure/data-explorer/kusto/management/batching-policy). 

### Streaming ingestion 

Enabling streaming ingestion is a 2-step process: 
1. Enable streaming ingestion for your cluster. This only has to be done once. (Warning: This will have an impact on the amount of storage available for hot cache, and may introduce additional limitations). 
2. Add a streaming ingestion policy for the desired table. You can read more about enabling streaming ingestion for your cluster in the Azure Data Explorer documentation: [Kusto IngestionBatching policy management command](/azure/data-explorer/kusto/management/batching-policy). 

To enable streaming ingestion for your Azure Digital Twins data history table, the following command must be issued in the Azure Data Explorer query pane: 

```kusto
.alter table <table_name> policy streamingingestion enable 
```

Ensure that `<table_name>` is replaced with the name of the table that was set up for you. Please note that it may take 5-10 minutes for the policy to take effect. 

## Next steps

Once twin data has been historized to Azure Data Explorer, you can use the Azure Digital Twins query plugin for Azure Data Explorer to run queries across the data. Read more about the plugin here: [Querying historized data](concepts-data-explorer-plugin.md).