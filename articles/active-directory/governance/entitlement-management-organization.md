---
title: Add a connected organization in Azure AD entitlement management - Azure Active Directory
description: Learn how to allow people outside your organization to request access packages so that you can collaborate on projects.
services: active-directory
documentationCenter: ''
author: barclayn
manager: daveba
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 03/22/2020
ms.author: barclayn
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want to allow users in certain partner organizations to request access packages so that our organizations can collaborate on projects.

---

# Add a connected organization in Azure AD entitlement management

With Azure Active Directory (Azure AD) entitlement management, you can collaborate with people outside your organization. If you frequently collaborate with users in an external Azure AD directory or domain, you can add them as a connected organization. This article describes how to add a connected organization so that you can allow users outside your organization to request resources in your directory.

## What is a connected organization?

A connected organization is an external Azure AD directory or domain that you have a relationship with.

For example, suppose you work at Woodgrove Bank and you want to collaborate with two external organizations. These two organizations have different configurations:

- Graphic Design Institute uses Azure AD, and their users have a user principal name that ends with *graphicdesigninstitute.com*.
- Contoso does not yet use Azure AD. Contoso users have a user principal name that ends with *contoso.com*.

In this case, you can configure two connected organizations. You create one connected organization for Graphic Design Institute and one for Contoso. If you then add the two connected organizations to a policy, users from each organization with a user principal name that matches the policy can request access packages. Users with a user principal name that has a domain of *graphicdesigninstitute.com* would match the Graphic Design Institute-connected organization and be allowed to submit requests. Users with a user principal name that has a domain of *contoso.com* would match the Contoso-connected organization and would also be allowed to request packages. And, because Graphic Design Institute uses Azure AD, any users with a principal name that matches a [verified domain](../fundamentals/add-custom-domain.md#verify-your-custom-domain-name) that's added to their tenant, such as *graphicdesigninstitute.example*, would also be able to request access packages by using the same policy.

![Connected organization example](./media/entitlement-management-organization/connected-organization-example.png)

How users from the Azure AD directory or domain authenticate depends on the authentication type. The authentication types for connected organizations are:

- Azure AD
- [Direct federation](../b2b/direct-federation.md)
- [One-time passcode](../b2b/one-time-passcode.md) (domain)

For a demonstration of how to add a connected organization, watch the following video:

>[!VIDEO https://www.microsoft.com/videoplayer/embed/RE4dskS]

## Add a connected organization

To add an external Azure AD directory or domain as a connected organization, follow the instructions in this section.

**Prerequisite role**: *Global administrator*, *User administrator*, or *Guest inviter*

1. In the Azure portal, select **Azure Active Directory**, and then select **Identity Governance**.

1. In the left pane, select **Connected organizations**, and then select **Add connected organization**.

    ![The "Add connected organization" button](./media/entitlement-management-organization/connected-organization.png)

1. Select the **Basics** tab, and then enter a display name and description for the organization.

    ![The "Add connected organization" Basics pane](./media/entitlement-management-organization/organization-basics.png)

1. Select the **Directory + domain** tab, and then select **Add directory + domain**.

    The **Select directories + domains** pane opens.

1. In the search box, enter a domain name to search for the Azure AD directory or domain. Be sure to enter the entire domain name.

1. Verify that the organization name and authentication type are correct. How users sign in depends on the authentication type.

    ![The "Select directories + domains" pane](./media/entitlement-management-organization/organization-select-directories-domains.png)

1. Select **Add** to add the Azure AD directory or domain. Currently, you can add only one Azure AD directory or domain per connected organization.

    > [!NOTE]
    > All users from the Azure AD directory or domain will be able to request this access package. This includes users in Azure AD from all subdomains associated with the directory, unless those domains are blocked by the Azure AD business to business (B2B) allow or deny list. For more information, see [Allow or block invitations to B2B users from specific organizations](../b2b/allow-deny-list.md).

1. After you've added the Azure AD directory or domain, select **Select**.

    The organization appears in the list.

    ![The "Directory + domain" pane](./media/entitlement-management-organization/organization-directory-domain.png)

1. Select the **Sponsors** tab, and then add optional sponsors for this connected organization.

    Sponsors are internal or external users already in your directory that are the point of contact for the relationship with this connected organization. Internal sponsors are member users in your directory. External sponsors are guest users from the connected organization that were previously invited and are already in your directory. Sponsors can be utilized as approvers when users in this connected organization request access to this access package. For information about how to invite a guest user to your directory, see [Add Azure Active Directory B2B collaboration users in the Azure portal](../b2b/add-users-administrator.md).

    When you select **Add/Remove**, a pane opens in which you can choose internal or external sponsors. The pane displays an unfiltered list of users and groups in your directory.

    ![The Sponsors pane](./media/entitlement-management-organization/organization-sponsors.png)

1. Select the **Review + create** tab, review your organization settings, and then select **Create**.

    ![The "Review + create" pane](./media/entitlement-management-organization/organization-review-create.png)

## Update a connected organization 

If the connected organization changes to a different domain, the organization's name changes, or you want to change the sponsors, you can update the connected organization by following the instructions in this section.

**Prerequisite role**: *Global administrator*, *User administrator*, or *Guest inviter*

1. In the Azure portal, select **Azure Active Directory**, and then select **Identity Governance**.

1. In the left pane, select **Connected organizations**, and then select the connected organization to open it.

1. In the connected organization's overview pane, select **Edit** to change the organization name or description.  

1. In the **Directory + domain** pane, select **Update directory + domain** to change to a different directory or domain.

1. In the **Sponsors** pane, select **Add internal sponsors** or **Add external sponsors** to add a user as a sponsor. To remove a sponsor, select the sponsor and, in the right pane, select **Delete**.


## Delete a connected organization

If you no longer have a relationship with an external Azure AD directory or domain, you can delete the connected organization.

**Prerequisite role**: *Global administrator*, *User administrator*, or *Guest inviter*

1. In the Azure portal, select **Azure Active Directory**, and then select **Identity Governance**.

1. In the left pane, select **Connected organizations**, and then select the connected organization to open it.

1. In the connected organization's overview pane, select **Delete** to delete it.

    Currently, you can delete a connected organization only if there are no connected users.

    ![The connected organization Delete button](./media/entitlement-management-organization/organization-delete.png)

## Next steps

- [Govern access for external users](https://docs.microsoft.com/azure/active-directory/governance/entitlement-management-external-users)
- [Govern access for users not in your directory](entitlement-management-access-package-request-policy.md#for-users-not-in-your-directory)
