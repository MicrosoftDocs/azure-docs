---
# Mandatory fields.
title: Build an end-to-end solution
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

# Build out an end-to-end solution

To set up a full end-to-end solution driven by live data from your environment, you can connect your Azure Digital Twins instance to other Azure services for management of devices and data.

In this tutorial, you will...
* Set up an Azure Digital Twins instance
* Learn about the sample building scenario and instantiate the pre-written components
* Use an [Azure Functions](../azure-functions/functions-overview.md) app to route simulated telemetry from an [IoT Hub](../iot-hub/about-iot-hub.md) device into digital twin properties
* Propagate changes through the twin graph, by processing digital twin notifications with Azure Functions, endpoints, and routes

The tutorial is driven by a sample project written in C#. Get the sample project on your machine by [downloading the Azure Digital Twins samples repository as a ZIP file](https://github.com/Azure-Samples/digital-twins-samples/archive/master.zip).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Azure Digital Twins setup steps: instance creation and authentication](../../includes/digital-twins-setup-1.md)]

#### Register your application

[!INCLUDE [Azure Digital Twins setup steps: client app registration](../../includes/digital-twins-setup-2.md)]

[!INCLUDE [Azure Digital Twins setup steps: client app configuration](../../includes/digital-twins-setup-3.md)]

## Get started with the building scenario

The sample project used in this tutorial represents a real-world **building scenario**, containing a floor, a room, and a thermostat device. These components will be digitally represented in an Azure Digital Twins instance, which will then be connected to [IoT Hub](../iot-hub/about-iot-hub.md), [Event Grid](../event-grid/overview.md), and two [Azure functions](../azure-functions/functions-overview.md) to facilitate movement of and responses to data.

Below is a diagram representing the full scenario. 

You will first create the Azure Digital Twins instance (**section A** in the diagram), then set up the telemetry data flow into the digital twins (**arrow B**), then set up the data propagation through the twin graph (**arrow C**).

:::image type="content" source="media/tutorial/building-scenario.png" alt-text="Graphic of the full building scenario. Depicts data flowing from a device into IoT Hub, through an Azure function (arrow B) to an Azure Digital Twins instance (section A), then out through Event Grid to another Azure function for processing (arrow C)":::

To work through the scenario, you will interact with components of the pre-written sample app you downloaded earlier.

Here are the components implemented by the sample app:
* Device authentication 
* Pre-generated AutoRest SDK
* SDK usage examples (found in *CommandLoop.cs*)
* Console interface to call the Azure Digital Twins API
* *BuildingScenario* - A sample Azure Digital Twins solution
* *HubToDT* - An Azure Functions app to update your Azure Digital Twins graph as a result of telemetry from IoT Hub
* *DTRoutedData* - An Azure Functions app to update your Azure Digital Twins graph according to Azure Digital Twins data 

The sample project also contains an interactive authorization component. Every time you start up the project, a browser window will open, prompting you to log in with your Azure account.

### Instantiate the pre-created twin graph

First, you'll use the *BuildingScenario* solution from the sample project to build the Azure Digital Twins piece of the end-to-end scenario (**section A**):

:::image type="content" source="media/tutorial/building-scenario-a.png" alt-text="An excerpt from the full building scenario graphic highlighting section A, the Azure Digital Twins instance":::

