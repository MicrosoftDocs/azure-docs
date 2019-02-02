---
title: Collecting data in Azure Security Insights | Microsoft Docs
description: Learn how to collect Active Directory data in Azure Security Insights.
services: security-insights
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: c3df8afb-90d7-459c-a188-c55ba99e7b92
ms.service: security-insights
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 1/30/2019
ms.author: rkarlin

---
# Collecting data from Azure Active Directory

Azure Security Insights enables you to collect data from [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) and stream it into Security Insights. You can choose to stream both [sign-in logs](../active-directory/reports-monitoring/concept-sign-ins.md) and [audit logs](../active-directory/reports-monitoring/concept-audit-logs.md) .

## Prerequisites

- If you want to export sign-in data from Active Directory, you must have an Azure AD P1 or P2 license.

- User with global admin or security admin permissions on the tenant you want to stream the logs from.


## Connect to Azure AD

1. In Azure Security Insights, select **Data collection** and then click the **Azure Active Directory** tile.

2. Next to the logs you want to stream into Security Insights, click **Connect**.






## Next steps
In this document, you learned how to connect Azure AD to Security Insights. To learn more about Security Insights, see the following articles: