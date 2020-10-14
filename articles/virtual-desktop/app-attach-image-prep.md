---
title: Windows Virtual Desktop prepare MSIX app attach image - Azure
description: How to create an MSIX app attach image for a Windows Virtual Desktop host pool.
author: Heidilohr
ms.topic: how-to
ms.date: 11/09/2020
ms.author: helohr
manager: lizross
---
# Prepare an MSIX image for Windows Virtual Desktop

MSIX app attach is an application layering solution that allows you to dynamically attach apps from an MSIX package to a user session. The MSIX package system separates apps from the operating system, making it easier to build images for virtual machines. MSIX packages also give you greater control over which apps your users can access in their virtual machines. You can even separate apps from the master image and give them to users later.

## Create a VHD or VHDX package for MSIX

MSIX packages need to be in a VHD or VHDX format to work properly. This means that, to get started, you'll need to create a VHD or VHDX package.

>[!NOTE]
>If you haven't already, make sure you enable Hyper-V by following the instructions in [Install Hyper-V on Windows 10](/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v).

To create a VHD or VHDX package for MSIX:

1. First, open PowerShell.
2. Next, run the following cmdlet to create a VHD:

    ```powershell
    New-VHD -SizeBytes <size>MB -Path c:\temp\<name>.vhd -Dynamic -Confirm:$false
    ```

    >[!NOTE]
    > Make sure the VHD is large enough to hold the expanded MSIX package.

3. Run the following cmdlet to mount the VHD you just created:

    ```powershell
    $vhdObject = Mount-VHD c:\temp\<name>.vhd -Passthru
    ```

4. Next, run this cmdlet to initialize the mounted VHD:

    ```powershell
    $disk = Initialize-Disk -Passthru -Number $vhdObject.Number
    ```

5. After that, run this cmdlet to create a new partition for the initialized VHD:

    ```powershell
    $partition = New-Partition -AssignDriveLetter -UseMaximumSize -DiskNumber $disk.Number
    ```

6. Run this cmdlet to format the partition:

    ```powershell
    Format-Volume -FileSystem NTFS -Confirm:$false -DriveLetter $partition.DriveLetter -Force
    ```

7. Finally, create a parent folder on the mounted VHD. This step is required because the MSIX package must have a parent folder to work properly. It doesn't matter what you name the parent folder, so long as the parent folder exists.

## Expand MSIX

After that, you'll need to expand the MSIX image by "unpacking" its files into the VHD.

To expand the MSIX image:

1. [Download the msixmgr tool](https://aka.ms/msixmgr) and save the .zip folder to a folder within a session host VM.

2. Unzip the msixmgr tool .zip folder.

3. Put the source MSIX package into the same folder where you unzipped the msixmgr tool.

4. Open a command prompt as Administrator and navigate to the folder where you downloaded and unzipped the msixmgr tool.

5. Run the following cmdlet to unpack the MSIX into the VHD you created in the previous section.

    ```powershell
    msixmgr.exe -Unpack -packagePath <package>.msix -destination "f:\<name of folder you created earlier>" -applyacls
    ```

    The following message should appear after you're done unpacking:

    > Successfully unpacked and applied ACLs for package: <package name>.msix

    >[!NOTE]
    > If you're using packages from the Microsoft Store for Business or Education on your network or on devices not connected to the internet, you'll need to download and install package licenses from the Microsoft Store to run the apps. To get the licenses, see [Use packages offline](app-attach.md#use-packages-offline).

6. Go the mounted VHD and open the app folder to make sure the package contents are there.

7. Unmount the VHD.

## Upload MSIX image to share

After you've created the MSIX package, you'll need to uploat the VHD/VHDx image to a share where your users' virtual machines can access it.