---
# Mandatory fields.
title: Set up twin-to-twin event handling
titleSuffix: Azure Digital Twins
description: See how to create a function in Azure for propagating events through the twin graph.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 8/13/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up twin-to-twin event handling with Azure Functions

A fully-connected Azure Digital Twins graph is driven by event propagation. Data arrives into Azure Digital Twins from external sources like IoT Hub, and then is propagated through the Azure Digital Twins graph, updating relevant twins as appropriate.

For example, consider a graph representing Floors and Rooms in a building, where each Floor contains multiple Rooms. You may want to set up a twin-to-twin data flow such that every time the temperature property on a Room twin is updated, a new average temperature is calculated for all the Rooms on the same Floor, and the temperature property of the Floor twin is updated to reflect the new average temperature across all the Rooms it contains (including the one that was updated). 

In this article, you'll see how to send events from twin to twin, allowing you to update twins in response to property changes or other data from another twin in the graph. Currently, twin-to-twin updates are handled by setting up an [Azure function](../azure-functions/functions-overview.md) that watches for twin life cycle events that should affect other areas of the graph, and makes changes to other twins accordingly.

## Prerequisites

This article uses **Visual Studio**. You can download the latest version from [Visual Studio Downloads](https://visualstudio.microsoft.com/downloads/).

To set up twin-to-twin handling, you'll need an **Azure Digital Twins instance** to work with. For instructions on how to create an instance, see [Set up an Azure Digital Twins instance and authentication](./how-to-set-up-instance-portal.md). The instance should contain at least **two twins** that you want to send data between.

Optionally, you may want to set up [automatic telemetry ingestion through IoT Hub](how-to-ingest-iot-hub-data.md) for your twins as well. This is not required in order to send data from twin to twin, but it's an important piece of a complete solution where the twin graph is driven by live telemetry.

## Set up endpoint and route

To set up twin-to-twin event handling, start by creating an **endpoint** in Azure Digital Twins and a **route** to that endpoint. Twins undergoing an update will use the route to send information about their update events to the endpoint (where Event Grid can pick them up later and pass them to an Azure function for processing).

[!INCLUDE [digital-twins-twin-to-twin-resources.md](../../includes/digital-twins-twin-to-twin-resources.md)]

## Create the Azure function

Next, create an Azure function that will listen on the endpoint and receive twin events that are sent there via the route. 

1. First, create an Azure Functions project in Visual Studio on your machine. For instructions on how to do this, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#create-an-azure-functions-project).

2. Add the following packages to your project (you can use the Visual Studio NuGet package manager or `dotnet` commands in a command-line tool).

    * [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core/)
    * [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/)
    * [Microsoft.Azure.WebJobs.Extensions.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid)

3. Fill in the logic of your function. You can view sample function code for several scenarios in the [azure-digital-twins-getting-started](https://github.com/Azure-Samples/azure-digital-twins-getting-started/tree/main/azure-functions) repository to help you get started.

5. Publish the function app to Azure. For instructions on how to publish a function app, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure).

[!INCLUDE [digital-twins-verify-function-publish.md](../../includes/digital-twins-verify-function-publish.md)]

### Configure the function app

Before your function can access Azure Digital Twins, it needs some information about the instance and permission to access it. In this section, you'll **assign an access role** for the function and **configure the application settings** so that it can find and access the instance.

[!INCLUDE [digital-twins-configure-function-app-cli.md](../../includes/digital-twins-configure-function-app-cli.md)]

## Connect the function to Event Grid

Next, subscribe your Azure function to the event grid topic you created earlier. This will ensure that data can flow from an updated twin through the event grid topic to the function.

To do this, you'll create an **Event Grid subscription** that sends data from the event grid topic that you created earlier to your Azure function.

Use the following CLI command, filling in placeholders for your subscription ID, resource group, function app, and function name.

```azurecli-interactive
az eventgrid event-subscription create --name <name-for-your-event-subscription> --source-resource-id /subscriptions/<subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.EventGrid/topics/<your-event-grid-topic> \ --endpoint-type azurefunction --endpoint /subscriptions/<subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.Web/sites/<your-function-app-name>/functions/<function-name> 
```

Now, your function can receive events through your event grid topic. The data flow setup is complete.

## Test and verify results

The last step is to verify that the flow is working, by updating a twin and checking that related twins are updated according to the logic in your Azure function.

To kick off the process, update the twin that's the source of the event flow. You can use the [Azure CLI](/cli/azure/dt/twin?view=azure-cli-latest&preserve-view=true#az_dt_twin_update), [Azure Digital Twins SDK](how-to-manage-twin.md#update-a-digital-twin), or [Azure Digital Twins REST APIs](how-to-use-postman.md?tabs=data-plane) to make the update.

Next, query your Azure Digital Twins instance for the related twin. You can use the [Azure CLI](/cli/azure/dt/twin?view=azure-cli-latest&preserve-view=true#az_dt_twin_query), or the [Azure Digital Twins REST APIs and SDK](how-to-query-graph.md#run-queries-with-the-api). Verify that the twin received the data and updated as expected.

## Next steps

In this article, you set up twin-to-twin event handling in Azure Digital Twins. Next, set up an Azure function to trigger this flow automatically based on incoming telemetry from IoT Hub devices: [Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md).
