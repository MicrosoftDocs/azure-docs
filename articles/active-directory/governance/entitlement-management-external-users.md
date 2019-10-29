---
title: Govern access for external users in Azure AD entitlement management (Preview) - Azure Active Directory
description: Learn about the settings you can specify to govern access for external users in Azure Active Directory entitlement management.
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
ms.date: 10/15/2019
ms.author: ajburnle
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As a administrator, I want understand how I can govern access for external users in entitlement management.

---

# Govern access for external users in Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure AD entitlement management utilizes [Azure AD business-to-business (B2B)](../b2b/what-is-b2b.md) to collaborate with people outside your organization in another directory. With Azure AD B2B, external users authenticate to their home directory, but have a representation in your directory. The representation in your directory enables the user to be assigned access to your resources.

This article describes the settings you can specify to govern access for external users.

## How entitlement management can help

When using the [Azure AD B2B](../b2b/what-is-b2b.md) invite experience, you must already know the email addresses of the external guest users you want to bring into your resource directory and work with. This works great when you're working on a smaller or short-term project and you already know all the participants, but this is harder to manage if you have lots of users you want to work with or if the participants change over time.  For example, you might be working with another organization and have one point of contact with that organization, but over time additional users from that organization will also need access.

With entitlement management, you can define a policy that allows users from organizations you specify to be able to self-request an access package. You can specify whether approval is required and an expiration date for the access. If approval is required, you can also invite one or more users from the external organization to your directory and designate them as approvers - since they are likely to know which external users from their organization need access. Once you have configured the access package, you can send the access package's link to your contact person (sponsor) at the external organization. That contact can share with other users in the external organization, and they can use this link to request the access package. Users from that organization who have already been invited into your directory can also use that link.

When a request is approved, entitlement management will provision the user with the necessary access, which may include inviting the user if they're not already in your directory. Azure AD will automatically create a B2B guest account for them. Note that an administrator may have previously limited which organizations are permitted for collaboration, by setting a [B2B allow or deny list](../b2b/allow-deny-list.md) to allow or block invites to other organizations.  If the user is not permitted by the allow or block list, then they will not be invited.

Since you do not want the external user's access to last forever, you specify an expiration date in the policy, such as 180 days. After 180 days, if their access is not extended, entitlement management will remove all access associated with that access package. By default, if the user who was invited through entitlement management has no other access package assignments, then when they lose their last assignment, their guest account will be blocked from signing in for 30 days, and subsequently removed. This prevents the proliferation of unnecessary accounts. As described in the following sections, these settings are configurable.

## How access works for external users

The following diagram and steps provide an overview of how external users are granted access to an access package.

![Diagram showing the lifecycle of external users](./media/entitlement-management-external-users/external-users-lifecycle.png)

1. You [add a connected organization](entitlement-management-organization.md) for the Azure AD directory or domain you want to collaborate with.

1. You create an access package in your directory that includes a policy [For users not in your directory](entitlement-management-access-package-create.md#for-users-not-in-your-directory).

1. You send a [My Access portal link](entitlement-management-access-package-settings.md) to your contact at the external organization that they can share with their users to request the access package.

1. An external user (**Requestor A** in this example) uses the My Access portal link to [request access](entitlement-management-request-access.md) to the access package. How the user signs in depends on the authentication type of the directory or domain defined in the connected organization.

1. An approver [approves the request](entitlement-management-request-approve.md) (or the request is auto-approved).

1. The request goes into the [delivering state](entitlement-management-process.md).

1. Using the B2B invite process, a guest user account is created in your directory (**Requestor A (Guest)** in this example). If an [allow list or a deny list](../b2b/allow-deny-list.md) is defined, the list setting will be applied.

1. The guest user is assigned access to all of the resources in the access package. It can take some time for changes to be made in Azure AD and to other Microsoft Online Services or connected SaaS applications. For more information, see [When changes are applied](entitlement-management-access-package-resources.md#when-changes-are-applied).

1. The external user receives an email indicating that their access was [delivered](entitlement-management-process.md).

1. To access the resources, the external user can either click the link in the email or attempt to access any of the directory resources directly to complete the invitation process.

1. Depending on the policy settings, as time passes, the access package assignment for the external user expires, and the external user's access is removed.

1. Depending on the lifecycle of external users settings, when the external user no longer has any access package assignments, the external user is blocked from signing in and the guest user account is removed from your directory.

## Manage the lifecycle of external users

You can select what happens when an external user, who was invited to your directory through an access package request being approved, no longer has any access package assignments. This can happen if the user relinquishes all their access package assignments, or their last access package assignment expires. By default, when an external user no longer has any access package assignments, they are blocked from signing in to your directory. After 30 days, their guest user account is removed from your directory.

**Prerequisite role:** Global administrator or User administrator

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, in the **Entitlement management** section, click **Settings**.

1. Click **Edit**.

    ![Settings to manage the lifecycle of external users](./media/entitlement-management-external-users/settings-external-users.png)

1. In the **Manage the lifecycle of external users** section, select the different settings for external users.

1. Once an external user loses their last assignment to any access packages, if you want to block them from signing in to this directory, set the **Block external user from signing in to this directory** to **Yes**.

    > [!NOTE]
    > If a user is blocked from signing in to this directory, then the user will be unable to re-request the access package or request additional access in this directory. Do not configure blocking them from signing in if they will subsequently need to request access to other access packages.

1. Once an external user loses their last assignment to any access packages, if you want to remove their guest user account in this directory, set **Remove external user** to **Yes**.

    > [!NOTE]
    > Entitlement management only removes accounts that were invited through entitlement management. Also, note that a user will be blocked from signing in and removed from this directory even if that user was added to resources in this directory that were not access package assignments. If the guest was present in this directory prior to receiving access package assignments, they will remain. However, if the guest was invited through an access package assignment, and after being invited was also assigned to a OneDrive for Business or SharePoint Online site, they will still be removed.

1. If you want to remove the guest user account in this directory, you can set the number of days before it is removed. If you want to remove the guest user account as soon as they lose their last assignment to any access packages, set **Number of days before removing external user from this directory** to **0**.

1. Click **Save**.

## Enable a catalog for external users

When you create a [new catalog](entitlement-management-catalog-create.md), there is a setting to enable users from external directories to request access packages in the catalog. If you don't want external users to have permissions to request access packages in the catalog, set **Enabled for external users** to **No**.

**Prerequisite role:** Global administrator, User administrator, or Catalog owner

![New catalog pane](./media/entitlement-management-shared/new-catalog.png)

You can also change this setting after you have created the catalog.

![Edit catalog settings](./media/entitlement-management-shared/catalog-edit.png)

## Next steps

- [Add a connected organization](entitlement-management-organization.md)
- [For users not in your directory](entitlement-management-access-package-request-policy.md#for-users-not-in-your-directory)
- [Create and manage a catalog of resources](entitlement-management-catalog-create.md)
