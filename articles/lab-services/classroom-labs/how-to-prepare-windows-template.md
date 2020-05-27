---
title: Guide to setting up a Windows template machine | Microsoft Docs
description: Generic steps to prepare a Windows template machine in Lab Services.  These steps include setting Windows Update schedule, installing OneDrive, and installing Office.
services: lab-services
documentationcenter: na
author: EMaher
manager: 
editor: ''

ms.service: lab-services
ms.topic: article
ms.date: 11/21/2019
ms.author: enewman
---
# Guide to setting up a Windows template machine in Azure Lab Services

If you're setting up a Windows 10 template machine for Azure Lab Services, here are some best practices and tips to consider. The configuration steps below are all optional.  However, these preparatory steps could help make your students be more productive, minimize class time interruptions, and ensure that they're using the latest technologies.

>[!IMPORTANT]
>This article contains PowerShell snippets to streamline the machine template modification process.  For all the PowerShell scripts shown, you'll want to run them in Windows PowerShell with administrator privileges. In Windows 10, a quick way of doing that is to right-click the Start Menu and choose the "Windows PowerShell (Admin)".

## Install and configure OneDrive

To protect student data from being lost if a virtual machine is reset, we recommend students back their data up to the cloud.  Microsoft OneDrive can help students protect their data.  

### Install OneDrive

