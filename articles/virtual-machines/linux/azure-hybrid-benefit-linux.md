---
title: Azure Hybrid Benefit for pay-as-you-go Linux virtual machines
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

Azure Hybrid Benefit for pay-as-you-go virtual machines or virtual machine scale sets (Flexible orchestration mode only) is an optional licensing benefit. It significantly reduces the cost of running Red Hat Enterprise Linux (RHEL) and SUSE Linux Enterprise Server (SLES) virtual machines in the cloud. 

This article explores how to use Azure Hybrid Benefit to switch your virtual machines or virtual machine scale sets (Flexible orchestration mode only) to RHEL bring-your-own-subscription (BYOS) and SLES BYOS billing. With this benefit, your RHEL or SLES subscription covers your software fee. So you pay only infrastructure costs for your virtual machine. 

>[!IMPORTANT]
>To do the reverse and switch from BYOS to pay-as-you-go billing, see [Explore Azure Hybrid Benefit for bring-your-own-subscription Linux virtual machines](./azure-hybrid-benefit-byos-linux.md).

## How does Azure Hybrid Benefit work?

Virtual machines deployed from pay-as-you-go images on Azure incur both an infrastructure fee and a software fee. You can convert existing RHEL and SLES pay-as-you-go virtual machines to BYOS billing by using Azure Hybrid Benefit without having to redeploy. 

:::image type="content" source="./media/ahb-linux/azure-hybrid-benefit-cost.png" alt-text="Diagram that shows the use of Azure Hybrid Benefit to switch Linux virtual machines from pay-as-you-go to bring-your-own-server.":::

After you apply Azure Hybrid Benefit to your RHEL or SLES virtual machine, you're no longer charged a software fee. Your virtual machine is charged a BYOS fee instead. You can use Azure Hybrid Benefit to switch back to pay-as-you-go billing at any time.

## Which Linux virtual machines qualify for Azure Hybrid Benefit?

Azure Hybrid Benefit for pay-as-you-go virtual machines is available for all RHEL and SLES pay-as-you-go images in Azure Marketplace.

Azure dedicated host instances and SQL hybrid benefits are not eligible for Azure Hybrid Benefit if you already use Azure Hybrid Benefit with Linux virtual machines.

## Get started

### Apply Azure Hybrid Benefit to Red Hat

Azure Hybrid Benefit for pay-as-you-go virtual machines for RHEL is available to Red Hat customers who meet the following criteria:

- Have active or unused RHEL subscriptions that are eligible for use in Azure
- Have correctly enabled one or more of their subscriptions for use in Azure with the [Red Hat Cloud Access](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) program

To start using Azure Hybrid Benefit for Red Hat:

