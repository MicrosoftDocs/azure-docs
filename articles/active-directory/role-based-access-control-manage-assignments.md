<properties
	pageTitle="View Azure resource access assignments | Microsoft Azure"
	description="View and manage all the Role-Based Access Control assignments for any user or group in the Azure portal"
	documentationCenter=""
	authors="kgremban"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="identity"
	ms.date="08/15/2016"
	ms.author="kgremban"/>

# View access assignments for users and groups in the Azure portal

With Role-Based Access Control (RBAC), you can manage access to your Azure resources. Access assigned this way is fine-grained because there are two ways you can restrict the permissions:

- **Scope:** RBAC role assignments are scoped to a specific subscription, resource group, or resource. A user given access to a single resource cannot access any other resources in the same subscription.
- **Role:** Within the scope of the assignment, access is narrowed even further by assigning a role. These can be high-level, like owner, or very specific, like virtual machine reader.

Roles can only be assigned from within the subscription, resource group, or resource that is the scope for the assignment. But you can view and manage all the access assignments for a given user or group in a single place.

Get more information about how to [Use role assignments to manage access to your Azure subscription resources](role-based-access-control-configure.md).

##  View all access assignments

To look up the access assignments for a single user or group, start in Azure Active Directory in the [Azure portal](http://portal.azure.com).

1. Select **Azure Active Directory**. If this option is not visible on your navigation list, select **More Services** and then scroll down to find **Azure Active Directory**.  
2. Select **Users and Groups**, and then either **Users** or **Groups**. For this example, we'll look at individual users.

  ![Manage users and groups in Azure Active Directory - screenshot](./media/role-based-access-control-manages-assignments/rbac_users_groups.png)

3. Search for the user by name or username.  
4. Select **Azure Subscription Resources** on the user blade. All the access assignments for that user appear.

  ![View Azure Subscription Resources assignments - screenshot](./media/role-based-access-control-manages-assignments/azure_subscription_resources.png)

If you think there are additional access assignments that aren't showing up, consider your own access permissions. If you don't have read access for a resource, then you can't see assignments within it.

## Delete access assignments

You can only add or modify assignments in the resource itself, but you can delete access assignments from this view.

1. From the list of all the access assignments for a user or group, select the one you want to delete.  
2. Select **Remove** and then **Yes** to confirm.

  ![Remove access assignment - screenshot](./media/role-based-access-control-manages-assignments/delete_assignment.png)
