---
title: Use the cluster autoscaler in Azure Kubernetes Service (AKS)
description: Learn how to use the cluster autoscaler to automatically scale your cluster to meet application demands in an Azure Kubernetes Service (AKS) cluster.
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 07/08/2019
ms.author: mlearned
---

# Preview - Automatically scale a cluster to meet application demands on Azure Kubernetes Service (AKS)

To keep up with application demands in Azure Kubernetes Service (AKS), you may need to adjust the number of nodes that run your workloads. The cluster autoscaler component can watch for pods in your cluster that can't be scheduled because of resource constraints. When issues are detected, the number of nodes is increased to meet the application demand. Nodes are also regularly checked for a lack of running pods, with the number of nodes then decreased as needed. This ability to automatically scale up or down the number of nodes in your AKS cluster lets you run an efficient, cost-effective cluster.

This article shows you how to enable and manage the cluster autoscaler in an AKS cluster. Cluster autoscaler should only be tested in preview on AKS clusters with a single node pool.

> [!IMPORTANT]
> AKS preview features are self-service, opt-in. They are provided to gather feedback and bugs from our community. In preview, these features aren't meant for production use. Features in public preview fall under 'best effort' support. Assistance from the AKS technical support teams is available during business hours Pacific timezone (PST) only. For additional information, please see the following support articles:
>
> * [AKS Support Policies][aks-support-policies]
> * [Azure Support FAQ][aks-faq]

## Before you begin

This article requires that you are running the Azure CLI version 2.0.65 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### Install aks-preview CLI extension

To use the cluster autoscaler, you need the *aks-preview* CLI extension version 0.4.1 or higher. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, then check for any available updates using the [az extension update][az-extension-update] command::

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Register scale set feature provider

To create an AKS that uses scale sets, you must also enable a feature flag on your subscription. To register the *VMSSPreview* feature flag, use the [az feature register][az-feature-register] command as shown in the following example:

> [!CAUTION]
> When you register a feature on a subscription, you can't currently un-register that feature. After you enable some preview features, defaults may be used for all AKS clusters then created in the subscription. Don't enable preview features on production subscriptions. Use a separate subscription to test preview features and gather feedback.

```azurecli-interactive
az feature register --name VMSSPreview --namespace Microsoft.ContainerService
```

It takes a few minutes for the status to show *Registered*. You can check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/VMSSPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Limitations

The following limitations apply when you create and manage AKS clusters that use the cluster autoscaler:

* The HTTP application routing add-on can't be used.

## About the cluster autoscaler

To adjust to changing application demands, such as between the workday and evening or on a weekend, clusters often need a way to automatically scale. AKS clusters can scale in one of two ways:

* The **cluster autoscaler** watches for pods that can't be scheduled on nodes because of resource constraints. The cluster automatically then increases the number of nodes.
* The **horizontal pod autoscaler** uses the Metrics Server in a Kubernetes cluster to monitor the resource demand of pods. If a service needs more resources, the number of pods is automatically increased to meet the demand.

![The cluster autoscaler and horizontal pod autoscaler often work together to support the required application demands](media/autoscaler/cluster-autoscaler.png)

Both the horizontal pod autoscaler and cluster autoscaler can also then decrease the number of pods and nodes as needed. The cluster autoscaler decreases the number of nodes when there has been unused capacity for a period of time. Pods on a node to be removed by the cluster autoscaler are safely scheduled elsewhere in the cluster. The cluster autoscaler may be unable to scale down if pods can't move, such as in the following situations:

* A pod directly created and isn't backed by a controller object, such a deployment or replica set.
* A pod disruption budget (PDB) is too restrictive and doesn't allow the number of pods to be fall below a certain threshold.
* A pod uses node selectors or anti-affinity that can't be honored if scheduled on a different node.

For more information about how the cluster autoscaler may be unable to scale down, see [What types of pods can prevent the cluster autoscaler from removing a node?][autoscaler-scaledown]

The cluster autoscaler uses startup parameters for things like time intervals between scale events and resource thresholds. These parameters are defined by the Azure platform, and aren't currently exposed for you to adjust. For more information on what parameters the cluster autoscaler uses, see [What are the cluster autoscaler parameters?][autoscaler-parameters].

The two autoscalers can work together, and are often both deployed in a cluster. When combined, the horizontal pod autoscaler is focused on running the number of pods required to meet application demand. The cluster autoscaler is focused on running the number of nodes required to support the scheduled pods.

