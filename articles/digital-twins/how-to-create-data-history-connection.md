---
title: Create a data history connection
titleSuffix: Azure Digital Twins
description: See how to set up a data history connection for historizing Azure Digital Twins updates into Azure Data Explorer.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 06/29/2023
ms.topic: how-to
ms.service: digital-twins
ms.custom: event-tier1-build-2022, devx-track-azurecli

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Create a data history connection for Azure Digital Twins

[Data history](concepts-data-history.md) is an Azure Digital Twins feature for automatically historizing graph updates to [Azure Data Explorer](/azure/data-explorer/data-explorer-overview). This data can be queried using the [Azure Digital Twins query plugin for Azure Data Explorer](concepts-data-explorer-plugin.md) to gain insights about your environment over time.

This article shows how to set up a working data history connection between Azure Digital Twins and Azure Data Explorer. It uses the [Azure CLI](/cli/azure/what-is-azure-cli) and the [Azure portal](https://portal.azure.com) to set up and connect the required data history resources, including:
* an Azure Digital Twins instance
* an [Event Hubs](../event-hubs/event-hubs-about.md) namespace containing an event hub
* an [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) cluster containing a database

It also contains a sample twin graph that you can use to see the historized graph updates in Azure Data Explorer. 

>[!TIP]
>Although this article uses the Azure portal, you can also work with data history using the [2022-05-31](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/data-plane/Microsoft.DigitalTwins/stable/2022-05-31) version of the rest APIs.

## Prerequisites

[!INCLUDE [azure-cli-prepare-your-environment-h3.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

>[!NOTE]
> You can also use Azure Cloud Shell in the PowerShell environment instead of the Bash environment, if you prefer. The commands on this page are written for the Bash environment, so they may require some small adjustments to be run in PowerShell.

[!INCLUDE [CLI setup for Azure Digital Twins](../../includes/digital-twins-cli.md)]

### Set up local variables for CLI session

This article provides CLI commands that you can use to create the data history resources. In order to make it easy to copy and run those commands later, you can set up local variables in your CLI session now, and then refer to those variables later in the CLI commands when creating your resources. Update the placeholders (identified with `<...>` brackets) in the commands below, and run these commands to create the variables. Make sure to follow the naming rules described in the comments. These values will be used later when creating the new resources.

>[!NOTE]
>These commands are written for the Bash environment. They can be adjusted for PowerShell if you prefer to use a PowerShell CLI environment.

```azurecli-interactive
## General Setup
location="<your-resource-region>"
resourcegroup="<your-resource-group-name>"

## Azure Digital Twins Setup
# Instance name can contain letters, numbers, and hyphens. It must start and end with a letter or number, and be between 4 and 62 characters long.
dtname="<name-for-your-digital-twins-instance>"
# Connection name can contain letters, numbers, and hyphens. It must contain at least one letter, and be between 3 and 50 characters long.
connectionname="<name-for-your-data-history-connection>"

## Event Hub Setup
# Namespace can contain letters, numbers, and hyphens. It must start with a letter, end with a letter or number, and be between 6 and 50 characters long.
eventhubnamespace="<name-for-your-event-hub-namespace>"
# Event hub name can contain only letters, numbers, periods, hyphens and underscores. It must start and end with a letter or number.
eventhub="<name-for-your-event-hub>"

## Azure Data Explorer Setup
# Cluster name can contain only lowercase alphanumeric characters. It must start with a letter, and be between 4 and 22 characters long.
clustername="<name-for-your-cluster>"  
# Database name can contain only alphanumeric, spaces, dash and dot characters, and be up to 260 characters in length.
databasename="<name-for-your-database>"

# Enter a name for the table where relationship create and delete events will be stored.
relationshiplifecycletablename="<name-for-your-relationship-lifecycle-events-table>"
# Enter a name for the table where twin create and delete events will be stored.
twinlifecycletablename="<name-for-your-twin-lifecycle-events-table>"
# Optionally, enter a custom name for the table where twin property updates will be stored. If not provided, the table will be named AdtPropertyEvents.
twinpropertytablename="<name-for-your-twin-property-events-table>"
```

## Create an Azure Digital Twins instance with a managed identity

If you already have an Azure Digital Twins instance, ensure that you've enabled a [system-assigned managed identity](how-to-set-up-instance-cli.md#system-assigned-identity-commands) for it.

If you don't have an Azure Digital Twins instance, follow the instructions in [Create the instance with a managed identity](how-to-set-up-instance-cli.md#system-assigned-identity-command) to create an Azure Digital Twins instance with a system-assigned managed identity for the first time.

Then, make sure you have *Azure Digital Twins Data Owner* role on the instance. You can find instructions in [Set up user access permissions](how-to-set-up-instance-cli.md#set-up-user-access-permissions).

## Create an Event Hubs namespace and event hub

The next step is to create an Event Hubs namespace and an event hub. This hub will receive graph lifecycle and property update notifications from the Azure Digital Twins instance and then forward the messages to the target Azure Data Explorer cluster. 

As part of the [data history connection setup](#set-up-data-history-connection) later, you'll grant the Azure Digital Twins instance the *Azure Event Hubs Data Owner* role on the event hub resource.

For more information about Event Hubs and their capabilities, see the [Event Hubs documentation](../event-hubs/event-hubs-about.md).

>[!NOTE]
>While setting up data history, local authorization must be *enabled* on the event hub. If you ultimately want to have local authorization disabled on your event hub, disable the authorization after setting up the connection. You'll also need to adjust some permissions, described in [Restrict network access to data history resources](#restrict-network-access-to-data-history-resources) later in this article.

# [CLI](#tab/cli) 

Use the following CLI commands to create the required resources. The commands use several local variables (`$location`, `$resourcegroup`, `$eventhubnamespace`, and `$eventhub`) that were created earlier in [Set up local variables for CLI session](#set-up-local-variables-for-cli-session).

Create an Event Hubs namespace:

```azurecli-interactive
az eventhubs namespace create --name $eventhubnamespace --resource-group $resourcegroup --location $location
```

Create an event hub in your namespace:

```azurecli-interactive
az eventhubs eventhub create --name $eventhub --resource-group $resourcegroup --namespace-name $eventhubnamespace
```

# [Portal](#tab/portal)

Follow the instructions in [Create an event hub using Azure portal](../event-hubs/event-hubs-create.md) to create an Event Hubs namespace and an event hub. (The article also contains instructions on how to create a new resource group. You can create a new resource group for the Event Hubs resources, or skip that step and use an existing resource group for your new Event Hubs resources.)

Remember the names you give to these resources so you can use them later.

---

## Create a Kusto (Azure Data Explorer) cluster and database

Next, create a Kusto (Azure Data Explorer) cluster and database to receive the data from Azure Digital Twins. 

As part of the [data history connection setup](#set-up-data-history-connection) later, you'll grant the Azure Digital Twins instance the *Contributor* role on at least the database (it can also be scoped to the cluster), and the *Admin* role on the database.

>[!IMPORTANT]
>Make sure that the cluster has public network access enabled. If the Azure Data Explorer cluster has [public network access disabled](/azure/data-explorer/security-network-restrict-public-access), Azure Digital Twins will be unable to configure the tables and other required artifacts, and data history setup will fail.

# [CLI](#tab/cli) 

Use the following CLI commands to create the required resources. The commands use several local variables (`$location`, `$resourcegroup`, `$clustername`, and `$databasename`) that were created earlier in [Set up local variables for CLI session](#set-up-local-variables-for-cli-session).

Start by adding the Kusto extension to your CLI session, if you don't have it already.

```azurecli-interactive
az extension add --name kusto
```

Next, create the Kusto cluster. The command below requires 5-10 minutes to execute, and will create an E2a v4 cluster in the developer tier. This type of cluster has a single node for the engine and data-management cluster, and is applicable for development and test scenarios. For more information about the tiers in Azure Data Explorer and how to select the right options for your production workload, see [Select the correct compute SKU for your Azure Data Explorer cluster](/azure/data-explorer/manage-cluster-choose-sku) and [Azure Data Explorer Pricing](https://azure.microsoft.com/pricing/details/data-explorer).

```azurecli-interactive
az kusto cluster create --cluster-name $clustername --sku name="Dev(No SLA)_Standard_E2a_v4" tier="Basic" --resource-group $resourcegroup --location $location --type SystemAssigned
```

Create a database in your new Kusto cluster (using the cluster name from above and in the same location). This database will be used to store contextualized Azure Digital Twins data. The command below creates a database with a soft delete period of 365 days, and a hot cache period of 31 days. For more information about the options available for this command, see [az kusto database create](/cli/azure/kusto/database?view=azure-cli-latest&preserve-view=true#az-kusto-database-create).

```azurecli-interactive
az kusto database create --cluster-name $clustername --database-name $databasename --resource-group $resourcegroup --read-write-database soft-delete-period=P365D hot-cache-period=P31D location=$location
```

# [Portal](#tab/portal)

Follow the instructions in [Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-database-portal?tabs=one-click-create-database) to create an Azure Data Explorer cluster and a database in the cluster.

Remember the names you give to these resources so you can use them later.

---

## Set up data history connection

Now that you've created the required resources, use the command in this section to create a data history connection between the Azure Digital Twins instance, the event hub, and the Azure Data Explorer cluster. 

This command will also create three tables in your Azure Data Explorer database to store twin property updates, twin lifecycle events, and relationship lifecycle events, respectively. For more information about these types of historized data and their corresponding Azure Data Explorer tables, see [Data types and schemas](concepts-data-history.md#data-types-and-schemas).

# [CLI](#tab/cli) 

Use the command in this section to create a data history connection and the tables in Azure Data Explorer. The command will always create a table for historized twin property events, and it includes parameters to create the tables for relationship lifecycle and twin lifecycle events.

>[!NOTE]
>By default, this command assumes all resources are in the same resource group as the Azure Digital Twins instance. You can specify resources that are in different resource groups using the [parameter options](/cli/azure/dt/data-history/connection/create#az-dt-data-history-connection-create-adx) for this command.

The command below uses local variables that were created earlier in [Set up local variables for CLI session](#set-up-local-variables-for-cli-session) and has several parameters, including...
* The names of the relationship lifecycle and twin lifecycle tables in Azure Data Explorer (these parameters are optional if you don't want to historize these event types, but required if you do want to historize these event types)
* An optional parameter to specify the name of the twin property event table (if this value is not provided, this table will be named *AdtPropertyEvents* by default) 
* The optional parameter `--adx-record-removals` to turn on historization for twin property deletions (events that remove properties entirely)

```azurecli-interactive
az dt data-history connection create adx --dt-name $dtname --cn $connectionname --adx-cluster-name $clustername --adx-database-name $databasename --eventhub $eventhub --eventhub-namespace $eventhubnamespace --adx-property-events-table $twinpropertytablename --adx-twin-events-table $twinlifecycletablename --adx-relationship-events-table $relationshiplifecycletablename --adx-record-removals true
```

When executing the above command, you'll be given the option of assigning the necessary permissions required for setting up your data history connection on your behalf (if you've already assigned the necessary permissions, you can skip these prompts). These permissions are granted to the managed identity of your Azure Digital Twins instance. The minimum required roles are:
* Azure Event Hubs Data Owner on the event hub
* Contributor scoped at least to the specified database (it can also be scoped to the cluster)
* Database principal assignment with role Admin (for table creation / management) scoped to the specified database

For regular data plane operation, these roles can be reduced to a single Azure Event Hubs Data Sender role, if desired.

# [Portal](#tab/portal)

Start by navigating to your Azure Digital Twins instance in the Azure portal (you can find the instance by entering its name into the portal search bar). Then complete the following steps.

1. Select **Data history** from the Connect Outputs section of the instance's menu.
    :::image type="content"  source="media/how-to-create-data-history-connection/select-data-history.png" alt-text="Screenshot of the Azure portal showing the data history option in the menu for an Azure Digital Twins instance." lightbox="media/how-to-create-data-history-connection/select-data-history.png":::

    Select **Create a connection**. Doing so will begin the process of creating a data history connection.

2. **(SOME USERS)** If you **don't** already have a [managed identity enabled for your Azure Digital Twins instance](how-to-set-up-instance-portal.md#enabledisable-managed-identity-for-the-instance), you'll see this page first, asking you to turn on Identity for the instance as the first step for the data history connection.

    :::image type="content"  source="media/how-to-create-data-history-connection/authentication.png" alt-text="Screenshot of the Azure portal showing the first step in the data history connection setup, Authentication." lightbox="media/how-to-create-data-history-connection/authentication.png":::

    If you **do** already have a managed identity enabled, your setup will **skip this step** and you'll see the next page immediately.

3. On the **Send** page, enter the details of the [Event Hubs resources](#create-an-event-hubs-namespace-and-event-hub) that you created earlier.
    :::image type="content"  source="media/how-to-create-data-history-connection/send.png" alt-text="Screenshot of the Azure portal showing the Send step in the data history connection setup." lightbox="media/how-to-create-data-history-connection/send.png":::

    Select **Next**.

4. On the **Store** page, enter the details of the [Azure Data Explorer resources](#create-a-kusto-azure-data-explorer-cluster-and-database) that you created earlier. You can choose a custom name for the table that will store twin property updates, or leave it blank to use the default table name of *AdtPropertyEvents*, and you can choose whether twin property deletions (events that remove properties entirely) should be included with the historized data. If you want to historize twin lifecycle and relationship lifecycle events, enter custom names for these tables. 
    :::image type="content"  source="media/how-to-create-data-history-connection/store.png" alt-text="Screenshot of the Azure portal showing the Store step in the data history connection setup." lightbox="media/how-to-create-data-history-connection/store.png":::

    Select **Next**.

5. On the **Permission** page, select all of the checkboxes to give your Azure Digital Twins instance permission to connect to the Event Hubs and Azure Data Explorer resources. If you already have equal or higher permissions in place, you can skip this step.
    :::image type="content"  source="media/how-to-create-data-history-connection/permission.png" alt-text="Screenshot of the Azure portal showing the Permission step in the data history connection setup." lightbox="media/how-to-create-data-history-connection/permission.png":::

    Select **Next**. 

6. On the **Review + create** page, review the details of your resources and select **Create connection**.
    :::image type="content"  source="media/how-to-create-data-history-connection/review-create.png" alt-text="Screenshot of the Azure portal showing the Review and Create step in the data history connection setup." lightbox="media/how-to-create-data-history-connection/review-create.png":::

When the connection is finished creating, you'll be taken back to the **Data history** page for the Azure Digital Twins instance, which now shows details of the data history connection you've created.

:::image type="content"  source="media/how-to-create-data-history-connection/data-history-details.png" alt-text="Screenshot of the Azure portal showing the Data History Details page after setting up a connection." lightbox="media/how-to-create-data-history-connection/data-history-details.png":::

---

After setting up the data history connection, you can optionally remove the roles granted to your Azure Digital Twins instance for accessing the Event Hubs and Azure Data Explorer resources. In order to use data history, the only role the instance needs going forward is *Azure Event Hubs Data Sender* (or a higher role that includes these permissions, such as *Azure Event Hubs Data Owner*) on the Event Hubs resource.

>[!NOTE]
>Once the connection is set up, the default settings on your Azure Data Explorer cluster will result in an ingestion latency of approximately 10 minutes or less. You can reduce this latency by enabling [streaming ingestion](/azure/data-explorer/ingest-data-streaming) (less than 10 seconds of latency) or an [ingestion batching policy](/azure/data-explorer/kusto/management/batchingpolicy). For more information about Azure Data Explorer ingestion latency, see [End-to-end ingestion latency](concepts-data-history.md#end-to-end-ingestion-latency).

### Restrict network access to data history resources

If you'd like to restrict network access to the resources involved in data history (your Azure Digital Twins instance, event hub, or Azure Data Explorer cluster), you should set those restrictions *after* setting up the data history connection. This includes disabling local access for your resources, among other measures to reduce network access.

To make sure your data history resources can communicate with each other, you should also modify the data connection for the Azure Data Explorer database to use a system-assigned managed identity.

Follow the order of steps below to make sure your data history connection is set up properly when your resources need reduced network access.
1. Make sure local authorization is *enabled* on your data history resources (your Azure Digital Twins instance, event hub, and Azure Data Explorer cluster)
1. [Create the data history connection](#set-up-data-history-connection)
1. Update the data connection for the Azure Data Explorer database to use a system-assigned managed identity. In the Azure portal, you can do this by navigating to the Azure Data Explorer cluster and using **Databases** in the menu to navigate to the data history database. In the database menu, select **Data connections**. In the table entry for your data history connection, you should see the option to **Assign managed identity**, where you can choose **System-assigned**.
    :::image type="content" source="media/how-to-create-data-history-connection/database-managed-identity.png" alt-text="Screenshot of the option to assign a managed identity to a data connection in the Azure portal." lightbox="media/how-to-create-data-history-connection/database-managed-identity.png":::
1. Now, you can disable local authorization or set other network restrictions for your desired resources, by changing the access settings on your Azure Digital Twins instance, event hub, or Azure Data Explorer cluster.

### Troubleshoot connection setup

Here are a few common errors you might encounter when setting up a data history connection, and how to resolve them.

* If you have public network access disabled for your Azure Data Explorer cluster, you'll encounter an error that the service failed to create the data history connection, with the message "The resource could not ACT due to an internal server error." Data history setup will fail if the Azure Data Explorer cluster has [public network access disabled](/azure/data-explorer/security-network-restrict-public-access), since Azure Digital Twins will be unable to configure the tables and other required artifacts.
* (CLI users) If you encounter the error "Could not create Azure Digital Twins instance connection. Unable to create table and mapping rule in database. Check your permissions for the Azure Database Explorer and run `az login` to refresh your credentials," resolve the error by adding yourself as an *AllDatabasesAdmin* under Permissions in your Azure Data Explorer cluster.
* (Cloud Shell users) If you're using the Cloud Shell and encounter the error "Failed to connect to MSI. Please make sure MSI is configured correctly," try running the command with a local Azure CLI installation instead.

## Verify with a sample twin graph

Now that your data history connection is set up, you can test it with data from your digital twins.

If you already have twins in your Azure Digital Twins instance that are actively receiving graph updates (including twin property updates or updates from changing the structure of the graph by creating or deleting elements), you can skip this section and visualize the results using your own resources. 

Otherwise, continue through this section to set up a sample graph that will undergo twin and relationship lifecycle events and generate twin property updates. 

You can set up a sample graph for this scenario using the **Azure Digital Twins Data Simulator**. The Azure Digital Twins Data Simulator creates twins and relationships in your Azure Digital Twins instance, and continuously pushes property updates to the twins.

### Create a sample graph

You can use the **Azure Digital Twins Data Simulator** to provision a sample twin graph and push property updates to it. The twin graph created here models pasteurization processes for a dairy company.

Start by opening the [Azure Digital Twins Data Simulator](https://explorer.digitaltwins.azure.net/tools/data-pusher) in your browser. Set these fields:
* **Instance URL**: Enter the host name of your Azure Digital Twins instance. The host name can be found in the [portal](https://portal.azure.com) page for your instance, and has a format like `<Azure-Digital-Twins-instance-name>.api.<region-code>.digitaltwins.azure.net`. 
* **Simulation Type**: Select *Dairy facility* from the dropdown menu.

Select **Generate Environment**.

:::image type="content"  source="media/how-to-create-data-history-connection/data-simulator.png" alt-text="Screenshot of the Azure Digital Twins Data simulator.":::

You'll see confirmation messages on the screen as models, twins, and relationships are created in your environment. This will also generate twin and relationship creation events, which will be historized to Azure Data Explorer as twin and relationship lifecycle events, respectively.

When the simulation is ready, the **Start simulation** button will become enabled. Scroll down and select **Start simulation** to push simulated data to your Azure Digital Twins instance. To continuously update the twins in your Azure Digital Twins instance, keep this browser window in the foreground on your desktop and complete other browser actions in a separate window. This will continuously generate twin property updates events that will be historized to Azure Data Explorer.

#### Verify data flow

To verify that data is flowing through the data history pipeline, you can use the [data history validation in Azure Digital Twins Explorer](how-to-use-azure-digital-twins-explorer.md#validate-and-explore-historized-properties). 

1. Navigate to the [Azure Digital Twins Explorer](https://explorer.digitaltwins.azure.net/) and ensure it's [connected to the right instance](how-to-use-azure-digital-twins-explorer.md#switch-contexts-within-the-app).

1. Use the instructions in [Validate and explore historized properties](how-to-use-azure-digital-twins-explorer.md#validate-and-explore-historized-properties) to choose a historized twin property to visualize in the chart.

If you see data being populated in the chart, this means that Azure Digital Twins update events are being successfully stored in Azure Data Explorer.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/data-history-explorer-chart.png" alt-text="Screenshot of the Data history explorer showing a chart of historized values for a property." lightbox="media/how-to-use-azure-digital-twins-explorer/data-history-explorer-chart.png":::

If you *don't* see data in the chart, the historization data flow isn't working properly. You can investigate the issue by viewing your Event Hubs namespace in the [Azure portal](https://portal.azure.com), which displays charts showing the flow of messages into and out of the namespace. This will allow you to verify both the flow of incoming messages from Azure Digital Twins and the outgoing messages to Azure Data Explorer, to help you identify which part of the flow isn't working.

:::image type="content"  source="media/how-to-create-data-history-connection/simulated-environment-portal.png" alt-text="Screenshot of the Azure portal showing an Event Hubs namespace for the simulated environment." lightbox="media/how-to-create-data-history-connection/simulated-environment-portal.png":::

### View the historized updates in Azure Data Explorer

Now that you've verified the data history flow is sending data to Azure Data Explorer, this section will show you how to view all three types of historized updates that were generated by the simulator and stored in Azure Data Explorer tables.

Start in the [Azure portal](https://portal.azure.com) and navigate to the Azure Data Explorer cluster you created earlier. Choose the **Databases** pane from the left menu to open the database view. Find the database you created for this article and select the checkbox next to it, then select **Query**.

:::image type="content"  source="media/how-to-create-data-history-connection/azure-data-explorer-database.png" alt-text="Screenshot of the Azure portal showing a database in an Azure Data Explorer cluster.":::

Next, expand the cluster and database in the left pane to see the name of the data history tables. There should be three: one for relationship lifecycle events, one for twin lifecycle events, and one for twin property update events. You'll use these table names to run queries on the table to verify and view the historized data.

:::image type="content"  source="media/how-to-create-data-history-connection/data-history-table.png" alt-text="Screenshot of the Azure portal showing the query view for the database. The name of the data history table is highlighted." lightbox="media/how-to-create-data-history-connection/data-history-table.png":::

#### Verify relationship and twin lifecycle updates

To verify that relationship and twin lifecycle events are being historized to the database, start by copying the following command. It has a placeholder for the name of the relationship lifecycle events table, and it will change the ingestion for the table to [batched mode](concepts-data-history.md#batch-ingestion-default) so it ingests data from the live simulation every 10 seconds.

```kusto
.alter table <relationship-lifecycle-events-table-name> policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:10", "MaximumNumberOfItems": 500, "MaximumRawDataSizeMB": 1024}'
```

Paste the command into the query window, replacing the placeholder with the name of your relationship events table. Select the **Run** button to run the command.

:::image type="content"  source="media/how-to-create-data-history-connection/data-history-run-query-1.png" alt-text="Screenshot of the Azure portal showing the query view for the database. The Run button is highlighted." lightbox="media/how-to-create-data-history-connection/data-history-run-query-1.png":::

Repeat the process with the following command to update the ingestion mode of the twin lifecycle events table.

```kusto
.alter table <twin-lifecycle-events-table-name> policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:10", "MaximumNumberOfItems": 500, "MaximumRawDataSizeMB": 1024}'
```

Next, add the following commands to the query window and run them. Each command contains a placeholder for the name of either the relationship lifecycle events table or the twin lifecycle events table, and the commands will output the number of items in the tables.

>[!NOTE]
> It may take up to 5 minutes for the first batch of ingested data to appear.

```kusto
<relationship-lifecycle-events-table-name>
| count

<twin-lifecycle-events-table-name>
| count
```

You should see in the results that the count of items in each table is something greater than 0, indicating that relationship lifecycle and twin lifecycle events are being historized to their respective tables.

#### Verify and explore twin property updates table

In this section you'll verify that twin property updates are being historized to the corresponding table, and do some more exploration with the data that's coming through.

Start by running the command below. The command has a placeholder for the name of the twin property update table, and it will change the ingestion for the table to [batched mode](concepts-data-history.md#batch-ingestion-default) so it ingests data from the live simulation every 10 seconds.

```kusto
.alter table <twin-property-updates-table-name> policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:10", "MaximumNumberOfItems": 500, "MaximumRawDataSizeMB": 1024}'
```

Next, add the following command to the query window, and run it to verify that Azure Data Explorer has ingested twin updates into the table.

>[!NOTE]
> It may take up to 5 minutes for the first batch of ingested data to appear.

```kusto
<twin-property-updates-table-name>
| count
```

You should see in the results that the count of items in the table is something greater than 0, indicating that twin property update events are being historized to the table.

You can also add and run the following command to view 100 records in the table:

```kusto
<twin-property-updates-table-name>
| limit 100
```

Next, run a query based on the data of your twins to see the contextualized time series data. 

Use the query below to chart the outflow of all salt machine twins in the sample Oslo dairy factory. This Kusto query uses the Azure Digital Twins plugin to select the twins of interest, joins those twins against the data history time series in Azure Data Explorer, and then charts the results. Make sure to replace the `<ADT-instance-host-name>` placeholder with the host name of your instance, and the `<table-name>` placeholder with the name of your twin property events table.

```kusto
let ADTendpoint = "https://<ADT-instance-host-name>";
let ADTquery = ```SELECT SALT_MACHINE.$dtId as tid
FROM DIGITALTWINS FACTORY 
JOIN SALT_MACHINE RELATED FACTORY.contains 
WHERE FACTORY.$dtId = 'OsloFactory'
AND IS_OF_MODEL(SALT_MACHINE , 'dtmi:assetGen:SaltMachine;1')```;
evaluate azure_digital_twins_query_request(ADTendpoint, ADTquery)
| extend Id = tostring(tid)
| join kind=inner (<table-name>) on Id
| extend val_double = todouble(Value)
| where Key == "OutFlow"
| render timechart with (ycolumns = val_double)
```

The results should show the outflow numbers changing over time.

:::image type="content"  source="media/how-to-create-data-history-connection/data-history-run-query-2.png" alt-text="Screenshot of the Azure portal showing the query view for the database. The result for the example query is a line graph showing changing values over time for the salt machine outflows." lightbox="media/how-to-create-data-history-connection/data-history-run-query-2.png":::

## Next steps 

To keep exploring the dairy scenario, you can view [more sample queries on GitHub](https://github.com/Azure-Samples/azure-digital-twins-getting-started/blob/main/adt-adx-queries/Dairy_operation_with_data_history) that show how you can monitor the performance of the dairy operation based on machine type, factory, maintenance technician, and various combinations of these parameters.

To build Grafana dashboards that visualize the performance of the dairy operation, read [Creating dashboards with Azure Digital Twins, Azure Data Explorer, and Grafana](https://github.com/Azure-Samples/azure-digital-twins-getting-started/tree/main/adt-adx-queries/Dairy_operation_with_data_history/Visualize_with_Grafana).

For more information on using the Azure Digital Twins query plugin for Azure Data Explorer, see [Querying with the Azure Data Explorer plugin](concepts-data-explorer-plugin.md) and [this blog post](https://techcommunity.microsoft.com/t5/internet-of-things/adding-context-to-iot-data-just-became-easier/ba-p/2459987). You can also read more about the plugin here: [Querying with the Azure Data Explorer plugin](concepts-data-explorer-plugin.md).
