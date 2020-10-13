---
# Mandatory fields.
title: Integrate with Azure Time Series Insights
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

1. First, create an event hub namespace, which will receive events from your Azure Digital Twins instance. You can either use the Azure CLI instructions below, or use the Azure portal: [*Quickstart: Create an event hub using Azure portal*](../event-hubs/event-hubs-create.md).

    ```azurecli
    # Create an Event Hubs namespace. Specify a name for the Event Hubs namespace.
    az eventhubs namespace create --name <name for your Event Hubs namespace> --resource-group <resource group name> -l <region, for example: East US>
    ```

2. Create an event hub within the namespace.

    ```azurecli
    # Create an event hub to receive twin change events. Specify a name for the event hub. 
    az eventhubs eventhub create --name <name for your Twins event hub> --resource-group <resource group name> --namespace-name <Event Hubs namespace from above>
    ```

3. Create an [authorization rule](https://docs.microsoft.com/cli/azure/eventhubs/eventhub/authorization-rule?view=azure-cli-latest#az-eventhubs-eventhub-authorization-rule-create) with send and receive permissions.

    ```azurecli
    # Create an authorization rule. Specify a name for the rule.
    az eventhubs eventhub authorization-rule create --rights Listen Send --resource-group <resource group name> --namespace-name <Event Hubs namespace from above> --eventhub-name <Twins event hub name from above> --name <name for your Twins auth rule>
    ```

4. Create an Azure Digital Twins [endpoint](concepts-route-events.md#create-an-endpoint) that links your event hub to your Azure Digital Twins instance.

    ```azurecli
    az dt endpoint create eventhub --endpoint-name <name for your Event Hubs endpoint> --eventhub-resource-group <resource group name> --eventhub-namespace <Event Hubs namespace from above> --eventhub <Twins event hub name from above> --eventhub-policy <Twins auth rule from above> -n <your Azure Digital Twins instance name>
    ```

5. Create a [route](concepts-route-events.md#create-an-event-route) in Azure Digital Twins to send twin update events to your endpoint. The filter in this route will only allow twin update messages to be passed to your endpoint.

    >[!NOTE]
    >There is currently a **known issue** in Cloud Shell affecting these command groups: `az dt route`, `az dt model`, `az dt twin`.
    >
    >To resolve, either run `az login` in Cloud Shell prior to running the command, or use the [local CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) instead of Cloud Shell. For more detail on this, see [*Troubleshooting: Known issues in Azure Digital Twins*](troubleshoot-known-issues.md#400-client-error-bad-request-in-cloud-shell).

    ```azurecli
    az dt route create -n <your Azure Digital Twins instance name> --endpoint-name <Event Hub endpoint from above> --route-name <name for your route> --filter "type = 'Microsoft.DigitalTwins.Twin.Update'"
    ```

Before moving on, take note of your *Event Hubs namespace* and *resource group*, as you will use them again to create another event hub later in this article.

## Create an Azure function 

Next, you'll create an Event Hubs-triggered function inside a function app. You can use the function app created in the end-to-end tutorial ([*Tutorial: Connect an end-to-end solution*](./tutorial-end-to-end.md)), or your own. 

This function will convert those twin update events from their original form as JSON Patch documents to JSON objects, containing only updated and added values from your twins.

For more information about using Event Hubs with Azure functions, see [*Azure Event Hubs trigger for Azure Functions*](../azure-functions/functions-bindings-event-hubs-trigger.md).

Inside your published function app, replace the function code with the following code.

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
        public static async Task Run(
            [EventHubTrigger("twins-event-hub", Connection = "EventHubAppSetting-Twins")]EventData myEventHubMessage, 
            [EventHub("tsi-event-hub", Connection = "EventHubAppSetting-TSI")]IAsyncCollector<string> outputEvents, 
            ILogger log)
        {
            JObject message = (JObject)JsonConvert.DeserializeObject(Encoding.UTF8.GetString(myEventHubMessage.Body));
            log.LogInformation("Reading event:" + message.ToString());

            // Read values that are replaced or added
            Dictionary<string, object> tsiUpdate = new Dictionary<string, object>();
            foreach (var operation in message["patch"]) {
                if (operation["op"].ToString() == "replace" || operation["op"].ToString() == "add")
                {
                    //Convert from JSON patch path to a flattened property for TSI
                    //Example input: /Front/Temperature
                    //        output: Front.Temperature
                    string path = operation["path"].ToString().Substring(1);                    
                    path = path.Replace("/", ".");                    
                    tsiUpdate.Add(path, operation["value"]);
                }
            }
            //Send an update if updates exist
            if (tsiUpdate.Count>0){
                tsiUpdate.Add("$dtId", myEventHubMessage.Properties["cloudEvents:subject"]);
                await outputEvents.AddAsync(JsonConvert.SerializeObject(tsiUpdate));
            }
        }
    }
}
```

From here, the function will then send the JSON objects it creates to a second event hub, which you will connect to Time Series Insights.

Later, you'll also set some environment variables that this function will use to connect to your own event hubs.

## Send telemetry to an event hub

You will now create a second event hub, and configure your function to stream its output to that event hub. This event hub will then be connected to Time Series Insights.

### Create an event hub

To create the second event hub, you can either use the Azure CLI instructions below, or use the Azure portal: [*Quickstart: Create an event hub using Azure portal*](../event-hubs/event-hubs-create.md).

1. Prepare your *Event Hubs namespace* and *resource group* name from earlier in this article

2. Create a new event hub
    ```azurecli
    # Create an event hub. Specify a name for the event hub. 
    az eventhubs eventhub create --name <name for your TSI event hub> --resource-group <resource group name from earlier> --namespace-name <Event Hubs namespace from earlier>
    ```
3. Create an [authorization rule](https://docs.microsoft.com/cli/azure/eventhubs/eventhub/authorization-rule?view=azure-cli-latest#az-eventhubs-eventhub-authorization-rule-create) with send and receive permissions
    ```azurecli
    # Create an authorization rule. Specify a name for the rule.
    az eventhubs eventhub authorization-rule create --rights Listen Send --resource-group <resource group name> --namespace-name <Event Hubs namespace from earlier> --eventhub-name <TSI event hub name from above> --name <name for your TSI auth rule>
    ```

## Configure your function

Next, you'll need to set environment variables in your function app from earlier, containing the connection strings for the event hubs you've created.

### Set the Twins event hub connection string

1. Get the Twins [event hub connection string](../event-hubs/event-hubs-get-connection-string.md), using the authorization rules you created above for the Twins hub.

    ```azurecli
    az eventhubs eventhub authorization-rule keys list --resource-group <resource group name> --namespace-name <Event Hubs namespace> --eventhub-name <Twins event hub name from earlier> --name <Twins auth rule from earlier>
    ```

2. Use the connection string you get as a result to create an app setting in your function app that contains your connection string:

    ```azurecli
    az functionapp config appsettings set --settings "EventHubAppSetting-Twins=<Twins event hub connection string>" -g <resource group> -n <your App Service (function app) name>
    ```

### Set the Time Series Insights event hub connection string

1. Get the TSI [event hub connection string](../event-hubs/event-hubs-get-connection-string.md), using the authorization rules you created above for the Time Series Insights hub:

    ```azurecli
    az eventhubs eventhub authorization-rule keys list --resource-group <resource group name> --namespace-name <Event Hubs namespace> --eventhub-name <TSI event hub name> --name <TSI auth rule>
    ```

2. In your function app, create an app setting containing your connection string:

    ```azurecli
    az functionapp config appsettings set --settings "EventHubAppSetting-TSI=<TSI event hub connection string>" -g <resource group> -n <your App Service (function app) name>
    ```

## Create and connect a Time Series Insights instance

Next, you will set up a Time Series Insights instance to receive the data from your second event hub. Follow the steps below, and for more details about this process, see [*Tutorial: Set up an Azure Time Series Insights Gen2 PAYG environment*](../time-series-insights/tutorials-set-up-tsi-environment.md).

1. In the Azure portal, begin creating a Time Series Insights resource. 
    1. Select the **PAYG(Preview)** pricing tier.
    2. You will need to choose a **time series ID** for this environment. Your time series ID can be up to three values that you will use to search for your data in Time Series Insights. For this tutorial, you can use **$dtId**. Read more about selecting an ID value in [*Best practices for choosing a Time Series ID*](https://docs.microsoft.com/azure/time-series-insights/how-to-select-tsid).
    
        :::image type="content" source="media/how-to-integrate-time-series-insights/create-twin-id.png" alt-text="The creation portal UX for a Time Series Insights environment. The PAYG(Preview) pricing tier is selected and the time series ID property name is $dtId":::

2. Select **Next: Event Source** and select your Event Hubs information from above. You will also need to create a new Event Hubs consumer group.
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/event-source-twins.png" alt-text="The creation portal UX for a Time Series Insights environment event source. You are creating an event source with the event hub information from above. You are also creating a new consumer group.":::

## Begin sending IoT data to Azure Digital Twins

To begin sending data to Time Series Insights, you will need to start updating the digital twin properties in Azure Digital Twins with changing data values. Use the [az dt twin update](https://docs.microsoft.com/cli/azure/ext/azure-iot/dt/twin?view=azure-cli-latest#ext-azure-iot-az-dt-twin-update) command.

[!INCLUDE [digital-twins-known-issue-cloud-shell](../../includes/digital-twins-known-issue-cloud-shell.md)]

If you are using the end-to-end tutorial ([*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md)) to assist with environment setup, you can begin sending simulated IoT data by running the *DeviceSimulator* project from the sample. The instructions are in the [*Configure and run the simulation*](tutorial-end-to-end.md#configure-and-run-the-simulation) section of the tutorial.

## Visualize your data in Time Series Insights

Now, data should be flowing into your Time Series Insights instance, ready to be analyzed. Follow the steps below to explore the data coming in.

1. Open your Time Series Insights instance in the [Azure portal](https://portal.azure.com) (you can search for the name of your instance in the portal search bar). Visit the *Time Series Insights Explorer URL* shown in the instance overview.
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/view-environment.png" alt-text="Select the Time Series Insights explorer URL in the overview tab of your Time Series Insights environment":::

2. In the explorer, you will see your three twins from Azure Digital Twins shown on the left. Select _**thermostat67**_, select **temperature**, and hit **add**.

    :::image type="content" source="media/how-to-integrate-time-series-insights/add-data.png" alt-text="Select **thermostat67**, select **temperature**, and hit **add**":::

3. You should now be seeing the initial temperature readings from your thermostat, as shown below. That same temperature reading is updated for *room21* and *floor1*, and you can visualize those data streams in tandem.
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/initial-data.png" alt-text="Initial temperature data is graphed in the TSI explorer. It is a line of random values between 68 and 85":::

4. If you allow the simulation to run for much longer, your visualization will look something like this:
    
    :::image type="content" source="media/how-to-integrate-time-series-insights/day-data.png" alt-text="Temperature data for each twin is graphed in three parallel lines of different colors.":::

## Next steps

The digital twins are stored by default as a flat hierarchy in Time Series Insights, but they can be enriched with model information and a multi-level hierarchy for organization. To learn more about this process, read: 

* [*Tutorial: Define and apply a model*](../time-series-insights/tutorials-set-up-tsi-environment.md#define-and-apply-a-model) 

You can write custom logic to automatically provide this information using the model and graph data already stored in Azure Digital Twins. To read more about managing, upgrading, and retrieving information from the twins graph, see the following references:

* [*How-to: Manage a digital twin*](./how-to-manage-twin.md)
* [*How-to: Query the twin graph*](./how-to-query-graph.md)
