<properties
	pageTitle="OS platforms and hardware compatibility| Microsoft Azure"
	description="Summarizes IoT device SDK compatibility with OS platforms and device hardware."
	services="iot-hub"
	documentationCenter=""
	authors="hegate"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="na"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="10/09/2015"
     ms.author="hegate"/>

# OS Platforms and hardware compatibility with device SDKs

This document describes the SDK compatibility with different OS platforms as well as the specific device configurations included in the [Microsoft Azure Certified for IoT program](#microsoft-azure-certified-for-iot). If you already have a device, please look at the list of included devices in the program to find device-specific information on compatibility. If you're unsure of which device to use, please take a look at the [OS Platform and libraries](#os-platforms) compatibility section.


## OS Platforms

The Azure IoT libraries have been tested on the following operating system platforms:


|Linux/Unix OS platforms  |   Version|
|:---------------|:------------:|
|Debian Linux| 7.5|
|Fedora Linux|20|
|Raspbian Linux| 3.18 |
|Ubuntu Linux| 14.04 |
|Yocto Linux|2.1 |

|Windows OS platforms  |   Version|
|:---------------|:------------:|
|Windows desktop| 7,8,10 |
|Windows IoT Core| 10 |
|Windows Server| 2012 R2|

|Other platforms  |   Version|
|:---------------|:------------:|
|mbed | 2.0 |
|TI-RTOS | 2.x |



## C libraries

The [Microsoft Azure IoT device SDK for C](https://github.com/Azure/azure-iot-sdks/blob/master/c/readme.md) has been tested on the following configurations:

|OS Platform| Version|Protocols|
|:---------|:----------:|:----------:|
|Debian Linux| 7.5 | HTTPS, AMQP, MQTT |
|Fedora Linux| 20 | HTTPS, AMQP, MQTT |
|mbed OS| 2.0 | HTTPS, AMQP |
|TI-RTOS| 2.x | HTTPS |
|Ubuntu Linux| 14.04 | HTTPS, AMQP, MQTT |
|Windows desktop| 7,8,10 | HTTPS, AMPQ, MQTT |
|Yocto Linux|2.1  | HTTPS, AMQP|



## Node.js libraries

The [Microsoft Azure IoT device SDK for Node.js](https://github.com/Azure/azure-iot-sdks/blob/master/node/device/readme.md) has been tested on the following configurations:


|Runtime| Version|Protocols|
|:---------|:----------:|:----:|
|Node.js| 4.1.0 | HTTPS|



## Java libraries

The [Microsoft Azure IoT device SDK for Java](https://github.com/Azure/azure-iot-sdks/blob/master/java/device/readme.md) has been tested on the following configurations:

|Runtime| Version|Protocols|
|:---------|:----------:|----|
|Java SE (Windows)| 1.7 | HTTPS, AMQP |
|Java SE (Linux)| 1.8 | HTTPS, AMQP|

The Microsoft Azure IoT service SDK for Java has been tested on the following configurations:

|Runtime| Version|Protocols|
|:---------|:----------:|:-----|
|Java SE| 1.8 | HTTPS, AMQP |


## CSharp

The [Microsoft Azure IoT device SDK for .NET](https://github.com/Azure/azure-iot-sdks/blob/master/csharp/device/readme.md) has been tested on the following configurations:

|OS platform| Version|Protocols|
|:---------|:----------:|:----------:|
|Windows desktop| 7,8,10 | HTTPS, AMPQ|
|Windows IoT Core|10 | HTTPS|

Managed agent code requires Microsoft .NET Framework 4.5


## Microsoft Azure Certified for IoT

**Microsoft Azure Certified for IoT** is the partner program that connects the broader IoT ecosystem with Microsoft Azure so that developers and architects understand the compatibility scenarios. Specifically, it provides a trusted list of OS/device combinations to help you get started quickly with an IoT project – whether you’re in a proof of concept or pilot phase. With certified device and operating system combinations, your IoT project can get started quickly, with less work and customization required to make sure devices are compatible with Azure IoT Suite and Azure IoT Hub.

## Certified for IoT devices

**Certified for IoT** devices have tested compatibility with the Azure IoT SDKs and are ready to be used in your IoT application. Specifically, we identify compatibility based on operating system platform and code language.

#### Devices list

Each device has been certified to work with our SDK in the OS and language chosen by the device manufacturer. For example, BeagleBone Black works on Debian using our C, Javascript and Java language. This means that developers can build applications in any of those languages and OS combinations on the specific devices.

|Device| Tested OS |Language|
|:---------|:----------|:----------|
|[ADLINK MXE-202i]( http://www.adlinktech.com/PD/web/PD_detail.php?cKind=&pid=1505&seq=&id=&sid=&category=Fanless-Embedded-Computer_Integrated-Embedded-Computer&utm_source=) |Wind River | Javascript|
|[Ankaa](http://www.e-consystems.com/iMX6-development-board.asp) |Ubuntu | C|
|[Apalis iMX6](https://www.toradex.com/computer-on-modules/apalis-arm-family/freescale-imx-6) |Linux Angstrom(Yocto)  | Javascript, Java|
|[Apalis T30](https://www.toradex.com/computer-on-modules/apalis-arm-family/nvidia-tegra-3) |Linux Angstrom(Yocto)  | Javascript, Java|
|[Arrow DragonBoard 410c](http://partners.arrow.com/campaigns-na/qualcomm/dragonboard-410c/) |Windows 10 IoT Core | C#|
|[ARTIK](http://developer.samsung.com/artik) |Fedora | C|
|[BeagleBone Black](http://beagleboard.org/black) | Debian | C, Javascript, Java|
|[BeagleBone Green](http://beagleboard.org/green) |Debian | C, Javascript, Java|
|[Toradex Colibri iMX6](https://www.toradex.com/computer-on-modules/colibri-arm-family/freescale-imx6) |Linux Angstrom(Yocto) | Javascript, Java|
|[Toradex Colibri T20](https://www.toradex.com/computer-on-modules/colibri-arm-family/nvidia-tegra-2) |Linux Angstrom(Yocto) | Java|
|[Toradex Colibri T30](https://www.toradex.com/computer-on-modules/colibri-arm-family/nvidia-tegra-3) |Windows 10 IoT Core | C#|
|[Toradex Colibri VF61](https://www.toradex.com/computer-on-modules/colibri-arm-family/freescale-vybrid-vf6xx) |Linux Angstrom(Yocto) | Javascript, Java|
|[Freescale FRDM K64](http://www.freescale.com/products/arm-processors/kinetis-cortex-m/k-series/k6x-ethernet-mcus/freescale-freedom-development-platform-for-kinetis-k64-k63-and-k24-mcus:FRDM-K64F) |mbed 2.0 | C|
|[Intel Edison](http://www.intel.com/content/www/us/en/do-it-yourself/edison.html) |Yocto | C, Javascript|
|[LogicMachine Series](http://openrb.com/products/) |Custom Linux | C|
|[Minnowboard Max](http://www.minnowboard.org/meet-minnowboard-max/) |Windows 7,8, 10 | C#|
|[NEXCOM NISE 50C](http://www.nexcom.com/Products/industrial-computing-solutions/industrial-fanless-computer/atom-compact/fanless-computer-nise-50c) |Windows 10 IoT Core | C#|
|[Raspberry Pi 2](https://www.raspberrypi.org/products/raspberry-pi-2-model-b/) | Raspbian | C, Javascript, Java |
|[Raspberry Pi 2](https://www.raspberrypi.org/products/raspberry-pi-2-model-b/) | Windows 10 IoT Core|  C, Javascript, C#|
|[STM32 Nucleo](http://www.st.com/stm32nucleo) |STM32Cube | C|
|[TI CC3200](http://www.ti.com/product/cc3200) |TI-RTOS 2.x | C|

[Get started using these devices](https://azure.microsoft.com/develop/iot/get-started/) or visit our GitHub [repository](https://github.com/Azure/azure-iot-sdks) and search on device docs per language.

## Next steps

Learn more about developing solutions using [Certified for IoT devices](http://azure.com/iotdev).
