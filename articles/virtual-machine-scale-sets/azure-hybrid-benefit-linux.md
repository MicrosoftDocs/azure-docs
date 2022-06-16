---
title: Azure Hybrid Benefit for Linux virtual machine scale sets 
description: Learn how Azure Hybrid Benefit can apply to virtual machine scale set to help you save money on your Linux virtual machines running on Azure.
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



# Azure Hybrid Benefit for Linux virtual machine scale set

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Uniform scale sets

**Hybrid Benefit for Linux virtual machine scale set is in GA now**. *Azure Hybrid benefit* can reduce the cost of running your *Red Hat Enterprise Linux (RHEL)* and *SUSE Linux Enterprise Server (SLES)* [virtual machine scale sets](./overview.md).

When you enable Hybrid benefit, your only fee is for your scale set infrastructure. Hybrid benefit is available for all RHEL and SLES Marketplace pay-as-you-go (PAYG) images.


>[!NOTE]
> This article explores Hybrid Benefit for Linux *virtual machine scale sets (VMSS)*. A separate article discusses [Hybrid benefit for Linux VMs](../virtual-machines/linux/azure-hybrid-benefit-linux.md). This is already available to Azure customers since November, 2020.

## Benefit description
Hybrid benefit allows you to switch your virtual machine scale sets to *bring-your-own-subscription (BYOS)* billing. You can use your Cloud access licenses from Red Hat or SUSE to acheive this. 

VMSSs deployed from PAYG marketplace images that enable Hybrid benefit are charged both infrastructure and software fees. Hybrid benefit allows you to switch PAYG instances to BYOS without any need to redeployment.

:::image type="content" source="./media/azure-hybrid-benefit-linux/azure-hybrid-benefit-linux-cost.png" alt-text="A screenshot that shows Hybrid Benefit costs for Linux VMs.":::

## Which Linux VMs can apply Hybrid Benefit
Hybrid Benefit can be used on all RHEL and SLES PAYG images from Azure Marketplace. Hybrid benefit isn't yet available for RHEL or SLES BYOS images or custom images from Azure Marketplace.

Azure Dedicated Host instances, and SQL hybrid benefits are not eligible for Hybrid Benefit if you're already using Hybrid benefit with Linux VMs.

## Get started

### Hyrbid benefit for Red Hat VMSS customers

Hybrid Benefit for RHEL is available to Red Hat customers who meet both of these criteria:

