---
title: Overview of ingestion-time transformations in Azure Monitor Logs
description: This article describes ingestion-time transformations which allow you to filter and transform data before it's stored in a Log Analytics workspace in Azure Monitor.
ms.subservice: logs
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 01/19/2022
---

# Adding Ingestion-time Transformation to Azure Monitor Logs

## Known issues and workarounds  
**Problem**: The DCR object, when viewed via the Azure Portal, does not appear to have properties such as the transform KQL in it, even though provisioning it with those properties was successful  
**Solution**: The Azure Portal UI for DCRs does not use the latest version of the API. Until the UI is updated to reflect this new API version, please call a GET against the DCR object directly using API version `2021-09-01-preview` or later.  

**Problem**: I sent the data, but I don't see it in my workspace  
**Solution**: Please give the data some time to arrive, especially if this is the first time data is being sent to a particular table. If data takes longer than ~15min to arrive, contact the support email provided to you as part of onboarding.  

**Problem**: I see the new columns I created showing up in the schema browser, but IntelliSense is not working
**Solution**: The cache that drives IntelliSense takes some time to update. Please give the system up to a day for these changes to be reflected.  

**Problem**: I added a transformation to a `Dynamic` column, but the transformation doesn't work
**Solution**: There is currently a bug affecting dynamic columns. A temporary workaround is to explicitly parse dynamic column data using `parse_json()` prior to performing any operations against them.   


