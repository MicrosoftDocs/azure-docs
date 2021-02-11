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

5.  Run the command below to generate an MSIX image.

```cmd
msixmgr.exe -Unpack -packagePath <path to package> -destination <output folder> [-applyacls] [-create] [-vhdSize <size in MB>] [-filetype <CIM | VHD | VHDX>] [-rootDirectory <rootDirectory>]
```

For example,

```cmd
msixmgr.exe -Unpack -packagePath "C:\Users\%username%\Desktop\packageName_3.51.1.0_x64__81q6ced8g4aa0.msix" -destination "c:\temp\packageName.vhdx" -applyacls -create -vhdSize 200 -filetype "vhdx" -rootDirectory apps
```

![](media/72792a300b68ac7c42ac06b1233cdabe.png)

1.  Navigate to destination folder and confirm that an MSIX image (.VHDX) was created

>[!NOTE]
>Same command can be used to generate CIM and VHD by replacing the filetype and destination path.

CIM example:
------------

```cmd
msixmgr.exe -Unpack -packagePath "C:\Users\ssa\Desktop\packageName_3.51.1.0_x64__81q6ced8g4aa0.msix" -destination "c:\temp\packageName.cim" -applyacls -create -vhdSize 200 -filetype "cim" -rootDirectory apps
```

VHDX example:
-------------

```cmd
msixmgr.exe -Unpack -packagePath "C:\Users\ssa\Desktop\packageName_3.51.1.0_x64__81q6ced8g4aa0.msix" -destination "c:\temp\packageName.vhdx" -applyacls -create -vhdSize 200 -filetype "vhdx" -rootDirectory apps
```
