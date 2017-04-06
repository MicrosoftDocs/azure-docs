---
title: Reset access on Azure Linux VMs using the VMAccess Extension  | Microsoft Docs
description: Reset access on Azure Linux VMs using the VMAccess Extension.
services: virtual-machines-linux
documentationcenter: ''
author: vlivech
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 261a9646-1f93-407e-951e-0be7226b3064
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 10/25/2016
ms.author: v-livech

---
# Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension with the Azure CLI 1.0
This article shows you how to use the Azure VMAcesss Extension to check or repair a disk, reset user access, manage user accounts, or reset the SSHD configuration on Linux. The article requires:

* an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/)).
* the [Azure CLI](../../cli-install-nodejs.md) logged in with `azure login`.
* the Azure CLI *must be in* Azure Resource Manager mode `azure config mode arm`.


## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](#quick-commands)– our CLI for the classic and resource management deployment models (this article)
- [Azure CLI 2.0](using-vmaccess-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) - our next generation CLI for the resource management deployment model


## Quick commands
There are two ways to use VMAccess on your Linux VMs:

* Using the Azure CLI 1.0 and the required parameters.
* Using raw JSON files that VMAccess processes and then act on.

For the quick command section, we are going to use the Azure CLI 1.0 `azure vm reset-access` method. In the following command examples, replace the values that contain "example" with the values from your own environment.

## Create a Resource Group and Linux VM
```bash
azure group create myResourceGroup westus
```

## Create a Debian VM
```azurecli
azure vm quick-create \
  -M ~/.ssh/id_rsa.pub \
  -u myAdminUser \
  -g myResourceGroup \
  -l westus \
  -y Linux \
  -n myVM \
  -Q Debian
```

## Reset root password
To reset the root password:

```azurecli
azure vm reset-access \
  -g myResourceGroup \
  -n myVM \
  -u root \
  -p myNewPassword
```

## SSH key reset
To reset the SSH key of a non-root user:

```azurecli
azure vm reset-access \
  -g myResourceGroup \
  -n myVM \
  -u myAdminUser \
  -M ~/.ssh/id_rsa.pub
```

## Create a user
To create a user:

```azurecli
azure vm reset-access \
  -g myResourceGroup \
  -n myVM \
  -u myAdminUser \
  -p myAdminUserPassword
```

## Remove a user
```azurecli
azure vm reset-access \
  -g myResourceGroup \
  -n myVM \
  -R myRemovedUser
```

## Reset SSHD
To reset the SSHD configuration:

```azurecli
azure vm reset-access \
  -g myResourceGroup \
  -n myVM
  -r
```


## Detailed walkthrough
### VMAccess defined:
The disk on your Linux VM is showing errors. You somehow reset the root password for your Linux VM or accidentally deleted your SSH private key. If that happened back in the days of the datacenter, you would need to drive there and then open the KVM to get at the server console. Think of the Azure VMAccess extension as that KVM switch that allows you to access the console to reset access to Linux or perform disk level maintenance.

For the detailed walkthrough, we are going to use the long form of VMAccess, which uses raw JSON files.  These VMAccess JSON files can also be called from Azure templates.

### Using VMAccess to check or repair the disk of a Linux VM
Using VMAccess you can do a fsck run on the disk under your Linux VM.  You can also do a disk check and a disk repair using a VMAccess.

To check, and then repair the disk use this VMAccess script:

`disk_check_repair.json`

```json
{
  "check_disk": "true",
  "repair_disk": "true, user-disk-name"
}
```

Execute the VMAccess script with:

```azurecli
azure vm extension set \
  myResourceGroup \
  myVM \
  VMAccessForLinux \
  Microsoft.OSTCExtensions * \
  --private-config-path disk_check_repair.json
```

### Using VMAccess to reset user access to Linux
If you have lost access to root on your Linux VM, you can launch a VMAccess script to reset the root password.

To reset the root password, use this VMAccess script:

`reset_root_password.json`

```json
{
  "username":"root",
  "password":"myNewPassword"
}
```

Execute the VMAccess script with:

```azurecli
azure vm extension set \
  myResourceGroup \
  myVM \
  VMAccessForLinux \
  Microsoft.OSTCExtensions * \
  --private-config-path reset_root_password.json
```

To reset the SSH key of a non-root user, use this VMAccess script:

`reset_ssh_key.json`

