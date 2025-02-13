---
author: dramasamy
ms.author: dramasamy
ms.date: 07/07/2023
ms.topic: include
ms.service: azure-operator-nexus
ms.custom: devx-track-azurecli
---

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

* Install the latest version of the [necessary Azure CLI extensions](../../howto-install-cli-extensions.md).
* This article requires version 2.61.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
* If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the [`az account`][az-account] command.
* Before proceeding with virtual machine creation, ensure that the container image to be used is created according to the [instructions](../../howto-virtual-machine-image.md).
* Create a resource group using the [`az group create`][az-group-create] command. An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation. The following example creates a resource group named *myResourceGroup* in the *eastus* location.
    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

    The following output example resembles successful creation of the resource group:

    ```json
    {
      "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
      "location": "eastus",
      "managedBy": null,
      "name": "myResourceGroup",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "tags": null
    }
    ```
* To deploy a Bicep file or ARM template, you need write access on the resources you're deploying and access to all operations on the Microsoft.Resources/deployments resource type. For example, to deploy a cluster, you need Microsoft.NetworkCloud/virtualMachines/write and Microsoft.Resources/deployments/* permissions. For a list of roles and permissions, see [Azure built-in roles](../../../role-based-access-control/built-in-roles.md).
* You need the `custom location` resource ID of your Azure Operator Nexus cluster.
* You need to create [various networks](../../quickstarts-tenant-workload-prerequisites.md#create-networks-for-tenant-workloads) according to your specific workload requirements, and it's essential to have the appropriate IP addresses available for your workloads. To ensure a smooth implementation, it's advisable to consult the relevant support teams for assistance.

<!-- LINKS - internal -->
[kubernetes-concepts]: ../../../aks/concepts-clusters-workloads.md
[az-account]: /cli/azure/account
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete
[azure-resource-group]: ../../../azure-resource-manager/management/overview.md
