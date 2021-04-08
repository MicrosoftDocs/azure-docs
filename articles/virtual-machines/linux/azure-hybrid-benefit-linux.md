---
title: Azure Hybrid Benefit and Linux VMs
description: Learn how Azure Hybrid Benefit can help you save money on your Linux virtual machines running on Azure.
services: virtual-machines
documentationcenter: ''
author: mathapli
manager: rochakm
ms.service: virtual-machines
ms.subservice: azure-hybrid-benefit
ms.collection: linux
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 09/22/2020
ms.author: mathapli
---

# How Azure Hybrid Benefit applies for Linux virtual machines

Azure Hybrid Benefit is a licensing benefit that helps you to significantly reduce the costs of running your Red Hat Enterprise Linux (RHEL) and SUSE Linux Enterprise Server (SLES) virtual machines (VMs) in the cloud. With this benefit, you pay for only the infrastructure costs of your VM because your RHEL or SLES subscription covers the software fee. The benefit is available for all RHEL and SLES Marketplace pay-as-you-go (PAYG) images.

Azure Hybrid Benefit for Linux VMs is now publicly available.

## Benefit description

Through Azure Hybrid Benefit, you can migrate your on-premises RHEL and SLES servers to Azure by converting existing RHEL and SLES PAYG VMs on Azure to bring-your-own-subscription (BYOS) billing. Typically, VMs deployed from PAYG images on Azure will charge both an infrastructure fee and a software fee. With Azure Hybrid Benefit, PAYG VMs can be converted to a BYOS billing model without a redeployment, so you can avoid any downtime risk.

:::image type="content" source="./media/ahb-linux/azure-hybrid-benefit-cost.png" alt-text="Azure Hybrid Benefit cost visualization on Linux VMs.":::

After you enable the benefit on RHEL or SLES VM, you'll no longer be charged for the additional software fee typically incurred on a PAYG VM. Instead, your VM will begin accruing a BYOS charge, which includes only the compute hardware fee and no software fee.

You can also choose to convert a VM that has had the benefit enabled on it back to a PAYG billing model.

## Scope of Azure Hybrid Benefit eligibility for Linux VMs

Azure Hybrid Benefit is available for all RHEL and SLES PAYG images from Azure Marketplace. The benefit is not yet available for RHEL or SLES BYOS images or custom images from Azure Marketplace.

Azure Dedicated Host instances, and SQL hybrid benefits are not eligible for Azure Hybrid Benefit if you're already using the benefit with Linux VMs.

## Get started

### Red Hat customers

Azure Hybrid Benefit for RHEL is available to Red Hat customers who meet both of these criteria:

- Have active or unused RHEL subscriptions that are eligible for use in Azure
- Have enabled one or more of those subscriptions for use in Azure with the [Red Hat Cloud Access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program

> [!IMPORTANT]
> Ensure the correct subscription has been enabled on the [cloud-access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program.

To start using the benefit for Red Hat:

1. Enable one or more of your eligible RHEL subscriptions for use in Azure by using the [Red Hat Cloud Access customer interface](https://access.redhat.com/management/cloud).

   The Azure subscriptions that you provide during the Red Hat Cloud Access enablement process will then be permitted to use the Azure Hybrid Benefit feature.
1. Apply Azure Hybrid Benefit to any of your existing RHEL PAYG VMs and any new RHEL VMs that you deploy from Azure Marketplace PAYG images. You can use Azure portal or Azure CLI for enabling the benefit.
1. Follow recommended [next steps](https://access.redhat.com/articles/5419341) for configuring update sources for your RHEL VMs and for RHEL subscription compliance guidelines.


### SUSE customers

To start using the benefit for SUSE:

1. Register with the SUSE Public Cloud Program.
1. Apply the benefit to your newly created or existing VMs via the Azure portal or Azure CLI.
1. Register your VMs that are receiving the benefit with a separate source of updates.

## Enable and disable the benefit in the Azure portal

You may enable the benefit on existing VMs by visiting the **Configuration** option on the left and following the steps there. You may enable the benefit on new VMs during the VM create experience.

### Azure portal example to enable the benefit for an existing VM:
1. Visit [Microsoft Azure portal](https://portal.azure.com/)
1. Go to 'Create a Virtual Machine' page on the portal.
 ![AHB while creating VM](./media/azure-hybrid-benefit/create-vm-ahb.png)
1. Click on the checkbox to enable AHB conversion and use cloud access licenses.
 ![AHB while creating VM Checkbox](./media/azure-hybrid-benefit/create-vm-ahb-checkbox.png)
1. Create a Virtual Machine following the next set of instructions
1. Check the **Configuration** blade and you will see the option enabled. 
![AHB Configuration blade after creating](./media/azure-hybrid-benefit/create-configuration-blade.png)

### Azure portal example to enable the benefit during creation of VM:
1. Visit [Microsoft Azure portal](https://portal.azure.com/)
1. Open the Virtual Machine page on which you want to apply the conversion.
1. Go the **Configuration** option on the left. You will see the Licensing section. To enable the AHB conversion, check the 'Yes' radio button and check the Confirmation checkbox.
![AHB Configuration blade after creating](./media/azure-hybrid-benefit/create-configuration-blade.png)

>[!NOTE]
> If you have created a **Custom Snapshot** or a **Shared Image (SIG)** of a RHEL or SLES PAYG Marketplace image, you can only use Azure CLI to enable Azure Hybrid Benefit. This is known limitation and currently there is no timeline to provide this capability on the Azure Portal as well.

## Enable and disable the benefit in the Azure CLI

You can use the `az vm update` command to update existing VMs. For RHEL VMs, run the command with a `--license-type` parameter of `RHEL_BYOS`. For SLES VMs, run the command with a `--license-type` parameter of `SLES_BYOS`.

### CLI example to enable the benefit
```azurecli
# This will enable the benefit on a RHEL VM
az vm update -g myResourceGroup -n myVmName --license-type RHEL_BYOS

# This will enable the benefit on a SLES VM
az vm update -g myResourceGroup -n myVmName --license-type SLES_BYOS
```
### CLI example to disable the benefit
To disable the benefit, use a `--license-type` value of `None`:

```azurecli
# This will disable the benefit on a VM
az vm update -g myResourceGroup -n myVmName --license-type None
```

### CLI example to enable the benefit on a large number of VMs
To enable the benefit on a large number of VMs, you can use the `--ids` parameter in the Azure CLI:

```azurecli
# This will enable the benefit on a RHEL VM. In this example, ids.txt is an
# existing text file that contains a delimited list of resource IDs corresponding
# to the VMs using the benefit
az vm update -g myResourceGroup -n myVmName --license-type RHEL_BYOS --ids $(cat ids.txt)
```

The following examples show two methods of getting a list of resource IDs: one at the resource group level, and one at the subscription level.

```azurecli
# To get a list of all the resource IDs in a resource group:
$(az vm list -g MyResourceGroup --query "[].id" -o tsv)

# To get a list of all the resource IDs of VMs in a subscription:
az vm list -o json | jq '.[] | {VMName: .name, ResourceID: .id}'
```

## Apply the Azure Hybrid Benefit at VM create time
In addition to applying the Azure Hybrid Benefit to existing pay-as-you-go VMs, you can invoke it at the time of VM creation. The benefits of doing so are threefold:
- You can provision both PAYG and BYOS VMs by using the same image and process.
- It enables future licensing mode changes, something not available with a BYOS-only image or if you bring your own VM.
- The VM will be connected to Red Hat Update Infrastructure (RHUI) by default, to ensure that it remains up to date and secure. You can change the updated mechanism after deployment at any time.

## Check the Azure Hybrid Benefit status of a VM
You can view the Azure Hybrid Benefit status of a VM by using the Azure CLI or by using Azure Instance Metadata Service.

### Azure CLI

You can use the `az vm get-instance-view` command for this purpose. Look for a `licenseType` field in the response. If the `licenseType` field exists and the value is `RHEL_BYOS` or `SLES_BYOS`, your VM has the benefit enabled.

```azurecli
az vm get-instance-view -g MyResourceGroup -n MyVm
```

### Azure Instance Metadata Service

From within the VM itself, you can query the attested metadata in Azure Instance Metadata Service to determine the VM's `licenseType` value. A `licenseType` value of `RHEL_BYOS` or `SLES_BYOS` will indicate that your VM has the benefit enabled. [Learn more about attested metadata](./instance-metadata-service.md#attested-data).

## Compliance

### Red Hat

Customers who use Azure Hybrid Benefit for RHEL agree to the standard [legal terms](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Cloud_Software_Subscription_Agreement_for_Microsoft_Azure.pdf) and [privacy statement](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Privacy_Statement_for_Microsoft_Azure.pdf) associated with the Azure Marketplace RHEL offerings.

Customers who use Azure Hybrid Benefit for RHEL have three options for providing software updates and patches to those VMs:

- [Red Hat Update Infrastructure](../workloads/redhat/redhat-rhui.md) (default option)
- Red Hat Satellite Server
- Red Hat Subscription Manager

Customers who choose the RHUI option can continue to use RHUI as the main update source for their Azure Hybrid Benefit RHEL VMs without attaching RHEL subscriptions to those VMs. Customers who choose the RHUI option are responsible for ensuring RHEL subscription compliance.

Customers who choose either Red Hat Satellite Server or Red Hat Subscription Manager should remove the RHUI configuration and then attach a Cloud Access enabled RHEL subscription to their Azure Hybrid Benefit RHEL VMs.  

For more information about Red Hat subscription compliance, software updates, and sources for Azure Hybrid Benefit RHEL VMs, see the [Red Hat article about using RHEL subscriptions with Azure Hybrid Benefit](https://access.redhat.com/articles/5419341).

### SUSE

To use Azure Hybrid Benefit for your SLES VMs, and for information about moving from SLES PAYG to BYOS or moving from SLES BYOS to PAYG, see [SUSE Linux Enterprise and Azure Hybrid Benefit](https://www.suse.com/c/suse-linux-enterprise-and-azure-hybrid-benefit/). 

## Azure Hybrid Benefit on Reserved Instances is in Preview

Azure Reservations (Azure Reserved Virtual Machine Instances) help you save money by committing to one-year or three-year plans for multiple products. You can learn more about [Reserved instances here](https://docs.microsoft.com/azure/cost-management-billing/reservations/save-compute-costs-reservations). The Azure Hybrid Benefit is available in Preview for [Reserved Virtual Machine Instance(RIs)](https://review.docs.microsoft.com/azure/cost-management-billing/reservations/save-compute-costs-reservations#charges-covered-by-reservation). 
This means that if you have purchased compute costs at a discounted rate using RI, you can apply AHB benefit on the licensing costs for RHEL and SUSE on top of it. The steps to apply AHB benefit for an RI instance remains exactly same as it is for a regular VM.
![AHB for RIs](./media/azure-hybrid-benefit/reserved-instances.png)

>[!NOTE]
>If you have already purchased reservations for RHEL or SUSE PAYG software on Azure Marketplace, please wait for the reservation tenure to complete before using the Azure Hybrid Benefit..


## Frequently asked questions
*Q: Can I use a license type of `RHEL_BYOS` with a SLES image, or vice versa?*

A: No, you can't. Trying to enter a license type that incorrectly matches the distribution running on your VM will not update any billing metadata. But if you accidentally enter the wrong license type, updating your VM again to the correct license type will still enable the benefit.

*Q: I've registered with Red Hat Cloud Access but still can't enable the benefit on my RHEL VMs. What should I do?*

A: It might take some time for your Red Hat Cloud Access subscription registration to propagate from Red Hat to Azure. If you still see the error after one business day, contact Microsoft support.

*Q: I've deployed a VM by using RHEL BYOS "golden image." Can I convert the billing on these images from BYOS to PAYG?*

A: No, you can't. Azure Hybrid Benefit supports conversion only on pay-as-you-go images.

*Q: I've uploaded my own RHEL image from on-premises (via Azure Migrate, Azure Site Recovery, or otherwise) to Azure. Can I convert the billing on these images from BYOS to PAYG?*

A: No, you can't. The Azure Hybrid Benefit capability is currently available only to RHEL and SLES images in Azure Marketplace. 

*Q: I've uploaded my own RHEL image from on-premises (via Azure Migrate, Azure Site Recovery, or otherwise) to Azure. Do I need to do anything to benefit from Azure Hybrid Benefit?*

A: No, you don't. RHEL images that you upload are already considered BYOS, and you're charged only for Azure infrastructure costs. You're responsible for RHEL subscription costs, just as you are for your on-premises environments. 

*Q: Can I use Azure Hybrid Benefit on VMs deployed from Azure Marketplace RHEL and SLES SAP images?*

A: Yes, you can. You can use the license type of `RHEL_BYOS` for RHEL VMs and `SLES_BYOS` for conversions of VMs deployed from Azure Marketplace RHEL and SLES SAP images.

*Q: Can I use Azure Hybrid Benefit on virtual machine scale sets for RHEL and SLES?*

A: Yes, Azure Hybrid Benefit on virtual machine scale sets for RHEL and SLES is in preview. You can [learn more about this benefit and how to use it here](/azure/virtual-machine-scale-sets/azure-hybrid-benefit-linux). 

*Q: Can I use Azure Hybrid Benefit on reserved instances for RHEL and SLES?*

A: Yes, Azure Hybrid Benefit on reserved instance for RHEL and SLES is in preview. You can [learn more about this benefit and how to use it here](#azure-hybrid-benefit-on-reserved-instances-is-in-preview).

*Q: Can I use Azure Hybrid Benefit on a virtual machine deployed for SQL Server on RHEL images?*

A: No, you can't. There is no plan for supporting these virtual machines.

*Q: Can I use Azure Hybrid Benefit on my RHEL Virtual Data Center subscription?*

A: No, you cannot. VDC is not supported on Azure at all, including AHB.  
 

## Common problems
This section lists common problems that you might encounter and steps for mitigation.

| Error | Mitigation |
| ----- | ---------- |
| "The action could not be completed because our records show that you have not successfully enabled Red Hat Cloud Access on your Azure subscription…." | To use the benefit with RHEL VMs, you must first [register your Azure subscriptions with Red Hat Cloud Access](https://access.redhat.com/management/cloud).

## Next steps
* [Learn how to create and update VMs and add license types (RHEL_BYOS, SLES_BYOS) for Azure Hybrid Benefit by using the Azure CLI](/cli/azure/vm)
