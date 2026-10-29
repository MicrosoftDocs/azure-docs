---
title: View savings plan utilization
titleSuffix: Microsoft Cost Management
description: Learn how to view savings plan utilization in the Azure portal.
author: nwokolo
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: how-to
ms.date: 10/29/2026
ms.author: onwokolo
---

# View savings plan utilization after purchase

You can view savings plan utilization percentage in the Azure portal.

> [!NOTE]
> It can take up to 48 hours after a savings plan purchase for initial utilization data to appear in utilization reports and cost analysis. Afterward, you can expect usage data to appear within 2 to 24 hours.

## View utilization in the Azure portal with Azure RBAC access

To view savings plan utilization, you must have Azure RBAC access to the savings plan or you must have elevated access to manage all Azure subscriptions and management groups.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for **Savings plans** and then select it.
3. The list shows all savings plans for which you have the Owner or Reader role. Each savings plan shows the last known utilization percentages for the last day and the last seven days.
4. Select the utilization percentage to see the utilization history.

## View utilization as billing administrator

An Enterprise Agreement (EA) administrator or a Microsoft Customer Agreement (MCA) billing administrator can view the utilization from **Cost Management + Billing**.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Go to **Cost Management + Billing** > **Savings plans**.
3. Select the utilization percentage to see the utilization history.

## Get Savings plan utilization with the API

You can get [savings plan utilization data](https://go.microsoft.com/fwlink/?linkid=2209373) by using the Benefit Utilization Summary API.

## Next steps

- [Manage savings plan](manage-savings-plan.md)
- [View savings plan cost and usage details](utilization-cost-reports.md)
