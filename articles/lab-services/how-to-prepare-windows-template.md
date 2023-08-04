---
title: Prepare Windows lab template
description: Prepare a Windows-based lab template in Azure Lab Services. Configure commonly used software and OS settings, such as Windows Update, OneDrive, and Microsoft 365.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 05/17/2023
---

# Prepare a Windows template machine in Azure Lab Services

This article describes best practices and tips for preparing a Windows-based lab template virtual machine in Azure Lab Services. Learn how to configure commonly used software and operating system settings, such as Windows Update, OneDrive, and Microsoft 365.

>[!IMPORTANT]
>This article contains PowerShell snippets to streamline the machine template modification process.  Make sure to run the PowerShell scripts with administrative privileges (run as administrator). In Windows 10 or 11, select **Start**, type **PowerShell**, right-select **Windows PowerShell**, and then select **Run as administrator**.

## Install and configure OneDrive

When a lab user resets a lab virtual machine, all data on the machine is removed. To protect user data from being lost, we recommend that lab users back up their data in the cloud, for example by using Microsoft OneDrive.

### Install OneDrive

- Manually download and install OneDrive

    Follow these steps for [OneDrive](https://onedrive.live.com/about/download/) or [OneDrive for Business](https://www.microsoft.com/microsoft-365/onedrive/onedrive-for-business).

- Use a PowerShell script

    The following script downloads and installs the latest version of OneDrive. In the example, the installation uses the `/allUsers` switch to install OneDrive for all users on the machine. The `/silent` switch performs a silent installation to avoid asking for user confirmations.

    ```powershell
    Write-Host "Downloading OneDrive Client..."
    $DownloadPath = "$env:USERPROFILE/Downloads/OneDriveSetup.exe"
    if((Test-Path $DownloadPath) -eq $False )
    {
        Write-Host "Downloading OneDrive..."
        $web = new-object System.Net.WebClient
        $web.DownloadFile("https://go.microsoft.com/fwlink/p/?LinkId=248256",$DownloadPath)
    } else {
        Write-Host "OneDrive installer already exists at " $DownloadPath
    }
    
    Write-Host "Installing OneDrive..."
    & $env:USERPROFILE/Downloads/OneDriveSetup.exe /allUsers /silent
    ```
    
### OneDrive customizations

You can further [customize your OneDrive configuration](/onedrive/use-group-policy).

#### Silently move Windows known folders to OneDrive

Folders like Documents, Downloads, and Pictures are often used to store lab user files. To ensure these folders are backed up into OneDrive, you can move these folders to OneDrive.

- If you are on a machine that isn't using Active Directory, users can manually move those folders to OneDrive once they authenticate to OneDrive.

    1. Open **File Explorer**
    1. Right-select the **Documents**, **Downloads**, or **Pictures** folder.
    1. Go to **Properties** > **Location**.  Move the folder to a new folder on the OneDrive directory.
    
- If your virtual machine is connected to Active Directory, you can set the template machine to automatically prompt lab users to move the known folders to OneDrive.

    1. Retrieve your organization ID.

        Learn how to [find your Microsoft 365 organization ID](/onedrive/find-your-office-365-tenant-id).  Alternately, you can also get the organization ID by using the following PowerShell script:

        ```powershell
        Install-Module MSOnline -Confirm
        Connect-MsolService
        $officeTenantID = Get-MSOLCompanyInformation |
            Select-Object -expand objectID |
            Select-Object -expand Guid
        ```

    1. Configure OneDrive to prompt to move known folders to OneDrive by using the following PowerShell script:

        ```powershell
        if ($officeTenantID -eq $null)
        {
                Write-Error "Variable `$officeTenantId must be set to your Office Tenant Id before continuing."
        }
        New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive"
        New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive"
            -Name "KFMSilentOptIn" -Value $officeTenantID -PropertyType STRING
        ```

### Use OneDrive files on-demand

Lab users might store large numbers of files in their OneDrive accounts. To help save space on the lab virtual machine and reduce download time, you can make files on OneDrive available on-demand. On-demand files only download once a lab user accesses the file.

Use the following PowerShell script to enable on-demand files in OneDrive:

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive" -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive"
    -Name "FilesOnDemandEnabled" -Value "00000001" -PropertyType DWORD
```

### Disable the OneDrive tutorial

By default, after you finish the OneDrive setup, a tutorial is launched in the browser. Use the following script to disable the tutorial from showing:

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive" -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive"
    -Name "DisableTutorial" -Value "00000001" -PropertyType DWORD -Force
```

### Set the maximum download size of a user's OneDrive

To prevent that OneDrive automatically uses a large amount of disk space on the lab virtual machine when syncing files, you can configure a maximum size threshold. When a lab user has a OneDrive that's larger than the threshold (in MB), the user receives a prompt to choose which folders they want to sync before the OneDrive sync client (OneDrive.exe) downloads the files to the machine. This setting is used where [on-demand files](#use-onedrive-files-on-demand) isn't enabled.

Use the following PowerShell script to set the maximum size threshold. In our example, `1111-2222-3333-4444` is the organization ID and `0005000` sets a threshold of 5 GB.

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive"
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive\DiskSpaceCheckThresholdMB"
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive\DiskSpaceCheckThresholdMB"
    -Name "1111-2222-3333-4444" -Value "0005000" -PropertyType DWORD
```

