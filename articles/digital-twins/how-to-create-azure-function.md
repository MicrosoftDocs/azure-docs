---
# Mandatory fields.
title: Set up a function in Azure to process data
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

Digital twins can be updated based on data by using [event routes](concepts-route-events.md) through compute resources. For example, a function that's made by using [Azure Functions](../azure-functions/functions-overview.md) can update a digital twin in response to:
* Device telemetry data from Azure IoT Hub.
* A property change or other data from another digital twin within the twin graph.

This article shows you how to create a function in Azure for use with Azure Digital Twins. To create a function, you'll follow these basic steps:

1. Create an Azure Functions project in Visual Studio.
2. Write a function that has an [Azure Event Grid](../event-grid/overview.md) trigger.
3. Add authentication code to the function so you can access Azure Digital Twins.
4. Publish the function app to Azure.
5. Set up [security](concepts-security.md) for the function app.

## Prerequisite: Set up Azure Digital Twins

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

## Create a function app in Visual Studio

In Visual Studio 2019, select **File** > **New** > **Project**. Search for the **Azure Functions** template. Select **Next**.

:::image type="content" source="media/how-to-create-azure-function/create-azure-function-project.png" alt-text="Screenshot of Visual Studio showing the new project dialog. The Azure Functions project template is highlighted.":::

Specify a name for the function app and then select __Create__.

:::image type="content" source="media/how-to-create-azure-function/configure-new-project.png" alt-text="Screenshot of Visual Studio showing the dialog to configure a new project. Settings include project name, save location, choice to create a new solution, and solution name.":::

Select the function app type **Event Grid trigger** and then select __Create__.

:::image type="content" source="media/how-to-create-azure-function/event-grid-trigger-function.png" alt-text="Screenshot of Visual Studio showing the dialog to create a new Azure Functions application. The Event Grid trigger option is highlighted.":::

After your function app is created, Visual Studio generates a code sample in a *Function1.cs* file in your project folder. This short function is used to log events.

:::image type="content" source="media/how-to-create-azure-function/visual-studio-sample-code.png" alt-text="Screenshot of Visual Studio. The project window for the new project is shown. Code for a sample function is shown in a file called Function1." lightbox="media/how-to-create-azure-function/visual-studio-sample-code.png":::

## Write a function that has an Event Grid trigger

