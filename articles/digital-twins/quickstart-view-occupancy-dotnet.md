---
title: Find available rooms with fresh air with Azure Digital Twins quickstart (C#) | Microsoft Docs
description: In this quickstart, you run two .NET Core sample applications to send simulated motion telemetry to a space in Azure Digital Twins. The goal is to find available rooms with fresh air from Management APIs after computed processing in the cloud.
author: alinamstanciu
manager: bertvanhoof
ms.service: azure-digital-twins
services: azure-digital-twins
ms.devlang: csharp
ms.topic: quickstart
ms.custom: mvc
ms.date: 09/21/2018
ms.author: alinast
# As a developer new to Digital Twins, I need to see how to send motion telemetry to a space in a Azure Digital Twins and how to find available rooms with fresh air using a back-end application. 
---

# Use Azure Digital Twins to find available rooms with fresh air (C#)

In a busy office scenario, it's important to find out available rooms and preferably those with fresh air. This article shows how you can do that using Azure Digital Twins.

The [quickstart](https://github.com/Azure-Samples/digital-twins-samples-csharp) uses two sample .NET Core console applications that use the Digital Twins APIs. The first one will send motion and CO2 telemetry to your service, and the second one will provision graph as well as find available rooms with fresh air.

Before you run these two applications, you create an Azure Digital Twins service and grant permissions to the applications to read from its Management APIs.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

1. The two console applications you run in this quickstart are written using C#. You need to install [.NET Core SDK](https://www.microsoft.com/net/download) on your development machine.

1. Clone the sample C# projects repo:
    ```bash
    git clone https://github.com/Azure-Samples/digital-twins-samples-csharp.git
    ```

## Create a Digital Twins instance in Azure Portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Create a resource** > **Internet of Things** > **Digital Twins** (or search by **Digital Twins**).

    ![Select to install Digital Twins][1]

1. In the **Digital Twins** pane, enter the following information for your Digital Twins:

   * **Subscription**: Choose the subscription that you want to use to create this Digital Twins instance.
   * **Resource group**: Select or create a resource group for the Digital Twins instance. For more information on resource groups, see [Use resource groups to manage your Azure resources][lnk-resource-groups].
   * **Location**: Select the closest location to your devices.
   * **Name**: Create a unique name for your Digital Twins. If the name you enter is available, a green check mark appears.

   ![Create Digital Twins][2]

1. Review your Digital Twins information, then click **Create**. Your Digital Twins might take a few minutes to create. You can monitor the progress in the **Notifications** pane.

1. Digital Twins provides a collection of REST APIs for management and interaction with your topology. These APIs are called Management APIs.

The URL is generated in the **Overview** section and has the following format: `https://[yourDigitalTwinsName].[yourLocation].azuresmartspaces.net/management/swagger`. You will need this URL in the proceeding steps.

## Grant permissions to the console applications to interact with Digital Twins Management APIs

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-permissions.md)]

## Build application

You can build and run the occupancy application using the outlined steps:
1. Open a command prompt, and navigate to the project you've cloned.
1. Run `cd occupancy-quickstart/src` 
1. Run `dotnet restore`
1. Edit _appsettings.json_ to update the following variables to match your Digital Twins instance:
    - `ClientId` with the value from previous step
    - `Tenant` with the value from previous step
    - `BaseUrl`, for example `https://[yourDigitalTwinsName].[yourLocation].azuresmartspaces.net/management/api/v1.0/`
1. Run `dotnet run` to build and see application usage

## Provision graph

This step provisions in your graph few spaces, one device, two sensors, one matcher, one user-defined function and one role assignment.
1. Run `dotnet run ProvisionSample`
    >[!NOTE]
    >Running provisioning might take a minute or so, IoT Hub will be provisoned.
1. After running this step, copy the `ConnectionString` of the device for use in device simulator sample. See image below
    ![Provision Sample][3]

## Send sensor telemetry

You can build and run the sensor simulator application using the outlined steps:
1. Open a new command prompt, and navigate to the project you've cloned.
1. Run `cd device-connectivity` 
1. Run `dotnet restore`
1. Edit _appsettings.json_ to update the following variables to match your Digital Twins instance:
    - `DeviceConnectionString` with the `ConnectionString` above.
1. Run `dotnet run` to start sending telemetry, you should see telemetry being sent to Digital Twins service as in image below

 ![Device Connectivity][4]

## Observe and read unoccupied spaces with good air quality
1. Go to the occupancy-quickstart command prompt
1. Run `dotnet run GetOccupancy`
1. You should see available spaces as outlined in image.
    >[!NOTE]
    >Add image when this is working

## Clean up resources

The tutorials go into detail about how to build an application for facility managers to increase occupant productivity and to operate the building more efficiently.

If you plan to continue to the tutorials, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Delete the folder that was created when cloning the sample repository.
1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources** and then select your Digital Twins resource. At the top of the **All resources** blade, click **Delete**.

## Next steps

See full code samples:

> [!div class="nextstepaction"]
> [C# code samples](https://github.com/Azure-Samples/digital-twins-samples-csharp)

<!-- Images -->
[1]: media/quickstart-view-occupancy-dotnet/create-digital-twins-portal.png
[2]: media/quickstart-view-occupancy-dotnet/create-digital-twins-param.png
[3]: media/quickstart-view-occupancy-dotnet/digital-twins-provision-sample.png
[4]: media/quickstart-view-occupancy-dotnet/digital-twins-device-connectivity.png
