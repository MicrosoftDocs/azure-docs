---
# Mandatory fields.
title: Ingest telemetry from IoT Hub
titleSuffix: Azure Digital Twins
description: See how to ingest device telemetry messages from IoT Hub.
author: alexkarcher-msft
ms.author: alkarche # Microsoft employees only
ms.date: 9/15/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Ingest IoT Hub telemetry into Azure Digital Twins

Azure Digital Twins is driven with data from IoT devices and other sources. A common source for device data to use in Azure Digital Twins is [IoT Hub](../iot-hub/about-iot-hub.md).

The process for ingesting data into Azure Digital Twins is to set up an external compute resource, such as an [Azure function](../azure-functions/functions-overview.md), that receives the data and uses the [DigitalTwins APIs](how-to-use-apis-sdks.md) to set properties or fire telemetry events on [digital twins](concepts-twins-graph.md) accordingly. 

This how-to document walks through the process for writing an Azure function that can ingest telemetry from IoT Hub.

## Prerequisites

Before continuing with this example, you'll need to set up the following resources as prerequisites:
* **An IoT hub**. For instructions, see the *Create an IoT Hub* section of [this IoT Hub quickstart](../iot-hub/quickstart-send-telemetry-cli.md).
* **An Azure Function** with the correct permissions to call your digital twin instance. For instructions, see [*How-to: Set up an Azure function for processing data*](how-to-create-azure-function.md). 
* **An Azure Digital Twins instance** that will receive your device telemetry. For instructions, see [*How-to: Set up an Azure Digital Twins instance and authentication*](./how-to-set-up-instance-portal.md).

### Example telemetry scenario

This how-to outlines how to send messages from IoT Hub to Azure Digital Twins, using an Azure function. There are many possible configurations and matching strategies you can use for sending messages, but the example for this article contains the following parts:
* A thermometer device in IoT Hub, with a known device ID
* A digital twin to represent the device, with a matching ID

> [!NOTE]
> This example uses a straightforward ID match between the device ID and a corresponding digital twin's ID, but it is possible to provide more sophisticated mappings from the device to its twin (such as with a mapping table).

Whenever a temperature telemetry event is sent by the thermostat device, an Azure function processes the telemetry and the *temperature* property of the digital twin should update. This scenario is outlined in a diagram below:

:::image type="content" source="media/how-to-ingest-iot-hub-data/events.png" alt-text="A diagram showing a flow chart. In the chart, an IoT Hub device sends Temperature telemetry through IoT Hub to an Azure Function, which updates a temperature property on a twin in Azure Digital Twins." border="false":::

## Add a model and twin

You can add/upload a model using the CLI command below, and then create a twin using this model that will be updated with information from IoT Hub.

The model looks like this:
```JSON
{
  "@id": "dtmi:contosocom:DigitalTwins:Thermostat;1",
  "@type": "Interface",
  "@context": "dtmi:dtdl:context;2",
  "contents": [
    {
      "@type": "Property",
      "name": "Temperature",
      "schema": "double"
    }
  ]
}
```

To **upload this model to your twins instance**, open the Azure CLI and run the following command:

```azurecli
az dt model create --models '{  "@id": "dtmi:contosocom:DigitalTwins:Thermostat;1",  "@type": "Interface",  "@context": "dtmi:dtdl:context;2",  "contents": [    {      "@type": "Property",      "name": "Temperature",      "schema": "double"    }  ]}' -n {digital_twins_instance_name}
```

[!INCLUDE [digital-twins-known-issue-cloud-shell](../../includes/digital-twins-known-issue-cloud-shell.md)]

You'll then need to **create one twin using this model**. Use the following command to create a twin and set 0.0 as an initial temperature value.

```azurecli
az dt twin create --dtmi "dtmi:contosocom:DigitalTwins:Thermostat;1" --twin-id thermostat67 --properties '{"Temperature": 0.0,}' --dt-name {digital_twins_instance_name}
```

[!INCLUDE [digital-twins-known-issue-cloud-shell](../../includes/digital-twins-known-issue-cloud-shell.md)]

Output of a successful twin create command should look like this:
```json
{
  "$dtId": "thermostat67",
  "$etag": "W/\"0000000-9735-4f41-98d5-90d68e673e15\"",
  "$metadata": {
    "$model": "dtmi:contosocom:DigitalTwins:Thermostat;1",
    "Temperature": {
      "ackCode": 200,
      "ackDescription": "Auto-Sync",
      "ackVersion": 1,
      "desiredValue": 0.0,
      "desiredVersion": 1
    }
  },
  "Temperature": 0.0
}
```

## Create an Azure function

