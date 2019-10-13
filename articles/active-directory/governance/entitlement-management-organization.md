---
title: Add a connected organization in Azure AD entitlement management (Preview) - Azure Active Directory
description: Learn how to allow people outside your organization to request access packages so that you can collaborate on projects.
services: active-directory
documentationCenter: ''
author: msaburnley
manager: daveba
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 10/03/2019
ms.author: ajburnle
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As a administrator, I want to allow users in certain partner organizations to request access packages so that our organization can collaborate on projects.

---

# Add a connected organization in Azure AD entitlement management (Preview)

Azure AD entitlement management enables you to collaborate with people outside your organization. If you frequently collaborate with users in an external Azure AD directory or domain, you can add them as a connected organization. A connected organization is an external Azure AD directory or domain that you define in entitlement management.

## Add a connected organization

Follow these steps to add an external Azure AD directory or domain as a connected organization.

**Prerequisite role:** Global administrator, User administrator, or Guest inviter

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Connected organizations** and then click **Add connected organization**.

    ![Identity Governance - Connected organizations - Add connected organization](./media/entitlement-management-organization/connected-organization.png)

1. On the **Basics** tab, enter a display name and description for the organization.

    ![Add connected organization - Basics tab](./media/entitlement-management-organization/organization-basics.png)

1. On the **Directory + domain** tab, click **Add directory + domain** to open the Select directories + domains pane.

1. Type a domain name to search for the Azure AD directory or domain. You must type the entire domain name.

1. Verify it is the correct organization by the provided directory name and initial domain.

    ![Add connected organization - Select directories + domains](./media/entitlement-management-organization/organization-select-directories-domains.png)

1. Click **Add** to add the organization.

    > [!NOTE]
    > All users from the organization will be able to request this access package. This includes users from all subdomains associated with the organization, unless those domains are blocked by the Azure B2B allow or deny list. For more information, see [Allow or block invitations to B2B users from specific organizations](../b2b/allow-deny-list.md).

1. Once you have added all the Azure AD directories and domains you'd like to include, click **Select**.

    The organization appears in the list.

    ![Add connected organization - Directories tab](./media/entitlement-management-organization/organization-directory-domain.png)

1. On the **Sponsors** tab, add optional sponsors for this connected organization.

    Sponsors are internal or external users already in your directory that are the point of contact for the relationship with this connected organization. Internal sponsors are member users in your directory. External sponsors are guest users from the connected organization that were previously invited and are already in your directory. Sponsors can be utilized as approvers when users in this connected organization request access to this access package. For information about how to invite a guest user to your directory, see [Add Azure Active Directory B2B collaboration users in the Azure portal](../b2b/add-users-administrator.md).

    ![Access package - Policy - Add connected organization - Sponsors tab](./media/entitlement-management-organization/organization-sponsors.png)

1. On the **Review + create** tab, review your organization settings and then click **Create**.

    ![Access package - Policy - Add connected organization - Review + create tab](./media/entitlement-management-organization/organization-review-create.png)

## Next steps

- [Add a new policy](entitlement-management-access-package-edit.md#add-a-new-policy)
- [Edit an existing policy](entitlement-management-access-package-edit.md#edit-an-existing-policy)
