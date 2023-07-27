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

This "how to" shows you steps to remove sudo users from the linux image and deploy confidential virtual machine (confidential VM) in Azure.

The objective of this article is to create and manage an Adminless Linux image for confidential VM deployments. Removing guest admin has immense security value, it reduces admin privileges across OS. Not having any interactive user accounts, especially for Confidential Computing, reduces the attack surface of the VM.

Understanding different types of users in Unix/Linux systems:
- Admin user (sudoer): Regular users with additional permissions. These users can perform certain tasks that modify system configurations.

- Regular user: Regular users are non-administrative users. They don't have permission to modify system configurations or install system-wide software.

In the context of Adminless Linux images, the aim is to deploy systems without sudo users.

> [!NOTE]
> The configuration alone does not ensure prevention of users from being added to the sudo group. Any service with root or sudo privileges has the potential to escalate privileges.

## Prerequisites

- If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Ubuntu image.

### Remove sudo users and prepare a generalized Linux image

The proposed solution results in a linux image with the following configuration,
- without sudo users & with Azure agents.

Steps to create a generalized image which removes the sudo users are as follows,

1. Download an Ubuntu image from the marketplace [Azure supported images](/azure/virtual-machines/linux/cli-ps-findimage) using the azcopy command,
    ```
    azcopy copy [source] [destination]
    ```
2. Mount the image.

    This process is commonly used to access and work with disk images. In here, it is used to remove the sudo users on the Ubuntu image.
    The mount_vhd.sh script performs the following operations to mount the vhd as shown,
    ```
    #!/bin/bash

    size=$(ls -l $1 | awk '{print $5}')

    dev=$(sudo losetup --sizelimit $(($size - 512)) -P -f $1 --show)

    parts=$(sudo fdisk -l $dev | grep ^${dev}p | awk '{print $1}')

    for part in $parts
    do
        echo "$part"
        mntpoint=/mnt${part}
        echo $mntpoint
        sudo mkdir -p $mntpoint
        sudo mount $part $mntpoint
        if [[ $? != 0 ]]; then
            echo "Partition $part skipped"
        fi
    done
    ```
    ```
    ./mount_vhd.sh Ubuntu_20.04.vhd
    ```

3. Chroot into the vhd filesystem to run the following command, which enumerates the list of users under the sudo group.
    ```
    sudo chroot /mnt/dev/$loopdevice/ getent group sudo
    ```

4. Validate step 3 by listing out the users in the sudoers.d home directory and in /etc/passwd, /etc/shadow files.
If there are any users with sudo privileges, they are listed here,

    ```
    sudo ls /mnt/dev/$loopdevice/etc/sudoers.d

    sudo cat /mnt/dev/$loopdevice/etc/passwd

    sudo cat /mnt/dev/$loopdevice/etc/shadow
    ```

5. Remove sudo privileges: Use the userdel command to remove users from the sudo group,
    ```
    sudo chroot /mnt/dev/$loopdevice/ userdel -r [sudo_username]
    ```

6. Repeat step 4 to validate that there are no sudo users on the vhd, you should now not be able to see any user’s directory and their entries in the /etc/passwd and /etc/shadow files.

7. Unmount the image. (Unmounting is done using the script umount.sh)

    The umount.sh script performs the following operations to unmount the image as shown,
    ```
    #!/bin/bash

    parts=$(sudo fdisk -l $1 | grep ^$1p | awk '{print $1}')

    for part in $parts
    do
        # echo "$part"
        mntpoint=/mnt/dev/${part}
        # echo $mntpoint
        sudo umount $mntpoint > /dev/null 2>&1
        if [[ $? != 0 ]]; then
            echo "Partition $part skipped"
        fi
        sudo rmdir $mntpoint
    done

    sudo losetup -d $1
    ```
    ```
    ./umount.sh /dev/loop3
    ```

The image is prepared without any sudo users in it that can be used as a base/reference image for creating the Confidential vms.

Follow the steps [Create a custom image for Azure confidential VM](/azure/confidential-computing/how-to-create-custom-image-confidential-vm) to create an Azure confidential VM.
Use the adminless image in step 4 of [Create a custom image for Azure confidential VM](/azure/confidential-computing/how-to-create-custom-image-confidential-vm) while doing azcopy and the rest of the steps remains the same.