---
title: Use Planned Maintenance to schedule and control upgrades for your Azure Kubernetes Service (AKS) cluster 

titleSuffix: Azure Kubernetes Service
description: Learn how to use Planned Maintenance to schedule and control cluster and node image upgrades in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 01/17/2023
ms.author: nickoman
author: nickomang
---

# Use Planned Maintenance to schedule and control upgrades for your Azure Kubernetes Service (AKS) cluster 

Your AKS cluster has regular maintenance performed on it automatically. There are two types of regular maintenance - AKS initiated and those that you initiate. Planned Maintenance feature allows you to run both types of maintenance in a cadence of your choice thereby minimizing any workload impact. 

AKS intiated maintenance refers to the AKS releases. These releases are weekly rounds of fixes and feature and component updates that affect your clusters. The type of maintenance that you initiate regularly are [cluster auto-upgrades][aks-upgrade] and [Node OS automatic security updates][node-image-auto-upgrade].

There are currently three available configuration types: `default`, `aksManagedAutoUpgradeSchedule`, `aksManagedNodeOSUpgradeSchedule`:

- `default` corresponds to a basic configuration that is used to control AKS releases, these releases can take up to two weeks to roll out to all regions from the initial time of shipping due to Azure Safe Deployment Practices (SDP). Choose `default` to schedule these updates in such a way that it's least disruptive for you. You can monitor the status of an ongoing AKS release by region from the [weekly releases tracker][release-tracker].  

- `aksManagedAutoUpgradeSchedule` controls when cluster upgrades scheduled by your designated auto-upgrade channel are performed. More finely controlled cadence and recurrence settings are possible than in a `default` configuration. For more information on cluster auto-upgrade, see [Automatically upgrade an Azure Kubernetes Service (AKS) cluster][aks-upgrade].

