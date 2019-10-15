---
title: Configure Windows Update settings to work with Azure Update Management
description: This article describes the Windows Update settings that you configure to work with Update Management
services: automation
ms.service: automation
ms.subservice: update-management
author: bobbytreed
ms.author: robreed
ms.date: 10/02/2019
ms.topic: conceptual
manager: carmonm
---
# Configure Windows Update settings for Update Management

Update Management relies on Windows Update to download and install Windows Updates. As a result, we respect many of the settings used by Windows Update. If you use settings to enable non-Windows updates, Update Management will manage those updates as well. If you want to enable downloading updates before an update deployment occurs, update deployments can go faster and be less likely to exceed the maintenance window.

## Pre download updates

To configure automatically downloading updates in Group Policy, you can set the [Configure Automatic Updates setting](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates##configure-automatic-updates) to **3**. This downloads the updates needed in the background, but doesn't install them. This keeps Update Management in control of schedules but allow updates to download outside of the Update Management maintenance window. This can prevent **Maintenance window exceeded** errors in Update Management.

You can also set this with PowerShell, run the following PowerShell on a system that you want to auto-download updates.

```powershell
$WUSettings = (New-Object -com "Microsoft.Update.AutoUpdate").Settings
$WUSettings.NotificationLevel = 3
$WUSettings.Save()
```

## Disable automatic installation

Azure VMs have Automatic installation of updates enabled by default. This can cause updates to be installed before you schedule them to be installed by Update Management. You can disable this behavior by setting the `NoAutoUpdate` registry key to `1`. The following PowerShell snippet shows you one way to do this.

```powershell
$AutoUpdatePath = "HKLM:SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU"
Set-ItemProperty -Path $AutoUpdatePath -Name NoAutoUpdate -Value 1
```

## Configure Reboot settings

The Registry keys listed under [Configuring Automatic Updates by editing the registry](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-rej7uijui7jgistry) and [Registry keys used to manage restart](/windows/deployment/update/waas-restart#registry-keys-used-to-manage-restart) can cause your machines to reboot, even if you have specified **Never Reboot** in the Update Deployment settings. You should configure these registry keys as desired for your environment.

## Enable updates for other Microsoft products

By default, Windows Update only provides updates for Windows. If you enable **Give me updates for other Microsoft products when I update Windows**, you're provided with updates for other products, including security patches for SQL Server or other first party software. This option can't be configured by Group Policy. Run the following PowerShell on the systems that you wish to enable other first party patches on, and Update Management will honor this setting.

```powershell
$ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
$ServiceManager.Services
$ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
$ServiceManager.AddService2($ServiceId,7,"")
```

## WSUS Configuration Settings

**Update Management** respects WSUS configuration settings. The list of WSUS settings you can configure for working with Update Management is listed below.

### Intranet Microsoft update service location

You can specify sources for scanning and downloading updates under [Intranet Microsoft Update Service Location](/windows/deployment/update/waas-wu-settings#specify-intranet-microsoft-update-service-location).

## Next Steps

After configuring Windows Update settings, you can schedule an Update Deployment by following the instructions under [Manage updates and patches for your Azure VMs](automation-tutorial-update-management.md)