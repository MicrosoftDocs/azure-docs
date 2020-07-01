---
# Mandatory fields.
title: Integrate with Time Series Insights
titleSuffix: Azure Digital Twins
description: See how to set up and manage endpoints and event routes for Azure Digital Twins data.
author: alexkarcher-msft
ms.author: alkarche # Microsoft employees only
ms.date: 6/10/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Integrate Digital Twins with Azure Time Series Insights

## Intro

In this how-to, you will learn how to integrate Azure Digital Twins with Time Series Insights for gathering and analyzing historical data about your IoT solution. Digital Twins is a perfect fit for feeding information into Time Series Insights. Digital Twins allows you to correlate multiple desperate data streams and standardize your information before feeding it into your Time Series Insights instance. 

## Solution Architecture

You will be building a solution as picture below. You will be extending the Digital Twins end-to-end solution with an Event Hub and Time Series Insights instance. 

:::image type="content" source="media/how-to-integrate-time-series-insights/maps-tsi-diagram.png" alt-text="A view of Azure services in an end-to-end scenario, highlighting the Indoor Maps Integration piece" lightbox="media/how-to-integrate-time-series-insights/maps-tsi-diagram.png":::

## Prerequisites

* Follow the Azure Digital Twins [Tutorial: Connect an end-to-end solution](./tutorial-end-to-end.md).
    * You'll be extending this twin with an additional endpoint and route.

## Send telemetry to an Event Hub

To begin, you will create an Event Hub namespace with one event hub and configure your Digital Twins instance to stream twin change events to that event hub.

### Create an EventHub. 

You can either use the Azure CLI instructions below, or use the Azure portal: [Quickstart: Create an event hub using Azure portal](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-create-environment).
1. Create an Event Hub namespace
```azurecli-interactive
# Create an Event Hubs namespace. Specify a name for the Event Hubs namespace.
az eventhubs namespace create --name <Event Hubs namespace> --resource-group <resource group name> -l <region, for example: East US>
```
2. Create an event hub
```azurecli-interactive
# Create an event hub. Specify a name for the event hub. 
az eventhubs eventhub create --name <event hub name> --resource-group <resource group name> --namespace-name <Event Hubs namespace>
```
3. Create an [authorization rule](https://docs.microsoft.com/cli/azure/eventhubs/eventhub/authorization-rule?view=azure-cli-latest#az-eventhubs-eventhub-authorization-rule-create) with send and receive permissions
```azurecli-interactive
# Create an authorization rule. Specify a name for the rule.
az eventhubs eventhub authorization-rule create --rights Listen Send --resource-group <resource group name> --namespace-name <Event Hubs namespace> --eventhub-name <event hub name> --name <myauthrule>
```

### Configure your Digital Twins instance to route twin change events to your Event Hub.

1. Create an endpoint to link your event grid topic to Azure Digital Twins.
```azurecli-interactive
az dt endpoint create eventhub --endpoint-name <your-endpoint-name> --eventhub <event hub name> --eventhub-resource-group <resource group name> --eventhub-policy <myauthrule> --eventhub-namespace <Event Hubs namespace> -n <your-Azure-Digital-Twins-instance-name>
```
2. Create a route in Azure Digital Twins to send twin update events to your endpoint.
```azurecli-interactive
az dt route create -n <your-Azure-Digital-Twins-instance-name> --endpoint-name <Event-Hub-endpoint-name> --route-name <my_route> --filter "{ "endpointId": "<endpoint-ID>","filter": "type = 'Microsoft.DigitalTwins.Twin.Update'"}"
```

## Create and connect a Time Series Insights instance

1. Create a preview PAYG environment. [Tutorial: Create a Preview PAYG environment](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-create-environment#create-a-preview-payg-environment)
    1. Select the **PAYG(Preview)** pricing tier and to enter a Time Series ID Property name of **cloudEvents:subject**
    
        :::image type="content" source="media/how-to-integrate-time-series-insights/tsi-create-twinID.png" alt-text="The creation portal UX for a Time Series Insights environment. The PAYG(Preview) pricing tier is selected and the time series ID property name is cloudEvents:subject":::

2. Select **Next: Event Source** and select your Event Hub information from above. You will also need to create a new Event Hub consumer group.
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/tsi-event-source-twins.png" alt-text="The creation portal UX for a Time Series Insights environment event source. You are creating an event source with the event hub information from above. You are also creating a new consumer group.":::

## Begin sending IoT data to Digital Twins

To begin sending data to Digital Twins, where it will be forwarded to Time Series Insights, follow the steps below:

1. Begin sending simulated IoT data by running the **DeviceSimulator** project from the Azure Digital Twins [Tutorial: Connect an end-to-end solution](tutorial-end-to-end.md). The instructions are in the [*Configure and run the simulation*](././tutorial-end-to-end.md#configure-and-run-the-simulation) section.

## Visualize your data in Time Series Insights

Now data should be flowing into your Time Series Insights instance, ready to be analyzed.

1. Open your Time Series Insights instance in the Azure portal. Visit the Time Series Insights Explorer URL shown in the overview.
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/tsi-view-environment.png" alt-text="Click on the Time Series Insights explorer URL in the overview tab of your Time Series Insights environment":::

2. In the explorer, you will see your three twins shown on the left. Click on **thermostat67**, select **patch_value**, and click **add**.

    :::image type="content" source="media/how-to-integrate-time-series-insights/tsi-add-data.png" alt-text="Click on **thermostat67**, select **patch_value**, and click **add**":::

3. You should now be seeing the initial temperature readings from your thermostat, as shown below. That same temperature reading is updated for room21 and floor1, and you can visualize those data streams in tandem.
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/tsi-initial-data.png" alt-text="Intial temperature data is graphed in the TSI explorer. It is a line of random values between 68 and 85":::

4. If you allow the simulation to run for much longer, your visualization will look something like this:
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/tsi-day-data.png" alt-text="Temperature data for each twin is graphed in three parallel lines of different colors.":::

## Next Steps

The Twins are stored by default as a flat hierarchy in Time Series Insights, but they can be enriched with model information and a multi-level hierarchy for organization. To learn more read: 

* [Tutorial - Define and apply a model](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-create-environment#define-and-apply-a-model) 

You can write custom logic to automatically provide this information using the model and graph data already stored in Digital Twins. To read more about managing, upgrading, and retrieving information from the twins graph, see the following references:

* [How-to: Manage a digital twin](./how-to-manage-twin.md)
* [How-to: Query the twin graph](./how-to-query-graph.md)