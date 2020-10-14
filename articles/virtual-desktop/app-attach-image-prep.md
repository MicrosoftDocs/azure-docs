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

MSIX app attach is an application layering solution that allows you to dynamically attach an application (that is an MSIX package) to a user session. Separating out the application from the operating system makes it easier to create a golden virtual machine image, and you get more control with providing the right application for the right user.

With this, enterprises can separate their applications from the master image.

## Generate a VHD or VHDX package for MSIX

Packages are in VHD or VHDX format to optimize performance. MSIX requires VHD or VHDX packages to work properly.

**Note:** You many need to enable Hyper-V via the steps
[here](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)

To generate a VHD or VHDX package for MSIX:

1.  Run the following cmdlet in PowerShell to create a VHD:

```powershell
New-VHD -SizeBytes <size>MB -Path c:\temp\<name>.vhd -Dynamic -Confirm:$false
```

>[!NOTE]
> Make sure the size of VHD is large enough to hold the expanded MSIX.

1.  Run the following cmdlet to mount the newly created VHD:

```powershell
$vhdObject = Mount-VHD c:\temp\<name>.vhd -Passthru
```

1.  Run this cmdlet to initialize the VHD:

```powershell
$disk = Initialize-Disk -Passthru -Number $vhdObject.Number
```

1.  Run this cmdlet to create a new partition:

```powershell
$partition = New-Partition -AssignDriveLetter -UseMaximumSize -DiskNumber $disk.Number
```

1.  Run this cmdlet to format the partition:

```powershell
Format-Volume -FileSystem NTFS -Confirm:$false -DriveLetter $partition.DriveLetter -Force
```

1.  Create a parent folder called **Apps** on the mounted VHD. This step is mandatory as the MSIX app attach requires a parent folder. You can name the parent folder whatever you like.

## Expand MSIX

After that, you'll need to "expand" the MSIX image by unpacking it. To unpack the MSIX image:

1.  [Download the msixmgr tool](https://aka.ms/msixmgr) and save the .zip folder to a folder within a session host VM.

2.  Unzip the msixmgr tool .zip folder.

3.  Put the source MSIX package into the same folder where you unzipped the msixmgr tool.

4.  Open a command prompt as Administrator and navigate to the folder where you downloaded and unzipped the msixmgr tool.

5.  Run the following cmdlet to unpack the MSIX into the VHD you created and mounted in the previous section.

```powershell
msixmgr.exe -Unpack -packagePath \<package\>.msix -destination "f:\\<name of folder you created earlier>" -applyacls
```

The following message should appear once unpacking is done:

Successfully unpacked and applied ACLs for package: \<package name\>.msix

>[!NOTE]
> If using packages from the Microsoft Store for Business (or Education) within your network, or on devices that are not connected to the internet, you will need to obtain the package licenses from the Store and install them to run the app successfully. See [Use packages offline](https://docs.microsoft.com/en-us/azure/virtual-desktop/app-attach#use-packages-offline).

1.  Navigate to the mounted VHD and open the app folder and confirm package content is present.

2.  Unmount the VHD.

## Upload MSIX image to share

The resulting VHD/VHDx image must be uploaded to a share where the VMs can load it from.