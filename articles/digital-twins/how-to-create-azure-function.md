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
2. Write a function with an [Event Grid](../event-grid/overview.md) trigger
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

You can write a function by adding SDK to your function app. The function app interacts with Azure Digital Twins using the [Azure Digital Twins SDK for .NET (C#)](/dotnet/api/overview/azure/digitaltwins/client). 

In order to use the SDK, you'll need to include the following packages into your project. You can either install the packages using Visual Studio's NuGet package manager, or add the packages using `dotnet` in a command-line tool.

* [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core/)
* [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/)
* [System.Net.Http](https://www.nuget.org/packages/System.Net.Http/)
* [Azure.Core](https://www.nuget.org/packages/Azure.Core/)

Next, in your Visual Studio Solution Explorer, open the _Function1.cs_ file where you have sample code and add the following `using` statements for these packages to your function.

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

### Verify function publish

1. Sign in with your credentials in the [Azure portal](https://portal.azure.com/).
2. In the search bar on the top of the window, search for your **function app name**.

    :::image type="content" source="media/how-to-create-azure-function/search-function-app.png" alt-text="Search for your function app with its name in the Azure portal." lightbox="media/how-to-create-azure-function/search-function-app.png":::

3. In the *Function app* page that opens, choose *Functions* in the menu options on the left. If your function is successfully published, you'll see your function name in the list.
Note that you might have to wait a few min or refresh the page couple of times before you can see your function listed in the published functions list.

    :::image type="content" source="media/how-to-create-azure-function/view-published-functions.png" alt-text="View published functions in the Azure portal." lightbox="media/how-to-create-azure-function/view-published-functions.png":::

For your function app to be able to access Azure Digital Twins, it will need to have a system-managed identity with permissions to access your Azure Digital Twins instance. You'll set that up next.

## Set up security access for the function app

You can set up security access for the function app using either the Azure CLI or the Azure portal. Follow the steps for your preferred option below.

# [CLI](#tab/cli)

You can run these commands in [Azure Cloud Shell](https://shell.azure.com) or a [local Azure CLI installation](/cli/azure/install-azure-cli).
You can use the function app's system-managed identity to give it the _**Azure Digital Twins Data Owner**_ role for your Azure Digital Twins instance. This will give the function app permission in the instance to perform data plane activities. Then, make the URL of Azure Digital Twins instance accessible to your function by setting an environment variable.

### Assign access role

[!INCLUDE [digital-twins-permissions-required.md](../../includes/digital-twins-permissions-required.md)]

The function skeleton from earlier examples requires that a bearer token to be passed to it, in order to be able to authenticate with Azure Digital Twins. To make sure that this bearer token is passed, you'll need to set up [Managed Service Identity (MSI)](../active-directory/managed-identities-azure-resources/overview.md) permissions for the function app to access Azure Digital Twins. This only needs to be done once for each function app.


1. Use the following command to see the details of the system-managed identity for the function. Take note of the _principalId_ field in the output.

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
    > The output will then display details of the identity, including the _principalId_ value required for the next step. 

1. Use the _principalId_ value in the following command to assign the function app's identity to the _Azure Digital Twins Data Owner_ role for your Azure Digital Twins instance.

    ```azurecli-interactive	
    az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<principal-ID>" --role "Azure Digital Twins Data Owner"
    ```

### Configure application settings

Lastly, make the URL of your Azure Digital Twins instance accessible to your function by setting an **environment variable** for it. For more information about environment variables, see [*Manage your function app*](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal). 

> [!TIP]
> The Azure Digital Twins instance's URL is made by adding *https://* to the beginning of your Azure Digital Twins instance's *host name*. To see the host name, along with all the properties of your instance, you can run `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

```azurecli-interactive	
az functionapp config appsettings set -g <your-resource-group> -n <your-App-Service-(function-app)-name> --settings "ADT_SERVICE_URL=https://<your-Azure-Digital-Twins-instance-host-name>"
```

# [Azure portal](#tab/portal)

Complete the following steps in the [Azure portal](https://portal.azure.com/).

### Assign access role

[!INCLUDE [digital-twins-permissions-required.md](../../includes/digital-twins-permissions-required.md)]

A system assigned managed identity enables Azure resources to authenticate to cloud services (for example, Azure Key Vault) without storing credentials in code. Once enabled, all necessary permissions can be granted via Azure role-based access control. The lifecycle of this type of managed identity is tied to the lifecycle of this resource. Additionally, each resource can only have one system assigned managed identity.

1. In the [Azure portal](https://portal.azure.com/), search for your function app by typing its name into the search bar. Select your app from the results. 

    :::image type="content" source="media/how-to-create-azure-function/portal-search-for-function-app.png" alt-text="Screenshot of the Azure portal: The function app's name is being searched in the portal search bar and the search result is highlighted.":::

1. On the function app page, select _Identity_ in the navigation bar on the left to work with a managed identity for the function. On the _System assigned_ page, verify that the _Status_ is set to **On** (if it's not, set it now and *Save* the change).

    :::image type="content" source="media/how-to-create-azure-function/verify-system-managed-identity.png" alt-text="Screenshot of the Azure portal: In the Identity page for the function app, the Status option is set to On." lightbox="media/how-to-create-azure-function/verify-system-managed-identity.png":::

1. Select the _Azure role assignments_ button, which will open up the *Azure role assignments* page.

    :::image type="content" source="media/how-to-create-azure-function/add-role-assignment-1.png" alt-text="Screenshot of the Azure portal: A highlight around the Azure role assignments button under Permissions in the Azure Function's Identity page." lightbox="media/how-to-create-azure-function/add-role-assignment-1.png":::

    Select _+ Add role assignment (Preview)_.

    :::image type="content" source="media/how-to-create-azure-function/add-role-assignment-2.png" alt-text="Screenshot of the Azure portal: A highlight around + Add role assignment (Preview) in the Azure role assignments page." lightbox="media/how-to-create-azure-function/add-role-assignment-2.png":::

1. On the _Add role assignment (Preview)_ page that opens up, select the following values:

    * **Scope**: Resource group
    * **Subscription**: Select your Azure subscription
    * **Resource group**: Select your resource group from the dropdown
    * **Role**: Select _Azure Digital Twins Data Owner_ from the dropdown

    Then, save your details by hitting the _Save_ button.

    :::image type="content" source="media/how-to-create-azure-function/add-role-assignment-3.png" alt-text="Screenshot of the Azure portal: Dialog to add a new role assignment (Preview). There are fields for the Scope, Subscription, Resource group, and Role.":::

### Configure application settings

To make the URL of your Azure Digital Twins instance accessible to your function, you can set an **environment variable** for it. For more information about environment variables, see [*Manage your function app*](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal). Application settings are exposed as environment variables to access the Azure Digital Twins instance. 

To set an environment variable with the URL of your instance, first get the URL by finding your Azure Digital Twins instance's host name. Search for your instance in the [Azure portal](https://portal.azure.com) search bar. Then, select _Overview_ on the left navigation bar to view the _Host name_. Copy this value.

:::image type="content" source="media/how-to-create-azure-function/instance-host-name.png" alt-text="Screenshot of the Azure portal: From the Overview page for the Azure Digital Twins instance, the Host name value is highlighted.":::

You can now create an application setting with these steps:

1. Search for your function app in the portal search bar, and select it from the results.

    :::image type="content" source="media/how-to-create-azure-function/portal-search-for-function-app.png" alt-text="Screenshot of the Azure portal: The function app's name is being searched in the portal search bar and the search result is highlighted.":::

1. Select _Configuration_ on the navigation bar on the left. In the _Application settings_ tab, select _+ New application setting_.

    :::image type="content" source="media/how-to-create-azure-function/application-setting.png" alt-text="Screenshot of the Azure portal: In the Configuration page for the function app, the button to create a New application setting is highlighted.":::

1. In the window that opens up, use the host name value copied above to create an application setting.
    * **Name**: ADT_SERVICE_URL
    * **Value**: https://{your-azure-digital-twins-host-name}
    
    Select _OK_ to create an application setting.
    
    :::image type="content" source="media/how-to-create-azure-function/add-application-setting.png" alt-text="Screenshot of the Azure portal: The OK button is highlighted after filling out the Name and Value fields in the Add/Edit application setting page.":::

1. After creating the setting, you should see it appear back in the _Application settings_ tab. Verify *ADT_SERVICE_URL* appears in the list, then save the new application setting by selecting the _Save_ button.

    :::image type="content" source="media/how-to-create-azure-function/application-setting-save-details.png" alt-text="Screenshot of the Azure portal: The application settings page, with the new ADT_SERVICE_URL setting highlighted. The Save button is also highlighted.":::

1. Any changes to the application settings require an application restart to take effect, so select _Continue_ to restart your application when prompted.

    :::image type="content" source="media/how-to-create-azure-function/save-application-setting.png" alt-text="Screenshot of the Azure portal: There is a notice that any changes to application settings with restart your application. The Continue button is highlighted.":::

---

## Next steps

In this article, you followed the steps to set up a function app in Azure for use with Azure Digital Twins.

Next, see how to build on your basic function to ingest IoT Hub data into Azure Digital Twins:
* [*How-to: Ingest telemetry from IoT Hub*](how-to-ingest-iot-hub-data.md)
