---
title: Navigate to a change using custom filters in Change Analysis
description: Learn how to navigate to a change in your service using custom filters in Azure Monitor's Change Analysis.
ms.topic: conceptual
ms.author: hannahhunter
author: hhunter-ms
ms.contributor: cawa
ms.reviewer: cawa
ms.date: 05/09/2022
ms.subservice: change-analysis
ms.custom: devx-track-azurepowershell
ms.reviwer: cawa
---

# Navigate to a change using custom filters in Change Analysis

Browsing through a long list of changes in the entire subscription is time consuming. With Change Analysis custom filters and search capability, you can efficiently navigate to changes relevant to issues for troubleshooting.

## Custom filters and search bar

:::image type="content" source="./media/change-analysis/filters-search-bar.png" alt-text="Screenshot showing that filters and search bar are available at the top of Change Analysis homepage, right above the changes section.":::

### Filters

| Filter | Description |
| ------ | ----------- |
| Subscription | This filter is in-sync with the Azure portal subscription selector. It supports multiple-subscription selection. |
| Time range | Specifies how far back the UI display changes, up to 14 days. By default, it’s set to the past 24 hours. |
| Resource group | Select the resource group to scope the changes. By default, all resource groups are selected. |
| Change level | Controls which levels of changes to display. Levels include: important, normal, and noisy. <ul><li>Important: related to availability and security</li><li>Noisy: Read-only properties that are unlikely to cause any issues</li></ul> By default, important and normal levels are checked. |
| Resource | Select **Add filter** to use this filter. </br> Filter the changes to specific resources. Helpful if you already know which resources to look at for changes. |
| Resource type | Select **Add filter** to use this filter. </br> Filter the changes to specific resource types. |

### Search bar

The search bar filters the changes according to the input keywords. Search bar results apply only to the changes loaded by the page already and don't pull in results from the server side.

## Next steps
[Troubleshoot Change Analysis](./change-analysis-troubleshoot.md).