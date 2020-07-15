---
# Mandatory fields.
title: Integrate with Time Series Insights
titleSuffix: Azure Digital Twins
description: See how to set up event routes from Azure Digital Twins to Azure Time Series Insights.
author: alexkarcher-msft
ms.author: alkarche # Microsoft employees only
ms.date: 7/14/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Integrate Digital Twins with Azure Time Series Insights

## Intro

In this reference, you will learn how to integrate Azure Digital Twins with Time Series Insights. This solution will allow you to gather and analyze historical data about your IoT solution. Digital Twins is a great fit for feeding data into Time Series Insights as it allows you to correlate multiple data streams and standardize your information before sending it to Time Series Insights. 

## Solution Architecture

You will be attaching Time Series insights to Digital Twins through the path below.

:::image type="content" source="media/how-to-integrate-time-series-insights/twins-tsi-diagram-simple.png" alt-text="A view of Azure services in an end-to-end scenario, highlighting the Indoor Maps Integration piece" lightbox="media/how-to-integrate-time-series-insights/twins-tsi-diagram.png":::

## Prerequisites

* You will need to create a digital Twins instance and be ready to update twin information. 
    * The Azure Digital Twins [Tutorial: Connect an end-to-end solution](./tutorial-end-to-end.md) provides this environment, but you can use any other Twins instance.

## Create a function to update time series insights when twins update

First, you'll create a route in Azure Digital Twins to forward all twin update events to an event hub. Then, you'll create an Azure function to read those update messages. 

## Create a route and filter to twin update notifications

Azure Digital Twins instances can emit twin update events whenever a twin's state is updated. The [Azure Digital Twins tutorial: Connect an end-to-end solution](./tutorial-end-to-end.md) linked above walks through a scenario where a thermometer is used to update a temperature attribute attached to a room's twin. 

This pattern reads from the twins directly, rather than the IoT device, which gives us the flexibility to change the underlying data source for without needing to update our time series insights logic.

1. Create an event hub namespace, which will receive events from our Azure Digital Twins instance. You can either use the Azure CLI instructions below, or use the Azure portal: [Quickstart: Create an event hub using Azure portal](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-create-environment).
```azurecli-interactive
# Create an Event Hubs namespace. Specify a name for the Event Hubs namespace.
az eventhubs namespace create --name <Event Hubs namespace> --resource-group <resource group name> -l <region, for example: East US>
```

2. Create an event hub
```azurecli-interactive
# Create an event hub to receive twin change events. Specify a name for the event hub. 
az eventhubs eventhub create --name <event hub name> --resource-group <resource group name> --namespace-name <Event Hubs namespace>
```

