---
title: Create and provision IoT Edge devices using symmetric keys on Linux on Windows - Azure IoT Edge | Microsoft Docs
description: Use symmetric key attestation to test provisioning Linux on Windows devices at scale for Azure IoT Edge with Device Provisioning Service
author: v-tcassi
ms.author: v-tcassi
ms.reviewer: kgremban
ms.date: 08/17/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
monikerRange: "=iotedge-2018-06"
---

# Create and provision IoT Edge for Linux on Windows devices at scale using symmetric keys 

[!INCLUDE [iot-edge-version-201806](../../includes/iot-edge-version-201806.md)]

This article provides end-to-end instructions for auto-provisioning one or more [IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md) devices using symmetric keys. You can automatically provision Azure IoT Edge devices with the [Azure IoT Hub Device Provisioning Service](../iot-dps/index.yml) (DPS). If you're unfamiliar with the process of auto-provisioning, review the [provisioning overview](../iot-dps/about-iot-dps.md#provisioning-process) before continuing.

The tasks are as follows:

1. Create either an **individual enrollment** for a single device or a **group enrollment** for a set of devices.
1. Deploy a Linux virtual machine with the IoT Edge runtime installed and connect it to the IoT Hub.

Symmetric key attestation is a simple approach to authenticating a device with a Device Provisioning Service instance. This attestation method represents a "Hello world" experience for developers who are new to device provisioning, or do not have strict security requirements. Device attestation using a [TPM](../iot-dps/concepts-tpm-attestation.md) or [X.509 certificates](../iot-dps/concepts-x509-attestation.md) is more secure, and should be used for more stringent security requirements.

## Prerequisites

Cloud resources:

* An active IoT Hub.
* An instance of the IoT Hub Device Provisioning Service in Azure, linked to your IoT hub.
  * If you don't have a Device Provisioning Service instance, you can follow the instructions in the [Create a new IoT Hub Device Provisioning Service](../iot-dps/quick-setup-auto-provision.md#create-a-new-iot-hub-device-provisioning-service) and [Link the IoT hub and your Device Provisioning Service](../iot-dps/quick-setup-auto-provision.md#link-the-iot-hub-and-your-device-provisioning-service) sections of the IoT Hub Device Provisioning Service quickstart.
  * After you have the Device Provisioning Service running, copy the value of **ID Scope** from the overview page. You use this value when you configure the IoT Edge runtime.

A development machine:

* A Windows device with the following minimum system requirements:
  * Windows 10 Version 1809 or later; build 17763 or later
  * Professional, Enterprise, or Server editions
  * Minimum Free Memory: 1 GB
  * Minimum Free Disk Space: 10 GB
  * Virtualization support
    * On Windows 10, enable Hyper-V. For more information, see [Install Hyper-V on Windows 10](/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v).
    * On Windows Server, install the Hyper-V role and create a default network switch. For more information, see [Nested virtualization for Azure IoT Edge for Linux on Windows](nested-virtualization.md).
    * On a virtual machine, configure nested virtualization. For more information, see [nested virtualization](nested-virtualization.md).
  * Networking support
    * Windows Server does not come with a default switch. Before you can deploy EFLOW to a Windows Server device, you need to create a virtual switch.  For more information, see [Create virtual switch for Linux on Windows](how-to-create-virtual-switch.md).
    * Windows Desktop versions come with a default switch that can be used for EFLOW installation. If needed, you can create your own custom virtual switch.

   > [!TIP]
   > If you want to use **GPU-accelerated Linux modules** in your Azure IoT Edge for Linux on Windows deployment, there are several configuration options to consider. You will need to install the correct drivers depending on your GPU architecture, and you may need access to a Windows Insider Program build. To determine your configuration needs and satisfy these prerequisites, see [GPU acceleration for Azure IoT Edge for Linux on Windows](gpu-acceleration.md).

You can use either **PowerShell** or **Windows Admin Center** to manage your IoT Edge devices. Each utility has its own prerequisites:

# [PowerShell](#tab/powershell)

If you want to use PowerShell, use the following steps to prepare your target device for the installation of Azure IoT Edge for Linux on Windows and the deployment of the Linux virtual machine:

