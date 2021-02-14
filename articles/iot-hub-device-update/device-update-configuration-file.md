---
title: Understand Device Update Configuration File| Microsoft Docs
description: Understand Device Update Configuration File.
author: ValOlson
ms.author: valls
ms.date: 2/12/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update Configuration File

The "adu-conf.txt" is an optional file that can be created to manage the following configurations.

* AzureDeviceUpdateCore:4.ClientMetadata:4.deviceProperties["manufacturer"]
* AzureDeviceUpdateCore:4.ClientMetadata:4.deviceProperties["model"]
* DeviceInformation.manufacturer
* DeviceInformation.model
* Device Connection String (if it is not known by the Device Update Agent).

The Device Update Agent will first try to get the `manufacturer` and `model` values from the device for the [ADU Core Interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/agent/adu_core_interface) and the [Device Information Interface](https://github.com/Azure/iot-hub-device-update/tree/main/src/agent/device_info_interface). If that fails, the Device Update Agent will next look for the "adu-conf.txt" file and use the values  from there. If both attempts are not successful, the Device Update Agent will use default values.

## File location

Within Linux system, in the partition or disk called `adu`, create a text file called "adu-conf.txt" with
the following fields.

## List of Device Update Configurations

|Name|Description|
|-----------|--------------------|
|connection_string|Pre-provisioned connection string the device can use to connect to the IoT Hub.|
|aduc_manufacturer|Reported by the `AzureDeviceUpdateCore:4.ClientMetadata:4` interface to classify the device for targeting the update deployment.|
|aduc_model|Reported by the `AzureDeviceUpdateCore:4.ClientMetadata:4` interface to classify the device for targeting the update deployment.|
|manufacturer|Reported by the Device Update Agent as part of the `DeviceInformation` interface.|
|model|Reported by the Device Update Agent as part of the `DeviceInformation` interface.|

[Learn more](device-update-plug-and-play.md) about the `DeviceInformation` and `AzureDeviceUpdate:4` interfaces.

## Example "adu-conf.txt" file contents

```markdown

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;connection_string = `HostName=<yourIoTHubName>;DeviceId=<yourDeviceId>;SharedAccessKey=<yourSharedAccessKey>`</br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;aduc_manufacturer = <value to send through `AzureDeviceUpdateCore:4.ClientMetadata:4.deviceProperties["manufacturer"]`></br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;aduc_model = <value to send through `AzureDeviceUpdateCore:4.ClientMetadata:4.deviceProperties["model"]`></br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;manufacturer = <value to send through `DeviceInformation.manufacturer`></br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;model = <value to send through `DeviceInformation.manufacturer`></br>
```
