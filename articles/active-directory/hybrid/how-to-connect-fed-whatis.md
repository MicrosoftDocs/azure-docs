---
title: Azure AD Connect and federation | Microsoft Docs
description: This page is the central location for all documentation regarding AD FS operations that use Azure AD Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''
ms.assetid: f9107cf5-0131-499a-9edf-616bf3afef4d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/09/2018
ms.component: hybrid
ms.author: billmath

---
# Azure AD Connect and federation
Azure Active Directory (Azure AD) Connect lets you configure federation with on-premises Active Directory Federation Services (AD FS) and Azure AD. With federation sign-in, you can enable users to sign in to Azure AD-based services with their on-premises passwords--and, while on the corporate network, without having to enter their passwords again. By using the federation option with AD FS, you can deploy a new installation of AD FS, or you can specify an existing installation in a Windows Server 2012 R2 farm.

This topic is the home for information on federation-related functionalities for Azure AD Connect. It lists links to all related topics. For links to Azure AD Connect, see [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).

## Azure AD Connect: federation topics
| Topic | What it covers and when to read it |
|:--- |:--- |
| **Azure AD Connect user sign-in options** | |
| [Understand user sign-in options](plan-connect-user-signin.md) |Learn about various user sign-in options and how they affect the Azure sign-in user experience. |
| **Install AD FS by using Azure AD Connect** | |
| [Prerequisites](how-to-connect-install-custom.md#ad-fs-configuration-pre-requisites) |See the prerequisites for a successful AD FS installation via Azure AD Connect. |
| [Configure an AD FS farm](how-to-connect-install-custom.md#configuring-federation-with-ad-fs) |Install a new AD FS farm by using Azure AD Connect. |
| [Federate with Azure AD using alternate login ID ](how-to-connect-fed-management.md#alternateid) | Configure federation using alternate login ID  |
| **Modify the AD FS configuration** | |
| [Repair the trust](how-to-connect-fed-management.md#repairthetrust) |Repair the current trust between on-premises AD FS and Office 365/Azure. |
| [Add a new AD FS server](how-to-connect-fed-management.md#addadfsserver) |Expand an AD FS farm with an additional AD FS server after initial installation. |
| [Add a new AD FS WAP server](how-to-connect-fed-management.md#addwapserver) |Expand an AD FS farm with an additional Web Application Proxy (WAP) server after initial installation. |
| [Add a new federated domain](how-to-connect-fed-management.md#addfeddomain) |Add another domain to be federated with Azure AD. |
| [Update the SSL certificate](how-to-connect-fed-ssl-update.md)| Update the SSL certificate for an AD FS farm. |
| [Renew federation certificates for Office 365 and Azure AD](how-to-connect-fed-o365-certs.md)|Renew your O365 certificate with Azure AD.|
| **Other federation configuration** | |
| [Federate multiple instances of Azure AD with single instance of AD FS](how-to-connect-fed-single-adfs-multitenant-federation.md) | Federate multiple Azure AD with single AD FS farm| 
| [Add a custom company logo/illustration](how-to-connect-fed-management.md#customlogo) |Modify the sign-in experience by specifying the custom logo that is shown on the AD FS sign-in page. |
| [Add a sign-in description](how-to-connect-fed-management.md#addsignindescription) |Change the sign-in description on the AD FS sign-in page. |
| [Modify AD FS claim rules](how-to-connect-fed-management.md#modclaims) |Modify or add claim rules in AD FS that correspond to Azure AD Connect sync configuration. |


## Additional resources
* [Federating two Azure AD with single AD FS](how-to-connect-fed-single-adfs-multitenant-federation.md)
* [AD FS deployment in Azure](how-to-connect-fed-azure-adfs.md)
* [High-availability cross-geographic AD FS deployment in Azure with Azure Traffic Manager](../active-directory-adfs-in-azure-with-azure-traffic-manager.md)
