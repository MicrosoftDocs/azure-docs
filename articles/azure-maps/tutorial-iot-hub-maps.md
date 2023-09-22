---
title: 'Tutorial: Implement IoT spatial analytics'
titleSuffix: Microsoft Azure Maps
description: Tutorial on how to Integrate IoT Hub with Microsoft Azure Maps service APIs
author: eriklindeman
ms.author: eriklind
ms.date: 09/14/2023
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
ms.custom: mvc
---

# Tutorial: Implement IoT spatial analytics by using Azure Maps

In an IoT scenario, it's common to capture and track relevant events that occur in space and time. Examples include fleet management, asset tracking, mobility, and smart city applications. This tutorial guides you through a solution that tracks used car rental movement by using the Azure Maps APIs.

In this tutorial you will:

> [!div class="checklist"]
>
> * Create an Azure storage account to log car tracking data.
> * Upload a geofence to an Azure storage account.
> * Create a hub in Azure IoT Hub, and register a device.
> * Create a function in Azure Functions, implementing business logic based on Azure Maps spatial analytics.
> * Subscribe to IoT device telemetry events from the Azure function via Azure Event Grid.
> * Filter the telemetry events by using IoT Hub message routing.

## Prerequisites

If you don't have an Azure subscription, create a [free account] before you begin.

* An [Azure Maps account]
* A [subscription key]
* A [resource group]
* The [rentalCarSimulation] C# project

> [!TIP]
> You can download the entire [rentalCarSimulation] C# project from GitHub as a single ZIP file by going to [the root of the sample] and selecting the green **<> Code** button, then **Download ZIP**.

This tutorial uses the [Postman] application, but you can choose a different API development environment.

>[!IMPORTANT]
> In the URL examples, replace `{Your-Azure-Maps-Subscription-key}` with your Azure Maps subscription key.

## Use case: rental car tracking

Let's say that a car rental company wants to log location information, distance traveled, and running state for its rental cars. The company also wants to store this information whenever a car leaves the correct authorized geographic region.

The rental cars are equipped with IoT devices that regularly send telemetry data to IoT Hub. The telemetry includes the current location and indicates whether the car's engine is running. The device location schema adheres to the IoT [Plug and Play schema for geospatial data]. The rental car's device telemetry schema looks like the following JSON code:

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

In this tutorial, you only track one vehicle. After you set up the Azure services, you need to download the [rentalCarSimulation] C# project to run the vehicle simulator. The entire process, from event to function execution, is summarized in the following steps:

1. The in-vehicle device sends telemetry data to IoT Hub.

2. If the car engine is running, the hub publishes the telemetry data to Event Grid.

3. An Azure function is triggered because of its event subscription to device telemetry events.

4. The function logs the vehicle device location coordinates, event time, and the device ID. It then uses the [Spatial Geofence Get API] to determine whether the car has driven outside the geofence. If it has traveled outside the geofence boundaries, the function stores the location data received from the event into a blob container. The function also queries the [Search Address Reverse] to translate the coordinate location to a street address, and stores it with the rest of the device location data.

The following diagram shows a high-level overview of the system.

   :::image type="content" source="./media/tutorial-iot-hub-maps/system-diagram.png" border="false" alt-text="Diagram of system overview.":::

The following figure highlights the geofence area in blue. The rental car's route is indicated by a green line.

   :::image type="content" source="./media/tutorial-iot-hub-maps/geofence-route.png" border="false" alt-text="Figure showing geofence route.":::

## Create an Azure storage account

To store car violation tracking data, create a [general-purpose v2 storage account] in your resource group. If you haven't created a resource group, follow the directions in [create resource groups][resource group]. Name your resource group *ContosoRental*.

To create a storage account, follow the instructions in [create a storage account]. In this tutorial, name the storage account *contosorentalstorage*, but in general you can name it anything you like.

When you successfully create your storage account, you then need to create a container to store logging data.

