---
title: "include file" 
description: "include file" 
services: microsoft-sentinel
author: cwatson-cat
ms.topic: "include"
ms.date: 12/01/2022
ms.author: cwatson
ms.custom: "include file"
---

The following limits apply to incidents in Microsoft Sentinel.

| Description | Limit | Dependency |
| --------- | --------- | ------- |
| Investigation experience availability | 90 days from the incident last update time | None |
| Number of alerts | 150 alerts  | None |
| Number of automation rules     | 512 rules | None |
| Number of automation rule actions  | 20 actions  | None |
| Number of automation rule conditions  | 50 conditions | None |
| Number of bookmarks  | 20 bookmarks  | None |
| Number of characters for automation rule name  | 500 characters  | None |
| Number of characters for description  | 5K characters | None |
| Number of characters per comment   | 30K characters  | None |
| Number of comments per incident   | 100 comments  | None |
| Number of tasks  | 100 tasks | None |
| Number of incidents returned by API to *list* request | 1000 incidents maximum | None |
| Number of incidents per day (per workspace) | see below | Database capacity |

**Number of incidents per day:** There isn't a formal, hard limit on the number of incidents that can be created per day. A workspace's actual capacity for incidents depends on the storage capacity of the incident database, so the size of the incidents is as much a factor as their number.

However, a SOC that experiences the creation of more than *around* 3000 new incidents per day will in all likelihood find itself unable to keep up, and the database capacity will quickly be reached. In this situation, the SOC needs to focus on improving detection, triage, and automation, to get the count of daily new incidents to manageable levels.
