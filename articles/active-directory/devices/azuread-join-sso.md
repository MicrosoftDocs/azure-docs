---
title: How SSO to on-premises resources works on Azure AD joined devices | Microsoft Docs
description: Learn how to configure hybrid Azure Active Directory joined devices.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.assetid: 54e1b01b-03ee-4c46-bcf0-e01affc0419d
ms.service: active-directory
ms.component: devices
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/01/2018
ms.author: markvi
ms.reviewer: sandeo

---
# How SSO to on-premises resources works on Azure AD joined devices

It is probably not a surprise that an Azure Active Directory (Azure AD) joined device provides you with a single sign-on (SSO) experience to the cloud apps in your tenant. Azure AD joined devices are not joined to an on-premises Active Directory (AD). However, you can provide these devices with a SSO experience to your on-premises Line Of Business (LOB) apps, file shares, and printers if you need to.

This article explains how this works.

## How it works 


Azure AD joined devices are not joined to an on-premises AD. Hence, these devices have no knowledge about your on-premises environment. However, you can provide additional information to these devices with Azure AD Connect. If your environment has both, an Azure AD and an on-premises AD, it is very likely that you already have Azure AD Connect deployed to synchronize your on-premises identity information to the cloud. As part of the synchronization process, Azure AD Connect synchronizes on-premises domain information to Azure AD. By configuring [domain-based filering](../hybrid/how-to-connect-sync-configure-filtering.md#domain-based-filtering), you ensure that the data about the required domains is synchronized.

When a user signs in to an Azure AD joined device in a hybrid environment, Azure AD also sends the name of the on-premises domain the user is a member of. When the device receives the domain information, the local security authority (LSA) service enables Kerberos authentication. When the user performs an access attempt to a resource in the user's on-premises domain, the device uses the domain information to locate a domain controller (DC). If a DC is detected, the device uses the on-premises domain information and user credentials to authenticate the user with the on-premises DC. 

All apps configured for **Windows Integrated authentication** seamlessly get SSO when a user tries to access them.  

Windows Hello for Business requires additional configuration to enable on-premises SSO from an Azure AD joined device. For more information, see [Configure Azure AD joined devices for On-premises Single-Sign On using Windows Hello for Business](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/hello-hybrid-aadj-sso-base). 
  
 
## What you should know

Because Azure AD joined devices do not have a computer object associated with them in on-premises Active Directory:

- Apps and resources that depend on Active Directory machine authentication do not work 

- Windows object picker does not enumerate the users and objects in Active Directory 




## Next steps

> [!div class="nextstepaction"]
> [Configure hybrid Azure Active Directory join for federated domains](hybrid-azuread-join-federated-domains.md)
> [Configure hybrid Azure Active Directory join for managed domains](hybrid-azuread-join-managed-domains.md)




<!--Image references-->
[1]: ./media/hybrid-azuread-join-plan/12.png
