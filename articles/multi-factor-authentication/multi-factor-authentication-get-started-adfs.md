---
title: Two-step verification and AD FS - Azure MFA | Microsoft Docs
description: This is the Azure Multi-Factor authentication page that describes how to get started with Azure MFA and AD FS.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: yossib

ms.assetid: 44fbba68-6cf9-46c1-a9df-736580b68ae3
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/23/2017
ms.author: kgremban

---
# Getting started with Azure Multi-Factor Authentication and Active Directory Federation Services
<center>![Cloud](./media/multi-factor-authentication-get-started-adfs/adfs.png)</center>

If your organization has federated your on-premises Active Directory with Azure Active Directory using AD FS, there are two options for using Azure Multi-Factor Authentication.

* Secure cloud resources using Azure Multi-Factor Authentication or Active Directory Federation Services
* Secure cloud and on-premises resources using Azure Multi-Factor Authentication Server

The following table summarizes the verification experience between securing resources with Azure Multi-Factor Authentication and AD FS

| Verification Experience - Browser-based Apps | Verification Experience - Non-Browser-based Apps |
|:--- |:--- |:--- |
| Securing Azure AD resources using Azure Multi-Factor Authentication |<li>The first verification step is performed on-premises using AD FS.</li> <li>The second step is a phone-based method carried out using cloud authentication.</li> |
| Securing Azure AD resources using Active Directory Federation Services |<li>The first verification step is performed on-premises using AD FS.</li><li>The second step is performed on-premises by honoring the claim.</li> |

Caveats with app passwords for federated users:

* App passwords are verified using cloud authentication, so they bypass federation. Federation is only actively used when setting up an app password.
* On-premises Client Access Control settings are not honored by app passwords.
* You lose on-premises authentication-logging capability for app passwords.
* Account disable/deletion may take up to three hours for directory sync, delaying disable/deletion of app passwords in the cloud identity.

## Next steps
For information on setting up either Azure Multi-Factor Authentication or the Azure Multi-Factor Authentication Server with AD FS, see the following articles:

* [Secure cloud resources using Azure Multi-Factor Authentication and AD FS](multi-factor-authentication-get-started-adfs-cloud.md)
* [Secure cloud and on-premises resources using Azure Multi-Factor Authentication Server with Windows Server 2012 R2 AD FS](multi-factor-authentication-get-started-adfs-w2k12.md)
* [Secure cloud and on-premises resources using Azure Multi-Factor Authentication Server with AD FS 2.0](multi-factor-authentication-get-started-adfs-adfs2.md)
