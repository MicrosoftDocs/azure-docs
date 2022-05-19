---
title: Review your current dashboards and plan your conversion to Azure Workbooks | Microsoft Docs
description: TBD
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
---

# Review dashboards in your current SIEM

Dashboards in your existing SIEM will migrate to Microsoft Sentinel workbooks. Consider the following when designing your migration.
- Discover dashboards. Gather information about your dashboards, including design, parameters, data sources, and other details. Identity the purpose or usage of each dashboard.
- Select. Don’t migrate all dashboards without consideration. Focus on dashboards that are critical and used regularly.
- Consider permissions. Consider who are the target users for workbooks. Microsoft Sentinel uses Azure Workbooks, and access is controlled using Azure Role Based Access Control (RBAC). To create dashboards outside Azure, for example for business execs without Azure access, using a reporting tool such as PowerBI.