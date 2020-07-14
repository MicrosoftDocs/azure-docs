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

:::image type="content" source="media/how-to-integrate-time-series-insights/twins-tsi-diagram.png" alt-text="A view of Azure services in an end-to-end scenario, highlighting the Indoor Maps Integration piece" lightbox="media/how-to-integrate-time-series-insights/twins-tsi-diagram.png":::

## Prerequisites

* Follow the Azure Digital Twins [Tutorial: Connect an end-to-end solution](./tutorial-end-to-end.md).
    * You'll be extending this twin with an additional endpoint and route.

## Create a function to update time series insights when twins update

First, you'll create a route in Azure Digital Twins to forward all twin update events to an event grid topic. Then, you'll create an Azure function to read those update messages. 

## Create a route and filter to twin update notifications

Azure Digital Twins instances can emit twin update events whenever a twin's state is updated. The [Azure Digital Twins tutorial: Connect an end-to-end solution](./tutorial-end-to-end.md) linked above walks through a scenario where a thermometer is used to update a temperature attribute attached to a room's twin. You'll be extending that solution by subscribing to update notifications for twins, and using that information to update our maps.

This pattern reads from the twins directly, rather than the IoT device, which gives us the flexibility to change the underlying data source for without needing to update our time series insights logic.

> [!NOTE]
> If you have set up the end-to-end tutorial you only need to follow step 2 to create a new endpoint. You can reuse that event grid and digital twin route.

1. Create an event grid topic, which will receive events from our Azure Digital Twins instance.
    ```azurecli
    az eventgrid topic create -g <your-resource-group-name> --name <your-topic-name> -l <region>
    ```

2. Create an endpoint to link your event grid topic to Azure Digital Twins.
    ```azurecli
    az dt endpoint create eventgrid --endpoint-name <Event-Grid-endpoint-name> --eventgrid-resource-group <Event-Grid-resource-group-name> --eventgrid-topic <your-Event-Grid-topic-name> -n <your-Azure-Digital-Twins-instance-name>
    ```

3. Create a route in Azure Digital Twins to send twin update events to your endpoint.
    ```azurecli
    az dt route create -n <your-Azure-Digital-Twins-instance-name> --endpoint-name <Event-Grid-endpoint-name> --route-name <my_route> --filter "{ "endpointId": "<endpoint-ID>","filter": "type = 'Microsoft.DigitalTwins.Twin.Update'"}"
    ```

## Create an Azure function to update maps

You're going to create an Event Grid-triggered function inside our function app from the [end-to-end tutorial](./tutorial-end-to-end.md). This function will unpack those notifications and send updates to an event hub, which we will connect to Time Series Insights.

See the following document for reference info: [Azure Event Grid trigger for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-bindings-event-grid-trigger).

Replace the function code with the following code. It will filter out only updates, read the full twin state, and send that information to Time Series Insights.

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
                if (operation["op"].ToString() == "replace")
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

### Configure your function

You'll need to set one environment variable in your function app containing your event hub connection string

1. Get the [event hub connection string](../event-hubs/event-hubs-get-connection-string.md) for the authorization rule you created above
```azurecli-interactive
az eventhubs eventhub authorization-rule keys list --resource-group <resource group name> --namespace-name <Event Hubs namespace> --eventhub-name <event hub name> --name <myauthrule>

2. In your function app create an app setting containing your connection string
```azurecli-interactive
az functionapp config appsettings set --settings "EventHubConnectionAppSettingy=<your-event-hub-connection-string> -g <your-resource-group> -n <your-App-Service-(function-app)-name>"
```

## Create and connect a Time Series Insights instance

1. Create a preview PAYG environment. [Tutorial: Create a Preview PAYG environment](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-create-environment#create-a-preview-payg-environment)
    1. Select the **PAYG(Preview)** pricing tier and to enter Time Series ID Properties of **$dtId**
    
        :::image type="content" source="media/how-to-integrate-time-series-insights/tsi-create-twinID.png" alt-text="The creation portal UX for a Time Series Insights environment. The PAYG(Preview) pricing tier is selected and the time series ID property name is $dtId":::

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