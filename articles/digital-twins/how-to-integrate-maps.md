---
# Mandatory fields.
title: Use Azure Digital Twins to update an Azure Maps indoor map
titleSuffix: Azure Digital Twins
description: See how to create an Azure function that can use the twin graph and Azure Digital Twins notifications to update information shown in Azure Maps.
author: alexkarcher-msft
ms.author: alkarche # Microsoft employees only
ms.date: 6/3/2020
ms.topic: how-to
ms.service: digital-twins
ROBOTS: NOINDEX, NOFOLLOW

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
ms.reviewer: baanders
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Use Azure Digital Twins to update an Azure Maps indoor map

[!INCLUDE [Azure Digital Twins current preview status](../../includes/digital-twins-preview-status.md)]

This article walks through the steps required to use Azure Digital Twins data to update information displayed on an *indoor map* using [Azure Maps](../azure-maps/about-azure-maps.md). Azure Digital Twins stores a graph of your IoT device relationships and routes telemetry to different endpoints, making it the perfect service for updating informational overlays on maps.

This how-to will cover:

1. Configuring your Azure Digital Twins instance to send twin update events to a function in [Azure Functions](../azure-functions/functions-overview.md).
2. Creating an Azure function to update an Azure Maps indoor maps feature stateset.
3. How to store your maps ID and feature stateset ID in the Azure Digital Twins graph.

### Prerequisites

* Follow the Azure Digital Twins [Tutorial: Connect an end-to-end solution](./tutorial-end-to-end.md).
    * You'll be extending this twin with an additional endpoint and route. You will also be adding another function to your function app from that tutorial. 
