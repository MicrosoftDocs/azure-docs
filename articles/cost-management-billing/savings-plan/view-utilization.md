---
title: View Azure savings plan utilization
titleSuffix: Microsoft Cost Management
description: Learn how to view saving plan utilization in the Azure portal.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 11/08/2022
ms.author: banders
---

# View savings plan utilization after purchase

You can view savings plan utilization percentage in the Azure portal.

> [!NOTE]
> It can take up to 48 hours for initial savings plan purchase utilization data to appear in utilization reports and to get shown in cost analysis. Afterward, you can expect usage data show to appear within 2 to 24 hours.

## View utilization in the Azure portal with Azure RBAC access

To view savings plan utilization, you must have Azure RBAC access to the savings plan or you must have elevated access to manage all Azure subscriptions and management groups.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for **Savings plans** and the select it.
3. The list shows all the savings plans where you have the Owner or Reader role. Each savings plan shows the last known utilization percentage for both the last day and the last seven days in the list view.
4. Select the utilization percentage to see the utilization history.

## View utilization as billing administrator

An Enterprise Agreement (EA) administrator or a Microsoft Customer Agreement (MCA) billing administrator can view the utilization from  **Cost Management + Billing**.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Go to  **Cost Management + Billing** > **Savings plans**.
3. Select the utilization percentage to see the utilization history.

## Get Savings plan utilization with the API

You can get the [Savings plan utilization](https://go.microsoft.com/fwlink/?linkid=2209373) using the Benefit Utilization Summary API.

## Next steps

- [Manage Azure savings plan](manage-savings-plan.md)
- [View Azure savings plan cost and usage details](utilization-cost-reports.md)
