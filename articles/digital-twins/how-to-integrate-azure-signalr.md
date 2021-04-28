---
# Mandatory fields.
title: Integrate with Azure SignalR Service
titleSuffix: Azure Digital Twins
description: See how to stream Azure Digital Twins telemetry to clients using Azure SignalR
author: dejimarquis
ms.author: aymarqui # Microsoft employees only
ms.date: 02/12/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Integrate Azure Digital Twins with Azure SignalR Service

In this article, you'll learn how to integrate Azure Digital Twins with [Azure SignalR Service](../azure-signalr/signalr-overview.md).

The solution described in this article allows you to push digital twin telemetry data to connected clients, such as a single webpage or a mobile application. As a result, clients are updated with real-time metrics and status from IoT devices, without the need to poll the server or submit new HTTP requests for updates.

## Prerequisites

Here are the prerequisites you should complete before proceeding:

* Before integrating your solution with Azure SignalR Service in this article, you should complete the Azure Digital Twins [_**Tutorial: Connect an end-to-end solution**_](tutorial-end-to-end.md), because this how-to article builds on top of it. The tutorial walks you through setting up an Azure Digital Twins instance that works with a virtual IoT device to trigger digital twin updates. This how-to article will connect those updates to a sample web app using Azure SignalR Service.

* You'll need the following values from the tutorial:
  - Event grid topic
  - Resource group
  - App service/function app name
    
* You'll need [**Node.js**](https://nodejs.org/) installed on your machine.

You should also go ahead and sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

## Solution architecture

You'll be attaching Azure SignalR Service to Azure Digital Twins through the path below. Sections A, B, and C in the diagram are taken from the architecture diagram of the [end-to-end tutorial prerequisite](tutorial-end-to-end.md). In this how-to article, you will build section D on the existing architecture.

:::image type="content" source="media/how-to-integrate-azure-signalr/signalr-integration-topology.png" alt-text="A view of Azure services in an end-to-end scenario. Depicts data flowing from a device into IoT Hub, through an Azure function (arrow B) to an Azure Digital Twins instance (section A), then out through Event Grid to another Azure function for processing (arrow C). Section D shows data flowing from the same Event Grid in arrow C out to an Azure Function labeled 'broadcast'. 'broadcast' communicates with another Azure function labeled 'negotiate', and both 'broadcast' and 'negotiate' communicate with computer devices." lightbox="media/how-to-integrate-azure-signalr/signalr-integration-topology.png":::

## Download the sample applications

First, download the required sample apps. You will need both of the following:
* [**Azure Digital Twins end-to-end samples**](/samples/azure-samples/digital-twins-samples/digital-twins-samples/): This sample contains an *AdtSampleApp* that holds two Azure functions for moving data around an Azure Digital Twins instance (you can learn about this scenario in more detail in [*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md)). It also contains a *DeviceSimulator* sample application that simulates an IoT device, generating a new temperature value every second.
    - If you haven't already downloaded the sample as part of the tutorial in [*Prerequisites*](#prerequisites), navigate to the sample [link](/samples/azure-samples/digital-twins-samples/digital-twins-samples/) and select the *Browse code* button underneath the title. This will take you to the GitHub repo for the samples, which you can download as a *.ZIP* by selecting the *Code* button and *Download ZIP*.

        :::image type="content" source="media/includes/download-repo-zip.png" alt-text="View of the digital-twins-samples repo on GitHub. The Code button is selected, producing a small dialog box where the Download ZIP button is highlighted." lightbox="media/includes/download-repo-zip.png":::

    This will download a copy of the sample repo to your machine, as **digital-twins-samples-master.zip**. Unzip the folder.
* [**SignalR integration web app sample**](/samples/azure-samples/digitaltwins-signalr-webapp-sample/digital-twins-samples/): This is a sample React web app that will consume Azure Digital Twins telemetry data from an Azure SignalR Service.
    -  Navigate to the sample link and use the same download process to download a copy of the sample to your machine, as _**digitaltwins-signalr-webapp-sample-main.zip**_. Unzip the folder.

[!INCLUDE [Create instance](../azure-signalr/includes/signalr-quickstart-create-instance.md)]

Leave the browser window open to the Azure portal, as you'll use it again in the next section.

## Publish and configure the Azure Functions app

In this section, you will set up two Azure functions:
* **negotiate** - A HTTP trigger function. It uses the *SignalRConnectionInfo* input binding to generate and return valid connection information.
* **broadcast** - An [Event Grid](../event-grid/overview.md) trigger function. It receives Azure Digital Twins telemetry data through the event grid, and uses the output binding of the *SignalR* instance you created in the previous step to broadcast the message to all connected client applications.

Start Visual Studio (or another code editor of your choice), and open the code solution in the *digital-twins-samples-master > ADTSampleApp* folder. Then do the following steps to create the functions:

1. In the *SampleFunctionsApp* project, create a new C# class called **SignalRFunctions.cs**.

