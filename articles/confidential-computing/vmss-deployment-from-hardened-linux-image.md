---
title: Deploy a virtual machine scale set using a hardened Linux image
description: Learn how to use vmss to deploy a scale set using the hardened linux image.
author: samyaktelsang-msft
ms.service: virtual-machines
mms.subservice: confidential-computing
ms.topic: how-to
ms.workload: infrastructure
ms.date: 9/12/2023
ms.author: satelsan
ms.custom: devx-track-azurecli
---

# Deploy a virtual machine scale set using a hardened Linux image

**Applies to:** :heavy_check_mark: Hardened Linux Images

Virtual machine scale set deployments using images from Azure marketplace can be done following the steps described for standard [VMSS deployments](/azure/virtual-machine-scale-sets/flexible-virtual-machine-scale-sets-cli). 

However, if you have chosen to create a hardened linux image by removing the Azure guest agents, it's crucial to comprehend what functionalities the VM loses before you decide to remove the Azure Linux Agent, and how it affects vmss deployment.

This "how to" document describes the steps to deploy a virtual machine scale set instance while comprehending the functional limitations of the hardened image on deploying the vmss instance.
## Prerequisites

- Azure subscription - If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- If your free trial accounts don't have access to the VMs used in this tutorial, one option is to use a [pay as you go subscription](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/).
- A hardened linux image - you can create one from this [article](harden-a-linux-image-to-remove-azure-guest-agent.md).
  
### VMSS confidential VM deployment from a hardened Linux image

Steps to deploy a scale set using VMSS and a hardened image are as follows:

1. Follow the steps to harden a Linux image.

    [Harden a Linux image to remove Azure guest agent](harden-a-linux-image-to-remove-azure-guest-agent.md).
   
    [Harden a Linux image to remove sudo users](harden-the-linux-image-to-remove-sudo-users.md).

2. Log in to the Azure CLI.

    Make sure that you've installed the latest [Azure CLI](/cli/azure/install-azure-cli) and are logged in to an Azure account with [az login](/cli/azure/reference-index).

3. Launch Azure Cloud Shell.

    The [Azure Cloud Shell](https://shell.azure.com/cli) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

    To open the Cloud Shell, just select Try it from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to https://shell.azure.com/bash. Select Copy to copy the blocks of code, paste it into the Cloud Shell, and select Enter to run it.

    If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.30 or later. Run az--version to find the version. If you need to install or upgrade, see Install Azure CLI.
    
4.  Create a resource group.

    Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named myResourceGroup in the eastus location:
    
   
    ```Azure CLI
    az group create --name myResourceGroup --location eastus
    ```

    > [!NOTE]
    > Confidential VMs are not available in all locations. For currently supported locations, see which [VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).

5. Create a Virtual Machine Scale Set.

    Now create a Virtual Machine Scale Set with az vmss create az cli. The following example creates a scale set called myScaleSet with an instance count of 2.
   
    If you are looking to set an admin username, ensure that it isn't part of the [reserved words](/rest/api/compute/virtualmachines/createorupdate#osprofile) list for vmss.
    In this case, the username is auto set to azureuser.
    For the admin credentials, you will be able to use the credentials that you set from the hardened image while you create the vm.

    > [!NOTE]
    > For specalized images, [osprofile properties](/azure/virtual-machines/shared-image-galleries) are handled differently than generalized images.
    > Using a [load balancer](/azure/load-balancer/load-balancer-overview) is optional but is encouraged for these reasons.
    
    ```azurecli-interactive
    az vmss create \
      --resource-group myResourceGroup \
      --name myScaleSet \
      --vm-sku "Standard_DC4as_v5" \
      --security-type ConfidentialVM \
      --os-disk-security-encryption-type DiskwithVMGuestState \
      --os-disk-secure-vm-disk-encryption-set "/subscriptions/.../disk-encryption-sets/<des-name>" \
      --image "/subscriptions/.../images/<imageName>/versions/<version>" \
      --enable-vtpm true \
      --enable-secure-boot true \
      --vnet-name <virtual-network-name> \
      --subnet <subnet-name> \
      --lb "/subscriptions/.../loadBalancers/<lb-name>" \
      --specialized true \
      --instance-count 2 \
      --admin-username "azureuser" \
      --admin-password ""
    ```

6. Access the virtual machine scale set from the portal.

    You can access your cvm scale set and use the admin username and password set previously to log in. Please note that if you choose to update the admin credentials, do so directly in the scale set model using the cli.

    > [!NOTE]
    > If you are looking to deploy cvm scaled scale using the custom hardened image, please note that some features related to auto scaling will be restricted. Will manual scaling rules continue to work as expected, the autoscaling ability will be limited due to the agentless custom image. More details on the restrictions can be found here for the [provisioning agent](/azure/virtual-machines/linux/disable-provisioning). Alternatively, you can navigate to the metrics tab on the azure portal and confirm the same.
    > However, you can continue to set up custom rules based on load balancer metrics such as SYN count, SNAT connection count, etc. 

## Next Steps

In this article, you learned how to deploy a virtual machine scale set instance with a hardened linux image. For more information about CVM, see [DCasv5 and ECasv5 series confidential VMs](confidential-vm-overview.md).
