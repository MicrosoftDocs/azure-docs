---
title: How to upgrade your Data Science Virtual Machine to Ubuntu 20.04
titleSuffix: Azure Data Science Virtual Machine
description: Learn how to upgrade from CentOS and Ubuntu 18.04 to the latest Ubuntu 20.04 Data Science Virtual Machine.
keywords: deep learning, AI, data science tools, data science virtual machine, team data science process
services: machine-learning
ms.service: data-science-vm
ms.custom: linux-related-content
author: jesscioffi
ms.author: jcioffi
ms.topic: conceptual
ms.reviewer: mattmcinnes
ms.date: 04/19/2023
---

# Upgrade your Data Science Virtual Machine to Ubuntu 20.04

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

If you have a Data Science Virtual Machine running an older release such as Ubuntu 18.04 or CentOS, you should migrate your DSVM to Ubuntu 20.04. Migrating will ensure that you get the latest operating system patches, drivers, preinstalled software, and library versions. This document tells you how to migrate from either older versions of Ubuntu or from CentOS.

## Prerequisites

- Familiarity with SSH and the Linux command line

## Overview

There are two possible ways to migrate:

- In-place migration, also called "same server" migration. This migration upgrades the existing VM without creating a new virtual machine. In-place migration is the easier way to migrate from Ubuntu 18.04 to Ubuntu 20.04.
- Side-by-side migration, also called "inter-server" migration. This migration transfers data from the existing virtual machine to a newly created VM. Side-by-side migration is the way to migrate from Centos to Ubuntu 20.04. You may prefer side-by-side migration for upgrading between Ubuntu versions if you feel your old install has become needlessly cluttered.

## Snapshot your VM in case you need to roll back

In the Azure portal, use the search bar to find the **Snapshots** functionality.

:::image type="content" source="media/ubuntu_upgrade/azure-portal-search-bar.png" alt-text="Screenshot showing Azure portal and search bar, with **Snapshots** highlighted":::

1. Select **Add**, which will take you to the **Create snapshot** page. Select the subscription and resource group of your virtual machine. For **Region**, select the same region in which the target storage exists. Select the DSVM storage disk and additional backup options. **Standard HDD** is an appropriate storage type for this backup scenario.

:::image type="content" source="media/ubuntu_upgrade/create-snapshot-options.png" alt-text="Screenshot showing 'Create snapshot' options":::

2. Once all the details are filled and validations pass, select **Review + create** to validate and create the snapshot. When the snapshot successfully completes, you'll see a message telling you the deployment is complete.

## In-place migration

If you're migrating an older Ubuntu release, you may choose to do an in-place migration. This migration doesn't create a new virtual machine and has fewer steps than a side-by-side migration.  If you wish to do a side-by-side migration because you want more control or because you're migrating from a different distribution, such as CentOS, skip to the [Side-by-side migration](#side-by-side-migration) section.

1. From the Azure portal, start your DSVM and sign in using SSH. To do so, select **Connect** and **SSH** and follow the connection instructions.

1. Once connected to a terminal session on your DSVM, run the following upgrade command:

    ```bash
    sudo do-release-upgrade
    ```

The upgrade process will take a while to complete. When it's over, the program will ask for permission to restart the virtual machine. Answer **Yes**. You will be disconnected from the SSH session as the system reboots.

### If necessary, regenerate SSH keys

> [!IMPORTANT]
> After upgrading and rebooting, you may need to regenerate your SSH keys.

After your VM has upgraded and rebooted, attempt to access it again via SSH. The IP address may have changed during the reboot, so confirm it before attempting to connect.

If you receive the error **REMOTE HOST IDENTIFICATION HAS CHANGED**, you'll need to regenerate your SSH credentials.

:::image type="content" source="media/ubuntu_upgrade/remote-host-warning.png" alt-text="PowerShell screenshot showing remote host identification changed warning":::

To do so, on your local machine, run the command:

```bash
ssh-keygen -R "your server hostname or ip"
```

You should now be able to connect with SSH. If you're still having trouble, in the **Connect** page follow the link to **Troubleshoot SSH connectivity issues**.

## Side-by-side migration

If you're migrating from CentOS or want a clean OS install, you can do a side-by-side migration. This type of migration has more steps, but gives you control over exactly which files are carried over.

