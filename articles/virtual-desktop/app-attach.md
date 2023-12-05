---
title: Test and troubleshoot MSIX packages with app attach - Azure
description: Learn how to use MSIX app attach to mount disk images for testing and troubleshooting outside of Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 02/07/2023
ms.author: helohr
manager: femila
---
# Test and troubleshoot MSIX packages with MSIX app attach

This article will show you how to use MSIX app attach to mount MSIX packages outside of Azure Virtual Desktop for testing and troubleshooting.

To use MSIX app attach with Azure Virtual Desktop, you can use [the Azure portal](app-attach-azure-portal.md) or [Azure PowerShell](app-attach-powershell.md) to add and publish applications.

## Prerequisites

Before you can use MSIX app attach to follow the directions in this article, you'll need the following things:

- A Windows 10 or 11 client.
- An application you've expanded from MSIX format into app attach format. To learn how to expand an MSIX application, see [Using the MSIXMGR tool](app-attach-msixmgr.md).
- If you're using a CimFS image, you'll need to install the following module before you can get started:
  
   ```powershell
   Install-Module CimDiskImage
   Import-Module CimDiskImage
   ```

These instructions don't require an Azure Virtual Desktop deployment because they describe a process for testing outside of Azure Virtual Desktop.

>[!NOTE]
>Microsoft Support doesn't currently support this CimFS disk image module, so if you run into any problems, you'll need to submit a request on [the module's GitHub repository](https://github.com/Azure/RDS-Templates/tree/master/msix-app-attach).

## Phases of MSIX app attach

To use MSIX packages outside of Azure Virtual Desktop, there are four distinct phases that you must perform in the following order, otherwise it won't work:

1. Stage
2. Register
3. Deregister
4. Destage

Staging and destaging are machine-level operations, while registering and deregistering are user-level operations. The commands you'll need to use will vary based on which version of PowerShell you're using and whether your disk images are in *CimFS* or *VHD(X)* format.

>[!NOTE]
>All MSIX application packages include a certificate. You're responsible for making sure the certificates for MSIX applications are trusted in your environment.

## Stage the MSIX package

The staging script prepares your machine to receive the MSIX package and mounts the relevant package to your machine. You'll only need to run the following commands once per machine.

However, if you're using an image in CimFS format or a version of PowerShell greater than 5.1, the instructions will look a bit different. Later versions of PowerShell are multi-platform, which means the Windows application parts are split off into their own package called [Windows Runtime](/windows/uwp/winrt-components/). You'll need to use a slightly different version of the commands to install a package with a multi-platform version of PowerShell.

You'll need to run PowerShell as an Administrator to run the commands in the following sections.

Next, you'll need to decide which instructions you need to follow to stage your package based on which version of PowerShell you're using.

### PowerShell 6 and later

To stage packages at boot using PowerShell 6 or later, you'll need to run the following commands before the staging operations to bring the capabilities of the Windows Runtime package you previously installed into the PowerShell session.

1. First, run this command to get the Windows Runtime Package:

   ```powershell
   #Required for PowerShell 6 and later
   $nuGetPackageName = 'Microsoft.Windows.SDK.NET.Ref'
   Register-PackageSource -Name MyNuGet -Location https://www.nuget.org/api/v2 -ProviderName NuGet
   Find-Package $nuGetPackageName | Install-Package
   ```

1. Next, run the following command to make the Windows Runtime components available in your PowerShell session.

   ```powershell
   #Required for PowerShell 6 and later
   $nuGetPackageName = 'Microsoft.Windows.SDK.NET.Ref'
   $winRT = Get-Package $nuGetPackageName
   $dllWinRT = Get-Childitem (Split-Path -Parent $winRT.Source) -Recurse -File WinRT.Runtime.dll
   $dllSdkNet = Get-Childitem (Split-Path -Parent $winRT.Source) -Recurse -File Microsoft.Windows.SDK.NET.dll
   Add-Type -AssemblyName $dllWinRT.FullName
   Add-Type -AssemblyName $dllSdkNet.FullName
   ```

### PowerShell 5.1 and earlier

To stage packages at boot with PowerShell version 5.1 or earlier, run this command:

   ```powershell
   #Required for PowerShell versions less than or equal to 5.1
   [Windows.Management.Deployment.PackageManager,Windows.Management.Deployment,ContentType=WindowsRuntime] | Out-Null
   Add-Type -AssemblyName System.Runtime.WindowsRuntime
   ```

## Mount your disk image

Now that you've prepared your machine to stage MSIX app attach packages, you'll need to mount your disk image. This process will vary depending on whether you're using the *VHD(X)* or *CimFs* format for your disk image.

>[!NOTE]
>Make sure to record the *Device Id* for each application in the command output. You'll need this information to follow directions later in this article.

### [CimFS](#tab/cimfs)

To mount a CimFS disk image:

1. Run this command:

   ```powershell
   $diskImage = "<UNC path to the Disk Image>"

   $mount = Mount-CimDiskimage -ImagePath $diskImage -PassThru -NoMountPath

   #We can now get the Device Id for the mounted volume, this will be useful for the destage step.
   $DeviceId = $mount.DeviceId
   Write-Output $DeviceId
   ```

2. When you're done, proceed to [Finish staging your disk image](#finish-staging-your-disk-image).

### [VHD(X)](#tab/vhdx)

To mount a VHD(X) disk image:

1. Run this command:

   ```powershell
   $diskImage = "<UNC path to the Disk Image>"

   $mount = Mount-Diskimage -ImagePath $diskImage -PassThru -NoDriveLetter -Access ReadOnly

   #We can now get the Device Id for the mounted volume, this will be useful for the destage step. 
   $partition = Get-Partition -DiskNumber $mount.Number
   $DeviceId = $partition.AccessPaths
   Write-Output $DeviceId
   ```

1. When you're done, proceed to [Finish staging your disk image](#finish-staging-your-disk-image).
---

### Finish staging your disk image

Finally, you'll need to run the following command for all image formats to complete staging the disk image. This command will use the `$DeviceId` variable you created when you mounted your disk image in the previous section.

```powershell
#Once the volume is mounted we can retrieve the application information
$manifest = Get-Childitem -LiteralPath $DeviceId -Recurse -File AppxManifest.xml
$manifestFolder = $manifest.DirectoryName

#We can now get the MSIX package full name, this will be needed for later steps.
$msixPackageFullName = $manifestFolder.Split('\')[-1]
Write-Output $msixPackageFullName

#We need to create an absolute uri for the manifest folder for the Package Manager API
$folderUri = $maniFestFolder.Replace('\\?\','file:\\\')
$folderAbsoluteUri = ([Uri]$folderUri).AbsoluteUri

#Package Manager will now use the absolute uri to stage the application package
$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.ToString() -eq 'System.Threading.Tasks.Task`1[TResult] AsTask[TResult,TProgress](Windows.Foundation.IAsyncOperationWithProgress`2[TResult,TProgress])' })[0]
$asTaskAsyncOperation = $asTask.MakeGenericMethod([Windows.Management.Deployment.DeploymentResult], [Windows.Management.Deployment.DeploymentProgress])

$packageManager = New-Object -TypeName Windows.Management.Deployment.PackageManager

$asyncOperation = $packageManager.StagePackageAsync($folderAbsoluteUri, $null, "StageInPlace")
$stagingResult = $asTaskAsyncOperation.Invoke($null, @($asyncOperation))

#You can check the $stagingResult variable to  monitor the staging progress for the application package
Write-Output $stagingResult
```

Your MSIX package is now ready to be registered.

## Register the MSIX package

To register your MSIX package, run the following PowerShell cmdlets with the placeholder values replaced with values that apply to your environment.

The `$msixPackageFullName` parameter should be the full name of the package from the previous section, but the format should be similar to the following example: `Publisher.Application_version_Platform__HashCode`.

If you didn't retrieve the parameter after staging your app, you can also find it as the folder name for the app itself in **C:\Program Files\WindowsApps**.

```powershell
$msixPackageFullName = "<package full name>"

$manifestPath = Join-Path (Join-Path $Env:ProgramFiles 'WindowsApps') (Join-Path $msixPackageFullName AppxManifest.xml)
Add-AppxPackage -Path $manifestPath -DisableDevelopmentMode -Register
```

Now that your MSIX package is registered, your application should be available for use in your session. You can now open the application for testing and troubleshooting.

## Deregister the MSIX package

If you're finished with your package and are ready to remove it, now it's time to deregister it. In order to deregister, you'll need the `$msixPackageFullName` parameter again.

To deregister your package, run the following command after replacing the placeholder text with the relevant values:

```powershell
$msixPackageFullName = "<package full name>"

Remove-AppxPackage $msixPackageFullName -PreserveRoamableApplicationData
```

## Destage the MSIX package

To destage your MSIX package, make sure you're running an elevated PowerShell prompt. You'll need to run the following PowerShell command to get the disk's `DeviceId` parameter. Replace the placeholder for `$packageFullName` with the name of the package you're testing. In a production deployment, we recommend only running this command when shutting down your system.

```powershell
$msixPackageFullName = "<package full name>"

#If you don't know the DeviceId of the mounted disk, you can find it using the following code.
$appPath = Join-Path (Join-Path $Env:ProgramFiles 'WindowsApps') $msixPackageFullName
$folderInfo = Get-Item $appPath
$DeviceId = '\\?\' + $folderInfo.LinkTarget.Split('\')[0] +'\'
Write-Output $DeviceId #Save this for later

Remove-AppxPackage -AllUsers -Package $msixPackageFullName
Remove-AppxPackage -Package $msixPackageFullName
```

### Dismount the disks from the system

To finish the destaging process, you'll need to dismount the disks from the system. The command you'll need to use depends on the format of your disk image.

### [CimFS](#tab/cimfs)

If your image is in CimFS format, run this cmdlet:

```powershell
DisMount-CimDiskimage -DeviceId $DeviceId
```

### [VHD(X)](#tab/vhdx)

If your image is in VHD(X) format, run this cmdlet:

```powershell
DisMount-DiskImage -DevicePath $DeviceId.TrimEnd('\')
```

---

Once you finish dismounting your disks, you've safely removed your MSIX package.

## Set up simulation scripts for the MSIX app attach agent

If you want to add and remove MSIX packages automatically, you can use the PowerShell commands in this article to create scripts that run at startup, logon, logoff, and shutdown. To learn more about these types of scripts, see [Using startup, shutdown, logon, and logoff scripts in Group Policy](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn789196(v=ws.11)/).

Each of these automatic scripts runs one phase of the app attach scripts:

- The startup script runs the stage script.
- The logon script runs the register script.
- The logoff script runs the deregister script.
- The shutdown script runs the destage script.

>[!NOTE]
>You can run the task scheduler with the stage script. To run the script, set the task trigger to **When the computer starts**, then enable **Run with highest privileges**.

## Use packages offline

If you're using packages from the [Microsoft Store for Business](https://businessstore.microsoft.com/) or the [Microsoft Store for Education](https://educationstore.microsoft.com/) within your network or on devices that aren't connected to the internet, you need to get the package licenses from the Microsoft Store and install them on your device to successfully run the app. If your device is online and can connect to the Microsoft Store for Business, the required licenses should download automatically, but if you're offline, you'll need to set up the licenses manually.

To install the license files, you'll need to use a PowerShell script that calls the MDM_EnterpriseModernAppManagement_StoreLicenses02_01 class in the WMI Bridge Provider.

Here's how to set up the licenses for offline use:

1. Download the app package, licenses, and required frameworks from the Microsoft Store for Business. You need both the encoded and unencoded license files. Detailed download instructions can be found [here](/microsoft-store/distribute-offline-apps#download-an-offline-licensed-app).
1. Update the following variables in the script for step 3:
      - `$contentID` is the ContentID value from the Unencoded license file (.xml). You can open the license file in a text editor of your choice.
      - `$licenseBlob` is the entire string for the license blob in the Encoded license file (.bin). You can open the encoded license file in a text editor of your choice.
2. Run the following script from PowerShell running as an administrator. A good place to perform license installation is at the end of the [staging phase](#stage-the-msix-package) because at that point you also need to run PowerShell as an administrator.

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

## Demonstration scripts

You can find demonstration scripts for all four stages of the MSIX App Attach package process and syntax help for how to use them at [our template](https://github.com/Azure/RDS-Templates/tree/master/msix-app-attach). These scripts will work with any version of PowerShell and any disk image format.

## Next steps

If you have any questions, you can ask them at the [Azure Virtual Desktop TechCommunity](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).

You can also leave feedback for Azure Virtual Desktop at the [Azure Virtual Desktop feedback hub](https://support.microsoft.com/help/4021566/windows-10-send-feedback-to-microsoft-with-feedback-hub-app).
