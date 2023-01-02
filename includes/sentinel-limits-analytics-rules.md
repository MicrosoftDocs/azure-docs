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

The following limit applies to analytics rules in Microsoft Sentinel.

| Description | Limit  | Dependency |
| --------- | --------- | --------- |
| Number of rules     | 512 rules       | None |
| Number of near-real-time (NRT) rules | 50 NRT rules | None |
| Custom details    | 20 details per rule | None |
| Custom details cumulative size limit | 2 KB | None |
| Alerts per rule<br>Applicable when *Event grouping* is set to *Trigger an alert for each event* | 150 alerts | None |
| Alerts per rule for NRT rules | 30 alerts | None |

