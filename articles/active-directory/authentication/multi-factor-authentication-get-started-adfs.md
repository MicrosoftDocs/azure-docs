---
title: Two-step verification Microsoft Entra multifactor authentication and ADFS
description: This is the Microsoft Entra multifactor authentication page that describes how to get started with Microsoft Entra multifactor authentication and AD FS.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Getting started with Microsoft Entra multifactor authentication and Active Directory Federation Services

<center>

![Microsoft Entra multifactor authentication and ADFS getting started](./media/multi-factor-authentication-get-started-adfs/adfs.png)</center>

If your organization has federated your on-premises Active Directory with Microsoft Entra ID using AD FS, there are two options for using Microsoft Entra multifactor authentication.

* Secure cloud resources using Microsoft Entra multifactor authentication or Active Directory Federation Services
* Secure cloud and on-premises resources using Azure multifactor authentication Server

The following table summarizes the verification experience between securing resources with Microsoft Entra multifactor authentication and AD FS

| Verification Experience - Browser-based Apps | Verification Experience - Non-Browser-based Apps |
|:--- |:--- |
| Securing Microsoft Entra resources using Microsoft Entra multifactor authentication |<li>The first verification step is performed on-premises using AD FS.</li> <li>The second step is a phone-based method carried out using cloud authentication.</li> |
| Securing Microsoft Entra resources using Active Directory Federation Services |<li>The first verification step is performed on-premises using AD FS.</li><li>The second step is performed on-premises by honoring the claim.</li> |

Caveats with app passwords for federated users:

* App passwords are verified using cloud authentication, so they bypass federation. Federation is only actively used when setting up an app password.
* On-premises Client Access Control settings are not honored by app passwords.
* You lose on-premises authentication-logging capability for app passwords.
* Account disable/deletion may take up to three hours for directory sync, delaying disable/deletion of app passwords in the cloud identity.

For information on setting up either Microsoft Entra multifactor authentication or the Azure multifactor authentication Server with AD FS, see the following articles:

* [Secure cloud resources using Microsoft Entra multifactor authentication and AD FS](howto-mfa-adfs.md)
* [Secure cloud and on-premises resources using Azure multifactor authentication Server with Windows Server](howto-mfaserver-adfs-windows-server.md)
* [Secure cloud and on-premises resources using Azure multifactor authentication Server with AD FS 2.0](howto-mfaserver-adfs-2.md)
