---
title: Red Hat reservation plan discounts - Azure
description: Learn how Red Hat plan discounts are applied to Red Hat software on virtual machines.
author: yashesvi
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 06/11/2020
ms.author: banders
---
# Understand how the Red Hat Linux Enterprise software reservation plan discount is applied for Azure

After you buy a Red Hat Linux plan, the discount is automatically applied to deployed Red Hat virtual machines (VMs) that match the reservation. A Red Hat Linux plan covers the cost of running the Red Hat software on an Azure VM.

To buy the right Red Hat Linux plan, you need to understand what Red Hat VMs you run and the number of vCPUs on those VMs. Use the following sections to help identify from your usage CSV file what plan to buy.

## Discount applies to different VM sizes

Like Reserved VM Instances, Red Hat plan purchases offer instance size flexibility. This means that your discount applies even when you deploy a VM with a different vCPU count. The discount applies to different VM sizes within the software plan.

The discount amount depends on the ratio listed in the following tables. The ratio compares the relative footprint for each VM size in that group. The ratio depends on the VM vCPUs. Use the ratio value to calculate how many VM instances get the Red Hat Linux plan discount.

For example, if you buy a plan for Red Hat Linux Enterprise Server for a VM with 1 to 4 vCPUs, the ratio for that reservation is 1. The discount covers the Red Hat software cost for:

- 1 deployed VMs with 1 to 4 vCPUs,
- or 0.46 or about 46% of Red Hat Enterprise Linux costs for a VM with 5 or more vCPUs.

### Red Hat Enterprise Linux

Azure portal marketplace names:
- Red Hat Enterprise Linux 6.7
- Red Hat Enterprise Linux 6.8
- Red Hat Enterprise Linux 6.9
- Red Hat Enterprise Linux 6.10
- Red Hat Enterprise Linux 7
- Red Hat Enterprise Linux 7.2
- Red Hat Enterprise Linux 7.3
- Red Hat Enterprise Linux 7.4
- Red Hat Enterprise Linux 7.5
- Red Hat Enterprise Linux 7.6
- Red Hat Enterprise Linux 8.2

[Check Red Hat Enterprise Linux meters that the plan applies to](https://isfratio.blob.core.windows.net/isfratio/RHELRatios.csv)

## Next steps

To learn more about reservations, see the following articles:

- [What are reservations for Azure](save-compute-costs-reservations.md)
- [Prepay for Red Hat software plans with Azure reservations](../../virtual-machines/linux/prepay-rhel-software-charges.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Manage reservations for Azure](manage-reserved-vm-instance.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).
