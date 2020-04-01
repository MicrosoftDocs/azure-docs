---
title: 'Tutorial: Implement IoT spatial analytics | Microsoft Azure Maps'
description: Integrate IoT Hub with Microsoft Azure Maps service APIs.
author: philmea
ms.author: philmea
ms.date: 11/12/2019
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc

#Customer intent: As a customer, I want to build an IoT system so that I can use Azure Maps APIs for spatial analytics on the device data.
---

# Tutorial: Implement IoT spatial analytics using Azure Maps

In an IoT scenario, it's common to capture and track relevant events that occur in space and time. Example scenarios include fleet management, asset tracking, mobility, and smart city applications. This tutorial guides you through a solution pattern using the Azure Maps APIs. Relevant events are captured by IoT Hub, using the event subscription model provided by the Event Grid.

In this tutorial you will:

> [!div class="checklist"]
> * Create an IoT Hub.
> * Upload geofence area in the Azure Maps, Data service using the Data Upload API.
> * Create a function in Azure Functions, implementing business logic based on Azure Maps spatial analytics.
> * Subscribe to IoT device telemetry events from the Azure function via Event Grid.
> * Filter the telemetry events using IoT Hub message routing.
> * Create a storage account to store relevant event data.
> * Simulate an in-vehicle IoT device.
    

## Use case

This solution demonstrates a scenario where a car rental company plans to monitor and log events for its rental cars. Car rental companies usually rent cars to a specific geographic region. They need to track the cars whereabouts while they are rented. Instances of a car leaving the chosen geographic region must be logged. Logging data ensures policies, fees, and other business aspects would be handled properly.

In our use case, the rental cars are equipped with IoT devices that regularly send telemetry data to Azure IoT Hub. The telemetry includes the current location and indicates whether the car's engine is running. The device location schema adheres to the IoT [Plug and Play schema for geospatial data](https://github.com/Azure/IoTPlugandPlay/blob/master/Schemas/geospatial.md). The rental car's device telemetry schema looks like:

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

Let's use in-vehicle device telemetry to accomplish our goal. We want to execute geofencing rules. And, we want to respond whenever we receive an event indicating the car has moved. To do so, we'll subscribe to the device telemetry events from IoT Hub via Event Grid. 

There are several ways to subscribe to Event Grid, in this tutorial we use Azure Functions. Azure Functions reacts to events published in the Event Grid. It also implements car rental business logic, which is based on Azure Maps spatial analytics. 

Code inside Azure function checks whether the vehicle has left the geofence. If the vehicle left the geofence, the Azure function gathers additional information such as the address associated to the current location. The function also implements logic to store meaningful event data in a data blob storage that helps provide description of the event circumstances. 

The event circumstances can be helpful to the car rental company and the rental customer. The following diagram gives you a high-level overview of the system.

 
  <center>

  ![System overview](./media/tutorial-iot-hub-maps/system-diagram.png)
  
  </center>

The following figure represents the geofence area highlighted in blue. The rental vehicle's route is indicated by a green line.

  ![Geofence route](./media/tutorial-iot-hub-maps/geofence-route.png)


## Prerequisites 

### Create a resource group

To complete the steps in this tutorial, you first need to create a resource group in the Azure portal. To create a resource group, do the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **Resource groups**.
    
   ![Resource groups](./media/tutorial-iot-hub-maps/resource-group.png)

3. Under **Resource groups**, select **Add**.
    
   ![Add resource group](./media/tutorial-iot-hub-maps/add-resource-group.png) 

4. Enter the following property values:
    * **Subscription:** Select your Azure subscription.
    * **Resource group:** Enter "ContosoRental" as the resource group name.
    * **Region:** Select a region for the resource group.  

    ![Resource group details](./media/tutorial-iot-hub-maps/resource-details.png)

    Select **Review + create**, and then select **Create** on the next page.

### Create an Azure Maps account 

