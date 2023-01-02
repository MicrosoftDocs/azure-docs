---
# Mandatory fields.
title: Integrate with Azure SignalR Service
titleSuffix: Azure Digital Twins
description: Learn how to stream Azure Digital Twins telemetry to clients using Azure SignalR
author: dejimarquis
ms.author: aymarqui # Microsoft employees only
ms.date: 06/21/2022
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

* Before integrating your solution with Azure SignalR Service in this article, you should complete the Azure Digital Twins [Connect an end-to-end solution](tutorial-end-to-end.md), because this how-to article builds on top of it. The tutorial walks you through setting up an Azure Digital Twins instance that works with a virtual IoT device to trigger digital twin updates. This how-to article will connect those updates to a sample web app using Azure SignalR Service.

* You'll need the following values from the tutorial:
  - Event Grid topic
  - Resource group
  - App service/function app name
    
* You'll need [Node.js](https://nodejs.org/) installed on your machine.

Be sure to sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, as you'll need to use it in this guide.

## Solution architecture

You'll be attaching Azure SignalR Service to Azure Digital Twins through the path below. Sections A, B, and C in the diagram are taken from the architecture diagram of the [end-to-end tutorial prerequisite](tutorial-end-to-end.md). In this how-to article, you'll build section D on the existing architecture, which includes two new Azure functions that communicate with SignalR and client apps.

:::image type="content" source="media/how-to-integrate-azure-signalr/signalr-integration-topology.png" alt-text="Diagram of Azure services in an end-to-end scenario, which shows data flowing in and out of Azure Digital Twins." lightbox="media/how-to-integrate-azure-signalr/signalr-integration-topology.png":::

## Download the sample applications

First, download the required sample apps. You'll need both of the following samples:
* [Azure Digital Twins end-to-end samples](/samples/azure-samples/digital-twins-samples/digital-twins-samples/): This sample contains an *AdtSampleApp* that holds two Azure functions for moving data around an Azure Digital Twins instance (you can learn about this scenario in more detail in [Connect an end-to-end solution](tutorial-end-to-end.md)). It also contains a *DeviceSimulator* sample application that simulates an IoT device, generating a new temperature value every second.
    - If you haven't already downloaded the sample as part of the tutorial in [Prerequisites](#prerequisites), [navigate to the sample](/samples/azure-samples/digital-twins-samples/digital-twins-samples/) and select the **Browse code** button underneath the title. Doing so will take you to the GitHub repo for the samples, which you can download as a .zip by selecting the **Code** button and **Download ZIP**.

        :::image type="content" source="media/includes/download-repo-zip.png" alt-text="Screenshot of the digital-twins-samples repo on GitHub and the steps for downloading it as a zip." lightbox="media/includes/download-repo-zip.png":::

    This button will download a copy of the sample repo in your machine, as *digital-twins-samples-main.zip*. Unzip the folder.
* [SignalR integration web app sample](/samples/azure-samples/digitaltwins-signalr-webapp-sample/digital-twins-samples/): This sample React web app will consume Azure Digital Twins telemetry data from an Azure SignalR Service.
    -  Navigate to the sample link and use the same download process to download a copy of the sample to your machine, as *digitaltwins-signalr-webapp-sample-main.zip*. Unzip the folder.

[!INCLUDE [Create instance](../azure-signalr/includes/signalr-quickstart-create-instance.md)]

Leave the browser window open to the Azure portal, as you'll use it again in the next section.

## Publish and configure the Azure Functions app

In this section, you'll set up two Azure functions:
* *negotiate* - A HTTP trigger function. It uses the *SignalRConnectionInfo* input binding to generate and return valid connection information.
* *broadcast* - An [Event Grid](../event-grid/overview.md) trigger function. It receives Azure Digital Twins telemetry data through the event grid, and uses the output binding of the SignalR instance you created in the previous step to broadcast the message to all connected client applications.

Start Visual Studio or another code editor of your choice, and open the code solution in the *digital-twins-samples-main\ADTSampleApp* folder. Then do the following steps to create the functions:

1. In the *SampleFunctionsApp* project, create a new C# class called *SignalRFunctions.cs*.

1. Replace the contents of the class file with the following code:
    
    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/signalRFunction.cs":::

1. In Visual Studio's **Package Manager Console** window, or any command window on your machine, navigate to the folder *digital-twins-samples-main\AdtSampleApp\SampleFunctionsApp*, and run the following command to install the `SignalRService` NuGet package to the project:
    ```cmd
    dotnet add package Microsoft.Azure.WebJobs.Extensions.SignalRService --version 1.2.0
    ```

    Running this command should resolve any dependency issues in the class.

