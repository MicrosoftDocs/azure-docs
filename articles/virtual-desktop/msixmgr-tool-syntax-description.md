---
title: MSIXMGR tool parameters - Azure Virtual Desktop
description: This article contains the command line syntax to help you understand and get the most from the MSIXMGR tool. In this article, we'll show you the syntax of all the parameters used by the MSIXMGR tool.
author: fiza-microsoft
ms.author: fizaazmi
ms.topic: concept-article
ms.date: 04/04/2023
---

# MSIXMGR tool parameters

This article contains the command line syntax to help you understand and get the most from the MSIXMGR tool. In this article, we'll show you the syntax of all the parameters used by the MSIXMGR tool.  

## Prerequisites:

Before you can follow the instructions in this article, you'll need to do the following things:

- [Download the MSIXMGR tool](https://aka.ms/msixmgr)
- Get an MSIX-packaged application (.MSIX file)
- Get administrative permissions on the machine where you'll create the MSIX image 
- [Set up MSIXMGR tool](app-attach-msixmgr.md)

## Parameters

### -AddPackage or -p

Add the package at specified file path.

```
-AddPackage [Path to the MSIX package]
```

#### Example

```
msixmgr.exe -AddPackage "C:\SomeDirectory\myapp.msix"
```

|Optional parameters|Description|Example|
| -------- | -------- | -------- |
|-quietUX|Installs MSIX package silently, without any user interaction|`msixmgr.exe -AddPackage C:\SomeDirectory\myapp.msix -quietUX`|

### -RemovePackage or -x

Remove the package with specified package full name.

```
-RemovePackage [Package name]
```

#### Example

```
msixmgr.exe -RemovePackage myapp_0.0.0.1_x64__8wekyb3d8bbwe
```

|Optional parameters|Description|Example|
| -------- | -------- | -------- |
|-quietUX|Uninstalls MSIX package silently, without any user interaction|`msixmgr.exe -RemovePackage myapp_0.0.0.1_x64__8wekyb3d8bbwe -quietUX`|

### -FindPackage

Find a package with specific package full name.

```
-FindPackage [Package name]
```

#### Example

```
msixmgr.exe -FindPackage myapp_0.0.0.1_x64__8wekyb3d8bbwe
```

### -ApplyACLs

Applies ACLs to a package folder (an unpacked package).

```
-ApplyACLs -packagePath [Path to the package folder]
```

#### Example:

```
msixmgr.exe -ApplyACLs -packagePath "C:\SomeDirectory\name_version_arch_pub"
```

### -Unpack

Unpacks package (`.appx`, `.msix`, `.appxbundle`, `.msixbundle`) and extract its contents to a folder.

```
-Unpack -packagePath [Path to package to unpack OR path to a directory containing multiple packages to unpack] -destination [Directory to place the resulting package folder(s) in]
```

#### Example

To unpack a package into a directory:

```
msixmgr.exe -Unpack -packagePath "C:\SomeDirectory\myapp.msix" -destination "C:\Apps\myapp"
```

To unpack a package into a VHDX disk image:

```
msixmgr.exe -Unpack -packagePath "C:\SomeDirectory\myapp.msix" -destination "C:\Apps\myapp\myapp.vhdx" -applyACLs -create -filetype VHDX -rootDirectory apps
```

To unpack a package into a CIM disk image:

```
msixmgr.exe -Unpack -packagePath "C:\SomeDirectory\myapp.msix" -destination "C:\Apps\myapp\myapp.vhdx" -applyACLs -create -filetype CIM -rootDirectory apps
```

|Optional parameters|Description|Example|
| -------- | -------- | -------- |
|-applyacls|Applies ACLs to the resulting package folder(s) and their parent folder. |`msixmgr.exe -Unpack -packagePath "C:\SomeDirectory\myapp.msix" -destination "C:\Apps\myapp" -applyACLs` |
|-create|Creates a new image with the specified -filetype and unpacks the packages to that image. |`msixmgr.exe -Unpack -packagePath "C:\SomeDirectory\myapp.msix" -destination "C:\Apps\myapp" -applyACLs -create -fileType VHDX` |
|-fileType|The type of file to unpack packages to. Valid file types include `VHD`, `VHDX`, `CIM`. This is a required parameter when unpacking to CIM files. |`msixmgr.exe -Unpack -packagePath "C:\SomeDirectory\myapp.msix" -destination "C:\Apps\myapp" -applyACLs -create -fileType CIM -rootDirectory apps` |
|-rootDirectory|Specifies root directory on image to unpack packages to. Required parameter for unpacking to new and existing CIM files. |`msixmgr.exe -Unpack -packagePath "C:\SomeDirectory\myapp.msix" -destination "C:\Apps\myapp" -applyACLs -create -filetype CIM -rootDirectory apps` |
|-validateSignature|Validates a package's signature file before unpacking package. This parameter will require that the package's certificate is installed on the machine.<br /><br />For more information, see [Certificate Stores](/windows-hardware/drivers/install/certificate-stores).|`msixmgr.exe -Unpack -packagePath "C:\SomeDirectory\myapp.msix" -destination "C:\Apps\Myapp" -validateSignature -applyACLs`|

### -MountImage

Mounts the VHD, VHDX, or CIM image.

```
-MountImage -imagePath [Path to the MSIX image] -fileType [VHD | VHDX | CIM]
```

#### Example

```
msixmgr.exe -MountImage -imagePath "C:\SomeDirectory\myapp.cim" -fileType CIM
```

|Optional parameters|Description|Example|
| -------- | -------- | -------- |
|-readOnly|Boolean (true of false) indicating whether the image should be mounted as read only. If not specified, the image is mounted as read-only by default. |`msixmgr.exe -MountImage -imagePath "C:\SomeDirectory\myapp.cim" -filetype CIM -readOnly false`|

### -UnmountImage

Unmounts the VHD, VHDX, or CIM image.

```
-UnmountImage -imagePath [Path to the MSIX image] -fileType [VHD | VHDX | CIM]
```

#### Example:

```
msixmgr.exe -UnmountImage -imagePath "C:\SomeDirectory\myapp.vhdx" -fileType VHDX
```

|Optional parameters|Description|Example|
| -------- | -------- | -------- |
|-volumeId|Specifies GUID (specified without curly braces) associated with image to unmount. This is an optional parameter only for CIM files. |`msixmgr.exe -UnmountImage -volumeId 0ea000fe-0021-465a-887b-6dc94f15e86e -filetype CIM`|

### -?

Display help text at the command prompt.

#### Example:

```
msixmgr.exe -?
```

## Next steps

To learn more about MSIX app attach, check out these articles:

- [Using the MSIXMGR tool](app-attach-msixmgr.md)
- [What's new in the MSIXMGR tool](whats-new-msixmgr.md)
- [What is MSIX app attach?](what-is-app-attach.md)
- [Set up MSIX app attach with the Azure portal](app-attach-azure-portal.md)
- [Set up MSIX app attach using PowerShell](app-attach-powershell.md)
- [Create PowerShell scripts for MSIX app attach](app-attach.md)
- [Prepare an MSIX image for Azure Virtual Desktop](app-attach-image-prep.md)
- [Set up a file share for MSIX app attach](app-attach-file-share.md)

If you have questions about MSIX app attach, see our [App attach FAQ](app-attach-faq.yml) and [What is MSIX app attach?](what-is-app-attach.md).
