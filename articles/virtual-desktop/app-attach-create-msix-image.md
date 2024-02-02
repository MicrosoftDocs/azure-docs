---
title: Create an MSIX image to use with app attach in Azure Virtual Desktop - Azure
description: To use app attach in Azure Virtual Desktop, you need to expand an MSIX-packaged application into an MSIX image. This article shows you how to create an MSIX image.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 10/10/2023
---

# Create an MSIX image to use with app attach in Azure Virtual Desktop

To use MSIX packages with MSIX app attach and app attach in Azure Virtual Desktop, you need to expand an MSIX package application into an MSIX image. This article shows you how to create an MSIX image.

## Prerequisites

Before you can create an MSIX image, you need the following things:

- Download the [MSIXMGR tool](https://aka.ms/msixmgr) and extract it to a folder.

- Administrative permissions on a Windows 10 or Windows 11 device to create the MSIX image.

- An MSIX-packaged application (`.msix` file) you want to use with Azure Virtual Desktop. To learn how to convert a desktop installer to an MSIX package, see [Create an MSIX package from any desktop installer (MSI, EXE, ClickOnce, or App-V)](/windows/msix/packaging-tool/create-app-package).

   > [!TIP]
   > You can download an application that is already available as an MSIX package from several software vendors. [Microsoft XML Notepad](https://microsoft.github.io/XmlNotepad/) is available to download as an MSIX package. You can get the latest release from [GitHub](https://github.com/microsoft/XmlNotepad/releases/) by downloading the file with the `.msixbundle` file extension.

   > [!NOTE]
   > If you're using packages from the Microsoft Store for Business or Education on your network or on devices not connected to the internet, you'll need to download and install package licenses from the Microsoft Store to run the apps. To get the licenses, see [Use packages offline](app-attach-test-msix-packages.md#use-packages-offline).

## Create an app attach disk image

When creating an MSIX image, you convert an MSIX package to a *VHD*, *VHDX*, or *CIM* disk image using the *MSIXMGR tool*. We recommend using CIM for best performance, particularly with Windows 11, as it consumes less CPU and memory, with improved mounting and unmounting times. We don't recommend using VHD; use VHDX instead.

Select the relevant tab for your scenario.

# [CIM](#tab/cim)

Here are example commands to create a CIM disk image from an MSIX package. You'll need to change the example values for your own.

You should create a new folder for the destination because a CIM disk image is made up of multiple files and this helps differentiate between the images.

> [!IMPORTANT]
> To guarantee compatibility, make sure the CIM files storing your MSIX images are generated on a version of Windows that is lower than or equal to the version of Windows where you are planning to run the MSIX packages. For example, CIM files generated on Windows 11 may not work on Windows 10.

1. Open command prompt as an administrator and change to the directory you extracted the MSIXMGR tool. 

1. Make sure the folder you use for the destination exists before you run MSIXMGR. Create a new folder if necessary.

1. To create the CIM disk image, run the following command:

   ```cmd
   msixmgr.exe -Unpack -packagePath "C:\msix\myapp.msix" -destination "C:\msix\myapp\myapp.cim" -applyACLs -create -fileType cim -rootDirectory apps
   ```

   The output should be as follows:

   ```Output
   Successfully created the CIM file: C:\msix\myapp\myapp.cim
   ```

# [VHDX](#tab/vhdx)

Here's an example command to create a VHDX disk image from an MSIX image. A single VHDX file is created. 

1. Open command prompt as an administrator and change to the directory you extracted the MSIXMGR tool. 

1. Make sure the folder you use for the destination exists before you run MSIXMGR. Create a new folder if necessary.

1. To create the VHDX disk image, run the following command:

   ```cmd
   msixmgr.exe -Unpack -packagePath "C:\msix\myapp.msix" -destination "C:\msix\myapp.vhdx" -applyACLs -create -fileType vhdx -rootDirectory apps
   ```

   The output should be as follows:

   ```Output
   Successfully created virtual disk
   Stopping the Shell Hardware Detection service
   Stopping dependent services if necessary.
   Successfully initialized and partitioned the disk.
   Formatting the disk.
   Successfully formatted disk
   Starting the Shell Hardware Detection service
   Successfully started the Shell Hardware Detection Service
   Finished unpacking packages to: C:\msix\myapp.vhdx
   ```
---

## Next steps

After you've created the MSIX package, you need to store it on a [file share](app-attach-overview.md#file-share) and [add the MSIX package to Azure Virtual Desktop](app-attach-setup.md).

Here are some other articles you might find helpful:

- [App attach in Azure Virtual Desktop](app-attach-overview.md)
- Learn more about the available [MSIXMGR tool parameters](msixmgr-tool-syntax-description.md).
