---
title: Use proximity placement groups to reduce latency for Azure Kubernetes Service (AKS) clusters
description: Learn how to use proximity placement groups to reduce latency for your AKS cluster workloads.
services: container-service
manager: gwallace
ms.topic: article
ms.date: 06/22/2020
---

# Reduce latency with proximity placement groups (Preview)

> [!Note]
> Proximity placement groups help to improve latency, but may reduce an application's availability since resources are colocated in the same datacenter. You can mitigate this risk by deploying multiple node pools across multiple proximity placement groups.

When deploying your application in Azure, spreading Virtual Machine (VM) instances across regions or availability zones creates network latency, which may impact the overall performance of your application. A proximity placement group is a logical grouping used to make sure Azure compute resources are physically located close to each other. For Azure Kubernetes Service (AKS) workloads that require low latency, use [proximity placement groups](https://docs.microsoft.com/azure/virtual-machines/linux/co-location#proximity-placement-groups).

## Limitations

* The proximity placement group spans a single availability zone.
* There is no current support for AKS clusters that use Virtual Machine Availability Sets.
* You can't modify existing node pools to use a proximity placement group.

> [!IMPORTANT]
> AKS preview features are available on a self-service, opt-in basis. Previews are provided "as-is" and "as available," and are excluded from the Service Level Agreements and limited warranty. AKS previews are partially covered by customer support on a best-effort basis. As such, these features are not meant for production use. For more information, see the following support articles:
>
> - [AKS Support Policies](support-policies.md)
> - [Azure Support FAQ](faq.md)

## Before you begin

You must have the following resources installed:

- The aks-preview 0.4.51 extension

### Set up the preview feature for proximity placement groups

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
```
## Node pools and proximity placement groups

A proximity placement group is a colocation constraint and not a pinning mechanism. A proximity placement group resource is pinned to a specific data center during the deployment of the first resource to use the group.

* Many node pools can be associated with a single proximity placement group.
* A node pool may only be associated with a single proximity placement group.

## Create a new AKS cluster with a proximity placement group

The following example uses the [az group create][az-group-create] command to create a resource group named *myResourceGroup* in the *centralus* region. An AKS cluster named *myAKSCluster* is then created using the [az aks create][az-aks-create] command. 

Accelerated networking greatly improves networking performance of virtual machines. Ideally, use proximity placement groups in conjunction with accelerated networking. By default, AKS uses accelerated networking on [supported virtual machine instances](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli?toc=/azure/virtual-machines/linux/toc.json#limitations-and-constraints), which include most Azure virtual machine with two or more vCPUs.

Create a new AKS cluster with a proximity placement groups:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location centralus
```
Run the following command, and store the ID that is returned:

```azurecli-interactive
# Create proximity placement group
az ppg create -n myPPG -g myResourceGroup -l centralus -t standard
```

The command produces output, which includes the *id* value you need for upcoming CLI commands:

```output
{
  "availabilitySets": null,
  "colocationStatus": null,
  "id": "/subscriptions/yourSubscriptionID/resourceGroups/myResourceGroup/providers/Microsoft.Compute/proximityPlacementGroups/myPPG",
  "location": "centralus",
  "name": "myPPG",
  "proximityPlacementGroupType": "Standard",
  "resourceGroup": "myResourceGroup",
  "tags": {},
  "type": "Microsoft.Compute/proximityPlacementGroups",
  "virtualMachineScaleSets": null,
  "virtualMachines": null
}
```

Use the proximity placement group ID for the *myPPGResourceID* value in the below command:

```azurecli-interactive
# Create an AKS cluster that uses a proximity placement group for the initial node pool
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --ppg myPPGResourceID
```

## Add a proximity placement group to an existing cluster

You can add a proximity placement group to an existing cluster by creating a new node pool. You can then optionally migrate existing workloads to the new node pool, and then delete the original node pool.

Use the resource ID from the proximity placement group you created earlier, and add a new node pool:

Add a second node pool using the [`az aks nodepool add`][az-aks-nodepool-add] command. The following example creates a node pool named *mynodepool* that uses the proximity placement group you created earlier:

```azurecli-interactive
# Add a new node pool that uses a proximity placement group
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --ppg myPPGResourceID
```

## Clean up

To delete the cluster, use the [az group delete][az-group-delete] command to delete the AKS resource group:

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

## Next steps

* Learn more about [proximity placement groups][proximity-placement-groups].

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
[az-aks-nodepool-add]: /cli/azure/aks/nodepool?view=azure-cli-latest#az-aks-nodepool-add
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete

