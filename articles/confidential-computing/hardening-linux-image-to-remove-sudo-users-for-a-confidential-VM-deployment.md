---
title: Hardening Linux image to remove sudo users for a confidential VM deployment
description: Learn how to use the Azure CLI to harden their linux image to remove sudo users.
author: vvenug
ms.service: virtual-machines
mms.subservice: confidential-computing
ms.topic: how-to
ms.workload: infrastructure
ms.date: 7/21/2023
ms.author: vvenugopal
ms.custom: devx-track-azurecli
---

# Hardening a Linux image to remove sudo users for Azure confidential VM deployment

**Applies to:** :heavy_check_mark: Linux Images

This "how to" shows you steps to remove sudo users from the Linux image and deploy a confidential virtual machine (confidential VM) in Azure.

The objective of this article is to create and manage an admin-less Linux image for confidential VM deployments. Removing the guest admin has immense security value, it reduces admin privileges across OS. Not having any interactive user accounts reduces the attack surface of the VM.

Understanding different types of users in Unix/Linux systems:
- Admin user (sudoer): Regular users with additional permissions. These users can perform certain tasks that modify system configurations.

- Regular user: Regular users are non-administrative users. They don't have permission to modify system configurations or install system-wide software.

In the context of admin-less Linux images, the aim is to deploy systems without sudo users.

> [!NOTE]
> The configuration alone does not ensure prevention of users from being added to the sudo group. Any service with root or sudo privileges has the potential to escalate privileges.

## Prerequisites

- If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Ubuntu image - you can choose one from the [Azure Marketplace](/azure/virtual-machines/linux/cli-ps-findimage) (also shown below).

### Remove sudo users and prepare a generalized Linux image

The proposed solution results in a Linux image without sudo users & with Azure agents.

Steps to create a generalized image which removes the sudo users are as follows,

1. Download an Ubuntu image from the Marketplace [Azure supported images](/azure/virtual-machines/linux/cli-ps-findimage) using the azcopy command,
    ```
    azcopy copy [source] [destination]
    ```
2. Mount the image.

    There are several ways to do this, the example uses the loop device to mount the image. It can either be a disk attached or a loop device.

    $imagedevice is the root filesystem's partition on the device that contains the image.
    ```
    mount /dev/$imagedevice /mnt/dev/$imagedevice
    ```

    This process is commonly used to access and work with disk images. Here, it is used to remove the sudo users on the Ubuntu image.


3. Chroot into the vhd filesystem to run the following command, which lists users under the sudo group.
    ```
    sudo chroot /mnt/dev/$imagedevice/ getent group sudo
    ```

4. Validate step 3 by listing out the users in the sudoers.d home directory and in /etc/passwd, /etc/shadow files.
If there are any users with sudo privileges, they are listed here,

    ```
    sudo ls /mnt/dev/$imagedevice/etc/sudoers.d

    sudo cat /mnt/dev/$imagedevice/etc/passwd

    sudo cat /mnt/dev/$imagedevice/etc/shadow
    ```

5. Remove sudo privileges: Use the userdel command to remove users from the sudo group,
    ```
    sudo chroot /mnt/dev/$imagedevice/ userdel -r [sudo_username]
    ```

6. Repeat step 4 to validate that there are no sudo users on the vhd, you should now not be able to see any user’s directory and their entries in the /etc/sudoers.d, /etc/passwd and /etc/shadow files.

7. Unmount the image.

    ```
    umount /mnt/dev/$imagedevice
    ```

The image is now prepared without any sudo users in it that can be used as a base/reference image for creating the confidential VMs.

Follow the steps [Create a custom image for Azure confidential VM](/azure/confidential-computing/how-to-create-custom-image-confidential-vm) to create an Azure confidential VM.
Use the admin-less image in step 4 of [Create a custom image for Azure confidential VM](/azure/confidential-computing/how-to-create-custom-image-confidential-vm) while doing azcopy and the rest of the steps remains the same.
