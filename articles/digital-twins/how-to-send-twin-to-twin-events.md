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

Currently, this is accomplished by setting up an [Azure function](../azure-functions/functions-overview.md) that watches for twin life cycle events that should affect other areas of the graph, and makes changes to other twins accordingly. This article walks through the process of setting up this function on an example scenario.

Here are the actions you will complete:
1. [Set up an Event Grid endpoint](#create-the-endpoint) in Azure Digital Twins that connects the instance to Event Grid
2. [Set up a route](#create-the-route) within Azure Digital Twins to send twin property change events to the endpoint
3. [Create an Azure function](#create-the-azure-function) capable of listening on the Event Grid endpoint and updating other twins accordingly
4. [Connect the function to Event Grid](#connect-the-function-to-event-grid) so that it receives the updates from the Event Grid endpoint
5. [Test and verify](#test-and-verify-results) the solution by simulating a property change and querying Azure Digital Twins to see the results on other twins

## Prerequisites

This article uses **Visual Studio**. You can download the latest version from [Visual Studio Downloads](https://visualstudio.microsoft.com/downloads/).

Before continuing with this example, you'll also need to set up an **Azure Digital Twins instance** to work with. For instructions on how to create an instance, see [How-to: Set up an Azure Digital Twins instance and authentication](./how-to-set-up-instance-portal.md). The instance should contain at least two twins that you want to send data between. If you already have twins in your instance to use for this how-to, you can skip the rest of this section. To set up twins in an example scenario, continue through the rest of this section.

### Example twin update scenario

In this section, you'll set up an example set of [digital twins](concepts-twins-graph.md) that can be used to pass data between twins.

There are three twins in this example:
* **Floor1**: An *IFloor* type twin representing a floor in a building. It has a *temperature* property (among other elements that aren't used in this article).
* **Room100** and **Room101**: Two *IRoom* type twins representing rooms on **Floor1**. Each room also has a *temperature* property.

:::image type="content" source="media/how-to-send-twin-to-twin-events/sample-graph.png" alt-text="Diagram showing a graph of three nodes, representing the twins and relationships described above.":::

The temperature on **Floor1** should reflect an average of the temperatures in **Room100** and **Room101**. The steps in this article will set this up, by ensuring that whenever the temperature on either of the room twins is updated, this event is sent to an Azure function that computes the average, and sets the temperature of **Floor1** equal to that average.

#### Download the sample 

The models and sample function code used in the example scenario can be downloaded from this repository: [azure-digital-twins-getting-started](https://github.com/Azure-Samples/azure-digital-twins-getting-started). You can get the repository on your machine by either cloning it or downloading it as a .zip file (which you should then unzip on your machine).

#### Add a model and twins

In this section, you'll set up the example twins, Floor1, Room100, and Room101.

First, you'll need to **upload the models** for IFloor and IRoom. These can be found in the repository you downloaded in the last section, under *azure-digital-twins-getting-started/models/basic-home-example/*.

One way to upload these to your instance is using the Azure CLI. You can use the [Azure Cloud Shell](../cloud-shell/overview.md) in your browser, or the [local CLI](/cli/azure/install-azure-cli) if you have it installed on your machine.

>[!NOTE]
> If you're using Azure Cloud Shell, start by uploading the model files to your Cloud Shell storage so they can be accessed by the command. In the Cloud Shell window in your browser, select the "Upload/Download files" icon and choose "Upload".
>
> :::image type="content" source="media/how-to-set-up-instance/cloud-shell/cloud-shell-upload.png" alt-text="Screenshot of Azure Cloud Shell. The Upload icon is highlighted.":::
>
> Navigate to *azure-digital-twins-getting-started/models/basic-home-example/* on your machine and select **IFloor.json** and **IRoom.json** to open. This will upload the files to the root of your Cloud Shell storage.

Use the following Azure CLI commands to upload the models to your Azure Digital Twins instance.

```azurecli-interactive
az dt model create --dt-name <Azure-Digital-Twins-instance> --models <path-to-IFloor.json> 
az dt model create --dt-name <Azure-Digital-Twins-instance> --models <path-to-IRoom.json> 
```

Next, **create the twins** based on the models. Use the following commands to create the Floor and Room twins, all with an initial temperature value of 0.0.

```azurecli-interactive
az dt twin create  --dt-name <Azure-Digital-Twins-instance> --dtmi "dtmi:com:adt:dtsample:floor;1" --twin-id Floor1 --properties '{"id": "Floor1", "temperature": 0.0, "humidity": 0.0}'

az dt twin create  --dt-name <Azure-Digital-Twins-instance> --dtmi "dtmi:com:adt:dtsample:room;1" --twin-id Room100 --properties '{"id": "Room100", "temperature": 0.0, "humidity": 0.0}'

az dt twin create  --dt-name <Azure-Digital-Twins-instance> --dtmi "dtmi:com:adt:dtsample:room;1" --twin-id Room101 --properties '{"id": "Room101", "temperature": 0.0, "humidity": 0.0}'
```

When the twins are created successfully, the CLI will output some information about the two twins that have been created.

Finally, **create a relationship** from the Floor twin to the Room twins indicating that the floor "has" these rooms within it.

```azurecli-interactive
az dt twin relationship create -n <Azure-Digital-Twins-instance> --relationship-id Floor1_Room100 --relationship rel_has_rooms  --twin-id Floor1 --target Room100
az dt twin relationship create -n <Azure-Digital-Twins-instance> --relationship-id Floor1_Room101 --relationship rel_has_rooms  --twin-id Floor1 --target Room101
```

Now you've finished setting up the example scenario to use with this how-to.

## Set up endpoint and route

To set up twin-to-twin event handling, start by creating an **endpoint** in Azure Digital Twins and a **route** to that endpoint. The Room twins will use the route to send information about their update events to the endpoint (where Event Grid can pick them up later and pass them to an Azure function for processing).

[!INCLUDE [digital-twins-twin-to-twin-resources.md](../../includes/digital-twins-twin-to-twin-resources.md)]

## Create the Azure function

Next, create an Azure function that will listen on the endpoint and receive twin events that are sent there via the route. 

If you're following the [example scenario](#example-twin-update-scenario) for this article, you'll publish a sample function written for the sample Room and Floor twins. Whenever it receives a temperature update event from a Room, it will locate the parent Floor twin in the Azure Digital Twins graph, calculate the average of all Rooms on that floor, and update the Floor twin's temperature property to reflect that average temperature.

1. First, create an Azure Functions project in Visual Studio on your machine. If you're following the example scenario for this tutorial, you can open the sample project you downloaded in the [Prerequisites](#download-the-sample) section, located at *azure-digital-twins-getting-started/azure-functions/twin-updates/TwinUpdatesSample.sln*.

2. Add the following packages to your project (you can use the Visual Studio NuGet package manager or `dotnet` commands in a command-line tool).

    * [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core/)
    * [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/)
    * [Microsoft.Azure.WebJobs.Extensions.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid)

3. Fill in the logic of your function. If you're following the example scenario for this article, the function already exists in the project as **ProcessDTRoutedData.cs**. If you're writing your own Azure function for a different set of twins, you can view sample functions in the [azure-digital-twins-getting-started](https://github.com/Azure-Samples/azure-digital-twins-getting-started/tree/main/azure-functions) repository to help you get started.

5. Publish the function app and *ProcessDTRoutedData.cs* function to Azure. For instructions on how to publish a function app, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure).

[!INCLUDE [digital-twins-verify-function-publish.md](../../includes/digital-twins-verify-function-publish.md)]

### Configure the function app

Before your function can access Azure Digital Twins, it needs some information about the instance and permission to access it. In this section, you'll **assign an access role** for the function and **configure the application settings** so that it can find and access the instance.

[!INCLUDE [digital-twins-configure-function-app-cli.md](../../includes/digital-twins-configure-function-app-cli.md)]

## Connect the function to Event Grid

Next, subscribe your Azure function to the event grid topic you created earlier. This will ensure that data can flow from an updated twin through the event grid topic to the function.

To do this, you'll create an **Event Grid subscription** that sends data from the event grid topic that you created earlier to your Azure function.

1. In the [Azure portal](https://portal.azure.com/), navigate to your event grid topic by searching for its name in the top search bar and selecting it from the results.

1. Select *+ Event Subscription*.

    :::image type="content" source="media/tutorial-end-to-end/event-subscription-1b.png" alt-text="Screenshot of the Azure portal showing how to create an Event Grid event subscription.":::

1. On the *Create Event Subscription* page, fill in the following fields (other fields can be left on default values): 
    * *EVENT SUBSCRIPTION DETAILS* > **Name**: Give a name to your event subscription.
    * *ENDPOINT DETAILS* > **Endpoint Type**: Select *Azure Function* from the menu options.
    * *ENDPOINT DETAILS* > **Endpoint**: Select the *Select an endpoint* link. This will open a *Select Azure Function* window:
        - Fill in your **Subscription**, **Resource group**, **Function app** and **Function** (if you're following the example scenario for this article, the function is *ProcessDTRoutedData*). Some of these may auto-populate after selecting the subscription.
        - Select **Confirm Selection**.

1. Back on the *Create Event Subscription* page, select **Create**.

Now, your function can receive events through your event grid topic. The data flow setup is complete.

## Test and verify results

The last step is to verify that the flow is working, by updating a twin and checking that related twins are updated accordingly.

To kick off the process, update the twin that's the source of the event flow. If you're following the example scenario for this article, you can use the following Azure CLI command to update the temperature on the Room twins to new values of 30.00 and 50.00:

```azurecli-interactive
az dt twin update -n <Azure-Digital-Twins-instance> --twin-id Room100 --json-patch '{"op":"replace", "path":"/temperature", "value": 30.00}'
az dt twin update -n <Azure-Digital-Twins-instance> --twin-id Room101 --json-patch '{"op":"replace", "path":"/temperature", "value": 50.00}'
```

Next, query your Azure Digital Twins instance for the parent twin that should receive the data and update to match. If you're following the example scenario, you can use the following Azure CLI command to query for the Floor1 twin and see its property information:

```azurecli-interactive
az dt twin show -n <Azure-Digital-Twins-instance> --twin-id Floor1
```

The output should show that the temperature value of Floor1 has automatically updated to 40.00 (the average of the temperatures for Room100 and Room101).

## Next steps

In this article, you set up twin-to-twin event handling in Azure Digital Twins. Next, set up an Azure function to trigger this flow automatically based on incoming telemetry from IoT Hub devices: [Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md).
