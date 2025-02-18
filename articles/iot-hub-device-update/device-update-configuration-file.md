---
title: Azure Device Update for IoT Hub configuration file
description: Understand the Azure Device Update for IoT Hub du-config.json configuration file.
author: eshashah-msft
ms.author: eshashah
ms.date: 12/30/2024
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Device Update configuration file

The Azure Device Update for IoT Hub agent uses configuration information from a *du-config.json* file on the device. The agent reads the file and reports the following values to the Device Update service:

* AzureDeviceUpdateCore:4.ClientMetadata:4.deviceProperties["manufacturer"]
* AzureDeviceUpdateCore:4.ClientMetadata:4.deviceProperties["model"]
* DeviceInformation.manufacturer
* DeviceInformation.model
* additionalProperties
* connectionData
* connectionType

To update or create the *du-config.json* configuration file:

- When you install the Debian agent on an IoT device with a Linux OS, modify the */etc/adu/du-config.json* file to update the values.
- For a Yocto build system, create a JSON file in the `adu` partition or disk called */adu/du-config.json*.

## Configuration file fields and values

| Name |Description |
|-----------|--------------------|
| SchemaVersion | Schema version that maps the current configuration file format version. |
| aduShellTrustedUsers | List of users that can launch adu-shell, a broker program that performs various update actions as `'root'`. The Device Update default content update handlers invoke adu-shell to do tasks that require super user privilege, such as `apt-get install` or executing a privileged script. |
| iotHubProtocol| Protocol used to connect with Azure IoT Hub. Accepted values are `mqtt` or `mqtt/ws`. Default value is `'mqtt'`. |
| compatPropertyNames | Properties used to check for device compatibility to target the update deployment. All values must be lowercase. |
| manufacturer | Value reported by the `AzureDeviceUpdateCore:4.ClientMetadata:4` interface to classify the device for targeting the update deployment. |
| model | Value reported by the `AzureDeviceUpdateCore:4.ClientMetadata:4` interface to classify the device for targeting the update deployment. |
| additionalProperties | Optional, up to five more lowercase-only device-reported properties to use for compatibility checking. |
| agents | Information about each Device Update agent, including `connectionSource` type and data. |
| name | Device Update agent name. |
| runas | User identity to run the Device Update agent under. |
| connectionType | Connection type to use for connecting the device to IoT Hub. Accepted values are `string` or `AIS`. Use `AIS` for production scenarios that use the IoT Identity Service to connect. Use `string` to connect using a connection string for testing purposes. |
| connectionData  | Data to use for connecting the device to IoT Hub. If `connectionType = "AIS"`, set the `connectionData` to an empty string: `"connectionData": ""`. If `connectionType = "string"`, provide your IoT device's device or module connection string. |
| manufacturer | Value reported by the Device Update agent as part of the `DeviceInformation` interface. |
| model | Value reported by the Device Update agent as part of the `DeviceInformation` interface. |
| additionalDeviceProperties | Optional, up to five more device properties. |
| extensionsFolder | Optional, sets the path for the Device Update *extensions* folder. Default path is `'/var/lib/adu/extensions'`. |
| downloadsFolder | Optional, sets the path for the Device Update *downloads* folder. Default path is `'/var/lib/adu/downloads'`. |
| dataFolder | Optional, sets the path for the Device Update *data* folder. Default path is `'/var/lib/adu'`. If you update this value in the configuration file, you must update `CheckDataDir()` in the [health management check](https://github.com/Azure/iot-hub-device-update/blob/develop/src/agent/src/health_management.c) accordingly.
| aduShellFilePath | Optional, sets the path for the Device Update shell. Default path is `'/usr/lib/adu'`. |
| downloadTimeoutInMinutes | Optional, sets the update download timeout in minutes. Value `0` means the default of 8 hours. |

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
