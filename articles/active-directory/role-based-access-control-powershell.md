<properties
	pageTitle="Role-Based Access Control guide for PowerShell"
	description="Managing role-based access control with Windows PowerShell"
	services="active-directory"
	documentationCenter="na"
	authors="kgremban"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="multiple"
	ms.tgt_pltfrm="powershell"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/17/2016"
	ms.author="kgremban"/>

# Role-Based Access Control guide for PowerShell

> [AZURE.SELECTOR]
- [PowerShell](role-based-access-control-powershell.md)
- [Azure CLI](role-based-access-control-xplat-cli.md)


Role-Based Access Control (RBAC) in the Azure Portal and Azure Resource Management API allows you to manage access to your subscription at a fine-grained level. With this feature, you can grant access for Active Directory users, groups, or service principals by assigning some roles to them at a particular scope.

In this tutorial, you'll learn how to use Windows PowerShell to manage RBAC. It walks you through the process of creating and checking role assignments.

**Estimated time to complete:** 15 minutes

## Prerequisites

Before you can use Windows PowerShell to manage RBAC, you must have the following:

- Windows PowerShell, Version 3.0 or 4.0. To find the version of Windows PowerShell, type:`$PSVersionTable` and verify that the value of `PSVersion` is 3.0 or 4.0. To install a compatible version, see [Windows Management Framework 3.0 ](http://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/download/details.aspx?id=40855).

- Azure PowerShell version 0.8.8 or later. To install the latest version and associate it with your Azure subscription, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).

>[AZURE.IMPORTANT] Before you can use the cmdlets in this article, you need to [install the Azure Resource Manager cmdlets](https://msdn.microsoft.com/library/mt125356.aspx) in PowerShell.

This tutorial is designed for Windows PowerShell beginners, but it assumes that you understand the basic concepts, such as modules, cmdlets, and sessions. For more information about Windows PowerShell, see [Getting Started with Windows PowerShell](http://technet.microsoft.com/library/hh857337.aspx).

To get detailed help for any cmdlet that you see in this tutorial, use the `Get-Help` cmdlet.

	Get-Help <cmdlet-name> -Detailed

For example, to get help for the `Add-AzureAccount` cmdlet, type:

	Get-Help Add-AzureAccount -Detailed

Please also read the following tutorials to get familiar with setting up and using Azure Resource Manager in Windows PowerShell:

- [How to install and configure Azure PowerShell](../powershell-install-configure.md)
- [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md)


## Connect to your subscriptions

Since RBAC only works with Azure Resource Manager, the first thing to do is to switch to Azure Resource Manager mode:

    PS C:\> Switch-AzureMode -Name AzureResourceManager

To connect to your Azure subscriptions, type:

    PS C:\> Add-AzureAccount

In the pop-up browser control, enter your Azure account user name and password. PowerShell will get all the subscriptions you have with this account and figure PowerShell to use the first one as default. Notice that with RBAC, you will only be able to get the subscriptions where you have some permissions by either being its co-admin or having some role assignment.

If you have multiple subscriptions and want to switch to another one, use the following commands:

    # This will show you the subscriptions under the account.
    PS C:\> Get-AzureSubscription
    # Use the subscription name to select the one you want to work on.
    PS C:\> Select-AzureSubscription -SubscriptionName <subscription name>

## Check existing role assignments

Now let's check what role assignments exist in the subscription already. Type:

    PS C:\> Get-AzureRoleAssignment

This will return all the role assignments in the subscription. Two things to notice:

1. You need to have read access at the subscription level.
2. If the subscription has a lot of role assignment, it may take a while to get all of them.

You can also check existing role assignments for a particular role definition, at a particular scope, to a particular user. Type:

    PS C:\> Get-AzureRoleAssignment -ResourceGroupName group1 -Mail <user email> -RoleDefinitionName Owner

This will return all the role assignments for a particular user in your AD tenant, who has a role assignment of "Owner" for resource group "group1". The role assignment can come from two places:

1. A role assignment of "Owner" to the user for the resource group.
2. A role assignment of "Owner" to the user for the parent of the resource group (the subscription in this case). If you assign any permission at a parent level, all the children will have the same permissions.

All the parameters of this cmdlet are optional. You can combine them to check role assignments with different filters.

## Create a role assignment

To create a role assignment, you need to think about:

- Who you want to assign the role to: you can use the following Azure active directory cmdlets to see what users, groups and service principals you have in your AD tenant.  

	```
    PS C:\> Get-AzureADUser
	PS C:\> Get-AzureADGroup
	PS C:\> Get-AzureADGroupMember
	PS C:\> Get-AzureADServicePrincipal
	```

- What role you want to assign: you can use the following cmdlet to see the supported role definitions.

    `PS C:\> Get-AzureRoleDefinition`

- What scope you want to assign: you have three levels for scopes
	- The current subscription
	- A resource group. To get a list of resource groups, type `PS C:\> Get-AzureResourceGroup`
	- A resource. To get a list of resources, type `PS C:\> Get-AzureResource`

Then use `New-AzureRoleAssignment` to create a role assignment. For example:

	#Create a role assignment at the current subscription level for a user as a reader.
	PS C:\> New-AzureRoleAssignment -Mail <user email> -RoleDefinitionName Reader

	#Create a role assignment at a resource group level.
	PS C:\> New-AzureRoleAssignment -Mail <user email> -RoleDefinitionName Contributor -ResourceGroupName group1

	#Create a role assignment for a group at a resource group level.
	PS C:\> New-AzureRoleAssignment -ObjectID <group object ID> -RoleDefinitionName Reader -ResourceGroupName group1

	#Create a role assignment at a resource level.
	PS C:\> $resources = Get-AzureResource
    PS C:\> New-AzureRoleAssignment -Mail <user email> -RoleDefinitionName Owner -Scope $resources[0].ResourceId


## Verify permissions

After you check that your account has some role assignments, you can actually see the permissions these role assignments grant you by running:

    PS C:\> Get-AzureResourceGroup
    PS C:\> Get-AzureResource

These two cmdlets will only return the resource groups or resources where you have read permission. And it will show you the permissions you have as well.

Then when you try to run other cmdlets like `New-AzureResourceGroup` you will get an access denied error if you don't have the permission.

## Next steps

To learn more about managing role-based access control with Windows PowerShell, and related topics:

- [Role based access control in Azure](role-based-access-control-configure.md)
- [Azure Resource Manager Cmdlets](http://go.microsoft.com/fwlink/?LinkID=394765&clcid=0x409): Learn to use the cmdlets in the AzureResourceManager module.
- [Using the Azure Portal to manage your Azure resources](../azure-portal/resource-group-portal.md): Learn about Azure Resource Manager.
- [Azure blog](http://blogs.msdn.com/windowsazure): Learn about new features in Azure.
- [Windows PowerShell blog](http://blogs.msdn.com/powershell): Learn about new features in Windows PowerShell.
- ["Hey, Scripting Guy!" Blog](http://blogs.technet.com/b/heyscriptingguy/): Get real-world tips and tricks from the Windows PowerShell community.
- [Configure role based access control using Azure CLI](role-based-access-control-xplat-cli.md)
- [Troubleshooting role based access control](role-based-access-control-troubleshooting.md)
