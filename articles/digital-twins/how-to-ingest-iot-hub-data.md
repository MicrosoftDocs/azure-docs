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

The process for ingesting data into Azure Digital Twins is to set up an external compute resource, such as a function that's made by using [Azure Functions](../azure-functions/functions-overview.md). The function receives the data and uses the [DigitalTwins APIs](/rest/api/digital-twins/dataplane/twins) to set properties or fire telemetry events on [digital twins](concepts-twins-graph.md) accordingly. 

This how-to document walks through the process for writing a function that can ingest telemetry from IoT Hub.

## Prerequisites

Before continuing with this example, you'll need to set up the following resources as prerequisites:
* **An IoT hub**. For instructions, see the *Create an IoT Hub* section of [this IoT Hub quickstart](../iot-hub/quickstart-send-telemetry-cli.md).
* **An Azure Digital Twins instance** that will receive your device telemetry. For instructions, see [*How-to: Set up an Azure Digital Twins instance and authentication*](./how-to-set-up-instance-portal.md).

### Example telemetry scenario

This how-to outlines how to send messages from IoT Hub to Azure Digital Twins, using a function in Azure. There are many possible configurations and matching strategies you can use for sending messages, but the example for this article contains the following parts:
* A thermostat device in IoT Hub, with a known device ID
* A digital twin to represent the device, with a matching ID

> [!NOTE]
> This example uses a straightforward ID match between the device ID and a corresponding digital twin's ID, but it is possible to provide more sophisticated mappings from the device to its twin (such as with a mapping table).

Whenever a temperature telemetry event is sent by the thermostat device, a function processes the telemetry and the *temperature* property of the digital twin should update. This scenario is outlined in a diagram below:

:::image type="content" source="media/how-to-ingest-iot-hub-data/events.png" alt-text="Diagram of IoT Hub device sending Temperature telemetry through IoT Hub to a function in Azure, which updates a temperature property on a twin in Azure Digital Twins." border="false":::

## Add a model and twin

In this section, you'll set up a [digital twin](concepts-twins-graph.md) in Azure Digital Twins that will represent the thermostat device and will be updated with information from IoT Hub.

To create a thermostat-type twin, you'll first need to upload the thermostat [model](concepts-models.md) to your instance, which describes the properties of a thermostat and will be used later to create the twin. 

[!INCLUDE [digital-twins-thermostat-model-upload.md](../../includes/digital-twins-thermostat-model-upload.md)]

You'll then need to **create one twin using this model**. Use the following command to create a thermostat twin named **thermostat67**, and set 0.0 as an initial temperature value.

```azurecli-interactive
az dt twin create --dtmi "dtmi:contosocom:DigitalTwins:Thermostat;1" --twin-id thermostat67 --properties '{"Temperature": 0.0,}' --dt-name {digital_twins_instance_name}
```

Create twin:
```azurecli-interactive
az dt twin create --dtmi "dtmi:contosocom:DigitalTwins:Thermostat;1" --twin-id thermostat67 --properties '{\"Temperature\": 0.0,}' --dt-name {digital_twins_instance_name}
```

When the twin is created successfully, the CLI output from the command should look something like this:
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

## Create a function

In this section, you'll create an Azure function to access Azure Digital Twins and update twins based on IoT telemetry events that it receives. Follow the steps below to create and publish the function.

#### Step 1: Create a function app project

First, create a new function app project in Visual Studio. For instructions on how to do this, see the [**Create a function app in Visual Studio**](how-to-create-azure-function.md#create-a-function-app-in-visual-studio) section of the *How-to: Set up a function for processing data* article.

#### Step 2: Fill in function code

Add the following packages to your project:
* [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core/)
* [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/)
* [Microsoft.Azure.WebJobs.Extensions.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid/)

Rename the *Function1.cs* sample function that Visual Studio has generated with the new project to *IoTHubtoTwins.cs*. Replace the code in the file with the following code:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/IoTHubToTwins.cs":::

Save your function code.

#### Step 3: Publish the function app to Azure

Publish the project with *IoTHubtoTwins.cs* function to a function app in Azure.

For instructions on how to do this, see the section [**Publish the function app to Azure**](how-to-create-azure-function.md#publish-the-function-app-to-azure) of the *How-to: Set up a function for processing data* article.

#### Step 4: Configure the function app

Next, **assign an access role** for the function and **configure the application settings** so that it can access your Azure Digital Twins instance. For instructions on how to do this, see the section [**Set up security access for the function app**](how-to-create-azure-function.md#set-up-security-access-for-the-function-app) of the *How-to: Set up a function for processing data* article.

## Connect your function to IoT Hub

In this section, you'll set up your function as an event destination for the IoT hub device data. This will ensure that the data from the thermostat device in IoT Hub will be sent to the Azure function for processing.

In the [Azure portal](https://portal.azure.com/), navigate to your IoT Hub instance that you created in the [*Prerequisites*](#prerequisites) section. Under **Events**, create a subscription for your function.

:::image type="content" source="media/how-to-ingest-iot-hub-data/add-event-subscription.png" alt-text="Screenshot of the Azure portal that shows Adding an event subscription.":::

In the **Create Event Subscription** page, fill the fields as follows:
  1. For **Name**, choose whatever name you want for the event subscription.
  2. For **Event Schema**, choose _Event Grid Schema_.
  3. For **System Topic Name**, choose whatever name you want.
  1. For **Filter to Event Types**, choose the _Device Telemetry_ checkbox and uncheck other event types.
  1. For **Endpoint Type**, Select _Azure Function_.
  1. For **Endpoint**, use the _Select an endpoint_ link to choose what Azure Function to use for the endpoint.
    
:::image type="content" source="media/how-to-ingest-iot-hub-data/create-event-subscription.png" alt-text="Screenshot of the Azure portal to create the event subscription details":::

In the _Select Azure Function_ page that opens up, verify or fill in the below details.
 1. **Subscription**: Your Azure subscription.
 2. **Resource group**: Your resource group.
 3. **Function app**: Your function app name.
 4. **Slot**: _Production_.
 5. **Function**: Select the function from earlier, *IoTHubtoTwins*, from the dropdown.

Save your details with the _Confirm Selection_ button.            
      
:::image type="content" source="media/how-to-ingest-iot-hub-data/select-azure-function.png" alt-text="Screenshot of the Azure portal to select the function.":::

Select the _Create_ button to create the event subscription.

## Send simulated IoT data

To test your new ingress function, use the device simulator from [*Tutorial: Connect an end-to-end solution*](./tutorial-end-to-end.md). That tutorial is driven by a sample project written in C#. The sample code is located here: [Azure Digital Twins end-to-end samples](/samples/azure-samples/digital-twins-samples/digital-twins-samples). You'll be using the **DeviceSimulator** project in that repository.

In the end-to-end tutorial, complete the following steps:
1. [*Register the simulated device with IoT Hub*](./tutorial-end-to-end.md#register-the-simulated-device-with-iot-hub)
2. [*Configure and run the simulation*](./tutorial-end-to-end.md#configure-and-run-the-simulation)

## Validate your results

While running the device simulator above, the temperature value of your digital twin will be changing. In the Azure CLI, run the following command to see the temperature value.

```azurecli-interactive
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
