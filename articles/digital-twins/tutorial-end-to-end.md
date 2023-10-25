---
title: 'Tutorial: Connect an end-to-end solution'
titleSuffix: Azure Digital Twins
description: Follow this tutorial to learn how to build out an end-to-end Azure Digital Twins solution that's driven by device data.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 09/12/2023
ms.topic: tutorial
ms.service: digital-twins
ms.custom: engagement-fy23, devx-track-azurecli

# CustomerIntent: As a developer, I want to create a data flow from devices through Azure Digital Twins so that I can have a connected digital twin solution.
# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Tutorial: Build out an end-to-end solution

This Azure Digital Twins tutorial describes how to build out an end-to-end solution that demonstrates the functionality of the service. To set up a full end-to-end solution driven by live data from your environment, you can connect your Azure Digital Twins instance to other Azure services for management of devices and data.

In this tutorial, you will...
> [!div class="checklist"]
> * Set up an Azure Digital Twins instance
> * Learn about the sample building scenario and instantiate the pre-written components
> * Use an [Azure Functions](../azure-functions/functions-overview.md) app to route simulated telemetry from an [IoT Hub](../iot-hub/about-iot-hub.md) device into digital twin properties
> * Propagate changes through the twin graph by processing digital twin notifications with Azure Functions, endpoints, and routes

