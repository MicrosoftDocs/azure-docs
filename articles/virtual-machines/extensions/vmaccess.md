---
title: Reset access to an Azure Linux VM 
description: Learn how to manage administrative users and reset access on Linux VMs by using the VMAccess extension and the Azure CLI.
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.collection: linux
ms.date: 04/12/2023
ms.custom: GGAL-freshness822, devx-track-azurecli
---

# Manage administrative users, SSH, and check or repair disks on Linux VMs by using the VMAccess extension with the Azure CLI

The VMAccess extension with the Azure CLI allows you to manage administrative users and reset access on Linux VMs.

This article shows you how to:

* Use the Azure VMAccess extension to check or repair a disk.
* Reset user access.
* Manage administrative user accounts
* Update the SSH configuration on Linux computers that run as Azure Resource Manager virtual machines.

If you need to manage Classic virtual machines, see [Using the VMAccess extension](/previous-versions/azure/virtual-machines/linux/classic/reset-access-classic).

> [!NOTE]
> If you use the VMAccess extension to reset the password of your VM after you install the Azure Active Directory (Azure AD) Login extension, rerun the Azure AD Login extension to re-enable Azure AD Login for your VM.

## Prerequisites

The VMAccess extension can be run on these Linux distributions:

### Linux Distro’s Supported

| **Linux Distro** | **x64** | **ARM64** |
|:-----|:-----:|:-----:|
| Alma Linux |	9.x+ |	9.x+ |
| CentOS |	7.x+,  8.x+ |	7.x+ |
| Debian |	10+ |	11.x+ |
| Flatcar Linux |	3374.2.x+ |	3374.2.x+ |
| Azure Linux | 2.x | 2.x |
| openSUSE |	12.3+ |	Not Supported |
| Oracle Linux |	6.4+, 7.x+, 8.x+ |	Not Supported |
| Red Hat Enterprise Linux |	6.7+, 7.x+,  8.x+ |	8.6+, 9.0+ |
| Rocky Linux |	9.x+ |	9.x+ |
| SLES |	12.x+, 15.x+ |	15.x SP4+ |
| Ubuntu |	18.04+, 20.04+, 22.04+ |	20.04+, 22.04+ |

## Ways to use the VMAccess extension

You can use the VMAccess extension on your Linux VMs in two ways:

* Use the Azure CLI and the required parameters.
* [Use JSON files with the VMAccess extension](#use-json-files-and-the-vmaccess-extension).

The following examples use [az vm user](/cli/azure/vm/user) commands. To perform these steps, you need to [install the latest Azure CLI](/cli/azure/install-az-cli2) and sign in to an Azure account by using [az login](/cli/azure/reference-index).

## Update SSH key

The following example updates the SSH key for the user `azureuser` on the VM named `myVM`:

```azurecli-interactive
az vm user update \
  --resource-group myResourceGroup \
  --name myVM \
  --username azureuser \
  --ssh-key-value ~/.ssh/id_rsa.pub
```

> [!NOTE]
> The [`az vm user update` command](/cli/azure/vm) appends the new public key text to the `~/.ssh/authorized_keys` file for the admin user on the VM. This command doesn't replace or remove any existing SSH keys. This command doesn't remove prior keys set at deployment time or subsequent updates by using the VMAccess extension.

## Reset password

The following example resets the password for the user `azureuser` on the VM named `myVM`:

```azurecli-interactive
az vm user update \
  --resource-group myResourceGroup \
  --name myVM \
  --username azureuser \
  --password myNewPassword
```

## Restart SSH

The following example restarts the SSH daemon and resets the SSH configuration to default values on a VM named `myVM`:

```azurecli-interactive
az vm user reset-ssh \
  --resource-group myResourceGroup \
  --name myVM
```

## Create an administrative/sudo user

The following example creates a user named `myNewUser` with sudo permissions. The account uses an SSH key for authentication on the VM named `myVM`. This method helps you regain access to a VM when current credentials are lost or forgotten. As a best practice, accounts with sudo permissions should be limited.

```azurecli-interactive
az vm user update \
  --resource-group myResourceGroup \
  --name myVM \
  --username myNewUser \
  --ssh-key-value ~/.ssh/id_rsa.pub
```

## Delete a user

The following example deletes a user named `myNewUser` on the VM named `myVM`:

```azurecli-interactive
az vm user delete \
  --resource-group myResourceGroup \
  --name myVM \
  --username myNewUser
```

## Use JSON files and the VMAccess extension

The following examples use raw JSON files. Use the [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) command to then call your JSON files. Azure templates can also call these JSON files.

### Reset user access

If you've lost access to root on your Linux VM, you can launch a VMAccess script to update a user's SSH key or password.

To update the SSH public key of a user, create a file named `update_ssh_key.json` and add settings in the following format. Replace `username` and `ssh_key` with your own information:

```json
{
  "username":"azureuser",
  "ssh_key":"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCZ3S7gGp3rcbKmG2Y4vGZFMuMZCwoUzZNGxxxxxx2XV2x9FfAhy8iGD+lF8UdjFX3t5ebMm6BnnMh8fHwkTRdOt3LDQq8o8ElTBrZaKPxZN2thMZnODs5Hlemb2UX0oRIGRcvWqsd4oJmxsXa/Si98Wa6RHWbc9QZhw80KAcOVhmndZAZAGR+Wq6yslNo5TMOr1/ZyQAook5C4FtcSGn3Y+WczaoGWIxG4ZaWk128g79VIeJcIQqOjPodHvQAhll7qDlItVvBfMOben3GyhYTm7k4YwlEdkONm4yV/UIW0la1rmyztSBQIm9sZmSq44XXgjVmDHNF8UfCZ1ToE4r2SdwTmZv00T2i5faeYnHzxiLPA3Enub7xxxxxxwFArnqad7MO1SY1kLemhX9eFjLWN4mJe56Fu4NiWJkR9APSZQrYeKaqru4KUC68QpVasNJHbuxPSf/PcjF3cjO1+X+4x6L1H5HTPuqUkyZGgDO4ynUHbko4dhlanALcriF7tIfQR9i2r2xOyv5gxJEW/zztGqWma/d4rBoPjnf6tO7rLFHXMt/DVTkAfn5wxxtLDwkn5FMyvThRmex3BDf0gujoI1y6cOWLe9Y5geNX0oj+MXg/W0cXAtzSFocstV1PoVqy883hNoeQZ3mIGB3Q0rIUm5d9MA2bMMt31m1g3Sin6EQ== azureuser@myVM"
}
```

Execute the VMAccess script by running this command:

```azurecli-interactive
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.4 \
  --protected-settings update_ssh_key.json
```

To reset a user password, create a file named `reset_user_password.json` and add settings in the following format. Replace `username` and `password` with your own information:

```json
{
  "username":"azureuser",
  "password":"myNewPassword" 
}
```

Execute the VMAccess script by running this command:

```azurecli-interactive
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.4 \
  --protected-settings reset_user_password.json
```

### Restart the SSH

To restart the SSH daemon and reset the SSH configuration to default values, create a file named `reset_sshd.json`. Add the following text:

```json
{
  "reset_ssh": true
}
```

Execute the VMAccess script with:

```azurecli-interactive
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.4 \
  --protected-settings reset_sshd.json
```

### Manage administrative users

To create a user with sudo permissions that uses an SSH key for authentication, create a file named `create_new_user.json` and add settings in the following format. Substitute your own values for the `username` and `ssh_key` parameters. This method helps you regain access to a VM when current credentials are lost or forgotten. As a best practice, limit accounts with sudo permissions.

```json
{
  "username":"myNewUser",
  "ssh_key":"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCZ3S7gGp3rcbKmG2Y4vGZFMuMZCwoUzZNG1vHY7P2XV2x9FfAhy8iGD+lF8UdjFX3t5ebMm6BnnMh8fHwkTRdOt3LDQq8o8ElTBrZaKPxZN2thMZnODs5Hlemb2UX0oRIGRcvWqsd4oJmxsXa/Si98Wa6RHWbc9QZhw80KAcOVhmndZAZAGR+Wq6yslNo5TMOr1/ZyQAook5C4FtcSGn3Y+WczaoGWIxG4ZaWk128g79VIeJcIQqOjPodHvQAhll7qDlItVvBfMOben3GyhYTm7k4YwlEdkONm4yV/UIW0la1rmyztSBQIm9sZmSq44XXgjVmDHNF8UfCZ1ToE4r2SdwTmZv00T2i5faeYnHzxiLPA3Enub7iUo5IdwFArnqad7MO1SY1kLemhX9eFjLWN4mJe56Fu4NiWJkR9APSZQrYeKaqru4KUC68QpVasNJHbuxPSf/PcjF3cjO1+X+4x6L1H5HTPuqUkyZGgDO4ynUHbko4dhlanALcriF7tIfQR9i2r2xOyv5gxJEW/zztGqWma/d4rBoPjnf6tO7rLFHXMt/DVTkAfn5woYtLDwkn5FMyvThRmex3BDf0gujoI1y6cOWLe9Y5geNX0oj+MXg/W0cXAtzSFocstV1PoVqy883hNoeQZ3mIGB3Q0rIUm5d9MA2bMMt31m1g3Sin6EQ== myNewUser@myVM",
  "password":"myNewUserPassword"
}
```

Execute the VMAccess script with:

```azurecli-interactive
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.4 \
  --protected-settings create_new_user.json
```

To delete a user, create a file named `delete_user.json` and add the following content. Change the data for `remove_user` to the user you're trying to delete:

```json
{
  "remove_user":"myNewUser"
}
```

Execute the VMAccess script with:

```azurecli-interactive
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.4 \
  --protected-settings delete_user.json
```

### Check or repair the disk

By using VMAccess, you can check and repair a disk that you added to the Linux VM.

To check and then repair the disk, create a file named `disk_check_repair.json` and add settings in the following format. Change the data for `repair_disk` to the disk you're trying to repair:

```json
{
  "check_disk": "true",
  "repair_disk": "true, mydiskname"
}
```

Execute the VMAccess script with:

```azurecli-interactive
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.4 \
  --protected-settings disk_check_repair.json
```

## Troubleshoot and support

Get data about the state of extension deployments from the Azure portal and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command by using the Azure CLI.

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

For more help, you can contact the Azure experts at [Azure Community Support](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to [Azure support](https://azure.microsoft.com/support/options/) and select **Get support**. For more information about Azure Support, read the [Azure support plans FAQ](https://azure.microsoft.com/support/faq/).
