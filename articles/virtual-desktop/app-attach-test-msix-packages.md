---
title: Test and troubleshoot MSIX packages for app attach - Azure
description: Learn how to mount disk images for testing and troubleshooting outside of Azure Virtual Desktop.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 01/25/2024
---

# Test MSIX packages for app attach

This article shows you how to mount MSIX packages outside of Azure Virtual Desktop to help test your packages for app attach. The APIs that power app attach are available for Windows 11 Enterprise and Windows 10 Enterprise. These APIs can be used outside of Azure Virtual Desktop for testing, however there's no management plane for MSIX app attach or app attach outside of Azure Virtual Desktop.

For more information about MSIX app attach and app attach, see [MSIX app attach and app attach in Azure Virtual Desktop](app-attach-overview.md).

## Prerequisites

Before you can test a package to follow the directions in this article, you need the following things:

- A device running Windows 11 Enterprise or Windows 10 Enterprise.

- An application you expanded from MSIX format into an image you can use with app attach. Learn how to [Create an MSIX image to use with app attach in Azure Virtual Desktop](app-attach-create-msix-image.md).

- If you're using a CimFS image, you need to install the [CimDiskImage PowerShell module](https://www.powershellgallery.com/packages/CimDiskImage).

- A user account that has local administrator permission on the device you're using to test the MSIX package.

You don't need an Azure Virtual Desktop deployment because this article describes a process for testing outside of Azure Virtual Desktop.

