---
title: Reset access with the VMAccess Extension and Azure CLI 2.0 | Microsoft Docs
description: How to manage users and reset access on Linux VMs using the VMAccess Extension and the Azure CLI 2.0
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
ms.devlang: azurecli
ms.topic: article
ms.date: 02/16/2017
ms.author: v-livech

---
# Manage users, SSH, and check or repair disks on Linux VMs using the VMAccess Extension with the Azure CLI 2.0
The disk on your Linux VM is showing errors. You somehow reset the root password for your Linux VM or accidentally deleted your SSH private key. If that happened back in the days of the datacenter, you would need to drive there and then open the KVM to get at the server console. Think of the Azure VMAccess extension as that KVM switch that allows you to access the console to reset access to Linux or perform disk level maintenance.

This article shows you how to use the Azure VMAcesss Extension to check or repair a disk, reset user access, manage user accounts, or reset the SSHD configuration on Linux. You can also perform these steps with the [Azure CLI 1.0](using-vmaccess-extension-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).


## Ways to use the VMAccess Extension
There are two ways that you can use the VMAccess Extension on your Linux VMs:

* Use the Azure CLI 2.0 and the required parameters.
* [Use raw JSON files that the VMAccess Extension process](#use-json-files-and-the-vmaccess-extension) and then act on.

The following examples use [az vm access](/cli/azure/vm/access) along with the appropriate parameters. To perform these steps, you need the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/#login).

## Reset SSH key
The following example resets the SSH key for the user `azureuser` on the VM named `myVM`:

```azurecli
az vm access set-linux-user \
  --resource-group myResourceGroup \
  --name myVM \
  --username azureuser \
  --ssh-key-value ~/.ssh/id_rsa.pub
```

## Reset password
The following example resets the password for the user `azureuser` on the VM named `myVM`:

```azurecli
az vm access set-linux-user \
  --resource-group myResourceGroup \
  --name myVM \
  --username azureuser \
  --password myNewPassword
```

## Reset SSHD
The following example resets the SSHD configuration on a VM named `myVM`:

```azurecli
az vm access reset-linux-ssh \
  --resource-group myResourceGroup \
  --name myVM
```

## Create a user
The following example creates a user named `myNewUser` using an SSH key for authentication on the VM named `myVM`:

```azurecli
az vm access set-linux-user \
  --resource-group myResourceGroup \
  --name myVM \
  --username myNewUser \
  --ssh-key-value ~/.ssh/id_rsa.pub
```

## Deletes a user
The following example deletes a user named `myNewUser` on the VM named `myVM`:

```azurecli
az vm access delete-linux-user \
  --resource-group myResourceGroup \
  --name myVM \
  --username myNewUser
```


## Use JSON files and the VMAccess Extension
The following examples use raw JSON files. Use [az vm extension set](/cli/azure/vm/extension#set) to then call your JSON files. These JSON files can also be called from Azure templates. 

### Reset user access
If you have lost access to root on your Linux VM, you can launch a VMAccess script to reset a user password.

To reset the SSH key of a user, create a file named `reset_ssh_key.json` and add the following content:

```json
{
  "username":"azureuser",
  "ssh_key":"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCZ3S7gGp3rcbKmG2Y4vGZFMuMZCwoUzZNG1vHY7P2XV2x9FfAhy8iGD+lF8UdjFX3t5ebMm6BnnMh8fHwkTRdOt3LDQq8o8ElTBrZaKPxZN2thMZnODs5Hlemb2UX0oRIGRcvWqsd4oJmxsXa/Si98Wa6RHWbc9QZhw80KAcOVhmndZAZAGR+Wq6yslNo5TMOr1/ZyQAook5C4FtcSGn3Y+WczaoGWIxG4ZaWk128g79VIeJcIQqOjPodHvQAhll7qDlItVvBfMOben3GyhYTm7k4YwlEdkONm4yV/UIW0la1rmyztSBQIm9sZmSq44XXgjVmDHNF8UfCZ1ToE4r2SdwTmZv00T2i5faeYnHzxiLPA3Enub7iUo5IdwFArnqad7MO1SY1kLemhX9eFjLWN4mJe56Fu4NiWJkR9APSZQrYeKaqru4KUC68QpVasNJHbuxPSf/PcjF3cjO1+X+4x6L1H5HTPuqUkyZGgDO4ynUHbko4dhlanALcriF7tIfQR9i2r2xOyv5gxJEW/zztGqWma/d4rBoPjnf6tO7rLFHXMt/DVTkAfn5woYtLDwkn5FMyvThRmex3BDf0gujoI1y6cOWLe9Y5geNX0oj+MXg/W0cXAtzSFocstV1PoVqy883hNoeQZ3mIGB3Q0rIUm5d9MA2bMMt31m1g3Sin6EQ== azureuser@myVM"
}
```

Execute the VMAccess script with:

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.4 \
  --protected-settings reset_ssh_key.json
```

To reset a user password, create a file named `reset_user_password.json` and add the following content:

```json
{
  "username":"azureuser",
  "password":"myNewPassword" 
}
```

Execute the VMAccess script with:

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.4 \
  --protected-settings reset_user_password.json
```

### Reset SSH
If you make changes to the Linux VMs SSHD configuration and close the SSH connection before verifying the changes, you may be prevented from SSH'ing back in.  VMAccess can be used to reset the SSHD configuration back to a known good configuration without being logged in over SSH.

To reset the SSHD configuration, create a file named `reset_sshd.json` and add the following content:

```json
{
  "reset_ssh": true
}
```

Execute the VMAccess script with:

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.4 \
  --protected-settings reset_sshd.json
```

### Manage users
VMAccess is a Python script that can be used to manage users on your Linux VM without logging in and using sudo or the root account.

To create a user, create a file named `create_new_user.json` and add the following content:

```json
{
  "username":"myNewUser",
  "ssh_key":"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCZ3S7gGp3rcbKmG2Y4vGZFMuMZCwoUzZNG1vHY7P2XV2x9FfAhy8iGD+lF8UdjFX3t5ebMm6BnnMh8fHwkTRdOt3LDQq8o8ElTBrZaKPxZN2thMZnODs5Hlemb2UX0oRIGRcvWqsd4oJmxsXa/Si98Wa6RHWbc9QZhw80KAcOVhmndZAZAGR+Wq6yslNo5TMOr1/ZyQAook5C4FtcSGn3Y+WczaoGWIxG4ZaWk128g79VIeJcIQqOjPodHvQAhll7qDlItVvBfMOben3GyhYTm7k4YwlEdkONm4yV/UIW0la1rmyztSBQIm9sZmSq44XXgjVmDHNF8UfCZ1ToE4r2SdwTmZv00T2i5faeYnHzxiLPA3Enub7iUo5IdwFArnqad7MO1SY1kLemhX9eFjLWN4mJe56Fu4NiWJkR9APSZQrYeKaqru4KUC68QpVasNJHbuxPSf/PcjF3cjO1+X+4x6L1H5HTPuqUkyZGgDO4ynUHbko4dhlanALcriF7tIfQR9i2r2xOyv5gxJEW/zztGqWma/d4rBoPjnf6tO7rLFHXMt/DVTkAfn5woYtLDwkn5FMyvThRmex3BDf0gujoI1y6cOWLe9Y5geNX0oj+MXg/W0cXAtzSFocstV1PoVqy883hNoeQZ3mIGB3Q0rIUm5d9MA2bMMt31m1g3Sin6EQ== myNewUser@myVM",
  "password":"myNewUserPassword"
}
```

Execute the VMAccess script with:

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.4 \
  --protected-settings create_new_user.json
```

To delete a user, create a file named `delete_user.json` and add the following content:

```json
{
  "remove_user":"myDeleteUser"
}
```

Execute the VMAccess script with:

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.4 \
  --protected-settings delete_user.json
```

### Check or repair the disk
Using VMAccess you can do a fsck run on the disk under your Linux VM. You can also do a disk check and a disk repair using a VMAccess.

To check, and then repair the disk use this VMAccess script, create a file named `disk_check_repair.json` and add the following content:

```json
{
  "check_disk": "true",
  "repair_disk": "true, user-disk-name"
}
```

Execute the VMAccess script with:

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.4 \
  --protected-settings disk_check_repair.json
```

## Next steps
Updating Linux using Azure VMAccess Extension is one method to make changes on a running Linux VM. You can also use tools like cloud-init and Azure Resource Manager templates to modify your Linux VM on boot.

[About virtual machine extensions and features](../windows/extensions-features.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

[Authoring Azure Resource Manager templates with Linux VM extensions](../windows/extensions-authoring-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

[Using cloud-init to customize a Linux VM during creation](using-cloud-init.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

