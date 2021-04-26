---
title: Lock resources to prevent changes
description: Prevent users from updating or deleting Azure resources by applying a lock for all users and roles.
ms.topic: conceptual
ms.date: 04/07/2021
ms.custom: devx-track-azurecli
---

# Lock resources to prevent unexpected changes

As an administrator, you can lock a subscription, resource group, or resource to prevent other users in your organization from accidentally deleting or modifying critical resources. The lock overrides any permissions the user might have.

You can set the lock level to **CanNotDelete** or **ReadOnly**. In the portal, the locks are called **Delete** and **Read-only** respectively.

* **CanNotDelete** means authorized users can still read and modify a resource, but they can't delete the resource.
* **ReadOnly** means authorized users can read a resource, but they can't delete or update the resource. Applying this lock is similar to restricting all authorized users to the permissions granted by the **Reader** role.

## How locks are applied

When you apply a lock at a parent scope, all resources within that scope inherit the same lock. Even resources you add later inherit the lock from the parent. The most restrictive lock in the inheritance takes precedence.

Unlike role-based access control, you use management locks to apply a restriction across all users and roles. To learn about setting permissions for users and roles, see [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md).

Resource Manager locks apply only to operations that happen in the management plane, which consists of operations sent to `https://management.azure.com`. The locks don't restrict how resources perform their own functions. Resource changes are restricted, but resource operations aren't restricted. For example, a ReadOnly lock on a SQL Database logical server prevents you from deleting or modifying the server. It doesn't prevent you from creating, updating, or deleting data in the databases on that server. Data transactions are permitted because those operations aren't sent to `https://management.azure.com`.

## Considerations before applying locks

Applying locks can lead to unexpected results because some operations that don't seem to modify the resource actually require actions that are blocked by the lock. Locks will prevent any operations that require a POST request to the Azure Resource Manager API. Some common examples of the operations that are blocked by locks are:

* A read-only lock on a **storage account** prevents users from listing the account keys. The Azure Storage [List Keys](/rest/api/storagerp/storageaccounts/listkeys) operation is handled through a POST request to protect access to the account keys, which provide complete access to data in the storage account. When a read-only lock is configured for a storage account, users who don't have the account keys must use Azure AD credentials to access blob or queue data. A read-only lock also prevents the assignment of Azure RBAC roles that are scoped to the storage account or to a data container (blob container or queue).

* A cannot-delete lock on a **storage account** doesn't prevent data within that account from being deleted or modified. This type of lock only protects the storage account itself from being deleted, and doesn't protect blob, queue, table, or file data within that storage account. 

* A read-only lock on a **storage account** doesn't prevent data within that account from being deleted or modified. This type of lock only protects the storage account itself from being deleted or modified, and doesn't protect blob, queue, table, or file data within that storage account. 

* A read-only lock on an **App Service** resource prevents Visual Studio Server Explorer from displaying files for the resource because that interaction requires write access.

* A read-only lock on a **resource group** that contains an **App Service plan** prevents you from [scaling up or out the plan](../../app-service/manage-scale-up.md).

* A read-only lock on a **resource group** that contains a **virtual machine** prevents all users from starting or restarting the virtual machine. These operations require a POST request.

* A cannot-delete lock on a **resource group** prevents Azure Resource Manager from [automatically deleting deployments](../templates/deployment-history-deletions.md) in the history. If you reach 800 deployments in the history, your deployments will fail.

* A cannot-delete lock on the **resource group** created by **Azure Backup Service** causes backups to fail. The service supports a maximum of 18 restore points. When locked, the backup service can't clean up restore points. For more information, see [Frequently asked questions-Back up Azure VMs](../../backup/backup-azure-vm-backup-faq.yml).

* A read-only lock on a **subscription** prevents **Azure Advisor** from working correctly. Advisor is unable to store the results of its queries.

## Who can create or delete locks

To create or delete management locks, you must have access to `Microsoft.Authorization/*` or `Microsoft.Authorization/locks/*` actions. Of the built-in roles, only **Owner** and **User Access Administrator** are granted those actions.

## Managed Applications and locks

