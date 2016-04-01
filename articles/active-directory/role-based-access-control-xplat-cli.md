<properties
	pageTitle="Role-Based Access Control guide for the Azure Command-Line Interface"
	description="Managing role-based access control with the Azure Command-Line Interface"
	services="active-directory"
	documentationCenter="na"
	authors="kgremban"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="command-line-interface"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/17/2016"
	ms.author="kgremban"/>

# Role-Based Access Control guide for the Azure Command-Line Interface

> [AZURE.SELECTOR]
- [PowerShell](role-based-access-control-powershell.md)
- [Azure CLI](role-based-access-control-xplat-cli.md)

Role-Based Access Control (RBAC) in Azure Portal and Azure Resource Manager API allows you to manage access to your subscription and resources at a fine-grained level. With this feature, you can grant access for Active Directory users, groups, or service principals by assigning some roles to them at a particular scope.

In this tutorial, you'll learn how to use the Azure Command-Line Interface (CLI) to manage RBAC. It walks you through the process of creating and checking role assignments.

**Estimated time to complete:** 15 minutes

## Prerequisites

Before you can use the Azure CLI to manage RBAC, you must have the following:

- Azure CLI version 0.8.8 or later. To install the latest version and associate it with your Azure subscription, see [Install and Configure the Azure CLI](../xplat-cli-install.md).
- Please also read the following tutorial to get familiar with set up and using Azure Resource Manager in Azure CLI: [Using the Azure CLI with the Resource Manager](../xplat-cli-azure-resource-manager.md)

## <a id="connect"></a>Connect to your subscriptions

Since RBAC only works with Azure Resource Manager, the first thing to do is to switch to Azure Resource Manager mode. Type:

    azure config mode arm

To connect to your Azure subscriptions, type:

    azure login -u <username>

In the command line prompt, enter your Azure account password (only use an organizational account). Azure CLI will get all the subscriptions you have with this account and configure itself to use the first one as default. Notice that with Role-Based Access Control, you will only be able to get the subscriptions where you have some permissions by either being its co-admin or having some role assignment.

If you have multiple subscriptions and want to switch to another one, type:

    # This will show you the subscriptions under the account.
    azure account list
    # Use the subscription name to select the one you want to work on.
    azure account set <subscription name>

## <a id="check"></a>Check existing role assignments

Now let's check what role assignments exist in the subscription already. Type:

    azure role assignment list

This will return all the role assignments in the subscription. Two things to notice:

1. You'll need to have read access at the subscription level.
2. If the subscription has a lot of role assignments, it may take a while to get all of them.

You can also check existing role assignments for a particular role definition, at a particular scope for a particular user. Type:

    azure role assignment list -g group1 --upn <user email> -o Owner

This will return all the role assignments for a particular user in your Azure AD directory, who has a role assignment of "Owner" for resource group "group1". The role assignment can come from two places:

1. A role assignment of "Owner" to the user for the resource group.
2. A role assignment of "Owner" to the user for the parent of the resource group (the subscription in this case). If you assign any permission at a parent level, all the children will have the same permissions.

All the parameters of this cmdlet are optional. You can combine them to check role assignments with different filters.

## <a id="create"></a>Create a role assignment

To create a role assignment, you need to think about:

- Who you want to assign the role to: you can use the following Azure Active Directory cmdlets to see what users, groups, and service principals you have in your directory.

    ```
    azure ad user list  
    azure ad user show  
    azure ad group list  
    azure ad group show  
    azure ad group member list  
    azure ad sp list  
    azure ad sp show  
    ```

- What role you want to assign: you can use the following cmdlet to see the supported role definitions.

    `azure role list`

- What scope you want to assign: you have three levels for scopes

    - The current subscription
    - A resource group. To get a list of resource groups, type `azure group list`
    - A resource. To get a list of resources, type `azure resource list`

Then use `azure role assignment create` to create a role assignment. For example:

 	#Create a role assignment at the current subscription level for a user as a reader:
    azure role assignment create --upn <user email> -o Reader

	#Create a role assignment at a resource group level:
    PS C:\> azure role assignment create --upn <user email> -o Contributor -g group1

	#Create a role assignment at a resource level:
    azure role assignment create --upn <user email> -o Owner -g group1 -r Microsoft.Web/sites -u site1

## <a id="verify"></a>Verify permissions

After you check that your account has some role assignments, you can actually see the permissions these role assignments grant you by running:

    PS C:\> azure group list
    PS C:\> azure resource list

These two cmdlets will only return the resource groups or resources where you have read permission. And it will show you the permissions you have as well.

Then when you try to run other cmdlets like `azure group create`, you will get an access denied error if you don't have the permission.

## <a id="next"></a>Next steps

To learn more about managing role-based access control with Azure CLI and related topics:

- [Role based access control in Azure](role-based-access-control-configure.md)
- [Install and Configure the Azure CLI](../xplat-cli-install.md)
- [Using the Azure CLI with the Resource Manager](../xplat-cli-azure-resource-manager.md)
- [Using the Azure Portal to manage your Azure resources](../azure-portal/resource-group-portal.md): Learn how to create and manage resource groups in the Azure portal.
- [Azure blog](http://blogs.msdn.com/windowsazure): Learn about new features in Azure.
- [Configure role based access control using Windows PowerShell](role-based-access-control-powershell.md)
- [Troubleshooting role based access control](role-based-access-control-troubleshooting.md)
