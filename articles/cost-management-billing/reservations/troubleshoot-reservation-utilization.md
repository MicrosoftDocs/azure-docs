---
title: Troubleshoot Azure reservation utilization
description: This article helps you understand and troubleshoot Azure reservations that show no or zero utilization in the Azure portal. Utilization that doesn't match is also explained.
author: pri-mittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.author: primittal
ms.reviewer: primittal
ms.topic: troubleshooting
ms.date: 03/26/2025
---

# Troubleshoot reservation utilization

This article helps you understand and troubleshoot Azure reservations that show no or zero utilization in the Azure portal. Utilization that doesn't match is also explained.

## Symptoms

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Reservations**.
1. In the list of reservations, look the amount of utilization for a reservation in the **Utilization (%)** column. It might be zero % or lower than expected.
1. Select the reservation.
1. On the reservation overview page, your used percentage in the graph might not match the value shown in the reservation list.

## Causes

- **Latency in Usage Data**: The **Utilization (%)** column in the Azure portal shows the value for the current day. The value is calculated as usage data arrives from where resources run. Azure uses the usage to calculate the utilization percentage. Some resources report usage slower than others. Additionally, some product types like SQL Databases are slow to report their usage data.
The latency can cause the utilization calculation to show lower values than the actual usage. The difference is noticeable at the day boundary. In such cases, if Azure doesn’t get usage data from four to eight hours, it calculates a value of zero %. The zero % value is shown because usage data didn't arrive, and it appears that the reservation isn’t applying a benefit to any resources.
As usage data arrives, the value changes toward the correct percentage. When all the usage data is collected, the correct value is determined and is shown accurately in the graph.

- **Resource Change**: You might have stopped running resource A and started running resource B, which isn't applicable for the reservation you purchased for. For example, if you had a reservation for a D-series VM (SKU: D2_v3) and you switched to another D-series VM (SKU: D2s_v3), the reservation won't apply. To solve this problem, you can exchange the reservation to match it to the right resource. Another example is if you had a reservation for a specific SQL Database (SKU: SQLDB_Standard) and you switched to a different type of database (SKU: SQLDB_Premium), the reservation won't apply. For more information about reservation exchanges, see [Exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md)

- **Scope Change**: You moved a resource from one subscription or resource group to another, whereas the scope of the reservation is different from where the resource is being moved to. For instance, if you had a reservation scoped to Subscription A and you moved the resource to Subscription B, the reservation won't apply. To resolve the issue, you might need to change the scope of the reservation. Another example is if you moved a VM from one resource group to another within the same subscription, but the reservation was scoped to the original resource group. For more information about changing scope, see [Change scope for Azure Reservations](manage-reserved-vm-instance.md#change-the-reservation-scope)

- **Multiple Reservations**: You purchased another reservation that also applied a benefit to the same scope, and as a result, less of an existing reserved instance applied a benefit. For example, if you had two reservations for the same VM type (SKU: D2_v3) in the same subscription, the benefits might overlap and reduce the effectiveness of one of the reservations. To solve the problem, you might need to exchange or refund one of the reservations.

- **Resource Stopped**: You stopped running a particular resource, and as a result, it stopped emitting usage and the benefit stopped applying. For example, if you had a reservation for a VM (SKU: D2_v3) that you stopped running, the reservation benefit won't apply until the VM is running again. Another example is if you had a reservation for a specific type of storage account (SKU: Standard_LRS) and you stopped using that storage account.

- **Reservation Status**: If the reservation status is "No Benefit," it gives you a warning message and recommendations to solve the problem. For example, if you see a "No Benefit" status for a reservation (SKU: D2_v3), you might need to review the recommendations provided on the reservation's page. For instance, if you had a reservation scoped to a subscription that was deleted, the reservation won't apply to any resources.

- **Resource Usage Exceeds Reservation**: Let's say you purchased a reservation for 100 TB of Azure Blob Storage (SKU: Standard_LRS) in US West 2. If in any given month within the reservation period, you use 101 TB, your bill will include the cost of 100 TB of reserved capacity and the cost for 1 TB at PAYG prices. This results in an overage charge for the additional 1 TB. Another example is, if you have a reservation for 5 instances of Azure SQL Database (SKU: SQLDB_Standard) and you deploy 7 instances for any given hour, the reservation will cover the cost for 5 instances, and the remaining 2 instances will be billed at PAYG prices.

## Next steps

- For more information about managing reservations, see [Manage Reservations for Azure resources](manage-reserved-vm-instance.md).
