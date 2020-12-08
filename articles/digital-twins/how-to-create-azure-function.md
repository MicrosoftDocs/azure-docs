---
# Mandatory fields.
title: Set up an Azure function for processing data
titleSuffix: Azure Digital Twins
description: See how to create an Azure function that can access and be triggered by digital twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 8/27/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Connect Azure Functions apps for processing data

Updating digital twins based on data is handled using [**event routes**](concepts-route-events.md) through compute resources, such as [Azure Functions](../azure-functions/functions-overview.md). An Azure function can be used to update a digital twin in response to:
* device telemetry data coming from IoT Hub
* property change or other data coming from another digital twin within the twin graph

This article walks you through creating an Azure function for use with Azure Digital Twins. 

Here is an overview of the steps it contains:

1. Create an Azure Functions app in Visual Studio
2. Write an Azure function with an [Event Grid](../event-grid/overview.md) trigger
3. Add authentication code to the function (to be able to access Azure Digital Twins)
4. Publish the function app to Azure
5. Set up [security](concepts-security.md) access for the Azure function app

## Prerequisite: Set up Azure Digital Twins instance

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

## Create an Azure Functions app in Visual Studio

In Visual Studio 2019, select _File > New > Project_ and search for the _Azure Functions_ template, select _Next_.

:::image type="content" source="media/how-to-create-azure-function/create-azure-function-project.png" alt-text="Visual Studio: new project dialog":::

Specify a name for the function app and select _Create_.

:::image type="content" source="media/how-to-create-azure-function/configure-new-project.png" alt-text="Visual Studio: configure new project":::

Select the type of the function app *Event Grid trigger* and select _Create_.

:::image type="content" source="media/how-to-create-azure-function/eventgridtrigger-function.png" alt-text="Visual Studio: Azure function project trigger dialog":::

Once your function app is created, your visual studio will have auto populated code sample in **function.cs** file in your project folder. This short Azure function is used to log events.

:::image type="content" source="media/how-to-create-azure-function/visual-studio-sample-code.png" alt-text="Visual Studio: Project window with sample code":::

## Write an Azure function with an Event Grid trigger

