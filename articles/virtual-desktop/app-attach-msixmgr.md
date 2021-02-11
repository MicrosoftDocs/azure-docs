---
title: Using MSIXMGR tool - Azure
description: How to use the MSIXMGR tool for Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 02/10/2021
ms.author: helohr
manager: lizross
---
# Using the MSIXMGR tool

The MSIXMGR tool is for expanding MSIX packaged applications for MSIX app attach. The tool takes an MSIX-packaged application (.MSIX) and expands it into a VHD or VHDx image. The resulting MSIX image stores the storage account that's used for your Windows Virtual Desktop deployment. This article will show you how to use the MSIXMGR tool.

>[!NOTE]
>To guarantee compatibility, make sure the CIMs storing your MSIX images are generated on the OS version you're running in your Windows Virtual Desktop host pools. MSIXMGR can create CIM files, but you can only use those files with a host pool running Windows 10 20H2.

## Requirements

Before you can follow the instructions in this article, you'll need to do the following things:

- Download MSIXMGR from <https://aka.ms/msixmgr>
- Get an MSIX-packaged application (.MSIX file)
- Get administrative permissions on the machine where you'll create the MSIX image

## Create an MSIX image

Expansion is the process of taking an MSIX packaged application (.MSIX) and unzipping it into a MSIX image (.VHD(x) or .CIM file).

To expand an MSIX file:

1.  Download MSIXMGR from <https://aka.ms/msixmgr>.

2.  Unzip MSIXMGR.zip into a local folder.

3.  Open **Command prompt (CMD)** in elevated mode.

4.  Find the local folder from step 2.

5. Run the following command in the command prompt to create an MSIX image.

    ```cmd
    msixmgr.exe -Unpack -packagePath <path to package> -destination <output folder> [-applyacls] [-create] [-vhdSize <size in MB>] [-filetype <CIM | VHD | VHDX>] [-rootDirectory <rootDirectory>]
    ```

    Remember to replace the placeholder values with the relevant values. For example:

    ```cmd
    msixmgr.exe -Unpack -packagePath "C:\Users\%username%\Desktop\packageName_3.51.1.0_x64__81q6ced8g4aa0.msix" -destination "c:\temp\packageName.vhdx" -applyacls -create -vhdSize 200 -filetype "vhdx" -rootDirectory apps
    ```

6. Now that you've created the image, go to the destination folder and make sure you successfully created the MSIX image (.VHDX).

## Create CIM and VHDX images

You can also use the command in [step 5](#create-an-msix-image) to create CIM and VHDX files by replacing the file type and destination path.

For example, here's how you'd use that command to make a CIM file:

```cmd
msixmgr.exe -Unpack -packagePath "C:\Users\ssa\Desktop\packageName_3.51.1.0_x64__81q6ced8g4aa0.msix" -destination "c:\temp\packageName.cim" -applyacls -create -vhdSize 200 -filetype "cim" -rootDirectory apps
```

Here's how you'd use that command to make a VHDX:

```cmd
msixmgr.exe -Unpack -packagePath "C:\Users\ssa\Desktop\packageName_3.51.1.0_x64__81q6ced8g4aa0.msix" -destination "c:\temp\packageName.vhdx" -applyacls -create -vhdSize 200 -filetype "vhdx" -rootDirectory apps
```
