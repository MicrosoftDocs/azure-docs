---
title: Provision device using symmetric key attestation - Azure IoT Edge
description: Use symmetric key attestation to test automatic device provisioning for Azure IoT Edge with Device Provisioning Service
author: kgremban
manager: philmea
ms.author: kgremban
ms.reviewer: mrohera
ms.date: 10/04/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Create and provision an IoT Edge device using symmetric key attestation

Azure IoT Edge devices can be auto-provisioned using the [Device Provisioning Service](../iot-dps/index.yml) just like devices that are not edge-enabled. If you're unfamiliar with the process of auto-provisioning, review the [auto-provisioning concepts](../iot-dps/concepts-auto-provisioning.md) before continuing.

This article shows you how to create a Device Provisioning Service individual enrollment using symmetric key attestation on an IoT Edge device with the following steps:

* Create an instance of IoT Hub Device Provisioning Service (DPS).
* Create an individual enrollment for the device.
* Install the IoT Edge runtime and connect to the IoT Hub.

Symmetric key attestation is a simple approach to authenticating a device with a Device Provisioning Service instance. This attestation method represents a "Hello world" experience for developers who are new to device provisioning, or do not have strict security requirements. Device attestation using a [TPM](../iot-dps/concepts-tpm-attestation.md) or [X.509 certificates](../iot-dps/concepts-security.md#x509-certificates) is more secure, and should be used for more stringent security requirements.

## Prerequisites

* An active IoT Hub
* A physical or virtual device

## Set up the IoT Hub Device Provisioning Service

Create a new instance of the IoT Hub Device Provisioning Service in Azure, and link it to your IoT hub. You can follow the instructions in [Set up the IoT Hub DPS](../iot-dps/quick-setup-auto-provision.md).

After you have the Device Provisioning Service running, copy the value of **ID Scope** from the overview page. You use this value when you configure the IoT Edge runtime.

## Choose a unique registration ID for the device

A unique registration ID must be defined to identify each device. You can use the MAC address, serial number, or any unique information from the device.

In this example, we use a combination of a MAC address and serial number forming the following string for a registration ID: `sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6`.

Create a unique registration ID for your device. Valid characters are lowercase alphanumeric and dash ('-').

## Create a DPS enrollment

Use your device's registration ID to create an individual enrollment in DPS.

When you create an enrollment in DPS, you have the opportunity to declare an **Initial Device Twin State**. In the device twin, you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](how-to-deploy-monitor.md).

> [!TIP]
> Group enrollments are also possible when using symmetric key attestation and involve the same decisions as individual enrollments.

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub Device Provisioning Service.

1. Under **Settings**, select **Manage enrollments**.

1. Select **Add individual enrollment** then complete the following steps to configure the enrollment:  

   1. For **Mechanism**, select **Symmetric Key**.

   1. Select the **Auto-generate keys** check box.

   1. Provide the **Registration ID** that you created for your device.

   1. Provide an **IoT Hub Device ID** for your device if you'd like. You can use device IDs to target an individual device for module deployment. If you don't provide a device ID, the registration ID is used.

   1. Select **True** to declare that the enrollment is for an IoT Edge device. For a group enrollment, all devices must be IoT Edge devices or none of them can be.

   1. Accept the default value from the Device Provisioning Service's allocation policy for **how you want to assign devices to hubs** or choose a different value that is specific to this enrollment.

   1. Choose the linked **IoT Hub** that you want to connect your device to. You can choose multiple hubs, and the device will be assigned to one of them according to the selected allocation policy.

   1. Choose **how you want device data to be handled on re-provisioning** when devices request provisioning after the first time.

   1. Add a tag value to the **Initial Device Twin State** if you'd like. You can use tags to target groups of devices for module deployment. For example:

      ```json
      {
         "tags": {
            "environment": "test"
         },
         "properties": {
            "desired": {}
         }
      }
      ```

   1. Ensure **Enable entry** is set to **Enable**.

   1. Select **Save**.

Now that an enrollment exists for this device, the IoT Edge runtime can automatically provision the device during installation. Be sure to copy your enrollment's **Primary Key** value to use when installing the IoT Edge runtime, or if you're going to be creating device keys for use with a group enrollment.

## Derive a device key

> [!NOTE]
> This section is required only if using a group enrollment.