This section uses the same Visual Studio startup steps and Azure function skeleton from [*How-to: Set up an Azure function for processing data*](how-to-create-azure-function.md). The skeleton handles authentication and creates a service client, ready for you to process data and call Azure Digital Twins APIs in response. 

In the steps that follow, you'll add specific code to it for processing IoT telemetry events from IoT Hub.  

### Add telemetry processing
    
Telemetry events come in the form of messages from the device. The first step in adding telemetry-processing code is extracting the relevant part of this device message from the Event Grid event. 

Different devices may structure their messages differently, so the code for **this step depends on the connected device.** 

The following code shows an example for a simple device that sends telemetry as JSON. This sample is fully explored in [*Tutorial: Connect an end-to-end solution*](./tutorial-end-to-end.md). The following code finds the device ID of the device that sent the message, as well as the temperature value.

```csharp
JObject deviceMessage = (JObject)JsonConvert.DeserializeObject(eventGridEvent.Data.ToString());
string deviceId = (string)deviceMessage["systemProperties"]["iothub-connection-device-id"];
var temperature = deviceMessage["body"]["Temperature"];
```

The next code sample takes the ID and temperature value and uses them to "patch" (make updates to) that twin.

```csharp
//Update twin using device temperature
var uou = new UpdateOperationsUtility();
uou.AppendReplaceOp("/Temperature", temperature.Value<double>());
await client.UpdateDigitalTwinAsync(deviceId, uou.Serialize());
...
```

### Update your Azure function code

