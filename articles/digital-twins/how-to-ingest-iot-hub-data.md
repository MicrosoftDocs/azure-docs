---
title: Ingest telemetry from IoT Hub
titleSuffix: Azure Digital Twins
description: Learn how to ingest device telemetry messages from Azure IoT Hub to digital twins in an instance of Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 11/18/2022
ms.topic: how-to
ms.service: digital-twins
ms.custom: devx-track-azurecli

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Ingest IoT Hub telemetry into Azure Digital Twins

This guide walks through the process of writing a function that can ingest telemetry from IoT Hub and send it to an instance of Azure Digital Twins.

Azure Digital Twins is driven with data from IoT devices and other sources. A common source for device data to use in Azure Digital Twins is [IoT Hub](../iot-hub/about-iot-hub.md).

The process for ingesting data into Azure Digital Twins is to set up an external compute resource, such as a function that's made by using [Azure Functions](../azure-functions/functions-overview.md). The function receives the data and uses the [DigitalTwins APIs](/rest/api/digital-twins/dataplane/twins) to set properties or fire telemetry events on [digital twins](concepts-twins-graph.md) accordingly. 

This how-to document walks through the process for writing a function that can ingest telemetry from IoT Hub.

## Prerequisites

Before continuing with this example, you'll need to set up the following resources as prerequisites:
* An IoT hub. For instructions, see the [Create an IoT Hub section of this IoT Hub quickstart](../iot-hub/quickstart-send-telemetry-cli.md).
* An Azure Digital Twins instance that will receive your device telemetry. For instructions, see [Set up an Azure Digital Twins instance and authentication](./how-to-set-up-instance-portal.md).

## Example telemetry scenario

This how-to outlines how to send messages from IoT Hub to Azure Digital Twins, using a function in Azure. There are many possible configurations and matching strategies you can use for sending messages, but the example for this article contains the following parts:
* A thermostat device in IoT Hub, with a known device ID
* A digital twin to represent the device, with a matching ID

> [!NOTE]
> This example uses a straightforward ID match between the device ID and a corresponding digital twin's ID, but it is possible to provide more sophisticated mappings from the device to its twin (such as with a mapping table).

Whenever a temperature telemetry event is sent by the thermostat device, a function processes the telemetry and the `Temperature` property of the digital twin should update. This scenario is outlined in a diagram below:

:::image type="content" source="media/how-to-ingest-iot-hub-data/events.png" alt-text="Diagram of IoT Hub device sending Temperature telemetry to a function in Azure, which updates a temperature property on a twin in Azure Digital Twins.":::

## Add a model and twin

In this section, you'll set up a [digital twin](concepts-twins-graph.md) in Azure Digital Twins that will represent the thermostat device and will be updated with information from IoT Hub.

To create a thermostat-type twin, you'll first need to upload the thermostat [model](concepts-models.md) to your instance, which describes the properties of a thermostat and will be used later to create the twin.

[!INCLUDE [digital-twins-thermostat-model-upload.md](../../includes/digital-twins-thermostat-model-upload.md)]

You'll then need to create one twin using this model. Use the following command to create a thermostat twin named thermostat67, and set 0.0 as an initial temperature value. There's one placeholder for the instance's host name (you can also use the instance's friendly name with a slight decrease in performance).

```azurecli-interactive
az dt twin create  --dt-name <instance-hostname-or-name> --dtmi "dtmi:contosocom:DigitalTwins:Thermostat;1" --twin-id thermostat67 --properties '{"Temperature": 0.0}'
```

When the twin is created successfully, the CLI output from the command should look something like this:
```json
{
  "$dtId": "thermostat67",
  "$etag": "W/\"0000000-9735-4f41-98d5-90d68e673e15\"",
  "$metadata": {
    "$model": "dtmi:contosocom:DigitalTwins:Thermostat;1",
    "Temperature": {
      "lastUpdateTime": "2021-09-09T20:32:46.6692326Z"
    }
  },
  "Temperature": 0.0
}
```

## Create the Azure function

In this section, you'll create an Azure function to access Azure Digital Twins and update twins based on IoT telemetry events that it receives. Follow the steps below to create and publish the function.

