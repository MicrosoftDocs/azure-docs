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
   ms.date="10/05/2016"
   ms.author="iainfou"/>

# How to reset local Windows password for Azure VM
You can reset the local Windows password of a VM in Azure using the [Azure portal or Azure PowerShell](virtual-machines-windows-reset-rdp.md) provided the Azure guest agent is installed. This method is the primary way to reset a password for an Azure VM. If you encounter issues with the Azure guest agent not responding, or failing to install after uploading a custom image, you can manually reset a Windows password. This article details how to reset a local account password by attaching the source OS virtual disk to another VM. 

> [AZURE.WARNING] Only use this process as a last resort. Always try to reset a password using the [Azure portal or Azure PowerShell](virtual-machines-windows-reset-rdp.md) first.


## Overview of the process
The core steps for performing a local password reset for a Windows VM in Azure when there is no access to the Azure guest agent is as follows:

- Delete the source VM. The virtual disks are retained.
- Attach the source VM's OS disk to another VM within your Azure subscription. This VM is referred to as the troubleshooting VM.
- Using the troubleshooting VM, create some config files on the source VM's OS disk.
- Detach the VM's OS disk from the troubleshooting VM.
- Use a Resource Manager template to create a VM, using the original virtual disk.
- When the new VM boots, the config files you create update the password of the required user.


## Detailed steps
Always try to reset a password using the [Azure portal or Azure PowerShell](virtual-machines-windows-reset-rdp.md) before trying the following steps. Make sure you have a backup of your VM before you start. 

1. Delete the affected VM in Azure portal. Deleting the VM only deletes the metadata, the reference of the VM within Azure. The virtual disks are retained when the VM is deleted:

    - Select the VM in the Azure portal, click *Delete*:

    ![Delete existing VM](./media/virtual-machines-windows-reset-local-password-without-guest-agent/delete_vm.png)

2. Attach the source VM’s OS disk to the troubleshooting VM. The troubleshooting VM must be in the same region as the source VM's OS disk (such as `West US`):

    - Select the troubleshooting VM in the Azure portal. Click *Disks* | *Attach existing*:

    ![Attach existing disk](./media/virtual-machines-windows-reset-local-password-without-guest-agent/disks_attach_existing.png)

    Select *VHD File* and then select the storage account that contains your source VM:

    ![Select storage account](./media/virtual-machines-windows-reset-local-password-without-guest-agent/disks_select_storageaccount.PNG)

    Select the source container. The source container is typically *vhds*:

    ![Select storage container](./media/virtual-machines-windows-reset-local-password-without-guest-agent/disks_select_container.png)

    Select the OS vhd to attach. Click *Select* to complete the process:

    ![Select source virtual disk](./media/virtual-machines-windows-reset-local-password-without-guest-agent/disks_select_source_vhd.png)

3. Connect to the troubleshooting VM using Remote Desktop and ensure the source VM's OS disk is visible:

    - Select the troubleshooting VM in the Azure portal and click *Connect*.
    - Open the RDP file that downloads. Enter the username and password of the troubleshooting VM.
    - In File Explorer, look for the data disk you attached. If the source VM’s VHD is the only data disk attached to the troubleshooting VM, it should be the F: drive:

    ![View attached data disk](./media/virtual-machines-windows-reset-local-password-without-guest-agent/troubleshooting_vm_fileexplorer.png)

4. Create `gpt.ini` in `\Windows\System32\GroupPolicy` on the source VM’s drive (if gpt.ini exists, rename to gpt.ini.bak):

    > [AZURE.WARNING] Make sure that you do not accidentally create the following files in C:\Windows, the OS drive for the troubleshooting VM. Create the following files in the OS drive for your source VM that is attached as a data disk.

    - Add the following lines into the `gpt.ini` file you created:

    ```
    [General]
    gPCFunctionalityVersion=2
    gPCMachineExtensionNames=[{42B5FAAE-6536-11D2-AE5A-0000F87571E3}{40B6664F-4972-11D1-A7CA-0000F87571E3}]
    Version=1
    ```

    ![Create gpt.ini](./media/virtual-machines-windows-reset-local-password-without-guest-agent/create_gpt_ini.png)
 
5. Create `scripts.ini` in `\Windows\System32\GroupPolicy\Machine\Scripts`. Make sure hidden folders are shown. If needed, create the `Machine` or `Scripts` folders.

    - Add the following lines the `scripts.ini` file you created:

    ```
    [Startup]
    0CmdLine=C:\Windows\System32\FixAzureVM.cmd
    0Parameters=
    ```

    ![Create scripts.ini](./media/virtual-machines-windows-reset-local-password-without-guest-agent/create_scripts_ini.png)
 
6. Create `FixAzureVM.cmd` in `\Windows\System32` with the following contents, replacing `<username>` and `<newpassword>` with your own values:

    ```
    NET USER <username> <newpassword>
    ```

    ![Create FixAzureVM.cmd](./media/virtual-machines-windows-reset-local-password-without-guest-agent/create_fixazure_cmd.png)

    You must meet the configured password complexity requirements for your VM when defining the new password.

7. In Azure portal, detach the disk from the troubleshooting VM:

    - Select the troubleshooting VM in the Azure portal, click *Disks*.
    - Select the data disk attached in step 2, click *Detach*:

    ![Detach disk](./media/virtual-machines-windows-reset-local-password-without-guest-agent/detach_disk.png)

8. Before you create a VM, obtain the URI to your source OS disk:

    - Select the storage account in the Azure portal, click *Blobs*.
    - Select the container. The source container is typically *vhds*:

    ![Select storage account blob](./media/virtual-machines-windows-reset-local-password-without-guest-agent/select_storage_details.png)

    Select your source VM OS VHD and click the *Copy* button next to the *URL* name:

    ![Copy disk URI](./media/virtual-machines-windows-reset-local-password-without-guest-agent/copy_source_vhd_uri.png)

9. Create a VM from the source VM’s OS disk:

    - Use [this Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-from-specialized-vhd) to create a VM from a specialized VHD. Click the `Deploy to Azure` button to open the Azure portal with the templated details populated for you.
    - If you want to retain all the previous settings for the VM, select *Edit template* to provide your existing VNet, subnet, network adapter, or public IP.
    - In the `OSDISKVHDURI` parameter text box, paste the URI of your source VHD obtain in the preceding step:

    ![Create a VM from template](./media/virtual-machines-windows-reset-local-password-without-guest-agent/create_new_vm_from_template.png)

10. After the new VM is running, connect to the VM using Remote Desktop with the new password you specified in the `FixAzureVM.cmd` script.

11. From your remote session to the new VM, remove the following files to clean up the environment:

    - From %windir%\System32
        - remove FixAzureVM.cmd
    - From %windir%\System32\GroupPolicy\Machine\
        - remove scripts.ini
    - From %windir%\System32\GroupPolicy
        - remove gpt.ini (if gpt.ini existed before, and you renamed it to gpt.ini.bak, rename the .bak file back to gpt.ini)

## Next steps
If you still cannot connect using Remote Desktop, see the [RDP troubleshooting guide](virtual-machines-windows-troubleshoot-rdp-connection.md). The [detailed RDP troubleshooting guide](virtual-machines-windows-detailed-troubleshoot-rdp.md) looks at troubleshooting methods rather than specific steps. You can also [open an Azure support request](https://azure.microsoft.com/support/options/) for hands-on assistance.