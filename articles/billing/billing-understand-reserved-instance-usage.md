---
title: Understand Azure reservation usage for Pay-As-You-Go subscription | Microsoft Docs
description: Learn how to read your usage to understand how the Azure reservation for your Pay-As-You-Go subscription is applied.
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
ms.date: 08/08/2018
ms.author: manshuk

---
# Understand Azure reservation usage for your Pay-As-You-Go subscription

Use the ReservationId from [Reservation page](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Reservations&Microsoft_Azure_Reservations=true#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade) and the usage file from the [Azure Accounts portal](https://account.azure.com) to evaluate your reservation usage.

If you are an EA customer, see [Understand reservation usage for your Enterprise enrollment.](billing-understand-reserved-instance-usage-ea.md).

This article assumes that the reservation is applied to a single subscription. If the reservation is applied to more than one subscription, your reservation benefit may span multiple usage csv files.

## Reservation discount applied to virtual machines

For the following sections, assume that you are running a Standard_DS1_v2 Windows VM in the east US region and your reserved VM instance information looks like the following table:

| Field | Value |
|---| :---: |
|ReservationId |8117adfb-1d94-4675-be2b-f3c1bca808b6|
|Quantity |1|
|SKU | Standard_DS1_v2|
|Region | eastus |

The hardware portion of the VM is covered because the deployed VM matches the reservation attributes. To see what Windows software isn't covered by the Reserved VM Instance, go to [Azure Reserve VM Instances Windows software costs.](billing-reserved-instance-windows-software-costs.md)

### Statement section of csv

This section of your csv shows the total  usage for your reservation. Apply the filter on Meter Subcategory field that contains "Reservation-" and your data looks like the following screenshot:
![Screenshot of filtered reservation usage details and charges](./media/billing-understand-reserved-instance-usage/billing-payg-reserved-instance-csv-statements.png)

Reservation-Base VM line has the total number of hours that are covered by the reservation. This line is $0.00 because the reservation covers it. Reservation-Windows Svr (1 Core) line covers the cost of Windows software.

### Daily usage section of csv

Filter on additional info and type in your **Reservation ID**. The following screenshot shows the fields related to the reservation.

![Screenshot of daily usage details and charges](./media/billing-understand-reserved-instance-usage/billing-payg-reserved-instance-csv-details.png)

1. **ReservationId** in Additional Info field is the reservation that was used to apply benefit to the VM.
2. ConsumptionMeter is the Meter Id for the VM.
3. Reservation-Base VM Meter Subcategory line represents the $0 cost line in statement section. Cost of running this VM is already paid by the reservation.
4. This is the Meter Id for reservation. Cost of this meter is $0. Any VM that qualifies for reservation has this MeterId in the csv to account for the cost. 
5. Standard_DS1_v2 is one vCPU VM and the VM is deployed without Azure Hybrid Benefit. Therefore, this meter covers the extra charge of Windows software. See [Azure Reserve VM Instances Windows software costs.](billing-reserved-instance-windows-software-costs.md) to find the meter corresponding to D series 1 core VM. If Azure Hybrid Benefit is used, this extra charge is not applied. 

## Next steps

To learn more about reservations, see the following articles:

- [What are Azure reservations?](billing-save-compute-costs-reservations.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Prepay for SQL Database compute resources with Azure SQL Database reserved capacity](../sql-database/sql-database-reserved-capacity.md)
- [Manage reservations in Azure](billing-manage-reserved-vm-instance.md)
- [Understand how the reservation discount is applied](billing-understand-vm-reservation-charges.md)
- [Understand reservation usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with reservations](billing-reserved-instance-windows-software-costs.md)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