- `aksManagedNodeOSUpgradeSchedule` controls when the node operating system security patching scheduled by your node OS auto-upgrade channel are performed. More finely controlled cadence and recurrence settings are possible than in a `default configuration. For more information on node OS auto-upgrade channel, see [Automatically patch and update AKS cluster node images][node-image-auto-upgrade]

We recommend using `aksManagedAutoUpgradeSchedule` for all cluster upgrade scenarios and `aksManagedNodeOSUpgradeSchedule` for all node OS security patching scenarios, while `default` is meant exclusively for the AKS weekly releases. You can port `default` configurations to the `aksManagedAutoUpgradeSchedule` or `aksManagedNodeOSUpgradeSchedule` configurations via the `az aks maintenanceconfiguration update` command.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

Be sure to upgrade Azure CLI to the latest version using [`az upgrade`](/cli/azure/update-azure-cli#manual-update).

## Creating a maintenance window

To create a maintenance window, you can use the `az aks maintenanceconfiguration add` command using the  `--name` value `default`, `aksManagedAutoUpgradeSchedule`, or `aksManagedNodeOSUpgradeSchedule`. The name value should reflect the desired configuration type. Using any other name causes your maintenance window not to run.

> [!NOTE]
> When using auto-upgrade, to ensure proper functionality, use a maintenance window with a duration of four hours or more.

Planned Maintenance windows are specified in Coordinated Universal Time (UTC).

A `default` maintenance window has the following properties:

|Name|Description|Default value|
|--|--|--|
|`timeInWeek`|In a `default` configuration, this property contains the `day` and `hourSlots` values defining a maintenance window|N/A|
|`timeInWeek.day`|The day of the week to perform maintenance in a `default` configuration|N/A|
|`timeInWeek.hourSlots`|A list of hour-long time slots to perform maintenance on a given day in a `default` configuration|N/A|
|`notAllowedTime`|Specifies a range of dates that maintenance can't run, determined by `start` and `end` child properties. Only applicable when creating the maintenance window using a config file|N/A|

An `aksManagedAutoUpgradeSchedule` or `aksManagedNodeOSUpgradeSchedule` maintenance window has the following properties:

|Name|Description|Default value|
|--|--|--|
|`utcOffset`|Used to determine the timezone for cluster maintenance|`+00:00`|
|`startDate`|The date on which the maintenance window begins to take effect|The current date at creation time|
|`startTime`|The time for maintenance to begin, based on the timezone determined by `utcOffset`|N/A|
|`schedule`|Used to determine frequency. Three types are available: `Weekly`, `AbsoluteMonthly`, and `RelativeMonthly`|N/A|
|`intervalDays`|The interval in days for maintenance runs. Only applicable to `aksManagedNodeOSUpgradeSchedule`|N/A|
|`intervalWeeks`|The interval in weeks for maintenance runs|N/A|
|`intervalMonths`|The interval in months for maintenance runs|N/A|
|`dayOfWeek`|The specified day of the week for maintenance to begin|N/A|
|`durationHours`|The duration of the window for maintenance to run|N/A|
|`notAllowedDates`|Specifies a range of dates that maintenance cannot run, determined by `start` and `end` child properties. Only applicable when creating the maintenance window using a config file|N/A|

### Understanding schedule types

There are currently four available schedule types: `Daily`, `Weekly`, `AbsoluteMonthly`, and `RelativeMonthly`. These schedule types are only applicable to `aksManagedClusterAutoUpgradeSchedule` and `aksManagedNodeOSUpgradeSchedule` configurations. `Daily` schedules are only applicable to `aksManagedNodeOSUpgradeSchedule` types.

> [!NOTE]
> All of the fields shown for each respective schedule type are required.

#### Daily schedule

> [!NOTE]
> Daily schedules are only applicable to `aksManagedNodeOSUpgradeSchedule` configuration types.

A `Daily` schedule may look like *"every three days"*:

```json
"schedule": {
    "daily": {
        "intervalDays": 3
    }
}
```

#### Weekly schedule

A `Weekly` schedule may look like *"every two weeks on Friday"*:

```json
"schedule": {
    "weekly": {
        "intervalWeeks": 2,
        "dayOfWeek": "Friday"
    }
}
```

#### AbsoluteMonthly schedule

An `AbsoluteMonthly` schedule may look like *"every three months, on the first day of the month"*:

```json
"schedule": {
    "absoluteMonthly": {
        "intervalMonths": 3,
        "dayOfMonth": 1
    }
}
```

#### RelativeMonthly schedule

A `RelativeMonthly` schedule may look like *"every two months, on the last Monday"*:

```json
"schedule": {
    "relativeMonthly": {
        "intervalMonths": 2,
        "dayOfWeek": "Monday",
        "weekIndex": "Last"
    }
}
```

Valid values for `weekIndex` are `First`, `Second`, `Third`, `Fourth`, and `Last`.

### Things to note

When you use Planned Maintenance, the following restrictions apply:

-  AKS reserves the right to break these windows for unplanned, reactive maintenance operations that are urgent or critical. These maintenance operations may even run during the `notAllowedTime` or `notAllowedDates` periods defined in your configuration.
- Performing maintenance operations are considered *best-effort only* and aren't guaranteed to occur within a specified window.

## Add a maintenance window configuration with Azure CLI

The following example shows a command to add a new `default` configuration that schedules maintenance to run from 1:00am to 2:00am every Monday:

```azurecli-interactive
az aks maintenanceconfiguration add -g myResourceGroup --cluster-name myAKSCluster --name default --weekday Monday --start-hour 1
```

> [!NOTE]
> When using a `default` configuration type, to allow maintenance anytime during a day omit the `--start-time` parameter.

The following example shows a command to add a new `aksManagedAutoUpgradeSchedule` configuration that schedules maintenance to run every third Friday between 12:00 AM and 8:00 AM in the `UTC+5:30` timezone:

```azurecli-interactive
az aks maintenanceconfiguration add -g myResourceGroup --cluster-name myAKSCluster -n aksManagedAutoUpgradeSchedule --schedule-type Weekly --day-of-week Friday --interval-weeks 3 --duration 8 --utc-offset +05:30 --start-time 00:00
```

## Add a maintenance window configuration with a JSON file

You can also use a JSON file create a maintenance configuration instead of using parameters. This method has the added benefit of allowing maintenance to be prevented during a range of dates, specified by `notAllowedTimes` for `default` configurations and `notAllowedDates` for `aksManagedAutoUpgradeSchedule` configurations.

Create a `default.json` file with the following contents:

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

The above JSON file specifies maintenance windows every Tuesday at 1:00am - 3:00am and every Wednesday at 1:00am - 2:00am and at 6:00am - 7:00am in the `UTC` timezone. There's also an exception from *2021-05-26T03:00:00Z* to *2021-05-30T12:00:00Z* where maintenance isn't allowed even if it overlaps with a maintenance window.

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

The above JSON file specifies maintenance windows every three months on the first of the month between 9:00 AM - 1:00 PM in the `UTC-08` timezone. There's also an exception from *2023-12-23* to *2024-01-05* where maintenance isn't allowed even if it overlaps with a maintenance window.

The following command adds the maintenance windows from `default.json` and `autoUpgradeWindow.json`:

```azurecli-interactive
az aks maintenanceconfiguration add -g myResourceGroup --cluster-name myAKSCluster --name default --config-file ./test.json

