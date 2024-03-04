---
title: "include file" 
description: "include file" 
services: microsoft-sentinel
author: cwatson-cat
tags: azure-service-management
ms.topic: "include"
ms.date: 05/23/2023
ms.author: cwatson
ms.custom: "include file"
---

The following limit applies to analytics rules in Microsoft Sentinel.

| Description | Limit  | Dependency |
| --------- | --------- | --------- |
| Number of *enabled* rules     | 512 rules       | None |
| Number of near-real-time (NRT) rules | 50 NRT rules | None |
| Entity mappings | 10 mappings per rule | None |
| Entities identified per alert<br>(Divided equally among the mapped entities) | 500 entities per alert | None |
| Entities cumulative size limit | 64 KB | None |
| Custom details    | 20 details per rule | None |
| Custom details cumulative size limit | 2 KB | None |
| Alerts per rule<br>Applicable when *Event grouping* is set to *Trigger an alert for each event* | 150 alerts | None |
| Alerts per rule for NRT rules | 30 alerts | None |