To manually download and install OneDrive, see the [OneDrive](https://onedrive.live.com/about/download/) or [OneDrive for Business](https://onedrive.live.com/about/business/) download pages.

You can also use the following PowerShell script.  It will automatically download and install the latest version of OneDrive.  Once the OneDrive client is installed, run the installer.  In our example, we use the `/allUsers` switch to install OneDrive for all users on the machine. We also use the `/silent` switch to silently install OneDrive.

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

There are many [customizations that can be done to OneDrive](https://docs.microsoft.com/onedrive/use-group-policy). Let's cover some of the more common customizations.

#### Silently move Windows known folders to OneDrive

Folders like Documents, Downloads, and Pictures are often used to store student files. To ensure these folders are backed up into OneDrive, we recommend you move these folders to OneDrive.

If you are on a machine that is not using Active Directory, users can manually move those folders to OneDrive once they authenticate to OneDrive.

1. Open File Explorer
2. Right-click the Documents, Downloads, or Pictures folder.
3. Go to Properties > Location.  Move the folder to a new folder on the OneDrive directory.

If your virtual machine is connected to Active Directory, you can set the template machine to automatically prompt your students to move the known folders to OneDrive.  

You'll need to retrieve your Office Tenant ID first.  For further instructions, see [find your Office 365 Tenant ID](https://docs.microsoft.com/onedrive/find-your-office-365-tenant-id).  You can also get the Office 365 Tenant ID by using the following PowerShell.

```powershell
Install-Module MSOnline -Confirm
Connect-MsolService
$officeTenantID = Get-MSOLCompanyInformation |
    Select-Object -expand objectID |
    Select-Object -expand Guid
```

Once you have your Office 365 Tenant ID, set OneDrive to prompt to move known folders to OneDrive using the following PowerShell.

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

Students might have many files within their OneDrive accounts. To help save space on the machine and reduce download time, we recommend making all the files stored in student's OneDrive account be on-demand.  On-demand files only download once a user accesses the file.

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive" -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive"
    -Name "FilesOnDemandEnabled" -Value "00000001" -PropertyType DWORD
```

### Silently sign in users to OneDrive

OneDrive can be set to automatically sign in with the Windows credentials of the logged on user.  Automatic sign-in is useful for classes where the student signs in with their Office 365 school credentials.

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive"
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive"
    -Name "SilentAccountConfig" -Value "00000001" -PropertyType DWORD
```

### Disable the tutorial that appears at the end of OneDrive setup

This setting lets you prevent the tutorial from launching in a web browser at the end of OneDrive Setup.

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive" -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive"
    -Name "DisableTutorial" -Value "00000001" -PropertyType DWORD -Force
```

### Set the maximum size of a file that to be download automatically

This setting is used in conjunction with Silently sign in users to the OneDrive sync client with their Windows credentials on devices that don't have OneDrive Files On-Demand enabled. Any user who has a OneDrive that's larger than the specified threshold (in MB) will be prompted to choose the folders they want to sync before the OneDrive sync client (OneDrive.exe) downloads the files.  In our example, "1111-2222-3333-4444" is the Office 365 tenant ID and 0005000 sets a threshold of 5 GB.

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive"
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive\DiskSpaceCheckThresholdMB"
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\OneDrive\DiskSpaceCheckThresholdMB"
    -Name "1111-2222-3333-4444" -Value "0005000" -PropertyType DWORD
```

## Install and configure Microsoft Office 365

### Install Microsoft Office 365

If your template machine needs Office, we recommend installation of Office through the [Office Deployment Tool (ODT)](https://www.microsoft.com/download/details.aspx?id=49117 ). You will need to create a reusable configuration file using the [Office 365 Client Configuration Service](https://config.office.com/) to choose which architecture, what features you'll need from Office, and how often it updates.

1. Go to [Office 365 Client Configuration Service](https://config.office.com/) and download your own configuration file.
2. Download [Office Deployment Tool](https://www.microsoft.com/download/details.aspx?id=49117).  Downloaded file will be `setup.exe`.
3. Run `setup.exe /download configuration.xml` to download Office components.
4. Run `setup.exe /configure configuration.xml` to install Office components.

### Change the Microsoft Office 365 update channel

Using the Office Configuration Tool, you can set how often Office receives updates. However, if you need to modify how often Office receives updates after installation, you can change the update channel URL. Update channel URL addresses can be found at [Change the Office 365 ProPlus update channel for devices in your organization](https://docs.microsoft.com/deployoffice/change-update-channels). The example below shows how to set Office 365 to use the Monthly Update Channel.

```powershell
# Update to the Office 365 Monthly Channel
Set-ItemProperty
    -Path "HKLM:\SOFTWARE\Microsoft\Office\ClickToRun\Configuration\CDNBaseUrl"
    -Name "CDNBaseUrl"
    -Value "http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60"
```

## Install and configure Updates

### Install the latest Windows Updates

We recommend that you install the latest Microsoft updates on the template machine for security purposes before publishing the template VM.  It also potentially avoids students from being disrupted in their work when updates run at unexpected times.

1. Launch **Settings** from the Start Menu
2. Click on **Update** & Security
3. Click **Check for updates**
4. Updates will download and install.

You can also use PowerShell to update the template machine.

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Confirm
Install-Module PSWindowsUpdate -Confirm
Install-WindowsUpdate -MicrosoftUpdate
Set-ExecutionPolicy default -Force
```

>[!NOTE]
>Some updates may require the machine to be restarted.  You'll be prompted if a reboot is required.

### Install the latest updates for Microsoft Store apps

We recommend having all Microsoft Store apps be updated to their latest versions.  Here are instructions to manually update applications from the Microsoft Store.  

1. Launch **Microsoft Store** application.
2. Click the ellipse (…) next to your user photo in the top corner of the application.
3. Select **Download** and updates from the drop-down menu.
4. Click **Get update** button.

You can also use PowerShell to update Microsoft Store applications that are already installed.

```powershell
(Get-WmiObject -Namespace "root\cimv2\mdm\dmmap" -Class "MDM_EnterpriseModernAppManagement_AppManagement01").UpdateScanMethod()
```

### Stop automatic Windows Updates

After updating Windows to the latest version, you might consider stopping Windows Updates.  Automatic updates could potentially interfere with scheduled class time.  If your course is a longer running one, consider asking students to manually check for updates or setting automatic updates for a time outside of scheduled class hours.  For more information about customization options for Windows Update, see the [manage additional Windows Update settings](https://docs.microsoft.com/windows/deployment/update/waas-wu-settings).

Automatic Windows Updates may be stopped using the following PowerShell script.

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AU"
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AU"
    -Name "NoAutoUpdate" -Value "1" -PropertyType DWORD
```

## Install foreign language packs

If you need additional languages installed on the virtual machine, you can add them through the Microsoft Store.

1. Launch Microsoft Store
2. Search for "language pack"
3. Choose language to install

If you are already logged on to the template VM, use "Install language pack" shortcut (`ms-settings:regionlanguage?activationSource=SMC-IA-4027670`) to go directly to the appropriate settings page.

## Remove unneeded built-in apps

Windows 10 comes with many built-in applications that might not be needed for your particular class. To simplify the machine image for students, you might want to uninstall some applications from your template machine.  To see a list of installed applications, use the PowerShell `Get-AppxPackage` cmdlet.  The example below shows all installed applications that can be removed.

```powershell
Get-AppxPackage | Where {$_.NonRemovable -eq $false} | select Name
```

To remove an application, use the Remove-Appx cmdlet.  The example below shows how to remove everything XBox related.

```powershell
Get-AppxPackage -Name *xbox* | foreach { if (-not $_.NonRemovable) { Remove-AppxPackage $_} }
```

## Install common teaching-related applications

Install other apps commonly used for teaching through the Windows Store app. Suggestions include applications like [Microsoft Whiteboard app](https://www.microsoft.com/store/productId/9MSPC6MP8FM4), [Microsoft Teams](https://www.microsoft.com/store/productId/9MSPC6MP8FM4), and [Minecraft Education Edition](https://education.minecraft.net/). These applications must be installed manually through the Windows Store or through their respective websites on the template VM.

## Conclusion

This article has shown you optional steps to prepare your Windows template VM for an effective class.  Steps include installing OneDrive and installing Office 365, installing the updates for Windows and installing updates for Microsoft Store apps.  We also discussed how to set updates to a schedule that works best for your class.  

## Next steps
See the article on how to control Windows shutdown behavior to help with managing costs: [Guide to controlling Windows shutdown behavior](how-to-windows-shutdown.md)
