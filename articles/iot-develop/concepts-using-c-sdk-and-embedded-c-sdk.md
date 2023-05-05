---
title: C SDK and Embedded C SDK usage scenarios
description: Helps developers decide which C-based Azure IoT device SDK to use for device development, based on their usage scenario.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: conceptual
ms.date: 09/16/2022
ms.custom: template-concept
#Customer intent: As a device developer, I want to understand when to use the Azure IoT C SDK or the Embedded C SDK to optimize device and application performance.
---

# C SDK and Embedded C SDK usage scenarios

Microsoft provides Azure IoT device SDKs and middleware for embedded and constrained device scenarios.  This article helps device developers decide which one to use for your application. 

The following diagram shows four common scenarios in which customers connect devices to Azure IoT, using a C-based (C99) SDK. The rest of this article provides more details on each scenario. 

:::image type="content" source="media/concepts-using-c-sdk-and-embedded-c-sdk/sdk-scenarios-overview.png" alt-text="Diagram of common SDK scenarios." border="false":::

## Scenario 1 – Azure IoT C SDK (for Linux and Windows)

Starting in 2015, [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) was the first Azure SDK created to connect devices to IoT services. It's a stable platform that was built to provide the following capabilities for connecting devices to Azure IoT:
- IoT Hub services
- Device Provisioning Service clients
- Three choices of communication transport (MQTT, AMQP and HTTP), which are created and maintained by Microsoft
- Multiple choices of common TLS stacks (OpenSSL, Schannel and Bed TLS according to the target platform)
- TCP sockets (Win32, Berkeley or Mbed)

Providing communication transport, TLS and socket abstraction has a performance cost. Many paths require `malloc` and `memcpy` calls between the various abstraction layers. This performance cost is small compared to a desktop or a Raspberry Pi device. Yet on a truly constrained device, the cost becomes significant overhead with the possibility of memory fragmentation. The communication transport layer also requires a `doWork` function to be called at least every 100 milliseconds. These frequent calls make it harder to optimize the SDK for battery powered devices. The existence of multiple abstraction layers also makes it hard for customers to use or change to any given library.

