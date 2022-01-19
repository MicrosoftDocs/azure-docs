---
# Mandatory fields.
title: Use data history with Azure Data Explorer
titleSuffix: Azure Digital Twins
description: See how to set up and use data history for Azure Digital Twins, using the CLI or Azure portal.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 01/18/2022
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Use Azure Digital Twins data history

[Data history](concepts-data-history.md) is an Azure Digital Twins feature for automatically historizing twin data to [Azure Data Explorer](/azure/data-explorer/data-explorer-overview). This data can be queried using the [Azure Digital Twins query plugin for Azure Data Explorer](concepts-data-explorer-plugin.md) to gain insights about your environment over time.

This article shows how to set up a working data history connection between Azure Digital Twins and Azure Data Explorer. It uses the [Azure CLI](/cli/azure/what-is-azure-cli) and the [Azure portal](https://portal.azure.com) to set up and connect the required data history resources, including:
* an Azure Digital Twins instance
* an [Event Hubs](../event-hubs/event-hubs-about.md) namespace containing an Event Hub
* an [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) cluster containing a database

It also contains a sample twin graph and telemetry scenario that you can use to see the historized twin updates in Azure Data Explorer. 

## Prerequisites

This article requires an active **Azure Digital Twins instance**. For instructions on how to set up an instance, see [Set up an Azure Digital Twins instance and authentication](./how-to-set-up-instance-portal.md). Once the instance has been created, enable a **managed identity** for the instance using the instructions in [Enable system-managed identity for the instance](how-to-route-with-managed-identity.md#enable-system-managed-identity-for-the-instance).

This article also uses the **Azure CLI** and the latest version of the [Microsoft Azure IoT Extension for Azure CLI](/cli/azure/service-page/azure%20iot?view=azure-cli-latest&preserve-view=true). You can either [install the CLI locally](/cli/azure/install-azure-cli), or use the [Azure Cloud Shell](https://shell.azure.com) in a browser. Follow the steps in the next section to get your CLI session set up to work with Azure Digital Twins and data history.

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

The first step in setting up a data history connection is creating an Event Hubs namespace and an event hub. This hub will be used to receive digital twin property update notifications from Azure Digital Twins, and forward the messages along to the target Azure Data Explorer cluster. The Azure Digital Twins instance also needs to be granted the **Azure Event Hubs Data Owner** role on the event hub resource in order to set up the data history connection later.

For more information about Event Hubs and their capabilities, see the [Event Hubs documentation](../event-hubs/event-hubs-about.md).

# [CLI](#tab/cli) 

Use the following CLI commands to create the required resources, replacing placeholder values with the names of your own resources.

Create an Event Hubs namespace:

```azurecli-interactive
az eventhubs namespace create --name <name-for-your-namespace> --resource-group <your-resource-group> -l <region>
```

Create an event hub in your namespace (uses the name of your namespace from above):

```azurecli-interactive
az eventhubs eventhub create --name <name-for-your-event-hub> --resource-group <your-resource-group> --namespace-name <namespace-name-from-above>
```

# [Portal](#tab/portal)

Follow the instructions in [Create an event hub using Azure portal](../event-hubs/event-hubs-create.md) to create an **Event Hubs namespace** and an **event hub**. (The article also contains instructions on how to create a new resource group. You can create a new resource group for the Event Hubs resources, or skip that step and use an existing resource group for your new Event Hubs resources.)

Remember the names you give to these resources so you can use them later.

---

## Create a Kusto (Azure Data Explorer) cluster and database

Next, create a Kusto (Azure Data Explorer) cluster and database to receive the data from Azure Digital Twins. The Azure Digital Twins instance also needs to be granted the **Contributor** role on the cluster or database, and the **Admin** role on the database, in order to set up the data history connection later.

# [CLI](#tab/cli) 

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

# [Portal](#tab/portal)

Follow the instructions in [Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-database-portal?tabs=one-click-create-database) to create an **Azure Data Explorer cluster**  and a **database** in the cluster.

Remember the names you give to these resources so you can use them later.

---

## Create a data history connection

Now that you've created the required resources, use the command below to create a data history connection between the Azure Digital Twins instance, the Event Hub, and the Azure Data Explorer cluster. 

# [CLI](#tab/cli) 

Use the following command to create a data history connection. By default, this command assumes all resources are in the same resource group as the Azure Digital Twins instance. You can also specify resources that are in different resource groups using the parameter options for this command, which can be displayed by running `az dt data-history create adx -h`.

```azurecli-interactive
az dt data-history create adx --cn <name-for-your-connection> --dt-name <Azure-Digital-Twins-instance-name> --adx-cluster-name <name-of-your-cluster> --adx-database-name <name-of-your-database> --eventhub <name-of-your-event-hub> --eventhub-namespace <name-of-your-Event-Hubs-namespace>
```

>[!NOTE]
> If you encounter the error "Could not create Azure Digital Twins instance connection. Unable to create table and mapping rule in database. Check your permissions for the Azure Database Explorer and run `az login` to refresh your credentials," resolve the error by adding yourself as an **AllDatabasesAdmin** under **Permissions** in your Azure Data Explorer cluster.
>
>If you're using the Cloud Shell and encounter the error "Failed to connect to MSI. Please make sure MSI is configured correctly," try running the command with a local Azure CLI installation instead.

# [Portal](#tab/portal)

Start by navigating to your instance in the Azure portal (you can find the instance by entering its name into the portal search bar). Then complete the following steps.

1. Select **Data history** from the Connect Output section of the instance's menu.
    :::image type="content"  source="media/how-to-use-data-history/select-data-history.png" alt-text="Screenshot of the Azure portal showing the data history option in the menu for an Azure Digital Twins instance." lightbox="media/how-to-use-data-history/select-data-history.png":::

    Select **Create a connection**. This will begin the process of creating a data history connection.

2. If you **don't** have a [managed identity enabled for your Azure Digital Twins instance](how-to-route-with-managed-identity.md), you'll be asked to turn on Identity for the instance as the first step for the data history connection.
    :::image type="content"  source="media/how-to-use-data-history/authenticate.png" alt-text="Screenshot of the Azure portal showing the first step in the data history connection setup, Authenticate." lightbox="media/how-to-use-data-history/authenticate.png":::

    If you **do** have a managed identity enabled, your setup will go straight to the next page as the first step.

3. On the **Send** page, enter the details of the [Event Hubs resources](#create-an-event-hubs-namespace-and-event-hub) that you created earlier.
    :::image type="content"  source="media/how-to-use-data-history/send.png" alt-text="Screenshot of the Azure portal showing the Send step in the data history connection setup." lightbox="media/how-to-use-data-history/send.png":::

    If you have sufficient [permissions](#prerequisites) in your subscription to allow your instance to connect to the event hub, select the **Grant permission** box shown at the bottom of the page. If you don't have the required permissions, you'll see a warning instead suggesting you ask your administrator for the permissions.

    Select **Next**.

4. Next, on the **Store** page, enter the details of the [Azure Data Explorer resources](#create-a-kusto-azure-data-explorer-cluster-and-database) that you created earlier.
    :::image type="content"  source="media/how-to-use-data-history/store.png" alt-text="Screenshot of the Azure portal showing the Store step in the data history connection setup." lightbox="media/how-to-use-data-history/store.png":::

    If you have sufficient [permissions](#prerequisites) in your subscription to allow your instance to connect to the cluster, select the **Grant permission** box shown at the bottom of the page. If you don't have the required permissions, you'll see a warning instead suggesting you ask your administrator for the permissions.

    Select **Create connection**.

5. On the **Review + create** page, review the details of your resources and select **Create connection**.
    :::image type="content"  source="media/how-to-use-data-history/review-create.png" alt-text="Screenshot of the Azure portal showing the Review and Create step in the data history connection setup." lightbox="media/how-to-use-data-history/review-create.png":::

When the connection is finished creating, you'll see the **Data history details** page with a confirmation that you've successfully established a connection with Azure Data Explorer.

:::image type="content"  source="media/how-to-use-data-history/data-history-details.png" alt-text="Screenshot of the Azure portal showing the Data History Details page after setting up a connection." lightbox="media/how-to-use-data-history/data-history-details.png":::

---

After setting up the data history connection, you can optionally remove the roles granted to your Azure Digital Twins instance for accessing the Event Hubs and Azure Data Explorer resources. In order to use data history, the only role the instance needs going forward is **Azure Event Hubs Data Sender** (or a higher role that includes these permissions, such as **Azure Event Hubs Data Owner**) on the Event Hubs resource.

>[!NOTE]
>Once the connection is set up, the default settings on your Azure Data Explorer cluster will result in an ingestion latency of approximately 10 minutes or less. You can reduce this latency by enabling [streaming ingestion](/azure/data-explorer/ingest-data-streaming) (less than 10 seconds of latency) or an [ingestion batching policy](/azure/data-explorer/kusto/management/batchingpolicy). For more information about Azure Data Explorer ingestion latency, see [End-to-end ingestion latency](concepts-data-history.md#end-to-end-ingestion-latency).

## Create a twin graph and send telemetry to it

Now that your data history connection is set up, you can test it with data from your digital twins.

If you already have twins in your Azure Digital Twins instance that are receiving telemetry updates, you can skip this section and visualize the results using your own resources. 

Otherwise, continue through this section to set up a sample graph containing twins that can receive telemetry updates. 

You can set up a sample graph for this scenario using the **Azure Digital Twins Data Simulator**. The Azure Digital Twins Data Simulator continuously pushes telemetry to several twins in an Azure Digital Twins instance.

### Create a sample graph

You can use the **Azure Digital Twins Data Simulator** to provision a sample twin graph and push telemetry data to it. The twin graph created here models pasteurization processes for a dairy company.

Start by opening the [Azure Digital Twins Data Simulator](https://explorer.digitaltwins.azure.net/flights/data-pusher?web=1&wdLOR=c120562AB-645B-43EC-8FD0-E9A5A99DC417) web application in your browser.

:::image type="content"  source="media/how-to-use-data-history/data-simulator.png" alt-text="Screenshot of the Azure Digital Twins Data simulator. The screen shows configuration fields for Instance URL, Frequency of live stream data, and Simulation status, and a button to Generate environment.":::

Enter the **host name** of your Azure Digital Twins instance in the Instance URL field. The host name can be found in the [portal](https://portal.azure.com) page for your instance, and has a format like `<Azure-Digital-Twins-instance-name>.api.<region-code>.digitaltwins.azure.net`. Select **Generate Environment**. 

The elements under Simulation status will display checks once they've been created, and when the simulation is ready, the **Start simulation** button will become enabled. Select **Start simulation** to push simulated data to your Azure Digital Twins instance. To continuously update the twins in your Azure Digital Twins instance, keep this browser window in the foreground on your desktop (and complete other browser actions in a separate window). 

To verify that data is flowing through the data history pipeline, navigate to the [Azure portal](https://portal.azure.com) and open the Event Hubs namespace resource you created. You should see charts showing the flow of messages into and out of the namespace, indicating the flow of incoming messages from Azure Digital Twins and outgoing messages to Azure Data Explorer.

:::image type="content"  source="media/how-to-use-data-history/simulated-environment-portal.png" alt-text="Screenshot of the Azure portal showing an Event Hubs namespace for the simulated environment." lightbox="media/how-to-use-data-history/simulated-environment-portal.png":::

## View the historized twin updates in Azure Data Explorer

In this section, you'll view the historized twin updates being stored in Azure Data Explorer.

Start in the [Azure portal](https://portal.azure.com) and navigate to the Azure Data Explorer cluster you created earlier. Choose the **Databases** pane from the left menu to open the database view. Find the database you created for this article and select the checkbox next to it, then select **Query**.

:::image type="content"  source="media/how-to-use-data-history/azure-data-explorer-database.png" alt-text="Screenshot of the Azure portal showing a database in an Azure Data Explorer cluster.":::

Next, expand the cluster and database in the left pane to see the name of the table. You'll use this name to run queries on the table.

:::image type="content"  source="media/how-to-use-data-history/data-history-table.png" alt-text="Screenshot of the Azure portal showing the query view for the database. The name of the data history table is highlighted." lightbox="media/how-to-use-data-history/data-history-table.png":::

Copy the command below. The command will change the ingestion to [batched mode](concepts-data-history.md#batch-ingestion-default) and ingest every 10 seconds.

```kusto
.alter table <table-name> policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:10", "MaximumNumberOfItems": 500, "MaximumRawDataSizeMB": 1024}'
```

Paste the command into the query window, replacing the `<table-name>` placeholder with the name of your table. Select the **Run** button.

:::image type="content"  source="media/how-to-use-data-history/data-history-run-query-1.png" alt-text="Screenshot of the Azure portal showing the query view for the database. The Run button is highlighted." lightbox="media/how-to-use-data-history/data-history-run-query-1.png":::

Next, add the following command to the query window, and run it again to verify that Azure Data Explorer has ingested twin updates into the table.

>[!NOTE]
> It may take up to 5 minutes for the first batch of ingested data to appear.

```kusto
<table_name>
| count
```

You should see in the results that the count of items in the table is something greater than 0.

You can also add and run the following command to view 100 records in the table:

```kusto
<table_name>
| limit 100
```

Next, run a query based on the data of your twins to see the contextualized time series data. 

Use the query below to chart the **outflow** of all salt machine twins in the Oslo dairy. This Kusto query uses the Azure Digital Twins plugin to select the twins of interest, joins those twins against the data history time series in Azure Data Explorer, and then charts the results. Make sure to replace the `<ADT-instance>` placeholder with the URL of your instance, in the format `https://<instance-host-name>`.

```kusto
let ADTendpoint = "<ADT-instance>";
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

The results should show the outflow numbers changing over time.

:::image type="content"  source="media/how-to-use-data-history/data-history-run-query-2.png" alt-text="Screenshot of the Azure portal showing the query view for the database. The result for the example query is a line graph showing changing values over time for the salt machine outflows." lightbox="media/how-to-use-data-history/data-history-run-query-2.png":::

To keep exploring the dairy scenario, you can view [additional sample queries on GitHub](https://github.com/Azure-Samples/azure-digital-twins-getting-started/blob/main/adt-adx-queries/ContosoDairyDataHistoryQueries.kql) that show how you can monitor the performance of the dairy operation based on machine type, factory, type maintenance technician, and combinations of these parameters.

For more information on using the Azure Digital Twins query plugin for Azure Data Explorer, see the [documentation](concepts-data-explorer-plugin.md) and [blog](https://techcommunity.microsoft.com/t5/internet-of-things/adding-context-to-iot-data-just-became-easier/ba-p/2459987).

## Next steps

After historizing twin data to Azure Data Explorer, you can continue to query the data using the Azure Digital Twins query plugin for Azure Data Explorer. Read more about the plugin here: [Querying with the ADX plugin](concepts-data-explorer-plugin.md).