From the downloaded solution folder, open _DigitalTwinsMetadata/**DigitalTwinsSample.sln**_ in Visual Studio. Run the project with this button in the toolbar:

:::image type="content" source="media/tutorial/start-button-sample.png" alt-text="The Visual Studio start button (DigitalTwinsSample project)":::

A console window will open, carry out authentication, and wait for a command. In this console, run the next command to instantiate the sample Azure Digital Twins solution.

> [!IMPORTANT]
> If you already have digital twins and relationships in your Azure Digital Twins instance, running this command will delete them and replace them with the twins and relationships for the sample scenario.

The command is: `buildingScenario`.

The output of this command is a series of confirmation messages as three twins are created and connected in your Azure Digital Twins instance: a floor named *floor1*, a room named *room21*, and a temperature sensor named *thermostat67*. They are connected into the following graph:

:::image type="content" source="media/tutorial/building-scenario-graph.png" alt-text="A graph showing that floor1 contains room21, and room21 contains thermostat67" border="false":::

You can verify the twins that were created by running the following command, which queries the connected Azure Digital Twins instance for all the digital twins it contains:

`queryTwins`

After this, you can stop running the project. Keep the solution open in Visual Studio, though, as you'll continue using it throughout the tutorial.

## Process simulated telemetry from an IoT Hub device

An Azure Digital Twins graph is meant to be driven by telemetry from real devices. 

In this step, you will connect a simulated thermostat device registered in [IoT Hub](../iot-hub/about-iot-hub.md) to the digital twin that represents it in Azure Digital Twins. As the simulated device emits telemetry, the data will be directed through an [Azure Functions](../azure-functions/functions-overview.md) app that triggers a corresponding update in the digital twin. In this way, the digital twin stays up to date with the real device's data.

This happens in this part of the end-to-end scenario (**arrow B**):

:::image type="content" source="media/tutorial/building-scenario-b.png" alt-text="An excerpt from the full building scenario graphic highlighting arrow B, the elements before Azure Digital Twins: the device, IoT Hub, and first Azure function":::

Here are the actions you will complete to set up this device connection:
1. Deploy the pre-written Azure function that will update Azure Digital Twins with incoming data
2. Ensure the function app can access Azure Digital Twins by assigning it an Azure Active Directory (AAD) identity
3. Create an IoT hub that will manage the simulated device
4. Connect the IoT hub to the Azure Functions app by setting up an event subscription
5. Register the simulated device in IoT hub
6. Run the simulated device and generate telemetry
7. Query Azure Digital Twins to see the live results

### Publish the sample function app

The first part of this step is setting up and publishing an [Azure function](../azure-functions/functions-overview.md) that will be used to process IoT Hub data and update Azure Digital Twins accordingly. This tutorial uses the pre-written *HubtToDT* solution from the sample project, which calls an Azure Digital Twins API to update the *Temperature* property on the *thermostat67* twin.

To configure the function, you will need the *resourceGroup* and *hostName* of your Azure Digital Twins instance that you noted earlier. You can also run this command in Azure Cloud Shell to see them outputted again, along with other properties of the instance: `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

Go to your Visual Studio window where the _**DigitalTwinsSample**_ project is open.
From the *Solution Explorer* pane, select _HubToDT/**ProcessHubToDTEvents.cs**_ to open it in the editing window. Change the value of `AdtInstanceUrl` to your Azure Digital Twins instance's *hostName*. 

```csharp
const string AdtInstanceUrl = "https://<your-Azure-Digital-Twins-instance-hostName>"
```

Save the file. Remember the *hostName* value, as you will use it again later in this tutorial.

In the Solution Explorer menu, right-select the **HubToDT project file** and hit **Publish**.

:::image type="content" source="media/tutorial/publish-azure-function-1.png" alt-text="Visual Studio: publish project":::

In the *Pick a publish target* page that follows, leave the default selections and hit **Create Profile**.

:::image type="content" source="media/tutorial/publish-azure-function-2.png" alt-text="Azure function in Visual Studio: create profile":::

On the *App Service - Create New* page, fill in the fields as follows:
* **Name** is the name of the consumption plan that Azure will use to host your Azure Functions app. This will also become the name of the function app that holds your actual function. You can choose your own unique value or leave the default suggestion.
* Make sure the **Subscription** matches the subscription you want to use 
* Change the **Resource group** to your instance's *resourceGroup*
* Select the **Location** that matches the location of your resource group
* Create a new **Azure Storage** resource using the *New...* link. Use the default values and hit "Ok".

:::image type="content" source="media/tutorial/publish-azure-function-3.png" alt-text="Azure function in Visual Studio: Create new App Service menu with fields completed as described above":::

Before you move on from this screen, take note of your *Azure Storage* account name and your *App Service* (also function app) name. You will use these later.

Then, select **Create**.

On the *Publish* page that follows, check that all the information looks correct and select **Publish**.

:::image type="content" source="media/tutorial/publish-azure-function-4.png" alt-text="Azure function in Visual Studio: publish":::

> [!NOTE]
> You may see a popup like this: 
> :::image type="content" source="media/tutorial/publish-azure-function-5.png" alt-text="Azure function in Visual Studio: publish credentials" border="false":::
> If so, select **Attempt to retrieve credentials from Azure** and **Save**.

### Assign permissions to the function app

To enable the function app to access Azure Digital Twins, the next step is to assign the app a system-managed AAD identity, and give this identity *owner* permissions in the Azure Digital Twins instance.

In Azure Cloud Shell, use the following command to create the system-managed identity. Take note of the *principalId* field in the output.

```azurecli-interactive
az functionapp identity assign -g <your-resource-group> -n <your-HubToDT-function>
```

Use the *principalId* value in the following command to assign the function app's identity to an AAD *owner* role:

```azurecli
az dt rbac assign-role --assignee <principal-ID> --dt-name <your-Azure-Digital-Twins-instance> --role owner
```

The result of this command is outputted information about the role assignment you've created. The function app now has permissions to access your Azure Digital Twins instance.

### Create an IoT Hub instance

Azure Digital Twins is designed to work alongside [IoT Hub](../iot-hub/about-iot-hub.md), an Azure service for managing devices and their data. In this step, you will set up an IoT hub that will manage the sample device in this tutorial.

In Azure Cloud Shell, use this command to create a new IoT hub:

```azurecli-interactive
az iot hub create --name <name-for-your-IoT-hub> -g <your-resource-group> --sku S1
```

The output of this command is information about the IoT hub that was created.

Save the name that you gave to your IoT hub. You will use it later.

### Connect the IoT hub to the Azure function

Next, connect your IoT hub to the Azure function you made earlier, so that data can flow from the device in IoT Hub through the function, which updates Azure Digital Twins.

To do this, you'll create an **Event Subscription** on your IoT Hub, with the Azure function as an endpoint. This "subscribes" the function to events happening in IoT Hub.

In the [Azure portal](https://ms.portal.azure.com/), navigate to your newly-created IoT hub by searching for its name in the top search bar. Select *Events* from the hub menu, and select *+ Event Subscription*.

:::image type="content" source="media/tutorial/event-subscription-1.png" alt-text="Azure portal: IoT Hub event subscription":::

This will bring up the *Create Event Subscription* page.

:::image type="content" source="media/tutorial/event-subscription-2.png" alt-text="Azure portal: create event subscription":::

Fill in the fields as follows:
* *EVENT SUBSCRIPTION DETAILS* > **Name**: Give a name to your event subscription.
* *EVENT TYPES* > **Filter to Event Types**: Select *Device Telemetry* from the menu options.
* *ENDPOINT DETAILS* > **Endpoint Type**: Select *Azure Function* from the menu options.
* *ENDPOINT DETAILS* > **Endpoint**: Hit the *Select an endpoint* link. This will open a *Select Azure Function* window:
    :::image type="content" source="media/tutorial/event-subscription-3.png" alt-text="Azure portal event subscription: select Azure function" border="false":::
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

```azurecli
az iot hub show-connection-string -n <your-IoT-hub-name>
```

Then, get the *device connection string* with this command:

```azurecli
az iot hub device-identity show-connection-string --device-id thermostat67 --hub-name <your-IoT-hub-name>
```

You'll plug these values into the device simulator code in your local project to connect the simulator into this IoT hub and IoT hub device.

In a new Visual Studio window, open _Device Simulator > **DeviceSimulator.sln**_. 
>[!NOTE]
> You should now have two Visual Studio windows, one with _**DeviceSimulator.sln**_ and one from earlier with _**DigitalTwinsSample.sln**_.

From the *Solution Explorer* pane, select _DeviceSimulator/**AzureIoTHub.cs**_ to open it in the editing window. Change the following connection string values to the values you gathered above:

```csharp
connectionString = <Iot-hub-connection-string>
deviceConnectionString = <device-connection-string>
```

Save the file.

Now, to see the results of the data simulation that you've set up, run the **DeviceSimulator** project with this button in the toolbar:

:::image type="content" source="media/tutorial/start-button-simulator.png" alt-text="The Visual Studio start button (DeviceSimulator project)":::

A console window will open and display simulated temperature telemetry messages. These are being sent to IoT Hub, where they are then picked up and processed by the Azure function.

:::image type="content" source="media/tutorial/console-simulator-telemetry.png" alt-text="Console output of the device simulator showing temperature telemetry being sent":::

You don't need to do anything else in this console, but leave it running while you complete the next steps.

### See the results in Azure Digital Twins

The Azure function published earlier listens to the IoT Hub data and sends it on to Azure Digital Twins.

To see the data from the Azure Digital Twins side, go to your Visual Studio window where the _**DigitalTwinsSample**_ project is open and run the project.

In the project console window that opens, run the following command to get the temperatures being reported by the digital twin *thermostat67*:

```cmd
cycleGetTwinById thermostat67
```

You should see the live updated temperatures *from your Azure Digital Twins instance* being logged to the console every 10 seconds.

:::image type="content" source="media/tutorial/console-digital-twins-telemetry.png" alt-text="Console output showing log of temperature messages from digital twin thermostat67":::

Once you've verified this is working successfully, you can stop running both projects. Keep the Visual Studio windows open, as you'll continue using them in the rest of the tutorial.

## Propagate Azure Digital Twins events through the graph

So far in this tutorial, you've seen how Azure Digital Twins can be updated from external device data. Next, you'll see how changes to one digital twin can propagate through the Azure Digital Twins graph—in other words, how to update twins from service-internal data.

To do this, you'll deploy an [Azure Functions](../azure-functions/functions-overview.md) app that updates a *Room* twin when the connected *Thermostat* twin is updated. This happens in this part of the end-to-end scenario (**arrow C**):

:::image type="content" source="media/tutorial/building-scenario-c.png" alt-text="An excerpt from the full building scenario graphic highlighting arrow C, the elements after Azure Digital Twins: the Event Grid and second Azure function":::

Here are the actions you will complete to set up this data flow:
1. Create an Azure Digital Twins endpoint that connects the instance to Event Grid
2. Set up a route within Azure Digital Twins to send twin property change events to the endpoint
3. Deploy an Azure Functions app that listens (through [Event Grid](../event-grid/overview.md)) on the endpoint, and updates other twins accordingly
4. Run the simulated device and query Azure Digital Twins to see the live results

### Set up endpoint

[Event Grid](../event-grid/overview.md) is an Azure service that helps you route and deliver events coming from Azure Services to other places within Azure. You can create an [event grid topic](../event-grid/concepts.md) to collect certain events from a source, and then subscribers can listen on the topic to receive the events as they come through.

In this section, you create an event grid topic, and then create an endpoint within Azure Digital Twins that points (sends events) to that topic. 

In Azure Cloud Shell, run the following command to create an event grid topic:

```azurecli-interactive
az eventgrid topic create -g <your-resource-group> --name <name-for-your-event-grid-topic> -l westcentralus
```

The output from this command is information about the event grid topic you've created.

Next, create an Azure Digital Twins endpoint pointing to your event grid topic. Use the command below, filling in the placeholder fields as necessary:

```azurecli
az dt endpoint create eventgrid --dt-name <your-Azure-Digital-Twins-instance> --eventgrid-resource-group <your-resource-group> --eventgrid-topic <your-event-grid-topic> --endpoint-name <name-for-your-Azure-Digital-Twins-endpoint>
```

The output from this command is information about the endpoint you've created.

You can also verify that the endpoint creation succeeded by running the following command to query your Azure Digital Twins instance for this endpoint:

```azurecli
az dt endpoint show --dt-name <your-Azure-Digital-Twins-instance> --endpoint-name <your-Azure-Digital-Twins-endpoint> 
```

Look for the `provisioningState` field in the output, and check that the value is "Succeeded".

:::image type="content" source="media/tutorial/output-endpoints.png" alt-text="Result of the endpoint query, showing the endpoint with a provisioningState of Succeeded":::

Save the names that you gave to your event grid topic and your Azure Digital Twins endpoint. You will use them later.

### Set up route

Next, create an Azure Digital Twins route that sends events to the Azure Digital Twins endpoint you just created.

```azurecli
az dt route create --dt-name <your-Azure-Digital-Twins-instance> --endpoint-name <your-Azure-Digital-Twins-endpoint> --route-name <name-for-your-Azure-Digital-Twins-route>
```

The output from this command is some information about the route you've created.

### Deploy the Azure Functions app

This section publishes an [Azure Functions](../azure-functions/functions-overview.md) app containing a pre-written Azure function called **DTRoutedData**. The function app will be connected to your event grid topic at the end of the flow you set up in the previous step, and when it receives a telemetry event, it will call an Azure Digital Twins API to update the *Temperature* field on the *room21* twin accordingly.

Go to your Visual Studio window where the _**DigitalTwinsSample**_ project is open. Open _*DTRoutedData > **ProcessDTRoutedData.cs**_ in the editing window, and change the value of `AdtInstanceUrl` to your Azure Digital Twins instance's *hostName*. 

```csharp
const string AdtInstanceUrl = "https://<your-Azure-Digital-Twins-instance-hostName>"
```

Save the file.

In the Solution Explorer menu, right-select the *ProcessDTRoutedData* project and hit **Publish**. 

The steps to publish this function are similar to when you published the first Azure function earlier in this tutorial; the only difference is that you do not need to create a new Azure Storage resource this time, since you can reuse the one you created for the first function.

Here are the publish steps again:

In the *Pick a publish target* page, leave the default selections and hit **Create Profile**.

On the *App Service - Create New* page, fill in the fields as follows:
* **Name** is the name of the consumption plan that Azure will use to host your Azure Functions app. This will also become the name of the function app that holds your actual function. You can choose your own unique value or leave the default suggestion.
* Make sure the **Subscription** matches the subscription you want to use 
* Change the **Resource group** to your instance's *resourceGroup*
* Select the **Location** that matches the location of your resource group
* For **Azure Storage**, you do not need to create a new resource this time. Select the same storage resource you created when publishing the first Azure function earlier in the tutorial.

Then, select **Create**.

On the *Publish* page that follows, check that all the information looks correct and select **Publish**.

#### Connect the function to Event Grid

Next, subscribe your Azure Function to the event grid topic you created earlier, so that telemetry data can flow from the *thermostat67* twin through the event grid topic to the function, which goes back into Azure Digital Twins and updates the *room21* twin accordingly.

To do this, you'll create an **Event Grid subscription** from your event grid topic to your *ProcessDTRoutedData* Azure function as an endpoint.

In the [Azure portal](https://ms.portal.azure.com/), navigate to your event grid topic by searching for its name in the top search bar. Select *+ Event Subscription*.

:::image type="content" source="media/tutorial/event-subscription-1b.png" alt-text="Azure portal: Event Grid event subscription":::

The steps to create this event subscription are similar to when you subscribed the first Azure Function to IoT Hub earlier in this tutorial. The difference is that this time you don't need to specify *Device Telemetry* as the event type to listen for, and you'll connect to a different Azure function.

Here are the subscription steps again:

On the *Create Event Subscription* page, fill in the fields as follows:
* *EVENT SUBSCRIPTION DETAILS* > **Name**: Give a name to your event subscription.
* *ENDPOINT DETAILS* > **Endpoint Type**: Select *Azure Function* from the menu options.
* *ENDPOINT DETAILS* > **Endpoint**: Hit the *Select an endpoint* link. This will open a *Select Azure Function* window:
    - Fill in your **Subscription**, **Resource group**, **Function app** and **Function** (*ProcessDTRoutedData*). Some of these may auto-populate after selecting the subscription.
    - Hit **Confirm Selection**.

Back on the *Create Event Subscription* page, hit **Create**.

### Run the simulation and see the results

Now you can run the device simulator to kick off the new event flow you've set up. Go to your Visual Studio window where the _**DeviceSimulator**_ project is open, and run the project.

Like when you ran the device simulator earlier, a console window will open and display simulated temperature telemetry messages. These events are going through the flow you set up earlier to update the *thermostat67* twin, and then going through the flow you set up recently to update the *room21* twin to match.

:::image type="content" source="media/tutorial/console-simulator-telemetry.png" alt-text="Console output of the device simulator showing temperature telemetry being sent":::

You don't need to do anything else in this console, but leave it running while you complete the next steps.

To see the data from the Azure Digital Twins side, go to your Visual Studio window where the _**DigitalTwinsSample**_ project is open, and run the project.

In the project console window that opens, run the following command to get the temperatures being reported by **both** the digital twin *thermostat67* and the digital twin *room21*.

```cmd
cycleGetTwinById thermostat67 room21
```

You should see the live updated temperatures *from your Azure Digital Twins instance* being logged to the console every 10 seconds. Notice that the temperature for *room21* is being updated to match the updates to *thermostat67*.

:::image type="content" source="media/tutorial/console-digital-twins-telemetry-b.png" alt-text="Console output showing log of temperature messages, from a thermostat and a room":::

Once you've verified this is working successfully, you can stop running both projects. You can also close the Visual Studio windows, as the tutorial is now complete.

## Review

Here is a review of the scenario that you built out in this tutorial.

1. An Azure Digital Twins instance digitally represents a floor, a room, and a thermostat (represented by **section A** in the diagram below)
2. Simulated device telemetry is sent to IoT Hub, where the *HubToDT* Azure function is listening for telemetry events. The *HubToDT* Azure function uses the information in these events to set the *Temperature* property on *thermostat67* (**arrow B** in the diagram).
3. Property change events in Azure Digital Twins are routed to an event grid topic, where the *ProcessDTRoutedData* Azure Function is listening for events. The *ProcessDTRoutedData* Azure function uses the information in these events to set the *Temperature* property on *room21* (**arrow C** in the diagram).

:::image type="content" source="media/tutorial/building-scenario.png" alt-text="Graphic of the full building scenario. Depicts data flowing from a device into IoT Hub, through an Azure function (arrow B) to an Azure Digital Twins instance (section A), then out through Event Grid to another Azure function for processing (arrow C)":::

## Clean up resources

If you no longer need the resources created in this tutorial, follow these steps to delete them. 

Using the Azure Cloud Shell, you can delete all Azure resources in a resource group with the [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-delete) command. This removes the resource group; the Azure Digital Twins instance; the IoT hub and the hub device registration; the event grid topic and associated subscriptions; and both Azure Functions apps, including associated resources like storage.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. 

```azurecli-interactive
az group delete --name <your-resource-group>
```

Next, delete the AAD app registration you created for your client app with this command:

```azurecli
az ad app delete --id <your-application-ID>
```

Finally, delete the project sample folder you downloaded from your local machine.

## Next steps

In this tutorial, you created an end-to-end scenario that shows Azure Digital Twins being driven by live device data.

Next, visit the concept documentation to learn more about the elements you worked with in the tutorial:
* [Concepts: Twin models](concepts-models.md)
* [Concepts: Digital twins and the twin graph](concepts-twins-graph.md)
* [Concepts: Azure Digital Twins query language](concepts-query-language.md)