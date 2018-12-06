---
title: Azure Active Directory report retention policies | Microsoft Docs
description: Retention policies on report data in your Azure Active Directory
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: 183e53b0-0647-42e7-8abe-3e9ff424de12
ms.service: active-directory
ms.devlang: 
ms.topic: reference
ms.tgt_pltfrm: 
ms.workload: identity
ms.component: report-monitor
ms.date: 11/13/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---
# Azure Active Directory report retention policies

In this article, you learn about the data retention policies for the different activity reports in Azure Active Directory. 

### When does Azure AD start collecting data?

| Azure AD Edition | Collection Start |
| :--              | :--   |
| Azure AD Premium P1 <br /> Azure AD Premium P2 | When you sign up for a subscription |
| Azure AD Free <br /> Azure AD Basic | The first time you open the [Azure Active Directory blade](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) or use the [reporting APIs](https://aka.ms/aadreports)  |

---

### When is the activity data available in the Azure portal?

- **Immediately** - If you have already been working with reports in the Azure portal.
- **Within 2 hours** - If you haven’t turned on reporting in the Azure portal.

---

### When does Azure AD start collecting security signal data?  

For security signals, the collection process starts when you opt-in to use the **Identity Protection Center**. 

---

### How long does Azure AD store the data?

- **The retention policies for a basic subscription is the same as the free edition.** -

**Activity reports**	

| Report                 | Azure AD Free | Azure AD Premium P1 | Azure AD Premium P2 |
| :--                    | :--           | :--                 | :--                 |
| Directory Audit        | 7 days        | 30 days             | 30 days             |
| Sign-in Activity       | N/A           | 30 days             | 30 days             |
| Azure MFA Usage        | 30 days       | 30 days             | 30 days             |

**Security signals**

| Report         | Azure AD Free | Azure AD Premium P1 | Azure AD Premium P2 |
| :--            | :--           | :--                 | :--                 |
| Users at risk  | 7 days        | 30 days             | 90 days             |
| Risky sign-ins | 7 days        | 30 days             | 90 days             |

---
