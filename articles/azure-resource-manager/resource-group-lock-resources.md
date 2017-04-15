---
title: Prevent changes in critical Azure resources | Microsoft Docs
description: Prevent users from updating or deleting certain resources by applying a restriction to all users and roles.
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 53c57e8f-741c-4026-80e0-f4c02638c98b
ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/14/2016
ms.author: tomfitz

---
# Lock resources to prevent unexpected changes 
As an administrator, you may need to lock a subscription, resource group, or resource to prevent other users in your organization from accidentally deleting or modifying critical resources. 
You can set the lock level to **CanNotDelete** or **ReadOnly**. 

* **CanNotDelete** means authorized users can still read and modify a resource, but they can't delete the resource. 
* **ReadOnly** means authorized users can read a resource, but they can't delete or update the resource. Applying this lock is similar to restricting all authorized users to the permissions granted by the **Reader** role. 

Resource Manager locks apply only to operations that happen in the management plane, which consists of operations sent to `https://management.azure.com`. The locks do not restrict how resources perform their own functions. Resource changes are restricted, but resource operations are not restricted. For example, a ReadOnly lock on a SQL Database prevents you from deleting or modifying the database, but it does not prevent you from creating, updating, or deleting data in the database. Data transactions are permitted because those operations are not sent to `https://management.azure.com`.

Applying **ReadOnly** can lead to unexpected results because some operations that seem like read operations actually require additional actions. For example, placing a **ReadOnly** lock on a storage account prevents all users from listing the keys. The list keys operation is handled through a POST request because the returned keys are available for write operations. For another example, placing a **ReadOnly** lock on an App Service resource prevents Visual Studio Server Explorer from displaying files for the resource because that interaction requires write access.

Unlike role-based access control, you use management locks to apply a restriction across all users and roles. To learn about setting permissions for users and roles, see 
[Azure Role-based Access Control](../active-directory/role-based-access-control-configure.md).

When you apply a lock at a parent scope, all resources within that scope inherit the same lock. Even resources you add later inherit the lock from the parent. The most restrictive lock in the inheritance takes precedence.

## Who can create or delete locks in your organization
To create or delete management locks, you must have access to `Microsoft.Authorization/*` or `Microsoft.Authorization/locks/*` actions. Of the built-in roles, only **Owner** and **User Access Administrator** are granted those actions.

## Creating a lock through the portal
[!INCLUDE [resource-manager-lock-resources](../../includes/resource-manager-lock-resources.md)]

## Creating a lock in a template
The following example shows a template that creates a lock on a storage account. The storage account on which to apply the lock is provided as a parameter. The name of the lock is created by concatenating the resource name with **/Microsoft.Authorization/** and the name of the lock, in this case **myLock**.

The type provided is specific to the resource type. For storage, set the type to "Microsoft.Storage/storageaccounts/providers/locks".

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
You can lock deployed resources with the [REST API for management locks](https://docs.microsoft.com/rest/api/resources/managementlocks). The REST API enables you to create and delete locks, and 
retrieve information about existing locks.

To create a lock, run:

    PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/locks/{lock-name}?api-version={api-version}

The scope could be a subscription, resource group, or resource. The lock-name is whatever you want to call the lock. For api-version, use **2015-01-01**.

In the request, include a JSON object that specifies the properties for the lock.

    {
      "properties": {
        "level": "CanNotDelete",
        "notes": "Optional text notes."
      }
    } 


## Creating a lock with Azure PowerShell
You can lock deployed resources with Azure PowerShell by using the **New-AzureRmResourceLock** as shown in the following example.

    New-AzureRmResourceLock -LockLevel CanNotDelete -LockName LockSite -ResourceName examplesite -ResourceType Microsoft.Web/sites -ResourceGroupName exampleresourcegroup

Azure PowerShell provides other commands for working locks, such as **Set-AzureRmResourceLock** to update a lock and **Remove-AzureRmResourceLock** to delete a lock.

## Next steps
* For more information about working with resource locks, see [Lock Down Your Azure Resources](http://blogs.msdn.com/b/cloud_solution_architect/archive/2015/06/18/lock-down-your-azure-resources.aspx)
* To learn about logically organizing your resources, see [Using tags to organize your resources](resource-group-using-tags.md)
* To change which resource group a resource resides in, see [Move resources to new resource group](resource-group-move-resources.md)
* You can apply restrictions and conventions across your subscription with customized policies. For more information, see [Use Policy to manage resources and control access](resource-manager-policy.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

