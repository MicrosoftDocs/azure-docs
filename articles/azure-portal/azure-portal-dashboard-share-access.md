---
title: Share Azure portal dashboards by using Azure role-based access control
description: This article explains how to share a dashboard in the Azure portal by using Azure role-based access control.
ms.topic: how-to
ms.date: 09/05/2023
---

# Share Azure dashboards by using Azure role-based access control

After configuring a dashboard, you can publish it and share it with other users in your organization. When you share a dashboard, you can control who can view it by using [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md) to assign roles to either a single user or a group of users. You can select a role that allows them only to view the published dashboard, or a role that also allows them to modify it.

> [!TIP]
> Within a dashboard, individual tiles enforce their own access control requirements based on the resources they display. You can share any dashboard broadly, even if some data on specific tiles might not be visible to all users.

## Understand access control for dashboards

From an access control perspective, dashboards are no different from other resources, such as virtual machines or storage accounts. Published dashboards are implemented as Azure resources. Each dashboard exists as a manageable item contained in a resource group within your subscription.

Azure RBAC lets you assign users to roles at four different [levels of scope](/azure/role-based-access-control/scope-overview): management group, subscription, resource group, or resource. Azure RBAC permissions are inherited from higher levels down to the individual resource. In many cases, you may already have users assigned to roles for the subscription that will give them access to the published dashboard.

For example,  users who have the [Owner](/azure/role-based-access-control/built-in-roles#owner) or [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role for a subscription can list, view, create, modify, or delete dashboards within the subscription. Users with a [custom role](/azure/role-based-access-control/custom-roles) that includes the `Microsoft.Portal/Dashboards/Write` permission can also perform these tasks.

Users with the [Reader](/azure/role-based-access-control/built-in-roles#reader) role for the subscription (or a custom role with `Microsoft.Portal/Dashboards/Read` permission) can list and view dashboards within that subscription, but they can't modify or delete them. These users are able to make private copies of dashboards for themselves. They can also make local edits to a published dashboard for their own use, such as when troubleshooting an issue, but they can't publish those changes back to the server.

To expand access to a dashboard beyond the access granted at the subscription level, you can assign permissions to an individual dashboard, or to a resource group that contains several dashboards. For example, if a user should have limited permissions across the subscription, but needs to be able to edit one particular dashboard, you can assign a different role with more permissions (such as [Contributor](/azure/role-based-access-control/built-in-roles#contributor)) for that dashboard only.

> [!IMPORTANT]
> Since individual tiles within a dashboard can enforce their own access control requirements, some users with access to view or edit a dashboard may not be able to see information within specific tiles. To ensure that users can see data within a certain tile, be sure that they have the appropriate permissions for the underlying resources accessed by that tile.

## Publish a dashboard

To share access to a dashboard, you must first publish it. When you do so, other users in your organization will be able to access and modify the dashboard based on their Azure RBAC roles.

1. In the dashboard, select **Share**.

   :::image type="content" source="media/azure-portal-dashboard-share-access/share-dashboard-for-access-control.png" alt-text="Screenshot showing the Share option for an Azure portal dashboard.":::

1. In **Sharing + access control**, select **Publish**.

   :::image type="content" source="media/azure-portal-dashboard-share-access/publish-dashboard-for-access-control.png" alt-text="Screenshot showing how to publish an Azure portal dashboard.":::

    By default, sharing publishes your dashboard to a resource group named **dashboards**. To select a different resource group, clear the checkbox.

1. To [add optional tags](../azure-resource-manager/management/tag-resources.md) to the dashboard, enter one or more name/value pairs.

1. Select **Publish**.

Your dashboard is now published. If the permissions that users inherit from the subscription are sufficient, you don't need to do anything more. Otherwise, read on to learn how to expand access to specific users or groups.

## Assign access to a dashboard

For each dashboard that you have published, you can assign Azure RBAC built-in roles to groups of users (or to individual users). This lets them use that role on the dashboard, even if their subscription-level permissions wouldn't normally allow it.

1. After publishing the dashboard, select **Manage sharing**, then select **Access control**.

   :::image type="content" source="media/azure-portal-dashboard-share-access/manage-sharing-dashboard.png" alt-text="Screenshot showing the Access control option for an Azure portal dashboard.":::

1. In **Access Control**, select **Role assignments** to see existing users that are already assigned a role for this dashboard.

1. To add a new user or group, select **Add** then **Add role assignment**.

   :::image type="content" source="media/azure-portal-dashboard-share-access/manage-users-existing-users.png" alt-text="Screenshot showing how to add a role assignment for an Azure portal dashboard.":::

1. Select the role you want to grant, such as [Contributor](/azure/role-based-access-control/built-in-roles#contributor) or [Reader](/azure/role-based-access-control/built-in-roles#reader), and then select **Next**.

1. Select **Select members**, then select one or more Azure Active Directory (Azure AD) groups and/or users. If you don't see the user or group you're looking for in the list, use the search box. When you have finished, choose **Select**.

1. Select **Review + assign** to complete the assignment.

> [!TIP]
> As noted above, individual tiles within a dashboard can enforce their own access control requirements based on the resources that the tile displays. If users need to see data for a specific tile, be sure that they have the appropriate permissions for the underlying resources accessed by that tile.

## Next steps

* View the list of [Azure built-in roles](../role-based-access-control/built-in-roles.md).
* Learn about [managing groups in Azure AD](../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).
* Learn more about [managing Azure resources by using the Azure portal](../azure-resource-manager/management/manage-resources-portal.md).
* [Create a dashboard](azure-portal-dashboards.md) in the Azure portal.
