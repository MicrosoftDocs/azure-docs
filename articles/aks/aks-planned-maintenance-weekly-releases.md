---
title: Use Planned Maintenance for your Azure Kubernetes Service (AKS) cluster weekly releases (preview)
titleSuffix: Azure Kubernetes Service
description: Learn how to use Planned Maintenance in Azure Kubernetes Service (AKS) for cluster weekly releases.
ms.topic: article
ms.date: 06/27/2023
ms.author: kaarthis
author: kaarthis
---

# Use Planned Maintenance pre-created configurations to schedule Azure Kubernetes Service (AKS) weekly releases (preview)

Planned Maintenance allows you to schedule weekly maintenance windows that ensure the weekly [releases] are controlled. You can select from the set of pre-created configurations and use the Azure CLI to configure your maintenance windows.

You can also be schedule with more fine-grained control using Planned Maintenance's `default` configuration type. For more information, see [Planned Maintenance to schedule and control upgrades][planned-maintenance].

## Before you begin

This article assumes you have an existing AKS cluster. If you need an AKS cluster, you can create one using [Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or [Azure portal][aks-quickstart-portal].

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Limitations

When you use Planned Maintenance, the following restrictions apply:

- AKS reserves the right to break these windows for unplanned/reactive maintenance operations that are urgent or critical.
- Currently, performing maintenance operations are considered *best-effort only* and aren't guaranteed to occur within a specified window.
- Updates can't be blocked for more than seven days.

## Available pre-created public maintenance configurations

There are two general kinds of pre-created public maintenance configurations:

- **For weekdays**: (Monday, Tuesday, Wednesday, Thursday), from 10 pm to 6 am the next morning.
- **For weekends**: (Friday, Saturday, Sunday), from 10 pm to 6 am the next morning.

The following pre-created public maintenance configurations are available on the weekday and weekend schedules. For weekend schedules, replace `weekday` with `weekend`.

|Configuration name| Time zone|
|--|--|
|aks-mrp-cfg-weekday_utc12|UTC+12|
|...|...|
|aks-mrp-cfg-weekday_utc1|UTC+1|
|aks-mrp-cfg-weekday_utc|UTC+0|
|aks-mrp-cfg-weekday_utc-1|UTC-1|
|...|...|
|aks-mrp-cfg-weekday_utc-12|UTC-12|

## Assign a public maintenance configuration to an AKS Cluster

1. Find the public maintenance configuration ID using the [`az maintenance public-configuration show`][az-maintenance-public-configuration-show] command.

    ```azurecli-interactive
    az maintenance public-configuration show --resource-name "aks-mrp-cfg-weekday_utc8"
    ```

    > [!NOTE]
    > You may be prompted to install the `maintenance` extension.

    Your output should look like the following example output. Make sure you take note of the `id` field.

    ```json
    {
    "duration": "08:00",
    "expirationDateTime": null,
    "extensionProperties": {
    "maintenanceSubScope": "AKS"
    },
    "id": "/subscriptions/0159df5c-b605-45a9-9876-36e17d5286e0/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/aks-mrp-cfg-weekday_utc8",
    "installPatches": null,
    "location": "westus2",
    "maintenanceScope": "Resource",
    "name": "aks-mrp-cfg-weekday_utc8",
    "namespace": "Microsoft.Maintenance",
    "recurEvery": "Week Monday,Tuesday,Wednesday,Thursday",
    "startDateTime": "2022-08-01 22:00",
    "systemData": null,
    "tags": {},
    "timeZone": "China Standard Time",
    "type": "Microsoft.Maintenance/publicMaintenanceConfigurations",
    "visibility": "Public"
    }
    ```

2. Assign the public maintenance configuration to your AKS cluster using the [`az maintenance assignment create`][az-maintenance-assignment-create] command and specify the ID from the previous step for the `--maintenance-configuration-id` parameter.

    ```azurecli-interactive
    az maintenance assignment create --maintenance-configuration-id "/subscriptions/0159df5c-b605-45a9-9876-36e17d5286e0/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/aks-mrp-cfg-weekday_utc8" --name assignmentName --provider-name "Microsoft.ContainerService" --resource-group myResourceGroup --resource-name myAKSCluster --resource-type "managedClusters"
    ```

## List all maintenance windows in an existing cluster

- List all maintenance windows in an existing cluster using the [`az maintenance assignment list`][az-maintenance-assignment-list] command.

    ```azurecli-interactive
    az maintenance assignment list --provider-name "Microsoft.ContainerService" --resource-group myResourceGroup --resource-name myAKSCluster --resource-type "managedClusters"
    ```

## Remove a public maintenance configuration from an AKS cluster

- Remove a public maintenance configuration from a cluster using the [`az maintenance assignment delete`][az-maintenance-assignment-delete] command.

    ```azurecli-interactive
    az maintenance assignment delete --name assignmentName --provider-name "Microsoft.ContainerService" --resource-group myResourceGroup --resource-name myAKSCluster --resource-type "managedClusters"
    ```

<!-- LINKS - Internal -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[releases]:release-tracker.md
[planned-maintenance]: ./planned-maintenance.md
[az-maintenance-public-configuration-show]: /cli/azure/maintenance/public-configuration#az-maintenance-public-configuration-show
[az-maintenance-assignment-create]: /cli/azure/maintenance/assignment#az-maintenance-assignment-create
[az-maintenance-assignment-list]: /cli/azure/maintenance/assignment#az-maintenance-assignment-list
[az-maintenance-assignment-delete]: /cli/azure/maintenance/assignment#az-maintenance-assignment-delete
