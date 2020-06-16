---
title: Windows Virtual Desktop MSIX app attach - Azure
description: How to set up MSIX app attach for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: helohr
manager: lizross
---
# Set up MSIX app attach

> [!IMPORTANT]
> MSIX app attach is currently in public preview.
> This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This topic will walk you through how to set up MSIX app attach in a Windows Virtual Desktop environment.

## Requirements

Before you get started, here's what you need to configure MSIX app attach:

- Access to the Windows Insider portal to obtain the version of Windows 10 with support for the MSIX app attach APIs.
- A functioning Windows Virtual Desktop deployment. To learn how to deploy the Windows Virtual Desktop Fall 2019 release, see [Create a tenant in Windows Virtual Desktop](./virtual-desktop-fall-2019/tenant-setup-azure-active-directory.md). To learn how to deploy the Windows Virtual Desktop Spring 2020 release, see [Create a host pool with the Azure portal](./create-host-pools-azure-marketplace.md).

- The MSIX packaging tool
- A network share in your Windows Virtual Desktop deployment where the MSIX package will be stored

## Get the OS image from the Technology Adoption Program (TAP) portal

To get the OS image from the Windows Insider Portal:

1. Open the [Windows Insider portal](https://www.microsoft.com/software-download/windowsinsiderpreviewadvanced?wa=wsignin1.0) and sign in.

     >[!NOTE]
     >You must be member of the Windows Insider program to access the Windows Insider portal. To learn more about the Windows Insider program, check out our [Windows Insider documentation](/windows-insider/at-home/).

2. Scroll down to the **Select edition** section and select **Windows 10 Insider Preview Enterprise (FAST) – Build 19041** or later.

3. Select **Confirm**, then select the language you wish to use, and then select **Confirm** again.
    
     >[!NOTE]
     >At the moment, English is the only language that has been tested with the feature. You can select other languages, but they may not display as intended.
    
4. When the download link is generated, select the **64-bit Download** and save it to your local hard disk.

## Get the OS image from the Azure portal

To get the OS image from the Azure portal:

1. Open the [Azure portal](https://portal.azure.com) and sign in.

2. Go to **Create a virtual machine**.

3. In the **Basic** tab, select **Windows 10 enterprise multi-session, version 2004**.
      
4. Follow the rest of the instructions to finish creating the virtual machine.

     >[!NOTE]
     >You can use this VM to directly test MSIX app attach. To learn more, skip ahead to [Generate a VHD or VHDX package for MSIX](#generate-a-vhd-or-vhdx-package-for-msix). Otherwise, keep reading this section.

## Prepare the VHD image for Azure 

Before you get started, you'll need to create a master VHD image. If you haven't created your master VHD image yet, go to [Prepare and customize a master VHD image](set-up-customize-master-image.md) and follow the instructions there. 

After you've created your master VHD image, you must disable automatic updates for MSIX app attach applications. To disable automatic updates, you'll need to run the following commands in an elevated command prompt:

```cmd
rem Disable Store auto update:

reg add HKLM\Software\Policies\Microsoft\WindowsStore /v AutoDownload /t REG_DWORD /d 0 /f
Schtasks /Change /Tn "\Microsoft\Windows\WindowsUpdate\Automatic app update" /Disable
Schtasks /Change /Tn "\Microsoft\Windows\WindowsUpdate\Scheduled Start" /Disable

rem Disable Content Delivery auto download apps that they want to promote to users:

reg add HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager /v PreInstalledAppsEnabled /t REG_DWORD /d 0 /f

reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager\Debug /v ContentDeliveryAllowedOverride /t REG_DWORD /d 0x2 /f

rem Disable Windows Update:

sc config wuauserv start=disabled
```

After you've disabled automatic updates, you must enable Hyper-V because you'll be using the Mount-VHD command to stage and and Dismount-VHD to destage. 

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```
>[!NOTE]
>This change will require that you restart the virtual machine.

Next, prepare the VM VHD for Azure and upload the resulting VHD disk to Azure. To learn more, see [Prepare and customize a master VHD image](set-up-customize-master-image.md).

Once you've uploaded the VHD to Azure, create a host pool that's based on this new image by following the instructions in the [Create a host pool by using the Azure Marketplace](create-host-pools-azure-marketplace.md) tutorial.

## Prepare the application for MSIX app attach 

If you already have an MSIX package, skip ahead to [Configure Windows Virtual Desktop infrastructure](#configure-windows-virtual-desktop-infrastructure). If you want to test legacy applications, follow the instructions in [Create an MSIX package from a desktop installer on a VM](/windows/msix/packaging-tool/create-app-package-msi-vm/) to convert the legacy application to an MSIX package.

## Generate a VHD or VHDX package for MSIX

Packages are in VHD or VHDX format to optimize performance. MSIX requires VHD or VHDX packages to work properly.

To generate a VHD or VHDX package for MSIX:

1. [Download the msixmgr tool](https://aka.ms/msixmgr) and save the .zip folder to a folder within a session host VM.

2. Unzip the msixmgr tool .zip folder.

3. Put the source MSIX package into the same folder where you unzipped the msixmgr tool.

4. Run the following cmdlet in PowerShell to create a VHD:

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

9. Create a parent folder on the mounted VHD. This step is mandatory as the MSIX app attach requires a parent folder. You can name the parent folder whatever you like.

### Expand MSIX

After that, you'll need to "expand" the MSIX image by unpacking it. To unpack the MSIX image:

1. Open a command prompt as Administrator and navigate to the folder where you downloaded and unzipped the msixmgr tool.

2. Run the following cmdlet to unpack the MSIX into the VHD you created and mounted in the previous section.

    ```powershell
    msixmgr.exe -Unpack -packagePath <package>.msix -destination "f:\<name of folder you created earlier>" -applyacls
    ```

    The following message should appear once unpacking is done:

    `Successfully unpacked and applied ACLs for package: <package name>.msix`

    >[!NOTE]
    > If using packages from the Microsoft Store for Business (or Education) within your network, or on devices that are not connected to the internet, you will need to obtain the package licenses from the Store and install them to run the app successfully. See [Use packages offline](#use-packages-offline).

3. Navigate to the mounted VHD and open the app folder and confirm package content is present.

4. Unmount the VHD.

## Configure Windows Virtual Desktop infrastructure

By design, a single MSIX expanded package (the VHD you created in the previous section) can be shared between multiple session host VMs as the VHDs are attached in read-only mode.

Before you start, make sure your network share meets these requirements:

- The share is SMB compatible.
- The VMs that are part of the session host pool have NTFS permissions to the share.

### Set up an MSIX app attach share 

In your Windows Virtual Desktop environment, create a network share and move the package there.

>[!NOTE]
> The best practice for creating MSIX network shares is to set up the network share with NTFS read-only permissions.

## Install certificates

If your app uses a certificate that isn't public-trusted or was self-signed, here's how to install it:

1. Right-click the package and select **Properties**.
2. In the window that appears, select the **Digital signatures** tab. There should be only one item in the list on the tab, as shown in the following image. Select that item to highlight the item, then select **Details**.
3. When the digital signature details window appears, select the **General** tab, then select **Install certificate**.
4. When the installer opens, select **local machine** as your storage location, then select **Next**.
5. If the installer asks you if you want to allow the app to make changes to your device, select **Yes**.
6. Select **Place all certificates in the following store**, then select **Browse**.
7. When the select certificate store window appears, select **Trusted people**, then select **OK**.
8. Select **Finish**.

## Prepare PowerShell scripts for MSIX app attach

MSIX app attach has four distinct phases that must be performed in the following order:

1. Stage
2. Register
3. Deregister
4. Destage

Each phase creates a PowerShell script. Sample scripts for each phase are available [here](https://github.com/Azure/RDS-Templates/tree/master/msix-app-attach).

### Stage the PowerShell script

Before you update the PowerShell scripts, make sure you have the volume GUID of the volume in the VHD. To get the volume GUID:

1.  Open the network share where the VHD is located inside the VM where you'll run the script.

2.  Right-click the VHD and select **Mount**. This will mount the VHD to a drive letter.

3.  After you mount the VHD, the **File Explorer** window will open. Capture the parent folder and update the **$parentFolder** variable

    >[!NOTE]
    >If you don't see a parent folder, that means the MSIX wasn't expanded properly. Redo the previous section and try again.

4.  Open the parent folder. If correctly expanded, you'll see a folder with the same name as the package. Update the **$packageName** variable to match the name of this folder.

    For example, `VSCodeUserSetup-x64-1.38.1_1.38.1.0_x64__8wekyb3d8bbwe`.

5.  Open a command prompt and enter **mountvol**. This command will display a list of volumes and their GUIDs. Copy the GUID of the volume where the drive letter matches the drive you mounted your VHD to in step 2.

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


6.  Update the **$volumeGuid** variable with the volume GUID you just copied.

7. Open an Admin PowerShell prompt and update the following PowerShell script with the variables that apply to your environment.

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

    Mount-VHD -Path $vhdSrc -NoDriveLetter -ReadOnly

    Write-Host ("Mounting of " + $vhdSrc + " was completed!") -BackgroundColor Green

    }

    catch

    {

    Write-Host ("Mounting of " + $vhdSrc + " has failed!") -BackgroundColor Red

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
    $_.ToString() -eq 'System.Threading.Tasks.Task`1[TResult]
    AsTask[TResult,TProgress](Windows.Foundation.IAsyncOperationWithProgress`2[TResult,TProgress])'})[0]

    $asTaskAsyncOperation =
    $asTask.MakeGenericMethod([Windows.Management.Deployment.DeploymentResult],
    [Windows.Management.Deployment.DeploymentProgress])

    $packageManager = [Windows.Management.Deployment.PackageManager]::new()

    $path = $msixJunction + $parentFolder + $packageName # needed if we do the pbisigned.vhd

    $path = ([System.Uri]$path).AbsoluteUri

    $asyncOperation = $packageManager.StagePackageAsync($path, $null, "StageInPlace")

    $task = $asTaskAsyncOperation.Invoke($null, @($asyncOperation))

    $task

    #endregion
    ```

### Register PowerShell script

To run the register script, run the following PowerShell cmdlets with the placeholder values replaced with values that apply to your environment.

```powershell
#MSIX app attach registration sample

#region variables

$packageName = "<package name>"

$path = "C:\Program Files\WindowsApps\" + $packageName + "\AppxManifest.xml"

#endregion

#region register

Add-AppxPackage -Path $path -DisableDevelopmentMode -Register

#endregion
```

### Deregister PowerShell script

For this script, replace the placeholder for **$packageName** with the name of the package you're testing.

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

For this script, replace the placeholder for **$packageName** with the name of the package you're testing.

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

## Set up simulation scripts for the MSIX app attach agent

After you create the scripts, users can manually run them or set them up to run automatically as startup, logon, logoff, and shutdown scripts. To learn more about these types of scripts, see [Using startup, shutdown, logon, and logoff scripts in Group Policy](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn789196(v=ws.11)/).

Each of these automatic scripts runs one phase of the app attach scripts:

- The startup script runs the stage script.
- The logon script runs the register script.
- The logoff script runs the deregister script.
- The shutdown script runs the destage script.

## Use packages offline

If you're using packages from the [Microsoft Store for Business](https://businessstore.microsoft.com/) or the [Microsoft Store for Education](https://educationstore.microsoft.com/) within your network or on devices that aren't connected to the internet, you need to get the package licenses from the Microsoft Store and install them on your device to successfully run the app. If your device is online and can connect to the Microsoft Store for Business, the required licenses should download automatically, but if you're offline, you'll need to set up the licenses manually. 

To install the license files, you'll need to use a PowerShell script that calls the MDM_EnterpriseModernAppManagement_StoreLicenses02_01 class in the WMI Bridge Provider.  

Here's how to set up the licenses for offline use: 

1. Download the app package, licenses, and required frameworks from the Microsoft Store for Business. You need both the encoded and unencoded license files. Detailed download instructions can be found [here](/microsoft-store/distribute-offline-apps#download-an-offline-licensed-app).
2. Update the following variables in the script for step 3:
      1. `$contentID` is the ContentID value from the Unencoded license file (.xml). You can open the license file in a text editor of your choice.
      2. `$licenseBlob` is the entire string for the license blob in the Encoded license file (.bin). You can open the encoded license file in a text editor of your choice. 
3. Run the following script from an Admin PowerShell prompt. A good place to perform license installation is at the end of the [staging script](#stage-the-powershell-script) that also needs to be run from an Admin prompt.

```powershell
$namespaceName = "root\cimv2\mdm\dmmap"
$className = "MDM_EnterpriseModernAppManagement_StoreLicenses02_01"
$methodName = "AddLicenseMethod"
$parentID = "./Vendor/MSFT/EnterpriseModernAppManagement/AppLicenses/StoreLicenses"

#TODO - Update $contentID with the ContentID value from the unencoded license file (.xml)
$contentID = "{'ContentID'_in_unencoded_license_file}"

#TODO - Update $licenseBlob with the entire String in the encoded license file (.bin)
$licenseBlob = "{Entire_String_in_encoded_license_file}"

$session = New-CimSession 

#The final string passed into the AddLicenseMethod should be of the form <License Content="encoded license blob" />
$licenseString = '<License Content='+ '"' + $licenseBlob +'"' + ' />' 

$params = New-Object Microsoft.Management.Infrastructure.CimMethodParametersCollection
$param = [Microsoft.Management.Infrastructure.CimMethodParameter]::Create("param",$licenseString ,"String", "In")
$params.Add($param) 


try
{
   $instance = New-CimInstance -Namespace $namespaceName -ClassName $className -Property @{ParentID=$parentID;InstanceID=$contentID}
   $session.InvokeMethod($namespaceName, $instance, $methodName, $params)

}
catch [Exception]
{
     write-host $_ | out-string
}  
```

## Next steps

This feature isn't currently supported, but you can ask questions to the community at the [Windows Virtual Desktop TechCommunity](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).

You can also leave feedback for Windows Virtual Desktop at the [Windows Virtual Desktop feedback hub](https://support.microsoft.com/help/4021566/windows-10-send-feedback-to-microsoft-with-feedback-hub-app).