## Install and configure Microsoft 365

### Install Microsoft 365

If your template machine needs Microsoft Office, we recommend installing Office with the [Office Deployment Tool (ODT)](https://www.microsoft.com/download/details.aspx?id=49117). You need to create a reusable configuration file by using the [Microsoft 365 Apps Admin Center](https://config.office.com/) to choose which architecture and Office features you need, and how often it updates.

1. Go to [Microsoft 365 Apps Admin Center](https://config.office.com/) and download your own configuration file.
2. Download the [Office Deployment Tool](https://www.microsoft.com/download/details.aspx?id=49117) (`setup.exe`).
3. Run `setup.exe /download configuration.xml` to download Office components.
4. Run `setup.exe /configure configuration.xml` to install Office components.

### Change the Microsoft 365 update channel

With the Office Configuration Tool, you can set how often Office receives updates. However, if you need to modify how often Office receives updates after installation, you can change the update channel URL. The update channel URL addresses are available at [Change the Microsoft 365 Apps update channel for devices in your organization](/deployoffice/change-update-channels). 

The following example PowerShell script shows how to set Microsoft 365 to use the Monthly Update Channel.

```powershell
# Update to the Microsoft 365 Monthly Channel
Set-ItemProperty
    -Path "HKLM:\SOFTWARE\Microsoft\Office\ClickToRun\Configuration\CDNBaseUrl"
    -Name "CDNBaseUrl"
    -Value "http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60"
```

## Install and configure Windows updates

### Install the latest Windows Updates

We recommend that you install the latest Microsoft updates on the template machine for security purposes before you publish the template VM. By installing before you publish the lab, you avoid that lab users are disrupted in their work by unexpected updates.

To install Windows updates from the Windows interface:

1. Launch **Settings** from the Start Menu
2. Select **Update** & Security
3. Select **Check for updates**
4. Updates will download and install.

You can also use PowerShell to update the template machine:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Confirm
Install-Module PSWindowsUpdate -Confirm
Install-WindowsUpdate -MicrosoftUpdate
Set-ExecutionPolicy default -Force
```

>[!NOTE]
>Some updates may require the machine to be restarted.  You're prompted if a reboot is required.

### Install the latest updates for Microsoft Store apps

We recommend having all Microsoft Store apps updated to their latest versions.

To manually update applications from the Microsoft Store:

1. Launch **Microsoft Store** application.
2. Select the ellipse (…) next to your user photo in the top corner of the application.
3. Select **Download** and updates from the drop-down menu.
4. Select **Get update** button.

To use PowerShell to update Microsoft Store applications:

```powershell
(Get-WmiObject -Namespace "root\cimv2\mdm\dmmap" -Class "MDM_EnterpriseModernAppManagement_AppManagement01").UpdateScanMethod()
```

### Stop automatic Windows updates

After you've updated Windows to the latest version, you might consider stopping Windows updates. Automatic updates could potentially interfere with scheduled lab time.  If you need the lab for long time, consider asking lab users to manually check for updates or scheduling automatic updates outside of scheduled lab times.  For more information about customization options for Windows Update, see the [manage additional Windows Update settings](/windows/deployment/update/waas-wu-settings).

Automatic Windows updates may be stopped using the following PowerShell script:

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AU"
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AU"
    -Name "NoAutoUpdate" -Value "1" -PropertyType DWORD
```

## Install language packs

If you need additional languages installed on the virtual machine, you can add them through the Microsoft Store.

1. Launch Microsoft Store
2. Search for "language pack"
3. Choose language to install

If you're already logged on to the template VM, use "Install language pack" shortcut (`ms-settings:regionlanguage?activationSource=SMC-IA-4027670`) to go directly to the appropriate settings page.

## Remove unneeded built-in apps

Windows 10 comes with many built-in applications that might not be needed for your particular lab. To simplify the machine image for lab users, you might want to uninstall some applications from your template machine.

To see a list of installed applications, use the PowerShell `Get-AppxPackage` cmdlet. The following example PowerShell script shows all installed applications that can be removed.

```powershell
Get-AppxPackage | Where {$_.NonRemovable -eq $false} | select Name
```

To remove an application, use the `Remove-Appx` cmdlet.  The following script shows how to remove everything related to XBox:

```powershell
Get-AppxPackage -Name *xbox* | foreach { if (-not $_.NonRemovable) { Remove-AppxPackage $_} }
```

## Install common teaching-related applications

Install other apps commonly used for teaching through the Windows Store app. Suggestions include applications like [Microsoft Whiteboard app](https://www.microsoft.com/store/productId/9MSPC6MP8FM4), [Microsoft Teams](https://www.microsoft.com/store/productId/9MSPC6MP8FM4), and [Minecraft Education Edition](https://education.minecraft.net/). These applications must be installed manually through the Windows Store or through their respective websites on the template VM.

## Next steps

- Learn how to manage cost by [controlling Windows shutdown behavior](how-to-windows-shutdown.md)