[!INCLUDE [Sample prerequisites for Azure Digital Twins tutorial](../../includes/digital-twins-tutorial-sample-prereqs.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

[!INCLUDE [CLI setup for Azure Digital Twins](../../includes/digital-twins-cli.md)]

[!INCLUDE [Azure Digital Twins tutorial: configure the sample project](../../includes/digital-twins-tutorial-sample-configure.md)]

## Get started with the building scenario

The sample project used in this tutorial represents a real-world building scenario, containing a floor, a room, and a thermostat device. These components will be digitally represented in an Azure Digital Twins instance, which will then be connected to [IoT Hub](../iot-hub/about-iot-hub.md), [Event Grid](../event-grid/overview.md), and two [Azure functions](../azure-functions/functions-overview.md) to enable movement of data.

Below is a diagram representing the full scenario. 

You'll first create the Azure Digital Twins instance (**section A** in the diagram), then set up the telemetry data flow into the digital twins (**arrow B**), then set up the data propagation through the twin graph (**arrow C**).

:::image type="content" source="media/tutorial-end-to-end/building-scenario.png" alt-text="Diagram of the full building scenario, which shows the data flowing from a device into and out of Azure Digital Twins through various Azure services.":::

To work through the scenario, you'll interact with components of the pre-written sample app you downloaded earlier.

Here are the components implemented by the building scenario AdtSampleApp sample app:
* Device authentication 
* [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins.core-readme) usage examples (found in *CommandLoop.cs*)
* Console interface to call the Azure Digital Twins API
* SampleClientApp - A sample Azure Digital Twins solution
* SampleFunctionsApp - An Azure Functions app that updates your Azure Digital Twins graph based on telemetry from IoT Hub and Azure Digital Twins events

### Instantiate the pre-created twin graph

First, you'll use the AdtSampleApp solution from the sample project to build the Azure Digital Twins piece of the end-to-end scenario (**section A**):

:::image type="content" source="media/tutorial-end-to-end/building-scenario-a.png" alt-text="Diagram of an excerpt from the full building scenario diagram highlighting the Azure Digital Twins instance section.":::

Open a local **console window** and navigate into the *digital-twins-samples-main\AdtSampleApp\SampleClientApp* folder. Run the *SampleClientApp* project with this dotnet command:

```cmd/sh
dotnet run
```

The project will start running, carry out authentication, and wait for a command. In this console, run the next command to instantiate the sample Azure Digital Twins solution.

> [!IMPORTANT]
> If you already have digital twins and relationships in your Azure Digital Twins instance, running this command will delete them and replace them with the twins and relationships for the sample scenario.

```cmd/sh
SetupBuildingScenario
```

The output of this command is a series of confirmation messages as three [digital twins](concepts-twins-graph.md) are created and connected in your Azure Digital Twins instance: a floor named floor1, a room named room21, and a temperature sensor named thermostat67. These digital twins represent the entities that would exist in a real-world environment.

They're connected via relationships into the following [twin graph](concepts-twins-graph.md). The twin graph represents the environment as a whole, including how the entities interact with and relate to each other.

:::image type="content" source="media/tutorial-end-to-end/building-scenario-graph.png" alt-text="Diagram showing that floor1 contains room21, and room21 contains thermostat67." border="false":::

You can verify the twins that were created by running the following command, which queries the connected Azure Digital Twins instance for all the digital twins it contains:

```cmd/sh
Query
```

You can now stop running the project. Keep the console window open at this location, though, as you'll use this app again later in the tutorial.

## Set up the sample function app

The next step is setting up an [Azure Functions app](../azure-functions/functions-overview.md) that will be used throughout this tutorial to process data. The function app, SampleFunctionsApp, contains two functions:
* *ProcessHubToDTEvents*: processes incoming IoT Hub data and updates Azure Digital Twins accordingly
* *ProcessDTRoutedData*: processes data from digital twins, and updates the parent twins in Azure Digital Twins accordingly

In this section, you'll publish the pre-written function app, and ensure the function app can access Azure Digital Twins by assigning it a Microsoft Entra identity.

The function app is part of the sample project you downloaded, located in the *digital-twins-samples-main\AdtSampleApp\SampleFunctionsApp* folder.

### Publish the app

To publish the function app to Azure, you'll need to create a storage account, then create the function app in Azure, and finally publish the functions to the Azure function app. This section completes these actions using the Azure CLI. In each command, replace any placeholders in angle brackets with the details for your own resources.

1. Create an Azure storage account by running the following command:

    ```azurecli-interactive
    az storage account create --name <name-for-new-storage-account> --location <location> --resource-group <resource-group> --sku Standard_LRS
    ```

1. Create an Azure function app by running the following command:

    ```azurecli-interactive
    az functionapp create --name <name-for-new-function-app> --storage-account <name-of-storage-account-from-previous-step> --functions-version 4 --consumption-plan-location <location> --runtime dotnet-isolated --runtime-version 7 --resource-group <resource-group>
    ```

1. Next, you'll zip up the functions and publish them to your new Azure function app.

    1. Open a console window on your machine, and navigate into the *digital-twins-samples-main\AdtSampleApp\SampleFunctionsApp* folder inside your downloaded sample project.
    
    1. In the console, run the following command to publish the project locally:

        ```cmd/sh
        dotnet publish -c Release -o publish
        ```

        This command publishes the project to the *digital-twins-samples-main\AdtSampleApp\SampleFunctionsApp\publish* directory.

    1. Using your preferred method, create a zip of the published files that are located **inside** the *digital-twins-samples-main\AdtSampleApp\SampleFunctionsApp\publish* directory. Name the zipped folder *publish.zip*.
        
        >[!IMPORTANT] 
        >Make sure the zipped folder does not include an extra layer for the *publish* folder itself. It should only contain the contents that were inside the *publish* folder.

        Here's an image of how the zip contents might look (it may change depending on your version of .NET).

        :::image type="content" source="media/tutorial-end-to-end/publish-zip.png" alt-text="Screenshot of File Explorer in Windows showing the contents of the publish zip folder.":::

    Now you can close the local console window that you used to prepare the project. The last step will be done in the Azure CLI.

1. In the Azure CLI, run the following command to deploy the published and zipped functions to your Azure function app:

    ```azurecli-interactive
    az functionapp deployment source config-zip --resource-group <resource-group> --name <name-of-your-function-app> --src "<full-path-to-publish.zip>"
    ```

    > [!TIP]
    > If you're using the Azure CLI locally, you can access the ZIP file on your computer directly using its path on your machine.
    > 
    >If you're using the Azure Cloud Shell, upload the ZIP file to Cloud Shell with this button before running the command:
    >
    > :::image type="content" source="media/tutorial-end-to-end/azure-cloud-shell-upload.png" alt-text="Screenshot of the Azure Cloud Shell highlighting how to upload files.":::
    >
    > In this case, the file will be uploaded to the root directory of your Cloud Shell storage, so you can refer to the file directly by its name for the `--src` parameter of the command (as in, `--src publish.zip`).

    A successful deployment will respond with status code 202 and output a JSON object containing details of your new function. You can confirm the deployment succeeded by looking for this field in the result:

    ```json
    "provisioningState": "Succeeded",
    ```

The functions should now be published to a function app in Azure. You can use the following CLI commands to verify both functions were published successfully. Each command has placeholders for your resource group and the name of your function app. The commands will print information about the *ProcessDTRoutedData* and *ProcessHubToDTEvents* functions that have been published.

```azurecli-interactive
az functionapp function show --resource-group <your-resource-group> --name <your-function-app> --function-name ProcessDTRoutedData
az functionapp function show --resource-group <your-resource-group> --name <your-function-app> --function-name ProcessHubToDTEvents
```

Next, your function app will need to have the right permission to access your Azure Digital Twins instance. You'll configure this access in the next section.

### Configure permissions for the function app

There are two settings that need to be set for the function app to access your Azure Digital Twins instance, both of which can be done using the Azure CLI. 

#### Assign access role

The first setting gives the function app the **Azure Digital Twins Data Owner** role in the Azure Digital Twins instance. This role is required for any user or function that wants to perform many data plane activities on the instance. You can read more about security and role assignments in [Security for Azure Digital Twins solutions](concepts-security.md). 

1. Use the following command to create a [system-assigned identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) for the function. The output will display details of the identity that's been created. Take note of the **principalId** field in the output to use in the next step.

    ```azurecli-interactive	
    az functionapp identity assign --resource-group <your-resource-group> --name <your-function-app-name>
    ```

1. Use the **principalId** value in the following command to assign the function app's identity to the **Azure Digital Twins Data Owner** role for your Azure Digital Twins instance.

    ```azurecli-interactive	
    az dt role-assignment create --resource-group <your-resource-group> --dt-name <your-Azure-Digital-Twins-instance> --assignee "<principal-ID>" --role "Azure Digital Twins Data Owner"
    ```

The result of this command is outputted information about the role assignment you've created. The function app now has permissions to access data in your Azure Digital Twins instance.

#### Configure application setting

The second setting creates an environment variable for the function with the URL of your Azure Digital Twins instance. The function code will use the value of this variable to refer to your instance. For more information about environment variables, see [Manage your function app](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal). 

Run the command below, filling in the placeholders with the details of your resources.

```azurecli-interactive
az functionapp config appsettings set --resource-group <your-resource-group> --name <your-function-app-name> --settings "ADT_SERVICE_URL=https://<your-Azure-Digital-Twins-instance-host-name>"
```

The output is the list of settings for the Azure Function, which should now contain an entry called `ADT_SERVICE_URL`.

## Process simulated telemetry from an IoT Hub device

An Azure Digital Twins graph is meant to be driven by telemetry from real devices. 

In this step, you'll connect a simulated thermostat device registered in [IoT Hub](../iot-hub/about-iot-hub.md) to the digital twin that represents it in Azure Digital Twins. As the simulated device emits telemetry, the data will be directed through the *ProcessHubToDTEvents* Azure function that triggers a corresponding update in the digital twin. In this way, the digital twin stays up to date with the real device's data. In Azure Digital Twins, the process of directing events data from one place to another is called [routing events](concepts-route-events.md).

Processing the simulated telemetry happens in this part of the end-to-end scenario (**arrow B**):

:::image type="content" source="media/tutorial-end-to-end/building-scenario-b.png" alt-text="Diagram of an excerpt from the full building scenario diagram highlighting the section that shows elements before Azure Digital Twins.":::

Here are the actions you'll complete to set up this device connection:
1. Create an IoT hub that will manage the simulated device
2. Connect the IoT hub to the appropriate Azure function by setting up an event subscription
3. Register the simulated device in IoT hub
4. Run the simulated device and generate telemetry
5. Query Azure Digital Twins to see the live results

### Create an IoT Hub instance

Azure Digital Twins is designed to work alongside [IoT Hub](../iot-hub/about-iot-hub.md), an Azure service for managing devices and their data. In this step, you'll set up an IoT hub that will manage the sample device in this tutorial.

In the Azure CLI, use this command to create a new IoT hub:

```azurecli-interactive
az iot hub create --name <name-for-your-IoT-hub> --resource-group <your-resource-group> --sku S1
```

The output of this command is information about the IoT hub that was created.

Save the **name** that you gave to your IoT hub. You'll use it later.

### Connect the IoT hub to the Azure function

Next, connect your IoT hub to the *ProcessHubToDTEvents* Azure function in the function app you published earlier, so that data can flow from the device in IoT Hub through the function, which updates Azure Digital Twins.

To do so, you'll create an *event subscription* on your IoT Hub, with the Azure function as an endpoint. This "subscribes" the function to events happening in IoT Hub.

Use the following CLI command to create the event subscription. There's a placeholder for you to enter a name for the event subscription, and there are also placeholders for you to enter your subscription ID, resource group, IoT hub name, and the name of your function app.

```azurecli-interactive
az eventgrid event-subscription create --name <name-for-hub-event-subscription> --event-delivery-schema eventgridschema --source-resource-id /subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.Devices/IotHubs/<your-IoT-hub> --included-event-types Microsoft.Devices.DeviceTelemetry --endpoint-type azurefunction --endpoint /subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.Web/sites/<your-function-app>/functions/ProcessHubToDTEvents
```

The output will show information about the event subscription that has been created. You can confirm that the operation completed successfully by verifying the `provisioningState` value in the result:

```azurecli
"provisioningState": "Succeeded",
```

>[!TIP]
>If the command returns a resource provider error, add *Microsoft.EventGrid* as a resource provider to your subscription. You can do this in the Azure portal by following the instructions in [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider-1).

### Register the simulated device with IoT Hub 

This section creates a device representation in IoT Hub with the ID thermostat67. The simulated device will connect into this representation, which is how telemetry events will go from the device into IoT Hub. The IoT hub is where the subscribed Azure function from the previous step is listening, ready to pick up the events and continue processing.

In the Azure CLI, create a device in IoT Hub with the following command:

```azurecli-interactive
az iot hub device-identity create --device-id thermostat67 --hub-name <your-IoT-hub-name> --resource-group <your-resource-group>
```

The output is information about the device that was created.

### Configure and run the simulation

Next, configure the device simulator to send data to your IoT Hub instance.

Begin by getting the IoT hub connection string with the following command. The connection string value will start with `HostName=`.

```azurecli-interactive
az iot hub connection-string show --hub-name <your-IoT-hub-name>
```

Then, get the device connection string with this command:

```azurecli-interactive
az iot hub device-identity connection-string show --device-id thermostat67 --hub-name <your-IoT-hub-name>
```

Next, plug these values into the device simulator code in your local project to connect the simulator into this IoT hub and IoT hub device.

Navigate on your local machine to the downloaded sample folder, and into the *digital-twins-samples-main\DeviceSimulator\DeviceSimulator* folder. Open the *AzureIoTHub.cs* file for editing. Change the following connection string values to the values you gathered above:

```csharp
private const string iotHubConnectionString = "<your-hub-connection-string>";
//...
private const string deviceConnectionString = "<your-device-connection-string>";
```

Save the file.

Now, to see the results of the data simulation that you've set up, open a new local console window and navigate to *digital-twins-samples-main\DeviceSimulator\DeviceSimulator*.

>[!NOTE]
> You should now have two open console windows: one that's open to the the *DeviceSimulator\DeviceSimulator* folder, and one from earlier that's still open to the *AdtSampleApp\SampleClientApp* folder.

Use the following dotnet command to run the device simulator project:

```cmd/sh
dotnet run
```

The project will start running and begin displaying simulated temperature telemetry messages. These messages are being sent to IoT Hub, where they're then picked up and processed by the Azure function.

:::image type="content" source="media/tutorial-end-to-end/console-simulator-telemetry.png" alt-text="Screenshot of the console output of the device simulator showing temperature telemetry being sent.":::

You don't need to do anything else in this console, but leave it running while you complete the next steps.

### See the results in Azure Digital Twins

The *ProcessHubToDTEvents* function you published earlier listens to the IoT Hub data, and calls an Azure Digital Twins API to update the `Temperature` property on the thermostat67 twin.

To see the data from the Azure Digital Twins side, switch to your other console window that's open to the *AdtSampleApp\SampleClientApp* folder. Run the *SampleClientApp* project with `dotnet run`.

```cmd/sh
dotnet run
```

Once the project is running and accepting commands, run the following command to get the temperatures being reported by the digital twin thermostat67:

```cmd/sh
ObserveProperties thermostat67 Temperature
```

You should see the live updated temperatures from your Azure Digital Twins instance being logged to the console every two seconds. They should reflect the values that the data simulator is generating (you can place the console windows side-by-side to verify that the values coordinate).

>[!NOTE]
> It may take a few seconds for the data from the device to propagate through to the twin. The first few temperature readings may show as 0 before data begins to arrive.

:::image type="content" source="media/tutorial-end-to-end/console-digital-twins-telemetry.png" alt-text="Screenshot of the console output showing log of temperature messages from digital twin thermostat67.":::

Once you've verified the live temperature logging is working successfully, you can stop running both projects. Keep the console windows open, as you'll use them again later in the tutorial.

## Propagate Azure Digital Twins events through the graph

So far in this tutorial, you've seen how Azure Digital Twins can be updated from external device data. Next, you'll see how changes to one digital twin can propagate through the Azure Digital Twins graph—in other words, how to update twins from service-internal data.

To do so, you'll use the *ProcessDTRoutedData* Azure function to update a Room twin when the connected Thermostat twin is updated. The update functionality happens in this part of the end-to-end scenario (**arrow C**):

:::image type="content" source="media/tutorial-end-to-end/building-scenario-c.png" alt-text="Diagram of an excerpt from the full building scenario diagram highlighting the section that shows the elements after Azure Digital Twins.":::

Here are the actions you'll complete to set up this data flow:
1. [Create an Event Grid topic](#create-the-event-grid-topic) to enable movement of data between Azure services
1. [Create an endpoint](#create-the-endpoint) in Azure Digital Twins that connects the instance to the Event Grid topic
1. [Set up a route](#create-the-route) within Azure Digital Twins that sends twin property change events to the endpoint
1. [Set up an Azure function](#connect-the-azure-function) that listens on the Event Grid topic at the endpoint, receives the twin property change events that are sent there, and updates other twins in the graph accordingly

[!INCLUDE [digital-twins-twin-to-twin-resources.md](../../includes/digital-twins-twin-to-twin-resources.md)]

### Connect the Azure function

Next, subscribe the *ProcessDTRoutedData* Azure function to the Event Grid topic you created earlier, so that telemetry data can flow from the thermostat67 twin through the Event Grid topic to the function, which goes back into Azure Digital Twins and updates the room21 twin accordingly.

To do so, you'll create an Event Grid subscription that sends data from the Event Grid topic that you created earlier to your *ProcessDTRoutedData* Azure function.

Use the following CLI command to create the event subscription. There's a placeholder for you to enter a name for this event subscription, and there are also placeholders for you to enter your subscription ID, resource group, the name of your Event Grid topic, and the name of your function app.

```azurecli-interactive
az eventgrid event-subscription create --name <name-for-topic-event-subscription> --event-delivery-schema eventgridschema --source-resource-id /subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.EventGrid/topics/<your-event-grid-topic> --endpoint-type azurefunction --endpoint /subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.Web/sites/<your-function-app>/functions/ProcessDTRoutedData
```

## Run the simulation and see the results

Now, events should have the capability to flow from the simulated device into Azure Digital Twins, and through the Azure Digital Twins graph to update twins as appropriate. In this section, you'll run the device simulator again to kick off the full event flow you've set up, and query Azure Digital Twins to see the live results

Go to your console window that's open to the *DeviceSimulator\DeviceSimulator* folder, and run the device simulator project with `dotnet run`.

Like the first time you ran the device simulator, the project will start running and display simulated temperature telemetry messages. These events are going through the flow you set up earlier to update the thermostat67 twin, and then going through the flow you set up recently to update the room21 twin to match.

:::image type="content" source="media/tutorial-end-to-end/console-simulator-telemetry.png" alt-text="Screenshot of the console output of the device simulator showing temperature telemetry being sent.":::

You don't need to do anything else in this console, but leave it running while you complete the next steps.

To see the data from the Azure Digital Twins side, go to your other console window that's open to the *AdtSampleApp\SampleClientApp* folder, and run the *SampleClientApp* project with `dotnet run`.

Once the project is running and accepting commands, run the following command to get the temperatures being reported by both the digital twin thermostat67 and the digital twin room21.

```cmd
ObserveProperties thermostat67 Temperature room21 Temperature
```

You should see the live updated temperatures from your Azure Digital Twins instance being logged to the console every two seconds. Notice that the temperature for room21 is being updated to match the updates to thermostat67.

:::image type="content" source="media/tutorial-end-to-end/console-digital-twins-telemetry-b.png" alt-text="Screenshot of the console output showing a log of temperature messages, from a thermostat and a room.":::

Once you've verified the live temperatures logging from your instance is working successfully, you can stop running both projects. You can also close both console windows, as the tutorial is now complete.

## Review

Here's a review of the scenario that you built in this tutorial.

1. An Azure Digital Twins instance digitally represents a floor, a room, and a thermostat (represented by **section A** in the diagram below)
2. Simulated device telemetry is sent to IoT Hub, where the *ProcessHubToDTEvents* Azure function is listening for telemetry events. The *ProcessHubToDTEvents* Azure function uses the information in these events to set the `Temperature` property on thermostat67 (**arrow B** in the diagram).
3. Property change events in Azure Digital Twins are routed to an Event Grid topic, where the *ProcessDTRoutedData* Azure function is listening for events. The *ProcessDTRoutedData* Azure function uses the information in these events to set the `Temperature` property on room21 (**arrow C** in the diagram).

:::image type="content" source="media/tutorial-end-to-end/building-scenario.png" alt-text="Diagram from the beginning of the article showing the full building scenario.":::

## Clean up resources

After completing this tutorial, you can choose which resources you want to remove, depending on what you want to do next.

[!INCLUDE [digital-twins-cleanup-basic.md](../../includes/digital-twins-cleanup-basic.md)]

* If you want to continue using the Azure Digital Twins instance you set up in this article, but clear out some or all of its models, twins, and relationships, you can use the [az dt](/cli/azure/dt) CLI commands to delete the elements you want to remove.

    This option won't remove any of the other Azure resources created in this tutorial (IoT Hub, Azure Functions app, and so on). You can delete these individually using the [dt commands](/cli/azure/reference-index) appropriate for each resource type.

You may also want to delete the project folder from your local machine.

## Next steps

In this tutorial, you created an end-to-end scenario that shows Azure Digital Twins being driven by live device data.

Next, start looking at the concept documentation to learn more about elements you worked with in the tutorial:

> [!div class="nextstepaction"]
> [Custom models](concepts-models.md)
