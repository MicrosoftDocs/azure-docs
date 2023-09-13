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

**Applies to:** :heavy_check_mark: Hardened Linux Images

Virtual machine scale set deployments using images from Azure marketplace can be done follwoing the steps described for standard [VMSS deployments](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/flexible-virtual-machine-scale-sets-cli). 

However, if you have chosen to create a hardened linux image by removing the Azure guest agents, it's crucial to comprehend what functionalities the VM loses before deciding to remove the Azure Linux Agent.

This "how to" document describes the steps to deploy a virtual machine scale set instance while comprehending the functional limitations of the hardened image on deploying the vmss instance.
## Prerequisites

- If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- A hardened linux image - you can create one from this [article](/articles/confidential-computing/harden-a-linux-image-to-remove-azure-guest-agent.md).
  
### VMSS confidential VM deployment from a hardened Linux image

Steps to deploy a scale set using VMSS and a hardened image are as follows:

1. Follow the steps to harden a Linux image.

    [Harden a Linux image to remove Azure guest agent](/articles/confidential-computing/harden-a-linux-image-to-remove-azure-guest-agent.md).
   
    [Harden a Linux image to remove sudo users](/articles/confidential-computing/harden-the-linux-image-to-remove-sudo-users.md).

2. Log into the Azure CLI.

    Make sure that you've installed the latest [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-az-cli2) and are logged in to an Azure account with [az login](https://learn.microsoft.com/en-us/cli/azure/reference-index).

3. Launch Azure Cloud Shell.

    The [Azure Cloud Shell](https://shell.azure.com/cli) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.
    
4.  Create a resource group.

    Create a resource group with az group create as follows:
    
   
    ```Azure CLI
    az group create --name myResourceGroup --location eastus
    ```

4. Create a Virtual Machine Scale Set.

    Now create a Virtual Machine Scale Set with az vmss create. The following example creates a scale set with an instance count of 2

    ```
    az vmss create \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --security-type ConfidentialVM \
    --os-disk-security-encryption-type DiskwithVMGuestState \
    --os-disk-secure-vm-disk-encryption-set "/subscriptions/.../diskEncryptionSets/<desName>" \
    --image "/subscriptions/.../images/<imageName>/versions/<version>" \
    --enable-vtpm true \
    --enable-secure-boot true \
    --load-balancer "/subscriptions/.../loadBalancers/<lbName>" \
    --specialized true \
    --instance-count 2 \
    --admin-username "azureuser" \
    --admin-password ""
    ```

> [!NOTE]
> If you are looking to set an admin username, ensure that it isn't part of the [reserved words](https://learn.microsoft.com/en-us/rest/api/compute/virtualmachines/createorupdate#osprofile) list for vmss. In this case, the username is auto set to azureuser.
> For the admin credentials, you will be able to use the credentials that you set fromt he hardened image while you create the vm.
> For specalized images, [osprofile properties](https://learn.microsoft.com/en-us/azure/virtual-machines/shared-image-galleries?tabs=azure-cli#generalized-and-specialized-images) are handled differently than generalized images.


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