To implement business logic based on Azure Maps spatial analytics, we need to create an Azure Maps account in the resource group we created. Follow instructions in [Create an account](quick-demo-map-app.md#create-an-account-with-azure-maps) to create an Azure Maps account subscription with S1 pricing tier. Follow the steps in [get primary key](quick-demo-map-app.md#get-the-primary-key-for-your-account) to obtain your primary key for your account. For more information on authentication in Azure Maps, see [manage authentication in Azure Maps](how-to-manage-authentication.md).



### Create a storage account

To log event data, we'll create a general-purpose **v2storage** that  provides access to all of the Azure Storage services: blobs, files, queues, tables, and disks.  We'll need to place this storage account in the "ContosoRental" resource group to store data as blobs. To create a storage account, follow instruction in [create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=azure-portal). Next we'll need to create a container to store blobs. Follow the steps below to do so:

1. In your "storage account - blob, file, table, queue", navigate to Containers.

    ![blobs](./media/tutorial-iot-hub-maps/blobs.png)

2. Click the container button at the top left and name your container "contoso-rental-logs" and click "OK".

    ![blob-container](./media/tutorial-iot-hub-maps/blob-container.png)

3. Navigate to the **Access keys** blade in your storage account and copy the "storage account name" and "access key". They're needed in a later step.

    ![access-keys](./media/tutorial-iot-hub-maps/access-keys.png)


Now, we have a storage account and a container to log event data. Next, we'll create an IoT hub.

### Create an IoT Hub

The IoT Hub is a managed service in the cloud. The IoT Hub acts as a central message hub for bi-directional communication between an IoT application and the devices managed by it. In order to route device telemetry messages to an Event Grid, create an IoT Hub within the "ContosoRental" resource group. Set up a message route integration where we will filter messages based on the car's engine status. We will also send device telemetry messages to the Event Grid whenever the car is moving.

> [!Note] 
> IoT Hub's functionality to publish device telemetry events on Event Grid is in Public preview. Public preview features are available in all regions except **East US, West US, West Europe, Azure Government, Azure China 21Vianet,** and **Azure Germany**. 

Create an Iot Hub by following the steps in [create an IoT Hub section](https://docs.microsoft.com/azure/iot-hub/quickstart-send-telemetry-dotnet#create-an-iot-hub).


### Register a device 

In order to connect to the IoT Hub, a device must be registered. To register a device with IoT hub, follow the steps below:

1. In your IoT Hub, click on the "IoT devices" blade and click "New".

    ![add-device](./media/tutorial-iot-hub-maps/add-device.png)

2. On the create a device page, name your IoT device, and click "Save".
    
    ![register-device](./media/tutorial-iot-hub-maps/register-device.png)

3. Save the **Primary Connection String** of your device to use it in a later step, in which you need to change a placeholder with this connection string.

    ![add-device](./media/tutorial-iot-hub-maps/connection-string.png)

## Upload geofence

We'll use the [Postman application](https://www.getpostman.com) to [upload the geofence](https://docs.microsoft.com/azure/azure-maps/geofence-geojson) to the Azure Maps service using the Azure Maps Data Upload API. Any event when the car is outside this geofence will be logged.

Open the Postman app and follow the steps below to upload the geofence using the Azure Maps, Data Upload API.  

1. In the Postman app, click new | Create new, and select Request. Enter a Request name for Upload geofence data, select a collection or folder to save it to, and click Save.

    ![Upload geofences using Postman](./media/tutorial-iot-hub-maps/postman-new.png)

2. Select POST HTTP method on the builder tab and enter the following URL to make a POST request.

    ```HTTP
    https://atlas.microsoft.com/mapData/upload?subscription-key={subscription-key}&api-version=1.0&dataFormat=geojson
    ```
    
    The "geojson" value against the `dataFormat` parameter in the URL path represents the format of the data being uploaded.

3. Click **Params**, and enter the following Key/Value pairs to be used for the POST request URL. Replace subscription-key value with your Azure Maps key.
   
    ![Key-Value params Postman](./media/tutorial-iot-hub-maps/postman-key-vals.png)

4. Click **Body** then select **raw** input format and choose **JSON (application/text)** as the input format from the drop-down list. Open the JSON data file [here](https://raw.githubusercontent.com/Azure-Samples/iothub-to-azure-maps-geofencing/master/src/Data/geofence.json?token=AKD25BYJYKDJBJ55PT62N4C5LRNN4), and copy the Json in the body section as the data to upload and click **Send**.
    
    ![post data](./media/tutorial-iot-hub-maps/post-json-data.png)
    
5. Review the response headers. Upon a successful request, the **Location** header will contain the status URI to check the current status of the upload request. The status URI will be of the following format. 

   ```HTTP
   https://atlas.microsoft.com/mapData/{uploadStatusId}/status?api-version=1.0
   ```

6. Copy your status URI and append a `subscription-key` parameter to it. Assign the value of your Azure Maps account subscription key to the `subscription-key` parameter. The status URI format should be like the one below, and `{Subscription-key}` replaced with your subscription key.

   ```HTTP
   https://atlas.microsoft.com/mapData/{uploadStatusId}/status?api-version=1.0&subscription-key={Subscription-key}
   ```

7. To get the, `udId` open a new tab in the Postman app and select GET HTTP method on the builder tab and make a GET request at the status URI. If your data upload was successful, you'll receive a udId in the response body. Copy the udId for later use.

   ```JSON
   {
    "udid" : "{udId}"
   }
   ```


Next we'll create an Azure Function within the "ContosoRental" resource group and then set up a message route in IoT Hub to filter device telemetry messages.


## Create an Azure Function and add an Event Grid subscription

Azure Functions is a serverless compute service which enables us to run code on-demand, without the need to explicitly provision or manage compute infrastructure. To learn more about Azure Functions, take a look at the [Azure functions](https://docs.microsoft.com/azure/azure-functions/functions-overview) documentation. 

The logic we implement in the function is using the location data coming from the in-vehicle device telemetry for assessing the geofence status. In case a given vehicle goes outside the geofence, the function will gather more information like the address of the location via the [Get Search Address Reverse API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse). This API translates a given location coordinate into a human understandable street address. 

All relevant event info is then kept in the blob store. Step 5 below points to the executable code implementing such logic. Follow the steps below to create an Azure Function that sends data logs to the blob container in the blob storage account and add an Event Grid subscription to it.

1. In the Azure portal dashboard, select create a resource. Select **Compute** from the list of available resource types and then select **Function App**.

    ![create-resource](./media/tutorial-iot-hub-maps/create-resource.png)

2. On the **Function App** creation page, name your function app. Under **Resource Group**, select **Use existing**, and select "ContosoRental" from the drop-down list. Select ".NET Core" as the Runtime Stack. Under **Hosting**, for **Storage account**, select the storage account name from a prior step. In our prior step, we named the storage account **v2storage**.  Then, select **Review+Create**.
    
    ![create-app](./media/tutorial-iot-hub-maps/rental-app.png)

2. Review the function app details, and select "Create".

3. Once the app is created, we need to add a function to it. Go to the function app. Click **New function** to add a function, and choose **In-Portal** as the development environment. Then, select **Continue**.

    ![create-function](./media/tutorial-iot-hub-maps/function.png)

4. Choose **More templates** and click **Finish and view templates**. 

5. Select the template with an **Azure Event Grid Trigger**. Install extensions if prompted, name the function, and select **Create**.

    ![function-template](./media/tutorial-iot-hub-maps/eventgrid-funct.png)
    
    The **Azure Event Hub Trigger** and the **Azure Event Grid Trigger** have similar icons. Make sure you select the **Azure Event Grid Trigger**.

6. Copy the [C# code](https://github.com/Azure-Samples/iothub-to-azure-maps-geofencing/blob/master/src/Azure%20Function/run.csx) into your function.
 
7. In the C# script, replace the following parameters. Click **Save**. Don't click **Run** yet
    * Replace the **SUBSCRIPTION_KEY** with your Azure Maps account primary subscription key.
    * Replace the **UDID** with the udId of the geofence you uploaded, 
    * The **CreateBlobAsync** function in the script creates a blob per event in the data storage account. Replace the **ACCESS_KEY**, **ACCOUNT_NAME**, and **STORAGE_CONTAINER_NAME** with your storage account's access key, account name, and data storage container.

10. Click on **Add Event Grid subscription**.
    
    ![add-event-grid](./media/tutorial-iot-hub-maps/add-egs.png)

11. Fill out subscription details, under **EVENT SUBSCRIPTION DETAILS** name your event subscription. For Event Schema choose "Event Grid Schema". Under **TOPIC DETAILS** select "Azure IoT Hub Accounts" as Topic type. Choose the same subscription you used for creating the resource group, select "ContosoRental" as the "Resource Group". Choose the IoT Hub you created as a "Resource". Pick **Device Telemetry** as Event Type. After choosing these options, you'll see the "Topic Type" change to "IoT Hub" automatically.

    ![event-grid-subscription](./media/tutorial-iot-hub-maps/af-egs.png)
 

## Filter events using IoT Hub message routing

After you add an Event Grid subscription to the Azure Function, you'll see a default message route to Event Grid in IoT Hub's **Message Routing** blade. Message routing enables you to route different data types to various endpoints. For example, you can route device telemetry messages, device life-cycle events, and device twin change events. To learn more about IoT hub message routing, see [Use IoT Hub message routing](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c).

![hub-EG-route](./media/tutorial-iot-hub-maps/hub-route.png)

In our example scenario, we want to filter out all messages where the rental vehicle is moving. In order to publish such device telemetry events to Event Grid, we'll use the routing query to filter the events where the `Engine` property is **"ON"**. There are various ways to query IoT device-to-cloud messages, to learn more about message routing syntax, see [IoT Hub message routing](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-routing-query-syntax). To create a routing query, click on the **RouteToEventGrid** route and replace the **Routing query** with **"Engine='ON'"** and click **Save**. Now IoT hub will only publish device telemetry where the Engine is ON.

![hub-EG-filter](./media/tutorial-iot-hub-maps/hub-filter.png)


## Send telemetry data to IoT Hub

Once our Azure Function is up and running, we can now send telemetry data to the IoT Hub, which will route it to the Event Grid. Let's use a C# application to simulate location data for an in-vehicle device of a rental car. To run the application, you need the .NET Core SDK 2.1.0 or greater on your development machine. Follow the steps below to send simulated telemetry data to IoT Hub.

1. Download the [rentalCarSimulation](https://github.com/Azure-Samples/iothub-to-azure-maps-geofencing/tree/master/src/rentalCarSimulation) C# project. 

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

  ![Terminal output](./media/tutorial-iot-hub-maps/terminal.png)

If you open the blob storage container now, you should be able to see four blobs for locations where the vehicle was outside the geofence.

![Enter blob](./media/tutorial-iot-hub-maps/blob.png)

The map below shows four points where the vehicle was outside the geofence, logged at regular time intervals.

![violation map](./media/tutorial-iot-hub-maps/violation-map.png)

## Next steps

To explore Azure Maps APIs used in this tutorial, see:

* [Get Search Address Reverse](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse)
* [Get Geofence](https://docs.microsoft.com/rest/api/maps/spatial/getgeofence)

For a complete list of Azure Maps REST APIs, see:

* [Azure Maps REST APIs](https://docs.microsoft.com/rest/api/maps/spatial/getgeofence)

To learn more about IoT Plug and Play, see:

* [IoT Plug and Play](https://docs.microsoft.com/azure/iot-pnp)

To get a list of devices that are Azure certified for IoT, visit:

* [Azure certified devices](https://catalog.azureiotsolutions.com/)

To learn more about how to send device to cloud telemetry and the other way around, see:

* [Send telemetry from a device](https://docs.microsoft.com/azure/iot-hub/quickstart-send-telemetry-dotnet)
