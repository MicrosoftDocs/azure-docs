---
title: Use planned maintenance to schedule and control upgrades for your Azure Kubernetes Service (AKS) cluster 
titleSuffix: Azure Kubernetes Service
description: Learn how to use planned maintenance to schedule and control cluster and node image upgrades in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 01/29/2024
ms.author: nickoman
ms.subservice: aks-upgrade
author: nickomang
---

# Use planned maintenance to schedule and control upgrades for your Azure Kubernetes Service cluster

This article shows you how to use planned maintenance to schedule and control cluster and node image upgrades in Azure Kubernetes Service (AKS).

Regular maintenance is performed on your AKS cluster automatically. There are two types of maintenance operations:

* *AKS-initiated maintenance* involves the weekly releases that AKS performs to keep your cluster up to date with the latest features and fixes.
* *User-initiated maintenance* includes [cluster auto-upgrades][aks-upgrade] and [node operating system (OS) automatic security updates][node-image-auto-upgrade].

When you use the feature of planned maintenance in AKS, you can run both types of maintenance in a cadence of your choice to minimize workload impact. You can use planned maintenance to schedule the timing of automatic upgrades, but enabling or disabling planned maintenance won't enable or disable automatic upgrades.

## Before you begin

* This article assumes that you have an existing AKS cluster. If you don't have an AKS cluster, see [Create an AKS cluster](./learn/quick-kubernetes-deploy-cli.md).
* If you're using the Azure CLI, upgrade to the latest version by using the [`az upgrade`](/cli/azure/update-azure-cli#manual-update) command.

## Considerations

When you use planned maintenance, the following considerations apply:

* AKS reserves the right to break planned maintenance windows for unplanned, reactive maintenance operations that are urgent or critical. These maintenance operations might even run during the `notAllowedTime` or `notAllowedDates` periods defined in your configuration.
* Maintenance operations are considered *best effort only* and aren't guaranteed to occur within a specified window.

## Schedule configuration types for planned maintenance

Three schedule configuration types are available for planned maintenance:

* `default` is a basic configuration for controlling AKS releases. The releases can take up to two weeks to roll out to all regions from the initial time of shipping, because of Azure safe deployment practices.

  Choose `default` to schedule these updates in a manner that's least disruptive for you. You can monitor the status of an ongoing AKS release by region with the [weekly release tracker][release-tracker].  
* `aksManagedAutoUpgradeSchedule` controls when to perform cluster upgrades scheduled by your designated auto-upgrade channel. You can configure more finely controlled cadence and recurrence settings with this configuration compared to the `default` configuration. For more information on cluster auto-upgrade, see [Automatically upgrade an Azure Kubernetes Service cluster][aks-upgrade].
* `aksManagedNodeOSUpgradeSchedule` controls when to perform the node OS security patching scheduled by your node OS auto-upgrade channel. You can configure more finely controlled cadence and recurrence settings with this configuration compared to the `default` configuration. For more information on node OS auto-upgrade channels, see [Automatically patch and update AKS cluster node images][node-image-auto-upgrade].

We recommend using `aksManagedAutoUpgradeSchedule` for all cluster upgrade scenarios and `aksManagedNodeOSUpgradeSchedule` for all node OS security patching scenarios.

The `default` option is meant exclusively for AKS weekly releases. You can switch the `default` configuration to the `aksManagedAutoUpgradeSchedule` or `aksManagedNodeOSUpgradeSchedule` configuration by using the `az aks maintenanceconfiguration update` command.

## Create a maintenance window

> [!NOTE]
> When you're using auto-upgrade, to ensure proper functionality, use a maintenance window with a duration of four hours or more.

Planned maintenance windows are specified in Coordinated Universal Time (UTC).

A `default` maintenance window has the following properties:

|Name|Description|Default value|
|--|--|--|
|`timeInWeek`|In a `default` configuration, this property contains the `day` and `hourSlots` values that define a maintenance window.|Not applicable|
|`timeInWeek.day`|The day of the week to perform maintenance in a `default` configuration.|Not applicable|
|`timeInWeek.hourSlots`|A list of hour-long time slots to perform maintenance on a particular day in a `default` configuration.|Not applicable|
|`notAllowedTime`|A range of dates that maintenance can't run, determined by `start` and `end` child properties. This property is applicable only when you're creating the maintenance window by using a configuration file.|Not applicable|

An `aksManagedAutoUpgradeSchedule` or `aksManagedNodeOSUpgradeSchedule` maintenance window has the following properties:

