---
title: Kubernetes on Azure tutorial - Upgrade a cluster
description: In this Azure Kubernetes Service (AKS) tutorial, you learn how to upgrade an existing AKS cluster to the latest available Kubernetes version.
services: container-service
ms.topic: tutorial
ms.date: 05/24/2021

ms.custom: mvc, devx-track-azurepowershell

#Customer intent: As a developer or IT pro, I want to learn how to upgrade an Azure Kubernetes Service (AKS) cluster so that I can use the latest version of Kubernetes and features.
---

# Tutorial: Upgrade Kubernetes in Azure Kubernetes Service (AKS)

As part of the application and cluster lifecycle, you may wish to upgrade to the latest available version of Kubernetes and use new features. An Azure Kubernetes Service (AKS) cluster can be upgraded using the Azure CLI.

In this tutorial, part seven of seven, a Kubernetes cluster is upgraded. You learn how to:

> [!div class="checklist"]
> * Identify current and available Kubernetes versions
> * Upgrade the Kubernetes nodes
> * Validate a successful upgrade

## Before you begin

In previous tutorials, an application was packaged into a container image. This image was uploaded to Azure Container Registry, and you created an AKS cluster. The application was then deployed to the AKS cluster. If you have not done these steps, and would like to follow along, start with [Tutorial 1 – Create container images][aks-tutorial-prepare-app].

### [Azure CLI](#tab/azure-cli)

This tutorial requires that you are running the Azure CLI version 2.0.53 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### [Azure PowerShell](#tab/azure-powershell)

This tutorial requires that you're running Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

---

## Get available cluster versions

### [Azure CLI](#tab/azure-cli)

Before you upgrade a cluster, use the [az aks get-upgrades][] command to check which Kubernetes releases are available for upgrade:

```azurecli
az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster
```

In the following example, the current version is *1.18.10*, and the available versions are shown under *upgrades*.

```json
{
  "agentPoolProfiles": null,
  "controlPlaneProfile": {
    "kubernetesVersion": "1.18.10",
    ...
    "upgrades": [
      {
        "isPreview": null,
        "kubernetesVersion": "1.19.1"
      },
      {
        "isPreview": null,
        "kubernetesVersion": "1.19.3"
      }
    ]
  },
  ...
}
```

### [Azure PowerShell](#tab/azure-powershell)

Before you upgrade a cluster, use the [Get-AzAksCluster][get-azakscluster] cmdlet to determine which Kubernetes version you're running and what region it resides in:

```azurepowershell
Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster |
  Select-Object -Property Name, KubernetesVersion, Location
```

In the following example, the current version is *1.19.9*:

```output
Name         KubernetesVersion Location
----         ----------------- --------
myAKSCluster 1.19.9            eastus
```

Use the [Get-AzAksVersion][get-azaksversion] cmdlet to determine which Kubernetes upgrade releases are available in the region where your AKS cluster resides:

```azurepowershell
Get-AzAksVersion -Location eastus | Where-Object OrchestratorVersion -gt 1.19.9
```

The available versions are shown under *OrchestratorVersion*.

```output
OrchestratorType    : Kubernetes
OrchestratorVersion : 1.20.2
DefaultProperty     :
IsPreview           :
Upgrades            : {Microsoft.Azure.Commands.Aks.Models.PSOrchestratorProfile}

OrchestratorType    : Kubernetes
OrchestratorVersion : 1.20.5
DefaultProperty     :
IsPreview           :
Upgrades            : {}
```

---

## Upgrade a cluster

To minimize disruption to running applications, AKS nodes are carefully cordoned and drained. In this process, the following steps are performed:

1. The Kubernetes scheduler prevents additional pods being scheduled on a node that is to be upgraded.
1. Running pods on the node are scheduled on other nodes in the cluster.
1. A node is created that runs the latest Kubernetes components.
1. When the new node is ready and joined to the cluster, the Kubernetes scheduler begins to run pods on it.
1. The old node is deleted, and the next node in the cluster begins the cordon and drain process.

### [Azure CLI](#tab/azure-cli)

Use the [az aks upgrade][] command to upgrade the AKS cluster.

```azurecli
az aks upgrade \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --kubernetes-version KUBERNETES_VERSION
```

> [!NOTE]
> You can only upgrade one minor version at a time. For example, you can upgrade from *1.14.x* to *1.15.x*, but cannot upgrade from *1.14.x* to *1.16.x* directly. To upgrade from *1.14.x* to *1.16.x*, first upgrade from *1.14.x* to *1.15.x*, then perform another upgrade from *1.15.x* to *1.16.x*.

The following condensed example output shows the result of upgrading to *1.19.1*. Notice the *kubernetesVersion* now reports *1.19.1*:

