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



This topic provides an overview of data retention for the different activity reports in Azure Active Directory. 

When does the collection of your activity data start?

| Azure AD Edition | Collection Start |
| :--              | :--   |
|Premium and Premium 2 | When you sign-up for a license |
| Free | When you sign on to the Azure portal or the first time you are using the reporting APIs |


When is your activity data available in the Azure portal?

- **Immediately** - If you have already been working with reports in the Azure classic portal
- **Within 2 hours** - If you haven’t turned reporting on  in the Azure classic portal

The collection process for activity data starts when you open the Azure Active Directory blade.

For security signals, the collection process starts when you opt-in to use the Identity Protection Center. 



**Activity reports**	

| Report | Azure AD Free | Azure AD Premium 1 | Azure AD Premium 2 |
| :--    | :--           | :--                | :--                |
| Directory Audit | 7 days | 30 days | 30 days |
| Sign-in Activity |	7 days | 30 days | 30 days |

**Security Signals**

| Report | Azure AD Free | Azure AD Premium 1 | Azure AD Premium 2 |
| :--    | :--           | :--                | :--                |
| Risky sign-ins | 7 days | 30 days | 90 days |