|Name|Description|Default value|
|--|--|--|
|`utcOffset`|The time zone for cluster maintenance.|`+00:00`|
|`startDate`|The date on which the maintenance window begins to take effect.|The current date at creation time|
|`startTime`|The time for maintenance to begin, based on the time zone determined by `utcOffset`.|Not applicable|
|`schedule`|The upgrade frequency. Three types are available: `Weekly`, `AbsoluteMonthly`, and `RelativeMonthly`.|Not applicable|
|`intervalDays`|The interval in days for maintenance runs. It's applicable only to `aksManagedNodeOSUpgradeSchedule`.|Not applicable|
|`intervalWeeks`|The interval in weeks for maintenance runs.|Not applicable|
|`intervalMonths`|The interval in months for maintenance runs.|Not applicable|
|`dayOfWeek`|The specified day of the week for maintenance to begin.|Not applicable|
|`durationHours`|The duration of the window for maintenance to run.|Not applicable|
|`notAllowedDates`|A range of dates that maintenance can't run, determined by `start` and `end` child properties. It's applicable only when you're creating the maintenance window by using a configuration file.|Not applicable|

### Schedule types

Four available schedule types are available: `Daily`, `Weekly`, `AbsoluteMonthly`, and `RelativeMonthly`.

`Weekly`, `AbsoluteMonthly`, and `RelativeMonthly` schedule types are applicable only to `aksManagedClusterAutoUpgradeSchedule` and `aksManagedNodeOSUpgradeSchedule` configurations. `Daily` schedules are applicable only to `aksManagedNodeOSUpgradeSchedule` configurations.

All of the fields shown for each schedule type are required.

A `Daily` schedule might look like "every three days":

```json
"schedule": {
    "daily": {
        "intervalDays": 3
    }
}
```

A `Weekly` schedule might look like "every two weeks on Friday":

```json
"schedule": {
    "weekly": {
        "intervalWeeks": 2,
        "dayOfWeek": "Friday"
    }
}
```

An `AbsoluteMonthly` schedule might look like "every three months on the first day of the month":

```json
"schedule": {
    "absoluteMonthly": {
        "intervalMonths": 3,
        "dayOfMonth": 1
    }
}
```

A `RelativeMonthly` schedule might look like "every two months on the last Monday":

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

Add a maintenance window configuration to an AKS cluster by using the [`az aks maintenanceconfiguration add`][az-aks-maintenanceconfiguration-add] command.

The first example adds a new `default` configuration that schedules maintenance to run from 1:00 AM to 2:00 AM every Monday. The second example adds a new `aksManagedAutoUpgradeSchedule` configuration that schedules maintenance to run every third Friday between 12:00 AM and 8:00 AM in the `UTC+5:30` time zone.

```azurecli-interactive
# Add a new default configuration
az aks maintenanceconfiguration add --resource-group myResourceGroup --cluster-name myAKSCluster --name default --weekday Monday --start-hour 1

# Add a new aksManagedAutoUpgradeSchedule configuration
az aks maintenanceconfiguration add --resource-group myResourceGroup --cluster-name myAKSCluster --name aksManagedAutoUpgradeSchedule --schedule-type Weekly --day-of-week Friday --interval-weeks 3 --duration 8 --utc-offset +05:30 --start-time 00:00
```

> [!NOTE]
> When you're using a `default` configuration type, you can omit the `--start-time` parameter to allow maintenance anytime during a day.

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your AKS cluster.
2. In the **Settings** section, select **Cluster configuration**.
3. Under **Upgrade** > **Automatic upgrade scheduler**, select **Add schedule**.

    :::image type="content" source="./media/planned-maintenance/add-schedule-portal.png" alt-text="Screenshot that shows the option to add a schedule in the Azure portal.":::

4. On the **Add maintenance schedule** pane, configure the following maintenance window settings:

    * **Repeats**: Select the frequency for the maintenance window. We recommend selecting **Weekly**.
    * **Frequency**: Select the day of the week for the maintenance window. We recommend selecting **Sunday**.
    * **Maintenance start date**: Select the start date for the maintenance window.
    * **Maintenance start time**: Select the start time for the maintenance window.
    * **UTC offset**: Select the UTC offset for the maintenance window. The default is **+00:00**.

    :::image type="content" source="./media/planned-maintenance/add-maintenance-schedule-portal.png" alt-text="Screenshot that shows the pane for adding a maintenance schedule in the Azure portal.":::

5. Select **Save** > **Apply**.

### [JSON file](#tab/json-file)

You can use a JSON file to create a maintenance configuration instead of using parameters. When you use this method, you can prevent maintenance during a range of dates by specifying `notAllowedTimes` for `default` configurations and `notAllowedDates` for `aksManagedAutoUpgradeSchedule` configurations.

