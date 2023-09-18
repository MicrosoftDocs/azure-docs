---
author: rashirg
ms.author: rashirg
ms.date: 07/07/2023
ms.topic: include
ms.service: azure-operator-nexus
ms.custom: devx-track-azurepowershell
---

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

- If you're running PowerShell locally, install the Az PowerShell module and connect to your Azure account using the [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) cmdlet. For more information about installing the Az PowerShell module, see [Install Azure PowerShell][install-azure-powershell].
- If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

    ```azurepowershell-interactive
    Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
    ```

[!INCLUDE [cloud-shell-try-it](../../../../includes/cloud-shell-try-it.md)]

## Create a resource group

An [Azure resource group](../../../azure-resource-manager/management/overview.md) is a logical group in which Azure resources are deployed and managed. When you create a resource group, you will be prompted to specify a location. This location is:

* The storage location of your resource group metadata.
* Where your resources will run in Azure if you don't specify another region during resource creation.

The following example creates a resource group named *myResourceGroup* in the *eastus* region.

Create a resource group using the [New-AzResourceGroup][new-azresourcegroup] cmdlet. An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation.

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location eastus
```

The following output example resembles successful creation of the resource group:

```plaintext
ResourceGroupName : myResourceGroup
Location          : eastus
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup
```

* Before proceeding with virtual machine creation, ensure that the container image to be used is created according to the [instructions](../../howto-virtual-machine-image.md).

* To deploy a Bicep file or ARM template, you need write access on the resources you're deploying and access to all operations on the Microsoft.Resources/deployments resource type. For example, to deploy a cluster, you need Microsoft.NetworkCloud/virtualMachines/write and Microsoft.Resources/deployments/* permissions. For a list of roles and permissions, see [Azure built-in roles](../../../role-based-access-control/built-in-roles.md).
* You need the `custom location` resource ID of your Azure Operator Nexus cluster.
* You need to create [various networks](../../quickstarts-tenant-workload-prerequisites.md#create-networks-for-tenant-workloads) according to your specific workload requirements, and it's essential to have the appropriate IP addresses available for your workloads. To ensure a smooth implementation, it's advisable to consult the relevant support teams for assistance.

<!-- LINKS - internal -->
[kubernetes-concepts]: ../../../aks/concepts-clusters-workloads.md
[az-account]: /cli/azure/account
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-deleteV
[azure-resource-group]: ../../../azure-resource-manager/management/overview.md