Some Azure services, such as Azure Databricks, use [managed applications](../managed-applications/overview.md) to implement the service. In that case, the service creates two resource groups. One resource group contains an overview of the service and isn't locked. The other resource group contains the infrastructure for the service and is locked.

If you try to delete the infrastructure resource group, you get an error stating that the resource group is locked. If you try to delete the lock for the infrastructure resource group, you get an error stating that the lock can't be deleted because it's owned by a system application.

Instead, delete the service, which also deletes the infrastructure resource group.

For managed applications, select the service you deployed.

![Select service](./media/lock-resources/select-service.png)

Notice the service includes a link for a **Managed Resource Group**. That resource group holds the infrastructure and is locked. It can't be directly deleted.

![Show managed group](./media/lock-resources/show-managed-group.png)

To delete everything for the service, including the locked infrastructure resource group, select **Delete** for the service.

![Delete service](./media/lock-resources/delete-service.png)

## Configure locks

### Portal

[!INCLUDE [resource-manager-lock-resources](../../../includes/resource-manager-lock-resources.md)]

### ARM template

When using an Azure Resource Manager template (ARM template) to deploy a lock, you need to be aware of the scope of the lock and the scope of the deployment. To apply a lock at the deployment scope, such as locking a resource group or subscription, don't set the scope property. When locking a resource within the deployment scope, set the scope property.

The following template applies a lock to the resource group it's deployed to. Notice there isn't a scope property on the lock resource because the scope of the lock matches the scope of deployment. This template is deployed at the resource group level.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {  
    },
    "resources": [
        {
            "type": "Microsoft.Authorization/locks",
            "apiVersion": "2016-09-01",
            "name": "rgLock",
            "properties": {
                "level": "CanNotDelete",
                "notes": "Resource Group should not be deleted."
            }
        }
    ]
}
```

To create a resource group and lock it, deploy the following template at the subscription level.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "rgName": {
            "type": "string"
        },
        "rgLocation": {
            "type": "string"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Resources/resourceGroups",
            "apiVersion": "2019-10-01",
            "name": "[parameters('rgName')]",
            "location": "[parameters('rgLocation')]",
            "properties": {}
        },
        {
            "type": "Microsoft.Resources/deployments",
            "apiVersion": "2020-06-01",
            "name": "lockDeployment",
            "resourceGroup": "[parameters('rgName')]",
            "dependsOn": [
                "[resourceId('Microsoft.Resources/resourceGroups/', parameters('rgName'))]"
            ],
            "properties": {
                "mode": "Incremental",
                "template": {
                    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
                    "contentVersion": "1.0.0.0",
                    "parameters": {},
                    "variables": {},
                    "resources": [
                        {
                            "type": "Microsoft.Authorization/locks",
                            "apiVersion": "2016-09-01",
                            "name": "rgLock",
                            "properties": {
                                "level": "CanNotDelete",
                                "notes": "Resource group and its resources should not be deleted."
                            }
                        }
                    ],
                    "outputs": {}
                }
            }
        }
    ],
    "outputs": {}
}
```

When applying a lock to a **resource** within the resource group, add the scope property. Set scope to the name of the resource to lock.

