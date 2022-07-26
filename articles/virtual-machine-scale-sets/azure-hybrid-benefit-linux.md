---
title: Azure Hybrid Benefit for Linux virtual machine scale sets 
description: Learn how Azure Hybrid Benefit can apply to virtual machine scale sets and save you money on Linux Virtual Machines in Azure.
services: virtual-machine-scale-sets
documentationcenter: ''
author: mathapli
manager: rochakm
ms.service: virtual-machine-scale-sets
ms.subservice: azure-hybrid-benefit
ms.collection: linux
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 06/16/2022
ms.author: mathapli
ms.custom: kr2b-contr-experiment
---

# Explore Azure Hybrid Benefit for Linux virtual machine scale sets

> [!NOTE]
> This article focuses on virtual machine scale sets running in Uniform Orchestration mode. We recommend using Flexible Orchestration for new workloads. For more information, see [Orchesration modes for virtual machine scale sets in Azure](virtual-machine-scale-sets-orchestration-modes.md).

**Azure Hybrid Benefit for Linux virtual machine scale set is generally available now**. *Azure Hybrid Benefit (AHB)* can reduce the cost of running your *Red Hat Enterprise Linux (RHEL)* and *SUSE Linux Enterprise Server (SLES)* [virtual machine scale sets](./overview.md). AHB is available for all RHEL and SLES Marketplace pay-as-you-go (PAYG) images. 

When you enable AHB, the only fee that you incur is the cost of your scale set infrastructure.

## What is AHB for Linux virtual machine scale sets?
AHB allows you to switch your virtual machine scale sets to *bring-your-own-subscription (BYOS)* billing. You can use your cloud access licenses from Red Hat or SUSE for this. You can also switch PAYG instances to BYOS without the need to redeploy.

A virtual machine scale set deployed from PAYG marketplace images is charged both infrastructure and software fees when AHB is enabled.

:::image type="content" source="./media/azure-hybrid-benefit-linux/azure-hybrid-benefit-linux-cost.png" alt-text="A screenshot that shows AHB costs for Linux Virtual Machines.":::

## Which Linux Virtual Machines can use AHB?
AHB can be used on all RHEL and SLES PAYG images from Azure Marketplace. AHB isn't yet available for RHEL or SLES BYOS images or custom images from Azure Marketplace.

Azure Dedicated Host instances, and SQL hybrid benefits are not eligible for AHB if you're already using AHB with Linux Virtual Machines.

## Get started

### How to enable AHB for Red Hat virtual machine scale sets

AHB for RHEL is available to Red Hat customers who meet the following criteria:

- Have active or unused RHEL subscriptions that are eligible for use in Azure
- Have enabled one or more subscriptions for use in Azure with the [Red Hat Cloud Access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program

> [!IMPORTANT]
> Ensure the correct subscription has been enabled in the [cloud-access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program.

To start using AHB for Red Hat:

1. Enable your eligible RHEL subscriptions in Azure by using the [Red Hat Cloud Access customer interface](https://access.redhat.com/management/cloud).

   The Azure subscriptions that you provide during the Red Hat Cloud Access enablement process are permitted to use AHB.
1. Apply AHB to any of your new or existing RHEL PAYG virtual machine scale sets. You can use Azure portal or Azure *command-line interface (CLI)* to enable AHB.
1. Configure update sources for your RHEL Virtual Machines and RHEL subscription compliance guidelines with the following, recommended [next steps](https://access.redhat.com/articles/5419341).


### How to enable AHB for SUSE virtual machine scale sets

To start using AHB for SUSE:

1. Register with the SUSE Public Cloud Program.
1. Apply AHB to your newly created or existing virtual machine scale set via Azure portal or Azure CLI.
1. Register your Virtual Machines that are receiving AHB with a separate source of updates.


## How to enable and disable AHB in Azure portal 
### How to enable AHB during virtual machine scale set creation in Azure portal:
1. Visit [Microsoft Azure portal](https://portal.azure.com/)
1. Go to 'Create a virtual machine scale set' page on the portal.
    :::image type="content" source="./media/azure-hybrid-benefit-linux/create-vmss-ahb.png" alt-text="Screenshot of the virtual machine scale set blade in the Azure portal.":::
1. Click on the checkbox to enable AHB and to use cloud access licenses.
    :::image type="content" source="./media/azure-hybrid-benefit-linux/create-vmss-ahb-checkbox.png" alt-text="Screenshot of the check box associated with hybrid benefit during the virtual machine scale set create phase in the Azure portal.":::
1. Create a virtual machine scale set following the next set of instructions
1. Check the **Configuration** blade. You'll see the option enabled.
    :::image type="content" source="./media/azure-hybrid-benefit-linux/create-vmss-ahb-os-blade.png" alt-text="Screenshot of the virtual machine scale set create page in the Azure portal after the use select the hybrid benefit check box.":::

### How to enable AHB in virtual machine scale sets in Azure portal:
1. Visit [Microsoft Azure portal](https://portal.azure.com/)
1. Open the 'virtual machine scale set' page on which you want to apply the conversion.
1. Go the **Operating system** option on the left. You will see the Licensing section. To enable the AHB conversion, check the 'Yes' radio button and check the Confirmation checkbox.
![AHB Configuration blade after creating](./media/azure-hybrid-benefit-linux/create-vmss-ahb-os-blade.png)



## How to enable and disable AHB using Azure CLI

You can use the `az vmss update` command to update Virtual Machines. For RHEL Virtual Machines, run the command with a `--license-type` parameter of `RHEL_BYOS`. For SLES Virtual Machines, run the command with a `--license-type` parameter of `SLES_BYOS`.

### How to enable AHB using a CLI
```azurecli
# This will enable AHB on a RHEL virtual machine scale set
az vmss update --resource-group myResourceGroup --name myVmName --license-type RHEL_BYOS

# This will enable AHB on a SLES virtual machine scale set
az vmss update --resource-group myResourceGroup --name myVmName --license-type SLES_BYOS
```
### How to disable AHB using a CLI
To disable AHB, use a `--license-type` value of `None`:

```azurecli
# This will disable AHB on a Virtual Machine
az vmss update -g myResourceGroup -n myVmName --license-type None
```

>[!NOTE]
> Scale sets have an ["upgrade policy"](./virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) that determine how Virtual Machine's are brought up-to-date with the latest scale set model. 
Hence, if your virtual machine scale set have 'Automatic' upgrade policy, AHB will be applied automatically as Virtual Machine instances get updated. 
If virtual machine scale set have 'Rolling' upgrade policy, based on the scheduled updates, AHB will be applied.
In case of 'Manual' upgrade policy, you will have to perform a "manual upgrade" of your Virtual Machines.  

### How to upgrade virtual machine scale set instances in case of "Manual Upgrade" policy using a CLI 
```azurecli
# This will bring virtual machine scale set instances up to date with latest virtual machine scale set model 
az vmss update-instances --resource-group myResourceGroup --name myScaleSet --instance-ids {instanceIds}
```

## How to apply AHB at virtual machine scale set creation time 
In addition to applying AHB to pay-as-you-go virtual machine scale set, you can invoke it when you create virtual machine scale sets. The benefits of doing so are threefold:
- You can provision both PAYG and BYOS virtual machine scale set instances by using the same image and process.
- It enables future licensing mode changes, something not available with a BYOS-only image.
- The virtual machine scale set instances will be connected to *Red Hat Update Infrastructure (RHUI)* by default, to ensure that it remains up to date and secure. You can change the updated mechanism after deployment at any time.

### How to apply AHB at virtual machine scale set creation time using a CLI
```azurecli
# This will enable AHB while creating RHEL virtual machine scale set
az vmss create --name myVmName --resource-group myResourceGroup --vnet-name myVnet --subnet mySubnet  --image myRedHatImageURN --admin-username myAdminUserName --admin-password myPassword --instance-count myInstanceCount --license-type RHEL_BYOS 

# This will enable AHB while creating RHEL virtual machine scale set
az vmss create --name myVmName --resource-group myResourceGroup --vnet-name myVnet --subnet mySubnet  --image myRedHatImageURN --admin-username myAdminUserName --admin-password myPassword --instance-count myInstanceCount --license-type SLES_BYOS
```

## Next steps
* [Learn how to create and update Virtual Machines and add license types (RHEL_BYOS, SLES_BYOS) for AHB by using the Azure CLI](/cli/azure/vmss)