Each device uses its derived device key with your unique registration ID to perform symmetric key attestation with the enrollment during provisioning. To generate the device key, use the key you copied from your DPS enrollment to compute an [HMAC-SHA256](https://wikipedia.org/wiki/HMAC) of the unique registration ID for the device and convert the result into Base64 format.

Do not include your enrollment's primary or secondary key in your device code.

### Linux workstations

If you are using a Linux workstation, you can use openssl to generate your derived device key as shown in the following example.

Replace the value of **KEY** with the **Primary Key** you noted earlier.

Replace the value of **REG_ID** with your device's registration ID.

```bash
KEY=8isrFI1sGsIlvvFSSFRiMfCNzv21fjbE/+ah/lSh3lF8e2YG1Te7w1KpZhJFFXJrqYKi9yegxkqIChbqOS9Egw==
REG_ID=sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6

keybytes=$(echo $KEY | base64 --decode | xxd -p -u -c 1000)
echo -n $REG_ID | openssl sha256 -mac HMAC -macopt hexkey:$keybytes -binary | base64
```

```bash
Jsm0lyGpjaVYVP2g3FnmnmG9dI/9qU24wNoykUmermc=
```

### Windows-based workstations

If you are using a Windows-based workstation, you can use PowerShell to generate your derived device key as shown in the following example.

Replace the value of **KEY** with the **Primary Key** you noted earlier.

Replace the value of **REG_ID** with your device's registration ID.

```powershell
$KEY='8isrFI1sGsIlvvFSSFRiMfCNzv21fjbE/+ah/lSh3lF8e2YG1Te7w1KpZhJFFXJrqYKi9yegxkqIChbqOS9Egw=='
$REG_ID='sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6'

$hmacsha256 = New-Object System.Security.Cryptography.HMACSHA256
$hmacsha256.key = [Convert]::FromBase64String($KEY)
$sig = $hmacsha256.ComputeHash([Text.Encoding]::ASCII.GetBytes($REG_ID))
$derivedkey = [Convert]::ToBase64String($sig)
echo "`n$derivedkey`n"
```

```powershell
Jsm0lyGpjaVYVP2g3FnmnmG9dI/9qU24wNoykUmermc=
```

## Install the IoT Edge runtime

The IoT Edge runtime is deployed on all IoT Edge devices. Its components run in containers, and allow you to deploy additional containers to the device so that you can run code at the edge.

You'll need the following information when provisioning your device:

* The DPS **ID Scope** value
* The device **Registration ID** you created
* The **Primary Key** you copied from the DPS enrollment

> [!TIP]
> For group enrollments, you need each device's [derived key](#derive-a-device-key) rather than the DPS enrollment key.

### Linux device

Follow the instructions for your device's architecture. Make sure to configure the IoT Edge runtime for automatic, not manual, provisioning.

[Install the Azure IoT Edge runtime on Linux](how-to-install-iot-edge-linux.md)

The section in the configuration file for symmetric key provisioning looks like this:

```yaml
# DPS symmetric key provisioning configuration
provisioning:
   source: "dps"
   global_endpoint: "https://global.azure-devices-provisioning.net"
   scope_id: "{scope_id}"
   attestation:
      method: "symmetric_key"
      registration_id: "{registration_id}"
      symmetric_key: "{symmetric_key}"
```

Replace the placeholder values for `{scope_id}`, `{registration_id}`, and `{symmetric_key}` with the data you collected earlier. Make sure the **provisioning:** line has no preceding whitespace and that nested items are indented by two spaces.

### Windows device

Install the IoT Edge runtime on the device for which you generated a derived device key. You'll configure the IoT Edge runtime for automatic, not manual, provisioning.

For more detailed information about installing IoT Edge on Windows, including prerequisites and instructions for tasks like managing containers and updating IoT Edge, see [Install the Azure IoT Edge runtime on Windows](how-to-install-iot-edge-windows.md).

1. Open a PowerShell window in administrator mode. Be sure to use an AMD64 session of PowerShell when installing IoT Edge, not PowerShell (x86).

1. The **Deploy-IoTEdge** command checks that your Windows machine is on a supported version, turns on the containers feature, and then downloads the moby runtime and the IoT Edge runtime. The command defaults to using Windows containers.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Deploy-IoTEdge
   ```

1. At this point, IoT Core devices may restart automatically. Other Windows 10 or Windows Server devices may prompt you to restart. If so, restart your device now. Once your device is ready, run PowerShell as an administrator again.

1. The **Initialize-IoTEdge** command configures the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers unless you use the `-Dps` flag to use automatic provisioning.

   Replace the placeholder values for `{scope_id}`, `{registration_id}`, and `{symmetric_key}` with the data you collected earlier.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -Dps -ScopeId {scope ID} -RegistrationId {registration ID} -SymmetricKey {symmetric key}
   ```

## Verify successful installation

If the runtime started successfully, you can go into your IoT Hub and start deploying IoT Edge modules to your device. Use the following commands on your device to verify that the runtime installed and started successfully.

### Linux device

Check the status of the IoT Edge service.

```cmd/sh
systemctl status iotedge
```

Examine service logs.

```cmd/sh
journalctl -u iotedge --no-pager --no-full
```

List running modules.

```cmd/sh
iotedge list
```

### Windows device

Check the status of the IoT Edge service.

```powershell
Get-Service iotedge
```

Examine service logs.

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog
```

List running modules.

```powershell
iotedge list
```

You can verify that the individual enrollment that you created in Device Provisioning Service was used. Navigate to your Device Provisioning Service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.

## Next steps

The Device Provisioning Service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices using automatic device management. Learn how to [Deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-monitor.md) or [using Azure CLI](how-to-deploy-monitor-cli.md).
