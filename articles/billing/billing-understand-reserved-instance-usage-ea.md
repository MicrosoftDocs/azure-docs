---
title: Understand Azure reserved instance usage for Enterprise | Microsoft Docs
description: Learn how to read your usage to understand how the Azure Reserved VM Instance for your Enterprise enrollment is applied.
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
ms.date: 05/09/2018
ms.author: manshuk

---
# Understand Azure reserved instance usage for your Enterprise enrollment
Understand utilization of a reserved instance by using the **ReservationId** from [Reservations page](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Reservations&Microsoft_Azure_Reservations=true#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade) and the usage file from the [EA portal](https://ea.azure.com). You can also see the reserved instance usage in the usage summary section of [EA portal](https://ea.azure.com).

>[!NOTE]
>If you bought the reserved instance in a Pay-As-You-Go billing context, see [Understand reserved instance usage for your Pay-As-You-Go subscription.](billing-understand-reserved-instance-usage.md)

For the following section, assume that you are running a Standard_D1_v2 Windows VM in the east US region and your reserved instance information looks like the following table:

| Field | Value |
|---| --- |
|ReservationId |8f82d880-d33e-4e0d-bcb5-6bcb5de0c719|
|Quantity |1|
|SKU | Standard_D1|
|Region | eastus |

## Reserved instance application

The hardware portion of the VM is covered because the deployed VM matches the reserved instance attributes. To see what Windows software isn't covered by the reserved instance, go to Azure Reserved VM Instances software costs, go to [Azure Reserve VM Instances Windows software costs.](billing-reserved-instance-windows-software-costs.md)


### Reserved instance usage in csv
You can download the EA usage csv from EA portal. In the downloaded csv file, filter on additional info and type in your **ReservationID**. The following screenshot shows the fields related to the reserved instance:

![Enterprise Agreement (EA) csv for Azure reserved instance](./media/billing-understand-reserved-instance-usage-ea/billing-ea-reserved-instance-csv.png)

1. **ReservationId** in Additional Info field represents the reserved instance that was used to apply benefit to the VM.
2. ConsumptionMeter is the MeterId for the VM.
3. This is the Reservation Meter with $0 cost since cost of running VM is already paid by the reserved instance. 
4. Standard_D1 is one vCPU VM and the VM is deployed without Azure Hybrid Benefit. Therefore, this meter covers the extra charge of Windows software. See [Azure Reserve VM Instances Windows software costs.](billing-reserved-instance-windows-software-costs.md) to find the meter corresponding to D series 1 core VM. If Azure Hybrid Benefit is used, this extra charge will not be applied.

### Reserved instance usage in usage summary page in EA portal

Reserved instance usage also shows up in usage summary section of EA portal:
![Enterprise Agreement (EA) usage summary](./media/billing-understand-reserved-instance-usage-ea/billing-ea-reserved-instance-usagesummary.png)

1. You are not charged for hardware component of the VM as it is covered by reserved instance. 
2. You are charged for Windows software as Azure Hybrid Benefit is not used. 

## Next steps
To learn more about Azure reserved instances, see the following articles:

- [What are Azure Reserved VM Instances?](billing-save-compute-costs-reservations.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Manage reserved instances in Azure](billing-manage-reserved-vm-instance.md)
- [Understand how the reserved instance discount is applied](billing-understand-vm-reservation-charges.md)
- [Understand reserved instance usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Windows software costs not included with reserved instances](billing-reserved-instance-windows-software-costs.md)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.