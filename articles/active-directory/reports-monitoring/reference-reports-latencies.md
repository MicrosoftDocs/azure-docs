---
title: Azure Active Directory reporting latencies | Microsoft Docs
description: Learn about the amount of time it takes for reporting events to show up in your Azure portal
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: 9b88958d-94a2-4f4b-a18c-616f0617a24e
ms.service: active-directory
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: report-monitor
ms.date: 12/15/2017
ms.author: priyamo
ms.reviewer: dhanyahk

---
# Azure Active Directory reporting latencies

With [reporting](../active-directory-preview-explainer.md) in the Azure Active Directory, you get all the information you need to determine how your environment is doing. The amount of time it takes for reporting data to show up in the Azure portal is also known as latency. 

This topic lists the latency information for the all reporting categories in the Azure portal. 


## Activity reports

There are two areas of activity reporting:

- **Sign-in activities** – Information about the usage of managed applications and user sign-in activities
- **Audit logs** - System activity information about users and group management, your managed applications and directory activities

The following table lists the latency information for activity reports.

| Report | Latency (95%) |Latency (99%)|
| :-- | --- | --- | 
| Audit logs | 2 mins  | 5 mins  |
| Sign-ins | 2 mins  | 5 mins |


## Security reports

There are two areas of security reporting:

- **Risky sign-ins** - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account. 
- **Users flagged for risk** - A risky user is an indicator for a user account that might have been compromised. 

The following table lists the latency information for security reports.

| Report | Minimum | Average | Maximum |
| :-- | --- | --- | --- |
| Users at risk          | 5 minutes   | 15 minutes  | 2 hours  |
| Risky sign-ins         | 5 minutes   | 15 minutes  | 2 hours  |

## Risk events

Azure Active Directory uses adaptive machine learning algorithms and heuristics to detect suspicious actions that are related to your user accounts. Each detected suspicious action is stored in a record called risk event.

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

If you want to know more about the activity reports in the Azure portal, see:

- [Sign-in activity reports in the Azure Active Directory portal](concept-sign-ins.md)
- [Audit activity reports in the Azure Active Directory portal](concept-audit-logs.md)

If you want to know more about the security reports in the Azure portal, see:

- [Users at risk security report in the Azure Active Directory portal](concept-user-at-risk.md)
- [Risky sign-ins report in the Azure Active Directory portal](concept-risky-sign-ins.md)

If you want to know more about risk events, see [Azure Active Directory risk events](concept-risk-events.md).
