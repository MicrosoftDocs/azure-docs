<properties 
	pageTitle="Managing Role-Based Access Control with Azure Cross-Platform Command-Line Interface" 
	description="Managing role-based access control with cross-platform command-line interface" 
	services="azure-portal" 
	documentationCenter="na" 
	authors="Justinha" 
	manager="terrylan" 
	editor="mollybos"/>

<tags 
	ms.service="azure-portal" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="command-line-interface" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="11/03/2014" 
	ms.author="justinha"/>

# Managing Role-Based Access Control with Cross-Platform Command-Line Interface #

<div class="dev-center-tutorial-selector sublanding"><a href="/documentation/articles/role-based-access-control-powershell.md" title="Windows PowerShell" class="current">Windows PowerShell</a><a href="/documentation/articles/role-based-access-control-xplat-cli.md" title="Cross-Platform CLI">Cross-Platform CLI</a></div>

Role-Based access control (RBAC) in Azure Portal and Azure Resource Manager API allows you to manage access to your subscription and resources at a fine-grained level. With this feature, you can grant access for Active Directory users, groups, or service principals by assigning some roles to them at a particular scope.

In this tutorial, you'll learn how to use Azure Cross-Platform Command-Line Interface (xplat-cli) to manage role based access control. It walks you through the process of creating and checking role assignments.

**Estimated time to complete:** 15 minutes

## Prerequisites ##

Before you can use xplat-cli to manage RBAC, you must have the following:

- Azure Cross-Platform Command-Line Interface version 0.8.8 or later. To install the latest version and associate it with your Azure subscription, see [Install and Configure the Azure Cross-Platform Command-Line Interface](xplat-cli.md).
- Please also read the following tutorials to get familiar with set up and using Azure Resource Manager in Azure Cross-Platform Command-Line Interface: [Using the Azure Cross-Platform Command-Line Interface with the Resource Manager](xplat-cli-azure-resource-manager.md)

## In this tutorial ##

* [Connect to your subscriptions](#connect)
* [Check existing role assignments](#check)
* [Create a role assignment](#create)
* [Verify permissions](#verify)
* [Next steps](#next)

## <a id="connect"></a>Connect to your subscriptions ##

Since RBAC only works with Azure Resource Manager, the first thing to do is to switch to Azure Resource Manager mode. Type:

    azure config mode arm

For more information, please refer to [Using the Azure Cross-Platform Command-Line Interface with the Resource Manager](xplat-cli-azure-resource-manager.md)

To connect to your Azure subscriptions, type:

    azure login -u <username>

In the command line prompt, enter you Azure account password (only use an organizational account). Xplat-cli will get all the subscriptions you have with this account and configure itself to use the first one as default. Notice that with role based access control, you will only be able to get the subscriptions where you have some permissions by either being its co-admin or having some role assignment. 

If you have multiple subscriptions and want to switch to another one, type:

    # This will show you the subscriptions under the account.
    azure account list
    # Use the subscription name to select the one you want to work on.
    azure account set <subscription name>

For more information, please refer to [Install and Configure the Azure Cross-Platform Command-Line Interface](xplat-cli.md).

## <a id="check"></a>Check existing role assignments ##

Now let's check what role assignments exist in the subscription already. Type:

    azure role assignment list

This will return all the role assignments in the subscription. Two things to notice:

1. You'll need to have read access at the subscription level.
2. If the subscription has a lot of role assignments, it may take a while to get all of them.

You can also check existing role assignments for a particular role definition, at a particular scope for a particular user. Type:

    azure role assignment list -g group1 --upn <user email> -o Owner

This will return all the role assignments for a particular user in your Azure AD directory, who has a role assignment of "Owner" for resource group "group1". The role assignment can come from two places:

1. A role assignment of "Owner" to the user for the resource group.
2. A role assignment of "Owner" to the user for the parent of the resource group (the subscription in this case) because if you have any permission at a certain parent resource, you'll have the same permissions to all its children resources.

All the parameters of this cmdlet are optional. You can combine them to check role assignments with different filters.

## <a id="create"></a>Create a role assignment ##

To create a role assignment, you need to think about:

- Who you want to assign the role to: you can use the following Azure Active Directory cmdlets to see what users, groups and service principals you have in your directory.

    `azure ad user list
    azure ad user show
    azure ad group list
    azure ad group show
    azure ad group member list
    azure ad sp list
    azure ad sp show`

- What role you want to assign: you can use the following cmdlet to see the supported role definitions.

    `azure role list`

- What scope you want to assign: you have three levels for scopes:

    - The current subscription
    - A resource group. To get a list of resource groups, type `azure group list`
    - A resource. To get a list of resources, type `azure resource list`

Then use `azure role assignment create` to create a role assignment. For example:

 - This will create a role assignment at the current subscription level for a user as a reader:

    `azure role assignment create --upn <user's email> -o Reader`

- This will create a role assignment at a resource group level:

    `PS C:\> azure role assignment create --upn <user's email> -o Contributor -g group1`

- This will create a role assignment at a resource level:

    `azure role assignment create --upn <user's email> -o Owner -g group1 -r Microsoft.Web/sites -u site1`

## <a id="verify"></a>Verify permissions ##

After you check that your account has some role assignments, you can actually see the permissions these role assignments grant you by running:

    PS C:\> azure group list
    PS C:\> azure resource list

These two cmdlets will only return the resource groups or resources where you have read permission. And it will show you the permissions you have as well.

Then when you try to run other cmdlets like `azure group create`, you will get an access denied error if you don't have the permission.

## <a id="next"></a>Next steps ##

To learn more about managing role-based access control with xplat-cli and related topics:

- [Role based access control in Azure](role-based-access-control-configure.md)
- [Install and Configure the Azure Cross-Platform Command-Line Interface](xplat-cli.md)
- [Using the Azure Cross-Platform Command-Line Interface with the Resource Manager](xplat-cli-azure-resource-manager.md)
- [Using Resource groups to manage your Azure resources](azure-preview-portal-using-resource-groups.md): Learn how to create and manage resource groups in the Azure Management Portal.
- [Azure blog](http://blogs.msdn.com/windowsazure): Learn about new features in Azure.
- [Configure role based access control using Windows PowerShell](role-based-access-control-powershell.md)
- [Troubleshooting role based access control](role-based-access-control-troubleshooting.md)
