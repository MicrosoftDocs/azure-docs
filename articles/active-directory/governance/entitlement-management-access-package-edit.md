---
title: Edit and manage an existing access package in Azure AD entitlement management (Preview)
description: #Required; article description that is displayed in search results.
services: active-directory
documentationCenter: ''
author: rolyon
manager: mtillman
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 04/10/2019
ms.author: rolyon
ms.reviewer: 
ms.collection: M365-identity-device-management


#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---
# Edit and manage an existing access package in Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

An access package enables you to do a one-time setup of resources and policies that automatically administers access for the life of the access package. As an access package manager, you can change the resources in an access package at any time without worrying about provisioning the user's access to the new resources, or removing their access from the previous resources. Policies can also be updated at any time, however, the policy changes only affect new accesses.

This article describes how to edit and manage existing access packages.

## Add resource roles

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, open the **Entitlement management** page at [https://aka.ms/elm](https://aka.ms/elm).

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Resource roles**.

1. Click **Add resource roles**.

1. Select the resources you want to add.

1. Select the role.

1. Click **Add**.

Any users with existing assignments to the access package will automatically be given access to this resource role when it is added.

## Remove resource roles

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, open the **Entitlement management** page at [https://aka.ms/elm](https://aka.ms/elm).

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Resource roles**.

1. Click the ellipsis (**...**) and then click **Remove resource role**.

Any users with existing assignments to the access package will automatically have their access revoked to this resource role when it is removed.

## Add a new policy

The way you specify who can request an access package is to create a policy. You can create multiple policies for a single access package if you want to allow different sets of users to be granted assignments with different approval and expiration settings. A single policy cannot be used to assign internal and external users to the same access package. However, you can create two policies in the same access package -- one for internal users and one for external users. If there are multiple policies that apply to a user, they will be prompted at the time of their request to select the policy they would like to be assigned to.

The following diagram shows the high-level process to create a policy for an existing access package.

![Create a policy process](./media/entitlement-management-access-package-edit/policy-process.png)

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, open the **Entitlement management** page at [https://aka.ms/elm](https://aka.ms/elm).

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Policies** and then **Add policy**.

1. Type the a name and a description for the policy.

    ![Create policy with name and description](./media/entitlement-management-access-package-edit/policy-name-description.png)

1. Based on your selection for **Users who can request access**, perform the steps in one of the following policy sections.

### Policy: For users in your directory

Follow these steps if you want your policy to be for users and groups in your directory that can request this access package.

1. In the **Users who can request access** section, select **For users in your directory**.

1. In the **Select users and groups** section, click **Add users and groups**.

1. In the Select users and groups pane, select the users and groups you want to add.

    ![Access package - Policy- Select users and groups](./media/entitlement-management-shared/policy-select-users-groups.png)

1. Click **Select** to add the users and groups.

1. Skip down to the [Policy: Request](#policy-request) section.

### Policy: For users not in your directory

Follow these steps if you want your policy to be for users not in your directory that can request this access package. Directories must be configured to be allowed in the **Organizational relationships collaboration restrictions** settings.

1. In the **Users who can request access** section, select **For users not in your directory**.

1. In the **Select external Azure AD directory** section, click **Add directories**.

1. Enter a domain name and search for an external Azure AD directory.

1. Verify it is the correct directory by the provided directory name and initial domain.

    > [!NOTE]
    > All users from the directory will be able to request this access package. This includes users from all subdomains associated with the directory, not just the domain used in the search.

    ![Access package - Policy- Select directories](./media/entitlement-management-shared/policy-select-directories.png)

1. Click **Add** to add the directory.

1. Repeat this step to add any more directories.

1. Once you have added all directories you'd like to include in the policy, click **Select**.

1. Skip down to the [Policy: Request](#policy-request) section.

### Policy: None (administrator direct assignments only)

Follow these steps if you want your policy to bypass access requests and allow administrators to directly assign specific users to the access package. Users won't have to request the access package. You can still set expiration settings, but there are no request settings.

1. In the **Users who can request access** section, select **None (administrator direct assignments only**.

    After you create the access package, you can directly assign specific internal and external users to the access package. If you specify an external user, a guest user account will be created in your directory.

1. Skip down to the [Policy: Expiration](#policy-expiration) section.

### Policy: Request

In the Request section, you specify approval settings when users request the access package.

1. To require approval for requests from the selected users, set the **Require approval** toggle to **Yes**. To have requests automatically approved, set the toggle to **No**.

1. If you require approval, in the **Select approvers** section, click **Add approvers**.

1. In the Select approvers pane, select one or more users and/or groups to be approvers.

    Only one of the selected approvers needs to approve a request. Approval from all approvers is not required. The approval decision is based on whichever approver reviews the request first.

    ![Access package - Policy- Select approvers](./media/entitlement-management-shared/policy-select-approvers.png)

1. Click **Select** to add the approvers.

1. Click **Show advanced request settings** to show additional settings.

    ![Access package - Policy- Select directories](./media/entitlement-management-shared/policy-advanced-request.png)

1. To require users to provide a justification to request the access package, set **Require justification** to **Yes**.

1. To require the approver to provide a justification to approve a request for the access package, set **Require approver justification** to **Yes**.

1. In the **Approval request timeout (days)** box, specify the amount of time the approvers have to review a request. If no  approvers review it in this amount of days, the request will be cancelled and the user will have to request the access package again.

### Policy: Expiration

In the Expiration section, you specify when a user's assignment to the access package expires.

1. In the **Expiration** section, set **Access package expires** to **On date**, **Number of days**, or **Never**.

    For **On date**, select an expiration date in the future.

    For **Number of days**, specify a number between 0 and 3660 days.

    Based on your selection, a user's assignment to the access package expires on a certain date, a certain number of days after they are approved, or never.

1. Click **Show advanced expiration settings** to show additional settings.

1. To allow user to extend their assignments, set **Allow users to extend access** to **Yes**.

    If extensions are allowed, the user will receive an email 14 and 1 days before their access package assignment is set to expire prompting them to extend the assignment.

    ![Access package - Policy- Expiration settings](./media/entitlement-management-shared/policy-expiration.png)

### Policy: Enable policy

1. If you want the access package to be made immediately available to the users in the policy, click **Yes** to enable the policy.

    You can always enable it in the future after you have finished creating the access package.

    ![Access package - Policy- Enable policy setting](./media/entitlement-management-shared/policy-enable.png)

1. Click **Create** to create the policy.

## Edit an existing policy

You can edit a policy at any time. If you change the expiration date for a policy, the expiration date for requests that are already in a pending approval or approved state will not change.

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, open the **Entitlement management** page at [https://aka.ms/elm](https://aka.ms/elm).

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Policies** and then click the policy you want to edit.

    The **Policy details** pane opens at the bottom of the page.

    ![Access package - Policy details pane](./media/entitlement-management-access-package-edit/policy-details.png)

1. Click **Edit** to edit the policy.

    ![Access package - Edit policy](./media/entitlement-management-access-package-edit/policy-edit.png)

1. When finished, click **Update**.

## Directly assign a user

You can directly assign specific users to an access package if you do not need them to request the access package.

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, open the **Entitlement management** page at [https://aka.ms/elm](https://aka.ms/elm).

1. In the left menu, click **Access packages** and then open the access package.

1. Create a new policy.

1. In the **Users that can request options** section, select **No one (admin direct assignment only)**.

1. Set any expiration settings you like.

1. Go to the access package's **User assignments** page and click **New assignment**.

1. Select the users you want to give an assignment to.

1. Select the policy you created in step 2 that you want the users' assignment to be governed by.

1. Set the date and time you want the users' assignment to start and end. If an end date is not provided, the policy's expiration settings will be implemented.

1. Optionally provide a justification for your direct assignment for record keeping.

## View who has an assignment

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, open the **Entitlement management** page at [https://aka.ms/elm](https://aka.ms/elm).

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Assignments** to see a list of active assignments.

1. Click a specific assignment to see additional details.

1. To see a list of assignments that did not have all resource roles properly provisioned, click the filter status and select **Partially fulfilled**.

    You can see additional details on fulfillment errors by locating the user's corresponding request on the **Requests** page.

1. To see expired assignments, click the filter status and select **Expired**.

1. To download a CSV file of the filtered list, click **Download**.

## View requests

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, open the **Entitlement management** page at [https://aka.ms/elm](https://aka.ms/elm).

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Requests**.

1. Click a specific request to see additional details.

## View a request's fulfillment errors

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, open the **Entitlement management** page at [https://aka.ms/elm](https://aka.ms/elm).

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Requests**.

1. Select the request you want to view.

    If the request has any fulfillment errors, the request status will be **Unfulfilled** and the substatus will be **Partially fulfilled**.

    If there are any fulfillment errors, in the request's detail pane, there will be a count of fulfillment errors.

1. Click the count to see all of the request's fulfillment errors.

## Cancel a pending request

You can only cancel a pending request that has not yet been fulfilled.

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, open the **Entitlement management** page at [https://aka.ms/elm](https://aka.ms/elm).

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Requests**.

1. Click the request you want to cancel

1. In the request details pane, click **Cancel request**.

## Change the Hidden setting

Access packages are discoverable by default. This means that if a policy allows a user to request the access package, they will automatically see the access package listed in their My Access portal.

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, open the **Entitlement management** page at [https://aka.ms/elm](https://aka.ms/elm).

1. In the left menu, click **Access packages** and then open the access package.

1. On the Overview page, click **Edit**.

1. Set the **Hidden** setting.

    If set to **No**, the access package will be listed in the user's My Access portal.

    If set to **Yes**, the access package will not be listed in the user's My Access portal. The only way a user can view the access package is if they have the direct **MyAccess portal link** to the access package.

## Delete

An access package can only be deleted if it has no active user assignments.

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, open the **Entitlement management** page at [https://aka.ms/elm](https://aka.ms/elm).

1. In the left menu, click **Access packages** and then open the access package.

1. On the access package's Overview page, click **Delete**.

## Next steps

- [Manage access for external users](entitlement-management-external-users.md)
