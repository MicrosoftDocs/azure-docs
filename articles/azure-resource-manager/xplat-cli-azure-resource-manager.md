---
title: Manage resources with the Azure CLI | Microsoft Docs
description: Use the Azure Command-Line Interface (CLI) to manage Azure resources and groups
editor: ''
manager: timlt
documentationcenter: ''
author: tfitzmac
services: azure-resource-manager

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: vm-multiple
ms.devlang: na
ms.topic: article
ms.date: 09/14/2017
ms.author: tomfitz

---
# Use the Azure CLI to manage Azure resources and resource groups

In this article, you learn how to manage your solutions with Azure CLI and Azure Resource Manager. If you are not familiar with Resource Manager, see [Resource Manager Overview](resource-group-overview.md). This topic focuses on management tasks. You will:

1. Create a resource group
2. Add a resource to the resource group
3. Add a tag to the resource
4. Query resources based on names or tag values
5. Apply and remove a lock on the resource
6. Delete a resource group

This article does not show how to deploy a Resource Manager template to your subscription. For that information, see [Deploy resources with Resource Manager templates and Azure CLI](resource-group-template-deploy-cli.md).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

To install and use the CLI locally, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

## Set subscription

If you have more than one subscription, you can switch to a different subscription. First, let's see all the subscriptions for your account.

```azurecli-interactive
az account list
```

It returns a list of your enabled and disabled subscriptions.

```json
[
  {
    "cloudName": "AzureCloud",
    "id": "<guid>",
    "isDefault": true,
    "name": "Example Subscription One",
    "registeredProviders": [],
    "state": "Enabled",
    "tenantId": "<guid>",
    "user": {
      "name": "example@contoso.org",
      "type": "user"
    }
  },
  ...
]
```

Notice that one subscription is marked as the default. This subscription is your current context for operations. To switch to a different subscription, provide the subscription name with the **az account set** command.

```azurecli-interactive
az account set -s "Example Subscription Two"
```

To show the current subscription context, use **az account show** without a parameter:

```azurecli-interactive
az account show
```

## Create a resource group
Before deploying any resources to your subscription, you must create a resource group that will contain the resources.

To create a resource group, use the **az group create** command. The command uses the **name** parameter to specify a name for the resource group and the **location** parameter to specify its location.

```azurecli-interactive
az group create --name TestRG1 --location "South Central US"
```

The output is in the following format:

```json
{
  "id": "/subscriptions/<subscription-id>/resourceGroups/TestRG1",
  "location": "southcentralus",
  "managedBy": null,
  "name": "TestRG1",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

If you need to retrieve the resource group later, use the following command:

```azurecli-interactive
az group show --name TestRG1
```

To get all the resource groups in your subscription, use:

```azurecli-interactive
az group list
```

## Add resources to a resource group
To add a resource to the resource group, you can use the **az resource create** command or a command that is specific to the type of resource you are creating (like **az storage account create**). You might find it easier to use a command that is specific to a resource type because it includes parameters for the properties that are needed for the new resource. To use **az resource create**, you must know all the properties to set without being prompted for them.

However, adding a resource through script might cause future confusion because the new resource does not exist in a Resource Manager template. Templates enable you to reliably and repeatedly deploy your solution.

The following command creates a storage account. Instead of using the name shown in the example, provide a unique name for the storage account. The name must be between 3 and 24 characters in length, and use only numbers and lower-case letters. If you use the name shown in the example, you receive an error because that name is already in use.

```azurecli-interactive
az storage account create -n myuniquestorage -g TestRG1 -l westus --sku Standard_LRS
```

If you need to retrieve this resource later, use the following command:

```azurecli-interactive
az storage account show --name myuniquestorage --resource-group TestRG1
```

## Add a tag

Tags enable you to organize your resources according to different properties. For example, you may have several resources in different resource groups that belong to the same department. You can apply a department tag and value to those resources to mark them as belonging to the same category. Or, you can mark whether a resource is used in a production or test environment. In this topic, you apply tags to only one resource, but in your environment it most likely makes sense to apply tags to all your resources.

The following command applies two tags to your storage account:

```azurecli-interactive
az resource tag --tags Dept=IT Environment=Test -g TestRG1 -n myuniquestorage --resource-type "Microsoft.Storage/storageAccounts"
```

Tags are updated as a single object. To add a tag to a resource that already includes tags, first retrieve the existing tags. Add the new tag to the object that contains the existing tags, and reapply all the tags to the resource.

```azurecli-interactive
jsonrtag=$(az resource show -g TestRG1 -n myuniquestorage --resource-type "Microsoft.Storage/storageAccounts" --query tags)
rt=$(echo $jsonrtag | tr -d '"{},' | sed 's/: /=/g')
az resource tag --tags $rt Project=Redesign -g TestRG1 -n myuniquestorage --resource-type "Microsoft.Storage/storageAccounts"
```

## Search for resources

Use the **az resource list** command to retrieve resources for different search conditions.

* To get a resource by name, provide the **name** parameter:

  ```azurecli-interactive
  az resource list -n myuniquestorage
  ```

* To get all the resources in a resource group, provide the **resource-group** parameter:

  ```azurecli-interactive
  az resource list --resource-group TestRG1
  ```

* To get all the resources with a tag name and value, provide the **tag** parameter:

  ```azurecli-interactive
  az resource list --tag Dept=IT
  ```

* To all the resources with a particular resource type, provide the **resource-type** parameter:

  ```azurecli-interactive
  az resource list --resource-type "Microsoft.Storage/storageAccounts"
  ```

## Lock a resource

When you need to make sure a critical resource is not accidentally deleted or modified, apply a lock to the resource. You can specify either a **CanNotDelete** or **ReadOnly**.

To create or delete management locks, you must have access to `Microsoft.Authorization/*` or `Microsoft.Authorization/locks/*` actions. Of the built-in roles, only Owner and User Access Administrator are granted those actions.

To apply a lock, use the following command:

```azurecli-interactive
az lock create --lock-type CanNotDelete --resource-name myuniquestorage --resource-group TestRG1 --resource-type Microsoft.Storage/storageAccounts --name storagelock
```

The locked resource in the preceding example cannot be deleted until the lock is removed. To remove a lock, use:

```azurecli-interactive
az lock delete --name storagelock --resource-group TestRG1 --resource-type Microsoft.Storage/storageAccounts --resource-name myuniquestorage
```

For more information about setting locks, see [Lock resources with Azure Resource Manager](resource-group-lock-resources.md).

## Remove resources or resource group
You can remove a resource or resource group. When you remove a resource group, you also remove all the resources within that resource group.

* To delete a resource from the resource group, use the delete command for the resource type you are deleting. The command deletes the resource, but does not delete the resource group.

  ```azurecli-interactive
  az storage account delete -n myuniquestorage -g TestRG1
  ```

* To delete a resource group and all its resources, use the **az group delete** command.

  ```azurecli-interactive
  az group delete -n TestRG1
  ```

For both commands, you are asked to confirm that you wish to remove the resource or resource group.

## Next steps
* To learn about creating Resource Manager templates, see [Authoring Azure Resource Manager Templates](resource-group-authoring-templates.md).
* To learn about deploying templates, see [Deploy an application with Azure Resource Manager Template](resource-group-template-deploy-cli.md).
* You can move existing resources to a new resource group. For examples, see [Move Resources to New Resource Group or Subscription](resource-group-move-resources.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).