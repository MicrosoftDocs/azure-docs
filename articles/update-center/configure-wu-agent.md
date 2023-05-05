---
title: Configure Windows Update settings in Update management center (Preview)
description: This article tells how to configure Windows update settings to work with Update management center (Preview).
ms.service: update-management-center
ms.date: 05/02/2023
ms.topic: conceptual
author: SnehaSudhirG
ms.author: sudhirsneha
---

# Configure Windows update settings for update management center (preview)

Update management center (Preview) relies on the [Windows Update client](/windows/deployment/update/windows-update-overview) to download and install Windows updates. There are specific settings that are used by the Windows Update client when connecting to Windows Server Update Services (WSUS) or Windows Update. Many of these settings can be managed by:

- Local Group Policy Editor
- Group Policy
- PowerShell
- Directly editing the Registry

The Update management center (preview) respects many of the settings specified to control the Windows Update client. If you use settings to enable non-Windows updates, the Update management center (preview) will also manage those updates. If you want to enable downloading of updates before an update deployment occurs, update deployment can be faster, more efficient, and less likely to exceed the maintenance window.

For additional recommendations on setting up WSUS in your Azure subscription and to secure your Windows virtual machines up to date, review [Plan your deployment for updating Windows virtual machines in Azure using WSUS](/azure/architecture/example-scenario/wsus).

## Pre-download updates

To configure the automatic downloading of updates without automatically installing them, you can use Group Policy to [configure the Automatic Updates setting](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates#configure-automatic-updates) to 3. This setting enables downloads of the required updates in the background, and notifies you that the updates are ready to install. In this way, update management center (Preview) remains in control of schedules, but allows downloading of updates outside the maintenance window. This behavior prevents `Maintenance window exceeded` errors in update management center (preview).

You can enable this setting in PowerShell:

```powershell
$WUSettings = (New-Object -com "Microsoft.Update.AutoUpdate").Settings
$WUSettings.NotificationLevel = 3
$WUSettings.Save()
```

## Configure reboot settings

The registry keys listed in [Configuring Automatic Updates by editing the registry](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry) and [Registry keys used to manage restart](/windows/deployment/update/waas-restart#registry-keys-used-to-manage-restart) can cause your machines to reboot, even if you specify **Never Reboot** in the **Update Deployment** settings. Configure these registry keys to best suit your environment.

## Enable updates for other Microsoft products

By default, the Windows Update client is configured to provide updates only for Windows operating system. If you enable the **Give me updates for other Microsoft products when I update Windows** setting, you also receive updates for other Microsoft products, including security patches for Microsoft SQL Server and other Microsoft software. 

Use one of the following options to perform the settings change at scale:

- For Servers configured to patch on a schedule from Update management center (that has the VM PatchSettings set to AutomaticByPlatform = Azure-Orchestrated), and for all Windows Servers running on an earlier operating system than server 2016, Run the following PowerShell script on the server you want to change.

    ```powershell
    $ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
    $ServiceManager.Services
    $ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
    $ServiceManager.AddService2($ServiceId,7,"")
    ```

- For servers running Server 2016 or later which are not using Update management center scheduled patching (that has the VM PatchSettings set to AutomaticByOS = Azure-Orchestrated) you can use Group Policy to control this by downloading and using the latest Group Policy [Administrative template files](https://learn.microsoft.com/troubleshoot/windows-client/group-policy/create-and-manage-central-store).

## Make WSUS configuration settings

Update management center (Preview) supports WSUS settings. You can specify sources for scanning and downloading updates using instructions in [Specify intranet Microsoft Update service location](/windows/deployment/update/waas-wu-settings#specify-intranet-microsoft-update-service-location). By default, the Windows Update client is configured to download updates from Windows Update. When you specify a WSUS server as a source for your machines, the update deployment fails, if the updates aren't approved in WSUS. 

To restrict machines to the internal update service, see [do not connect to any Windows Update Internet locations](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates#do-not-connect-to-any-windows-update-internet-locations).

## Next steps

Configure an update deployment by following instructions in [Deploy updates](deploy-updates.md).
