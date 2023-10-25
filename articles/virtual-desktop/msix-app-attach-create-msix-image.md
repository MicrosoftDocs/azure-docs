---
title: Create an MSIX image for Azure Virtual Desktop - Azure
description: To use MSIX app attach with Azure Virtual Desktop, you need to expand an MSIX-packaged application into an MSIX image. This article shows you how to create an MSIX image.
author: dknappettmsft
ms.topic: how-to
ms.date: 05/12/2023
ms.author: daknappe
---

# Create an MSIX image for Azure Virtual Desktop

To use MSIX app attach with Azure Virtual Desktop, you need to expand an MSIX-packaged application into an MSIX image. This article shows you how to create an MSIX image, which you then need to upload to a file share and publish in Azure Virtual Desktop.

## Prerequisites

Before you can create an MSIX image, you need to meet the following prerequisites:

- Download the [MSIXMGR tool](https://aka.ms/msixmgr) and extract it to a folder.

- Administrative permissions on a Windows 10 or Windows 11 device to create the MSIX image.

- An MSIX-packaged application (`.msix` file) you want to use with Azure Virtual Desktop. To learn how to convert a desktop installer to an MSIX package, see [Create an MSIX package from any desktop installer (MSI, EXE, ClickOnce, or App-V)](/windows/msix/packaging-tool/create-app-package).

   > [!NOTE]
   > If you're using packages from the Microsoft Store for Business or Education on your network or on devices not connected to the internet, you'll need to download and install package licenses from the Microsoft Store to run the apps. To get the licenses, see [Use packages offline](app-attach.md#use-packages-offline).

## Create an MSIX image

When creating an MSIX image, you convert an MSIX package to a *VHD*, *VHDX*, or *CIM* disk image using the MSIXMGR tool. We recommend using CIM for best performance, particularly with Windows 11, as it consumes less CPU and memory, with improved mounting and unmounting times. We don't recommend using VHD; use VHDX instead.

Select the relevant tab for your scenario.

# [CIM](#tab/cim)

Here are example commands to create an MSIX image as a CIM disk image. You'll need to change the example values for your own.

You should create a new folder for the destination because a CIM disk image is made up of multiple files and this helps differentiate between the images.

> [!IMPORTANT]
> To guarantee compatibility, make sure the CIM files storing your MSIX images are generated on a version of Windows that is lower than or equal to the version of Windows where you are planning to run the MSIX packages. For example, CIM files generated on Windows 11 may not work on Windows 10.

1. Open command prompt as an administrator and change to the directory you extracted the MSIXMGR tool. 

1. Create a new folder for the destination.

1. To create the CIM disk image, run the following command:

   ```cmd
   msixmgr.exe -Unpack -packagePath "C:\msix\myapp.msix" -destination "C:\msix\myapp\myapp.cim" -applyACLs -create -fileType cim -rootDirectory apps
   ```

   The output should be as follows:

   ```Output
   Successfully created the CIM file: C:\msix\myapp\myapp.cim
   ```

# [VHDX](#tab/vhdx)

Here's an example command to create an MSIX image as a VHDX disk image. A single VHDX file is created. 

1. Open command prompt as an administrator and change to the directory you extracted the MSIXMGR tool. 

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

After you've created the MSIX package, you'll still need to do the following tasks:

1. Copy the resulting VHD, VHDX, or CIM file to a share where your session hosts can access it. To learn about the requirements, see [File share requirements for MSIX app attach](app-attach-file-share.md).

1. [Publish MSIX applications in Azure Virtual Desktop](app-attach-azure-portal.md).

Here are some other articles you might find helpful:

- Learn more about the available [MSIXMGR tool parameters](msixmgr-tool-syntax-description.md).
- [What is MSIX app attach?](what-is-app-attach.md)
- [MSIX app attach FAQ](app-attach-faq.yml)