* Follow the Azure Maps [Tutorial: Use Azure Maps Creator to create indoor maps](../azure-maps/tutorial-creator-indoor-maps.md) to create an Azure Maps indoor map with a *feature stateset*.
    * [Feature statesets](../azure-maps/creator-indoor-maps.md#feature-statesets) are collections of dynamic properties (states) assigned to dataset features such as rooms or equipment. In the Azure Maps tutorial above, the feature stateset stores room status that you will be displaying on a map.
    * You will need your feature *stateset ID* and Azure Maps *subscription ID*.

### Topology

The image below illustrates where the indoor maps integration elements in this tutorial fit into a larger, end-to-end Azure Digital Twins scenario.

:::image type="content" source="media/how-to-integrate-maps/maps-integration-topology.png" alt-text="A view of Azure services in an end-to-end scenario, highlighting the Indoor Maps Integration piece" lightbox="media/how-to-integrate-maps/maps-integration-topology.png":::

## Create a function to update a map when twins update

First, you'll create a route in Azure Digital Twins to forward all twin update events to an event grid topic. Then, you'll use an Azure function to read those update messages and update a feature stateset in Azure Maps. 

## Create a route and filter to twin update notifications

Azure Digital Twins instances can emit twin update events whenever a twin's state is updated. The [Azure Digital Twins tutorial: Connect an end-to-end solution](./tutorial-end-to-end.md) linked above walks through a scenario where a thermometer is used to update a temperature attribute attached to a room's twin. You'll be extending that solution by subscribing to update notifications for twins, and using that information to update our maps.

This pattern reads from the room twin directly, rather than the IoT device, which gives us the flexibility to change the underlying data source for temperature without needing to update our mapping logic. For example, you can add multiple thermometers or set this room to share a thermometer with another room, all without needing to update our map logic.

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

You're going to create an Event Grid-triggered function inside our function app from the [end-to-end tutorial](./tutorial-end-to-end.md). This function will unpack those notifications and send updates to an Azure Maps feature stateset to update the temperature of one room. 

See the following document for reference info: [Azure Event Grid trigger for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-bindings-event-grid-trigger).

Replace the function code with the following code. It will filter out only updates to space twins, read the updated temperature, and send that information to Azure Maps.

```C#
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;
using System.Net.Http;

namespace SampleFunctionsApp
{
    public static class ProcessDTUpdatetoMaps
    {   //Read maps credentials from application settings on function startup
        private static string statesetID = Environment.GetEnvironmentVariable("statesetID");
        private static string subscriptionKey = Environment.GetEnvironmentVariable("subscription-key");
        private static HttpClient httpClient = new HttpClient();

        [FunctionName("ProcessDTUpdatetoMaps")]
        public static async Task Run([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
        {
            JObject message = (JObject)JsonConvert.DeserializeObject(eventGridEvent.Data.ToString());
            log.LogInformation("Reading event from twinID:" + eventGridEvent.Subject.ToString() + ": " +
                eventGridEvent.EventType.ToString() + ": " + message["data"]);

            //Parse updates to "space" twins
            if (message["data"]["modelId"].ToString() == "dtmi:contosocom:DigitalTwins:Space;1")
            {   //Set the ID of the room to be updated in our map. 
                //Replace this line with your logic for retrieving featureID. 
                string featureID = "UNIT103";

                //Iterate through the properties that have changed
                foreach (var operation in message["data"]["patch"])
                {
                    if (operation["op"].ToString() == "replace" && operation["path"].ToString() == "/Temperature")
                    {   //Update the maps feature stateset
                        var postcontent = new JObject(new JProperty("States", new JArray(
                            new JObject(new JProperty("keyName", "temperature"),
                                 new JProperty("value", operation["value"].ToString()),
                                 new JProperty("eventTimestamp", DateTime.Now.ToString("s"))))));

                        var response = await httpClient.PostAsync(
                            $"https://atlas.microsoft.com/featureState/state?api-version=1.0&statesetID={statesetID}&featureID={featureID}&subscription-key={subscriptionKey}",
                            new StringContent(postcontent.ToString()));

                        log.LogInformation(await response.Content.ReadAsStringAsync());
                    }
                }
            }
        }
    }
}
```

You'll need to set two environment variables in your function app. One is your [Azure Maps primary subscription key](../azure-maps/quick-demo-map-app.md#get-the-primary-key-for-your-account), and one is your [Azure Maps stateset ID](../azure-maps/tutorial-creator-indoor-maps.md#create-a-feature-stateset).

```azurecli-interactive
az functionapp config appsettings set --settings "subscription-key=<your-Azure-Maps-primary-subscription-key> -g <your-resource-group> -n <your-App-Service-(function-app)-name>"
az functionapp config appsettings set --settings "statesetID=<your-Azure-Maps-stateset-ID> -g <your-resource-group> -n <your-App-Service-(function-app)-name>
```

### View live updates on your map

To see live-updating temperature, follow the steps below:

1. Begin sending simulated IoT data by running the **DeviceSimulator** project from the Azure Digital Twins [Tutorial: Connect an end-to-end solution](tutorial-end-to-end.md). The instructions for this are in the [*Configure and run the simulation*](././tutorial-end-to-end.md#configure-and-run-the-simulation) section.
2. Use [the **Azure Maps Indoor** module](../azure-maps/how-to-use-indoor-module.md) to render your indoor maps created in Azure Maps Creator.
    1. Copy the HTML from the [*Example: Use the Indoor Maps Module*](../azure-maps/how-to-use-indoor-module.md#example-use-the-indoor-maps-module) section of the indoor maps [Tutorial: Use the Azure Maps Indoor Maps module](../azure-maps/how-to-use-indoor-module.md) to a local file.
    1. Replace the *tilesetId* and *statesetID* in the local HTML file with your values.
    1. Open that file in your browser.

Both samples send temperature in a compatible range, so you should see the color of room 121 update on the map about every 30 seconds.

:::image type="content" source="media/how-to-integrate-maps/maps-temperature-update.png" alt-text="An office map showing room 121 colored orange":::

## Store your maps information in Azure Digital Twins

Now that you have a hardcoded solution to updating your maps information, you can use the Azure Digital Twins graph to store all of the information necessary for updating your indoor map. This would include the stateset ID, maps subscription ID, and feature ID of each map and location respectively. 

A solution for this specific example would involve updating each top-level space to have a stateset ID and maps subscription ID attribute, and updating each room to have a feature ID. You would need to set these values once when initializing the twin graph, then query those values for each twin update event.

Depending on the configuration of your topology, you will be able to store these three attributes at different levels correlating to the granularity of your map.

## Next steps

To read more about managing, upgrading, and retrieving information from the twins graph, see the following references:

* [How-to: Manage a digital twin](./how-to-manage-twin.md)
* [How-to: Query the twin graph](./how-to-query-graph.md)