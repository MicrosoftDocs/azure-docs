---
title: On-premises Azure AD password protection FAQ
description: On-premises Azure AD password protection FAQ

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: article
ms.date: 10/30/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: jsimmons
---

# Preview: Azure AD password protection on-premises - Frequently asked questions

|     |
| --- |
| Azure AD password protection is a public preview feature of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

## 1. When will Azure AD password protection reach General Availability (GA)?

We have not announced a GA date yet.

## 2. Can DC agents in one forest use a proxy registered in a different, trusted forest?

No. All Azure AD password protection components installed in a given forest are unaware of Azure AD password protection components installed in other forests, regardless of trust relationships.

## 3. Why is DFSR required for sysvol replication?

NT FRS (the predecessor technology to DFSR) has many known problems and is entirely unsupported in newer versions of Windows Server. Zero testing of Azure AD password protection will be done on NTFRS-configured domains. Installation of Azure AD password protection in domains that are using NTFRS may be explicitly blocked in a future release.

## 4. Is there any way to apply Azure AD password protection benefits to a subset of my on-premises users?

No. Once deployed and enabled, Azure AD password protection provides equal security benefits to all users.

## 5. Is there any way to configure a DC agent to use a specific proxy server?

No.

## 6. Is it supported to install Azure AD password protection side-by-side with other password-filter-based products?

Yes. Support for multiple registered password filter dlls is a core Windows feature and not specific to Azure AD password protection.

---
If you have an on-premises Azure AD password protection question that is not answered here, please submit a  Feedback item below - thank you!
---
