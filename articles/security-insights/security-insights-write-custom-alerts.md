---
title: Creating custom alerts in Azure Security Insights | Microsoft Docs
description: This document helps you create custom alerts in Azure Security Insights.
services: security-insights
documentationcenter: na
author: rkarlin
manager: mbaldwin
editor: ''

ms.assetid: 799111d2-2b8b-401f-9eca-95d039119ffd
ms.service: security-insights
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2018
ms.author: rkarlin

---
# Create custom alerts in Azure Security Insights

Create custom alert policies enable security analysts to define alerts based on data that is ingested in Security Insights.
Sample Queries:
1.	Failed/Successful logins
SecurityEvent
| where EventID in (4625,4625) and AccountType == 'User'
| summarize FailedLogon = countif(EventID == 4625), SuccessfulLogon = countif(EventID == 4624) by Account
| order by FailedLogon
1.	Accounts with change or reset password
 	SecurityEvent
 	| where EventID in (4723, 4724)
 	| project AccountsWithChangeOrResetPassword = tolower(TargetAccount)
 	| distinct AccountsWithChangeOrResetPassword



## Next steps
In this document, you learned how to create custom alerts. To learn more about Azure Security Insights, see the following:

* [Azure Security Blog](https://blogs.msdn.com/b/azuresecurity/). Find blog posts about Azure security and compliance.
