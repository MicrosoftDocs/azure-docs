<properties 
	pageTitle="Managing Role-Based Access Control with Windows PowerShell" 
	description="Managing role-based access control with Windows PowerShell" 
	services="azure-portal" 
	documentationCenter="na" 
	authors="Justinha" 
	manager="terrylan" 
	editor="mollybos"/>

<tags 
	ms.service="azure-portal" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="powershell" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="11/03/2014" 
	ms.author="justinha"/>

# Managing Role-Based Access Control with Windows PowerShell #

<div class="dev-center-tutorial-selector sublanding"><a href="/documentation/articles/role-based-access-control-powershell.md" title="Windows PowerShell" class="current">Windows PowerShell</a><a href="/documentation/articles/role-based-access-control-xplat-cli.md" title="Cross-Platform CLI">Cross-Platform CLI</a></div>

Role-Based access control (RBAC) in the Azure Portal and Azure Resource Management API allows you to manage access to your subscription at a fine-grained level. With this feature, you can grant access for Active Directory users, groups, or service principals by assigning some roles to them at a particular scope.

In this tutorial, you'll learn how to use Windows PowerShell to manage RBAC. It walks you through the process of creating and checking role assignments.

**Estimated time to complete:** 15 minutes

## Prerequisites ##

Before you can use Windows PowerShell to manage RBAC, you must have the following:

