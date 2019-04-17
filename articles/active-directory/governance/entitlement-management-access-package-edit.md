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
ms.date: 04/12/2019
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

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Resource roles**.

1. Click **Add resource roles**.

1. Select the resources you want to add.

1. Select the role.

1. Click **Add**.

Any users with existing assignments to the access package will automatically be given access to this resource role when it is added.

## Remove resource roles

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Resource roles**.

1. Click the ellipsis (**...**) and then click **Remove resource role**.

Any users with existing assignments to the access package will automatically have their access revoked to this resource role when it is removed.

## Add a new policy

The way you specify who can request an access package is to create a policy. You can create multiple policies for a single access package if you want to allow different sets of users to be granted assignments with different approval and expiration settings. A single policy cannot be used to assign internal and external users to the same access package. However, you can create two policies in the same access package -- one for internal users and one for external users. If there are multiple policies that apply to a user, they will be prompted at the time of their request to select the policy they would like to be assigned to.

The following diagram shows the high-level process to create a policy for an existing access package.

![Create a policy process](./media/entitlement-management-access-package-edit/policy-process.png)

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Policies** and then **Add policy**.

1. Type the a name and a description for the policy.

    ![Create policy with name and description](./media/entitlement-management-access-package-edit/policy-name-description.png)

1. Based on your selection for **Users who can request access**, perform the steps in one of the following policy sections.

[!INCLUDE [Entitlement management policy](../../../includes/active-directory-entitlement-management-policy.md)]

1. Click **Create** to create the policy.

## Edit an existing policy

You can edit a policy at any time. If you change the expiration date for a policy, the expiration date for requests that are already in a pending approval or approved state will not change.

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

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

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Add a new policy.

1. In the **Users who can request access** section, select **None (administrator direct assignments only)**.

1. Specify expiration settings.

1. Open the **Assignments** page for the access package.

1. Click **New assignment** to open Add user to access package.

    ![Assignments - Add user to access package](./media/entitlement-management-access-package-edit/assignments-add-user.png)

1. Select the users you want to give an assignment to.

1. Select the policy you created in a previous step that you want the users' assignment to be governed by.

1. Set the date and time you want the users' assignment to start and end. If an end date is not provided, the policy's expiration settings will be used.

1. Optionally provide a justification for your direct assignment for record keeping.

1. Click **Add** to directly assign the selected users to the access package.

    After a few moments, click **Refresh** to see the users in the Assignments list.

## View who has an assignment

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Assignments** to see a list of active assignments.

1. Click a specific assignment to see additional details.

1. To see a list of assignments that did not have all resource roles properly provisioned, click the filter status and select **Delivering**.

    You can see additional details on delivery errors by locating the user's corresponding request on the **Requests** page.

1. To see expired assignments, click the filter status and select **Expired**.

1. To download a CSV file of the filtered list, click **Download**.

## View requests

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Requests**.

1. Click a specific request to see additional details.

## View a request's delivery errors

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Requests**.

1. Select the request you want to view.

    If the request has any delivery errors, the request status will be **Undelivered** and the substatus will be **Partially delivered**.

    If there are any delivery errors, in the request's detail pane, there will be a count of delivery errors.

1. Click the count to see all of the request's delivery errors.

## Cancel a pending request

You can only cancel a pending request that has not yet been delivered.

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Requests**.

1. Click the request you want to cancel

1. In the request details pane, click **Cancel request**.

## Change the Hidden setting

Access packages are discoverable by default. This means that if a policy allows a user to request the access package, they will automatically see the access package listed in their My Access portal.

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. On the Overview page, click **Edit**.

1. Set the **Hidden** setting.

    If set to **No**, the access package will be listed in the user's My Access portal.

    If set to **Yes**, the access package will not be listed in the user's My Access portal. The only way a user can view the access package is if they have the direct **MyAccess portal link** to the access package.

## Delete

An access package can only be deleted if it has no active user assignments.

**Prerequisite role:** User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. In the left menu, click **Assignments** and remove access for all users.

1. In the left menu, click **Overview** and then click **Delete**.

1. In the delete message that appears, click **Yes**.

## Next steps

- [Request process and email notifications](entitlement-management-process.md)
- [Manage access for external users](entitlement-management-external-users.md)
