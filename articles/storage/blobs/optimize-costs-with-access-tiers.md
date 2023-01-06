---
title: Optimize costs by using access tiers
titleSuffix: Azure Storage
description: Description goes here
author: normesta

ms.author: normesta
ms.date: 11/09/2022
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
---

# Optimize costs with access tiers

Introduction goes here

## Organize data into access tiers

You can reduce costs by placing blob data into the most cost effective access tiers. Choose from three tiers that are designed to optimize your costs around data use. For example, the *hot* tier has a higher storage cost but lower access cost. Therefore, if you plan to access data frequently, the hot tier might be the most cost-efficient choice. If you plan to access data less frequently, the *cold* or *archive* tier might make the most sense because it raises the cost of accessing data while reducing the cost of storing data. See [Estimate the cost of archiving data](../blobs/archive-cost-estimation.md).

To learn more, see [Hot, Cool, and Archive access tiers for blob data](../blobs/access-tiers-overview.md?tabs=azure-portal).

## Ingest directly to the most appropriate tier

Costs are lower if you do this directly. Discuss that a bit.

Look at the current read patterns of the data that you plan to move - or - try to predict what those read patterns might be

Show the chart with read patterns and tiers

If you choose to archive data see the blah section of this article for guidance about how to optimize your costs when archiving data.

## Optimize the costs of data already in Azure Storage

Analyze your data estate to determine which types of blobs exist, their current access tiers and how often they are read.

Use these articles to help you analyze your data

- Inventory article
- Calculate article
- Report tutorial

You can use lifecycle management policies to move data between tiers and save money. These policies can move data to by using rules that you specify. For example, you might create a rule that moves blobs to the archive tier if that blob hasn't been modified in 90 days. By creating policies that adjust the access tier of your data, you can design the least expensive storage options for your needs. For example, data accessed longer than x days etc. Give a few examples here.

To learn more, see [Manage the Azure Blob Storage lifecycle](../blobs/lifecycle-management-overview.md?tabs=azure-portal)

If your analysis shows a lot of page and append blobs, you can use lifecycle management to tier those objects as well. You'll have to first convert them to block blobs. Here's some guidance - see guidance that Francis provides.

## Optimize for archive storage

If you decide to archive data, see this article to help you estimate the cost of archiving and which pattern of archiving makes most sense to you.  

To save costs even further, consider combining objects into a larger files and read costs will be decreased 






## Next steps

- [Set a blob's access tier](access-tiers-online-manage.md)
- [Archive a blob](archive-blob.md)
- [Optimize costs by automatically managing the data lifecycle](lifecycle-management-overview.md)