1. First, create a new Azure Functions project of Event Grid trigger type. 

    You can do this using **Visual Studio** (for instructions, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#create-an-azure-functions-project)), **Visual Studio Code** (for instructions, see [Create a C# function in Azure using Visual Studio Code](../azure-functions/create-first-function-vs-code-csharp.md?tabs=in-process#create-an-azure-functions-project)), or the **Azure CLI** (for instructions, see [Create a C# function in Azure from the command line](../azure-functions/create-first-function-cli-csharp.md?tabs=azure-cli%2Cin-process#create-a-local-function-project)).

2. Add the following packages to your project (you can use the Visual Studio NuGet package manager, or the [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in a command-line tool).
    * [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core/)
    * [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/)
    * [Microsoft.Azure.WebJobs.Extensions.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid/)

3. Create a function within the project called *IoTHubtoTwins.cs*. Paste the following code into the function file:

    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/IoTHubToTwins.cs":::

    Save your function code.

4. Publish the project with the *IoTHubtoTwins.cs* function to a function app in Azure. 
    
    For instructions on how to publish the function using **Visual Studio**, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure). For instructions on how to publish the function using **Visual Studio Code**, see [Create a C# function in Azure using Visual Studio Code](../azure-functions/create-first-function-vs-code-csharp.md?tabs=in-process#publish-the-project-to-azure). For instructions on how to publish the function using the **Azure CLI**, see [Create a C# function in Azure from the command line](../azure-functions/create-first-function-cli-csharp.md?tabs=azure-cli%2Cin-process#deploy-the-function-project-to-azure).

Once the process of publishing the function completes, you can use this Azure CLI command to verify the publish was successful. There are placeholders for your resource group, and the name of your function app. The command will print information about the *IoTHubToTwins* function.

```azurecli-interactive
az functionapp function show --resource-group <your-resource-group> --name <your-function-app> --function-name IoTHubToTwins
```

### Configure the function app

To access Azure Digital Twins, your function app needs a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) with permissions to access your Azure Digital Twins instance. You'll set that up in this section, by assigning an access role for the function and configuring the application settings so that it can access your Azure Digital Twins instance.

[!INCLUDE [digital-twins-configure-function-app-cli.md](../../includes/digital-twins-configure-function-app-cli.md)]

## Connect the function to IoT Hub

In this section, you'll set up your function as an event destination for the IoT hub device data. Setting up your function in this way will ensure that the data from the thermostat device in IoT Hub will be sent to the Azure function for processing.

Use the following CLI command to create an event subscription that the IoT Hub will use to send event data to the *IoTHubtoTwins* function. There's a placeholder for you to enter a name for the event subscription, and there are also placeholders for you to enter your subscription ID, resource group, IoT hub name, and the name of your function app.

```azurecli-interactive
az eventgrid event-subscription create --name <name-for-hub-event-subscription> --event-delivery-schema eventgridschema --source-resource-id /subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.Devices/IotHubs/<your-IoT-hub> --included-event-types Microsoft.Devices.DeviceTelemetry --endpoint-type azurefunction --endpoint /subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.Web/sites/<your-function-app>/functions/IoTHubtoTwins
```

The output will show information about the event subscription that has been created. You can confirm that the operation completed successfully by verifying the `provisioningState` value in the result:

```azurecli
"provisioningState": "Succeeded",
```

## Test with simulated IoT data

You can test your new ingress function by using the device simulator from [Connect an end-to-end solution](tutorial-end-to-end.md). The *DeviceSimulator* project contains a simulated thermostat device that sends sample temperature data. To set up the device simulator, follow these steps:

1. Navigate to the [Azure Digital Twins end-to-end sample project repository](/samples/azure-samples/digital-twins-samples/digital-twins-samples). Get the sample project on your machine by selecting the **Browse code** button underneath the title. This will take you to the GitHub repo for the samples, which you can download as a .zip by selecting the **Code** button followed by **Download ZIP**.

      This will download a .zip folder to your machine as *digital-twins-samples-main.zip*. Unzip the folder and extract the files. You'll be using the *DeviceSimulator* project folder.
1. [Register the simulated device with IoT Hub](tutorial-end-to-end.md#register-the-simulated-device-with-iot-hub)
2. [Configure and run the simulation](tutorial-end-to-end.md#configure-and-run-the-simulation)

After completing these steps, you should have a project console window running and sending simulated telemetry data to your IoT hub.

:::image type="content" source="media/how-to-ingest-iot-hub-data/device-simulator.png" alt-text="Screenshot of the output from the device simulator project.":::

### Validate results

While running the device simulator above, the temperature value of your thermostat digital twin will be changing. In the Azure CLI, run the following command to see the temperature value. There's one placeholder for the instance's host name (you can also use the instance's friendly name with a slight decrease in performance).

```azurecli-interactive
az dt twin query --query-command "SELECT * FROM digitaltwins WHERE \$dtId = 'thermostat67'" --dt-name <instance-hostname-or-name>
```

>[!NOTE]
>If you're using anything other than Cloud Shell in the Bash environment, you may need to escape the `$` character in the query differently so that it's parsed correctly. For more information, see [Use special characters in different shells](concepts-cli.md#use-special-characters-in-different-shells).

Your output should show the details of the thermostat67 twin, including a temperature value, like this:

```json
{
  "result": [
    {
      "$dtId": "thermostat67",
      "$etag": "W/\"dbf2fea8-d3f7-42d0-8037-83730dc2afc5\"",
      "$metadata": {
        "$model": "dtmi:contosocom:DigitalTwins:Thermostat;1",
        "Temperature": {
          "lastUpdateTime": "2021-06-03T17:05:52.0062638Z"
        }
      },
      "Temperature": 70.20518558807913
    }
  ]
}
```

To see the `Temperature` value change, repeatedly run the query command above.

## Next steps

Read about data ingress and egress with Azure Digital Twins:
* [Data ingress and egress](concepts-data-ingress-egress.md)
