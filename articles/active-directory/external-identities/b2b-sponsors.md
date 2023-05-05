---
title: Add sponsors to a guest user in the Azure portal - Azure AD (preview)
description: Shows how an admin can add sponsors to guest users in Azure Active Directory (Azure AD) B2B collaboration.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 03/16/2023

ms.author: cmulligan
author: csmulligan
manager: celestedg
ms.collection: M365-identity-device-management

# Customer intent: As a tenant administrator, I want to know how to add sponsors to guest users in Azure AD.
---
# Sponsor field for B2B users (preview)

To ensure proper governance of B2B users in their directory, organizations need to have a system in place for tracking who oversees each guest user. This includes identifying someone who can conduct an access review or determine if the user still requires access to the directory. Currently, Entitlement Management provides this capability for guests within specified domains, but it doesn't extend to guests outside of these domains.
By implementing the sponsor feature, you can identify a responsible individual or group for each guest user. This allows you to track who invited the guest user and to help with accountability.

This article provides an overview of the sponsor feature and explains how to use it in B2B scenarios.

## Sponsor field on the user object

The **Sponsor** field on the user object refers to the person or a group who invited the guest user to the organization. You can use this field to track who invited the guest user and to help with accountability.
Being a sponsor doesn't grant administrative powers for the sponsor user or the group, but it can be used for approval processes in Entitlement Management and Access Reviews. You can also use it for custom solutions, but it doesn't provide any other built-in directory powers. 

## Who can be a sponsor?

If you send an invitation to a guest user, you'll automatically become the sponsor of that guest user, unless you specify an other user in the invite process as a sponsor. Your name will be added to the **Sponsor** field on the user object automatically. If you want to add a different sponsor, you can also specify the sponsor user or group when sending an invitation to a guest user.  
You can also assign multiple people or groups when inviting the guest user. You can assign a maximum of five sponsors to a single guest user.
When a sponsor leaves the organization, as part of the offboarding process the tenant administrator can change the **Sponsor** field on the user object to a different person or group. With this transition, they can ensure that the guest user's account remains properly tracked and accounted for.

## Other scenarios using the B2B sponsor feature 

The Azure Active Directory B2B collaboration sponsor feature serves as a foundation for other scenarios that aim to provide a full governance lifecycle for external partners. These scenarios aren't part of the sponsor feature but rely on it for managing guest users:

- The sponsor user can run an access review for a group that includes both guests and members and remove guest user access if no longer needed. Groups can contain many users, and - the group owner may not be aware of all the guests involved.
- Administrators can transfer sponsorship to another user or group, if the guest user starts working on a different project.
- When requesting new access packages, sponsors can be added as approvers to provide additional support in Entitlement Management, which can help reduce the workload on existing reviewers.

## Edit the Sponsor field 

When you invite a guest user, you became their sponsor by default. If you need to manually change the guest user's sponsor, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. Search for and select **Azure Active Directory** from any page.
3. Under **Manage**, select **Users**.
4. In the list, select the user's name to open their user profile
5. Under **Properties** > **Job information** check the **Sponsor** field.
   - *If the guest user already has a sponsor, you can see the sponsor's name.*
   :::image type="content" source="media/b2b-sponsors/sponsor-user-under-properties.png" alt-text="Screenshot of the sponsor user under Properties.":::
   - *If the guest user has multiple sponsors, you can't see the individual names.*
   :::image type="content" source="media/b2b-sponsors/multiple-sponsors-under-properties.png" alt-text="Screenshot of the sponsors under Properties.":::
   
6. Select the **Edit properties** icon.
7. Select the existing sponsors to add or remove users or groups and save the changes.
   :::image type="content" source="media/b2b-sponsors/add-additional-sponsors.png" alt-text="Screenshot of adding or removing sponsors.":::
1. If the guest user doesn't have any sponsors select **Add sponsor**. Once you added sponsor users or groups select **Save**.
   :::image type="content" source="media/b2b-sponsors/add-sponsor.png" alt-text="Screenshot of adding a sponsor.":::
1. Save the changes on the **Job Information** tab. 

## Next steps
- [Add and invite guest users](add-users-administrator.md)
- [Crete a new access package](/azure/active-directory/governance/entitlement-management-access-package-create#approval)
- [Create an access review](/azure/active-directory/governance/create-access-review)
- [Manage user profile info](/azure/active-directory/fundamentals/how-to-manage-user-profile-info)

