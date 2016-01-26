    <properties
	pageTitle="Grant user permissions to specific DevTest Lab policies | Microsoft Azure"
	description="Learn how to grant user permissions to specific DevTest Lab policies based on each user's needs"
	services="devtest-lab,virtual-machines,visual-studio-online"
	documentationCenter="na"
	authors="tomarcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="devtest-lab"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/26/2016"
	ms.author="tarcher"/>

# Grant user permissions to specific DevTest Lab policies

## Overview

As discussed in the (AzureRole-based Access Control)[role-based-access-control-configure] article, RBAC enables fine-grained access management of resources for Azure. Using RBAC, you can segregate duties within your DevOps team and grant only the amount of access to users that they need to perform their jobs. 

In this article, we’ll illustrate how to use Windows PowerShell to grant users permissions to a particular Lab policy. That way, permissions can be applied based on each user's needs. For example, you might want to grant a particular user the ability to change the VM policy settings, but not the cost policies.

##Creating a DevTest Lab custom role using Windows PowerShell
In order to get started, you’ll need to read the following article, which will explain how to install and configure the Azure PowerShell cmdlets: (https://azure.microsoft.com/en-us/blog/azps-1-0-pre)[https://azure.microsoft.com/en-us/blog/azps-1-0-pre].

Once you’ve set up the Azure PowerShell cmdlets, you can perform the following tasks:
- List all the operations/actions for a resource provider
- List actions in a particular role:
- Create a custom role

The following Windows PowerShell script illustrates examples of how to perform these tasks:

    ‘List all the operations/actions for a resource provider.
    Get-AzureRmProviderOperation -OperationSearchString "Microsoft.DevTestLab/*"

    ‘List actions in a particular role.
    (Get-AzureRmRoleDefinition "DevTest Labs User").Actions

    ‘Create custom role.
    $policyRoleDef = (Get-AzureRmRoleDefinition "DevTest Labs User")
    $policyRoleDef.Id = $null
    $policyRoleDef.Name = "Policy Contributor"
    $policyRoleDef.IsCustom = $true
    $policyRoleDef.AssignableScopes.Clear()
    $policyRoleDef.AssignableScopes.Add("/subscriptions/<SubscriptionID> ")
    $policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/policies/*")
    $policyRoleDef = (New-AzureRmRoleDefinition -Role $policyRoleDef)

Assigning permissions to a user for a specific policy using custom roles
Once you’ve defined your custom roles, you can assign them to users. In order to assign a custom role to a user, you must first obtain the **ObjectId** representing that user. To do that, use the **Get-AzureRmADUser** cmdlet.

In the following example, the **ObjectId** of the *SomeUser* user is 05DEFF7B-0AC3-4ABF-B74D-6A72CD5BF3F3.

    PS C:\>Get-AzureRmADUser -SearchString "SomeUser"

    DisplayName                    Type                           ObjectId
    -----------                    ----                           --------
    someuser@hotmail.com                                          05DEFF7B-0AC3-4ABF-B74D-6A72CD5BF3F3

Once you have the **ObjectId** for the user and a custom role name, you can assign that role to the user with the **New-AzureRmRoleAssignment** cmdlet:

    PS C:\>New-AzureRmRoleAssignment -ObjectId 05DEFF7B-0AC3-4ABF-B74D-6A72CD5BF3F3 -RoleDefinitionName "Policy Contributor" -Scope /subscriptions/<SubscriptionID>/resourceGroups/xiaoyi
    ng-rm/providers/Microsoft.DevTestLab/labs/xiaoying-lab2/policies/AllowedVmSizesInLab

In the previous example, the **AllowedVmSizesInLab** policy is used. You can use any of the following polices:
- MaxVmsAllowedPerUser
- MaxVmsAllowedPerLab
- AllowedVmSizesInLab
- LabVmsShutdown