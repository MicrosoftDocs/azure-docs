<properties
	pageTitle="Manage Role Based Access Control (RBAC) with Azure CLI"
	description="Learn how to manage role-based access (RBAC) with the Azure command line interface."
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

# Manage Role Based Access Control (RBAC) with the Azure Command Line Interface (CLI)
<!-- Azure Selector -->
> [AZURE.SELECTOR]
- [PowerShell](role-based-access-control-manage-access-powershell.md)
- [Azure CLI](role-based-access-control-manage-access-azure-cli.md)

## List RBAC roles
###	List all available roles
To list all available roles use:

		azure role list

The following example shows the list of *all available roles*.

![](./media/role-based-access-control-manage-access-azure-cli/1-azure-role-list.png)

###	List actions of a role
To list the actions of a role use:

    azure role show <role in quotes>

The following example shows the actions of the *Contributor* and *Virtual Machine Contributor* roles.

![](./media/role-based-access-control-manage-access-azure-cli/1-azure-role-show.png)

##	List access
###	List role assignments effective on a resource group
To list role assignments effective on a resource group  use:

    azure role assignment list --resource-group <resource group name>

The following example shows the role assignments effective on the *pharma-sales-projecforcast* group.

![](./media/role-based-access-control-manage-access-azure-cli/4-azure-role-assignment-list-1.png)

###	List role assignments to a user, including ones assigned to a user's groups

The following example shows the role assignments effective on the pharma-sales-projecforcast group.

![](./media/role-based-access-control-manage-access-azure-cli/4-azure-role-assignment-list-2.png)

##	Grant access
Once you have identified the role you wish to assign, to grant access use:

    azure role assignment create

###	Assign role to group at subscription scope
To assign a role to a group at the subscription scope use:

   azure role assignment create -ObjId  <group's object id> -role <name of role> -scope <subscription/subscription id>

The following example assigns the *Reader* role to *Christine Koch's Team* at the *subscription* scope.

![](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-1.png)

###	Assign role to application at subscription scope
To assign a role to an application at the subscription scope use:

    azure role assignment create -objId  <applications's object id> -role <name of role> -scope <subscription/subscription id>

Following example grants the *Contributor* role to an *Azure AD* application on the selected subscription.

 ![](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-2.png)

###	Assign role to user at resource group scope
To assign a role to a user at the resource group scope use:

    azure role assignment create -signInName  <user's email address> -roleName <name of role in quotes> -resourceGroup <resource group name>

Following example grants the *Virtual Machine Contributor* role to user  *samert@aaddemo.com* at he *Pharma-Sales-ProjectForcast* resource group scope.

![](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-3.png)

###	Assign role to group at resource scope
To assign a role to a group at the resource scope use:

    azure role assignment create -objId  <group id> -roleName <name of role in quotes> -resource-name <resource group name> -resource-type <resource group type> -parent <resource group parent> -resource-group <resource group>

Following example grants the *Virtual Machine Contributor* role to an *Azure AD* group on a *subnet*.

![](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-4.png)

##	Remove access
To remove a role assignment, use:

    azure role assignment delete -objId <object id to from which to remove role> -roleName <role name>

Following example removes the *Virtual Machine Contributor* role assignment from *sammert@aaddemo.com* on the *Pharma-Sales-ProjectForcast* resource group.
Then, it removes the role assignment from a group on the subscription.

![](./media/role-based-access-control-manage-access-azure-cli/3-azure-role-assignment-delete.png)

## RBAC Topics
[AZURE.INCLUDE [role-based-access-control-toc.md](../../includes/role-based-access-control-toc.md)]
