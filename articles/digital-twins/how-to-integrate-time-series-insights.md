---
title: Integrate with Azure Time Series Insights
titleSuffix: Azure Digital Twins
description: Learn how to set up event routes from Azure Digital Twins to Azure Time Series Insights.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 01/10/2023
ms.topic: how-to
ms.service: digital-twins
ms.custom: devx-track-azurecli

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Integrate Azure Digital Twins with Azure Time Series Insights

In this article, you'll learn how to integrate Azure Digital Twins with [Azure Time Series Insights (TSI)](../time-series-insights/overview-what-is-tsi.md).

The solution described in this article uses Time Series Insights to collect and analyze historical data about your IoT solution. Azure Digital Twins is a good fit for feeding data into Time Series Insights, as it allows you to correlate multiple data streams and standardize your information before sending it to Time Series Insights.

>[!TIP]
>The simplest way to analyze historical twin data over time is to use the [data history](concepts-data-history.md) feature to connect an Azure Digital Twins instance to an Azure Data Explorer cluster, so that graph updates are automatically historized to Azure Data Explorer. You can then query this data in Azure Data Explorer using the [Azure Digital Twins query plugin for Azure Data Explorer](concepts-data-explorer-plugin.md). If you don't need to use Time Series Insights specifically, you might consider this alternative for a simpler integration experience.

## Prerequisites

