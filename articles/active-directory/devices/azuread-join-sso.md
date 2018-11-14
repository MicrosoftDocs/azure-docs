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

It is probably not a surprise that an Azure Active Directory (Azure AD) joined device provides you with a single sign-on (SSO) experience to the cloud apps in your tenant. If your environment also has an on-premises Active Directory (AD), you can also provide these devices with an SSO experience to it.

This article explains how this works.

## How it works 

Because you need to remember just one single user name and password, SSO simplifies access to your resources and improves the security of your environment. With an Azure AD joined device, your users already have an SSO experience to the cloud apps in your environment. If your environment has in addition to Azure AD also an on-premises AD, you probably want to expand the scope of your SSO experience to your on-premises Line Of Business (LOB) apps, file shares, and printers.  


Azure AD joined devices have no knowledge about your on-premises AD environment because they aren't joined it. However, you can provide additional information about your on-premises AD to these devices with Azure AD Connect.
An environment that has both, an Azure AD and an on-premises AD, is also known has hybrid environment. If you have an hybrid environment, it is very likely that you already have Azure AD Connect deployed to synchronize your on-premises identity information to the cloud. As part of the synchronization process, Azure AD Connect synchronizes on-premises domain information to Azure AD. When a user signs in to an Azure AD joined device in a hybrid environment:

1. Azure AD sends the name of the on-premises domain the user is a member of back to the device. 

2. The local security authority (LSA) service enables Kerberos authentication on the device.

During an access attempt to a resource in the user's on-premises domain, the device:

1. Uses the domain information to locate a domain controller (DC). 

2. Sends the on-premises domain information and user credentials to the located DC to get the user authenticated.

3. Receives a Kerberos [Ticket-Granting Ticket (TGT)](https://docs.microsoft.com/windows/desktop/secauthn/ticket-granting-tickets) that is used to access AD-joined resources.

All apps that are configured for **Windows Integrated authentication** seamlessly get SSO when a user tries to access them.  

Windows Hello for Business requires additional configuration to enable on-premises SSO from an Azure AD joined device. For more information, see [Configure Azure AD joined devices for On-premises Single-Sign On using Windows Hello for Business](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/hello-hybrid-aadj-sso-base). 

 
## What you should know

Because Azure AD joined devices do not have a computer object associated with them in on-premises Active Directory:

- You might have to adjust your [domain-based filtering](../hybrid/how-to-connect-sync-configure-filtering.md#domain-based-filtering) in Azure AD Connect to ensure that the data about the required domains is synchronized.

- Apps and resources that depend on Active Directory machine authentication do not work. 

- Windows object picker does not enumerate the users and objects in Active Directory. 




## Next steps

> [!div class="nextstepaction"]
> [Configure hybrid Azure Active Directory join for federated domains](hybrid-azuread-join-federated-domains.md)
> [Configure hybrid Azure Active Directory join for managed domains](hybrid-azuread-join-managed-domains.md)




<!--Image references-->
[1]: ./media/hybrid-azuread-join-plan/12.png
