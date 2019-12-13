---
title: Configure Windows Update settings to work with Azure Update Management
description: This article describes the Windows Update settings that you configure to work with Azure Update Management.
services: automation
ms.subservice: update-management
ms.date: 10/02/2019
ms.topic: conceptual
---
# Configure Windows Update settings for Update Management

Azure Update Management relies on Windows Update to download and install Windows updates. As a result, Update Management respects many of the settings used by Windows Update. If you use settings to enable non-Windows updates, Update Management will also manage those updates. If you want to enable downloading of updates before an update deployment occurs, update deployment can be faster, more efficient, and less likely to exceed the maintenance window.

## Pre-download updates

To configure automatic downloading of updates in Group Policy, set the [Configure Automatic Updates setting](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates##configure-automatic-updates) to **3**. This setting enables downloads of the required updates in the background, but it doesn't install them. In this way, Update Management remains in control of schedules, but updates can be downloaded outside the Update Management maintenance window. This behavior prevents "Maintenance window exceeded" errors in Update Management.

You can also turn on this setting by running the following PowerShell command on a system that you want to configure for auto-downloading of updates:

```powershell
$WUSettings = (New-Object -com "Microsoft.Update.AutoUpdate").Settings
$WUSettings.NotificationLevel = 3
$WUSettings.Save()
```

## Disable automatic installation

By default on Azure virtual machines (VMs), automatic installation of updates is enabled. This might cause updates to be installed before you schedule them for installation by Update Management. You can disable this behavior by setting the `NoAutoUpdate` registry key to `1`. The following PowerShell snippet shows how to do this:

```powershell
$AutoUpdatePath = "HKLM:SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU"
Set-ItemProperty -Path $AutoUpdatePath -Name NoAutoUpdate -Value 1
```

## Configure reboot settings

The registry keys listed in [Configuring Automatic Updates by editing the registry](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry) and [Registry keys used to manage restart](/windows/deployment/update/waas-restart#registry-keys-used-to-manage-restart) can cause your machines to reboot, even if you specify **Never Reboot** in the **Update Deployment** settings. You should configure these registry keys to best suit your environment.

## Enable updates for other Microsoft products

By default, Windows Update provides updates only for Windows. If you enable the **Give me updates for other Microsoft products when I update Windows** setting, you also receive updates for other products, including security patches for Microsoft SQL Server and other Microsoft software. This option can't be configured by Group Policy. Run the following PowerShell command on the systems that you want to enable other Microsoft updates on. Update Management will comply with this setting.

```powershell
$ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
$ServiceManager.Services
$ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
$ServiceManager.AddService2($ServiceId,7,"")
```

## WSUS configuration settings

Update Management complies with Windows Server Update Services (WSUS) settings. The WSUS settings you can configure for working with Update Management are listed below.

### Intranet Microsoft update service location

You can specify sources for scanning and downloading updates under [Specify intranet Microsoft Update service location](/windows/deployment/update/waas-wu-settings#specify-intranet-microsoft-update-service-location).

## Next steps

After you configure Windows Update settings, you can schedule an update deployment by following the instructions in [Manage updates and patches for your Azure VMs](automation-tutorial-update-management.md).
