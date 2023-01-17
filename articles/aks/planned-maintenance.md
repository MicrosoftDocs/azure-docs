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

Your AKS cluster has regular maintenance performed on it automatically. By default, this work can happen at any time. Planned Maintenance allows you to schedule weekly maintenance windows that will update your control plane as well as your kube-system pods on a VMSS instance, and minimize workload impact. Once scheduled, all your maintenance will occur during the window you selected. You can schedule one or more weekly windows on your cluster by specifying a day or time range on a specific day. Maintenance Windows are configured using the Azure CLI.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Limitations

When you use Planned Maintenance, the following restrictions apply:

- AKS reserves the right to break these windows for unplanned/reactive maintenance operations that are urgent or critical.
- Currently, performing maintenance operations are considered *best-effort only* and are not guaranteed to occur within a specified window.
- Updates cannot be blocked for more than seven days.

### Install aks-preview CLI extension

You also need the *aks-preview* Azure CLI extension version 0.5.124 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

## Creating a maintenance window

To create a maintenance window, you can use the `az aks maintenanceconfiguration add` command using the  `--name` value `aksManagedAutoUpgradeSchedule`. Using any other name will cause your maintenance window not to run.

Planned Maintenance windows are specified in Coordinated Universal Time (UTC).

> [!NOTE]
> Previously created maintenance configurations using the `--name` value `default` remain valid and able to be used.

A maintenance window has the following properties:

|Name|Description|Default value|
|--|--|--|
|`utcOffset`|Used to determine the timezone for cluster maintenance|`+00:00`|
|`startDate`|The date on which the maintenance window will begin to take effect|The current date at creation time|
|`startTime`|The time for maintenance to begin, based on the timezone determined by `utcOffset`|N/A|
|`schedule`|Used to determine frequency. Three types are available: `Weekly`, `AbsoluteMonthly`, and `RelativeMonthly`|N/A|
|`intervalWeeks`|The interval in weeks for maintenance runs|N/A|
|`intervalMonths`|The interval in months for maintenance runs|N/A|
|`dayOfWeek`|The specified day of the week for maintenance to begin|N/A|
|`durationHours`|The duration of the window for maintenance to run|N/A|
|`notAllowedDates`|Specifies a range of dates that maintenance cannot run, determined by `start` and `end` subproperties. Only applicable when creating the maintenance window using a config file|N/A|
### Understanding schedule types

There are currently three available schedule types: `Weekly`, `AbsoluteMonthly`, and `RelativeMonthly`:

#### Weekly schedule

A `Weekly` schedule may look like "every two weeks on Friday":

```json
"schedule": {
    "weekly": {
        "intervalWeeks": 2,
        "dayOfWeek": "Friday"
    }
}
```

#### AbsoluteMonthly schedule

An `AbsoluteMonthly` schedule may look like "every 3 months, on the first day of the month":

```json
"schedule": {
    "absoluteMonthly": {
        "intervalMonths": 3,
        "dayOfMonth": 1
    }
}
```

### RelativeMonthly schedule

A `RelativeMonthly` schedule may look like "Every 2 months, on the last Monday"

```json
"schedule": {
    "relativeMonthly": {
        "intervalMonths": 2,
        "dayOfWeek": "Monday",
        "weekIndex": "Last"
    }
}
```

## Add a maintenance window configuration with Azure CLI

The following example shows a command to add a new maintenance configuration that allows maintenance to run every third Friday between 12:00 AM and 8:00 AM in the `UTC+5:30` timezone:

```azurecli-interactive
aks maintenanceconfiguration add -g myResourceGroup --cluster-name myAKSCluster -n aksManagedAutoUpgradeSchedule --schedule-type Weekly --day-of-week Friday --interval-weeks 3 --duration 8 --utc-offset +05:30 --start-time 00:00
```

> [!NOTE]
> To allow maintenance anytime during a day, omit the *start-time* parameter.

## Add a maintenance window configuration with a JSON file

You can also use a JSON file create a maintenance configuration instead of using parameters. This has the added benefit of allowing maintenance to be prevented during a range of dates specified by `notAllowedDates.start` and `notAllowedDates.end`.

Create an `autoUpgradeWindow.json` file with the following contents:

```json
{
  "properties": {
    "maintenanceWindow": {
        "schedule": {
            "absoluteMonthly": {
                "intervalMonths": 3,
                "dayOfMonth": 1
            }
        },
        "durationHours": 4,
        "utcOffset": "-08:00",
        "startTime": "09:00",
        "notAllowedDates": [
            {
                "start": "2023-12-23",
                "end": "2024-01-05"
            }
        ]
    }
  }
}
```

The above JSON file specifies maintenance windows every three months on the first of the month between 9:00 AM - 1:00 PM. There is also an exception from *2023-12-23* to *2024-01-05* where maintenance isn't allowed even if it overlaps with a maintenance window.

The following command adds the maintenance windows from `autoUpgradeWindow.json`:

```azurecli-interactive
az aks maintenanceconfiguration add -g MyResourceGroup --cluster-name myAKSCluster --name default --config-file ./test.json
```

## Update an existing maintenance window

To update an existing maintenance configuration, use the `az aks maintenanceconfiguration update` command.

```azurecli-interactive
az aks maintenanceconfiguration update -g MyResourceGroup --cluster-name myAKSCluster --name default --weekday Monday  --start-hour 1
```

## List all maintenance windows in an existing cluster

To see all current maintenance configuration windows in your AKS cluster, use the `az aks maintenanceconfiguration list` command.

```azurecli-interactive
az aks maintenanceconfiguration list -g MyResourceGroup --cluster-name myAKSCluster
```

In the output below, you can see that there are two maintenance windows configured for myAKSCluster. One window is on Mondays at 1:00am and another window is on Friday at 4:00am.

```json
TODO: GET JSON RESPONSE
```

## Show a specific maintenance configuration window in an AKS cluster

To see a specific maintenance configuration window in your AKS Cluster, use the `az aks maintenanceconfiguration show` command.

```azurecli-interactive
az aks maintenanceconfiguration show -g MyResourceGroup --cluster-name myAKSCluster --name aksManagedAutoUpgradeSchedule
```

The following example output shows the maintenance window for *aksManagedAutoUpgradeSchedule*:

```json
TODO: GET JSON RESPONSE
```

## Delete a certain maintenance configuration window in an existing AKS Cluster

To delete a certain maintenance configuration window in your AKS Cluster, use the `az aks maintenanceconfiguration delete` command.

```azurecli-interactive
az aks maintenanceconfiguration delete -g MyResourceGroup --cluster-name myAKSCluster --name autoUpgradeSchedule
```

## Using Planned Maintenance with Cluster Auto-Upgrade

Planned Maintenance will detect if you are using Cluster Auto-Upgrade and schedule your upgrades during your maintenance window automatically. For more details on about Cluster Auto-Upgrade, see [Upgrade an Azure Kubernetes Service (AKS) cluster][aks-upgrade].

> [!NOTE]
> To ensure proper functionality, use a maintenance window of four hours or more.

## Next steps

- To get started with upgrading your AKS cluster, see [Upgrade an AKS cluster][aks-upgrade]

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
