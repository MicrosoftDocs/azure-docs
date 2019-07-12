---
title: 'Find available rooms - Azure Digital Twins | Microsoft Docs'
description: In this quickstart, you run two .NET Core sample applications to send simulated motion and carbon dioxide telemetry to a space in Azure Digital Twins. The goal is to find available rooms with fresh air from Management APIs after computed processing in the cloud.
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.devlang: csharp
ms.topic: quickstart
ms.custom: mvc seodec18
ms.date: 06/26/2019
ms.author: alinast
# As a developer new to Azure Digital Twins, I need to see how to send motion and carbon dioxide telemetry to a space in Azure Digital Twins and how to find available rooms with fresh air by using a back-end application. 
---

# Quickstart: Find available rooms by using Azure Digital Twins

The Azure Digital Twins service allows you to re-create a digital image of your physical environment. You can then get notified by events in your environment and customize your responses to them.

This quickstart uses [a pair of .NET samples](https://github.com/Azure-Samples/digital-twins-samples-csharp) to digitize an imaginary office building. It shows you how to find available rooms in that building. With Digital Twins, you can associate many sensors with your environment. You also can find out if the air quality of your available room is optimal with the help of a simulated sensor for carbon dioxide. One of the sample applications generates random sensor data to help you visualize this scenario.

The following video summarizes quickstart setup:

>[!VIDEO https://www.youtube.com/embed/1izK266tbMI]

## Prerequisites

1. If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

1. The two console applications you run in this quickstart are written by using C#. Install the [.NET Core SDK version 2.1.403 or above](https://www.microsoft.com/net/download) on your development machine. If you have the .NET Core SDK installed, verify the current version of C# on your development machine. Run `dotnet --version` in a command prompt.

1. Download the [sample C# project](https://github.com/Azure-Samples/digital-twins-samples-csharp/archive/master.zip). Extract the digital-twins-samples-csharp-master.zip archive.

## Create a Digital Twins instance

Create a new instance of Digital Twins in the [portal](https://portal.azure.com) by following the steps in this section.

[!INCLUDE [create-digital-twins-portal](../../includes/digital-twins-create-portal.md)]

## Set permissions for your app

This section registers your sample application to Azure Active Directory (Azure AD) so that it can access your Digital Twins instance. If you already have an Azure AD app registration, reuse it for your sample. Make sure that it's configured as described in this section.

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-permissions.md)]

## Build application

Build the occupancy application by following these steps.

1. Open a command prompt. Go to the folder where your `digital-twins-samples-csharp-master.zip` files were extracted.
1. Run `cd occupancy-quickstart/src`.
1. Run `dotnet restore`.
1. Edit [appSettings.json](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/appSettings.json) to update the following variables:
    - **ClientId**: Enter the Application ID of your Azure AD app registration, noted in the preceding section.
    - **Tenant**: Enter the Directory ID of your Azure AD tenant, also noted in the previous section.
    - **BaseUrl**: The Management API URL of your Digital Twins instance is in the format `https://yourDigitalTwinsName.yourLocation.azuresmartspaces.net/management/api/v1.0/`. Replace the placeholders in this URL with values for your instance from the previous section.

## Provision graph

This step provisions your Digital Twins spatial graph with:

- Several spaces.
- One device.
- Two sensors.
- A custom function.
- One role assignment.

The spatial graph is provisioned by using the [provisionSample.yaml](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/actions/provisionSample.yaml) file.

1. Run `dotnet run ProvisionSample`.
    >[!NOTE]
    >The Device Login Azure CLI tool is used to authenticate the user to Azure AD. The user must enter a given code to authenticate by using [the Microsoft login](https://microsoft.com/devicelogin) page. After code is entered, follow the steps to authenticate. The user must authenticate when the tool is running.

    >[!TIP]
    > When you run this step, make sure your variables were copied properly if the following error message appears:
    > `EXIT: Unexpected error: The input is not a valid Base-64 string ...`

1. The provisioning step might take a few minutes. It also provisions an IoT Hub within your Digital Twins instance. It loops through until the IoT Hub shows Status=`Running`.

    ![Provision sample][4]

1. At the end of the execution, copy the `ConnectionString` of the device for use in the device simulator sample. Copy only the string outlined in this image.

    ![Provision sample][1]

    >[!TIP]
    > You can view and modify your spatial graph using the [Azure Digital Twins Graph Viewer](https://github.com/Azure/azure-digital-twins-graph-viewer).

## Send sensor data

Build and run the sensor simulator application by following these steps.

1. Open a new command prompt. Go to the project you downloaded in the digital-twins-samples-csharp-master folder.
1. Run `cd device-connectivity`.
1. Run `dotnet restore`.
1. Edit [appsettings.json](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/device-connectivity/appsettings.json) to update **DeviceConnectionString** with the previous `ConnectionString`.
1. Run `dotnet run` to start sending sensor data. You see it sent to Digital Twins as shown in the following image.

     ![Device Connectivity][2]

1. Let this simulator run so that you can view results side by side with the next step action. This window shows you the simulated sensor data sent to Digital Twins. The next step queries in real time to find available rooms with fresh air.

    >[!TIP]
    > When you run this step, make sure `DeviceConnectionString` was copied properly if the following error message appears:
    > `EXIT: Unexpected error: The input is not a valid Base-64 string ...`

## Find available spaces with fresh air

The sensor sample simulates random data values for two sensors. They're motion and carbon dioxide. Available spaces with fresh air are defined in the sample by no presence in the room. They're also defined by a carbon dioxide level under 1,000 ppm. If the condition isn't fulfilled, the space isn't available or the air quality is poor.

1. Open the command prompt you used to run the previous provisioning step.
1. Run `dotnet run GetAvailableAndFreshSpaces`.
1. Look at this command prompt and the sensor data command prompt side by side.

    One command prompt sends simulated motion and carbon dioxide data to Digital Twins every five seconds. The other command reads the graph in real time to find out available rooms with fresh air based on random simulated data. It displays one of these conditions in near real time based on the sensor data that was sent last:
   - Available rooms with fresh air.
   - Occupied or poor air quality of the room.

     ![Get available spaces with fresh air][3]

To understand what happened in this quickstart and what APIs were called, open [Visual Studio Code](https://code.visualstudio.com/Download) with the code workspace project found in digital-twins-samples-csharp. Use the following command:

```plaintext
<path>\occupancy-quickstart\src>code ..\..\digital-twins-samples.code-workspace
```

The tutorials go deep into the code. They teach you how to modify configuration data and what APIs are called. For more information on Management APIs, go to your Digital Twins Swagger page:

```plaintext
https://YOUR_INSTANCE_NAME.YOUR_LOCATION.azuresmartspaces.net/management/swagger
```

| Name | Replace with |
| --- | --- |
| YOUR_INSTANCE_NAME | The name of your Digital Twins instance |
| YOUR_LOCATION | Which server region your instance is hosted on |

Or for convenience, browse to [Digital Twins Swagger](https://docs.westcentralus.azuresmartspaces.net/management/swagger).

## Clean up resources

The tutorials go into detail about how to:

- Build an application for facility managers to increase occupant productivity.
- Operate the building more efficiently.

To continue to the tutorials, don't clean up the resources created in this quickstart. If you don't plan to continue, delete all the resources created by this quickstart.

1. Delete the folder that was created when you downloaded the sample repository.
1. From the menu on the left in the [Azure portal](https://portal.azure.com), select **All resources**. Then select your Digital Twins resource. At the top of the **All resources** pane, select **Delete**.

    > [!TIP]
    > If you experienced trouble deleting your Digital Twins instance, a service update has been rolled out with the fix. Please retry deleting your instance.

## Next steps

This quickstart used a simple scenario to show how to find rooms with good working conditions. For in-depth analysis of this scenario, see this tutorial:

>[!div class="nextstepaction"]
>[Tutorial: Deploy Azure Digital Twins and configure a spatial graph](tutorial-facilities-setup.md)

<!-- Images -->
[1]: media/quickstart-view-occupancy-dotnet/digital-twins-provision-sample.png
[2]: media/quickstart-view-occupancy-dotnet/digital-twins-device-connectivity.png
[3]: media/quickstart-view-occupancy-dotnet/digital-twins-get-available.png
[4]: media/quickstart-view-occupancy-dotnet/digital-twins-provision-sample1.png
