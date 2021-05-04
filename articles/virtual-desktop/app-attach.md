---
title: Configure Windows Virtual Desktop MSIX app attach PowerShell scripts - Azure
description: How to create PowerShell scripts for MSIX app attach for Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 04/13/2021
ms.author: helohr
manager: femila
---
# Create PowerShell scripts for MSIX app attach

This topic will walk you through how to set up PowerShell scripts for MSIX app attach.

## Install certificates

You must install certificates on all session hosts in the host pool that will host the apps from your MSIX app attach packages.

If your app uses a certificate that isn't public-trusted or was self-signed, here's how to install it:

1. Right-click the package and select **Properties**.
2. In the window that appears, select the **Digital signatures** tab. There should be only one item in the list on the tab. Select that item to highlight the item, then select **Details**.
3. When the digital signature details window appears, select the **General** tab, then select **View Certificate**, then select **Install certificate**.
4. When the installer opens, select **local machine** as your storage location, then select **Next**.
5. If the installer asks you if you want to allow the app to make changes to your device, select **Yes**.
6. Select **Place all certificates in the following store**, then select **Browse**.
7. When the select certificate store window appears, select **Trusted people**, then select **OK**.
8. Select **Next** and **Finish**.

## Enable Microsoft Hyper-V

Microsoft Hyper-V must be enabled because the `Mount-VHD` command is needed to stage and `Dismount-VHD` is needed to destage.

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

>[!NOTE]
>This change will require that you restart the virtual machine.

## Prepare PowerShell scripts for MSIX app attach

MSIX app attach has four distinct phases that must be performed in the following order:

1. Stage
2. Register
3. Deregister
4. Destage

Each phase creates a PowerShell script. Sample scripts for each phase are available [here](https://github.com/Azure/RDS-Templates/tree/master/msix-app-attach).

### Stage PowerShell script

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
          Mount-Diskimage -ImagePath $vhdSrc -NoDriveLetter -Access ReadOnly
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
    [Windows.Management.Deployment.PackageManager,Windows.Management.Deployment,ContentType=WindowsRuntime] | Out-Null
    Add-Type -AssemblyName System.Runtime.WindowsRuntime
    $asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where { $_.ToString() -eq 'System.Threading.Tasks.Task`1[TResult] AsTask[TResult,TProgress](Windows.Foundation.IAsyncOperationWithProgress`2[TResult,TProgress])'})[0]
    $asTaskAsyncOperation = $asTask.MakeGenericMethod([Windows.Management.Deployment.DeploymentResult], [Windows.Management.Deployment.DeploymentProgress])
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

For this script, replace the placeholder for **$packageName** with the name of the package you're testing. In a production deployment it would be best to run this on Shutdown.

```powershell
#MSIX app attach de staging sample

$vhdSrc="<path to vhd>"

#region variables
$packageName = "<package name>"
$msixJunction = "C:\temp\AppAttach"
#endregion

#region deregister
Remove-AppxPackage -AllUsers -Package $packageName
Remove-Item "$msixJunction\$packageName" -Recurse -Force -Verbose
#endregion

#region Detach VHD
Dismount-DiskImage -ImagePath $vhdSrc -Confirm:$false
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
3. Run the following script from an Admin PowerShell prompt. A good place to perform license installation is at the end of the [staging script](#stage-powershell-script) that also needs to be run from an Admin prompt.

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
