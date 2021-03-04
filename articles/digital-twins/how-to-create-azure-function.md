---
# Mandatory fields.
title: Set up a function in Azure for processing data
titleSuffix: Azure Digital Twins
description: See how to create a function in Azure that can access and be triggered by digital twins.
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

# Connect function apps in Azure for processing data

Updating digital twins based on data is handled using [**event routes**](concepts-route-events.md) through compute resources, such as a function that's made by using [Azure Functions](../azure-functions/functions-overview.md). Functions can be used to update a digital twin in response to:
* device telemetry data coming from IoT Hub
* property change or other data coming from another digital twin within the twin graph

This article walks you through creating a function in Azure for use with Azure Digital Twins. 

Here is an overview of the steps it contains:

1. Create an Azure Functions project in Visual Studio
2. Write an function with an [Event Grid](../event-grid/overview.md) trigger
3. Add authentication code to the function (to be able to access Azure Digital Twins)
4. Publish the function app to Azure
5. Set up [security](concepts-security.md) access for the function app

## Prerequisite: Set up Azure Digital Twins instance

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

## Create a function app in Visual Studio

In Visual Studio 2019, select _File > New > Project_ and search for the _Azure Functions_ template. Select _Next_.

:::image type="content" source="media/how-to-create-azure-function/create-azure-function-project.png" alt-text="Screenshot of Visual Studio showing the new project dialog. The Azure Functions project template is highlighted.":::

Specify a name for the function app and select _Create_.

:::image type="content" source="media/how-to-create-azure-function/configure-new-project.png" alt-text="Screenshot of Visual Studio showing the dialog to configure a new project, including project name, save location, choice to create a new solution, and solution name.":::

Select the function app type of *Event Grid trigger* and select _Create_.

:::image type="content" source="media/how-to-create-azure-function/event-grid-trigger-function.png" alt-text="Screenshot of Visual Studio showing the dialog to create a new Azure Functions application. The Event Grid trigger option is highlighted.":::

Once your function app is created, Visual Studio will generate a code sample in a **Function1.cs** file in your project folder. This short function is used to log events.

:::image type="content" source="media/how-to-create-azure-function/visual-studio-sample-code.png" alt-text="Screenshot of Visual Studio in the project window for the new project that's been created. There is code for a sample function called Function1." lightbox="media/how-to-create-azure-function/visual-studio-sample-code.png":::

## Write a function with an Event Grid trigger

