---
title: Install the Remote Desktop client for Windows on a per-user basis with Intune or Configuration Manager - Azure
description: How to install the Azure Virtual Desktop client on a per-user basis with Intune or Configuration Manager.
author: dknappettmsft
ms.topic: how-to
ms.date: 01/23/2024
ms.author: daknappe
---

# Install the Remote Desktop client for Windows on a per-user basis with Intune or Configuration Manager

You can install the [Remote Desktop client for Windows](./users/connect-windows.md) on either a per-system or per-user basis. Installing it on a per-system basis installs the client on the machines for all users by default, and administrators control updates. Per-user installation installs the application to a subfolder within the local AppData folder of each user's profile, enabling users to install updates without needing administrative rights.

When you install the client using `msiexec.exe`, per-system is the default method of client installation. You can use the parameters `ALLUSERS=2 MSIINSTALLPERUSER=1` with `msiexec` to install the client per-user, however if you're deploying the client with Intune or Configuration Manager, using `msiexec` directly to install the client causes it to be installed per-system, regardless of the parameters used. Wrapping the `msiexec` command in a PowerShell script enables the client to be successfully installed per-user.

## Prerequisites

In order to install the Remote Desktop client for Windows on a per-user basis with Intune or Configuration Manager, you need the following things:

- Download the latest version of [the Remote Desktop client for Windows](./users/connect-windows.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json).

- Supported Windows devices managed by Microsoft Intune or Configuration Manager with permission to add applications.

- For Intune, you need a local Windows device to use the [Microsoft Win32 Content Prep Tool](https://github.com/Microsoft/Microsoft-Win32-Content-Prep-Tool).

## Install the Remote Desktop client per-user using a PowerShell script

To install the client on a per-user basis using a PowerShell script, select the relevant tab for your scenario and follow the steps.

#### [Intune](#tab/intune)

Here's how to install the client on a per-user basis using a PowerShell script with Intune as a **Windows app (Win32)**.

1. Create a new folder on your local Windows device and add the Remote Desktop client `.msi` file you downloaded.

1. Within that folder, create a PowerShell script file called `Install.ps1` and add the following content, replacing `<RemoteDesktop>` with the filename of the `.msi` file you downloaded:

   ```powershell
   msiexec /i <RemoteDesktop>.msi /qn ALLUSERS=2 MSIINSTALLPERUSER=1
   ```

1. In the same folder, create a PowerShell script file called `Uninstall.ps1` and add the following content:

   ```powershell
   $productCode = (Get-WmiObject -Class Win32_Product | Where-Object {$_.Name -eq 'Remote Desktop' -and $_.Vendor -eq 'Microsoft Corporation'}).IdentifyingNumber

   msiexec /x $productCode /qn
   ```

1. In the same folder, create a PowerShell script file called `Detection.ps1` and add the following content:

   ```powershell
   If (([string](Get-ChildItem Registry::HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall | Where-Object {$_.GetValue('DisplayName') -eq 'Remote Desktop'})) -and (Get-WmiObject -Class Win32_Product | Where-Object {$_.Name -eq 'Remote Desktop' -and $_.Vendor -eq 'Microsoft Corporation'})) {
       Write-Host "Microsoft Remote Desktop client is installed"
       exit 0
   } else {
       Write-Host "Microsoft Remote Desktop client isn't installed"
       exit 1
   }
   ```

1. Follow the steps in [Prepare Win32 app content for upload](/mem/intune/apps/apps-win32-prepare) to package the contents of the folder into an `.intunewin` file.

1. Follow the steps in [Add, assign, and monitor a Win32 app in Microsoft Intune](/mem/intune/apps/apps-win32-add) to add the Remote Desktop client. Here's some of the information you need to specify during the process. You can leave the rest of the settings as default or update them as needed.

   | Parameter | Value/Description |
   |--|--|
   | Name | Enter `Remote Desktop`. |
   | Publisher | Enter `Microsoft Corporation`. |
   | Install command | `powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File .\Install.ps1` |
   | Uninstall command | `powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File .\Uninstall.ps1` |
   | Install behavior | Select **User**. |
   | Operating system architecture | Select **64-bit** or **32-bit**, depending on the version of the Remote Desktop client you downloaded. |
   | Minimum operating system | Select the minimum version of Windows in your environment and that is [in support](/lifecycle/products/). |
   | Detection rules format | Select **Use a custom detection script**. |
   | Detection script file | Select the file `Detection.ps1` you created earlier. |

#### [Configuration Manager](#tab/configmgr)

Here's how to install the client on a per-user basis using a PowerShell script with Configuration Manager as a **Script Installer**.

1. Create a new folder in your content location share for Configuration Manager and add the Remote Desktop client `.msi` file you downloaded.

1. Within that folder, create a PowerShell script file called `Install.ps1` and add the following content, replacing `<RemoteDesktop>` with the filename of the `.msi` file you downloaded:

   ```powershell
   msiexec /i <RemoteDesktop>.msi /qn ALLUSERS=2 MSIINSTALLPERUSER=1
   ```

1. In the same folder, create a PowerShell script file called `Uninstall.ps1` and add the following content:

   ```powershell
   $productCode = (Get-WmiObject -Class Win32_Product | Where-Object {$_.Name -eq 'Remote Desktop' -and $_.Vendor -eq 'Microsoft Corporation'}).IdentifyingNumber

   msiexec /x $productCode /qn
   ```

1. In the same folder, create a PowerShell script file called `Detection.ps1` and add the following content:

   ```powershell
   If (([string](Get-ChildItem Registry::HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall | Where-Object {$_.GetValue('DisplayName') -eq 'Remote Desktop'})) -and (Get-WmiObject -Class Win32_Product | Where-Object {$_.Name -eq 'Remote Desktop' -and $_.Vendor -eq 'Microsoft Corporation'})) {
       Write-Host "Microsoft Remote Desktop client is installed"
       exit 0
   } else {
       Write-Host "Microsoft Remote Desktop client isn't installed"
       exit 1
   }
   ```

1. Follow the steps in [Create applications in Configuration Manager](/mem/configmgr/apps/deploy-use/create-applications), selecting to [manually specify application information](/mem/configmgr/apps/deploy-use/create-applications#bkmk_manual-app) to add the Remote Desktop client. Here's some of the information you need to specify during the process. You can leave the rest of the settings as default or update them as needed.

   | Parameter | Value/Description |
   |--|--|
   | Deployment type | Select **Script Installer**. |
   | Content location | Enter the UNC path to the new folder you created. |
   | Installation program | `powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File .\Install.ps1` |
   | Uninstall program | `powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File .\Uninstall.ps1` |
   | Detection method | Select **Use a custom script to detect the presence of this deployment type**. |
   | Detection script editor | Select **PowerShell**. |
   | Detection script file | Select the file `Detection.ps1` you created earlier. |
   | Installation behavior | Select **Install for user**. |

1. Follow the steps in [Deploy applications with Configuration Manager](/mem/configmgr/apps/deploy-use/deploy-applications) to deploy the Remote Desktop client to your users.

---

## Next steps

Learn more about the Remote Desktop client at [Use features of the Remote Desktop client for Windows](./users/client-features-windows.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json).