az aks maintenanceconfiguration add -g myResourceGroup --cluster-name myAKSCluster --name aksManagedAutoUpgradeSchedule --config-file ./autoUpgradeWindow.json
```

## Update an existing maintenance window

To update an existing maintenance configuration, use the `az aks maintenanceconfiguration update` command.

```azurecli-interactive
az aks maintenanceconfiguration update -g myResourceGroup --cluster-name myAKSCluster --name default --weekday Monday  --start-hour 2
```

## List all maintenance windows in an existing cluster

To see all current maintenance configuration windows in your AKS cluster, use the `az aks maintenanceconfiguration list` command.

```azurecli-interactive
az aks maintenanceconfiguration list -g myResourceGroup --cluster-name myAKSCluster
```

## Show a specific maintenance configuration window in an AKS cluster

To see a specific maintenance configuration window in your AKS Cluster, use the `az aks maintenanceconfiguration show` command.

```azurecli-interactive
az aks maintenanceconfiguration show -g myResourceGroup --cluster-name myAKSCluster --name aksManagedAutoUpgradeSchedule
```

The following example output shows the maintenance window for *aksManagedAutoUpgradeSchedule*:

```json
{
  "id": "/subscriptions/<subscription>/resourceGroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/maintenanceConfigurations/aksManagedAutoUpgradeSchedule",
  "maintenanceWindow": {
    "durationHours": 4,
    "notAllowedDates": [
      {
        "end": "2024-01-05",
        "start": "2023-12-23"
      }
    ],
    "schedule": {
      "absoluteMonthly": {
        "dayOfMonth": 1,
        "intervalMonths": 3
      },
      "daily": null,
      "relativeMonthly": null,
      "weekly": null
    },
    "startDate": "2023-01-20",
    "startTime": "09:00",
    "utcOffset": "-08:00"
  },
  "name": "aksManagedAutoUpgradeSchedule",
  "notAllowedTime": null,
  "resourceGroup": "myResourceGroup",
  "systemData": null,
  "timeInWeek": null,
  "type": null
}
```

## Delete a certain maintenance configuration window in an existing AKS Cluster

To delete a certain maintenance configuration window in your AKS Cluster, use the `az aks maintenanceconfiguration delete` command.

```azurecli-interactive
az aks maintenanceconfiguration delete -g myResourceGroup --cluster-name myAKSCluster --name autoUpgradeSchedule
```
## Frequently Asked Questions

* How can I check the existing maintenance configurations in my cluster?

  Use the `az aks maintenanceconfiguration show` command.
  
* Can reactive, unplanned maintenance happen during the `notAllowedTime` or `notAllowedDates` periods too?

  Yes, AKS reserves the right to break these windows for unplanned, reactive maintenance operations that are urgent or critical.

* How can you tell if a maintenance event occurred?

  For releases, check your cluster's region and look up release information in [weekly releases][release-tracker] and validate if it matches your maintenance schedule or not. To view the status of your auto upgrades, look up [activity logs][monitor-aks] on your cluster. You may also look up specific upgrade related events as mentioned in [Upgrade an AKS cluster][aks-upgrade]. AKS also emits upgrade related Event Grid events. To learn more, see [AKS as an Event Grid source][aks-eventgrid].

* Can you use more than one maintenance configuration at the same time?
   
  Yes, you can run all three configurations i.e `default`, `aksManagedAutoUpgradeSchedule`, `aksManagedNodeOSUpgradeSchedule`simultaneously.  In case the windows overlap AKS decides the running order. 

* I configured a maintenance window, but upgrade didn't happen - why?

  AKS auto-upgrade needs a certain amount of time to take the maintenance window into consideration. We recommend at least 24 hours between the creation/update of the maintenance configuration, and when it's scheduled to start.

* AKS auto-upgrade didn't upgrade all my agent pools - or one of the pools was upgraded outside of the maintenance window?

  If an agent pool fails to upgrade (eg. because of Pod Disruption Budgets preventing it to upgrade) or is in a Failed state, then it might be upgraded later outside of the maintenance window. This scenario is called "catch-up upgrade" and avoids letting Agent pools with a different version than the AKS control plane.

*  Are there any best practices for the maintenance configurations?
   
  We recommend setting the [Node OS security updates][node-image-auto-upgrade] schedule to a weekly cadence if you're using `NodeImage` channel since a new node image gets shipped every week and daily if you opt in for `SecurityPatch` channel to receive daily security updates. Set the [auto-upgrade][auto-upgrade] schedule to a monthly cadence to stay on top of the kubernetes N-2 [support policy][aks-support-policy]. 

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
[release-tracker]: release-tracker.md
[auto-upgrade]: auto-upgrade-cluster.md
[node-image-auto-upgrade]: auto-upgrade-node-image.md
[pm-weekly]: ./aks-planned-maintenance-weekly-releases.md
[monitor-aks]: monitor-aks-reference.md
[aks-eventgrid]:quickstart-event-grid.md
[aks-support-policy]:support-policies.md