You can write a function by adding SDK to your function app. The function app interacts with Azure Digital Twins using the [Azure Digital Twins SDK for .NET (C#)](/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet&preserve-view=true). 

In order to use the SDK, you'll need to include the following packages into your project. You can either install the packages using Visual Studio's NuGet package manager, or add the packages using `dotnet` in a command-line tool. Follow the steps below for your preferred method.

**Option 1. Add packages using Visual Studio package manager:**
    
Right-select your project and select _Manage NuGet Packages_ from the list. Then, in the window that opens, select the _Browse_ tab and search for the following packages. Select _Install_ and _Accept_ the License agreement to install the packages.

* `Azure.DigitalTwins.Core`
* `Azure.Identity`
* `System.Net.Http`
* `Azure.Core.Pipeline`

**Option 2. Add packages using `dotnet` command-line tool:**

Alternatively, you can use the following `dotnet add` commands in a command line tool:

```cmd/sh
dotnet add package Azure.DigitalTwins.Core
dotnet add package Azure.Identity
dotnet add package System.Net.Http
dotnet add package Azure.Core.Pipeline
```

Next, in your Visual Studio Solution Explorer, open the _Function1.cs_ file where you have sample code and add the following `using` statements to your function. 

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="Function_dependencies":::

## Add authentication code to the function

You will now declare class level variables and add authentication code that will allow the function to access Azure Digital Twins. You will add the following to your function in the _Function1.cs_ file.

* Code to read the Azure Digital Twins service URL as an **environment variable**. It's a good practice to read the service URL from an environment variable, rather than hard-coding it in the function. You'll set the value of this environment variable [later in this article](#set-up-security-access-for-the-function-app). For more information about environment variables, see [*Manage your function app*](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal).

    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="ADT_service_URL":::

* A static variable to hold an HttpClient instance. HttpClient is relatively expensive to create, and we want to avoid having to do this for every function invocation.

    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="HTTP_client":::

* You can use the managed identity credentials in Azure Functions.
    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="ManagedIdentityCredential":::

* Add a local variable _DigitalTwinsClient_ inside of your function to hold your Azure Digital Twins client instance. Do *not* make this variable static inside your class.
    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="DigitalTwinsClient":::

* Add a null check for _adtInstanceUrl_ and wrap your function logic in a try/catch block to catch any exceptions.

After these changes, your function code will be similar to the following:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs":::

Now that your application is written, you can publish it to Azure using the steps in the next section.

## Publish the function app to Azure

[!INCLUDE [digital-twins-publish-azure-function.md](../../includes/digital-twins-publish-azure-function.md)]

## Set up security access for the function app

You can set up security access for the function app using either the Azure CLI or the Azure portal. Follow the steps for your preferred option below.

### Option 1: Set up security access for the function app using CLI

The function skeleton from earlier examples requires that a bearer token to be passed to it, in order to be able to authenticate with Azure Digital Twins. To make sure that this bearer token is passed, you'll need to set up [Managed Service Identity (MSI)](../active-directory/managed-identities-azure-resources/overview.md) for the function app. This only needs to be done once for each function app.

You can create system-managed identity and assign the function app's identity to the _**Azure Digital Twins Data Owner**_ role for your Azure Digital Twins instance. This will give the function app permission in the instance to perform data plane activities. Then, make the URL of Azure Digital Twins instance accessible to your function by setting an environment variable.

Use [Azure Cloud Shell](https://shell.azure.com) to run the commands.

Use the following command to create the system-managed identity. Take note of the _principalId_ field in the output.

```azurecli-interactive	
az functionapp identity assign -g <your-resource-group> -n <your-App-Service-(function-app)-name>	
```
Use the _principalId_ value in the following command to assign the function app's identity to the _Azure Digital Twins Data Owner_ role for your Azure Digital Twins instance.

```azurecli-interactive	
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<principal-ID>" --role "Azure Digital Twins Data Owner"
```
Lastly, make the URL of your Azure Digital Twins instance accessible to your function by setting an **environment variable** for it. For more information about environment variables, see [*Manage your function app*](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal). 

> [!TIP]
> The Azure Digital Twins instance's URL is made by adding *https://* to the beginning of your Azure Digital Twins instance's *hostName*. To see the hostName, along with all the properties of your instance, you can run `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

```azurecli-interactive	
az functionapp config appsettings set -g <your-resource-group> -n <your-App-Service-(function-app)-name> --settings "ADT_SERVICE_URL=https://<your-Azure-Digital-Twins-instance-hostname>"
```
### Option 2: Set up security access for the function app using Azure portal

A system assigned managed identity enables Azure resources to authenticate to cloud services (for example, Azure Key Vault) without storing credentials in code. Once enabled, all necessary permissions can be granted via Azure role-based-access-control. The lifecycle of this type of managed identity is tied to the lifecycle of this resource. Additionally, each resource (for example, Virtual Machine) can only have one system assigned managed identity.

In the [Azure portal](https://portal.azure.com/), search for _function app_ in the search bar with the function app name that you created earlier. Select the *Function App* from the list. 

:::image type="content" source="media/how-to-create-azure-function/portal-search-for-function-app.png" alt-text="Screenshot of the Azure portal: The function app's name is being searched in the portal search bar and the search result is highlighted.":::

On the function app window, select _Identity_ in the navigation bar on the left to enable managed identity.
Under _System assigned_ tab, toggle the _Status_ to On and _save_ it. You will see a pop-up to _Enable system assigned managed identity_.
Select _Yes_ button. 

:::image type="content" source="media/how-to-create-azure-function/enable-system-managed-identity.png" alt-text="Screenshot of the Azure portal: In the Identity page for the function app, the option to enable system assigned managed identity is being set to Yes. The Status option is set to On.":::

You can verify in the notifications that your function is successfully registered with Azure Active Directory.

:::image type="content" source="media/how-to-create-azure-function/notifications-enable-managed-identity.png" alt-text="Screenshot of the Azure portal: the notifications list from selecting the bell-shaped icon in the portal's top bar. There is a notification that the user has enabled system assigned managed identity.":::

Also note the **object ID** shown on the _Identity_ page, as it will be used in the next section.

:::image type="content" source="media/how-to-create-azure-function/object-id.png" alt-text="Screenshot of the Azure portal: A highlight around the Object ID field from the Azure Function's Identity page.":::

### Assign access roles using Azure portal

Select the _Azure role assignments_ button, which will open up the *Azure role assignments* page. Then, select _+ Add role assignment (Preview)_.

:::image type="content" source="media/how-to-create-azure-function/add-role-assignments.png" alt-text="Screenshot of the Azure portal: A highlight around the Azure role assignments button under Permissions in the Azure Function's Identity page.":::

On the _Add role assignment (Preview)_ page that opens up, select:

* _Scope_: Resource group
* _Subscription_: select your Azure subscription
* _Resource group_: select your resource group from the dropdown
* _Role_: select _Azure Digital Twins Data Owner_ from the dropdown

Then, save your details by hitting the _Save_ button.

:::image type="content" source="media/how-to-create-azure-function/add-role-assignment.png" alt-text="Screenshot of the Azure portal: Dialog to add a new role assignment (Preview). There are fields for the Scope, Subscription, Resource group, and Role.":::

### Configure application settings using Azure portal

To make the URL of your Azure Digital Twins instance accessible to your function, you can set an **environment variable** for it. For more information about environment variables, see [*Manage your function app*](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal). Application settings are exposed as environment variables to access the Azure Digital Twins instance. 

To set an environment variable with the URL of your instance, first get the URL by finding your Azure Digital Twins instance's host name. Search for your instance in the [Azure portal](https://portal.azure.com) search bar. Then, select _Overview_ on the left navigation bar to view the _Host name_. Copy this value.

:::image type="content" source="media/how-to-create-azure-function/adt-hostname.png" alt-text="Screenshot of the Azure portal: From the Overview page for the Azure Digital Twins instance, the Host name value is highlighted.":::

You can now create an application setting following the steps below:

1. Search for your function app in the portal search bar, and select it from the results
1. Select _Configuration_ on the navigation bar on the left to create a new application setting
1. In the _Application settings_ tab, select _+ New application setting_

:::image type="content" source="media/how-to-create-azure-function/portal-search-for-function-app.png" alt-text="Screenshot of the Azure portal: The function app's name is being searched in the portal search bar and the search result is highlighted.":::

:::image type="content" source="media/how-to-create-azure-function/application-setting.png" alt-text="Screenshot of the Azure portal: In the Configuration page for the function app, the button to create a New application setting is highlighted.":::

In the window that opens up, use the host name value copied above to create an application setting.
* **Name**: ADT_SERVICE_URL
* **Value**: https://{your-azure-digital-twins-host-name}

Select _OK_ to create an application setting.

:::image type="content" source="media/how-to-create-azure-function/add-application-setting.png" alt-text="Screenshot of the Azure portal: The OK button is highlighted after filling out the Name and Value fields in the Add/Edit application setting page.":::

You can view your application settings with application name under the _Name_ field. Then, save your application settings by selecting the _Save_ button.

:::image type="content" source="media/how-to-create-azure-function/application-setting-save-details.png" alt-text="Screenshot of the Azure portal: The application settings page, with the new ADT_SERVICE_URL setting highlighted. The Save button is also highlighted.":::

Any changes to the application settings will require an application restart to take effect. Select _Continue_ to restart your application.

:::image type="content" source="media/how-to-create-azure-function/save-application-setting.png" alt-text="Screenshot of the Azure portal: There is a notice that any changes to application settings with restart your application. The Continue button is highlighted.":::

You can view that application settings are updated by selecting _Notifications_ icon. If your application setting is not created, you can retry adding an application setting by following the above process.

:::image type="content" source="media/how-to-create-azure-function/notifications-update-web-app-settings.png" alt-text="Screenshot of the Azure portal: the notifications list from selecting the bell-shaped icon in the portal's top bar. There is a notification that the web app settings were successfully updated.":::

## Next steps

In this article, you followed the steps to set up a function app in Azure for use with Azure Digital Twins.

Next, see how to build on your basic function to ingest IoT Hub data into Azure Digital Twins:
* [*How-to: Ingest telemetry from IoT Hub*](how-to-ingest-iot-hub-data.md)
