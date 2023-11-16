---
title: Install Office on a custom VHD image - Azure
description: How to install and customize Office on a Azure Virtual Desktop custom image to Azure.
author: Heidilohr
ms.topic: how-to
ms.date: 05/02/2019
ms.author: helohr
manager: femila
---
# Install Office on a custom VHD image

This article tells you how to install Microsoft 365 Apps for enterprise, OneDrive, and other common applications on a custom virtual hard disk (VHD) image for upload to Azure. If your users need to access certain line of business (LOB) applications, we recommend you install them after completing the instructions in this article.

This article assumes you've already created a virtual machine (VM). If not, see [Prepare and customize a custom VHD image](set-up-customize-master-image.md#create-a-vm)

This article also assumes you have elevated access on the VM, whether it's provisioned in Azure or Hyper-V Manager. If not, see [Elevate access to manage all Azure subscription and management groups](../role-based-access-control/elevate-access-global-admin.md).

>[!NOTE]
>These instructions are for a Azure Virtual Desktop-specific configuration that can be used with your organization's existing processes.

## Install Office in shared computer activation mode

Shared computer activation lets you to deploy Microsoft 365 Apps for enterprise to a computer in your organization that is accessed by multiple users. For more information about shared computer activation, see [Overview of shared computer activation for Microsoft 365 Apps](/deployoffice/overview-shared-computer-activation).

Use the [Office Deployment Tool](https://www.microsoft.com/download/details.aspx?id=49117) to install Office. Windows 10 Enterprise multi-session and Windows 11 Enterprise-multi-session only support the following versions of Office:

   - Microsoft 365 Apps for enterprise
   - Microsoft 365 Apps for business that comes with a Microsoft 365 Business Premium subscription

The Office Deployment Tool requires a configuration XML file. To customize the following sample, see the [Configuration Options for the Office Deployment Tool](/deployoffice/configuration-options-for-the-office-2016-deployment-tool/).

This sample configuration XML we've provided will do the following things:

   - Install Office from the Monthly Enterprise Channel and deliver updates from the Monthly Enterprise Channel.
   - Use the x64 architecture.
   - Disable automatic updates. Updates should be added to a custom image for your session hosts and redeployed regularly, or installed manually when no end users are signed in to a session host to avoid Office applications being in use. 
   - Remove any existing installations of Office and migrate their settings.
   - Enable shared computer activation.

>[!NOTE]
>Visio's stencil search feature may not work as expected in Azure Virtual Desktop.

Here's what this sample configuration XML won't do:

   - Install Skype for Business
   - Install OneDrive in per-user mode. To learn more, see [Install OneDrive in per-machine mode](#install-onedrive-in-per-machine-mode).

>[!NOTE]
>Shared Computer Activation can be set up through Group Policy Objects (GPOs) or registry settings. The GPO is located at **Computer Configuration\\Policies\\Administrative Templates\\Microsoft Office 2016 (Machine)\\Licensing Settings**

The Office Deployment Tool contains setup.exe. To install Office, run the following command in a command line:

```cmd
Setup.exe /configure configuration.xml
```

#### Sample configuration.xml

The following XML sample will install the Monthly Enterprise Channel release.

```xml
<Configuration>
  <Add OfficeClientEdition="64" Channel="MonthlyEnterprise">
    <Product ID="O365ProPlusRetail">
      <Language ID="en-US" />
      <Language ID="MatchOS" />
      <ExcludeApp ID="Groove" />
      <ExcludeApp ID="Lync" />
      <ExcludeApp ID="OneDrive" />
      <ExcludeApp ID="Teams" />
    </Product>
  </Add>
  <RemoveMSI/>
  <Updates Enabled="FALSE"/>
  <Display Level="None" AcceptEULA="TRUE" />
  <Logging Level="Standard" Path="%temp%\WVDOfficeInstall" />
  <Property Name="FORCEAPPSHUTDOWN" Value="TRUE"/>
  <Property Name="SharedComputerLicensing" Value="1"/>
</Configuration>
```

>[!NOTE]
>The Office team recommends using 64-bit install for the **OfficeClientEdition** parameter.

After installing Office, you can update the default Office behavior. Run the following commands individually or in a batch file to update the behavior.

```cmd
rem Mount the default user registry hive
reg load HKU\TempDefault C:\Users\Default\NTUSER.DAT
rem Disable the option for Office Insider under File > Account.
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

rem Set the Office Update UI behavior for updates.
reg add HKLM\SOFTWARE\Policies\Microsoft\office\16.0\common\officeupdate /v hideupdatenotifications /t REG_DWORD /d 1 /f
reg add HKLM\SOFTWARE\Policies\Microsoft\office\16.0\common\officeupdate /v hideenabledisableupdates /t REG_DWORD /d 1 /f
```

## Install OneDrive in per-machine mode

OneDrive is normally installed per-user. In this environment, it should be installed per-machine.

Here's how to install OneDrive in per-machine mode:

1. First, create a location to stage the OneDrive installer. A local disk folder or [\\\\unc] (file://unc) location is fine.

2. Download [OneDriveSetup.exe](https://go.microsoft.com/fwlink/?linkid=844652) to your staged location.

3. If you installed Office with OneDrive by omitting `<ExcludeApp ID="OneDrive" /`, uninstall any existing OneDrive per-user installations from an elevated command prompt by running the following command:

    ```cmd
    "[staged location]\OneDriveSetup.exe" /uninstall
    ```

4. Run this command from an elevated command prompt to set the **AllUsersInstall** registry value:

    ```cmd
    REG ADD "HKLM\Software\Microsoft\OneDrive" /v "AllUsersInstall" /t REG_DWORD /d 1 /reg:64
    ```

5. Run this command to install OneDrive in per-machine mode:

    ```cmd
    "[staged location]\OneDriveSetup.exe" /allusers
    ```

6. Run this command to configure OneDrive to start at sign in for all users:

    ```cmd
    REG ADD "HKLM\Software\Microsoft\Windows\CurrentVersion\Run" /v OneDrive /t REG_SZ /d "C:\Program Files\Microsoft OneDrive\OneDrive.exe /background" /f
    ```

7. Enable **Silently configure user account** by running the following command.

    ```cmd
    REG ADD "HKLM\SOFTWARE\Policies\Microsoft\OneDrive" /v "SilentAccountConfig" /t REG_DWORD /d 1 /f
    ```

8. Redirect and move Windows known folders to OneDrive by running the following command.

    ```cmd
    REG ADD "HKLM\SOFTWARE\Policies\Microsoft\OneDrive" /v "KFMSilentOptIn" /t REG_SZ /d "<your-AzureAdTenantId>" /f
    ```

> [!TIP]
> You can configure OneDrive so that it will attempt to automatically sign-in when a user connects to a session. For more information, see [Silently configure user accounts](/sharepoint/use-silent-account-configuration).

## Microsoft Teams and Skype for Business

To learn how to install Microsoft Teams, see [Use Microsoft Teams on Azure Virtual desktop](./teams-on-avd.md). 

Azure Virtual Desktop doesn't support Skype for Business.

## Next steps

Now that you've added Office to the image, you can continue to customize your custom VHD image. See [Prepare and customize a custom VHD image](set-up-customize-master-image.md).
