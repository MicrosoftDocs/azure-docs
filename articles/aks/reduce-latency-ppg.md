---
title: Use proximity placement groups to reduce latency for AKS clusters
description: Learn how to use placement proximity groups to reduce latency for your AKS cluster workloads.
services: container-service
manager: gwallace
ms.topic: article
ms.date: 06/22/2020
---

# Use proximity placement groups to reduce latency (Preview)

> [!Note]
> Proximity placement groups improve latency, but may reduce an application's availability since resources are located in the same datacenter.

When deploying your application in Azure, spreading instances across regions or availability zones creates network latency, which may impact the overall performance of your application. A proximity placement group is a logical grouping used to make sure that Azure compute resources are physically located close to each other. For AKS workloads that require low latency scenarios, use proximity placement groups.

## Limitations

* The proximity placement group spans a single availability zone.
* There is no current support for AKS clusters that use Virtual Machine Availability Sets.
* The proximity placement group ID can only be set during the initial node pool creation.

> [!IMPORTANT]
> AKS preview features are available on a self-service, opt-in basis. Previews are provided "as-is" and "as available," and are excluded from the Service Level Agreements and limited warranty. AKS previews are partially covered by customer support on a best-effort basis. As such, these features are not meant for production use. For more information, see the following support articles:
>
> - [AKS Support Policies](support-policies.md)
> - [Azure Support FAQ](faq.md)

## Before you begin

You must have the following resources installed:

- The Azure CLI, version 2.7.0 or later
- The aks-preview 0.4.51 extension

### Set up the preview feature for proximity placement groups

> [!CAUTION]
> After you register a feature on a subscription, you can't currently unregister that feature. When you enable some preview features, defaults might be used for all AKS clusters created afterward in the subscription. Don't enable preview features on production subscriptions. Instead, use a separate subscription to test preview features and gather feedback.

```azurecli-interactive
# register the preview feature
az feature register --namespace "Microsoft.ContainerService" --name "proximityPlacementGPreview"
```

It may take several minutes for the registration. Use the below command to verify the feature is registered:

```azurecli-interactive
# Verify the feature is registered:
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/proximityPlacementGPreview')].{Name:name,State:properties.state}"
```

During preview, you need the *aks-preview* CLI extension to use proximity placement groups. Use the [az extension add][az-extension-add] command, and then check for any available updates using the [az extension update][az-extension-update] command:

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview

To install kubectl, use the following:

```azurecli
sudo az aks install-cli
kubectl version --client
```

Use [these instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/) for other operating systems.

## Create a new AKS cluster with a proximity placement group

The following example uses the [az group create][az-group-create] command to create a resource group named *myResourceGroup* in the *centralus* region. An AKS cluster named *myAKSCluster* is then created using the [az aks create][az-aks-create] command.

Create a new AKS cluster with a proximity placement groups:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location centralus
```
Run the following command, and store the ID that is returned:

```azurecli-interactive
# Create proximity placement group
az ppg create -n myPPG -g myPPGGroup -l centralus -t standard
```

Use the proximity placement group ID for the *ppg parameter* below (myResourceID):

```azurecli-interactive
# Create an AKS cluster
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --vm-set-type VirtualMachineScaleSets \
    --node-count 2 \
    --generate-ssh-keys \
    --load-balancer-sku standard
    --ppg myResourceID
```

## Add a proximity placement group to an existing cluster

You can add a proximity placement group to an existing cluster by modifying the [system pool][system-pool].

TODO


## Next steps

* Learn about [proximity placement groups][proximity-placement-groups].

<!-- LINKS - Internal -->
[azure-ad-rbac]: azure-ad-rbac.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-get-upgrades]: /cli/azure/aks#az-aks-get-upgrades
[az-aks-upgrade]: /cli/azure/aks#az-aks-upgrade
[az-aks-show]: /cli/azure/aks#az-aks-show
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[proximity-placement-groups]: /virtual-machines/linux/co-location
[az-aks-create]: /cli/azure/aks#az-aks-create
[system-pool]: ./use-system-pools.md

