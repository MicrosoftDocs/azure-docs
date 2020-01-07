---
title: Red Hat reservation plan discounts - Azure
description: Learn how Red Hat plan discounts are applied to Red Hat software on virtual machines.
services: 'billing'
documentationcenter: ''
author: yashesvi
manager: yashar
editor: ''

ms.service: cost-management-billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/30/2019
ms.author: cwatson
---
# Understand how the Red Hat Linux Enterprise software reservation plan discount is applied for Azure

After you buy a Red Hat Linux plan, the discount is automatically applied to deployed Red Hat virtual machines (VMs) that match the reservation. A Red Hat Linux plan covers the cost of running the Red Hat software on an Azure VM.

To buy the right Red Hat Linux plan, you need to understand what Red Hat VMs you run and the number of vCPUs on those VMs. Use the following sections to help identify from your usage CSV file what plan to buy.

## Discount applies to different VM sizes

Like Reserved VM Instances, Red Hat plan purchases offer instance size flexibility. This means that your discount applies even when you deploy a VM with a different vCPU count. The discount applies to different VM sizes within the software plan.

The discount amount depends on the ratio listed in the following tables. The ratio compares the relative footprint for each meter in that group. The ratio depends on the VM vCPUs. Use the ratio value to calculate how many VM instances get the Red Hat Linux plan discount.

For example, if you buy a plan for Red Hat Linux Enterprise Server for a VM with 3 or 4 vCPUs, the ratio for that reservation is 2. The discount covers the Red Hat software cost for:

- 2 deployed VMs with 1 or 2 vCPUs,
- 1 deployed VM with 3 or 4 vCPUs,
- or 0.77 or about 77% of a VM with 5 or more vCPUs.

The ratio for 5 or more vCPUs is 2.6. So a reservation for Red Hat with a VM with 5 or more vCPUs covers an only portion of the software cost, which is about 77%.

## Understand Red Hat VM usage before you buy

The following tables show the software plans you can buy a reservation for, their associated usage meters, and the ratios for each.

### Red Hat Enterprise Linux

Azure portal marketplace names:

- Red Hat Enterprise Linux 6.7
- Red Hat Enterprise Linux 6.8
- Red Hat Enterprise Linux 6.9
- Red Hat Enterprise Linux 6.10
- Red Hat Enterprise Linux 7.2
- Red Hat Enterprise Linux 7.3
- Red Hat Enterprise Linux 7.4
- Red Hat Enterprise Linux 7.5
- Red Hat Enterprise Linux 7.6
- Red Hat Enterprise Linux 7 (latest lvm)

|Red Hat VM | MeterId| Ratio| Example VM size|
| -------| ------------------------| --- |--- |
|1-4 vCPU VM License|077a07bb-20f8-4bc6-b596-ab7211a1e247|1|D4s_v3|
|1-4 vCPU VM License|2f96d035-3bac-46d6-b2bc-c6daa0938536|1|D4s_v3|
|1-4 vCPU VM License|4831a7b4-bdd4-48a2-8e95-18d053971ede|1|D4s_v3|
|5+ vCPU VM License|291b2cbc-6c34-4e2b-a4e4-1ff8c106f672|2.166666667|D8s_v3|
|5+ vCPU VM License|3b6661c4-03dd-45e7-88c9-512fcb7906d5|2.166666667|D8s_v3|
|5+ vCPU VM License|037eddc0-fedd-4d73-b5d8-92fba9edb831|2.166666667|D8s_v3|
|5+ vCPU VM License|432cdeee-4034-4ddf-9ba4-9250a19b0d5f|2.166666667|D8s_v3|
|5+ vCPU VM License|794dcb90-0793-43e6-9909-70d29974e56d|2.166666667|D8s_v3|
|5+ vCPU VM License|86b5b0b4-3c19-4720-82e9-874f8c58b48e|2.166666667|D8s_v3|
|5+ vCPU VM License|86c35ec3-0a48-426a-9625-22d80e6ea55b|2.166666667|D8s_v3|
|5+ vCPU VM License|8b698c7a-47f1-4cba-8ae1-9853d5ad562d|2.166666667|D8s_v3|
|5+ vCPU VM License|a4daffb4-96f4-4fc5-b1e6-fd3a2cf3595e|2.166666667|D8s_v3|
|5+ vCPU VM License|a838cfb1-0bd3-4965-84f0-663f49afc2e2|2.166666667|D8s_v3|
|5+ vCPU VM License|99aed7b9-a0a9-4783-b90c-be7c2f3c7e30|2.166666667|D8s_v3|
|5+ vCPU VM License|d09f877e-03b4-48b2-b11a-782b965cff19|2.166666667|D8s_v3|
|44 vCPU VM License|6f44ae85-a70e-44be-83ec-153a0bc23979|2.166666667||
|60 vCPU VM License|b9edcc5b-a429-4778-bc5a-82e7fa07fe55|2.166666667||

### Red Hat Enterprise Linux for SAP with HA

Azure portal marketplace name:

|Red Hat VM | MeterId | Ratio|Example VM size|
| ------- | --- | ------------------------| --- | --- |
|1-4 vCPU VM License |4d902611-eed7-4060-a33e-3c7fdbac6406|1|D4s_v3|
|5+ vCPU VM License|6dfb482b-23ea-487f-810c-e66360f025de|2.333333333|D8s_v3|