You can write a function by adding an SDK to your function app. The function app interacts with Azure Digital Twins by using the [Azure Digital Twins SDK for .NET (C#)](/dotnet/api/overview/azure/digitaltwins/client). 

To use the SDK, you'll need to include the following packages in your project. Install the packages by using the Visual Studio NuGet package manager. Or add the packages by using `dotnet` in a command-line tool.

* [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core/)
* [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/)
* [System.Net.Http](https://www.nuget.org/packages/System.Net.Http/)
* [Azure.Core](https://www.nuget.org/packages/Azure.Core/)

Next, in Visual Studio Solution Explorer, open the _Function1.cs_ file that includes your sample code. Add the following `using` statements for the packages.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="Function_dependencies":::

## Add authentication code to the function

Now declare class-level variables and add authentication code that will allow the function to access Azure Digital Twins. Add the variables and code to your function in the _Function1.cs_ file.

* **Code to read the Azure Digital Twins service URL as an environment variable.** It's a good practice to read the service URL from an environment variable rather than hard-coding it in the function. You'll set the value of this environment variable [later in this article](#set-up-security-access-for-the-function-app). For more information about environment variables, see [Manage your function app](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal).

    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="ADT_service_URL":::

* **A static variable to hold an HttpClient instance.** HttpClient is relatively expensive to create, so we want to avoid creating it for every function invocation.

    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="HTTP_client":::

* **Managed identity credentials.**
    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="ManagedIdentityCredential":::

* **A local variable _DigitalTwinsClient_.** Add the variable inside your function to hold your Azure Digital Twins client instance. Do *not* make this variable static inside your class.
    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="DigitalTwinsClient":::

* **A null check for _adtInstanceUrl_.** Add the null check and then wrap your function logic in a try/catch block to catch any exceptions.

After these changes, your function code will look like the following example.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs":::

Now that your application is written, you can publish it to Azure.

## Publish the function app to Azure

[!INCLUDE [digital-twins-publish-azure-function.md](../../includes/digital-twins-publish-azure-function.md)]

### Verify the publication of your function

1. Sign in by using your credentials in the [Azure portal](https://portal.azure.com/).
2. In the search box at the top of the window, search for your function app name and then select it.

    :::image type="content" source="media/how-to-create-azure-function/search-function-app.png" alt-text="Screenshot showing the Azure portal. In the search field, enter the function app name." lightbox="media/how-to-create-azure-function/search-function-app.png":::

3. On the **Function app** page that opens, in the menu on the left, choose **Functions**. If your function is successfully published, its name appears in the list.

    > [!Note] 
    > You might have to wait a few minutes or refresh the page couple of times before your function appears in the list of published functions.

    :::image type="content" source="media/how-to-create-azure-function/view-published-functions.png" alt-text="View published functions in the Azure portal." lightbox="media/how-to-create-azure-function/view-published-functions.png":::

To access Azure Digital Twins, your function app needs a system-managed identity with permissions to access your Azure Digital Twins instance. You'll set that up next.

## Set up security access for the function app

You can set up security access for the function app by using either the Azure CLI or the Azure portal. Follow the steps for your preferred option.

# [CLI](#tab/cli)

Run these commands in [Azure Cloud Shell](https://shell.azure.com) or a [local Azure CLI installation](/cli/azure/install-azure-cli).
You can use the function app's system-managed identity to give it the **Azure Digital Twins Data Owner** role for your Azure Digital Twins instance. The role gives the function app permission in the instance to perform data plane activities. Then make the URL of the instance accessible to your function by setting an environment variable.

### Assign an access role

[!INCLUDE [digital-twins-permissions-required.md](../../includes/digital-twins-permissions-required.md)]

The function skeleton in earlier examples requires a bearer token to be passed to it. If the bearer token isn't passed, the function app can't authenticate with Azure Digital Twins. 

To make sure the bearer token is passed, set up [managed identities](../active-directory/managed-identities-azure-resources/overview.md) permissions so the function app can access Azure Digital Twins. You set up these permissions only once for each function app.


1. Use the following command to see the details of the system-managed identity for the function. Take note of the `principalId` field in the output.

    ```azurecli-interactive	
    az functionapp identity show -g <your-resource-group> -n <your-App-Service-(function-app)-name>	
    ```

    >[!NOTE]
    > If the result is empty instead of showing identity details, create a new system-managed identity for the function by using this command:
    > 
    >```azurecli-interactive	
    >az functionapp identity assign -g <your-resource-group> -n <your-App-Service-(function-app)-name>	
    >```
    >
    > The output displays details of the identity, including the `principalId` value required for the next step. 

1. Use the `principalId` value in the following command to assign the function app's identity to the _Azure Digital Twins Data Owner_ role for your Azure Digital Twins instance.

    ```azurecli-interactive	
    az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<principal-ID>" --role "Azure Digital Twins Data Owner"
    ```

### Configure application settings

Make the URL of your instance accessible to your function by setting an environment variable for it. For more information about environment variables, see [Manage your function app](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal). 

> [!TIP]
> The Azure Digital Twins instance's URL is made by adding *https://* to the beginning of your instance's host name. To see the host name, along with all the properties of your instance, run `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

```azurecli-interactive	
az functionapp config appsettings set -g <your-resource-group> -n <your-App-Service-(function-app)-name> --settings "ADT_SERVICE_URL=https://<your-Azure-Digital-Twins-instance-host-name>"
```

# [Azure portal](#tab/portal)

Complete the following steps in the [Azure portal](https://portal.azure.com/).

### Assign an access role

[!INCLUDE [digital-twins-permissions-required.md](../../includes/digital-twins-permissions-required.md)]

A system-assigned managed identity enables Azure resources to authenticate to cloud services (for example, Azure Key Vault) without storing credentials in code. After you enable system-assigned managed identity, all necessary permissions can be granted through Azure role-based access control. 

The lifecycle of this type of managed identity is tied to the lifecycle of this resource. Additionally, each resource can have only one system-assigned managed identity.

1. In the [Azure portal](https://portal.azure.com/), search for your function app by typing its name in the search box. Select your app from the results. 

    :::image type="content" source="media/how-to-create-azure-function/portal-search-for-function-app.png" alt-text="Screenshot of the Azure portal. The function app's name is in the portal search bar, and the search result is highlighted.":::

1. On the function app page, in the menu on the left, select __Identity__ to work with a managed identity for the function. On the __System assigned__ page, verify that the __Status__ is set to **On**. If it's not, set it now and then **Save** the change.

    :::image type="content" source="media/how-to-create-azure-function/verify-system-managed-identity.png" alt-text="Screenshot of the Azure portal. On the Identity page for the function app, the Status option is set to On." lightbox="media/how-to-create-azure-function/verify-system-managed-identity.png":::

1. Select __Azure role assignments__.

    :::image type="content" source="media/how-to-create-azure-function/add-role-assignment-1.png" alt-text="Screenshot of the Azure portal. On the Azure Function's Identity page, under Permissions, the button Azure role assignments is highlighted." lightbox="media/how-to-create-azure-function/add-role-assignment-1.png":::

    Select __+ Add role assignment (Preview)__.

    :::image type="content" source="media/how-to-create-azure-function/add-role-assignment-2.png" alt-text="Screenshot of the Azure portal. On the Azure role assignments page, the button Add role assignment (Preview) is highlighted." lightbox="media/how-to-create-azure-function/add-role-assignment-2.png":::

1. On the __Add role assignment (Preview)__ page, select the following values:

    * **Scope**: _Resource group_
    * **Subscription**: Select your Azure subscription.
    * **Resource group**: Select your resource group.
    * **Role**: _Azure Digital Twins Data Owner_

    Save the details by selecting __Save__.

    :::image type="content" source="media/how-to-create-azure-function/add-role-assignment-3.png" alt-text="Screenshot of the Azure portal, showing how to add a new role assignment. The dialog shows fields for the Scope, Subscription, Resource group, and Role.":::

### Configure application settings

To make the URL of your Azure Digital Twins instance accessible to your function, you can set an environment variable. Application settings are exposed as environment variables to allow access to the Azure Digital Twins instance. For more information about environment variables, see [Manage your function app](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal). 

To set an environment variable with the URL of your instance, first find your instance's host name: 

1. Search for your instance in the [Azure portal](https://portal.azure.com). 
1. In the menu on the left, select __Overview__. 
1. Copy the __Host name__ value.

    :::image type="content" source="media/how-to-create-azure-function/instance-host-name.png" alt-text="Screenshot of the Azure portal. On the instance's Overview page, the host name value is highlighted.":::

You can now create an application setting:

1. In the portal search bar, search for your function app and then select it from the results.

    :::image type="content" source="media/how-to-create-azure-function/portal-search-for-function-app.png" alt-text="Screenshot of the Azure portal. The function app's name is being searched in the portal search bar. The search result is highlighted.":::

1. On the left, select __Configuration__. Then on the __Application settings__ tab, select __+ New application setting__.

    :::image type="content" source="media/how-to-create-azure-function/application-setting.png" alt-text="Screenshot of the Azure portal. On the Configuration tab for the function app, the button to create a New application setting is highlighted.":::

1. In the window that opens, use the host name value you copied to create an application setting.
    * **Name**: ADT_SERVICE_URL
    * **Value**: https://{your-azure-digital-twins-host-name}
    
    Select __OK__ to create an application setting.
    
    :::image type="content" source="media/how-to-create-azure-function/add-application-setting.png" alt-text="Screenshot of the Azure portal. On the Add/Edit application setting page, the Name and Value fields are filled out. The O K button is highlighted.":::

1. After you create the setting, it should appear on the __Application settings__ tab. Verify that **ADT_SERVICE_URL** appears on the list. Then save the new application setting by selecting __Save__.

    :::image type="content" source="media/how-to-create-azure-function/application-setting-save-details.png" alt-text="Screenshot of the Azure portal. On the application settings tab, the new A D T SERVICE U R L setting is highlighted. The Save button is also highlighted.":::

1. Any changes to the application settings require an application restart, so select __Continue__ to restart your application when prompted.

    :::image type="content" source="media/how-to-create-azure-function/save-application-setting.png" alt-text="Screenshot of the Azure portal. A note states that any changes to application settings will restart your application. The Continue button is highlighted.":::

---

## Next steps

In this article, you set up a function app in Azure for use with Azure Digital Twins. Next, see how to build on your basic function to [ingest IoT Hub data into Azure Digital Twins](how-to-ingest-iot-hub-data.md).
