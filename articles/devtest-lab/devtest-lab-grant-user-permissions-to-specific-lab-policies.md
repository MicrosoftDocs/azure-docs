<properties
	pageTitle="Grant user permissions to specific lab policies | Microsoft Azure"
	description="Learn how to grant user permissions to specific lab policies in DevTest Labs based on each user's needs"
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
	ms.date="05/08/2016"
	ms.author="tarcher"/>

# Grant user permissions to specific lab policies

## Overview

This article illustrates how to use PowerShell to grant users permissions to a particular lab policy. That way, permissions can be applied based on each user's needs. For example, you might want to grant a particular user the ability to change the VM policy settings, but not the cost policies.

## Policies as resources

As discussed in the [Azure Role-based Access Control](../active-directory/role-based-access-control-configure.md) article, RBAC enables fine-grained access management of resources for Azure. Using RBAC, you can segregate duties within your DevOps team and grant only the amount of access to users that they need to perform their jobs.

In DevTest Labs, a policy is a resource type that enables the RBAC action **Microsoft.DevTestLab/labs/policySets/policies/**. Each lab policy is a resource in the Policy resource type, and can be assigned as a scope to an RBAC role.

For example, in order to grant users read/write permission to the **Allowed VM Sizes** policy, you would create a custom role that works with the **Microsoft.DevTestLab/labs/policySets/policies/*** action, and then assign the appropriate users to this custom role in the scope of **Microsoft.DevTestLab/labs/policySets/policies/AllowedVmSizesInLab**.

To learn more about custom roles in RBAC, see the [Custom Roles in Azure RBAC](../active-directory/role-based-access-control-configure.md#custom-roles-in-azure-rbac) section of the [Azure Role-Based Access Control](../active-directory/role-based-access-control-configure.md) article.

##Creating a lab custom role using PowerShell
In order to get started, you’ll need to read the following article, which will explain how to install and configure the Azure PowerShell cmdlets: [https://azure.microsoft.com/blog/azps-1-0-pre](https://azure.microsoft.com/blog/azps-1-0-pre).

Once you’ve set up the Azure PowerShell cmdlets, you can perform the following tasks:

- List all the operations/actions for a resource provider
- List actions in a particular role:
- Create a custom role

The following PowerShell script illustrates examples of how to perform these tasks:

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
    $policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/policySets/policies/*")
    $policyRoleDef = (New-AzureRmRoleDefinition -Role $policyRoleDef)

##Assigning permissions to a user for a specific policy using custom roles
Once you’ve defined your custom roles, you can assign them to users. In order to assign a custom role to a user, you must first obtain the **ObjectId** representing that user. To do that, use the **Get-AzureRmADUser** cmdlet.

In the following example, the **ObjectId** of the *SomeUser* user is 05DEFF7B-0AC3-4ABF-B74D-6A72CD5BF3F3.

    PS C:\>Get-AzureRmADUser -SearchString "SomeUser"

    DisplayName                    Type                           ObjectId
    -----------                    ----                           --------
    someuser@hotmail.com                                          05DEFF7B-0AC3-4ABF-B74D-6A72CD5BF3F3

Once you have the **ObjectId** for the user and a custom role name, you can assign that role to the user with the **New-AzureRmRoleAssignment** cmdlet:

    PS C:\>New-AzureRmRoleAssignment -ObjectId 05DEFF7B-0AC3-4ABF-B74D-6A72CD5BF3F3 -RoleDefinitionName "Policy Contributor" -Scope /subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.DevTestLab/labs/<LabName>/policySets/policies/AllowedVmSizesInLab

In the previous example, the **AllowedVmSizesInLab** policy is used. You can use any of the following polices:

- MaxVmsAllowedPerUser
- MaxVmsAllowedPerLab
- AllowedVmSizesInLab
- LabVmsShutdown

## Next steps

Once you've granted user permissions to specific lab policies, here are some next steps to consider:

- [Secure access to a lab](devtest-lab-add-devtest-user.md).

- [Set lab policies](devtest-lab-set-lab-policy.md).

- [Create a lab template](devtest-lab-create-template.md).

- [Create custom artifacts for your VMs](devtest-lab-artifact-author.md).

- [Add a VM with artifacts to a lab](devtest-lab-add-vm-with-artifacts.md).
