---
title: Planned Maintenance for your Kubernetes Cluster
titleSuffix: Azure Kubernetes Service
description: Learn how to use Planned Maintenance in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 03/03/2021
ms.author: qpetraroia
author: qpetraroia

---

# Use planned maintenance to schedule maintenance windows for your AKS cluster (preview)

Planned Maintenance allows you to schedule weekly maintenance windows that minimize workload impact. You can now pick the specific day of the week and the time on which you would like to perform maintenance on your control plane. This can be done by manually typing in the values for the day of the week and the time, or can be done by a JSON file.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Limitations

When using the planned maintenance feature, the following restrictions apply:

- One window per cluster to avoid conflicts.
- AKS reserves the right to break these windows for urgent & critical fixes/patches.
- It is not guaranteed all maintenance operations will occur in this window, best-effort only.
- Azure Maintenance control allows 35 days to complete updates within the defined window, after which point, it is ignored to complete fixes.

#### Install aks-preview CLI extension

You also need the *aks-preview* Azure CLI extension version 0.5.4 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

#### Register the `maintenanceconfiguration` preview feature

To create an AKS cluster that uses planned maintenance, you must enable the `maintenanceconfiguration` feature flag on your subscription.

Register the `maintenanceconfiguration` feature flag using the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "maintenanceconfiguration"
```

 You can check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/maintenanceconfiguration')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Use planned maintenance on an AKS Cluster

To use the `az aks plannedmaintenance` command, use it with any of the options below.

- add: Add a maintenance configuration in managed Kubernetes cluster.
- delete: Delete a maintenance configuration in managed Kubernetes cluster.
- list: List maintenance configurations in managed Kubernetes cluster.
- show: Show the details of a maintenance configuration in managed Kubernetes cluster.
- update: Update a maintenance configuration of a managed Kubernetes cluster.

### Allow maintenance on every Monday at 1:00am to 2:00am

> [!NOTE]
> Planned Maintenance uses the Coordinated Universal Time (UTC). Please take this into consideration when setting up your maintenance configuration window.

```azurecli-interactive
az aks maintenanceconfiguration add -g MyResourceGroup --cluster-name myAKSCluster --name default --weekday Monday  --start-hour 1
```

You will then see the output of your command
```
{- Finished ..
  "id": "/subscriptions/9982170d-2bff-4ce6-a7d8-67d2aec3d900/resourcegroups/MyResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/maintenanceConfigurations/default",
  "name": "default",
  "notAllowedTime": null,
  "resourceGroup": "MyResourceGroup",
  "systemData": null,
  "timeInWeek": [
    {
      "day": "Monday",
      "hourSlots": [
        1
      ]
    }
  ],
  "type": null
}
```

### Allow maintenance on every Monday (without a specific time selected)

```azurecli-interactive
az aks maintenanceconfiguration add -g MyResourceGroup --cluster-name myAKSCluster --name default --weekday Monday
```

### Add a maintenance configuration with maintenance configuration json file

```azurecli-interactive
az aks maintenanceconfiguration add -g MyResourceGroup --cluster-name myAKSCluster --name default --config-file ./test.json
```
The json file below states that maintenance will happen on every Tuesday at 1:00am - 3:00am and every Wednesday at 1:00am - 2:00am. The exception is from "2021-05-26T03:00:00Z" to "2021-05-30T12:00:00Z". The maintenance isn't allowed even if it's in the weekly schedule.

```json
  {
        "timeInWeek": [
          {
            "day": "Tuesday",
            "hour_slots": [
              1,
              2
            ]
          },
          {
            "day": "Wednesday",
            "hour_slots": [
              1,
              6
            ]
          }
        ],
        "notAllowedTime": [
          {
            "start": "2021-05-26T03:00:00Z",
            "end": "2021-05-30T12:00:00Z"
          }
        ]
}
```

### Update an existing maintenance configuration window

To update an existing maintenance configuration, you can use the `update` command.

```azurecli-interactive
az aks maintenanceconfiguration update -g MyResourceGroup --cluster-name myAKSCluster --name default --weekday Monday  --start-hour 1
```

### List all maintenance configuration windows in an existing cluster

To see all current maintenance configuration windows in your AKS Cluster, use the `list` command.

```azurecli-interactive
az aks maintenanceconfiguration list -g MyResourceGroup --cluster-name myAKSCluster
```

In the output below, you can see that there are two maintenance windows configured for myAKSCluster.

```
[
  {
    "id": "/subscriptions/9982170d-2bff-4ce6-a7d8-67d2aec3d900/resourcegroups/MyResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/maintenanceConfigurations/default",
    "name": "default",
    "notAllowedTime": null,
    "resourceGroup": "MyResourceGroup",
    "systemData": null,
    "timeInWeek": [
      {
        "day": "Monday",
        "hourSlots": [
          1
        ]
      }
    ],
    "type": null
  },
  {
    "id": "/subscriptions/9982170d-2bff-4ce6-a7d8-67d2aec3d900/resourcegroups/MyResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/maintenanceConfigurations/testConfiguration",
    "name": "testConfiguration",
    "notAllowedTime": null,
    "resourceGroup": "MyResourceGroup",
    "systemData": null,
    "timeInWeek": [
      {
        "day": "Friday",
        "hourSlots": [
          4
        ]
      }
    ],
    "type": null
  }
]
```

### Show a certain maintenance configuration window in an existing AKS Cluster

To see a certain maintenance configuration window in your AKS Cluster, use the `show` command.

```azurecli-interactive
az aks maintenanceconfiguration show -g MyResourceGroup --cluster-name myAKSCluster --name default
```

```
{
  "id": "/subscriptions/9982170d-2bff-4ce6-a7d8-67d2aec3d900/resourcegroups/MyResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/maintenanceConfigurations/default",
  "name": "default",
  "notAllowedTime": null,
  "resourceGroup": "MyResourceGroup",
  "systemData": null,
  "timeInWeek": [
    {
      "day": "Monday",
      "hourSlots": [
        1
      ]
    }
  ],
  "type": null
}
```

### Delete a certain maintenance configuration window in an existing AKS Cluster

To delete a certain maintenance configuration window in your AKS Cluster, use the `delete` command.

```azurecli-interactive
az aks maintenanceconfiguration delete -g MyResourceGroup --cluster-name myAKSCluster --name default
```

## Next steps

- Read more about upgrading an AKS Cluster[here](upgrade-cluster.md).


<!-- LINKS - Internal -->
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-aks-install-cli]: /cli/azure/aks?view=azure-cli-latest#az-aks-install-cli&preserve-view=true
[az-provider-register]: /cli/azure/provider?view=azure-cli-latest#az-provider-register
