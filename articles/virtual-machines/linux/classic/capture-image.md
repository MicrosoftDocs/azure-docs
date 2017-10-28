---
title: Capture an image of a Linux VM | Microsoft Docs
description: Learn how to capture an image of a Linux-based Azure virtual machine (VM) created with the classic deployment model.
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid: 17d7ffee-a58e-4290-9de1-64c3cf1ddc05
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 03/14/2017
ms.author: iainfou

---
# How to capture a classic Linux virtual machine as an image
> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../../../resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. Learn how to [perform these steps using the Resource Manager model](../capture-image.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

This article shows you how to capture a classic Azure virtual machine (VM) running Linux as an image to create other virtual machines. This image includes the OS disk and data disks attached to the VM. It doesn't include networking configuration, so you need to configure that when you create the other VM from the image.

Azure stores the image under **Images**, along with any images you've uploaded. For more information about images, see [About Virtual Machine Images in Azure][About Virtual Machine Images in Azure].

## Before you begin
These steps assume that you've already created an Azure VM using the Classic deployment model and configured the operating system, including attaching any data disks. If you need to create a VM, read [How to Create a Linux Virtual Machine][How to Create a Linux Virtual Machine].

## Capture the virtual machine
1. [Connect to the VM](../mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) using an SSH client of your choice.
2. In the SSH window, type the following command. The output from `waagent` may vary slightly depending on the version of this utility:

    ```bash
    sudo waagent -deprovision+user
    ```

    The preceding command attempts to clean the system and make it suitable for reprovisioning. This operation performs the following tasks:

   * Removes SSH host keys (if Provisioning.RegenerateSshHostKeyPair is 'y' in the configuration file)
   * Clears nameserver configuration in /etc/resolv.conf
   * Removes the `root` user password from /etc/shadow (if Provisioning.DeleteRootPassword is 'y' in the configuration file)
   * Removes cached DHCP client leases
   * Resets host name to localhost.localdomain
   * Deletes the last provisioned user account (obtained from /var/lib/waagent) **and associated data**.

     > [!NOTE]
     > Deprovisioning deletes files and data to "generalize" the image. Only run this command on a VM that you intend to capture as a new image template. It does not guarantee that the image is cleared of all sensitive information or is suitable for redistribution to third parties.

3. Type **y** to continue. You can add the `-force` parameter to avoid this confirmation step.
4. Type **Exit** to close the SSH client.

   > [!NOTE]
   > The remaining steps assume you have already [installed the Azure CLI](../../../cli-install-nodejs.md) on your client computer. All the following steps can also be done in the [Azure portal](http://portal.azure.com).

5. From your client computer, open Azure CLI and login to your Azure subscription. For details, read [Connect to an Azure subscription from the Azure CLI](../../../xplat-cli-connect.md).

   > [!NOTE]
   > In the Azure portal, log in to the portal.

6. Make sure you are in Service Management mode:

    ```azurecli
    azure config mode asm
    ```

7. Shut down the VM that is already deprovisioned. The following example shuts down the VM named `myVM`:

    ```azurecli
    azure vm shutdown myVM
    ```
   If needed, you can view a list all the VMs created in your subscription by using `azure vm list`

   > [!NOTE]
   > If you're using the Azure portal, select the VM and click **Stop** to
   > shut down the VM.

8. When the VM is stopped, capture the image. The following example captures the VM named `myVM` and creates a generalized image named `myNewVM`:

    ```azurecli
    azure vm capture -t myVM myNewVM
    ```

    The `-t` subcommand deletes the original virtual machine.

    > [!NOTE]
    > In the Azure portal, you can capture an image by selecting **Image** from the hub menu. You need to supply the following information for the image: name, resource group, location, operating system type, and storage blob path.

9. The new image is now available in the list of images that can be used to configure any new VM. You can view it with the command:

   ```azurecli
   azure vm image list
   ```

   On the [Azure portal](http://portal.azure.com), the new image appears in the **VM images (classic)** that belongs to the **Compute** services. You can access **VM images (classic)** by clicking _More services_ at the bottom of the Azure service list, and then looking in the **Compute** services.   

   ![Image capture successful](./media/capture-image/VMCapturedImageAvailable.png)

## Next steps
The image is ready to be used to create VMs. You can use the Azure CLI command `azure vm create` and supply the image name you created. For more information, see [Using the Azure CLI with Classic deployment model](https://docs.microsoft.com/cli/azure/get-started-with-az-cli2).

Alternatively, use the [Azure portal](http://portal.azure.com) to create a custom VM by using the **Image** method and selecting the image you created. For more information, see [How to Create a Custom VM][How to Create a Custom Virtual Machine].

**See also:** [Azure Linux Agent User Guide](../agent-user-guide.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

[About Virtual Machine Images in Azure]:../../virtual-machines-linux-classic-about-images.md
[How to Create a Custom Virtual Machine]:create-custom.md
[How to Attach a Data Disk to a Virtual Machine]:attach-disk.md
[How to Create a Linux Virtual Machine]:create-custom.md
