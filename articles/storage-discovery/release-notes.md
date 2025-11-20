---
title: Release notes for the Azure Storage Discovery service | Microsoft Docs
description: Read the release notes for the Azure Storage Discovery service.
services: storage-discovery
author: pthippeswamy
ms.author: pthippeswamy
ms.service: azure-storage-discovery
ms.topic: release-notes
ms.date: 10/23/2025
---

# Release notes for the Azure Storage Discovery service

Azure Storage Discovery is a fully managed Azure service, which continuously introduces new features and improvements.

## 2025 October 15

General Availability release of Azure Storage Discovery.

Improvements:

- Storage Discovery workspaces can show insights from Azure Storage resources located in any Azure public region.
- Discovery integration with the Azure Copilot can now cover complex prompts. These improvements enable you to recombine data pivots, resulting in insights that aren't available anywhere else. The [blog post on Azure.com](https://azure.microsoft.com/blog/from-queries-to-conversations-unlock-insights-about-your-data-using-azure-storage-discovery-now-generally-available) and the [*Discover insights* article](/azure/copilot/discover-storage-estate-insights?toc=%2Fazure%2Fstorage-discovery%2Ftoc.json) have many examples and best practices.
- Filter storage account resources by performance type: premium and standard.
- An Azure Storage Discovery workspace resource can now be moved across resource groups or subscriptions. The [*Move resources to other locations* article](resource-move.md) has details.

Limitations:

- Backfill for any newly created Discovery workspace is reduced to 15 days. The backfill feature automatically adds historic data into a Storage Discovery workspace from before the moment the workspace was created. The [pricing article](pricing.md#pricing-plans) has details.

## 2025 August 6

Public Preview release notes for Azure Storage Discovery service.
Features included: 

- 30 days of backfill for any newly created discovery scope in Standard SKU
- 15 days of backfill for any newly created discovery scope in Free SKU
- SKU upgrade and downgrade options
- On October 15, 2025, Storage Discovery resources begin incurring costs. Until that date, customers may observe usage for the following meters in the Cost Management / Cost Analysis portal: Storage accounts monitored and objects analyzed. These usage details are visible for transparency but no charges are added to your September 2025 invoice.

Limitations:

- Reports include insights for both Standard and Premium storage accounts. However, filtering specifically by performance type to isolate insights for Premium accounts isn't yet supported. We're actively working to enable this functionality in an upcoming release.
- Trend graphs in Reports may occasionally show sharp dips that don’t reflect actual changes in metrics like size or count.
