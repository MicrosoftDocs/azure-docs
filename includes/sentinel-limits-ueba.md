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

The following limit applies to UEBA in Microsoft Sentinel. The limit for UEBA in Microsoft Sentinel is related to dependencies on another service.

|Description   |Limit |Dependency|
|---------|---------|---------|
|Lowest retention configuration in days for the [IdentityInfo](/azure/azure-monitor/reference/tables/identityinfo) table. All data stored on the IdentityInfo table in Log Analytics is refreshed every 14 days. | 14 days  |Log Analytics|