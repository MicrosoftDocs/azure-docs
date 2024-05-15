---
title: MSIXMGR tool parameters - Azure Virtual Desktop
description: Learn about the command line parameters and syntax you can use with the MSIXMGR tool.
ms.topic: conceptual
author: dknappettmsft
ms.author: daknappe
ms.date: 12/13/2023
---

# MSIXMGR tool parameters

This article contains the command line parameters and syntax you can use with the MSIXMGR tool.

## Prerequisites

To use the MSIXMGR tool, you need:

- [Download the MSIXMGR tool](https://aka.ms/msixmgr).
- Get an MSIX-packaged application (`.msix` file).
- A Windows device with administrative permissions to create the MSIX image.

## -AddPackage

Add the package at specified file path.

```
-AddPackage <Path to the MSIX package>
```

or

```
-p <Path to the MSIX package>
```

Here's an example of using the `-AddPackage` parameter:

```cmd
msixmgr.exe -AddPackage "C:\MSIX\myapp.msix"
```

## -RemovePackage

Remove the package with specified package full name.

```
-RemovePackage <Package name>
```

or

```
-x <Package name>
```

Here's an example of using the `-RemovePackage` parameter. You can find the package full name by running the PowerShell cmdlet [Get-AppxPackage](/powershell/module/appx/get-appxpackage).

```cmd
msixmgr.exe -RemovePackage myapp_0.0.0.1_x64__8wekyb3d8bbwe
```

## -FindPackage

Find a package with specific package full name.

```
-FindPackage <Package name>
```

Here's an example of using the `-FindPackage` parameter. You can find the package full name by running the PowerShell cmdlet [Get-AppxPackage](/powershell/module/appx/get-appxpackage).

```cmd
msixmgr.exe -FindPackage myapp_0.0.0.1_x64__8wekyb3d8bbwe
```

## -ApplyACLs

Apply ACLs to a package folder (an unpacked package). You also need to specify the following required subparameters:

| Required parameter | Description |
|--|--|
| `-packagePath` | The path to the package to unpack OR the path to a directory containing multiple packages to unpack |

```
-ApplyACLs -packagePath <Path to the package folder>
```

Here's an example of using the `-ApplyACLs` parameter:

```cmd
msixmgr.exe -ApplyACLs -packagePath "C:\MSIX\myapp_0.0.0.1_x64__8wekyb3d8bbwe"
```

## -Unpack

Unpack a package in one of the file formats `.appx`, `.msix`, `.appxbundle`, or `.msixbundle`, and extract its contents to a folder. You also need to specify the following required subparameters:

| Required parameter | Description |
|--|--|
| `-destination` | The directory to place the resulting package folder(s) in. |
| `-fileType` | The type of file to unpack packages to. Valid file types include `.vhd`, `.vhdx`, `.cim`. This parameter is only required when unpacking to CIM files. |
| `-packagePath` | The path to the package to unpack OR the path to a directory containing multiple packages to unpack. |
| `-rootDirectory` | Specifies root directory on image to unpack packages to. This parameter is only required when unpacking to new and existing CIM files. |

```
-Unpack -packagePath <Path to package to unpack OR path to a directory containing multiple packages to unpack> -destination <Directory to place the resulting package folder(s) in> -fileType <VHD | VHDX | CIM> -rootDirectory <Root directory on image to unpack packages to>
```

Here's some examples of using the `-Unpack` parameter:

- To unpack a package into a directory:

   ```cmd
   msixmgr.exe -Unpack -packagePath "C:\MSIX\myapp.msix" -destination "C:\Apps\myapp"
   ```

- To unpack a package into a VHDX disk image:

   ```cmd
   msixmgr.exe -Unpack -packagePath "C:\MSIX\myapp.msix" -destination "C:\Apps\myapp\myapp.vhdx" -applyACLs -create -filetype VHDX -rootDirectory apps
   ```

- To unpack a package into a CIM disk image:

   ```cmd
   msixmgr.exe -Unpack -packagePath "C:\MSIX\myapp.msix" -destination "C:\Apps\myapp\myapp.cim" -applyACLs -create -filetype CIM -rootDirectory apps
   ```

Here are the optional parameters you can use with the `-Unpack` parameter:

| Optional parameter | Description | Example |
|--|--|--|
| `-applyACLs` | Applies ACLs to the resulting package folder(s) and their parent folder. | `msixmgr.exe -Unpack -packagePath "C:\MSIX\myapp.msix" -destination "C:\Apps\myapp" -applyACLs` |
| `-create` | Creates a new image with the specified file type and unpacks the packages to that image. Requires the `-filetype` parameter. | `msixmgr.exe -Unpack -packagePath "C:\MSIX\myapp.msix" -destination "C:\Apps\myapp" -applyACLs -create -fileType VHDX` |
| `-fileType` | The type of file to unpack packages to. Valid file types include `VHD`, `VHDX`, `CIM`. This parameter is required when unpacking to CIM files. Requires the `-create` parameter. | `msixmgr.exe -Unpack -packagePath "C:\MSIX\myapp.msix" -destination "C:\Apps\myapp" -applyACLs -create -fileType CIM -rootDirectory apps` |
| `-rootDirectory` | Specifies the root directory on image to unpack packages to. This parameter is required when unpacking to new and existing CIM files. | `msixmgr.exe -Unpack -packagePath "C:\MSIX\myapp.msix" -destination "C:\Apps\myapp" -applyACLs -create -filetype CIM -rootDirectory apps` |
| `-validateSignature` | Validates a package's signature file before unpacking package. This parameter requires that the package's certificate is installed on the machine.<br /><br />For more information, see [Certificate Stores](/windows-hardware/drivers/install/certificate-stores). | `msixmgr.exe -Unpack -packagePath "C:\MSIX\myapp.msix" -destination "C:\Apps\Myapp" -validateSignature -applyACLs` |
| `-vhdSize` | The desired size of the `.vhd` or `.vhdx` file in MB. Must be between 5 MB and 2040000 MB. Use only for `.vhd` or `.vhdx` files. Requires the `-create` and `-filetype` parameters. | `msixmgr.exe -Unpack -packagePath "C:\MSIX\myapp.msix" -destination "C:\Apps\myapp" -create -fileType VHDX -vhdSize 500` |

## -MountImage

Mount a VHD, VHDX, or CIM image. You also need to specify the following required subparameters:

| Required parameter | Description |
|--|--|
| `-fileType` | The type of file to unpack packages to. Valid file types include `VHD`, `VHDX`, `CIM`. |
| `-imagePath` | The path to the image file to mount. |

```
-MountImage -imagePath <Path to the MSIX image> -fileType <VHD | VHDX | CIM>
```

Here's an example of using the `-MountImage` parameter:

```cmd
msixmgr.exe -MountImage -imagePath "C:\MSIX\myapp.cim" -fileType CIM
```

Here are the optional parameters you can use with the `-MountImage` parameter:

| Optional parameter | Description | Example |
|--|--|--|
| `-readOnly` | Boolean (true of false) indicating whether the image should be mounted as read only. If not specified, the image is mounted as read-only by default. | `msixmgr.exe -MountImage -imagePath "C:\MSIX\myapp.cim" -filetype CIM -readOnly false` |

## -UnmountImage

Unmount a VHD, VHDX, or CIM image. You also need to specify the following required subparameters:

| Required parameter | Description |
|--|--|
| `-fileType` | The type of file to unpack packages to. Valid file types include `VHD`, `VHDX`, `CIM`. |
| `-imagePath` | The path to the image file to mount. |

```
-UnmountImage -imagePath <Path to the MSIX image> -fileType <VHD | VHDX | CIM>
```

Here's an example of using the `-UnmountImage` parameter:

```cmd
msixmgr.exe -UnmountImage -imagePath "C:\MSIX\myapp.vhdx" -fileType VHDX
```

Here are the optional parameters you can use with the `-UnmountImage` parameter:

| Optional parameter | Description | Example |
|--|--|--|
| `-volumeId` | The GUID of the volume (specified without curly braces) associated with the image to unmount. This parameter is optional only for CIM files. You can find volume ID by running the PowerShell cmdlet [Get-Volume](/powershell/module/storage/get-volume). | `msixmgr.exe -UnmountImage -volumeId 199a2f93-99a8-11ee-9b0d-4c445b63adac -filetype CIM` |

## -quietUX

Suppresses user interaction when running the MSIXMGR tool. This parameter is optional and can be used with any other parameter.

Here's an example of using the `-quietUX` parameter with the `-AddPackage` parameter:

```cmd
msixmgr.exe -AddPackage "C:\MSIX\myapp.msix" -quietUX
```

## Next steps

To learn more about MSIX app attach, check out these articles:

- [Create an MSIX image to use with app attach](app-attach-create-msix-image.md)
- [What's new in the MSIXMGR tool](whats-new-msixmgr.md)
- [MSIX app attach and app attach](app-attach-overview.md)
- [Add and manage MSIX app attach and app attach applications](app-attach-setup.md)
- [Test MSIX packages for app attach](app-attach-test-msix-packages.md)