Scenario 1 is recommended for Windows or Linux devices, which normally are less sensitive to memory usage or power consumption. However, Windows and Linux-based devices can also use the Embedded C SDK as shown in Scenario 2. Other options for windows and Linux-based devices include the other Azure IoT device SDKs: [Java SDK](https://github.com/Azure/azure-iot-sdk-java), [.NET SDK](https://github.com/Azure/azure-iot-sdk-csharp), [Node SDK](https://github.com/Azure/azure-iot-sdk-node) and [Python SDK](https://github.com/Azure/azure-iot-sdk-python). 

## Scenario 2 – Embedded C SDK (for Bare Metal scenarios and micro-controllers)

In 2020, Microsoft released the [Azure SDK for Embedded C](https://github.com/Azure/azure-sdk-for-c/tree/main/sdk/docs/iot) (also known as the Embedded C SDK).  This SDK was built based on customers feedback and a growing need to support constrained [micro-controller devices](concepts-iot-device-types.md#microcontrollers-vs-microprocessors).  Typically, constrained micro-controllers have reduced memory and processing power. 

The Embedded C SDK has the following key characteristics:
-	No dynamic memory allocation. Customers must allocate data structures where they desire such as in global memory, a heap, or a stack.  Then they must pass the address of the allocated structure into SDK functions to initialize and perform various operations.
-	MQTT only.  MQTT-only usage is ideal for constrained devices because it's an efficient, lightweight network protocol. Currently only MQTT v3.1.1 is supported. 
-	Bring your own network stack. The Embedded C SDK performs no I/O operations.  This approach allows customers to select the MQTT, TLS and Socket clients that have the best fit to their target platform.
-	Similar [feature set](concepts-iot-device-types.md#microcontrollers-vs-microprocessors) as the C SDK. The Embedded C SDK provides similar features as the Azure IoT C SDK, with the following exceptions that the Embedded C SDK doesn't provide:  
    - Upload to blob
    - The ability to run as an IoT Edge module
    - AMQP-based features like content message batching and device multiplexing
-	Smaller overall [footprint](https://github.com/Azure/azure-sdk-for-c/tree/main/sdk/docs/iot#size-chart). The Embedded C SDK, as see in a sample that shows how to connect to IoT Hub, can take as little as 74 KB of ROM and 8.26 KB of RAM.

The Embedded C SDK supports micro-controllers with no operating system, micro-controllers with a real-time operating system (like Azure RTOS), Linux, and Windows. Customers can implement custom platform layers to use the SDK on custom devices. The SDK also provides some platform layers such as [Arduino](https://github.com/Azure/azure-sdk-for-c-arduino), and [Swift](https://github.com/Azure-Samples/azure-sdk-for-c-swift).  Microsoft encourages the community to submit other platform layers to increase the out-of-the-box supported platforms. Wind River [VxWorks](https://github.com/Azure/azure-sdk-for-c/blob/main/sdk/samples/iot/docs/how_to_iot_hub_samples_vxworks.md) is an example of a platform layer submitted by the community. 

The Embedded C SDK adds some programming benefits because of its flexibility compared to the Azure IoT C SDK. In particular, applications that use constrained devices will benefit from enormous resource savings and greater programmatic control.  In comparison, if you use Azure RTOS or FreeRTOS, you can have these same benefits along with other features per RTOS implementation.

## Scenario 3 – Azure RTOS with Azure RTOS middleware (for Azure RTOS-based projects)

Scenario 3 involves using Azure RTOS and the [Azure RTOS middleware](https://github.com/azure-rtos/netxduo/tree/master/addons/azure_iot).  Azure RTOS is built on top of the Embedded C SDK, and adds MQTT and TLS Support. The middleware for Azure RTOS exposes APIs for the application that are similar to the native Azure RTOS APIs.  This approach makes it simpler for developers to use the APIs and connect their Azure RTOS-based devices to Azure IoT. Azure RTOS is a fully integrated, efficient, real time embedded platform, that provides all the networking and IoT features you need for your solution.

Samples for several popular developer kits from ST, NXP, Renesas, and Microchip, are available.  These samples work with Azure IoT Hub or Azure IoT Central, and are available as IAR Workbench or semiconductor IDE projects on [GitHub](https://github.com/azure-rtos/samples).

Because it's based on the Embedded C SDK, the Azure IoT middleware for Azure RTOS is non-memory allocating. Customers must allocate SDK data structures in global memory, or a heap, or a stack. After customers allocate a data structure, they must pass the address of the structure into the SDK functions to initialize and perform various operations.

## Scenario 4 – FreeRTOS with FreeRTOS middleware (for use with FreeRTOS-based projects)

Scenario 4 brings the embedded C middleware to FreeRTOS.  The embedded C middleware is built on top of the Embedded C SDK and adds MQTT support via the open source coreMQTT library. This middleware for FreeRTOS operates at the MQTT level. It establishes the MQTT connection, subscribes and unsubscribes from topics, and sends and receives messages. Disconnections are handled by the customer via middleware APIs.

Customers control the TLS/TCP configuration and connection to the endpoint. This approach allows for flexibility between software or hardware implementations of either stack. No background tasks are created by the Azure IoT middleware for FreeRTOS. Messages are sent and received synchronously.

The core implementation is provided in this [GitHub repository](https://github.com/Azure/azure-iot-middleware-freertos). Samples for several popular developer kits are available, including the NXP1060, STM32, and ESP32.  The samples work with Azure IoT Hub, Azure IoT Central, and Azure Device Provisioning Service, and are available in this [GitHub repository](https://github.com/Azure-Samples/iot-middleware-freertos-samples).

Because it's based on the Azure Embedded C SDK, the Azure IoT middleware for FreeRTOS is also non-memory allocating. Customers must allocate SDK data structures in global memory, or a heap, or a stack. After customers allocate a data structure, they must pass the address of the allocated structures into the SDK functions to initialize and perform various operations.

## C-based SDK technical usage scenarios

The following diagram summarizes technical options for each SDK usage scenario described in this article.

:::image type="content" source="media/concepts-using-c-sdk-and-embedded-c-sdk/sdk-scenarios-summary.png" alt-text="Diagram with developer details for the four C SDK usage scenarios." border="false":::

## C-based SDK comparison by memory and protocols

The following table compares the four device SDK development scenarios based on memory and protocol usage. 

| &nbsp; | **Memory <br>allocation** | **Memory <br>usage** | **Protocols <br>supported** | **Recommended for** |
| :-- | :-- | :-- | :-- | :-- |
| **Azure IoT C SDK**  | Mostly Dynamic | Unrestricted. Can span <br>to 1 MB or more in RAM. | AMQP<br>HTTP<br>MQTT v3.1.1 | Microprocessor-based systems<br>Microsoft Windows<br>Linux<br>Apple OS X |
| **Azure SDK for Embedded C**  | Static only | Restricted by amount of <br>data application allocates.  | MQTT v3.1.1 | Micro-controllers <br>Bare-metal Implementations <br>RTOS-based implementations |
| **Azure IoT Middleware for Azure RTOS**  | Static only | Restricted | MQTT v3.1.1 | Micro-controllers <br>RTOS-based implementations |
| **Azure IoT Middleware for FreeRTOS**  | Static only | Restricted | MQTT v3.1.1 | Micro-controllers <br>RTOS-based implementations |

## Azure IoT Features Supported by each SDK

The following table compares the four device SDK development scenarios based on support for Azure IoT features. 

| &nbsp; | **Azure IoT C SDK** | **Azure SDK for <br>Embedded C** | **Azure IoT <br>middleware for <br>Azure RTOS** | **Azure IoT <br>middleware for <br>FreeRTOS** |
| :-- | :-- | :-- | :-- | :-- |
| SAS Client Authentication | Yes | Yes | Yes | Yes |
| x509 Client Authentication | Yes | Yes | Yes | Yes |
| Device Provisioning | Yes | Yes | Yes | Yes |
| Telemetry | Yes | Yes | Yes | Yes |
| Cloud-to-Device Messages | Yes | Yes | Yes | Yes |
| Direct Methods | Yes | Yes | Yes | Yes |
| Device Twin | Yes | Yes | Yes | Yes |
| IoT Plug-And-Play | Yes | Yes | Yes | Yes |
| Telemetry batching <br>(AMQP, HTTP) | Yes | No | No | No |
| Uploads to Azure Blob | Yes | No | No | No |
| Automatic integration in <br>IoT Edge hosted containers | Yes | No | No | No |


## Next steps

To learn more about device development and the available SDKs for Azure IoT, see the following table. 
- [Azure IoT Device Development](index.yml)
- [Which SDK should I use](about-iot-sdks.md)
