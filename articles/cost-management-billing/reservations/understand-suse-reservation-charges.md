---
title: Software plan discount - Azure
description: Learn how software plan discounts are applied to software on virtual machines.
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 12/18/2024
ms.author: banders
---

# Azure software plan discount

Azure software plans for SUSE and RedHat are reservations that apply to deployed VMs. The software plan discount is applied to the software usage of deployed virtual machines (VM)s that match the reservation.

When you shut down a VM, the discount is automatically applied to another matching VM, if available. A software plan covers the cost of running the software on a VM. Other charges such as compute, storage, and networking are charged separately.

To buy the right plan, you need to understand your VM usage and the number of vCPUs on those VMs. Use the following sections to help identify what plan to buy, based on your usage data.

## How reservation discount is applied

A reservation discount is "*use-it-or-lose-it*." So, if you don't have matching resources for any hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.

When you shut down a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are *lost*.

Stopped resources are billed and continue to use reservation hours. To use your available reservation hours with other workloads, deallocate or delete resources or scale-in other resources.

## Review RedHat VM usage before you buy

Get the product name from your usage data and buy the RedHat plan with the same type and size.

For example, if your usage has product **Red Hat Enterprise Linux - 1-4 vCPU VM License**, you should purchase **Red Hat Enterprise Linux** for **1-4 vCPU VM**.

<!--ADD RHEL SCREENSHOT -->

## Review SUSE VM usage before you buy

Get the product name from your usage data and buy the SUSE plan with the same type and size.

For example, if your usage is for product **SUSE for SAP Linux Enterprise Server** **- 2-4 vCPU VM Support**, you should purchase **SUSE for SAP Linux Enterprise Server** for **2-4 vCPU**.

## Discount applies to different VM sizes for SUSE plans

Like Reserved VM Instances, SUSE plan purchases offer instance size flexibility. That means that your discount applies even when you deploy a VM with a different vCPU count. The discount applies to different VM sizes within the software plan.

The discount amount depends on the ratio listed in the following tables. The ratio compares the relative footprint for each meter in that group. The ratio depends on the VM vCPUs. Use the ratio value to calculate how many VM instances get the SUSE Linux plan discount. The article at [Virtual machine size flexibility with Reserved VM Instances](/azure/virtual-machines/reserved-vm-instance-size-flexibility) explains how instance size flexibility ratios work for different license types. 

There are two decisions you should make when buying SUSE License reservations:

- Determine your license type
- Determine the type or amount of vCPUs variant of the license

For the license type, you must match the license of your VM against the ones available:

- SUSE Enterprise Linux Server for SQL with HA
- SUSE Linux Enterprise Server Priority
- SUSE Linux Enterprise Server Standard
- SUSE Linux Enterprise Server for HPC Priority
- SUSE Linux Enterprise Server for HPC Standard
- SUSE Linux Enterprise Server for SAP Standard

For the type or amount of vCPUs license, it’s slightly more complicated. Each license type has three variations: 1-2 vCPUs, 3-4 vCPUs, and 5+ vCPU. To choose the variant that fits your needs, you to understand the formula behind the ratios. 

### Ratio calculation

The ratio in the context of SUSE reservation charges determines how the discount applies to different VM sizes. This ratio is based on the number of vCPUs (virtual CPUs) in the VM SKU. Here’s a simplified breakdown:

1. Identify the VM size. Each VM size has a specific number of vCPUs.
1. Determine the “Coverage Value” for your VMs by using the ratios defined in the [Instance size flexibility ratios](https://aka.ms/isf) file based on the following formula:

`Ratio Of The Bought License / Sum of the Ratio Of The "Target" Licenses = Coverage value`

### Practical example

Let’s look at a practical example. Assume you buy the *SLES_HPC_Priority_3-4_vCPU_VM* reservation. It has a ratio of two, per the instance size flexibility ratio file.

- If you have two VMs with two vCPUs each, you:
    1. Capture the ratio of the target license for machines with 1-2 vCPU which is one, per the instance size flexibility ratio file. Because you have two VMs, the sum for the ratios is two.
	2. Input the value in the formula. It is: 
        `2 / 2 = 1`
	3. If you buy the SLES_HPC_Priority_3-4_vCPU_VM license, it fully covers two VMs with 1-2 vCPUs each.
- If you have one VM with six vCPUs, then:
	1. Capture the ratio of the target license for VMs with 5+ vCPUs, which is 2.6 according to the instance size flexibility ratio file.
	2. Input the value in the formula, it is:
	    `2 / 2.6 = 0.77`
	4. If you buy the SLES_HPC_Priority_3-4_vCPU_VM license, it covers 77% of a VM with 6 vCPUs. Because there’s a difference in coverage, the result is that 77% of the VM is covered by the reservation and the remainder of 23% gets charged at the normal rate.

### Environment-wide calculation

To simplify:

1. Calculate the total ratio. Then, sum the ratios of all VMs that you want to cover.
2. Compare with your plan. Ensure that the total ratio doesn’t exceed the ratio of your purchased plan.


### SUSE Linux Enterprise Server for HPC 

|SUSE VM | MeterId | Ratio|Example VM size|
| ------- | --- | ------------------------| --- |
|SUSE Linux Enterprise Server for HPC 1-2 vCPUs |8c94ad45-b93b-4772-aab1-ff92fcec6610|1|D2s_v3|
|SUSE Linux Enterprise Server for HPC 3-4 vCPUs|4ed70d2d-e2bb-4dcd-b6fa-42da71861a1c|1.92308|D4s_v3|
|SUSE Linux Enterprise Server for HPC 5+ vCPUs |907a85de-024f-4dd6-969c-347d47a1bdff|2.92308|D8s_v3|

### SUSE for SAP Linux Enterprise Server

> [!NOTE]
> Please note that **SUSE Linux Enterprise for SAP Applications + 24x7 Support** on the pricing calculator is the same as **SUSE for SAP Linux Enterprise Server** on the Reservation portal.

|SUSE VM | MeterId | Ratio|Example VM size|
| ------- |------------------------| --- | --- |
|SUSE for SAP Linux Enterprise Server 1-2 vCPUs|797618eb-cecb-59e7-a10e-1ee1e4e62d32|1|D2s_v3|
|SUSE for SAP Linux Enterprise Server 3-4 vCPUs |1c0fb48a-e518-53c2-ab56-6feddadbb9a3|2|D4s_v3|
|SUSE for SAP Linux Enterprise Server 5+ vCPUs |3ce5649c-142b-5a59-9b2a-6889da9b56f5|2.41176|D8s_v3|
|SUSE for SAP Linux Enterprise for SAP Applications + 24x7 Support 1-2 vCPUs|497fe0b6-fa3c-4e3d-a66b-836097244142|1|D2s_v3|
|SUSE for SAP Linux Enterprise for SAP Applications + 24x7 Support 3-4 vCPUs |847887de-68ce-4adc-8a33-7a3f4133312f|2|D4s_v3|
|SUSE for SAP Linux Enterprise for SAP Applications + 24x7 Support 5+ vCPUs |18ae79cd-dfce-48c9-897b-ebd3053c6058|2.41176|D8s_v3|

### SUSE Linux Enterprise Server

|SUSE VM | MeterId | Ratio|Example VM size|
| ------- |------------------------| --- |--- |
|SUSE Linux Enterprise Server 1-2 cores vCPUs |4b2fecfc-b110-4312-8f9d-807db1cb79ae|1|D2s_v3|
|SUSE Linux Enterprise Server 3-4 cores vCPUs |0c3ebb4c-db7d-4125-b45a-0534764d4bda|1.92308|D4s_v3|
|SUSE Linux Enterprise Server 5+ vCPUs |7b349b65-d906-42e5-833f-b2af38513468|2.30769| D8s_v3|

## Need help? Contact us

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Related content

To learn more about reservations, see the following articles:

- [What are Azure Reservations?](save-compute-costs-reservations.md)
- [Prepay for SUSE software plans with Azure Reservations](/azure/virtual-machines/linux/prepay-suse-software-charges)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](/azure/virtual-machines/prepay-reserved-vm-instances)
- [Manage Azure Reservations](manage-reserved-vm-instance.md)
- [Understand reservation usage for your pay-as-you-go subscription](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