1. Go to your newly created storage account. In the **Essentials** section, select the **Containers** link.

    :::image type="content" source="./media/tutorial-iot-hub-maps/containers.png" alt-text="Screenshot of containers for blob storage.":::

2. In the upper-left corner, select **+ Container**. A panel appears on the right side of the browser. Name your container *contoso-rental-logs*, and select **Create**.

     :::image type="content" source="./media/tutorial-iot-hub-maps/container-new.png" alt-text="Screenshot of create a blob container.":::

3. Go to the **Access keys** pane in your storage account, and copy the **Storage account name** and the **Key** value in the **key1** section. You need both of these values in the [Create a function and add an Event Grid subscription] section.

    :::image type="content" source="./media/tutorial-iot-hub-maps/access-keys.png" alt-text="Screenshot of copy storage account name and key.":::

## Upload a geofence into your Azure storage account

The geofence defines the authorized geographical area for our rental vehicle. Use the geofence in your Azure function to determine whether a car has moved outside the geofence area.

Follow the steps outlined in the [How to create data registry] article to upload the [geofence JSON data file] into your Azure storage account then register it in your Azure Maps account. Make sure to make a note of the unique identifier (`udid`) value, you'll need it. The `udid` is how you reference the geofence you uploaded into your Azure storage account from your source code. For more information on geofence data files, see [Geofencing GeoJSON data].

## Create an IoT hub

IoT Hub enables secure and reliable bi-directional communication between an IoT application and the devices it manages. For this tutorial, you want to get information from your in-vehicle device to determine the location of the rental car. In this section, you create an IoT hub within the *ContosoRental* resource group. This hub is responsible for publishing your device telemetry events.

To create an IoT hub in the *ContosoRental* resource group, follow the steps in [create an IoT hub].

## Register a device in your IoT hub

Devices can't connect to the IoT hub unless they're registered in the IoT hub identity registry. Create a single device with the name, *InVehicleDevice*. To create and register the device within your IoT hub, follow the steps in [register a new device in the IoT hub]. Make sure to copy the primary connection string of your device. You'll need it later.

## Create a function and add an Event Grid subscription

Azure Functions is a serverless compute service that allows you to run small pieces of code ("functions"), without the need to explicitly provision or manage compute infrastructure. To learn more, see [Azure Functions].

A function is triggered by a certain event. Create a function triggered by an Event Grid trigger. Create the relationship between trigger and function by creating an event subscription for IoT Hub device telemetry events. When a device telemetry event occurs, your function is called as an endpoint, and receives the relevant data for the device you previously registered in IoT Hub.

Here's the [C# script] code that your function contains.

Now, set up your Azure function.

1. In the Azure portal dashboard, select **Create a resource**. Type **Function App** in the search text box. Select **Function App** > **Create**.

1. On the **Function App** creation page, name your function app. Under **Resource Group**, select **ContosoRental** from the drop-down list. Select **.NET** as the **Runtime Stack**. At the bottom of the page, select **Next: Storage >**.

    :::image type="content" source="./media/tutorial-iot-hub-maps/rental-app.png" alt-text="Screenshot of create a function app.":::

1. For **Storage account**, select the storage account you created in [Create an Azure storage account]. Select **Review + create**.

1. Review the function app details, and select **Create**.

1. After the app is created, you add a function to it. Go to the function app. Select the **Create in Azure Portal** button.

     >[!IMPORTANT]
    > The **Azure Event ***Hub*** Trigger** and the **Azure Event ***Grid*** Trigger** templates have similar names. Make sure you select the **Azure Event ***Grid*** Trigger** template.

    :::image type="content" source="./media/tutorial-iot-hub-maps/function-create.png" alt-text="Screenshot of create a function in Azure Portal.":::

1. The **Create function** panel appears. Scroll down the **Select a template** panel, and select **Azure Event Grid trigger** then select the **Create** button.

    :::image type="content" source="./media/tutorial-iot-hub-maps/azure-event-grid-trigger.png" alt-text="Screenshot of create a function.":::

