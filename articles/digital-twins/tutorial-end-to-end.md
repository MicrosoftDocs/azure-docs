---
# Mandatory fields.
title: 'Tutorial: Connect an end-to-end solution'
titleSuffix: Azure Digital Twins
description: Tutorial to build out an end-to-end Azure Digital Twins solution that's driven by device data.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/15/2020
ms.topic: tutorial
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Tutorial: Build out an end-to-end solution

To set up a full end-to-end solution driven by live data from your environment, you can connect your Azure Digital Twins instance to other Azure services for management of devices and data.

In this tutorial, you will...
> [!div class="checklist"]
> * Set up an Azure Digital Twins instance
> * Learn about the sample building scenario and instantiate the pre-written components
> * Use an [Azure Functions](../azure-functions/functions-overview.md) app to route simulated telemetry from an [IoT Hub](../iot-hub/about-iot-hub.md) device into digital twin properties
> * Propagate changes through the **twin graph**, by processing digital twin notifications with Azure Functions, endpoints, and routes

[!INCLUDE [Azure Digital Twins tutorial: sample prerequisites](../../includes/digital-twins-tutorial-sample-prereqs.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment-h3.md)]

### Set up Cloud Shell session
[!INCLUDE [Cloud Shell for Azure Digital Twins](../../includes/digital-twins-cloud-shell.md)]

[!INCLUDE [Azure Digital Twins tutorial: configure the sample project](../../includes/digital-twins-tutorial-sample-configure.md)]

## Get started with the building scenario

The sample project used in this tutorial represents a real-world **building scenario**, containing a floor, a room, and a thermostat device. These components will be digitally represented in an Azure Digital Twins instance, which will then be connected to [IoT Hub](../iot-hub/about-iot-hub.md), [Event Grid](../event-grid/overview.md), and two [Azure functions](../azure-functions/functions-overview.md) to facilitate movement of data.

Below is a diagram representing the full scenario. 

You will first create the Azure Digital Twins instance (**section A** in the diagram), then set up the telemetry data flow into the digital twins (**arrow B**), then set up the data propagation through the twin graph (**arrow C**).

:::image type="content" source="media/tutorial-end-to-end/building-scenario.png" alt-text="Graphic of the full building scenario. Depicts data flowing from a device into IoT Hub, through an Azure function (arrow B) to an Azure Digital Twins instance (section A), then out through Event Grid to another Azure function for processing (arrow C)":::

To work through the scenario, you will interact with components of the pre-written sample app you downloaded earlier.

Here are the components implemented by the building scenario *AdtSampleApp* sample app:
* Device authentication 
* [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins/client) usage examples (found in *CommandLoop.cs*)
* Console interface to call the Azure Digital Twins API
* *SampleClientApp* - A sample Azure Digital Twins solution
* *SampleFunctionsApp* - An Azure Functions app that updates your Azure Digital Twins graph as a result of telemetry from IoT Hub and Azure Digital Twins events

### Instantiate the pre-created twin graph

First, you'll use the *AdtSampleApp* solution from the sample project to build the Azure Digital Twins piece of the end-to-end scenario (**section A**):

:::image type="content" source="media/tutorial-end-to-end/building-scenario-a.png" alt-text="An excerpt from the full building scenario graphic highlighting section A, the Azure Digital Twins instance":::

In your Visual Studio window where the _**AdtE2ESample**_ project is open, run the project with this button in the toolbar:

:::image type="content" source="media/tutorial-end-to-end/start-button-sample.png" alt-text="The Visual Studio start button (SampleClientApp project)":::

A console window will open, carry out authentication, and wait for a command. In this console, run the next command to instantiate the sample Azure Digital Twins solution.

> [!IMPORTANT]
> If you already have digital twins and relationships in your Azure Digital Twins instance, running this command will delete them and replace them with the twins and relationships for the sample scenario.

```cmd/sh
SetupBuildingScenario
```

