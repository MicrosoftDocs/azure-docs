---
title: FAQs and known issues with identity protection (refreshed) in Azure Active Directory | Microsoft Docs
description: FAQs and known issues with identity protection (refreshed) in Azure Active Directory.
services: active-directory
keywords: azure active directory identity protection, cloud app discovery, managing applications, security, risk, risk level, vulnerability, security policy
documentationcenter: ''
author: MarkusVi
manager: mtillman

ms.assetid: e7434eeb-4e98-4b6b-a895-b5598a6cccf1
ms.service: active-directory
ms.component: identity-protection
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/13/2018
ms.author: markvi
ms.reviewer: raluthra

---
# FAQs and known issues with identity protection (refreshed) in Azure Active Directory

### Why am I seeing a user with a low (or above) risk score, even if no risky sign-ins or risk events are shown in Identity Protection?

Given the user risk is cumulative in nature and does not expire, a user may have a user risk of low or above even if there are no recent risky sign-ins or risk events shown in Identity Protection. This could happen if the only malicious activity on a user took place beyond the timeframe for which we store the details of risky sign-ins and risk events. We do not expire user risk because bad actors have been known to stay in customers' environment over 140 days behind a compromised identity before ramping up their attack. Customers can review the user's risk timeline to understand why a user is at risk by going to: `Azure Portal > Azure Active Directory > Risky users’ report > Click on an at-risk user > Details’ drawer > Risk history tab`

### Why does a sign-in have a “sign-in risk (aggregate)” score of High when the detections associated with it are of low or medium risk?

The high aggregate risk score could be based on other features of the sign-in, or the fact that more than one detection fired for that sign-in. And conversely, a sign-in may have a sign-in risk (aggregate) of Medium even if the detections associated with the sign-in are of High risk. 