1. Replace the contents of the class file with the following code:
    
    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/signalRFunction.cs":::

1. In Visual Studio's *Package Manager Console* window, or any command window on your machine, navigate to the folder *digital-twins-samples-master\AdtSampleApp\SampleFunctionsApp*, and run the following command to install the `SignalRService` NuGet package to the project:
    ```cmd
    dotnet add package Microsoft.Azure.WebJobs.Extensions.SignalRService --version 1.2.0
    ```

    This should resolve any dependency issues in the class.

1. Publish your function to Azure, using the steps described in the [*Publish the app* section](tutorial-end-to-end.md#publish-the-app) of the *Connect an end-to-end solution* tutorial. You can publish it to the same app service/function app that you used in the end-to-end tutorial [prerequisite](#prerequisites), or create a new one—but you may want to use the same one to minimize duplication. 

Next, configure the functions to communicate with your Azure SignalR instance. You'll start by gathering the SignalR instance's **connection string**, and then add it to the functions app's settings.

1. Go to the [Azure portal](https://portal.azure.com/) and search for the name of your SignalR instance in the search bar at the top of the portal. Select the instance to open it.
1. Select **Keys** from the instance menu to view the connection strings for the SignalR service instance.
1. Select the *Copy* icon to copy the primary connection string.

    :::image type="content" source="media/how-to-integrate-azure-signalr/signalr-keys.png" alt-text="Screenshot of the Azure portal that shows the Keys page for the SignalR instance. The 'Copy to clipboard' icon next to the Primary CONNECTION STRING is highlighted." lightbox="media/how-to-integrate-azure-signalr/signalr-keys.png":::

1. Finally, add your Azure SignalR **connection string** to the function's app settings, using the following Azure CLI command. Also, replace the placeholders with your resource group and app service/function app name from the [tutorial prerequisite](how-to-integrate-azure-signalr.md#prerequisites). The command can be run in [Azure Cloud Shell](https://shell.azure.com), or locally if you have the Azure CLI [installed on your machine](/cli/azure/install-azure-cli):
 
    ```azurecli-interactive
    az functionapp config appsettings set -g <your-resource-group> -n <your-App-Service-(function-app)-name> --settings "AzureSignalRConnectionString=<your-Azure-SignalR-ConnectionString>"
    ```

    The output of this command prints all the app settings set up for your Azure function. Look for `AzureSignalRConnectionString` at the bottom of the list to verify it's been added.

    :::image type="content" source="media/how-to-integrate-azure-signalr/output-app-setting.png" alt-text="Excerpt of output in a command window, showing a list item called 'AzureSignalRConnectionString'":::

#### Connect the function to Event Grid

Next, subscribe the *broadcast* Azure function to the **event grid topic** you created during the [tutorial prerequisite](how-to-integrate-azure-signalr.md#prerequisites). This will allow telemetry data to flow from the thermostat67 twin through the event grid topic and to the function. From here, the function can broadcast the data to all the clients.

To do this, you'll create an **Event subscription** from your event grid topic to your *broadcast* Azure function as an endpoint.

In the [Azure portal](https://portal.azure.com/), navigate to your event grid topic by searching for its name in the top search bar. Select *+ Event Subscription*.

:::image type="content" source="media/how-to-integrate-azure-signalr/event-subscription-1b.png" alt-text="Azure portal: Event Grid event subscription":::

On the *Create Event Subscription* page, fill in the fields as follows (fields filled by default are not mentioned):
* *EVENT SUBSCRIPTION DETAILS* > **Name**: Give a name to your event subscription.
* *ENDPOINT DETAILS* > **Endpoint Type**: Select *Azure Function* from the menu options.
* *ENDPOINT DETAILS* > **Endpoint**: Hit the *Select an endpoint* link. This will open a *Select Azure Function* window:
    - Fill in your **Subscription**, **Resource group**, **Function app** and **Function** (*broadcast*). Some of these may auto-populate after selecting the subscription.
    - Hit **Confirm Selection**.

:::image type="content" source="media/how-to-integrate-azure-signalr/create-event-subscription.png" alt-text="Azure portal view of creating an event subscription. The fields above are filled in, and the 'Confirm Selection' and 'Create' buttons are highlighted.":::

Back on the *Create Event Subscription* page, hit **Create**.

At this point, you should see two event subscriptions in the *Event Grid Topic* page.

:::image type="content" source="media/how-to-integrate-azure-signalr/view-event-subscriptions.png" alt-text="Azure portal view of two event subscriptions in the Event grid topic page." lightbox="media/how-to-integrate-azure-signalr/view-event-subscriptions.png":::

## Configure and run the web app

In this section, you will see the result in action. First, configure the **sample client web app** to connect to the Azure SignalR flow you've set up. Next, you'll start up the **simulated device sample app** that sends telemetry data through your Azure Digital Twins instance. After that, you will view the sample web app to see the simulated device data updating the sample web app in real time.

### Configure the sample client web app

Next, you'll configure the sample client web app. Start by gathering the **HTTP endpoint URL** of the *negotiate* function, and then use it to configure the app code on your machine.

1. Go to the Azure portal's [Function apps](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp) page and select your function app from the list. In the app menu, select *Functions* and choose the *negotiate* function.

    :::image type="content" source="media/how-to-integrate-azure-signalr/functions-negotiate.png" alt-text="Azure portal view of the function app, with 'Functions' highlighted in the menu. The list of functions is shown on the page, and the 'negotiate' function is also highlighted.":::

1. Hit *Get function URL* and copy the value **up through _/api_ (don't include the last _/negotiate?_)**. You'll use this in the next step.

    :::image type="content" source="media/how-to-integrate-azure-signalr/get-function-url.png" alt-text="Azure portal view of the 'negotiate' function. The 'Get function URL' button is highlighted, and the portion of the URL from the beginning through '/api'":::

1. Using Visual Studio or any code editor of your choice, open the unzipped _**digitaltwins-signalr-webapp-sample-main**_ folder that you downloaded in the [*Download the sample applications*](#download-the-sample-applications) section.

1. Open the *src/App.js* file, and replace the function URL in `HubConnectionBuilder` with the HTTP endpoint URL of the **negotiate** function that you saved in the previous step:

    ```javascript
        const hubConnection = new HubConnectionBuilder()
            .withUrl('<Function URL>')
            .build();
    ```
1. In Visual Studio's *Developer command prompt* or any command window on your machine, navigate to the *digitaltwins-signalr-webapp-sample-main\src* folder. Run the following command to install the dependent node packages:

    ```cmd
    npm install
    ```

Next, set permissions in your function app in the Azure portal:
1. In the Azure portal's [Function apps](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp) page, select your function app instance.

1. Scroll down in the instance menu and select *CORS*. On the CORS page, add `http://localhost:3000` as an allowed origin by entering it into the empty box. Check the box for *Enable Access-Control-Allow-Credentials* and hit *Save*.

    :::image type="content" source="media/how-to-integrate-azure-signalr/cors-setting-azure-function.png" alt-text="CORS Setting in Azure Function":::

### Run the device simulator

During the end-to-end tutorial prerequisite, you [configured the device simulator](tutorial-end-to-end.md#configure-and-run-the-simulation) to send data through an IoT Hub and to your Azure Digital Twins instance.

Now, all you have to do is start the simulator project, located in *digital-twins-samples-master > DeviceSimulator > DeviceSimulator.sln*. If you're using Visual Studio, you can open the project and then run it with this button in the toolbar:

:::image type="content" source="media/how-to-integrate-azure-signalr/start-button-simulator.png" alt-text="The Visual Studio start button (DeviceSimulator project)":::

A console window will open and display simulated temperature telemetry messages. These are being sent through your Azure Digital Twins instance, where they are then picked up by the Azure functions and SignalR.

You don't need to do anything else in this console, but leave it running while you complete the next step.

### See the results

To see the results in action, start the **SignalR integration web app sample**. You can do this from any console window at the *digitaltwins-signalr-webapp-sample-main\src* location, by running this command:

```cmd
npm start
```

This will open a browser window running the sample app, which displays a visual temperature gauge. Once the app is running, you should start seeing the temperature telemetry values from the device simulator that propagate through Azure Digital Twins being reflected by the web app in real time.

:::image type="content" source="media/how-to-integrate-azure-signalr/signalr-webapp-output.png" alt-text="Excerpt from the sample client web app, showing a visual temperature gauge. The temperature reflected is 67.52":::

## Clean up resources

If you no longer need the resources created in this article, follow these steps to delete them. 

Using the Azure Cloud Shell or local Azure CLI, you can delete all Azure resources in a resource group with the [az group delete](/cli/azure/group#az_group_delete) command. Removing the resource group will also remove...
* the Azure Digital Twins instance (from the end-to-end tutorial)
* the IoT hub and the hub device registration  (from the end-to-end tutorial)
* the event grid topic and associated subscriptions
* the Azure Functions app, including all three functions and associated resources like storage
* the Azure SignalR instance

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. 

```azurecli-interactive
az group delete --name <your-resource-group>
```

Finally, delete the project sample folders that you downloaded to your local machine (*digital-twins-samples-master.zip*, *digitaltwins-signalr-webapp-sample-main.zip*, and their unzipped counterparts).

## Next steps

In this article, you set up Azure functions with SignalR to broadcast Azure Digital Twins telemetry events to a sample client application.

Next, learn more about Azure SignalR Service:
* [*What is Azure SignalR Service?*](../azure-signalr/signalr-overview.md)

Or read more about Azure SignalR Service Authentication with Azure Functions:
* [*Azure SignalR Service authentication*](../azure-signalr/signalr-tutorial-authenticate-azure-functions.md)