> [!NOTE]
> Microsoft Support doesn't support CimDiskImage PowerShell module, so if you run into any problems, you'll need to submit a request on [the module's GitHub repository](https://github.com/Azure/RDS-Templates/tree/master/msix-app-attach).

## Phases

To use MSIX packages outside of Azure Virtual Desktop, there are four distinct phases that you must perform in the following order:

1. Stage
2. Register
3. Deregister
4. Destage

Staging and destaging are machine-level operations, while registering and deregistering are user-level operations. The commands you need to use vary based on which version of PowerShell you're using and whether your disk images are in *CimFS*, *VHDX* or *VHD* format.

> [!NOTE]
> All MSIX packages include a certificate. You're responsible for making sure the certificates for MSIX packages are trusted in your environment.

## Prepare to stage an MSIX package

The staging script prepares your machine to receive the MSIX package and mounts the relevant package to your machine.

Select the relevant tab for the version of PowerShell you're using.

# [PowerShell 6 and later](#tab/posh6)

To stage packages using PowerShell 6 or later, you need to run the following commands before the staging operations to bring the capabilities of the Windows Runtime package to PowerShell.

1. Open a PowerShell prompt as an administrator.

1. Run the following command to download and install the Windows Runtime Package. You only need to run the following commands once per machine.

   ```powershell
   #Required for PowerShell 6 and later
   $nuGetPackageName = 'Microsoft.Windows.SDK.NET.Ref'
   Register-PackageSource -Name MyNuGet -Location https://www.nuget.org/api/v2 -ProviderName NuGet
   Find-Package $nuGetPackageName | Install-Package
   ```

1. Next, run the following command to make the Windows Runtime components available in PowerShell:

   ```powershell
   #Required for PowerShell 6 and later
   $nuGetPackageName = 'Microsoft.Windows.SDK.NET.Ref'
   $winRT = Get-Package $nuGetPackageName
   $dllWinRT = Get-ChildItem (Split-Path -Parent $winRT.Source) -Recurse -File WinRT.Runtime.dll
   $dllSdkNet = Get-ChildItem (Split-Path -Parent $winRT.Source) -Recurse -File Microsoft.Windows.SDK.NET.dll
   Add-Type -AssemblyName $dllWinRT.FullName
   Add-Type -AssemblyName $dllSdkNet.FullName
   ```

# [PowerShell 5.1 and earlier](#tab/posh5)

To stage packages with PowerShell version 5.1 or earlier, you need to run the following command before the staging operations to bring the capabilities of the Windows Runtime package to PowerShell.

1. Open a PowerShell prompt as an administrator.

1. Run the following command to make the Windows Runtime components available in PowerShell:

   ```powershell
   #Required for PowerShell versions less than or equal to 5.1
   [Windows.Management.Deployment.PackageManager,Windows.Management.Deployment,ContentType=WindowsRuntime] | Out-Null
   Add-Type -AssemblyName System.Runtime.WindowsRuntime
   ```

---

## Stage an MSIX package

Now that you prepared your machine to stage MSIX packages, you need to mount your disk image, then finish staging your MSIX package.

### Mount a disk image

The process to mount a disk image varies depending on whether you're using the *CimFs*, *VHDX*, or *VHD* format for your disk image. Select the relevant tab for the format you're using.

# [CimFS](#tab/cimfs)

To mount a CimFS disk image:

1. In the same PowerShell session, run the following command:

   ```powershell
   $diskImage = "<Local or UNC path to the disk image>"

   $mount = Mount-CimDiskImage -ImagePath $diskImage -PassThru -NoMountPath

   #We can now get the Device Id for the mounted volume, this will be useful for the destage step.
   $deviceId = $mount.DeviceId
   Write-Output $deviceId
   ```

1. Keep the variable `$deviceId`. You need this information later in this article.

1. When you're done, proceed to [Finish staging a disk image](#finish-staging-a-disk-image).

# [VHDX or VHD](#tab/vhdx)

To mount a VHDX or VHD disk image:

1. In the same PowerShell session, run the following command:

   ```powershell
   $diskImage = "<Local or UNC path to the disk image>"

   $mount = Mount-DiskImage -ImagePath $diskImage -PassThru -NoDriveLetter -Access ReadOnly

   #We can now get the Device Id for the mounted volume, this will be useful for the destage step. 
   $partition = Get-Partition -DiskNumber $mount.Number
   $deviceId = $partition.AccessPaths
   Write-Output $deviceId
   ```

1. Keep the variable `$deviceId`. You need this information later in this article.

1. When you're done, proceed to [Finish staging a disk image](#finish-staging-a-disk-image).

---

### Finish staging a disk image

Finally, you need to run the following commands for all image formats to complete staging the disk image. This command uses the `$deviceId` variable you created when you mounted your disk image in the previous section.

1. In the same PowerShell session, retrieve the application information by running the following commands:

   ```powershell
   $manifest = Get-ChildItem -LiteralPath $deviceId -Recurse -File AppxManifest.xml
   $manifestFolder = $manifest.DirectoryName
   ```

1. Get the MSIX package full name and store it in a variable by running the following commands. This variable is needed for later steps.

   ```powershell
   $msixPackageFullName = $manifestFolder.Split('\')[-1]
   Write-Output $msixPackageFullName
   ```

1. Create an absolute URI for the manifest folder for the Package Manager API by running the following commands:

   ```powershell
   $folderUri = $maniFestFolder.Replace('\\?\','file:\\\')
   $folderAbsoluteUri = ([Uri]$folderUri).AbsoluteUri
   ```

1. Use the absolute URI to stage the application package by running the following commands:

   ```powershell
   $asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.ToString() -eq 'System.Threading.Tasks.Task`1[TResult] AsTask[TResult,TProgress](Windows.Foundation.IAsyncOperationWithProgress`2[TResult,TProgress])' })[0]
   $asTaskAsyncOperation = $asTask.MakeGenericMethod([Windows.Management.Deployment.DeploymentResult], [Windows.Management.Deployment.DeploymentProgress])
   
   $packageManager = New-Object -TypeName Windows.Management.Deployment.PackageManager
   
   $asyncOperation = $packageManager.StagePackageAsync($folderAbsoluteUri, $null, "StageInPlace")
   ```

1. Monitor the staging progress for the application package by running the following commands. The time it takes to stage the package depends on its size. The `Status` property of the `$stagingResult` variable will be `RanToCompletion` when the staging is complete.

   ```powershell
   $stagingResult = $asTaskAsyncOperation.Invoke($null, @($asyncOperation))

   while ($stagingResult.Status -eq "WaitingForActivation") {
       Write-Output "Waiting for activation..."
       Start-Sleep -Seconds 5
   }

   Write-Output $stagingResult
   ```

Once your MSI package is staged, you can register your MSIX package.

## Register an MSIX package

To register an MSIX package, run the following commands in the same PowerShell session. This command uses the `$msixPackageFullName` variable created in a previous section.

```powershell
$manifestPath = Join-Path (Join-Path $Env:ProgramFiles 'WindowsApps') (Join-Path $msixPackageFullName AppxManifest.xml)
Add-AppxPackage -Path $manifestPath -DisableDevelopmentMode -Register
```

Now that your MSIX package is registered, your application should be available for use in your session. You can now open the application for testing and troubleshooting. Once you're finished, you need to deregister and destage your MSIX package.

## Deregister an MSIX package

Once you're finished with your MSIX package and are ready to remove it, first you need to deregister it. To deregister the MSIX package, run the following commands in the same PowerShell session. These commands get the disk's `DeviceId` parameter again, and removes the package using the `$msixPackageFullName` variable created in a previous section.

```powershell
$appPath = Join-Path (Join-Path $Env:ProgramFiles 'WindowsApps') $msixPackageFullName
$folderInfo = Get-Item $appPath
$deviceId = '\\?\' + $folderInfo.Target.Split('\')[0] +'\'
Write-Output $deviceId #Save this for later

Remove-AppxPackage $msixPackageFullName -PreserveRoamableApplicationData
```

## Destage an MSIX package

Finally, to destage the MSIX package, you need to dismount your disk image, run the following command in the same PowerShell session to ensure that the package isn't still registered for any user. This command uses the `$msixPackageFullName` variable created in a previous section.

```powershell
Remove-AppxPackage -AllUsers -Package $msixPackageFullName -ErrorAction SilentlyContinue
```

### Dismount the disks image

To finish the destaging process, you need to dismount the disks from the system. The command you need to use depends on the format of your disk image. Select the relevant tab for the format you're using.

### [CimFS](#tab/cimfs)

To dismount a CimFS disk image, run the following commands in the same PowerShell session:

```powershell
Dismount-CimDiskImage -DeviceId $deviceId
```

### [VHDX or VHD](#tab/vhdx)

To dismount a VHDX or VHD disk image, run the following command in the same PowerShell session:

```powershell
Dismount-DiskImage -DevicePath $deviceId.TrimEnd('\')
```

---

Once you finished dismounting your disks, you've safely removed your MSIX package.

## Set up simulation scripts for the MSIX app attach agent

If you want to add and remove MSIX packages to your device automatically, you can use the PowerShell commands in this article to create scripts that run at startup, logon, logoff, and shutdown. To learn more, see [Using startup, shutdown, logon, and logoff scripts in Group Policy](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn789196(v=ws.11)/). You need to make sure that any variables required for each phase are available in each script.

You create a script for each phase:

- The startup script runs the *stage* process.
- The logon script runs the *register* process.
- The logoff script runs the *deregister* process.
- The shutdown script runs the *destage* process.

> [!NOTE]
> You can use task scheduler to run the stage script. To run the script, set the task trigger to **When the computer starts** and enable **Run with highest privileges**.

## Use packages offline

If you're using packages from the [Microsoft Store for Business](https://businessstore.microsoft.com/) or the [Microsoft Store for Education](https://educationstore.microsoft.com/) on devices that aren't connected to the internet, you need to get the package licenses from the Microsoft Store and install them on your device to successfully run the app. If your device is online and can connect to the Microsoft Store for Business, the required licenses should download automatically, but if you're offline, you need to set up the licenses manually.

To install the license files, you need to use a PowerShell script that calls the `MDM_EnterpriseModernAppManagement_StoreLicenses02_01` class in the WMI Bridge Provider.

Here's how to set up a license for offline use:

1. Download the app package, license, and required frameworks from the Microsoft Store for Business. You need both the encoded and unencoded license files. To learn how to download an offline-licensed app, see [Distribute offline apps](/microsoft-store/distribute-offline-apps#download-an-offline-licensed-app).

1. Run the following PowerShell commands as an administrator. You can install the license is at the end of the [staging phase](#stage-an-msix-package). You need to edit the following variables:
   - `$contentID` is the ContentID value from the unencoded license file (`.xml`). You can open the license file in a text editor of your choice.
   - `$licenseBlob` is the entire string for the license blob in the Encoded license file (`.bin`). You can open the encoded license file in a text editor of your choice.

      ```powershell
      $namespaceName = "root\cimv2\mdm\dmmap"
      $className = "MDM_EnterpriseModernAppManagement_StoreLicenses02_01"
      $methodName = "AddLicenseMethod"
      $parentID = "./Vendor/MSFT/EnterpriseModernAppManagement/AppLicenses/StoreLicenses"
      
      #Update $contentID with the ContentID value from the unencoded license file (.xml)
      $contentID = "{'ContentID'_in_unencoded_license_file}"
      
      #Update $licenseBlob with the entire String in the encoded license file (.bin)
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
          Write-Host $_ | Out-String
      }
      ```

## Demonstration scripts

You can find demonstration scripts for all four stages of testing MSIX packages and syntax help for how to use them in our [GitHub repository](https://github.com/Azure/RDS-Templates/tree/master/msix-app-attach). These scripts work with any version of PowerShell and any disk image format.

## Next steps

Learn more about MSIX app attach and app attach in Azure Virtual Desktop:

- [MSIX app attach and app attach](app-attach-overview.md).
- [Add and manage MSIX app attach and app attach applications](app-attach-setup.md).
