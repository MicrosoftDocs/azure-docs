---
title: Azure Hybrid Benefit for Linux virtual machine scale sets 
description: Learn how Azure Hybrid Benefit can apply to virtual machine scale set to help you save money on your Linux virtual machines running on Azure.
services: virtual-machine-scale-sets
documentationcenter: ''
author: mathapli
manager: rochakm
ms.service: virtual-machine-scale-sets
ms.subservice: linux
ms.collection: linux
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 03/20/2021
ms.author: mathapli
---



# Azure Hybrid Benefit for Linux virtual machine scale set (Public Preview)

**Azure Hybrid Benefit for Linux virtual machine scale set is in public preview now**. AHB benefit can help you reduce the cost of running your RHEL and SLES [virtual machine scale sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets/overview).

With this benefit, you pay for only the infrastructure cost of your scale set. The benefit is available for all RHEL and SLES Marketplace pay-as-you-go (PAYG) images.


>[!NOTE]
> This article describes the Azure Hybrid Benefit for Linux VMSS. There is a separate [article available [here AHB for Linux VMs](https://docs.microsoft.com/azure/virtual-machines/linux/azure-hybrid-benefit-linux), which is already available to Azure customers since November, 2020.

## Benefit description
Azure Hybrid allows you to use the existing Cloud access licenses from Red Hat or SUSE and flexibly convert virtual machine scale set instances to bring-your-own-subscription (BYOS) billing. 

Virtual machine scale set deployed from PAYG marketplace images will charge both infrastructure and software fee. With AHB, PAYG instances can be converted to a BYOS billing model without redeployment.

:::image type="content" source="./media/azure-hybrid-benefit-linux/azure-hybrid-benefit-linux-cost.png" alt-text="Azure Hybrid Benefit cost visualization on Linux VMs.":::

## Scope of Azure Hybrid Benefit eligibility for Linux
Azure Hybrid Benefit is available for all RHEL and SLES PAYG images from Azure Marketplace. The benefit isn't yet available for RHEL or SLES BYOS images or custom images from Azure Marketplace.

Azure Dedicated Host instances, and SQL hybrid benefits are not eligible for Azure Hybrid Benefit if you're already using the benefit with Linux VMs.

## Get started

### Red Hat customers

Azure Hybrid Benefit for RHEL is available to Red Hat customers who meet both of these criteria:

- Have active or unused RHEL subscriptions that are eligible for use in Azure
- Have enabled one or more of those subscriptions for use in Azure with the [Red Hat Cloud Access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program

> [!IMPORTANT]
> Ensure the correct subscription has been enabled on the [cloud-access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program.

To start using the benefit for Red Hat:

1. Enable your eligible RHEL subscriptions in Azure by using the [Red Hat Cloud Access customer interface](https://access.redhat.com/management/cloud).

   The Azure subscriptions that you provide during the Red Hat Cloud Access enablement process will then be permitted to use the Azure Hybrid Benefit feature.
1. Apply Azure Hybrid Benefit to any of your existing and new RHEL PAYG virtual machine scale sets. You can use Azure portal or Azure CLI for enabling the benefit.
1. Follow recommended [next steps](https://access.redhat.com/articles/5419341) for configuring update sources for your RHEL VMs and for RHEL subscription compliance guidelines.


### SUSE customers

To start using the benefit for SUSE:

1. Register with the SUSE Public Cloud Program.
1. Apply the benefit to your newly created or existing virtual machine scale set via the Azure portal or Azure CLI.
1. Register your VMs that are receiving the benefit with a separate source of updates.


## Enable and disable the benefit on Azure Portal 
The Portal experience for enabling and disabling AHB on virtual machine scale set is **not currently available**.

## Enable and disable the benefit using Azure CLI

You can use the `az vmss update` command to update existing VMs. For RHEL VMs, run the command with a `--license-type` parameter of `RHEL_BYOS`. For SLES VMs, run the command with a `--license-type` parameter of `SLES_BYOS`.

### CLI example to enable the benefit
```azurecli
# This will enable the benefit on a RHEL VMSS
az vmss update --resource-group myResourceGroup --name myVmName --license-type RHEL_BYOS

# This will enable the benefit on a SLES VMSS
az vmss update --resource-group myResourceGroup --name myVmName --license-type SLES_BYOS
```
### CLI example to disable the benefit
To disable the benefit, use a `--license-type` value of `None`:

```azurecli
# This will disable the benefit on a VM
az vmss update -g myResourceGroup -n myVmName --license-type None
```

>[!NOTE]
> Scale sets have an ["upgrade policy"](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-scale-set#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) that determine how VMs are brought up-to-date with the latest scale set model. 
Hence, if your VMSS have 'Automatic' upgrade policy, AHB benefit will be applied automatically as VM instances get updated. 
If VMSS have 'Rolling' upgrade policy, based on the scheduled updates, AHB will be applied.
In case of 'Manual' upgrade policy, you will have to perform "manual upgrade" of each existing VM.  

### CLI example to upgrade virtual machine scale set instances in case of "Manual Upgrade" policy 
```azurecli
# This will bring VMSS instances up to date with latest VMSS model 
az vmss update-instances --resource-group myResourceGroup --name myScaleSet --instance-ids {instanceIds}
```

## Apply the Azure Hybrid Benefit at virtual machine scale set create time 
In addition to applying the Azure Hybrid Benefit to existing pay-as-you-go virtual machine scale set, you can invoke it at the time of virtual machine scale set creation. The benefits of doing so are threefold:
- You can provision both PAYG and BYOS virtual machine scale set instances by using the same image and process.
- It enables future licensing mode changes, something not available with a BYOS-only image.
- The virtual machine scale set instances will be connected to Red Hat Update Infrastructure (RHUI) by default, to ensure that it remains up to date and secure. You can change the updated mechanism after deployment at any time.

### CLI example to create virtual machine scale set with AHB benefit
```azurecli
# This will enable the benefit while creating RHEL VMSS
az vmss create --name myVmName --resource-group myResourceGroup --vnet-name myVnet --subnet mySubnet  --image myRedHatImageURN --admin-username myAdminUserName --admin-password myPassword --instance-count myInstanceCount --license-type RHEL_BYOS 

# This will enable the benefit while creating RHEL VMSS
az vmss create --name myVmName --resource-group myResourceGroup --vnet-name myVnet --subnet mySubnet  --image myRedHatImageURN --admin-username myAdminUserName --admin-password myPassword --instance-count myInstanceCount --license-type SLES_BYOS
```

## Next steps
* [Learn how to create and update VMs and add license types (RHEL_BYOS, SLES_BYOS) for Azure Hybrid Benefit by using the Azure CLI](/cli/azure/vmss)
