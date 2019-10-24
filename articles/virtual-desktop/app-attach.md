---
title: How to set up an app attach - Azure
description: How to set up an app attach.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 09/24/2019
ms.author: helohr
---
# Set up an MSIX app attach

<!---Figure out what "MSIX" stands for-->

This document walks through prerequisite, tools, and configurations steps needed to evaluate MSIX app attach in a Windows Virtual Desktop environment.

>[!NOTE]
> MSIX app attach is currently in preview, not a finished product. Because of this, Microsoft doesn't currently offer support for this feature. However, you can ask questions and leave feedback at the following community resources:
>
>- [Windows Virtual Desktop TechCommunity](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop)
>- [Windows Virtual Desktop feedback hub](https://aka.ms/MRSFeedbackHub)
>- [MSIX app attach feedback hub](http://aka.ms/msixappattachfeedback)
>- [MSIX packaging tool feedback hub](../../../AppData/Roaming/Microsoft/Word/aka.ms/msixtoolfeedback)

## Prerequisites

In this section we are going to cover all prerequisites needed for configuring the MSIX app attach preview:

- Access to the Windows Insider portal to obtain the version of Windows 10 with support for the MSIX app attach APIs.
- Windows Virtual Desktop deployment. Steps 1 and 2 in Windows Virtual Desktop tutorial section [here](https://docs.microsoft.com/azure/virtual-desktop/tenant-setup-azure-active-directory).
- MSIX packaging tool
- Network share where the MSIX package will be stored (part of Windows Virtual Desktop deployment)

## Get the OS image

Navigate to the [Windows Insider portal](https://www.microsoft.com/software-download/windowsinsiderpreviewadvanced?wa=wsignin1.0) and sign in.

>[!NOTE]
>You must be member of the Windows Insider program to access the Windows Insider portal. To learn more about the Windows Insider program,  see XXX.

Scroll down to **Select edition** section and select **Windows 10 Insider Preview Enterprise (FAST) – Build XXXXX.**

Click **Confirm** and select **English**. Please click the second **Confirm.**

>[!NOTE]
>You can select other languages, but they haven't been tested with the feature yet, so either may not display or don't currently work as intended.

When the download link is generated select the **64-bit Download** and save it to your local hard disk.

## Prepare the VHD image for Azure 

The Windows Virtual Desktop article on preparing and customizing a master VHD
image is
[here](https://docs.microsoft.com/azure/virtual-desktop/set-up-customize-master-image).
It outlines the steps needed to:

Create a VM

Perform additional OS configuration:

>   It is mandatory that auto updates for MSIX app attach applications are
>   disabled. Based on the type of application being used, run the below
>   commands in elevated **Command prompt:**

```regedit
# Disable Store auto update:

reg add HKLM\Software\Policies\Microsoft\WindowsStore /v AutoDownload /t
REG_DWORD /d 0 /f
Schtasks /Change /Tn "\Microsoft\Windows\WindowsUpdate\Automatic app update" /Disable

# Disable Content Delivery auto download apps that they want to promote to users:

reg add
HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager
/v PreInstalledAppsEnabled /t REG_DWORD /d 0 /f

reg add
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager\Debug
/v ContentDeliveryAllowedOverride /t REG_DWORD /d 0x2 /f

# Disable Windows Update:

sc config wuauserv start=disabled
```

Prepare the VM VHD for Azure

Upload the resulting VHD disk to Azure.

Once the VHD is uploaded in Azure, create a host pool based on this new image.
Steps are outlined
[here](https://docs.microsoft.com/azure/virtual-desktop/create-host-pools-azure-marketplace).

## Prepare the application for MSIX app attach 

If you already have an MSIX package proceed to the next step. If you would like
to test a legacy application please follow steps
[here](https://docs.microsoft.com/windows/msix/packaging-tool/create-app-package-msi-vm)
to convert that application to a MSIX package.

## Expand MSIX

In order to optimize for performance MSIX packages are put into VHD or VHDX. The
steps below outline the mandatory process for generating a VHD or VHDX from a
MSIX package a process called “MSIX expansion”.

### Preparation

Download the **msixmgr** tool from this link to a session host VM.

Unzip to a folder on the session host VM.

Put the source MSIX package into the same folder where **msixmgr** was unzipped.

### Create VHD

>   In PowerShell ISE use the command below to create a VHD:

```powershell
New-VHD -SizeBytes <size>MB -Path c:\temp\<name>.vhd -Dynamic -Confirm:$false
```

>[!NOTE]
>Make sure the size of VHD is large enough to hold the expanded MSIX.*

Mount the newly created VHD by using the command below:

```powershell
$vhdObject = Mount-VHD c:\temp\<name>.vhd -Passthru
```

Initialize the VHD by using the command below:

```powershell
$disk = Initialize-Disk -Passthru -Number $vhdObject.Number
```

Create a new partition:

```powershell
$partition = New-Partition -AssignDriveLetter -UseMaximumSize -DiskNumber $disk.Number
```

Format the partition:

```powershell
Format-Volume -FileSystem NTFS -Confirm:$false -DriveLetter $partition.DriveLetter -Force
```

Create a parent folder on the mounted VHD. This step is mandatory as the MSIX app attach requires a parent folder. This can be named whatever you like.

### Expand MSIX

>   Open a **command prompt** as Administrator and navigate to the folder where
>   **msixmgr** was downloaded and unzipped.

>   Run the following command to unpack the MSIX into the VHD created and
>   mounted earlier.

```powershell
msixmgr.exe -Unpack -packagePath <package>.msix -destination "f:\<name of folder created earlier>" -applyacls
```

Once completed following message will appear:

>   *Successfully unpacked and applied ACLs for package: \<package name\>.msix*

>   *If your package is a store-signed package, please note that store-signed
>   apps require a license file to be included, which can be downloaded from the
>   Microsoft Store for Business. Instructions available*
>   [here](https://docs.microsoft.com/microsoft-store/distribute-offline-apps#download-an-offline-licensed-app)*.*

Navigate to the mounted VHD and open the app folder and confirm package content
is present.

Unmount the VHD.

## Configure Windows Virtual Desktop infrastructure

By design a single MSIX expanded package (VHD created in previous step) can be
shared between multiple session host VMs as the VHDs are attached in Read Only
mode.

There are two requirements for this network share:

1.  The share is SMB compatible

2.  VMs that are part of the session host pool have NTFS permissions to the
    share

### Setup a MSIX app attach share 

>   In your Windows Virtual Desktop environment create a network share and place
>   the package there.

>   Please note: best practices for the MSIX network share is to be set up with
>   NTFS read only permissions.

## Prepare PowerShell scripts needed for MSIX app attach

MSIX app attach has four distinct phases that need to be performed in the order
listed below. Sample scripts are available
[here](https://github.com/Azure/RDS-Templates/tree/master/msix-app-attach):

1.  Stage

2.  Register

3.  De-register

4.  De-stage

A PowerShell script will be created for each of these stages. Once the scripts
are created, they can be manually executed by users (assuming admin permissions)
or setup as logon/logoff/shutdown/startup scripts. Instructions on how to setup
the scripts can be found in the section Setup login/logoff/startup/shutdown
scripts to simulate MSIX app attach agent below.

### Stage PowerShell script

Prior to updating the PowerShell script below, make sure to obtain the volume
GUID of the volume in the VHD. To do this:

1.  From the VM where the script will run, navigate to the network share where
    the VHD is located

2.  Right click on the VHD and select mount. This will mount the VHD to a drive
    letter.

3.  Once mount is completed a **File Explorer** window will be opened

4.  Make sure to capture the parent folder and update the **\$parentFolder**
    variable

    >[!NOTE]
    >If there is no parent folder the expanded MSIX was not created correctly.

5.  Open the “parent folder”, if correctly expanded that will contain a folder
    that has the same name as the package. Update the **\$packageName** variable
    to match the name of the folder which must match the name of the package.

    For example, `VSCodeUserSetup-x64-1.38.1_1.38.1.0_x64__8wekyb3d8bbwe`.

6.  Open **Command prompt** and type **mountvol** this will display list of
    volumes and there GUIDs. Grab the GUID of the volume where the drive letter
    matches that from step 2.

    ![A screenshot of a cell phone Description automatically generated](media/0a02203ae78fef125a625bb853d37655.png)

7.  Using the volume GUID update the **\$volumeGuid** variable.

Update script below with variables applicable to your environment.

```powershell
#MSIX app attach staging sample

#region variables

$vhdSrc="<path to vhd>"

$packageName = "<package name>"

$parentFolder = "<package parent folder>"

$parentFolder = "\" + $parentFolder + "\"

$volumeGuid = "<vol guid>"

$msixJunction = "C:\temp\AppAttach\"

#endregion

#region mountvhd

try

{

Mount-Diskimage -ImagePath \$vhdSrc -NoDriveLetter -Access ReadOnly

Write-Host ("Mounting of " + \$vhdSrc + " was completed!") -BackgroundColor
Green

}

catch

{

Write-Host ("Mounting of " + \$vhdSrc + " has failed!") -BackgroundColor Red

}

#endregion

#region makelink

$msixDest = "\\?\Volume{" + $volumeGuid + "}\"

if (!(Test-Path $msixJunction))

{

md $msixJunction

}

$msixJunction = $msixJunction + $packageName

cmd.exe /c mklink /j $msixJunction $msixDest

#endregion

#region stage

[Windows.Management.Deployment.PackageManager,Windows.Management.Deployment,ContentType=WindowsRuntime]
| Out-Null

Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where {
$_.ToString() -eq 'System.Threading.Tasks.Task\`1[TResult]
AsTask[TResult,TProgress](Windows.Foundation.IAsyncOperationWithProgress\`2[TResult,TProgress])'})[0]

$asTaskAsyncOperation =
$asTask.MakeGenericMethod([Windows.Management.Deployment.DeploymentResult],
[Windows.Management.Deployment.DeploymentProgress])

$packageManager = [Windows.Management.Deployment.PackageManager]::new()

$path = $msixJunction + $parentFolder + $packageName # needed if we do the
pbisigned.vhd

$path = ([System.Uri]$path).AbsoluteUri

$asyncOperation = $packageManager.StagePackageAsync($path, $null, "StageInPlace")

$task = $asTaskAsyncOperation.Invoke($null, @($asyncOperation))

$task

#endregion
```

### Register PowerShell script

Update script below with variables applicable to your environment.

```powershell
#MSIX app attach registration sample

#region variables

$packageName = "<package name>"

$path = "C:\Program Files\WindowsApps\" + $packageName + "\AppxManifest.xml"

#endregion

#region register

Add-AppxPackage -Path \$path -DisableDevelopmentMode -Register

#endregion
```

### De-Register PowerShell script

Update **\$packageName** with the package being tested.

```powershell
#MSIX app attach deregistration sample

#region variables

$packageName = "<package name>"

#endregion

#region derregister

Remove-AppxPackage -PreserveRoamableApplicationData $packageName

#endregion
```

### De-Stage PowerShell script

Update **\$packageName** with the package being tested.

```powershell
#MSIX app attach de staging sample

#region variables

$packageName = "<package name>"

$msixJunction = "C:\temp\AppAttach\"

#endregion

#region derregister

Remove-AppxPackage -AllUsers -Package $packageName

cd $msixJunction

rmdir $packageName -Force -Verbose

#endregion
```

## Set up simulation scripts for MSIX app attach agent

In this preview we are modeling MSIX app attach behavior by using four scripts
(stage, register, de-register, and de-stage).

One way to setup these scripts to run without user interacting with them is via
startup, logon, logoff, and shutdown scripts in Windows. Article outlining the
steps is available
[here](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn789196(v=ws.11)).

Startup script will be the stage script.

User logon script will be the register script.

Logoff script will be setup run to de-register script.

Shutdown scripts will run the de-stage script.