Migrations from other systems based on the same set of upstream source packages should be relatively straightforward, for example [FAQ/CentOS3](https://wiki.centos.org/FAQ(2f)CentOS3.html).

You may choose to upgrade the operating system parts of the filesystem and leave user directories, such as `/home` in place. If you do leave the old user home directories in place expect some problems with the GNOME/KDE menus and other desktop items. It may be easiest to create new user accounts and mount the old directories somewhere else in the filesystem for reference, copying, or linking users' material after the migration.

### Migration at a glance

1.  Create a snapshot of your existing VM as described previously

1.  Create a disk from that snapshot

1.  Create a new Ubuntu Data Science Virtual Machine

1.  Recreate user account(s) on the new virtual machine

1.  Mount the disk of the snapshotted VM as a data disk on your new Data Science Virtual Machine

1.  Manually copy the wanted data

### Create a disk from your VM snapshot

If you  haven't already created a VM snapshot as described previously, do so.

1. In the Azure portal, search for **Disks** and select **Add**, which will open the **Disk** page.

:::image type="content" source="media/ubuntu_upgrade/portal-disks-search.png" alt-text="Screenshot of Azure portal showing search for Disks page and the Add button":::

2. Set the **Subscription**, **Resource group**, and **Region** to the values of your VM snapshot. Choose a **Name** for the disk to be created.

3. Select **Source type** as **Snapshot** and select the VM snapshot as the **Source snapshot**. Review and create the disk.

:::image type="content" source="media/ubuntu_upgrade/disk-create-options.png" alt-text="Screenshot of disk creation dialog showing options":::

### Create a new Ubuntu Data Science Virtual Machine

Create a new Ubuntu Data Science Virtual Machine using the [Azure portal](https://portal.azure.com) or an [ARM template](./dsvm-tutorial-resource-manager.md).

### Recreate user account(s) on your new Data Science Virtual Machine

Since you'll just be copying data from your old computer, you'll need to recreate whichever user accounts and software environments that you want to use on the new machine.

Linux is flexible enough to allow you to customize directories and paths on your new installation to follow your old machine. In general, though, it's easier to use the modern Ubuntu's preferred layout and modify your user environment and scripts to adapt.

For more information, see [Quickstart: Set up the Data Science Virtual Machine for Linux (Ubuntu)](./dsvm-ubuntu-intro.md).

### Mount the disk of the snapshotted VM as a data disk on your new Data Science Virtual Machine

1. In the Azure portal, make sure that your Data Science Virtual Machine is running.

2. In the Azure portal, go to the page of your Data Science Virtual Machine. Choose the **Disks** blade on the left rail. Choose **Attach existing disks**.

3. In the **Disk name** dropdown, select the disk that you created from your old VM's snapshot.

:::image type="content" source="media/ubuntu_upgrade/attach-data-disk.png" alt-text="Screenshot of DSVM options page showing disk attachment options":::

4. Select **Save** to update your virtual machine.

> [!Important]
> Your VM should be running at the time you attach the data disk. If the VM isn't running, the disks may be added in an incorrect order, leading to a confusing and potentially non-bootable system. If you add the data disk with the VM off, choose the **X** beside the data disk, start the VM, and re-attach it.

### Manually copy the wanted data

1. Sign on to your running virtual machine using SSH.

2. Confirm that you've attached the disk created from your old VM's snapshot by running the following command:

    ```bash
    lsblk -o NAME,HCTL,SIZE,MOUNTPOINT | grep -i 'sd'
    ```

    The results should look something like the following image. In the image, disk `sda1` is mounted at the root and `sdb2` is the `/mnt` scratch disk. The data disk created from the snapshot of your old VM is identified as `sdc1` but isn't yet available, as evidenced by the lack of a mount location. Your results might have different identifiers, but you should see a similar pattern.

    :::image type="content" source="media/ubuntu_upgrade/lsblk-results.png" alt-text="Screenshot of lsblk output, showing unmounted data drive":::

3. To access the data drive, create a location for it and mount it. Replace `/dev/sdc1` with the appropriate value returned by `lsblk`:

    ```bash
    sudo mkdir /datadrive && sudo mount /dev/sdc1 /datadrive
    ```

4. Now, `/datadrive` contains the directories and files of your old Data Science Virtual Machine. Move or copy the directories or files you want from the data drive to the new VM as you wish.

For more information, see [Use the portal to attach a data disk to a Linux VM](../../virtual-machines/linux/attach-disk-portal.md#connect-to-the-linux-vm-to-mount-the-new-disk).

## Connect and confirm version upgrade

Whether you did an in-place or side-by-side migration, confirm that you've successfully upgraded. From a terminal session, run:

```bash
cat /etc/os-release
```

And you should see that you're running Ubuntu 20.04.

:::image type="content" source="media/ubuntu_upgrade/ssh-os-release.png" alt-text="Screenshot of Ubuntu terminal showing OS version data":::

The change of version is also shown in the Azure portal.

:::image type="content" source="media/ubuntu_upgrade/portal-showing-os-version.png" alt-text="Screenshot of portal showing DSVM properties including OS version":::

## Next steps

- [Data science with an Ubuntu Data Science Machine in Azure](./linux-dsvm-walkthrough.md)
- [What tools are included on the Azure Data Science Virtual Machine?](./tools-included.md)