- Have active or unused RHEL subscriptions that are eligible for use in Azure
- Have enabled one or more of those subscriptions for use in Azure with the [Red Hat Cloud Access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program

> [!IMPORTANT]
> Ensure the correct subscription has been enabled on the [cloud-access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program.

To start using Hybrid benefit for Red Hat:

1. Enable your eligible RHEL subscriptions in Azure by using the [Red Hat Cloud Access customer interface](https://access.redhat.com/management/cloud).

   The Azure subscriptions that you provide during the Red Hat Cloud Access enablement process are permitted to use Hybrid Benefit.
1. Apply Hybrid benefit to any of your existing or new RHEL PAYG VMSSs. You can use Azure portal or Azure CLI to enable Hybrid benefit.
1. Configure update sources for your RHEL VMs and RHEL subscription compliance guidelines with the following, recommended [next steps](https://access.redhat.com/articles/5419341).


### Hyrbid benefit for SUSE VMSS customers

To start using Hybrid benefit for SUSE:

1. Register with the SUSE Public Cloud Program.
1. Apply Hybrid benefit to your newly created or existing virtual machine scale set via the Azure portal or Azure CLI.
1. Register your VMs that are receiving Hybrid benefit with a separate source of updates.


## Enable and disable Hybrid benefit on Azure portal 
### Azure portal example to enable Hybrid benefit during creation:
1. Visit [Microsoft Azure portal](https://portal.azure.com/)
1. Go to 'Create a Virtual Machine scale set' page on the portal.
 ![AHB while creating VMSS](./media/azure-hybrid-benefit-linux/create-vmss-ahb.png)
1. Click on the checkbox to enable AHB conversion and use cloud access licenses.
 ![AHB while creating VMSS Checkbox](./media/azure-hybrid-benefit-linux/create-vmss-ahb-checkbox.png)
1. Create a Virtual Machine scale set following the next set of instructions
1. Check the **Configuration** blade and you will see the option enabled. 
![AHB OS blade after creating](./media/azure-hybrid-benefit-linux/create-vmss-ahb-os-blade.png)

### Azure portal example to enable Hybrid benefit for an existing virtual machine scale set:
1. Visit [Microsoft Azure portal](https://portal.azure.com/)
1. Open the 'Virtual Machine scale set' page on which you want to apply the conversion.
1. Go the **Operating system** option on the left. You will see the Licensing section. To enable the AHB conversion, check the 'Yes' radio button and check the Confirmation checkbox.
![AHB Configuration blade after creating](./media/azure-hybrid-benefit-linux/create-vmss-ahb-os-blade.png)



## Enable and disable Hybrid benefit using Azure CLI

You can use the `az vmss update` command to update existing VMs. For RHEL VMs, run the command with a `--license-type` parameter of `RHEL_BYOS`. For SLES VMs, run the command with a `--license-type` parameter of `SLES_BYOS`.

### A CLI example to enable Hybrid benefit
```azurecli
# This will enable Hybrid benefit on a RHEL VMSS
az vmss update --resource-group myResourceGroup --name myVmName --license-type RHEL_BYOS

# This will enable Hybrid benefit on a SLES VMSS
az vmss update --resource-group myResourceGroup --name myVmName --license-type SLES_BYOS
```
### A CLI example to disable Hybrid benefit
To disable Hybrid benefit, use a `--license-type` value of `None`:

```azurecli
# This will disable Hybrid benefit on a VM
az vmss update -g myResourceGroup -n myVmName --license-type None
```

>[!NOTE]
> Scale sets have an ["upgrade policy"](./virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) that determine how VMs are brought up-to-date with the latest scale set model. 
Hence, if your VMSS have 'Automatic' upgrade policy, AHB benefit will be applied automatically as VM instances get updated. 
If VMSS have 'Rolling' upgrade policy, based on the scheduled updates, AHB will be applied.
In case of 'Manual' upgrade policy, you will have to perform "manual upgrade" of each existing VM.  

### A CLI example to upgrade virtual machine scale set instances in case of "Manual Upgrade" policy 
```azurecli
# This will bring VMSS instances up to date with latest VMSS model 
az vmss update-instances --resource-group myResourceGroup --name myScaleSet --instance-ids {instanceIds}
```

## Apply Hybrid Benefit at virtual machine scale set create time 
In addition to applying the Hybrid Benefit to existing pay-as-you-go virtual machine scale set, you can invoke it at the time of virtual machine scale set creation. Hybrid benefits of doing so are threefold:
- You can provision both PAYG and BYOS virtual machine scale set instances by using the same image and process.
- It enables future licensing mode changes, something not available with a BYOS-only image.
- The virtual machine scale set instances will be connected to *Red Hat Update Infrastructure (RHUI)* by default, to ensure that it remains up to date and secure. You can change the updated mechanism after deployment at any time.

### A CLI example to create virtual machine scale set with Hybrid benefit
```azurecli
# This will enable Hybrid benefit while creating RHEL VMSS
az vmss create --name myVmName --resource-group myResourceGroup --vnet-name myVnet --subnet mySubnet  --image myRedHatImageURN --admin-username myAdminUserName --admin-password myPassword --instance-count myInstanceCount --license-type RHEL_BYOS 

# This will enable Hybrid benefit while creating RHEL VMSS
az vmss create --name myVmName --resource-group myResourceGroup --vnet-name myVnet --subnet mySubnet  --image myRedHatImageURN --admin-username myAdminUserName --admin-password myPassword --instance-count myInstanceCount --license-type SLES_BYOS
```

## Next steps
* [Learn how to create and update VMs and add license types (RHEL_BYOS, SLES_BYOS) for Hybrid Benefit by using the Azure CLI](/cli/azure/vmss)