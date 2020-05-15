---
title: Azure IoT Device SDKs Platform Support | Microsoft Docs
description: Open-source device SDKs are available on GitHub in C, .NET (C#), Java, Node.js, and Python, to connect devices to Azure IoT Hub and Device Provisioning Service (DPS).
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 10/08/2019
ms.author: robinsh
---

# Azure IoT Device SDKs Platform Support

Microsoft strives to continually expand the universe of Azure IoT Hub capable devices. Microsoft publishes open-source device SDKs on GitHub to help connect devices to Azure IoT Hub and the Device Provisioning Service. The device SDKs are available for C, .NET (C#), Java, Node.js, and Python. Microsoft tests each SDK to ensure that it runs on the supported configurations detailed for it in the [Microsoft SDKs and device platform support](#microsoft-sdks-and-device-platform-support) section.

In addition to the device SDKs, Microsoft provides several other avenues to empower customers and developers to connect their devices to Azure IoT:

* Microsoft collaborates with several partner companies to help them publish development kits, based on the Azure IoT C SDK, for their hardware platforms.

* Microsoft works with Microsoft trusted partners to provide an ever-expanding set of devices that have been tested and certified for Azure IoT. For a current list of these devices, see the [Azure certified for IoT device catalog](https://catalog.azureiotsolutions.com/).

* Microsoft provides a platform abstraction layer (PAL) in the Azure IoT Hub Device C SDK that helps developers to easily port the SDK to their platform. To learn more, see the [C SDK porting guidance](https://github.com/Azure/azure-c-shared-utility/blob/master/devdoc/porting_guide.md).

This topic provides information about the Microsoft SDKs and the platform configurations they support, as well as each of the other options listed above.

## Microsoft SDKs and device platform support

Microsoft publishes open-source SDKs on GitHub for the following languages: C, .NET (C#), Node.js, Java, and Python. The SDKs and their dependencies are listed in this section. The SDKs are supported on any device platform that satisfies these dependencies.

For each of the listed SDKs, Microsoft:

* Continuously builds and runs end-to-end tests against the master branch of the relevant SDK in GitHub on several popular platforms.  To provide test coverage across different compiler versions, we generally test against the latest LTS version and the most popular version.

* Provides installation guidance or installation packages if applicable.

* Fully supports the SDKs on GitHub with open-source code, a path for customer contributions, and product team engagement with GitHub issues.

### C SDK

The [Azure IoT Hub C device SDK](https://github.com/Azure/azure-iot-sdk-c) is tested with and supports the following configurations.

| OS                  | TLS library                  | Additional requirements                                                                     |
|---------------------|------------------------------|---------------------------------------------------------------------------------------------|
| Linux               | OpenSSL, WolfSSL, or BearSSL | Berkeley sockets</br></br>Portable Operating System Interface (POSIX)                       |
| iOS 12.2            | OpenSSL                      | XCode emulated in OSX 10.13.4                                                               |
| Windows 10 family   | SChannel                     |                                                                                             |
| Mbed OS 5.4         | Mbed TLS 2                   | [MXChip IoT dev kit](https://microsoft.github.io/azure-iot-developer-kit/)                  |
| Azure Sphere OS     | WolfSSL                      | [Azure Sphere MT3620](https://azure.microsoft.com/services/azure-sphere/get-started/) |
| Arduino             | BearSSL                      | [ESP32 or ESP8266](https://github.com/Azure/azure-iot-arduino#simple-sample-instructions) 

### Python SDK

The [Azure IoT Hub Python device SDK](https://github.com/Azure/azure-iot-sdk-python) is tested with and supports the following configurations.

| OS                  | Compiler                          |
|---------------------|-----------------------------------|
| Linux               | Python 2.7.*, 3.5 or later |
| MacOS High Sierra   | Python 2.7.*, 3.5 or later |
| Windows 10 family   | Python 2.7.*, 3.5 or later |

Only Python version 3.5.3 or later support the asynchronous APIs, we recommend using version 3.7 or later.

### .NET SDK

The [Azure IoT Hub .NET (C#) device SDK](https://github.com/Azure/azure-iot-sdk-csharp) is tested with and supports the following configurations.

| OS                                   | Standard                                                   |
|--------------------------------------|------------------------------------------------------------|
| Linux                                | .NET Core 2.1                                              |
| Windows 10 Desktop and Server SKUs   | .NET Core 2.1, .NET Framework 4.5.1, or .NET Framework 4.7 |

The .NET SDK can also be used with Windows IoT Core with the [Azure Device Agent](https://github.com/ms-iot/azure-client-tools/blob/master/docs/device-agent/device-agent.md) or [a custom NTService that can use RPC to communicate with UWP applications](https://docs.microsoft.com/samples/microsoft/windows-iotcore-samples/ntservice-rpc/).

### Node.js SDK

The [Azure IoT Hub Node.js device SDK](https://github.com/Azure/azure-iot-sdk-node) is tested with and supports the following configurations.

| OS                  | Node version    |
|---------------------|-----------------|
| Linux               | LTS and Current |
| Windows 10 family   | LTS and Current |

### Java SDK

The [Azure IoT Hub Java device SDK](https://github.com/Azure/azure-iot-sdk-java) is tested with and supports the following configurations.

| OS                     | Java version |
|------------------------|--------------|
| Android API 28         | Java 8       |
| Linux  x64             | Java 8       |
| Windows 10 family x64  | Java 8       |

## Partner supported development kits

Microsoft works with various partners to provide development kits for several microprocessor architectures. These partners have ported the Azure IoT C SDK to their platform. Partners create and maintain the platform abstraction layer (PAL) of the SDK. Microsoft works with these partners to provide extended support.

| Partner             | Devices                            | Link                     | Support |
|---------------------|------------------------------------|--------------------------|---------|
| Espressif           | ESP32 <br/> ESP8266                              | [Esp-azure](https://github.com/espressif/esp-azure)                | [GitHub](https://github.com/espressif/esp-azure)  
| Qualcomm            | Qualcomm MDM9206 LTE IoT Modem     | [Qualcomm LTE for IoT SDK](https://developer.qualcomm.com/software/lte-iot-sdk) | [Forum](https://developer.qualcomm.com/forums/software/lte-iot-sdk)   |
| ST Microelectronics | STM32L4 Series <br/> STM32F4 Series <br/>  STM32F7 Series <br/>  STM32L4 Discovery Kit for IoT node    | [X-CUBE-AZURE](https://www.st.com/en/embedded-software/x-cube-azure.html) <br/>  <br/> [P-NUCLEO-AZURE](https://www.st.com/content/st_com/en/products/evaluation-tools/solution-evaluation-tools/communication-and-connectivity-solution-eval-boards/p-nucleo-azure1.html) <br/> [FP-CLD-AZURE](https://www.st.com/content/st_com/en/products/embedded-software/mcus-embedded-software/stm32-embedded-software/stm32-ode-function-pack-sw/fp-cld-azure1.html)            | [Support](https://www.st.com/content/st_com/en/support/support-home.html)
| Texas Instruments   | CC3220SF LaunchPad </br> CC3220S LaunchPad </br> CC3235SF LaunchPad </br> CC3235S LaunchPad </br> MSP432E4 LaunchPad | [Azure IoT Plugin for SimpleLink](https://github.com/TexasInstruments/azure-iot-pal-simplelink) | [TI E2E Forum](https://e2e.ti.com) <br/> [TI E2E Forum for CC3220](https://e2e.ti.com/support/wireless_connectivity/simplelink_wifi_cc31xx_cc32xx/) <br/> [TI E2E Forum for MSP432E4](https://e2e.ti.com/support/microcontrollers/msp430/) |

## Porting the Microsoft Azure IoT C SDK

If your device platform isn't covered by one of the previous sections, you can consider porting the Azure IoT C SDK. Porting the C SDK primarily involves implementing the platform abstraction layer (PAL) of the SDK. The PAL defines primitives that provide the glue between your device and higher-level functions in the SDK. For more information, see [Porting Guidance](https://github.com/Azure/azure-c-shared-utility/blob/master/devdoc/porting_guide.md).

## Microsoft partners and certified Azure IoT devices

Microsoft works with a number of partners to continually expand the Azure IoT universe with Azure IoT tested and certified devices.

* To browse Azure IoT certified devices, see [Microsoft Azure Certified for IoT Device Catalog](https://catalog.azureiotsolutions.com/).

* To learn more about the Azure Certified for IoT ecosystem, see [Join the Certified for IoT ecosystem](https://catalog.azureiotsolutions.com/register).

## Connecting to IoT Hub without an SDK

If you're not able to use one of the IoT Hub device SDKs, you can connect directly to IoT Hub using the [IoT Hub REST APIs](https://docs.microsoft.com/rest/api/iothub/) from any application capable of sending and receiving HTTPS requests and responses.

## Support and other resources

If you experience problems while using the Azure IoT device SDKs, there are several ways to seek support. You can try one of the following channels:

**Reporting bugs** – Bugs in the device SDKs can be reported on the issues page of the relevant GitHub project. Fixes rapidly make their way from the project in to product updates.

* [Azure IoT Hub C SDK issues](https://github.com/Azure/azure-iot-sdk-c/issues)

* [Azure IoT Hub .NET (C#) SDK issues](https://github.com/Azure/azure-iot-sdk-csharp/issues)

* [Azure IoT Hub Java SDK issues](https://github.com/Azure/azure-iot-sdk-java/issues)

* [Azure IoT Hub Node.js SDK issues](https://github.com/Azure/azure-iot-sdk-node/issues)

* [Azure IoT Hub Python SDK issues](https://github.com/Azure/azure-iot-sdk-python/issues)

**Microsoft Customer Support team** – Users who have a [support plan](https://azure.microsoft.com/support/plans/) can engage the Microsoft Customer Support team by creating a new support request directly from the [Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

**Feature requests** – Azure IoT feature requests are tracked via the product’s [User Voice page](https://feedback.azure.com/forums/321918-azure-iot).

## Next steps

* [Device and service SDKs](iot-hub-devguide-sdks.md)
* [Porting Guidance](https://github.com/Azure/azure-c-shared-utility/blob/master/devdoc/porting_guide.md)
