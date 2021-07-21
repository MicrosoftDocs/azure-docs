---
# Mandatory fields.
title: Set up twin-to-twin event handling
titleSuffix: Azure Digital Twins
description: See how to create a function in Azure for propagating events through the twin graph.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/21/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up twin-to-twin event handling with Azure Functions

A fully-connected Azure Digital Twins graph is driven by event propagation. Data arrives into Azure Digital Twins from external sources like IoT Hub, and then is propagated through the Azure Digital Twins graph, updating relevant twins as appropriate.

In this article, you'll see how to send events from twin to twin, allowing you to update twins in response to property changes or other data from another twin in the graph.

Currently, this is accomplished by setting up an [Azure function](../azure-functions/functions-overview.md) that watches updates on a twin and makes changes to other twins accordingly. This article walks through the process of setting up this function on an example scenario.

Here are the actions you will complete:
1. [Create an Event Grid endpoint](#create-the-endpoint) in Azure Digital Twins that connects the instance to Event Grid
2. [Set up a route](#create-the-route) within Azure Digital Twins to send twin property change events to the endpoint
3. [Deploy an Azure function](#create-the-azure-function) capable of listening on the Event Grid endpoint and updating other twins accordingly
4. [Subscribe the function to Event Grid](#connect-the-function-to-event-grid) so that it receives the updates from Event Grid
5. [Test and verify](#test-and-verify-results) the solution by simulating a property change and querying Azure Digital Twins to see the results on other twins

## Prerequisites

This article uses **Visual Studio**. You can download the latest version from [Visual Studio Downloads](https://visualstudio.microsoft.com/downloads/).

Before continuing with this example, you'll also need to set up an **Azure Digital Twins instance** to work with. For instructions on how to create an instance, see [How-to: Set up an Azure Digital Twins instance and authentication](./how-to-set-up-instance-portal.md). The instance should contain at least two twins that you want to send data between. If you already have twins in your instance to use for this how-to, you can skip the rest of this section. To set up twins in an example scenario, continue through the rest of this section.

### Example twin update scenario

This how-to uses an example set of twins to illustrate how data can be passed from one twin to another. You can follow these instructions exactly to build out a proof of concept, or you can adapt this process to apply to your own twins if you already have some in your Azure Digital Twins instance.

There are two twins in this example:
* **Thermostat**: A *ThermostatModel* type twin representing a thermostat device. It has a *temperature* property (among other elements that aren't used in this article).
* **Room**: A *SpaceModel* type twin representing the room where the thermostat is located. It has a *temperature* property that should match the value on the thermostat twin.

Whenever the temperature on the Thermostat twin is updated, this event should be sent to the Room twin, and the Room twin's temperature should be updated to match. The rest of the article describes how to set up an Azure function to accomplish this flow.

### Add a model and twins

In this section, you'll set up two [digital twins](concepts-twins-graph.md) in Azure Digital Twins that will represent Thermostat and Room.

To create these twins, you'll first need to **upload the models** for the thermostat and the room.

Use the following Azure CLI commands to upload the models to your Azure Digital Twins instance as inline JSON. You can run the commands in [Azure Cloud Shell](../cloud-shell/overview.md) in your browser (use the **Bash** environment), or on your machine if you have the [CLI installed locally](/cli/azure/install-azure-cli). There is one placeholder in each command where you should enter the name of your Azure Digital Twins instance.

```azurecli-interactive
az dt model create --dt-name <Azure-Digital-Twins-instance> --models '{  "@id": "dtmi:contosocom:DigitalTwins:Thermostat;1",  "@type": "Interface",   "displayName": "Thermostat interface model", "@context": "dtmi:dtdl:context;2", "contents": [    {      "@type": "Property",      "name": "DisplayName",      "schema": "string"    },  {      "@type": "Property",      "name": "Temperature",      "schema": "double"    } ]}' 

az dt model create --dt-name <Azure-Digital-Twins-instance> --models '{  "@id": "dtmi:contosocom:DigitalTwins:Space;1",  "@type": "Interface",  "displayName": "Space interface model",  "@context": "dtmi:dtdl:context;2", "contents": [    {      "@type": "Property",      "name": "DisplayName",      "schema": "string"    },  {      "@type": "Property",      "name": "Temperature",      "schema": "double"    },  {   "@type": "Relationship",  "name": "contains", "displayName": "contains" } ]}' 
```

>[!TIP]
> You can view the full model code that these models were based on here:  [ThermostatModel.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-samples/master/AdtSampleApp/SampleClientApp/Models/ThermostatModel.json) and [SpaceModel.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-samples/master/AdtSampleApp/SampleClientApp/Models/SpaceModel.json).

You'll then need to **create a twin using each model**. Use the following commands to create the Thermostat and Room twins, both with an initial temperature value of 0.0.

```azurecli-interactive
az dt twin create  --dt-name <Azure-Digital-Twins-instance> --dtmi "dtmi:contosocom:DigitalTwins:Thermostat;1" --twin-id Thermostat --properties '{"DisplayName": "Thermostat", "Temperature": 0.0,}'

az dt twin create  --dt-name <Azure-Digital-Twins-instance> --dtmi "dtmi:contosocom:DigitalTwins:Space;1" --twin-id Room --properties '{"DisplayName": "Room", "Temperature": 0.0}'
```

When the twins are created successfully, the CLI will output some information about the two twins that have been created.

Finally, **create a relationship** from the Room twin to the Thermostat twin indicating that the room contains the thermostat.

```azurecli-interactive
az dt twin relationship create -n <Azure-Digital-Twins-instance> --relationship-id contains --relationship room_has_thermostat --twin-id Room --target Thermostat
```

## Set up endpoint and route

To set up twin-to-twin event handling, start by creating an **endpoint** in Azure Digital Twins and a **route** to that endpoint. The Thermostat twin will use the route to send information about its update events to the endpoint (where Event Grid can pick them up later and pass them to the Azure function for processing).

[!INCLUDE [digital-twins-twin-to-twin-resources.md](../../includes/digital-twins-twin-to-twin-resources.md)]

## Create the Azure function

1. First, open Visual Studio and create a new Azure Functions app project. For instructions on how to create a function app using Visual Studio, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure).

2. Add the following packages to your project (you can use the Visual Studio NuGet package manager or `dotnet` commands in a command-line tool).

    * [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core/)
    * [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/)

3. Create a new function file called *ProcessDTRoutedData.cs*. Copy in the body of this sample function file: [ProcessDTRoutedData.cs](https://raw.githubusercontent.com/Azure-Samples/digital-twins-samples/master/AdtSampleApp/SampleFunctionsApp/ProcessDTRoutedData.cs)

    This code sample supports the [example scenario](#example-twin-update-scenario) of this how-to that updates the temperature on a Room twin whenever a Thermostat twin is updated. If you are using your own, different twins, you may want to edit the properties that are being updated or make other changes to the logic of the function to apply to your scenario.

4. Add this file to your solution: [AdtUtilities.cs](https://raw.githubusercontent.com/Azure-Samples/digital-twins-samples/master/AdtSampleApp/SampleFunctionsApp/AdtUtilities.cs).

5. Publish the function app with your *ProcessDTRoutedData.cs* function to Azure. For instructions on how to publish a function app, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure).

[!INCLUDE [digital-twins-verify-function-publish.md](../../includes/digital-twins-verify-function-publish.md)]

To access Azure Digital Twins, your function app needs a system-managed identity with permissions to access your Azure Digital Twins instance. You'll set that up next.

### Configure the function app

Next, **assign an access role** for the function and **configure the application settings** so that it can access your Azure Digital Twins instance.

[!INCLUDE [digital-twins-configure-function-app-cli.md](../../includes/digital-twins-configure-function-app-cli.md)]

## Connect the function to Event Grid

Next, subscribe the *ProcessDTRoutedData* Azure function to the event grid topic you created earlier, so that telemetry data can flow from the Thermostat twin through the event grid topic to the function, which goes back into Azure Digital Twins and updates the Room twin accordingly.

To do this, you'll create an **Event Grid subscription** that sends data from the **event grid topic** that you created earlier to your *ProcessDTRoutedData* Azure function.

In the [Azure portal](https://portal.azure.com/), navigate to your event grid topic by searching for its name in the top search bar. Select *+ Event Subscription*.

:::image type="content" source="media/tutorial-end-to-end/event-subscription-1b.png" alt-text="Screenshot of the Azure portal showing how to create an Event Grid event subscription.":::

On the *Create Event Subscription* page, fill in the fields as follows (fields filled by default are not mentioned):
* *EVENT SUBSCRIPTION DETAILS* > **Name**: Give a name to your event subscription.
* *ENDPOINT DETAILS* > **Endpoint Type**: Select *Azure Function* from the menu options.
* *ENDPOINT DETAILS* > **Endpoint**: Select the *Select an endpoint* link. This will open a *Select Azure Function* window:
    - Fill in your **Subscription**, **Resource group**, **Function app** and **Function** (*ProcessDTRoutedData*). Some of these may auto-populate after selecting the subscription.
    - Select **Confirm Selection**.

Back on the *Create Event Subscription* page, select **Create**.

## Test and verify results

Update the twin that's the source of the event flow. If you're using the [example scenario](#example-twin-update-scenario), you can update the temperature on the Thermostat twin to a new value with this Azure CLI command:


```azurecli-interactive
az dt twin update -n <Azure-Digital-Twins-instance> --twin-id Thermostat --json-patch '{"op":"replace", "path":"/Temperature", "value": 35.48}'
```

Next, query your Azure Digital Twins instance for the connected twin that should receive the data and update automatically. If you're using the [example scenario](#example-twin-update-scenario), you can query to see the Room twin with this Azure CLI command:

```azurecli-interactive
az dt twin show -n <Azure-Digital-Twins-instance> --twin-id Room
```

The output should show that the temperature value of Room has automatically updated to match the temperature that was set on Thermostat.

## Next steps

In this article, you set up twin-to-twin event handling in Azure Digital Twins. Next, set up an Azure function to trigger this flow automatically based on incoming telemetry from IoT Hub devices: [Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md).