The output of this command is a series of confirmation messages as three [**digital twins**](concepts-twins-graph.md) are created and connected in your Azure Digital Twins instance: a floor named *floor1*, a room named *room21*, and a temperature sensor named *thermostat67*. These digital twins represent the entities that would exist in a real-world environment.

They are connected via relationships into the following [**twin graph**](concepts-twins-graph.md). The twin graph represents the environment as a whole, including how the entities interact with and relate to each other.

:::image type="content" source="media/tutorial-end-to-end/building-scenario-graph.png" alt-text="A graph showing that floor1 contains room21, and room21 contains thermostat67" border="false":::

You can verify the twins that were created by running the following command, which queries the connected Azure Digital Twins instance for all the digital twins it contains:

```cmd/sh
Query
```

>[!TIP]
> This simplified method is provided as part of the _**AdtE2ESample**_ project. Outside the context of this sample code, you can query for all the twins in your instance at any time, using the [Query APIs](/rest/api/digital-twins/dataplane/query) or the [CLI commands](how-to-use-cli.md).
>
> Here is the full query body to get all digital twins in your instance:
> 
> :::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="GetAllTwins":::

After this, you can stop running the project. Keep the solution open in Visual Studio, though, as you'll continue using it throughout the tutorial.

## Set up the sample function app

The next step is setting up an [Azure Functions app](../azure-functions/functions-overview.md) that will be used throughout this tutorial to process data. The function app, *SampleFunctionsApp*, contains two functions:
* *ProcessHubToDTEvents*: processes incoming IoT Hub data and updates Azure Digital Twins accordingly
* *ProcessDTRoutedData*: processes data from digital twins, and updates the parent twins in Azure Digital Twins accordingly

In this section, you will publish the pre-written function app, and ensure the function app can access Azure Digital Twins by assigning it an Azure Active Directory (Azure AD) identity. Completing these steps will allow the rest of the tutorial to use the functions inside the function app. 

Back in your Visual Studio window where the _**AdtE2ESample**_ project is open, the function app is located in the _**SampleFunctionsApp**_ project file. You can view it in the *Solution Explorer* pane.

### Update dependencies

Before publishing the app, it's a good idea to make sure your dependencies are up to date, making sure you have the latest version of all the included packages.

In the *Solution Explorer* pane, expand _**SampleFunctionsApp** > Dependencies_. Right-select *Packages* and choose *Manage NuGet Packages...*.

:::image type="content" source="media/tutorial-end-to-end/update-dependencies-1.png" alt-text="Visual Studio: Manage NuGet Packages for the SampleFunctionsApp project" border="false":::

This will open the NuGet Package Manager. Select the *Updates* tab and if there are any packages to be updated, check the box to *Select all packages*. Then hit *Update*.

:::image type="content" source="media/tutorial-end-to-end/update-dependencies-2.png" alt-text="Visual Studio: Selecting to update all packages in the NuGet Package Manager":::

### Publish the app

Back in your Visual Studio window where the _**AdtE2ESample**_ project is open, locate the _**SampleFunctionsApp**_ project in the *Solution Explorer* pane.

[!INCLUDE [digital-twins-publish-azure-function.md](../../includes/digital-twins-publish-azure-function.md)]

For your function app to be able to access Azure Digital Twins, it will need to have permissions to access your Azure Digital Twins instance and the instance's host name. You'll configure these next.

### Configure permissions for the function app

