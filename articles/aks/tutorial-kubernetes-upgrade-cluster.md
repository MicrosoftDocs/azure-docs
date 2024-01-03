---
title: Kubernetes on Azure tutorial - Upgrade an Azure Kubernetes Service (AKS) cluster
description: In this Azure Kubernetes Service (AKS) tutorial, you learn how to upgrade an existing AKS cluster to the latest available Kubernetes version.
ms.topic: tutorial
ms.date: 11/02/2023
ms.custom: mvc, devx-track-azurepowershell, event-tier1-build-2022
#Customer intent: As a developer or IT pro, I want to learn how to upgrade an Azure Kubernetes Service (AKS) cluster so that I can use the latest version of Kubernetes and features.
---

# Tutorial - Upgrade an Azure Kubernetes Service (AKS) cluster

As part of the application and cluster lifecycle, you might want to upgrade to the latest available version of Kubernetes. You can upgrade your Azure Kubernetes Service (AKS) cluster using the Azure CLI, Azure PowerShell, or the Azure portal.

In this tutorial, part seven of seven, you upgrade an AKS cluster. You learn how to:

> [!div class="checklist"]
>
> * Identify current and available Kubernetes versions.
> * Upgrade your Kubernetes nodes.
> * Validate a successful upgrade.

## Before you begin

In previous tutorials, you packaged an application into a container image and uploaded the container image to Azure Container Registry (ACR). You also created an AKS cluster and deployed an application to it. If you haven't completed these steps and want to follow along, start with [Tutorial 1 - Prepare application for AKS][aks-tutorial-prepare-app].

If using Azure CLI, this tutorial requires Azure CLI version 2.34.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

If using Azure PowerShell, this tutorial requires Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

## Get available cluster versions

### [Azure CLI](#tab/azure-cli)

* Before you upgrade, check which Kubernetes releases are available for your cluster using the [`az aks get-upgrades`][az-aks-get-upgrades] command.

    ```azurecli-interactive
    az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster
    ```

    The following example output shows the current version as *1.26.6* and lists the available versions under `upgrades`:

    ```output
    {
      "agentPoolProfiles": null,
      "controlPlaneProfile": {
        "kubernetesVersion": "1.26.6",
        ...
        "upgrades": [
          {
            "isPreview": null,
            "kubernetesVersion": "1.27.1"
          },
          {
            "isPreview": null,
            "kubernetesVersion": "1.27.3"
          }
        ]
      },
      ...
    }
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Before you upgrade, check which Kubernetes releases are available for your cluster and the region where your cluster resides using the [`Get-AzAksCluster`][get-azakscluster] cmdlet.

    ```azurepowershell-interactive
    Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster |
      Select-Object -Property Name, KubernetesVersion, Location
    ```

    The following example output shows the current version as *1.26.6* and the location as *eastus*:

    ```output
    Name            KubernetesVersion       Location
    ----            -----------------       --------
    myAKSCluster    1.26.6                  eastus
    ```

2. Check which Kubernetes upgrade releases are available in the region where your cluster resides using the [`Get-AzAksVersion`][get-azaksversion] cmdlet.

    ```azurepowershell-interactive
    Get-AzAksVersion -Location eastus | Where-Object OrchestratorVersion
    ```

    The following example output shows the available versions under `OrchestratorVersion`:

    ```output
    Default     IsPreview     OrchestratorType     OrchestratorVersion
    -------     ---------     ----------------     -------------------
                              Kubernetes           1.27.1
                              Kubernetes           1.27.3
    ```

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to your AKS cluster.
3. Under **Settings**, select **Cluster configuration**.
4. In **Kubernetes version**, select **Upgrade version**. This redirects you to a new page.
5. In **Kubernetes version**, select the version to check for available upgrades.

If no upgrades are available, create a new cluster with a supported version of Kubernetes and migrate your workloads from the existing cluster to the new cluster. It's not supported to upgrade a cluster to a newer Kubernetes version when no upgrades are available.

---

## Upgrade an AKS cluster

AKS nodes are carefully cordoned and drained to minimize any potential disruptions to running applications. During this process, AKS performs the following steps:

* Adds a new buffer node (or as many nodes as configured in [max surge](./upgrade-aks-cluster.md#customize-node-surge-upgrade)) to the cluster that runs the specified Kubernetes version.
* [Cordons and drains][kubernetes-drain] one of the old nodes to minimize disruption to running applications. If you're using max surge, it [cordons and drains][kubernetes-drain] as many nodes at the same time as the number of buffer nodes specified.
* When the old node is fully drained, it's reimaged to receive the new version and becomes the buffer node for the following node to be upgraded.
* This process repeats until all nodes in the cluster have been upgraded.
* At the end of the process, the last buffer node is deleted, maintaining the existing agent node count and zone balance.

[!INCLUDE [alias minor version callout](./includes/aliasminorversion/alias-minor-version-upgrade.md)]

You can either [manually upgrade your cluster](#manually-upgrade-cluster) or [configure automatic cluster upgrades](#configure-automatic-cluster-upgrades). **We recommend you configure automatic cluster upgrades to ensure your cluster is always running the latest version of Kubernetes**.

### Manually upgrade cluster

#### [Azure CLI](#tab/azure-cli)

* Upgrade your cluster using the [`az aks upgrade`][az-aks-upgrade] command.

    ```azurecli-interactive
    az aks upgrade \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --kubernetes-version KUBERNETES_VERSION
    ```

    > [!NOTE]
    > You can only upgrade one minor version at a time. For example, you can upgrade from *1.14.x* to *1.15.x*, but you can't upgrade from *1.14.x* to *1.16.x* directly. To upgrade from *1.14.x* to *1.16.x*, you must first upgrade from *1.14.x* to *1.15.x*, then perform another upgrade from *1.15.x* to *1.16.x*.

    The following example output shows the result of upgrading to *1.27.3*. Notice the `kubernetesVersion` now shows *1.27.3*:

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
      "kubernetesVersion": "1.27.3",
      "location": "eastus",
      "name": "myAKSCluster",
      "type": "Microsoft.ContainerService/ManagedClusters"
    }
    ```