- Windows PowerShell, Version 3.0 or 4.0. To find the version of Windows PowerShell, type:`$PSVersionTable` and verify that the value of `PSVersion` is 3.0 or 4.0. To install a compatible version, see [Windows Management Framework 3.0 ](http://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/download/details.aspx?id=40855).

- Azure PowerShell version 0.8.8 or later. To install the latest version and associate it with your Azure subscription, see [How to install and configure Azure PowerShell](install-configure-powershell.md).

This tutorial is designed for Windows PowerShell beginners, but it assumes that you understand the basic concepts, such as modules, cmdlets, and sessions. For more information about Windows PowerShell, see [Getting Started with Windows PowerShell](http://technet.microsoft.com/library/hh857337.aspx).

To get detailed help for any cmdlet that you see in this tutorial, use the Get-Help cmdlet. 

	Get-Help <cmdlet-name> -Detailed

For example, to get help for the Add-AzureAccount cmdlet, type:

	Get-Help Add-AzureAccount -Detailed

Please also read the following tutorials to get familiar with set up and using Azure Resource Manager in Windows PowerShell:

- [How to install and configure Azure PowerShell](install-configure-powershell.md)
- [Using Windows PowerShell with Resource Manager](powershell-azure-resource-manager.md)

## In this tutorial ##

* [Connect to your subscriptions](#connect)
* [Check existing role assignments](#check)
* [Create a role assignment](#create)
* [Verify permissions](#verify)
* [Next steps](#next)

## <a id="connect"></a>Connect to your subscriptions ##

Since RBAC only works with Azure Resource Manager, the first thing to do is to switch to Azure Resource Manager mode, type:

    PS C:\> Switch-AzureMode -Name AzureResourceManager

For more information, please refer to [Using Windows PowerShell with Resource Manager](powershell-azure-resource-manager.md).

To connect o your Azure subscriptions, type:

    PS C:\> Add-AzureAccount

In the pop-up browser control, enter you Azure account user name and password. PowerShell will get all the subscriptions you have with this account and figure PowerShell to use the first one as default. Notice that with RBAC, you will only be able to get the subscriptions where you have some permissions by either being its co-admin or having some role assignment. 

If you have multiple subscriptions and want to switch to another one, type:

    # This will show you the subscriptions under the account.
    PS C:\> Get-AzureSubscription
    # Use the subscription name to select the one you want to work on.
    PS C:\> Select-AzureSubscription -SubscriptionName <subscription name>

For more information, please refer to [How to install and configure Azure PowerShell](install-configure-powershell.md).

## <a id="check"></a>Check existing role assignments ##

Now let's check what role assignments exist in the subscription already. Type:

    PS C:\> Get-AzureRoleAssignment

This will return all the role assignments in the subscription. Two things to notice:

1. You'll need to have read access at the subscription level.
2. If the subscription has a lot of role assignment, it may take a while to get all of them.

You can also check existing role assignments for a particular role definition, at a particular scope to a particular user. Type:

    PS C:\> Get-AzureRoleAssignment -ResourceGroupName group1 -Mail <user email> -RoleDefinitionName Owner

This will return all the role assignments for a particular user in your AD tenant, who has a role assignment of "Owner" for resource group "group1". The role assignment can come from two places:

1. A role assignment of "Owner" to the user for the resource group.
2. A role assignment of "Owner" to the user for the parent of the resource group (the subscription in this case) because if you have any permission at a certain level, you'll have the same permissions to all its children.

All the parameters of this cmdlet are optional. You can combine them to check role assignments with different filters.

## <a id="create"></a>Create a role assignment ##

To create a role assignment, you need to think about

- Who you want to assign the role to: you can use the following Azure active directory cmdlets to see what users, groups and service principals you have in your AD tenant.

    `PS C:\> Get-AzureADUser
    PS C:\> Get-AzureADGroup
    PS C:\> Get-AzureADGroupMember
    PS C:\> Get-AzureADServicePrincipal` 

- What role you want to assign: you can use the following cmdlet to see the supported role definitions.

    `PS C:\> Get-AzureRoleDefinition`

- What scope you want to assign: you have three levels for scopes

    - The current subscription
    - A resource group, to get a list of resource groups, type `PS C:\> Get-AzureResourceGroup`
    - A resource, to get a list of resources, type `PS C:\> Get-AzureResource`

Then use `New-AzureRoleAssignment` to create a role assignment. For example:

 - This will create a role assignment at the current subscription level for a user as a reader.

    `PS C:\> New-AzureRoleAssignment -Mail <user's email> -RoleDefinitionName Reader`

- This will create a role assignment at a resource group level

    `PS C:\> New-AzureRoleAssignment -Mail <user's email> -RoleDefinitionName Contributor -ResourceGroupName group1`

- This will create a role assignment at a resource level

    `PS C:\> $resources = Get-AzureResource
    PS C:\> New-AzureRoleAssignment -Mail <user's email> -RoleDefinitionName Owner -Scope $resources[0].ResourceId`

## <a id="verify"></a>Verify permissions ##

After you check that your account has some role assignments, you can actually see the permissions these role assignments grant you by running

    PS C:\> Get-AzureResourceGroup
    PS C:\> Get-AzureResource

These two cmdlets will only return the resource groups or resources where you have read permission. And it will show you the permissions you have as well.

Then when you try to run other cmdlet like `New-AzureResourceGroup`, you will get an access denied error if you don't have the permission.

## <a id="next"></a>Next steps ##

To learn more about managing role-based access control with Windows PowerShell, and related topics:
 
- [Role based access control in Azure](role-based-access-control-configure.md)
- [Azure Resource Manager Cmdlets](http://go.microsoft.com/fwlink/?LinkID=394765&clcid=0x409): Learn to use the cmdlets in the AzureResourceManager module.
- [Using Resource groups to manage your Azure resources](azure-preview-portal-using-resource-groups.md): Learn how to create and manage resource groups in the Azure Management Portal.
- [Azure blog](http://blogs.msdn.com/windowsazure): Learn about new features in Azure.
- [Windows PowerShell blog](http://blogs.msdn.com/powershell): Learn about new features in Windows PowerShell.
- ["Hey, Scripting Guy!" Blog](http://blogs.technet.com/b/heyscriptingguy/): Get real-world tips and tricks from the Windows PowerShell community.
- [Configure role based access control using XPLAT CLI](role-based-access-control-xplat-cli.md)
- [Troubleshooting role based access control](role-based-access-control-troubleshooting.md)