> [!NOTE]
> Manual scaling is disabled when you use the cluster autoscaler. Let the cluster autoscaler determine the required number of nodes. If you want to manually scale your cluster, [disable the cluster autoscaler](#disable-the-cluster-autoscaler).

## Create an AKS cluster and enable the cluster autoscaler

If you need to create an AKS cluster, use the [az aks create][az-aks-create] command. Specify a *--kubernetes-version* that meets or exceeds the minimum version number required as outlined in the preceding [Before you begin](#before-you-begin) section. To enable and configure the cluster autoscaler, use the *--enable-cluster-autoscaler* parameter, and specify a node *--min-count* and *--max-count*.

> [!IMPORTANT]
> The cluster autoscaler is a Kubernetes component. Although the AKS cluster uses a virtual machine scale set for the nodes, don't manually enable or edit settings for scale set autoscale in the Azure portal or using the Azure CLI. Let the Kubernetes cluster autoscaler manage the required scale settings. For more information, see [Can I modify the AKS resources in the node resource group?](faq.md#can-i-modify-tags-and-other-properties-of-the-aks-resources-in-the-node-resource-group)

The following example creates an AKS cluster with virtual machine scale set and the cluster autoscaler enabled, and uses a minimum of *1* and maximum of *3* nodes:

```azurecli-interactive
# First create a resource group
az group create --name myResourceGroup --location canadaeast

# Now create the AKS cluster and enable the cluster autoscaler
az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --node-count 1 \
  --enable-vmss \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 3
```

It takes a few minutes to create the cluster and configure the cluster autoscaler settings.

### Enable the cluster autoscaler on an existing AKS cluster

You can enable the cluster autoscaler on an existing AKS cluster that meets the requirements as outlined in the preceding [Before you begin](#before-you-begin) section. Use the [az aks update][az-aks-update] command and choose to *--enable-cluster-autoscaler*, then specify a node *--min-count* and *--max-count*. The following example enables cluster autoscaler on an existing cluster that uses a minimum of *1* and maximum of *3* nodes:

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 3
```

If the minimum node count is greater than the existing number of nodes in the cluster, it takes a few minutes to create the additional nodes.

## Change the cluster autoscaler settings

In the previous step to create or update an existing AKS cluster, the cluster autoscaler minimum node count was set to *1*, and the maximum node count was set to *3*. As your application demands change, you may need to adjust the cluster autoscaler node count.

To change the node count, use the [az aks update][az-aks-update] command and specify a minimum and maximum value. The following example sets the *--min-count* to *1* and the *--max-count* to *5*:

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --update-cluster-autoscaler \
  --min-count 1 \
  --max-count 5
```

> [!NOTE]
> During preview, you can't set a higher minimum node count than is currently set for the cluster. For example, if you currently have min count set to *1*, you can't update the min count to *3*.

Monitor the performance of your applications and services, and adjust the cluster autoscaler node counts to match the required performance.

## Disable the cluster autoscaler

If you no longer wish to use the cluster autoscaler, you can disable it using the [az aks update][az-aks-update] command. Nodes aren't removed when the cluster autoscaler is disabled.

To remove the cluster autoscaler, specify the *--disable-cluster-autoscaler* parameter, as shown in the following example:

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --disable-cluster-autoscaler
```

You can manually scale your cluster using the [az aks scale][az-aks-scale] command. If you use the horizontal pod autoscaler, that feature continues to run with the cluster autoscaler disabled, but pods may end up unable to be scheduled if the node resources are all in use.

## Next steps

This article showed you how to automatically scale the number of AKS nodes. You can also use the horizontal pod autoscaler to automatically adjust the number of pods that run your application. For steps on using the horizontal pod autoscaler, see [Scale applications in AKS][aks-scale-apps].

<!-- LINKS - internal -->
[aks-upgrade]: upgrade-cluster.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-extension-add]: /cli/azure/extension#az-extension-add
[aks-scale-apps]: tutorial-kubernetes-scale.md
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-scale]: /cli/azure/aks#az-aks-scale
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update

<!-- LINKS - external -->
[az-aks-update]: https://github.com/Azure/azure-cli-extensions/tree/master/src/aks-preview
[autoscaler-scaledown]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-types-of-pods-can-prevent-ca-from-removing-a-node
[autoscaler-parameters]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-are-the-parameters-to-ca
