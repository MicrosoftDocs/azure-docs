---
title: Azure Device Update for IoT Hub configuration file
description: Understand the Azure Device Update for IoT Hub du-config.json configuration file.
author: sethmanheim
ms.author: sethm
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
| connectionType | Connection type used to connect the device to IoT Hub. Accepted values are `AIS`, `string`, or `x509`. Use `AIS` when using the IoT Identity Service. Use `string` for connection string–based authentication. Use `x509` for certificate-based authentication. |
| connectionData | Data used to connect the device to IoT Hub. The format depends on the `connectionType`: <br><br> • If `AIS`, set to an empty string: `"connectionData": ""`. <br> • If `string`, provide your IoT device's device or module connection string. <br> • If `x509`, provide a connection string that includes `x509=true` (for example: `"HostName=<hub>.azure-devices.net;DeviceId=<device>;x509=true"`). |
| connectionX509CertFilePath | File path to the X.509 client certificate used for authentication. This field is required when `connectionType` is `x509`. |
| connectionX509PrivateKeyFilePath | File path to the private key associated with the X.509 certificate. This field is required when `connectionType` is `x509`. |
| connectionX509CaCertFilePath | File path to the certificate authority (CA) certificate used to validate the IoT Hub server certificate. This field is required when `connectionType` is `x509`. |
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
