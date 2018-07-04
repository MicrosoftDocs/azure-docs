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

# Understand SLES Software Reservation Application

Consider that you have pre-purchased one reservation for SUSE for SAP priority for 1-2 Core VM. The following table shows the different core VMs that you could deploy and their on demand price ratios:
|SUSE for SAP software meter Name|MeterId|On Demand Price Ratios|
|-----------------------|--------------------------------------------|
|SLES_SAP_Priority_1-2_vCPU_VM|497fe0b6-fa3c-4e3d-a66b-836097244142|1|
|SLES_SAP_Priority_3-4_vCPU_VM|847887de-68ce-4adc-8a33-7a3f4133312f|2|
|SLES_SAP_Priority_5plus_vCPU_VM|18ae79cd-dfce-48c9-897b-ebd3053c6058|2.41176|

For full list of SUSE meters that can be covered through reservation, see [SUSE meters.](billing-software-reservation-meters.md)

Here are different deployments your SUSE pre-purchase can cover:
1. You could deploy one VM for SUSE for SAP priority 1-2 core and reservation pre-purchase will cover the cost of SUSE.
2. You could deploy one VM for SUSE for SAP priority 3-4 core and reservation pre-purchase will cover the cost of SUSE for 30 min of each hour. You will be charged for rest of the 30 min on pay as you go rates.
3. You could deploy one VM for SUSE for SAP priority 5+ core and reservation pre-purchase will cover the cost of SUSE for 1/2.4 hours or 25 min of each hour. You will be charged for rest of the 25 min on pay as you go rates.
4. Every hour, your software pre-purchase will cover one hour of 1-2 Core SUSE for SAP. You could deploy 2 VMs for 30 min each and both will be covered through the software reservation pre-purchase.


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



