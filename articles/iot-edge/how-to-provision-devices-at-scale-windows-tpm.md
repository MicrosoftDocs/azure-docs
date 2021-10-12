---
title: Provision devices with a virtual TPM on Windows - Azure IoT Edge | Microsoft Docs 
description: Use a simulated TPM on a Windows device to test the Azure device provisioning service for Azure IoT Edge
author: kgremban
ms.author: kgremban
ms.date: 10/06/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
monikerRange: "=iotedge-2018-06"
---

# Create and provision IoT Edge devices at scale with a TPM on Windows

[!INCLUDE [iot-edge-version-201806](../../includes/iot-edge-version-201806.md)]

This article provides instructions for autoprovisioning an Azure IoT Edge for Windows device by using a Trusted Platform Module (TPM). You can automatically provision IoT Edge devices with the [Azure IoT Hub device provisioning service](../iot-dps/index.yml). If you're unfamiliar with the process of autoprovisioning, review the [provisioning overview](../iot-dps/about-iot-dps.md#provisioning-process) before you continue.

This article outlines two methodologies. Select your preference based on the architecture of your solution:

1. Autoprovision a Windows device with physical TPM hardware.
1. Autoprovision a Windows device running a simulated TPM. We recommend this methodology only as a testing scenario. A simulated TPM doesn't offer the same security as a physical TPM.

Instructions differ based on your methodology, so make sure you're on the correct tab going forward.

The tasks are as follows:

# [Physical TPM](#tab/physical-tpm)

* Retrieve your device's provisioning information.
* Create an individual enrollment for the device.
* Install the IoT Edge runtime and connect the device to IoT Hub.

# [Simulated TPM](#tab/simulated-tpm)

* Set up your simulated TPM and retrieve its provisioning information.
* Create an individual enrollment for the device.
* Install the IoT Edge runtime and connect the device to IoT Hub.

---

## Prerequisites

The prerequisites are the same for physical TPM and virtual TPM solutions.

