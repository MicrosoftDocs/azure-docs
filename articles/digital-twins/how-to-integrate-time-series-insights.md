---
# Mandatory fields.
title: Integrate with Azure Time Series Insights
titleSuffix: Azure Digital Twins
description: See how to set up event routes from Azure Digital Twins to Azure Time Series Insights.
author: alexkarcher-msft
ms.author: alkarche # Microsoft employees only
ms.date: 1/19/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Integrate Azure Digital Twins with Azure Time Series Insights

In this article, you'll learn how to integrate Azure Digital Twins with [Azure Time Series Insights (TSI)](../time-series-insights/overview-what-is-tsi.md).

The solution described in this article will allow you to gather and analyze historical data about your IoT solution. Azure Digital Twins is a great fit for feeding data into Time Series Insights, as it allows you to correlate multiple data streams and standardize your information before sending it to Time Series Insights. 

## Prerequisites

Before you can set up a relationship with Time Series Insights, you need to have an **Azure Digital Twins instance**. This instance should be set up with the ability to update digital twin information based on data, as you'll need to update twin information a few times to see that data tracked in Time Series Insights. 

If you do not have this set up already, you can create it by following the Azure Digital Twins [*Tutorial: Connect an end-to-end solution*](./tutorial-end-to-end.md). The tutorial will walk you through setting up an Azure Digital Twins instance that works with a virtual IoT device to trigger digital twin updates.

## Solution architecture

You will be attaching Time Series Insights to Azure Digital Twins through the path below.

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-integrate-time-series-insights/diagram-simple.png" alt-text="A view of Azure services in an end-to-end scenario, highlighting Time Series Insights" lightbox="media/how-to-integrate-time-series-insights/diagram-simple.png":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

## Create a route and filter to twin update notifications

Azure Digital Twins instances can emit [twin update events](how-to-interpret-event-data.md) whenever a twin's state is updated. In this section, you will be creating an Azure Digital Twins [**event route**](concepts-route-events.md) that will direct these update events to Azure [Event Hubs](../event-hubs/event-hubs-about.md) for further processing.

The Azure Digital Twins [*Tutorial: Connect an end-to-end solution*](./tutorial-end-to-end.md) walks through a scenario where a thermometer is used to update a temperature attribute on a digital twin representing a room. This pattern relies on the twin updates, rather than forwarding telemetry from an IoT device, which gives you the flexibility to change the underlying data source without needing to update your Time Series Insights logic.

