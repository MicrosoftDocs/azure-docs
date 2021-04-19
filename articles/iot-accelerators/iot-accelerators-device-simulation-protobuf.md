---
title: Use Protocol Buffers with device simulation - Azure| Microsoft Docs
description: In this how-to guide, you learn how to use Protocol Buffers to serialize telemetry sent from the Device Simulation solution accelerator.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.custom:  "mvc, amqp, devx-track-csharp"
ms.date: 11/06/2018
ms.author: dobett

#Customer intent: As an IT Pro, I need to create advanced custom simulated devices to test my IoT solution.
---

# Serialize telemetry using Protocol Buffers

Protocol Buffers (Protobuf) is a binary serialization format for structured data. Protobuf is designed to emphasize simplicity and performance with a goal of being smaller and faster than XML.

Device Simulation supports the **proto3** version of the protocol buffers language.

Because Protobuf requires compiled code to serialize the data, you must build a custom version of Device Simulation.

The steps in this how-to-guide show you how to:

1. Prepare a development environment
1. Specify using the Protobuf format in a device model
1. Define your Protobuf format
1. Generate Protobuf classes
1. Test locally

## Prerequisites

To follow the steps in this how-to guide, you need:

* Visual Studio Code. You can download [Visual Studio Code for Mac, Linux, and Windows](https://code.visualstudio.com/download).
* .NET Core. You can download [.NET Core for Mac, Linux, and Windows](https://www.microsoft.com/net/download).
* Postman. You can download [Postman for Mac, windows, or Linux](https://www.getpostman.com/apps).
* An [IoT hub deployed to your Azure subscription](../iot-hub/iot-hub-create-through-portal.md). You need the IoT hub's connection string to complete the steps in this guide. You can get the connection string from the Azure portal.
* A [Cosmos DB database deployed to your Azure subscription](../cosmos-db/create-sql-api-dotnet.md#create-account) that uses the SQL API and that's configured for [strong consistency](../cosmos-db/how-to-manage-database-account.md). You need the Cosmos DB database's connection string to complete the steps in this guide. You can get the connection string from the Azure portal.
* An [Azure storage account deployed to your Azure subscription](../storage/common/storage-account-create.md). You need the storage account's connection string to complete the steps in this guide. You can get the connection string from the Azure portal.

## Prepare your development environment

Complete the following tasks to prepare your development environment:

* Download the source for the device simulation microservice.
* Download the source for the storage adapter microservice.
* Run the storage adapter microservice locally.

The instructions in this article assume you're using Windows. If you're using another operating system, you may need to adjust some of the file paths and commands to suit your environment.

### Download the microservices

Download and unzip the [Remote Monitoring Microservices](https://github.com/Azure/remote-monitoring-services-dotnet/archive/master.zip) from GitHub to a suitable location on your local machine. This repository includes the storage adapter microservice you need for this how-to.

Download and unzip the [device simulation microservice](https://github.com/Azure/azure-iot-pcs-device-simulation/archive/master.zip) from GitHub to a suitable location on your local machine.

### Run the storage adapter microservice

In Visual Studio Code, open the **remote-monitoring-services-dotnet-master\storage-adapter** folder. Click any **Restore** buttons to fix unresolved dependencies.

Open the **.vscode/launch.json** file and assign your Cosmos DB connection string to the **PCS\_STORAGEADAPTER\_DOCUMENTDB\_CONNSTRING**
environment variable.

> [!NOTE]
> When you run the microservice locally on your machine, it still requires a Cosmos DB instance in Azure to work properly.

To run the storage adapter microservice locally, click **Debug \> Start Debugging**.

The **Terminal** window in Visual Studio Code shows output from the running microservice including a URL for the web service health check:
<http://127.0.0.1:9022/v1/status>. When you navigate to this address,
the status should be "OK: Alive and well".

Leave the storage adapter microservice running in this instance of Visual Studio Code while you complete the following steps.

## Define your device model

Open the **device-simulation-dotnet-master** folder you downloaded from GitHub in a new instance of Visual Studio Code. Click any **Restore** buttons to fix any unresolved dependencies.

In this how-to-guide, you create a new device model for an asset tracker:

1. Create a new device model file called **assettracker-01.json** in the **Services\data\devicemodels** folder.

1. Define the device functionality in the device model **assettracker-01.json** file. The telemetry section of a Protobuf device model must:

   * Include the name of the Protobuf class you generate for your device. The following section shows you how to generate this class.
   * Specify Protobuf as the message format.

     ```json
     {
     "SchemaVersion": "1.0.0",
     "Id": "assettracker-01",
     "Version": "0.0.1",
     "Name": "Asset Tracker",
     "Description": "An asset tracker with location, temperature, and humidity",
     "Protocol": "AMQP",
     "Simulation": {
       "InitialState": {
         "online": true,
         "latitude": 47.445301,
         "longitude": -122.296307,
         "temperature": 38.0,
         "humidity": 62.0
       },
       "Interval": "00:01:00",
       "Scripts": [
         {
           "Type": "javascript",
           "Path": "assettracker-01-state.js"
         }
       ]
     },
     "Properties": {
       "Type": "AssetTracker",
       "Location": "Field",
       "Latitude": 47.445301,
       "Longitude": -122.296307
     },
     "Telemetry": [
       {
         "Interval": "00:00:10",
         "MessageTemplate": "{\"latitude\":${latitude},\"longitude\":${longitude},\"temperature\":${temperature},\"humidity\":${humidity}}",
         "MessageSchema": {
           "Name": "assettracker-sensors;v1",
           "ClassName": "Microsoft.Azure.IoTSolutions.DeviceSimulation.Services.Models.Protobuf.AssetTracker",
           "Format": "Protobuf",
           "Fields": {
             "latitude": "double",
             "longitude": "double",
             "temperature": "double",
             "humidity": "double"
           }
         }
       }
     ]
     }
     ```

### Create device behaviors script

Write the behavior script that defines how your device behaves. For more information, see [Create an advanced simulated device](iot-accelerators-device-simulation-advanced-device.md).

## Define your Protobuf format

When you have a device model and have determined your message format, you can create a **proto** file. In the **proto** file, you add:

* A `csharp_namespace` that matches the **ClassName** property in your device model.
* A message for each data structure to serialize.
* A name and type for each field in the message.

1. Create a new file called **assettracker.proto** in the **Services\Models\Protobuf\proto** folder.

1. Define the syntax, namespace, and message schema in the **proto** file as follows:

    ```proto
    syntax = "proto3";

    option csharp_namespace = "Microsoft.Azure.IoTSolutions.DeviceSimulation.Services.Models.Protobuf";

    message AssetTracker {
      double latitude=1;
      double longitude=2;
      double temperature=5;
      double humidity=6;
    }
    ```

The `=1`, `=2` markers on each element specify a unique tag the field uses in the binary encoding. Numbers 1-15 require one less byte to encode than higher numbers.

## Generate the Protobuf class

when you have a **proto** file, the next step is to generate the classes needed to read and write messages. To complete this step, you need the **Protoc** Protobuf compiler.

1. [Download the Protobuf compiler from GitHub](https://github.com/protocolbuffers/protobuf/releases/download/v3.4.0/protoc-3.4.0-win32.zip)

1. Run the compiler, specifying the source directory, the destination directory, and the name of your **proto** file. For example:

    ```cmd
    protoc -I c:\temp\device-simulation-dotnet-master\Services\Models\Protobuf\proto --csharp_out=C:\temp\device-simulation-dotnet-master\Services\Models\Protobuf assettracker.proto
    ```

    This command generates an **Assettracker.cs** file in the **Services\Models\Protobuf** folder.

## Test Protobuf locally

In this section, you test the asset tracker device you created in the previous sections locally.

### Run the device simulation microservice

Open the **.vscode/launch.json** file and assign your:

* IoT Hub connection string to the **PCS\_IOTHUB\_CONNSTRING** environment variable.
* Storage account connection string to the **PCS\_AZURE\_STORAGE\_ACCOUNT** environment variable.
* Cosmos DB connection string to the **PCS\_STORAGEADAPTER\_DOCUMENTDB\_CONNSTRING** environment variable.

Open the **WebService/Properties/launchSettings.json** file and assign your:

* IoT Hub connection string to the **PCS\_IOTHUB\_CONNSTRING** environment variable.
* Storage account connection string to the **PCS\_AZURE\_STORAGE\_ACCOUNT** environment variable.
* Cosmos DB connection string to the **PCS\_STORAGEADAPTER\_DOCUMENTDB\_CONNSTRING** environment variable.

Open the **WebService\appsettings.ini** file and modify the settings as follows:

#### Configure the solution to include your new device model files

By default, your new device model JSON and JS files won't be copied into the built solution. You need to explicitly include them.

Add an entry to the **services\services.csproj** file for each file you want included. For example:

```xml
<None Update="data\devicemodels\assettracker-01.json">
    <CopyToOutputDirectory>Always</CopyToOutputDirectory>
</None>
<None Update="data\devicemodels\scripts\assettracker-01-state.js">
    <CopyToOutputDirectory>Always</CopyToOutputDirectory>
</None>
```

To run the microservice locally, click **Debug \> Start Debugging**.

The **Terminal** window in Visual Studio Code shows output from the running microservice.

Leave the device simulation microservice running in this instance of Visual Studio Code while you complete the next steps.

### Set up a monitor for device events

In this section, you use the Azure CLI to set up an event monitor to view the telemetry sent from the devices connected to your IoT hub.

The following script assumes that the name of your IoT hub is
**device-simulation-test**.

```azurecli-interactive
# Install the IoT extension if it's not already installed
az extension add --name azure-iot

# Monitor telemetry sent to your hub
az iot hub monitor-events --hub-name device-simulation-test
```

Leave the event monitor running while you test the simulated devices.

### Create a simulation with the asset tracker device type

In this section, you use the Postman tool to request the device simulation microservice to run a simulation using the asset tracker device type. Postman is a tool that lets you send REST requests to a web service.

To set up Postman:

1. Open Postman on your local machine.

1. Click **File \> Import**. Then click **Choose Files**.

1. Select **Azure IoT Device Simulation solution accelerator.postman\_collection** and **Azure IoT Device Simulation solution accelerator.postman\_environment** and click **Open**.

1. Expand the **Azure IoT Device Simulation solution accelerator** to view the requests you can send.

1. Click **No Environment** and select **Azure IoT Device Simulation  solution accelerator**.

You now have a collection and environment loaded in your Postman workspace that you can use to interact with the device simulation microservice.

To configure and run the simulation:

1. In the Postman collection, select **Create asset tracker simulation** and click **Send**. This request creates four instances of the simulated asset tracker device type.

1. The event monitor output in the Azure CLI window shows the telemetry from the simulated devices.

To stop the simulation, select the **Stop simulation** request in Postman and click **Send**.

### Clean up resources

You can stop the two locally running microservices in their Visual Studio Code instances (**Debug \> Stop Debugging**).

If you no longer require the IoT Hub and Cosmos DB instances, delete them from your Azure subscription to avoid any unnecessary charges.

## IoT Hub Support

Many IoT Hub features do not natively support Protobuf or other binary formats. For example, you cannot route based on message payload because IoT Hub will be unable to process the message payload. You can, however,
route based on message headers.

## Next steps

Now you've learned how to customize Device Simulation to use Protobuf to send telemetry, the next step is visit the GitHub repository to learn more [Device simulation](https://github.com/Azure/azure-iot-pcs-device-simulation).
