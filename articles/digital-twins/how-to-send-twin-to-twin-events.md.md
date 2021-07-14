---
# Mandatory fields.
title: Set up twin-to-twin event handling
titleSuffix: Azure Digital Twins
description: See how to create a function in Azure for propagating events through the twin graph.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/14/2021
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
1. [Create an Event Grid endpoint](#set-up-endpoint) in Azure Digital Twins that connects the instance to Event Grid
2. [Set up a route](#set-up-route) within Azure Digital Twins to send twin property change events to the endpoint
3. [Deploy an Azure function](#create-the-azure-function) capable of listening on the Event Grid endpoint and updating other twins accordingly
4. [Subscribe the function to Event Grid](#connect-the-function-to-event-grid) so that it receives the updates from Event Grid
5. [Test and verify](#test-and-verify-results) the solution by simulating a property change and querying Azure Digital Twins to see the results on other twins

## Prerequisites

This article uses **Visual Studio**. You can download the latest version from [Visual Studio Downloads](https://visualstudio.microsoft.com/downloads/).

Before continuing with this example, you'll also need to set up an **Azure Digital Twins instance** to work with. For instructions on how to create an instance, see [How-to: Set up an Azure Digital Twins instance and authentication](./how-to-set-up-instance-portal.md). The instance should contain at least two twins that you want to send data between. If you already have twins in your instance to use for this how-to, you can skip the rest of this section. To set up twins in an example scenario, continue through the rest of this section.

### Example twin update scenario

This how-to uses an example set of twins to illustrate how data can be passed from one twin to another. You can follow these instructions exactly to build out a proof of concept, or you can adapt this process to apply to your own twins if you already have some in your Azure Digital Twins instance.

There are two twins in this example:
* A *Thermostat* twin (called **Thermostat**) representing a thermostat device. It has a *Temperature* property.
* A *Room* twin (called **Room**) representing the room where the thermostat is located. It has a *Temperature* property that should match the value on the thermostat twin.

Whenever the temperature on the Thermostat twin is updated, this event should be sent to the Room twin, and the Room twin's temperature should be updated to match. The rest of the article describes how to set up an Azure function to accomplish this flow.

Whenever a temperature telemetry event is sent by the thermostat device, a function processes the telemetry and the *temperature* property of the digital twin should update. This scenario is outlined in a diagram below:

:::image type="content" source="media/how-to-ingest-iot-hub-data/events.png" alt-text="Diagram of IoT Hub device sending Temperature telemetry to a function in Azure, which updates a temperature property on a twin in Azure Digital Twins." border="false":::

### Add a model and twins

In this section, you'll set up two [digital twins](concepts-twins-graph.md) in Azure Digital Twins that will represent Thermostat and Room.

To create these twins, you'll first need to upload the thermostat and room [models](concepts-models.md) to your instance to define what these twins look like. You can explore the model code here: [Room.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-samples/master/AdtSampleApp/SampleClientApp/Models/Room.json) and [Thermostat.json](https://raw.githubusercontent.com/Azure-Samples/digital-twins-docs-code/main/models/Thermostat.json).

To upload the models to your twins instance, run the following Azure CLI commands, which upload the models as inline JSON. You can run the commands in [Azure Cloud Shell](../articles/cloud-shell/overview.md) in your browser (use the **Bash** environment), or on your machine if you have the [CLI installed locally](/cli/azure/install-azure-cli).

```azurecli-interactive
az dt model create --dt-name <instance-name> --models '{  "@id": "dtmi:contosocom:DigitalTwins:Thermostat;1",  "@type": "Interface",  "@context": "dtmi:dtdl:context;2",  "contents": [    {      "@type": "Property",      "name": "Temperature",      "schema": "double"    }  ]}' 
az dt model create --dt-name <instance-name> --models '{  "@id": "dtmi:example:Room;1",  "@type": "Interface",  "@context": "dtmi:dtdl:context;2",  "contents": [    {      "@type": "Property",      "name": "Temperature",      "schema": "double"    }, {      "@type": "Property",      "name": "Humidity",      "schema": "double"    }  ]}' 
```

You'll then need to **create a twin using each model**. Use the following commands to create a Thermostat twin and a Room twin, both with an initial temperature value of 0.0.

```azurecli-interactive
az dt twin create  --dt-name <instance-name> --dtmi "dtmi:contosocom:DigitalTwins:Thermostat;1" --twin-id Thermostat --properties '{"Temperature": 0.0,}'
az dt twin create  --dt-name <instance-name> --dtmi "dtmi:example:Room;1" --twin-id Room --properties '{"Temperature": 0.0,"Humidity": 0.0,}'
```

When the twins are created successfully, the CLI will output some information about the two twins that have been created.

## Set up endpoint

[Event Grid](../event-grid/overview.md) is an Azure service that helps you route and deliver events coming from Azure Services to other places within Azure. You can create an [event grid topic](../event-grid/concepts.md) to collect certain events from a source, and then subscribers can listen on the topic to receive the events as they come through.

In this section, you create an event grid topic, and then create an endpoint within Azure Digital Twins that points (sends events) to that topic. 

In Azure Cloud Shell, run the following command to create an event grid topic:

```azurecli-interactive
az eventgrid topic create --resource-group <your-resource-group> --name <name-for-your-event-grid-topic> --location <region>
```

> [!TIP]
> To output a list of Azure region names that can be passed into commands in the Azure CLI, run this command:
> ```azurecli-interactive
> az account list-locations --output table
> ```

The output from this command is information about the event grid topic you've created.

Next, create an Event Grid endpoint in Azure Digital Twins, which will connect your instance to your event grid topic. Use the command below, filling in the placeholder fields as necessary:

```azurecli-interactive
az dt endpoint create eventgrid --dt-name <your-Azure-Digital-Twins-instance> --eventgrid-resource-group <your-resource-group> --eventgrid-topic <your-event-grid-topic> --endpoint-name <name-for-your-Azure-Digital-Twins-endpoint>
```

The output from this command is information about the endpoint you've created.

You can also verify that the endpoint creation succeeded by running the following command to query your Azure Digital Twins instance for this endpoint:

```azurecli-interactive
az dt endpoint show --dt-name <your-Azure-Digital-Twins-instance> --endpoint-name <your-Azure-Digital-Twins-endpoint> 
```

Look for the `provisioningState` field in the output, and check that the value is "Succeeded". It may also say "Provisioning", meaning that the endpoint is still being created. In this case, wait a few seconds and run the command again to check that it has completed successfully.

:::image type="content" source="media/tutorial-end-to-end/output-endpoints.png" alt-text="Screenshot of the result of the endpoint query in the Cloud Shell of the Azure portal, showing the endpoint with a provisioningState of Succeeded.":::

Save the names that you gave to your **event grid topic** and your Event Grid **endpoint** in Azure Digital Twins. You will use them later.

## Set up route

Next, create an Azure Digital Twins route that sends events to the Event Grid endpoint you just created.

```azurecli-interactive
az dt route create --dt-name <your-Azure-Digital-Twins-instance> --endpoint-name <your-Azure-Digital-Twins-endpoint> --route-name <name-for-your-Azure-Digital-Twins-route>
```

The output from this command is some information about the route you've created.

>[!NOTE]
>Endpoints (from the previous step) must be finished provisioning before you can set up an event route that uses them. If the route creation fails because the endpoints aren't ready, wait a few minutes and then try again.

## Create the Azure function

1. First, open Visual Studio and create a new Azure Functions app project. For instructions on how to create a function app using Visual Studio, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure).

2. Add the following packages to your project (you can use the Visual Studio NuGet package manager or `dotnet` commands in a command-line tool).

    * [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core/)
    * [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/)
    * [System.Net.Http](https://www.nuget.org/packages/System.Net.Http/)
    * [Azure.Core](https://www.nuget.org/packages/Azure.Core/)
3. Rename the *Function1.cs* sample function that Visual Studio has generated to *TwinToTwin.cs*. Replace the code in the file with the following code and save the file:

    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/TwinToTwin.cs":::

    This code sample supports the [example scenario](#example-twin-update-scenario) of this how-to that updates the temperature on a Room twin whenever a Thermostat twin is updated. If you are using your own, different twins, you may want to edit the properties that are being updated or make other changes to the logic of the function to apply to your scenario.
4. Publish the function app with your *TwinToTwin.cs* function to Azure. For instructions on how to publish a function app, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure).

[!INCLUDE [digital-twins-verify-function-publish.md](../../includes/digital-twins-verify-function-publish.md)]

To access Azure Digital Twins, your function app needs a system-managed identity with permissions to access your Azure Digital Twins instance. You'll set that up next.

### Configure the function app

Next, **assign an access role** for the function and **configure the application settings** so that it can access your Azure Digital Twins instance.

[!INCLUDE [digital-twins-configure-function-app.md](../../includes/digital-twins-configure-function-app.md)]

## Connect the function to Event Grid

Next, subscribe the *TwinToTwin* Azure function to the event grid topic you created earlier, so that telemetry data can flow from the thermostat67 twin through the event grid topic to the function, which goes back into Azure Digital Twins and updates the room21 twin accordingly.

To do this, you'll create an **Event Grid subscription** that sends data from the **event grid topic** that you created earlier to your *TwinToTwin* Azure function.

In the [Azure portal](https://portal.azure.com/), navigate to your event grid topic by searching for its name in the top search bar. Select *+ Event Subscription*.

:::image type="content" source="media/tutorial-end-to-end/event-subscription-1b.png" alt-text="Screenshot of the Azure portal showing how to create an Event Grid event subscription.":::

The steps to create this event subscription are similar to when you subscribed the first Azure function to IoT Hub earlier in this tutorial. This time, you don't need to specify *Device Telemetry* as the event type to listen for, and you'll connect to a different Azure function.

On the *Create Event Subscription* page, fill in the fields as follows (fields filled by default are not mentioned):
* *EVENT SUBSCRIPTION DETAILS* > **Name**: Give a name to your event subscription.
* *ENDPOINT DETAILS* > **Endpoint Type**: Select *Azure Function* from the menu options.
* *ENDPOINT DETAILS* > **Endpoint**: Select the *Select an endpoint* link. This will open a *Select Azure Function* window:
    - Fill in your **Subscription**, **Resource group**, **Function app** and **Function** (*TwinToTwin*). Some of these may auto-populate after selecting the subscription.
    - Select **Confirm Selection**.

Back on the *Create Event Subscription* page, select **Create**.

## Test and verify results

Update the twin that's the source of the event flow. If you're using the [example scenario](#example-twin-update-scenario), you can update the Thermostat twin with this Azure CLI command:


```azurecli-interactive

```

Next, query your Azure Digital Twins instance for the twin that should receive the data and update automatically. If you're using the [example scenario](#example-twin-update-scenario), you can query to see the Room twin with this Azure CLI command:

```azurecli-interactive

```

The temperature value has automatically updated to match the temperature that was set on Thermostat.

## Next steps

In this article, you set up a function app in Azure for use with Azure Digital Twins. Next, see how to build on your basic function to [ingest IoT Hub data into Azure Digital Twins](how-to-ingest-iot-hub-data.md).
