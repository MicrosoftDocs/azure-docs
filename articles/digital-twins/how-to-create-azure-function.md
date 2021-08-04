---
# Mandatory fields.
title: Set up a function in Azure to process data
titleSuffix: Azure Digital Twins
description: See how to create a function in Azure that can access and be triggered by digital twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/14/2021
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

For instructions on how to create a function app using Visual Studio, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure).

## Write a function that has an Event Grid trigger

You can write a function by adding an SDK to your function app. The function app interacts with Azure Digital Twins by using the [Azure Digital Twins SDK for .NET (C#)](/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet&preserve-view=true). 

To use the SDK, you'll need to include the following packages in your project. Install the packages by using the Visual Studio NuGet package manager. Or add the packages by using `dotnet` in a command-line tool.

* [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core/)
* [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/)
* [System.Net.Http](https://www.nuget.org/packages/System.Net.Http/)
* [Azure.Core](https://www.nuget.org/packages/Azure.Core/)

Next, in Visual Studio Solution Explorer, open the _.cs_ file that includes your sample code. Add the following `using` statements for the packages.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="Function_dependencies":::

## Add authentication code to the function

Now declare class-level variables and add authentication code that will allow the function to access Azure Digital Twins. Add the variables and code to your function.

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

For instructions on how to publish a function app, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure).

### Verify the publication of your function

1. Sign in by using your credentials in the [Azure portal](https://portal.azure.com/).
2. In the search box at the top of the window, search for your function app name and then select it.

    :::image type="content" source="media/how-to-create-azure-function/search-function-app.png" alt-text="Screenshot showing the Azure portal. In the search field, enter the function app name." lightbox="media/how-to-create-azure-function/search-function-app.png":::

3. On the **Function app** page that opens, in the menu on the left, choose **Functions**. If your function is successfully published, its name appears in the list.

    > [!Note] 
    > You might have to wait a few minutes or refresh the page couple of times before your function appears in the list of published functions.

    :::image type="content" source="media/how-to-create-azure-function/view-published-functions.png" alt-text="Screenshot showing published functions in the Azure portal." lightbox="media/how-to-create-azure-function/view-published-functions.png":::

To access Azure Digital Twins, your function app needs a system-managed identity with permissions to access your Azure Digital Twins instance. You'll set that up next.

## Set up security access for the function app

[!INCLUDE [digital-twins-configure-function-app.md](../../includes/digital-twins-configure-function-app.md)]

## Next steps

In this article, you set up a function app in Azure for use with Azure Digital Twins. Next, see how to build on your basic function to [ingest IoT Hub data into Azure Digital Twins](how-to-ingest-iot-hub-data.md).
