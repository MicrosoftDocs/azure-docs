---
title: Understand SUSE plan discount and usage - Azure Reservations  | Microsoft Docs
description: Learn how SUSE plan discounts are applied to SUSE software on virtual machines.
services: 'billing'
documentationcenter: ''
author: yashesvi
manager: yashar
editor: ''

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/28/2018
ms.author: cwatson
---
# Understand how the SUSE Linux Enterprise software plan discount is applied

After you buy a SUSE Linux plan, the discount is automatically applied to deployed SUSE virtual machines (VMs) that match the reservation. A SUSE Linux plan covers the cost of running the SUSE software on an Azure VM.

To buy the right SUSE Linux plan, you need to understand what SUSE VMs you run and the number of vCPUs on those VMs. Use the following sections to help identify from your usage CSV file what plan to buy.

## Discount applies to different VM sizes with instance size flexibility

Like Reserved VM Instances, SUSE plan purchases offer instance size flexibility. This means that your discount applies even when you deploy a VM with a different vCPU count. The discount applies to different VM sizes within the software plan.

The discount amount depends on the ratio listed in the following tables. The ratio compares the relative footprint for each meter in that group. The ratio depends on the VM vCPUs. Use the ratio value to calculate how many VM instances get the SUSE Linux plan discount.

For example, if you buy a plan for SUSE Linux Enterprise Server for HPC Priority for a VM with 3 or 4 vCPUs, the ratio for that reservation is 2. The discount covers the SUSE software cost for:

- 2 deployed VMs with 1 or 2 vCPUs,
- 1 deployed VM with 3 or 4 vCPUs,
- or 0.77 or about 77% of a VM with 5 or more vCPUs.

The ratio for 5 or more vCPUs is 2.6. So a reservation for SUSE with a VM with 5 or more vCPUs covers a only portion of the software cost, which is about 77%.

## Understand your SUSE VM usage before buying a SUSE Linux plan

The following tables show the software plans you can buy a reservation for, their associated usage meters, and the ratios for each.

### SUSE Linux Enterprise Server for HPC Priority

Azure portal marketplace name:

- SLES 12 SP3 for HPC (Priority)

|SUSE VM | MeterId| Ratio| Example VM size|
| -------| ------------------------| --- |--- |
|SLES for HPC 1-2 vCPUs|e275a668-ce79-44e2-a659-f43443265e98|1|D2s_v3|
|SLES for HPC 3-4 vCPUs|e531e1c0-09c9-4d83-b7d0-a2c6741faa22|2|D4s_v3|
|SLES for HPC 5+ vCPUs|4edcd5a5-8510-49a8-a9fc-c9721f501913|2.6|D8s_v3|

### SUSE Linux Enterprise Server for HPC Standard

Azure portal marketplace name:

- SLES 12 SP3 for HPC

|SUSE VM | MeterId | Ratio|Example VM size|
| ------- | --- | ------------------------| --- | --- |
|SLES for HPC 1-2 vCPUs |8c94ad45-b93b-4772-aab1-ff92fcec6610|1|D2s_v3|
|SLES for HPC 3-4 vCPUs|4ed70d2d-e2bb-4dcd-b6fa-42da71861a1c|1.92308|D4s_v3|
|SLES for HPC 5+ vCPUs |907a85de-024f-4dd6-969c-347d47a1bdff|2.92308|D8s_v3|

### SUSE Linux Enterprise Server for SAP Priority

Azure portal marketplace names:

- SLES for SAP 15 (Priority)
- SLES for SAP 12 SP3 (Priority)
- SLES for SAP 12 SP2 (Priority)

|SUSE VM | MeterId | Ratio|Example VM size|
| ------- |------------------------| --- | --- |
|SLES for SAP Priority 1-2 vCPUs|497fe0b6-fa3c-4e3d-a66b-836097244142|1|D2s_v3|
|SLES for SAP Priority 3-4 vCPUs |847887de-68ce-4adc-8a33-7a3f4133312f|2|D4s_v3|
|SLES for SAP Priority 5+ vCPUs |18ae79cd-dfce-48c9-897b-ebd3053c6058|2.41176|D8s_v3|

### SUSE Linux Enterprise Server Priority

Azure portal marketplace names:

- SLES 15 (PRIORITY)
- SLES 12 SP3 (Priority)
- SLES 11 SP4 (Priority)

|SUSE VM | MeterId | Ratio|Example VM size|
| ------- |------------------------| --- |--- |
|SLES 1 vCPU|462cd632-ec6b-4663-b79f-39715f4e8b38|1|B1ms|
|SLES 2-4 vCPUs |924bee71-5eb8-424f-83ed-a58823c33908|2|D4s_v3|
|SLES 2-4 vCPUs |60b3ae9d-e77a-46b2-9cdf-92fa87407969|2|D4s_v3|
|SLES 6 vCPUs |e8862232-6131-4dbe-bde4-e2ae383afc6f|3||
|SLES 8 vCPUs |e11331a8-fd32-4e71-b60e-4de2a818c67a|3.2|D8s_v3|
|SLES 12 core vCPUs |a5afd00d-d3ef-4bcd-8b42-f158b2799782|3.2||
|SLES 16 vCPUs |bb21066f-fe46-46d3-8006-b326b1663e52|3.2| D16s_v3|
|SLES 20 vCPUs |c5228804-1de6-4bd4-a61c-501d9003acc8|3.2| |
|SLES 24 cores vCPUs |-005d-4075-ac11-822ccde9e8f6|3.2| ND24s|
|SLES 32 vCPUs |180c1a0a-b0a5-4de3-a032-f92925a4bf90|3.2| D32s_v3|
|SLES 40 cores vCPUs |a161d3d3-0592-4956-9b64-6829678b6506|3.2||
|SLES 64 vCPUs |7f5a36ed-d5b5-4732-b6bb-837dbf0fb9d8|3.2| D64s_v3|
|SLES 72 cores vCPUs |93329a72-24d7-4faa-93d9-203f367ed334|3.2|F72s_v2|
|SLES 96 cores vCPUs |2018c3a8-ff13-41f8-b64d-9558c5206547|3.2||
|SLES 128 cores vCPUss |ac27e4d7-44b5-4fee-bc1a-78ac5b4abaf7|3.2| M128ms|

### SUSE Linux Enterprise Server Standard

Azure portal marketplace names:

- SLES 15
- SLES 15 (Standard)
- SLES 12 SP3 (Standard)

|SUSE VM | MeterId | Ratio|Example VM size|
| ------- |------------------------| --- |--- |
|SLES 1-2 cores vCPUs |4b2fecfc-b110-4312-8f9d-807db1cb79ae|1|D2s_v3|
|SLES 3-4 cores vCPUs |0c3ebb4c-db7d-4125-b45a-0534764d4bda|1.92308|D4s_v3|
|SLES 5+ vCPUs |7b349b65-d906-42e5-833f-b2af38513468|2.30769| D8s_v3|

## Next steps

To learn more about reservations, see the following articles:

- [What are Azure Reservations?](billing-save-compute-costs-reservations.md)
- [Prepay for SUSE software plans with Azure Reservations](../virtual-machines/linux/prepay-suse-software-charges.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Manage Azure Reservations](billing-manage-reserved-vm-instance.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.