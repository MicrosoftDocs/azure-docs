---
title: Azure Device Update for IoT Hub configuration file
description: Understand the Azure Device Update for IoT Hub du-config.json configuration file.
author: eshashah-msft
ms.author: eshashah
ms.date: 12/19/2024
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Azure Device Update for IoT Hub configuration file

The Azure Device Update for IoT Hub agent uses configuration information from a *du-config.json* file on the device. The agent reads and reports the following values to the Device Update service:

* AzureDeviceUpdateCore:4.ClientMetadata:4.deviceProperties["manufacturer"]
* AzureDeviceUpdateCore:4.ClientMetadata:4.deviceProperties["model"]
* DeviceInformation.manufacturer
* DeviceInformation.model
* additionalProperties
* connectionData
* connectionType

To update or create the *du-config.json* configuration file:

- When you install the Debian agent on an IoT Device with a Linux OS, modify the */etc/adu/du-config.json* file to update the values.
- For a Yocto build system, in the partition or disk called `adu`, create a JSON file called */adu/du-config.json*.

## Configuration file fields and values

| Name |Description |
|-----------|--------------------|
| SchemaVersion | The schema version that maps the current configuration file format version. |
| aduShellTrustedUsers | The list of users that can launch the adu-shell program, a broker program that does various update actions as `'root'`. The Device Update default content update handlers invoke adu-shell to do tasks that require super user privilege, such as `apt-get install` or executing a privileged script. |
| manufacturer | Reported by the `AzureDeviceUpdateCore:4.ClientMetadata:4` interface to classify the device for targeting the update deployment. |
| model | Reported by the `AzureDeviceUpdateCore:4.ClientMetadata:4` interface to classify the device for targeting the update deployment. |
| iotHubProtocol| Accepted values are `mqtt` or `mqtt/ws` to change the protocol used to connect with IoT hub. Default value is `'mqtt'`. |
| compatPropertyNames | Used to check for compatibility of the device to target the update deployment. For all properties to be used for compatibility, the values must be lowercase only. |
| additionalProperties | Optional, up to five additional lowercase device reported properties to be set and used for compatibility checking. |
| connectionType | Accepted values are `string` or `AIS`. For production scenarios, use `AIS` when using the IoT Identity Service to connect the device to IoT Hub. For testing purposes, use `string` to connect the device using a connection string. |
| connectionData  | If `connectionType = "AIS"`, set the `connectionData` to an empty string: `"connectionData": ""`. If `connectionType = "string"`, add your device or module connection string. |
| manufacturer | Reported by the Device Update agent as part of the `DeviceInformation` interface. |
| model | Reported by the Device Update agent as part of the `DeviceInformation` interface. |

<a name="example-du-configjson-file-contents"></a>
## Example "du-config.json" file

```json

{
  "schemaVersion": "1.1",
  "aduShellTrustedUsers": [
    "adu",
    "do"
  ],
  "iotHubProtocol": "mqtt",
  "compatPropertyNames":"manufacturer,model,location,environment",
  "manufacturer": "contoso",
  "model": "virtual-vacuum-2",
  "agents": [
    {
      "name": "main",
      "runas": "adu",
      "connectionSource": {
        "connectionType": "string",
        "connectionData": "HostName=<hub_name>.azure-devices.net;DeviceId=<device_id>;SharedAccessKey=<device_key>"
      },
      "manufacturer": "contoso",
      "model": "virtual-vacuum-2",
      "additionalDeviceProperties": {
        "location": "usa",
        "environment": "development"
      }
    }
  ]
}
```

## Related content

- [Configuring the Azure IoT Identity Service](https://azure.github.io/iot-identity-service/configuration.html)
- [Tutorial: Azure Device Update for IoT Hub using a Raspberry Pi image](device-update-raspberry-pi.md)
