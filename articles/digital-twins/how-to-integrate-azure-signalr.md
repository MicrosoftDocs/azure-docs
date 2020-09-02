---
# Mandatory fields.
title: Integrate with Azure SignalR Service
titleSuffix: Azure Digital Twins
description: See how to stream Azure Digital Twins telemetry to clients using Azure SignalR
author: dejimarquis
ms.author: aymarqui # Microsoft employees only
ms.date: 09/02/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Integrate Azure Digital Twins with Azure SignalR Service

In this article, you'll learn how to integrate Azure Digital Twins with [Azure SignalR Service](../azure-signalr/signalr-overview.md).

The solution described in this article will allow you push digital twin telemetry data to connected clients, such as a single webpage or a mobile application. As a result, clients are updated with real time metrics and status from IoT devices, without the need to poll the server or submit new HTTP requests for updates.

## Prerequisites

Here are the prerequisites you should complete before proceeding:

* Before integrating your solution with Azure SignalR service in this article, you should complete the Azure Digital Twins [*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md), because this how-to builds on top of it. The tutorial walks you through setting up an Azure Digital Twins instance that works with a virtual IoT device to trigger digital twin updates. This how-to will connect those updates to a sample web app using Azure SignalR Service.
* Have [Node.js](https://nodejs.org/) installed on your machine.

You can also go ahead and sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

## Solution architecture

You will be attaching Azure SignalR Service to Azure Digital Twins through the path below. Sections A, B, and C in the diagram are taken from the architecture diagram of the [end-to-end tutorial prerequisite](tutorial-end-to-end.md); in this how-to, you will build on this by adding section D.

:::image type="content" source="media/how-to-integrate-azure-signalr/signalr-integration-topology.png" alt-text="A view of Azure services in an end-to-end scenario. Depicts data flowing from a device into IoT Hub, through an Azure function (arrow B) to an Azure Digital Twins instance (section A), then out through Event Grid to another Azure function for processing (arrow C). Section D shows data flowing from the same Event Grid in arrow C out to an Azure Function labeled 'broadcast'. 'broadcast' communicates with another Azure function labeled 'negotiate', and both 'broadcast' and 'negotiate' communicate with computer devices." lightbox="media/how-to-integrate-azure-signalr/signalr-integration-topology.png":::

## Download the sample applications

First, download the required sample apps. You will need both of the following:
* [Azure Digital Twins samples](https://docs.microsoft.com/samples/azure-samples/digital-twins-samples/digital-twins-samples/): This sample contains an *AdtSampleApp* holding two Azure functions for moving data around an Azure Digital Twins instance (you can learn about this scenario in more detail in [*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md)). It also contains a *DeviceSimulator* sample application that simulates an IoT device, generating a new temperature value every second. 
    - Navigate to the sample link and hit the *Download ZIP* button to download a copy of the sample to your machine, as _**Azure_Digital_Twins_samples.zip**_. Unzip the folder.
* [Sample client web app](https://docs.microsoft.com/samples/azure-samples/digitaltwins-signalr-webapp-sample/digital-twins-samples/): This is a React web app that will consume Azure Digital Twins telemetry data from an Azure SignalR service.
    -  Navigate to the sample link and hit the *Download ZIP* button to download a copy of the sample to your machine, as _**Azure_Digital_Twins_SignalR_integration_web_app_sample.zip**_. Unzip the folder.
    - 
[!INCLUDE [Create instance](../azure-signalr/includes/signalr-quickstart-create-instance.md)]

Leave the browser window open to the Azure portal, as you'll use it again in the next section.

## Configure and run the Azure Functions app

In this section, you will set up two Azure functions:
* **negotiate** - A HTTP trigger function. It uses the *SignalRConnectionInfo* input binding to generate and return valid connection information.
* **broadcast** - An [Event Grid](../event-grid/overview.md) trigger function. It receives Azure Digital Twins telemetry data through the event grid, and uses the output binding of the *SignalR* instance you created in the previous step to broadcast the message to all connected client applications.

First, go to the browser where the Azure portal is opened, and complete the following steps.
1. Confirm the SignalR Service instance you deployed earlier was successfully created. You can do this by searching for its name in the search box at the top of the portal. Select the instance to open it.

1. Select **Keys** from the instance menu to view the connection strings for the SignalR Service instance.

1. Select the icon to copy the primary connection string.

    :::image type="content" source="media/how-to-integrate-azure-signalr.md/signalr-keys.png" alt-text="Screenshot of the Azure portal that shows the Keys page for the SignalR instance. The 'Copy to clipboard' icon next to the Primary CONNECTION STRING is highlighted.":::

Next, start Visual Studio (or another code editor of your choice), and open the code solution in the *Azure_Digital_Twins_samples > ADTSampleApp* folder. Then do the following steps:

1. Create a new C# sharp class called **SignalRFunctions.cs** in the *SampleFunctionsApp* project.

1. Replace the contents of the class with the following code:

    ```C#
    using System;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Azure.EventGrid.Models;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Azure.WebJobs.Extensions.EventGrid;
    using Microsoft.Azure.WebJobs.Extensions.SignalRService;
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    
    namespace SampleFunctionsApp
    {
        public static class SignalRFunctions
        {
            public static double temperature;
    
            [FunctionName("negotiate")]
            public static SignalRConnectionInfo GetSignalRInfo(
                [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
                [SignalRConnectionInfo(HubName = "dttelemetry")] SignalRConnectionInfo connectionInfo)
            {
                return connectionInfo;
            }
    
            [FunctionName("broadcast")]
            public static Task SendMessage(
                [EventGridTrigger] EventGridEvent eventGridEvent,
                [SignalR(HubName = "dttelemetry")] IAsyncCollector<SignalRMessage> signalRMessages,
                ILogger log)
            {
                JObject eventGridData = (JObject)JsonConvert.DeserializeObject(eventGridEvent.Data.ToString());
    
                log.LogInformation($"Event grid message: {eventGridData}");
    
                var patch = (JObject)eventGridData["data"]["patch"][0];
                if (patch["path"].ToString().Contains("/Temperature"))
                {
                    temperature = Math.Round(patch["value"].ToObject<double>(), 2);
                }
    
                var message = new Dictionary<object, object>
                {
                    { "temperatureInFahrenheit", temperature},
                };
        
                return signalRMessages.AddAsync(
                    new SignalRMessage
                    {
                        Target = "newMessage",
                        Arguments = new[] { message }
                    });
            }
        }
    }
    ```

1. In Visual Studio's console window or a command window on your machine, run the following command to install the `SignalRService` NuGet package:
    ```cmd
    dotnet add package Microsoft.Azure.WebJobs.Extensions.SignalRService --version 1.2.0
    ```

1. Publish your function to Azure, using the steps described in the [*Publish the app* section](tutorial-end-to-end.md#publish-the-app) of the *Connect an end-to-end solution* tutorial.

1. Finally, add your Azure SignalR connection string from *step 3* earlier to the function's app settings, using the following Azure CLI command. The command can be run in [Azure Cloud Shell](https://shell.azure.com), or locally if you have the Azure CLI [installed on your machine](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest):
 
    ```azurecli-interactive
    az functionapp config appsettings set -g <your-resource-group> -n <your-App-Service-(function-app)-name> --settings "AzureSignalRConnectionString=<your-Azure-SignalR-ConnectionString>"
    ```

#### Connect the function to Event Grid

Next, subscribe the *broadcast* Azure function to the event grid topic you created earlier in [*Tutorial: Connect an end-to-end solution*](./tutorial-end-to-end.md), so that telemetry data can flow from the *thermostat67* twin through the event grid topic to the function, which can then be broadcasted to all the clients.

To do this, you'll create an **Event Grid subscription** from your event grid topic to your *broadcast* Azure function as an endpoint.

In the [Azure portal](https://portal.azure.com/), navigate to your event grid topic by searching for its name in the top search bar. Select *+ Event Subscription*.

:::image type="content" source="media/tutorial-end-to-end/event-subscription-1b.png" alt-text="Azure portal: Event Grid event subscription":::

On the *Create Event Subscription* page, fill in the fields as follows (fields filled by default are not mentioned):
* *EVENT SUBSCRIPTION DETAILS* > **Name**: Give a name to your event subscription.
* *ENDPOINT DETAILS* > **Endpoint Type**: Select *Azure Function* from the menu options.
* *ENDPOINT DETAILS* > **Endpoint**: Hit the *Select an endpoint* link. This will open a *Select Azure Function* window:
    - Fill in your **Subscription**, **Resource group**, **Function app** and **Function** (*broadcast*). Some of these may auto-populate after selecting the subscription.
    - Hit **Confirm Selection**.

Back on the *Create Event Subscription* page, hit **Create**.

## Configure and run the web app

In this section, you will see the result in action. First, you'll start up the **simulated device sample app** that sends telemetry data through your Azure Digital Twins instance. Then, you'll configure the **sample client web app** to connect to the Azure SignalR flow you've set up. Then, you should be able to see the data updating the sample web app in real time.

### Run the device simulator

During the [end-to-end tutorial prerequisite](tutorial-end-to-end.md#configure-and-run-the-simulation), you configured the device simulator to send data through an IoT Hub and to your Azure Digital Twins instance.

Now, all you have to do is start the simulator project, located in *Azure_Digital_Twins_samples > DeviceSimulator > DeviceSimulator.sln*. If you're using Visual Studio, you can open the project and then run it with this button in the toolbar:

:::image type="content" source="media/how-to-integrate-azure-signalr/start-button-simulator.png" alt-text="The Visual Studio start button (DeviceSimulator project)":::

A console window will open and display simulated temperature telemetry messages. These are being sent through your Azure Digital Twins instance, where they are then picked up by the Azure functions and SignalR.

You don't need to do anything else in this console, but leave it running while you complete the next steps.

### Configure the sample client web app

Next, open the **sample web app**. 
1. Using Visual Studio or any code editor of your choice, open the unzipped _**Azure_Digital_Twins_SignalR_integration_web_app_sample**_ folder that you downloaded in the [*Prerequisites*](#prerequisites) section.

1. Open the *src/App.js* file, and replace the URL in `HubConnectionBuilder` with the HTTP endpoint of the **negotiate** function:

    ```javascript
        const hubConnection = new HubConnectionBuilder()
            .withUrl('<URL>')
            .build();
    ```
1. In Visual Studio's console window or a command window on your machine, run the following command to install the dependent node packages:

    ```cmd
    npm install
    ```

Next, open your function app in the Azure portal.
1. In the Azure portal's [Function apps](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp) page, select your function app instance.
1. Select *CORS* from the instance menu, and add `http://localhost:3000` as an allowed origin. Check the box for *Enable Access-Control-Allow-Credentials* and hit *Save*.

    :::image type="content" source="media/how-to-integrate-azure-signalr/cors-setting-azurefunction.png" alt-text="CORS Setting in Azure Function":::

### See the results

To see the results in action, start the sample web app using this command in a console window:

```cmd
npm start
```

The app displays a visual temperature gauge. Once the app is running, you should start seeing the temperature telemetry values from the device simulator that propagate through Azure Digital Twins being reflected by the web app in real time.

:::image type="content" source="media/how-to-integrate-azure-signalr/signalr-webapp-output.png" alt-text="Excerpt from the sample client web app, showing a visual temperature gauge. The temperature reflected is 67.52":::
   
## Next steps

Learn about Azure SignalR Service Authentication with Azure Functions
* [*Azure SignalR Service authentication*](../azure-signalr/signalr-tutorial-authenticate-azure-functions.md)

Or, start looking at the concept documentation to learn more about elements you worked with in the tutorial:
* [*Concepts: Custom models*](concepts-models.md)

Or, go more in-depth on the processes in this tutorial by starting the how-to articles:
* [*How-to: Use the Azure Digital Twins CLI*](how-to-use-cli.md)