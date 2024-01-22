---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
tags: azure-service-management
ms.topic: "include"
ms.date: 02/22/2022
ms.author: bwren
ms.custom: "include file"
---

| Limit | Value | Comments |
|:---|:---|:---|
| Maximum size of API call | 1 MB | Both compressed and uncompressed data. |
| Maximum size for field values  | 64 KB | Fields longer than 64 KB are truncated. |
| Maximum data/minute per DCR | 2 GB | Both compressed and uncompressed data. Retry after the duration listed in the `Retry-After` header in the response. |
| Maximum requests/minute per DCR | 12,000 | Retry after the duration listed in the `Retry-After` header in the response. |
