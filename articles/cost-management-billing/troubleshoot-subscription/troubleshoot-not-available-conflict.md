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

When you try to buy (or manage) a reservation or savings plan in to the [Azure portal](https://portal.azure.com/) and you select a management group scope, you see might see a `Not available due to conflicts error`.

:::image type="content" source="./media/troubleshoot-not-available-conflict/error-message.png" alt-text="Screenshot showing the error message."  :::

## Cause
There are three types of Azure billing benefits - Azure hybrid benefit, savings plans and reservations. You may apply one or more instances of any single benefit type to a management group. However, if you apply one benefit type to a management group, currently, you may not apply instances of the same benefit type to either the parent or child of that management group. You may apply instances of the other benefit types to both the parent and children of that management group.

For example, if you have three management group hierarchy (MG_Grandparent, MG_Parent and MG_Child), and one or more savings plan are assigned to MG_Parent, then additional savings plans can't be assigned to either MG_Grandparent or MG_Child. In this example, one or more Azure hybrid benefits or reservations may be assigned to MG_Grandparent or MG_Child.


## Solutions

To resolve this issue with overlapping benefits, you can do one of the following actions:

- Select another scope.
- Change the scope of the existing benefit (savings plan, reservation or centrally managed Azure Hybrid Benefit) to prevent the overlap. 
    - To learn how to change the scope for a reservation, see [Change the savings plan scope](../reservations/manage-reserved-vm-instance.md#change-the-reservation-scope).
    - To learn how to change the scope for a savings plan, see [Change the savings plan scope](../savings-plan/manage-savings-plan.md#change-the-savings-plan-scope).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
