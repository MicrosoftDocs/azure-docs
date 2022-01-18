---
# Mandatory fields.
title: Use data history feature (CLI)
titleSuffix: Azure Digital Twins
description: See how to set up and use data history for Azure Digital Twins, using the CLI.
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

# Use Azure Digital Twins data history

[!INCLUDE [digital-twins-data-history-selector.md](../../includes/digital-twins-data-history-selector.md)]

[Data history](concepts-data-history.md) is an Azure Digital Twins feature for automatically historizing twin data to [Azure Data Explorer](/azure/data-explorer/data-explorer-overview). This data can be queried using the [Azure Digital Twins query plugin for Azure Data Explorer](concepts-data-explorer-plugin.md) to gain insights about your environment over time.

This article shows how to set up a working data history connection between Azure Digital Twins and Azure Data Explorer. It uses the [Azure CLI](/cli/azure/what-is-azure-cli) to set up and connect the required data history resources, including:
* an Azure Digital Twins instance
* an [Event Hubs](../event-hubs/event-hubs-about.md) namespace containing an Event Hub
* an Azure Data Explorer cluster containing a database

It also contains a sample twin graph and telemetry scenario that you can use to see the historized twin updates in Azure Data Explorer. 

## Prerequisites

This article requires an active **Azure Digital Twins instance**. For instructions on how to set up an instance, see [Set up an Azure Digital Twins instance and authentication](./how-to-set-up-instance-portal.md).

This article also uses the **Azure CLI**. You can either [install the CLI locally](/cli/azure/install-azure-cli), or use the [Azure Cloud Shell](https://shell.azure.com) in a browser. Follow the steps in the next section to get your CLI session set up to work with Azure Digital Twins.

### Set up CLI session

To start working with Azure Digital Twins in the CLI, the first thing to do is log in and set the CLI context to your subscription for this session. Run these commands in your CLI window:

```azurecli-interactive
az login
az account set --subscription "<your-Azure-subscription-ID>"
```

> [!TIP]
> You can also use your subscription name instead of the ID in the command above. 

If this is the first time you've used this subscription with Azure Digital Twins, run this command to register with the Azure Digital Twins namespace. (If you're not sure, it's ok to run it again even if you've done it sometime in the past.)

```azurecli-interactive
az provider register --namespace 'Microsoft.DigitalTwins'
```

Next you'll add the [Microsoft Azure IoT Extension for Azure CLI](/cli/azure/service-page/azure%20iot?view=azure-cli-latest&preserve-view=true), to enable commands for interacting with Azure Digital Twins and other IoT services. Run this command to make sure you have the latest version of the extension:

```azurecli-interactive
az extension add --upgrade --name azure-iot
```

Now you are ready to work with Azure Digital Twins in the Azure CLI.

You can verify this by running `az dt --help` at any time to see a list of the top-level Azure Digital Twins commands that are available.

## Create an Event Hubs namespace and Event Hub

The first step in setting up a data history connection is creating an Event Hubs namespace and an event hub. This hub will be used to receive digital twin property update notifications from Azure Digital Twins, and forward the messages along to the target Azure Data Explorer cluster. For more information about Event Hubs and their capabilities, see the [Event Hubs documentation](../event-hubs/event-hubs-about.md).

Use the following CLI commands to create the required resources, replacing placeholder values with the names of your own resources.

Create an Event Hubs namespace:

```azurecli-interactive
az eventhubs namespace create --name <name-for-your-namespace> --resource-group <your-resource-group> -l <region>
```

Create an event hub in your namespace (uses the name of your namespace from above):

```azurecli-interactive
az eventhubs eventhub create --name <name-for-your-event-hub> --resource-group <your-resource-group> --namespace-name <namespace-name-from-above>
```

## Create a Kusto (Azure Data Explorer) cluster and database

Next, create a Kusto (Azure Data Explorer) cluster and database to receive the data from Azure Digital Twins.

Start by adding the Kusto extension to your CLI session, if you don't have it already. 

>[!NOTE]
>This extension is currently in preview.

```azurecli-interactive
az extension add -n kusto
```

Next, create the Kusto cluster. The command below requires 5-10 minutes to execute, and will create an E2a v4 cluster in the developer tier. This type of cluster has a single node for the engine and data-management cluster, and is applicable for development and test scenarios. For more information about the tiers in Azure Data Explorer and how to select the right options for your production workload, see [Select the correct compute SKU for your Azure Data Explorer cluster](/azure/data-explorer/manage-cluster-choose-sku) and [Azure Data Explorer Pricing](https://azure.microsoft.com/pricing/details/data-explorer).

```azurecli-interactive
az kusto cluster create --cluster-name <name-for-your-cluster> --sku name="Dev(No SLA)_Standard_E2a_v4" tier="Basic" --resource-group <your-resource-group> --location <region> --type SystemAssigned
```

Finally, create a database in your new Kusto cluster (using the cluster name from above and in the same location). This database will be used to store contextualized Azure Digital Twins data. The command below creates a database with a soft delete period of 365 days, and a hot cache period of 31 days. For more information about the options available for this command, see [az kusto database create](/cli/azure/kusto/database?view=azure-cli-latest&preserve-view=true#az_kusto_database_create).

```azurecli-interactive
az kusto database create --cluster-name <cluster-name-from-above> --database-name <name-for-your-database> --resource-group <your-resource-group> --read-write-database soft-delete-period=P365D hot-cache-period=P31D location=<region>
```

## Create a data history connection

Now that you've created the required resources, use the command below to create a data history connection between the Azure Digital Twins instance, the Event Hub, and the Azure Data Explorer cluster. By default, this command assumes all resources are in the same resource group as the Azure Digital Twins instance. You can also specify resources that are in different resource groups using the parameter options for this command, which can be displayed by running `az dt data-history create adx -h`.

```azurecli-interactive
az dt data-history create adx --cn <name-for-your-connection> --dt-name <Azure-Digital-Twins-instance-name> --adx-cluster-name <name-of-your-cluster> --adx-database-name <name-of-your-database> --eventhub <name-of-your-event-hub> --eventhub-namespace <name-of-your-Event-Hubs-namespace>
```

>[!NOTE]
> If you encounter the error "Could not create Azure Digital Twins instance connection. Unable to create table and mapping rule in database. Check your permissions for the Azure Database Explorer and run `az login` to refresh your credentials," resolve the error by adding yourself as an **AllDatabasesAdmin** under **Permissions** in your Azure Data Explorer cluster.
>
>If you're using the Cloud Shell and encounter the error "Failed to connect to MSI. Please make sure MSI is configured correctly," try running the command with a local Azure CLI installation instead.

Once the connection is set up, the default settings on your Azure Data Explorer cluster will result in an ingestion latency of approximately 10 minutes or less. You can reduce this latency by enabling [streaming ingestion](/azure/data-explorer/ingest-data-streaming) (less than 10 seconds of latency) or an [ingestion batching policy](/azure/data-explorer/kusto/management/batchingpolicy). For more information about Azure Data Explorer ingestion latency, see [End-to-end ingestion latency](concepts-data-history.md#end-to-end-ingestion-latency).

[!INCLUDE [digital-twins-data-history-test.md](../../includes/digital-twins-data-history-test.md)]

## Next steps

After historizing twin data to Azure Data Explorer, you can continue to query the data using the Azure Digital Twins query plugin for Azure Data Explorer. Read more about the plugin here: [Querying with the ADX plugin](concepts-data-explorer-plugin.md).