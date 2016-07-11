<properties
    pageTitle="Reset access on Azure Linux VMs using the VMAccess Extension  | Microsoft Azure"
    description="Reset access on Azure Linux VMs using the VMAccess Extension."
    services="virtual-machines-linux"
    documentationCenter=""
    authors="vlivech"
    manager="timlt"
    editor=""
    tags="azure-resource-manager"
/>

<tags
    ms.service="virtual-machines-linux"
    ms.workload="infrastructure-services"
    ms.tgt_pltfrm="vm-linux"
    ms.devlang="na"
    ms.topic="article"
    ms.date="04/29/2016"
    ms.author="v-livech"
/>

# Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension

This article shows you how to use the VMAcesss VM extension [(Github)](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess) to check or repair a disk, reset user access, manage user accounts, or reset the SSHD configuration on Linux.  This article requires [an Azure account](https://azure.microsoft.com/pricing/free-trial/), [SSH keys](virtual-machines-linux-mac-create-ssh-keys.md), an Azure Linux Virtual Machine, and the Azure CLI installed and switched to ARM mode using `azure config mode arm`.

## Quick Commands

There are two ways to use VMAccess on your Linux VMs:

- Using the Azure CLI and the required parameters.
- Using raw JSON files that VMAccess will process and then act on.

For the quick command section we will use the Azure CLI `azure vm reset-access` method. In the following command examples, replace the values between &lt; and &gt; with the values from your own environment.

## Reset Root Password

To reset the root password:

```bash
azure vm reset-access -g <resource group> -n <vm name> -u root -p <examplePassword>
```

## SSH Key Reset

To reset the SSH key of a non root user:

```bash
azure vm reset-access -g <resource group> -n <vm name> -u <exampleUser> -M <~/.ssh/azure_id_rsa.pub>
```

## Create a User

To create a new user:

```bash
azure vm reset-access -g <resource group> -n <vm name> -u <exampleNewUserName> -p <examplePassword>
```

## Remove a User

```bash
azure vm reset-access -g <resource group> -n <vm name> -R <exampleNewUserName>
```

## Reset SSHD

To reset the SSHD configuration:

```bash
azure vm reset-access -g <resource group> -n <vm name> -r
```


## Detailed Walkthrough

### VMAccess defined:

The disk on your Linux VM is showing errors. You somehow reset the root password for your Linux VM or accidentally deleted your SSH private key. If that happened back in the datacenter dark ages you would drive there, give your hand print to unlock the door, get into the cage and then crack open the KVM to get at the server console. Think of the Azure VMAccess extension as that KVM switch that allows you to access the console to reset access to Linux or perform disk level maintenance.

For the detailed walkthrough we will use the long form of VMAccess which uses raw JSON files.  These VMAccess JSON files can also be called from Azure templates.

### Using VMAccess to check or repair the disk of a Linux VM

Using VMAccess you can do a fsck run on the disk under your Linux VM.  You can do a disk check and then a disk repair if you find any errors.

To check and then repair the disk use this VMAccess script:

`disk_check_repair.json`

```json
{
  "check_disk": "true",
  "repair_disk": "true, user-disk-name"
}
```

Execute the VMAccess script with:

```bash
azure vm extension set exampleResourceGruop exampleVM \
VMAccessForLinux Microsoft.OSTCExtensions * \
--private-config-path disk_check_repair.json
```

### Using VMAccess to reset user access to Linux

If you have lost access to root on your Linux VM you can launch a VMAccess script to reset the root password.

To reset the root password use this VMAccess script:

`reset_root_password.json`

```json
{
  "username":"root",
  "password":"exampleNewPassword",   
}
```

Execute the VMAccess script with:

```bash
azure vm extension set exampleResourceGruop exampleVM \
VMAccessForLinux Microsoft.OSTCExtensions * \
--private-config-path reset_root_password.json
```

To reset the SSH key of a non root user use this VMAccess script:

`reset_ssh_key.json`

```json
{
  "username":"exampleUser",
  "ssh_key":"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCZ3S7gGp3rcbKmG2Y4vGZFMuMZCwoUzZNG1vHY7P2XV2x9FfAhy8iGD+lF8UdjFX3t5ebMm6BnnMh8fHwkTRdOt3LDQq8o8ElTBrZaKPxZN2thMZnODs5Hlemb2UX0oRIGRcvWqsd4oJmxsXa/Si98Wa6RHWbc9QZhw80KAcOVhmndZAZAGR+Wq6yslNo5TMOr1/ZyQAook5C4FtcSGn3Y+WczaoGWIxG4ZaWk128g79VIeJcIQqOjPodHvQAhll7qDlItVvBfMOben3GyhYTm7k4YwlEdkONm4yV/UIW0la1rmyztSBQIm9sZmSq44XXgjVmDHNF8UfCZ1ToE4r2SdwTmZv00T2i5faeYnHzxiLPA3Enub7iUo5IdwFArnqad7MO1SY1kLemhX9eFjLWN4mJe56Fu4NiWJkR9APSZQrYeKaqru4KUC68QpVasNJHbuxPSf/PcjF3cjO1+X+4x6L1H5HTPuqUkyZGgDO4ynUHbko4dhlanALcriF7tIfQR9i2r2xOyv5gxJEW/zztGqWma/d4rBoPjnf6tO7rLFHXMt/DVTkAfn5woYtLDwkn5FMyvThRmex3BDf0gujoI1y6cOWLe9Y5geNX0oj+MXg/W0cXAtzSFocstV1PoVqy883hNoeQZ3mIGB3Q0rIUm5d9MA2bMMt31m1g3Sin6EQ== exampleUser@exampleServer",   
}
```

Execute the VMAccess script with:

```bash
azure vm extension set exampleResourceGruop exampleVM \
VMAccessForLinux Microsoft.OSTCExtensions * \
--private-config-path reset_ssh_key.json
```

### Using VMAccess to manage user accounts on Linux

VMAccess is a Python script that can be used to manage users on your Linux VM without logging in and using sudo or the root account.

To create a new user use this VMAccess script:

`create_new_user.json`

```json
{
"username":"exampleNewUserName",
"ssh_key":"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCZ3S7gGp3rcbKmG2Y4vGZFMuMZCwoUzZNG1vHY7P2XV2x9FfAhy8iGD+lF8UdjFX3t5ebMm6BnnMh8fHwkTRdOt3LDQq8o8ElTBrZaKPxZN2thMZnODs5Hlemb2UX0oRIGRcvWqsd4oJmxsXa/Si98Wa6RHWbc9QZhw80KAcOVhmndZAZAGR+Wq6yslNo5TMOr1/ZyQAook5C4FtcSGn3Y+WczaoGWIxG4ZaWk128g79VIeJcIQqOjPodHvQAhll7qDlItVvBfMOben3GyhYTm7k4YwlEdkONm4yV/UIW0la1rmyztSBQIm9sZmSq44XXgjVmDHNF8UfCZ1ToE4r2SdwTmZv00T2i5faeYnHzxiLPA3Enub7iUo5IdwFArnqad7MO1SY1kLemhX9eFjLWN4mJe56Fu4NiWJkR9APSZQrYeKaqru4KUC68QpVasNJHbuxPSf/PcjF3cjO1+X+4x6L1H5HTPuqUkyZGgDO4ynUHbko4dhlanALcriF7tIfQR9i2r2xOyv5gxJEW/zztGqWma/d4rBoPjnf6tO7rLFHXMt/DVTkAfn5woYtLDwkn5FMyvThRmex3BDf0gujoI1y6cOWLe9Y5geNX0oj+MXg/W0cXAtzSFocstV1PoVqy883hNoeQZ3mIGB3Q0rIUm5d9MA2bMMt31m1g3Sin6EQ== exampleUser@exampleServer",
"password":"examplePassword",
}
```

Execute the VMAccess script with:

```bash
azure vm extension set exampleResourceGruop exampleVM \
VMAccessForLinux Microsoft.OSTCExtensions * \
--private-config-path create_new_user.json
```

To create a new user use this VMAccess script:

`remove_user.json`

```json
{
"remove_user":"exampleUser",
}
```

Execute the VMAccess script with:

```bash
azure vm extension set exampleResourceGruop exampleVM \
VMAccessForLinux Microsoft.OSTCExtensions * \
--private-config-path remove_user.json
```

### Using VMAccess to reset the SSHD configuration on Linux

If you make changes to the Linux VMs SSHD configuration and close the SSH connection before verifying the changes, you may be prevented from SSH'ing back in.  VMAccess can be used to reset the SSHD configuration back to a known good configuration.

To reset the SSHD configuration use this VMAccess script:

`reset_sshd.json`

```json
{
  "reset_ssh": true
}
```

Execute the VMAccess script with:

```bash
azure vm extension set exampleResourceGruop exampleVM \
VMAccessForLinux Microsoft.OSTCExtensions * \
--private-config-path reset_sshd.json
```
