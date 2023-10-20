---
title: Prepare Linux for imaging
description: Learn how to prepare a Linux system to be used for an image in Azure.
author: srijang
ms.service: virtual-machines
ms.custom: devx-track-linux
ms.collection: linux
ms.topic: how-to
ms.date: 12/14/2022
ms.author: srijangupta
ms.reviewer: mattmcinnes
---
# Prepare Linux for imaging in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

The Azure platform service-level agreement (SLA) applies to virtual machines (VMs) running the Linux operating system only when you're using one of the endorsed distributions. For endorsed distributions, Azure Marketplace provides preconfigured Linux images. For more information, see:

* [Endorsed Linux distributions on Azure](endorsed-distros.md)
* [Support for Linux and open-source technology in Azure](https://support.microsoft.com/kb/2941892)

All other distributions running on Azure, including community-supported and non-endorsed distributions, have some prerequisites.

This article focuses on general guidance for running your Linux distribution on Azure. This article can't be comprehensive, because every distribution is different. Even if you meet all the criteria that this article describes, you might need to significantly tweak your Linux system for it to run properly.

## General Linux installation notes

* Azure doesn't support the Hyper-V virtual hard disk (VHDX) format. Azure supports only *fixed VHD*. You can convert the disk to VHD format by using Hyper-V Manager or the [Convert-VHD](/powershell/module/hyper-v/convert-vhd) cmdlet. If you're using VirtualBox, select **Fixed size** rather than the default (**Dynamically allocated**) when you're creating the disk.

* Azure supports Gen1 (BIOS boot) and Gen2 (UEFI boot) virtual machines.

* The virtual file allocation table (VFAT) kernel module must be enabled in the kernel.

* The maximum size allowed for the VHD is 1,023 GB.

* When you're installing the Linux system, we recommend that you use standard partitions rather than Logical Volume Manager (LVM). LMV is the default for many installations.

  Using standard partitions will avoid LVM name conflicts with cloned VMs, particularly if an OS disk is ever attached to another identical VM for troubleshooting. You can use [LVM](/previous-versions/azure/virtual-machines/linux/configure-lvm) or [RAID](/previous-versions/azure/virtual-machines/linux/configure-raid) on data disks.

* Kernel support for mounting user-defined function (UDF) file systems is necessary. At first boot on Azure, the provisioning configuration is passed to the Linux VM via UDF-formatted media that are attached to the guest. The Azure Linux agent must mount the UDF file system to read its configuration and provision the VM.

* Linux kernel versions earlier than 2.6.37 don't support Non-Uniform Memory Access (NUMA) on Hyper-V with larger VM sizes. This issue primarily affects older distributions that use the upstream Red Hat 2.6.32 kernel. It was fixed in Red Hat Enterprise Linux (RHEL) 6.6 (kernel-2.6.32-504).

  Systems running custom kernels older than 2.6.37, or RHEL-based kernels older than 2.6.32-504, must set the boot parameter `numa=off` on the kernel command line in *grub.conf*. For more information, see [Red Hat KB 436883](https://access.redhat.com/solutions/436883).

* Don't configure a swap partition on the OS disk. You can configure the Linux agent to create a swap file on the temporary resource disk, as described later in this article.

* All VHDs on Azure must have a virtual size aligned to 1 MB (1024 x 1024 bytes). When you're converting from a raw disk to VHD, ensure that the raw disk size is a multiple of 1 MB before conversion, as described later in this article.

* Use the most up-to-date distribution version, packages, and software.

* Remove users and system accounts, public keys, sensitive data, unnecessary software, and applications.

> [!NOTE]
> Cloud-init version 21.2 or later removes the UDF requirement. But without the `udf` module enabled, the CD-ROM won't mount during provisioning, which prevents the custom data from being applied. A workaround is to apply user data. However, unlike custom data, user data isn't encrypted. For more information, see [User data formats](https://cloudinit.readthedocs.io/en/latest/topics/format.html) in the cloud-init documentation.

### Install kernel modules without Hyper-V

Azure runs on the Hyper-V hypervisor, so Linux requires certain kernel modules to run in Azure. If you have a VM that was created outside Hyper-V, the Linux installers might not include the drivers for Hyper-V in the initial RAM disk (initrd or initramfs), unless the VM detects that it's running in a Hyper-V environment.

When you're using a different virtualization system (such as VirtualBox or KVM) to prepare your Linux image, you might need to rebuild initrd so that at least the `hv_vmbus` and `hv_storvsc` kernel modules are available on the initial RAM disk. This known issue is for systems based on the upstream Red Hat distribution, and possibly others.

The mechanism for rebuilding the initrd or initramfs image can vary, depending on the distribution. Consult your distribution's documentation or support for the proper procedure. Here's one example for rebuilding initrd by using the `mkinitrd` utility:

1. Back up the existing initrd image:

    ```bash
    cd /boot
    sudo cp initrd-`uname -r`.img  initrd-`uname -r`.img.bak
    ```

2. Rebuild initrd by using the `hv_vmbus` and `hv_storvsc` kernel modules:

    ```bash
    sudo mkinitrd --preload=hv_storvsc --preload=hv_vmbus -v -f initrd-`uname -r`.img `uname -r`
    ```

### Resize VHDs

VHD images on Azure must have a virtual size aligned to 1 MB. Typically, VHDs created through Hyper-V are aligned correctly. If the VHD isn't aligned correctly, you might get an error message similar to the following example when you try to create an image from your VHD:

```config
The VHD http://<mystorageaccount>.blob.core.windows.net/vhds/MyLinuxVM.vhd has an unsupported virtual size of 21475270656 bytes. The size must be a whole number (in MBs).
```

In this case, resize the VM by using either the Hyper-V Manager console or the [Resize-VHD](/powershell/module/hyper-v/resize-vhd) PowerShell cmdlet.  If you aren't running in a Windows environment, we recommend using `qemu-img` to convert (if needed) and resize the VHD.

> [!NOTE]
> There's a [known bug in qemu-img](https://bugs.launchpad.net/qemu/+bug/1490611) for QEMU version 2.2.1 and some later versions that results in an improperly formatted VHD. The issue was fixed in QEMU 2.6. We recommend using version 2.2.0 or earlier, or using version 2.6 or later.

1. Resizing the VHD directly by using tools such as `qemu-img` or `vbox-manage` might result in an unbootable VHD. We recommend first converting the VHD to a raw disk image by using the following code.

   If the VM image was created as a raw disk image, you can skip this step. Creating the VM image as a raw disk image is the default in some hypervisors, such as KVM.

    ```bash
    sudo qemu-img convert -f vpc -O raw MyLinuxVM.vhd MyLinuxVM.raw
    ```

2. Calculate the required size of the disk image so that the virtual size is aligned to 1 MB. The following Bash shell script uses `qemu-img info` to determine the virtual size of the disk image, and then calculates the size to the next 1 MB:

    ```bash
    rawdisk="MyLinuxVM.raw"
    vhddisk="MyLinuxVM.vhd"

    MB=$((1024*1024))
    size=$(qemu-img info -f raw --output json "$rawdisk" | \
    gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')

    rounded_size=$(((($size+$MB-1)/$MB)*$MB))
    
    echo "Rounded Size = $rounded_size"
    ```

3. Resize the raw disk by using `$rounded_size`:

    ```bash
    sudo qemu-img resize MyLinuxVM.raw $rounded_size
    ```

4. Convert the raw disk back to a fixed-size VHD:

    ```bash
    sudo qemu-img convert -f raw -o subformat=fixed,force_size -O vpc MyLinuxVM.raw MyLinuxVM.vhd
    ```

   Or, with QEMU versions before 2.6, remove the `force_size` option:

    ```bash
    sudo qemu-img convert -f raw -o subformat=fixed -O vpc MyLinuxVM.raw MyLinuxVM.vhd
    ```

## Linux kernel requirements

The Linux Integration Services (LIS) drivers for Hyper-V and Azure are contributed directly to the upstream Linux kernel. Many distributions that include a recent Linux kernel version (such as 3.x) have these drivers available already, or otherwise provide backported versions of these drivers with their kernels.

LIS drivers are constantly being updated in the upstream kernel with new fixes and features. When possible, we recommend running an [endorsed distribution](endorsed-distros.md) that includes these fixes and updates.

If you're running a variant of RHEL versions 6.0 to 6.3, you need to install the [latest LIS drivers for Hyper-V](https://go.microsoft.com/fwlink/p/?LinkID=254263&clcid=0x409). Beginning with RHEL 6.4+ (and derivatives), the LIS drivers are already included with the kernel, so you don't need additional installation packages.

If a custom kernel is required, we recommend a recent kernel version (such as 3.8+). For distributions or vendors that maintain their own kernel, you need to regularly backport the LIS drivers from the upstream kernel to your custom kernel.

Even if you're already running a relatively recent kernel version, we highly recommend keeping track of any upstream fixes in the LIS drivers and backporting them as needed. The locations of the LIS driver source files are specified in the [MAINTAINERS](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/tree/MAINTAINERS) file in the Linux kernel source tree:

```config
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

The VM's active kernel must include the following patches. This list can't be complete for all distributions.

* [ata_piix: defer disks to the Hyper-V drivers by default](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/drivers/ata/ata_piix.c?id=cd006086fa5d91414d8ff9ff2b78fbb593878e3c)
* [storvsc: Account for in-transit packets in the RESET path](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/drivers/scsi/storvsc_drv.c?id=5c1b10ab7f93d24f29b5630286e323d1c5802d5c)
* [storvsc: avoid usage of WRITE_SAME](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/storvsc_drv.c?id=3e8f4f4065901c8dfc51407e1984495e1748c090)
* [storvsc: Disable WRITE SAME for RAID and virtual host adapter drivers](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/storvsc_drv.c?id=54b2b50c20a61b51199bedb6e5d2f8ec2568fb43)
* [storvsc: NULL pointer dereference fix](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/storvsc_drv.c?id=b12bb60d6c350b348a4e1460cd68f97ccae9822e)
* [storvsc: ring buffer failures may result in I/O freeze](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/storvsc_drv.c?id=e86fb5e8ab95f10ec5f2e9430119d5d35020c951)
* [scsi_sysfs: protect against double execution of __scsi_remove_device](https://git.kernel.org/cgit/linux/kernel/git/next/linux-next.git/commit/drivers/scsi/scsi_sysfs.c?id=be821fd8e62765de43cc4f0e2db363d0e30a7e9b)

## Azure Linux Agent

The [Azure Linux Agent](../extensions/agent-linux.md) (`waagent`) provisions a Linux virtual machine in Azure. You can get the latest version, report problems, or submit pull requests at the [Linux Agent GitHub repo](https://github.com/Azure/WALinuxAgent).

Here are some considerations for using the Azure Linux Agent:

* The Linux agent is released under the Apache 2.0 license. Many distributions already provide .rpm or .deb packages for the agent. You can easily install and update these packages.
* The Azure Linux Agent requires Python v2.6+.
* The agent also requires the `python-pyasn1` module. Most distributions provide this module as a separate package to be installed.
* In some cases, the Azure Linux Agent might not be compatible with NetworkManager. Many of the packages (.rpm or .deb) provided by distributions configure NetworkManager as a conflict to the `waagent` package. In these cases, the agent will uninstall NetworkManager when you install the Linux agent package.
* The Azure Linux Agent must be at or above the [minimum supported version](https://support.microsoft.com/en-us/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support).

> [!NOTE]
> Make sure the `udf` and `vfat` modules are enabled. Disabling the `udf` module will cause a provisioning failure. Disabling the `vfat` module will cause both provisioning and boot failures. Cloud-init version 21.2 or later can provision VMs without requiring UDF if both of these conditions exist:
>
> * You created the VM by using SSH public keys and not passwords.
> * You didn't provide any custom data.

## General Linux system requirements

1. Modify the kernel boot line in GRUB or GRUB2 to include the following parameters, so that all console messages are sent to the first serial port. These messages can assist Azure support with debugging any issues.

    ```config
    GRUB_CMDLINE_LINUX="rootdelay=300 console=ttyS0 earlyprintk=ttyS0 net.ifnames=0"
    ```

    We also recommend *removing* the following parameters if they exist:

    ```config
    rhgb quiet crashkernel=auto
    ```

    Graphical and quiet boot aren't useful in a cloud environment, where you want all logs sent to the serial port. You can leave the `crashkernel` option configured if needed, but this parameter reduces the amount of available memory in the VM by at least 128 MB. Reducing available memory might be problematic for smaller VM sizes.

2. After you finish editing */etc/default/grub*, run the following command to rebuild the GRUB configuration:

    ```bash
    sudo grub2-mkconfig -o /boot/grub2/grub.cfg
    ```

3. Add the Hyper-V module for initramfs by using `dracut`:

   ```bash
   cd /boot
   sudo cp initramfs-<kernel-version>.img <kernel-version>.img.bak 
   sudo dracut -f -v initramfs-<kernel-version>.img <kernel-version> --add-drivers "hv_vmbus hv_netvsc hv_storvsc"
   sudo grub-mkconfig -o /boot/grub/grub.cfg 
   sudo grub2-mkconfig -o /boot/grub2/grub.cfg 
   ```

   Add the Hyper-V module for initrd by using `mkinitramfs`:

   ```bash
   cd /boot
   sudo cp initrd.img-<kernel-version>  initrd.img-<kernel-version>.bak
   sudo mkinitramfs -o initrd.img-<kernel-version> <kernel-version>  --with=hv_vmbus,hv_netvsc,hv_storvsc
   sudo update-grub 
   ```

4. Ensure that the SSH server is installed and configured to start at boot time. This configuration is usually the default.

5. Install the Azure Linux Agent.

   The Azure Linux Agent is required for provisioning a Linux image on Azure. Many distributions provide the agent as an .rpm or .deb package. The package is typically called `WALinuxAgent` or `walinuxagent`. You can also install the agent manually by following the steps in the [Azure Linux Agent guide](../extensions/agent-linux.md).

   > [!NOTE]
   > Make sure the `udf` and `vfat` modules are enabled. Removing or disabling them will cause a provisioning or boot failure. Cloud-init version 21.2 or later removes the UDF requirement.

   Install the Azure Linux Agent, cloud-init, and other necessary utilities by running one of the following commands.

   Use this command for Red Hat or CentOS:

   ```bash
   sudo yum install -y WALinuxAgent cloud-init cloud-utils-growpart gdisk hyperv-daemons
   ```

   Use this command for Ubuntu/Debian:

   ```bash
   sudo apt install walinuxagent cloud-init cloud-utils-growpart gdisk hyperv-daemons
   ```

   Use this command for SUSE:

   ```bash
   sudo zypper install python-azure-agent cloud-init cloud-utils-growpart gdisk hyperv-daemons
   ```

   Then enable the agent and cloud-init on all distributions:

   ```bash
   sudo systemctl enable waagent.service
   sudo systemctl enable cloud-init.service
   ```

6. Don't create swap space on the OS disk.

   You can use the Azure Linux Agent or cloud-init to configure swap space via the local resource disk.  This resource disk is attached to the VM after provisioning on Azure. The local resource disk is a temporary disk and might be emptied when the VM is deprovisioned. The following blocks show how to configure this swap.

   If you choose Azure Linux Agent, modify the following parameters in */etc/waagent.conf*:

   ```config
   ResourceDisk.Format=y
   ResourceDisk.Filesystem=ext4
   ResourceDisk.MountPoint=/mnt/resource
   ResourceDisk.EnableSwap=y
   ResourceDisk.SwapSizeMB=2048    ## NOTE: Set this to your desired size.
   ```

   If you choose cloud-init, configure cloud-init to handle the provisioning:

   ```bash
   sudo sed -i 's/Provisioning.Agent=auto/Provisioning.Agent=cloud-auto/g' /etc/waagent.conf
   sudo sed -i 's/ResourceDisk.Format=y/ResourceDisk.Format=n/g' /etc/waagent.conf
   sudo sed -i 's/ResourceDisk.EnableSwap=y/ResourceDisk.EnableSwap=n/g' /etc/waagent.conf
   ```

   To configure cloud-init to format and create swap space, you have two options:

   * Pass in a cloud-init configuration every time you create a VM through `customdata`. We recommend this method.
   * Use a cloud-init directive in the image to configure swap space every time the VM is created.

   Create a .cfg file to configure swap space by using cloud-init:

    ```bash
    sudo echo 'DefaultEnvironment="CLOUD_CFG=/etc/cloud/cloud.cfg.d/00-azure-swap.cfg"' >> /etc/systemd/system.conf
    sudo cat > /etc/cloud/cloud.cfg.d/00-azure-swap.cfg << EOF
    #cloud-config
    # Generated by Azure cloud image build
    disk_setup:
      ephemeral0:
        table_type: mbr
        layout: [66, [33, 82]]
        overwrite: True
    fs_setup:
      - device: ephemeral0.1
        filesystem: ext4
      - device: ephemeral0.2
        filesystem: swap
    mounts:
      - ["ephemeral0.1", "/mnt/resource"]
      - ["ephemeral0.2", "none", "swap", "sw,nofail,x-systemd.requires=cloud-init.service,x-systemd.device-timeout=2", "0", "0"]
    EOF
    ```

7. Configure cloud-init to handle the provisioning:
    1. Configure `waagent` for cloud-init:

       ```bash
       sudo sed -i 's/Provisioning.Agent=auto/Provisioning.Agent=cloud-init/g' /etc/waagent.conf
       sudo sed -i 's/ResourceDisk.Format=y/ResourceDisk.Format=n/g' /etc/waagent.conf
       sudo sed -i 's/ResourceDisk.EnableSwap=y/ResourceDisk.EnableSwap=n/g' /etc/waagent.conf
       ```

       If you're migrating a specific virtual machine and don't want to create a generalized image, set `Provisioning.Agent=disabled` in the */etc/waagent.conf* configuration.

    1. Configure mounts:

       ```bash
       sudo echo "Adding mounts and disk_setup to init stage"
       sudo sed -i '/ - mounts/d' /etc/cloud/cloud.cfg
       sudo sed -i '/ - disk_setup/d' /etc/cloud/cloud.cfg
       sudo sed -i '/cloud_init_modules/a\\ - mounts' /etc/cloud/cloud.cfg
       sudo sed -i '/cloud_init_modules/a\\ - disk_setup' /etc/cloud/cloud.cfg

    1. Configure the Azure data source:

       ```bash
       sudo echo "Allow only Azure datasource, disable fetching network setting via IMDS"
       sudo cat > /etc/cloud/cloud.cfg.d/91-azure_datasource.cfg <<EOF
       datasource_list: [ Azure ]
       datasource:
          Azure:
            apply_network_config: False
       EOF
       ```

    1. Remove the existing swap file if you configured one:

       ```bash
       if [[ -f /mnt/resource/swapfile ]]; then
       echo "Removing swapfile" #RHEL uses a swap file by default
       swapoff /mnt/resource/swapfile
       rm /mnt/resource/swapfile -f
       fi
       ```

    1. Configure cloud-init logging:

        ```bash
        sudo echo "Add console log file"
        sudo cat >> /etc/cloud/cloud.cfg.d/05_logging.cfg <<EOF

        # This tells cloud-init to redirect its stdout and stderr to
        # 'tee -a /var/log/cloud-init-output.log' so the user can see output
        # there without needing to look on the console.
        output: {all: '| tee -a /var/log/cloud-init-output.log'}
        EOF
        ```

8. Run the following commands to deprovision the virtual machine.

   > [!CAUTION]
   > If you're migrating a specific virtual machine and don't want to create a generalized image, skip the deprovisioning step. Running the command `waagent -force -deprovision+user` will render the source machine unusable. This step is intended only to create a generalized image.

   ```bash
   sudo rm -f /var/log/waagent.log
   sudo cloud-init clean
   sudo waagent -force -deprovision+user
   sudo rm -f ~/.bash_history
   sudo export HISTSIZE=0
   ```  

   On VirtualBox, you might see an error message after you run `waagent -force -deprovision` that says `[Errno 5] Input/output error`. This error message is not critical, and you can ignore it.

9. Shut down the virtual machine and upload the VHD to Azure.

## Next steps

[Create a Linux VM from a custom disk by using the Azure CLI](upload-vhd.md)
