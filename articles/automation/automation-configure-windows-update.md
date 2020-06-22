---
title: Configure Windows Update settings for Azure Automation Update Management
description: This article tells how to configure Windows Update settings to work with Azure Automation Update Management.
services: automation
ms.subservice: update-management
ms.date: 05/04/2020
ms.topic: conceptual
---
# Configure Windows Update settings for Azure Automation Update Management

Azure Automation Update Management relies on the [Windows Update client](https://docs.microsoft.com//windows/deployment/update/windows-update-overview) to download and install Windows updates. There are specific settings that are used by the Windows Update client when connecting to Windows Server Update Services (WSUS) or Windows Update. Many of these settings can be managed with:

- Local Group Policy Editor
- Group Policy
- PowerShell
- Directly editing the Registry

Update Management respects many of the settings specified to control the Windows Update client. If you use settings to enable non-Windows updates, Update Management will also manage those updates. If you want to enable downloading of updates before an update deployment occurs, update deployment can be faster, more efficient, and less likely to exceed the maintenance window.

For additional recommendations on setting up WSUS in your Azure subscription and securely keep your Windows virtual machines up to date, review [Plan your deployment for updating Windows virtual machines in Azure using WSUS](https://docs.microsoft.com/azure/architecture/example-scenario/wsus/).

## Pre-download updates

To configure the automatic downloading of updates without automatically installing them, you can use Group Policy to [configure the Automatic Updates setting](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates##configure-automatic-updates) to 3. This setting enables downloads of the required updates in the background, and notifies you that the updates are ready to install. In this way, Update Management remains in control of schedules, but allows downloading of updates outside the Update Management maintenance window. This behavior prevents `Maintenance window exceeded` errors in Update Management.

You can enable this setting in PowerShell:

```powershell
$WUSettings = (New-Object -com "Microsoft.Update.AutoUpdate").Settings
$WUSettings.NotificationLevel = 3
$WUSettings.Save()
```

## Configure reboot settings

The registry keys listed in [Configuring Automatic Updates by editing the registry](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry) and [Registry keys used to manage restart](/windows/deployment/update/waas-restart#registry-keys-used-to-manage-restart) can cause your machines to reboot, even if you specify **Never Reboot** in the **Update Deployment** settings. Configure these registry keys to best suit your environment.

## Enable updates for other Microsoft products

By default, the Windows Update client is configured to provide updates only for Windows. If you enable the **Give me updates for other Microsoft products when I update Windows** setting, you also receive updates for other products, including security patches for Microsoft SQL Server and other Microsoft software. You can configure this option if you have downloaded and copied the latest [Administrative template files](https://support.microsoft.com/help/3087759/how-to-create-and-manage-the-central-store-for-group-policy-administra) available for Windows 2016 and later.

If you have machines running Windows Server 2012 R2, you can't configure this setting through Group Policy. Run the following PowerShell command on these machines:

```powershell
$ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
$ServiceManager.Services
$ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
$ServiceManager.AddService2($ServiceId,7,"")
```

## Make WSUS configuration settings

Update Management supports WSUS settings. You can specify sources for scanning and downloading updates using instructions in [Specify intranet Microsoft Update service location](/windows/deployment/update/waas-wu-settings#specify-intranet-microsoft-update-service-location). By default, the Windows Update client is configured to download updates from Windows Update. When you specify a WSUS server as a source for your machines, if the updates aren't approved in WSUS, update deployment fails. 

To restrict machines to the internal update service, set [Do not connect to any Windows Update Internet locations](https://docs.microsoft.com/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates#do-not-connect-to-any-windows-update-internet-locations). 

## Next steps

Schedule an update deployment by following instructions in [Manage updates and patches for your Azure VMs](automation-tutorial-update-management.md).
