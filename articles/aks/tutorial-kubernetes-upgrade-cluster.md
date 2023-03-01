---
title: Kubernetes on Azure tutorial - Upgrade a cluster
description: In this Azure Kubernetes Service (AKS) tutorial, you learn how to upgrade an existing AKS cluster to the latest available Kubernetes version.
ms.topic: tutorial
ms.date: 11/15/2022
ms.custom: mvc, devx-track-azurepowershell, event-tier1-build-2022
#Customer intent: As a developer or IT pro, I want to learn how to upgrade an Azure Kubernetes Service (AKS) cluster so that I can use the latest version of Kubernetes and features.
---

# Tutorial: Upgrade Kubernetes in Azure Kubernetes Service (AKS)

As part of the application and cluster lifecycle, you may want to upgrade to the latest available version of Kubernetes. You can upgrade your Azure Kubernetes Service (AKS) cluster by using the Azure CLI, Azure PowerShell, or the Azure portal.

In this tutorial, part seven of seven, you learn how to:

> [!div class="checklist"]
>
> * Identify current and available Kubernetes versions.
> * Upgrade your Kubernetes nodes.
> * Validate a successful upgrade.

## Before you begin

In previous tutorials, an application was packaged into a container image, and this container image was uploaded to Azure Container Registry (ACR). You also created an AKS cluster. The application was then deployed to the AKS cluster. If you have not done these steps and would like to follow along, start with [Tutorial 1: Prepare an application for AKS][aks-tutorial-prepare-app].

* If you're using Azure CLI, this tutorial requires that you're running Azure CLI version 2.34.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].
* If you're using Azure PowerShell, this tutorial requires that you're running Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

## Get available cluster versions

### [Azure CLI](#tab/azure-cli)

Before you upgrade a cluster, use the [az aks get-upgrades][] command to check which Kubernetes releases are available.

```azurecli
az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster
```

In the following example output, the current version is *1.18.10*, and the available versions are shown under *upgrades*.

```output
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

Before you upgrade a cluster, use the [Get-AzAksCluster][get-azakscluster] cmdlet to check which Kubernetes version you're running and the region in which it resides.

```azurepowershell
Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster |
  Select-Object -Property Name, KubernetesVersion, Location
```

In the following example output, the current version is *1.19.9*.

```output
Name            KubernetesVersion       Location
----            -----------------       --------
myAKSCluster    1.19.9                  eastus
```

Use the [Get-AzAksVersion][get-azaksversion] cmdlet to check which Kubernetes upgrade releases are available in the region where your AKS cluster resides.

```azurepowershell
Get-AzAksVersion -Location eastus | Where-Object OrchestratorVersion -gt 1.19.9
```

The available versions are shown under *OrchestratorVersion*.

```output
Default     IsPreview     OrchestratorType     OrchestratorVersion
-------     ---------     ----------------     -------------------
                          Kubernetes           1.20.2
                          Kubernetes           1.20.5
```

### [Azure portal](#tab/azure-portal)

To check which Kubernetes releases are available for your cluster:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to your AKS cluster.
3. Under **Settings**, select **Cluster configuration**.
4. In **Kubernetes version**, select **Upgrade version**. This will redirect you to a new page.
5. In **Kubernetes version**, select the version to check for available upgrades.

If no upgrades are available, create a new cluster with a supported version of Kubernetes and migrate your workloads from the existing cluster to the new cluster. It's not supported to upgrade a cluster to a newer Kubernetes version when no upgrades are available.

---

## Upgrade a cluster

AKS nodes are carefully cordoned and drained to minimize any potential disruptions to running applications. The following steps are performed during this process:

1. The Kubernetes scheduler prevents additional pods from being scheduled on a node that is to be upgraded.
1. Running pods on the node are scheduled on other nodes in the cluster.
1. A new node is created that runs the latest Kubernetes components.
1. When the new node is ready and joined to the cluster, the Kubernetes scheduler begins to run pods on the new node.
1. The old node is deleted, and the next node in the cluster begins the cordon and drain process.

[!INCLUDE [alias minor version callout](./includes/aliasminorversion/alias-minor-version-upgrade.md)]

### [Azure CLI](#tab/azure-cli)

Use the [az aks upgrade][] command to upgrade your AKS cluster.

```azurecli
az aks upgrade \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --kubernetes-version KUBERNETES_VERSION
```

> [!NOTE]
> You can only upgrade one minor version at a time. For example, you can upgrade from *1.14.x* to *1.15.x*, but you cannot upgrade from *1.14.x* to *1.16.x* directly. To upgrade from *1.14.x* to *1.16.x*, you must first upgrade from *1.14.x* to *1.15.x*, then perform another upgrade from *1.15.x* to *1.16.x*.

The following example output shows the result of upgrading to *1.19.1*. Notice the *kubernetesVersion* now reports *1.19.1*.

```output
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

Use the [Set-AzAksCluster][set-azakscluster] cmdlet to upgrade your AKS cluster.

```azurepowershell
Set-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -KubernetesVersion <KUBERNETES_VERSION>
```

