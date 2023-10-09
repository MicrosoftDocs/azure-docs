---
title: Deprovision or generalize a VM before creating an image
description: Generalized or deprovision VM to remove machine specific information before creating an image. 
author: cynthn
ms.service: virtual-machines
ms.subservice: imaging
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 03/15/2023
ms.author: cynthn
ms.custom: portal

---

# Remove machine specific information by deprovisioning or generalizing a VM before creating an image

Generalizing or deprovisioning a VM is not necessary for creating an image in an [Azure Compute Gallery](shared-image-galleries.md#generalized-and-specialized-images) unless you specifically want to create an image that has no machine specific information, like user accounts. Generalizing is still required when creating a managed image outside of a gallery.

Generalizing removes machine specific information so the image can be used to create multiple VMs. Once the VM has been generalized or deprovisioned, you need to let the platform know so that the boot sequence can be set correctly. 

> [!IMPORTANT]
> Once you mark a VM as `generalized` in Azure, you cannot restart the VM.


## Linux

Distribution specific instructions for preparing Linux images for Azure are available here:
- [Generic steps](./linux/create-upload-generic.md)
- [CentOS](./linux/create-upload-centos.md)
- [Debian](./linux/debian-create-upload-vhd.md)
- [Flatcar](./linux/flatcar-create-upload-vhd.md)
- [FreeBSD](./linux/freebsd-intro-on-azure.md)
- [Oracle Linux](./linux/oracle-create-upload-vhd.md)
- [OpenBSD](./linux/create-upload-openbsd.md)
- [Red Hat](./linux/redhat-create-upload-vhd.md)
- [SUSE](./linux/suse-create-upload-vhd.md)
- [Ubuntu](./linux/create-upload-ubuntu.md)

The following instructions only cover setting the VM to generalized. We recommend you follow the distro specific instructions for production workloads.

First you'll deprovision the VM by using the Azure VM agent to delete machine-specific files and data. Use the `waagent` command with the `-deprovision+user` parameter on your source Linux VM. For more information, see the [Azure Linux Agent user guide](./extensions/agent-linux.md). This process can't be reversed.

1. Connect to your Linux VM with an SSH client.
2. In the SSH window, enter the following command:
   ```bash
    sudo waagent -deprovision+user
   ```
   > [!NOTE]
   > Only run this command on a VM that you'll capture as an image. This command does not guarantee that the image is cleared of all sensitive information or is suitable for redistribution. The `+user` parameter also removes the last provisioned user account. To keep user account credentials in the VM, use only `-deprovision`.
 
3. Enter **y** to continue. You can add the `-force` parameter to avoid this confirmation step.
4. After the command completes, enter **exit** to close the SSH client.  The VM will still be running at this point.


Deallocate the VM that you deprovisioned with `az vm deallocate` so that it can be generalized.

```azurecli-interactive
az vm deallocate \
   --resource-group myResourceGroup \
   --name myVM
```

Then the VM needs to be marked as generalized on the platform. 

```azurecli-interactive
az vm generalize \
   --resource-group myResourceGroup \
   --name myVM
```

## Windows

Sysprep removes all your personal account and security information, and then prepares the machine to be used as an image. For information about Sysprep, see [Sysprep overview](/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview).

Make sure the server roles running on the machine are supported by Sysprep. For more information, see [Sysprep support for server roles](/windows-hardware/manufacture/desktop/sysprep-support-for-server-roles) and [Unsupported scenarios](/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview#unsupported-scenarios). 

> [!IMPORTANT]
> After you have run Sysprep on a VM, that VM is considered *generalized* and cannot be restarted. The process of generalizing a VM is not reversible. If you need to keep the original VM functioning, you should create a snapshot of the OS disk, create a VM from the snapshot, and then generalize that copy of the VM. 
>
> Sysprep requires the drives to be fully decrypted. If you have enabled encryption on your VM, disable encryption before you run Sysprep.
>
> If you plan to run Sysprep before uploading your virtual hard disk (VHD) to Azure for the first time, make sure you have [prepared your VM](./windows/prepare-for-upload-vhd-image.md).  
> 
> We do not support custom answer file in the sysprep step, hence you should not use the "/unattend:_answerfile_" switch with your sysprep command.  
>  
> Azure platform mounts an ISO file to the DVD-ROM when a Windows VM is created from a generalized image. For this reason, the **DVD-ROM must be enabled in the OS in the generalized image**. If it is disabled, the Windows VM will be stuck at out-of-box experience (OOBE).


To generalize your Windows VM, follow these steps:

1. Sign in to your Windows VM.
   
2. Open a Command Prompt window as an administrator. 

3. Delete the panther directory (C:\Windows\Panther). 
4. Verify if CD/DVD-ROM is enabled.If it is disabled, the Windows VM will be stuck at out-of-box experience (OOBE).  
```
   Registry key Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\cdrom\start (Value 4 = disabled, expected value 1 = automatic) Make sure it is set to 1.
   ```
> [!NOTE]
   > Verify if any policies applied restricting removable storage access (example: Computer configuration\Administrative Templates\System\Removable Storage Access\All Removable Storage classes: Deny all access)


5. Then change the directory to %windir%\system32\sysprep, and then run:
   ```
   sysprep.exe /oobe /generalize /shutdown
   ```
6. The VM will shut down when Sysprep is finished generalizing the VM. Do not restart the VM.
 

Once Sysprep has finished, set the status of the virtual machine to **Generalized**.
   
```azurepowershell-interactive
Set-AzVm -ResourceGroupName $rgName -Name $vmName -Generalized
```

## Next steps

- Learn more about [Azure Compute Gallery](shared-image-galleries.md).
