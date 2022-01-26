---
title: Azure Monitor Archived Logs
description: Overview of Archived Logs which is a feature of Azure Monitor that lets you archive data from a table after its retention period.
author: bwren
ms.author: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 01/12/2022

---

# Azure Monitor Archived Logs (Preview)
Archived Logs is a feature of Azure Monitor that allows you to archive data from a Log Analytics workspace for an extended period of time (up to 7 years) at a reduced cost with limitations on its usage. This is typically data that you must retain for compliance that must be accessed only when an incident or a legal issue arises.

## Basic operation
Configure any table in your Log Analytics workspace to be archived once its configured retention elapses. This includes tables that are configured as [Analytics Logs or Basic Logs](basic-logs-overview.md). For Analytics Logs tables, the retention can be configured from 30 days to 2 years (730 days). If archive is added to the table, then data is archived once this period is reached. If archive is added to a Basic Logs table then data is archived after 8 days since this is the retention period for all Basic Logs tables.

Each table in a workspace must be configured for archive independently. You can't configure a workspace for all tables to be archived.