```json
{
  "username":"myAdminUser",
  "ssh_key":"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCZ3S7gGp3rcbKmG2Y4vGZFMuMZCwoUzZNG1vHY7P2XV2x9FfAhy8iGD+lF8UdjFX3t5ebMm6BnnMh8fHwkTRdOt3LDQq8o8ElTBrZaKPxZN2thMZnODs5Hlemb2UX0oRIGRcvWqsd4oJmxsXa/Si98Wa6RHWbc9QZhw80KAcOVhmndZAZAGR+Wq6yslNo5TMOr1/ZyQAook5C4FtcSGn3Y+WczaoGWIxG4ZaWk128g79VIeJcIQqOjPodHvQAhll7qDlItVvBfMOben3GyhYTm7k4YwlEdkONm4yV/UIW0la1rmyztSBQIm9sZmSq44XXgjVmDHNF8UfCZ1ToE4r2SdwTmZv00T2i5faeYnHzxiLPA3Enub7iUo5IdwFArnqad7MO1SY1kLemhX9eFjLWN4mJe56Fu4NiWJkR9APSZQrYeKaqru4KUC68QpVasNJHbuxPSf/PcjF3cjO1+X+4x6L1H5HTPuqUkyZGgDO4ynUHbko4dhlanALcriF7tIfQR9i2r2xOyv5gxJEW/zztGqWma/d4rBoPjnf6tO7rLFHXMt/DVTkAfn5woYtLDwkn5FMyvThRmex3BDf0gujoI1y6cOWLe9Y5geNX0oj+MXg/W0cXAtzSFocstV1PoVqy883hNoeQZ3mIGB3Q0rIUm5d9MA2bMMt31m1g3Sin6EQ== myAdminUser@myVM" 
}
```

Execute the VMAccess script with:

```azurecli
azure vm extension set \
  myResourceGroup \
  myVM \
  VMAccessForLinux \
  Microsoft.OSTCExtensions * \
  --private-config-path reset_ssh_key.json
```

### Using VMAccess to manage user accounts on Linux
VMAccess is a Python script that can be used to manage users on your Linux VM without logging in and using sudo or the root account.

To create a user, use this VMAccess script:

`create_new_user.json`

```json
{
  "username":"myNewUser",
  "ssh_key":"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCZ3S7gGp3rcbKmG2Y4vGZFMuMZCwoUzZNG1vHY7P2XV2x9FfAhy8iGD+lF8UdjFX3t5ebMm6BnnMh8fHwkTRdOt3LDQq8o8ElTBrZaKPxZN2thMZnODs5Hlemb2UX0oRIGRcvWqsd4oJmxsXa/Si98Wa6RHWbc9QZhw80KAcOVhmndZAZAGR+Wq6yslNo5TMOr1/ZyQAook5C4FtcSGn3Y+WczaoGWIxG4ZaWk128g79VIeJcIQqOjPodHvQAhll7qDlItVvBfMOben3GyhYTm7k4YwlEdkONm4yV/UIW0la1rmyztSBQIm9sZmSq44XXgjVmDHNF8UfCZ1ToE4r2SdwTmZv00T2i5faeYnHzxiLPA3Enub7iUo5IdwFArnqad7MO1SY1kLemhX9eFjLWN4mJe56Fu4NiWJkR9APSZQrYeKaqru4KUC68QpVasNJHbuxPSf/PcjF3cjO1+X+4x6L1H5HTPuqUkyZGgDO4ynUHbko4dhlanALcriF7tIfQR9i2r2xOyv5gxJEW/zztGqWma/d4rBoPjnf6tO7rLFHXMt/DVTkAfn5woYtLDwkn5FMyvThRmex3BDf0gujoI1y6cOWLe9Y5geNX0oj+MXg/W0cXAtzSFocstV1PoVqy883hNoeQZ3mIGB3Q0rIUm5d9MA2bMMt31m1g3Sin6EQ== myNewUser@myVM",
  "password":"myNewUserPassword"
}
```

Execute the VMAccess script with:

```azurecli
azure vm extension set \
  myResourceGroup \
  myVM \
  VMAccessForLinux \
  Microsoft.OSTCExtensions * \
  --private-config-path create_new_user.json
```

To delete a user, use this VMAccess script:

`remove_user.json`

```json
{
  "remove_user":"myDeletedUser"
}
```

Execute the VMAccess script with:

```azurecli
azure vm extension set \
  myResourceGroup \
  myVM \
  VMAccessForLinux \
  Microsoft.OSTCExtensions * \
  --private-config-path remove_user.json
```

### Using VMAccess to reset the SSHD configuration
If you make changes to the Linux VMs SSHD configuration and close the SSH connection before verifying the changes, you may be prevented from SSH'ing back in.  VMAccess can be used to reset the SSHD configuration back to a known good configuration without being logged in over SSH.

To reset the SSHD configuration use this VMAccess script:

`reset_sshd.json`

```json
{
  "reset_ssh": true
}
```

Execute the VMAccess script with:

```azurecli
azure vm extension set \
  myResourceGroup \
  myVM \
  VMAccessForLinux \
  Microsoft.OSTCExtensions * \
  --private-config-path reset_sshd.json
```

## Next steps
Updating Linux using Azure VMAccess Extensions is one method to make changes on a running Linux VM.  You can also use tools like cloud-init and Azure Templates to modify your Linux VM on boot.

[About virtual machine extensions and features](../windows/extensions-features.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

[Authoring Azure Resource Manager templates with Linux VM extensions](../windows/extensions-authoring-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

[Using cloud-init to customize a Linux VM during creation](using-cloud-init.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

