---
title: Azure Active Directory report retention policies | Microsoft Docs
description: Retention policies on report data in your Azure Active Directory
services: active-directory
documentationcenter: ''
author: dhanyahk
manager: femila
editor: ''

ms.assetid: 183e53b0-0647-42e7-8abe-3e9ff424de12
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/30/2016
ms.author: dhanyahk

---
# Azure Active Directory report retention policies
*This documentation is part of the [Azure Active Directory Reporting Guide](active-directory-reporting-guide.md).*



This article provides an overview of data retention for the different Activity reports present in Azure Active Directory. 

For Activity reports, for Premium and Premium 2 customers, we start collecting your activity data as soon as you sign-up for a Premium license. For free customers, we start collecting activity data as soon as you login into the portal or use our reporting APIs for the first time. 

If you had already seeing reports in the Azure Classic portal, you will see your data immediately in the Azure Portal (new). If you haven’t turned on reporting through the old portal and logging into Azure Active Directory in Azure Portal and want to see these activity reports, it may take up 2 hours for you to see the data. We start collecting the data as soon as you log into the Azure Active Directory blade.

For Security signals, we start collecting data as soon as you opt-in to use Identity Protection Center. 



**Activity reports**	

| Report | Azure AD Free | Azure AD Premium 1 | Azure AD Premium 2 |
| :--    | :--           | :--                | :--                |
| Directory Audit | 7 days | 30 days | 30 days |
| Sign-in Activity |	7 days | 30 days | 30 days |

**Security Signals**

| Report | Azure AD Free | Azure AD Premium 1 | Azure AD Premium 2 |
| :--    | :--           | :--                | :--                |
| Users at Risk | 7 days | 30 days | 90 days |
| Risky Log-ins | 7 days | 30 days | 90 days |


