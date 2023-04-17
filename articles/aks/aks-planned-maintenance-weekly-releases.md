---
title: Use Planned Maintenance for your Azure Kubernetes Service (AKS) cluster weekly releases (preview)
titleSuffix: Azure Kubernetes Service
description: Learn how to use Planned Maintenance in Azure Kubernetes Service (AKS) for cluster weekly releases
ms.topic: article
ms.date: 09/16/2021
ms.author: kaarthis
author: kaarthis

---

# Use Planned Maintenance pre-created configurations to schedule Azure Kubernetes Service (AKS) weekly releases (preview)

Planned Maintenance allows you to schedule weekly maintenance windows that ensure the weekly [releases] are controlled. You can select from the set of pre-created configurations and use the Azure CLI to configure your maintenance windows.

You can also be schedule with more fine-grained control using Planned Maintenance's `default` configuration type. For more information, see [Planned Maintenance to schedule and control upgrades][planned-maintenance].

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Limitations

When you use Planned Maintenance, the following restrictions apply:

- AKS reserves the right to break these windows for unplanned/reactive maintenance operations that are urgent or critical.
- Currently, performing maintenance operations are considered *best-effort only* and are not guaranteed to occur within a specified window.
- Updates cannot be blocked for more than seven days.

## Available pre-created public maintenance configurations for you to pick

There are two general kinds of pre-created public maintenance configurations:

- For Weekday (Monday, Tuesday, Wednesday, Thursday), from 10 pm to 6 am next morning.
- For Weekend (Friday, Saturday, Sunday), from 10 pm to 6 am next morning.

For a list of pre-created public maintenance configurations on the weekday schedule, see below. For weekend schedules, replace `weekday` with `weekend`.

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

Find the public maintenance configuration ID by name:
```azurecli-interactive
az maintenance public-configuration show --resource-name "aks-mrp-cfg-weekday_utc8"
```
This call may prompt you to install the `maintenance` extension. Once done, you can proceed:

The output should look like the below example. Be sure to take note of the `id` field -
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

Next, assign the public maintenance configuration to your AKS cluster using the ID:
```azurecli-interactive
az maintenance assignment create --maintenance-configuration-id "/subscriptions/0159df5c-b605-45a9-9876-36e17d5286e0/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/aks-mrp-cfg-weekday_utc8" --name assignmentName --provider-name "Microsoft.ContainerService" --resource-group myResourceGroup --resource-name myAKSCluster --resource-type "managedClusters"
```
## List all maintenance windows in an existing cluster
```azurecli-interactive
az maintenance assignment list --provider-name "Microsoft.ContainerService" --resource-group myResourceGroup --resource-name myAKSCluster --resource-type "managedClusters"
```

## Delete a public maintenance configuration of an AKS cluster
```azurecli-interactive
az maintenance assignment delete --name assignmentName --provider-name "Microsoft.ContainerService" --resource-group myResourceGroup --resource-name myAKSCluster --resource-type "managedClusters"
```

<!-- LINKS - Internal -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[az-provider-register]: /cli/azure/provider#az_provider_register
[aks-upgrade]: upgrade-cluster.md
[releases]:release-tracker.md
[planned-maintenance]: ./planned-maintenance.md