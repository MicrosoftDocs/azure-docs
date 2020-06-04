---
title: Upgrade Azure Kubernetes Service (AKS) node images 
description: Learn how to upgrade the images on AKS cluster nodes and node pools.
services: container-service
ms.topic: conceptual
ms.date: 05/26/2020
---

# Preview - Azure Kubernetes Service (AKS) node image upgrades

AKS supports upgrading the images on a node so you're up to date with the newest OS and Runtime updates. AKS provides one new image per week with the latest updates, so it's beneficial to upgrade your node's images regularly for the latest features, including Linux or Windows patches. This article shows you how to upgrade AKS cluster node images as well as how to update node pool images without upgrading the version of Kubernetes.

If you're interested in learning about the latest images provided by AKS, see the [AKS release notes](https://github.com/Azure/AKS/releases) for more details.

For information on upgrading the Kubernetes version for your cluster, see [Upgrade an AKS cluster][upgrade-cluster].

## Register the node image upgrade preview feature

To use the node image upgrade feature during the preview period, you need to register the feature.

```azurecli
# Register the preview feature
az feature register --namespace "Microsoft.ContainerService" --name "NodeImageUpgradePreview"
```

It will take several minutes for the registration to complete. Use the following command to verify the feature is registered:

```azurecli
# Verify the feature is registered:
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/NodeImageUpgradePreview')].{Name:name,State:properties.state}"
```

During preview, you need the *aks-preview* CLI extension to use node image upgrade. Use the [az extension add][az-extension-add] command, and then check for any available updates using the [az extension update][az-extension-update] command:

```azurecli
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

## Upgrading a node image

Upgrading the node image is done with `az aks upgrade`. To upgrade the node image, use the following command:

```azurecli
az aks upgrade \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-image-only
``` 

To verify which image is on your nodes, you can check the `nodeImageVersion` status. To see the `nodeImageVersion` for your cluster, use:

```azurecli
az aks show --resource-group myResourceGroup --name myAKSCluster --query agentPoolProfiles
```

```output
  "agentPoolProfiles": [
    {
      "availabilityZones": null,
      "count": 1,
      "enableAutoScaling": null,
      "enableNodePublicIp": false,
      "maxCount": null,
      "maxPods": 110,
      "minCount": null,
      "mode": "System",
      "name": "nodepool1",
      "nodeImageVersion": "AKSUbuntu:1604:2020.05.13",
      "nodeLabels": {},
      "nodeTaints": null,
      "orchestratorVersion": "1.15.11",
      "osDiskSizeGb": 100,
      "osType": "Linux",
      "provisioningState": "Succeeded",
      "scaleSetEvictionPolicy": null,
      "scaleSetPriority": null,
      "spotMaxPrice": null,
      "tags": null,
      "type": "VirtualMachineScaleSets",
      "upgradeSettings": null,
      "vmSize": "Standard_D2s_v3"
    }
```

### Upgrading the node pool image

Upgrading the image on a node pool is similar to upgrading the image on a cluster. To update the OS image of the node pool without performing a Kubernetes cluster upgrade, use the `--node-image-only` option shown in the example:

```azurecli
az aks nodepool upgrade \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --node-image-only \
    --no-wait
```

When updating the node pool OS image, you must use the `--kubernetes-version` that the cluster is currently on.

To verify which image is on your nodes, check the `nodeImageVersion` property. Use the following command to see the `nodeImageVersion` for your node pool:

```azurecli
az aks nodepool show \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --query nodeImageVersion
```

This command outputs the version of the node image on the cluster, similar to the following:

```output
"AKSUbuntu:1604:2020.05.13"
```

## Next steps

- Learn how to upgrade the Kubernetes version with [Upgrade an AKS cluster][upgrade-cluster].
- [Apply security and kernel updates to Linux nodes in Azure Kubernetes Service (AKS)][security-update]
- Learn more about multiple node pools and how to upgrade node pools with [Create and manage multiple node pools][use-multiple-node-pools].


<!-- LINKS - internal -->
[upgrade-cluster]: upgrade-cluster.md
[security-update]: node-updates-kured.md
[use-multiple-node-pools]: use-multiple-node-pools.md
