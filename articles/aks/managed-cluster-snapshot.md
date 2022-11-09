---
title: Use cluster snapshots to save and apply Azure Kubernetes Service (AKS) cluster configuration (preview)
description: Learn how to use cluster snapshots to save and apply Azure Kubernetes Service (AKS) cluster configuration
author: nickomang
ms.author: nickoman
ms.service: container-service
ms.topic: how-to
ms.date: 10/03/2022
ms.custom: template-how-to
---

# Use cluster snapshots to save and apply Azure Kubernetes Service cluster configuration (preview)

Cluster snapshots allow you to save configuration from an Azure Kubernetes Service (AKS) cluster, which can then be used to easily apply the configuration to other clusters. Currently, we snapshot the following properties: 
- `ManagedClusterSKU`
- `EnableRbac`
- `KubernetesVersion`
- `LoadBalancerSKU`
- `NetworkMode`
- `NetworkPolicy`
- `NetworkPlugin`

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisite

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- The latest version of the [Azure CLI](/cli/azure/install-azure-cli) installed.
- Your cluster must be running successfully.
- Your cluster must have been created with the `AddonManagerV2Preview` and `CSIControllersV2Preview` custom header feature values:
    ```azurecli
    az aks create -g $RESOURCE_GROUP -n $CLUSTER_NAME --aks-custom-headers AKSHTTPCustomFeatures=AddonManagerV2Preview,AKSHTTPCustomFeatures=CSIControllersV2Preview
    ```

### Install the `aks-preview` Azure CLI extension

Install the latest version of the `aks-preview` Azure CLI extension using the following command:

```azurecli
az extension add --upgrade --name aks-preview
```

### Register the `ManagedClusterSnapshotPreview` feature flag

To use the KEDA, you must enable the `ManagedClusterSnapshotPreview` feature flag on your subscription. 

```azurecli
az feature register --name ManagedClusterSnapshotPreview --namespace Microsoft.ContainerService
```

You can check on the registration status by using the `az feature list` command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/ManagedClusterSnapshotPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the `az provider register` command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Take a snapshot of your cluster

To begin, get the `id` of the cluster you want to take a snapshot of using `az aks show`:

```azurecli-interactive
az aks show -g $RESOURCE_GROUP -n $CLUSTER_NAME
```

Using the `id` you just obtained, create a snapshot using `az aks snapshot create`:

```azurecli-interactive
az aks snapshot create -g $RESOURCE_GROUp -n snapshot1 --cluster-id $CLUSTER_ID
```

Your output will look similar to the following example:

```json
{
  "creationData": {
    "sourceResourceId": $CLUSTER_ID
  },
  "id": "/subscriptions/$SUBSCRIPTION/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerService/managedclustersnapshots/snapshot1",
  "location": "eastus2",
  "managedClusterPropertiesReadOnly": {
    "enableRbac": true,
    "kubernetesVersion": "1.22.6",
    "networkProfile": {
      "loadBalancerSku": "Standard",
      "networkMode": null,
      "networkPlugin": "kubenet",
      "networkPolicy": null
    },
    "sku": {
      "name": "Basic",
      "tier": "Paid"
    }
  },
  "name": "snapshot1",
  "resourceGroup": $RESOURCE_GROUP,
  "snapshotType": "ManagedCluster",
  "systemData": {
    "createdAt": "2022-04-21T00:47:49.041399+00:00",
    "createdBy": "user@contoso.com",
    "createdByType": "User",
    "lastModifiedAt": "2022-04-21T00:47:49.041399+00:00",
    "lastModifiedBy": "user@contoso.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "Microsoft.ContainerService/ManagedClusterSnapshots"
}
```

## View a snapshot

To list all available snapshots, use the `az aks snapshot list` command:

```azurecli-interactive
az aks snapshot list -g $RESOURCE_GROUP
```

To view details for an individual snapshot, reference it by name in the `az aks snapshot show command`. For example, to view the snapshot `snapshot1` created in the steps above:

```azurecli-interactive
az aks snapshot show -g $RESOURCE_GROUp -n snapshot1 -o table
```

Your output will look similar to the following example:

```bash
Name       Location    ResourceGroup    Sku    EnableRbac    KubernetesVersion    NetworkPlugin    LoadBalancerSku
---------  ----------  ---------------  -----  ------------  -------------------  ---------------  -----------------
snapshot1  eastus2     qizhe-rg         Paid   True          1.22.6               kubenet          Standard
```

## Delete a snapshot

Removing a snapshot can be done by referencing the snapshot's name in the `az aks snapshot delete` command. For example, to delete the snapshot `snapshot1` created in the above steps:

```azurecli-interactive
az aks snapshot delete -g $RESOURCE_GROUP -n snapshot1
```

## Create a cluster from a snapshot

New AKS clusters can be created based on the configuration captured in a snapshot. To do so, first obtain the `id` of the desired snapshot. Next, use `az aks create`, using the snapshot's `id` with the `--cluster-snapshot-id` flag. Be sure to include the `addonManagerV2` and `CSIControllersV2Preview` feature flag custom header values. For example:

```azurecli-interactive
az aks create -g $RESOURCE_GROUP -n aks-from-snapshot --cluster-snapshot-id "/subscriptions/$SUBSCRIPTION/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerService/managedclustersnapshots/snapshot1" --aks-custom-headers AKSHTTPCustomFeatures=AddonManagerV2Preview,AKSHTTPCustomFeatures=CSIControllersV2Preview
```

> [!NOTE]
> The cluster can be created with other allowed parameters that are not captured in the snapshot, such as `vm-sku-size` or `--node-count`. However, no configuration arguments for parameters that are part of the snapshot should be included. If the values passed in these arguments differs from the snapshot's values, cluster creation will fail.

## Update or upgrade a cluster using a snapshot

Clusters can also be updated and upgraded while using a snapshot by using the snapshot's `id` with the `--cluster-snapshot-id` flag:


```azurecli-interactive
az aks update -g $RESOURCE_GROUP -n aks-from-snapshot --cluster-snapshot-id "/subscriptions/$SUBSCRIPTION/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerService/managedclustersnapshots/snapshot1" --aks-custom-headers AKSHTTPCustomFeatures=AddonManagerV2Preview,AKSHTTPCustomFeatures=CSIControllersV2Preview
```


```azurecli-interactive
az aks upgrade -g $RESOURCE_GROUP -n aks-from-snapshot --cluster-snapshot-id "/subscriptions/$SUBSCRIPTION/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerService/managedclustersnapshots/snapshot1" --aks-custom-headers AKSHTTPCustomFeatures=AddonManagerV2Preview,AKSHTTPCustomFeatures=CSIControllersV2Preview
```

## Next steps
- Learn [how to use node pool snapshots](./node-pool-snapshot.md)
