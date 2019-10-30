---
title: Windows Virtual Desktop MSIX app attach - Azure
description: How to set up MSIX app attach for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 09/24/2019
ms.author: helohr
---
# Set up MSIX app attach

> [!IMPORTANT]
> MSIX app attach is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). You can also leave feedback for this feature at the [MSIX app attach feedback hub](https://aka.ms/msixappattachfeedback) or the [MSIX packaging tool feedback hub](../../../AppData/Roaming/Microsoft/Word/aka.ms/msixtoolfeedback).

This document walks through prerequisite, tools, and configurations steps needed to evaluate MSIX app attach in a Windows Virtual Desktop environment.

## Prerequisites

Here's what you need to configure MSIX app attach:

- Access to the Windows Insider portal to obtain the version of Windows 10 with support for the MSIX app attach APIs.
- Windows Virtual Desktop deployment. For information, see [Create a tenant in Windows Virtual Desktop](tenant-setup-azure-active-directory.md).
- MSIX packaging tool
- Network share where the MSIX package will be stored (part of Windows Virtual Desktop deployment)

## Get the OS image

First, you need to get the OS image you'll use for the MSIX app. To do this:

1. Open the [Windows Insider portal](https://www.microsoft.com/software-download/windowsinsiderpreviewadvanced?wa=wsignin1.0) and sign in.

>[!NOTE]
>You must be member of the Windows Insider program to access the Windows Insider portal. To learn more about the Windows Insider program, see XXX.

2. Scroll down to **Select edition** section and select **Windows 10 Insider Preview Enterprise (FAST) – Build XXXXX.**

3. Select **Confirm**, then select the language you wish to use, then select **Confirm**.
    
     >[!NOTE]
     >At the moment, English is the only language that has been tested with the feature. You can select other languages, but they may not display as intended.
    
4. When the download link is generated, select the **64-bit Download** and save it to your local hard disk.

## Prepare the VHD image for Azure 

Before you follow these instructions, you'll need to create and customize a master VHD image. To learn more, see the instructions in [here](set-up-customize-master-image.md). 

After that, you must disable automatic updates for MSIX app attach applications. To do this, you'll need to run the following commands in a command line:

```cmd
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

Next, prepare the VM VHD for Azure and upload the resulting VHD disk to Azure.

<!--can we get a tutorial for this?-->

Once the VHD is uploaded in Azure, create a host pool based on this new image by following the instructions in [this tutorial](create-host-pools-azure-marketplace.md).

## Prepare the application for MSIX app attach 

If you already have an MSIX package proceed to the next step. If you would like to test a legacy application please follow steps [here](https://docs.microsoft.com/windows/msix/packaging-tool/create-app-package-msi-vm) to convert that application to a MSIX package.

## Generate a VHD or VHDX package for MSIX

Packages are in VHD or VHDX format to optimize performance. MSIX requres VHD or VHDX packages to work properly.

To generate a VHD or VHDX package for MSIX:

1. Download the **msixmgr** tool from this link to a session host VM.

2. Unzip to a folder on the session host VM.

3. Put the source MSIX package into the same folder where **msixmgr** was unzipped.

4. Run the following cmdlet in Powershell to create a VHD:

    ```powershell
    New-VHD -SizeBytes <size>MB -Path c:\temp\<name>.vhd -Dynamic -Confirm:$false
    ```

    >[!NOTE]
    >Make sure the size of VHD is large enough to hold the expanded MSIX.*

5. Run the following cmdlet to mount the newly created VHD:

    ```powershell
    $vhdObject = Mount-VHD c:\temp\<name>.vhd -Passthru
    ```

6. Run this cmdlet to initialize the VHD:

    ```powershell
    $disk = Initialize-Disk -Passthru -Number $vhdObject.Number
    ```

7. Run this cmdlet to create a new partition:

    ```powershell
    $partition = New-Partition -AssignDriveLetter -UseMaximumSize -DiskNumber $disk.Number
    ```

8. Run this cmdlet to format the partition:

    ```powershell
    Format-Volume -FileSystem NTFS -Confirm:$false -DriveLetter $partition.DriveLetter -Force
    ```

9. Create a parent folder on the mounted VHD. This step is mandatory as the MSIX app attach requires a parent folder. This can be named whatever you like.

### Expand MSIX

After that, you'll need to "expand" the MSIX image by unpacking it. To do this:

1. Open a **command prompt** as Administrator and navigate to the folder where **msixmgr** was downloaded and unzipped.

2. Run the following cmdlet to unpack the MSIX into the VHD you created and mounted in the previous section.

    ```powershell
    msixmgr.exe -Unpack -packagePath <package>.msix -destination "f:\<name of folder created earlier>" -applyacls
    ```

    The following message should appear once unpacking is done:

    `Successfully unpacked and applied ACLs for package: <package name>.msix`

    >[!NOTE]
    > If your package is a store-signed package, please note that store-signed apps require a license file to be included, which can be downloaded from the Microsoft Store for Business. Instructions available [here](https://docs.microsoft.com/microsoft-store/distribute-offline-apps#download-an-offline-licensed-app).

3. Navigate to the mounted VHD and open the app folder and confirm package content is present.

4. Unmount the VHD.

## Configure Windows Virtual Desktop infrastructure

By design a single MSIX expanded package (VHD created in previous step) can be shared between multiple session host VMs as the VHDs are attached in Read Only mode.

Before you start, make sure your network share meets these requirements:

- The share is SMB compatible.
- VMs that are part of the session host pool have NTFS permissions to the share.

### Set up a MSIX app attach share 

In your Windows Virtual Desktop environment create a network share and place the package there.

>[!NOTE]
> MSIX network share best practice is to set up the network share with NTFS read-only permissions.

## Prepare PowerShell scripts for MSIX app attach

MSIX app attach has four distinct phases that must be performed in the following order:

1. Stage
2. Register
3. Deregister
4. Destage

Each phase creates a PowerShell script. Sample scripts for each phase are available [here](https://github.com/Azure/RDS-Templates/tree/master/msix-app-attach).

### Stage PowerShell script

Prior to updating the PowerShell script below, make sure to obtain the volume GUID of the volume in the VHD. To do this:

1.  In the VM where the script will run, open the network share where the VHD is located.

2.  Right-click on the VHD and select **Mount**. This will mount the VHD to a drive letter.

3.  After you mount the VHD, the **File Explorer** window will open. Capture the parent folder and update the **\$parentFolder** variable

    >[!NOTE]
    >If you don't see a parent folder, that means the MSIX wasn't expanded properly. Redo the previous section and try again.

4.  Open the parent folder. If correctly expanded, you'll see a folder with the same name as the package. Update the **\$packageName** variable to match the name of this folder.

    For example, `VSCodeUserSetup-x64-1.38.1_1.38.1.0_x64__8wekyb3d8bbwe`.

5.  Open a command prompt and enter **mountvol**. This will display a list of volumes and their GUIDs. Copy the GUID of the volume where the drive letter matches the drive you mounted your VHD to in step 2.

    For example, in this example output for the mountvol command, if you mounted your VHD to Drive C, you'll want to copy the value above `C:\`:

    ```cmd
    Possible values for VolumeName along with current mount points are:

    \\?\Volume{a12b3456-0000-0000-0000-10000000000}\
    *** NO MOUNT POINTS ***

    \\?\Volume{c78d9012-0000-0000-0000-20000000000}\
        E:\

    \\?\Volume{d34e5678-0000-0000-0000-30000000000}\
        C:\

    ```


6.  Update the **\$volumeGuid** variable with the volume GUID you just copied.

7. Update the following PowerShell script with the variables that apply to your environment.

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

    Write-Host ("Mounting of " + \$vhdSrc + " was completed!") -BackgroundColor Green

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

### Deregister PowerShell script

Update **\$packageName** with the package being tested.

```powershell
#MSIX app attach deregistration sample

#region variables

$packageName = "<package name>"

#endregion

#region deregister

Remove-AppxPackage -PreserveRoamableApplicationData $packageName

#endregion
```

### Destage PowerShell script

Update **\$packageName** with the package being tested.

```powershell
#MSIX app attach de staging sample

#region variables

$packageName = "<package name>"

$msixJunction = "C:\temp\AppAttach\"

#endregion

#region deregister

Remove-AppxPackage -AllUsers -Package $packageName

cd $msixJunction

rmdir $packageName -Force -Verbose

#endregion
```

## Set up simulation scripts for MSIX app attach agent

After you create the scripts, users can manually run them or set them up to run automatically as startup, logon, logoff, and shutdown scripts. To learn more about these types of scripts, see [this article](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn789196(v=ws.11)).

Each of these automatic scripts runs one phase of the app attach scripts:

- The startup script runs the stage script.
- The logon script runs the register script.
- The logoff script runs the deregister script.
- The shutdown script runs the destage script.