1. Set the execution policy on the target device to `AllSigned`. You can check the current execution policy in an elevated PowerShell prompt using the following command:

   ```powershell
   Get-ExecutionPolicy -List
   ```

   If the execution policy of `local machine` is not `AllSigned`, you can set the execution policy using:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy AllSigned -Force
   ```

For more information on the Azure IoT Edge for Linux on Windows PowerShell module, see the [PowerShell functions reference](reference-iot-edge-for-linux-on-windows-functions.md).

# [Windows Admin Center](#tab/windowsadmincenter)

If you want to use Windows Admin Center, use the following steps to download and install Windows Admin Center and install the Windows Admin Center Azure IoT Edge extension:

   1. Download and run the [Windows Admin Center installer](https://aka.ms/wacdownload). Follow the install wizard prompts to install Windows Admin Center.

   1. Once installed, use a supported browser to open Windows Admin Center. Supported browsers include Microsoft Edge (Windows 10, version 1709 or later), Google Chrome, and Microsoft Edge Insider.

   1. On the first use of Windows Admin Center, you will be prompted to select a certificate to use. Select **Windows Admin Center Client** as your certificate.

   1. Install the Azure IoT Edge extension. Select the gear icon in the top right of the Windows Admin Center dashboard.

      ![Select the gear icon in the top right of the dashboard to access the settings, PNG.](./media/how-to-provision-devices-at-scale-linux-on-windows-x509/select-gear-icon.png)

   1. On the **Settings** menu, under **Gateway**, select **Extensions**.

   1. On the **Available extensions** tab, find **Azure IoT Edge** in the list of extensions. Choose it, and select the **Install** prompt above the list of extensions.

   1. After the installation completes, you should see Azure IoT Edge in the list of installed extensions on the **Installed extensions** tab.

---

## Create a DPS enrollment

Create an enrollment to provision one or more devices through DPS.

If you are looking to provision a single IoT Edge device, create an **individual enrollment**. If you need multiple devices provisioned, follow the steps for creating a DPS **group enrollment**.

When you create an enrollment in DPS, you have the opportunity to declare an **initial device twin state**. In the device twin, you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](how-to-deploy-at-scale.md).

For more information about enrollments in the Device Provisioning Service, see [How to manage device enrollments](../iot-dps/how-to-manage-enrollments.md).

# [Individual enrollment](#tab/individual-enrollment)

### Create a DPS individual enrollment

> [!TIP]
> The steps in this article are for the Azure portal, but you can also create individual enrollments using the Azure CLI. For more information, see [az iot dps enrollment](/cli/azure/iot/dps/enrollment). As part of the CLI command, use the **edge-enabled** flag to specify that the enrollment is for an IoT Edge device.

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

# [Group enrollment](#tab/group-enrollment)

### Create a DPS group enrollment

> [!TIP]
> The steps in this article are for the Azure portal, but you can also create group enrollments using the Azure CLI. For more information, see [az iot dps enrollment-group](/cli/azure/iot/dps/enrollment-group). As part of the CLI command, use the **edge-enabled** flag to specify that the enrollment is for IoT Edge devices. For a group enrollment, all devices must be IoT Edge devices or none of them can be.

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

Now that an enrollment group exists, the IoT Edge runtime can automatically provision devices during installation.

#### Derive a device key

Each device that is provisioned as part of a group enrollment needs a derived device key to perform symmetric key attestation with the enrollment during provisioning.

To generate a device key, use the key that you copied from your DPS enrollment group to compute an [HMAC-SHA256](https://wikipedia.org/wiki/HMAC) of the unique registration ID for the device and convert the result into Base64 format.

> [!IMPORTANT]
> Do not include your enrollment's primary or secondary key in your device code.

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

Below is a sample output of a derived device key:

```powershell
Jsm0lyGpjaVYVP2g3FnmnmG9dI/9qU24wNoykUmermc=
```

---

## Install IoT Edge

Deploy Azure IoT Edge for Linux on Windows on your target device.

# [PowerShell](#tab/powershell)

Install IoT Edge for Linux on Windows onto your target device.

> [!NOTE]
> The following PowerShell process outlines how to deploy IoT Edge for Linux on Windows onto the local device. To deploy to a remote target device using PowerShell, you can use [Remote PowerShell](/powershell/module/microsoft.powershell.core/about/about_remote) to establish a connection to a remote device and run these commands remotely on that device.

1. In an elevated PowerShell session, run each of the following commands to download IoT Edge for Linux on Windows.

   ```powershell
   $msiPath = $([io.Path]::Combine($env:TEMP, 'AzureIoTEdge.msi'))
   $ProgressPreference = 'SilentlyContinue'
   Invoke-WebRequest "https://aka.ms/AzEflowMSI" -OutFile $msiPath
   ```

1. Install IoT Edge for Linux on Windows on your device.

   ```powershell
   Start-Process -Wait msiexec -ArgumentList "/i","$([io.Path]::Combine($env:TEMP, 'AzureIoTEdge.msi'))","/qn"
   ```

   You can specify custom IoT Edge for Linux on Windows installation and VHDX directories by adding `INSTALLDIR="<FULLY_QUALIFIED_PATH>"` and `VHDXDIR="<FULLY_QUALIFIED_PATH>"` parameters to the install command.

1. Set the execution policy on the target device to `AllSigned` if it is not already. See the PowerShell prerequisites for commands to check the current execution policy and set the execution policy to `AllSigned`.

1. Create the IoT Edge for Linux on Windows deployment. The deployment creates your Linux virtual machine and installs the IoT Edge runtime for you.

   ```powershell
   Deploy-Eflow
   ```

   >[!TIP]
   >By default, the `Deploy-Eflow` command creates your Linux virtual machine with 1 GB of RAM, 1 vCPU core, and 16 GB of disk space. However, the resources your VM needs are highly dependent on the workloads you deploy. If your VM does not have sufficient memory to support your workloads, it will fail to start.
   >
   >You can customize the virtual machine's available resources using the `Deploy-Eflow` command's optional parameters.
   >
   >For example, the command below creates a virtual machine with 4 vCPU cores, 4 GB of RAM, and 20 GB of disk space:
   >
   >   ```powershell
   >   Deploy-Eflow -cpuCount 4 -memoryInMB 4096 -vmDiskSize 20
   >   ```
   >
   >For information about all the optional parameters available, see [PowerShell functions for IoT Edge for Linux on Windows](reference-iot-edge-for-linux-on-windows-functions.md#deploy-eflow).

   You can assign a GPU to your deployment to enable GPU-accelerated Linux modules. To gain access to these features, you will need to install the prerequisites detailed in [GPU acceleration for Azure IoT Edge for Linux on Windows](gpu-acceleration.md).

   To use a GPU passthrough, add the **gpuName**, **gpuPassthroughType**, and **gpuCount** parameters to your `Deploy-Eflow` command. For information about all the optional parameters available, see [PowerShell functions for IoT Edge for Linux on Windows](reference-iot-edge-for-linux-on-windows-functions.md#deploy-eflow).

   >[!WARNING]
   >Enabling hardware device passthrough may increase security risks. Microsoft recommends a device mitigation driver from your GPU's vendor, when applicable. For more information, see [Deploy graphics devices using discrete device assignment](/windows-server/virtualization/hyper-v/deploy/deploying-graphics-devices-using-dda).

1. Enter 'Y' to accept the license terms.

1. Enter 'O' or 'R' to toggle **Optional diagnostic data** on or off, depending on your preference.

1. Once the deployment is complete, the PowerShell window reports **Deployment successful**.

   ![A successful deployment will say 'Deployment successful' at the end of the messages, PNG.](./media/how-to-provision-devices-at-scale-linux-on-windows-symmetric/successful-powershell-deployment.png)

Once your deployment is complete, you are ready to provision your device.

# [Windows Admin Center](#tab/windowsadmincenter)

>[!NOTE]
>The Azure IoT Edge extension for Windows Admin Center is currently in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Installation and management processes may be different than for generally available features.

Install Azure IoT Edge for Linux on Windows on your device.

1. Download the [Azure IoT Edge for Linux on Windows installer](https://aka.ms/AzEflowMSI).

1. Once you have installed Azure IoT Edge for Linux on Windows, open Windows Admin Center.

   On the Windows Admin Center start page, under the list of connections, you will see a local host connection representing the PC where you are running Windows Admin Center. Any additional servers, PCs, or clusters that you manage will also show up here.

   You can use Windows Admin Center to install and manage Azure IoT Edge for Linux on Windows on either your local device or remote managed devices. In this guide, the local host connection will serve as the target device for the deployment of Azure IoT Edge for Linux on Windows.

1. Confirm that your local device is listed under **All connections**, like shown below.

   ![Initial Windows Admin Center dashboard with target device listed, PNG.](./media/how-to-provision-devices-at-scale-linux-on-windows-symmetric/windows-admin-center-initial-dashboard.png)

   If you want to deploy to a remote target device instead of your local device and you do not see your desired target device in the list, follow the [instructions to add your device](/windows-server/manage/windows-admin-center/use/get-started#connecting-to-managed-nodes-and-clusters).

1. Select **+ Add** to begin creating your deployment. The deployment creates your Linux virtual machine and installs the IoT Edge runtime for you.

1. On the **Add or create resources** pane, locate the **Azure IoT Edge** tile. Select **Create new** to install a new instance of Azure IoT Edge for Linux on Windows on a device.

   If you already have IoT Edge for Linux on Windows running on a device, you could select **Add** to connect to that existing IoT Edge device and manage it with Windows Admin Center.

   ![Select Create New on Azure IoT Edge tile in Windows Admin Center, PNG.](./media/how-to-provision-devices-at-scale-linux-on-windows-symmetric/resource-creation-tiles.png)

1. The **Create an Azure IoT Edge for Linux on Windows deployment** pane will open. On the **1. Getting Started** tab, review the minimum requirements and select **Next**.

1. Review the license terms, check **I Accept**, and select **Next**.

1. You can toggle **Optional diagnostic data** on or off, depending on your preference.

1. Select **Next: Deploy**.

   ![Select the Next: Deploy button after toggling optional diagnostic data to your preference, PNG.](./media/how-to-provision-devices-at-scale-linux-on-windows-symmetric/select-next-deploy.png)

1. On the **2. Deploy** tab, under **Select a target device**, click on your listed device to validate it meets the minimum requirements. Once its status is confirmed as supported, select **Next**.

   ![Select your device to verify it is supported, PNG.](./media/how-to-provision-devices-at-scale-linux-on-windows-symmetric/evaluate-supported-device.png)

1. On the **2.2 Settings** tab, review the configuration settings of your deployment.

   >[!NOTE]
   >IoT Edge for Linux on Windows uses a default switch, which assigns the Linux virtual machine an internal IP address. This internal IP address cannot be reached from outside the Windows machine. You can connect to the virtual machine locally while logged onto the Windows machine.
   >
   >If you are using Windows Server, [set up a default switch](how-to-create-virtual-switch.md) before deploying IoT Edge for Linux on Windows.

   You can assign a GPU to your deployment to enable GPU-accelerated Linux modules. To gain access to these features, you will need to install the prerequisites detailed in [GPU acceleration for Azure IoT Edge for Linux on Windows](gpu-acceleration.md). If you are only installing these prerequisites at this point in the deployment process, you will need to start again from the beginning.

   There are two options for GPU passthrough available: **Direct Device Assignment (DDA)** and **GPU Paravirtualization (GPU-PV)**, depending on the GPU adaptor you assign to your deployment. Examples of each method are shown below.

   For the direct device assignment method, select the number of GPU processors to allocate to your Linux virtual machine.

   ![Configuration settings with a direct device assignment GPU enabled, PNG.](./media/how-to-provision-devices-at-scale-linux-on-windows-symmetric/gpu-passthrough-direct-device-assignment.png)

   For the paravirtualization method, no additional settings are needed.

   ![Configuration settings with a paravirtualization GPU enabled, PNG.](./media/how-to-provision-devices-at-scale-linux-on-windows-symmetric/gpu-passthrough-paravirtualization.png)

   >[!WARNING]
   >Enabling hardware device passthrough may increase security risks. Microsoft recommends a device mitigation driver from your GPU's vendor, when applicable. For more information, see [Deploy graphics devices using discrete device assignment](/windows-server/virtualization/hyper-v/deploy/deploying-graphics-devices-using-dda).

   Once you are satisfied with the settings, select **Next**.

1. On the **2.3 Deployment** tab, you can watch the progress of the deployment. The full process includes downloading the Azure IoT Edge for Linux on Windows package, installing the package, configuring the host device, and setting up the Linux virtual machine. This process may take several minutes to complete. A successful deployment is pictured below.

   ![A successful deployment will show each step with a green check mark and a 'Complete' label, PNG.](./media/how-to-provision-devices-at-scale-linux-on-windows-symmetric/successful-deployment.png)

Once your deployment is complete, you are ready to provision your device. Select **Next: Connect** to proceed to the **3. Connect** tab, which handles Azure IoT Edge device provisioning.

---

## Configure the device with provisioning information

Once the runtime is installed on your device, configure the device with the information it uses to connect to the Device Provisioning Service and IoT Hub.

Have the following information ready:

* The DPS **ID Scope** value
* The device **Registration ID** you created
* Either the **Primary Key** from an individual enrollment, or a [derived key](#derive-a-device-key) for devices using a group enrollment.

You can use either PowerShell or Windows Admin Center to provision your IoT Edge device.

# [PowerShell](#tab/powershell)

For PowerShell, run the following command with the placeholder values updated with your own values:

```powershell
Provision-EflowVm -provisioningType DpsSymmetricKey -​scopeId PASTE_YOUR_ID_SCOPE_HERE -registrationId PASTE_YOUR_REGISTRATION_ID_HERE -symmKey PASTE_YOUR_PRIMARY_KEY_OR_DERIVED_KEY_HERE
```

# [Windows Admin Center](#tab/windowsadmincenter)

For Windows Admin Center, use the following steps:

1. On the **Azure IoT Edge device provisioning** pane, select **Symmetric Key (DPS)** from the provisioning method dropdown.

1. In the [Azure portal](https://ms.portal.azure.com/), navigate to your DPS instance.

1. Provide your DPS scope ID, device registration ID, and enrollment primary key or derived key in the Windows Admin Center fields.

1. Choose **Provisioning with the selected method**.

   ![Choose provisioning with the selected method after filling in the required fields for symmetric key provisioning, PNG.](./media/how-to-provision-devices-at-scale-linux-on-windows-symmetric/provisioning-with-selected-method-symmetric-key.png)

1. Once the provisioning is complete, select **Finish**. You will be taken back to the main dashboard. Now, you should see a new device listed, whose type is `IoT Edge Devices`. You can select the IoT Edge device to connect to it. Once on its **Overview** page, you can view the **IoT Edge Module List** and **IoT Edge Status** of your device.

---

## Verify successful configuration

Verify that IoT Edge for Linux on Windows was successfully installed and configured on your IoT Edge device.

# [Individual enrollment](#tab/individual-enrollment)

You can verify that the individual enrollment that you created in Device Provisioning Service was used. Navigate to your Device Provisioning Service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.

# [Group enrollment](#tab/group-enrollment)

You can verify that the group enrollment that you created in Device Provisioning Service was used. Navigate to your Device Provisioning Service instance in the Azure portal. Open the enrollment details for the group enrollment that you created. Go to the **Registration Records** tab to view all devices registered in that group.

---

# [PowerShell](#tab/powershell)

1. Log in to your IoT Edge for Linux on Windows virtual machine using the following command in your PowerShell session:

   ```powershell
   Connect-EflowVm
   ```

   >[!NOTE]
   >The only account allowed to SSH to the virtual machine is the user that created it.

1. Once you are logged in, you can check the list of running IoT Edge modules using the following Linux command:

   ```bash
   sudo iotedge list
   ```

1. If you need to troubleshoot the IoT Edge service, use the following Linux commands.

    1. Retrieve the service logs.

       ```bash
       sudo journalctl -u iotedge
       ```

    2. Use the `check` tool to verify configuration and connection status of the device.

       ```bash
       sudo iotedge check
       ```

# [Windows Admin Center](#tab/windowsadmincenter)

1. Select your IoT Edge device from the list of connected devices in Windows Admin Center to connect to it.

1. The device overview page displays some information about the device:

   * The **IoT Edge Module List** section shows running modules on the device. When the IoT Edge service starts for the first time, you should only see the **edgeAgent** module running. The edgeAgent module runs by default and helps to install and start any additional modules that you deploy to your device.

   * The **IoT Edge Status** section shows the service status, and should be reporting **active (running)**.

---

When you create a new IoT Edge device, it will display the status code `417 -- The device's deployment configuration is not set` in the Azure portal. This status is normal, and means that the device is ready to receive a module deployment.

## Next steps

The Device Provisioning Service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices using automatic device management. Learn how to [Deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-at-scale.md) or [using Azure CLI](how-to-deploy-cli-at-scale.md).

You can also:

* Continue to [deploy IoT Edge modules](how-to-deploy-modules-portal.md) to learn how to deploy modules onto your device.
* Learn how to [manage certificates on your IoT Edge for Linux on Windows virtual machine](how-to-manage-device-certificates.md) and transfer files from the host OS to your Linux virtual machine.
* Learn how to [configure your IoT Edge devices to communicate through a proxy server](how-to-configure-proxy-support.md).
