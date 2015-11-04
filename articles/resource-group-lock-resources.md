<properties 
	pageTitle="Lock Resources with Resource Manager | Microsoft Azure" 
	description="Prevent users from updating or deleting certain resources by applying a restriction to all users and roles." 
	services="azure-resource-manager" 
	documentationCenter="" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="azure-resource-manager" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/14/2015" 
	ms.author="tomfitz"/>

# Lock resources with Azure Resource Manager

As an administrator, there are scenarios where you will want to place a lock on a subscription, resource group or resource  to prevent other users in your organization from committing write actions or accidentally deleting a critical resource. 

Azure Resource Manager provides the ability to restrict operations on resources through resource management locks. Locks are policies which enforce a lock level at a particular scope. The scope can be a subscription, resource group or resource. The lock level identifies the type of enforcement for the policy, which presently has two values – **CanNotDelete** and **ReadOnly**. **CanNotDelete** means authorized users can still read and modify resources, but they can't delete any of the restricted resources. **ReadOnly** means authorized users can only read from the resource, but they can't modify or delete any of the restricted resources.

Locks are different from using role-based access control to assign user permissions to perform certain actions. To learn about setting permissions for users and roles, see 
[Role-based access control in the preview portal](role-based-access-control-configure.md) and [Managing and Auditing Access to Resources](resource-group-rbac.md). Unlinke role-based access control, you use management locks to apply a restriction across all users and roles, and you typically apply the locks for only limited duration.

## Common scenarios

One common scenario is when you have a resource group with some resources that are used in an off-and-on pattern.  VM resources are turned on periodically to process data for a given interval of 
time and then turned off. In this scenario, you will want to enable the shut down of the VMs but it is imperative 
that a storage account not be deleted. In this scenario, you would use a resource lock with a lock level of **CanNotDelete** on the storage account.

In another scenario, your business may have periods where you don't want updates going into production. The **ReadOnly** lock level stops creation or updates. If you’re a retail company, you may not want to allow updates during holiday shopping periods.  If you’re a financial services company, you may have constraints related to deployments during 
certain market hours. A resource lock can provide a policy to lock the resources as appropriate. This could be applied to just certain resources or to the entirety of the resource group.

## Who can create or delete locks in your organization

To create or delete management locks, you must have access to **Microsoft.Authorization/\*** or **Microsoft.Authorization/locks/\*** actions. Of the built-in roles, only **Owner** and **User Access Administrator** are granted those actions. For more information about assigning access control, see [Managing access to resources](resource-group-rbac.md).

## Lock inheritance

When you apply a lock at a parent scope, all child resources inherit the same lock.

If you apply more than one lock to a resource, the most restrictive lock takes precedence. For example, if you apply **ReadOnly** at the parent level (such as the resource group) and **CanNotDelete** on a resource within that group, the more restrictive lock (ReadOnly) from the parent takes precedence.

## Creating a lock in a template

The example below shows a template that creates a lock on a storage account. The storage account on which to apply the lock is provided as a parameter, and that is used 
in conjunction with the concat() function.  The result is the resource name appended with ‘Microsoft.Authorization’ and then a name of the lock, in this case **myLock**.

The type provided is specific to the resource type. For storage, this type is "Microsoft.Storage/storageaccounts/providers/locks".

The scope level is set using the **level** property of the resource. As the example is focused on helping avoid accidental deletion, the level is set as **CannotDelete**.

    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "lockedResource": {
                "type": "string"
            }
        },
        "resources": [
            {
                "name": "[concat(parameters('lockedResource'), '/Microsoft.Authorization/myLock')]",
                "type": "Microsoft.Storage/storageAccounts/providers/locks",
                "apiVersion": "2015-01-01",
                "properties": {
	                "level": "CannotDelete"
                }
            }
        ]
    }

## Creating a lock with REST API

You can lock deployed resources with the [REST API for management locks](https://msdn.microsoft.com/library/azure/mt204563.aspx). The REST API enables you to create and delete locks, and 
retrieve information about existing locks.

To create a lock, run:

    PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/locks/{lock-name}?api-version={api-version}

The scope could be a subscription, resource group or resource. The lock-name is whatever you want to call the lock. For api-version, use **2015-01-01**.

In the request, include a JSON object that specifies the properties for the lock.

    {
        "properties": {
            "level": {lock-level},
            "notes": "Optional text notes."
        }
    } 

For lock-level, specify either **CanNotDelete** or **ReadOnly**.

For examples, see [REST API for management locks](https://msdn.microsoft.com/library/azure/mt204563.aspx).

## Creating a lock with Azure PowerShell

[AZURE.INCLUDE [powershell-preview-inline-include](../includes/powershell-preview-inline-include.md)]

You can lock deployed resources with Azure PowerShell by using the **New-AzureRmResourceLock** as shown below. Through PowerShell, you can only set the **LockLevel** to **CanNotDelete**.

    PS C:\> New-AzureRmResourceLock -LockLevel CanNotDelete -LockName LockSite -ResourceName examplesite -ResourceType Microsoft.Web/sites

Azure PowerShell provides other commands for working locks, such as **Set-AzureRmResourceLock** to update a lock and **Remove-AzureRmResourceLock** to delete a lock.

## Next steps

- For more information about working with resource locks, see [Lock Down Your Azure Resources](http://blogs.msdn.com/b/cloud_solution_architect/archive/2015/06/18/lock-down-your-azure-resources.aspx)
- To learn about logically organizing your resources, see [Using tags to organize your resources](resource-group-using-tags.md)
- To change which resource group a resource resides in, see [Move resources to new resource group](resource-group-move-resources.md)
