---
title: Troubleshoot entitlement management
description: Learn about some items you should check to help you troubleshoot Microsoft Entra entitlement management.
services: active-directory
documentationCenter: ''
author: owinfreyatl
manager: amycolannino
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.subservice: compliance
ms.date: 05/31/2023
ms.author: owinfrey
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want checklists and tips to help troubleshoot entitlement management to unblock users from performing their job.

---
# Troubleshoot entitlement management

This article describes some items you should check to help you troubleshoot entitlement management.

## Administration

* If you get an access denied message when configuring entitlement management, and you're a Global administrator, ensure that your directory has an [Microsoft Entra ID P2 or Microsoft Entra ID Governance (or EMS E5) license](entitlement-management-overview.md#license-requirements).  If you've recently renewed an expired Microsoft Entra ID P2 or Microsoft Entra ID Governance subscription, then it may take 8 hours for this license renewal to be visible.

* If your tenant's Microsoft Entra ID P2 or Microsoft Entra ID Governance license has expired, then you won't be able to process new access requests or perform access reviews.  

* If you get an access denied message when creating or viewing access packages, and you're a member of a Catalog creator group, you must [create a catalog](entitlement-management-catalog-create.md) prior to creating your first access package.

## Resources

* Roles for applications are defined by the application itself and are managed in Microsoft Entra ID. If an application doesn't have any resource roles, entitlement management assigns users to a **Default Access** role.

    The Microsoft Entra admin center may also show service principals for services that can't be selected as applications.  In particular, **Exchange Online** and **SharePoint Online** are services, not applications that have resource roles in the directory, so they can't be included in an access package.  Instead, use group-based licensing to establish an appropriate license for a user who needs access to those services.

* Applications that only support Personal Microsoft Account users for authentication, and don't support organizational accounts in your directory, don't have application roles and can't be added to access package catalogs.

* For a group to be a resource in an access package, it must be able to be modifiable in Microsoft Entra ID.  Groups that originate in an on-premises Active Directory can't be assigned as resources because their owner or member attributes can't be changed in Microsoft Entra ID.   Groups that originate in Exchange Online as Distribution groups can't be modified in Microsoft Entra ID either. 

* SharePoint Online document libraries and individual documents can't be added as resources.  Instead, create an [Microsoft Entra security group](../fundamentals/how-to-manage-groups.md), include that group and a site role in the access package, and in SharePoint Online use that group to control access to the document library or document.

* If there are users that have already been assigned to a resource that you want to manage with an access package, be sure that the users are assigned to the access package with an appropriate policy. For example, you might want to include a group in an access package that already has users in the group. If those users in the group require continued access, they must have an appropriate policy for the access packages so that they don't lose their access to the group. You can assign the access package by either asking the users to request the access package containing that resource, or by directly assigning them to the access package. For more information, see [Change request and approval settings for an access package](entitlement-management-access-package-request-policy.md).

