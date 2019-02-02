---
title: Investigating alerts with Azure Security Insights | Microsoft Docs
description: Learn how to investigate alerts with Azure Security Insights.
services: security-insights
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: e9d7cdb8-d08a-472c-acc5-60614e4bfc20
ms.service: security-insights
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2018
ms.author: rkarlin

---
# Investigating alerts with Azure Security Insights
This document helps you to configure the integration between Azure Active Directory (AD) Identity Protection and Azure Security Center.

Security insights provides interactive visualization using advanced analytics to help security analysts get a better understand what’s going on in the face of an attack. Investigate and pivot on any field from any data to rapidly develop threat context.




## Investigating cases

A case can include multiple alerts, it can include bookmarks that you create somewhere for something you want to include. It's an aggregation of all the relevant evidence for a specific investigation. It can include comments. A case is created based on custom alerts all the severity, status, etc. is set at the case level. You can set and modify the status of a case. When you look at the Security alerts tab you'll see open cases (those will contain the alerts).
Across the top you'll see your active cases, new cases and in progress cases. You an also see an overview of all your cases by severity.

You can filter the list.

Open cases are the new cases and the in progress cases

For each case, you have a unique ID, the severity of the case is determined according to the most severe alert included in the case. 

Set the status of the case: A case can have 4 statuses: New, in progress, closed resolved (true positive) and closed dismissed (false positive). You have to give an explanation for what your reasoning is to close a case.

The case also includes all the relevant entities that are involved in the alerts (from your mapping). Cases can be assigned to a user. They all start unassigned and you can set as "assign to me".  You can go in to the cases and filter by your name to see all the cases that are assigned to you.




## Next steps
In this document, you learned how to investigate alerts with Security Insights. To learn more about Security Insights, see the following articles:

* [Azure Security blog](https://blogs.msdn.com/b/azuresecurity/) — Get the latest Azure security news and information.
