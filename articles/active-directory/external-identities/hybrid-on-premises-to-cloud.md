---
title: Sync local partner accounts to cloud as B2B users - Azure AD
description: Give locally-managed external partners access to both local and cloud resources using the same credentials with Azure AD B2B collaboration.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 04/24/2018

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal
ms.custom: "it-pro, seo-update-azuread-jan"
ms.collection: M365-identity-device-management
---

# Grant locally-managed partner accounts access to cloud resources using Azure AD B2B collaboration

Before Azure Active Directory (Azure AD), organizations with on-premises identity systems have traditionally managed partner accounts in their on-premises directory. In such an organization, when you start to move apps to Azure AD, you want to make sure your partners can access the resources they need. It shouldn't matter whether the resources are on-premises or in the cloud. Also, you want your partner users to be able to use the same sign-in credentials for both on-premises and Azure AD resources. 

If you create accounts for your external partners in your on-premises directory (for example, you create an account with a sign-in name of "wmoran" for an external user named Wendy Moran in your partners.contoso.com domain), you can now sync these accounts to the cloud. Specifically, you can use Azure AD Connect to sync the partner accounts to the cloud as Azure AD B2B users (that is, users with UserType = Guest). This enables your partner users to access cloud resources using the same credentials as their local accounts, without giving them more access than they need. 

## Identify unique attributes for UserType

Before you enable synchronization of the UserType attribute, you must first decide how to derive the UserType attribute from on-premises Active Directory. In other words, what parameters in your on-premises environment are unique to your external collaborators? Determine a parameter that distinguishes these external collaborators from members of your own organization.

Two common approaches for this are to:

- Designate an unused on-premises Active Directory attribute (for example, extensionAttribute1) to use as the source attribute. 
- Alternatively, derive the value for UserType attribute from other properties. For example, you want to synchronize all users as Guest if their on-premises Active Directory UserPrincipalName attribute ends with the domain *\@partners.contoso.com*.
 
For detailed attribute requirements, see [Enable synchronization of UserType](../hybrid/how-to-connect-sync-change-the-configuration.md#enable-synchronization-of-usertype). 

## Configure Azure AD Connect to sync users to the cloud

After you identify the unique attribute, you can configure Azure AD Connect to sync these users to the cloud as Azure AD B2B users (that is, users with UserType = Guest). From an authorization point of view, these users are indistinguishable from B2B users created through the Azure AD B2B collaboration invitation process.

For implementation instructions, see [Enable synchronization of UserType](../hybrid/how-to-connect-sync-change-the-configuration.md#enable-synchronization-of-usertype).

## Next steps

- [Azure Active Directory B2B collaboration for hybrid organizations](hybrid-organizations.md)
- [Grant B2B users in Azure AD access to your on-premises applications](hybrid-cloud-to-on-premises.md)
- For an overview of Azure AD Connect, see [Integrate your on-premises directories with Azure Active Directory](../hybrid/whatis-hybrid-identity.md).

