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
	ms.date="04/04/2016" 
	ms.author="tomfitz"/>

# Lock resources with Azure Resource Manager

As an administrator, there are scenarios where you will want to place a lock on a subscription, resource group or resource to prevent other users in your organization from accidentally deleting critical resources. When locked, authorized users can still read and modify the resources, but they can't delete the resources.

Locks are different from using role-based access control to assign user permissions to perform certain actions. To learn about setting permissions for users and roles, see 
[Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md). Unlinke role-based access control, you use management locks to apply a restriction across all users and roles, and you typically apply the locks for only limited duration.

When you apply a lock at a parent scope, all child resources inherit the same lock.

## Who can create or delete locks in your organization

To create or delete management locks, you must have access to **Microsoft.Authorization/\*** or **Microsoft.Authorization/locks/\*** actions. Of the built-in roles, only **Owner** and **User Access Administrator** are granted those actions. For more information about assigning access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

## Creating a lock in a template

The example below shows a template that creates a lock on a storage account. The storage account on which to apply the lock is provided as a parameter. The name of the lock is created by concatenating the resource name with **/Microsoft.Authorization/** and the name of the lock, in this case **myLock**.

The type provided is specific to the resource type. For storage, this type is "Microsoft.Storage/storageaccounts/providers/locks".

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
        "level": "CanNotDelete",
        "notes": "Optional text notes."
      }
    } 

For examples, see [REST API for management locks](https://msdn.microsoft.com/library/azure/mt204563.aspx).

## Creating a lock with Azure PowerShell

You can lock deployed resources with Azure PowerShell by using the **New-AzureRmResourceLock** as shown below.

    New-AzureRmResourceLock -LockLevel CanNotDelete -LockName LockSite -ResourceName examplesite -ResourceType Microsoft.Web/sites

Azure PowerShell provides other commands for working locks, such as **Set-AzureRmResourceLock** to update a lock and **Remove-AzureRmResourceLock** to delete a lock.

## Next steps

- For more information about working with resource locks, see [Lock Down Your Azure Resources](http://blogs.msdn.com/b/cloud_solution_architect/archive/2015/06/18/lock-down-your-azure-resources.aspx)
- To learn about logically organizing your resources, see [Using tags to organize your resources](resource-group-using-tags.md)
- To change which resource group a resource resides in, see [Move resources to new resource group](resource-group-move-resources.md)
- You can apply restrictions and conventions across your subscription with customized policies. For more information, see [Use Policy to manage resources and control access](resource-manager-policy.md).
