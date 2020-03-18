---
# Mandatory fields.
title: Ingest Telemetry from IoT Hub
titleSuffix: Azure Digital Twins
description: How to ingest messages from IoT Hub
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/12/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Ingesting Telemetry from IoT Hub

Azure Digital Twins is driven with data from IoT and other sources by calling digital twin apis to set properties or fire telemetry events on twins. Once the initial property change or telemetry event arrives inside of ADT, all further event propagation and processing happens inside of ADT.

This how-to document walks through an example of ingesting telemetry from IoT Hub.

## Goals
This how-to outlines how to send messages from IoT Hub to ADT using an Azure Function. In this example we have:
* A thermometer device in IoT Hub with a known ID
* A twin to represent the device with a matching ID (or any ID that you can map to from the ID of the device. It is of course possible to provide more sophisticated mappings, for example with a mapping table, but in this example we assume a simple ID match)
* A twin representing a room. Whenever a temperature telemetry event is sent by the thermometer device, we want to have the temperature property of the room twin update. Hence, we need to map from a telemetry event on a device to a property setter on a logical twin.

In this example, we will assume a twin representing the device that we can identify with an ID match. We will then use topology information from the graph to find the room twin, and set a property on that twin. This is just one of many possible configurations and matching strategies - just one example out of many possible ones.

[![Ingest Overview](media/how-to-ingest/ingestingEvents.png)](media/how-to-ingest/ingestingEvents.png)

## Setup

To create this example you need to: 
* Create an IoT Hub
* Use Visual Studio 2019 to create an Azure Function with an EventGridTrigger.
* Publish the function to Azure
* Set up MSI authentication for the function. THis will enable the function to talk to your ADT app registration.
* In the Events blade of your IoT Hub instance, create a subscription to your Azure function. 
  * Select Telemetry as the event type
  * Add a filter if so desired, using Event Grid filtering

Your Azure Function might contain code like this:
```csharp
[FunctionName("PropertySetFunction")]
public static async void PropertySetFunction(
    [EventGridTrigger]EventGridEvent eventGridEvent,
    ILogger log)
{
    log.LogInformation($"Function called");
    // thius is the ADT app id. You enabled authentication to this id bu setting up MSI
    var target = "0b07f429-9f4b-4714-9392-cc5e8e80c8b0";
    var azureServiceTokenProvider = new AzureServiceTokenProvider();
    string accessToken = await azureServiceTokenProvider.GetAccessTokenAsync(target);

    var wc = new System.Net.Http.HttpClient();
    wc.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

    try
    {
        TokenCredentials tk = new TokenCredentials(accessToken);
        AzureDigitalTwinsAPI client = new AzureDigitalTwinsAPI(tk);
        client.BaseUri = new Uri(AdtInstanceUrl);
        log.LogInformation($"Client connection created.");
        
        try
        {
            // Extract the device ID and temperature measurement from the event grid message
            JObject job = eventGridEvent.Data as JObject;
            string devid = (string)job["systemProperties"].ToObject<JObject>().Property("iothub-connection-device-id").Value;
            double temp = (double)job["body"].ToObject<JObject>().Property("temperature").Value;

            string source = null;
            // Find the room
            IPage<IncomingEdge> relPage = await client.DigitalTwins.ListIncomingEdgesAsync(id);
            // Making the simplifying assumption that we only have one relationship incoming
            if (relPage!=null)
            {
                IncomingEdge ie = relPage.FirstOrDefault();
                if (ie != null) {
                    source = ie.SourceId; 
                }
            }
                    
            if (source!=null) {
                // Patch the room
                JsonPatch jp = new JsonPatch();
                jp.AppendReplaceOp("/Temperature", 85);
                object result = await client.DigitalTwins.UpdateAsync(source, patch);
            }
            
        }
        catch (Exception e)
        {
            log.LogError($"Error: {e.Message}");
        }
    }
    catch (Exception e)
    {
        log.LogInformation($"Client creation failed:");
        log.LogInformation(e.Message);
    }

    //log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}, accessToken: {accessToken}");
}
```
THe example above uses a simple helper class to create a Json Patch

```csharp
public class JsonPatch
    {
        private List<Dictionary<string,object>> ops = new List<Dictionary<string, object>>();
        public JsonPatch()
        {
            ops = new List<Dictionary<string, object>>();
        }

        public void AppendReplaceOp(string path, object value)
        {
            Dictionary<string, object> op = new Dictionary<string, object>();
            op.Add("op", "replace");
            op.Add("path", path);
            op.Add("value", value);
            ops.Add(op);
        }

        public void AppendAddOp(string path, object value)
        {
            Dictionary<string, object> op = new Dictionary<string, object>();
            op.Add("op", "add");
            op.Add("path", path);
            op.Add("value", value);
            ops.Add(op);
        }

        public void AppendRemoveOp(string path)
        {
            Dictionary<string, object> op = new Dictionary<string, object>();
            op.Add("op", "remove");
            op.Add("path", path);
            ops.Add(op);
        }

        public string Serialize() 
        {
            string jpatch = JsonConvert.SerializeObject(ops);
            return jpatch;
        }

        public object Document
        {
            get { return ops; }
        }
    }
```

  