* A Windows development machine. This article uses Windows 10.
* An active IoT hub.
* An instance of the IoT Hub device provisioning service in Azure linked to your IoT hub.
  * If you don't have a device provisioning service instance, follow the instructions in two sections of the IoT Hub device provisioning service quickstart:
    - [Create a new IoT Hub device provisioning service](../iot-dps/quick-setup-auto-provision.md#create-a-new-iot-hub-device-provisioning-service)
    - [Link the IoT hub and your device provisioning service](../iot-dps/quick-setup-auto-provision.md#link-the-iot-hub-and-your-device-provisioning-service)
  * After you have the device provisioning service running, copy the value of **ID Scope** from the overview page. You use this value when you configure the IoT Edge runtime.

> [!NOTE]
> TPM 2.0 is required when you use TPM attestation with the device provisioning service.
>
> You can only create individual, not group, device provisioning service enrollments when you use a TPM.

## Set up your TPM

# [Physical TPM](#tab/physical-tpm)

In this section, you build a tool that you can use to retrieve the Registration ID and Endorsement key for your TPM.

1. Follow the steps in [Set up a Windows development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md#set-up-a-windows-development-environment) to install and build the Azure IoT device SDK for C.

1. Run the following commands in an elevated PowerShell session to build the SDK tool that retrieves your device provisioning information for your TPM.

   ```powershell
   cd azure-iot-sdk-c\cmake
   cmake -Duse_prov_client:BOOL=ON ..
   cd provisioning_client\tools\tpm_device_provision
   make
   .\tpm_device_provision
   ```

1. The output window displays the device's **Registration ID** and the **Endorsement key**. Copy these values for use later when you create an individual enrollment for your device in the device provisioning service.

> [!TIP]
> If you don't want to use the SDK tool to retrieve the information, you need to find another way to obtain the provisioning information. The Endorsement key, which is unique to each TPM chip, is obtained from the TPM chip manufacturer associated with it. You can derive a unique Registration ID for your TPM device. For example, you can create an SHA-256 hash of the Endorsement key.

After you have your Registration ID and Endorsement key, you're ready to continue.

# [Simulated TPM](#tab/simulated-tpm)

If you don't have a physical TPM available and want to test this provisioning method, you can simulate a TPM on your device.

The IoT Hub device provisioning service provides samples that simulate a TPM and return the Endorsement key and Registration ID for you.

1. Choose one of the samples from the following list based on your preferred language.
1. Stop following the device provisioning service sample steps after you have the simulated TPM running and have collected the **Endorsement key** and **Registration ID**. Don't select **Enter** to run registration in the sample application.
1. Keep the window hosting the simulated TPM running until you're finished testing this scenario.
1. Return to this article to create a device provisioning service enrollment and configure your device.

Simulated TPM samples:

* [C](../iot-dps/quick-create-simulated-device.md)
* [Java](../iot-dps/quick-create-simulated-device-tpm-java.md)
* [C#](../iot-dps/quick-create-simulated-device-tpm-csharp.md)
* [Node.js](../iot-dps/quick-create-simulated-device-tpm-node.md)
* [Python](../iot-dps/quick-create-simulated-device-tpm-python.md)

---

## Create a device provisioning service enrollment

Use your TPM's provisioning information to create an individual enrollment in the device provisioning service.

When you create an enrollment in the device provisioning service, you have the opportunity to declare an **Initial Device Twin State**. In the device twin, you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](how-to-deploy-at-scale.md).

> [!TIP]
> The steps in this article are for the Azure portal, but you can also create individual enrollments by using the Azure CLI. For more information, see [az iot dps enrollment](/cli/azure/iot/dps/enrollment). As part of the CLI command, use the **edge-enabled** flag to specify that the enrollment is for an IoT Edge device.

1. In the [Azure portal](https://portal.azure.com), go to your instance of the IoT Hub device provisioning service.

1. Under **Settings**, select **Manage enrollments**.

1. Select **Add individual enrollment**, and then complete the following steps to configure the enrollment:

   1. For **Mechanism**, select **TPM**.

   1. Provide the **Endorsement key** and **Registration ID** that you copied from your virtual machine (VM) or physical device.

   1. Provide an ID for your device if you want. If you don't provide a device ID, the **Registration ID** is used.

   1. Select **True** to declare that your VM or physical device is an IoT Edge device.

   1. Choose the linked IoT hub that you want to connect your device to, or select **Link to new IoT Hub**. You can choose multiple hubs, and the device will be assigned to one of them according to the selected assignment policy.

   1. Add a tag value to the **Initial Device Twin State** if you want. You can use tags to target groups of devices for module deployment. For more information, see [Deploy IoT Edge modules at scale](how-to-deploy-at-scale.md).

   1. Select **Save**.

Now that an enrollment exists for this device, the IoT Edge runtime can automatically provision the device during installation.

## Install the IoT Edge runtime

In this section, you prepare your Windows VM or physical device for IoT Edge. Then, you'll install IoT Edge.

There's one step you need to complete on your device before it's ready to install the IoT Edge runtime. Your device needs a container engine installed.

### Install IoT Edge

The IoT Edge security daemon provides and maintains security standards on the IoT Edge device. The daemon starts on every boot and bootstraps the device by starting the rest of the IoT Edge runtime.

The steps in this section represent the typical process to install the latest version on a device that has internet connectivity. If you need to install a specific version, like a prerelease version, or need to install while offline, follow the Offline or specific version installation steps.

1. Run PowerShell as an administrator.

   Use an AMD64 session of PowerShell, not PowerShell (x86). If you're unsure which session type you're using, run the following command:

   ```powershell
   (Get-Process -Id $PID).StartInfo.EnvironmentVariables["PROCESSOR_ARCHITECTURE"]
   ```

2. Run the [Deploy-IoTEdge](reference-windows-scripts.md#deploy-iotedge) command, which performs the following tasks:

   * Checks that your Windows machine is on a supported version.
   * Turns on the containers feature.
   * Downloads the Moby engine and the IoT Edge runtime.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Deploy-IoTEdge
   ```

3. Restart your device if prompted.

When you install IoT Edge on a device, you can use other parameters to modify the process to:

* Direct traffic to go through a proxy server.
* Point the installer to a local directory for offline installation.

For more information about these other parameters, see [PowerShell scripts for IoT Edge with Windows containers](reference-windows-scripts.md).

## Configure the device with provisioning information

After the runtime is installed on your device, configure the device with the information it uses to connect to the device provisioning service and IoT Hub.

1. Know your device provisioning service **ID Scope** and device **Registration ID** that were gathered in the previous sections.

1. Open a PowerShell window in administrator mode. Be sure to use an AMD64 session of PowerShell when you install IoT Edge, not PowerShell (x86).

1. The `Initialize-IoTEdge` command configures the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers. Use the `-Dps` flag to use the device provisioning service instead of manual provisioning.

   Replace the placeholder values for `{scope_id}` and `{registration_id}` with the data you collected earlier.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -Dps -ScopeId {scope ID} -RegistrationId {registration ID}
   ```

## Verify successful installation

If the runtime started successfully, go into your IoT hub and start deploying IoT Edge modules to your device. Use the following commands on your device to verify that the runtime installed and started successfully.

1. Check the status of the IoT Edge service.

    ```powershell
    Get-Service iotedge
    ```

1. Examine service logs from the last 5 minutes.

    ```powershell
    . {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog
    ```

1. List running modules.

    ```powershell
    iotedge list
    ```

## Next steps

The device provisioning service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices by using automatic device management.

Learn how to [deploy and monitor IoT Edge modules at scale by using the Azure portal](how-to-deploy-at-scale.md) or [the Azure CLI](how-to-deploy-cli-at-scale.md).
