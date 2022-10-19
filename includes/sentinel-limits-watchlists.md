---
title: "include file" 
description: "include file" 
services: microsoft-sentinel
author: cwatson-cat
tags: azure-service-management
ms.topic: "include"
ms.date: 04/27/2022
ms.author: cwatson
ms.custom: "include file"
---

The following limits apply to watchlists in Microsoft Sentinel. The limits are related to the dependencies on other services used by watchlists.

|Description                   | Limit        |Dependency|
|--|-------------------------|--------------------|
|Upload size for local file| 3.8 MB per file |Azure Resource Manager
|Line entry in the CSV file |10,240 characters per line|Azure Resource Manager|
|Upload size for files in Azure Storage |500 MB per file|Azure Storage|
|Total number of active watchlist items per workspace. When the max count is reached, delete some existing items to add a new watchlist.|10 million active watchlist items|Log Analytics|
|Refresh of the status for a large watchlist in seconds. Customers won't see the latest progress of an upload until the next refresh.|15 seconds|Azure Cosmos DB|
|Number of large watchlist uploads per workspace at a time|One large watchlist|Azure Cosmos DB|
|Number of large watchlist deletions per workspace at a time|One large watchlist|Azure Cosmos DB|