1. First, create an event hub namespace that will receive events from your Azure Digital Twins instance. You can either use the Azure CLI instructions below, or use the Azure portal: [*Quickstart: Create an event hub using Azure portal*](../event-hubs/event-hubs-create.md). To see what regions support Event Hubs, visit [*Azure products available by region*](https://azure.microsoft.com/global-infrastructure/services/?products=event-hubs).

    ```azurecli-interactive
    az eventhubs namespace create --name <name for your Event Hubs namespace> --resource-group <resource group name> -l <region>
    ```

2. Create an event hub within the namespace to receive twin change events. Specify a name for the event hub.

    ```azurecli-interactive
    az eventhubs eventhub create --name <name for your Twins event hub> --resource-group <resource group name> --namespace-name <Event Hubs namespace from above>
    ```

3. Create an [authorization rule](/cli/azure/eventhubs/eventhub/authorization-rule#az-eventhubs-eventhub-authorization-rule-create) with send and receive permissions. Specify a name for the rule.

    ```azurecli-interactive
        az eventhubs eventhub authorization-rule create --rights Listen Send --resource-group <resource group name> --namespace-name <Event Hubs namespace from above> --eventhub-name <Twins event hub name from above> --name <name for your Twins auth rule>
    ```

4. Create an Azure Digital Twins [endpoint](concepts-route-events.md#create-an-endpoint) that links your event hub to your Azure Digital Twins instance.

    ```azurecli-interactive
    az dt endpoint create eventhub -n <your Azure Digital Twins instance name> --endpoint-name <name for your Event Hubs endpoint> --eventhub-resource-group <resource group name> --eventhub-namespace <Event Hubs namespace from above> --eventhub <Twins event hub name from above> --eventhub-policy <Twins auth rule from above>
    ```

5. Create a [route](concepts-route-events.md#create-an-event-route) in Azure Digital Twins to send twin update events to your endpoint. The filter in this route will only allow twin update messages to be passed to your endpoint.

    >[!NOTE]
    >There is currently a **known issue** in Cloud Shell affecting these command groups: `az dt route`, `az dt model`, `az dt twin`.
    >
    >To resolve, either run `az login` in Cloud Shell prior to running the command, or use the [local CLI](/cli/azure/install-azure-cli) instead of Cloud Shell. For more detail on this, see [*Troubleshooting: Known issues in Azure Digital Twins*](troubleshoot-known-issues.md#400-client-error-bad-request-in-cloud-shell).

    ```azurecli-interactive
    az dt route create -n <your Azure Digital Twins instance name> --endpoint-name <Event Hub endpoint from above> --route-name <name for your route> --filter "type = 'Microsoft.DigitalTwins.Twin.Update'"
    ```

Before moving on, take note of your *Event Hubs namespace* and *resource group*, as you will use them again to create another event hub later in this article.

## Create a function in Azure

Next, you'll use Azure Functions to create an **Event Hubs-triggered function** inside a function app. You can use the function app created in the end-to-end tutorial ([*Tutorial: Connect an end-to-end solution*](./tutorial-end-to-end.md)), or your own. 

This function will convert those twin update events from their original form as JSON Patch documents to JSON objects, containing only updated and added values from your twins.

For more information about using Event Hubs with Azure Functions, see [*Azure Event Hubs trigger for Azure Functions*](../azure-functions/functions-bindings-event-hubs-trigger.md).

Inside your published function app, add a new function called **ProcessDTUpdatetoTSI** with the following code.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/updateTSI.cs":::

>[!NOTE]
>You may need to add the packages to your project using the `dotnet add package` command or the Visual Studio NuGet package manager.

Next, **publish** the new Azure function. For instructions on how to do this, see [*How-to: Set up an Azure function for processing data*](how-to-create-azure-function.md#publish-the-function-app-to-azure).

Looking ahead, this function will send the JSON objects it creates to a second event hub, which you will connect to Time Series Insights. You'll create that event hub in the next section.

Later, you'll also set some environment variables that this function will use to connect to your own event hubs.

## Send telemetry to an event hub

You will now create a second event hub, and configure your function to stream its output to that event hub. This event hub will then be connected to Time Series Insights.

### Create an event hub

To create the second event hub, you can either use the Azure CLI instructions below, or use the Azure portal: [*Quickstart: Create an event hub using Azure portal*](../event-hubs/event-hubs-create.md).

1. Prepare your *Event Hubs namespace* and *resource group* name from earlier in this article

2. Create a new event hub. Specify a name for the event hub.

    ```azurecli-interactive
    az eventhubs eventhub create --name <name for your TSI event hub> --resource-group <resource group name from earlier> --namespace-name <Event Hubs namespace from earlier>
    ```
3. Create an [authorization rule](/cli/azure/eventhubs/eventhub/authorization-rule#az-eventhubs-eventhub-authorization-rule-create) with send and receive permissions. Specify a name for the rule.

    ```azurecli-interactive
    az eventhubs eventhub authorization-rule create --rights Listen Send --resource-group <resource group name> --namespace-name <Event Hubs namespace from earlier> --eventhub-name <TSI event hub name from above> --name <name for your TSI auth rule>
    ```

## Configure your function

Next, you'll need to set environment variables in your function app from earlier, containing the connection strings for the event hubs you've created.

### Set the Twins event hub connection string

1. Get the Twins [event hub connection string](../event-hubs/event-hubs-get-connection-string.md), using the authorization rules you created above for the Twins hub.

    ```azurecli-interactive
    az eventhubs eventhub authorization-rule keys list --resource-group <resource group name> --namespace-name <Event Hubs namespace> --eventhub-name <Twins event hub name from earlier> --name <Twins auth rule from earlier>
    ```

2. Use the *primaryConnectionString* value from the result to create an app setting in your function app that contains your connection string:

    ```azurecli-interactive
    az functionapp config appsettings set --settings "EventHubAppSetting-Twins=<Twins event hub connection string>" -g <resource group> -n <your App Service (function app) name>
    ```

### Set the Time Series Insights event hub connection string

1. Get the TSI [event hub connection string](../event-hubs/event-hubs-get-connection-string.md), using the authorization rules you created above for the Time Series Insights hub:

    ```azurecli-interactive
    az eventhubs eventhub authorization-rule keys list --resource-group <resource group name> --namespace-name <Event Hubs namespace> --eventhub-name <TSI event hub name> --name <TSI auth rule>
    ```

2. Use the *primaryConnectionString* value from the result to create an app setting in your function app that contains your connection string:

    ```azurecli-interactive
    az functionapp config appsettings set --settings "EventHubAppSetting-TSI=<TSI event hub connection string>" -g <resource group> -n <your App Service (function app) name>
    ```

## Create and connect a Time Series Insights instance

Next, you will set up a Time Series Insights instance to receive the data from your second (TSI) event hub. Follow the steps below, and for more details about this process, see [*Tutorial: Set up an Azure Time Series Insights Gen2 PAYG environment*](../time-series-insights/tutorial-set-up-environment.md).

1. In the Azure portal, begin creating a Time Series Insights environment. 
    1. Select the **Gen2(L1)** pricing tier.
    2. You will need to choose a **time series ID** for this environment. Your time series ID can be up to three values that you will use to search for your data in Time Series Insights. For this tutorial, you can use **$dtId**. Read more about selecting an ID value in [*Best practices for choosing a Time Series ID*](../time-series-insights/how-to-select-tsid.md).
    
        :::image type="content" source="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-1.png" alt-text="The creation portal UX for a Time Series Insights environment. Select your subscription, resource group, and location from the respective dropdowns and choose a name for your environment." lightbox="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-1.png":::
        
        :::image type="content" source="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-2.png" alt-text="The creation portal UX for a Time Series Insights environment. The Gen2(L1) pricing tier is selected and the time series ID property name is $dtId" lightbox="media/how-to-integrate-time-series-insights/create-time-series-insights-environment-2.png":::

2. Select **Next: Event Source** and select your TSI event hub information from earlier. You will also need to create a new Event Hubs consumer group.
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/event-source-twins.png" alt-text="The creation portal UX for a Time Series Insights environment event source. You are creating an event source with the event hub information from above. You are also creating a new consumer group." lightbox="media/how-to-integrate-time-series-insights/event-source-twins.png":::

## Begin sending IoT data to Azure Digital Twins

To begin sending data to Time Series Insights, you will need to start updating the digital twin properties in Azure Digital Twins with changing data values. Use the [az dt twin update](/cli/azure/ext/azure-iot/dt/twin#ext-azure-iot-az-dt-twin-update) command.

If you are using the end-to-end tutorial ([*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md)) to assist with environment setup, you can begin sending simulated IoT data by running the *DeviceSimulator* project from the sample. The instructions are in the [*Configure and run the simulation*](tutorial-end-to-end.md#configure-and-run-the-simulation) section of the tutorial.

## Visualize your data in Time Series Insights

Now, data should be flowing into your Time Series Insights instance, ready to be analyzed. Follow the steps below to explore the data coming in.

1. Open your Time Series Insights environment in the [Azure portal](https://portal.azure.com) (you can search for the name of your environment in the portal search bar). Visit the *Time Series Insights Explorer URL* shown in the instance overview.
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/view-environment.png" alt-text="Select the Time Series Insights explorer URL in the overview tab of your Time Series Insights environment":::

2. In the explorer, you will see your three twins from Azure Digital Twins shown on the left. Select _**thermostat67**_, select **temperature**, and hit **add**.

    :::image type="content" source="media/how-to-integrate-time-series-insights/add-data.png" alt-text="Select **thermostat67**, select **temperature**, and hit **add**":::

3. You should now be seeing the initial temperature readings from your thermostat, as shown below. That same temperature reading is updated for *room21* and *floor1*, and you can visualize those data streams in tandem.
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/initial-data.png" alt-text="Initial temperature data is graphed in the TSI explorer. It is a line of random values between 68 and 85":::

4. If you allow the simulation to run for much longer, your visualization will look something like this:
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/day-data.png" alt-text="Temperature data for each twin is graphed in three parallel lines of different colors.":::

## Next steps

The digital twins are stored by default as a flat hierarchy in Time Series Insights, but they can be enriched with model information and a multi-level hierarchy for organization. To learn more about this process, read: 

* [*Tutorial: Define and apply a model*](../time-series-insights/tutorial-set-up-environment.md#define-and-apply-a-model) 

You can write custom logic to automatically provide this information using the model and graph data already stored in Azure Digital Twins. To read more about managing, upgrading, and retrieving information from the twins graph, see the following references:

* [*How-to: Manage a digital twin*](./how-to-manage-twin.md)
* [*How-to: Query the twin graph*](./how-to-query-graph.md)