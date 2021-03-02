---
title: Update your Azure Percept DK over a USB connection
description: Learn how to update the Azure Percept DK over a USB connection
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/18/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# How to update Azure Percept DK over a USB connection

Follow this guide to learn how to perform a USB update for the carrier board of your Azure Percept DK.

## Prerequisites
- Host computer with an available USB-C or USB-A port.
- Azure Percept DK (dev kit) carrier board and supplied USB-C to USB-C cable. If your host computer has a USB-A port but not a USB-C port, you may use a USB-C to USB-A cable (sold separately).
- Install [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) (admin access needed).
- Install the NXP UUU tool. [Download the Latest Release](https://github.com/NXPmicro/mfgtools/releases) uuu.exe file (for Windows) or the uuu file (for Linux) under the Assets tab.
- [Install 7-Zip](https://www.7-zip.org/). This software will be used for extracting the raw image file from its XZ compressed file. Download and install the appropriate .exe file.

## Steps
1.	Download the following [three USB Update files](https://go.microsoft.com/fwlink/?linkid=2155734):
	- pe101-uefi-***&lt;version number&gt;***.raw.xz
	- emmc_full.txt
	- fast-hab-fw.raw
 
1. Extract to pe101-uefi-***&lt;version number&gt;***.raw  from the compressed pe101-uefi***&lt;version number&gt;***.raw.xz file. 
Not sure how to extract? Download and Install 7-Zip, then right-click on the **.xz** image file and select 7-Zip &gt; Extract Here.

1. Copy the following three files to the folder that contains the UUU tool:
	- Extracted  pe101-uefi-***&lt;version number&gt;***.raw file (from step 2).
	- emmc_full.txt  (from step 1).
	- fast-hab-fw.raw (from step 1).
 
1. Power on the dev kit.
1. [Connect to the dev kit over SSH](./how-to-ssh-into-percept-dk.md)
1. Open a Windows command prompt (Start &gt; cmd) or a Linux terminal and navigate to the folder where the update files are stored. Run the following command to initiate the update:
	- Windows:
	```uuu -b emmc_full.txt fast-hab-fw.raw pe101-uefi-<version number>.raw```
	- Linux:
	```sudo ./uuu -b emmc_full.txt fast-hab-fw.raw pe101-uefi-<version number>.raw```
	
After running these commands, you may see a message stating "Waiting for device..." in the command prompt. This is expected and you should proceed to the next step.
	
1. Connect the dev kit carrier board to the host computer via a USB cable. Always connect from the carrier boards USB-C port to either the host computer's USB-C or USB-A port (USB-C to USB-A cable sold separately), depending on which ports are available. 
 
1. In the SSH/PuTTY terminal, enter the following commands to set the dev kit into USB mode and then to reboot the dev kit.
	- ```flagutil    -wBfRequestUsbFlash    -v1```
	- ```reboot -f```
 
1. You may get an indication that the host computer recognizes the device and the update process will automatically start. Navigate back to the command prompt to see the status. The process will take up to ten minutes and when the update is successful, you will see a message stating “Success 1 Failure 0”
 
1. Once the update is complete, power off the carrier board. Unplug the USB cable from the PC.  Plug the Azure Percept Vision module back to the carrier board using the USB cable.

1. Power the carrier board back on.

## Next steps

Your dev kit is now successfully updated. You may continue development and operation with your devkit.