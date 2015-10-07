<properties
	pageTitle="Manage Role Based Access Control (RBAC) with the Azure Portal"
	description="Learn how to manage role-based access (RBAC) with the Azure Portal."
	services="active-directory"
	documentationCenter=""
	authors="IHenkel"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="identity"
	ms.date="10/07/2015"
	ms.author="inhenk"/>

# Manage Role Based Access Control (RBAC) with the Azure Portal
<!-- Azure Selector -->
> [AZURE.SELECTOR]
- [Azure Managment Portal](role-based-access-control-manage-access-azure-portal.md)
- [PowerShell](role-based-access-control-manage-access-powershell.md)
- [Azure CLI](role-based-access-control-manage-access-azure-cli.md)

## View Access
Select access settings in the essentials section of the resource group blade. The **Users** blade lists all users, groups and applications that have been granted access to the resource group.

![](./media/role-based-access-control-manage-access-azure-portal/view-access.png)

> [AZURE.NOTE] Access is either assigned on the resource group or inherited from an assignment on the parent subscription. Classic subscription admins and co-admins are in effect owners of the subscription in the new RBAC model.

## Add Access
1. Click the **Add** icon on the **Users** blade. ![](./media/role-based-access-control-manage-access-azure-portal/grant-access1.png)
2. Select the role that you wish to assign.
3. Search for and select the user, or group, or application that you wish to grant access to.
4. Search the directory for users, groups, and applications using display names, email addresses, and object identifiers.![](./media/role-based-access-control-manage-access-azure-portal/grant-access2.png)

## Remove Access
1. In the **Users** blade, select the role assignment that you wish to remove.
2. Click the **Remove** icon in the assignment details blade.
3. Click **yes** to confirm removal.

![](./media/role-based-access-control-manage-access-azure-portal/remove-access1.png)

> [AZURE.NOTE] Inherited assignments can not be removed from child scopes. Navigate to the parent scope and remove such assignments.

![](./media/role-based-access-control-manage-access-azure-portal/remove-access2.png)

## RBAC Topics
[AZURE.INCLUDE [role-based-access-control-toc.md](../../includes/role-based-access-control-toc.md)]
