---
title: Detect unoccupied spaces with good air quality in Azure Digital Twins quickstart (C#) | Microsoft Docs
description: In this quickstart, you run two .NET Core sample applications to send simulated motion and CO2 telemetry to a space in Azure Digital Twins and to detect unoccupied spaces with good air quality from management APIs after computed processing in the cloud.
author: alinamstanciu
manager: bertv
ms.service: digital-twins
services: digital-twins
ms.devlang: csharp
ms.topic: quickstart
ms.custom: mvc
ms.date: 08/30/2018
ms.author: alinast
# As a developer new to Digital Twins, I need to see how to send motion and CO2 telemetry to a space in a Azure Digital Twins and how to detect unoccupied spaces with good air quality using a back-end application. 
---

# Quickstart: Detect unoccupied spaces with good air quality using Azure Digital Twins (C#)

This article demonstrates the capabilities of Azure Digital Twins to run custom computation on the telemetry data that is sent from devices and sensors. It walks you through the basic steps of sending motion and CO2 from a simulated device living in a space and detecting unoccupied spaces with good air quality. 

The quickstart uses two pre-written .NET Core console applications
- One to send the motion and CO2 telemetry to Digital Twins service
- One to provision topology and read unoccupied spaces with good air quality from Digital Twins Management API. 

Before you run these two applications, you create a Azure Digital Twins and grant permissions to the applications to read from Azure Digital Twins Management APIs.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Prerequisites

- The two console applications you run in this quickstart are written using C#. You need the [.NET Core SDK 2.1.0](https://www.microsoft.com/net/download) or greater on your development machine.

- You can verify the current version of C# on your development machine using the following command:

  ```cmd/sh
  dotnet --version
  ```

- Clone the sample C# projects from https://github.com/Azure-Samples/azure-iot-samples-csharp/
  ```
  git clone https://github.com/Azure-Samples/digital-twins-samples-csharp.git
  ```

## Create a Digital Twins in Azure Portal

>TODO: Move Create a Digital Twins in Azure Portal in its own file, it will be shared across documentaton.
1. Sign in to the [Azure portal](http://portal.azure.com).

1. Select **Create a resource** > **Internet of Things** > **Digital Twins** (or just search by **Digital Twins**)

    ![Select to install Digital Twins][1]

1. In the **Digital Twins** pane, enter the following information for your Digital Twins:

   * **Subscription**: Choose the subscription that you want to use to create this Digital Twins instance. 
   * **Resource group**: Create a resource group to contain the Digital Twins or use an existing one. By putting all related resources in a group together, such as **TestResources**, you can manage them all together. For example, deleting the resource group deletes all resources contained in that group. For more information, see [Use resource groups to manage your Azure resources][lnk-resource-groups].
   * **Region**: Select the closest location to your devices.
   * **Name**: Create a unique name for your Digital Twins. If the name you enter is available, a green check mark appears.

   ![Create Digital Twins][2]

1. Review your Digital Twins information, then click **Create**. Your Digital Twins might take a few minutes to create. You can monitor the progress in the **Notifications** pane.
1. Digital Twins creates Digital Twins Management APIs which are the REST API to interact wity topology. The url is generated in portal in **Overview section** and has following format https://{resourceName}.{location}.azuresmartspaces.net/management/swagger. Enter this URL in your Chrom or Edge browser and make sure it works.

## Grant permissions to the console applications to interact with Digital Twins
* Follow [these steps](/digital-twins-permissions.md) to grant permissions to your console applications to interact with Digital Twins Management APIs.

## Provision topology
* Follow [these steps](https://github.com/Azure-Samples/digital-twins-samples-csharp/tree/master/occupancy) to provision spaces, IoT Hub resource, devices, sensors and custom functions in Digital Twins topology
>TODO: Show screenshot

## Create a custom function
* This is [the step](https://github.com/Azure-Samples/digital-twins-samples-csharp/tree/master/occupancy#function) to create a custom user-defined-function that allows to process your sensor telemetry. The function will compute motion and CO2 signals from multiple sensors in order to detect if space is unoccupied and it has good air quality (CO2 level less than 1000 ppm).
>TODO: Show screenshot

## Send motion and CO2 telemetry
* Follow [these steps](https://github.com/Azure-Samples/digital-twins-samples-csharp/tree/master/device-connectivity) to simulate device motion and CO2 telemetry in order to be processed by Digital Twins engine which evaluates the custom function.
>TODO: Show screenshot

## Observe and read unoccupied spaces with good air quality
* Follow [these steps](https://github.com/Azure-Samples/digital-twins-samples-csharp/tree/master/occupancy#readoccupancy) to detect if there are unoccupied spaces with good air quality
>TODO: Show screenshot

## Clean up resources

The tutorials go into detail about how to build an application for facility managers to increase occupant productivity and to operate the building more efficiently. If you plan to continue to the tutorials, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Delete the folder that was created when cloning the sample repository
2. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources** and then select your Digital Twins resource. At the top of the **All resources** blade, click **Delete**.


## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](tutorial-facilities-app.md)

<!--- Required:
Quickstarts should always have a Next steps H2 that points to the next logical quickstart in a series, or, if there are no other quickstarts, to some other cool thing the customer can do. A single link in the blue box format should direct the customer to the next article - and you can shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also section". --->

<!-- Images -->
[1]: /media/quickstart-view-occupancy-dotnet/CreateDigitalTwinsFromPortal.png
[2]: /media/quickstart-view-occupancy-dotnet/CreateDigitalTwinsParam.png