1. Publish the function to Azure, using your preferred method.

    For instructions on how to publish the function using **Visual Studio**, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure). For instructions on how to publish the function using **Visual Studio Code**, see [Create a C# function in Azure using Visual Studio Code](../azure-functions/create-first-function-vs-code-csharp.md?tabs=in-process#publish-the-project-to-azure). For instructions on how to publish the function using the **Azure CLI**, see [Create a C# function in Azure from the command line](../azure-functions/create-first-function-cli-csharp.md?tabs=azure-cli%2Cin-process#deploy-the-function-project-to-azure). 

### Configure the function

Next, configure the function to communicate with your Azure SignalR instance. You'll start by gathering the SignalR instance's connection string, and then add it to the functions app's settings.

1. Go to the [Azure portal](https://portal.azure.com/) and search for the name of your SignalR instance in the search bar at the top of the portal. Select the instance to open it.
1. Select **Keys** from the instance menu to view the connection strings for the SignalR service instance.
1. Select the **Copy** icon to copy the **Primary CONNECTION STRING**.

    :::image type="content" source="media/how-to-integrate-azure-signalr/signalr-keys.png" alt-text="Screenshot of the Azure portal that shows the Keys page for the SignalR instance. The connection string is being copied." lightbox="media/how-to-integrate-azure-signalr/signalr-keys.png":::

1. Finally, add your Azure SignalR connection string to the function's app settings, using the following Azure CLI command. Also, replace the placeholders with your resource group and app service/function app name from the [tutorial prerequisite](how-to-integrate-azure-signalr.md#prerequisites). The command can be run in [Azure Cloud Shell](https://shell.azure.com), or locally if you have the [Azure CLI installed on your machine](/cli/azure/install-azure-cli):
 
    ```azurecli-interactive
    az functionapp config appsettings set --resource-group <your-resource-group> --name <your-function-app-name> --settings "AzureSignalRConnectionString=<your-Azure-SignalR-ConnectionString>"
    ```

    The output of this command prints all the app settings set up for your Azure function. Look for `AzureSignalRConnectionString` at the bottom of the list to verify it's been added.

    :::image type="content" source="media/how-to-integrate-azure-signalr/output-app-setting.png" alt-text="Screenshot of the output in a command window, showing a list item called 'AzureSignalRConnectionString'.":::

## Connect the function to Event Grid

Next, subscribe the *broadcast* Azure function to the Event Grid topic you created during the [tutorial prerequisite](how-to-integrate-azure-signalr.md#prerequisites). This action will allow telemetry data to flow from the thermostat67 twin through the Event Grid topic and to the function. From here, the function can broadcast the data to all the clients.

To broadcast the data, you'll create an Event subscription from your Event Grid topic to your *broadcast* Azure function as an endpoint.

In the [Azure portal](https://portal.azure.com/), navigate to your Event Grid topic by searching for its name in the top search bar. Select **+ Event Subscription**.

:::image type="content" source="media/how-to-integrate-azure-signalr/event-subscription-1b.png" alt-text="Screenshot of how to create an event subscription in the Azure portal.":::

On the **Create Event Subscription** page, fill in the fields as follows (fields filled by default aren't mentioned):
* **EVENT SUBSCRIPTION DETAILS** > **Name**: Give a name to your event subscription.
* **ENDPOINT DETAILS** > **Endpoint Type**: Select **Azure Function** from the menu options.
* **ENDPOINT DETAILS** > **Endpoint**: Select the **Select an endpoint** link, which will open a **Select Azure Function** window:
    - Fill in your **Subscription**, **Resource group**, **Function app**, and **Function** (**broadcast**). Some of these fields may autopopulate after selecting the subscription.
    - Select **Confirm Selection**.

:::image type="content" source="media/how-to-integrate-azure-signalr/create-event-subscription.png" alt-text="Screenshot of the form for creating an event subscription in the Azure portal.":::

Back on the **Create Event Subscription** page, select **Create**.

At this point, you should see two event subscriptions in the **Event Grid Topic** page.

:::image type="content" source="media/how-to-integrate-azure-signalr/view-event-subscriptions.png" alt-text="Screenshot of the Azure portal showing two event subscriptions in the Event Grid topic page." lightbox="media/how-to-integrate-azure-signalr/view-event-subscriptions.png":::

## Configure and run the web app

In this section, you'll see the result in action. First, configure the sample client web app to connect to the Azure SignalR flow you've set up. Next, you'll start up the simulated device sample app that sends telemetry data through your Azure Digital Twins instance. After that, you'll view the sample web app to see the simulated device data updating the sample web app in real time.

### Configure the sample client web app

Next, you'll configure the sample client web app. Start by gathering the HTTP endpoint URL of the *negotiate* function, and then use it to configure the app code on your machine.

1. Go to the Azure portal's [Function apps](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp) page and select your function app from the list. In the app menu, select **Functions** and choose the **negotiate** function.

    :::image type="content" source="media/how-to-integrate-azure-signalr/functions-negotiate.png" alt-text="Screenshot of the Azure portal function apps, with 'Functions' highlighted in the menu and 'negotiate' highlighted in the list of functions.":::

1. Select **Get function URL** and copy the value up through **/api** (don't include the last **/negotiate?**). You'll use this value in the next step.

    :::image type="content" source="media/how-to-integrate-azure-signalr/get-function-url.png" alt-text="Screenshot of the Azure portal showing the 'negotiate' function with the 'Get function URL' button and the function URL highlighted.":::

1. Using Visual Studio or any code editor of your choice, open the unzipped _**digitaltwins-signalr-webapp-sample-main**_ folder that you downloaded in the [Download the sample applications](#download-the-sample-applications) section.

1. Open the *src/App.js* file, and replace the function URL in `HubConnectionBuilder` with the HTTP endpoint URL of the **negotiate** function that you saved in the previous step:

    ```javascript
        const hubConnection = new HubConnectionBuilder()
            .withUrl('<Function-URL>')
            .build();
    ```
1. In Visual Studio's **Developer command prompt** or any command window on your machine, navigate to the *digitaltwins-signalr-webapp-sample-main\src* folder. Run the following command to install the dependent node packages:

    ```cmd
    npm install
    ```

Next, set permissions in your function app in the Azure portal:
1. In the Azure portal's [Function apps](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp) page, select your function app instance.

1. Scroll down in the instance menu and select **CORS**. On the CORS page, add `http://localhost:3000` as an allowed origin by entering it into the empty box. Check the box for **Enable Access-Control-Allow-Credentials** and select **Save**.

    :::image type="content" source="media/how-to-integrate-azure-signalr/cors-setting-azure-function.png" alt-text="Screenshot of the Azure portal showing the CORS Setting in Azure Function.":::

### Run the device simulator

During the end-to-end tutorial prerequisite, you [configured the device simulator](tutorial-end-to-end.md#configure-and-run-the-simulation) to send data through an IoT Hub and to your Azure Digital Twins instance.

Now, start the simulator project located in *digital-twins-samples-main\DeviceSimulator\DeviceSimulator.sln*. If you're using Visual Studio, you can open the project and then run it with this button in the toolbar:

:::image type="content" source="media/how-to-integrate-azure-signalr/start-button-simulator.png" alt-text="Screenshot of the Visual Studio start button with the DeviceSimulator project open.":::

A console window will open and display simulated temperature telemetry messages. These messages are being sent through your Azure Digital Twins instance, where they're then picked up by the Azure functions and SignalR.

You don't need to do anything else in this console, but leave it running while you complete the next step.

### See the results

To see the results in action, start the SignalR integration web app sample. You can do so from any console window at the *digitaltwins-signalr-webapp-sample-main\src* location, by running this command:

```cmd
npm start
```

Running this command will open a browser window running the sample app, which displays a visual temperature gauge. Once the app is running, you should start seeing the temperature telemetry values from the device simulator that propagate through Azure Digital Twins being reflected by the web app in real time.

:::image type="content" source="media/how-to-integrate-azure-signalr/signalr-webapp-output.png" alt-text="Screenshot of the sample client web app, showing a visual temperature gauge. The temperature reflected is 67.52.":::

## Clean up resources

If you no longer need the resources created in this article, follow these steps to delete them. 

Using the Azure Cloud Shell or local Azure CLI, you can delete all Azure resources in a resource group with the [az group delete](/cli/azure/group#az-group-delete) command. Removing the resource group will also remove:
* The Azure Digital Twins instance (from the end-to-end tutorial)
* The IoT hub and the hub device registration  (from the end-to-end tutorial)
* The Event Grid topic and associated subscriptions
* The Azure Functions app, including all three functions and associated resources like storage
* The Azure SignalR instance

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. 

```azurecli-interactive
az group delete --name <your-resource-group>
```

Finally, delete the project sample folders that you downloaded to your local machine (*digital-twins-samples-main.zip*, *digitaltwins-signalr-webapp-sample-main.zip*, and their unzipped counterparts).

## Next steps

In this article, you set up Azure functions with SignalR to broadcast Azure Digital Twins telemetry events to a sample client application.

Next, learn more about Azure SignalR Service:
* [What is Azure SignalR Service?](../azure-signalr/signalr-overview.md)

Or read more about Azure SignalR Service Authentication with Azure Functions:
* [Azure SignalR Service authentication](../azure-signalr/signalr-tutorial-authenticate-azure-functions.md)