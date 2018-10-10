---
title: Find available rooms with fresh air with Azure Digital Twins quickstart (C#) | Microsoft Docs
description: In this quickstart, you run two .NET Core sample applications to send simulated motion and carbon dioxide telemetry to a space in Azure Digital Twins. The goal is to find available rooms with fresh air from Management APIs after computed processing in the cloud.
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.devlang: csharp
ms.topic: quickstart
ms.custom: mvc
ms.date: 10/02/2018
ms.author: alinast
# As a developer new to Digital Twins, I need to see how to send motion and carbon dioxide telemetry to a space in a Azure Digital Twins and how to find available rooms with fresh air using a back-end application. 
---

# Quickstart: Find available rooms with fresh air using Azure Digital Twins

As an employee in a busy office, it's important to find available rooms that fit your needs where you can be productive. [Research has shown](https://www.wsj.com/articles/why-office-buildings-should-run-like-spaceships-1507467601) that air quality in rooms can have a significant impact on strategic, creative, and collaborative thinking. With Azure Digital Twins, not only can you find available rooms, but you can also find rooms where the air quality will be optimal for your safety and productivity.

This article shows how you can achieve both goals using Azure Digital Twins. The [quickstart code](https://github.com/Azure-Samples/digital-twins-samples-csharp) demonstrates two sample .NET Core console applications that use the Digital Twins APIs. The first one provisions a simple spatial graph in your Digital Twins instance. The second sample sends motion and carbon dioxide telemetry to that spatial graph. Together, these samples will find available rooms with fresh air based on real-time sensor data through Digital Twins.

## Prerequisites

1. If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

1. The two console applications you run in this quickstart are written using C#. You will need to install [.NET Core SDK 2.1 or above](https://www.microsoft.com/net/download) on your development machine. If you have .NET Core SDK installed, you can verify the current version of C# on your development machine running the `dotnet --version` in a command prompt.

1. Download the [sample C# project](https://github.com/Azure-Samples/digital-twins-samples-csharp/archive/master.zip) and extract the digital-twins-samples-csharp-master.zip archive. 


## Create a Digital Twins instance

Create a new instance of the Digital Twins in the [portal](https://portal.azure.com) using the steps in this section.

[!INCLUDE [create-digital-twins-portal](../../includes/create-digital-twins-portal.md)]

## Set permissions for your app

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-permissions.md)]


## Build application

Build the occupancy application using the following steps:

1. Open a command prompt and navigate to the folder to which your digital-twins-samples-csharp-master.zip files were extracted.
1. Run `cd occupancy-quickstart/src`.
1. Run `dotnet restore`.
1. Edit *appSettings.json* to update the following variables:
    - *ClientId*: Enter the *Application ID* of your AAD app registration, noted in the preceding section.
    - *Tenant*: Enter the *Directory Id* of your AAD tenant, also noted in the previous section.
    - *BaseUrl*: The *Management API* URL of your Digital Twins instance, which will be in the following format `https://yourDigitalTwinsName.yourLocation.azuresmartspaces.net/management/api/v1.0/`. Replace the placeholders in this URL with values for your instance from previous section.

## Provision graph

This step provisions your Digital Twins spatial graph with several spaces, one device, two sensors, a custom function and one role assignment. The spatial graph will be provisioned using [*provisionSample.yaml*](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/actions/provisionSample.yaml) file.

1. Run `dotnet run ProvisionSample`.
    >[!NOTE]
    >We use Device Login Azure CLI tool to authenticate the user to Azure AD. The user needs to enter a given code to authenticate using [the Microsoft login](https://microsoft.com/devicelogin) page. After code is entered, follow steps to authenticate. The user is requested to authenticate every time when the tool is running.
    
    >[!TIP]
    > If you are getting the following error when running this step, please check to make sure your variables were copied properly. 
    > `EXIT: Unexpected error: The input is not a valid Base-64 string ...`


1. The provisioning step might take few minutes or so. It will also provision an IoT Hub within your Digital Twins instance and it will loop through until IoTHub has Status=`Running`.

    ![Provision Sample][4]

1. At the end of the execution, copy the `ConnectionString` of the device for use in device simulator sample. Copy only the string outlined in image below:

    ![Provision Sample][1]

## Send sensor telemetry

You can build and run the sensor simulator application using the steps below:

1. Open a new command prompt and navigate to the project you've downloaded, in digital-twins-samples-csharp-master folder.
1. Run `cd device-connectivity`.
1. Run `dotnet restore`.
1. Edit *appsettings.json* to update *DeviceConnectionString* with the `ConnectionString` above.
1. Run `dotnet run` to start sending telemetry, you should see telemetry being sent to Digital Twins service as in the image below:

     ![Device Connectivity][2]

1. Let this simulator run so you can view results side by side with the next step action. This window will show you the simulated sensor data sent to Digital Twins and the next step will query in real time to find available rooms with fresh air.

    >[!TIP]
    > If you are getting the following error when running this step, please check to make sure your `DeviceConnectionString` was copied properly.  
    > `EXIT: Unexpected error: The input is not a valid Base-64 string ...`

## Find available spaces with fresh air

The sensor telemetry sample is simulating random data values for two sensors, motion, and carbon dioxide. Available spaces with fresh air are defined in our sample by no presence in the room and carbon dioxide level is under 1000 ppm. If the condition is not fulfilled, then the space is not available, or the air quality is poor.

1. Open the command prompt you used to run the provisioning step above.
1. Run `dotnet run GetAvailableAndFreshSpaces`.
1. Look at this command prompt and the sensor telemetry command prompt side by side as outlined below. 
1. One command prompt sends simulated motion and carbon dioxide telemetry to Digital Twins every 5 seconds. The other command reads in real time the graph to find out available rooms with fresh air based on random simulated data. It will display one of these conditions in near real time based on what the sensor telemetry has last sent:
    - Available rooms with fresh air.
    - Occupied or poor air quality of the room.

     ![Get available spaces with fresh air][3]

To understand what happened in this quickstart and what APIs have been called, open [Visual Studio Code](https://code.visualstudio.com/Download) with the code workspace project found in the digital-twins-samples-csharp (see command below). The tutorials are going deep into the code and teach you how to modify configuration data and what APIs are called. For more understanding of Management APIs navigate your Digital Twins Swagger page `https://yourDigitalTwinsName.yourLocation.azuresmartspaces.net//management/swagger` or for convience browse [Digital Twins Swagger](https://docs.westcentralus.azuresmartspaces.net/management/swagger). 

```
<path>\occupancy-quickstart\src>code ..\..\digital-twins-samples.code-workspace
```

## Clean up resources

The tutorials go into detail about how to build an application for facility managers to increase occupant productivity and to operate the building more efficiently.

If you plan to continue to the tutorials, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart:

1. Delete the folder that was created when downloading the sample repository.
1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources** and then select your Digital Twins resource. At the top of the **All resources** blade, click **Delete**.

## Next steps

If you haven't cleaned up the resources, and you wish to learn step-by-step code tutorial on how to provision the spatial graph and how to monitor for custom business logic, proceed to the following tutorial:

> [!div class="nextstepaction"]
> [Provision a sample building](tutorial-facilities-setup.md)

If you want to continue this quickstart and want to learn how to egress events out of Digital Twins and how to send email notification when poor air quality is detected in rooms, proceed to the following tutorial:

> [!div class="nextstepaction"]
> [Receive notifications from your building](tutorial-facilities-events.md)

<!-- Images -->
[1]: media/quickstart-view-occupancy-dotnet/digital-twins-provision-sample.png
[2]: media/quickstart-view-occupancy-dotnet/digital-twins-device-connectivity.png
[3]: media/quickstart-view-occupancy-dotnet/digital-twins-get-available.png
[4]: media/quickstart-view-occupancy-dotnet/digital-twins-provision-sample1.png
