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

The following limit applies to threat intelligence in Microsoft Sentinel. The limit is related to the dependency on an API used by threat intelligence.

|Description                   | Limit        |Dependency|
-------------------------|--------------------|--------------------|
| Indicators per call that use Graph security API | 100 indicators |Microsoft Graph security API|
| CSV indicator file import size | 50MB | none|
| JSON indicator file import size | 250MB | none|
