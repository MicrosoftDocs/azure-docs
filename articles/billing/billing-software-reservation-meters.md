---
title: Azure reserve instances Windows software costs | Microsoft Docs
description: Learn which Windows software meters are not included in Azure Reserved VM Instance costs.
services: 'billing'
documentationcenter: ''
author: manish-shukla01
manager: manshuk
editor: ''
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/04/2018
ms.author: manshuk

---
# SUSE Software Reservation Meters and Ratio

You can purchase software reservation for any of the group below and you will get benefit proportionately for the software in that group. For e.g. if you purchase 1 quantity pf SAP prioroty (3-4 vCPU), you can either deploy two (1-2 vCPU) VMs or one (3-4 vCPU) VM. For details on how software reservation is applied, see [understand software reservation application](billing-understand-sotware-reservation-application.md)

| MeterId | Friendly Name | Software Group Name | Ratio|
| ------- | ------------------------| --- |---|
|497fe0b6-fa3c-4e3d-a66b-836097244142|SLES for SAP Priority (1-2 vCPU)|SUSE Linux Enterprise Server for SAP Priority|1|
|847887de-68ce-4adc-8a33-7a3f4133312f|SLES for SAP Priority (3-4 vCPU)|SUSE Linux Enterprise Server for SAP Priority|2|
|18ae79cd-dfce-48c9-897b-ebd3053c6058|SLES for SAP Priority (5+ vCPU)|SUSE Linux Enterprise Server for SAP Priority|2.41176|
|462cd632-ec6b-4663-b79f-39715f4e8b38|SLES (1vCPU)|SUSE Linux Enterprise Server Priority|1|
|60b3ae9d-e77a-46b2-9cdf-92fa87407969|SLES (4vCPU)|SUSE Linux Enterprise Server Priority|2|
|924bee71-5eb8-424f-83ed-a58823c33908|SLES (2vCPU)|SUSE Linux Enterprise Server Priority|2|
|e8862232-6131-4dbe-bde4-e2ae383afc6f|SLES (6 vCPU)|SUSE Linux Enterprise Server Priority|3|
|180c1a0a-b0a5-4de3-a032-f92925a4bf90|SLES (32 vCPU)|SUSE Linux Enterprise Server Priority|3.2|
|bb21066f-fe46-46d3-8006-b326b1663e52|SLES (16 vCPU)|SUSE Linux Enterprise Server Priority|3.2|
|c5228804-1de6-4bd4-a61c-501d9003acc8|SLES (20 vCPU)|SUSE Linux Enterprise Server Priority|3.2|
|e11331a8-fd32-4e71-b60e-4de2a818c67a|SLES (8 vCPU)|SUSE Linux Enterprise Server Priority|3.2|
|7f5a36ed-d5b5-4732-b6bb-837dbf0fb9d8|SLES (64 vCPU)|SUSE Linux Enterprise Server Priority|3.2|
|ac27e4d7-44b5-4fee-bc1a-78ac5b4abaf7|SLES (128 vCPU)|SUSE Linux Enterprise Server Priority|3.2|
|a5afd00d-d3ef-4bcd-8b42-f158b2799782|SLES (12 vCPU)|SUSE Linux Enterprise Server Priority|3.2|
|085dc9ee-005d-4075-ac11-822ccde9e8f6|SLES (24 vCPU)|SUSE Linux Enterprise Server Priority|3.2|
|93329a72-24d7-4faa-93d9-203f367ed334|SLES (72 vCPU)|SUSE Linux Enterprise Server Priority|3.2|
|2018c3a8-ff13-41f8-b64d-9558c5206547|SLES (96 vCPU)|SUSE Linux Enterprise Server Priority|3.2|
|a161d3d3-0592-4956-9b64-6829678b6506|SLES (40 vCPU)|SUSE Linux Enterprise Server Priority|3.2|
|e275a668-ce79-44e2-a659-f43443265e98|SLES for HPC (1-2 vCPU)|SUSE Linux Enterprise Server for HPC Priority|1|
|e531e1c0-09c9-4d83-b7d0-a2c6741faa22|SLES for HPC (3-4 vCPU)|SUSE Linux Enterprise Server for HPC Priority|2|
|4edcd5a5-8510-49a8-a9fc-c9721f501913|SLES for HPC (5+ vCPU)|SUSE Linux Enterprise Server for HPC Priority|2.6|
|8c94ad45-b93b-4772-aab1-ff92fcec6610|SLES for HPC (1-2 vCPU)|SUSE Linux Enterprise Server for HPC Standard|1|
|4ed70d2d-e2bb-4dcd-b6fa-42da71861a1c|SLES for HPC (3-4 vCPU)|SUSE Linux Enterprise Server for HPC Standard|1.92308|
|907a85de-024f-4dd6-969c-347d47a1bdff|SLES for HPC (5+ vCPU)|SUSE Linux Enterprise Server for HPC Standard|2.92308|
|4b2fecfc-b110-4312-8f9d-807db1cb79ae|SLES (1-2 vCPU)|SUSE Linux Enterprise Server Standard|1|
|0c3ebb4c-db7d-4125-b45a-0534764d4bda|SLES (3-4 vCPU)|SUSE Linux Enterprise Server Standard|1.92308|
|7b349b65-d906-42e5-833f-b2af38513468|SLES (5+ vCPU)|SUSE Linux Enterprise Server Standard|2.30769|




## Next steps
To learn more about Azure reserved instances, see the following articles:

- [What are Azure Reserved VM Instances?](billing-save-compute-costs-reservations.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Manage reserved instances in Azure](billing-manage-reserved-vm-instance.md)
- [Understand how the reserved instance discount is applied](billing-understand-vm-reservation-charges.md)
- [Understand reserved instance usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand reserved instance usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.