The following example shows a template that creates an app service plan, a web site, and a lock on the web site. The scope of the lock is set to the web site.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "hostingPlanName": {
      "type": "string"
    },
    "location": {
        "type": "string",
        "defaultValue": "[resourceGroup().location]"
    }
  },
  "variables": {
    "siteName": "[concat('ExampleSite', uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2020-06-01",
      "name": "[parameters('hostingPlanName')]",
      "location": "[parameters('location')]",
      "sku": {
        "tier": "Free",
        "name": "f1",
        "capacity": 0
      },
      "properties": {
        "targetWorkerCount": 1
      }
    },
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2020-06-01",
      "name": "[variables('siteName')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]"
      ],
      "properties": {
        "serverFarmId": "[parameters('hostingPlanName')]"
      }
    },
    {
      "type": "Microsoft.Authorization/locks",
      "apiVersion": "2016-09-01",
      "name": "siteLock",
      "scope": "[concat('Microsoft.Web/sites/', variables('siteName'))]",
      "dependsOn": [
        "[resourceId('Microsoft.Web/sites', variables('siteName'))]"
      ],
      "properties": {
        "level": "CanNotDelete",
        "notes": "Site should not be deleted."
      }
    }
  ]
}
```

### Azure PowerShell

You lock deployed resources with Azure PowerShell by using the [New-AzResourceLock](/powershell/module/az.resources/new-azresourcelock) command.

To lock a resource, provide the name of the resource, its resource type, and its resource group name.

```azurepowershell-interactive
New-AzResourceLock -LockLevel CanNotDelete -LockName LockSite -ResourceName examplesite -ResourceType Microsoft.Web/sites -ResourceGroupName exampleresourcegroup
```

To lock a resource group, provide the name of the resource group.

```azurepowershell-interactive
New-AzResourceLock -LockName LockGroup -LockLevel CanNotDelete -ResourceGroupName exampleresourcegroup
```

To get information about a lock, use [Get-AzResourceLock](/powershell/module/az.resources/get-azresourcelock). To get all the locks in your subscription, use:

```azurepowershell-interactive
Get-AzResourceLock
```

To get all locks for a resource, use:

```azurepowershell-interactive
Get-AzResourceLock -ResourceName examplesite -ResourceType Microsoft.Web/sites -ResourceGroupName exampleresourcegroup
```

To get all locks for a resource group, use:

```azurepowershell-interactive
Get-AzResourceLock -ResourceGroupName exampleresourcegroup
```

To delete a lock for a resource, use:

```azurepowershell-interactive
$lockId = (Get-AzResourceLock -ResourceGroupName exampleresourcegroup -ResourceName examplesite -ResourceType Microsoft.Web/sites).LockId
Remove-AzResourceLock -LockId $lockId
```

To delete a lock for a resource group, use:

```azurepowershell-interactive
$lockId = (Get-AzResourceLock -ResourceGroupName exampleresourcegroup).LockId
Remove-AzResourceLock -LockId $lockId
```

### Azure CLI

You lock deployed resources with Azure CLI by using the [az lock create](/cli/azure/lock#az_lock_create) command.

To lock a resource, provide the name of the resource, its resource type, and its resource group name.

```azurecli
az lock create --name LockSite --lock-type CanNotDelete --resource-group exampleresourcegroup --resource-name examplesite --resource-type Microsoft.Web/sites
```

To lock a resource group, provide the name of the resource group.

```azurecli
az lock create --name LockGroup --lock-type CanNotDelete --resource-group exampleresourcegroup
```

To get information about a lock, use [az lock list](/cli/azure/lock#az_lock_list). To get all the locks in your subscription, use:

```azurecli
az lock list
```

To get all locks for a resource, use:

```azurecli
az lock list --resource-group exampleresourcegroup --resource-name examplesite --namespace Microsoft.Web --resource-type sites --parent ""
```

To get all locks for a resource group, use:

```azurecli
az lock list --resource-group exampleresourcegroup
```

To delete a lock for a resource, use:

```azurecli
lockid=$(az lock show --name LockSite --resource-group exampleresourcegroup --resource-type Microsoft.Web/sites --resource-name examplesite --output tsv --query id)
az lock delete --ids $lockid
```

To delete a lock for a resource group, use:

```azurecli
lockid=$(az lock show --name LockSite --resource-group exampleresourcegroup  --output tsv --query id)
az lock delete --ids $lockid
```

### REST API

You can lock deployed resources with the [REST API for management locks](/rest/api/resources/managementlocks). The REST API enables you to create and delete locks, and retrieve information about existing locks.

To create a lock, run:

```http
PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/locks/{lock-name}?api-version={api-version}
```

The scope could be a subscription, resource group, or resource. The lock-name is whatever you want to call the lock. For api-version, use **2016-09-01**.

In the request, include a JSON object that specifies the properties for the lock.

```json
{
  "properties": {
  "level": "CanNotDelete",
  "notes": "Optional text notes."
  }
}
```

## Next steps

* To learn about logically organizing your resources, see [Using tags to organize your resources](tag-resources.md).
* You can apply restrictions and conventions across your subscription with customized policies. For more information, see [What is Azure Policy?](../../governance/policy/overview.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](/azure/architecture/cloud-adoption-guide/subscription-governance).
