---
title: VMSS confidential VM deployment from a hardened Linux image
description: Learn how to use vmss to deploy a scale set using the hardened linux image.
author: satelsan
ms.service: virtual-machines
mms.subservice: confidential-computing
ms.topic: how-to
ms.workload: infrastructure
ms.date: 9/12/2023
ms.author: satelsan
ms.custom: devx-track-azurecli
---

# VMSS confidential VM deployment from a hardened Linux image

**Applies to:** :heavy_check_mark: Linux Images

Azure supports two provisioning agents [cloud-init](https://github.com/canonical/cloud-init), and the [Azure Linux Agent](https://github.com/Azure/WALinuxAgent) (WALA), which forms the prerequisites for creating the [generalized images](/azure/virtual-machines/generalize#linux) (Azure Compute Gallery or Managed Image). The Azure Linux Agent contains Provisioning Agent code and Extension Handling code in one package.

It's crucial to comprehend what functionalities the VM loses before deciding to remove the Azure Linux Agent. Removal of the guest agent removes the functionality enumerated at [Azure Linux Agent](/azure/virtual-machines/extensions/agent-linux?branch=pr-en-us-247336).

This "how to" shows you steps to remove guest agent from the Linux image.
## Prerequisites

- If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- A hardened linux image - you can create one from this [article](/articles/confidential-computing/harden-a-linux-image-to-remove-azure-guest-agent.md).
  
### VMSS confidential VM deployment from a hardened Linux image

Steps to deploy a scale set using VMSS and a hardened image are as follows:

1. Follow the steps to harden a Linux image.

    [Harden a Linux image to remove Azure guest agent](/articles/confidential-computing/harden-a-linux-image-to-remove-azure-guest-agent.md).
   
    [Harden a Linux image to remove sudo users](/articles/confidential-computing/harden-the-linux-image-to-remove-sudo-users.md).

3. Mount the image.

    Follow the instructions in step 2 of [remove sudo users from the Linux Image](/azure/confidential-computing/harden-the-linux-image-to-remove-sudo-users) to mount the image.

4.  Remove the Azure Linux agent

    Run as root to [remove the Azure Linux Agent](/azure/virtual-machines/linux/disable-provisioning)

    For Ubuntu 18.04+
     ```
    sudo chroot /mnt/dev/$imagedevice/ apt -y remove walinuxagent
    ```


> [!NOTE]
> If you know you will not reinstall the Linux Agent again [remove the Azure Linux Agent artifacts](/azure/virtual-machines/linux/disable-provisioning#:~:text=Step%202%3A%20(Optional)%20Remove%20the%20Azure%20Linux%20Agent%20artifacts), you can run the following steps.


4. (Optional) Remove the Azure Linux Agent artifacts.

    If you know you will not reinstall the Linux Agent again, then you can run the following else skip this step:

    For Ubuntu 18.04+
    ```
    sudo chroot /mnt/dev/$imagedevice/ rm -rf /var/lib/walinuxagent
    sudo chroot /mnt/dev/$imagedevice/ rm -rf /etc/ walinuxagent.conf
    sudo chroot /mnt/dev/$imagedevice/ rm -rf /var/log/ walinuxagent.log
    ```

5. Create a systemd service to provision the VM.

    Since we are removing the Azure Linux Agent, we need to provide a mechanism to report ready. Copy the contents of the bash script or python script located [here](/azure/virtual-machines/linux/no-agent?branch=pr-en-us-247336#add-required-code-to-the-vm) to the mounted image and make the file executable (i.e, grant execute permission on the file - chmod).
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

    The image prepared does not include Azure Linux Agent anymore.

7. Use the prepared image to deploy a confidential VM.

    Follow the steps starting from 4 in the [Create a custom image for Azure confidential VM](/azure/confidential-computing/how-to-create-custom-image-confidential-vm) document to deploy the agent-less confidential VM.

> [!NOTE]
> If you are looking to deploy cvm scaled scale using the custom image, please note that some features related to auto scaling will be restricted. Will manual scaling rules continue to work as expected, the autoscaling ability will be limited due to the agentless custom image. More details on the restrictions can be found here for the [provisioning agent](/azure/virtual-machines/linux/disable-provisioning). Alternatively, you can navigate to the metrics tab on the azure portal and confirm the same.

## Next Steps

[Create a custom image for Azure confidential VM](/azure/confidential-computing/how-to-create-custom-image-confidential-vm)
