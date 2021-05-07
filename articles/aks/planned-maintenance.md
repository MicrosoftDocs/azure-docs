---
title: Use Planned Maintenance for your Azure Kubernetes Service (AKS) cluster (preview)
titleSuffix: Azure Kubernetes Service
description: Learn how to use Planned Maintenance in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 03/03/2021
ms.author: qpetraroia
author: qpetraroia

---

# Use Planned Maintenance to schedule maintenance windows for your Azure Kubernetes Service (AKS) cluster (preview)

Your AKS cluster has regular maintenance performed on it automatically. By default, this work can happen at any time. Planned Maintenance allows you to schedule weekly maintenance windows that will update your control plane as well as your kube-system Pods on a VMSS instance and minimize workload impact. Once scheduled, all your maintenance will occur during the window you selected. You can schedule one or more weekly windows on your cluster by specifying a day or time range on a specific day. Maintenance Windows are configured using the Azure CLI.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Limitations

When using Planned Maintenance, the following restrictions apply:

- AKS reserves the right to break these windows for unplanned/reactive maintenance operations that are urgent or critical.
- Currently, performing maintenance operations are considered *best-effort only* and are not guaranteed to occur within a specified window.
- Updates cannot be blocked for more than seven days.

### Install aks-preview CLI extension

You also need the *aks-preview* Azure CLI extension version 0.5.4 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

## Allow maintenance on every Monday at 1:00am to 2:00am

To add a maintenance window, you can use the `az aks maintenanceconfiguration add` command.

> [!IMPORTANT]
> Planned Maintenance windows are specified in Coordinated Universal Time (UTC).

```azurecli-interactive
az aks maintenanceconfiguration add -g MyResourceGroup --cluster-name myAKSCluster --name default --weekday Monday  --start-hour 1
```

The following example output shows the maintenance window from 1:00am to 2:00am every Monday.

```json
{- Finished ..
  "id": "/subscriptions/<subscriptionID>/resourcegroups/MyResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/maintenanceConfigurations/default",
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

To allow maintenance any time during a day, omit the *start-hour* parameter. For example, the following command sets the maintenance window for the full day every Monday:

```azurecli-interactive
az aks maintenanceconfiguration add -g MyResourceGroup --cluster-name myAKSCluster --name default --weekday Monday
```

## Add a maintenance configuration with a JSON file

You can also use a JSON file create a maintenance window instead of using parameters. Create a `test.json` file with the following contents:

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

The above JSON file specifies maintenance windows every Tuesday at 1:00am - 3:00am and every Wednesday at 1:00am - 2:00am and at 6:00am - 7:00am. There is also an exception from *2021-05-26T03:00:00Z* to *2021-05-30T12:00:00Z* where maintenance isn't allowed even if it overlaps with a maintenance window. The following command adds the maintenance windows from `test.json`.

```azurecli-interactive
az aks maintenanceconfiguration add -g MyResourceGroup --cluster-name myAKSCluster --name default --config-file ./test.json
```

## Update an existing maintenance window

To update an existing maintenance configuration, use the `az aks maintenanceconfiguration update` command.

```azurecli-interactive
az aks maintenanceconfiguration update -g MyResourceGroup --cluster-name myAKSCluster --name default --weekday Monday  --start-hour 1
```

## List all maintenance windows in an existing cluster

To see all current maintenance configuration windows in your AKS Cluster, use the `az aks maintenanceconfiguration list` command.

```azurecli-interactive
az aks maintenanceconfiguration list -g MyResourceGroup --cluster-name myAKSCluster
```

In the output below, you can see that there are two maintenance windows configured for myAKSCluster. One window is on Mondays at 1:00am and another window is on Friday at 4:00am.

```json
[
  {
    "id": "/subscriptions/<subscriptionID>/resourcegroups/MyResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/maintenanceConfigurations/default",
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
    "id": "/subscriptions/<subscriptionID>/resourcegroups/MyResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/maintenanceConfigurations/testConfiguration",
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

## Show a specific maintenance configuration window in an AKS cluster

To see a specific maintenance configuration window in your AKS Cluster, use the `az aks maintenanceconfiguration show` command.

```azurecli-interactive
az aks maintenanceconfiguration show -g MyResourceGroup --cluster-name myAKSCluster --name default
```

The following example output shows the maintenance window for *default*:

```json
{
  "id": "/subscriptions/<subscriptionID>/resourcegroups/MyResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/maintenanceConfigurations/default",
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

## Delete a certain maintenance configuration window in an existing AKS Cluster

To delete a certain maintenance configuration window in your AKS Cluster, use the `az aks maintenanceconfiguration delete` command.

```azurecli-interactive
az aks maintenanceconfiguration delete -g MyResourceGroup --cluster-name myAKSCluster --name default
```

## Next steps

- To get started with upgrading your AKS cluster, see [Upgrade an AKS cluster][aks-upgrade]


<!-- LINKS - Internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[az-provider-register]: /cli/azure/provider#az_provider_register
[aks-upgrade]: upgrade-cluster.md