### Red Hat Enterprise Linux with HA

Azure portal marketplace names:

|Red Hat VM | MeterId | Ratio|Example VM size|
| ------- |------------------------| --- | --- |
|1-4 vCPU VM License|e9711132-d9d9-450c-8203-25cfc4bce8de|1|D4s_v3|
|5+ vCPU VM License|93954aa4-b55f-4b7b-844d-a119d6bf3c4e|2|D8s_v3|

### RHEL for SAP Business Applications

Azure portal marketplace names:

- Red Hat Enterprise Linux 6.8 for SAP Business Apps
- Red Hat Enterprise Linux 7.3 for SAP Business Apps
- Red Hat Enterprise Linux 7.4 for SAP
- Red Hat Enterprise Linux 7.5 for SAP

|Red Hat VM | MeterId | Ratio|Example VM size|
| ------- |------------------------| --- |--- |
|1 vCPU VM License|25889e91-c740-42ac-bc52-6b8f73b98575|1|D2s_v3|
|2 vCPU VM License|2a0c92c8-23a7-4dc9-a39c-c4a73a85b5da|1|D2s_v3|
|4 vCPU VM License|875898d3-3639-423c-82c1-38846281b7e8|1|D4s_v3|
|6 vCPU VM License|69a140fa-e08e-415c-85f2-48158e4c73a0|2.166666667||
|8 vCPU VM License|777a5a74-22d6-48c9-9705-ac38fe05a278|2.166666667|D8s_v3|
|12 vCPU VM License|d6b8917a-5127-497a-9f48-1e959df98812|2.166666667||
|16 vCPU VM License|03667e82-e009-425a-83f7-8ebddbca5af4|2.166666667|D16s_v3|
|20 vCPU VM License|bbd65e5b-35f1-42be-b86d-6625fbc1f1a4|2.166666667||
|24 vCPU VM License|c2c07d3e-a7d0-400b-8832-b532bfd0be25|2.166666667|ND24s|
|32 vCPU VM License|633d1494-5ec1-46f0-a742-eaf58eeaec7e|2.166666667|D32s_v3|
|40 vCPU VM License|737142c3-8e4f-4fc1-aa41-05b1661edff8|2.166666667||
|44 vCPU VM License|722bda73-a8c8-4d04-b96b-541f0bb6c0c4|2.166666667||
|60 vCPU VM License|a22bb342-ba9a-4529-a178-39a92ce770b6|2.166666667||
|64 vCPU VM License|d37c8e17-e5f2-4060-881b-080dd4a8c4ce|2.166666667|64s_v3|
|72 vCPU VM License|14341b96-e92c-4dca-ba66-322c88a79aa6|2.166666667|F72s_v2|
|96 vCPU VM License|8b2e5cb8-0362-4cbf-a30a-115e8d6dbc49|2.166666667||
|128 vCPU VM License|9b198a68-974a-47a7-9013-49169ac0f2e9|2.166666667| M128ms|

### RHEL for SAP HANA

Azure portal marketplace names:

- Red Hat Enterprise Linux 6.7 for SAP HANA
- Red Hat Enterprise Linux 7.2 for SAP HANA
- Red Hat Enterprise Linux 7.3 for SAP HANA

|Red Hat VM | MeterId | Ratio|Example VM size|
| ------- |------------------------| --- |--- |
|1 vCPU VM License|be0a59d1-eed7-47ec-becd-453267753793|1|D2s_v3|
|2 vCPU VM License|3b97c9f5-f5d5-4fd3-a421-b78fca32a656|1|D2s_v3|
|4 vCPU VM License|b39feb58-57bf-40f2-8193-f4fe9ac3dda3|1|D4s_v3|
|6 vCPU VM License|a5963812-0f5a-4053-8ace-2b5babd15ed8|2.166666667||
|8 vCPU VM License|5460ab4d-ce9a-46af-8ad5-ca5e53d715b5|2.166666667|D8s_v3|
|12 vCPU VM License|0e3bc72d-a888-4bcf-8437-119f763a3215|2.166666667||
|16 vCPU VM License|b40e95d8-3176-42f0-967c-497785c031b2|2.166666667|D16s_v3|
|20 vCPU VM License|81f34277-499d-40a3-a634-99adc08e2d45|2.166666667||
|24 vCPU VM License|e03f1906-d35d-4084-b2cd-63281869c8ee|2.166666667|ND24s|
|32 vCPU VM License|0a58c082-ceb8-4327-9b64-887c30dddb23|2.166666667|D32s_v3|
|40 vCPU VM License|a14225c0-04e6-4669-974f-e2ddd61a9c5b|2.166666667||
|44 vCPU VM License|378b8125-d8a5-4e09-99bc-c1462534ffb0|2.166666667||
|60 vCPU VM License|5d7db11a-54e9-404e-aaa8-509fac7c0638|2.166666667||
|64 vCPU VM License|3c8157b2-a57d-45ce-ba02-bd86e9209795|2.166666667|64s_v3|
|72 vCPU VM License|5e87a3ee-7afb-4040-b8d9-b109ddb38f31|2.166666667|F72s_v2|
|96 vCPU VM License|b13895fc-0d06-4de9-b860-627c471cd247|2.166666667||
|128 vCPU VM License|6e67ac0b-19d3-4289-96df-05d0093d4b3b|2.166666667| M128ms|

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
