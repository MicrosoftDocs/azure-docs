---
title: Create and upload a Linux VHD in Azure
description: Learn to create and upload an Azure virtual hard disk (VHD) that contains a Linux operating system.
services: virtual-machines-linux
documentationcenter: ''
author: szarkos
manager: gwallace
editor: tysonn
tags: azure-resource-manager,azure-service-management

ms.assetid: d351396c-95a0-4092-b7bf-c6aae0bbd112
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 10/08/2018
ms.author: szark

---
# Information for Non-endorsed Distributions
[!INCLUDE [learn-about-deployment-models](../../../includes/learn-about-deployment-models-both-include.md)]

The Azure platform SLA applies to virtual machines running the Linux OS only when one of the [endorsed distributions](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) is used. For these endorsed distributions, pre-configured Linux images are provided in the Azure Marketplace.

* [Linux on Azure - Endorsed Distributions](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Support for Linux images in Microsoft Azure](https://support.microsoft.com/kb/2941892)

All distributions running on Azure have a number of prerequisites. This article can't be comprehensive, as every distribution is different. Even if you meet all the criteria below, you may need to significantly tweak your Linux system for it to run properly.

We recommend that you start with one of the [Linux on Azure Endorsed Distributions](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). The following articles show you how to prepare the various endorsed Linux distributions that are supported on Azure:

* **[CentOS-based Distributions](create-upload-centos.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**
* **[Debian Linux](debian-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**
* **[Oracle Linux](oracle-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**
* **[Red Hat Enterprise Linux](redhat-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**
* **[SLES & openSUSE](suse-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**
* **[Ubuntu](create-upload-ubuntu.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**

This article focuses on general guidance for running your Linux distribution on Azure.

## General Linux Installation Notes
* The Hyper-V virtual hard disk (VHDX) format isn't supported in Azure, only *fixed VHD*.  You can convert the disk to VHD format using Hyper-V Manager or the [Convert-VHD](https://docs.microsoft.com/powershell/module/hyper-v/convert-vhd) cmdlet. If you're using VirtualBox, select **Fixed size** rather than the default (dynamically allocated) when creating the disk.
* Azure only supports generation 1 virtual machines. You can convert a generation 1 virtual machine from VHDX to the VHD file format, and from dynamically expanding to a fixed sized disk. You can't change a virtual machine's generation. For more information, see [Should I create a generation 1 or 2 virtual machine in Hyper-V?](https://technet.microsoft.com/windows-server-docs/compute/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v)
* The maximum size allowed for the VHD is 1,023 GB.
* When installing the Linux system we recommend that you use standard partitions, rather than Logical Volume Manager (LVM) which is the default for many installations. Using standard partitions will avoid LVM name conflicts with cloned VMs, particularly if an OS disk is ever attached to another identical VM for troubleshooting. [LVM](configure-lvm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) or [RAID](configure-raid.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) may be used on data disks.
* Kernel support for mounting UDF file systems is necessary. At first boot on Azure the provisioning configuration is passed to the Linux VM by using UDF-formatted media that is attached to the guest. The Azure Linux agent must mount the UDF file system to read its configuration and provision the VM.
* Linux kernel versions earlier than 2.6.37 don't support NUMA on Hyper-V with larger VM sizes. This issue primarily impacts older distributions using the upstream Red Hat 2.6.32 kernel, and was fixed in Red Hat Enterprise Linux (RHEL) 6.6 (kernel-2.6.32-504). Systems running custom kernels older than 2.6.37, or RHEL-based kernels older than 2.6.32-504 must set the boot parameter `numa=off` on the kernel command line in grub.conf. For more information, see [Red Hat KB 436883](https://access.redhat.com/solutions/436883).
* Don't configure a swap partition on the OS disk. The Linux agent can be configured to create a swap file on the temporary resource disk, as described in the following steps.
* All VHDs on Azure must have a virtual size aligned to 1 MB. When converting from a raw disk to VHD you must ensure that the raw disk size is a multiple of 1 MB before conversion, as described in the following steps.

### Installing kernel modules without Hyper-V
Azure runs on the Hyper-V hypervisor, so Linux requires certain kernel modules to run in Azure. If you have a VM that was created outside of Hyper-V, the Linux installers may not include the drivers for Hyper-V in the initial ramdisk (initrd or initramfs), unless the VM detects that it's running on a Hyper-V environment. When using a different virtualization system (such as Virtualbox, KVM, and so on) to prepare your Linux image, you may need to rebuild the initrd so that at least the hv_vmbus and hv_storvsc kernel modules are available on the initial ramdisk.  This known issue is for systems based on the upstream Red Hat distribution, and possibly others.

The mechanism for rebuilding the initrd or initramfs image may vary depending on the distribution. Consult your distribution's documentation or support for the proper procedure.  Here is one example for rebuilding the initrd by using the `mkinitrd` utility:

1. Back up the existing initrd image:

    ```
    cd /boot
    sudo cp initrd-`uname -r`.img  initrd-`uname -r`.img.bak
    ```

2. Rebuild the initrd with the hv_vmbus and hv_storvsc kernel modules:

    ```
    sudo mkinitrd --preload=hv_storvsc --preload=hv_vmbus -v -f initrd-`uname -r`.img `uname -r`
    ```

### Resizing VHDs
VHD images on Azure must have a virtual size aligned to 1 MB.  Typically, VHDs created using Hyper-V are aligned correctly.  If the VHD isn't aligned correctly, you may receive an error message similar to the following when you try to create an image from your VHD.

* The VHD http:\//\<mystorageaccount>.blob.core.windows.net/vhds/MyLinuxVM.vhd has an unsupported virtual size of 21475270656 bytes. The size must be a whole number (in MBs).

In this case, resize the VM using either the Hyper-V Manager console or the [Resize-VHD](https://technet.microsoft.com/library/hh848535.aspx) PowerShell cmdlet.  If you aren't running in a Windows environment, we recommend using `qemu-img` to convert (if needed) and resize the VHD.

> [!NOTE]
> There is a [known bug in qemu-img](https://bugs.launchpad.net/qemu/+bug/1490611) versions >=2.2.1 that results in an improperly formatted VHD. The issue has been fixed in QEMU 2.6. We recommend using either `qemu-img` 2.2.0 or lower, or 2.6 or higher.
> 

1. Resizing the VHD directly using tools such as `qemu-img` or `vbox-manage` may result in an unbootable VHD.  We recommend first converting the VHD to a RAW disk image.  If the VM image was created as a RAW disk image (the default for some hypervisors such as KVM), then you may skip this step.
 
    ```
    qemu-img convert -f vpc -O raw MyLinuxVM.vhd MyLinuxVM.raw
    ```

1. Calculate the required size of the disk image so that the virtual size is aligned to 1 MB.  The following bash shell script uses `qemu-img info` to determine the virtual size of the disk image, and then calculates the size to the next 1 MB.

    ```bash
    rawdisk="MyLinuxVM.raw"
    vhddisk="MyLinuxVM.vhd"

    MB=$((1024*1024))
    size=$(qemu-img info -f raw --output json "$rawdisk" | \
    gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')

    rounded_size=$((($size/$MB + 1)*$MB))
    
    echo "Rounded Size = $rounded_size"
    ```

3. Resize the raw disk using `$rounded_size` as set above.

    ```bash
    qemu-img resize MyLinuxVM.raw $rounded_size
    ```

4. Now, convert the RAW disk back to a fixed-size VHD.

    ```bash
    qemu-img convert -f raw -o subformat=fixed -O vpc MyLinuxVM.raw MyLinuxVM.vhd
    ```

   Or, with qemu version 2.6+, include the `force_size` option.

    ```bash
    qemu-img convert -f raw -o subformat=fixed,force_size -O vpc MyLinuxVM.raw MyLinuxVM.vhd
    ```

## Linux Kernel Requirements

The Linux Integration Services (LIS) drivers for Hyper-V and Azure are contributed directly to the upstream Linux kernel. Many distributions that include a recent Linux kernel version (such as 3.x) have these drivers available already, or otherwise provide backported versions of these drivers with their kernels.  These drivers are constantly being updated in the upstream kernel with new fixes and features, so when possible we recommend running an [endorsed distribution](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) that includes these fixes and updates.

If you're running a variant of Red Hat Enterprise Linux versions 6.0 to 6.3, then you'll need to install the [latest LIS drivers for Hyper-V](https://go.microsoft.com/fwlink/p/?LinkID=254263&clcid=0x409). Beginning with RHEL 6.4+ (and derivatives) the LIS drivers are already included with the kernel and so no additional installation packages are needed.

If a custom kernel is required, we recommend a recent kernel version (such as 3.8+). For distributions or vendors who maintain their own kernel, you'll need to regularly backport the LIS drivers from the upstream kernel to your custom kernel.  Even if you're already running a relatively recent kernel version, we highly recommend keeping track of any upstream fixes in the LIS drivers and backport them as needed. The locations of the LIS driver source files are specified in the [MAINTAINERS](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/tree/MAINTAINERS) file in the Linux kernel source tree:
```
    F:    arch/x86/include/asm/mshyperv.h
    F:    arch/x86/include/uapi/asm/hyperv.h
    F:    arch/x86/kernel/cpu/mshyperv.c
    F:    drivers/hid/hid-hyperv.c
    F:    drivers/hv/
    F:    drivers/input/serio/hyperv-keyboard.c
    F:    drivers/net/hyperv/
    F:    drivers/scsi/storvsc_drv.c
    F:    drivers/video/fbdev/hyperv_fb.c
    F:    include/linux/hyperv.h
    F:    tools/hv/
```
The following patches must be included in the kernel. This list can't be complete for all distributions.

* [ata_piix: defer disks to the Hyper-V drivers by default](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/drivers/ata/ata_piix.c?id=cd006086fa5d91414d8ff9ff2b78fbb593878e3c)
* [storvsc: Account for in-transit packets in the RESET path](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/drivers/scsi/storvsc_drv.c?id=5c1b10ab7f93d24f29b5630286e323d1c5802d5c)
* [storvsc: avoid usage of WRITE_SAME](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/storvsc_drv.c?id=3e8f4f4065901c8dfc51407e1984495e1748c090)
* [storvsc: Disable WRITE SAME for RAID and virtual host adapter drivers](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/storvsc_drv.c?id=54b2b50c20a61b51199bedb6e5d2f8ec2568fb43)
* [storvsc: NULL pointer dereference fix](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/storvsc_drv.c?id=b12bb60d6c350b348a4e1460cd68f97ccae9822e)
* [storvsc: ring buffer failures may result in I/O freeze](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/storvsc_drv.c?id=e86fb5e8ab95f10ec5f2e9430119d5d35020c951)
* [scsi_sysfs: protect against double execution of __scsi_remove_device](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/scsi_sysfs.c?id=be821fd8e62765de43cc4f0e2db363d0e30a7e9b)

## The Azure Linux Agent
The [Azure Linux Agent](../extensions/agent-linux.md) `waagent` provisions a Linux virtual machine in Azure. You can get the latest version, file issues, or submit pull requests at the [Linux Agent GitHub repo](https://github.com/Azure/WALinuxAgent).

* The Linux agent is released under the Apache 2.0 license. Many distributions already provide RPM or deb packages for the agent, and these packages can easily be installed and updated.
* The Azure Linux Agent requires Python v2.6+.
* The agent also requires the python-pyasn1 module. Most distributions provide this module as a separate package to be installed.
* In some cases, the Azure Linux Agent may not be compatible with NetworkManager. Many of the RPM/Deb packages provided by distributions configure NetworkManager as a conflict to the waagent package. In these cases, it will uninstall NetworkManager when you install the Linux agent package.
* The Azure Linux Agent must be at or above the [minimum supported version](https://support.microsoft.com/en-us/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support).

## General Linux System Requirements

1. Modify the kernel boot line in GRUB or GRUB2 to include the following parameters, so that all console messages are sent to the first serial port. These messages can assist Azure support with debugging any issues.
    ```  
    console=ttyS0,115200n8 earlyprintk=ttyS0,115200 rootdelay=300
    ```
    We also recommend *removing* the following parameters if they exist.
    ```  
    rhgb quiet crashkernel=auto
    ```
    Graphical and quiet boot isn't useful in a cloud environment, where we want all logs sent to the serial port. The `crashkernel` option may be left configured if needed, but note that this parameter reduces the amount of available memory in the VM by at least 128 MB, which may be problematic for smaller VM sizes.

1. Install the Azure Linux Agent.
  
    The Azure Linux Agent is required for provisioning a Linux image on Azure.  Many distributions provide the agent as an RPM or Deb package (the package is typically called WALinuxAgent or walinuxagent).  The agent can also be installed manually by following the steps in the [Linux Agent Guide](../extensions/agent-linux.md).

1. Ensure that the SSH server is installed, and configured to start at boot time.  This configuration is usually the default.

1. Don't create swap space on the OS disk.
  
    The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. The local resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (step 2 above), modify the following parameters in /etc/waagent.conf as needed.
    ```  
        ResourceDisk.Format=y
        ResourceDisk.Filesystem=ext4
        ResourceDisk.MountPoint=/mnt/resource
        ResourceDisk.EnableSwap=y
        ResourceDisk.SwapSizeMB=2048    ## NOTE: Set this to your desired size.
    ```
1. Run the following commands to deprovision the virtual machine.
  
     ```
     sudo waagent -force -deprovision
     export HISTSIZE=0
     logout
     ```  
   > [!NOTE]
   > On Virtualbox you may see the following error after running `waagent -force -deprovision` that says `[Errno 5] Input/output error`. This error message is not critical and can be ignored.

* Shut down the virtual machine and upload the VHD to Azure.

