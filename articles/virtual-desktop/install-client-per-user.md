---
title: Install Per-User Azure Virtual Desktop Remote Desktop client Intune Configuration Manager - Azure
description: How to install the Azure Virtual Desktop client on a per-user basis with InTune or Configuration Manager.
author: Heidilohr
ms.topic: how-to
ms.date: 03/22/2023
ms.author: helohr
manager: femila
---
# Install the Remote Desktop client on a per-user basis

You can install the Remote Desktop client on either a per-system or per-user basis. Installing it on a per-system basis installs the client on the virtual machines of all users by default, and updates are controlled by the admin. Per-user installation gives users the choice of whether they want to install the client themselves and also gives them control over when to apply updates.

Per-system is the default way to install the client. However, if you're deploying Azure Virtual Desktop with Intune or Configuration Manager, using the per-system method can cause the Remote Desktop client auto-update feature to stop working. In these cases, you'll need to use the per-user method instead.

## Prerequisites

In order to install the Remote Desktop client on a per-user basis, you'll need the following things:

- An Azure Virtual Desktop deployment
- Your machine must be joined to an Azure Active Directory deployment

## Install the Remote Desktop client

To install the client on a per-user basis:

#### InTune (#tabs/intune)

1. Create a new folder containing the Remote Desktop client and an install.bat batch file with the following content:

```batch
cd "%~dp0"

msiexec /i RemoteDesktop_x64.msi /qn ALLUSERS=2 MSIINSTALLPERUSER=1
```
<!--create the folder where?--->

>[!NOTE]
>The RemoteDesktop_x64.msi installer name must match the MSI contained in the folder.  

1. Follow the directions in [Prepare Win32 app content for upload](/mem/intune/apps/apps-win32-prepare) to convert the folder into an .itunewin file.

1. Open the **Microsoft Intune admin center**, then go to **Apps** > **All apps** and select **Add**. 

1. For the app type, select **Windows app (Win32)**.

1. Upload your .intunewin file, then fill out the required app information fields.

1. In the Program tab, select the install.bat file as the installer, and use the MSI product code for the Uninstall command.

1. Toggle the **Install behavior** to **User**.

<!---image--->

1. In the **Detection rules** tab, enter the MSI product code.

1. Follow the rest of the prompts until you complete the workflow.

1. Follow the instructions in [Assign apps to groups with Microsoft Intune](/mem/intune/apps/apps-deploy) to deploy the client app to your users.

#### Configuration Manager (#tabs/configmanager)

1. Create a new folder in your package share.

1. In this new folder, add the Remote Desktop client application and an install.bat batch file with the following content:

```batch
msiexec /i RemoteDesktop_x64.msi /qn ALLUSERS=2 MSIINSTALLPERUSER=1 
```

>[!NOTE]
>The RemoteDesktop_x64.msi installer name must match the MSI contained in the folder.

1. Open the **Configuration Manager** and go to **Software Library** > **Application Management** > **Applications**.

2. Follow the directions in [Manually specify application information](/mem/configmgr/apps/deploy-use/create-applications#bkmk_manual-app) to create a new application with manually specified information.

<!--image-->

1. Enter the variables that apply to your organization into the **General Information** and **Software Center settings** fields.  

1. In the Deployment Types tab, select the **Add** button.  

1. Select **Script Installer** as the deployment type, then select **Next**.

1. Enter the location of the folder you created in step 1 for the **Content location** field.

1. Enter the path of the install.bat file in the **Installation program** field.

1. Enter the MSI product ID into the **Uninstall program** field.

<!--image-->

1. Next, enter the same MSI product ID you used in the previous step into the **Detection program** field.

<!--image-->

1. For User Experience, toggle the installation behavior to **Install for user**.

1. Follow the rest of the prompts until you've finished the workflow.

1. Once you're finished, follow the instructions in [Deploy applications with Configuration Manager](/mem/configmgr/apps/deploy-use/deploy-applications) to deploy the client app to your users.

---

## Next steps

- To learn how to install the client on a per-system basis, see [Connect to Azure Virtual Desktop with the Remote Desktop client for Windows](connect-windows.md).
- Learn more about the Remote Desktop client at [Use features of the Remote Desktop client for Windows](client-features-windows.md).
