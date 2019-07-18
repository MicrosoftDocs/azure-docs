---
title: Install Office on a master VHD image - Azure
description: How to install and customize Office on a Windows Virtual Desktop preview master image to Azure.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: v-chjenk
---
# Install Office on a master VHD image

This article tells you how to install Office 365 ProPlus, OneDrive, and other common applications on a master virtual hard disk (VHD) image for upload to Azure. If your users need to access certain line of business (LOB) applications, we recommend you install them after completing the instructions in this article.

This article assumes you've already created a virtual machine (VM). If not, see [Prepare and customize a master VHD image](set-up-customize-master-image.md#create-a-vm)

This article also assumes you have elevated access on the VM, whether it's provisioned in Azure or Hyper-V Manager. If not, see [Elevate access to manage all Azure subscription and management groups](https://docs.microsoft.com/azure/role-based-access-control/elevate-access-global-admin).

>[!NOTE]
>These instructions are for a Windows Virtual Desktop Preview-specific configuration that can be used with your organization's existing processes.

## Install Office in shared computer activation mode

Shared computer activation lets you to deploy Office 365 ProPlus to a computer in your organization that is accessed by multiple users. For more information about shared computer activation, see [Overview of shared computer activation for Office 365 ProPlus](https://docs.microsoft.com/DeployOffice/overview-of-shared-computer-activation-for-office-365-proplus).

Use the [Office Deployment Tool](https://www.microsoft.com/download/details.aspx?id=49117) to install Office. Windows 10 Enterprise multi-session only supports the following versions of Office:
- Office 365 ProPlus
- Office 365 Business that comes with a Microsoft 365 Business subscription

The Office Deployment Tool requires a configuration XML file. To customize the following sample, see the [Configuration Options for the Office Deployment Tool](https://docs.microsoft.com/deployoffice/configuration-options-for-the-office-2016-deployment-tool).

This sample configuration XML we've provided will do the following things:

- Install Office from the Insiders Channel and deliver updates from the Insiders Channel when they’re executed.
- Use the x64 architecture.
- Disable automatic updates.
- Install Visio and Project.
- Remove any existing installations of Office and migrate their settings.
- Enable shared computer activation.

>[!NOTE]
>Stencil search feature in Visio does not operate in Windows Virtual Desktop during preview configuration.

Here's what this sample configuration XML won't do:

- Install Skype for Business
- Install OneDrive in per-user mode. To learn more, see [Install OneDrive in per-machine mode](#install-onedrive-in-per-machine-mode).

>[!NOTE]
>Shared Computer Activation can be set up through Group Policy Objects (GPOs) or registry settings. The GPO is located at **Computer Configuration\\Policies\\Administrative Templates\\Microsoft Office 2016 (Machine)\\Licensing Settings**

The Office Deployment Tool contains setup.exe. To install Office, run the following command in a command line:

```batch
Setup.exe /configure configuration.xml
```

#### Sample configuration.xml

The following XML sample will install the Insiders release.

```xml
<Configuration>
    <Add OfficeClientEdition="64" SourcePath="https://officecdn.microsoft.com/pr/5440fd1f-7ecb-4221-8110-145efaa6372f">
        <Product ID="O365ProPlusRetail">
            <Language ID="en-US" />
            <Language ID="MatchOS" Fallback = "en-US"/>
            <Language ID="MatchPreviousMSI" />
            <ExcludeApp ID="Groove" />
            <ExcludeApp ID="Lync" />
            <ExcludeApp ID="OneDrive" />
            <ExcludeApp ID="Teams" />
        </Product>
        <Product ID="VisioProRetail">
            <Language ID="en-US" />
            <Language ID="MatchOS" Fallback = "en-US"/>
            <Language ID="MatchPreviousMSI" />
            <ExcludeApp ID="Teams" /> 
        </Product>
        <Product ID="ProjectProRetail">
            <Language ID="en-US" />
            <Language ID="MatchOS" Fallback = "en-US"/>
            <Language ID="MatchPreviousMSI" />
            <ExcludeApp ID="Teams" />
        </Product>
    </Add>
    <RemoveMSI All="True" />
    <Updates Enabled="FALSE" UpdatePath="https://officecdn.microsoft.com/pr/5440fd1f-7ecb-4221-8110-145efaa6372f" />
    <Display Level="None" AcceptEULA="TRUE" />
    <Logging Level="Verbose" Path="%temp%\WVDOfficeInstall" />
    <Property Value="TRUE" Name="FORCEAPPSHUTDOWN"/>
    <Property Value="1" Name="SharedComputerLicensing"/>
    <Property Value="TRUE" Name="PinIconsToTaskbar"/>
</Configuration>
```

>[!NOTE]
>The Office team recommends using 64-bit install for the **OfficeClientEdition** parameter.

After installing Office, you can update the default Office behavior. Run the following commands individually or in a batch file to update the behavior.

```batch
rem Mount the default user registry hive
reg load HKU\TempDefault C:\Users\Default\NTUSER.DAT
rem Must be executed with default registry hive mounted.
reg add HKU\TempDefault\SOFTWARE\Policies\Microsoft\office\16.0\common /v InsiderSlabBehavior /t REG_DWORD /d 2 /f
rem Set Outlook's Cached Exchange Mode behavior
rem Must be executed with default registry hive mounted.
reg add "HKU\TempDefault\software\policies\microsoft\office\16.0\outlook\cached mode" /v enable /t REG_DWORD /d 1 /f
reg add "HKU\TempDefault\software\policies\microsoft\office\16.0\outlook\cached mode" /v syncwindowsetting /t REG_DWORD /d 1 /f
reg add "HKU\TempDefault\software\policies\microsoft\office\16.0\outlook\cached mode" /v CalendarSyncWindowSetting /t REG_DWORD /d 1 /f
reg add "HKU\TempDefault\software\policies\microsoft\office\16.0\outlook\cached mode" /v CalendarSyncWindowSettingMonths  /t REG_DWORD /d 1 /f
rem Unmount the default user registry hive
reg unload HKU\TempDefault

rem Set the Office Update UI behavior.
reg add HKLM\SOFTWARE\Policies\Microsoft\office\16.0\common\officeupdate /v hideupdatenotifications /t REG_DWORD /d 1 /f
reg add HKLM\SOFTWARE\Policies\Microsoft\office\16.0\common\officeupdate /v hideenabledisableupdates /t REG_DWORD /d 1 /f
```

## Install OneDrive in per-machine mode

OneDrive is normally installed per-user. In this environment, it should be installed per-machine.

Here's how to install OneDrive in per-machine mode:

1. First, create a location to stage the OneDrive installer. A local disk folder or [\\\\unc](file://unc) location is fine.

2. Download OneDriveSetup.exe to your staged location with this link: <https://aka.ms/OneDriveWVD-Installer>

3. If you installed office with OneDrive by omitting **\<ExcludeApp ID="OneDrive" /\>**, uninstall any existing OneDrive per-user installations from an elevated command prompt by running the following command:
    
    ```batch
    "[staged location]\OneDriveSetup.exe" /uninstall
    ```

4. Run this command from an elevated command prompt to set the **AllUsersInstall** registry value:

    ```batch
    REG ADD "HKLM\Software\Microsoft\OneDrive" /v "AllUsersInstall" /t REG_DWORD /d 1 /reg:64
    ```

5. Run this command to install OneDrive in per-machine mode:

    ```batch
    Run "[staged location]\OneDriveSetup.exe" /allusers
    ```

6. Run this command to configure OneDrive to start at sign in for all users:

    ```batch
    REG ADD "HKLM\Software\Microsoft\Windows\CurrentVersion\Run" /v OneDrive /t REG_SZ /d "C:\Program Files (x86)\Microsoft OneDrive\OneDrive.exe /background" /f
    ```

7. Enable **Silently configure user account** by running the following command.

    ```batch
    REG ADD "HKLM\SOFTWARE\Policies\Microsoft\OneDrive" /v "SilentAccountConfig" /t REG_DWORD /d 1 /f
    ```

8. Redirect and move Windows known folders to OneDrive by running the following command.

    ```batch
    REG ADD "HKLM\SOFTWARE\Policies\Microsoft\OneDrive" /v "KFMSilentOptIn" /t REG_SZ /d "<your-AzureAdTenantId>" /f
    ```

## Teams and Skype

Windows Virtual Desktop doesn't support Skype for Business and Teams.

## Next steps

Now that you've added Office to the image, you can continue to customize your master VHD image. See [Prepare and customize a master VHD image](set-up-customize-master-image.md).
