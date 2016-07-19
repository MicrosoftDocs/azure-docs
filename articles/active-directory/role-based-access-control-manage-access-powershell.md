<properties
	pageTitle="Manage Role Based Access Control (RBAC) with Azure PowerShell | Microsoft Azure"
	description="How to manage RBAC with Azure PowerShell including listing roles, assigning roles, and deleting role assignments."
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

# Manage Role-Based Access Control with Azure PowerShell

> [AZURE.SELECTOR]
- [PowerShell](role-based-access-control-manage-access-powershell.md)
- [Azure CLI](role-based-access-control-manage-access-azure-cli.md)
- [REST API](role-based-access-control-manage-access-rest.md)


Role-Based Access Control (RBAC) in the Azure Portal and Azure Resource Management API allows you to manage access to your subscription at a fine-grained level. With this feature, you can grant access for Active Directory users, groups, or service principals by assigning some roles to them at a particular scope.

Before you can use PowerShell to manage RBAC, you must have the following:

- Azure PowerShell version 0.8.8 or later. To install the latest version and associate it with your Azure subscription, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).

- Azure Resource Manager cmdlets. Install the [Azure Resource Manager cmdlets](https://msdn.microsoft.com/library/mt125356.aspx) in PowerShell.

## List roles

### List all available roles
To list RBAC roles available for assignment and to inspect the operations to which they grant access use:

		Get-AzureRmRoleDefinition

![RBAC PowerShell - Get-AzureRmRoleDefinition - screenshot](./media/role-based-access-control-manage-access-powershell/1-get-azure-rm-role-definition1.png)

### List actions of a role
To list the actions for a specific role use:

    Get-AzureRmRoleDefinition <role name>

![RBAC PowerShell - Get-AzureRmRoleDefinition for a specific role - screenshot](./media/role-based-access-control-manage-access-powershell/1-get-azure-rm-role-definition2.png)

## See who has access
To list RBAC access assignments use:

    Get-AzureRmRoleAssignment

###	List role assignments at a specific scope
You can see all the access assignments for a specified subscription, resource group, or resource. For example, to see the all the active assignments for a resource group use:

    Get-AzureRmRoleAssignment -ResourceGroupName <resource group name>

![RBAC PowerShell - Get-AzureRmRoleAssignment for a resource group - screenshot](./media/role-based-access-control-manage-access-powershell/4-get-azure-rm-role-assignment1.png)

### List roles assigned to a user
To list all the roles assigned to a specified user, including the roles assigned to the groups he belongs to, use:

    Get-AzureRmRoleAssignment -SignInName <User email> -ExpandPrincipalGroups

![RBAC PowerShell - Get-AzureRmRoleAssignment for a user - screenshot](./media/role-based-access-control-manage-access-powershell/4-get-azure-rm-role-assignment2.png)

### List classic service administrator and co-admin role assignments
To list access assignments for the classic subscription administrator and co-administrators use:

    Get-AzureRmRoleAssignment -IncludeClassicAdministrators

## Grant access
### Search for object IDs
In order to assign a role, you need to identify both the object (user, group, or application) and the scope.

If you don't know the subscription ID, you can find it in the **Subscriptions** blade on the Azure portal. Or, learn how to query for it with [Get-AzureSubscription](https://msdn.microsoft.com/library/dn495302.aspx) on MSDN.

To get the object ID for an Azure AD Group use:

    Get-AzureRmADGroup -SearchString <group name in quotes>

To get the object ID for an Azure AD Service Principal, or application, use:

    Get-AzureRmADServicePrincipal -SearchString <service name in quotes>

### Assign role to application at subscription scope
To grant access to an application at subscription scope use:

    New-AzureRmRoleAssignment -ObjectId <application id> -RoleDefinitionName <role name in quotes> -Scope <subscription id>

![RBAC PowerShell - New-AzureRmRoleAssignment - screenshot](./media/role-based-access-control-manage-access-powershell/2-new-azure-rm-role-assignment2.png)

### Assign role to user at resource group scope
To grant access to a user at resource group scope:

    New-AzureRmRoleAssignment -SignInName <email of user> -RoleDefinitionName <role name in quotes> -ResourceGroupName <resource group name>

![RBAC PowerShell - New-AzureRmRoleAssignment - screenshot](./media/role-based-access-control-manage-access-powershell/2-new-azure-rm-role-assignment3.png)

### Assign role to group at resource scope
To grant access to a group at the resource scope use:

    New-AzureRmRoleAssignment -ObjectId <object id> -RoleDefinitionName <role name in quotes> -ResourceName <resource name> -ResourceType <resource type> -ParentResource <parent resource> -ResourceGroupName <resource group name>

![RBAC PowerShell - New-AzureRmRoleAssignment - screenshot](./media/role-based-access-control-manage-access-powershell/2-new-azure-rm-role-assignment4.png)

## Remove access
To remove access for users, groups and applications use:

    Remove-AzureRmRoleAssignment -ObjectId <object id> -RoleDefinitionName <role name> -Scope <scope such as subscription id>

![RBAC PowerShell - Remove-AzureRmRoleAssignment - screenshot](./media/role-based-access-control-manage-access-powershell/3-remove-azure-rm-role-assignment.png)

## Create custom role
To create a custom role, use the `New-AzureRmRoleDefinition` command.

When you create a custom role in PowerShell, you need to start with one of the [built-in roles](role-based-access-built-in-roles.md). Edit the attributes and add whatever Actions, notActions, or scopes you want, and then save the changes as a new role.

The following example starts with the role *Virtual Machine Contributor* and uses that to create a custom role called *Virtual Machine Operator*. The new role grants access to all read operations of *Microsoft.Compute*, *Microsoft.Storage*, and *Microsoft.Network* resource providers, and grants access to start, restart, and monitor virtual machines. The custom role can be used in two subscriptions.

![RBAC PowerShell - Get-AzureRmRoleDefinition - screenshot](./media/role-based-access-control-manage-access-powershell/2-new-azurermroledefinition.png)

## Modify a custom role
To modify a custom role first, use the `Get-AzureRmRoleDefinition` command to retrieve role definition. Then, make desired changes to the role definition. Finally, use `Set-AzureRmRoleDefinition` command to save the modified role definition.

The following example adds the `Microsoft.Insights/diagnosticSettings/*` operation to the *Virtual Machine Operator* custom role.

![RBAC PowerShell - Set-AzureRmRoleDefinition - screenshot](./media/role-based-access-control-manage-access-powershell/3-set-azurermroledefinition-1.png)

The following example adds an Azure subscription to the assignable scopes of the Virtual Machine Operator custom role.

![RBAC PowerShell - Set-AzureRmRoleDefinition - screenshot](./media/role-based-access-control-manage-access-powershell/3-set-azurermroledefinition-2.png)

## Delete a custom role

To delete a custom role, use the `Remove-AzureRmRoleDefinition` command.

The following example removes the *Virtual Machine Operator* custom role.

![RBAC PowerShell - Remove-AzureRmRoleDefinition - screenshot](./media/role-based-access-control-manage-access-powershell/4-remove-azurermroledefinition.png)

## List custom roles
To list the roles that are available for assignment at a scope, use the `Get-AzureRmRoleDefinition` command.

The following example lists all role available for assignment in the selected subscription.

![RBAC PowerShell - Get-AzureRmRoleDefinition - screenshot](./media/role-based-access-control-manage-access-powershell/5-get-azurermroledefinition-1.png)

In the following example, the *Virtual Machine Operator* custom role isn’t available in the *Production4* subscription because that subscription isn’t in the **AssignableScopes** of the role.

![RBAC PowerShell - Get-AzureRmRoleDefinition - screenshot](./media/role-based-access-control-manage-access-powershell/5-get-azurermroledefinition2.png)

## See also
- [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md)
[AZURE.INCLUDE [role-based-access-control-toc.md](../../includes/role-based-access-control-toc.md)]
