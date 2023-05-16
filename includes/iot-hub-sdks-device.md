---
 title: include file
 description: include file
 services: iot-hub
 author: dominicbetts
 ms.service: iot-hub
 ms.topic: include
 ms.date: 02/20/2023
 ms.author: dobett
 ms.custom: include file
---

The Microsoft Azure IoT device SDKs contain code that facilitates building applications that connect to and are managed by Azure IoT Hub services. These SDKs can run on a general MPU-based computing device such as a PC, tablet, smartphone, or Raspberry Pi. The SDKs support development in C and in modern managed languages including in C#, Node.JS, Python, and Java.

The SDKs are available in **multiple languages** providing the flexibility to choose which best suits your team and scenario.

| Language | Package | Source | Quickstarts | Samples | Reference |
| :-- | :-- | :-- | :-- | :-- | :-- |
| **.NET** | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client) | [GitHub](https://github.com/Azure/azure-iot-sdk-csharp) | [Connect to IoT Hub](../articles/iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp) | [Samples](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples) | [Reference](/dotnet/api/microsoft.azure.devices.client) |
| **Python** | [pip](https://pypi.org/project/azure-iot-device/) | [GitHub](https://github.com/Azure/azure-iot-sdk-python) | [Connect to IoT Hub](../articles/iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-python) | [Samples](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples) | [Reference](/python/api/azure-iot-device) |
| **Node.js** | [npm](https://www.npmjs.com/package/azure-iot-device) | [GitHub](https://github.com/Azure/azure-iot-sdk-node) | [Connect to IoT Hub](../articles/iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs) | [Samples](https://github.com/Azure/azure-iot-sdk-node/tree/main/device/samples) | [Reference](/javascript/api/azure-iot-device/) |
| **Java** | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-device-client) | [GitHub](https://github.com/Azure/azure-iot-sdk-java) | [Connect to IoT Hub](../articles/iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-java) | [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples) | [Reference](/java/api/com.microsoft.azure.sdk.iot.device) |
| **C** | [packages](https://github.com/Azure/azure-iot-sdk-c/blob/main/readme.md#getting-the-sdk) | [GitHub](https://github.com/Azure/azure-iot-sdk-c) | [Connect to IoT Hub](../articles/iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-ansi-c) | [Samples](https://github.com/Azure/azure-iot-sdk-c/tree/main/iothub_client/samples) | [Reference](https://azure.github.io/azure-iot-sdk-c/files.html) |

The Java device SDK includes [samples for Android](https://github.com/Azure/azure-iot-sdk-java/blob/main/doc/java-devbox-setup.md#building-for-android-device).

The C device SDK includes [samples for iOS that use CocoaPods](https://github.com/Azure/azure-iot-sdk-c/blob/main/iothub_client/samples/ios/CocoaPods-Samples.md).

> [!WARNING]
> The **Azure IoT C SDK** isn't suitable for embedded applications due to its memory management and threading model. For embedded device SDK options, see the embedded device SDKs.
