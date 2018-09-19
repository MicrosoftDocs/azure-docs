---
title: Find available rooms with fresh air with Azure Digital Twins quickstart (C#) | Microsoft Docs
description: In this quickstart, you run two .NET Core sample applications to send simulated motion and CO2 telemetry to a space in Azure Digital Twins. The goal is to find available rooms with fresh air from Management APIs after computed processing in the cloud.
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.devlang: csharp
ms.topic: quickstart
ms.custom: mvc
ms.date: 08/30/2018
ms.author: alinast
# As a developer new to Digital Twins, I need to see how to send motion and CO2 telemetry to a space in a Azure Digital Twins and how to find availale rooms with fresh air using a back-end application. 
---

# Quickstart: Use Azure Digital Twins to find availale rooms with fresh air (C#)

In a busy office scenario, it's important to find out available rooms, preferably with the fresh air. This article shows how you can do this using Azure Digital Twins. 

The quickstart uses two sample .NET Core console applications that use the Digital Twins APIs. The first one will send motion and CO2 telemetry to your service, and the second one will provision topology as well as find availale rooms with fresh air. 

Before you run these two applications, you create an Azure Digital Twins service and grant permissions to the applications to read from its Management APIs.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Prerequisites

1. The two console applications you run in this quickstart are written using C#. You need to install [.NET Core SDK](https://www.microsoft.com/net/download) on your development machine.

1. Clone the sample C# projects and change directory to digital-twins-samples-csharp
    ```
    git clone https://github.com/Azure-Samples/digital-twins-samples-csharp.git
    cd digital-twins-samples-csharp
    ```
1. The repo is composed of several standalone projects. Occupancy sample is the suggested starting sample. If using [Visual Studio Code](https://code.visualstudio.com/) we have included a [visual studio code workspace file](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/digital-twins-samples.code-workspace) that will load all samples. Alternatively, each folder can be opened individually.

## Create a Digital Twins instance in Azure Portal

1. Sign in to the [Azure portal](http://portal.azure.com).
1. Select **Create a resource** > **Internet of Things** > **Digital Twins** (or search by **Digital Twins**)
    ![Select to install Digital Twins][1]
1. In the **Digital Twins** pane, enter the following information for your Digital Twins:
   * **Subscription**: Choose the subscription that you want to use to create this Digital Twins instance. 
   * **Resource group**: Select or create a resource group for the Digital Twins instance. For more information on resource groups, see [Use resource groups to manage your Azure resources][lnk-resource-groups].
   * **Location**: Select the closest location to your devices.
   * **Name**: Create a unique name for your Digital Twins. If the name you enter is available, a green check mark appears.
   ![Create Digital Twins][2]
1. Review your Digital Twins information, then click **Create**. Your Digital Twins might take a few minutes to create. You can monitor the progress in the **Notifications** pane.
1. Digital Twins provides a collection of REST APIs for management and interaction with your topology. These APIs are called Management APIs. The URL is generated in the **Overview** section and has the following format `https://[yourDigitalTwinsName].[yourLocation].azuresmartspaces.net/management/swagger`. You will need this URL in the proceeding steps.

## Grant permissions to the console applications to interact with Digital Twins Management APIs
[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-permissions.md)]

## Provision topology
* Follow [these steps](https://github.com/Azure-Samples/digital-twins-samples-csharp/tree/master/occupancy) to provision spaces, IoT Hub resource, devices, sensors and custom functions in Digital Twins topology

## Send motion and CO2 telemetry
* Follow [these steps](https://github.com/Azure-Samples/digital-twins-samples-csharp/tree/master/device-connectivity) to simulate device motion and CO2 telemetry in order to be processed by Digital Twins engine which evaluates the custom function.

## Observe and read unoccupied spaces with good air quality
* Follow [these steps](https://github.com/Azure-Samples/digital-twins-samples-csharp/tree/master/occupancy#readoccupancy) to find if there are available spaces with fresh air

## Clean up resources

The tutorials go into detail about how to build an application for facility managers to increase occupant productivity and to operate the building more efficiently. If you plan to continue to the tutorials, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Delete the folder that was created when cloning the sample repository
2. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources** and then select your Digital Twins resource. At the top of the **All resources** blade, click **Delete**.


## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]

<!-- Images -->
[1]: media/quickstart-view-occupancy-dotnet/create-digital-twins-portal.png
[2]: media/quickstart-view-occupancy-dotnet/create-digital-twins-param.png