There are two settings that need to be set for the function app to access your Azure Digital Twins instance. These can both be done via commands in the [Azure Cloud Shell](https://shell.azure.com). 

#### Assign access role

The first setting gives the function app the **Azure Digital Twins Data Owner** role in the Azure Digital Twins instance. This role is required for any user or function that wants to perform many data plane activities on the instance. You can read more about security and role assignments in [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md). 

1. Use the following command to see the details of the system-managed identity for the function. Take note of the **principalId** field in the output.

    ```azurecli-interactive	
    az functionapp identity show -g <your-resource-group> -n <your-App-Service-(function-app)-name>	
    ```

    >[!NOTE]
    > If the result is empty instead of showing details of an identity, create a new system-managed identity for the function using this command:
    > 
    >```azurecli-interactive	
    >az functionapp identity assign -g <your-resource-group> -n <your-App-Service-(function-app)-name>	
    >```
    >
    > The output will then display details of the identity, including the **principalId** value required for the next step. 

1. Use the **principalId** value in the following command to assign the function app's identity to the **Azure Digital Twins Data Owner** role for your Azure Digital Twins instance.

    ```azurecli-interactive	
    az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<principal-ID>" --role "Azure Digital Twins Data Owner"
    ```

The result of this command is outputted information about the role assignment you've created. The function app now has permissions to access data in your Azure Digital Twins instance.

#### Configure application settings

The second setting creates an **environment variable** for the function with the URL of your Azure Digital Twins instance. The function code will use this to refer to your instance. For more information about environment variables, see [*Manage your function app*](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal). 

Run the command below, filling in the placeholders with the details of your resources.

```azurecli-interactive
az functionapp config appsettings set -g <your-resource-group> -n <your-App-Service-(function-app)-name> --settings "ADT_SERVICE_URL=https://<your-Azure-Digital-Twins-instance-hostname>"
```

The output is the list of settings for the Azure Function, which should now contain an entry called **ADT_SERVICE_URL**.


## Process simulated telemetry from an IoT Hub device

An Azure Digital Twins graph is meant to be driven by telemetry from real devices. 

In this step, you will connect a simulated thermostat device registered in [IoT Hub](../iot-hub/about-iot-hub.md) to the digital twin that represents it in Azure Digital Twins. As the simulated device emits telemetry, the data will be directed through the *ProcessHubToDTEvents* Azure function that triggers a corresponding update in the digital twin. In this way, the digital twin stays up to date with the real device's data. In Azure Digital Twins, the process of directing events data from one place to another is called [**routing events**](concepts-route-events.md).

This happens in this part of the end-to-end scenario (**arrow B**):

:::image type="content" source="media/tutorial-end-to-end/building-scenario-b.png" alt-text="An excerpt from the full building scenario graphic highlighting arrow B, the elements before Azure Digital Twins: the device, IoT Hub, and first Azure function":::

Here are the actions you will complete to set up this device connection:
1. Create an IoT hub that will manage the simulated device
2. Connect the IoT hub to the appropriate Azure function by setting up an event subscription
3. Register the simulated device in IoT hub
4. Run the simulated device and generate telemetry
5. Query Azure Digital Twins to see the live results

### Create an IoT Hub instance

Azure Digital Twins is designed to work alongside [IoT Hub](../iot-hub/about-iot-hub.md), an Azure service for managing devices and their data. In this step, you will set up an IoT hub that will manage the sample device in this tutorial.

In Azure Cloud Shell, use this command to create a new IoT hub:

```azurecli-interactive
az iot hub create --name <name-for-your-IoT-hub> -g <your-resource-group> --sku S1
```

The output of this command is information about the IoT hub that was created.

Save the **name** that you gave to your IoT hub. You will use it later.

### Connect the IoT hub to the Azure function

Next, connect your IoT hub to the *ProcessHubToDTEvents* Azure function in the function app you published earlier, so that data can flow from the device in IoT Hub through the function, which updates Azure Digital Twins.

To do this, you'll create an **Event Subscription** on your IoT Hub, with the Azure function as an endpoint. This "subscribes" the function to events happening in IoT Hub.

In the [Azure portal](https://portal.azure.com/), navigate to your newly-created IoT hub by searching for its name in the top search bar. Select *Events* from the hub menu, and select *+ Event Subscription*.

:::image type="content" source="media/tutorial-end-to-end/event-subscription-1.png" alt-text="Azure portal: IoT Hub event subscription":::

This will bring up the *Create Event Subscription* page.

:::image type="content" source="media/tutorial-end-to-end/event-subscription-2.png" alt-text="Azure portal: create event subscription":::

Fill in the fields as follows (fields filled by default are not mentioned):
* *EVENT SUBSCRIPTION DETAILS* > **Name**: Give a name to your event subscription.
* *TOPIC DETAILS* > **System Topic Name**: Give a name to use for the system topic. 
* *EVENT TYPES* > **Filter to Event Types**: Select *Device Telemetry* from the menu options.
* *ENDPOINT DETAILS* > **Endpoint Type**: Select *Azure Function* from the menu options.
* *ENDPOINT DETAILS* > **Endpoint**: Hit the *Select an endpoint* link. This will open a *Select Azure Function* window:
    :::image type="content" source="media/tutorial-end-to-end/event-subscription-3.png" alt-text="Azure portal event subscription: select Azure function" border="false":::
    - Fill in your **Subscription**, **Resource group**, **Function app** and **Function** (*ProcessHubToDTEvents*). Some of these may auto-populate after selecting the subscription.
    - Hit **Confirm Selection**.

Back on the *Create Event Subscription* page, hit **Create**.

### Register the simulated device with IoT Hub 

This section creates a device representation in IoT Hub with the ID *thermostat67*. The simulated device will connect into this, and this is how telemetry events will go from the device into IoT Hub, where the subscribed Azure function from the previous step is listening, ready to pick up the events and continue processing.

In Azure Cloud Shell, create a device in IoT Hub with the following command:

```azurecli-interactive
az iot hub device-identity create --device-id thermostat67 --hub-name <your-IoT-hub-name> -g <your-resource-group>
```

The output is information about the device that was created.

### Configure and run the simulation

Next, configure the device simulator to send data to your IoT Hub instance.

Begin by getting the *IoT hub connection string* with this command:

```azurecli-interactive
az iot hub connection-string show -n <your-IoT-hub-name>
```

Then, get the *device connection string* with this command:

```azurecli-interactive
az iot hub device-identity connection-string show --device-id thermostat67 --hub-name <your-IoT-hub-name>
```

You'll plug these values into the device simulator code in your local project to connect the simulator into this IoT hub and IoT hub device.

In a new Visual Studio window, open (from the downloaded solution folder) _Device Simulator > **DeviceSimulator.sln**_.

>[!NOTE]
> You should now have two Visual Studio windows, one with _**DeviceSimulator.sln**_ and one from earlier with _**AdtE2ESample.sln**_.

From the *Solution Explorer* pane in this new Visual Studio window, select _DeviceSimulator/**AzureIoTHub.cs**_ to open it in the editing window. Change the following connection string values to the values you gathered above:

```csharp
iotHubConnectionString = <your-hub-connection-string>
deviceConnectionString = <your-device-connection-string>
```

Save the file.

Now, to see the results of the data simulation that you've set up, run the **DeviceSimulator** project with this button in the toolbar:

:::image type="content" source="media/tutorial-end-to-end/start-button-simulator.png" alt-text="The Visual Studio start button (DeviceSimulator project)":::

A console window will open and display simulated temperature telemetry messages. These are being sent to IoT Hub, where they are then picked up and processed by the Azure function.

:::image type="content" source="media/tutorial-end-to-end/console-simulator-telemetry.png" alt-text="Console output of the device simulator showing temperature telemetry being sent":::

You don't need to do anything else in this console, but leave it running while you complete the next steps.

### See the results in Azure Digital Twins

The *ProcessHubToDTEvents* function you published earlier listens to the IoT Hub data, and calls an Azure Digital Twins API to update the *Temperature* property on the *thermostat67* twin.

To see the data from the Azure Digital Twins side, go to your Visual Studio window where the _**AdtE2ESample**_ project is open and run the project.

In the project console window that opens, run the following command to get the temperatures being reported by the digital twin *thermostat67*:

```cmd
ObserveProperties thermostat67 Temperature
```

You should see the live updated temperatures *from your Azure Digital Twins instance* being logged to the console every two seconds.

>[!NOTE]
> It may take a few seconds for the data from the device to propagate through to the twin. The first few temperature readings may show as 0 before data begins to arrive.

:::image type="content" source="media/tutorial-end-to-end/console-digital-twins-telemetry.png" alt-text="Console output showing log of temperature messages from digital twin thermostat67":::

Once you've verified this is working successfully, you can stop running both projects. Keep the Visual Studio windows open, as you'll continue using them in the rest of the tutorial.

## Propagate Azure Digital Twins events through the graph

So far in this tutorial, you've seen how Azure Digital Twins can be updated from external device data. Next, you'll see how changes to one digital twin can propagate through the Azure Digital Twins graph—in other words, how to update twins from service-internal data.

To do this, you'll use the *ProcessDTRoutedData* Azure function to update a *Room* twin when the connected *Thermostat* twin is updated. This happens in this part of the end-to-end scenario (**arrow C**):

:::image type="content" source="media/tutorial-end-to-end/building-scenario-c.png" alt-text="An excerpt from the full building scenario graphic highlighting arrow C, the elements after Azure Digital Twins: the Event Grid and second Azure function":::

Here are the actions you will complete to set up this data flow:
1. Create an Event Grid endpoint in Azure Digital Twins that connects the instance to Event Grid
2. Set up a route within Azure Digital Twins to send twin property change events to the endpoint
3. Deploy an Azure Functions app that listens (through [Event Grid](../event-grid/overview.md)) on the endpoint, and updates other twins accordingly
4. Run the simulated device and query Azure Digital Twins to see the live results

### Set up endpoint

[Event Grid](../event-grid/overview.md) is an Azure service that helps you route and deliver events coming from Azure Services to other places within Azure. You can create an [event grid topic](../event-grid/concepts.md) to collect certain events from a source, and then subscribers can listen on the topic to receive the events as they come through.

In this section, you create an event grid topic, and then create an endpoint within Azure Digital Twins that points (sends events) to that topic. 

In Azure Cloud Shell, run the following command to create an event grid topic:

```azurecli-interactive
az eventgrid topic create -g <your-resource-group> --name <name-for-your-event-grid-topic> -l <region>
```

> [!TIP]
> To output a list of Azure region names that can be passed into commands in the Azure CLI, run this command:
> ```azurecli-interactive
> az account list-locations -o table
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

:::image type="content" source="media/tutorial-end-to-end/output-endpoints.png" alt-text="Result of the endpoint query, showing the endpoint with a provisioningState of Succeeded":::

Save the names that you gave to your **event grid topic** and your Event Grid **endpoint** in Azure Digital Twins. You will use them later.

### Set up route

Next, create an Azure Digital Twins route that sends events to the Event Grid endpoint you just created.

```azurecli-interactive
az dt route create --dt-name <your-Azure-Digital-Twins-instance> --endpoint-name <your-Azure-Digital-Twins-endpoint> --route-name <name-for-your-Azure-Digital-Twins-route>
```

The output from this command is some information about the route you've created.

>[!NOTE]
>Endpoints (from the previous step) must be finished provisioning before you can set up an event route that uses them. If the route creation fails because the endpoints aren't ready, wait a few minutes and then try again.

#### Connect the function to Event Grid

Next, subscribe the *ProcessDTRoutedData* Azure function to the event grid topic you created earlier, so that telemetry data can flow from the *thermostat67* twin through the event grid topic to the function, which goes back into Azure Digital Twins and updates the *room21* twin accordingly.

To do this, you'll create an **Event Grid subscription** that sends data from the **event grid topic** that you created earlier to your *ProcessDTRoutedData* Azure function.

In the [Azure portal](https://portal.azure.com/), navigate to your event grid topic by searching for its name in the top search bar. Select *+ Event Subscription*.

:::image type="content" source="media/tutorial-end-to-end/event-subscription-1b.png" alt-text="Azure portal: Event Grid event subscription":::

The steps to create this event subscription are similar to when you subscribed the first Azure function to IoT Hub earlier in this tutorial. This time, you don't need to specify *Device Telemetry* as the event type to listen for, and you'll connect to a different Azure function.

On the *Create Event Subscription* page, fill in the fields as follows (fields filled by default are not mentioned):
* *EVENT SUBSCRIPTION DETAILS* > **Name**: Give a name to your event subscription.
* *ENDPOINT DETAILS* > **Endpoint Type**: Select *Azure Function* from the menu options.
* *ENDPOINT DETAILS* > **Endpoint**: Hit the *Select an endpoint* link. This will open a *Select Azure Function* window:
    - Fill in your **Subscription**, **Resource group**, **Function app** and **Function** (*ProcessDTRoutedData*). Some of these may auto-populate after selecting the subscription.
    - Hit **Confirm Selection**.

Back on the *Create Event Subscription* page, hit **Create**.

### Run the simulation and see the results

Now you can run the device simulator to kick off the new event flow you've set up. Go to your Visual Studio window where the _**DeviceSimulator**_ project is open, and run the project.

Like when you ran the device simulator earlier, a console window will open and display simulated temperature telemetry messages. These events are going through the flow you set up earlier to update the *thermostat67* twin, and then going through the flow you set up recently to update the *room21* twin to match.

:::image type="content" source="media/tutorial-end-to-end/console-simulator-telemetry.png" alt-text="Console output of the device simulator showing temperature telemetry being sent":::

You don't need to do anything else in this console, but leave it running while you complete the next steps.

To see the data from the Azure Digital Twins side, go to your Visual Studio window where the _**AdtE2ESample**_ project is open, and run the project.

In the project console window that opens, run the following command to get the temperatures being reported by **both** the digital twin *thermostat67* and the digital twin *room21*.

```cmd
ObserveProperties thermostat67 Temperature room21 Temperature
```

You should see the live updated temperatures *from your Azure Digital Twins instance* being logged to the console every two seconds. Notice that the temperature for *room21* is being updated to match the updates to *thermostat67*.

:::image type="content" source="media/tutorial-end-to-end/console-digital-twins-telemetry-b.png" alt-text="Console output showing log of temperature messages, from a thermostat and a room":::

Once you've verified this is working successfully, you can stop running both projects. You can also close the Visual Studio windows, as the tutorial is now complete.

## Review

Here is a review of the scenario that you built out in this tutorial.

1. An Azure Digital Twins instance digitally represents a floor, a room, and a thermostat (represented by **section A** in the diagram below)
2. Simulated device telemetry is sent to IoT Hub, where the *ProcessHubToDTEvents* Azure function is listening for telemetry events. The *ProcessHubToDTEvents* Azure function uses the information in these events to set the *Temperature* property on *thermostat67* (**arrow B** in the diagram).
3. Property change events in Azure Digital Twins are routed to an event grid topic, where the *ProcessDTRoutedData* Azure function is listening for events. The *ProcessDTRoutedData* Azure function uses the information in these events to set the *Temperature* property on *room21* (**arrow C** in the diagram).

:::image type="content" source="media/tutorial-end-to-end/building-scenario.png" alt-text="Graphic of the full building scenario. Depicts data flowing from a device into IoT Hub, through an Azure function (arrow B) to an Azure Digital Twins instance (section A), then out through Event Grid to another Azure function for processing (arrow C)":::

## Clean up resources

After completing this tutorial, you can choose which resources you'd like to remove, depending on what you'd like to do next.

[!INCLUDE [digital-twins-cleanup-basic.md](../../includes/digital-twins-cleanup-basic.md)]

* **If you'd like to continue using the Azure Digital Twins instance you set up in this article, but clear out some or all of its models, twins, and relationships**, you can use the [az dt](/cli/azure/dt) CLI commands in an [Azure Cloud Shell](https://shell.azure.com) window to delete the elements you'd like to remove.

    This option will not remove any of the other Azure resources created in this tutorial (IoT Hub, Azure Functions app, etc.). You can delete these individually using the [dt commands](/cli/azure/reference-index) appropriate for each resource type.

You may also want to delete the project folder from your local machine.

## Next steps

In this tutorial, you created an end-to-end scenario that shows Azure Digital Twins being driven by live device data.

Next, start looking at the concept documentation to learn more about elements you worked with in the tutorial:

> [!div class="nextstepaction"]
> [*Concepts: Custom models*](concepts-models.md)