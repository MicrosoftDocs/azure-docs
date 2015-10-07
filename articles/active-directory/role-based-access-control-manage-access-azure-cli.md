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
- [Azure Managment Portal](role-based-access-control-manage-access-azure-portal.md)
- [PowerShell](role-based-access-control-manage-access-powershell.md)
- [Azure CLI](role-based-access-control-manage-access-azure-cli.md)

## List RBAC roles available for assignment
To list RBAC roles available for assignment. Use azure role show to inspect the operations to which they grant access use:

    azure role list

![](./media/role-based-access-control-manage-access-azure-cli/1-azure-role-list.png)

## List RBAC access assignments
To list RBAC access assignments effective at the specified subscription or resource group or resource use:

    azure role assignment list  

## List RBAC access assignments for user and user group membership
To list access assignments to the specified user as well as to the groups of which the user is member use:

    azure role assignment list expandPrincipalGroups  

## List RBAC access assignments to list classic subscription administrator and co-administrators
To list classic subscription administrator and co-administrators use:

    azure role assignment list includeClassicAdministrators

## Grant RBAC access to users, groups and applications
To grant access to users, groups and applications use:

    azure role assignment create --<object id> --Role <role name> --scope <scope designation such as subscription/subscription id>

![](./media/role-based-access-control-manage-access-azure-cli/2-azure-role-assignment-create-1.png)

## Remove access for users, groups and applications
To remove access for users, groups and applications use:		

   azure role assignment delete
