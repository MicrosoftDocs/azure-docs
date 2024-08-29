---
title: Troubleshoot Not available due to conflict error
description: Provides the solutions for a problem where you can't select a management group for a reservation or a savings plan.
author: bandersmsft
ms.reviewer: benshy
ms.service: cost-management-billing
ms.subservice: common
ms.topic: troubleshooting
ms.date: 07/15/2024
ms.author: banders
---

# Troubleshoot Not available due to conflict error

You might see a `Not available due to conflict` error message when you try select a management group for a savings plan or reservation in to the [Azure portal](https://portal.azure.com/). This article provides solutions for the problem.

## Symptom

When you try to buy (or manage) a reservation or savings plan in to the [Azure portal](https://portal.azure.com/) and you select a management group scope, you see might see a `Not available due to conflicts error`.

:::image type="content" source="./media/troubleshoot-not-available-conflict/error-message.png" alt-text="Screenshot showing the error message."  :::

## Cause

There are three types of Azure billing benefits - Azure hybrid benefit, savings plans, and reservations. You can apply one or more instances of any single benefit type to a management group. However, if you apply one benefit type to a management group, currently, you can't apply instances of the same benefit type to either the parent or child of that management group. You can apply instances of the other benefit types to both the parent and children of that management group.

For example, if you have a three management group hierarchy (MG_Grandparent, MG_Parent and MG_Child), and one or more savings plan are assigned to MG_Parent, then more savings plans can't get assigned to either MG_Grandparent or MG_Child. In this example, one or more Azure hybrid benefits or reservations might be assigned to MG_Grandparent or MG_Child.

## Solutions

To resolve this issue with overlapping benefits, adjust the scope and ensure alignment to achieve a conflict-free state. You can take one of the following actions:

- Choose an alternative scope for the new benefit, such as subscription scope. If you prefer using management group scope, ensure it isn't within the same hierarchy as other management groups with the same type of benefit.
-  To prevent the overlap, adjust the scope of the current benefit (savings plan, reservation or centrally managed Azure Hybrid Benefit). For example, consider switching it to subscription or resource group level.

    - For more information about changing a reservation the scope, see [Change the savings plan scope](../reservations/manage-reserved-vm-instance.md#change-the-reservation-scope).
    - For more information about changing a savings plan scope, see [Change the savings plan scope](../savings-plan/manage-savings-plan.md#change-the-savings-plan-scope).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
