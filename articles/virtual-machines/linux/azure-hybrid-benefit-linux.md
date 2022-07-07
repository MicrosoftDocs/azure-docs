---
title: Azure Hybrid Benefit for PAYG Linux Virtual Machines
description: Learn how Azure Hybrid Benefit can save you money on Linux virtual machines.
services: virtual-machines
author: mathapli
manager: gachandw
ms.service: virtual-machines
ms.subservice: billing
ms.collection: linux
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 06/14/2022
ms.author: mathapli
ms.custom: kr2b-contr-experiment
---

# Explore Azure Hybrid Benefit for pay-as-you-go Linux virtual machines

>[!IMPORTANT]
>This article explores *Azure Hybrid Benefit (AHB)* for *pay-as-you-go (PAYG)* *virtual machines or virtual machine scale sets (Flexible orchestration mode only)*. It explores how to switch your Virtual Machines to *Red Hat Enterprise Linux (RHEL)* PAYG and *SUSE Linux Enterprise Server (SLES)* PAYG billing. To do the reverse and switch to *bring-your-own-subscription (BYOS)* billing, visit [Azure Hybrid Benefit for BYOS Virtual Machines](./azure-hybrid-benefit-byos-linux.md).

AHB for pay-as-you-go (PAYG) virtual machines or virtual machine scale sets (Flexible orchestration mode only) is an optional licensing benefit. It significantly reduces the cost of running Red Hat Enterprise Linux (RHEL) and SUSE Linux Enterprise Server (SLES) Virtual Machines in the cloud. With this benefit, your RHEL or SLES subscription covers your software fee. So you only pay infrastructure costs for your Virtual Machine. This benefit is available for all RHEL and SLES Marketplace PAYG images.

## How does AHB work?

You can convert existing RHEL and SLES PAYG Virtual Machines to bring-your-own-subscription (BYOS) billing using AHB. You can switch PAYG Virtual Machines to BYOS billing without having to redeploy. Virtual Machines deployed from PAYG images on Azure pay both an infrastructure fee and a software fee. When you apply AHB, you pay only infrastructure costs for your Virtual Machine.

:::image type="content" source="./media/ahb-linux/azure-hybrid-benefit-cost.png" alt-text="AHB cost visualization on Linux Virtual Machines.":::

After you apply AHB to your RHEL or SLES Virtual Machine, you are no longer charged a software fee. Your Virtual Machine is charged a BYOS fee instead. You can also switch back from AHB to PAYG billing at any time.

## How to apply AHB to your PAYG Virtual Machines

**AHB for PAYG Virtual Machines** is available for all RHEL and SLES PAYG images in Azure Marketplace.

Azure Dedicated Host instances, and SQL hybrid benefits are not eligible for AHB if you already use AHB with Linux Virtual Machines.

## Get started

### How to apply AHB to Red Hat

AHB for PAYG Virtual Machines for RHEL is available to Red Hat customers who meet the following criteria:

