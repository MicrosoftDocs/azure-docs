---
title: Convert local guest accounts to Microsoft Entra B2B guest accounts
description: Learn to convert local guests into Microsoft Entra B2B guest accounts by identifying apps and local guest accounts, migration, and more. 
services: active-directory 
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.date: 02/23/2023
ms.topic: how-to
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Convert local guest accounts to Microsoft Entra B2B guest accounts 

With Microsoft Entra ID (Microsoft Entra B2B), external users collaborate with their identities. Although organizations can issue local usernames and passwords to external users, this approach isn't recommended. Microsoft Entra B2B has improved security, lower cost, and less complexity, compared to creating local accounts. In addition, if your organization issues local credentials that external users manage, you can use Microsoft Entra B2B instead. Use the guidance in this document to make the transition.

Learn more: [Plan a Microsoft Entra B2B collaboration deployment](secure-external-access-resources.md)

## Before you begin

This article is number 10 in a series of 10 articles. We recommend you review the articles in order. Go to the **Next steps** section to see the entire series. 

## Identify external-facing applications

Before migrating local accounts to Microsoft Entra B2B, confirm the applications and workloads external users can access. For example, for applications hosted on-premises, validate the application is integrated with Microsoft Entra ID. On-premises applications are a good reason to create local accounts. 

Learn more: [Grant B2B users in Microsoft Entra ID access to your on-premises applications](../external-identities/hybrid-cloud-to-on-premises.md)

We recommend that external-facing applications have single-sign on (SSO) and provisioning integrated with Microsoft Entra ID for the best end user experience.

## Identify local guest accounts

Identify the accounts to be migrated to Microsoft Entra B2B. External identities in Active Directory are identifiable with an attribute-value pair. For example, making ExtensionAttribute15 = `External` for external users. If these users are set up with Microsoft Entra Connect Sync or Microsoft Entra Connect cloud sync, configure synced external users to have the `UserType` attributes set to `Guest`. If the users are set up as cloud-only accounts, you can modify user attributes. Primarily, identify users to convert to B2B.

## Map local guest accounts to external identities

Identify user identities or external emails. Confirm that the local account (v-lakshmi@contoso.com) is a user with the home identity and email address: lakshmi@fabrikam.com. To identify home identities:

- The external user's sponsor provides the information
- The external user provides the information
- Refer to an internal database, if the information is known and stored

After mapping external local accounts to identities, add external identities or email to the user.mail attribute on local accounts.

## End user communications

Notify external users about migration timing. Communicate expectations, for instance when external users must stop using a current password to enable authentication by home and corporate credentials. Communications can include email campaigns and announcements.

<a name='migrate-local-guest-accounts-to-azure-ad-b2b'></a>

## Migrate local guest accounts to Microsoft Entra B2B

After local accounts have user.mail attributes populated with the external identity and email, convert local accounts to Microsoft Entra B2B by inviting the local account. You can use PowerShell or the Microsoft Graph API.

Learn more: [Invite internal users to B2B collaboration](../external-identities/invite-internal-users.md)

## Post-migration considerations

If external user local accounts were synced from on-premises, reduce their on-premises footprint and use B2B guest accounts. You can:

- Transition external user local accounts to Microsoft Entra B2B and stop creating local accounts
  - Invite external users in Microsoft Entra ID
- Randomize external user's local-account passwords to prevent authentication to on-premises resources 
  - This action ensures authentication and user lifecycle is connected to the external user home identity

## Next steps

Use the following series of articles to learn about securing external access to resources. We recommend you follow the listed order.

1. [Determine your security posture for external access with Microsoft Entra ID](1-secure-access-posture.md)

2. [Discover the current state of external collaboration in your organization](2-secure-access-current-state.md)

3. [Create a security plan for external access to resources](3-secure-access-plan.md)

4. [Secure external access with groups in Microsoft Entra ID and Microsoft 365](4-secure-access-groups.md) 

5. [Transition to governed collaboration with Microsoft Entra B2B collaboration](5-secure-access-b2b.md) 

6. [Manage external access with Microsoft Entra entitlement management](6-secure-access-entitlement-managment.md) 

7. [Manage external access to resources with Conditional Access policies](7-secure-access-conditional-access.md) 

8. [Control external access to resources in Microsoft Entra ID with sensitivity labels](8-secure-access-sensitivity-labels.md)

9. [Secure external access to Microsoft Teams, SharePoint, and OneDrive for Business with Microsoft Entra ID](9-secure-access-teams-sharepoint.md) (You're here)

10. [Convert local guest accounts to Microsoft Entra B2B guest accounts](10-secure-local-guest.md) (You're here)
