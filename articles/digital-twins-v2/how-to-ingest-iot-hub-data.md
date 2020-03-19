---
# Mandatory fields.
title: Ingest telemetry from IoT Hub
titleSuffix: Azure Digital Twins
description: See how to ingest messages from IoT Hub.
author: cschorm
ms.author: cschorm # Microsoft employees only
ms.date: 3/17/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Ingest telemetry from IoT Hub

Azure Digital Twins is driven with data from IoT and other sources, by calling [DigitalTwins APIs](how-to-use-apis.md) to set properties or fire telemetry events on twins. Once the initial property change or telemetry event arrives inside of Azure Digital Twins, all further event propagation and processing happens inside of Azure Digital Twins.

This how-to document walks through an example of ingesting telemetry from [IoT Hub](../iot-hub/about-iot-hub.md).

## Goals

This how-to outlines how to send messages from IoT Hub to Azure Digital Twins using an Azure Function. This example contains:
* A thermometer device in IoT Hub with a known ID.
* A twin to represent the device with a matching ID (or any ID that you can map to from the ID of the device. It is certainly possible to provide more sophisticated mappings, like with a mapping table, but this example assumes a straightforward ID match).
* A twin representing a room. Whenever a temperature telemetry event is sent by the thermometer device, the temperature property of the room twin should update. Hence, you will map from a telemetry event on a device to a property setter on a logical twin.

In this example, you will work with a twin representing a device that can be identified with an ID match. You will then use topology information from the graph to find the room twin, and set a property on that twin. This is just one of many possible configurations and matching strategies—just one example out of many possible ones.

[![Ingest Overview](media/how-to-ingest-iot-hub-data/ingestingEvents.png)](media/how-to-ingest-iot-hub-data/ingestingEvents.png)

## Setup overview

Prior to completing this example, you need to: 
* Create an IoT hub. See the *Create an IoT Hub* section of [this IoT Hub quickstart](../iot-hub/quickstart-send-telemetry-cli.md) for instructions.
* Create at least one Azure Function to process events from IoT Hub. See [Create an Azure Function for Azure Digital Twins](how-to-create-azure-function.md) for a skeleton Azure Function that can connect to Azure Digital Twins and call Azure Digital Twins API functions.   
* In the Events blade of your IoT Hub instance, create a subscription to your Azure function. 
  - Select *Telemetry* as the event type
  - Add a filter if desired, using Event Grid filtering

## Create an Azure Function in Visual Studio

In this section, you'll add specific code to process IoT telemetry events from IoT Hub to the skeleton function presented in [Create an Azure Function for Azure Digital Twins](how-to-create-azure-function.md). The skeleton handles authentication and creates a service client, ready for you to process data and call Azure Digital Twins APIs in response. 

The heart of the skeleton code is:

```csharp
[FunctionName("Function1")]
static async Task Run([EventGridTrigger]EventGridEvent eventGridEvent, 
                      ILogger log)
{
    await Authenticate(log);
    log.LogInformation(eventGridEvent.Data.ToString());
    if (client!=null)
    {
        // Add your code here
    }
}
```

The first step is to extract the relevant part of the device message from the Event Grid event. 

This code depends on the connected device. For a simple device that sends telemetry as JSON, it might look like the following code that extracts the device ID that sent the message and a temperature value from the message.

```csharp
JObject job = eventGridEvent.Data as JObject;
string devid = (string)job["systemProperties"].ToObject<JObject>().Property("iothub-connection-device-ID").Value;
double temp = (double)job["body"].ToObject<JObject>().Property("temperature").Value;
```

Once you have this value, you can find the parent of the twin that is associated with the device (remember, the goal in this scenario is to update the *parent* of the twin representing the device with a property from the device).

To do this, use the Azure Digital Twins APIs to access the incoming relationships to the device-representing twin (which you can assume in this case has the same ID as the device). From the incoming relationship, you can find the ID of the parent with the code snippet below.

For simplicity, you can assume in the sample that there is only a single incoming relationship (while in reality there could more).

```csharp
IPage<IncomingEdge> relPage = await client.DigitalTwins.ListIncomingEdgesAsync(devid);
// Just using the first page for this sample
if (relPage != null) {
    IncomingEdge ie = relPage.FirstOrDefault();
    if (ie!=null) {
        // ie.sourceId now is the ID of the parent
    }
}
```

Now that you have the ID of the parent twin, you can patch that twin. To do this, the code looks like this:
```csharp
// See the utility class defined further down in this file
JsonPatch jp = new JsonPatch();
jp.AppendReplaceOp("/Temperature", 85);
await client.DigitalTwins.UpdateAsync(id, jp.Document);
```

The example above uses a helper class to create a JSON Patch:

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

The entire function in context:
```csharp
// Default URL for triggering Event Grid function in the local environment
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}
using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using Microsoft.Rest;
using Newtonsoft.Json.Linq;
using Azure Digital TwinsApi;
using Azure Digital TwinsApi.Models;
using Microsoft.Azure.Services.AppAuthentication;
using System.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace adtIngestFunctionSample
{
    public static class Function1
    {
        const string AdtAppId = "0b07f429-9f4b-4714-9392-cc5e8e80c8b0";
        const string AdtInstanceUrl = "<your-Azure-Digital-Twins-instance-URL>";
        static AzureDigitalTwinsAPIClient client;

        [FunctionName("Function1")]
        public static async Task Run([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
        {
            await Authenticate(log);
            log.LogInformation(eventGridEvent.Data.ToString());
            if (client!=null)
            {
                try
                {
                    JObject job = eventGridEvent.Data as JObject;
                    string devid = (string)job["systemProperties"].ToObject<JObject>().Property("<IoT-Hub-connection-device-ID>").Value;
                    double temp = (double)job["body"].ToObject<JObject>().Property("temperature").Value;

                    var relPage = await client.DigitalTwins.ListIncomingEdgesAsync(devid);
                    // Just using the first page for this sample
                    if (relPage != null)
                    {
                        IncomingEdge ie = relPage.FirstOrDefault();
                        if (ie != null)
                        {
                            // See the utility class defined further down in this file
                            JsonPatch jp = new JsonPatch();
                            jp.AppendReplaceOp("/Temperature", 85);
                            await client.DigitalTwins.UpdateAsync(ie.SourceId, jp.Document);
                        }
                    }

                } catch (Exception e)
                {
                    log.LogError($"Error in ingest function: {e.Message}");
                }
            }
        }

        public async static Task Authenticate(ILogger log)
        {
            var azureServiceTokenProvider = new AzureServiceTokenProvider();
            string accessToken = await azureServiceTokenProvider.GetAccessTokenAsync(AdtAppId);

            var wc = new System.Net.Http.HttpClient();
            wc.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            try
            {
                TokenCredentials tk = new TokenCredentials(accessToken);
                client = new AzureDigitalTwinsAPIClient(tk)
                {
                    BaseUri = new Uri(AdtInstanceUrl)
                };
                log.LogInformation($"Azure Digital Twins client connection created.");
            }
            catch (Exception e)
            {
                log.LogError($"Azure Digital Twins client connection failed.");
            }
        }
    }

    public class JsonPatch
    {
        private List<Dictionary<string, object>> ops = new List<Dictionary<string, object>>();
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
}
```

## Debug Azure function apps locally

It is possible to debug Azure Functions with an Event Grid trigger locally. See [Debug Event Grid trigger locally](../azure-functions/functions-debug-event-grid-trigger-local.md) for more information.
  