- Have active or unused RHEL subscriptions that are eligible for use in Azure
- Have enabled one or more of their subscriptions for use in Azure with the [Red Hat Cloud Access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program

> [!IMPORTANT]
> Ensure the correct subscription has been enabled on the [cloud-access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program.

To start using AHB for Red Hat:

1. Enable one or more of your eligible RHEL subscriptions for use in Azure by using the [Red Hat Cloud Access customer interface](https://access.redhat.com/management/cloud).

   The Azure subscriptions that you provide during the Red Hat Cloud Access enablement process will then be permitted to use AHB.
1. Apply AHB for PAYG Virtual Machines to any RHEL PAYG Virtual Machines that you deploy in Azure Marketplace PAYG images. You can use Azure portal or Azure command-line interface (CLI) to enable AHB.
1. Follow the recommended [next steps](https://access.redhat.com/articles/5419341) for configuring update sources for your RHEL Virtual Machines and for RHEL subscription compliance guidelines.


### How to apply AHB to SUSE

AHB for PAYG Virtual Machines for SUSE is available to customers who have:

- Unused SUSE subscriptions that are eligible to use in Azure.
- One or more active SUSE subscriptions to use on-premises that should be moved to Azure.
- Purchased subscriptions that they activated in the SUSE Customer Center to use in Azure.

> [!IMPORTANT]
> Ensure that you select the correct subscription to use in Azure.

To start using AHB for SUSE:

1. Register the subscription that you purchased from SUSE or a SUSE distributor with the [SUSE Customer Center](https://scc.suse.com).
2. Activate the subscription in the SUSE Customer Center.
3. Register your Virtual Machines that are receiving AHB with the SUSE Customer Center to get the updates from the SUSE Customer Center.

## How to enable and disable AHB in Azure portal

In Azure portal, you can enable AHB on existing Virtual Machines or on new Virtual Machines at the time that you create them.

### How to enable AHB on an existing Virtual Machine in Azure portal

To enable AHB on an existing Virtual Machine:

1. Got to [Azure portal](https://portal.azure.com/).
1. Open the Virtual Machine page on which you want to apply the conversion.
1. Go the **Configuration** option on the left. You will see the Licensing section. To enable the AHB conversion, check the 'Yes' radio button and check the Confirmation checkbox.
![AHB Configuration blade after creating](./media/azure-hybrid-benefit/create-configuration-blade.png)

### How to enable AHB when you create a Virtual Machine in Azure portal

To enable AHB when you create a Virtual Machine (the SUSE workflow is the same as the RHEL example shown here):

1. Go to [Azure portal](https://portal.azure.com/).
1. Go to 'Create a Virtual Machine' page in the portal.
 ![AHB while creating a Virtual Machine](./media/azure-hybrid-benefit/create-vm-ahb.png)
1. Click on the checkbox to enable AHB conversion and use cloud access licenses.
 ![AHB while creating a Virtual Machine Checkbox](./media/azure-hybrid-benefit/create-vm-ahb-checkbox.png)
1. Create a Virtual Machine following the next set of instructions.
1. Check the **Configuration** blade and you will see the option enabled. 
![AHB Configuration blade after creating](./media/azure-hybrid-benefit/create-configuration-blade.png)

## How to enable and disable AHB using Azure CLI

You can use the `az vm update` command to update existing Virtual Machines. For RHEL Virtual Machines, run the command with a `--license-type` parameter of `RHEL_BYOS`. For SLES Virtual Machines, run the command with a `--license-type` parameter of `SLES_BYOS`.

### How to enable AHB using a CLI
```azurecli
# This will enable AHB on a RHEL Virtual Machine
az vm update -g myResourceGroup -n myVmName --license-type RHEL_BYOS

# This will enable AHB on a SLES Virtual Machine
az vm update -g myResourceGroup -n myVmName --license-type SLES_BYOS
```
### How to disable AHB using a CLI
To disable AHB, use a `--license-type` value of `None`:

```azurecli
# This will disable AHB on a Virtual Machine
az vm update -g myResourceGroup -n myVmName --license-type None
```

### How to enable AHB on a large number of Virtual Machines using a CLI
To enable AHB on a large number of Virtual Machines, you can use the `--ids` parameter in the Azure CLI:

```azurecli
# This will enable AHB on a RHEL Virtual Machine. In this example, ids.txt is an
# existing text file that contains a delimited list of resource IDs corresponding
# to the Virtual Machines using AHB
az vm update -g myResourceGroup -n myVmName --license-type RHEL_BYOS --ids $(cat ids.txt)
```

The following examples show two methods of getting a list of resource IDs: one at the resource group level, and one at the subscription level.

```azurecli
# To get a list of all the resource IDs in a resource group:
$(az vm list -g MyResourceGroup --query "[].id" -o tsv)

# To get a list of all the resource IDs of Virtual Machines in a subscription:
az vm list -o json | jq '.[] | {Virtual MachineName: .name, ResourceID: .id}'
```

## How to apply AHB to PAYG Virtual Machines at creation time
In addition to applying the AHB for PAYG Virtual Machines to existing pay-as-you-go Virtual Machines, you can invoke it at the time of Virtual Machine creation. AHBs of doing so are threefold:
- You can provision both PAYG and BYOS Virtual Machines by using the same image and process.
- It enables future licensing mode changes, something not available with a BYOS-only image or if you bring your own Virtual Machine.
- The Virtual Machine will be connected to Red Hat Update Infrastructure (RHUI) by default, to ensure that it remains up to date and secure. You can change the updated mechanism after deployment at any time.

## How to check the AHB status of a Virtual Machine
You can view the AHB for PAYG Virtual Machines status of a Virtual Machine by using the Azure CLI or by using Azure Instance Metadata Service.

### A status check using Azure CLI

You can use the `az vm get-instance-view` command for this purpose. Look for a `licenseType` field in the response. If the `licenseType` field exists and the value is `RHEL_BYOS` or `SLES_BYOS`, your Virtual Machine has AHB enabled.

```azurecli
az vm get-instance-view -g MyResourceGroup -n MyVm
```

### A status check using Azure Instance Metadata Service

From within the Virtual Machine itself, you can query the attested metadata in Azure Instance Metadata Service to determine the Virtual Machine's `licenseType` value. A `licenseType` value of `RHEL_BYOS` or `SLES_BYOS` will indicate that your Virtual Machine has AHB enabled. [Learn more about attested metadata](./instance-metadata-service.md#attested-data).

## Compliance

### Red Hat compliance

Customers who use AHB for PAYG RHEL Virtual Machines agree to the standard [legal terms](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Cloud_Software_Subscription_Agreement_for_Microsoft_Azure.pdf) and [privacy statement](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Privacy_Statement_for_Microsoft_Azure.pdf) associated with the Azure Marketplace RHEL offers.

Customers who use AHB for PAYG RHEL Virtual Machines have three options for providing software updates and patches to those Virtual Machines:

- [Red Hat Update Infrastructure](../workloads/redhat/redhat-rhui.md) (default option)
- Red Hat Satellite Server
- Red Hat Subscription Manager

Customers who choose the RHUI option can continue to use RHUI as the main update source for their AHB for PAYG RHEL Virtual Machines without attaching RHEL subscriptions to those Virtual Machines. Customers who choose the RHUI option are responsible for ensuring RHEL subscription compliance.

Customers who choose either Red Hat Satellite Server or Red Hat Subscription Manager should remove the RHUI configuration and then attach a Cloud Access enabled RHEL subscription to their AHB for PAYG RHEL Virtual Machines.  

For more information about Red Hat subscription compliance, software updates, and sources for AHB for PAYG RHEL Virtual Machines, see the [Red Hat article about using RHEL subscriptions with AHB](https://access.redhat.com/articles/5419341).

### SUSE compliance

To use AHB for PAYG SLES Virtual Machines, and for information about moving from SLES PAYG to BYOS or moving from SLES BYOS to PAYG, see [SUSE Linux Enterprise and AHB](https://aka.ms/suse-ahb).

Customers who use AHB for PAYG SLES Virtual Machines need to move the Cloud Update Infrastructure to one of three options that provide software updates and patches to those Virtual Machines:
- [SUSE Customer Center](https://scc.suse.com)
- SUSE Manager
- SUSE Repository Mirroring Tool (RMT)


## AHB for PAYG Virtual Machines on Reserved Instances

Azure Reservations (Azure Reserved Virtual Machine Instances) help you save money by committing to one-year or three-year plans for multiple products. You can learn more about [Reserved instances here](../../cost-management-billing/reservations/save-compute-costs-reservations.md). The AHB for PAYG Virtual Machines is available for [Reserved Virtual Machine Instance(RIs)](../../cost-management-billing/reservations/save-compute-costs-reservations.md#charges-covered-by-reservation).

This means that if you have purchased compute costs at a discounted rate using RI, you can apply AHB benefit on the licensing costs for RHEL and SUSE on top of it. The steps to apply AHB benefit for an RI instance remains exactly same as it is for a regular Virtual Machine.
![AHB for RIs](./media/azure-hybrid-benefit/reserved-instances.png)

>[!NOTE]
>If you have already purchased reservations for RHEL or SUSE PAYG software on Azure Marketplace, please wait for the reservation tenure to complete before using the AHB for PAYG Virtual Machines.


## Frequently asked questions
*Q: Can I use a license type of `RHEL_BYOS` with a SLES image, or vice versa?*

A: No, you can't. Trying to enter a license type that incorrectly matches the distribution running on your Virtual Machine will not update any billing metadata. But if you accidentally enter the wrong license type, updating your Virtual Machine again to the correct license type will still enable AHB.

*Q: I've registered with Red Hat Cloud Access but still can't enable AHB on my RHEL Virtual Machines. What should I do?*

A: It might take some time for your Red Hat Cloud Access subscription registration to propagate from Red Hat to Azure. If you still see the error after one business day, contact Microsoft support.

*Q: I've deployed a Virtual Machine by using RHEL BYOS "golden image." Can I convert the billing on these images from BYOS to PAYG?*

A: Yes, you can use the AHB for BYOS Virtual Machines capability to do this. You can [learn more about this capability here.](./azure-hybrid-benefit-byos-linux.md)

*Q: I've uploaded my own RHEL or SLES image from on-premises (via Azure Migrate, Azure Site Recovery, or otherwise) to Azure. Can I convert the billing on these images from BYOS to PAYG?*

A: Yes, you can use the AHB for BYOS Virtual Machines capability to do this. You can [learn more about this capability here.](./azure-hybrid-benefit-byos-linux.md)

*Q: I've uploaded my own RHEL or SLES image from on-premises (via Azure Migrate, Azure Site Recovery, or otherwise) to Azure. Do I need to do anything to benefit from AHB?*

A: No, you don't. RHEL or SLES images that you upload are already considered BYOS, and you're charged only for Azure infrastructure costs. You're responsible for RHEL subscription costs, just as you are for your on-premises environments. 

*Q: Can I use AHB for PAYG Virtual Machines for Azure Marketplace RHEL and SLES SAP images?*

A: Yes, you can. You can use the license type of `RHEL_BYOS` for RHEL Virtual Machines and `SLES_BYOS` for conversions of Virtual Machines deployed from Azure Marketplace RHEL and SLES SAP images.

*Q: Can I use AHB for PAYG Virtual Machines on virtual machine scale sets for RHEL and SLES?*

A: Yes, AHB on virtual machine scale sets for RHEL and SLES is available to all users. You can [learn more about this benefit and how to use it here](../../virtual-machine-scale-sets/azure-hybrid-benefit-linux.md).

*Q: Can I use AHB for PAYG Virtual Machines on reserved instances for RHEL and SLES?*

A: Yes, AHB for PAYG Virtual Machines on reserved instance for RHEL and SLES is available to all users.

*Q: Can I use AHB for PAYG Virtual Machines on a virtual machine deployed for SQL Server on RHEL images?*

A: No, you can't. There is no plan for supporting these virtual machines.

*Q: Can I use AHB on my RHEL Virtual Data Center subscription?*

A: No, you cannot. VDC is not supported on Azure at all, including AHB.  
 

## Common problems
This section lists common problems that you might encounter and steps for mitigation.

| Error | Mitigation |
| ----- | ---------- |
| "The action could not be completed because our records show that you have not successfully enabled Red Hat Cloud Access on your Azure subscription." | To use AHB with RHEL Virtual Machines, you must first [register your Azure subscriptions with Red Hat Cloud Access](https://access.redhat.com/management/cloud).

## Next steps
* [Learn how to create and update Virtual Machines and add license types (RHEL_BYOS, SLES_BYOS) for AHB by using the Azure CLI](/cli/azure/vm)
* AHB on virtual machine scale sets for RHEL and SLES is available to all users. You can [learn more about this benefit and how to use it here](../../virtual-machine-scale-sets/azure-hybrid-benefit-linux.md).
