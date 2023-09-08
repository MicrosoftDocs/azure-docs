---
title: Set up twin-to-twin event handling
titleSuffix: Azure Digital Twins
description: Learn how to create a function in Azure for propagating events through the twin graph.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 06/21/2022
ms.topic: how-to
ms.service: digital-twins
ms.custom: contperf-fy22q3, devx-track-azurecli
ms.devlang: azurecli

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up twin-to-twin event handling

This article shows how to send events from twin to twin, so that when one digital twin in the graph is updated, related twins in the graph that are affected by this information can also update. This event handling will help you create a fully connected Azure Digital Twins graph, where data that arrives into Azure Digital Twins from external sources like IoT Hub is propagated through the entire graph.

To set up this twin-to-twin event handling, you'll create an [Azure function](../azure-functions/functions-overview.md) that watches for twin life-cycle events. The function recognizes which events should affect other twins in the graph, and uses the event data to update the affected twins accordingly.

## Prerequisites

To set up twin-to-twin handling, you'll need an Azure Digital Twins instance to work with. For instructions on how to create an instance, see [Set up an Azure Digital Twins instance and authentication](./how-to-set-up-instance-portal.md). The instance should contain at least two twins that you want to send data between.

Optionally, you may want to set up [automatic telemetry ingestion through IoT Hub](how-to-ingest-iot-hub-data.md) for your twins as well. This process isn't required to send data from twin to twin, but it's an important piece of a complete solution where the twin graph is driven by live telemetry.

## Send twin events to an endpoint

To set up twin-to-twin event handling, start by creating an *endpoint* in Azure Digital Twins and a *route* to that endpoint. Twins undergoing an update will use the route to send information about their update events to the endpoint (where Event Grid can pick them up later and pass them to an Azure function for processing).

[!INCLUDE [digital-twins-twin-to-twin-resources.md](../../includes/digital-twins-twin-to-twin-resources.md)]

## Create Azure function to update twins

Next, create an Azure function that will listen on the endpoint and receive twin events that are sent there via the route. The logic of the function should use the information in the events to determine what other twins need to be updated and then perform the updates.

1. First, create a new Azure Functions project. 

    You can do this using **Visual Studio** (for instructions, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#create-an-azure-functions-project)), **Visual Studio Code** (for instructions, see [Create a C# function in Azure using Visual Studio Code](../azure-functions/create-first-function-vs-code-csharp.md?tabs=in-process#create-an-azure-functions-project)), or the **Azure CLI** (for instructions, see [Create a C# function in Azure from the command line](../azure-functions/create-first-function-cli-csharp.md?tabs=azure-cli%2Cin-process#create-a-local-function-project)).

2. Add the following packages to your project (you can use the Visual Studio NuGet package manager, or the [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in a command-line tool).

    * [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core/)
    * [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/)
    * [Microsoft.Azure.WebJobs.Extensions.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid)

3. Fill in the logic of your function. You can view sample function code for several scenarios in the [azure-digital-twins-getting-started](https://github.com/Azure-Samples/azure-digital-twins-getting-started/tree/main/azure-functions) repository to help you get started.

5. Publish the function to Azure, using your preferred method.

    For instructions on how to publish the function using **Visual Studio**, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure). For instructions on how to publish the function using **Visual Studio Code**, see [Create a C# function in Azure using Visual Studio Code](../azure-functions/create-first-function-vs-code-csharp.md?tabs=in-process#publish-the-project-to-azure). For instructions on how to publish the function using the **Azure CLI**, see [Create a C# function in Azure from the command line](../azure-functions/create-first-function-cli-csharp.md?tabs=azure-cli%2Cin-process#deploy-the-function-project-to-azure).

Once the process of publishing the function completes, you can use this Azure CLI command to verify the publish was successful. There are placeholders for your resource group, the name of your function app, and the name of your specific function. The command will print information about your function.

```azurecli-interactive
az functionapp function show --resource-group <your-resource-group> --name <your-function-app> --function-name <your-function>
```

### Configure the function app

Before your function can access Azure Digital Twins, it needs some information about the instance and permission to access it. In this section, you'll assign an access role for the function and configure the application settings so that it can find and access the instance.

[!INCLUDE [digital-twins-configure-function-app-cli.md](../../includes/digital-twins-configure-function-app-cli.md)]

## Connect the function to the endpoint

Next, subscribe your Azure function to the Event Grid endpoint you created earlier. Doing so will ensure that data can flow from an updated twin through the Event Grid topic to the function, which can use the event information to update other twins as needed.

To subscribe your Azure function, you'll create an *Event Grid subscription* that sends data from the Event Grid topic that you created earlier to your Azure function.

Use the following CLI command, filling in placeholders for your subscription ID, resource group, function app, and function name.

```azurecli-interactive
az eventgrid event-subscription create --name <name-for-your-event-subscription> --source-resource-id /subscriptions/<subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.EventGrid/topics/<your-event-grid-topic> --endpoint-type azurefunction --endpoint /subscriptions/<subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.Web/sites/<your-function-app-name>/functions/<function-name> 
```

Now, your function can receive events through your Event Grid topic. The data flow setup is complete.

## Test and verify results

The last step is to verify that the flow is working, by updating a twin and checking that related twins are updated according to the logic in your Azure function.

To kick off the process, update the twin that's the source of the event flow. You can use the [Azure CLI](/cli/azure/dt/twin#az-dt-twin-update), [Azure Digital Twins SDK](how-to-manage-twin.md#update-a-digital-twin), or [Azure Digital Twins REST APIs](how-to-use-postman-with-digital-twins.md?tabs=data-plane) to make the update.

Next, query your Azure Digital Twins instance for the related twin. You can use the [Azure CLI](/cli/azure/dt/twin#az-dt-twin-query), or the [Azure Digital Twins REST APIs and SDK](how-to-query-graph.md#run-queries-with-the-api). Verify that the twin received the data and updated as expected.

## Next steps

In this article, you set up twin-to-twin event handling in Azure Digital Twins. Next, set up an Azure function to trigger this flow automatically based on incoming telemetry from IoT Hub devices: [Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md).
