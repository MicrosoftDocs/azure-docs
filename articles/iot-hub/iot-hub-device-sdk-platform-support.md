---
title: Azure IoT Device SDKs Platform Support | Microsoft Docs
description: Concepts - list of platforms supported by the Azure IoT Device SDKs
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/01/2018
ms.author: robinsh
---

# Azure IoT Device SDKs Platform Support

Microsoft strives to continually expand the universe of Azure IoT Hub capable devices. Microsoft publishes open source device SDKs on GitHub to help connect devices to Azure IoT Hub and the Device Provisioning Service. The device SDKs are available for C, .NET (C#), Java, Node.js, and Python, and Microsoft performs testing to ensure their operation on a variety of popular platforms. A platform is typically defined by a combination of operating system, microprocessor architecture, compiler or framework version, and transport layer security (TLS) library.

In addition to the device SDKs, Microsoft provides several other avenues to empower customers and developers to connect their devices to Azure IoT:

* Microsoft collaborates with several partner companies to help them publish semiconductor development kits, based on the Azure IoT C SDK, for their hardware platforms.

* Microsoft works with Microsoft Trusted Partners to provide an ever-expanding set of devices that have been tested and certified for Azure IoT.

* Microsoft provides a platform abstraction layer (PAL) in the Azure IoT Hub Device C SDK that helps developers to easily port the SDK to their platform.

This topic provides information about the Microsoft SDKs and the platforms they are tested against, as well as each of the other options listed above.

## Microsoft supported platforms

Microsoft publishes open source SDKs on GitHub for the following languages: C, .NET (C#), Node.js, Java, and Python. The SDKs and their dependencies are listed in this section.

For each of the listed SDKs, Microsoft:

* Continuously builds and runs end-to-end tests against the master branch of the relevant SDK in GitHub on several popular platforms.  To provide test coverage across different compiler versions, we generally test against the latest LTS version and the most popular version.

* Provides installation guidance or installation packages if applicable.

* Fully supports the SDKs on GitHub with open source code, a path for customer contributions, and product team engagement with GitHub issues.

The following sections list the requirements necessary for device platforms to be able to run the SDKs.

### C SDK

The [Azure IoT Hub C device SDK](https://github.com/Azure/azure-iot-sdk-c) has the following requirements.

| OS                  | TLS library                                      | Additional requirements |
|---------------------|--------------------------------------------------|-------------------------|
| Linux               | One of the tested TLS stacks (openSSL, WolfSSL)  | Berkely sockets</br></br>Portable Operating System Interface (POSIX) |
| OSX 10.13.4         | openssl or Native OSX                            |                         |
| Windows 10 family   | SChannel                                         |                         |

**Note** To be removed:
| OS                  | Arch | Compiler             | TLS library       |
|---------------------|------|----------------------|-------------------|
| Ubuntu 16.04 LTS    | X64  | gcc-5.4.0            | openssl - 1.0.2g |
| Ubuntu 18.04 LTS    | X64  | gcc-7.3              | WolfSSL – 1.13    |
| Ubuntu 18.04 LTS    | X64  | Clang 6.0.X          | Openssl – 1.1.0g  |
| OSX 10.13.4         | x64  | XCode 9.4.1          | Native OSX        |
| Windows Server 2016 | x64  | Visual Studio 14.0.X | SChannel          |
| Windows Server 2016 | x86  | Visual Studio 14.0.X | SChannel          |
| Debian 9 Stretch    | x64  | gcc-7.3              | Openssl – 1.1.0f  |

### Python SDK

The [Azure IoT Hub Python device SDK](https://github.com/Azure/azure-iot-sdk-python) has the following requirements.

| OS                  | Compiler                       |
|---------------------|--------------------------------|
| Linux               | Python 2.7, 3.4, 3.5, 3.6, 3.7 |
| MacOS High Sierra   | Python 2.7, 3.4, 3.5, 3.6, 3.7 |
| Windows 10 family   | Python 2.7, 3.4, 3.5, 3.6, 3.7 |

**Note** To be removed:
| OS                  | Arch | Compiler   | TLS library |
|---------------------|------|------------|-------------|
| Windows Server 2016 | x86  | Python 2.7 | openssl     |
| Windows Server 2016 | x64  | Python 2.7 | openssl     |
| Windows Server 2016 | x86  | Python 3.5 | openssl     |
| Windows Server 2016 | x64  | Python 3.5 | openssl     |
| Ubuntu 18.04 LTS    | x86  | Python 2.7 | openssl     |
| Ubuntu 18.04 LTS    | x86  | Python 3.4 | openssl     |
| MacOS High Sierra   | x64  | Python 2.7 | openssl     |

### .NET SDK

The [Azure IoT Hub .NET (C#) device SDK](https://github.com/Azure/azure-iot-sdk-csharp) has the following requirements.

| OS                  | Standard          |
|---------------------|-------------------|
| Linux               | .NET standard 2.0 |
| Windows 10 family   | .NET standard 2.0 |

The IoT Hub .NET (C#) device SDK is supported on runtimes compliant with .NET Standard 2.0. For detailed information, see [OS and hardware compatibility](https://github.com/azure/azure-iot-sdk-csharp#os-platforms-and-hardware-compatibility) in the C SDK readme on GitHub. 

> [!NOTE]
> Due to the high number of supported platforms, Microsoft limits is testing to the following DevOps Hosted agents: "Windows Server 2016 with Visual Studio 2017" and "Ubuntu 16.04". For details, see [Use a Microsoft-hosted agent](https://docs.microsoft.com/azure/devops/pipelines/agents/hosted?view=azure-devops#use-a-microsoft-hosted-agent).

**NOTE** To be removed:
| OS                  | Arch | Framework            | Standard          |
|---------------------|------|----------------------|-------------------|
| Ubuntu 16.04 LTS    | X64  | .NET Core 2.1        | .NET standard 2.0 |
| Windows Server 2016 | X64  | .NET Core 2.1        | .NET standard 2.0 |
| Windows Server 2016 | X64  | .NET Framework 4.7   | .NET standard 2.0 |
| Windows Server 2016 | X64  | .NET Framework 4.5.1 | N/A               |

### Node.js SDK

The [Azure IoT Hub Node.js device SDK](https://github.com/Azure/azure-iot-sdk-node) has the following requirements.

| OS                  | Node version    |
|---------------------|-----------------|
| Linux               | LTS and Current |
| Windows 10 family   | LTS and Current |

**NOTE** To be removed:
| OS                                           | Arch | Node version    |
|----------------------------------------------|------|-----------------|
| Ubuntu 16.04 LTS (using node 6 docker image) | X64  | LTS and Current |
| Windows Server 2016                          | X64  | LTS and Current |

### Java SDK

The [Azure IoT Hub Java device SDK](https://github.com/Azure/azure-iot-sdk-java) is built and tested against the following platforms.

| OS                  | Java version |
|---------------------|--------------|
| Android API 19 +    | Java 8       |
| Android Things      | Java 8       |
| Linux               | Java 8       |
| Windows 10 family   | Java 8       |

**NOTE** To be removed:
| OS                  | Arch | Java version |
|---------------------|------|--------------|
| Ubuntu 16.04 LTS    | X64  | Java 8       |
| Windows Server 2016 | X64  | Java 8       |
| Android API 28 | X64  | Java 8       |
| Android Things | X64  | Java 8      |

## Partner supported semiconductor development kits

Microsoft works with various partners to provide semiconductor development kits for several other microprocessor architectures. These partners have ported the Azure IoT C SDK to their platform. Partners create and maintain the platform abstraction layer (PAL) of the SDK. Microsoft works with these partners to provide extended support.

| Partner             | Devices                            | Link                     | Support |
|---------------------|------------------------------------|--------------------------|---------|
| Espressif           | ESP32 <br/> ESP8266                              | [Esp-azure](https://github.com/espressif/esp-azure)                | [GitHub](https://github.com/espressif/esp-azure)  
| Qualcomm            | Qualcomm MDM9206 LTE IoT Modem     | [Qualcomm LTE for IoT SDK](https://developer.qualcomm.com/software/lte-iot-sdk) | [Forum](https://developer.qualcomm.com/forums/software/lte-iot-sdk)   |
| ST Microelectronics | STM32L4 Series <br/> STM32F4 Series <br/>  STM32F7 Series <br/>  STM32L4 Discovery Kit for IoT node    | [X-CUBE-CLOUD](https://www.st.com/content/st_com/en/products/embedded-software/mcus-embedded-software/stm32-embedded-software/stm32cube-expansion-packages/x-cube-cloud.html) <br/> [X-CUBE-AZURE](https://www.st.com/content/st_com/en/products/embedded-software/mcus-embedded-software/stm32-embedded-software/stm32cube-expansion-packages/x-cube-azure.html) <br/> [P-NUCLEO-AZURE](https://www.st.com/content/st_com/en/products/evaluation-tools/solution-evaluation-tools/communication-and-connectivity-solution-eval-boards/p-nucleo-azure1.html) <br/> [FP-CLD-AZURE](https://www.st.com/content/st_com/en/products/embedded-software/mcus-embedded-software/stm32-embedded-software/stm32-ode-function-pack-sw/fp-cld-azure1.html)            | [Support](https://www.st.com/content/st_com/en/support/support-home.html)
| Texas Instruments   | CC3220SF LaunchPad </br> CC3220S LaunchPad </br> CC3235SF LaunchPad </br> CC3235S LaunchPad </br> MSP432E4 LaunchPad | [Azure IoT Plugin for SimpleLink](https://github.com/TexasInstruments/azure-iot-pal-simplelink) | [TI E2E Forum](https://e2e.ti.com) <br/> [TI E2E Forum for CC3220](https://e2e.ti.com/support/wireless_connectivity/simplelink_wifi_cc31xx_cc32xx/) <br/> [TI E2E Forum for MSP432E4](https://e2e.ti.com/support/microcontrollers/msp430/) |

## Microsoft partners and certified Azure IoT devices

Microsoft works with a number of partners to continually expand the Azure IoT universe with Azure IoT tested and certified devices.

* To browse Azure IoT certified devices, see [Microsoft Azure Certified for IoT Device Catalog](https://catalog.azureiotsolutions.com/).

* To learn more about Microsoft trusted partners or to learn how to become a Microsoft trusted partner, see [Microsoft Azure Certified Internet of Things Trusted Partners](https://azure.microsoft.com/en-us/marketplace/certified-iot-partners/).

## Porting the Microsoft Azure IoT C SDK

If your device platform is not covered by one of the previous sections, you can consider porting the Azure IoT C SDK. Porting the C SDK primarily involves implementing the platform abstraction layer (PAL) of the SDK. The PAL defines primitives that provide the glue between your device and higher-level functions in the SDK. For more information, see [Porting Guidance](https://github.com/Azure/azure-c-shared-utility/blob/master/devdoc/porting_guide.md).

## Support and other resources

If you experience problems while using the Azure IoT device SDKs, there are several ways to seek support. You can try one of the following channels:

**Reporting bugs** – Bugs in the device SDKs can be reported on the issues page of the relevant GitHub project. Fixes rapidly make their way from the project in to product updates.

* [Azure IoT Hub C SDK issues](https://github.com/Azure/azure-iot-sdk-c/issues)

* [Azure IoT Hub .NET (C#) SDK issues](https://github.com/Azure/azure-iot-sdk-csharp/issues)

* [Azure IoT Hub Java SDK issues](https://github.com/Azure/azure-iot-sdk-java/issues)

* [Azure IoT Hub Node.js SDK issues](https://github.com/Azure/azure-iot-sdk-node/issues)

* [Azure IoT Hub C# SDK issues](https://github.com/Azure/azure-iot-sdk-python/issues)

**Microsoft Customer Support team** – Users who have a [support plan](https://azure.microsoft.com/support/plans/) can engage the Microsoft Customer Support team by creating a support ticket directly from the [Azure portal](https://ms.portal.azure.com/signin/index/?feature.settingsportalinstance=mpac).

**Feature requests** – Azure IoT feature requests are tracked via the product’s [User Voice page](https://feedback.azure.com/forums/321918-azure-iot).

## Next steps

* [Device and service SDKs](iot-hub-devguide-sdks.md)
* [Porting Guidance](https://github.com/Azure/azure-c-shared-utility/blob/master/devdoc/porting_guide.md)
