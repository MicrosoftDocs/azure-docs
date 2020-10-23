---
title: 'Apply classifications on assets'
titleSuffix: Azure Data Catalog
description: This document describes how to apply classifications on assets
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/02/2020
---
# Apply classifications on assets

Classifications can be system or custom types. System classifications come out of the box, with Babylon. And custom classifications are created by you based on Regex pattern set by you. Classifications are applied to assets either automatically or manually. 

This document explains how to apply classifications to your data.

## Prerequisites
- Create custom classifications based on your need.
- Set up scan on your data sources.

## Apply classifications

### Step 1

Use Browse by asset type or Search experiences to navigate to the asset you would like to see and apply classifications on.

### Step 2

Select an asset. "Overview" tab of the asset is open.

### Step 3

Select **Schema** tab. Some columns may already have **classifications** applied to them if the asset has been scanned and classification rules have applied on them. Click **Edit** button on the page. 

A column called **Column level classification** has an **add a classification** with plus sign (+) next to it. Select **Add a classification** and select a classification that you would like to apply against a column. 

Select **Save**. 

Now you can see Schema tab contains new classifications added by you against the relevant columns.

### Step 4

To apply classification at asset level, go to asset's **Overview** tab. 

Select **Edit** and **Classifications** field with a drop down list will appear. 

Pick a classification from the list. Note, this is the same list that you got at Schema tab in step 3. 

Pick the classifications you want to apply at asset level and click **Save**. 

This completes the process of applying asset and schema level classifications.

## Impact of re-scan on existing classifications

Classifications are applied the first time, based on sample set check on your data and matching it against the set regex pattern.

At the time of re-scan, if new classifications apply, the column gets additional classifications on it. Existing classifications stay on the column.

> [!NOTE] 
> You need to manually remove existing classifications.
