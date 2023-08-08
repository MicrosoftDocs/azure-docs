---
title: Harden a Linux image to remove Azure guest agent
description: Learn how to use the Azure CLI to harden a linux image to remove Azure guest agent.
author: vvenug
ms.service: virtual-machines
mms.subservice: confidential-computing
ms.topic: how-to
ms.workload: infrastructure
ms.date: 8/03/2023
ms.author: vvenugopal
ms.custom: devx-track-azurecli
---

# Harden a Linux image to remove Azure guest agent

**Applies to:** :heavy_check_mark: Linux Images

Azure supports two provisioning agents [cloud-init](https://github.com/canonical/cloud-init), and the [Azure Linux Agent](https://github.com/Azure/WALinuxAgent) (WALA), which forms the prerequisites for creating the generalized images (Azure Compute Gallery or Managed Image). The Azure Linux Agent contains Provisioning Agent Code and Extension Handling code in one package.

The provisioning agent provides feature support such as setting the host name, configuring SSH authentication types, and [more](/azure/virtual-machines/extensions/agent-linux?branch=pr-en-us-247336#image-provisioning) for all endorsed Azure Linux distributions. The extension handling code is responsible for communicating with the Azure fabric, and handling the VM extensions operations such as installations, reporting status, updating the individual extensions, and removing them.
But there could be a scenario when you don't want to use either of these applications for your provisioning agent, such as:

- Reducing the size of your [Trusted Computing Base (TCB)](/azure/confidential-computing/overview#reducing-the-attack-surface) to create a secure environment for your VM.
- You require specific VM properties to be set, such as hostname.

It's crucial to comprehend what functionalities the VM loses before deciding to remove the Linux Agent. Removal of the guest agent removes the functionality enumerated at [Azure linux VM Agent](/azure/virtual-machines/extensions/agent-linux?branch=pr-en-us-247336).

This "how to" shows you steps to remove guest agent from the Linux image and deploy a confidential virtual machine (confidential VM) in Azure.

## Prerequisites

- If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Ubuntu image - you can choose one from the [Azure Marketplace](/azure/virtual-machines/linux/cli-ps-findimage).

### Remove Azure linux agent and prepare a generalized Linux image

Steps to create an image that removes the Azure guest agents are as follows:

1. Download an Ubuntu image.
[Download a Linux VHD from Azure](/azure/virtual-machines/linux/download-vhd?tabs=azure-portal)

2. Mount the image.

    Follow the instructions in step 2 of [remove sudo users from the Linux Image](/azure/confidential-computing/harden-the-linux-image-to-remove-sudo-users) to mount the image.

3.  Remove the Azure linux agent


    Run as root to [remove the Azure Linux Agent](/azure/virtual-machines/linux/disable-provisioning)

    For Ubuntu 18.04+
     ```
    sudo chroot /mnt/dev/$imagedevice/ apt -y remove walinuxagent
    ```


> [!NOTE]
> If you know you will not reinstall the Linux Agent again [remove the Azure Linux Agent artifacts](/azure/virtual-machines/linux/disable-provisioning#:~:text=Step%202%3A%20(Optional)%20Remove%20the%20Azure%20Linux%20Agent%20artifacts), you can run the following steps.


4. Remove the Azure Linux Agent artifacts.

    For Ubuntu 18.04+
    ```
    sudo chroot /mnt/dev/$imagedevice/ rm -rf /var/lib/walinuxagent
    sudo chroot /mnt/dev/$imagedevice/ rm -rf /etc/ walinuxagent.conf
    sudo chroot /mnt/dev/$imagedevice/ rm -rf /var/log/ walinuxagent.log
    ```

5. Create a systemd service to provision the VM.

    Since we are removing the Azure Linux Agent, we need to provide a mechanism to report ready. Copy the contents of the bash script or python script located [here](/azure/virtual-machines/linux/no-agent?branch=pr-en-us-247336#add-required-code-to-the-vm) to the mounted image and make the file executable.
    ```
    sudo chmod +x /mnt/dev/$imagedevice/usr/local/azure-provisioning.sh
    ```

    To ensure report ready mechanism, create a [systemd service unit](/azure/virtual-machines/linux/no-agent#:~:text=Automating%20running%20the%20code%20at%20first%20boot)
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

7. Use this agent-less image in step 4 of [Create a custom image for Azure confidential VM](/azure/confidential-computing/how-to-create-custom-image-confidential-vm) while doing azcopy and the rest of the steps remains the same to create a Azure confidential agent-less VM.

## Next Steps

We can create an admin-less and agent-less image by removing the sudo users from the linux image [remove sudo users from the Linux Image](/azure/confidential-computing/harden-the-linux-image-to-remove-sudo-users), and then follow the above mentioned steps to remove the agent for the same image.
