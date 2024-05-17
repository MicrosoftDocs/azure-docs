---
title: Troubleshoot Not available due to conflict error
description: Provides the solutions for a problem where you can't select a management group for a reservation or a savings plan.
author: bandersmsft
ms.reviewer: benshy
ms.service: cost-management-billing
ms.subservice: common
ms.topic: troubleshooting
ms.date: 03/21/2024
ms.author: banders
---

# Troubleshoot Not available due to conflict error

You might see a `Not available due to conflict` error message when you try select a management group for a savings plan or reservation in to the [Azure portal](https://portal.azure.com/). This article provides solutions for the problem.

## Symptom

When you try to buy a reservation or savings plan in to the [Azure portal](https://portal.azure.com/) and you select a scope, you see might see a `Not available due to conflicts error`.

:::image type="content" source="./media/troubleshoot-not-available-conflict/error-message.png" alt-text="Screenshot showing the error message."  :::

## Cause

This issue can occur when a management group is selected as the scope. An active benefit (savings plan, reservation, or centrally managed Azure Hybrid Benefit) is already applied at a parent or child scope.

## Solutions

To resolve this issue with overlapping benefits, you can do one of the following actions:

- Select another scope.
- Change the scope of the existing benefit (savings plan, reservation or centrally managed Azure Hybrid Benefit) to prevent the overlap. 
    - For more information about how to change the scope for a reservation, see [Change the savings plan scope](../reservations/manage-reserved-vm-instance.md#change-the-reservation-scope).
    - For more information about how to change the scope for a savings plan, see [Change the savings plan scope](../savings-plan/manage-savings-plan.md#change-the-savings-plan-scope).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