Before you can set up a relationship with Time Series Insights, you'll need to set up the following resources:
* An Azure Digital Twins instance. For instructions, see [Set up an Azure Digital Twins instance and authentication](./how-to-set-up-instance-portal.md).
* A model and a twin in the Azure Digital Twins instance. You'll need to update twin's information a few times to see that data tracked in Time Series Insights. For instructions, see [Add a model and twin](how-to-ingest-iot-hub-data.md#add-a-model-and-twin).

> [!TIP]
> In this article, the changing digital twin values that are viewed in Time Series Insights are updated manually for simplicity. However, if you want to complete this article with live simulated data, you can set up an Azure function that updates digital twins based on IoT telemetry events from a simulated device. For instructions, follow [Ingest IoT Hub data](how-to-ingest-iot-hub-data.md), including the final steps to run the device simulator and validate that the data flow works.
>
> Later, look for another TIP to show you where to start running the device simulator and have your Azure functions update the twins automatically, instead of sending manual digital twin update commands.


## Solution architecture

You'll be attaching Time Series Insights to Azure Digital Twins through the following path.

:::image type="content" source="media/how-to-integrate-time-series-insights/diagram-simple.png" alt-text="Diagram of Azure services in an end-to-end scenario, highlighting Time Series Insights." lightbox="media/how-to-integrate-time-series-insights/diagram-simple.png":::

## Create Event Hubs namespace

Before creating the event hubs, you'll first create an Event Hubs namespace that will receive events from your Azure Digital Twins instance. You can either use the Azure CLI instructions below, or use the Azure portal by following [Create an event hub using Azure portal](../event-hubs/event-hubs-create.md). To see what regions support Event Hubs, visit [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-hubs).

```azurecli-interactive
az eventhubs namespace create --name <name-for-your-Event-Hubs-namespace> --resource-group <your-resource-group> --location <region>
```

> [!TIP]
> If you get an error stating `BadRequest: The specified service namespace is invalid.`, make sure the name you've chosen for your namespace meets the naming requirements described in this reference document: [Create Namespace](/rest/api/servicebus/create-namespace).

You'll be using this Event Hubs namespace to hold the two event hubs that are needed for this article:

  1. *Twins hub* - Event hub to receive twin change events
  2. *Time series hub* - Event hub to stream events to Time Series Insights

The next sections will walk you through creating and configuring these hubs within your event hub namespace.

## Create twins hub

The first event hub you'll create in this article is the *twins hub*. This event hub will receive twin change events from Azure Digital Twins. To set up the twins hub, you'll complete the following steps in this section:

1. Create the twins hub
2. Create an authorization rule to control permissions to the hub
3. Create an endpoint in Azure Digital Twins that uses the authorization rule to access the hub
4. Create a route in Azure Digital Twins that sends twin updates event to the endpoint and connected twins hub
5. Get the twins hub connection string

Create the twins hub with the following CLI command. Specify a name for your twins hub.

```azurecli-interactive
az eventhubs eventhub create --name <name-for-your-twins-hub> --resource-group <your-resource-group> --namespace-name <your-Event-Hubs-namespace-from-earlier>
```

### Create twins hub authorization rule

Create an [authorization rule](/cli/azure/eventhubs/eventhub/authorization-rule#az-eventhubs-eventhub-authorization-rule-create) with send and receive permissions. Specify a name for the rule.

```azurecli-interactive
az eventhubs eventhub authorization-rule create --rights Listen Send --name <name-for-your-twins-hub-auth-rule> --resource-group <your-resource-group> --namespace-name <your-Event-Hubs-namespace-from-earlier> --eventhub-name <your-twins-hub-from-earlier>
```

### Create twins hub endpoint

Create an Azure Digital Twins [endpoint](concepts-route-events.md#creating-endpoints) that links your event hub to your Azure Digital Twins instance. Specify a name for your twins hub endpoint.

```azurecli-interactive
az dt endpoint create eventhub --dt-name <your-Azure-Digital-Twins-instance-name> --eventhub-resource-group <your-resource-group> --eventhub-namespace <your-Event-Hubs-namespace-from-earlier> --eventhub <your-twins-hub-name-from-earlier> --eventhub-policy <your-twins-hub-auth-rule-from-earlier> --endpoint-name <name-for-your-twins-hub-endpoint>
```

### Create twins hub event route

Azure Digital Twins instances can emit [twin update events](./concepts-event-notifications.md) whenever a twin's state is updated. In this section, you'll create an Azure Digital Twins event route that will direct these update events to the twins hub for further processing.

Create a [route](concepts-route-events.md#creating-event-routes) in Azure Digital Twins to send twin update events to your endpoint from above. The filter in this route will only allow twin update messages to be passed to your endpoint. Specify a name for the twins hub event route. For the Azure Digital Twins instance name placeholder in this command, you can use the friendly name or the host name for a boost in performance.

```azurecli-interactive
az dt route create --dt-name <your-Azure-Digital-Twins-instance-hostname-or-name> --endpoint-name <your-twins-hub-endpoint-from-earlier> --route-name <name-for-your-twins-hub-event-route> --filter "type = 'Microsoft.DigitalTwins.Twin.Update'"
```

### Get twins hub connection string

Get the [twins event hub connection string](../event-hubs/event-hubs-get-connection-string.md), using the authorization rules you created above for the twins hub.

```azurecli-interactive
az eventhubs eventhub authorization-rule keys list --resource-group <your-resource-group> --namespace-name <your-Event-Hubs-namespace-from-earlier> --eventhub-name <your-twins-hub-from-earlier> --name <your-twins-hub-auth-rule-from-earlier>
```
Take note of the **primaryConnectionString** value from the result to configure the twins hub app setting later in this article.

## Create time series hub

The second event hub you'll create in this article is the *time series hub*. This event hub is the one that will stream the Azure Digital Twins events to Time Series Insights. To set up the time series hub, you'll complete these steps:

1. Create the time series hub
2. Create an authorization rule to control permissions to the hub
3. Get the time series hub connection string

Later, when you create the Time Series Insights instance, you'll connect this time series hub as the event source for the Time Series Insights instance.

Create the time series hub using the following command. Specify a name for the time series hub.

```azurecli-interactive
 az eventhubs eventhub create --name <name-for-your-time-series-hub> --resource-group <your-resource-group> --namespace-name <your-Event-Hub-namespace-from-earlier>
```

### Create time series hub authorization rule

Create an [authorization rule](/cli/azure/eventhubs/eventhub/authorization-rule#az-eventhubs-eventhub-authorization-rule-create) with send and receive permissions. Specify a name for the time series hub auth rule.

```azurecli-interactive
az eventhubs eventhub authorization-rule create --rights Listen Send --name <name-for-your-time-series-hub-auth-rule> --resource-group <your-resource-group> --namespace-name <your-Event-Hub-namespace-from-earlier> --eventhub-name <your-time-series-hub-name-from-earlier>
```

### Get time series hub connection string

Get the [time series hub connection string](../event-hubs/event-hubs-get-connection-string.md), using the authorization rules you created above for the time series hub:

```azurecli-interactive
az eventhubs eventhub authorization-rule keys list --resource-group <your-resource-group> --namespace-name <your-Event-Hub-namespace-from-earlier> --eventhub-name <your-time-series-hub-name-from-earlier> --name <your-time-series-hub-auth-rule-from-earlier>
```
Take note of the **primaryConnectionString** value from the result to configure the time series hub app setting later in this article.

Also, take note of the following values to use them later to create a Time Series Insights instance.
* Event hub namespace
* Time series hub name
* Time series hub auth rule

## Create a function

In this section, you'll create an Azure function that will convert twin update events from their original form as JSON Patch documents to JSON objects that only contain updated and added values from your twins.

1. First, create a new function app project.

    You can do this using **Visual Studio** (for instructions, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#create-an-azure-functions-project)), **Visual Studio Code** (for instructions, see [Create a C# function in Azure using Visual Studio Code](../azure-functions/create-first-function-vs-code-csharp.md?tabs=in-process#create-an-azure-functions-project)), or the **Azure CLI** (for instructions, see [Create a C# function in Azure from the command line](../azure-functions/create-first-function-cli-csharp.md?tabs=azure-cli%2Cin-process#create-a-local-function-project)).

2. Create a new Azure function called *ProcessDTUpdatetoTSI.cs* to update device telemetry events to the Time Series Insights. The function type will be **Event Hub trigger**.

    :::image type="content" source="media/how-to-integrate-time-series-insights/create-event-hub-trigger-function.png" alt-text="Screenshot of Visual Studio to create a new Azure function of type event hub trigger." lightbox="media/how-to-integrate-time-series-insights/create-event-hub-trigger-function.png":::

3. Add the following packages to your project (you can use the Visual Studio NuGet package manager, or the [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in a command-line tool).
    * [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs/)
    * [Microsoft.Azure.WebJobs.Extensions.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs/)
    * [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/)

4. Replace the code in the *ProcessDTUpdatetoTSI.cs* file with the following code:

    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/updateTSI.cs":::

    Save your function code.

5. Publish the project with the *ProcessDTUpdatetoTSI.cs* function to a function app in Azure.

    For instructions on how to publish the function using **Visual Studio**, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure). For instructions on how to publish the function using **Visual Studio Code**, see [Create a C# function in Azure using Visual Studio Code](../azure-functions/create-first-function-vs-code-csharp.md?tabs=in-process#publish-the-project-to-azure). For instructions on how to publish the function using the **Azure CLI**, see [Create a C# function in Azure from the command line](../azure-functions/create-first-function-cli-csharp.md?tabs=azure-cli%2Cin-process#deploy-the-function-project-to-azure). 


Save the function app name to use later to configure app settings for the two event hubs.

### Configure the function app

Next, assign an access role for the function and configure the application settings so that it can access your resources.

[!INCLUDE [digital-twins-configure-function-app-cli.md](../../includes/digital-twins-configure-function-app-cli.md)]

Next, add environment variables in the function app's settings that allow it to access the twins hub and time series hub.

Use the twins hub primaryConnectionString value that you saved earlier to create an app setting in your function app that contains the twins hub connection string:

```azurecli-interactive
az functionapp config appsettings set --settings "EventHubAppSetting-Twins=<your-twins-hub-primaryConnectionString>" --resource-group <your-resource-group> --name <your-function-app-name>
```

Use the time series hub primaryConnectionString value that you saved earlier to create an app setting in your function app that contains the time series hub connection string:

```azurecli-interactive
az functionapp config appsettings set --settings "EventHubAppSetting-TSI=<your-time-series-hub-primaryConnectionString>" --resource-group <your-resource-group> --name <your-function-app-name>
```

## Create and connect a Time Series Insights instance

In this section, you'll set up Time Series Insights instance to receive data from your time series hub. For more information about this process, see [Set up an Azure Time Series Insights Gen2 PAYG environment](../time-series-insights/tutorial-set-up-environment.md). Follow the steps below to create a Time Series Insights environment.

1. In the [Azure portal](https://portal.azure.com), search for *Time Series Insights environments*, and select the **Create** button. Choose the following options to create the time series environment.

    * **Subscription** - Choose your subscription.
        - **Resource group** - Choose your resource group.
    * **Environment name** - Specify a name for your time series environment.
    * **Location** - Choose a location.
    * **Tier** - Choose the **Gen2(L1)** pricing tier.
    * **Property name** - Enter **$dtId** (Read more about selecting an ID value in [Best practices for choosing a Time Series ID](../time-series-insights/how-to-select-tsid.md)).
    * **Storage account name** - Specify a storage account name.
    * **Enable warm store** - Leave this field set to **Yes**.

    You can leave default values for other properties on this page. Select the **Next : Event Source >** button.

    :::image type="content" source="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-1.png" alt-text="Screenshot of the Azure portal showing how to create Time Series Insights environment (part 1/3)." lightbox="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-1.png":::
        
    :::image type="content" source="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-2.png" alt-text="Screenshot of the Azure portal showing how to create Time Series Insights environment (part 2/3)." lightbox="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-2.png":::

2. In the **Event Source** tab, choose the following fields:

   * **Create an event source?** - Choose **Yes**.
   * **Source type** - Choose **Event Hub**.
   * **Name** - Specify a name for your event source.
   * **Subscription** - Choose your Azure subscription.
   * **Event Hub namespace** - Choose the namespace that you created earlier in this article.
   * **Event Hub name** - Choose the time series hub name that you created earlier in this article.
   * **Event Hub access policy name** - Choose the time series hub auth rule that you created earlier in this article.
   * **Event Hub consumer group** - Select **New** and specify a name for your event hub consumer group. Then, select **Add**.
   * **Property name** - Leave this field blank.
    
    Choose the **Review + Create** button to review all the details. Then, select the **Review + Create** button again to create the time series environment.

    :::image type="content" source="media/how-to-integrate-time-series-insights/create-tsi-environment-event-source.png" alt-text="Screenshot of the Azure portal showing how to create Time Series Insights environment (part 3/3)." lightbox="media/how-to-integrate-time-series-insights/create-tsi-environment-event-source.png":::

## Send IoT data to Azure Digital Twins

To begin sending data to Time Series Insights, you'll need to start updating the digital twin properties in Azure Digital Twins with changing data values.

Use the [az dt twin update](/cli/azure/dt/twin#az-dt-twin-update) CLI command to update a property on the twin you added in the [Prerequisites](#prerequisites) section. If you used the twin creation instructions from [Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md)), you can use the following command in the local CLI or the Cloud Shell bash terminal to update the temperature property on the thermostat67 twin. There's one placeholder for the Azure Digital Twins instance's host name (you can also use the instance's friendly name with a slight decrease in performance).

```azurecli-interactive
az dt twin update --dt-name <your-Azure-Digital-Twins-instance-hostname-or-name> --twin-id thermostat67 --json-patch '{"op":"replace", "path":"/Temperature", "value": 20.5}'
```

Repeat the command at least 4 more times with different property values to create several data points that can be observed later in the Time Series Insights environment.

> [!TIP]
> If you want to complete this article with live simulated data instead of manually updating the digital twin values, first make sure you've completed the TIP from the [Prerequisites](#prerequisites) section to set up an Azure function that updates twins from a simulated device.
After that, you can run the device now to start sending simulated data and updating your digital twin through that data flow.

## Visualize your data in Time Series Insights

Now, data should be flowing into your Time Series Insights instance, ready to be analyzed. Follow the steps below to explore the data coming in.

1. In the [Azure portal](https://portal.azure.com), search for your time series environment name that you created earlier. In the menu options on the left, select **Overview** to see the **Time Series Insights Explorer URL**. Select the URL to view the temperature changes reflected in the Time Series Insights environment.

    :::image type="content" source="media/how-to-integrate-time-series-insights/view-environment.png" alt-text="Screenshot of the Azure portal showing the Time Series Insights explorer URL in the overview tab of the Time Series Insights environment." lightbox="media/how-to-integrate-time-series-insights/view-environment.png":::

2. In the explorer, you'll see the twins in the Azure Digital Twins instance shown on the left. Select the twin you've edited properties for, choose the property you've changed, and select **Add**.

    :::image type="content" source="media/how-to-integrate-time-series-insights/add-data.png" alt-text="Screenshot of the Time Series Insights explorer with the steps to select thermostat67, select the property temperature, and select add highlighted." lightbox="media/how-to-integrate-time-series-insights/add-data.png":::

3. You should now see the property changes you made reflected in the graph, as shown below. 

    :::image type="content" source="media/how-to-integrate-time-series-insights/initial-data.png" alt-text="Screenshot of the Time Series Insights explorer with the initial temperature data, showing a line of random values between 68 and 85." lightbox="media/how-to-integrate-time-series-insights/initial-data.png":::

If you allow a simulation to run for much longer, your visualization will look something like this:

:::image type="content" source="media/how-to-integrate-time-series-insights/day-data.png" alt-text="Screenshot of the Time Series Insights explorer where temperature data for each twin is graphed in three parallel lines of different colors." lightbox="media/how-to-integrate-time-series-insights/day-data.png":::

## Next steps

After establishing a data pipeline to send time series data from Azure Digital Twins to Time Series Insights, you might want to think about how to translate asset models designed for Azure Digital Twins into asset models for Time Series Insights. For a tutorial on this next step in the integration process, see [Model synchronization between Azure Digital Twins and Time Series Insights Gen2](../time-series-insights/tutorials-model-sync.md).