> [!NOTE]
> You can only upgrade one minor version at a time. For example, you can upgrade from *1.14.x* to *1.15.x*, but you cannot upgrade from *1.14.x* to *1.16.x* directly. To upgrade from *1.14.x* to *1.16.x*, first upgrade from *1.14.x* to *1.15.x*, then perform another upgrade from *1.15.x* to *1.16.x*.

The following example output shows the result of upgrading to *1.19.9*. Notice the *kubernetesVersion* now reports *1.20.2*.

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

### [Azure portal](#tab/azure-portal)

To upgrade your AKS cluster:

1. In the Azure portal, navigate to your AKS cluster.
2. Under **Settings**, select **Cluster configuration**.
3. In **Kubernetes version**, select **Upgrade version**. This will redirect you to a new page.
4. In **Kubernetes version**, select your desired version and then select **Save**.

It takes a few minutes to upgrade the cluster, depending on how many nodes you have.

---

## View the upgrade events

When you upgrade your cluster, the following Kubernetes events may occur on the nodes:

* **Surge**: Create surge node.
* **Drain**: Pods are being evicted from the node. Each pod has a *5 minute timeout* to complete the eviction.
* **Update**: Update of a node has succeeded or failed.
* **Delete**: Delete a surge node.

Use `kubectl get events` to show events in the default namespaces while running an upgrade.

```azurecli-interactive
kubectl get events 
```

The following example output shows some of the above events listed during an upgrade.

```output
...
default 2m1s Normal Drain node/aks-nodepool1-96663640-vmss000001 Draining node: [aks-nodepool1-96663640-vmss000001]
...
default 9m22s Normal Surge node/aks-nodepool1-96663640-vmss000002 Created a surge node [aks-nodepool1-96663640-vmss000002 nodepool1] for agentpool %!s(MISSING)
...
```

---

## Validate an upgrade

### [Azure CLI](#tab/azure-cli)

Confirm that the upgrade was successful using the [az aks show][] command.

```azurecli
az aks show --resource-group myResourceGroup --name myAKSCluster --output table
```

The following example output shows the AKS cluster runs *KubernetesVersion 1.19.1*:

```output
Name          Location    ResourceGroup    KubernetesVersion    CurrentKubernetesVersion  ProvisioningState    Fqdn
------------  ----------  ---------------  -------------------  ------------------------  -------------------  ----------------------------------------------------------------
myAKSCluster  eastus      myResourceGroup  1.19.1               1.19.1                    Succeeded            myaksclust-myresourcegroup-19da35-bd54a4be.hcp.eastus.azmk8s.io
```

### [Azure PowerShell](#tab/azure-powershell)

Confirm that the upgrade was successful using the [Get-AzAksCluster][get-azakscluster] cmdlet.

```azurepowershell
Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster |
  Select-Object -Property Name, Location, KubernetesVersion, ProvisioningState
```

The following example output shows the AKS cluster runs *KubernetesVersion 1.20.2*:

```output
Name         Location   KubernetesVersion   ProvisioningState
----         --------   -----------------   -----------------
myAKSCluster eastus     1.20.2              Succeeded
```

### [Azure portal](#tab/azure-portal)

To confirm that the upgrade was successful, navigate to your AKS cluster in the Azure portal. On the **Overview** page, select the **Kubernetes version** and ensure it's the latest version you installed in the previous step.

---

## Delete the cluster

As this tutorial is the last part of the series, you may want to delete your AKS cluster. The Kubernetes nodes run on Azure virtual machines and continue incurring charges even if you don't use the cluster.

### [Azure CLI](#tab/azure-cli)

Use the [az group delete][az-group-delete] command to remove the resource group, container service, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

### [Azure PowerShell](#tab/azure-powershell)

Use the [Remove-AzResourceGroup][remove-azresourcegroup] cmdlet to remove the resource group, container service, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

### [Azure portal](#tab/azure-portal)

To delete your AKS cluster:

1. In the Azure portal, navigate to your AKS cluster.
2. On the **Overview** page, select **Delete**.
3. A popup will appear that asks you to confirm the deletion of the cluster. Select **Yes**.

---

> [!NOTE]
> When you delete the cluster, the Azure Active Directory (AAD) service principal used by the AKS cluster isn't removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion][sp-delete]. If you used a managed identity, the identity is managed by the platform and it doesn't require that you provision or rotate any secrets.

## Next steps

In this tutorial, you upgraded Kubernetes in an AKS cluster. You learned how to:

> [!div class="checklist"]
> * Identify current and available Kubernetes versions.
> * Upgrade your Kubernetes nodes.
> * Validate a successful upgrade.

For more information on AKS, see [AKS overview][aks-intro]. For guidance on how to create full solutions with AKS, see [AKS solution guidance][aks-solution-guidance].

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
[sp-delete]: kubernetes-service-principal.md#other-considerations
[aks-solution-guidance]: /azure/architecture/reference-architectures/containers/aks-start-here?WT.mc_id=AKSDOCSPAGE
[azure-powershell-install]: /powershell/azure/install-az-ps
[get-azakscluster]: /powershell/module/az.aks/get-azakscluster
[get-azaksversion]: /powershell/module/az.aks/get-azaksversion
[set-azakscluster]: /powershell/module/az.aks/set-azakscluster
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
