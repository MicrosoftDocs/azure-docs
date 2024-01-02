---
title: Troubleshoot device connections to Azure IoT Central
description: Troubleshoot and resolve why you're not seeing data from your devices in your IoT Central application
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 05/22/2023
ms.topic: troubleshooting
ms.service: iot-central
ms.custom: device-developer, devx-track-azurecli

#Customer intent: As a device developer, I want to understand why data from my devices isn't showing up in IoT Central, and the steps I can take to rectify the issue.
---

# Troubleshoot why data from your devices isn't showing up in Azure IoT Central

This document helps you determine why the data your devices are sending to IoT Central isn't showing up in the application.

There are two main areas to investigate:

- Device connectivity issues
  - Authentication issues such as the device has invalid credentials
  - Network connectivity issues
  - Device isn't approved, or blocked
- Device payload shape issues

This troubleshooting guide focuses on device connectivity issues and device payload shape issues.

## Device connectivity issues

This section helps you determine if your data is reaching IoT Central.

If you haven't already done so, install the `az cli` tool and `azure-iot` extension.

To learn how to install the `az cli`, see [Install the Azure CLI](/cli/azure/install-azure-cli).

To [install](/cli/azure/azure-cli-reference-for-IoT#extension-reference-installation) the `azure-iot` extension, run the following command:

```azurecli
az extension add --name azure-iot
```

> [!NOTE]
> You may be prompted to install the `uamqp` library the first time you run an extension command.

When you've installed the `azure-iot` extension, start your device to see if the messages it's sending are making their way to IoT Central.

Use the following commands to sign in the subscription where you have your IoT Central application:

```azurecli
az login
az account set --subscription <your-subscription-id>
```

To monitor the telemetry your device is sending, use the following command:

```azurecli
az iot central diagnostics monitor-events --app-id <iot-central-app-id> --device-id <device-name>
```

If the device has connected successfully to IoT Central, you see output similar to the following example:

```output
Monitoring telemetry.
Filtering on device: device-001
{
    "event": {
        "origin": "device-001",
        "module": "",
        "interface": "",
        "component": "",
        "payload": {
            "temp": 65.57910343679293,
            "humid": 36.16224660107426
        }
    }
}
```

To monitor the property updates your device is exchanging with IoT Central, use the following preview command:

```azurecli
az iot central diagnostics monitor-properties --app-id <iot-central-app-id> --device-id <device-name>
```

If the device successfully sends property updates, you see output similar to the following example:

```output
Changes in reported properties:
version : 32
{'state': 'true', 'name': {'value': {'value': 'Contoso'}, 'status': 'completed', 'desiredVersion': 7, 'ad': 'completed', 'av': 7, 'ac
': 200}, 'brightness': {'value': {'value': 2}, 'status': 'completed', 'desiredVersion': 7, 'ad': 'completed', 'av': 7, 'ac': 200}, 'p
rocessorArchitecture': 'ARM', 'swVersion': '1.0.0'}
```

If you see data appear in your terminal, then the data is making it as far as your IoT Central application.

If you don't see any data appear after a few minutes, try pressing the `Enter` or `return` key on your keyboard, in case the output is stuck.

If you're still not seeing any data appear on your terminal, it's likely that your device is having network connectivity issues, or isn't sending data correctly to IoT Central.

### Check the provisioning status of your device

If your data isn't appearing in the CLI monitor, check the provisioning status of your device by running the following command:

```azurecli
az iot central device registration-info --app-id <iot-central-app-id> --device-id <device-name>
```

The following output shows an example of a device that's blocked from connecting:

```json
{
  "@device_id": "v22upeoqx6",
  "device_registration_info": {
    "device_status": "blocked",
    "display_name": "Environmental Sensor - v22upeoqx6",
    "id": "v22upeoqx6",
    "instance_of": "urn:krhsi_k0u:modelDefinition:w53jukkazs",
    "simulated": false
  },
  "dps_state": {
    "error": "Device is blocked from connecting to IoT Central application. Unblock the device in IoT Central and retry. Learn more:
https://aka.ms/iotcentral-docs-dps-SAS",
    "status": null
  }
}
```

| Device provisioning status | Description | Possible mitigation |
| - | - | - |
| Provisioned | No immediately recognizable issue. | N/A |
| Registered | The device hasn't yet connected to IoT Central. | Check your device logs for connectivity issues. |
| Blocked | The device is blocked from connecting to IoT Central. | Device is blocked from connecting to the IoT Central application. Unblock the device in IoT Central and retry. To learn more, see [Device status values](howto-manage-devices-individually.md#device-status-values). |
| Unapproved | The device isn't approved. | Device isn't approved to connect to the IoT Central application. Approve the device in IoT Central and retry. To learn more, see [Device status values](howto-manage-devices-individually.md#device-status-values) |
| Unassigned | The device isn't assigned to a device template. | Assign the device to a device template so that IoT Central knows how to parse the data. |

Learn more about [Device status values in the UI](howto-manage-devices-individually.md#device-status-values) and [Device status values in the REST API](howto-manage-devices-with-rest-api.md#get-a-device).

### Error codes

If you're still unable to diagnose why your data isn't showing up in `monitor-events`, the next step is to look for error codes reported by your device.

Start a debugging session on your device, or collect logs from your device. Check for any error codes that the device reports.

The following tables show the common error codes and possible actions to mitigate.

If you're seeing issues related to your authentication flow:

| Error code | Description | Possible Mitigation |
| - | - | - |
| 400 | The body of the request isn't valid. For example, it can't be parsed, or the object can't be validated. | Ensure that you're sending the correct request body as part of the attestation flow, or use a device SDK. |
| 401 | The authorization token can't be validated. For example, it has expired or doesn't apply to the request's URI. This error code is also returned to devices as part of the TPM attestation flow. | Ensure that your device has the correct credentials. |
| 404 | The Device Provisioning Service instance, or a resource such as an enrollment doesn't exist. | [File a ticket with customer support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview). |
| 412 | The `ETag` in the request doesn't match the `ETag` of the existing resource, as per RFC7232. | [File a ticket with customer support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview). |
| 429 | The service is throttling operations. For specific service limits, see [IoT Hub Device Provisioning Service limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#iot-hub-device-provisioning-service-limits). | Reduce message frequency, split responsibilities among more devices. |
| 500 | An internal error occurred. | [File a ticket with customer support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) to see if they can help you further. |

### Detailed authorization error codes

| Error | Sub error code | Notes |
| - | - | - |
| 401 Unauthorized | 401002 | The device is using invalid or expired credentials. DPS reports this error. |
| 401 Unauthorized | 400209 | The device is either waiting for approval by an operator or an operator has blocked it. |
| 401 IoTHubUnauthorized |  | The device is using expired security token. IoT Hub reports this error. |
| 401 IoTHubUnauthorized | DEVICE_DISABLED | The device is disabled in this IoT hub and has moved to another IoT hub. Reprovision the device. |
| 401 IoTHubUnauthorized | DEVICE_BLOCKED | An operator has blocked this device. |

### File upload error codes

Here's a list of common error codes you might see when a device tries to upload a file to the cloud. Remember that before your device can upload a file, you must configure [device file uploads](howto-configure-file-uploads.md) in your application.

| Error code | Description | Possible Mitigation |
| - | - | - |
| 403006  | You've exceeded the number of concurrent file upload operations. Each device client is limited to 10 concurrent file uploads. | Ensure the device promptly notifies IoT Central that the file upload operation has completed. If that doesn't work, try reducing the request timeout. |

## Unmodeled data issues

When you've established that your device is sending data to IoT Central, the next step is to ensure that your device is sending data in a valid format.

To detect which categories your issue is in, run the most appropriate Azure CLI command for your scenario:

- To validate telemetry, use the preview command:

    ```azurecli
    az iot central diagnostics validate-messages --app-id <iot-central-app-id> --device-id <device-name>
    ```

- To validate property updates, use the preview command:

    ```azurecli
    az iot central diagnostics validate-properties --app-id <iot-central-app-id> --device-id <device-name>
    ```

You may be prompted to install the `uamqp` library the first time you run a `validate` command.

The three common types of issue that cause device data to not appear in IoT Central are:

- Device template to device data mismatch.
- Data is invalid JSON.
- Old versions of IoT Edge cause telemetry from components to display incorrectly as unmodeled data.

### Device template to device data mismatch

A device must use the same name and casing as used in the device template for any telemetry field names in the payload it sends. The following output shows an example warning message where the device is sending a telemetry value called `Temperature`, when it should be `temperature`:

```output
Validating telemetry.
Filtering on device: sample-device-01.
Exiting after 300 second(s), or 10 message(s) have been parsed (whichever happens first).
[WARNING] [DeviceId: sample-device-01] [TemplateId: urn:modelDefinition:ofhmazgddj:vmjwwjuvdzg] Device is sending data that has not been defined in the device template. Following capabilities have NOT been defined in the device template '['Temperature']'. Following capabilities have been defined in the device template (grouped by components) '{'thermostat1': ['temperature', 'targetTemperature', 'maxTempSinceLastReboot', 'getMaxMinReport'], 'thermostat2': ['temperature', 'targetTemperature', 'maxTempSinceLastReboot', 'getMaxMinReport'], 'deviceInformation': ['manufacturer', 'model', 'swVersion', 'osName', 'processorArchitecture', 'processorManufacturer', 'totalStorage', 'totalMemory']}'. 
```

A device must use the same name and casing as used in the device template for any property names in the payload it sends. The following output shows an example warning message where the property `osVersion` isn't defined in the device template:

```output
Command group 'iot central diagnostics' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
[WARNING]  [DeviceId: sample-device-01] [TemplateId: urn:modelDefinition:ofhmazgddj:vmjwwjuvdzg] Device is sending data that has not been defined in the device template. Following capabilities have NOT been defined in the device template '['osVersion']'. Following capabilities have been defined in the device template (grouped by components) '{'thermostat1': ['temperature', 'targetTemperature', 'maxTempSinceLastReboot', 'getMaxMinReport', 'rundiagnostics'], 'thermostat2': ['temperature', 'targetTemperature', 'maxTempSinceLastReboot', 'getMaxMinReport', 'rundiagnostics'], 'deviceInformation': ['manufacturer', 'model', 'swVersion', 'osName', 'processorArchitecture', 'processorManufacturer', 'totalStorage', 'totalMemory']}'.
```

A device must use the data types defined in the device template for any telemetry or property values. For example, you see a schema mismatch if the type defined in the device template is boolean, but the device sends a string. The following output shows an example error message where the device using a string value for a property that's defined as a double:

```output
Command group 'iot central diagnostics' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
Validating telemetry.
Filtering on device: sample-device-01.
Exiting after 300 second(s), or 10 message(s) have been parsed (whichever happens first).
[ERROR] [DeviceId: sample-device-01] [TemplateId: urn:modelDefinition:ofhmazgddj:vmjwwjuvdzg]  Datatype of telemetry field 'temperature' does not match the datatype double. Data sent by the device : curr_temp. For more information, see: https://aka.ms/iotcentral-payloads
```

The validation commands also report an error if the same telemetry name is defined in multiple interfaces, but the device isn't IoT Plug and Play compliant.

If you prefer to use a GUI, use the IoT Central **Raw data** view to see if something isn't being modeled.

:::image type="content" source="media/troubleshoot-connection/raw-data-view.png" alt-text="Screenshot of Raw Data view" lightbox="media/troubleshoot-connection/raw-data-view.png":::

When you've detected the issue, you may need to update device firmware, or create a new device template that models previously unmodeled data.

If you chose to create a new template that models the data correctly, migrate devices from your old template to the new template. To learn more, see [Manage devices in your Azure IoT Central application](howto-manage-devices-individually.md).

### Invalid JSON

If there are no errors reported, but a value isn't appearing, then it's probably malformed JSON in the payload the device sends. To learn more, see [Telemetry, property, and command payloads](../../iot-develop/concepts-message-payloads.md).

You can't use the validate commands or the **Raw data** view in the UI to detect if the device is sending malformed JSON.

### IoT Edge version

To display telemetry from components hosted in IoT Edge modules correctly, use [IoT Edge version 1.2.4](https://github.com/Azure/azure-iotedge/releases/tag/1.2.4) or later. If you use an earlier version, telemetry from components in IoT Edge modules displays as *_unmodeleddata*.

## Next steps

If you need more help, you can contact the Azure experts on the [Microsoft Q&A and Stack Overflow forums](https://azure.microsoft.com/support/community/). Alternatively, you can file an [Azure support ticket](https://portal.azure.com/#create/Microsoft.Support).

For more information, see [Azure IoT support and help options](../../iot/iot-support-help.md).
