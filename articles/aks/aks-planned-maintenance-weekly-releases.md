---
title: Use Planned Maintenance for your Azure Kubernetes Service (AKS) cluster weekly releases (preview)
titleSuffix: Azure Kubernetes Service
description: Learn how to use Planned Maintenance in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 09/16/2021
ms.author: kaarthis
author: kaarthis

---

# Use Planned Maintenance to schedule maintenance windows for your Azure Kubernetes Service (AKS) cluster (preview) exclusively for weekly releases

 Planned Maintenance allows you to schedule weekly maintenance windows that will ensure the weekly releases [releases] are controlled within a maintenance window of your choosing. Maintenance Windows are configured using the Azure CLI and basically you get to choose or assign one from a set of pre available configurations.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

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

## Available Pre-created Public Maintenance Configuration for you to pick

There are 2 general kinds of pre-created public maintenance configurations:

For Weekday (Monday, Tuesday, Wednesday, Thursday), from 10 pm to 6 am next morning.
For Weekend (Friday, Saturday, Sunday), from 10 pm to 6 am next morning.
List of pre-created Public Maintenance Configurations, Prod Region, Weekday Schedule (change the 'weekday' in the configuration name to 'weekend' for Weekend Schedule)

Configuration Name	Time Zone
aks-mrp-cfg-weekday_utc12	UTC+12
...	...
aks-mrp-cfg-weekday_utc1	UTC+1
aks-mrp-cfg-weekday_utc	UTC+0
aks-mrp-cfg-weekday_utc-1	UTC-1
...	...
aks-mrp-cfg-weekday_utc-12	UTC-12

## Assign a Public Maintenance Configuration on an AKS Cluster

Find the public maintenance configuration ID by name:
az maintenance public-configuration show --resource-name "aks-mrp-cfg-weekday_utc8"
the call should return
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

The public maintenance configuration ID is what returned in the "id" field:
"id": "/subscriptions/0159df5c-b605-45a9-9876-36e17d5286e0/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/aks-mrp-cfg-weekday_utc8"

Assign the public maintenance configuration ID to an AKS cluster
az maintenance assignment create --maintenance-configuration-id "/subscriptions/0159df5c-b605-45a9-9876-36e17d5286e0/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/aks-mrp-cfg-weekday_utc8" --name assignmentName --provider-name "Microsoft.ContainerService" --resource-group resourceGroupName --resource-name resourceName --resource-type "managedClusters"

## List all maintenance windows in an existing cluster

az maintenance assignment list --provider-name "Microsoft.ContainerService" --resource-group resourceGroupName --resource-name resourceName --resource-type "managedClusters"


## Delete a public maintenance configuration of an AKS cluster

az maintenance assignment delete --name assignmentName --provider-name "Microsoft.ContainerService" --resource-group resourceGroupName --resource-name resourceName --resource-type "managedClusters"


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