#### [Azure PowerShell](#tab/azure-powershell)

* Upgrade your cluster using the [`Set-AzAksCluster`][set-azakscluster] cmdlet.

    ```azurepowershell-interactive
    Set-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -KubernetesVersion <KUBERNETES_VERSION>
    ```

    > [!NOTE]
    > You can only upgrade one minor version at a time. For example, you can upgrade from *1.14.x* to *1.15.x*, but you can't upgrade from *1.14.x* to *1.16.x* directly. To upgrade from *1.14.x* to *1.16.x*, first upgrade from *1.14.x* to *1.15.x*, then perform another upgrade from *1.15.x* to *1.16.x*.

    The following example output shows the result of upgrading to *1.27.3*. Notice the `KubernetesVersion` now shows *1.27.3*:

    ```output
    ProvisioningState       : Succeeded
    MaxAgentPools           : 100
    KubernetesVersion       : 1.27.3
    PrivateFQDN             :
    AgentPoolProfiles       : {default}
    Name                    : myAKSCluster
    Type                    : Microsoft.ContainerService/ManagedClusters
    Location                : eastus
    Tags                    : {}
    ```

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, navigate to your AKS cluster.
2. Under **Settings**, select **Cluster configuration**.
3. In **Kubernetes version**, select **Upgrade version**. This redirects you to a new page.
4. In **Kubernetes version**, select your desired version and then select **Save**.

It takes a few minutes to upgrade the cluster, depending on how many nodes you have.

---

### Configure automatic cluster upgrades

#### [Azure CLI](#tab/azure-cli)

* Set an auto-upgrade channel on your cluster using the [`az aks update`][az-aks-update] command with the `--auto-upgrade-channel` parameter set to `patch`.

    ```azurecli-interactive
    az aks update --resource-group myResourceGroup --name myAKSCluster --auto-upgrade-channel patch
    ```

#### [Azure PowerShell](#tab/azure-powershell)

* Set an auto-upgrade channel on your cluster using the [`Set-AzAksCluster`][set-azakscluster] cmdlet with the `-AutoUpgradeChannel` parameter set to `Patch`.

    ```azurepowershell-interactive
    Set-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -AutoUpgradeChannel Patch
    ```

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, navigate to your AKS cluster.
2. Under **Settings**, select **Cluster configuration**.
3. In **Kubernetes version**, select **Upgrade version**.
4. For **Automatic upgrade**, select **Enabled with patch (recommended)** > **Save**.

---

For more information, see [Automatically upgrade an Azure Kubernetes Service (AKS) cluster][aks-auto-upgrade].

#### Upgrade AKS node images

AKS regularly provides new node images. Linux node images are updated weekly, and Windows node images are updated monthly. We recommend upgrading your node images frequently to use the latest AKS features and security updates. For more information, see [Upgrade node images in Azure Kubernetes Service (AKS)][node-image-upgrade]. To configure automatic node image upgrades, see [Automatically upgrade Azure Kubernetes Service (AKS) cluster node operating system images][auto-upgrade-node-image].

## View the upgrade events

> [!NOTE]
> When you upgrade your cluster, the following Kubernetes events might occur on the nodes:
>
> * **Surge**: Create a surge node.
> * **Drain**: Evict pods from the node. Each pod has a *five minute timeout* to complete the eviction.
> * **Update**: Update of a node has succeeded or failed.
> * **Delete**: Delete a surge node.

