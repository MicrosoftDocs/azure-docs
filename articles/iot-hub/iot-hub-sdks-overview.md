<properties
 pageTitle="Azure IoT Hub SDKs Overview | Microsoft Azure"
 description="An overview of the Azure IoT SDKs you can use to develop your Azure IoT solutions. Includes links to additional material."
 services="azure-iot"
 documentationCenter=".net"
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="azure-iot"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date=""
 ms.author="dobett"/>

# Azure IoT Hub SDKs Overview

This article provides an overview of the Azure IoT SDKs you can use to develop your Azure IoT solutions. For each IoT SDK, the article describes its key features, suggested use cases, and provides links to reference documentation.

The article describes the following IoT SDKs:
- Azure IoT service SDK for .NET
- Azure IoT device IoT device SDK for C
- Azure IoT device IoT device SDK for Java
- Azure IoT device IoT device SDK for Node

[_TDB_ QUESTION: Does the .NET IoT device SDKs support ARM (through a PCL) or is it just win32?]

## Azure IoT service SDK for .NET
You can use this IoT service SDK to develop both IoT client devices and manage your IoT Hub service instances in the cloud.

Typically, you use the NuGet package management system to install the assemblies and their dependencies in your .NET project.

### Features

The IoT service SDK for .NET includes the following three main features:
- A device client you can use to implement IoT client applications. This includes sending device-to-cloud telemetry data and receiving cloud-to-device commands. You can choose to use either HTTP or AMQP as the communications protocol.
- A service client you can use to send cloud-to-device commands from IoT Hub to your devices.
- A registry manager that you can use to manage the contents of the IoT Hub device identity registry. The device identity registry stores information about each device that is permitted to connect to the IoT hub. This device information includes the unique device identifier, the device's access key, and enabled state of the device.

### Use cases
You can use the device client to implement IoT client applications that run on devices that support the .NET framework. These devices typically run a version of the Windows operating system. These IoT client applications may just send telemetry data to IoT Hub or additionally be able to receive and process commands sent from IoT Hub.

You can use the service client to implement logic in your cloud applications that sends commands to one or more devices. Typically, you send cloud-to-device commands either from a UI hosted in an Azure App Service or web role, or from an automated process hosted in a worker role or Web Job.

You can use the registry management feature of the IoT service SDK to provision new devices and perform basic management operations such as changing device keys and enabling and disabling devices.

The IoT Hub device identity registry stores device ids, access keys, and the device's enabled state. Typically, an IoT application must store more detailed state information about devices such as the list of commands supported by a device, and device software and hardware version information. You can use the registry management capabilities in the IoT service SDK to keep your custom device information synchronized with the IoT Hub device identity registry.

### Reference
[_TBD_ links to MSDN reference documentation]

## Azure IoT device SDK for C
You can use the IoT device SDK for C to implement client IoT applications on a broad range of hardware devices and operating systems. The IoT device SDK libraries are distributed as source code that you can build for your target platform.

### Features
You can use the libraries to implement IoT client applications that can send device-to-cloud telemetry data to IoT Hub and receive and process cloud-to-device commands sent from IoT Hub.

The libraries support the AMQP and HTTP protocols for communication with IoT Hub. The library uses the open source Proton-C libraries to handle the AMQP communication.

The IoT device SDK includes two libraries you can use when you build an IoT client device application:
- Transport library (iothub_client)
- Message serialization library (serializer)

The iothub_client library enables you to send messages to IoT Hub. The library sends messages asynchronously and optionally invokes a notification callback function when it has sent the message.

The iothub_client library enables you to receive cloud-to-device commands sent from IoT Hub by specifying a notification callback function in your application.

The _serializer_ library enables you to serialize and deserialize your messages. You to define the behavior of your IoT client through a model that specifies the device-to-cloud telemetry that the device can send and the cloud-to-device commands that the device can receive. The serializer library can serialize and deserialize the messages defined in your model. You define a device model in code as shown here:

```
#include "serializer.h"
BEGIN_IOT_DECLARATIONS(MyFunkyTV)
DECLARE_IOT_STRUCT(MenuType,
    int, source,
    double, brightness
    );

DECLARE_IOT_MODEL(FunkyTV,
    WITH_DATA(int, screenSize),
    WITH_DATA(bool, hasEthernet),
    WITH_DATA(MenuType, tvMenu),
    WITH_ACTION(LostSignal, int, source, int, resolution)
);

DECLARE_IOT_MODEL(AnotherDevice,
    …
);

END_IOT_DECLARATIONS(MyFunkyTV);

```

This example model defines two devices (**FunkyTV** and **AnotherDevice**) in the **MyFunkyTV** schema namespace. A **FunkyTV** device can send its screensize, ethernet capability, and menu type in a device-to-cloud message and respond to a cloud-to-device lost signal command sent from IoT Hub.

The serializer library enables you to send asynchronously any of the data defined in the model and optionally to batch multiple send operations together. The schema client can optionally invoke a callback function when it has sent the telemetry data.

The serializer library invokes a callback function when it receives any of the action commands defined in the model.

### Use cases
You can use the iothub_client and serializer libraries to implement IoT client applications that run on a [wide range of devices][lnk-list-supported-platforms]. These IoT client applications may just send telemetry data to IoT Hub or additionally be able to receive and process commands sent from IoT Hub.

### Reference
[_TBD_ links to MSDN reference documentation]

## Azure IoT device SDK for Java
You can use the IoT device SDK for Java to implement client IoT applications on the broad range of hardware devices and operating systems that support the Java programming language.

### Features
You can use the libraries to implement IoT client applications that can send device-to-cloud telemetry data to IoT Hub and receive and process cloud-to-device commands sent from IoT Hub.

The libraries support the AMQP and HTTP protocols for communication with IoT Hub. The library uses the open source Proton libraries to handle the AMQP communication.

### Use cases

### Reference
[_TBD_ links to MSDN reference documentation]

## Azure IoT device SDK for Node
You can use the IoT device SDK for Node to implement client IoT applications on the broad range of hardware devices and operating systems that support the Node.js platform.

### Features
You can use the libraries to implement IoT client applications that can send device-to-cloud telemetry data to IoT Hub and receive and process cloud-to-device commands sent from IoT Hub.

The libraries support the AMQP and HTTP protocols for communication with IoT Hub.

### Use cases

### Reference
[_TBD_ links to MSDN reference documentation]

[lnk-list-supported-platforms]: TBD