1. Create a JSON file with the maintenance window settings.

    The following example creates a `default.json` file that schedules maintenance to run from 1:00 AM to 3:00 AM every Tuesday and Wednesday in the `UTC` time zone. There's also an exception from `2021-05-26T03:00:00Z` to `2021-05-30T12:00:00Z` where maintenance isn't allowed, even if it overlaps with a maintenance window.

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

    The following example creates an `autoUpgradeWindow.json` file that schedules maintenance to run every three months on the first of the month between 9:00 AM and 1:00 PM in the `UTC-08` time zone. There's also an exception from `2023-12-23` to `2024-01-05` where maintenance isn't allowed, even if it overlaps with a maintenance window.

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

2. Add the maintenance window configuration by using the [`az aks maintenanceconfiguration add`][az-aks-maintenanceconfiguration-add] command with the `--config-file` parameter.

    The first example adds a new `default` configuration by using the `default.json` file. The second example adds a new `aksManagedAutoUpgradeSchedule` configuration by using the `autoUpgradeWindow.json` file.

    ```azurecli-interactive
    # Add a new default configuration
    az aks maintenanceconfiguration add -g myResourceGroup --cluster-name myAKSCluster --name default --config-file ./default.json

    # Add a new aksManagedAutoUpgradeSchedule configuration
    az aks maintenanceconfiguration add -g myResourceGroup --cluster-name myAKSCluster --name aksManagedAutoUpgradeSchedule --config-file ./autoUpgradeWindow.json
    ```

---

## Update an existing maintenance window

### [Azure CLI](#tab/azure-cli)

Update an existing maintenance configuration by using the [`az aks maintenanceconfiguration update`][az-aks-maintenanceconfiguration-update] command.

The following example updates the `default` configuration to schedule maintenance to run from 2:00 AM to 3:00 AM every Monday:

```azurecli-interactive
az aks maintenanceconfiguration update --resource-group myResourceGroup --cluster-name myAKSCluster --name default --weekday Monday --start-hour 2
```

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your AKS cluster.
2. In the **Settings** section, select **Cluster configuration**.
3. Under **Upgrade** > **Automatic upgrade scheduler**, select **Edit schedule**.

    :::image type="content" source="./media/planned-maintenance/edit-schedule-portal.png" alt-text="Screenshot that shows the option for editing a schedule in the Azure portal.":::

4. On the **Edit maintenance schedule** pane, update the maintenance window settings as needed.
5. Select **Save** > **Apply**.

### [JSON file](#tab/json-file)

