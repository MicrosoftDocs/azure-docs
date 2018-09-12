---
title: Auto-provision Azure IoT Edge device with DPS - Windows | Microsoft Docs 
description: Use a simulated device on your Windows machine to test automatic device provisioning for Azure IoT Edge with Device Provisioning Service
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 08/06/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Create and provision a simulated TPM Edge device on Windows

Azure IoT Edge devices can be auto-provisioned using the [Device Provisioning Service](../iot-dps/index.yml) just like devices that are not edge-enabled. If you're unfamiliar with the process of auto-provisioning, review the [auto-provisioning concepts](../iot-dps/concepts-auto-provisioning.md) before continuing. 

This article shows you how to test auto-provisioning on a simulated Edge device with the following steps: 

* Create an instance of IoT Hub Device Provisioning Service (DPS).
* Create a simulated device on your Windows machine with a simulated Trusted Platform Module (TPM) for hardware security.
* Create an individual enrollment for the device.
* Install the IoT Edge runtime and connect the device to IoT Hub.

## Prerequisites

* A Windows development machine. This article uses Windows 10. 
* An active IoT Hub. 

## Set up the IoT Hub Device Provisioning Service

Create a new instance of the IoT Hub Device Provisioning Service in Azure, and link it to your IoT hub. You can follow the instructions in [Set up the IoT Hub DPS](../iot-dps/quick-setup-auto-provision.md).

After you have the Device Provisioning Service running, copy the value of **ID Scope** from the overview page. You use this value when you configure the IoT Edge runtime. 

## Simulate a TPM device

Create a simulated TPM device on your Windows development machine. Retrieve the **Registration ID** and **Endorsement Key** for your device, and use them to create an individual enrollment entry in DPS. 

When you create an enrollment in DPS, you have the opportunity to declare an **Initial Device Twin State**. In the device twin you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](how-to-deploy-monitor.md). 

Choose the SDK language that you want to use to create the simulated device, and follow the steps until you create the individual enrollment. 

When you create the individual enrollment, select **Enable** to declare that this virtual machine is an **IoT Edge device**.

Simulated device and individual enrollment guides: 
* [C](../iot-dps/quick-create-simulated-device.md)
* [Java](../iot-dps/quick-create-simulated-device-tpm-java.md)
* [C#](../iot-dps/quick-create-simulated-device-tpm-csharp.md)
* [Node.js](../iot-dps/quick-create-simulated-device-tpm-node.md)
* [Python](../iot-dps/quick-create-simulated-device-tpm-python.md)

After creating the individual enrollment, save the value of the **Registration ID**. You use this value when you configure the IoT Edge runtime. 

## Install the IoT Edge runtime

After completing the previous section, you should see your new device listed as an IoT Edge device in your IoT Hub. Now, you need to install the IoT Edge runtime on your device. 

The IoT Edge runtime is deployed on all IoT Edge devices. Its components run in containers, and allow you to deploy additional containers to the device so that you can run code at the edge. On devices running Windows, you can choose to either use Windows containers or Linux containers. Choose the type of containers that you want to use, and follow the steps. Make sure to configure the IoT Edge runtime for automatic, not manual, provisioning. 

Follow the instructions to install the IoT Edge runtime on the device that is running the simulated TPM from the previous section. 

Know your DPS **ID Scope** and device **Registration ID** before beginning these articles. 

* [Windows containers](how-to-install-iot-edge-windows-with-windows.md)
* [Linux containers](how-to-install-iot-edge-windows-with-linux.md)

## Verify successful installation

If the runtime started successfully, you can go into your IoT Hub and start deploying IoT Edge modules to your device. Use the following commands on your device to verify that the runtime installed and started successfully.  

Check the status of the IoT Edge service.

```powershell
Get-Service iotedge
```

Examine service logs from the last 5 minutes.

```powershell
# Displays logs from last 5 min, newest at the bottom.

Get-WinEvent -ea SilentlyContinue `
  -FilterHashtable @{ProviderName= "iotedged";
    LogName = "application"; StartTime = [datetime]::Now.AddMinutes(-5)} |
  select TimeCreated, Message |
  sort-object @{Expression="TimeCreated";Descending=$false} |
  format-table -autosize -wrap
```

List running modules.

```powershell
iotedge list
```

## Next steps

The Device Provisioning Service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices using automatic device management. Learn how to [Deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-monitor.md) or [using Azure CLI](how-to-deploy-monitor-cli.md)