3. Create an [authorization rule](https://docs.microsoft.com/cli/azure/eventhubs/eventhub/authorization-rule?view=azure-cli-latest#az-eventhubs-eventhub-authorization-rule-create) with send and receive permissions
```azurecli-interactive
# Create an authorization rule. Specify a name for the rule.
az eventhubs eventhub authorization-rule create --rights Listen Send --resource-group <resource group name> --namespace-name <Event Hubs namespace> --eventhub-name <twins event hub name> --name <twins auth rule>
```

2. Create an endpoint to link your event grid topic to Azure Digital Twins.
    ```azurecli
    az dt endpoint create eventhub --endpoint-name <Event-Hub-endpoint-name> --eventhub-resource-group <resource group name> --eventhub-namespace <Event Hubs namespace> --eventhub <twins event hub name> --eventhub-policy <twins auth rule> -n <your-Azure-Digital-Twins-instance-name>
    ```

3. Create a route in Azure Digital Twins to send twin update events to your endpoint. The filter in this route will only allow twin update messages to be passed to your endpoint
    ```azurecli
    az dt route create -n <your-Azure-Digital-Twins-instance-name> --endpoint-name <Event-Hub-endpoint-name> --route-name <my_route> --filter "{ "endpointId": "<endpoint-ID>","filter": "type = 'Microsoft.DigitalTwins.Twin.Update'"}"
    ```

## Create an Azure function 

You're going to create an Event Hub-triggered function inside a new function app, our function app from the [end-to-end tutorial](./tutorial-end-to-end.md). This function will convert those updates from JSON patch documents to JSON objects containing only updated and added values from your twins. The function will then send those JSON objects to a second event hub, which we will connect to Time Series Insights.

See the following document for reference info: [Azure Event Hub trigger for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-bindings-event-hub-trigger).

Replace the function code with the following code.

```C#
using Microsoft.Azure.EventHubs;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using System.Text;
using System.Collections.Generic;

namespace SampleFunctionsApp
{
    public static class ProcessDTUpdatetoTSI
    { 
        [FunctionName("ProcessDTUpdatetoTSI")]
        public static async Task Run([EventHubTrigger("twins-fx-hub", Connection = "EventHubConnectionAppSetting-Twins")]EventData myEventHubMessage, [EventHub("alkarche-tsi-demo-hub", Connection = "EventHubConnectionAppSetting-TSI")] IAsyncCollector<string> outputEvents, ILogger log)
        {
            JObject message = (JObject)JsonConvert.DeserializeObject(Encoding.UTF8.GetString(myEventHubMessage.Body));
            log.LogInformation("Reading event:" + message.ToString());

            // Read properties which values have been changed in each operation
            Dictionary<string, object> tsiUpdate = new Dictionary<string, object>();
            foreach (var operation in message["patch"]) {
                if (operation["op"].ToString() == "replace" || operation["op"].ToString() == "add")
                    tsiUpdate.Add(operation["path"].ToString(), operation["value"]);
            }
            //Send an update to TSI if the twin has been updated
            if (tsiUpdate.Count>0){
                tsiUpdate.Add("$dtId", myEventHubMessage.Properties["cloudEvents:subject"]);
                await outputEvents.AddAsync(JsonConvert.SerializeObject(tsiUpdate));
            }
        }
    }
}
```



## Send telemetry to an Event Hub

You will now create an second event hub and configure your function to stream its output to that event hub.

### Create an Event Hub. 

You can either use the Azure CLI instructions below, or use the Azure portal: [Quickstart: Create an event hub using Azure portal](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-create-environment).

1. Prepare your event hub namespace and resource group name from earlier 

2. Create an event hub
```azurecli-interactive
# Create an event hub. Specify a name for the event hub. 
az eventhubs eventhub create --name <tsi event hub name> --resource-group <resource group name> --namespace-name <Event Hubs namespace>
```
3. Create an [authorization rule](https://docs.microsoft.com/cli/azure/eventhubs/eventhub/authorization-rule?view=azure-cli-latest#az-eventhubs-eventhub-authorization-rule-create) with send and receive permissions
```azurecli-interactive
# Create an authorization rule. Specify a name for the rule.
az eventhubs eventhub authorization-rule create --rights Listen Send --resource-group <resource group name> --namespace-name <Event Hubs namespace> --eventhub-name <event hub name> --name <tsi auth rule>
```

### Configure your function

You'll need to set one environment variable in your function app containing your event hub connection string

#### Set the Time Series Insights Event Hub connection string

1. Get the [event hub connection string](../event-hubs/event-hubs-get-connection-string.md) for the authorization rules you created above for the time series insights hub
```azurecli-interactive
az eventhubs eventhub authorization-rule keys list --resource-group <resource group name> --namespace-name <Event Hubs namespace> --eventhub-name <twins event hub name> --name <twins auth rule>
```

2. In your function app, create an app setting containing your connection string
```azurecli-interactive
az functionapp config appsettings set --settings "EventHubConnectionAppSetting-TSI=<your-event-hub-connection-string> -g <your-resource-group> -n <your-App-Service-(function-app)-name>"
```

#### Set the Twins Event Hub connection string

1. Get the [event hub connection string](../event-hubs/event-hubs-get-connection-string.md) for the authorization rules you created above for both the twins hub
```azurecli-interactive
az eventhubs eventhub authorization-rule keys list --resource-group <resource group name> --namespace-name <Event Hubs namespace> --eventhub-name <tsi event hub name> --name <tsi auth rule>
```

2. In your function app, create an app setting containing your connection string
```azurecli-interactive
az functionapp config appsettings set --settings "EventHubConnectionAppSetting-Twins=<your-event-hub-connection-string> -g <your-resource-group> -n <your-App-Service-(function-app)-name>"
```

## Create and connect a Time Series Insights instance

1. Create a preview PAYG environment. [Tutorial: Create a Preview PAYG environment](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-create-environment#create-a-preview-payg-environment)
    1. Select the **PAYG(Preview)** pricing tier.
    2. You will need to choose a time series ID for this environment. Your time series ID can be up to three values that you will use to search for your data in time series insights. For this tutorial you can use **$dtId**. Read more in [Best practices for choosing a Time Series ID](https://docs.microsoft.com/azure/time-series-insights/how-to-select-tsid)
    
        :::image type="content" source="media/how-to-integrate-time-series-insights/tsi-create-twinID.png" alt-text="The creation portal UX for a Time Series Insights environment. The PAYG(Preview) pricing tier is selected and the time series ID property name is $dtId":::

2. Select **Next: Event Source** and select your Event Hub information from above. You will also need to create a new Event Hub consumer group.
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/tsi-event-source-twins.png" alt-text="The creation portal UX for a Time Series Insights environment event source. You are creating an event source with the event hub information from above. You are also creating a new consumer group.":::

## Begin sending IoT data to Digital Twins

To begin sending data to Time Series Insights you will need to start changing twin values. Use the [az dt twin update](https://docs.microsoft.com/cli/azure/ext/azure-iot/dt/twin?view=azure-cli-latest#ext-azure-iot-az-dt-twin-update) command.
If you are following the end to end tutorial, follow the steps below:

1. Begin sending simulated IoT data by running the **DeviceSimulator** project from the Azure Digital Twins [Tutorial: Connect an end-to-end solution](tutorial-end-to-end.md). The instructions are in the [*Configure and run the simulation*](././tutorial-end-to-end.md#configure-and-run-the-simulation) section.

## Visualize your data in Time Series Insights

Now data should be flowing into your Time Series Insights instance, ready to be analyzed.

1. Open your Time Series Insights instance in the Azure portal. Visit the Time Series Insights Explorer URL shown in the overview.
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/tsi-view-environment.png" alt-text="Click on the Time Series Insights explorer URL in the overview tab of your Time Series Insights environment":::

2. In the explorer, you will see your three twins shown on the left. Click on **thermostat67**, select **patch_value**, and click **add**.

    :::image type="content" source="media/how-to-integrate-time-series-insights/tsi-add-data.png" alt-text="Click on **thermostat67**, select **temperature**, and click **add**":::

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