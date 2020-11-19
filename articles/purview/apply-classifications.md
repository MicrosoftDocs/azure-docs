---
title: Apply classifications on assets
description: This document describes how to apply classifications on assets.
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 11/19/2020
---
# Apply classifications on assets in Azure Purview

This article discusses how to apply classifications on assets.

## Introduction

Classifications can be system or custom types. System classifications are present in Purview by default. Custom classifications can be created based on a regular expression pattern. Classifications can be applied to assets either automatically or manually.

This document explains how to apply classifications to your data.

## Prerequisites

- Create custom classifications based on your need.
- Set up scan on your data sources.

## Apply classifications

Use the following steps to apply classifications for specific columns in your data assets:

1. Use the **Browse by asset type** or **Search** experience to navigate to the asset you would like to see and apply classifications on.

1. Select the asset. The **Overview** tab of the asset will be open.

1. Select the **Schema** tab. Some columns may already have **Classifications** applied to them if the asset has been scanned and classification rules have applied on them. Select **Edit** button on the page.

1. Under **Column level classification**, select **Add a classification**. Select a classification that you would like to apply against a column.

1. Select **Save**.

Now you can see that the **Schema** tab contains new classifications added by you against the relevant columns.

To apply classifications at the asset or schema level, do the following steps:

1. Go to asset's **Overview** tab.

1. Select **Edit** and **Classifications** field with a drop-down list will appear.

1. Select a classification from the list.

1. Select the classifications you want to apply at the asset level and select **Save**.

## Impact of rescanning on existing classifications

Classifications are applied the first time, based on sample set check on your data and matching it against the set regex pattern.

At the time of rescan, if new classifications apply, the column gets additional classifications on it. Existing classifications stay on the column, and must be removed manually.

## Next steps

- [Create a custom classification](create-a-custom-classification.md)
- [Create a custom classification rule](create-custom-classification-rule.md)