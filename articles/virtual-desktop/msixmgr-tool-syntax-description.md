---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title:       MSIXMGR tool parameters 
titleSuffix: Azure
description: This article contains an overview of the command-line syntax to help you understand and get the most from the MSIXMGR Tool. In this documentation, we’ll expand the syntax of all the parameters used by the MSIXMGR tool.  
author:      fiza-microsoft # GitHub alias
ms.author:   fizaazmi # Microsoft alias
#ms.prod:     windows #ms.prod
ms.topic:    concept-article
ms.date:     03/21/2023
---

# MSIXMGR Tool parameters


This article contains an overview of the command-line syntax to help you understand and get the most from the MSIXMGR Tool. In this documentation, we expand the syntax of all the parameters used by the MSIXMGR tool.  

## Prerequisites:

Before you can follow the instructions in this article, you'll need to do the following things:

- [Download the MSIXMGR tool](https://aka.ms/msixmgr)
- Get an MSIX-packaged application (.MSIX file)
- Get administrative permissions on the machine where you'll create the MSIX image 
- [Set up MSIXMGR tool](/azure/virtual-desktop/app-attach-msixmgr)

## Syntax

  

**-AddPackage or -p**  
Adds package at specified file path  
Example:  
-AddPackage [path to the MSIX package] [optional arguments]
```
msixmgr.exe -AddPackage C:\SomeDirectory\notepadplus.msix
```

|Optional parameters|Description|Example|
| -------- | -------- | -------- |
|-QuietUX|Installs MSIX package silently, without any user interaction|`msixmgr.exe -AddPackage C:\SomeDirectory\notepadplus.msix -QuietUX`  |

**-RemovePackage or -x**  
Removes package with specified package full name  
Example:   
-RemovePackage [Package Name] [optional arguments]

```
msixmgr.exe -RemovePackage notepadplus_0.0.0.1_x64__8wekyb3d8bbwe
```

|Optional parameters|Description|Example|
| -------- | -------- | -------- |
|-QuietUX|Uninstalls MSIX package silently, without any user interaction|`msixmgr.exe -RemovePackage notepadplus_0.0.0.1_x64__8wekyb3d8bbwe msix `-QuietUX  |











**- FindPackage**  
Finds package with specific package full name  
Example:

```
msixmgr.exe -FindPackage notepadplus_0.0.0.1_x64__8wekyb3d8bbwe
```

 

**-applyacls**  
Applies ACLs to a package folder (an unpacked package)  
Example:

```
msixmgr.exe -applyacls
```

|Optional parameters|Description|Example|
| -------- | -------- | -------- |
|-packagePath|Specifies path to folder to apply ACLs to  |`msixmgr.exe -applyacls -packagePath C:\name_version_arch_pub` |

 

**-MountImage**  
Mounts VHD, VHDX, or CIM image  
Example:  
-MountImage [path to the MSIX package] [optional arguments]

```
msixmgr.exe -MountImage 
```

|Optional parameters|Description|Example|
| -------- | -------- | -------- |
|-imagePath|Specifies path to image file to mount or unmount|`x`|
|-filetype |Specifies type of file to mount or unmount. The following file types are currently supported: {VHD, VHDX, CIM}|`msixmgr.exe -MountImage -imagePath "C:\Users\User\abc\xyz.cim" -filetype "cim" `|
|-readOnly|Boolean (true of false) indicating whether a VHD(X) should be mounted as read only. If not specified, the image is mounted as read-only by default  |`msixmgr.exe -MountImage -imagePath "C:\Users\User\abc\xyz.cim" -filetype "cim" -readOnly false`|









**-UnmountImage**  
Unmounts VHD, VHDX, or CIM image  
Example:  
-UnmountImage [path to the MSIX package] [optional arguments]
```
msixmgr.exe -UnmountImage
```

|Optional parameters|Description|Example|
| -------- | -------- | -------- |
|-imagePath|Specifies path to image file to mount or unmount  |`msixmgr.exe -UnmountImage -imagePath C:\Users\User\abc\xyz.cim`|
|-filetype  |Specifies type of file to mount or unmount. The following file types are currently supported: {VHD, VHDX, CIM}  |`msixmgr.exe -UnmountImage -imagePath C:\Users\User\abc\xyz.cim -filetype “cim”` ` `|
|-volumeid|Specifies GUID (specified without curly braces) associated with image to unmount.   -volumeid is an optional parameter only for CIM files|`msixmgr.exe -UnmountImage -volumeid 0ea000fe-0021-465a-887b-6dc94f15e86e -filetype “cim”`|

 

**-Unpack**  
Unpacks package (.appx, .msix, .appxbundle, .msixbundle) and extract its contents to a folder.   
> [!NOTE]
> VHD Size is recommended to be four times the size of MSIX package  

Example:  
For CimFS:
```
msixmgr.exe -Unpack -packagePath "C:\Users\ssa\Desktop\FileZillaChanged_3.51.1.0_x64__81q6ced8g4aa0.msix" -destination "c:\temp\FileZillaChanged.cim" -applyacls -create -vhdSize 200 -filetype "cim" -rootDirectory apps
```

  
For VHDx:
```

msixmgr.exe -Unpack -packagePath "C:\Users\ssa\Desktop\FileZillaChanged_3.51.1.0_x64__81q6ced8g4aa0.msix" -destination "c:\temp\FileZillaChanged.vhdx" -applyacls -create -vhdSize 200 -filetype "vhdx" -rootDirectory apps
```

|Optional parameters|Description|Example|
| -------- | -------- | -------- |
|-packagePath|Specifies path to package to unpack OR path to a directory containing multiple packages to unpack|`msixmgr.exe -Unpack -packagePath "C:\Users\ssa\Desktop\FileZillaChanged_3.51.1.0_x64__81q6ced8g4aa0.msix"`|
|-destination|Specifies directory to place the resulting package folder(s) in|`msixmgr.exe -Unpack -packagePath "C:\Users\ssa\Desktop\FileZillaChanged_3.51.1.0_x64__81q6ced8g4aa0.msix" -destination "c:\temp\FileZillaChanged.vhdx"`|
|-applyacls|Applies ACLs to the resulting package folder(s) and their parent folder  |`msixmgr.exe -Unpack -packagePath "C:\Users\ssa\Desktop\FileZillaChanged_3.51.1.0_x64__81q6ced8g4aa0.msix" -destination "c:\temp\FileZillaChanged.vhdx" -applyacls`|
|-rootDirectory|Specifies root directory on image to unpack packages to. Required parameter for unpacking to new and existing CIM files  |`msixmgr.exe -Unpack -packagePath "C:\Users\ssa\Desktop\FileZillaChanged_3.51.1.0_x64__81q6ced8g4aa0.msix" -destination "c:\temp\FileZillaChanged.vhdx" -applyacls -create -vhdSize 200 -filetype "vhdx" -rootDirectory apps`|
|-validateSignature|Validates a package's signature file before unpacking package. This parameter will require that the package's certificate is installed on the machine.||
|Read more: (Certificate Stores) [https://learn.microsoft.com/windows-hardware/drivers/install/certificate-stores](/windows-hardware/drivers/install/certificate-stores)|`msixmgr.exe -Unpack -packagePath "C:\vlc.msix" -destination "D:\VLC" -validateSignature -applyacls`||

**-?**  
Display Help at the command prompt  
Example:

```
msixmgr.exe -?
```

## Next steps

Learn more about MSIX app attach at [What is MSIX app attach?](/azure/virtual-desktop/what-is-app-attach)  
To learn how to set up app attach, check out these articles:

- [Set up MSIX app attach with the Azure portal](/azure/virtual-desktop/app-attach-azure-portal)
- [Set up MSIX app attach using PowerShell](/azure/virtual-desktop/app-attach-powershell)
- [Create PowerShell scripts for MSIX app attach](/azure/virtual-desktop/app-attach)
- [Prepare an MSIX image for Azure Virtual Desktop](/azure/virtual-desktop/app-attach-image-prep)
- [Set up a file share for MSIX app attach](/azure/virtual-desktop/app-attach-file-share)  
     
     

If you have questions about MSIX app attach, see our [App attach FAQ](/azure/virtual-desktop/app-attach-faq) and [App attach glossary](/azure/virtual-desktop/app-attach-glossary) 
   















