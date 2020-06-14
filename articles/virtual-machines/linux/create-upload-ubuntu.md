---
title: Create and upload an Ubuntu Linux VHD in Azure
description: Learn to create and upload an Azure virtual hard disk (VHD) that contains an Ubuntu Linux operating system.
author: danielsollondon
ms.service: virtual-machines-linux
ms.topic: article
ms.date: 06/06/2020
ms.author: danis

---
# Prepare an Ubuntu virtual machine for Azure


Ubuntu now publishes official Azure VHDs for download at [https://cloud-images.ubuntu.com/](https://cloud-images.ubuntu.com/). If you need to build your own specialized Ubuntu image for Azure, rather than use the manual procedure below it is recommended to start with these known working VHDs and customize as needed. The latest image releases can always be found at the following locations:

* Ubuntu 16.04/Xenial: [ubuntu-16.04-server-cloudimg-amd64-disk1.vmdk](https://cloud-images.ubuntu.com/releases/xenial/release/ubuntu-16.04-server-cloudimg-amd64-disk1.vmdk)
* Ubuntu 18.04/Bionic: [bionic-server-cloudimg-amd64.vmdk](https://cloud-images.ubuntu.com/bionic/current/bionic-server-cloudimg-amd64.vmdk)

## Prerequisites
This article assumes that you have already installed an Ubuntu Linux operating system to a virtual hard disk. Multiple tools exist to create .vhd files, for example a virtualization solution such as Hyper-V. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](https://technet.microsoft.com/library/hh846766.aspx).

**Ubuntu installation notes**

* Please see also [General Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more tips on preparing Linux for Azure.
* The VHDX format is not supported in Azure, only **fixed VHD**.  You can convert the disk to VHD format using Hyper-V Manager or the `Convert-VHD` cmdlet.
* When installing the Linux system it is recommended that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. [LVM](configure-lvm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) or [RAID](configure-raid.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) may be used on data disks if preferred.
* Do not configure a swap partition or swapfile on the OS disk. The cloud-init provisioning agent can be configured to create a swap file or a swap partition on the temporary resource disk. More information about this can be found in the steps below.
* All VHDs on Azure must have a virtual size aligned to 1MB. When converting from a raw disk to VHD you must ensure that the raw disk size is a multiple of 1MB before conversion. See [Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more information.

## Manual steps
> [!NOTE]
> Before attempting to create your own custom Ubuntu image for Azure, please consider using the pre-built and tested images from [https://cloud-images.ubuntu.com/](https://cloud-images.ubuntu.com/) instead.
> 
> 

1. In the center pane of Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open the window for the virtual machine.

3. Replace the current repositories in the image to use Ubuntu's Azure repository.
   
	Before editing `/etc/apt/sources.list`, it is recommended to make a backup:
   
		# sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

	Ubuntu 16.04 and Ubuntu 18.04:
   
		# sudo sed -i 's/http:\/\/archive\.ubuntu\.com\/ubuntu\//http:\/\/azure\.archive\.ubuntu\.com\/ubuntu\//g' /etc/apt/sources.list
		# sudo sed -i 's/http:\/\/[a-z][a-z]\.archive\.ubuntu\.com\/ubuntu\//http:\/\/azure\.archive\.ubuntu\.com\/ubuntu\//g' /etc/apt/sources.list
		# sudo apt-get update


4. The Ubuntu Azure images are now using the [Azure-tailored kernel](https://ubuntu.com/blog/microsoft-and-canonical-increase-velocity-with-azure-tailored-kernel). Update the operating system to the latest Azure-tailored kernel and install Azure Linux tools (including Hyper-V dependencies) by running the following commands:

	Ubuntu 16.04 and Ubuntu 18.04:

        # sudo apt update
        # sudo apt install linux-azure linux-image-azure linux-headers-azure linux-tools-common linux-cloud-tools-common linux-tools-azure linux-cloud-tools-azure
        (recommended) # sudo apt full-upgrade

        # sudo reboot

5. Modify the kernel boot line for Grub to include additional kernel parameters for Azure. To do this open `/etc/default/grub` in a text editor, find the variable called `GRUB_CMDLINE_LINUX_DEFAULT` (or add it if needed) and edit it to include the following parameters:
   
	```
	GRUB_CMDLINE_LINUX_DEFAULT="console=tty1 console=ttyS0,115200n8 earlyprintk=ttyS0,115200 rootdelay=300 quiet splash"
	```

    Save and close this file, and then run `sudo update-grub`. This will ensure all console messages are sent to the first serial port, which can assist Azure technical support with debugging issues.

6. Ensure that the SSH server is installed and configured to start at boot time.  This is usually the default.

7. Install cloud-init (the provisioning agent) and the Azure Linux Agent (the guest extensions handler). Cloud-init uses netplan to configure the system network configuration during provisioning and each subsequent boot.

		# sudo apt update
		# sudo apt install cloud-init netplan.io walinuxagent && systemctl stop walinuxagent

   > [!Note]
   >  The `walinuxagent` package may remove the `NetworkManager` and `NetworkManager-gnome` packages, if they are installed.

8. Remove cloud-init default configs and leftover netplan artifacts that may conflict with cloud-init provisioning on Azure:

		# rm -f /etc/cloud/cloud.cfg.d/50-curtin-networking.cfg /etc/cloud/cloud.cfg.d/curtin-preserve-sources.cfg
		# rm -f /etc/cloud/ds-identify.cfg
		# rm -f /etc/netplan/*.yaml

9. Configure cloud-init to provision the system using the Azure datasource:

	```
	# cat > /etc/cloud/cloud.cfg.d/90_dpkg.cfg << EOF
	datasource_list: [ Azure ]
	EOF

	# cat > /etc/cloud/cloud.cfg.d/90-azure.cfg << EOF
    system_info:
       package_mirrors:
         - arches: [i386, amd64]
           failsafe:
             primary: http://archive.ubuntu.com/ubuntu
             security: http://security.ubuntu.com/ubuntu
           search:
             primary:
               - http://azure.archive.ubuntu.com/ubuntu/
             security: []
         - arches: [armhf, armel, default]
           failsafe:
             primary: http://ports.ubuntu.com/ubuntu-ports
             security: http://ports.ubuntu.com/ubuntu-ports
	EOF

	# cat > /etc/cloud/cloud.cfg.d/10-azure-kvp.cfg << EOF
    reporting:
      logging:
        type: log
      telemetry:
        type: hyperv
	EOF
	```

10. Configure the Azure Linux agent to rely on cloud-init to perform provisioning. Have a look at the [WALinuxAgent project](https://github.com/Azure/WALinuxAgent) for more information on these options.

		sed -i 's/Provisioning.Enabled=y/Provisioning.Enabled=n/g' /etc/waagent.conf
		sed -i 's/Provisioning.UseCloudInit=n/Provisioning.UseCloudInit=y/g' /etc/waagent.conf
		sed -i 's/ResourceDisk.Format=y/ResourceDisk.Format=n/g' /etc/waagent.conf
		sed -i 's/ResourceDisk.EnableSwap=y/ResourceDisk.EnableSwap=n/g' /etc/waagent.conf

		cat >> /etc/waagent.conf << EOF
		# For Azure Linux agent version >= 2.2.45, this is the option to configure,
		# enable, or disable the provisioning behavior of the Linux agent.
		# Accepted values are auto (default), waagent, cloud-init, or disabled.
		# A value of auto means that the agent will rely on cloud-init to handle
		# provisioning if it is installed and enabled, which in this case it will.
		Provisioning.Agent=auto
		EOF

11. Clean cloud-init and Azure Linux agent runtime artifacts and logs:

		# sudo cloud-init clean --logs --seed
		# sudo rm -rf /var/lib/cloud/
		# sudo systemctl stop walinuxagent.service
		# sudo rm -rf /var/lib/waagent/
		# sudo rm -f /var/log/waagent.log

12. Run the following commands to deprovision the virtual machine and prepare it for provisioning on Azure:

	> [!NOTE]
	> The `sudo waagent -force -deprovision+user` command will attempt to clean the system and make it suitable for re-provisioning. The `+user` option deletes the last provisioned user account and associated data.

	> [!WARNING]
	> Deprovisioning using the command above does not guarantee that the image is cleared of all sensitive information and is suitable for redistribution.

		# sudo waagent -force -deprovision+user
		# rm -f ~/.bash_history
		# export HISTSIZE=0
		# logout

13. Click **Action -> Shut Down** in Hyper-V Manager.

14. Azure only accepts fixed-size VHDs. If the VM's OS disk is not a fixed-size VHD, use the `Convert-VHD` PowerShell cmdlet and specify the `-VHDType Fixed` option. Please have a look at the docs for `Convert-VHD` here: [Convert-VHD](https://docs.microsoft.com/powershell/module/hyper-v/convert-vhd?view=win10-ps).


## Next steps
You're now ready to use your Ubuntu Linux virtual hard disk to create new virtual machines in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](upload-vhd.md#option-1-upload-a-vhd).

