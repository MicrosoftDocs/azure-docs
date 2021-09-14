---
title: Provision device using symmetric key attestation - Azure IoT Edge
description: Use symmetric key attestation to test automatic device provisioning for Azure IoT Edge with Device Provisioning Service
author: kgremban

ms.author: kgremban
ms.reviewer: mrohera
ms.date: 07/21/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---
# Create and provision an IoT Edge device using symmetric key attestation

[!INCLUDE [iot-edge-version-201806-or-202011](../../includes/iot-edge-version-201806-or-202011.md)]

Azure IoT Edge devices can be auto-provisioned using the [Device Provisioning Service](../iot-dps/index.yml) just like devices that are not edge-enabled. If you're unfamiliar with the process of auto-provisioning, review the [provisioning](../iot-dps/about-iot-dps.md#provisioning-process) overview before continuing.

This article shows you how to create a Device Provisioning Service individual or group enrollment using symmetric key attestation on an IoT Edge device with the following steps:

* Create an instance of IoT Hub Device Provisioning Service (DPS).
* Create an individual or group enrollment.
* Install the IoT Edge runtime and connect to the IoT Hub.

:::moniker range=">=iotedge-2020-11"
>[!TIP]
>For a simplified experience, try the [Azure IoT Edge configuration tool](https://github.com/azure/iot-edge-config). This command-line tool, currently in public preview, installs IoT Edge on your device and provisions it using DPS and symmetric key attestation.
:::moniker-end

Symmetric key attestation is a simple approach to authenticating a device with a Device Provisioning Service instance. This attestation method represents a "Hello world" experience for developers who are new to device provisioning, or do not have strict security requirements. Device attestation using a [TPM](../iot-dps/concepts-tpm-attestation.md) or [X.509 certificates](../iot-dps/concepts-x509-attestation.md) is more secure, and should be used for more stringent security requirements.

## Prerequisites

* An active IoT Hub
* A physical or virtual device

## Set up the IoT Hub Device Provisioning Service

Create a new instance of the IoT Hub Device Provisioning Service in Azure, and link it to your IoT hub. You can follow the instructions in [Set up the IoT Hub DPS](../iot-dps/quick-setup-auto-provision.md).

After you have the Device Provisioning Service running, copy the value of **ID Scope** from the overview page. You use this value when you configure the IoT Edge runtime.

## Choose a unique device registration ID

A unique registration ID must be defined to identify each device. You can use the MAC address, serial number, or any unique information from the device. For example, you could use a combination of a MAC address and serial number forming the following string for a registration ID: `sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6`. Valid characters are lowercase alphanumeric and dash (`-`).

## Option 1: Create a DPS individual enrollment

Create an individual enrollment to provision a single device through DPS.

When you create an enrollment in DPS, you have the opportunity to declare an **Initial Device Twin State**. In the device twin, you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](how-to-deploy-at-scale.md).

> [!TIP]
> The steps in this article are for the Azure portal, but you can also make create individual enrollments using the Azure CLI. For more information, see [az iot dps enrollment](/cli/azure/iot/dps/enrollment). As part of the CLI command, use the **edge-enabled** flag to specify that the enrollment is for an IoT Edge device.

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub Device Provisioning Service.

1. Under **Settings**, select **Manage enrollments**.

1. Select **Add individual enrollment** then complete the following steps to configure the enrollment:  

   1. For **Mechanism**, select **Symmetric Key**.

   1. Provide a unique **Registration ID** for your device.

   1. Optionally, provide an **IoT Hub Device ID** for your device. You can use device IDs to target an individual device for module deployment. If you don't provide a device ID, the registration ID is used.

   1. Select **True** to declare that the enrollment is for an IoT Edge device.

   1. Optionally, add a tag value to the **Initial Device Twin State**. You can use tags to target groups of devices for module deployment. For example:

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

   1. Select **Save**.

1. Copy the individual enrollment's **Primary Key** value to use when installing the IoT Edge runtime.

