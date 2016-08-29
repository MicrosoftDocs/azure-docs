<properties
   pageTitle="Reset a local Windows password when Azure guest agent is not installed | Microsoft Azure"
   description="How to reset the password of a local Windows user account when the Azure guest agent is not installed or functioning on a VM"
   services="virtual-machines-windows"
   documentationCenter=""
   authors="iainfoulds"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-windows"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure-services"
   ms.date="08/29/2016"
   ms.author="iainfou"/>

# How to reset local Windows password
You can reset the local Windows password of an Azure VM using the [Azure portal or Azure PowerShell](virtual-machines-windows-reset-rdp.md) provided the Azure guest agent is installed. If you encounter issues with the Azure guest agent not responding, or failing to install after uploading a custom image, you can manually reset a Windows password. This article details how to reset a local account password by attaching the source OS virtual disk to another VM. 

> [AZURE.WARNING] Only use this process as a last resort. Always try to reset a password using the [Azure portal or Azure PowerShell](virtual-machines-windows-reset-rdp.md) first.

## Detailed steps
1. Delete the affected VM in Azure portal. The associated disks are retained.

2. Attach the source VM’s OS disk to another Azure VM in the same location as the troubleshooting VM (such as `West US`).
    - Select the VM in the Azure portal, click *Disks* | *Attach existing*
    - Under *VHD File*, select the storage account that contains your source VM
    - Select the source container (typically *vhds*)
    - Select the OS vhd to attach

3. Connect to the troubleshooting VM using Remote Desktop and ensure the source VM OS disk is visible.
    - Select the VM in the Azure portal and click *Connect*
    - Open the RDP file that downloads. Enter the username and password of the troubleshooting VM.
    - In File Explorer, look for the data disk you attached. If the source VM’s VHD is the only data disk attached to the troubleshooting VM, it should be the F: drive

3. Create `gpt.ini` in \Windows\System32\GroupPolicy on the source VM’s drive (if gpt.ini exists, rename to gpt.ini.bak).

    > [AZURE.WARNING] Make sure you do not accidentally create these files in C:\Windows, the OS drive for the troubleshooting VM. Create the following files in the OS drive for your source VM attached as a data disk.

    - Add the following into the `gpt.ini` file you created:

    ```
    [General]
    gPCFunctionalityVersion=2
    gPCMachineExtensionNames=[{42B5FAAE-6536-11D2-AE5A-0000F87571E3}{40B6664F-4972-11D1-A7CA-0000F87571E3}]
    Version=1
    ```
 
4. Create `scripts.ini` in \Windows\System32\GroupPolicy\Machine\Scripts. Make sure hidden folders are shown. If needed, create the `Machine` or `Scripts` folders.

    - Add the following into the `scripts.ini` file you created:

    ```
    [Startup]
    0CmdLine=C:\Windows\System32\FixAzureVM.cmd
    0Parameters=
    ```
 
5. Create `FixAzureVM.cmd` in \Windows\System32 with the following contents, replacing `<username>` and `<newpassword>` with your own values:

    ```
    NET USER <username> <newpassword>
    ```

6. In Azure portal, detach the disk from the troubleshooting VM.
    - Select the VM in the Azure portal, click *Disks*
    - Select the data disk attached in step 2, click *Detach*

7. Create a new VM from the source VM’s OS disk
    - PowerShell
    - ARM template

8. After the new VM is running, connect to the VM using Remote Desktop with the new password.

9. From your remote session to the new VM, remove the following files to clean up:

    - From %windir%\System32
        - remove FixAzureVM.cmd
    - From %windir%\System32\GroupPolicy\Machine\
        - remove scripts.ini
    - From %windir%\System32\GroupPolicy
        - remove gpt.ini (if gpt.ini existed before, and you renamed it to gpt.ini.bak, rename the .bak file back to gpt.ini)

## Next steps