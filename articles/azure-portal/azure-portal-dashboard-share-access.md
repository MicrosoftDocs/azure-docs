---
title: Share Azure portal dashboards by using Azure role-based access control
description: This article explains how to share a dashboard in the Azure portal by using Azure role-based access control.
ms.assetid: 8908a6ce-ae0c-4f60-a0c9-b3acfe823365
ms.topic: how-to
ms.date: 10/24/2022
---

# Share Azure dashboards by using Azure role-based access control

After configuring a dashboard, you can publish it and share it with other users in your organization. You allow others to view your dashboard by using [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md) to assign roles to either a single user or a group of users. You can select a role that allows them only to view the published dashboard, or a role that also allows them to modify it.

> [!TIP]
> Within a dashboard, individual tiles enforce their own access control requirements based on the resources they display. You can share any dashboard broadly, even though some data on specific tiles might not be visible to all users.

## Understand access control for dashboards

From an access control perspective, dashboards are no different from other resources, such as virtual machines or storage accounts. Published dashboards are implemented as Azure resources. Each dashboard exists as a manageable item contained in a resource group within your subscription.

Azure RBAC lets you assign users to roles at three different levels of scope:

* subscription
* resource group
* resource

Azure RBAC permissions inherit from the subscription down to the resource. You may already have users assigned to roles for the subscription that apply for the published dashboard.

For example, say you have an Azure subscription and various members of your team have been assigned the roles of Owner, Contributor, or Reader for that subscription. This means that any users who have the Owner or Contributor role can list, view, create, modify, or delete dashboards within the subscription. Users with the Reader role can list and view dashboards, but can't modify or delete them. They can make local edits to a published dashboard for their own use, such as when troubleshooting an issue, but they can't publish those changes back to the server. They can also make a private copy of the dashboard for themselves.

To expand access to a dashboard beyond what is granted at the subscription level, you can assign permissions to a resource group that contains several dashboards, or assign permissions to individual dashboards. For example, if a group of users should have limited permissions across the subscription, but they need to be able to edit one particular dashboard, you can assign those users a different role with more permissions (such as Contributor) for that dashboard only.

## Publish a dashboard

To share access to a dashboard, you must first publish it. When you do so, other users in your organization will be access and modify the dashboard based on their Azure RBAC roles.

1. In the dashboard, select **Share**.

   :::image type="content" source="media/azure-portal-dashboard-share-access/share-dashboard-for-access-control.png" alt-text="Screenshot showing the Share option for an Azure portal dashboard.":::

1. In **Sharing + access control**, select **Publish**.

   :::image type="content" source="media/azure-portal-dashboard-share-access/publish-dashboard-for-access-control.png" alt-text="Screenshot showing how to publish an Azure portal dashboard.":::

    By default, sharing publishes your dashboard to a resource group named **dashboards**. To select a different resource group, clear the checkbox.

1. To [add optional tags](/azure/azure-resource-manager/management/tag-resources) to the dashboard, enter one or more name/value pairs.

1. Select **Publish**.

Your dashboard is now published. If the permissions inherited from the subscription are suitable, you don't need to do anything more. Otherwise, read on to see how to expand access to specific users or groups.

## Assign access to a dashboard

For each dashboard that you have published, you can assign Azure RBAC built-in roles to groups of users (or to individual users). This lets them use that role on the dashboard, even if their subscription-level permissions wouldn't normally allow it.

1. After publishing the dashboard, select **Manage sharing**, then select **Access control**.

1. In **Access Control**, select **Role assignments** to see existing users that are already assigned a role for this dashboard.

1. To add a new user or group, select **Add** then **Add role assignment**.

   :::image type="content" source="media/azure-portal-dashboard-share-access/manage-users-existing-users.png" alt-text="Screenshot showing how to add a role assignment for an Azure portal dashboard.":::

1. Select the role that represents the permissions to grant, such as **Contributor**, and then select **Next**.

1. Select **Select members**, then select one or more Azure Active Directory (Azure AD) groups and/or users. If you don't see the user or group you're looking for in the list, use the search box. When you have finished, choose **Select**.

1. Select **Review + assign** to complete the assignment.

## Next steps

* View the list of [Azure built-in roles](../role-based-access-control/built-in-roles.md).
* Learn about [managing groups in Azure AD](../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).
* Learn more about [managing Azure resources by using the Azure portal](../azure-resource-manager/management/manage-resources-portal.md).
* [Create a dashboard](azure-portal-dashboards.md) in the Azure portal.