* View the upgrade events in the default namespaces using the `kubectl get events` command.

    ```console
    kubectl get events --field-selector source=upgrader
    ```

    The following example output shows some of the above events listed during an upgrade:

    ```output
    ...
    default 2m1s Normal Drain node/aks-nodepool1-96663640-vmss000001 Draining node: [aks-nodepool1-96663640-vmss000001]
    ...
    default 9m22s Normal Surge node/aks-nodepool1-96663640-vmss000002 Created a surge node [aks-nodepool1-96663640-vmss000002 nodepool1] for agentpool %!s(MISSING)
    ...
    ```

## Validate an upgrade

### [Azure CLI](#tab/azure-cli)

* Confirm the upgrade was successful using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --output table
    ```

    The following example output shows the AKS cluster runs *KubernetesVersion 1.27.3*:

    ```output
    Name          Location    ResourceGroup    KubernetesVersion    CurrentKubernetesVersion  ProvisioningState    Fqdn
    ------------  ----------  ---------------  -------------------  ------------------------  -------------------  ----------------------------------------------------------------
    myAKSCluster  eastus      myResourceGroup  1.27.3               1.27.3                    Succeeded            myaksclust-myresourcegroup-19da35-bd54a4be.hcp.eastus.azmk8s.io
    ```

### [Azure PowerShell](#tab/azure-powershell)

* Confirm the upgrade was successful using the [`Get-AzAksCluster`][get-azakscluster] cmdlet.

    ```azurepowershell-interactive
    Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster |
      Select-Object -Property Name, Location, KubernetesVersion, ProvisioningState
    ```

    The following example output shows the AKS cluster runs *KubernetesVersion 1.27.3*:

    ```output
    Name         Location   KubernetesVersion   ProvisioningState
    ----         --------   -----------------   -----------------
    myAKSCluster eastus     1.27.3              Succeeded
    ```

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, navigate to your AKS cluster.
2. On the **Overview** page, select the **Kubernetes version** and ensure it's the latest version you installed in the previous step.

---

## Delete the cluster

As this tutorial is the last part of the series, you might want to delete your AKS cluster to avoid incurring Azure charges.

### [Azure CLI](#tab/azure-cli)

* Remove the resource group, container service, and all related resources using the [`az group delete`][az-group-delete] command.

    ```azurecli-interactive
    az group delete --name myResourceGroup --yes --no-wait
    ```

### [Azure PowerShell](#tab/azure-powershell)

* Remove the resource group, container service, and all related resources using the [`Remove-AzResourceGroup`][remove-azresourcegroup] cmdlet.

    ```azurepowershell-interactive
    Remove-AzResourceGroup -Name myResourceGroup
    ```

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, navigate to your AKS cluster.
2. On the **Overview** page, select **Delete**.
3. On the popup that asks you to confirm the deletion of the cluster, select **Yes**.

---

> [!NOTE]
> When you delete the cluster, the Microsoft Entra service principal used by the AKS cluster isn't removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion][sp-delete]. If you used a managed identity, the identity is managed by the platform and doesn't require that you provision or rotate any secrets.

## Next steps

In this tutorial, you upgraded Kubernetes in an AKS cluster. You learned how to:

> [!div class="checklist"]
>
> * Identify current and available Kubernetes versions.
> * Upgrade your Kubernetes nodes.
> * Validate a successful upgrade.

For more information on AKS, see the [AKS overview][aks-intro]. For guidance on how to create full solutions with AKS, see the [AKS solution guidance][aks-solution-guidance].

<!-- LINKS - external -->
[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/

<!-- LINKS - internal -->
[aks-intro]: ./intro-kubernetes.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-aks-get-upgrades]: /cli/azure/aks#az_aks_get_upgrades
[az-aks-upgrade]: /cli/azure/aks#az_aks_upgrade
[azure-cli-install]: /cli/azure/install-azure-cli
[az-group-delete]: /cli/azure/group#az_group_delete
[sp-delete]: kubernetes-service-principal.md#other-considerations
[aks-solution-guidance]: /azure/architecture/reference-architectures/containers/aks-start-here?WT.mc_id=AKSDOCSPAGE
[azure-powershell-install]: /powershell/azure/install-az-ps
[get-azakscluster]: /powershell/module/az.aks/get-azakscluster
[get-azaksversion]: /powershell/module/az.aks/get-azaksversion
[set-azakscluster]: /powershell/module/az.aks/set-azakscluster
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
[aks-auto-upgrade]: ./auto-upgrade-cluster.md
[auto-upgrade-node-image]: ./auto-upgrade-node-image.md
[node-image-upgrade]: ./node-image-upgrade.md
[az-aks-update]: /cli/azure/aks#az_aks_update