Now that an enrollment exists for this device, the IoT Edge runtime can automatically provision the device during installation.

## Option 2: Create a DPS enrollment group

Use your device's registration ID to create an individual enrollment in DPS.

When you create an enrollment in DPS, you have the opportunity to declare an **Initial Device Twin State**. In the device twin, you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](how-to-deploy-at-scale.md).

> [!TIP]
> The steps in this article are for the Azure portal, but you can also make create individual enrollments using the Azure CLI. For more information, see [az iot dps enrollment-group](/cli/azure/iot/dps/enrollment-group). As part of the CLI command, use the **edge-enabled** flag to specify that the enrollment is for IoT Edge devices. For a group enrollment, all devices must be IoT Edge devices or none of them can be.

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub Device Provisioning Service.

1. Under **Settings**, select **Manage enrollments**.

1. Select **Add individual enrollment** then complete the following steps to configure the enrollment:  

   1. Provide a **Group name**.

   1. Select **Symmetric Key** as the attestation type.

   1. Select **True** to declare that the enrollment is for an IoT Edge device. For a group enrollment, all devices must be IoT Edge devices or none of them can be.

   1. Optionally, add a tag value to the **Initial Device Twin State**. You can use tags to target groups of devices for module deployment. For example:

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

   1. Select **Save**.

1. Copy your enrollment group's **Primary Key** value to use when creating device keys for use with a group enrollment.

Now that an enrollment group exists, the IoT Edge runtime can automatically provision  devices during installation.

### Derive a device key

Each device that is provisioned as part of a group enrollment needs a derived device key to perform symmetric key attestation with the enrollment during provisioning.