1. Update the configuration JSON file with the new maintenance window settings.

    The following example updates the `default.json` file from the [previous section](#add-a-maintenance-window-configuration) to schedule maintenance to run from 2:00 AM to 3:00 AM every Monday:

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

2. Update the maintenance window configuration by using the [`az aks maintenanceconfiguration update`][az-aks-maintenanceconfiguration-update] command with the `--config-file` parameter:

    ```azurecli-interactive
    az aks maintenanceconfiguration update --resource-group myResourceGroup --cluster-name myAKSCluster --name default --config-file ./default.json
    ```

---

## List all maintenance windows in an existing cluster

List the current maintenance configuration windows in your AKS cluster by using the [`az aks maintenanceconfiguration list`][az-aks-maintenanceconfiguration-list] command:

```azurecli-interactive
az aks maintenanceconfiguration list --resource-group myResourceGroup --cluster-name myAKSCluster
```

## Show a specific maintenance configuration window in an existing cluster

View a specific maintenance configuration window in your AKS cluster by using the [`az aks maintenanceconfiguration show`][az-aks-maintenanceconfiguration-show] command with the `--name` parameter:

```azurecli-interactive
az aks maintenanceconfiguration show --resource-group myResourceGroup --cluster-name myAKSCluster --name aksManagedAutoUpgradeSchedule
```

The following example output shows the maintenance window for `aksManagedAutoUpgradeSchedule`:

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

Delete a maintenance configuration window in your AKS cluster by using the [`az aks maintenanceconfiguration delete`][az-aks-maintenanceconfiguration-delete] command.

The following example deletes the `autoUpgradeSchedule` maintenance configuration:

```azurecli-interactive
az aks maintenanceconfiguration delete --resource-group myResourceGroup --cluster-name myAKSCluster --name autoUpgradeSchedule
```

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your AKS cluster.
2. In the **Settings** section, select **Cluster configuration**.
3. Under **Upgrade** > **Automatic upgrade scheduler**, select **Edit schedule**.

    :::image type="content" source="./media/planned-maintenance/edit-schedule-portal.png" alt-text="Screenshot that shows the option for editing a schedule in the Azure portal.":::

4. On the **Edit maintenance schedule** pane, select **Remove schedule**.

    :::image type="content" source="./media/planned-maintenance/remove-schedule-portal.png" alt-text="Screenshot that shows the pane for editing a maintenance window with the button for removing a schedule in the Azure portal.":::

### [JSON file](#tab/json-file)

Delete a maintenance configuration window in your AKS cluster by using the [`az aks maintenanceconfiguration delete`][az-aks-maintenanceconfiguration-delete] command.

The following example deletes the `autoUpgradeSchedule` maintenance configuration:

```azurecli-interactive
az aks maintenanceconfiguration delete --resource-group myResourceGroup --cluster-name myAKSCluster --name autoUpgradeSchedule
```

---

## FAQ

* How can I check the existing maintenance configurations in my cluster?

  Use the `az aks maintenanceconfiguration show` command.
  
* Can reactive, unplanned maintenance happen during the `notAllowedTime` or `notAllowedDates` periods too?

  Yes. AKS reserves the right to break these windows for unplanned, reactive maintenance operations that are urgent or critical.

* How can I tell if a maintenance event occurred?

  For releases, check your cluster's region and look up information in [weekly releases][release-tracker] to see if it matches your maintenance schedule. To view the status of your automatic upgrades, look up [activity logs][monitor-aks] on your cluster. You can also look up specific upgrade-related events, as mentioned in [Upgrade an AKS cluster][aks-upgrade].
  
  AKS also emits upgrade-related Azure Event Grid events. To learn more, see [AKS as an Event Grid source][aks-eventgrid].

* Can I use more than one maintenance configuration at the same time?

  Yes, you can run all three configurations simultaneously: `default`, `aksManagedAutoUpgradeSchedule`, and `aksManagedNodeOSUpgradeSchedule`. If the windows overlap, AKS decides the running order.

* I configured a maintenance window, but the upgrade didn't happen. Why?

  AKS auto-upgrade needs a certain amount of time to take the maintenance window into consideration. We recommend at least 24 hours between the creation or update of a maintenance configuration and the scheduled start time.

  Also, ensure that your cluster is started when the planned maintenance window starts. If the cluster is stopped, its control plane is deallocated and no operations can be performed.

* Why was one of my agent pools upgraded outside the maintenance window?

  If an agent pool isn't upgraded (for example, because pod disruption budgets prevented it), it might be upgraded later, outside the maintenance window. This scenario is called a "catch-up upgrade." It avoids letting agent pools be upgraded with a different version from the AKS control plane.

* Are there any best practices for the maintenance configurations?

  We recommend setting the [node OS security updates][node-image-auto-upgrade] schedule to a weekly cadence if you're using the `NodeImage` channel, because a new node image is shipped every week. You can also opt in for the `SecurityPatch` channel to receive daily security updates.
  
  Set the [auto-upgrade][auto-upgrade] schedule to a monthly cadence to stay current with the Kubernetes N-2 [support policy][aks-support-policy].
  
  For a detailed discussion of upgrade best practices and other considerations, see [AKS patch and upgrade guidance][upgrade-operators-guide].

## Next steps

* To get started with upgrading your AKS cluster, see [Upgrade options for AKS clusters][aks-upgrade].

<!-- LINKS - Internal -->
[aks-upgrade]: upgrade-cluster.md
[release-tracker]: release-tracker.md
[auto-upgrade]: auto-upgrade-cluster.md
[node-image-auto-upgrade]: auto-upgrade-node-image.md
[monitor-aks]: monitor-aks-reference.md
[aks-eventgrid]:quickstart-event-grid.md
[aks-support-policy]:support-policies.md
[upgrade-operators-guide]: /azure/architecture/operator-guides/aks/aks-upgrade-practices
[az-aks-maintenanceconfiguration-add]: /cli/azure/aks/maintenanceconfiguration#az_aks_maintenanceconfiguration_add
[az-aks-maintenanceconfiguration-update]: /cli/azure/aks/maintenanceconfiguration#az_aks_maintenanceconfiguration_update
[az-aks-maintenanceconfiguration-list]: /cli/azure/aks/maintenanceconfiguration#az_aks_maintenanceconfiguration_list
[az-aks-maintenanceconfiguration-show]: /cli/azure/aks/maintenanceconfiguration#az_aks_maintenanceconfiguration_show
[az-aks-maintenanceconfiguration-delete]: /cli/azure/aks/maintenanceconfiguration#az_aks_maintenanceconfiguration_delete
