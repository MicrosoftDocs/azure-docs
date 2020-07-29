---
# Mandatory fields.
title: Set up an Azure function for processing data
titleSuffix: Azure Digital Twins
description: See how to create an Azure function that can access and be triggered by digital twins.
author: cschormann
ms.author: cschorm # Microsoft employees only
ms.date: 3/17/2020
ms.topic: how-to
ms.service: digital-twins
ROBOTS: NOINDEX, NOFOLLOW

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Connect Azure Functions apps for processing data

[!INCLUDE [Azure Digital Twins current preview status](../../includes/digital-twins-preview-status.md)]

During preview, updating digital twins based on data is handled using [**event routes**](concepts-route-events.md) through compute resources, such as [Azure Functions](../azure-functions/functions-overview.md). An Azure function might be used to update a digital twin in response to:
* device telemetry data coming from IoT Hub
* property change or other data coming from another digital twin within the twin graph

This article walks you through creating an Azure function for use with Azure Digital Twins. 

Here is a overview of the steps it contains:

1. Create an Azure Functions app in Visual Studio
2. Write an Azure function with an [Event Grid](../event-grid/overview.md) trigger
3. Add authentication code to the function (to be able to access Azure Digital Twins)
4. Publish the function app to Azure
5. Set up [security](concepts-security.md) access. In order for the Azure function to receive an access token at runtime to access the service, you'll need to configure Managed Service Identity for the function app.

The remainder of this article walks through the Azure function setup steps, one at a time.

## Create an Azure Functions app in Visual Studio

In Visual Studio 2019, select *File > New Project*. Search for the *Azure Functions* template, select it, and press "Next".

:::image type="content" source="media/how-to-create-azure-function/visual-studio-new-project.png" alt-text="Visual Studio: new project dialog":::

Specify a name for the function app and press "Create".

:::image type="content" source="media/how-to-create-azure-function/visual-studio-project-config.png" alt-text="Visual Studio: configure project dialog":::

Select the *Event Grid trigger* and press "Create".

:::image type="content" source="media/how-to-create-azure-function/visual-studio-project-trigger.png" alt-text="Visual Studio: Azure function project trigger dialog":::

## Write an Azure function with an Event Grid trigger

The following code creates a short Azure function that you can use to log events: 

```csharp
// Default URL for triggering Event Grid function in the local environment
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}
using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;

namespace FunctionSample
{
    public static class FooFunction    {
        [FunctionName("Foo")]
        public static void Run([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
        {
            log.LogInformation(eventGridEvent.Data.ToString());
        }
    }
}
```

This is your basic Azure function.

### Run and debug the Azure function app

You can now compile and run the function. While Azure functions are ultimately intended to run in the cloud, you can also run and debug Azure functions locally.

For more information about this, see [Debug Event Grid trigger locally](../azure-functions/functions-debug-event-grid-trigger-local.md).

### Add the Azure Digital Twins SDK to your Azure function app

