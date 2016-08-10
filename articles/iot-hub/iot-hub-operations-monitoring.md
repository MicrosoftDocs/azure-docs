<properties
 pageTitle="IoT Hub operations monitoring"
 description="An overview of Azure IoT Hub operations monitoring, enabling users to monitor the status of operations on their IoT hub in real time"
 services="iot-hub"
 documentationCenter=""
 authors="nberdy"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="07/07/2016"
 ms.author="nberdy"/>

# Introduction to operations monitoring

IoT Hub operations monitoring enables users to monitor the status of operations on their IoT hub in real time. IoT Hub tracks events across several categories of operations, and users can opt into having events from one or more categories sent to an endpoint of their IoT hub for processing. Users can monitor the data for errors or set up more complex processing based on data patterns.

IoT Hub monitors five categories of events:

- Device identity operations
- Device telemetry
- Cloud-to-device commands
- Connections
- File uploads

## How to enable operations monitoring

1. Create an IoT hub. You can find instructions on how to create an IoT hub in the [Get Started][lnk-get-started] guide.

2. Open the blade of your IoT hub. From there, click **Operations monitoring**.

    ![][1]

3. Select the monitoring categories you wish you monitor, and then click **Save**. The events are available for reading from the Event Hub-compatible endpoint listed in **Monitoring settings**. The IoT Hub endpoint is called `messages/operationsmonitoringevents`.

    ![][2]

## Event categories and how to use them

Each operations monitoring category tracks a different type of interaction with IoT Hub, and each monitoring category has a schema which defines how events in that category are structured.

### Device identity operations

The device identity operations category tracks errors which occur when the user attempts to create, update, or delete an entry in their IoT hub’s identity registry. Tracking this category is useful for provisioning scenarios.

    {
        "time": "UTC timestamp",
         "operationName": "create",
         "category": "DeviceIdentityOperations",
         "level": "Error",
         "statusCode": 4XX,
         "statusDescription": "MessageDescription",
         "deviceId": "device-ID",
         "durationMs": 1234,
         "userAgent": “userAgent”,
         "sharedAccessPolicy": "accessPolicy"
    }

### Device telemetry

The device telemetry category tracks errors which occur at the IoT hub and are related to the telemetry pipeline. This includes errors which occur when sending telemetry events (such as throttling) and receiving telemetry events (such as unauthorized reader). Note that this category cannot catch errors caused by code running on the device itself.

    {
         "messageSizeInBytes": 1234,
         "batching": 0,
         "protocol": "Amqp",
         "authType": "{\"scope\":\"device\",\"type\":\"sas\",\"issuer\":\"iothub\"}",
         "time": "UTC timestamp",
         "operationName": "ingress",
         "category": "DeviceTelemetry",
         "level": "Error",
         "statusCode": 4XX,
         "statusType": 4XX001,
         "statusDescription": "MessageDescription",
         "deviceId": "device-ID",
         "EventProcessedUtcTime": "UTC timestamp",
         "PartitionId": 1,
         "EventEnqueuedUtcTime": "UTC timestamp"
    }

### Cloud-to-device commands

The cloud-to-device commands category tracks errors which occur at the IoT hub and are related to the device command pipeline. This includes errors which occur when sending commands (such as unauthorized sender), receiving commands (such as delivery count exceeded), and receiving command feedback (such as feedback expired). This category does not catch errors from a device that improperly handles a command if the command was delivered successfully.

    {
         "messageSizeInBytes": 1234,
         "authType": "{\"scope\":\"hub\",\"type\":\"sas\",\"issuer\":\"iothub\"}",
         "deliveryAcknowledgement": 0,
         "protocol": "Amqp",
         "time": " UTC timestamp",
         "operationName": "ingress",
         "category": "C2DCommands",
         "level": "Error",
         "statusCode": 4XX,
         "statusType": 4XX001,
         "statusDescription": "MessageDescription",
         "deviceId": "device-ID",
         "EventProcessedUtcTime": "UTC timestamp",
         "PartitionId": 1,
         "EventEnqueuedUtcTime": “UTC timestamp"
    }

### Connections

The connections category tracks errors when devices connect or disconnect from an IoT hub. Tracking this category is useful for identifying unauthorized connection attempts and for tracking when a connection is lost for devices in areas of poor connectivity.

    {
         "durationMs": 1234,
         "authType": "{\"scope\":\"hub\",\"type\":\"sas\",\"issuer\":\"iothub\"}",
         "protocol": "Amqp",
         "time": " UTC timestamp",
         "operationName": "deviceConnect",
         "category": "Connections",
         "level": "Error",
         "statusCode": 4XX,
         "statusType": 4XX001,
         "statusDescription": "MessageDescription",
         "deviceId": "device-ID"
    }

### File uploads

The file upload category tracks errors which occur at the IoT hub and are related to file upload functionality. This includes errors which occur with the SAS URI (such as when it expires before a device notifies the hub of a completed upload), failed uploads reported by the device, and when a file is not found in storage during IoT Hub notification message creation. Note that this category cannot catch errors which directly occur while the device is uploading a file to storage.

    {
         "authType": "{\"scope\":\"hub\",\"type\":\"sas\",\"issuer\":\"iothub\"}",
         "protocol": "HTTP",
         "time": " UTC timestamp",
         "operationName": "ingress",
         "category": "fileUpload",
         "level": "Error",
         "statusCode": 4XX,
         "statusType": 4XX001,
         "statusDescription": "MessageDescription",
         "deviceId": "device-ID",
         "blobUri": "http//bloburi.com",
         "durationMs": 1234
    }

## Next steps

Now that you’ve seen an overview of operations monitoring, see [Manage access to IoT Hub][lnk-itpro] for additional information about managing IoT Hub.

To further explore the capabilities of IoT Hub, see:

- [Designing your solution][lnk-design]
- [Developer guide][lnk-devguide]
- [Exploring device management using the sample UI][lnk-dmui]
- [Simulating a device with the Gateway SDK][lnk-gateway]

<!-- Links and images -->
[1]: media/iot-hub-operations-monitoring/enable-OM-1.png
[2]: media/iot-hub-operations-monitoring/enable-OM-2.png

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[lnk-diagnostic-metrics]: iot-hub-metrics.md
[lnk-scaling]: iot-hub-scaling.md
[lnk-dr]: iot-hub-ha-dr.md

[lnk-itpro]: iot-hub-itpro-info.md

[lnk-design]: iot-hub-guidance.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-dmui]: iot-hub-device-management-ui-sample.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md