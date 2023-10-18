---
author: rashirg
ms.author: rajeshwarig
ms.date: 09/27/2023
ms.topic: include
ms.service: azure-operator-nexus
ms.custom: devx-track-azurecpowershell
---

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

* Use the Bash environment in [Azure PowerShell](../../../cloud-shell/overview.md). For more information, see [Quickstart for PowerShell in Azure Cloud Shell.](../../../cloud-shell/quickstart.md)

[:::image type="icon" source="~/articles/reusable-content/azure-cli/media/hdi-launch-cloud-shell.png" alt-text="Launch Azure Cloud Shell" :::](https://shell.azure.com)

* If you are running PowerShell locally, install the Az PowerShell module and connect to your Azure account using the [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) cmdlet. For more information about installing the Az PowerShell module, see [Install Azure PowerShell][install-azure-powershell].

* If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet. On setting the subscription, one need not pass the 'SubscriptionID' each time executing the PowerShell command.

* Refer the VM SKU table in the [reference section](../../reference-nexus-kubernetes-cluster-sku.md) for the list of supported VM SKUs.

* Create a resource group using the [New-AzResourceGroup][new-azresourcegroup] cmdlet. An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation. The following example creates a resource group named myResourceGroup in the eastus location.

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

* You need the `custom location` resource ID of your Azure Operator Nexus cluster.
* You need to create [various networks](../../quickstarts-tenant-workload-prerequisites.md#create-networks-for-tenant-workloads) according to your specific workload requirements, and it's essential to have the appropriate IP addresses available for your workloads. To ensure a smooth implementation, it's advisable to consult the relevant support teams for assistance.
* This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

<!-- LINKS - internal -->
[install-azure-powershell]: /powershell/azure/install-az-ps
[new-azresourcegroup]: /powershell/module/az.resources/new-azresourcegroup
[kubernetes-concepts]: ../../../aks/concepts-clusters-workloads.md
[azure-resource-group]: ../../../azure-resource-manager/management/overview.md
