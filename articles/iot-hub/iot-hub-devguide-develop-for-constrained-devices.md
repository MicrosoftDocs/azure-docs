---
title: Azure IoT Hub Develop for Constrained Devices using IoT Hub C SDK
description: Developer guide - guidance on how to develop using Azure IoT SDKs for constrained devices. 
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 05/24/2018
ms.author: robinsh
ms.custom: [amqp, mqtt]
---

# Develop for constrained devices using Azure IoT C SDK

Azure IoT Hub C SDK is written in ANSI C (C99), which makes it well-suited to operate a variety of platforms with small disk and memory footprint. The recommended RAM is at least 64 KB, but the exact memory footprint depends on the protocol used, the number of connections opened, as well as the platform targeted.
> [!NOTE]
> * Azure IoT C SDK regularly publishes resource consumption information to help with development.  Please visit our [GitHub repository](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/c_sdk_resource_information.md) and review the latest benchmark.
>

C SDK is available in package form from apt-get, NuGet, and MBED. To target constrained devices, you may want to build the SDK locally for your target platform. This documentation demonstrates how to remove certain features to shrink the footprint of the C SDK using [cmake](https://cmake.org/). In addition, this documentation discusses the best practice programming models for working with constrained devices.

## Building the C SDK for constrained devices

Build the C SDK for constrained devices.

### Prerequisites

Follow this [C SDK setup guide](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) to prepare your development environment for building the C SDK. Before you get to the step for building with cmake, you can invoke cmake flags to remove unused features.

### Remove additional protocol libraries

C SDK supports five protocols today: MQTT, MQTT over WebSocket, AMQPs, AMQP over WebSocket, and HTTPS. Most scenarios require one to two protocols running on a client, hence you can remove the protocol library you are not using from the SDK. Additional information about choosing the appropriate communication protocol for your scenario can be found in [Choose an IoT Hub communication protocol](iot-hub-devguide-protocols.md). For example, MQTT is a lightweight protocol that is often better suited for constrained devices.

You can remove the AMQP and HTTP libraries using the following cmake command:

```
cmake -Duse_amqp=OFF -Duse_http=OFF <Path_to_cmake>
```

### Remove SDK logging capability

The C SDK provides extensive logging throughout to help with debugging. You can remove the logging capability for production devices using the following cmake command:

```
cmake -Dno_logging=OFF <Path_to_cmake>
```

### Remove upload to blob capability

You can upload large files to Azure Storage using the built-in capability in the SDK. Azure IoT Hub acts as a dispatcher to an associated Azure Storage account. You can use this feature to send media files, large telemetry batches, and logs. You can get more information in [uploading files with IoT Hub](iot-hub-devguide-file-upload.md). If your application does not require this functionality, you can remove this feature using the following cmake command:

```
cmake -Ddont_use_uploadtoblob=ON <Path_to_cmake>
```

### Running strip on Linux environment

If your binaries run on Linux system, you can leverage the [strip command](https://en.wikipedia.org/wiki/Strip_(Unix)) to reduce the size of the final application after compiling.

```
strip -s <Path_to_executable>
```

## Programming models for constrained devices

Next, look at programming models for constrained devices.

### Avoid using the Serializer

The C SDK has an optional [C SDK serializer](https://github.com/Azure/azure-iot-sdk-c/tree/master/serializer), which allows you to use declarative mapping tables to define methods and device twin properties. The serializer is designed to simplify development, but it adds overhead, which is not optimal for constrained devices. In this case, consider using primitive client APIs and parse JSON by using a lightweight parser such as [parson](https://github.com/kgabis/parson).

### Use the lower layer (_LL_)

The C SDK supports two programming models. One set has APIs with an _LL_ infix, which stands for lower layer. This set of APIs is lighter weight and do not spin up worker threads, which means the user must manually control scheduling. For example, for the device client, the _LL_ APIs can be found in this [header file](https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/inc/iothub_device_client_ll.h). 

Another set of APIs without the _LL_ index is called the convenience layer, where a worker thread is spun automatically. For example, the convenience layer APIs for the device client can be found in this [IoT Device Client header file](https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/inc/iothub_device_client.h). For constrained devices where each extra thread can take a substantial percentage of system resources, consider using _LL_ APIs.

## Next steps

To learn more about Azure IoT C SDK architecture:
-    [Azure IoT C SDK source code](https://github.com/Azure/azure-iot-sdk-c/)
-    [Azure IoT device SDK for C introduction](iot-hub-device-sdk-c-intro.md)
