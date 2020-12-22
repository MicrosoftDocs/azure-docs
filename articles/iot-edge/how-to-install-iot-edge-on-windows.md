---
title: Install Azure IoT Edge on Windows | Microsoft Docs
description: Azure IoT Edge installation instructions on Windows devices
author: kgremban
manager: philmea
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 12/03/2020
ms.author: v-tcassi
---

# Install and provision Azure IoT Edge for Linux on a Windows device

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices from PC class to industrial servers. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud. To learn more, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

Azure IoT Edge for Linux on Windows allows you to use Azure IoT Edge on Windows devices through the use of Linux virtual machines. The Linux version of Azure IoT Edge and any Linux modules deployed with it run on the virtual machine. From there, Windows applications and code and the IoT Edge runtime and modules can freely interact with each other.

This article lists the steps to set up IoT Edge on a Windows device. These steps deploy a Linux virtual machine that contains the IoT Edge runtime to run on your Windows device, then provision the device with its IoT Hub device identity.

## Prerequisites

* An Azure account with a valid subscription. If you don't have an [Azure subscription](../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/) before you begin.
* A free or standard tier [IoT Hub](../iot-hub/iot-hub-create-through-portal.md) in Azure.
* An [Azure IoT Edge device ID](how-to-manual-provision-symmetric-key.md#create-an-iot-edge-device-in-the-azure-portal).
* Access to Windows Admin Center insider build with the Azure IoT Edge extension for Windows Admin Center installed:
   <!-- The link below needs the language localization to work; otherwise broken -->
   1. Visit the [Windows Insider Preview](https://www.microsoft.com/en-us/software-download/windowsinsiderpreviewserver).

   1. In the previews dropdown, select **Windows Admin Center Preview - Build 2012**, and choose **Confirm**.

      ![Choose the Windows Admin Center Preview - Build 2012 from the dropdown menu of available previews.](./media/how-to-install-iot-edge-on-windows/select-windows-admin-center-preview-build.png)

   1. In the **Select Language** dropdown, choose **English**, and choose **Confirm**.

   1. Choose **Download Now** to download the *WindowsAdminCenterPreview2012.msi*.

   1. Run the *WindowsAdminCenterPreview2012.msi* and follow the install wizard prompts to install Windows Admin Center. Once installed, open Windows Admin Center.

   1. On the first use of Windows Admin Center, you will be prompted to select a certificate to use. Select **Windows Admin Center Client** as your certificate.

   1. It is time to install the Azure IoT Edge extension. Select the gear icon in the top right of the Windows Admin Center dashboard.

      ![Select the gear icon in the top right of the dashboard to access the settings.](./media/how-to-install-iot-edge-on-windows/select-gear-icon.png)

   1. On the **Settings** pane that opens on the left, under **Gateway**, select **Extensions**.

   1. On the **Available extensions** tab, find **Azure IoT Edge** in the list of extensions. Choose it, and select the **Install** prompt above the list of extensions.

   1. After the installation completes, you should see in the list of installed extensions on the **Installed extensions** tab.

Minimum system requirements:

* Windows 10 Version 1809 or later; build 17763 or later
* Professional, Enterprise, or Server editions
* Minimum RAM: 4 GB
* Minimum Storage: 10 GB

## Create a new deployment

Create your deployment of Azure IoT Edge for Linux on Windows on your target device.

# [Windows Admin Center](#tab/windowsadmincenter)

On the Windows Admin Center start page, under the list of connections, you will see a local host connection representing the PC where you running Windows Admin Center. You can use Windows Admin Center to make deployments of Azure IoT Edge for Linux on Windows to both your local device and remote devices. In this guide, the local host connection will serve as the target device for the deployment of Azure IoT Edge for Linux on Windows. If you want to deploy to a remote target device instead of your local device and you do not see your desired target device in the list, follow the [instructions to add your device.](https://docs.microsoft.com/windows-server/manage/windows-admin-center/use/get-started#connecting-to-managed-nodes-and-clusters).

   ![Initial Windows Admin Center dashboard with target device listed](./media/how-to-install-iot-edge-on-windows/windows-admin-center-initial-dashboard.png)

1. Select **Add**.

1. On the **Add or create resources** pane, locate the **Azure IoT Edge** tile. The **Add** feature allows you to connect to an existing deployment of Azure IoT Edge for Linux on Windows that is not yet connected to Windows Admin Center. **Create new** allows you to create a new deployment of Azure IoT Edge for Linux on Windows on your target device. This guide creates a deployment to a new device. Select **Create new**.

   ![Select Create New on Azure IoT Edge tile in Windows Admin Center](./media/how-to-install-iot-edge-on-windows/resource-creation-tiles.png)

1. The **Create an Azure IoT Edge for Linux on Windows deployment** pane will open. On the **1. Getting Started** tab, verify that your target device meets the minimum requirements, and select **Next**.

1. Review the license terms, check **I Accept**, and select **Next**.

1. You can toggle **Optional diagnostic data** on or off, depending on your preference.

1. Select **Next: Deploy**.

   ![Select the Next: Deploy button after toggling optional diagnostic data to your preference](./media/how-to-install-iot-edge-on-windows/select-next-deploy.png)

1. On the **2. Deploy** tab, under **Select a target device**, click on your listed device to validate it meets the minimum requirements. Once its status is confirmed as supported, select **Next**.

   ![Select your device to verify it is supported](./media/how-to-install-iot-edge-on-windows/evaluate-supported-device.png)

1. Accept the default settings on the **2.2 Settings** tab.

1. On the **2.3 Deployment** tab, you can watch the progress of the deployment. The full process includes downloading the Azure IoT Edge for Linux on Windows package, installing the package, configuring the host device, and setting up the Linux virtual machine. This process may take several minutes to complete. A successful deployment is pictured below.

   ![A successful deployment will show each step with a green check mark and a 'Complete' label](./media/how-to-install-iot-edge-on-windows/successful-deployment.png)

Once your deployment is complete, you are ready to provision your device. Select **Next: Connect** to proceed to the **3. Connect** tab, which handles Azure IoT Edge device provisioning.

# [PowerShell](#tab/powershell)

Install IoT Edge for Linux on Windows onto your target device if you have not already.

> [!NOTE]
> The following PowerShell process outlines how to create a local host deployment of Azure IoT Edge for Linux on Windows. To create a deployment to a remote target device using PowerShell, you can use [Remote PowerShell](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_remote) to establish a connection to a remote device and run these commands remotely on that device.

1. In an elevated PowerShell session, run each of the following commands to download IoT Edge for Linux on Windows.

   ```azurepowershell-interactive
   $msiPath = $([io.Path]::Combine($env:TEMP, 'AzureIoTEdge.msi'))
   $ProgressPreference = 'SilentlyContinue'
   ​Invoke-WebRequest "https://aka.ms/AzureEdgeForLinuxOnWindowsMSI" -OutFile $msiPath
   ```

1. Install IoT Edge for Linux on Windows on your device.

   ```azurepowershell-interactive
   Start-Process -Wait msiexec -ArgumentList "/i","$([io.Path]::Combine($env:TEMP, 'AzureIoTEdge.msi'))","/qn"
   ```

1. Create the IoT Edge for Linux on Windows deployment.

   ```azurepowershell-interactive
   Deploy-Eflow
   ```

   <!-- Most likely temporary until cmdlet is fully documented -->
   > [!NOTE]
   > You can run this command without parameters or optionally customize deployment with parameters. Inspect the PowerShell module AzureEFLOW.psm1 to see the parameters and their meaning (see under C:\Program Files\WindowsPowerShell\Modules\AzureEFLOW)​.

1. Enter 'Y' to accept the license terms.

1. Enter 'O' or 'R' to toggle **Optional diagnostic data** on or off, depending on your preference. A successful deployment is pictured below.

   ![A successful deployment will say 'Deployment successful' at the end of the messages](./media/how-to-install-iot-edge-on-windows/successful-powershell-deployment.png)

Once your deployment is complete, you are ready to provision your device.

---

To provision your device, you have three options:

* [Manual provisioning using your IoT Edge device's connection string](how-to-install-iot-edge-on-windows.md#provisioning-manually-using-the-connection-string)
* [Automatic provisioning using Device Provisioning Service (DPS) and symmetric keys](how-to-install-iot-edge-on-windows.md#provisioning-via-dps-using-symmetric-keys)
* [Automatic provisioning using DPS and X.509 certificates](how-to-install-iot-edge-on-windows.md#provisioning-via-dps-using-x509-certificates)

<!-- Update flow with restructuring of register, install, authenticate articles  -->
## Provision your device

Choose a method for provisioning your device and follow the instructions in the appropriate section. You can use the Windows Admin Center or an elevated PowerShell session to provision your devices.

### Provisioning manually using the connection string

This section covers provisioning your device manually using your Azure IoT Edge device's connection string.

# [Windows Admin Center](#tab/windowsadmincenter)

1. On the **Azure IoT Edge device provisioning** pane, select **Connection String (Manual)** from the provisioning method dropdown.

1. In the [Azure portal](https://ms.portal.azure.com/), navigate to the **IoT Edge** tab of your IoT Hub.

1. Click on the device ID of your device. Copy the **Primary Connection String** field.

1. Paste it into the device connection string field in the Windows Admin Center. Then, choose **Provisioning with the selected method**.

   ![Choose provisioning with the selected method after pasting your device's connection string](./media/how-to-install-iot-edge-on-windows/provisioning-with-selected-method-connection-string.png)

1. Once the provisioning is complete, select **Finish**. You will be taken back to the main dashboard. Now, you should see a new device listed, whose type is `IoT Edge Devices`. You can select the IoT Edge device to connect to it. Once on its **Overview** page, you can view the **IoT Edge Module List** and **IoT Edge Status** of your device.

# [PowerShell](#tab/powershell)

1. In the [Azure portal](https://ms.portal.azure.com/), navigate to the **IoT Edge** tab of your IoT Hub.

1. Click on the device ID of your device. Copy the **Primary Connection String** field.

1. Paste over the placeholder text in the following command and run it in an elevated PowerShell session.

   ```azurepowershell-interactive
   Provision-EflowVm -provisioningType manual -devConnString "<CONNECTION_STRING_HERE>"​
   ```

---

### Provisioning via DPS using symmetric keys

This section covers provisioning your device automatically using DPS and symmetric keys. To continue with these steps, follow the [instructions on how to use DPS and symmetric keys to automatically provision an IoT Edge device](how-to-auto-provision-symmetric-keys.md) to create an instance of DPS, link your DPS instance to your IoT Hub, and create a DPS enrollment. You can create an *individual enrollment* for a single device or a *group enrollment* for a group of devices. For more information about the enrollment types, visit the [Azure IoT Hub Device Provisioning Service concepts](https://docs.microsoft.com/azure/iot-dps/concepts-service#enrollment).

Once you complete these steps, return here.

# [Windows Admin Center](#tab/windowsadmincenter)

1. On the **Azure IoT Edge device provisioning** pane, select **Symmetric Key (DPS)** from the provisioning method dropdown.

1. In the [Azure portal](https://ms.portal.azure.com/), navigate to your DPS instance.

1. On the **Overview** tab, copy the **ID Scope** value. Paste it into the scope ID field in the Windows Admin Center.

1. On the **Manage enrollments** tab in the Azure portal, switch to the **Individual Enrollments** tab. Copy the registration ID of the enrollment you created. Paste it into the registration ID field in the Windows Admin Center.

1. On the **Manage enrollments** tab in the Azure portal, select the enrollment you created. Copy the **Primary Key** value in the enrollment details. Paste it into the symmetric key field in the Windows Admin Center.

1. Choose **Provisioning with the selected method**.

   ![Choose provisioning with the selected method after filling in the required fields for symmetric key provisioning](./media/how-to-install-iot-edge-on-windows/provisioning-with-selected-method-symmetric-key.png)

1. Once the provisioning is complete, select **Finish**. You will be taken back to the main dashboard. Now, you should see a new device listed, whose type is `IoT Edge Devices`. You can select the IoT Edge device to connect to it. Once on its **Overview** page, you can view the **IoT Edge Module List** and **IoT Edge Status** of your device.

# [PowerShell](#tab/powershell)

1. Copy the following command into a text editor. Replace the placeholder text with your information as detailed.

   ```azurepowershell-interactive
   Provision-EflowVm -provisioningType symmetric -​scopeId <ID_SCOPE_HERE> -registrationId <REGISTRATION_ID_HERE> -symmKey <PRIMARY_KEY_HERE>
   ```

1. In the [Azure portal](https://ms.portal.azure.com/), navigate to your DPS instance.

1. On the **Overview** tab, copy the **ID Scope** value. Paste it over the appropriate placeholder text in the command.

1. On the **Manage enrollments** tab in the Azure portal, switch to the **Individual Enrollments** tab. Copy the registration ID of the enrollment you created. Paste it over the appropriate placeholder text in the command.

1. On the **Manage enrollments** tab in the Azure portal, select the enrollment you created. Copy the **Primary Key** value in the enrollment details. Paste it over the appropriate placeholder text in the command.

1. Run the command in an elevated PowerShell session.

---

### Provisioning via DPS using X.509 certificates

This section covers provisioning your device automatically using DPS and X.509 certificates. To continue with these steps, follow the [instructions on how to use DPS and X.509 certificates to automatically provision an IoT Edge device](how-to-auto-provision-x509-certs.md) to create test certificates if necessary, create an instance of DPS, link your DPS instance to your IoT Hub, and create a DPS enrollment. You can create an *individual enrollment* for a single device or a *group enrollment* for a group of devices. For more information about the enrollment types, visit the [Azure IoT Hub Device Provisioning Service concepts](https://docs.microsoft.com/azure/iot-dps/concepts-service#enrollment).

Once you complete these steps, return here.

# [Windows Admin Center](#tab/windowsadmincenter)

1. On the **Azure IoT Edge device provisioning** pane, select **X.509 Certificate (DPS)** from the provisioning method dropdown.

1. In the [Azure portal](https://ms.portal.azure.com/), navigate to your DPS instance.

1. On the **Overview** tab, copy the **ID Scope** value. Paste it into the scope ID field in the Windows Admin Center.

1. On the **Manage enrollments** tab in the Azure portal, switch to the **Individual Enrollments** tab. Copy the registration ID of the enrollment you created. Paste it into the registration ID field in the Windows Admin Center.

1. Upload your certificate and private key files.

1. Choose **Provisioning with the selected method**.

   ![Choose provisioning with the selected method after filling in the required fields for X.509 certificate provisioning](./media/how-to-install-iot-edge-on-windows/provisioning-with-selected-method-x509-certs.png)

1. Once the provisioning is complete, select **Finish**. You will be taken back to the main dashboard. Now, you should see a new device listed, whose type is `IoT Edge Devices`. You can select the IoT Edge device to connect to it. Once on its **Overview** page, you can view the **IoT Edge Module List** and **IoT Edge Status** of your device.

# [PowerShell](#tab/powershell)

1. Copy the following command into a text editor. Replace the placeholder text with your information as detailed.

   ```azurepowershell-interactive
   Provision-EflowVm -provisioningType x509 -​scopeId <ID_SCOPE_HERE> -registrationId <REGISTRATION_ID_HERE> -identityCertLocWin <ABSOLUTE_CERT_SOURCE_PATH_ON_WINDOWS_MACHINE> -identityPkLocWin <ABSOLUTE_PRIVATE_KEY_SOURCE_PATH_ON_WINDOWS_MACHINE>
   ```

1. In the [Azure portal](https://ms.portal.azure.com/), navigate to your DPS instance.

1. On the **Overview** tab, copy the **ID Scope** value. Paste it over the appropriate placeholder text in the command.

1. On the **Manage enrollments** tab in the Azure portal, switch to the **Individual Enrollments** tab. Copy the registration ID of the enrollment you created. Paste it over the appropriate placeholder text in the command.

1. Replace the appropriate placeholder text with the absolute source path to your certificate file.

1. Replace the appropriate placeholder text with the absolute source path to your private key file.

1. Run the command in an elevated PowerShell session.

---

## Next steps

Continue to [deploy IoT Edge modules](how-to-deploy-modules-portal.md) to learn how to deploy modules onto your device.
