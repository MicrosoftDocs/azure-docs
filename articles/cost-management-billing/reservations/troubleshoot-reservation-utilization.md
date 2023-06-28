---
title: Troubleshoot Azure reservation utilization
description: This article helps you understand and troubleshoot Azure reservations that show no or zero (0) utilization in the Azure portal. Utilization that doesn't match is also explained.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: ignite-2022
ms.author: banders
ms.reviewer: nitinarora
ms.topic: troubleshooting
ms.date: 12/06/2022
---

# Troubleshoot reservation utilization

This article helps you understand and troubleshoot Azure reservations that show no or zero (0) utilization in the Azure portal. Utilization that doesn't match is also explained.

## Symptoms

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Reservations**.
1. In the list of reservations, look the amount of utilization for a reservation in the **Utilization (%)** column. It might be 0%.
1. Select the reservation.
1. On the reservation overview page, your used percentage in the graph might not match the value shown in the reservation list.

## Cause

The **Utilization (%)** column in the Azure portal shows the value for the current day. The value is calculated as usage data arrives from where resources run. Azure uses the usage to calculate the utilization percentage.

Some resources report usage slower than others. Additionally, some product types like SQL Databases are slow to report their usage data.

The latency can cause the utilization calculation to show lower values than the actual usage. The difference is noticeable at the day boundary. In such cases, if Azure doesn’t get usage data from four to eight hours, it calculates a value of 0%. The 0% value is shown because usage data hasn’t arrived, and it appears that the reservation isn’t applying a benefit to any resources.

As usage data arrives, the value changes toward the correct percentage. When all the usage data is collected, the correct value is determined and is shown accurately in the graph.

## Solution

If you find that your utilization values don't match your expectations, review the graph to get the most view of your actual utilization. Any point value older than two days should be accurate. Longer term averages from seven to 30 days should be accurate.

## Other common scenarios
- If the reservation status is "No Benefit", it will give you a warning message and to solve this, follow recommendations presented on the reservation's page.
- You may have stopped running resource A and started running resource B which is not applicable for the reservation you purchased for. To solve this, you may need to exchange the reservation to match it to the right resource. 
    - For more information about reservation exchanges, see [Exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md)
- You may have moved a resource from one subscription or resource group to another, whereas the scope of the reservation is different from where the resource is being moved to. To resolve this case, you may need to change the scope of the reservation.
- You may have purchased another reservation that also applied a benefit to the same scope, and as a result, less of an existing reserved instance applied a benefit. To solve this, you may need to exchange/refund one of the reservations.
- You may have stopped running a particular resource, and as a result it stopped emitting usage and the benefit stopped applying. To solve this, you may need to exchange the reservation to match it to the right resource. 
- You may have changed the scope of the reservation and that caused it to stop applying a benefit to the resources. To rectify this, you may need to change the scope of the reservation again to make sure the resources are deployed in same scope.
- The subscription that the reservation was scoped to was deleted or moved out, so the benefit is not being applied to the resources. To rectify this, you may need to change the scope of the reservation.

## Next steps

- For more information about managing reservations, see [Manage Reservations for Azure resources](manage-reserved-vm-instance.md).