You can write an Azure function by adding SDK to your function app. The function app interacts with Azure Digital Twins using the [Azure Digital Twins SDK for .NET (C#)](/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet&preserve-view=true). 

In order to use the SDK, you'll need to include the following packages into your project. You can either install the packages using visual studio NuGet package manager or add the packages using `dotnet` command-line tool. Choose either of these methods: 

**Option 1. Add packages using Visual Studio package manager:**
    
You can do this by right-selecting on your project and select _Manage NuGet Packages_ from the list. Then, in the window that opens, select _Browse_ tab and search for the following packages. Select _Install_ and _accept_ the License agreement to install the packages.

* `Azure.DigitalTwins.Core`
* `Azure.Identity` 

For configuration of the Azure SDK pipeline to set up properly for Azure Functions, you will also need the following packages. Repeat the same process as above to install all the packages.

* `System.Net.Http`
* `Azure.Core.Pipeline`

**Option 2. Add packages using `dotnet` command-line tool:**

```cmd/sh
dotnet add package Azure.DigitalTwins.Core --version 1.0.0-preview.3
dotnet add package Azure.identity --version 1.2.2
dotnet add package System.Net.Http
dotnet add package Azure.Core.Pipeline
```
Next, in your Visual Studio Solution Explorer, open _function.cs_ file where you have sample code and add the following _using_ statements to your Azure function. 

```csharp
using Azure.DigitalTwins.Core;
using Azure.Identity;
using System.Net.Http;
using Azure.Core.Pipeline;
```
## Add authentication code to the Azure function

You will now declare class level variables and add authentication code that will allow the function to access Azure Digital Twins. You will add the following to your Azure function in the {your function name}.cs file.

* Read ADT service URL as an environment variable. It is a good practice to read the service URL from an environment variable, rather than hard-coding it in the function.
```csharp     
private static readonly string adtInstanceUrl = Environment.GetEnvironmentVariable("ADT_SERVICE_URL");
```
* A static variable to hold an HttpClient instance. HttpClient is relatively expensive to create, and we want to avoid having to do this for every function invocation.
```csharp
private static readonly HttpClient httpClient = new HttpClient();
```
* You can use the managed identity credentials in Azure function.
```csharp
ManagedIdentityCredential cred = new ManagedIdentityCredential("https://digitaltwins.azure.net");
```
* Add a local variable _DigitalTwinsClient_ inside of your function to hold your Azure Digital Twins client instance to the function project. Do *not* make this variable static inside your class.
```csharp
DigitalTwinsClient client = new DigitalTwinsClient(new Uri(adtInstanceUrl), cred, new DigitalTwinsClientOptions { Transport = new HttpClientTransport(httpClient) });
```
* Add a null check for _adtInstanceUrl_ and wrap your function logic in a try catch block to catch any exceptions.

After these changes, your function code will be similar to the following:

```csharp
// Default URL for triggering event grid function in the local environment.
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}
using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;
using Azure.DigitalTwins.Core;
using Azure.Identity;
using System.Net.Http;
using Azure.Core.Pipeline;

namespace adtIngestFunctionSample
{
    public class Function1
    {
        //Your Digital Twin URL is stored in an application setting in Azure Functions
        private static readonly string adtInstanceUrl = Environment.GetEnvironmentVariable("ADT_SERVICE_URL");
        private static readonly HttpClient httpClient = new HttpClient();

        [FunctionName("TwinsFunction")]
        public void Run([EventGridTrigger] EventGridEvent eventGridEvent, ILogger log)
        {
            log.LogInformation(eventGridEvent.Data.ToString());
            if (adtInstanceUrl == null) log.LogError("Application setting \"ADT_SERVICE_URL\" not set");
            try
            {
                //Authenticate with Digital Twins
                ManagedIdentityCredential cred = new ManagedIdentityCredential("https://digitaltwins.azure.net");
                DigitalTwinsClient client = new DigitalTwinsClient(new Uri(adtInstanceUrl), cred, new DigitalTwinsClientOptions { Transport = new HttpClientTransport(httpClient) });
                log.LogInformation($"ADT service client connection created.");
                /*
                * Add your business logic here
                */
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
            }

        }
    }
}
```

## Publish the function app to Azure

To publish the function app to Azure, right-select the function project (not the solution) in Solution Explorer, and choose **Publish**.

> [!IMPORTANT] 
> Publishing an Azure function will incur additional charges on your subscription, independent of Azure Digital Twins.

:::image type="content" source="media/how-to-create-azure-function/publish-azure-function.png" alt-text="Visual Studio: publish Azure function ":::

Select **Azure** as the publishing target and select **Next**.

:::image type="content" source="media/how-to-create-azure-function/publish-azure-function-1.png" alt-text="Visual Studio: publish Azure function dialog, select Azure ":::

:::image type="content" source="media/how-to-create-azure-function/publish-azure-function-2.png" alt-text="Visual Studio: publish function dialog, select Azure Function App(Windows) or (Linux) based on your machine":::

:::image type="content" source="media/how-to-create-azure-function/publish-azure-function-3.png" alt-text="Visual Studio: publish function dialog, Create a new Azure Function":::

:::image type="content" source="media/how-to-create-azure-function/publish-azure-function-4.png" alt-text="Visual Studio: publish function dialog, Fill in the fields, and select create":::

:::image type="content" source="media/how-to-create-azure-function/publish-azure-function-5.png" alt-text="Visual Studio: publish function dialog, Select your function app from the list, and finish":::

On the following page, enter the desired name for the new function app, a resource group, and other details.
For your Functions app to be able to access Azure Digital Twins, it needs to have a system-managed identity and have permissions to access your Azure Digital Twins instance.

Next, you can set up security access for the function using CLI or Azure portal. Choose either of these methods:

## Set up security access for the Azure function app
You can set up security access for the Azure function app using one of these options:

### Option 1: Set up security access for the Azure function app using CLI

The Azure function skeleton from earlier examples requires that a bearer token to be passed to it, in order to be able to authenticate with Azure Digital Twins. To make sure that this bearer token is passed, you'll need to set up [Managed Service Identity (MSI)](../active-directory/managed-identities-azure-resources/overview.md) for the function app. This only needs to be done once for each function app.

You can create system-managed identity and assign the function app's identity to the _**Azure Digital Twins Data Owner**_ role for your Azure Digital Twins instance. This will give the function app permission in the instance to perform data plane activities. Then, make the URL of Azure Digital Twins instance accessible to your function by setting an environment variable.

[!INCLUDE [digital-twins-role-rename-note.md](../../includes/digital-twins-role-rename-note.md)]

Use [Azure Cloud Shell](https://shell.azure.com) to run the commands.

Use the following command to create the system-managed identity. Take note of the _principalId_ field in the output.

```azurecli-interactive	
az functionapp identity assign -g <your-resource-group> -n <your-App-Service-(function-app)-name>	
```
Use the _principalId_ value in the following command to assign the function app's identity to the _Azure Digital Twins Data Owner_ role for your Azure Digital Twins instance.

```azurecli-interactive	
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<principal-ID>" --role "Azure Digital Twins Data Owner"
```
Lastly, you can make the URL of your Azure Digital Twins instance accessible to your function by setting an environment variable. For more information on setting an environment variables, see [*Environment variables*](/sandbox/functions-recipes/environment-variables). 

> [!TIP]
> The Azure Digital Twins instance's URL is made by adding *https://* to the beginning of your Azure Digital Twins instance's *hostName*. To see the hostName, along with all the properties of your instance, you can run `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

```azurecli-interactive	
az functionapp config appsettings set -g <your-resource-group> -n <your-App-Service-(function-app)-name> --settings "ADT_SERVICE_URL=https://<your-Azure-Digital-Twins-instance-hostname>"
```
### Option 2: Set up security access for the Azure function app using Azure portal

A system assigned managed identity enables Azure resources to authenticate to cloud services (for example, Azure Key Vault) without storing credentials in code. Once enabled, all necessary permissions can be granted via Azure role-based-access-control. The lifecycle of this type of managed identity is tied to the lifecycle of this resource. Additionally, each resource (for example, Virtual Machine) can only have one system assigned managed identity.

In the [Azure portal](https://portal.azure.com/), search for _function app_ in the search bar with the function app name that you created earlier. Select the *Function App* from the list. 

:::image type="content" source="media/how-to-create-azure-function/portal-search-for-functionapp.png" alt-text="Azure portal: Search function app":::

On the function app window, select _Identity_ in the navigation bar on the left to enable managed identity.
Under _System assigned_ tab, toggle the _Status_ to On and _save_ it. You will see a pop-up to _Enable system assigned managed identity_.
Select _Yes_ button. 

:::image type="content" source="media/how-to-create-azure-function/enable-system-managed-identity.png" alt-text="Azure portal: enable system-managed identity":::

You can verify in the notifications that your function is successfully registered with Azure Active Directory.

:::image type="content" source="media/how-to-create-azure-function/notifications-enable-managed-identity.png" alt-text="Azure portal: notifications":::

Also note the **object ID** shown on the _Identity_ page, as it will be used in the next section.

:::image type="content" source="media/how-to-create-azure-function/object-id.png" alt-text="Copy the Object ID to use in future":::

### Assign access roles using Azure portal

Select the _Azure role assignments_ button, which will open up the *Azure role assignments* page. Then, select _+ Add role assignment (Preview)_.

:::image type="content" source="media/how-to-create-azure-function/add-role-assignments.png" alt-text="Azure portal: add role assignment":::

On the _Add role assignment (Preview)_ page that opens up, select:

* _Scope_: Resource group
* _Subscription_: select your Azure subscription
* _Resource group_: select your resource group from the dropdown
* _Role_: select _Azure Digital Twins Data Owner_ from the dropdown

Then, save your details by hitting the _Save_ button.

:::image type="content" source="media/how-to-create-azure-function/add-role-assignment.png" alt-text="Azure portal: add role assignment (Preview) ":::

### Configure application settings using Azure portal

You can make the URL of your Azure Digital Twins instance accessible to your function by setting an environment variable. For more information on this, see [*Environment variables*](/sandbox/functions-recipes/environment-variables). Application settings are exposed as environment variables to access the digital twins instance. 

You'll need ADT_INSTANCE_URL to create an application setting.

You can get ADT_INSTANCE_URL by appending **_https://_** to your instance host name. In the Azure portal, you can find your digital twins instance host name by searching for your instance in the search bar. Then, select _Overview_ on the left navigation bar to view the _Host name_. Copy this value to create an application setting.

:::image type="content" source="media/how-to-create-azure-function/adt-hostname.png" alt-text="Azure portal: Overview-> Copy hostname to use in the _Value_ field.":::

You can now create an application setting following the steps below:

* Search for your Azure function using function name in the search bar and select the function from the list
* Select _Configuration_ on the navigation bar on the left to create a new application setting
* In the _Application settings_ tab, select _+ New application setting_

:::image type="content" source="media/how-to-create-azure-function/search-for-azure-function.png" alt-text="Azure portal: Search for existing Azure function":::

:::image type="content" source="media/how-to-create-azure-function/application-setting.png" alt-text="Azure portal: Configure application settings":::

In the window that opens up, use the value copied from above to create an application setting. \
_Name_  : ADT_SERVICE_URL \
_Value_ : https://{your-azure-digital-twins-hostname}

Select _OK_ to create an application setting.

:::image type="content" source="media/how-to-create-azure-function/add-application-setting.png" alt-text="Azure portal: Add application settings.":::

You can view your application settings with application name under the _Name_ field. Then, save your application settings by selecting _Save_ button.

:::image type="content" source="media/how-to-create-azure-function/application-setting-save-details.png" alt-text="Azure portal: View the application created and restart the application":::

Any changes to the application settings need an application restart. Select _Continue_ to restart your application.

:::image type="content" source="media/how-to-create-azure-function/save-application-setting.png" alt-text="Azure portal: Save application settings":::

You can view that application settings are updated by selecting _Notifications_ icon. If your application setting is not created, you can retry adding an application setting by following the above process.

:::image type="content" source="media/how-to-create-azure-function/notifications-update-web-app-settings.png" alt-text="Azure portal: Notifications for updating application settings":::

## Next steps

In this article, you followed the steps to set up an Azure function for use with Azure Digital Twins. Next, you can subscribe your Azure function to Event Grid, to listen on an endpoint. This endpoint could be:
* An Event Grid endpoint attached to Azure Digital Twins to process messages coming from Azure Digital Twins itself (such as property change messages, telemetry messages generated by [digital twins](concepts-twins-graph.md) in the twin graph, or life-cycle messages)
* The IoT system topics used by IoT Hub to send telemetry and other device events
* An Event Grid endpoint receiving messages from other services

Next, see how to build on your basic Azure function to ingest IoT Hub data into Azure Digital Twins:
* [*How-to: Ingest telemetry from IoT Hub*](how-to-ingest-iot-hub-data.md)