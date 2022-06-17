---
title: Azure Hybrid Benefit for PAYG Linux VMs
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
>This article explores *Azure Hybrid Benefit* for *pay-as-you-go (PAYG)* *virtual machines (VMs)*. It explores how to switch your VMs to *Red Hat Enterprise Linux (RHEL)* PAYG and *SUSE Linux Enterprise Server (SLES)* PAYG billing. To do the reverse and switch to *bring-your-own-subscription (BYOS)* billing, visit [Azure Hybrid Benefit for BYOS VMs](./azure-hybrid-benefit-byos-linux.md).

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

Hybrid Benefit for pay-as-you-go (PAYG) virtual machines (VMs) is an optional licensing benefit. It significantly reduces the cost of running Red Hat Enterprise Linux (RHEL) and SUSE Linux Enterprise Server (SLES) VMs in the cloud. With this benefit, your RHEL or SLES subscription covers your software fee. So you only pay infrastructure costs for your VM. This benefit is available for all RHEL and SLES Marketplace PAYG images.

Hybrid Benefit for Linux VMs is now publicly available.

## How does Hybrid Benefit work?

You can convert existing RHEL and SLES PAYG VMs to bring-your-own-subscription (BYOS) billing using Hybrid Benefit. You can switch PAYG VMs to BYOS billing without the need to redeploy with this benefit. This avoids downtime. VMs deployed from PAYG images on Azure pay both an infrastructure fee and a software fee. When you apply Hybrid Benefit, you pay only infrastructure costs for your VM.

:::image type="content" source="./media/ahb-linux/azure-hybrid-benefit-cost.png" alt-text="Hybrid Benefit cost visualization on Linux VMs.":::

After you apply Hybrid Benefit to your RHEL or SLES VM, you are no longer charged a software fee. Your VM is charged a BYOS fee instead. You can also switch back from Hybrid Benefit to PAYG billing at any time.

## How to apply Hybrid Benefit to your PAYG VMs

**Hybrid Benefit for PAYG VMs** is available for all RHEL and SLES PAYG images in Azure Marketplace.

Azure Dedicated Host instances, and SQL hybrid benefits are not eligible for Hybrid Benefit if you already use Hybrid Benefit with Linux VMs.

## Get started

### How to apply Hybrid Benefit to Red Hat

Hybrid Benefit for PAYG VMs for RHEL is available to Red Hat customers who meet the following criteria:

- Have active or unused RHEL subscriptions that are eligible for use in Azure
- Have enabled one or more of their subscriptions for use in Azure with the [Red Hat Cloud Access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program

> [!IMPORTANT]
> Ensure the correct subscription has been enabled on the [cloud-access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program.

To start using Hybrid Benefit for Red Hat:

1. Enable one or more of your eligible RHEL subscriptions for use in Azure by using the [Red Hat Cloud Access customer interface](https://access.redhat.com/management/cloud).

   The Azure subscriptions that you provide during the Red Hat Cloud Access enablement process will then be permitted to use Hybrid Benefit.
1. Apply Hybrid Benefit for PAYG VMs to any RHEL PAYG VMs that you deploy in Azure Marketplace PAYG images. You can use Azure portal or Azure command-line interface (CLI) to enable Hybrid Benefit.
1. Follow the recommended [next steps](https://access.redhat.com/articles/5419341) for configuring update sources for your RHEL VMs and for RHEL subscription compliance guidelines.


### How to apply Hybrid Benefit to SUSE

Hybrid Benefit for PAYG VMs for SUSE is available to customers who have:

- Unused SUSE subscriptions that are eligible to use in Azure.
- One or more active SUSE subscriptions to use on-premises that should be moved to Azure.
- Purchased subscriptions that they activated in the SUSE Customer Center to use in Azure.

> [!IMPORTANT]
> Ensure that you select the correct subscription to use in Azure.

To start using Hybrid Benefit for SUSE:

1. Register the subscription that you purchased from SUSE or a SUSE distributor with the [SUSE Customer Center](https://scc.suse.com).
2. Activate the subscription in the SUSE Customer Center.
3. Register your VMs that are receiving Hybrid Benefit with the SUSE Customer Center to get the updates from the SUSE Customer Center.

## How to enable and disable Hybrid Benefit in Azure portal

In Azure portal, you can enable Hybrid Benefit on existing VMs or on new VMs at the time that you create them.

### How to enable Hybrid Benefit on an existing VM in Azure portal

To enable Hybrid Benefit on an existing VM:

1. Got to [Azure portal](https://portal.azure.com/).
1. Open the Virtual Machine page on which you want to apply the conversion.
1. Go the **Configuration** option on the left. You will see the Licensing section. To enable the AHB conversion, check the 'Yes' radio button and check the Confirmation checkbox.
![AHB Configuration blade after creating](./media/azure-hybrid-benefit/create-configuration-blade.png)

### How to enable Hybrid Benefit when you create a VM in Azure portal

To enable Hybrid Benefit when you create a VM (the SUSE workflow is the same as the RHEL example shown here):

1. Go to [Azure portal](https://portal.azure.com/).
1. Go to 'Create a Virtual Machine' page in the portal.
 ![AHB while creating a VM](./media/azure-hybrid-benefit/create-vm-ahb.png)
1. Click on the checkbox to enable AHB conversion and use cloud access licenses.
 ![AHB while creating a VM Checkbox](./media/azure-hybrid-benefit/create-vm-ahb-checkbox.png)
1. Create a Virtual Machine following the next set of instructions.
1. Check the **Configuration** blade and you will see the option enabled. 
![AHB Configuration blade after creating](./media/azure-hybrid-benefit/create-configuration-blade.png)

## How to enable and disable Hybrid Benefit using Azure CLI

You can use the `az vm update` command to update existing VMs. For RHEL VMs, run the command with a `--license-type` parameter of `RHEL_BYOS`. For SLES VMs, run the command with a `--license-type` parameter of `SLES_BYOS`.

### How to enable Hybrid Benefit using a CLI
```azurecli
# This will enable Hybrid Benefit on a RHEL VM
az vm update -g myResourceGroup -n myVmName --license-type RHEL_BYOS

# This will enable Hybrid Benefit on a SLES VM
az vm update -g myResourceGroup -n myVmName --license-type SLES_BYOS
```
### How to disable Hybrid Benefit using a CLI
To disable Hybrid Benefit, use a `--license-type` value of `None`:

```azurecli
# This will disable Hybrid Benefit on a VM
az vm update -g myResourceGroup -n myVmName --license-type None
```

### How to enable Hybrid Benefit on a large number of VMs using a CLI
To enable Hybrid Benefit on a large number of VMs, you can use the `--ids` parameter in the Azure CLI:

```azurecli
# This will enable Hybrid Benefit on a RHEL VM. In this example, ids.txt is an
# existing text file that contains a delimited list of resource IDs corresponding
# to the VMs using Hybrid Benefit
az vm update -g myResourceGroup -n myVmName --license-type RHEL_BYOS --ids $(cat ids.txt)
```

The following examples show two methods of getting a list of resource IDs: one at the resource group level, and one at the subscription level.

```azurecli
# To get a list of all the resource IDs in a resource group:
$(az vm list -g MyResourceGroup --query "[].id" -o tsv)

# To get a list of all the resource IDs of VMs in a subscription:
az vm list -o json | jq '.[] | {VMName: .name, ResourceID: .id}'
```

## How to apply Hybrid Benefit to PAYG VMs at creation time
In addition to applying the Hybrid Benefit for PAYG VMs to existing pay-as-you-go VMs, you can invoke it at the time of VM creation. Hybrid Benefits of doing so are threefold:
- You can provision both PAYG and BYOS VMs by using the same image and process.
- It enables future licensing mode changes, something not available with a BYOS-only image or if you bring your own VM.
- The VM will be connected to Red Hat Update Infrastructure (RHUI) by default, to ensure that it remains up to date and secure. You can change the updated mechanism after deployment at any time.

## How to check the Hybrid Benefit status of a VM
You can view the Hybrid Benefit for PAYG VMs status of a VM by using the Azure CLI or by using Azure Instance Metadata Service.

### A status check using Azure CLI

You can use the `az vm get-instance-view` command for this purpose. Look for a `licenseType` field in the response. If the `licenseType` field exists and the value is `RHEL_BYOS` or `SLES_BYOS`, your VM has Hybrid Benefit enabled.

```azurecli
az vm get-instance-view -g MyResourceGroup -n MyVm
```

### A status check using Azure Instance Metadata Service

From within the VM itself, you can query the attested metadata in Azure Instance Metadata Service to determine the VM's `licenseType` value. A `licenseType` value of `RHEL_BYOS` or `SLES_BYOS` will indicate that your VM has Hybrid Benefit enabled. [Learn more about attested metadata](./instance-metadata-service.md#attested-data).

## Compliance

### Red Hat compliance

Customers who use Hybrid Benefit for PAYG RHEL VMs agree to the standard [legal terms](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Cloud_Software_Subscription_Agreement_for_Microsoft_Azure.pdf) and [privacy statement](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Privacy_Statement_for_Microsoft_Azure.pdf) associated with the Azure Marketplace RHEL offers.

Customers who use Hybrid Benefit for PAYG RHEL VMs have three options for providing software updates and patches to those VMs:

- [Red Hat Update Infrastructure](../workloads/redhat/redhat-rhui.md) (default option)
- Red Hat Satellite Server
- Red Hat Subscription Manager

Customers who choose the RHUI option can continue to use RHUI as the main update source for their Hybrid Benefit for PAYG RHEL VMs without attaching RHEL subscriptions to those VMs. Customers who choose the RHUI option are responsible for ensuring RHEL subscription compliance.

Customers who choose either Red Hat Satellite Server or Red Hat Subscription Manager should remove the RHUI configuration and then attach a Cloud Access enabled RHEL subscription to their Hybrid Benefit for PAYG RHEL VMs.  

For more information about Red Hat subscription compliance, software updates, and sources for Hybrid Benefit for PAYG RHEL VMs, see the [Red Hat article about using RHEL subscriptions with Hybrid Benefit](https://access.redhat.com/articles/5419341).

### SUSE compliance

To use Hybrid Benefit for PAYG SLES VMs, and for information about moving from SLES PAYG to BYOS or moving from SLES BYOS to PAYG, see [SUSE Linux Enterprise and Hybrid Benefit](https://aka.ms/suse-ahb).

Customers who use Hybrid Benefit for PAYG SLES VMs need to move the Cloud Update Infrastructure to one of three options that provide software updates and patches to those VMs:
- [SUSE Customer Center](https://scc.suse.com)
- SUSE Manager
- SUSE Repository Mirroring Tool (RMT)


## Hybrid Benefit for PAYG VMs on Reserved Instances

Azure Reservations (Azure Reserved Virtual Machine Instances) help you save money by committing to one-year or three-year plans for multiple products. You can learn more about [Reserved instances here](../../cost-management-billing/reservations/save-compute-costs-reservations.md). The Hybrid Benefit for PAYG VMs is available for [Reserved Virtual Machine Instance(RIs)](../../cost-management-billing/reservations/save-compute-costs-reservations.md#charges-covered-by-reservation).

This means that if you have purchased compute costs at a discounted rate using RI, you can apply AHB benefit on the licensing costs for RHEL and SUSE on top of it. The steps to apply AHB benefit for an RI instance remains exactly same as it is for a regular VM.
![AHB for RIs](./media/azure-hybrid-benefit/reserved-instances.png)

>[!NOTE]
>If you have already purchased reservations for RHEL or SUSE PAYG software on Azure Marketplace, please wait for the reservation tenure to complete before using the Hybrid Benefit for PAYG VMs.


## Frequently asked questions
*Q: Can I use a license type of `RHEL_BYOS` with a SLES image, or vice versa?*

A: No, you can't. Trying to enter a license type that incorrectly matches the distribution running on your VM will not update any billing metadata. But if you accidentally enter the wrong license type, updating your VM again to the correct license type will still enable Hybrid Benefit.

*Q: I've registered with Red Hat Cloud Access but still can't enable Hybrid Benefit on my RHEL VMs. What should I do?*

A: It might take some time for your Red Hat Cloud Access subscription registration to propagate from Red Hat to Azure. If you still see the error after one business day, contact Microsoft support.

*Q: I've deployed a VM by using RHEL BYOS "golden image." Can I convert the billing on these images from BYOS to PAYG?*

A: Yes, you can use the Hybrid Benefit for BYOS VMs capability to do this. You can [learn more about this capability here.](./azure-hybrid-benefit-byos-linux.md)

*Q: I've uploaded my own RHEL or SLES image from on-premises (via Azure Migrate, Azure Site Recovery, or otherwise) to Azure. Can I convert the billing on these images from BYOS to PAYG?*

A: Yes, you can use the Hybrid Benefit for BYOS VMs capability to do this. You can [learn more about this capability here.](./azure-hybrid-benefit-byos-linux.md)

*Q: I've uploaded my own RHEL or SLES image from on-premises (via Azure Migrate, Azure Site Recovery, or otherwise) to Azure. Do I need to do anything to benefit from Hybrid Benefit?*

A: No, you don't. RHEL or SLES images that you upload are already considered BYOS, and you're charged only for Azure infrastructure costs. You're responsible for RHEL subscription costs, just as you are for your on-premises environments. 

*Q: Can I use Hybrid Benefit for PAYG VMs for Azure Marketplace RHEL and SLES SAP images?*

A: Yes, you can. You can use the license type of `RHEL_BYOS` for RHEL VMs and `SLES_BYOS` for conversions of VMs deployed from Azure Marketplace RHEL and SLES SAP images.

*Q: Can I use Hybrid Benefit for PAYG VMs on virtual machine scale sets for RHEL and SLES?*

A: Yes, Hybrid Benefit on virtual machine scale sets for RHEL and SLES is is available to all users. You can [learn more about this benefit and how to use it here](../../virtual-machine-scale-sets/azure-hybrid-benefit-linux.md). 

*Q: Can I use Hybrid Benefit for PAYG VMs on reserved instances for RHEL and SLES?*

A: Yes, Hybrid Benefit for PAYG VMs on reserved instance for RHEL and SLES is available to all users. You can [learn more about this benefit and how to use it here](#azure-hybrid-benefit-for-payg-vms-on-reserved-instances).

*Q: Can I use Hybrid Benefit for PAYG VMs on a virtual machine deployed for SQL Server on RHEL images?*

A: No, you can't. There is no plan for supporting these virtual machines.

*Q: Can I use Hybrid Benefit on my RHEL Virtual Data Center subscription?*

A: No, you cannot. VDC is not supported on Azure at all, including AHB.  
 

## Common problems
This section lists common problems that you might encounter and steps for mitigation.

| Error | Mitigation |
| ----- | ---------- |
| "The action could not be completed because our records show that you have not successfully enabled Red Hat Cloud Access on your Azure subscription…." | To use Hybrid Benefit with RHEL VMs, you must first [register your Azure subscriptions with Red Hat Cloud Access](https://access.redhat.com/management/cloud).

## Next steps
* [Learn how to create and update VMs and add license types (RHEL_BYOS, SLES_BYOS) for Hybrid Benefit by using the Azure CLI](/cli/azure/vm)
* Hybrid Benefit on virtual machine scale sets for RHEL and SLES is is available to all users. You can [learn more about this benefit and how to use it here](../../virtual-machine-scale-sets/azure-hybrid-benefit-linux.md).