To generate a device key, use the key that you copied from your DPS enrollment group to compute an [HMAC-SHA256](https://wikipedia.org/wiki/HMAC) of the unique registration ID for the device and convert the result into Base64 format.

Do not include your enrollment's primary or secondary key in your device code.

#### Derive a key on Linux

On Linux, you can use openssl to generate your derived device key as shown in the following example.

Replace the value of **KEY** with the **Primary Key** you noted earlier.

Replace the value of **REG_ID** with your device's registration ID.

```bash
KEY=PASTE_YOUR_ENROLLMENT_KEY_HERE
REG_ID=PASTE_YOUR_REGISTRATION_ID_HERE

keybytes=$(echo $KEY | base64 --decode | xxd -p -u -c 1000)
echo -n $REG_ID | openssl sha256 -mac HMAC -macopt hexkey:$keybytes -binary | base64
```

```bash
Jsm0lyGpjaVYVP2g3FnmnmG9dI/9qU24wNoykUmermc=
```

#### Derive a key on Windows

On Windows, you can use PowerShell to generate your derived device key as shown in the following example.

Replace the value of **KEY** with the **Primary Key** you noted earlier.

Replace the value of **REG_ID** with your device's registration ID.

```powershell
$KEY='PASTE_YOUR_ENROLLMENT_KEY_HERE'
$REG_ID='PASTE_YOUR_REGISTRATION_ID_HERE'

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

<!-- 1.1 -->
:::moniker range="=iotedge-2018-06"

Follow the appropriate steps to install Azure IoT Edge based on your operating system:

* [Install IoT Edge for Linux](how-to-install-iot-edge.md)
* [Install IoT Edge for Linux on Windows devices](how-to-install-iot-edge-on-windows.md)
  * This scenario is the recommended way to run IoT Edge on Windows devices.
* [Install IoT Edge with Windows containers](how-to-install-iot-edge-windows-on-windows.md)

Once IoT Edge is installed on your device, return to this article to provision the device.

:::moniker-end
<!-- end 1.1 -->

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

Follow the steps in [Install the Azure IoT Edge runtime](how-to-install-iot-edge.md), then return to this article to provision the device.

:::moniker-end
<!-- end 1.2 -->

## Configure the device with provisioning information

Once the runtime is installed on your device, configure the device with the information it uses to connect to the Device Provisioning Service and IoT Hub.

Have the following information ready:

* The DPS **ID Scope** value
* The device **Registration ID** you created
* Either the **Primary Key** from an individual enrollment, or a [derived key](#derive-a-device-key) for devices using a group enrollment.

# [Linux](#tab/linux)

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

1. Open the configuration file on the IoT Edge device.

   ```bash
   sudo nano /etc/iotedge/config.yaml
   ```

1. Find the provisioning configurations section of the file. Uncomment the lines for DPS symmetric key provisioning, and make sure any other provisioning lines are commented out.

   The `provisioning:` line should have no preceding whitespace, and nested items should be indented by two spaces.

   ```yml
   # DPS TPM provisioning configuration
   provisioning:
     source: "dps"
     global_endpoint: "https://global.azure-devices-provisioning.net"
     scope_id: "PASTE_YOUR_SCOPE_ID_HERE"
     attestation:
       method: "symmetric_key"
       registration_id: "PASTE_YOUR_REGISTRATION_ID_HERE"
       symmetric_key: "PASTE_YOUR_PRIMARY_KEY_OR_DERIVED_KEY_HERE"
   #  always_reprovision_on_startup: true
   #  dynamic_reprovisioning: false
   ```

1. Update the values of `scope_id`, `registration_id`, and `symmetric_key` with your DPS and device information.

1. Optionally, use the `always_reprovision_on_startup` or `dynamic_reprovisioning` lines to configure your device's reprovisioning behavior. If a device is set to reprovision on startup, it will always attempt to provision with DPS first and then fall back to the provisioning backup if that fails. If a device is set to dynamically reprovision itself, IoT Edge will restart and reprovision if a reprovisioning event is detected. For more information, see [IoT Hub device reprovisioning concepts](../iot-dps/concepts-device-reprovision.md).

1. Restart the IoT Edge runtime so that it picks up all the configuration changes that you made on the device.

   ```bash
   sudo systemctl restart iotedge
   ```

:::moniker-end
<!-- end 1.1 -->

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

1. Create a configuration file for your device based on a template file that is provided as part of the IoT Edge installation.

   ```bash
   sudo cp /etc/aziot/config.toml.edge.template /etc/aziot/config.toml
   ```

1. Open the configuration file on the IoT Edge device.

   ```bash
   sudo nano /etc/aziot/config.toml
   ```

1. Find the **Provisioning** section of the file. Uncomment the lines for DPS provisioning with symmetric key, and make sure any other provisioning lines are commented out.

   ```toml
   # DPS provisioning with symmetric key
   [provisioning]
   source = "dps"
   global_endpoint = "https://global.azure-devices-provisioning.net"
   id_scope = "PASTE_YOUR_SCOPE_ID_HERE"
   
   [provisioning.attestation]
   method = "symmetric_key"
   registration_id = "PASTE_YOUR_REGISTRATION_ID_HERE"

   symmetric_key = "PASTE_YOUR_PRIMARY_KEY_OR_DERIVED_KEY_HERE"
   ```

1. Update the values of `id_scope`, `registration_id`, and `symmetric_key` with your DPS and device information.

   The symmetric key parameter can accept a value of an inline key, a file URI, or a PKCS#11 URI. Uncomment just one symmetric key line, based on which format you're using.

   If you use any PKCS#11 URIs, find the **PKCS#11** section in the config file and provide information about your PKCS#11 configuration.

1. Save and close the config.toml file.

1. Apply the configuration changes that you made to IoT Edge.

   ```bash
   sudo iotedge config apply
   ```

:::moniker-end
<!-- end 1.2 -->

# [Linux on Windows](#tab/eflow)

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

You can use either PowerShell or Windows Admin Center to provision your IoT Edge device.

### PowerShell

For PowerShell, run the following command with the placeholder values updated with your own values:

```powershell
Provision-EflowVm -provisioningType DpsSymmetricKey -​scopeId PASTE_YOUR_ID_SCOPE_HERE -registrationId PASTE_YOUR_REGISTRATION_ID_HERE -symmKey PASTE_YOUR_PRIMARY_KEY_OR_DERIVED_KEY_HERE
```

### Windows Admin Center

For Windows Admin Center, use the following steps:

1. On the **Azure IoT Edge device provisioning** pane, select **Symmetric Key (DPS)** from the provisioning method dropdown.

1. In the [Azure portal](https://ms.portal.azure.com/), navigate to your DPS instance.

1. Provide your DPS scope ID, device registration ID, and enrollment primary key or derived key in the Windows Admin Center fields.

1. Choose **Provisioning with the selected method**.

   ![Choose provisioning with the selected method after filling in the required fields for symmetric key provisioning](./media/how-to-install-iot-edge-on-windows/provisioning-with-selected-method-symmetric-key.png)

1. Once the provisioning is complete, select **Finish**. You will be taken back to the main dashboard. Now, you should see a new device listed, whose type is `IoT Edge Devices`. You can select the IoT Edge device to connect to it. Once on its **Overview** page, you can view the **IoT Edge Module List** and **IoT Edge Status** of your device.

:::moniker-end
<!-- end 1.1. -->

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

>[!NOTE]
>Currently, there is not support for IoT Edge version 1.2 running on IoT Edge for Linux for Windows.

:::moniker-end
<!-- end 1.2 -->

# [Windows](#tab/windows)

<!-- 1.1 -->
:::moniker range="=iotedge-2018-06"

1. Open a PowerShell window in administrator mode. Be sure to use an AMD64 session of PowerShell when installing IoT Edge, not PowerShell (x86).

1. The **Initialize-IoTEdge** command configures the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers, so use the `-DpsSymmetricKey` flag to use automatic provisioning with symmetric key authentication.

   Replace the placeholder values for `{scope_id}`, `{registration_id}`, and `{symmetric_key}` with the data you collected earlier.

   Add the `-ContainerOs Linux` parameter if you're using Linux containers on Windows.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -DpsSymmetricKey -ScopeId {scope ID} -RegistrationId {registration ID} -SymmetricKey {symmetric key}
   ```

:::moniker-end
<!-- end 1.1 -->

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

>[!NOTE]
>Currently, there is not support for IoT Edge version 1.2 running on Windows.

:::moniker-end
<!-- end 1.2 -->

---

## Verify successful installation

If the runtime started successfully, you can go into your IoT Hub and start deploying IoT Edge modules to your device.

You can verify that the individual enrollment that you created in Device Provisioning Service was used. Navigate to your Device Provisioning Service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.

Use the following commands on your device to verify that the IoT Edge installed and started successfully.

# [Linux](#tab/linux)

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

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

:::moniker-end

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

Check the status of the IoT Edge service.

```cmd/sh
sudo iotedge system status
```

Examine service logs.

```cmd/sh
sudo iotedge system logs
```

List running modules.

```cmd/sh
sudo iotedge list
```

:::moniker-end

# [Linux on Windows](#tab/eflow)

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

Connect to the IoT Edge for Linux on Windows virtual machine.

```powershell
Connect-EflowVM
```

Check the status of the IoT Edge service.

```cmd/sh
sudo systemctl status iotedge
```

Examine service logs.

```cmd/sh
sudo journalctl -u iotedge --no-pager --no-full
```

List running modules.

```cmd/sh
sudo iotedge list
```

:::moniker-end

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

>[!NOTE]
>Currently, there is not support for IoT Edge version 1.2 running on IoT Edge for Linux for Windows.

:::moniker-end
<!-- end 1.2 -->

# [Windows](#tab/windows)

<!-- 1.1 -->
:::moniker range="=iotedge-2018-06"

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

:::moniker-end

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

>[!NOTE]
>Currently, there is not support for IoT Edge version 1.2 running on Windows.

:::moniker-end
<!-- end 1.2 -->

---

## Next steps

The Device Provisioning Service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices using automatic device management. Learn how to [Deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-at-scale.md) or [using Azure CLI](how-to-deploy-cli-at-scale.md).
