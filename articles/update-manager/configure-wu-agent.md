---
title: Configure Windows Update settings in Azure Update Manager
description: This article tells how to configure Windows update settings to work with Azure Update Manager.
ms.service: azure-update-manager
ms.date: 09/18/2023
ms.topic: conceptual
author: SnehaSudhirG
ms.author: sudhirsneha
---

# Configure Windows update settings for Azure Update Manager

Azure Update Manager relies on the [Windows Update client](/windows/deployment/update/windows-update-overview) to download and install Windows updates. There are specific settings that are used by the Windows Update client when connecting to Windows Server Update Services (WSUS) or Windows Update. Many of these settings can be managed by:

- Local Group Policy Editor
- Group Policy
- PowerShell
- Directly editing the Registry

The Update Manager respects many of the settings specified to control the Windows Update client. If you use settings to enable non-Windows updates, the Update Manager will also manage those updates. If you want to enable downloading of updates before an update deployment occurs, update deployment can be faster, more efficient, and less likely to exceed the maintenance window.

For additional recommendations on setting up WSUS in your Azure subscription and to secure your Windows virtual machines up to date, review [Plan your deployment for updating Windows virtual machines in Azure using WSUS](/azure/architecture/example-scenario/wsus).

## Pre-download updates

To configure the automatic downloading of updates without automatically installing them, you can use Group Policy to [configure the Automatic Updates setting](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates#configure-automatic-updates) to 3. This setting enables downloads of the required updates in the background, and notifies you that the updates are ready to install. In this way, Update Manager remains in control of schedules, but allows downloading of updates outside the maintenance window. This behavior prevents `Maintenance window exceeded` errors in Update Manager.

You can enable this setting in PowerShell:

```powershell
$WUSettings = (New-Object -com "Microsoft.Update.AutoUpdate").Settings
$WUSettings.NotificationLevel = 3
$WUSettings.Save()
```

## Configure reboot settings

The registry keys listed in [Configuring Automatic Updates by editing the registry](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry) and [Registry keys used to manage restart](/windows/deployment/update/waas-restart#registry-keys-used-to-manage-restart) can cause your machines to reboot, even if you specify **Never Reboot** in the **Update Deployment** settings. Configure these registry keys to best suit your environment.

## Enable updates for other Microsoft products

By default, the Windows Update client is configured to provide updates only for Windows operating system. In Windows update, select **Check online for Windows updates**. It will check updates for other Microsoft products to enable the **Give me updates for other Microsoft products when I update Windows** to receive updates for other Microsoft products, including security patches for Microsoft SQL Server and other Microsoft software. 

Use one of the following options to perform the settings change at scale:

- For Servers configured to patch on a schedule from Update Manager (that has the VM PatchSettings set to AutomaticByPlatform = Azure-Orchestrated), and for all Windows Servers running on an earlier operating system than server 2016, Run the following PowerShell script on the server you want to change.

    ```powershell
    $ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
    $ServiceManager.Services
    $ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
    $ServiceManager.AddService2($ServiceId,7,"")
    ```

- For servers running Server 2016 or later which are not using Update Manager scheduled patching (that has the VM PatchSettings set to AutomaticByOS = Azure-Orchestrated) you can use Group Policy to control this by downloading and using the latest Group Policy [Administrative template files](/troubleshoot/windows-client/group-policy/create-and-manage-central-store).


## Configure a Windows server for Microsoft updates

The Windows update client on Windows servers can get their patches from either of the following Microsoft hosted patch repositories:
- Windows update - hosts operating system patches.
- Microsoft update - hosts operating system and other Microsoft patches. For example MS Office, SQL Server and so on.

> [!NOTE]
> For the application of patches, you can choose the update client at the time of installation, or later using Group policy or by directly editing the registry.
> To get the non-operating system Microsoft patches or to install only the OS patches, we recommend you to change the patch repository as this is an operating system setting and not an option that you can configure within Azure Update Manager.

### Edit the registry

If scheduled patching is configured on your machine using the Azure Update Manager, the Auto update on the client is disabled. To edit the registry and configure the setting, see [First party updates on Windows](support-matrix.md#first-party-updates-on-windows).

### Patching using group policy on Azure Update management

If your machine is patched using Automation Update management, and has Automatic updates enabled on the client, you can use the group policy to have complete control. To patch using group policy, follow these steps:

1. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Windows Update** > **Manage end user experience**.
1. Select **Configure Automatic Updates**.
1. Select or deselect the **Install updates for other Microsoft products** option.

   :::image type="content" source="./media/configure-wu-agent/configure-updates-group-policy-inline.png" alt-text="Screenshot of selection or deselection of install updates for other Microsoft products." lightbox="./media/configure-wu-agent/configure-updates-group-policy-expanded.png":::


## Make WSUS configuration settings

Update Manager supports WSUS settings. You can specify sources for scanning and downloading updates using instructions in [Specify intranet Microsoft Update service location](/windows/deployment/update/waas-wu-settings#specify-intranet-microsoft-update-service-location). By default, the Windows Update client is configured to download updates from Windows Update. When you specify a WSUS server as a source for your machines, the update deployment fails, if the updates aren't approved in WSUS. 

To restrict machines to the internal update service, see [do not connect to any Windows Update Internet locations](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates#do-not-connect-to-any-windows-update-internet-locations).

## Next steps

Configure an update deployment by following instructions in [Deploy updates](deploy-updates.md).
