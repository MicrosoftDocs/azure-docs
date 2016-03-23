<properties
	pageTitle="OS platforms compatibility| Microsoft Azure"
	description="Summarizes IoT device SDK compatibility with OS platforms."
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
     ms.date="02/28/2016"
     ms.author="hegate"/>

# OS Platforms compatibility with device SDKs

This document describes the SDK compatibility with different OS platforms. If you're unsure of which device to use, please take a look at the [OS Platform and libraries](#os-platforms) compatibility section in this article.

## Microsoft Azure Certified for IoT program

If you already have a device, please look at the list of devices included in the [Microsoft Azure Certified for IoT program][lnk-certified] to find device-specific information on compatibility. Microsoft Azure Certified for IoT is the partner program that connects the broader IoT ecosystem with Microsoft Azure so that developers and architects understand the compatibility scenarios. Specifically, it provides a trusted list of OS/device combinations to help you get started quickly with an IoT project – whether you’re in a proof of concept or pilot phase

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
|Windows desktop| 10 |
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
|Debian Linux| 7.5 | HTTPS, AMQP, MQTT, AMQP over WebSockets |
|Fedora Linux| 20 | HTTPS, AMQP, MQTT, AMQP over WebSockets |
|mbed OS| 2.0 | HTTPS, AMQP |
|TI-RTOS| 2.x | HTTPS |
|Ubuntu Linux| 14.04 | HTTPS, AMQP, MQTT, AMQP over WebSockets |
|Windows desktop| 10 | HTTPS, AMQP, MQTT, AMQP over WebSockets |
|Yocto Linux|2.1  | HTTPS, AMQP|



## Node.js libraries

The [Microsoft Azure IoT device SDK for Node.js](https://github.com/Azure/azure-iot-sdks/blob/master/node/device/readme.md) has been tested on the following configurations:


|Runtime| Version|Protocols|
|:---------|:----------:|:----:|
|Node.js| 4.1.0 | HTTPS, AMQP, MQTT, AMQP over WebSockets |



## Java libraries

The [Microsoft Azure IoT device SDK for Java](https://github.com/Azure/azure-iot-sdks/blob/master/java/device/readme.md) has been tested on the following configurations:

|Runtime| Version|Protocols|
|:---------|:----------:|----|
|Java SE (Windows)| 1.8 | HTTPS, AMQP, MQTT |
|Java SE (Linux)| 1.8 | HTTPS, AMQP, MQTT|

The Microsoft Azure IoT service SDK for Java has been tested on the following configurations:

|Runtime| Version|Protocols|
|:---------|:----------:|:-----|
|Java SE| 1.8 | HTTPS, AMQP, MQTT |


## CSharp

The [Microsoft Azure IoT device SDK for .NET](https://github.com/Azure/azure-iot-sdks/blob/master/csharp/device/readme.md) has been tested on the following configurations:

|OS platform| Version|Protocols|
|:---------|:----------:|:----------:|
|Windows desktop| 10 | HTTPS, AMQP, MQTT, AMQP over WebSockets |
|Windows IoT Core|10 | HTTPS |

Managed agent code requires Microsoft .NET Framework 4.5


## Next steps

- Learn more about the [Microsoft Azure Certified for IoT][lnk-certified] program.
- Learn more about developing solutions using [Certified for IoT devices](http://azure.com/iotdev).


[lnk-iot-suite]: https://azure.microsoft.com/documentation/suites/iot-suite/
[lnk-certified]: iot-hub-certified-devices-linux-c.md