1. Give the function a name. In this tutorial, use the name *GetGeoFunction*, but in general you can use any name you like. Select **Create function**.

1. In the left menu, select the **Code + Test** pane. Copy and paste the [C# script] into the code window.

     :::image type="content" source="./media/tutorial-iot-hub-maps/function-code.png" alt-text="Copy/Screenshot of paste code into function window.":::

1. In the C# code, replace the following parameters:
    * Replace **SUBSCRIPTION_KEY** with your Azure Maps account subscription key.
    * Replace **UDID** with the `udid` of the geofence you uploaded in [Upload a geofence into your Azure storage account].
    * The `CreateBlobAsync` function in the script creates a blob per event in the data storage account. Replace the **ACCESS_KEY**, **ACCOUNT_NAME**, and **STORAGE_CONTAINER_NAME** with your storage account's access key, account name, and data storage container. These values were generated when you created your storage account in [Create an Azure storage account].

1. In the left menu, select the **Integration** pane. Select **Event Grid Trigger** in the diagram. Type in a name for the trigger, *eventGridEvent*, and select **Create Event Grid subscription**.

     :::image type="content" source="./media/tutorial-iot-hub-maps/function-integration.png" alt-text="Screenshot of add event subscription.":::

1. Fill out the subscription details. Name the event subscription. For **Event Schema**, select **Event Grid Schema**. For **Topic Types**, select **Azure IoT Hub Accounts**. For **Resource Group**, select the resource group you created at the beginning of this tutorial. For **Resource**, select the IoT hub you created in "Create an Azure IoT hub." For **Filter to Event Types**, select **Device Telemetry**.

   After choosing these options, you'll see the **Topic Type** change to **IoT Hub**. For **System Topic Name**, you can use the same name as your resource. Finally, in the **Endpoint details** section, select **Select an endpoint**. Accept all settings and select **Confirm Selection**.

    :::image type="content" source="./media/tutorial-iot-hub-maps/function-create-event-subscription.png" alt-text="Screenshot of create event subscription.":::

1. Review your settings. Make sure that the endpoint specifies the function you created in the beginning of this section. Select **Create**.

    :::image type="content" source="./media/tutorial-iot-hub-maps/function-create-event-subscription-confirm.png" alt-text="Screenshot of create event subscription confirmation.":::

1. Now you're back at the **Edit Trigger** panel. Select **Save**.

## Filter events by using IoT Hub message routing

When you add an Event Grid subscription to the Azure function, a messaging route is automatically created in the specified IoT hub. Message routing allows you to route different data types to various endpoints. For example, you can route device telemetry messages, device life-cycle events, and device twin change events. For more information, see [Use IoT Hub message routing].

:::image type="content" source="./media/tutorial-iot-hub-maps/hub-route.png" alt-text="Screenshot of message routing in IoT hub.":::

In your example scenario, you only want to receive messages when the rental car is moving. Create a routing query to filter the events where the `Engine` property equals **"ON"**. To create a routing query, select the **RouteToEventGrid** route and replace the **Routing query** with **"Engine='ON'"**. Then select **Save**. Now the IoT hub only publishes device telemetry where the engine is on.

:::image type="content" source="./media/tutorial-iot-hub-maps/hub-filter.png" alt-text="Screenshot of filter routing messages.":::

>[!TIP]
>There are various ways to query IoT device-to-cloud messages. To learn more about message routing syntax, see [IoT Hub message routing].

## Send telemetry data to IoT Hub

When your Azure function is running, you can now send telemetry data to the IoT hub, which routes it to Event Grid. Use a C# application to simulate location data for an in-vehicle device of a rental car. To run the application, you need [.NET SDK 6.0] on your development computer. Follow these steps to send simulated telemetry data to the IoT hub:

1. If you haven't done so already, download the [rentalCarSimulation] C# project.

2. Open the `simulatedCar.cs` file in a text editor of your choice, and replace the value of the `connectionString` with the one you saved when you registered the device. Save changes to the file.

3. Make sure you have the ASP.NET Core Runtime installed on your machine. In your local terminal window, go to the root folder of the C# project and run the following command to install the required packages for simulated device application:

    ```cmd/sh
    dotnet restore
    ```

4. In the same terminal, run the following command to build and run the rental car simulation application:

    ```cmd/sh
    dotnet run
    ```

  Your local terminal should look like the following screenshot.

:::image type="content" source="./media/tutorial-iot-hub-maps/terminal.png" alt-text="Screenshot of terminal output.":::

If you open the blob storage container now, you can see four blobs for locations where the vehicle was outside the geofence.

:::image type="content" source="./media/tutorial-iot-hub-maps/blob.png" alt-text="Screenshot of view blobs inside container.":::

The following map shows four vehicle location points outside the geofence. Each location was logged at regular time intervals.

:::image type="content" source="./media/tutorial-iot-hub-maps/violation-map.png" alt-text="Screenshot of violation map.":::

## Explore Azure Maps and IoT

To explore the Azure Maps APIs used in this tutorial, see:

* [Get Search Address Reverse]
* [Get Geofence]

For a complete list of Azure Maps REST APIs, see:

* [Azure Maps REST APIs]

* [IoT Plug and Play]

To get a list of devices that are Azure certified for IoT, visit:

* [Azure certified devices]

## Clean up resources

There are no resources that require cleanup.

## Next steps

To learn more about how to send device-to-cloud telemetry, and the other way around, see:

> [!div class="nextstepaction"]
> [Send telemetry from a device]

[.NET SDK 6.0]: https://dotnet.microsoft.com/download/dotnet/6.0
[Azure certified devices]: https://devicecatalog.azure.com/
[Azure Functions]: ../azure-functions/functions-overview.md
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps REST APIs]: /rest/api/maps/spatial/getgeofence
[C# script]: https://github.com/Azure-Samples/iothub-to-azure-maps-geofencing/blob/master/src/Azure%20Function/run.csx
[create a storage account]: ../storage/common/storage-account-create.md?tabs=azure-portal
[Create an Azure storage account]: #create-an-azure-storage-account
[create an IoT hub]: ../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp#create-an-iot-hub
[Create a function and add an Event Grid subscription]: #create-a-function-and-add-an-event-grid-subscription
[free account]: https://azure.microsoft.com/free/
[general-purpose v2 storage account]: ../storage/common/storage-account-overview.md
[Get Geofence]: /rest/api/maps/spatial/getgeofence
[Get Search Address Reverse]: /rest/api/maps/search/getsearchaddressreverse
[How to create data registry]: how-to-create-data-registries.md
[IoT Hub message routing]: ../iot-hub/iot-hub-devguide-routing-query-syntax.md
[IoT Plug and Play]: ../iot-develop/index.yml
[geofence JSON data file]: https://raw.githubusercontent.com/Azure-Samples/iothub-to-azure-maps-geofencing/master/src/Data/geofence.json?token=AKD25BYJYKDJBJ55PT62N4C5LRNN4
[Plug and Play schema for geospatial data]: https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v1-preview/schemas/geospatial.md
[Postman]: https://www.postman.com/
[register a new device in the IoT hub]: ../iot-hub/iot-hub-create-through-portal.md#register-a-new-device-in-the-iot-hub
[rentalCarSimulation]: https://github.com/Azure-Samples/iothub-to-azure-maps-geofencing/tree/master/src/rentalCarSimulation
[resource group]: ../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups
[the root of the sample]: https://github.com/Azure-Samples/iothub-to-azure-maps-geofencing
[Search Address Reverse]: /rest/api/maps/search/getsearchaddressreverse
[Send telemetry from a device]: ../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp
[Spatial Geofence Get API]: /rest/api/maps/spatial/getgeofence
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Upload a geofence into your Azure storage account]: #upload-a-geofence-into-your-azure-storage-account
[Geofencing GeoJSON data]: ./geofence-geojson.md
[Use IoT Hub message routing]: ../iot-hub/iot-hub-devguide-messages-d2c.md
