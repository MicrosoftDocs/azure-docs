---
title: Prepare Azure VM image for use with cloud-init 
description: How to prepare an pre-existing Azure VM image for deployment with cloud-init
author: danis
ms.service: virtual-machines-linux
ms.subservice: imaging
ms.topic: article
ms.date: 06/24/2019
ms.author: danis

---
# Prepare an existing Linux Azure VM image for use with cloud-init
This article shows you how to take an existing Azure virtual machine and prepare it to be redeployed and ready to use cloud-init. The resulting image can be used to deploy a new virtual machine or virtual machine scale sets - either of which could then be further customized by cloud-init at deployment time.  These cloud-init scripts run on first boot once the resources have been provisioned by Azure. For more information about how cloud-init works natively in Azure and the supported Linux distros, see [cloud-init overview](using-cloud-init.md)

## Prerequisites
This document assumes you already have a running Azure virtual machine running a supported version of the Linux operating system. You have already configured the machine to suit your needs, installed all the required modules, processed all the required updates and have tested it to ensure it meets your requirements. 

## Preparing RHEL 7.6 / CentOS 7.6
You need to SSH into your Linux VM and run the following commands in order to install cloud-init.

```bash
sudo yum makecache fast
sudo yum install -y gdisk cloud-utils-growpart
sudo yum install - y cloud-init 
```

Update the `cloud_init_modules` section in `/etc/cloud/cloud.cfg` to include the following modules:

```bash
- disk_setup
- mounts
```

Here is a sample of what a general-purpose `cloud_init_modules` section looks like.

```bash
cloud_init_modules:
 - migrator
 - bootcmd
 - write-files
 - growpart
 - resizefs
 - disk_setup
 - mounts
 - set_hostname
 - update_hostname
 - update_etc_hosts
 - rsyslog
 - users-groups
 - ssh
```

A number of tasks relating to provisioning and handling ephemeral disks need to be updated in `/etc/waagent.conf`. Run the following commands to update the appropriate settings.

```bash
sed -i 's/Provisioning.Enabled=y/Provisioning.Enabled=n/g' /etc/waagent.conf
sed -i 's/Provisioning.UseCloudInit=n/Provisioning.UseCloudInit=y/g' /etc/waagent.conf
sed -i 's/ResourceDisk.Format=y/ResourceDisk.Format=n/g' /etc/waagent.conf
sed -i 's/ResourceDisk.EnableSwap=y/ResourceDisk.EnableSwap=n/g' /etc/waagent.conf
cloud-init clean
```

Allow only Azure as a datasource for the Azure Linux Agent by creating a new file `/etc/cloud/cloud.cfg.d/91-azure_datasource.cfg` using an editor of your choice with the following line:

```bash
# Azure Data Source config
datasource_list: [ Azure ]
```

If your existing Azure image has a swap file configured and you want to change the swap file configuration for new images using cloud-init, you need to remove the existing swap file.

For Red Hat based images - follow the instructions in the following Red Hat document explaining how to [remove the swap file](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/storage_administration_guide/swap-removing-file).

For CentOS images with swapfile enabled, you can run the following command to turn off the swapfile:

```bash
sudo swapoff /mnt/resource/swapfile
```

Ensure the swapfile reference is removed from `/etc/fstab` - it should look something like the following output:

```output
# /etc/fstab
# Accessible filesystems, by reference, are maintained under '/dev/disk'
# See man pages fstab(5), findfs(8), mount(8) and/or blkid(8) for more info
#
UUID=99cf66df-2fef-4aad-b226-382883643a1c / xfs defaults 0 0
UUID=7c473048-a4e7-4908-bad3-a9be22e9d37d /boot xfs defaults 0 0
```

To save space and remove the swap file you can run the following command:

```bash
rm /mnt/resource/swapfile
```

## Extra step for cloud-init prepared image
> [!NOTE]
> If your image was previously a **cloud-init** prepared and configured image, you need to do the following steps.

The following three commands are only used if the VM you are customizing to be a new specialized source image was previously provisioned by cloud-init.  You do NOT need to run these if your image was configured using the Azure Linux Agent.

```bash
sudo cloud-init clean --logs
sudo waagent -deprovision+user -force
```

## Finalizing Linux Agent setting 
All Azure platform images have the Azure Linux Agent installed, regardless if it was configured by cloud-init or not.  Run the following command to finish deprovisioning the user from the Linux machine. 

```bash
sudo waagent -deprovision+user -force
```

For more information about the Azure Linux Agent deprovision commands, see the [Azure Linux Agent](../extensions/agent-linux.md) for more details.

Exit the SSH session, then from your bash shell, run the following AzureCLI commands to deallocate, generalize and create a new Azure VM image.  Replace `myResourceGroup` and `sourceVmName` with the appropriate information reflecting your sourceVM.

```azurecli
az vm deallocate --resource-group myResourceGroup --name sourceVmName
az vm generalize --resource-group myResourceGroup --name sourceVmName
az image create --resource-group myResourceGroup --name myCloudInitImage --source sourceVmName
```

## Next steps
For additional cloud-init examples of configuration changes, see the following:
 
- [Add an additional Linux user to a VM](cloudinit-add-user.md)
- [Run a package manager to update existing packages on first boot](cloudinit-update-vm.md)
- [Change VM local hostname](cloudinit-update-vm-hostname.md) 
- [Install an application package, update configuration files and inject keys](tutorial-automate-vm-deployment.md)
