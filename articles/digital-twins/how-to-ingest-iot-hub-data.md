---
# Mandatory fields.
title: Ingest telemetry from IoT Hub
titleSuffix: Azure Digital Twins
description: See how to ingest device telemetry messages from IoT Hub.
author: cschormann
ms.author: cschorm # Microsoft employees only
ms.date: 3/17/2020
ms.topic: how-to
ms.service: digital-twins
ROBOTS: NOINDEX, NOFOLLOW

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Ingest IoT Hub telemetry into Azure Digital Twins

[!INCLUDE [Azure Digital Twins current preview status](../../includes/digital-twins-preview-status.md)]

Azure Digital Twins is driven with data from IoT devices and other sources. A common source for device data to use in Azure Digital Twins is [IoT Hub](../iot-hub/about-iot-hub.md).

During preview, the process for ingesting data into Azure Digital Twins is to set up an external compute resource, such as an [Azure function](../azure-functions/functions-overview.md), that receives the data and uses the [DigitalTwins APIs](how-to-use-apis-sdks.md) to set properties or fire telemetry events on [digital twins](concepts-twins-graph.md) accordingly. 

This how-to document walks through the process for writing an Azure function that can ingest telemetry from IoT Hub.

## Example telemetry scenario

This how-to outlines how to send messages from IoT Hub to Azure Digital Twins, using an Azure function. There are many possible configurations and matching strategies you can use for this, but the example for this article contains the following parts:
* A thermometer device in IoT Hub, with a known device ID.
* A digital twin to represent the device, with a matching ID
* A digital twin representing a room

> [!NOTE]
> This example uses a straightforward ID match between the device ID and a corresponding digital twin's ID, but it is possible to provide more sophisticated mappings from the device to its twin (such as with a mapping table).

Whenever a temperature telemetry event is sent by the thermometer device, the *temperature* property of the *Room* twin should update. To make this happen, you will map from a telemetry event on a device to a property setter on the digital twin. You will use topology information from the [twin graph](concepts-twins-graph.md) to find the *Room* twin, and then you can set the twin's property. In other scenarios, users might want to set a property on the matching twin (in this example, the twin with the ID of *123*). Azure Digital Twins gives you a lot of flexibility to decide how telemetry data maps into twins. 

This scenario is outlined in a diagram below:

:::image type="content" source="media/how-to-ingest-iot-hub-data/events.png" alt-text="An IoT Hub device sends Temperature telemetry through IoT Hub, Event Grid, or system topics to an Azure Function, which updates a temperature property on twins in Azure Digital Twins." border="false":::

## Prerequisites

