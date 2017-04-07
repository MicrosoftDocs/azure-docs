---
title: Azure Active Directory reporting latencies | Microsoft Docs
description: Learn about the amount of time it takes for reporting events to show up in your Azure portal
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 9b88958d-94a2-4f4b-a18c-616f0617a24e
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/07/2017
ms.author: markvi;dhanyahk

---
# Azure Active Directory reporting latencies

In Azure Active Directory, latencies represent the amount of time it takes for reporting data to show up in the Azure portal.  


| Report | Minimum | Average | Maximum |
| --- | --- | --- | --- |
| **Activity** ||||
| Audit logs             | 30 minutes  | 45 Minutes | 1 hour     |
| Sign-ins               | 15 minutes  | 15 minutes | 2 hours*   |
| **Security** ||||
| Users at risk          | 5 minutes   | 15 minutes  | 2 hours  |
| Risky sign-ins         | 5 minutes   | 15 minutes  | 2 hours  |
| **Risk events** | | | |
| Sign-ins from anonymous IP addresses |5 minutes |15 Minutes |2 hours |
| Sign-ins from unfamiliar locations |5 minutes |15 Minutes |2 hours |
| Users with leaked credentials |2 hours |4 hours |8 hours |
| Impossible travel to atypical locations |2 hours |4 hours |8 hours  |
| Sign-ins from infected devices |2 hours |4 hours |8 hours  |
| Sign-ins from IP addresses with suspicious activity |2 hours |4 hours |8 hours  |



>[!NOTE]
> For some sign-ins activity data coming from legacy office applications, it can take to 8 hours for the reporting data to show up. 
