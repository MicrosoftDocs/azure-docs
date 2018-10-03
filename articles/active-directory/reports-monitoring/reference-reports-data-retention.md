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
ms.date: 05/10/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---
# Azure Active Directory report retention policies


This article provides you with answers to the most common questions in conjunction with the data retention for the different activity reports in Azure Active Directory. 

### Q: How can you get the collection of activity data started?

**A:**

| Azure AD Edition | Collection Start |
| :--              | :--   |
| Azure AD Premium P1 <br /> Azure AD Premium P2 | When you sign up for a subscription |
| Azure AD Free | The first time you open the [Azure Active Directory blade](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) or use the [reporting APIs](https://aka.ms/aadreports)  |

---
### Q: When is your activity data available in the Azure portal?

**A:**

- **Immediately** - If you have already been working with reports in the Azure portal.
- **Within 2 hours** - If you haven’t turned on reporting in the Azure portal.

---

### Q: How can you get the collection of security signals started?  

**A:** For security signals, the collection process starts when you opt-in to use the Identity Protection Center. 


---

### Q: For how long is the collected data stored?

**A:**

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
