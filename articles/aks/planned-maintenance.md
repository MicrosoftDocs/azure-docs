---
title: Use Planned Maintenance to schedule and control upgrades for your Azure Kubernetes Service (AKS) cluster 
titleSuffix: Azure Kubernetes Service
description: Learn how to use Planned Maintenance to schedule and control cluster and node image upgrades in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 01/29/2024
ms.author: nickoman
author: nickomang
---

# Use Planned Maintenance to schedule and control upgrades for your Azure Kubernetes Service (AKS) cluster

This article shows you how to use Planned Maintenance to schedule and control cluster and node image upgrades in Azure Kubernetes Service (AKS).

Your AKS cluster has regular maintenance performed on it automatically. There are two types of maintenance operations: AKS-initiated and user-initiated. AKS-initiated maintenance involves the weekly releases that AKS performs to keep your cluster up-to-date with the latest features and fixes. User-initiated maintenance includes [cluster auto-upgrades][aks-upgrade] and [Node OS automatic security updates][node-image-auto-upgrade]. The Planned Maintenance feature allows you to run both types of maintenance in a cadence of your choice, thereby minimizing any workload impact.

## Before you begin

* This article assumes that you have an existing AKS cluster. If you don't have an AKS cluster, see [Create an AKS cluster](./learn/quick-kubernetes-deploy-cli.md).
* If using the Azure CLI, make sure you upgrade to the latest version using the [`az upgrade`](/cli/azure/update-azure-cli#manual-update) command.

## Considerations

When you use Planned Maintenance, the following considerations apply:

* AKS reserves the right to break Planned Maintenance windows for unplanned, reactive maintenance operations that are urgent or critical. These maintenance operations might even run during the `notAllowedTime` or `notAllowedDates` periods defined in your configuration.
* Performing maintenance operations are considered *best-effort only* and aren't guaranteed to occur within a specified window.

## Planned Maintenance schedule configurations

There are three available maintenance schedule configuration types: `default`, `aksManagedAutoUpgradeSchedule`, and `aksManagedNodeOSUpgradeSchedule`.

* `default` is a basic configuration used to control AKS releases. The releases can take up to two weeks to roll out to all regions from the initial time of shipping due to Azure Safe Deployment Practices (SDP). Choose `default` to schedule these updates in a manner that's least disruptive for you. You can monitor the status of an ongoing AKS release by region with the [weekly releases tracker][release-tracker].  
* `aksManagedAutoUpgradeSchedule` controls when to perform cluster upgrades scheduled by your designated auto-upgrade channel. You can configure more finely-controlled cadence and recurrence settings with this configuration compared to the `default` configuration. For more information on cluster auto-upgrade, see [Automatically upgrade an Azure Kubernetes Service (AKS) cluster][aks-upgrade].
* `aksManagedNodeOSUpgradeSchedule` controls when to perform the node operating system (OS) security patching scheduled by your node OS auto-upgrade channel. You can configure more finely-controlled cadence and recurrence settings with this configuration compared to the `default` configuration. For more information on node OS auto-upgrade channel, see [Automatically patch and update AKS cluster node images][node-image-auto-upgrade]

We recommend using `aksManagedAutoUpgradeSchedule` for all cluster upgrade scenarios and `aksManagedNodeOSUpgradeSchedule` for all node OS security patching scenarios. The `default` option is meant exclusively for AKS weekly releases. You can switch the `default` configuration to the `aksManagedAutoUpgradeSchedule` or `aksManagedNodeOSUpgradeSchedule` configurations using the `az aks maintenanceconfiguration update` command.

## Creating a maintenance window

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

There are four available schedule types: `Daily`, `Weekly`, `AbsoluteMonthly`, and `RelativeMonthly`. These schedule types are only applicable to `aksManagedClusterAutoUpgradeSchedule` and `aksManagedNodeOSUpgradeSchedule` configurations. `Daily` schedules are only applicable to `aksManagedNodeOSUpgradeSchedule` types.

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

Valid values for `weekIndex` include `First`, `Second`, `Third`, `Fourth`, and `Last`.

## Add a maintenance window configuration

### [Azure CLI](#tab/azure-cli)

* Add a maintenance window configuration to an AKS cluster using the [`az aks maintenanceconfiguration add`][az-aks-maintenanceconfiguration-add] command.

    The first example adds a new `default` configuration that schedules maintenance to run from 1:00am to 2:00am every Monday. The second example adds a new `aksManagedAutoUpgradeSchedule` configuration that schedules maintenance to run every third Friday between 12:00 AM and 8:00 AM in the `UTC+5:30` timezone.

    ```azurecli-interactive
    # Add a new default configuration
    az aks maintenanceconfiguration add --resource-group myResourceGroup --cluster-name myAKSCluster --name default --weekday Monday --start-hour 1

    # Add a new aksManagedAutoUpgradeSchedule configuration
    az aks maintenanceconfiguration add --resource-group myResourceGroup --cluster-name myAKSCluster --name aksManagedAutoUpgradeSchedule --schedule-type Weekly --day-of-week Friday --interval-weeks 3 --duration 8 --utc-offset +05:30 --start-time 00:00
    ```

    > [!NOTE]
    > When using a `default` configuration type, you can omit the `--start-time` parameter to allow maintenance anytime during a day.

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, navigate to your AKS cluster.
2. In the **Settings** section, select **Cluster configuration**.
3. Under **Upgrade** > **Automatic upgrade scheduler**, select **Add schedule**.

    :::image type="content" source="./media/planned-maintenance/add-schedule-portal.png" alt-text="Screenshot shows the Add schedule option in the Azure portal.":::

4. On the **Add maintenance schedule** page, configure the following maintenance window settings:

    * **Repeats**: Select the desired frequency for the maintenance window. We recommend selecting **Weekly**.
    * **Frequency**: Select the desired day of the week for the maintenance window. We recommend selecting **Sunday**.
    * **Maintenance start date**: Select the desired start date for the maintenance window.
    * **Maintenance start time**: Select the desired start time for the maintenance window.
    * **UTC offset**: Select the desired UTC offset for the maintenance window. If not set, the default is **+00:00**.

    :::image type="content" source="./media/planned-maintenance/add-maintenance-schedule-portal.png" alt-text="Screenshot shows the Add maintenance schedule page in the Azure portal.":::

5. Select **Save** > **Apply**.

### [JSON file](#tab/json-file)

You can also use a JSON file create a maintenance configuration instead of using parameters. This method has the added benefit of allowing maintenance to be prevented during a range of dates, specified by `notAllowedTimes` for `default` configurations and `notAllowedDates` for `aksManagedAutoUpgradeSchedule` configurations.

1. Create a JSON file with the maintenance window settings.

    The following example creates a `default.json` file that schedules maintenance to run from 1:00am to 3:00am every Tuesday and Wednesday in the `UTC` timezone. There's also an exception from `2021-05-26T03:00:00Z` to `2021-05-30T12:00:00Z` where maintenance isn't allowed even if it overlaps with a maintenance window.

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

    The following example creates an `autoUpgradeWindow.json` file that schedules maintenance to run every three months on the first of the month between 9:00 AM and 1:00 PM in the `UTC-08` timezone. There's also an exception from `2023-12-23` to `2024-01-05` where maintenance isn't allowed even if it overlaps with a maintenance window.

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

2. Add the maintenance window configuration using the [`az aks maintenanceconfiguration add`][az-aks-maintenanceconfiguration-add] command with the `--config-file` parameter.

    The first example adds a new `default` configuration using the `default.json` file. The second example adds a new `aksManagedAutoUpgradeSchedule` configuration using the `autoUpgradeWindow.json` file.

    ```azurecli-interactive
    # Add a new default configuration
    az aks maintenanceconfiguration add -g myResourceGroup --cluster-name myAKSCluster --name default --config-file ./default.json

    # Add a new aksManagedAutoUpgradeSchedule configuration
    az aks maintenanceconfiguration add -g myResourceGroup --cluster-name myAKSCluster --name aksManagedAutoUpgradeSchedule --config-file ./autoUpgradeWindow.json
    ```

---

## Update an existing maintenance window

### [Azure CLI](#tab/azure-cli)

* Update an existing maintenance configuration using the [`az aks maintenanceconfiguration update`][az-aks-maintenanceconfiguration-update] command.

    The following example updates the `default` configuration to schedule maintenance to run from 2:00am to 3:00am every Monday.

    ```azurecli-interactive
    az aks maintenanceconfiguration update --resource-group myResourceGroup --cluster-name myAKSCluster --name default --weekday Monday --start-hour 2
    ```

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, navigate to your AKS cluster.
2. In the **Settings** section, select **Cluster configuration**.
3. Under **Upgrade** > **Automatic upgrade scheduler**, select **Edit schedule**.

    :::image type="content" source="./media/planned-maintenance/edit-schedule-portal.png" alt-text="Screenshot shows the Edit schedule option in the Azure portal.":::

4. On the **Edit maintenance schedule** page, update the maintenance window settings as needed.
5. Select **Save** > **Apply**.

### [JSON file](#tab/json-file)

1. Update the configuration JSON file with the new maintenance window settings.

    The following example updates the `default.json` from the [previous section](#add-a-maintenance-window-configuration) to schedule maintenance to run from 2:00am to 3:00am every Monday.

    ```json
    {
      "timeInWeek": [
        {
          "day": "Monday",
          "hour_slots": [
            2,
            3
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

2. Update the maintenance window configuration using the [`az aks maintenanceconfiguration update`][az-aks-maintenanceconfiguration-update] command with the `--config-file` parameter.

    ```azurecli-interactive
    az aks maintenanceconfiguration update --resource-group myResourceGroup --cluster-name myAKSCluster --name default --config-file ./default.json
    ```

---

## List all maintenance windows in an existing cluster

List the current maintenance configuration windows in your AKS cluster using the [`az aks maintenanceconfiguration list`][az-aks-maintenanceconfiguration-list] command.

```azurecli-interactive
az aks maintenanceconfiguration list --resource-group myResourceGroup --cluster-name myAKSCluster
```

## Show a specific maintenance configuration window in an existing cluster

View a specific maintenance configuration window in your AKS cluster using the [`az aks maintenanceconfiguration show`][az-aks-maintenanceconfiguration-show] command with the `--name` parameter.

```azurecli-interactive
az aks maintenanceconfiguration show --resource-group myResourceGroup --cluster-name myAKSCluster --name aksManagedAutoUpgradeSchedule
```

The following example output shows the maintenance window for *aksManagedAutoUpgradeSchedule*:

```output
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

## Delete a maintenance configuration window in an existing cluster

### [Azure CLI](#tab/azure-cli)

* Delete a maintenance configuration window in your AKS cluster using the [`az aks maintenanceconfiguration delete`][az-aks-maintenanceconfiguration-delete] command.

    The following example deletes the `autoUpgradeSchedule` maintenance configuration.

    ```azurecli-interactive
    az aks maintenanceconfiguration delete --resource-group myResourceGroup --cluster-name myAKSCluster --name autoUpgradeSchedule
    ```

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, navigate to your AKS cluster.
2. In the **Settings** section, select **Cluster configuration**.
3. Under **Upgrade** > **Automatic upgrade scheduler**, select **Edit schedule**.

    :::image type="content" source="./media/planned-maintenance/edit-schedule-portal.png" alt-text="Screenshot shows the Edit schedule option in the Azure portal.":::

4. On the **Edit maintenance schedule** page, select **Remove schedule**.

    :::image type="content" source="./media/planned-maintenance/remove-schedule-portal.png" alt-text="Screenshot shows the Edit maintenance window page with the Remove schedule option in the Azure portal.":::

### [JSON file](#tab/json-file)

* Delete a maintenance configuration window in your AKS cluster using the [`az aks maintenanceconfiguration delete`][az-aks-maintenanceconfiguration-delete] command.

    The following example deletes the `autoUpgradeSchedule` maintenance configuration.

    ```azurecli-interactive
    az aks maintenanceconfiguration delete --resource-group myResourceGroup --cluster-name myAKSCluster --name autoUpgradeSchedule
    ```

---

## FAQ

* How can I check the existing maintenance configurations in my cluster?

  Use the `az aks maintenanceconfiguration show` command.
  
* Can reactive, unplanned maintenance happen during the `notAllowedTime` or `notAllowedDates` periods too?

  Yes, AKS reserves the right to break these windows for unplanned, reactive maintenance operations that are urgent or critical.

* How can you tell if a maintenance event occurred?

  For releases, check your cluster's region and look up release information in [weekly releases][release-tracker] and validate if it matches your maintenance schedule or not. To view the status of your auto upgrades, look up [activity logs][monitor-aks] on your cluster. You may also look up specific upgrade related events as mentioned in [Upgrade an AKS cluster][aks-upgrade]. AKS also emits upgrade related Event Grid events. To learn more, see [AKS as an Event Grid source][aks-eventgrid].

* Can you use more than one maintenance configuration at the same time?

  Yes, you can run all three configurations i.e `default`, `aksManagedAutoUpgradeSchedule`, `aksManagedNodeOSUpgradeSchedule`simultaneously.  In case the windows overlap AKS decides the running order. 

* I configured a maintenance window, but upgrade didn't happen - why?

  AKS auto-upgrade needs a certain amount of time to take the maintenance window into consideration. We recommend at least 24 hours between the creation or update of a maintenance configuration the scheduled start time.

  Also, ensure your cluster is started when the planned maintenance window is starting. If the cluster is stopped, then its control plane is deallocated and no operations can be performed.

* AKS auto-upgrade didn't upgrade all my agent pools - or one of the pools was upgraded outside of the maintenance window?

  If an agent pool fails to upgrade (for example, because of Pod Disruption Budgets preventing it to upgrade) or is in a Failed state, then it might be upgraded later outside of the maintenance window. This scenario is called "catch-up upgrade" and avoids letting Agent pools with a different version than the AKS control plane.

* Are there any best practices for the maintenance configurations?

  We recommend setting the [Node OS security updates][node-image-auto-upgrade] schedule to a weekly cadence if you're using `NodeImage` channel since a new node image gets shipped every week and daily if you opt in for `SecurityPatch` channel to receive daily security updates. Set the [auto-upgrade][auto-upgrade] schedule to a monthly cadence to stay on top of the kubernetes N-2 [support policy][aks-support-policy]. For a detailed discussion of  upgrade best practices and other considerations, see [AKS patch and upgrade guidance][upgrade-operators-guide].

## Next steps

* To get started with upgrading your AKS cluster, see [Upgrade an AKS cluster][aks-upgrade]

<!-- LINKS - Internal -->
[plan-aks-design]: /azure/architecture/reference-architectures/containers/aks-start-here?toc=/azure/aks/toc.json&bc=/azure/aks/breadcrumb/toc.json
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
[upgrade-operators-guide]: /azure/architecture/operator-guides/aks/aks-upgrade-practices
[az-aks-maintenanceconfiguration-add]: /cli/azure/aks/maintenanceconfiguration#az_aks_maintenanceconfiguration_add
[az-aks-maintenanceconfiguration-update]: /cli/azure/aks/maintenanceconfiguration#az_aks_maintenanceconfiguration_update
[az-aks-maintenanceconfiguration-list]: /cli/azure/aks/maintenanceconfiguration#az_aks_maintenanceconfiguration_list
[az-aks-maintenanceconfiguration-show]: /cli/azure/aks/maintenanceconfiguration#az_aks_maintenanceconfiguration_show
[az-aks-maintenanceconfiguration-delete]: /cli/azure/aks/maintenanceconfiguration#az_aks_maintenanceconfiguration_delete