Before continuing with this example, you'll need to complete the following prerequisites.
1. Create an IoT hub. See the *Create an IoT Hub* section of [this IoT Hub quickstart](../iot-hub/quickstart-send-telemetry-cli.md) for instructions.
2. Create at least one Azure function to process events from IoT Hub. See [How-to: Set up an Azure function for processing data](how-to-create-azure-function.md) to build a basic Azure function that can connect to Azure Digital Twins and call Azure Digital Twins API functions. The rest of this how-to will build on this function.
3. Set up an event destination for hub data. In the [Azure portal](https://portal.azure.com/), navigate to your IoT Hub instance. Under *Events*, create a subscription for your Azure function. 

    :::image type="content" source="media/how-to-ingest-iot-hub-data/add-event-subscription.png" alt-text="Azure portal: Adding an event subscription":::

4. In the *Create Event Subscription* page, fill the fields as follows:
   * Under *EVENT SUBSCRIPTION DETAILS*, name the subscription what you would like
   * Under *EVENT TYPES*, choose *Device Telemetry* as the event type to filter on
      - Add filters to other event types, if you would like.
   * Under *ENDPOINT DETAILS*, select your Azure function as an endpoint

## Create an Azure function in Visual Studio

This section uses the same Visual Studio startup steps and Azure function skeleton from [How-to: Set up an Azure function for processing data](how-to-create-azure-function.md). The skeleton handles authentication and creates a service client, ready for you to process data and call Azure Digital Twins APIs in response. 

The heart of the skeleton function is this:

```csharp
namespace FunctionSample
{
    public static class FooFunction
    {
        const string adtAppId = "https://digitaltwins.azure.net";
        private static string adtInstanceUrl = Environment.GetEnvironmentVariable("ADT_SERVICE_URL");
        private static HttpClient httpClient = new HttpClient();

        [FunctionName("Foo")]
        public static async Task Run([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
        {
            DigitalTwinsClient client = null;
            try
            {
                ManagedIdentityCredential cred = new ManagedIdentityCredential(adtAppId);
                DigitalTwinsClientOptions opts = 
                    new DigitalTwinsClientOptions { Transport = new HttpClientTransport(httpClient) });
                client = new DigitalTwinsClient(new Uri(adtInstanceUrl), cred, opts);
                                                
                log.LogInformation($"ADT service client connection created.");
            }
            catch (Exception e)
            {
                log.LogError($"ADT service client connection failed. " + e.ToString());
                return;
            }
            log.LogInformation(eventGridEvent.Data.ToString());
        }
    }
}
```

In the steps that follow, you'll add specific code to it for processing IoT telemetry events from IoT Hub.  

## Add telemetry processing

Telemetry events come in the form of messages from the device. The first step in adding telemetry-processing code is extracting the relevant part of this device message from the Event Grid event. 

Different devices may structure their messages differently, so the code for this step depends on the connected device. 

The following code shows an example for a simple device that sends telemetry as JSON. The sample extracts the device ID of the device that sent the message, as well as the temperature value.

```csharp
JObject job = eventGridEvent.Data as JObject;
string devid = (string)job["systemProperties"].ToObject<JObject>().Property("IoT-hub-connection-device-ID").Value;
double temp = (double)job["body"].ToObject<JObject>().Property("temperature").Value;
```

Recall that the purpose of this exercise is to update the temperature of a *Room* within the twin graph. This means that our target for the message is not the digital twin that is associated with this device, but the *Room* twin that is its parent. You can find the parent twin using the device ID value that you extracted from the telemetry message using the code above.

To do this, use the Azure Digital Twins APIs to access the incoming relationships to the device-representing twin (which in this case has the same ID as the device). From the incoming relationship, you can find the ID of the parent with the code snippet below.

The code snippet below shows how to retrieve incoming relationships of a twin:

```csharp
AsyncPageable<IncomingRelationship> res = client.GetIncomingRelationshipsAsync(twin_id);
await foreach (IncomingRelationship irel in res)
{
    Log.Ok($"Relationship: {irel.RelationshipName} from {irel.SourceId} | {irel.RelationshipId}");
}
```

The parent of your twin is in the *SourceId* property of the relationship.

It is fairly common for a model of a twin representing a device to only have a single incoming relationship. In this case, you might pick the first (and only) relationship returned. If your models allow multiple types of relationships to this twin, you might need to specify further to choose from multiple incoming relationships. A common way to do this is to pick the relationship by `RelationshipName`. 

Once you have the ID of the parent twin representing the *Room*, you can "patch" (make updates to) that twin. To do this, use the following code:

```csharp
UpdateOperationsUtility uou = new UpdateOperationsUtility();
uou.AppendAddOp("/Temperature", temp);
try
{
    await client.UpdateDigitalTwinAsync(twin_id, uou.Serialize());
    Log.Ok($"Twin '{twin_id}' updated successfully!");
}
...
```

### Full Azure function code

Using the code from the earlier samples, here is the entire Azure function in context:

```csharp
[FunctionName("ProcessHubToDTEvents")]
public async void Run([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
{
    // After this is deployed, in order for this function to be authorized on Azure Digital Twins APIs,
    // you'll need to turn the Managed Identity Status to "On", 
    // grab the Object ID of the function, and assign the "Azure Digital Twins Owner (Preview)" role to this function identity.

    DigitalTwinsClient client = null;
    //log.LogInformation(eventGridEvent.Data.ToString());
    // Authenticate on Azure Digital Twins APIs
    try
    {
        
        ManagedIdentityCredential cred = new ManagedIdentityCredential(adtAppId);
        client = new DigitalTwinsClient(new Uri(adtInstanceUrl), cred, new DigitalTwinsClientOptions { Transport = new HttpClientTransport(httpClient) });
        log.LogInformation($"ADT service client connection created.");
    }
    catch (Exception e)
    {
        log.LogError($"ADT service client connection failed. " + e.ToString());
        return;
    }

    if (client != null)
    {
        try
        {
            if (eventGridEvent != null && eventGridEvent.Data != null)
            {
                #region Open this region for message format information
                // Telemetry message format
                //{
                //  "properties": { },
                //  "systemProperties": 
                // {
                //    "iothub-connection-device-id": "thermostat1",
                //    "iothub-connection-auth-method": "{\"scope\":\"device\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
                //    "iothub-connection-auth-generation-id": "637199981642612179",
                //    "iothub-enqueuedtime": "2020-03-18T18:35:08.269Z",
                //    "iothub-message-source": "Telemetry"
                //  },
                //  "body": "eyJUZW1wZXJhdHVyZSI6NzAuOTI3MjM0MDg3MTA1NDg5fQ=="
                //}
                #endregion

                // Reading deviceId from message headers
                log.LogInformation(eventGridEvent.Data.ToString());
                JObject job = (JObject)JsonConvert.DeserializeObject(eventGridEvent.Data.ToString());
                string deviceId = (string)job["systemProperties"]["iothub-connection-device-id"];
                log.LogInformation($"Found device: {deviceId}");

                // Extracting temperature from device telemetry
                byte[] body = System.Convert.FromBase64String(job["body"].ToString());
                var value = System.Text.ASCIIEncoding.ASCII.GetString(body);
                var bodyProperty = (JObject)JsonConvert.DeserializeObject(value);
                var temperature = bodyProperty["Temperature"];
                log.LogInformation($"Device Temperature is:{temperature}");

                // Update device Temperature property
                await AdtUtilities.UpdateTwinProperty(client, deviceId, "/Temperature", temperature, log);

                // Find parent using incoming relationships
                string parentId = await AdtUtilities.FindParent(client, deviceId, "contains", log);
                if (parentId != null)
                {
                    await AdtUtilities.UpdateTwinProperty(client, parentId, "/Temperature", temperature, log);
                }

            }
        }
        catch (Exception e)
        {
            log.LogError($"Error in ingest function: {e.Message}");
        }
    }
}
```

The utility function to find incoming relationships:
```csharp
public static async Task<string> FindParent(DigitalTwinsClient client, string child, string relname, ILogger log)
{
    // Find parent using incoming relationships
    try
    {
        AsyncPageable<IncomingRelationship> rels = client.GetIncomingRelationshipsAsync(child);

        await foreach (IncomingRelationship ie in rels)
        {
            if (ie.RelationshipName == relname)
                return (ie.SourceId);
        }
    }
    catch (RequestFailedException exc)
    {
        log.LogInformation($"*** Error in retrieving parent:{exc.Status}:{exc.Message}");
    }
    return null;
}
```

And the utility function to patch the twin:
```csharp
public static async Task UpdateTwinProperty(DigitalTwinsClient client, string twinId, string propertyPath, object value, ILogger log)
{
    // If the twin does not exist, this will log an error
    try
    {
        // Update twin property
        UpdateOperationsUtility uou = new UpdateOperationsUtility();
        uou.AppendAddOp(propertyPath, value);
        await client.UpdateDigitalTwinAsync(twinId, uou.Serialize());
    }
    catch (RequestFailedException exc)
    {
        log.LogInformation($"*** Error:{exc.Status}/{exc.Message}");
    }
}
```

Now you have an Azure function that is equipped to read and interpret the scenario data coming from IoT Hub.

## Debug Azure function apps locally

It is possible to debug Azure functions with an Event Grid trigger locally. For more information about this, see [Debug Event Grid trigger locally](../azure-functions/functions-debug-event-grid-trigger-local.md).

## Next steps

Read about data ingress and egress with Azure Digital Twins:
* [Concepts: Integration with other services](concepts-integration.md)