The function app interacts with Azure Digital Twins using the [Azure IoT Digital Twin client library for .NET (C#)](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core). In order to use the SDK, you'll need to include the following packages in your project:
* `Azure.DigitalTwins.Core` (version `1.0.0-preview.2`)
* `Azure.Identity`

For configuration of the Azure SDK pipeline to set up properly for Azure Functions, you will also need:
* `Azure.Net.Http`
* `Azure.Core`

Depending on your tools of choice, you can do so with the Visual Studio package manager or the `dotnet` command line tool. 

Add the following using statements to your Azure function.

```csharp
using Azure.Identity;
using Azure.DigitalTwins.Core;
using System.Net.Http;
using Azure.Core.Pipeline;
```

## Add authentication code to the Azure function

Next, add authentication code that will allow the function to access Azure Digital Twins.

Add variables to your function class for these values: 
* The Azure Digital Twins app ID
* The URL of your Azure Digital Twins instance. It is a good practice to read the service URL from an environment variable, rather than hard-coding it in the function.
* A static variable to hold an HttpClient instance. HttpClient is relatively expensive to create, and we want to avoid having to do this for every function invocation.

Also add a local variable inside of your function to hold your Azure Digital Twins client instance to the function project. Do *not* make this a static variable inside your class.

Lastly, change the function signature to be asynchronous.

After these changes, your function code should be similar to the following:

```csharp
namespace FunctionSample
{
    public static class FooFunction
    {
        const string adtAppId = "https://digitaltwins.azure.net";
        private static string adtInstanceUrl = Environment.GetEnvironmentVariable("ADT_SERVICE_URL");
        private static HttpClient httpClient = new HttpClient();

        [FunctionName("Foo")]
        public static async Task Run([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
        {
            DigitalTwinsClient client = null;
            try
            {
                ManagedIdentityCredential cred = new ManagedIdentityCredential(adtAppId);
                DigitalTwinsClientOptions opts = 
                    new DigitalTwinsClientOptions { Transport = new HttpClientTransport(httpClient) });
                client = new DigitalTwinsClient(new Uri(adtInstanceUrl), cred, opts);
                                                
                log.LogInformation($"ADT service client connection created.");
            }
            catch (Exception e)
            {
                log.LogError($"ADT service client connection failed. " + e.ToString());
                return;
            }
            log.LogInformation(eventGridEvent.Data.ToString());
        }
    }
}
```

For your Functions app to be able to access Azure Digital Twins, it needs to have a system-managed identity and have permissions to access your Azure Digital Twins instance.

Use the following command to create the system-managed identity. Take note of the *principalId* field in the output.

```azurecli
az functionapp identity assign -g <your-resource-group> -n <your-App-Service-(function-app)-name>
```

Use the *principalId* value in the following command to assign the function app's identity to the *owner* role for your Azure Digital Twins instance:

```azurecli
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<principal-ID>" --role "Azure Digital Twins Owner (Preview)"
```

For more information on managed identity, please see [How to use managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md).

Lastly, you can make the URL of your Azure Digital Twins instance accessible to your function by setting an environment variable. For more information on this, see [Environment variables](https://docs.microsoft.com/sandbox/functions-recipes/environment-variables).

> [!TIP]
> The Azure Digital Twins instance's URL is made by adding *https://* to the beginning of your Azure Digital Twins instance's *hostName*. To see the hostName, along with all the properties of your instance, you can run `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

```azurecli
az functionapp config appsettings set -g <your-resource-group> -n <your-App-Service-(function-app)-name> --settings "ADT_SERVICE_URL=https://<your-Azure-Digital-Twins-instance-URL>"
```

## Publish the Azure function app

To publish the function app to Azure, right-select the function project (not the solution) in Solution Explorer, and choose *Publish()*.

The following tab will appear:

:::image type="content" source="media/how-to-create-azure-function/visual-studio-publish-1.png" alt-text="Visual Studio: publish function dialog, page 1":::

Select or create an App Service plan to use with Azure Functions. If unsure, start out using the default consumption plan.

> [!IMPORTANT] 
> Publishing an Azure function will incur additional charges on your subscription, independent of Azure Digital Twins.

:::image type="content" source="media/how-to-create-azure-function/visual-studio-publish-2.png" alt-text="Visual Studio: publish function dialog, page 2":::

On the following page, enter the desired name for the new function app, a resource group, and other details.

## Set up security access for the Azure function app

The Azure function skeleton from earlier examples requires that a bearer token be passed to it, in order to be able to authenticate with Azure Digital Twins. To make sure that this bearer token is passed, you'll need to set up [Managed Service Identity (MSI)](../active-directory/managed-identities-azure-resources/overview.md) for the function app. This only needs to be done once for each function app.

To set this up, go to the [Azure portal](https://portal.azure.com/) and navigate to your function app.

In the *Platform features* tab, select *Identity*:

:::image type="content" source="media/how-to-create-azure-function/visual-studio-msi-1.png" alt-text="Azure portal: Selecting Identity for an Azure function":::

On the identity page, set the *Status* toggle to *On*. 

:::image type="content" source="media/how-to-create-azure-function/visual-studio-msi-2.png" alt-text="Azure portal: Turning on identity status":::

Also note the **object ID** shown on this page, as it will be used in the next section.

### Assign access roles

Because Azure Digital Twins uses role-based access control to manage access (see [Concepts: Security for Azure Digital Twins solutions](concepts-security.md) for more information on this), you also need to add a role for each function app that you want to allow to access Azure Digital Twins.

To assign a role, you need the **resource ID** of the Azure Digital Twins instance you have created. If you did not record it earlier when you created your instance, you can retrieve it using this command:

```bash
az dt show --name <your-instance-name> -g <your-resource-group-name>
```
The resource ID will be part of the output, as a long string named "id" that begins with the letters "/subscriptions/…".

Use the resource ID along with the Azure function's object ID from earlier in the command below:

```azurecli
az role assignment create --role "Azure Digital Twins Owner (Preview)" --assignee <object-ID> --scope <resource-ID>
```

## Next steps

In this article, you followed the steps to set up an Azure function for use with Azure Digital Twins. Next, you can subscribe your Azure function to Event Grid, to listen on an endpoint. This endpoint could be:
* An Event Grid endpoint attached to Azure Digital Twins to process messages coming from Azure Digital Twins itself (such as property change messages, telemetry messages generated by [digital twins](concepts-twins-graph.md) in the twin graph, or life-cycle messages)
* The IoT system topics used by IoT Hub to send telemetry and other device events
* An Event Grid endpoint receiving messages from other services

Next, see how to build on your basic Azure function to ingest IoT Hub data into Azure Digital Twins:
* [How-to: Ingest telemetry from IoT Hub](how-to-ingest-iot-hub-data.md)