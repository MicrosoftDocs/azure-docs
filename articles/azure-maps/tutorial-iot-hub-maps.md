---
title: 'Tutorial: Implement IoT spatial analytics with Microsoft Azure Maps'
description: Integrate IoT Hub with Microsoft Azure Maps service APIs.
author: anastasia-ms
ms.author: v-stharr
ms.date: 09/01/2020
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc

#Customer intent: As a customer, I want to build an IoT system so that I can use Azure Maps APIs for spatial analytics on the device data.
---

# Tutorial: Implement IoT spatial analytics using Azure Maps

In an IoT scenario, it's common to capture and track relevant events that occur in space and time. Example scenarios include fleet management, asset tracking, mobility, and smart city applications. This tutorial guides you through a solution that tracks used car rental movement using the Azure Maps APIs.

In this tutorial you will:

> [!div class="checklist"]
> * Create an Azure Storage account to log car tracking data.
> * Upload a geofence to the Azure Maps Data service using the Data Upload API.
> * Create an IoT Hub and register a device.
> * Create a function in Azure Functions, implementing business logic based on Azure Maps spatial analytics.
> * Subscribe to IoT device telemetry events from the Azure function via Event Grid.
> * Filter the telemetry events using IoT Hub message routing.

## Prerequisites

1. Sign in to the [Azure portal](https://portal.azure.com).

2. [Create an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account).

3. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key. For more information on authentication in Azure Maps, see [manage authentication in Azure Maps](how-to-manage-authentication.md).

4. [Create a resource group](https://docs.microsoft.com/azure/azure-resource-manager/management/manage-resource-groups-portal#create-resource-groups). In this tutorial, we'll name our resource group *ContosoRental*, but you can choose whatever name you like.

5. Download the [rentalCarSimulation C# project](https://github.com/Azure-Samples/iothub-to-azure-maps-geofencing/tree/master/src/rentalCarSimulation).

This tutorial uses the [Postman](https://www.postman.com/) application, but you may choose a different API development environment.

## Use case: rental car tracking

This tutorial demonstrates the following scenario: A car rental company wants to log location information, distance traveled, and running state for its rental cars. Also, the company wishes to store this information whenever a car leaves the correct authorized geographic region.

In our use case, the rental cars are equipped with IoT devices that regularly send telemetry data to Azure IoT Hub. The telemetry includes the current location and indicates whether the car's engine is running. The device location schema adheres to the IoT [Plug and Play schema for geospatial data](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v1-preview/schemas/geospatial.md). The rental car's device telemetry schema looks like the following JSON code:

```JSON
{
    "data": {
        "properties": {
            "Engine": "ON"
        },
        "systemProperties": {
            "iothub-content-type": "application/json",
            "iothub-content-encoding": "utf-8",
            "iothub-connection-device-id": "ContosoRentalDevice",
            "iothub-connection-auth-method": "{\"scope\":\"device\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
            "iothub-connection-auth-generation-id": "636959817064335548",
            "iothub-enqueuedtime": "2019-06-18T00:17:20.608Z",
            "iothub-message-source": "Telemetry"
        },
        "body": {
            "location": {
                "type": "Point",
                "coordinates": [ -77.025988698005662, 38.9015330523316 ]
            }
        }
    }
}
```

In this tutorial, we'll only track one vehicle. After we set up the Azure services, you'll need to download the [rentalCarSimulation C# project ](https://github.com/Azure-Samples/iothub-to-azure-maps-geofencing/tree/master/src/rentalCarSimulation) to run the vehicle simulator. The entire process, from event to function execution, is summarized in the following steps:

1. The in-vehicle device sends telemetry data to IoT hub.

2. If the car engine is running, the IoT hub publishes the telemetry data to the Event Grid.

3. An Azure function is triggered because of its event subscription to device telemetry events.

4. The function will log the vehicle device location coordinates, event time, and the device ID. It will then use the [Spatial Geofence Get API](https://docs.microsoft.com/rest/api/maps/spatial/getgeofence) to determine whether the car has driven outside the geofence. If it has traveled outside the geofence boundaries, the function stores the location data received from the event into our blob container. Also, our function queries the [Reverse Address Search](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse) to translate the coordinate location to a street address, and store it with the rest of the device location data.

The following diagram gives you a high-level overview of the system.

   :::image type="content" source="./media/tutorial-iot-hub-maps/system-diagram.png" border="false" alt-text="System overview":::

The following figure highlights the geofence area in blue. The rental car's route is indicated by a green line.

   :::image type="content" source="./media/tutorial-iot-hub-maps/geofence-route.png" border="false" alt-text="Geofence route":::

## Create an Azure storage account

To store car violation tracking data, we'll create a [general-purpose v2 storage account](https://docs.microsoft.com/azure/storage/common/storage-account-overview#general-purpose-v2-accounts) in your resource group. If you haven't created a resource group, follow the directions in [create a resource group](https://docs.microsoft.com/azure/azure-resource-manager/management/manage-resource-groups-portal#create-resource-groups). In this tutorial, we'll name our resource group *ContosoRental*.

To create a storage account, follow the instructions in [create a storage account](https://docs.microsoft.com/azure/storage/common/storage-account-create?tabs=azure-portal). In this tutorial, we're naming the storage account *contosorentalstorage*, but you can name it anything you like.

Once your storage account has been successfully created, we'll need to create a container to store logging data.

1. Navigate to your newly created storage account. Click on the **Containers** link in the Essentials section.

    :::image type="content" source="./media/tutorial-iot-hub-maps/containers.png" alt-text="Containers for blob storage":::

2. Click the **+ Container** button in the upper left-hand corner. A panel will display on the right side of the browser. Name your container *contoso-rental-logs* and click **Create**.

     :::image type="content" source="./media/tutorial-iot-hub-maps/container-new.png" alt-text="Create a blob container":::

3. Navigate to the **Access keys** blade in your storage account and copy the **Storage account name** and the **Key** value in the **key1** section. We'll need both values in the [Create an Azure Function and add an Event Grid subscription](#create-an-azure-function-and-add-an-event-grid-subscription) section.

    :::image type="content" source="./media/tutorial-iot-hub-maps/access-keys.png" alt-text="Copy storage account name and key":::

## Upload a geofence

We'll now use the [Postman app](https://www.getpostman.com) to [upload the geofence](https://docs.microsoft.com/azure/azure-maps/geofence-geojson) to the Azure Maps service. The geofence defines the authorized geographical area for our rental vehicle.  We'll be using the geofence in our Azure function to determine whether a car has moved outside the geofence area.

Open the Postman app and follow the steps below to upload the geofence using the Azure Maps Data Upload API.  

1. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**.  Name the collection and select the **Create** button.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **Save**.

3. Select the **POST** HTTP method in the builder tab and enter the following URL to upload the geofence to the Data Upload API. Make sure to replace `{subscription-key}` with your primary subscription key.

    ```HTTP
    https://atlas.microsoft.com/mapData/upload?subscription-key={subscription-key}&api-version=1.0&dataFormat=geojson
    ```

    The "geojson" value against the `dataFormat` parameter in the URL path represents the format of the data being uploaded.

4. Click **Body** then select **raw** input format and choose **JSON** as the input format from the drop-down list. Open the JSON data file [here](https://raw.githubusercontent.com/Azure-Samples/iothub-to-azure-maps-geofencing/master/src/Data/geofence.json?token=AKD25BYJYKDJBJ55PT62N4C5LRNN4), and copy the JSON into the body section. Click **Send**.

5. Click the blue **Send** button and wait for the request to process. Once the request completes, go to the **Headers** tab of the response. Copy the value of the **Location** key, which is the `status URL`.

    ```http
    https://atlas.microsoft.com/mapData/operations/<operationId>?api-version=1.0
    ```

6. To check the status of the API call, create a **GET** HTTP request on the `status URL`. You'll need to append your primary subscription key to the URL for authentication. The **GET** request should like the following URL:

   ```HTTP
   https://atlas.microsoft.com/mapData/<operationId>/status?api-version=1.0&subscription-key={subscription-key}

7. When the **GET** HTTP request completes successfully, it will return a `resourceLocation`. The `resourceLocation` contains the unique `udid` for the uploaded content. You'll need to copy this `udid` for later use in this tutorial.

      ```json
      {
          "status": "Succeeded",
          "resourceLocation": "https://atlas.microsoft.com/mapData/metadata/{udid}?api-version=1.0"
      }
      ```

## Create an Azure IoT hub

Azure IoT hub enables secure and reliable bi-directional communication between an IoT application and the devices it manages.  In our scenario, we want to get information from our in-vehicle device to determine the location of the rental car. In this section, we'll create an IoT hub within the *ContosoRental* resource group. IoT hub will be responsible for publishing our device telemetry events.

> [!NOTE]
> IoT hub's functionality to publish device telemetry events on Event Grid is in Public preview. Public preview features are available in all regions except **East US, West US, West Europe, Azure Government, Azure China 21Vianet,** and **Azure Germany**.

To create an Iot hub in the *ContosoRental* resource group, follow the steps in [create an IoT hub](https://docs.microsoft.com/azure/iot-hub/quickstart-send-telemetry-dotnet#create-an-iot-hub).

## Register a device in IoT hub

Devices can't connect to the IoT hub unless they're registered in the IoT hub identity registry. In our scenario, we'll create a single device with the name, *InVehicleDevice*. To create and register the device within IoT hub, follow the steps in [register a new device in the IoT hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-create-through-portal#register-a-new-device-in-the-iot-hub). Make sure to copy the **Primary Connection String** of your device, as we'll use it in a later step.

## Create an Azure Function and add an Event Grid subscription

Azure Functions is a serverless compute service, which allows you to run small pieces of code ("functions"), without the need to explicitly provision or manage compute infrastructure. To learn more about Azure Functions, see [Azure functions](https://docs.microsoft.com/azure/azure-functions/functions-overview) documentation.

A function is "triggered" by a certain event. In our scenario, we'll create a function that is triggered by an Event Grid Trigger. We create the relationship between trigger and function by creating an Event Subscription for IoT hub device telemetry events. When a device telemetry event occurs, our function will be called as an endpoint, and will receive the relevant data for the [device we previously registered in IoT hub](#register-a-device-in-iot-hub).

The C# script code that our function will contain can be seen [here](https://github.com/Azure-Samples/iothub-to-azure-maps-geofencing/blob/master/src/Azure%20Function/run.csx).

Now, we'll set up our Azure function.

1. In the Azure portal dashboard, click **Create a resource**. Type **Function App** in the search text box. Click on **Function App**. Click **Create**.

2. On the **Function App** creation page, name your function app. Under **Resource Group**, select *ContosoRental* from the drop-down list.  Select *.NET Core* as the **Runtime Stack**. Click **Next: Hosting >** at the bottom of the page.

    :::image type="content" source="./media/tutorial-iot-hub-maps/rental-app.png" alt-text="Create a function app":::

3. For **Storage account**, select the storage account you created in [Create an Azure storage account](#create-an-azure-storage-account). Click **Review + create**.

4. Review the function app details, and click **Create**.

5. Once the app is created, we'll add a function to it. Go to the function app. Click on the **Functions** blade. Click on **+ Add** at the top of the page. The function template panel will display. Scroll down on the panel. Click on **Azure Event Grid trigger**.

     >[!WARNING]
    > The **Azure Event Hub Trigger** and the **Azure Event Grid Trigger** templates have similar names. Make sure you click on the **Azure Event Grid Trigger** template.

    :::image type="content" source="./media/tutorial-iot-hub-maps/function-create.png" alt-text="Create a function":::

6. Give the function a name. In this tutorial, we'll use the name, *GetGeoFunction*, but you can use any name you like. Click **Create function**.

7. Click on the **Code + Test** blade in the left-hand menu. Copy and paste the [C# script](https://github.com/Azure-Samples/iothub-to-azure-maps-geofencing/blob/master/src/Azure%20Function/run.csx) into the code window.

     :::image type="content" source="./media/tutorial-iot-hub-maps/function-code.png" alt-text="Copy/Paste code into function window":::

8. In the C# code, replace the following parameters. Click **Save**. Don't click **Test/Run** yet
    * Replace **SUBSCRIPTION_KEY** with your Azure Maps account primary subscription key.
    * Replace **UDID** with the `udid` of the geofence you uploaded in [Upload a geofence](#upload-a-geofence).
    * The **CreateBlobAsync** function in the script creates a blob per event in the data storage account. Replace the **ACCESS_KEY**, **ACCOUNT_NAME**, and **STORAGE_CONTAINER_NAME** with your storage account's access key, account name, and data storage container. These values were generated when you created your storage account in [Create an Azure storage account](#create-an-azure-storage-account).

9. Click on the **Integration** blade in the left-hand menu. Click on **Event Grid Trigger** in the diagram. Type in a name for the trigger, *eventGridEvent*, and click **Create Event Grid subscription**.

     :::image type="content" source="./media/tutorial-iot-hub-maps/function-integration.png" alt-text="Add event subscription":::

10. Fill out subscription details. Name the event subscription. For *Event Schema*, select *Event Grid Schema*. For **Topic Types**, select *Azure IoT Hub Accounts*. For **Resource Group**, select the resource group you created at the beginning of this tutorial. For **Resource**, select the IoT hub you created in [Create an Azure IoT hub](#create-an-azure-iot-hub). For **Filter to Event Types**, select *Device Telemetry*. After choosing these options, you'll see the **Topic Type** change to *IoT Hub*. For **System Topic Name**, you can use the same name as your resource.  Finally, click on **Select an endpoint** in the **Endpoint details** section. Accept all settings and click **Confirm Selection**.

    :::image type="content" source="./media/tutorial-iot-hub-maps/function-create-event-subscription.png" alt-text="Create event subscription":::

11. Review your settings. Make sure that the endpoint specifies the function you created in the beginning of this section. Click **Create**.

    :::image type="content" source="./media/tutorial-iot-hub-maps/function-create-event-subscription-confirm.png" alt-text="Create event subscription confirmation":::

12. Now you're back at the **Edit Trigger** panel. Click **Save**.

## Filter events using IoT Hub message routing

When you add an Event Grid subscription to the Azure Function, a messaging route is automatically created in the specified IoT hub. Message routing allows you to route different data types to various endpoints. For example, you can route device telemetry messages, device life-cycle events, and device twin change events. To learn more about IoT hub message routing, see [Use IoT Hub message routing](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c).

:::image type="content" source="./media/tutorial-iot-hub-maps/hub-route.png" alt-text="Message routing in IoT hub":::

In our example scenario, we only want to receive messages when the rental car is moving. We'll create a routing query to filter the events where the `Engine` property equals **"ON"**. To create a routing query, click on the **RouteToEventGrid** route and replace the **Routing query** with **"Engine='ON'"** and click **Save**. Now IoT hub will only publish device telemetry where the Engine is ON.

:::image type="content" source="./media/tutorial-iot-hub-maps/hub-filter.png" alt-text="Filter routing messages":::

>[!TIP]
>There are various ways to query IoT device-to-cloud messages, to learn more about message routing syntax, see [IoT Hub message routing](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-routing-query-syntax).

## Send telemetry data to IoT Hub

Once our Azure Function is up and running, we can now send telemetry data to the IoT hub, which will route it to the Event Grid. Let's use a C# application to simulate location data for an in-vehicle device of a rental car. To run the application, you need the .NET Core SDK 2.1.0 or greater on your development machine. Follow the steps below to send simulated telemetry data to IoT Hub.

1. If you haven't done so already, download the [rentalCarSimulation](https://github.com/Azure-Samples/iothub-to-azure-maps-geofencing/tree/master/src/rentalCarSimulation) C# project.

2. Open the simulatedCar.cs file in a text editor of your choice and replace the value of the `connectionString` with the one you saved when you registered the device and save changes to the file.

3. Make sure you have .NET Core installed on your machine. In your local terminal window, navigate to the root folder of the C# project and run the following command to install the required packages for simulated device application:

    ```cmd/sh
    dotnet restore
    ```

4. In the same terminal, run the following command to build and run the rental car simulation application:

    ```cmd/sh
    dotnet run
    ```

  Your local terminal should look like the one below.

:::image type="content" source="./media/tutorial-iot-hub-maps/terminal.png" alt-text="Terminal output":::

If you open the blob storage container now, you can see four blobs for locations where the vehicle was outside the geofence.

:::image type="content" source="./media/tutorial-iot-hub-maps/blob.png" alt-text="View blobs inside container":::

The map below shows four vehicle location points outside the geofence. Each location was logged at regular time intervals.

:::image type="content" source="./media/tutorial-iot-hub-maps/violation-map.png" alt-text="Violation map":::

## Explore Azure Maps and IoT

To explore Azure Maps APIs used in this tutorial, see:

* [Get Search Address Reverse](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse)
* [Get Geofence](https://docs.microsoft.com/rest/api/maps/spatial/getgeofence)

For a complete list of Azure Maps REST APIs, see:

* [Azure Maps REST APIs](https://docs.microsoft.com/rest/api/maps/spatial/getgeofence)

To learn more about IoT Plug and Play, see:

* [IoT Plug and Play](https://docs.microsoft.com/azure/iot-pnp)

To get a list of devices that are Azure certified for IoT, visit:

* [Azure certified devices](https://catalog.azureiotsolutions.com/)

## Next Steps

To learn more about how to send device to cloud telemetry and the other way around, see:

> [!div class="nextstepaction"]
> [Send telemetry from a device](https://docs.microsoft.com/azure/iot-hub/quickstart-send-telemetry-dotnet)