* When you remove a member of a team, they're removed from the Microsoft 365 Group as well. Removal from the team's chat functionality might be delayed. For more information, see [Group membership](/microsoftteams/office-365-groups#group-membership).


## Access packages

* If you attempt to delete an access package or policy and see an error message that says there are active assignments, if you don't see any users with assignments, check to see whether any recently deleted users still have assignments. During the 30-day window after a user is deleted, the user account can be restored.   

## External users

* When an external user wants to request access to an access package, make sure they're using the **My Access portal link** for the access package. For more information, see [Share link to request an access package](entitlement-management-access-package-settings.md). If an external user just visits **myaccess.microsoft.com** and doesn't use the full My Access portal link, then they'll see the access packages available to them in their own organization and not in your organization.

* If an external user is unable to request access to an access package or is unable to access resources, be sure to check your [settings for external users](entitlement-management-external-users.md#settings-for-external-users).

* If a new external user that has not previously signed in your directory receives an access package including a SharePoint Online site, their access package will show as not fully delivered until their account is provisioned in SharePoint Online. For more information about sharing settings, see [Review your SharePoint Online external sharing settings](entitlement-management-external-users.md#review-your-sharepoint-online-external-sharing-settings).

## Requests

* When a user wants to request access to an access package, be sure that they're using the **My Access portal link** for the access package. For more information, see [Share link to request an access package](entitlement-management-access-package-settings.md).

* If you open the My Access portal with your browser set to in-private or incognito mode, this might conflict with the sign-in behavior. We recommend that you don't use in-private or incognito mode for your browser when you visit the My Access portal.

* When a user who isn't yet in your directory signs in to the My Access portal to request an access package, be sure they authenticate using their organizational account. The organizational account can be either an account in the resource directory, or in a directory that is included in one of the policies of the access package. If the user's account isn't an organizational account, or the directory where they authenticate isn't included in the policy, then the user won't see the access package. For more information, see [Request access to an access package](entitlement-management-request-access.md).

* If a user is blocked from signing in to the resource directory, they won't be able to request access in the My Access portal. Before the user can request access, you must remove the sign-in block from the user's profile. To remove the sign-in block, in the Microsoft Entra admin center, select **Identity**, select **Users**, select the user, and then select **Profile**. Edit the **Settings** section and change **Block sign in** to **No**. For more information, see [Add or update a user's profile information using Microsoft Entra ID](../fundamentals/how-to-manage-user-profile-info.md).  You can also check if the user was blocked due to an [Identity Protection policy](../identity-protection/howto-identity-protection-remediate-unblock.md).

* In the My Access portal, if a user is both a requestor and an approver, they won't see their request for an access package on the **Approvals** page. This behavior is intentional - a user can't approve their own request. Ensure that the access package they're requesting has additional approvers configured on the policy. For more information, see [Change request and approval settings for an access package](entitlement-management-access-package-request-policy.md).

### View a request's delivery errors

**Prerequisite role:** Global administrator, Identity Governance administrator, Catalog owner, Access package manager or Access package assignment manager

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator).

1. Browse to **Identity governance** > **Entitlement management** > **Access packages**.

1. Select **Requests**.

1. Select the request you want to view.

    If the request has any delivery errors, the request status will be **Undelivered** or **Partially delivered**.

    If there are any delivery errors, a count of delivery errors will be displayed in the request's detail pane.

1. Select the count to see all of the request's delivery errors.

### Reprocess a request

If an error is met after triggering an access package reprocess request, you must wait while the system reprocesses the request. The system tries multiple times to reprocess for several hours, so you can't force reprocessing during this time. 

You can only reprocess a request that has a status of **Delivery failed** or **Partially delivered** and a completed date of less than one week. The **reprocess** button would be grayed out otherwise.

![Reprocess button grayed out](./media/entitlement-management-troubleshoot/cancel-reprocess-grayedout.png)

- If the error is fixed during the trials window, the request status will change to **Delivering**. The request will reprocess without additional actions from the user.

- If the error wasn't fixed during the trials window, the request status may be **Delivery failed** or **partially delivered**. You can then use the **reprocess** button. You'll have seven days to reprocess the request.

**Prerequisite role:** Global administrator, Identity Governance administrator, Catalog owner, Access package manager or Access package assignment manager

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator).

1. Browse to **Identity governance** > **Entitlement management** > **Access packages** to open an access package.

1. Select **Requests**.

1. Select the request you want to reprocess.

1. In the request details pane, select **Reprocess request**.

    ![Reprocess a failed request](./media/entitlement-management-troubleshoot/reprocess-request.png)

### Cancel a pending request

You can only cancel a pending request that hasn't yet been delivered or whose delivery has failed.The **cancel** button would be grayed out otherwise.

**Prerequisite role:** Global administrator, Identity Governance administrator, Catalog owner, Access package manager or Access package assignment manager

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator).

1. Browse to **Identity governance** > **Entitlement management** > **Access packages** to open an access package.

1. Select **Requests**.

1. Select the request you want to cancel.

1. In the request details pane, select **Cancel request**.

## Automatic assignment policies

* Each automatic assignment policy can include at most 5000 users in scope of its rule.  Additional users in scope of the rule may not be assigned access.

## Multiple policies

* Entitlement management follows least privilege best practices. When a user requests access to an access package that has multiple policies that apply, entitlement management includes logic to help ensure stricter or more specific policies are prioritized over generic policies. If a policy is generic, entitlement management might not display the policy to the requestor or might automatically select a stricter policy.

* For example, consider an access package with two policies for internal employees in which both policies apply to the requestor. The first policy is for specific users that include the requestor. The second policy is for all users in a directory that the requestor is a member of. In this scenario, the first policy is automatically selected for the requestor because it's more strict. The requestor isn't given the option to select the second policy.

* When multiple policies apply, the policy that is automatically selected or the policies that are displayed to the requestor is based on the following priority logic:

    | Policy priority | Scope |
    | --- | --- |
    | P1 | Specific users and groups in your directory OR Specific connected organizations |
    | P2 | All members in your directory (excluding guests) |
    | P3 | All users in your directory (including guests) OR Specific connected organizations |
    | P4 | All configured connected organizations OR All users (all connected organizations + any new external users) |
    
    If any policy is in a higher priority category, the lower priority categories are ignored. For an example of how multiple policies with same priority are displayed to the requestor, see [Select a policy](entitlement-management-request-access.md#select-a-policy).

## Next steps

- [Govern access for external users](entitlement-management-external-users.md)
- [View reports of how users got access in entitlement management](entitlement-management-reports.md)