```json
{
  "agentPoolProfiles": [
    {
      "count": 3,
      "maxPods": 110,
      "name": "nodepool1",
      "osType": "Linux",
      "storageProfile": "ManagedDisks",
      "vmSize": "Standard_DS1_v2",
    }
  ],
  "dnsPrefix": "myAKSClust-myResourceGroup-19da35",
  "enableRbac": false,
  "fqdn": "myaksclust-myresourcegroup-19da35-bd54a4be.hcp.eastus.azmk8s.io",
  "id": "/subscriptions/<Subscription ID>/resourcegroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster",
  "kubernetesVersion": "1.19.1",
  "location": "eastus",
  "name": "myAKSCluster",
  "type": "Microsoft.ContainerService/ManagedClusters"
}
```

### [Azure PowerShell](#tab/azure-powershell)

Use the [Set-AzAksCluster][set-azakscluster] cmdlet to upgrade the AKS cluster.

```azurepowershell
Set-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -KubernetesVersion <KUBERNETES_VERSION>
```

> [!NOTE]
> You can only upgrade one minor version at a time. For example, you can upgrade from *1.14.x* to *1.15.x*, but cannot upgrade from *1.14.x* to *1.16.x* directly. To upgrade from *1.14.x* to *1.16.x*, first upgrade from *1.14.x* to *1.15.x*, then perform another upgrade from *1.15.x* to *1.16.x*.

The following condensed example output shows the result of upgrading to *1.19.9*. Notice the *kubernetesVersion* now reports *1.20.2*:

```output
ProvisioningState       : Succeeded
MaxAgentPools           : 100
KubernetesVersion       : 1.20.2
PrivateFQDN             :
AgentPoolProfiles       : {default}
Name                    : myAKSCluster
Type                    : Microsoft.ContainerService/ManagedClusters
Location                : eastus
Tags                    : {}
```

---

## Validate an upgrade

### [Azure CLI](#tab/azure-cli)

Confirm that the upgrade was successful using the [az aks show][] command as follows:

```azurecli
az aks show --resource-group myResourceGroup --name myAKSCluster --output table
```

The following example output shows the AKS cluster runs *KubernetesVersion 1.19.1*:

```output
Name          Location    ResourceGroup    KubernetesVersion    ProvisioningState    Fqdn
------------  ----------  ---------------  -------------------  -------------------  ----------------------------------------------------------------
myAKSCluster  eastus      myResourceGroup  1.19.1               Succeeded            myaksclust-myresourcegroup-19da35-bd54a4be.hcp.eastus.azmk8s.io
```

### [Azure PowerShell](#tab/azure-powershell)

Confirm that the upgrade was successful using the [Get-AzAksCluster][get-azakscluster] cmdlet as follows:

```azurepowershell
Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster |
  Select-Object -Property Name, Location, KubernetesVersion, ProvisioningState
```

The following example output shows the AKS cluster runs *KubernetesVersion 1.20.2*:

```output
Name         Location KubernetesVersion ProvisioningState
----         -------- ----------------- -----------------
myAKSCluster eastus   1.20.2            Succeeded
```

---

## Delete the cluster

### [Azure CLI](#tab/azure-cli)

As this tutorial is the last part of the series, you may want to delete the AKS cluster. As the Kubernetes nodes run on Azure virtual machines (VMs), they continue to incur charges even if you don't use the cluster. Use the [az group delete][az-group-delete] command to remove the resource group, container service, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```
### [Azure PowerShell](#tab/azure-powershell)

As this tutorial is the last part of the series, you may want to delete the AKS cluster. As the Kubernetes nodes run on Azure virtual machines (VMs), they continue to incur charges even if you don't use the cluster. Use the [Remove-AzResourceGroup][remove-azresourcegroup] cmdlet to remove the resource group, container service, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

---

> [!NOTE]
> When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster is not removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion][sp-delete]. If you used a managed identity, the identity is managed by the platform and does not require you to provision or rotate any secrets.

## Next steps

In this tutorial, you upgraded Kubernetes in an AKS cluster. You learned how to:

> [!div class="checklist"]
> * Identify current and available Kubernetes versions
> * Upgrade the Kubernetes nodes
> * Validate a successful upgrade

For more information on AKS, see [AKS overview][aks-intro]. For guidance on a creating full solutions with AKS, see [AKS solution guidance][aks-solution-guidance].

<!-- LINKS - external -->
[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/

<!-- LINKS - internal -->
[aks-intro]: ./intro-kubernetes.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[az aks show]: /cli/azure/aks#az_aks_show
[az aks get-upgrades]: /cli/azure/aks#az_aks_get_upgrades
[az aks upgrade]: /cli/azure/aks#az_aks_upgrade
[azure-cli-install]: /cli/azure/install-azure-cli
[az-group-delete]: /cli/azure/group#az_group_delete
[sp-delete]: kubernetes-service-principal.md#additional-considerations
[aks-solution-guidance]: /azure/architecture/reference-architectures/containers/aks-start-here?WT.mc_id=AKSDOCSPAGE
[azure-powershell-install]: /powershell/azure/install-az-ps
[get-azakscluster]: /powershell/module/az.aks/get-azakscluster
[get-azaksversion]: /powershell/module/az.aks/get-azaksversion
[set-azakscluster]: /powershell/module/az.aks/set-azakscluster
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
