---
title: Harden a Linux image to remove guest agent
description: Learn how to use the Azure CLI to harden a linux image to remove guest agent.
author: vvenug
ms.service: virtual-machines
mms.subservice: confidential-computing
ms.topic: how-to
ms.workload: infrastructure
ms.date: 8/03/2023
ms.author: vvenugopal
ms.custom: devx-track-azurecli
---

# Harden a Linux image to remove guest agent

**Applies to:** :heavy_check_mark: Linux Images

This "how to" shows you steps to remove guest agent from the Linux image and deploy a confidential virtual machine (confidential VM) in Azure.

The objective of this article is to create an agent-less Linux image for confidential VM deployments.

Azure supports two provisioning agents [cloud-init](https://github.com/canonical/cloud-init), and the [Azure Linux Agent](https://github.com/Azure/WALinuxAgent) (WALA), which forms the prerequisites for creating the generalized images.

The Linux Agent contains Provisioning Agent Code and Extension Handling code in one package.

The provisioning agents, provide support for all endorsed Azure Linux distributions.
The Extension Handling code is responsible for communicating with the Azure fabric, and handling the VM extensions operations such as installs, reporting status, updating the individual extensions, and removing them.

It's crucial to comprehend what functionalities the VM loses before deciding to remove the Linux Agent.

Removal of the guest agent removes the functionality enumerated at [Azure linux VM Agent](/azure/virtual-machines/extensions/agent-linux).


> [!NOTE]
> Linux agent needs to run as root to perform its tasks.

## Prerequisites

- If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Ubuntu image - you can choose one from the [Azure Marketplace](/azure/virtual-machines/linux/cli-ps-findimage).

### Remove Azure linux agent and prepare a generalized Linux image

The proposed solution results in a Linux image without Azure Linux agent.

> [!NOTE]
> We can create an admin-less and agent-less image by removing the sudo users from the linux image [remove sudo users from the Linux Image](/azure/confidential-computing/harden-the-linux-image-to-remove-sudo-users), and then follow the steps to remove the agent for the same image.

Steps to create a generalized image that removes the Azure guest agents are as follows:

1. Download an Ubuntu image.
[Create a custom image for Azure confidential VM](/azure/confidential-computing/how-to-create-custom-image-confidential-vm)

2. Mount the image.

    Follow the instructions in step 2 [Remove sudo users from the Linux Image](/azure/confidential-computing/harden-the-linux-image-to-remove-sudo-users) to mount the image.

3.  Remove the Azure linux agent
    Run one as root, to [remove the Azure Linux Agent](/azure/virtual-machines/linux/disable-provisioning)

    For Ubuntu 18.04+
     ```
    sudo chroot /mnt/dev/$imagedevice/ apt -y remove walinuxagent
    ```

4. Remove the Azure Linux Agent artifacts.

    > [!NOTE]
    If you know you will not ever reinstall the Linux Agent again [Remove the Azure Linux Agent artifacts](azure/virtual-machines/linux/disable-provisioning#:~:text=Step%202%3A%20(Optional)%20Remove%20the%20Azure%20Linux%20Agent%20artifacts), then you can run the following:

    For Ubuntu 18.04+
    ```
    sudo chroot /mnt/dev/$imagedevice/ rm -rf /var/lib/walinuxagent
    sudo chroot /mnt/dev/$imagedevice/ rm -rf /etc/ walinuxagent.conf
    sudo chroot /mnt/dev/$imagedevice/ rm -rf /var/log/ walinuxagent.log
    ```

5. Create a systemd service to provision the VM.

    Since we are removing the Azure Linux Agent, we need to provide a mechanism to report ready. Copy the contents of the [bash script]((/azure/virtual-machines/linux/no-agent#:~:text=)%0A%0Awireserver_conn.close()-,Bash%20script,-Copy) or [python script](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/no-agent#:~:text=to%20report%20ready.-,Python%20script,-Python) to the mounted image and make the file executable.
    ```
    sudo chmod +x /mnt/dev/$imagedevice/usr/local/azure-provisioning.sh
    ```

    To ensure report ready mechanism, create a [systemd service unit](azure/virtual-machines/linux/no-agent#:~:text=Automating%20running%20the%20code%20at%20first%20boot)
    and add the following to the /etc/systemd/system (this example names the unit file azure-provisioning.service)
    ```
    sudo chroot /mnt/dev/$imagedevice/ systemctl enable azure-provisioning.service
    ```
    Now the image is generalized and can be used to create a VM.

6. Unmount the image.
    ```
    umount /mnt/dev/$imagedevice
    ```

The image prepared does not include Azure Linux Agent that can be used for creating the confidential VMs.

Use the agent-less/admin-less+agent-less image in step 4 of [Create a custom image for Azure confidential VM](/azure/confidential-computing/how-to-create-custom-image-confidential-vm) while doing azcopy and the rest of the steps remains the same to create a Azure confidential agent-less VM.
