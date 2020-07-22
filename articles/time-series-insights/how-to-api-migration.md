---
title: 'Migrating new Azure Time Series Insights Gen2 API Versions | Microsoft Docs'
description: How to update Azure Time Series Insights Gen2 environments to use new generally available versions.
ms.service: time-series-insights
services: time-series-insights
author: shreyasharmamsft
ms.author: shresha
manager: dpalled
ms.workload: big-data
ms.topic: conceptual
ms.date: 07/22/2020
ms.custom: shresha
---

# Migrating to new Azure Time Series Insights Gen2 API Versions

## Overview

If you have created an Azure Time Series Insights Gen2 environment when it was in Public Preview (before July 15th, 2020), please update your TSI environment to use the **new generally available** versions of APIs by following the steps described in this article.

When Azure Time Series Insights Gen2 was in Public Preview, the 

The new API version is `api-version=2020-07-31` and uses an updated [Time Series Expression Syntax](https://docs.microsoft.com/en-us/rest/api/time-series-insights/preview#time-series-expression-and-syntax). 

> [!IMPORTANT]
>
> The preview API version  will the following ave a new your Time Series Model, Saved Queries

## Step 1: Migrate Time Series Model and Saved Querie 