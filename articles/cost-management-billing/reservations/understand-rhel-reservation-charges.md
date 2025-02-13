---
title: Red Hat reservation plan discounts - Azure
description: Learn how Red Hat plan discounts are applied to Red Hat software on virtual machines.
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: linux-related-content
ms.topic: conceptual
ms.date: 12/06/2024
ms.author: banders
---
# Understand how the Red Hat Linux Enterprise software reservation plan discount is applied for Azure

> [!NOTE]
> The Red Hat Linux Enterprise software reservation plans and renewals are temporarily unavailable due to pending updates to reservation SKUs and pricing. You can disregard any renewal emails until the new plan is available. In the meantime, you can contact your Microsoft or Red Hat Sales Representative to ask about other options until the new plan is available.

When you buy a Red Hat Linux Enterprise software plan, you get a discount on the cost of running Red Hat software on Azure virtual machines. This article explains how the discount is applied to your Red Hat software costs.

After you buy a Red Hat Linux plan, the discount is automatically applied to deployed Red Hat virtual machines (VM) that match the reservation. A Red Hat Linux plan covers the cost of running the Red Hat software on an Azure VM.

To buy the right Red Hat Linux plan, you need to understand what Red Hat VMs you run and the number of vCPUs on those VMs. Use the following sections to help identify from your usage CSV file what plan to buy.

## Discount applies to different VM sizes

Like Reserved VM Instances, Red Hat plan purchases offer instance size flexibility. Instance size flexibility applies your discount even when you deploy a VM with a different vCPU count and to different VM sizes within the software plan.

The discount amount depends on the VM vCPU ratio listed at [Instance size flexibility ratio for VMs](/azure/virtual-machines/reserved-vm-instance-size-flexibility#instance-size-flexibility-ratio-for-vms). Use the ratio value to calculate how many VM instances get the Red Hat Linux plan discount.

For example, if you buy a plan for Red Hat Linux Enterprise Server for a VM with 1 to 4 vCPUs, the ratio for that reservation is 1. The discount covers the Red Hat software cost for:

- 1 deployed VMs with 1 to 4 vCPUs,
- or 0.46 or about 46% of Red Hat Enterprise Linux costs for a VM with 5 or more vCPUs.

For more information to [Review RedHat VM usage before you buy](understand-suse-reservation-charges.md#review-redhat-vm-usage-before-you-buy)

## Next steps

To learn more about reservations, see the following articles:

- [What are reservations for Azure](save-compute-costs-reservations.md)
- [Prepay for Red Hat software plans with Azure reservations](/azure/virtual-machines/linux/prepay-suse-software-charges)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](/azure/virtual-machines/prepay-reserved-vm-instances)
- [Manage reservations for Azure](manage-reserved-vm-instance.md)
- [Understand reservation usage for your pay-as-you-go subscription](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)

## Related content

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).
