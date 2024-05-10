---
title: Azure billing meter ID updates
titleSuffix: Microsoft Cost Management
description: Learn about how Azure billing meter ID updates might affect your Azure consumption and billing.
author: bandersmsft
ms.reviewer: v-minasyanv
ms.service: cost-management-billing
ms.subservice: common
ms.topic: conceptual
ms.date: 04/29/2024
ms.author: banders
---

# Azure billing meter ID updates

On March 1, 2024, some Azure billing meters were updated for improved meter ID metadata. More updates are underway. A billing meter is used to determine the cost of using a specific service or resource in Azure. It helps calculate the amount you're charged based on the quantity of the resource consumed. The billing meter varies depending on the type of service or resource used.

The meter ID updates result in having only individual unique meters. A unique meter means that every Azure service, resource, and region has its own billing meter ID that precisely reflects its consumption and price. The change ensures that you see the correct meter ID on your invoice, and that you’re charged the correct price for each service or resource consumed.

*The meter ID changes don’t affect prices*. However, you might notice some changes in how your Azure consumption is shown on your invoice, price sheet, API, usage details file, and Cost Management + Billing experiences.

Here’s an example showing updated meter information.

| Service Name | Product Name | Region | Feature | Meter Type | Meter ID (new) | Meter ID (previous) |
|---|---|---|---|---|---|---|
| Virtual Machines | Virtual Machines :::no-loc text="DSv3":::  Series Windows | CH West | Low Priority | One Compute Hour | 59f7c6d9-3658-5693-8925-4aae24068de8 | 0ce7683b-0630-4103-a9a7-75a68fbf6140 |

## Download updated meters

The following download links are CSV files of the latest meter IDs with their corresponding service and old IDs, product, and region released to date. More meter ID changes will occur over time. When new files are available, we update this page to add their download links.

- [March 1, 2024 updated meters](https://download.microsoft.com/download/5/f/8/5f8d3499-eaab-4e8b-8d1d-7835923c238f/20240301_new_meterIds.csv)
- [April 1, 2024 updated meters](https://download.microsoft.com/download/5/f/8/5f8d3499-eaab-4e8b-8d1d-7835923c238f/20240401_new_meterIds.csv)
- [May 1, 2024 updated meters](https://download.microsoft.com/download/5/f/8/5f8d3499-eaab-4e8b-8d1d-7835923c238f/20240501_new_meterIds.csv)

## Recommendations

We recommend you review the list of updated meters and familiarize yourself with the new meter IDs and names that apply to your Azure consumption. You should check reports that you have  for analysis, budgets, and any saved views to see if they use the updated meters. If so, you might need to update them accordingly for the new meter IDs and names. If you don’t use any meters in the updated meters list, the changes don’t affect you.

## Related content

To learn how to create and manage budgets and save and share customized views, see the following articles:

- [Tutorial - Create and manage budgets](../costs/tutorial-acm-create-budgets.md)
- [Save and share customized views](../costs/save-share-views.md)
- If you want to learn more about how to manage your billing account and subscriptions, see the [Cost Management + Billing documentation](../index.yml).