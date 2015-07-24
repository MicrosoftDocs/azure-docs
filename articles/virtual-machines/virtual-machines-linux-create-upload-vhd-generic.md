<properties 
	pageTitle="Create and upload a Linux VHD in Azure"
	description="Learn to create and upload an Azure virtual hard disk (VHD) that contains a Linux operating system."
	services="virtual-machines"
	documentationCenter=""
	authors="szarkos"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/15/2015"
	ms.author="szarkos"/>


# <a id="nonendorsed"> </a>Information for Non-Endorsed Distributions #

**Important**: The Azure platform SLA applies to virtual machines running the Linux OS only when one of the [endorsed distributions](virtual-machines-../linux-endorsed-distributions.md) is used. All Linux distributions that are provided in the Azure image gallery are endorsed distributions with the required configuration.

- [Linux on Azure - Endorsed Distributions](virtual-machines-../linux-endorsed-distributions.md)
- [Support for Linux images in Microsoft Azure](http://support2.microsoft.com/kb/2941892)

All distributions running on Azure will need to meet a number of prerequisites to have a chance to properly run on the platform.  This article is by no means comprehensive as every distribution is different; and it is quite possible that even if you meet all the criteria below you will still need to significantly tweak your Linux system to ensure that it properly runs on the platform.

It is for this reason that we recommend that you start with one of our [Linux on Azure Endorsed Distributions](../linux-endorsed-distributions.md) when possible. The following articles will guide you through how to prepare the various endorsed Linux distributions that are supported on Azure:

- **[CentOS-based Distributions](virtual-machines-linux-create-upload-vhd-centos.md)**
- **[Oracle Linux](virtual-machines-linux-create-upload-vhd-oracle.md)**
- **[SLES & openSUSE](../virtual-machines-linux-create-upload-vhd-suse)**
- **[Ubuntu](virtual-machines-linux-create-upload-vhd-ubuntu.md)**

The rest of this article will focus on general guidance for running your Linux distribution on Azure.


## <a id="linuxinstall"> </a>General Linux Installation Notes ##

- The newer VHDX format is not supported in Azure. You can convert the disk to VHD format using Hyper-V Manager or the convert-vhd cmdlet.

- When installing the Linux system it is recommended that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting.  LVM or [RAID](virtual-machines-linux-configure-raid.md) may be used on data disks if preferred.

- NUMA is not supported for larger VM sizes due to a bug in Linux kernel versions below 2.6.37. This issue primarily impacts distributions using the upstream Red Hat 2.6.32 kernel. Manual installation of the Azure Linux agent (waagent) will automatically disable NUMA in the GRUB configuration for the Linux kernel.

- Do not configure a swap partition on the OS disk. The Linux agent can be configured to create a swap file on the temporary resource disk.  More information about this can be found in the steps below.

- All of the VHDs must have sizes that are multiples of 1 MB.


### Installing Linux Without Hyper-V ###

In some cases, Linux installers may not include the drivers for Hyper-V in the initial ramdisk (initrd or initramfs) unless it detects that it is running an a Hyper-V environment.  When using a different virtualization system (i.e. Virtualbox, KVM, etc.) to prepare your Linux image, you may need to rebuild the initrd to ensure that at least the `hv_vmbus` and `hv_storvsc` kernel modules are available on the initial ramdisk.  This is a known issue at least on systems based on the upstream Red Hat distribution.

The mechanism for rebuilding the initrd or initramfs image may vary depending on the distribution. Please consult your distribution's documentation or support for the proper procedure.  Here is one example for how to rebuild the initrd using the `mkinitrd` utility:

First, back up the existing initrd image:

	# cd /boot
	# sudo cp initrd-`uname -r`.img  initrd-`uname -r`.img.bak

Next, rebuild the initrd with the `hv_vmbus` and `hv_storvsc` kernel modules:

	# sudo mkinitrd --preload=hv_storvsc --preload=hv_vmbus -v -f initrd-`uname -r`.img `uname -r`


### Resizing VHDs ###

VHD images on Azure must have a virtual size aligned to 1MB.  Typically, VHDs created using Hyper-V should already be aligned correctly.  If the VHD is not aligned correctly then you may receive an error message similar to the following when you attempt to create an *image* from your VHD:

	"The VHD http://<mystorageaccount>.blob.core.windows.net/vhds/MyLinuxVM.vhd has an unsupported virtual size of 21475270656 bytes. The size must be a whole number (in MBs).”

To remedy this you can resize the VM using either the Hyper-V Manager console or the [Resize-VHD](http://technet.microsoft.com/library/hh848535.aspx) Powershell cmdlet.

If you are not running in a Windows environment then it is recommended to use qemu-img to convert (if needed) and resize the VHD:

 1. Resizing the VHD directly using tools such as `qemu-img` or `vbox-manage` may result in an unbootable VHD.  So it is recommended to first convert the VHD to a RAW disk image.  If the VM image was already created as RAW disk image (the default for some Hypervisors such as KVM) then you may skip this step:

		# qemu-img convert -f vpc -O raw MyLinuxVM.vhd MyLinuxVM.raw

 2. Calculate the required size of the disk image to ensure that the virtual size is aligned to 1MB.  The following bash shell script can assist with this.  The script uses "`qemu-img info`" to determine the virtual size of the disk image and then calculates the size to the next 1MB:

		rawdisk="MyLinuxVM.raw"
		vhddisk="MyLinuxVM.vhd"

		MB=$((1024*1024))
		size=$(qemu-img info -f raw --output json "$rawdisk" | \
		       gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')

		rounded_size=$((($size/$MB + 1)*$MB))
		echo "Rounded Size = $rounded_size"

 3. Resize the raw disk using $rounded_size as set in the above script:

		# qemu-img resize MyLinuxVM.raw $rounded_size

 4. Now, convert the RAW disk back to a fixed-size VHD:

		# qemu-img convert -f raw -o subformat=fixed -O vpc MyLinuxVM.raw MyLinuxVM.vhd



## Linux Kernel Requirements ##

The Linux Integration Services (LIS) drivers for Hyper-V and Azure are contributed directly to the upstream Linux kernel. Many distributions that include a recent Linux kernel version (i.e. 3.x) will have these drivers available already, or otherwise provide backported versions of these drivers with their kernels.  These drivers are constantly being updated in the upstream kernel with new fixes and features, so when possible it is recommended to run an [endorsed distribution](../linux-endorsed-distributions.md) that will include these fixes and updates.

If you are running a variant of Red Hat Enterprise Linux versions **6.0-6.3**, then you will need to install the latest LIS drivers for Hyper-V. The drivers can be found [at this location](http://go.microsoft.com/fwlink/p/?LinkID=254263&clcid=0x409). As of RHEL **6.4+** (and derivatives) the LIS drivers are already included with the kernel and so no additional installation packages are needed to run those systems on Azure.

If a custom kernel is required, it is recommended to use a more recent kernel version (i.e. **3.8+**). For those distributions or vendors who maintain their own kernel, some effort will be required to regularly backport the LIS drivers from the upstream kernel to your custom kernel.  Even if you are already running a relatively recent kernel version, it is highly recommended to keep track of any upstream fixes in the LIS drivers and backport those as needed. The location of the LIS driver source files is available in the [MAINTAINERS](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/tree/MAINTAINERS) file in the Linux kernel source tree:

	F:	arch/x86/include/asm/mshyperv.h
	F:	arch/x86/include/uapi/asm/hyperv.h
	F:	arch/x86/kernel/cpu/mshyperv.c
	F:	drivers/hid/hid-hyperv.c
	F:	drivers/hv/
	F:	drivers/input/serio/hyperv-keyboard.c
	F:	drivers/net/hyperv/
	F:	drivers/scsi/storvsc_drv.c
	F:	drivers/video/fbdev/hyperv_fb.c
	F:	include/linux/hyperv.h
	F:	tools/hv/

At a very minimum, the absence of the following patches have been known to cause problems on Azure and so these must be included in the kernel. This list is by no means exhaustive or complete for all distributions:

- [ata_piix: defer disks to the Hyper-V drivers by default](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/drivers/ata/ata_piix.c?id=cd006086fa5d91414d8ff9ff2b78fbb593878e3c)
- [storvsc: Account for in-transit packets in the RESET path](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/drivers/scsi/storvsc_drv.c?id=5c1b10ab7f93d24f29b5630286e323d1c5802d5c)
- [storvsc: avoid usage of WRITE_SAME](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/storvsc_drv.c?id=3e8f4f4065901c8dfc51407e1984495e1748c090)
- [storvsc: Disable WRITE SAME for RAID and virtual host adapter drivers](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/storvsc_drv.c?id=54b2b50c20a61b51199bedb6e5d2f8ec2568fb43)
- [storvsc: NULL pointer dereference fix](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/storvsc_drv.c?id=b12bb60d6c350b348a4e1460cd68f97ccae9822e)
- [storvsc: ring buffer failures may result in I/O freeze](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/storvsc_drv.c?id=e86fb5e8ab95f10ec5f2e9430119d5d35020c951)


## The Azure Linux Agent ##

The [Azure Linux Agent](virtual-machines-linux-agent-user-guide.md) (waagent) is required to properly provision a Linux virtual machine in Azure. You can get the latest version, file issues or submit pull requests at the [Linux Agent GitHub repo](https://github.com/Azure/WALinuxAgent).

- The Linux agent is released under the Apache 2.0 license. Many distributions already provide RPM or deb packages for the agent, and so in some cases this can be installed and updated with little effort.

- The Azure Linux Agent requires Python v2.6+.

- The agent also requires the python-pyasn1 module. Most distributions provide this as a separate package that can be installed.

- In some cases the Azure Linux Agent may not be compatible with NetworkManager. Many of the RPM/Deb packages provided by distributions configure NetworkManager as a conflict to the waagent package, and thus will uninstall NetworkManager when you install the Linux agent package.


## General Linux System Requirements ##

- Modify the kernel boot line in GRUB or GRUB2 to include the following parameters. This will also ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues:

		console=ttyS0 earlyprintk=ttyS0 rootdelay=300

	This will also ensure all console messages are sent to the first serial port, which can assist Azure support with debugging issues.

	In addition to the above, it is recommended to *remove* the following parameters if they exist:

		rhgb quiet crashkernel=auto

	Graphical and quiet boot are not useful in a cloud environment where we want all the logs to be sent to the serial port.

	The `crashkernel` option may be left configured if desired, but note that this parameter will reduce the amount of available memory in the VM by 128MB or more, which may be problematic on the smaller VM sizes.

- Installing the Azure Linux Agent

	The Azure Linux Agent is required for provisioning a Linux image on Azure.  Many distributions provide the agent as an RPM or Deb package (the package is typically called 'WALinuxAgent' or 'walinuxagent').  The agent can also be installed manually by following the steps in the [Linux Agent Guide](virtual-machines-linux-agent-user-guide.md).

- Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.

- Do not create swap space on the OS disk

	The Azure Linux Agent can automatically configure swap space using the local resource disk that is attached to the VM after provisioning on Azure. Note that the local resource disk is a *temporary* disk, and might be emptied when the VM is deprovisioned. After installing the Azure Linux Agent (see previous step), modify the following parameters in /etc/waagent.conf appropriately:

		ResourceDisk.Format=y
		ResourceDisk.Filesystem=ext4
		ResourceDisk.MountPoint=/mnt/resource
		ResourceDisk.EnableSwap=y
		ResourceDisk.SwapSizeMB=2048    ## NOTE: set this to whatever you need it to be.

- In "/etc/sudoers", you must remove or comment out the following lines, if they exist:

		Defaults targetpw
		ALL    ALL=(ALL) ALL

- As a final step, run the following commands to deprovision the virtual machine:

		# sudo waagent -force -deprovision
		# export HISTSIZE=0
		# logout

- You will then need to shut down the virtual machine and upload the VHD to Azure.
