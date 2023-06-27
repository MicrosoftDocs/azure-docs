---
title: Install the Remote Desktop client for Windows on a per-user basis with Intune or Configuration Manager - Azure
description: How to install the Azure Virtual Desktop client on a per-user basis with Intune or Configuration Manager.
author: Heidilohr
ms.topic: how-to
ms.date: 06/09/2023
ms.author: helohr
manager: femila
---
# Install the Remote Desktop client for Windows on a per-user basis with Intune or Configuration Manager

You can install the Remote Desktop client on either a per-system or per-user basis. Installing it on a per-system basis installs the client on the machines for all users by default, and updates are controlled by the admin. Per-user installation installs the application into each user's profile, giving them control over when to apply updates.

Per-system is the default way to install the client. However, if you're deploying the Remote Desktop client with Intune or Configuration Manager, using the per-system method can cause the Remote Desktop client auto-update feature to stop working. In these cases, you must use the per-user method instead.

## Prerequisites

In order to install the Remote Desktop client for Windows on a per-user basis with Intune or Configuration Manager, you need the following things:

- An Azure Virtual Desktop or Windows 365 deployment.
- Download the latest version of [the Remote Desktop client](./users/connect-windows.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json).
- Microsoft Intune, Configuration Manager or other enterprise software distribution product.

## Install the Remote Desktop client using a batch file

To install the client on a per-user basis using a batch file:

#### [Intune](#tab/intune)

1. Create a new folder containing the Remote Desktop client MSI file.

1. Within that folder, create an `install.bat` batch file with the following content:

   ```batch
   cd "%~dp0"
  
   msiexec /i RemoteDesktop_x64.msi /qn ALLUSERS=2 MSIINSTALLPERUSER=1
   ```

   >[!NOTE]
   >The RemoteDesktop_x64.msi installer name must match the MSI contained in the folder.  

1. Follow the directions in [Prepare Win32 app content for upload](/mem/intune/apps/apps-win32-prepare) to convert the folder into an `.intunewin` file.

1. Open the **Microsoft Intune admin center**, then go to **Apps** > **All apps** and select **Add**. 

1. For the app type, select **Windows app (Win32)**.

1. Upload your `.intunewin` file, then fill out the required app information fields.

1. In the **Program** tab, select the install.bat file as the installer, then for the uninstall command use `msiexec /x (6CE4170F-A4CD-47A0-ABFD-61C59E5F4B43)`, as shown in the following screenshot.
   
    :::image type="content" source="./media/install-client-per-user/uninstall-command.png" alt-text="A screenshot of the Program tab. The product code in the Uninstall command field is msiexec /x (6CE4170F-A4CD-47A0-ABFD-61C59E5F4B43)." lightbox="./media/install-client-per-user/uninstall-command.png" :::

1. Toggle the **Install behavior** to **User**.

1. In the **Detection rules** tab, enter the same MSI product code you used for the uninstall command.

1.  Follow the rest of the prompts until you complete the workflow.

1. Follow the instructions in [Assign apps to groups with Microsoft Intune](/mem/intune/apps/apps-deploy) to deploy the client app to your users.

#### [Configuration Manager](#tab/configmanager)

1. Create a new folder in your package share.

1. In this new folder, add the Remote Desktop client MSI file and an `install.bat` batch file with the following content:

   ```batch
   msiexec /i RemoteDesktop_x64.msi /qn ALLUSERS=2 MSIINSTALLPERUSER=1 
   ```

   >[!NOTE]
   >The RemoteDesktop_x64.msi installer name must match the MSI contained in the folder.

1. Open the **Configuration Manager** and go to **Software Library** > **Application Management** > **Applications**.

1. Follow the directions in [Manually specify application information](/mem/configmgr/apps/deploy-use/create-applications#bkmk_manual-app) to create a new application with manually specified information.

1. Enter the variables that apply to your organization into the **General Information** and **Software Center settings** fields.  

1. In the Deployment Types tab, select the **Add** button.  

1. Select **Script Installer** as the deployment type, then select **Next**.

1. Enter the location of the folder you created in step 1 for the **Content location** field.

1. Enter the path of the install.bat file in the **Installation program** field.

1. For the **Uninstall program** field, enter `msiexec /x (6CE4170F-A4CD-47A0-ABFD-61C59E5F4B43)`. 

    :::image type="content" source="./media/install-client-per-user/content-location-uninstall-id.png" alt-text="A screenshot of the Specify information about the content to be delivered to target devices window. The command msiexec /x (6CE4170F-A4CD-47A0-ABFD-61C59E5F4B43) is entered into the Uninstall program field ." lightbox="./media/install-client-per-user/content-location-uninstall-id.png" :::

1. Next, enter the same MSI product ID you used for the uninstall command into the **Detection program** field.

    :::image type="content" source="./media/install-client-per-user/msi-product-code.png" alt-text="A screenshot of the Specify how this deployment type is detected window. In the rules box, the clause lists the product ID msiexec /x (6CE4170F-A4CD-47A0-ABFD-61C59E5F4B43)." lightbox="./media/install-client-per-user/msi-product-code.png" :::

1. For User Experience, toggle the installation behavior to **Install for user**.

1. Follow the rest of the prompts until you've finished the workflow.

1. Once you're finished, follow the instructions in [Deploy applications with Configuration Manager](/mem/configmgr/apps/deploy-use/deploy-applications) to deploy the client app to your users.

---

## Next steps

Learn more about the Remote Desktop client at [Use features of the Remote Desktop client for Windows](./users/client-features-windows.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json).
