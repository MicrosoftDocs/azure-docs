---
title: Azure IoT Hub operations monitoring | Microsoft Docs
description: How to use Azure IoT Hub operations monitoring to monitor the status of operations on your IoT hub in real time.
services: iot-hub
documentationcenter: ''
author: nberdy
manager: timlt
editor: ''

ms.assetid: a299f3a5-b14d-4586-9c3b-44aea14ed013
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/13/2016
ms.author: nberdy

---
# IoT Hub operations monitoring
IoT Hub operations monitoring enables you to monitor the status of operations on your IoT hub in real time. IoT Hub tracks events across several categories of operations. You can opt into sending events from one or more categories to an endpoint of your IoT hub for processing. You can monitor the data for errors or set up more complex processing based on data patterns.

IoT Hub monitors six categories of events:

* Device identity operations
* Device telemetry
* Cloud-to-device messages
* Connections
* File uploads
* Message routing

## How to enable operations monitoring
1. Create an IoT hub. You can find instructions on how to create an IoT hub in the [Get Started][lnk-get-started] guide.
2. Open the blade of your IoT hub. From there, click **Operations monitoring**.
   
    ![][1]
3. Select the monitoring categories you wish you monitor, and then click **Save**. The events are available for reading from the Event Hub-compatible endpoint listed in **Monitoring settings**. The IoT Hub endpoint is called `messages/operationsmonitoringevents`.
   
    ![][2]

> [!NOTE]
> Selecting **Verbose** monitoring for the **Connections** category causes IoT Hub to generate additional diagnostics messages. For all other categories, the **Verbose** setting changes the quantity of information IoT Hub includes in each error message.

## Event categories and how to use them
Each operations monitoring category tracks a different type of interaction with IoT Hub, and each monitoring category has a schema that defines how events in that category are structured.

### Device identity operations
The device identity operations category tracks errors that occur when you attempt to create, update, or delete an entry in your IoT hub's identity registry. Tracking this category is useful for provisioning scenarios.

    {
        "time": "UTC timestamp",
         "operationName": "create",
         "category": "DeviceIdentityOperations",
         "level": "Error",
         "statusCode": 4XX,
         "statusDescription": "MessageDescription",
         "deviceId": "device-ID",
         "durationMs": 1234,
         "userAgent": "userAgent",
         "sharedAccessPolicy": "accessPolicy"
    }

### Device telemetry
The device telemetry category tracks errors that occur at the IoT hub and are related to the telemetry pipeline. This category includes errors that occur when sending telemetry events (such as throttling) and receiving telemetry events (such as unauthorized reader). Note that this category cannot catch errors caused by code running on the device itself.

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
The cloud-to-device commands category tracks errors that occur at the IoT hub and are related to the cloud-to-device message pipeline. This category includes errors that occur when sending cloud-to-device messages (such as unauthorized sender), receiving cloud-to-device messages (such as delivery count exceeded), and receiving cloud-to-device message feedback (such as feedback expired). This category does not catch errors from a device that improperly handles a cloud-to-device message if the cloud-to-device message was delivered successfully.

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
The connections category tracks errors that occur when devices connect or disconnect from an IoT hub. Tracking this category is useful for identifying unauthorized connection attempts and for tracking when a connection is lost for devices in areas of poor connectivity.

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

The file upload category tracks errors that occur at the IoT hub and are related to file upload functionality. This category includes:

- Errors that occur with the SAS URI, such as when it expires before a device notifies the hub of a completed upload.
- Failed uploads reported by the device.
- Errors that occur when a file is not found in storage during IoT Hub notification message creation.

Note that this category cannot catch errors that directly occur while the device is uploading a file to storage.


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

### Message routing
The message routing category tracks errors that occur during message route evaluation and endpoint health as perceived by IoT Hub. This category includes events such as when a rule evaluates to "undefined", when IoT Hub marks an endpoint as dead, and any other errors received from an endpoint. Note that this category does not include specific errors about the messages themselves (such as device throttling errors), which are reported under the "device telemetry" category.
		
    {
        "messageSizeInBytes": 1234,
        "time": "UTC timestamp",
        "operationName": "ingress",
        "category": "routes",
        "level": "Error",
        "deviceId": "device-ID",
        "messageId": "ID of message",
        "routeName": "myroute",
        "endpointName": "myendpoint",
        "details": "ExternalEndpointDisabled"
    }

## Next steps
To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide][lnk-devguide]
* [Simulating a device with the IoT Gateway SDK][lnk-gateway]

<!-- Links and images -->
[1]: media/iot-hub-operations-monitoring/enable-OM-1.png
[2]: media/iot-hub-operations-monitoring/enable-OM-2.png

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[lnk-diagnostic-metrics]: iot-hub-metrics.md
[lnk-scaling]: iot-hub-scaling.md
[lnk-dr]: iot-hub-ha-dr.md

[lnk-devguide]: iot-hub-devguide.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
