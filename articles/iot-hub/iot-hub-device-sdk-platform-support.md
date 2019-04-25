---
title: Azure IoT Device SDKs Platform Support | Microsoft Docs
description: Concepts - list of platforms supported by the Azure IoT Device SDKs
author: yzhong94
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/01/2018
ms.author: yizhon
---

# Azure IoT SDKs Platform Support

The [Azure IoT SDKs](iot-hub-devguide-sdks.md) are a set of libraries to interact with IoT Hub and the Device Provisioning Service with broad language and platform support. The SDKs run on most common platforms, and developers can port the C SDK to specific platform by following the [Porting Guidance](https://github.com/Azure/azure-c-shared-utility/blob/master/devdoc/porting_guide.md). 

Microsoft supports a variety of operating systems/platforms/frameworks and can be extended using the Azure IoT C SDK. Some are supported officially by the team, grouped into tiers that represent the level of support users can expect. *Fully supported platforms* means that Microsoft:

- Continuously builds and runs end-to-end tests against master and the LTS supported version(s).  To provide test coverage across different versions, we generally test against the latest LTS version and the most popular version.  Other versions of the same platform may be supported via platform version compatibility.
- Provides installation guidance or packages if applicable.
- Fully supports the platforms on GitHub.

In addition, a list of partners has ported our C SDK on to more platforms and they are maintaining the platform abstraction layer (PAL). [Azure Certified for IoT Device Catalog](https://catalog.azureiotsolutions.com/) also features a list of OS platforms the various SDKs have been tested against. The SDKs also regularly build on these platforms, with limited testing and support:

* MBED2
* Arduino
* Windows CE 2013 (deprecate in October 2018)
* .NET Standard 1.3 with .NET Core 2.1 and .NET Framework 4.7
* Xamarin iOS, Android, UWP

## Supported platforms

There are several platforms supported.

### C SDK

| OS                  | Arch | Compiler             | TLS library       |
|---------------------|------|----------------------|-------------------|
| Ubuntu 16.04 LTS    | X64  | gcc-5.4.0            | openssl  - 1.0.2g |
| Ubuntu 18.04 LTS    | X64  | gcc-7.3              | WolfSSL – 1.13    |
| Ubuntu 18.04 LTS    | X64  | Clang 6.0.X          | Openssl – 1.1.0g  |
| OSX 10.13.4         | x64  | XCode 9.4.1          | Native OSX        |
| Windows Server 2016 | x64  | Visual Studio 14.0.X | SChannel          |
| Windows Server 2016 | x86  | Visual Studio 14.0.X | SChannel          |
| Debian 9 Stretch    | x64  | gcc-7.3              | Openssl – 1.1.0f  |

### Python SDK

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

| OS                  | Arch | Framework            | Standard          |
|---------------------|------|----------------------|-------------------|
| Ubuntu 16.04 LTS    | X64  | .NET Core 2.1        | .NET standard 2.0 |
| Windows Server 2016 | X64  | .NET Core 2.1        | .NET standard 2.0 |
| Windows Server 2016 | X64  | .NET Framework 4.7   | .NET standard 2.0 |
| Windows Server 2016 | X64  | .NET Framework 4.5.1 | N/A               |

### Node.js SDK

| OS                                           | Arch | Node version |
|----------------------------------------------|------|--------------|
| Ubuntu 16.04 LTS (using node 6 docker image) | X64  | Node 6       |
| Windows Server 2016                          | X64  | Node 6       |

### Java SDK

| OS                  | Arch | Java version |
|---------------------|------|--------------|
| Ubuntu 16.04 LTS    | X64  | Java 8       |
| Windows Server 2016 | X64  | Java 8       |
| Android API 28 | X64  | Java 8       |
| Android Things | X64  | Java 8      |

## Partner supported platforms

Customers can extend our platform support by porting the Azure IoT C SDK, specifically, creating the platform abstraction layer (PAL) of the SDK. Microsoft works with partners to provide extended support. A list of partners has ported the C SDK on to more platforms and maintaining the PAL.

| Partner             | Devices                            | Link                     | Support |
|---------------------|------------------------------------|--------------------------|---------|
| Espressif           | ESP32 <br/> ESP8266                              | [Esp-azure](https://github.com/espressif/esp-azure)                | [GitHub](https://github.com/espressif/esp-azure)  
| Qualcomm            | Qualcomm MDM9206 LTE IoT Modem     | [Qualcomm LTE for IoT SDK](https://developer.qualcomm.com/software/lte-iot-sdk) | [Forum](https://developer.qualcomm.com/forums/software/lte-iot-sdk)   |
| ST Microelectronics | STM32L4 Series <br/> STM32F4 Series <br/>  STM32F7 Series <br/>  STM32L4 Discovery Kit for IoT node    | [X-CUBE-CLOUD](https://www.st.com/content/st_com/en/products/embedded-software/mcus-embedded-software/stm32-embedded-software/stm32cube-expansion-packages/x-cube-cloud.html) <br/> [X-CUBE-AZURE](https://www.st.com/content/st_com/en/products/embedded-software/mcus-embedded-software/stm32-embedded-software/stm32cube-expansion-packages/x-cube-azure.html) <br/> [P-NUCLEO-AZURE](https://www.st.com/content/st_com/en/products/evaluation-tools/solution-evaluation-tools/communication-and-connectivity-solution-eval-boards/p-nucleo-azure1.html) <br/> [FP-CLD-AZURE](https://www.st.com/content/st_com/en/products/embedded-software/mcus-embedded-software/stm32-embedded-software/stm32-ode-function-pack-sw/fp-cld-azure1.html)            | [Support](https://www.st.com/content/st_com/en/support/support-home.html)
| Texas Instruments   | CC3220SF Launchpad <br/> CC3220S Launchpad <br/> MSP432E4 Launchpad      | [Azure IoT Plugin for SimpleLink](https://github.com/TexasInstruments/azure-iot-pal-simplelink) | [TI E2E Forum](https://e2e.ti.com) <br/> [TI E2E Forum for CC3220](https://e2e.ti.com/support/wireless_connectivity/simplelink_wifi_cc31xx_cc32xx/) <br/> [TI E2E Forum for MSP432E4](https://e2e.ti.com/support/microcontrollers/msp430/) |

## Next steps

* [Device and service SDKs](iot-hub-devguide-sdks.md)
* [Porting Guidance](https://github.com/Azure/azure-c-shared-utility/blob/master/devdoc/porting_guide.md)
