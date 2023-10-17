---
title: Sync local partner accounts to cloud as B2B users
description: Give locally managed external partners access to both local and cloud resources using the same credentials with Microsoft Entra B2B collaboration.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 10/04/2023

ms.author: cmulligan
author: csmulligan
manager: celestedg
ms.custom: "it-pro, seo-update-azuread-jan"
ms.collection: M365-identity-device-management

# Customer intent: As a tenant administrator, I want to enable locally-managed external partners' access to both local and cloud resources via the Microsoft Entra B2B collaboration.
---

# Grant locally managed partner accounts access to cloud resources using Microsoft Entra B2B collaboration

Before Microsoft Entra ID, organizations with on-premises identity systems have traditionally managed partner accounts in their on-premises directory. In such an organization, when you start to move apps to Microsoft Entra ID, you want to make sure your partners can access the resources they need. It shouldn't matter whether the resources are on-premises or in the cloud. Also, you want your partner users to be able to use the same sign-in credentials for both on-premises and Microsoft Entra resources. 

If you create accounts for your external partners in your on-premises directory (for example, you create an account with a sign-in name of "msullivan" for an external user named Maria Sullivan in your partners.contoso.com domain), you can now sync these accounts to the cloud. Specifically, you can use [Microsoft Entra Connect](../hybrid/connect/whatis-azure-ad-connect.md) to sync the partner accounts to the cloud, which creates a user account with UserType = Guest. This enables your partner users to access cloud resources using the same credentials as their local accounts, without giving them more access than they need. For more information about converting local guest accounts see [Convert local guest accounts to Microsoft Entra B2B guest accounts](/azure/active-directory/architecture/10-secure-local-guest). 

> [!NOTE]
> See also how to [invite internal users to B2B collaboration](invite-internal-users.md). With this feature, you can invite internal guest users to use B2B collaboration, regardless of whether you've synced their accounts from your on-premises directory to the cloud. Once the user accepts the invitation to use B2B collaboration, they'll be able to use their own identities and credentials to sign in to the resources you want them to access. You won’t need to maintain passwords or manage account lifecycles. 

## Identify unique attributes for UserType

Before you enable synchronization of the UserType attribute, you must first decide how to derive the UserType attribute from on-premises Active Directory. In other words, what parameters in your on-premises environment are unique to your external collaborators? Determine a parameter that distinguishes these external collaborators from members of your own organization.

Two common approaches for this are to:

- Designate an unused on-premises Active Directory attribute (for example, extensionAttribute1) to use as the source attribute. 
- Alternatively, derive the value for UserType attribute from other properties. For example, you want to synchronize all users as Guest if their on-premises Active Directory UserPrincipalName attribute ends with the domain *\@partners.contoso.com*.
 
For detailed attribute requirements, see [Enable synchronization of UserType](../hybrid/connect/how-to-connect-sync-change-the-configuration.md#enable-synchronization-of-usertype). 

<a name='configure-azure-ad-connect-to-sync-users-to-the-cloud'></a>

## Configure Microsoft Entra Connect to sync users to the cloud

After you identify the unique attribute, you can configure Microsoft Entra Connect to sync these users to the cloud, which creates a user account with UserType = Guest. From an authorization point of view, these users are indistinguishable from B2B users created through the Microsoft Entra B2B collaboration invitation process.

For implementation instructions, see [Enable synchronization of UserType](../hybrid/connect/how-to-connect-sync-change-the-configuration.md#enable-synchronization-of-usertype).

## Next steps

- [Microsoft Entra B2B collaboration for hybrid organizations](hybrid-organizations.md)
- [Grant B2B users in Microsoft Entra ID access to your on-premises applications](hybrid-cloud-to-on-premises.md)

