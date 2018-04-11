---
title: Understand Azure Reserved Instance usage for Enterprise | Microsoft Docs
description: Learn how to read your usage to understand application of  Reserved Instance for your Enterprise enrollment.
services: 'billing'
documentationcenter: ''
author: manish-shukla01
manager: manshuk
editor: ''
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/03/2017
ms.author: manshuk

---
# Understand  Reserved Instance usage for your Enterprise enrollment
Understand utilization of Reserved Instance by using the ReservationId from [Reservation page](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Reservations&Microsoft_Azure_Reservations=true#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade ) and the usage file from [EA portal.](https://ea.azure.com) You can also see the reservation usage in the usage summary section of [EA portal.](https://ea.azure.com)

>[!NOTE]
>If you bought the reservation in a Pay-As-You-Go billing context, see [Understand Reserved Instance usage for your Pay-As-You-Go subscription.](billing-understand-reserved-instance-usage.md)

For the following section, assume that you are running a Standard_D1_v2 Windows VM in east US region and your reservation information looks like the following table:

| Field | Value |
|---| --- |
|ReservationId |8f82d880-d33e-4e0d-bcb5-6bcb5de0c719|
|Quantity |1|
|SKU | Standard_D1|
|Region | eastus |

## Reservation application

The hardware portion of the VM is covered because the deployed VM matches the reservation attributes. To see what Windows software isn't covered by the Reserved Instance, go to Azure Reserved VM Instances software costs, go to [Azure Reserve VM Instances Windows software costs.](billing-reserved-instance-windows-software-costs.md)


### Reservation usage in csv
You can download the EA usage csv from EA portal. In the downloaded csv file, filter on additional info and type in your Reservation ID. The following screenshot shows the fields related to the reservation:

![EA csv for Reserved Instance](./media/billing-understand-reserved-instance-usage-ea/billing-ea-reserved-instance-csv.png)

1. ReservationId in Additional Info field represents the reservation that was used to apply benefit to the VM.
2. ConsumptionMeter is the MeterId for the VM.
3. This is the ReservationMeter with $0 cost since cost of running VM is already paid by the reservation. 
4. Standard_D1 is one vCPU VM and the VM is deployed without Azure Hybrid Benefit. Therefore, this meter covers the extra charge of Windows software. See [Azure Reserve VM Instances Windows software costs.](billing-reserved-instance-windows-software-costs.md) to find the meter corresponding to D series 1 core VM. If Azure Hybrid Benefit is used, this extra charge will not be applied.

### Reservation usage in usage summary page in EA portal

Reserved Instance usage also shows up in usage summary section of EA portal:
![EA usage summary](./media/billing-understand-reserved-instance-usage-ea/billing-ea-reserved-instance-usagesummary.png)

1. You are not charged for hardware component of the VM as it is covered by Reserved Instance. 
2. You are charged for Windows software as Azure Hybrid Benefit is not used. 

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.