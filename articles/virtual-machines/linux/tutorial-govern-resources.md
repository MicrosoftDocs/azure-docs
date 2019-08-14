---
title: Tutorial - Govern Azure virtual machines with Azure CLI | Microsoft Docs
description: In this tutorial, you learn how to use the Azure CLI to manage Azure virtual machines by applying RBAC, polices, locks and tags
services: virtual-machines-linux
documentationcenter: virtual-machines
author: tfitzmac
manager: gwallace
editor: tysonn

ms.service: virtual-machines-linux
ms.workload: infrastructure
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: tutorial
ms.date: 10/12/2018
ms.author: tomfitz
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn how to control and manage VM resources so that I can secure and audit resource access, and group resources for billing or management.
---

# Tutorial: Learn about Linux virtual machine governance with Azure CLI

[!INCLUDE [Resource Manager governance introduction](../../../includes/resource-manager-governance-intro.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use Azure CLI locally, this tutorial requires that you're running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Understand scope

[!INCLUDE [Resource Manager governance scope](../../../includes/resource-manager-governance-scope.md)]

In this tutorial, you apply all management settings to a resource group so you can easily remove those settings when done.

Let's create that resource group.

```azurecli-interactive
az group create --name myResourceGroup --location "East US"
```

Currently, the resource group is empty.

## Role-based access control

You want to make sure users in your organization have the right level of access to these resources. You don't want to grant unlimited access to users, but you also need to make sure they can do their work. [Role-based access control](../../role-based-access-control/overview.md) enables you to manage which users have permission to complete specific actions at a scope.

To create and remove role assignments, users must have `Microsoft.Authorization/roleAssignments/*` access. This access is granted through the Owner or User Access Administrator roles.

For managing virtual machine solutions, there are three resource-specific roles that provide commonly needed access:

* [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor)
* [Network Contributor](../../role-based-access-control/built-in-roles.md#network-contributor)
* [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor)

Instead of assigning roles to individual users, it's often easier to use an Azure Active Directory group that has users who need to take similar actions. Then, assign that group to the appropriate role. For this article, either use an existing group for managing the virtual machine, or use the portal to [create an Azure Active Directory group](../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

After creating a new group or finding an existing one, use the [az role assignment create](/cli/azure/role/assignment) command to assign the new Azure Active Directory group to the Virtual Machine Contributor role for the resource group.

```azurecli-interactive
adgroupId=$(az ad group show --group <your-group-name> --query objectId --output tsv)

az role assignment create --assignee-object-id $adgroupId --role "Virtual Machine Contributor" --resource-group myResourceGroup
```

If you receive an error stating **Principal \<guid> does not exist in the directory**, the new group hasn't propagated throughout Azure Active Directory. Try running the command again.

Typically, you repeat the process for *Network Contributor* and *Storage Account Contributor* to make sure users are assigned to manage the deployed resources. In this article, you can skip those steps.

## Azure Policy

[Azure Policy](../../governance/policy/overview.md) helps you make sure all resources in subscription meet corporate standards. Your subscription already has several policy definitions. To see the available policy definitions, use the [az policy definition list](/cli/azure/policy/definition) command:

```azurecli-interactive
az policy definition list --query "[].[displayName, policyType, name]" --output table
```

You see the existing policy definitions. The policy type is either **BuiltIn** or **Custom**. Look through the definitions for ones that describe a condition you want assign. In this article, you assign policies that:

* Limit the locations for all resources.
* Limit the SKUs for virtual machines.
* Audit virtual machines that don't use managed disks.

In the following example, you retrieve three policy definitions based on the display name. You use the [az policy assignment create](/cli/azure/policy/assignment) command to assign those definitions to the resource group. For some policies, you provide parameter values to specify the allowed values.

```azurecli-interactive
# Get policy definitions for allowed locations, allowed SKUs, and auditing VMs that don't use managed disks
locationDefinition=$(az policy definition list --query "[?displayName=='Allowed locations'].name | [0]" --output tsv)
skuDefinition=$(az policy definition list --query "[?displayName=='Allowed virtual machine SKUs'].name | [0]" --output tsv)
auditDefinition=$(az policy definition list --query "[?displayName=='Audit VMs that do not use managed disks'].name | [0]" --output tsv)

# Assign policy for allowed locations
az policy assignment create --name "Set permitted locations" \
  --resource-group myResourceGroup \
  --policy $locationDefinition \
  --params '{ 
      "listOfAllowedLocations": {
        "value": [
          "eastus", 
          "eastus2"
        ]
      }
    }'

# Assign policy for allowed SKUs
az policy assignment create --name "Set permitted VM SKUs" \
  --resource-group myResourceGroup \
  --policy $skuDefinition \
  --params '{ 
      "listOfAllowedSKUs": {
        "value": [
          "Standard_DS1_v2", 
          "Standard_E2s_v2"
        ]
      }
    }'

# Assign policy for auditing unmanaged disks
az policy assignment create --name "Audit unmanaged disks" \
  --resource-group myResourceGroup \
  --policy $auditDefinition
```

The preceding example assumes you already know the parameters for a policy. If you need to view the parameters, use:

```azurecli-interactive
az policy definition show --name $locationDefinition --query parameters
```

## Deploy the virtual machine

You have assigned roles and policies, so you're ready to deploy your solution. The default size is Standard_DS1_v2, which is one of your allowed SKUs. The command creates SSH keys if they don't exist in a default location.

```azurecli-interactive
az vm create --resource-group myResourceGroup --name myVM --image UbuntuLTS --generate-ssh-keys
```

After your deployment finishes, you can apply more management settings to the solution.

## Lock resources

[Resource locks](../../azure-resource-manager/resource-group-lock-resources.md) prevent users in your organization from accidentally deleting or modifying critical resources. Unlike role-based access control, resource locks apply a restriction across all users and roles. You can set the lock level to *CanNotDelete* or *ReadOnly*.

To create or delete management locks, you must have access to `Microsoft.Authorization/locks/*` actions. Of the built-in roles, only **Owner** and **User Access Administrator** are granted those actions.

To lock the virtual machine and network security group, use the [az lock create](/cli/azure/lock) command:

```azurecli-interactive
# Add CanNotDelete lock to the VM
az lock create --name LockVM \
  --lock-type CanNotDelete \
  --resource-group myResourceGroup \
  --resource-name myVM \
  --resource-type Microsoft.Compute/virtualMachines

# Add CanNotDelete lock to the network security group
az lock create --name LockNSG \
  --lock-type CanNotDelete \
  --resource-group myResourceGroup \
  --resource-name myVMNSG \
  --resource-type Microsoft.Network/networkSecurityGroups
```

To test the locks, try running the following command:

```azurecli-interactive 
az group delete --name myResourceGroup
```

You see an error stating that the delete operation can't be completed because of a lock. The resource group can only be deleted if you specifically remove the locks. That step is shown in [Clean up resources](#clean-up-resources).

## Tag resources

You apply [tags](../../azure-resource-manager/resource-group-using-tags.md) to your Azure resources to logically organize them by categories. Each tag consists of a name and a value. For example, you can apply the name "Environment" and the value "Production" to all the resources in production.

[!INCLUDE [Resource Manager governance tags CLI](../../../includes/resource-manager-governance-tags-cli.md)]

To apply tags to a virtual machine, use the [az resource tag](/cli/azure/resource) command. Any existing tags on the resource aren't retained.

```azurecli-interactive
az resource tag -n myVM \
  -g myResourceGroup \
  --tags Dept=IT Environment=Test Project=Documentation \
  --resource-type "Microsoft.Compute/virtualMachines"
```

### Find resources by tag

To find resources with a tag name and value, use the [az resource list](/cli/azure/resource) command:

```azurecli-interactive
az resource list --tag Environment=Test --query [].name
```

You can use the returned values for management tasks like stopping all virtual machines with a tag value.

```azurecli-interactive
az vm stop --ids $(az resource list --tag Environment=Test --query "[?type=='Microsoft.Compute/virtualMachines'].id" --output tsv)
```

### View costs by tag values

[!INCLUDE [Resource Manager governance tags billing](../../../includes/resource-manager-governance-tags-billing.md)]

## Clean up resources

The locked network security group can't be deleted until the lock is removed. To remove the lock, retrieve the IDs of the locks and provide them to the [az lock delete](/cli/azure/lock) command:

```azurecli-interactive
vmlock=$(az lock show --name LockVM \
  --resource-group myResourceGroup \
  --resource-type Microsoft.Compute/virtualMachines \
  --resource-name myVM --output tsv --query id)
nsglock=$(az lock show --name LockNSG \
  --resource-group myResourceGroup \
  --resource-type Microsoft.Network/networkSecurityGroups \
  --resource-name myVMNSG --output tsv --query id)
az lock delete --ids $vmlock $nsglock
```

When no longer needed, you can use the [az group delete](/cli/azure/group) command to remove the resource group, VM, and all related resources. Exit the SSH session to your VM, then delete the resources as follows:

```azurecli-interactive 
az group delete --name myResourceGroup
```


## Next steps

In this tutorial, you created a custom VM image. You learned how to:

> [!div class="checklist"]
> * Assign users to a role
> * Apply policies that enforce standards
> * Protect critical resources with locks
> * Tag resources for billing and management

Advance to the next tutorial to learn about how highly available virtual machines.

> [!div class="nextstepaction"]
> [Monitor virtual machines](tutorial-monitoring.md)

