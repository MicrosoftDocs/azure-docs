---
title: Azure Active Directory reporting latencies | Microsoft Docs
description: Learn about the amount of time it takes for reporting events to show up in your Azure portal
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: 9b88958d-94a2-4f4b-a18c-616f0617a24e
ms.service: active-directory
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 05/13/2019
ms.author: markvi
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---

# Azure Active Directory reporting latencies

Latency is the amount of time it takes for Azure Active Directory (Azure AD) reporting data to show up in the [Azure portal](https://portal.azure.com). This article lists the expected latency for the different types of reports. 

## Activity reports

There are two types of activity reports:

- [Sign-ins](concept-sign-ins.md) – Provides information about the usage of managed applications and user sign-in activities
- [Audit logs](concept-audit-logs.md) - Provides system activity information about users and groups, managed applications and directory activities

The following table lists the latency information for activity reports. 

> [!NOTE]
> **Latency (95th percentile)** refers to the time by which 95% of the logs will be reported, and **Latency (99th percentile)** refers to the time by which 99% of the logs will be reported. 
>

| Report | Latency (95th percentile) |Latency (99th percentile)|
| :-- | --- | --- |
| Audit logs | 2 mins  | 5 mins  |
| Sign-ins | 2 mins  | 5 mins |

### How soon can I see activities data after getting a premium license?

If you already have activities data with your free license, then you can see it immediately on upgrade. If you don’t have any data, then it will take one or two days for the data to show up in the reports after you upgrade to a premium license.

## Security reports

There are two types of security reports:

- [Risky sign-ins](concept-risky-sign-ins.md) - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account. 
- [Users flagged for risk](concept-user-at-risk.md) - A risky user is an indicator for a user account that might have been compromised. 

The following table lists the latency information for security reports.

| Report | Minimum | Average | Maximum |
| :-- | --- | --- | --- |
| Users at risk          | 5 minutes   | 15 minutes  | 2 hours  |
| Risky sign-ins         | 5 minutes   | 15 minutes  | 2 hours  |

## Risk events

Azure AD uses adaptive machine learning algorithms and heuristics to detect suspicious actions that are related to your user accounts. Each detected suspicious action is stored in a record called a **risk event**.

The following table lists the latency information for risk events.

| Report | Minimum | Average | Maximum |
| :-- | --- | --- | --- |
| Sign-ins from anonymous IP addresses |5 minutes |15 Minutes |2 hours |
| Sign-ins from unfamiliar locations |5 minutes |15 Minutes |2 hours |
| Users with leaked credentials |2 hours |4 hours |8 hours |
| Impossible travel to atypical locations |5 minutes |1 hour |8 hours  |
| Sign-ins from infected devices |2 hours |4 hours |8 hours  |
| Sign-ins from IP addresses with suspicious activity |2 hours |4 hours |8 hours  |


## Next steps

* [Azure AD reports overview](overview-reports.md)
* [Programmatic access to Azure AD reports](concept-reporting-api.md)
* [Azure Active Directory risk events](concept-risk-events.md)
