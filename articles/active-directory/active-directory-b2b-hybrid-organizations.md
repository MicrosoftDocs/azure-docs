---
title: Azure Active Directory B2B collaboration for hybrid organizations | Microsoft Docs
description: Give partners access to both local and cloud resources with Azure AD B2B collaboration
services: active-directory
documentationcenter: ''
author: twooley
manager: mtillman
editor: ''
tags: ''

ms.service: active-directory
ms.topic: article
ms.workload: identity
ms.date: 12/15/2017
ms.author: twooley
ms.reviewer: sasubram

---

# Azure Active Directory B2B collaboration for hybrid organizations

In a hybrid organization, where you have both on-premises and cloud resources, you might want to give external partners access to both local and cloud resources. For access to local resources, you can manage partner accounts locally in your on-premises Active Directory environment. Partners sign in with their partner account credentials to access your organization's resources. To give partners access to cloud resources using these same credentials, you can now use Azure Active Directory (Azure AD) Connect to sync the partner accounts to the cloud as Azure AD B2B users (that is, users with UserType = Guest).

## Identify unique attributes for UserType

Before you enable synchronization of the UserType attribute, you must first decide how to derive the UserType attribute from on-premises Active Directory. In other words, what parameters in your on-premises environment are unique to your external collaborators? Determine a parameter that distinguishes these external collaborators from members of your own organization.

Two common approaches for this are to:

- Designate an unused on-premises Active Directory attribute (for example, extensionAttribute1) to use as the source attribute. 
- Alternatively, derive the value for UserType attribute from other properties. For example, you want to synchronize all users as Guest if their on-premises Active Directory UserPrincipalName attribute ends with the domain *@partners.fabrikam123.org*.
 
For detailed attribute requirements, see [Enable synchronization of UserType](connect/active-directory-aadconnectsync-change-the-configuration.md#enable-synchronization-of-usertype). 

## Configure Azure AD Connect to sync users to the cloud

After you identify the unique attribute, you can configure Azure AD Connect to sync these users to the cloud as Azure AD B2B users (that is, users with UserType = Guest). From an authorization point of view, these users are indistinguishable from B2B users created through the Azure AD B2B collaboration invitation process.

For implementation instructions, see [Enable synchronization of UserType](connect/active-directory-aadconnectsync-change-the-configuration.md#enable-synchronization-of-usertype).

## Next steps

- For an overview of Azure AD B2B collaboration, see [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
- For an overview of Azure AD Connect, see [Integrate your on-premises directories with Azure Active Directory](connect/active-directory-aadconnect.md).

