<properties
	pageTitle="Manage Role Based Access Control (RBAC) with Azure CLI | Microsoft Azure"
	description="Learn how to manage role-based access (RBAC) with the Azure command line interface by listing roles and role actions, assigning roles to the subscription and application scopes."
	services="active-directory"
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
	ms.date="07/14/2016"
	ms.author="kgremban"/>

# Manage Role-Based Access Control with the Azure Command Line Interface

> [AZURE.SELECTOR]
- [PowerShell](role-based-access-control-manage-access-powershell.md)
- [Azure CLI](role-based-access-control-manage-access-azure-cli.md)
- [REST API](role-based-access-control-manage-access-rest.md)

Role-Based Access Control (RBAC) in the Azure Portal and Azure Resource Manager API allows you to manage access to your subscription and resources at a fine-grained level. With this feature, you can grant access for Active Directory users, groups, or service principals by assigning some roles to them at a particular scope.

Before you can use the Azure CLI to manage RBAC, you must have the following:

- Azure CLI version 0.8.8 or later. To install the latest version and associate it with your Azure subscription, see [Install and Configure the Azure CLI](../xplat-cli-install.md).
- Azure Resource Manager in Azure CLI. Go to [Using the Azure CLI with the Resource Manager](../xplat-cli-azure-resource-manager.md) for more details.

## List roles

###	List all available roles
To list all available roles use:

		azure role list

The following example shows the list of *all available roles*.

![RBAC Azure command line - azure role list - screenshot](./media/role-based-access-control-manage-access-azure-cli/1-azure-role-list.png)

###	List actions of a role
To list the actions of a role use:

    azure role show "<role name>"

The following example shows the actions of the *Contributor* and *Virtual Machine Contributor* roles.

![RBAC Azure command line - azure role show - screenshot](./media/role-based-access-control-manage-access-azure-cli/1-azure-role-show.png)

##	List access
###	List role assignments effective on a resource group
To list the role assignments that exist in a resource group, use:

    azure role assignment list --resource-group <resource group name>

The following example shows the role assignments in the *pharma-sales-projecforcast* group.

![RBAC Azure command line - azure role assignment list by group- screenshot](./media/role-based-access-control-manage-access-azure-cli/4-azure-role-assignment-list-1.png)

###	List role assignments to a user, including ones assigned to a user's groups
To list the role assignments for a specific user, use:

	azure role assignment list --signInName <user email>

You can also see role assignments that are inherited from groups by modifying the command:

	azure role assignment list --expandPrincipalGroups --signInName <user email>

The following example shows the role assignments granted to the user *sameert@aaddemo.com*. This includes roles assigned directly to the user, but also roles inherited from groups.

![RBAC Azure command line - azure role assignment list by user - screenshot](./media/role-based-access-control-manage-access-azure-cli/4-azure-role-assignment-list-2.png)

##	Grant access
Once you have identified the role you wish to assign, to grant access use:

    azure role assignment create

###	Assign role to group at subscription scope
To assign a role to a group at the subscription scope use:

	azure role assignment create --objectId  <group object id> --roleName <name of role> --subscription <subscription> --scope <subscription/subscription id>

The following example assigns the *Reader* role to *Christine Koch's Team* at the *subscription* scope.

![RBAC Azure command line - azure role assignment create by group- screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-1.png)

###	Assign role to application at subscription scope
To assign a role to an application at the subscription scope use:

    azure role assignment create --objectId  <applications object id> --roleName <name of role> --subscription <subscription> --scope <subscription/subscription id>

The following example grants the *Contributor* role to an *Azure AD* application on the selected subscription.

 ![RBAC Azure command line - azure role assignment create by application](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-2.png)

###	Assign role to user at resource group scope
To assign a role to a user at the resource group scope use:

	azure role assignment create --signInName  <user's email address> --subscription <subscription> --roleName <name of role in quotes> --resourceGroup <resource group name>

The following example grants the *Virtual Machine Contributor* role to user *samert@aaddemo.com* at the *Pharma-Sales-ProjectForcast* resource group scope.

![RBAC Azure command line - azure role assignment create by user- screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-3.png)

###	Assign role to group at resource scope
To assign a role to a group at the resource scope use:

    azure role assignment create --objectId <group id> --role "<name of role>" --resource-name <resource group name> --resource-type <resource group type> --parent <resource group parent> --resource-group <resource group>

The following example grants the *Virtual Machine Contributor* role to an *Azure AD* group on a *subnet*.

![RBAC Azure command line - azure role assignment create by group- screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-4.png)

##	Remove access
To remove a role assignment, use:

    azure role assignment delete --objectId <object id to from which to remove role> --roleName "<role name>"

The following example removes the *Virtual Machine Contributor* role assignment from *sammert@aaddemo.com* on the *Pharma-Sales-ProjectForcast* resource group.
Then, it removes the role assignment from a group on the subscription.

![RBAC Azure command line - azure role assignment delete - screenshot](./media/role-based-access-control-manage-access-azure-cli/3-azure-role-assignment-delete.png)

## Create a custom role
To create a custom role, use the command:

	azure role create --inputfile <file path>

The following example creates a custom role called *Virtual Machine Operator* that grants access to all read operations of *Microsoft.Compute*, *Microsoft.Storage*, and *Microsoft.Network* resource providers, and grants access to start, restart, and monitor virtual machines. The custom role can be used in two subscriptions. This example employs a json file as an input.

![JSON - custom role definition - screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-create-1.png)

![RBAC Azure command line - azure role create - screenshot](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-create-2.png)

## Modify a custom role

To modify a custom role first, use the `azure role show` command to retrieve role definition. Then, make desired changes to the role definition file. Finally, use `azure role set` to save the modified role definition.

	azure role set --inputfile <file path>

The following example adds the Microsoft.Insights/diagnosticSettings/* operation to the **Actions**, and an Azure subscription to the **AssignableScopes** of the Virtual Machine Operator custom role.

![JSON - modify custom role definition - screenshot](./media/role-based-access-control-manage-access-azure-cli/3-azure-role-set-1.png)

![RBAC Azure command line - azure role set - screenshot](./media/role-based-access-control-manage-access-azure-cli/3-azure-role-set2.png)

## Delete a custom role

To delete a custom role, first use the `azure role show` command to determine the **Id** of the role. Then, use the `azure role delete` command to delete the role by specifying the **Id**.

The following example removes the *Virtual Machine Operator* custom role.

![RBAC Azure command line - azure role delete - screenshot](./media/role-based-access-control-manage-access-azure-cli/4-azure-role-delete.png)

## List custom roles

To list the roles that are available for assignment at a scope, use the `azure role list` command.

The following example lists all role available for assignment in the selected subscription.

![RBAC Azure command line - azure role list - screenshot](./media/role-based-access-control-manage-access-azure-cli/5-azure-role-list1.png)

In the following example the *Virtual Machine Operator* custom role isn’t available in the *Production4* subscription because that subscription isn’t in the **AssignableScopes** of the role.

![RBAC Azure command line - azure role list for custom roles - screenshot](./media/role-based-access-control-manage-access-azure-cli/5-azure-role-list2.png)





## RBAC Topics
[AZURE.INCLUDE [role-based-access-control-toc.md](../../includes/role-based-access-control-toc.md)]