1. Enable one or more of your eligible RHEL subscriptions for use in Azure by using the [Red Hat Cloud Access customer interface](https://access.redhat.com/management/cloud).

   The Azure subscriptions that you provide during the Red Hat Cloud Access enablement process will then be permitted to use Azure Hybrid Benefit.
1. Apply Azure Hybrid Benefit to any RHEL pay-as-you-go virtual machines that you deploy in Azure Marketplace pay-as-you-go images. You can use the Azure portal or the Azure CLI to enable Azure Hybrid Benefit.
1. Follow the recommended [next steps](https://access.redhat.com/articles/5419341) to configure update sources for your RHEL virtual machines and for RHEL subscription compliance guidelines.


### Apply Azure Hybrid Benefit to SUSE

Azure Hybrid Benefit for pay-as-you-go virtual machines for SUSE is available to customers who have:

- Unused SUSE subscriptions that are eligible to use in Azure.
- One or more active SUSE subscriptions to use on-premises that should be moved to Azure.
- Purchased subscriptions that they activated in the SUSE Customer Center to use in Azure.

> [!IMPORTANT]
> Ensure that you select the correct subscription to use in Azure.

To start using Azure Hybrid Benefit for SUSE:

1. Register the subscription that you purchased from SUSE or a SUSE distributor with the [SUSE Customer Center](https://scc.suse.com).
2. Activate the subscription in the SUSE Customer Center.
3. Register your virtual machines that are receiving Azure Hybrid Benefit with the SUSE Customer Center to get the updates from the SUSE Customer Center.

## Enable Azure Hybrid Benefit in the Azure portal

In the Azure portal, you can enable Azure Hybrid Benefit on existing virtual machines or on new virtual machines at the time that you create them.

### Enable Azure Hybrid Benefit on an existing virtual machine in the Azure portal

To enable Azure Hybrid Benefit on an existing virtual machine:

1. Go to the [Azure portal](https://portal.azure.com/).
1. Open the virtual machine page on which you want to apply the conversion.
1. Go to **Configuration** > **Licensing**. To enable the Azure Hybrid Benefit conversion, select **Yes**, and then select the confirmation checkbox.

![Screenshot of the Azure portal that shows the Licensing section of the configuration page for Azure Hybrid Benefit.](./media/azure-hybrid-benefit/create-configuration-blade.png)

### Enable Azure Hybrid Benefit when you create a virtual machine in the Azure portal

To enable Azure Hybrid Benefit when you create a virtual machine, use the following procedure. (The SUSE workflow is the same as the RHEL example shown here.)

1. Go to the [Azure portal](https://portal.azure.com/).
1. Go to **Create a virtual machine**.
 
   ![Screenshot of the portal page for creating a virtual machine.](./media/azure-hybrid-benefit/create-vm-ahb.png)
1. In the **Licensing** section, select the checkbox that asks if you want to use an existing RHEL subscription and the checkbox to confirm that your subscription is eligible.
 
   ![Screenshot of the Azure portal that shows checkboxes selected for licensing.](./media/azure-hybrid-benefit/create-vm-ahb-checkbox.png)
1. Create a virtual machine by following the next set of instructions.
1. On the **Configuration** pane, confirm that the option is enabled. 

   ![Screenshot of the Azure Hybrid Benefit configuration pane after you create a virtual machine.](./media/azure-hybrid-benefit/create-configuration-blade.png)

## Enable and disable Azure Hybrid Benefit by using the Azure CLI

You can use the `az vm update` command to update existing virtual machines. For RHEL virtual machines, run the command with a `--license-type` parameter of `RHEL_BYOS`. For SLES virtual machines, run the command with a `--license-type` parameter of `SLES_BYOS`.

### Enable Azure Hybrid Benefit by using the Azure CLI
```azurecli
# This will enable Azure Hybrid Benefit on a RHEL virtual machine
az vm update -g myResourceGroup -n myVmName --license-type RHEL_BYOS

# This will enable Azure Hybrid Benefit on a SLES virtual machine
az vm update -g myResourceGroup -n myVmName --license-type SLES_BYOS
```
### Disable Azure Hybrid Benefit by using the Azure CLI
To disable Azure Hybrid Benefit, use a `--license-type` value of `None`:

```azurecli
# This will disable Azure Hybrid Benefit on a virtual machine
az vm update -g myResourceGroup -n myVmName --license-type None
```

### Enable Azure Hybrid Benefit on a large number of virtual machines by using the Azure CLI
To enable Azure Hybrid Benefit on a large number of virtual machines, you can use the `--ids` parameter in the Azure CLI:

```azurecli
# This will enable Azure Hybrid Benefit on a RHEL virtual machine. In this example, ids.txt is an
# existing text file that contains a delimited list of resource IDs corresponding
# to the virtual machines using Azure Hybrid Benefit
az vm update -g myResourceGroup -n myVmName --license-type RHEL_BYOS --ids $(cat ids.txt)
```

The following examples show two methods of getting a list of resource IDs: one at the resource group level, and one at the subscription level.

```azurecli
# To get a list of all the resource IDs in a resource group:
$(az vm list -g MyResourceGroup --query "[].id" -o tsv)

# To get a list of all the resource IDs of virtual machines in a subscription:
az vm list -o json | jq '.[] | {Virtual MachineName: .name, ResourceID: .id}'
```

## Apply Azure Hybrid Benefit to pay-as-you-go virtual machines at creation time
In addition to applying Azure Hybrid Benefit to existing pay-as-you-go virtual machines, you can invoke it at the time of virtual machine creation. Benefits of doing so are threefold:
- You can provision both pay-as-you-go and BYOS virtual machines by using the same image and process.
- It enables future licensing mode changes. These changes aren't available with a BYOS-only image or if you bring your own virtual machine.
- The virtual machine will be connected to Red Hat Update Infrastructure (RHUI) by default, to help keep it up to date and secure. You can change the updated mechanism after deployment at any time.

## Check the Azure Hybrid Benefit status of a virtual machine
You can view the Azure Hybrid Benefit status of a virtual machine by using the Azure CLI or by using Azure Instance Metadata Service.

### Check status by using the Azure CLI

You can use the `az vm get-instance-view` command to check the status. Look for a `licenseType` field in the response. If the `licenseType` field exists and the value is `RHEL_BYOS` or `SLES_BYOS`, your virtual machine has Azure Hybrid Benefit enabled.

```azurecli
az vm get-instance-view -g MyResourceGroup -n MyVm
```

### Check status by using Azure Instance Metadata Service

From within the virtual machine itself, you can query the attested metadata in Azure Instance Metadata Service to determine the virtual machine's `licenseType` value. A `licenseType` value of `RHEL_BYOS` or `SLES_BYOS` indicates that your virtual machine has Azure Hybrid Benefit enabled. [Learn more about attested metadata](./instance-metadata-service.md#attested-data).

## Compliance

### Red Hat compliance

Customers who use Azure Hybrid Benefit for pay-as-you-go RHEL virtual machines agree to the standard [legal terms](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Cloud_Software_Subscription_Agreement_for_Microsoft_Azure.pdf) and [privacy statement](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Privacy_Statement_for_Microsoft_Azure.pdf) associated with the Azure Marketplace RHEL offers.

Customers who use Azure Hybrid Benefit for pay-as-you-go RHEL virtual machines have three options for providing software updates and patches to those virtual machines:

- [Red Hat Update Infrastructure](../workloads/redhat/redhat-rhui.md) (default option)
- Red Hat Satellite Server
- Red Hat Subscription Manager

Customers who choose the RHUI option can continue to use RHUI as the main update source for Azure Hybrid Benefit for pay-as-you-go RHEL virtual machines without attaching RHEL subscriptions to those virtual machines. Customers who choose the RHUI option are responsible for ensuring RHEL subscription compliance.

Customers who choose either Red Hat Satellite Server or Red Hat Subscription Manager should remove the RHUI configuration and then attach a cloud-access-enabled RHEL subscription to Azure Hybrid Benefit for pay-as-you-go RHEL virtual machines.  

For more information about Red Hat subscription compliance, software updates, and sources for Azure Hybrid Benefit for pay-as-you-go RHEL virtual machines, see the [Red Hat article about using RHEL subscriptions with Azure Hybrid Benefit](https://access.redhat.com/articles/5419341).

### SUSE compliance

To use Azure Hybrid Benefit for pay-as-you-go SLES virtual machines, and to get information about moving from SLES pay-as-you-go to BYOS or moving from SLES BYOS to pay-as-you-go, see [SUSE Linux Enterprise and Azure Hybrid Benefit](https://aka.ms/suse-ahb).

Customers who use Azure Hybrid Benefit for pay-as-you-go SLES virtual machines need to move the cloud update infrastructure to one of three options that provide software updates and patches to those virtual machines:
- [SUSE Customer Center](https://scc.suse.com)
- SUSE Manager
- SUSE Repository Mirroring Tool

## Apply Azure Hybrid Benefit for pay-as-you-go virtual machines on reserved instances

[Azure reservations](../../cost-management-billing/reservations/save-compute-costs-reservations.md) (Azure Reserved Virtual Machine Instances) help you save money by committing to one-year or three-year plans for multiple products. Azure Hybrid Benefit for pay-as-you-go virtual machines is available for reserved instances.

This means that if you've purchased compute costs at a discounted rate by using reserved instances, you can apply Azure Hybrid Benefit on the licensing costs for RHEL and SUSE on top of it. The steps to apply Azure Hybrid Benefit for a reserved instance remain exactly same as they are for a regular virtual machine.

![Screenshot of the interface for purchasing reservations for virtual machines.](./media/azure-hybrid-benefit/reserved-instances.png)

>[!NOTE]
>If you've already purchased reservations for RHEL or SUSE pay-as-you-go software on Azure Marketplace, please wait for the reservation tenure to finish before using Azure Hybrid Benefit for pay-as-you-go virtual machines.

## Frequently asked questions
*Q: Can I use a license type of `RHEL_BYOS` with a SLES image, or vice versa?*

A: No, you can't. Trying to enter a license type that incorrectly matches the distribution running on your virtual machine will not update any billing metadata. But if you accidentally enter the wrong license type, updating your virtual machine again to the correct license type will still enable Azure Hybrid Benefit.

*Q: I've registered with Red Hat Cloud Access but still can't enable Azure Hybrid Benefit on my RHEL virtual machines. What should I do?*

A: It might take some time for your Red Hat Cloud Access subscription registration to propagate from Red Hat to Azure. If you still see the error after one business day, contact Microsoft support.

*Q: I've deployed a virtual machine by using a RHEL BYOS "golden image." Can I convert the billing on this image from BYOS to pay-as-you-go?*

A: Yes, you can use Azure Hybrid Benefit for BYOS virtual machines to do this. [Learn more about this capability](./azure-hybrid-benefit-byos-linux.md).

*Q: I've uploaded my own RHEL or SLES image from on-premises (via Azure Migrate, Azure Site Recovery, or otherwise) to Azure. Can I convert the billing on these images from BYOS to pay-as-you-go?*

A: Yes, you can use Azure Hybrid Benefit for BYOS virtual machines to do this. [Learn more about this capability](./azure-hybrid-benefit-byos-linux.md).

*Q: I've uploaded my own RHEL or SLES image from on-premises (via Azure Migrate, Azure Site Recovery, or otherwise) to Azure. Do I need to do anything to benefit from Azure Hybrid Benefit?*

A: No, you don't. RHEL or SLES images that you upload are already considered BYOS, and you're charged only for Azure infrastructure costs. You're responsible for RHEL subscription costs, just as you are for your on-premises environments. 

*Q: Can I use Azure Hybrid Benefit for pay-as-you-go virtual machines for Azure Marketplace RHEL and SLES SAP images?*

A: Yes. You can use the license type of `RHEL_BYOS` for RHEL virtual machines and `SLES_BYOS` for conversions of virtual machines deployed from Azure Marketplace RHEL and SLES SAP images.

*Q: Can I use Azure Hybrid Benefit for pay-as-you-go virtual machines on virtual machine scale sets for RHEL and SLES?*

A: Yes. Azure Hybrid Benefit on virtual machine scale sets for RHEL and SLES is available to all users. [Learn more about this benefit and how to use it](../../virtual-machine-scale-sets/azure-hybrid-benefit-linux.md).

*Q: Can I use Azure Hybrid Benefit for pay-as-you-go virtual machines on reserved instances for RHEL and SLES?*

A: Yes. Azure Hybrid Benefit for pay-as-you-go virtual machines on reserved instances for RHEL and SLES is available to all users.

*Q: Can I use Azure Hybrid Benefit for pay-as-you-go virtual machines on a virtual machine deployed for SQL Server on RHEL images?*

A: No, you can't. There's no plan for supporting these virtual machines.

*Q: Can I use Azure Hybrid Benefit on my RHEL for Virtual Datacenters subscription?*

A: No. RHEL for Virtual Datacenters isn't supported on Azure at all, including Azure Hybrid Benefit.  
 

## Common problems
This section lists common problems that you might encounter and steps for mitigation.

| Error | Mitigation |
| ----- | ---------- |
| "The action could not be completed because our records show that you have not successfully enabled Red Hat Cloud Access on your Azure subscription." | To use Azure Hybrid Benefit with RHEL virtual machines, you must first [register your Azure subscriptions with Red Hat Cloud Access](https://access.redhat.com/management/cloud).

## Next steps
* [Learn how to create and update virtual machines and add license types (RHEL_BYOS, SLES_BYOS) for Azure Hybrid Benefit by using the Azure CLI](/cli/azure/vm)
* [Learn about Azure Hybrid Benefit on virtual machine scale sets for RHEL and SLES and how to use it](../../virtual-machine-scale-sets/azure-hybrid-benefit-linux.md)
