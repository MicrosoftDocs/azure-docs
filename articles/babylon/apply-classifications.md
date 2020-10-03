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

Classifications can be system or custom types. System classifications come out of the box, with Babylon. And custom classifications are created by you based on Regex pattern set by you. Classifications are applied to assets either automatically, during the scanning process, or manually, at the asset and schema level. This document explains how to apply classifications.

## Prerequisites
1. Create custom classifications, if system classifications do not satisfy your business or technical needs.
2. Set up scan on your data sources.

## Apply classifications at schema level

### Step 1

Use Browse by asset type or Search experiences to navigate to the asset you would like to see and apply classifications on.

### Step 2

Click on the asset. You will land in the "Overview" tab of the asset. 

### Step 3

Select **Schema** tab. Note that some columns may already have **classifications** applied to them if the asset has been scanned and classification rules have applied on them. Click **Edit** button on the page. 

You can now see a column called **Column level classification** that has an **add a classification** with plus sign (+) next to it. Click on **Add a classification** and select a classification that you would like to apply against a column. 


Click **Save**. 

Now you can see Schema tab contains new classifications added by you against the relavent columns.

### Step 4

To apply classification at asset level, go to asset's **Overview** tab. 

Click **Edit** and you will note **Classifications** field with a drop down list next to it. 

Pick a classification from the list. Note, this is the same list that you got at Schema tab in step 3. 

Pick the classifications you want to apply at asset level and click **Save**. 

This completes the process of applying asset and schema level classifications.


## Next steps

