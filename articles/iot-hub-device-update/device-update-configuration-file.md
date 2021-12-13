---
title: Understand Device Update for Azure IoT Hub Configuration File| Microsoft Docs
description: Understand Device Update for Azure IoT Hub  Configuration File.
author: ValOlson
ms.author: valls
ms.date: 12/13/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub Configuration File

The "du-config.json" is an file that contains the below configurations for the Device Update agent. The Device Update Agent will then read these values and report them to the Device Update Service. 

* AzureDeviceUpdateCore:4.ClientMetadata:4.deviceProperties["manufacturer"]
* AzureDeviceUpdateCore:4.ClientMetadata:4.deviceProperties["model"]
* DeviceInformation.manufacturer
* DeviceInformation.model
* connectionData 
* connectionType
    
## File location

When installing Debian agent in Linux system: modify the /etc/adu/du-config.json file to add your values. Or if you are using a Yocto build system, in the partition or disk called adu, create a json file called /adu/du-config.json.

## List of fields

|Name|Description|
|-----------|--------------------|
|connectionType|Possible values "string" when connecting the device to IoT Hub manually for testing purposes. For production scenarios, use value "AIS" when using the IoT Identity Service to connect the device to IoT Hub. See [understand IoT Identity Service configurations](https://azure.github.io/iot-identity-service/configuration.html)|
|connectionData|If connectionType = "string", add the value from you IoT Device's, device or module connection string here. If connectionType = "AIS", add the value that you set up as 'principal' in the [IoT Identity Service’s TOML file](https://azure.github.io/iot-identity-service/configuration.html). For example, you can name the Device Update module as “iotHubDeviceUpdate” for the 'connectionData' and 'pricipal'.|
|aduc_manufacturer|Reported by the `AzureDeviceUpdateCore:4.ClientMetadata:4` interface to classify the device for targeting the update deployment.|
|aduc_model|Reported by the `AzureDeviceUpdateCore:4.ClientMetadata:4` interface to classify the device for targeting the update deployment.|
|manufacturer|Reported by the Device Update Agent as part of the `DeviceInformation` interface.|
|model|Reported by the Device Update Agent as part of the `DeviceInformation` interface.|
|SchemaVersion|The schema version that maps the current configuration file format version|
|aduShellTrustedUsers|The list of users that can launch the "adu-shell" program. Note: "adu-shell" is a "broker" program that performs various Update Actions, as 'root'. Some of the provided "Content Update Handler" invoke "adu-shell" to perform some tasks that require "super user" privilege, such as "apt-get install", execute some scripts, etc.|

## Example "du-conf.json" file contents

```markdown

{
  "schemaVersion": "1.1",
  "aduShellTrustedUsers": [
    "adu",
    "do"
  ],
  "manufacturer": <Place your device info manufacturer here>,
  "model": <Place your device info model here>,
  "agents": [
    {
      "name": <Place your agent name here>,
      "runas": "adu",
      "connectionSource": {
        "connectionType": "string", //or “AIS”
        "connectionData": <Place your Azure IoT device connection string here>
      },
      "manufacturer": <Place your device property manufacturer here>,
      "model": <Place your device property model here>
    }
  ]
}

```