Now that you understand the code from the earlier samples, open your Azure function from the [*Prerequisites*](#prerequisites) section in Visual Studio. (If you don't have an Azure function, visit the link in the prerequisites to create one now).

Replace your Azure function's code with this sample code.

```csharp
using System;
using System.Net.Http;
using Azure.Core.Pipeline;
using Azure.DigitalTwins.Core;
using Azure.DigitalTwins.Core.Serialization;
using Azure.Identity;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace IotHubtoTwins
{
    public class IoTHubtoTwins
    {
        private static readonly string adtInstanceUrl = Environment.GetEnvironmentVariable("ADT_SERVICE_URL");
        private static readonly HttpClient httpClient = new HttpClient();

        [FunctionName("IoTHubtoTwins")]
        public async void Run([EventGridTrigger] EventGridEvent eventGridEvent, ILogger log)
        {
            if (adtInstanceUrl == null) log.LogError("Application setting \"ADT_SERVICE_URL\" not set");

            try
            {
                //Authenticate with Digital Twins
                ManagedIdentityCredential cred = new ManagedIdentityCredential("https://digitaltwins.azure.net");
                DigitalTwinsClient client = new DigitalTwinsClient(
                    new Uri(adtInstanceUrl), cred, new DigitalTwinsClientOptions 
                    { Transport = new HttpClientTransport(httpClient) });
                log.LogInformation($"ADT service client connection created.");
            
                if (eventGridEvent != null && eventGridEvent.Data != null)
                {
                    log.LogInformation(eventGridEvent.Data.ToString());

                    // Reading deviceId and temperature for IoT Hub JSON
                    JObject deviceMessage = (JObject)JsonConvert.DeserializeObject(eventGridEvent.Data.ToString());
                    string deviceId = (string)deviceMessage["systemProperties"]["iothub-connection-device-id"];
                    var temperature = deviceMessage["body"]["Temperature"];
                    
                    log.LogInformation($"Device:{deviceId} Temperature is:{temperature}");

                    //Update twin using device temperature
                    var uou = new UpdateOperationsUtility();
                    uou.AppendReplaceOp("/Temperature", temperature.Value<double>());
                    await client.UpdateDigitalTwinAsync(deviceId, uou.Serialize());
                }
            }
            catch (Exception e)
            {
                log.LogError($"Error in ingest function: {e.Message}");
            }
        }
    }
}
```
Save your function code and publish the function App to Azure. 
You can do this by referring to [*Publish the Function App*](./how-to-create-azure-function.md#publish-the-function-app-to-azure) section of [*How-to: Set up an Azure function for processing data*](how-to-create-azure-function.md).

After a successful publish, you will see the output in the Visual Studio command window as shown below:

```cmd
1>------ Build started: Project: adtIngestFunctionSample, Configuration: Release Any CPU ------
1>adtIngestFunctionSample -> C:\Users\source\repos\Others\adtIngestFunctionSample\adtIngestFunctionSample\bin\Release\netcoreapp3.1\bin\adtIngestFunctionSample.dll
2>------ Publish started: Project: adtIngestFunctionSample, Configuration: Release Any CPU ------
2>adtIngestFunctionSample -> C:\Users\source\repos\Others\adtIngestFunctionSample\adtIngestFunctionSample\bin\Release\netcoreapp3.1\bin\adtIngestFunctionSample.dll
2>adtIngestFunctionSample -> C:\Users\source\repos\Others\adtIngestFunctionSample\adtIngestFunctionSample\obj\Release\netcoreapp3.1\PubTmp\Out\
2>Publishing C:\Users\source\repos\Others\adtIngestFunctionSample\adtIngestFunctionSample\obj\Release\netcoreapp3.1\PubTmp\adtIngestFunctionSample - 20200911112545669.zip to https://adtingestfunctionsample20200818134346.scm.azurewebsites.net/api/zipdeploy...
========== Build: 1 succeeded, 0 failed, 0 up-to-date, 0 skipped ==========
========== Publish: 1 succeeded, 0 failed, 0 skipped ==========
```
You can also verify your status of the publish process in the [Azure portal](https://portal.azure.com/). Search for your _resource group_ and navigate to _Activity log_ and look for _Get web app publishing profile_ in the list and verify that the status is Succeeded.

:::image type="content" source="media/how-to-ingest-iot-hub-data/azure-function-publish-activity-log.png" alt-text="Screenshot of the Azure portal that shows status of the publish process.":::

## Connect your function to IoT Hub

Set up an event destination for hub data.
In the [Azure portal](https://portal.azure.com/), navigate to your IoT Hub instance that you created in the [*Prerequisites*](#prerequisites) section. Under **Events**, create a subscription for your Azure function.

:::image type="content" source="media/how-to-ingest-iot-hub-data/add-event-subscription.png" alt-text="Screenshot of the Azure portal that shows Adding an event subscription.":::

In the **Create Event Subscription** page, fill the fields as follows:
  1. Under **Name**, name the subscription what you would like.
  2. Under **Event Schema**, choose _Event Grid Schema_.
  3. Under **Event Types**, choose the _Device Telemetry_ checkbox and uncheck other event types.
  4. Under **Endpoint Type**, Select _Azure function_.
  5. Under **Endpoint**, Choose _Select an endpoint_ link to create an endpoint.
    
:::image type="content" source="media/how-to-ingest-iot-hub-data/create-event-subscription.png" alt-text="Screenshot of the Azure portal to create the event subscription details":::

In the _Select Azure Function_ page that opens up, verify the below details.
 1. **Subscription**: Your Azure subscription
 2. **Resource group**: Your resource group
 3. **Function app**: Your function app name
 4. **Slot**: _Production_
 5. **Function**: Select your Azure function from the dropdown.

Save your details by selecting _Confirm Selection_ button.            
      
:::image type="content" source="media/how-to-ingest-iot-hub-data/select-azure-function.png" alt-text="Screenshot of the Azure portal to select Azure function":::

Select _Create_ button to create event subscription.

## Send simulated IoT data

To test your new ingress function, use the device simulator from [*Tutorial: Connect an end-to-end solution*](./tutorial-end-to-end.md). That tutorial is driven by a sample project written in C#. The sample code is located here: [Azure Digital Twins end-to-end samples](/samples/azure-samples/digital-twins-samples/digital-twins-samples). You'll be using the **DeviceSimulator** project in that repository.

In the end-to-end tutorial, complete the following steps:
1. [*Register the simulated device with IoT Hub*](./tutorial-end-to-end.md#register-the-simulated-device-with-iot-hub)
2. [*Configure and run the simulation*](./tutorial-end-to-end.md#configure-and-run-the-simulation)

## Validate your results

While running the device simulator above, the temperature value of your digital twin will be changing. In the Azure CLI, run the following command to see the temperature value.

[!INCLUDE [digital-twins-known-issue-cloud-shell](../../includes/digital-twins-known-issue-cloud-shell.md)]

```azurecli
az dt twin query -q "select * from digitaltwins" -n {digital_twins_instance_name}
```

Your output should contain a temperature value like this:

```json
{
  "result": [
    {
      "$dtId": "thermostat67",
      "$etag": "W/\"0000000-1e83-4f7f-b448-524371f64691\"",
      "$metadata": {
        "$model": "dtmi:contosocom:DigitalTwins:Thermostat;1",
        "Temperature": {
          "ackCode": 200,
          "ackDescription": "Auto-Sync",
          "ackVersion": 1,
          "desiredValue": 69.75806974934324,
          "desiredVersion": 1
        }
      },
      "Temperature": 69.75806974934324
    }
  ]
}
```

To see the value change, repeatedly run the query command above.

## Next steps

Read about data ingress and egress with Azure Digital Twins:
* [*Concepts: Integration with other services*](concepts-integration.md)