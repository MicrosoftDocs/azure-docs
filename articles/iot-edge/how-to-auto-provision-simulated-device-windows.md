---
title: Automatically provision Windows devices with DPS - Azure IoT Edge | Microsoft Docs 
description: Use a simulated device on your Windows machine to test automatic device provisioning for Azure IoT Edge with Device Provisioning Service
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 01/09/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Create and provision a simulated IoT Edge device with a virtual TPM on Windows

Azure IoT Edge devices can be auto-provisioned using the [Device Provisioning Service](../iot-dps/index.yml) just like devices that are not edge-enabled. If you're unfamiliar with the process of auto-provisioning, review the [auto-provisioning concepts](../iot-dps/concepts-auto-provisioning.md) before continuing.

DPS supports symmetric key attestation for IoT Edge devices in both individual enrollment and group enrollment. For group enrollment, if you check “is IoT Edge device” option to be true in symmetric key attestation, all the devices that are registered under that enrollment group will be marked as IoT Edge devices.

This article shows you how to test auto-provisioning on a simulated IoT Edge device with the following steps:

* Create an instance of IoT Hub Device Provisioning Service (DPS).
* Create a simulated device on your Windows machine with a simulated Trusted Platform Module (TPM) for hardware security.
* Create an individual enrollment for the device.
* Install the IoT Edge runtime and connect the device to IoT Hub.

> [!TIP]
> This article describes testing auto-provisioning by using TPM attestation on virtual devices, but much of it applies when using physical TPM hardware as well.

## Prerequisites

* A Windows development machine. This article uses Windows 10.
* An active IoT Hub.

> [!NOTE]
> TPM 2.0 is required when using TPM attestation with DPS and can only be used to create individual, not group, enrollments.

## Set up the IoT Hub Device Provisioning Service

Create a new instance of the IoT Hub Device Provisioning Service in Azure, and link it to your IoT hub. You can follow the instructions in [Set up the IoT Hub DPS](../iot-dps/quick-setup-auto-provision.md).

After you have the Device Provisioning Service running, copy the value of **ID Scope** from the overview page. You use this value when you configure the IoT Edge runtime.

> [!TIP]
> If you're using a physical TPM device, you need to determine the **Endorsement key**, which is unique to each TPM chip and is obtained from the TPM chip manufacturer associated with it. You can derive a unique **Registration ID** for your TPM device by, for example, creating an SHA-256 hash of the endorsement key.
>
> Follow the instructions in the article [How to manage device enrollments with Azure Portal](../iot-dps/how-to-manage-enrollments.md) to create your enrollment in DPS and then proceed with the [Install the IoT Edge runtime](#install-the-iot-edge-runtime) section in this article to continue.

## Simulate a TPM device

Create a simulated TPM device on your Windows development machine. Retrieve the **Registration ID** and **Endorsement key** for your device, and use them to create an individual enrollment entry in DPS.

When you create an enrollment in DPS, you have the opportunity to declare an **Initial Device Twin State**. In the device twin you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](how-to-deploy-monitor.md).

Choose the SDK language that you want to use to create the simulated device, and follow the steps until you create the individual enrollment.

When you create the individual enrollment, select **True** to declare that the simulated TPM device on your Windows development machine is an **IoT Edge device**.

Simulated device and individual enrollment guides:

* [C](../iot-dps/quick-create-simulated-device.md)
* [Java](../iot-dps/quick-create-simulated-device-tpm-java.md)
* [C#](../iot-dps/quick-create-simulated-device-tpm-csharp.md)
* [Node.js](../iot-dps/quick-create-simulated-device-tpm-node.md)
* [Python](../iot-dps/quick-create-simulated-device-tpm-python.md)

After creating the individual enrollment, save the value of the **Registration ID**. You use this value when you configure the IoT Edge runtime.

## Install the IoT Edge runtime

The IoT Edge runtime is deployed on all IoT Edge devices. Its components run in containers, and allow you to deploy additional containers to the device so that you can run code at the edge.

You'll need the following information when provisioning your device:

* The DPS **ID Scope** value
* The device **Registration ID** you created

Install the IoT Edge runtime on the device that is running the simulated TPM. You'll configure the IoT Edge runtime for automatic, not manual, provisioning.

> [!TIP]
> Keep the window that's running the TPM simulator open during your installation and testing.

For more detailed information about installing IoT Edge on Windows, including prerequisites and instructions for tasks like managing containers and updating IoT Edge, see [Install the Azure IoT Edge runtime on Windows](how-to-install-iot-edge-windows.md).

1. Open a PowerShell window in administrator mode. Be sure to use an AMD64 session of PowerShell when installing IoT Edge, not PowerShell (x86).

1. The **Deploy-IoTEdge** command checks that your Windows machine is on a supported version, turns on the containers feature, and then downloads the moby runtime and the IoT Edge runtime. The command defaults to using Windows containers.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Deploy-IoTEdge
   ```

1. At this point, IoT Core devices may restart automatically. Other Windows 10 or Windows Server devices may prompt you to restart. If so, restart your device now. Once your device is ready, run PowerShell as an administrator again.

1. The **Initialize-IoTEdge** command configures the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers. Use the `-Dps` flag to use the Device Provisioning Service instead of manual provisioning.

   Replace the placeholder values for `{scope_id}` and `{registration_id}` with the data you collected earlier.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -Dps -ScopeId {scope ID} -RegistrationId {registration ID}
   ```

## Verify successful installation

If the runtime started successfully, you can go into your IoT Hub and start deploying IoT Edge modules to your device. Use the following commands on your device to verify that the runtime installed and started successfully.  

Check the status of the IoT Edge service.

```powershell
Get-Service iotedge
```

Examine service logs from the last 5 minutes.

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog
```

List running modules.

```powershell
iotedge list
```

## Next steps

The Device Provisioning Service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices using automatic device management. Learn how to [Deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-monitor.md) or [using Azure CLI](how-to-deploy-monitor-cli.md)
