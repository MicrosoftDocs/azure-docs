---
title: Microsoft Entra Connect and federation
description: This page is the central location for all documentation regarding AD FS operations that use Microsoft Entra Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.assetid: f9107cf5-0131-499a-9edf-616bf3afef4d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Microsoft Entra Connect and federation
Microsoft Entra Connect lets you configure federation with on-premises Active Directory Federation Services (AD FS) and Microsoft Entra ID. With federation sign-in, you can enable users to sign in to Microsoft Entra ID-based services with their on-premises passwords--and, while on the corporate network, without having to enter their passwords again. By using the federation option with AD FS, you can deploy a new installation of AD FS, or you can specify an existing installation in a Windows Server 2012 R2 farm.

This topic is the home for information on federation-related functionalities for Microsoft Entra Connect. It lists links to all related topics. For links to Microsoft Entra Connect, see [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).

<a name='azure-ad-connect-federation-topics'></a>

## Microsoft Entra Connect: federation topics
| Topic | What it covers and when to read it |
|:--- |:--- |
| **Microsoft Entra Connect user sign-in options** | |
| [Understand user sign-in options](plan-connect-user-signin.md) |Learn about various user sign-in options and how they affect the Azure sign-in user experience. |
| **Install AD FS by using Microsoft Entra Connect** | |
| [Prerequisites](how-to-connect-install-custom.md#ad-fs-configuration-prerequisites) |See the prerequisites for a successful AD FS installation via Microsoft Entra Connect. |
| [Configure an AD FS farm](how-to-connect-install-custom.md#configuring-federation-with-ad-fs) |Install a new AD FS farm by using Microsoft Entra Connect. |
| [Federate with Microsoft Entra ID using alternate login ID](how-to-connect-fed-management.md#alternateid) | Configure federation using alternate login ID  |
| **Modify the AD FS configuration** | |
| [Repair the trust](how-to-connect-fed-management.md#repairthetrust) |Repair the current trust between on-premises AD FS and Microsoft 365/Azure. |
| [Add a new AD FS server](how-to-connect-fed-management.md#addadfsserver) |Expand an AD FS farm with an additional AD FS server after initial installation. |
| [Add a new AD FS WAP server](how-to-connect-fed-management.md#addwapserver) |Expand an AD FS farm with an additional Web Application Proxy (WAP) server after initial installation. |
| [Add a new federated domain](how-to-connect-fed-management.md#addfeddomain) |Add another domain to be federated with Microsoft Entra ID. |
| [Update the TLS/SSL certificate](how-to-connect-fed-ssl-update.md)| Update the TLS/SSL certificate for an AD FS farm. |
| [Renew federation certificates for Microsoft 365 and Microsoft Entra ID](how-to-connect-fed-o365-certs.md)|Renew your O365 certificate with Microsoft Entra ID.|
| **Other federation configuration** | |
| [Federate multiple instances of Microsoft Entra ID with single instance of AD FS](how-to-connect-fed-single-adfs-multitenant-federation.md) | Federate multiple Microsoft Entra ID with single AD FS farm| 
| [Add a custom company logo/illustration](how-to-connect-fed-management.md#customlogo) |Modify the sign-in experience by specifying the custom logo that is shown on the AD FS sign-in page. |
| [Add a sign-in description](how-to-connect-fed-management.md#addsignindescription) |Change the sign-in description on the AD FS sign-in page. |
| [Modify AD FS claim rules](how-to-connect-fed-management.md#modclaims) |Modify or add claim rules in AD FS that correspond to Microsoft Entra Connect Sync configuration. |


## Additional resources
* [Federating two Microsoft Entra ID with single AD FS](how-to-connect-fed-single-adfs-multitenant-federation.md)
* [AD FS deployment in Azure](/windows-server/identity/ad-fs/deployment/how-to-connect-fed-azure-adfs)
* [High-availability cross-geographic AD FS deployment in Azure with Azure Traffic Manager](/windows-server/identity/ad-fs/deployment/active-directory-adfs-in-azure-with-azure-traffic-manager)
